/**
 * QuestDetail Page
 *
 * Renders a single "Build Real Stuff" quest, branching on quest.type
 * (see .claude/skills/course-quest-authoring/SKILL.md for the schema):
 *   - reflection_journal: a plain textarea with a minimum word count,
 *     no AI involved (credit_budget 0).
 *   - ai_chat_challenge: the AITutorPanel chat widget plus rubric grading.
 *   - anything else: a "not supported yet" message rather than a crash --
 *     new quest types will be authored faster than the frontend catches up.
 *
 * This is a dedicated page rather than an extension of Quiz.js's
 * question.type chain (an earlier plan called for extending Quiz.js) --
 * quests are a different data model entirely (quest completion + XP/streak
 * vs. multiple-choice scoring), so bolting them onto Quiz.js would mean
 * fighting that component's assumptions (quiz.questions, answers keyed by
 * question id, a single submit-everything-at-once flow) rather than reusing
 * anything real from it.
 */
import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiCall } from '../api';
import AnimatedBackground from '../components/AnimatedBackground';
import AITutorPanel from '../components/AITutorPanel';
import { getQuestIcon, getQuestColor } from '../components/QuestIcons';

// Loosely themes the animated background to the quest type -- reflection
// quests get a calmer theme, AI chat challenges get the more electric one.
// Purely a visual touch, no functional meaning.
const QUEST_TYPE_BG_THEMES = {
  reflection_journal: 'ocean',
  ai_chat_challenge: 'neural',
  spec_sprint: 'blocks',
};

function wordCount(text) {
  return text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
}

