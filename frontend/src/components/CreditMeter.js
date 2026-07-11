/**
 * CreditMeter Component
 *
 * Shows a student's remaining AI credit budget for a single quest, read
 * live from GET /api/ai/credits (see backend/ai_routes.py's
 * get_remaining_budget -- always a fresh SUM(tokens_spent) computation,
 * never a cached balance, so this component follows the same rule and
 * re-fetches rather than trusting a prop it was handed once).
 *
 * Pass a changing `refreshSignal` value (e.g. a counter bumped after every
 * tutor-chat/grade-response call) to force a re-fetch after a spend.
 */
import { useState, useEffect, useCallback } from 'react';
import { apiCall } from '../api';

function CreditMeter({ questId, refreshSignal }) {
  const [credits, setCredits] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await apiCall(`/api/ai/credits?quest_id=${encodeURIComponent(questId)}`);
      setCredits(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, [questId]);

  useEffect(() => {
    if (questId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questId, refreshSignal]);

  if (!questId) return null;

  if (error) {
    return <div className="credit-meter credit-meter-error">Credit balance unavailable right now.</div>;
  }

  if (!credits) {
    return <div className="credit-meter credit-meter-loading">Loading AI credits...</div>;
  }

  const { budget, remaining } = credits;
  const clampedRemaining = Math.max(0, remaining);
  const percent = budget > 0 ? Math.min(100, Math.max(0, (remaining / budget) * 100)) : 0;
  const isExhausted = remaining <= 0;
  const isLow = !isExhausted && budget > 0 && remaining / budget <= 0.2;

  if (budget === 0) {
    // credit_budget 0 means this quest type never calls the AI at all
    // (e.g. reflection_journal) -- nothing useful to show.
    return null;
  }

  return (
    <div className="credit-meter">
      <div className="credit-meter-label">
        <span>🪙 AI Credits</span>
        <span>{clampedRemaining} / {budget}</span>
      </div>
      <div className="credit-meter-bar">
        <div
          className={`credit-meter-fill ${isExhausted ? 'exhausted' : isLow ? 'low' : ''}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {isExhausted && (
        <p className="credit-meter-note">
          You're out of AI credits for this quest -- finish it on your own from here.
        </p>
      )}
      {isLow && (
        <p className="credit-meter-note">Running low -- make your remaining questions count.</p>
      )}
    </div>
  );
}

export default CreditMeter;
