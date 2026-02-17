/**
 * FreeResponse Component
 * 
 * Shows a question where users must type their answer.
 * Supports both exact match and case-insensitive matching.
 */

/**
 * @param {Object} props
 * @param {string} props.selectedAnswer - Currently typed answer
 * @param {Function} props.onAnswer - Callback when answer changes
 * @param {string} props.placeholder - Optional placeholder text
 */
function FreeResponse({ selectedAnswer, onAnswer, placeholder = "Type your answer here..." }) {
  return (
    <div className="free-response">
      {/* Instructions */}
      <p className="text-secondary mb-sm" style={{ fontSize: 'var(--font-small)' }}>
        Type your answer below:
      </p>

      {/* Text input */}
      <input
        type="text"
        className="free-response-input"
        style={{
          width: '100%',
          padding: '0.75rem',
          fontSize: '1rem',
          fontFamily: 'monospace',
          border: '2px solid var(--color-border, #ddd)',
          borderRadius: '8px',
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        value={selectedAnswer || ''}
        onChange={(e) => onAnswer(e.target.value)}
        placeholder={placeholder}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--color-primary, #007bff)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--color-border, #ddd)';
        }}
      />
    </div>
  );
}

export default FreeResponse;