function ReflectionJournalQuest({ courseSlug, quest, onCompleted }) {
  const draftKey = `reflection-draft:${quest.id}`;
  const [text, setText] = useState(() => {
    try {
      return window.localStorage.getItem(draftKey) || '';
    } catch {
      return '';
    }
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const minWords = quest.min_length_words || 0;
  const words = wordCount(text);
  const meetsMinimum = words >= minWords;

  function handleChange(e) {
    const value = e.target.value;
    setText(value);
    try {
      window.localStorage.setItem(draftKey, value);
    } catch {
      // localStorage unavailable (private browsing, etc.) -- not fatal,
      // the student's typed text is still in state either way.
    }
  }

  async function handleSubmit() {
    if (!meetsMinimum || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await apiCall(
        `/api/courses/${courseSlug}/quests/${quest.id}/complete`,
        { method: 'POST', body: JSON.stringify({}) }
      );
      try {
        window.localStorage.removeItem(draftKey);
      } catch {
        // ignore
      }
      onCompleted(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card">
      <textarea
        rows={8}
        value={text}
        onChange={handleChange}
        placeholder="Write your reflection here..."
        style={{ width: '100%' }}
      />
      <div className="word-count-bar mt-sm">
        <div className="word-count-bar-track">
          <div
            className={`word-count-bar-fill ${meetsMinimum ? 'met' : ''}`}
            style={{ width: `${Math.min(100, (words / Math.max(1, minWords)) * 100)}%` }}
          />
        </div>
        <span className={`text-secondary ${!meetsMinimum ? 'text-error' : 'text-success'}`}>
          {words} / {minWords} words
        </span>
      </div>
      {error && <div className="error-message" role="alert"><p>{error}</p></div>}
      <button className="btn-primary mt-sm" onClick={handleSubmit} disabled={!meetsMinimum || submitting}>
        {submitting ? 'Submitting...' : 'Submit reflection'}
      </button>
    </div>
  );
}

function AIChatChallengeQuest({ courseSlug, quest, onCompleted }) {
  const [lastGrade, setLastGrade] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState(null);

  async function handleMarkComplete() {
    if (completing) return;
    setCompleting(true);
    setError(null);
    try {
      const result = await apiCall(
        `/api/courses/${courseSlug}/quests/${quest.id}/complete`,
        { method: 'POST', body: JSON.stringify({}) }
      );
      onCompleted(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setCompleting(false);
    }
  }

  return (
    <div>
      {quest.target_outcome && (
        <div className="card">
          <h4>What "done" looks like</h4>
          <p className="text-secondary">{quest.target_outcome}</p>
        </div>
      )}

      <AITutorPanel questId={quest.id} onGraded={(allPassed, results) => setLastGrade({ allPassed, results })} />

      <div className="card mt-md">
        {lastGrade && !lastGrade.allPassed && (
          <p className="text-secondary">
            Not every rubric criterion passed yet -- you can keep chatting with the tutor, or mark this complete
            now and move on if you're out of credits or ready to finish on your own.
          </p>
        )}
        {lastGrade && lastGrade.allPassed && (
          <p className="text-success">All rubric criteria passed -- nice work.</p>
        )}
        {error && <div className="error-message" role="alert"><p>{error}</p></div>}
        <button className="btn-primary" onClick={handleMarkComplete} disabled={completing}>
          {completing ? 'Marking complete...' : 'Mark quest complete'}
        </button>
      </div>
    </div>
  );
}

function QuestDetail() {
  const { courseSlug, questId } = useParams();
  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completion, setCompletion] = useState(null);
  const [showHeroAnimation, setShowHeroAnimation] = useState(false);

  const loadQuest = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiCall(`/api/courses/${courseSlug}/quests/${questId}`);
      setQuest(data);
      setError(null);
      setShowHeroAnimation(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [courseSlug, questId]);

  useEffect(() => {
    loadQuest();
  }, [loadQuest]);

  if (loading) {
    return (
      <div className="quest-page" style={{ position: 'relative', minHeight: '100vh' }}>
        <AnimatedBackground theme="default" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <p>Loading quest...</p>
        </div>
      </div>
    );
  }

  if (error || !quest) {
    return (
      <div className="quest-page" style={{ position: 'relative', minHeight: '100vh' }}>
        <AnimatedBackground theme="default" />
        <div className="container error-message" style={{ position: 'relative', zIndex: 1 }}>
          <p>Error: {error || 'Quest not found'}</p>
          <Link to={`/course/${courseSlug}`} className="btn-secondary mt-md">Back to Course Map</Link>
        </div>
      </div>
    );
  }

  const Icon = getQuestIcon(quest.type);
  const questColor = getQuestColor(quest.type);
  const bgTheme = QUEST_TYPE_BG_THEMES[quest.type] || 'default';

  return (
    <div className="quest-page" style={{ position: 'relative', minHeight: '100vh' }}>
      <AnimatedBackground theme={bgTheme} />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className={`user-profile-card ${showHeroAnimation ? 'loaded' : ''}`} style={{ '--category-color': questColor }}>
          <div className="profile-header">
            <div className="profile-avatar-wrapper">
              <div className="quest-hero-icon" style={{ borderColor: questColor }}>
                <Icon size={48} />
              </div>
              <div className="avatar-ring" style={{ borderTopColor: questColor }}></div>
            </div>
            <div className="profile-info">
              <h1 style={{ marginBottom: '0.25rem', textTransform: 'capitalize' }}>{quest.id.replace(/_/g, ' ')}</h1>
              <div className="role-badge" style={{ borderColor: questColor, color: questColor }}>{quest.stage}</div>
            </div>
          </div>
          <p>{quest.prompt}</p>
        </div>

        {completion ? (
          <div className="card text-center">
            <h2>Quest complete!</h2>
            <p>XP: {completion.xp} &nbsp;|&nbsp; Streak: {completion.streak_count}</p>
            <Link to={`/course/${courseSlug}`} className="btn-primary mt-md" style={{ display: 'inline-block' }}>
              Back to Course Map
            </Link>
          </div>
        ) : quest.type === 'reflection_journal' ? (
          <ReflectionJournalQuest courseSlug={courseSlug} quest={quest} onCompleted={setCompletion} />
        ) : quest.type === 'ai_chat_challenge' ? (
          <AIChatChallengeQuest courseSlug={courseSlug} quest={quest} onCompleted={setCompletion} />
        ) : (
          <div className="card">
            <p>This quest type ({quest.type}) isn't supported in the app yet -- ask your instructor.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuestDetail;
