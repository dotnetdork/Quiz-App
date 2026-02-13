/**
 * MultipleChoice Component
 * 
 * Renders a list of options for multiple choice questions.
 * Highlights the selected answer.
 */

/**
 * @param {Object} props
 * @param {Array} props.options - List of option strings
 * @param {string} props.selectedAnswer - Currently selected answer
 * @param {Function} props.onSelect - Callback when an option is selected
 */
function MultipleChoice({ options, selectedAnswer, onSelect }) {
  // Letters for option labels (A, B, C, D, etc.)
  const letters = 'ABCDEFGHIJ';

  return (
    <ul className="options-list">
      {options.map((option, index) => (
        <li
          key={index}
          className={`option ${selectedAnswer === option ? 'selected' : ''}`}
          onClick={() => onSelect(option)}
          // Keyboard accessibility
          tabIndex={0}
          role="button"
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onSelect(option);
            }
          }}
        >
          {/* Option letter badge */}
          <span className="option-letter">
            {letters[index]}
          </span>
          
          {/* Option text */}
          <span>{option}</span>
        </li>
      ))}
    </ul>
  );
}

export default MultipleChoice;
