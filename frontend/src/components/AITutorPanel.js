/**
 * AITutorPanel Component
 *
 * Chat widget for ai_chat_challenge quests (see
 * backend/courses/build-real-stuff/pressure_test_target_customer.yaml and
 * the ai-tutor-endpoints skill). Talks to POST /api/ai/tutor-chat for the
 * back-and-forth, and POST /api/ai/grade-response to check the transcript
 * against the quest's rubric once the student is ready.
 *
 * Deliberately does NOT auto-grade after every message -- grading spends a
 * credit too (see ai_routes.grade_response), so it's a student-initiated
 * action ("Submit for grading"), not something that fires silently.
 */
import { useState } from 'react';
import { apiCall } from '../api';
import CreditMeter from './CreditMeter';

function AITutorPanel({ questId, onGraded }) {
  const [messages, setMessages] = useState([]); // [{role: 'user'|'assistant', content}]
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [tutorError, setTutorError] = useState(null);
  const [creditsExhausted, setCreditsExhausted] = useState(false);

  const [grading, setGrading] = useState(false);
  const [gradeError, setGradeError] = useState(null);
  const [gradeResult, setGradeResult] = useState(null);

  const [creditRefreshSignal, setCreditRefreshSignal] = useState(0);

  async function handleSend(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || sending || creditsExhausted) return;

    const userMessage = { role: 'user', content: trimmed };
    const historyForRequest = messages;

    setSending(true);
    setTutorError(null);

    try {
      const data = await apiCall('/api/ai/tutor-chat', {
        method: 'POST',
        body: JSON.stringify({
          quest_id: questId,
          message: trimmed,
          conversation_history: historyForRequest,
        }),
      });
      setMessages((prev) => [...prev, userMessage, { role: 'assistant', content: data.reply }]);
      setInput('');
    } catch (err) {
      // err.detail comes from api.js's enriched Error -- see that file's
      // comment on why object-shaped `detail` needs special handling.
      if (err.detail?.error === 'credits_exhausted') {
        setCreditsExhausted(true);
        setTutorError("You're out of AI credits for this quest. Finish it on your own, then submit your conversation below.");
      } else if (err.detail?.error === 'rate_limited') {
        setTutorError('Too many requests -- wait a few seconds and try again.');
      } else {
        setTutorError(err.message || 'The AI tutor is having trouble right now. Try again in a moment.');
      }
    } finally {
      setSending(false);
      setCreditRefreshSignal((s) => s + 1);
    }
  }

  async function handleSubmitForGrading() {
    if (messages.length === 0 || grading) return;

    setGrading(true);
    setGradeError(null);

    // Rubric criteria reference both what the student said and what the
    // tutor said back (see pressure_test_target_customer.yaml's rubric),
    // so the whole transcript is graded, not just the student's last line.
    const transcript = messages
      .map((m) => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`)
      .join('\n\n');

    try {
      const data = await apiCall('/api/ai/grade-response', {
        method: 'POST',
        body: JSON.stringify({ quest_id: questId, submission: transcript }),
      });
      setGradeResult(data);
      if (onGraded) onGraded(data.all_passed, data.results);
    } catch (err) {
      if (err.detail?.error === 'credits_exhausted') {
        setCreditsExhausted(true);
        setGradeError("You're out of AI credits -- grading spends one too. Ask your instructor if you're stuck.");
      } else if (err.detail?.error === 'no_rubric') {
        setGradeError('This quest has no rubric to grade against.');
      } else {
        setGradeError(err.message || 'Grading failed. Try again in a moment.');
      }
    } finally {
      setGrading(false);
      setCreditRefreshSignal((s) => s + 1);
    }
  }

  return (
    <div className="ai-tutor-panel card">
      <CreditMeter questId={questId} refreshSignal={creditRefreshSignal} />

      <div className="ai-tutor-messages">
        {messages.length === 0 && (
          <p className="text-secondary ai-tutor-empty">
            Start the conversation below -- ask the tutor something specific rather than pasting your whole document.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`ai-tutor-row ai-tutor-row-${m.role}`}>
            <span className="ai-tutor-avatar">{m.role === 'user' ? '🧑‍💻' : '🤖'}</span>
            <div className={`ai-tutor-bubble ai-tutor-bubble-${m.role}`}>
              <span className="ai-tutor-bubble-role">{m.role === 'user' ? 'You' : 'Tutor'}</span>
              <p>{m.content}</p>
            </div>
          </div>
        ))}
        {sending && (
          <div className="ai-tutor-row ai-tutor-row-assistant">
            <span className="ai-tutor-avatar">🤖</span>
            <div className="ai-tutor-bubble ai-tutor-bubble-assistant ai-tutor-bubble-pending">
              <span className="ai-tutor-bubble-role">Tutor</span>
              <p>Thinking...</p>
            </div>
          </div>
        )}
      </div>

      {tutorError && <div className="error-message" role="alert"><p>{tutorError}</p></div>}

      <form className="ai-tutor-input-row" onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={creditsExhausted ? 'Out of AI credits for this quest' : 'Ask the tutor a specific question...'}
          disabled={sending || creditsExhausted}
        />
        <button type="submit" className="btn-primary" disabled={sending || creditsExhausted || !input.trim()}>
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>

      <div className="ai-tutor-grading-row">
        <button
          type="button"
          className="btn-secondary"
          onClick={handleSubmitForGrading}
          disabled={messages.length === 0 || grading}
        >
          {grading ? 'Grading...' : 'Submit conversation for grading'}
        </button>
      </div>

      {gradeError && <div className="error-message" role="alert"><p>{gradeError}</p></div>}

      {gradeResult && (
        <div className={`ai-tutor-grade-results ${gradeResult.all_passed ? 'all-passed' : ''}`}>
          <h4>{gradeResult.all_passed ? '✓ All criteria met!' : 'Not quite there yet'}</h4>
          <ul>
            {gradeResult.results.map((r, i) => (
              <li key={i} className={r.passed ? 'text-success' : 'text-error'}>
                <strong>{r.passed ? '✓' : '✗'} {r.text}</strong>
                <p>{r.evidence}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AITutorPanel;
