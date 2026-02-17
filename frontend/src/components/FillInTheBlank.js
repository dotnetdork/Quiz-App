/**
 * FillInTheBlank Component
 * 
 * Shows code with blanks (___) and asks users to fill them in.
 * Users select from multiple choice options for each blank.
 */

/**
 * @param {Object} props
 * @param {string} props.code - Code with blanks marked as ___
 * @param {Array} props.options - List of possible fill-in values
 * @param {string} props.selectedAnswer - Currently selected answer
 * @param {Function} props.onSelect - Callback when an option is selected
 */
function FillInTheBlank({ code, options, selectedAnswer, onSelect }) {
  const letters = 'ABCDEFGHIJ';

  return (
    <div className="fill-in-blank">
      {/* Code block with blanks */}
      <div className="code-display" style={{ 
        backgroundColor: 'var(--color-background-alt, #f5f5f5)',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1rem',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        overflow: 'auto'
      }}>
        <code>{code}</code>
      </div>

      {/* Instructions */}
      <p className="text-secondary mb-sm" style={{ fontSize: 'var(--font-small)' }}>
        What should replace the blank(s) in the code?
      </p>

      {/* Fill-in options */}
      <ul className="options-list">
        {options.map((option, index) => (
          <li
            key={index}
            className={`option ${selectedAnswer === option ? 'selected' : ''}`}
            onClick={() => onSelect(option)}
            tabIndex={0}
            role="button"
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelect(option);
              }
            }}
          >
            <span className="option-letter">
              {letters[index]}
            </span>
            <code>{option}</code>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FillInTheBlank;
