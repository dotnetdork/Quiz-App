/**
 * Rank Utility Functions
 * 
 * Shared utilities for displaying leaderboard ranks with emojis and styling.
 */

/**
 * Get emoji for a given rank position
 * @param {number} rank - The rank position (1, 2, 3, etc.)
 * @returns {string|number} - Emoji for top 3 ranks, or the rank number
 */
export function getRankEmoji(rank) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return rank;
}

/**
 * Get CSS class name for a given rank
 * @param {number} rank - The rank position
 * @returns {string} - CSS class name ('rank-1', 'rank-2', 'rank-3', or '')
 */
export function getRankClass(rank) {
  if (rank <= 3) {
    return `rank-${rank}`;
  }
  return '';
}

/**
 * Get badge component for rank display
 * @param {number} rank - The rank position
 * @returns {JSX.Element} - React element with rank badge styling
 */
export function getRankBadge(rank) {
  const emoji = getRankEmoji(rank);
  const className = `rank-badge ${getRankClass(rank)}`;
  return { emoji, className };
}

/**
 * Calculate total points from scores array
 * @param {Array} scores - Array of score objects with 'score' property
 * @returns {number} - Total points
 */
export function calculateTotalPoints(scores) {
  return scores.reduce((sum, score) => sum + score.score, 0);
}
