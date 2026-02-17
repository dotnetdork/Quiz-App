/**
 * OutputPrediction Component
 * 
 * Shows code and asks users to predict its output.
 * Users select from multiple choice options showing different outputs.
 */
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * @param {Object} props
 * @param {string} props.code - Code snippet to display
 * @param {Array} props.options - List of possible output strings
 * @param {string} props.selectedAnswer - Currently selected answer
 * @param {Function} props.onSelect - Callback when an option is selected
 */
function OutputPrediction({ code, options, selectedAnswer, onSelect }) {
  const letters = 'ABCDEFGHIJ';

  return (
    <div className="output-prediction">
      {/* Code block display with syntax highlighting */}
      <div className="code-display" style={{ 
        backgroundColor: 'var(--color-background-alt, #f5f5f5)',
        borderRadius: '8px',
        marginBottom: '1rem',
        overflow: 'auto'
      }}>
        <SyntaxHighlighter
          language="python"
          style={tomorrow}
          customStyle={{
            margin: 0,
            padding: '1rem',
            borderRadius: '8px',
            fontSize: 'var(--font-base)',
          }}
          codeTagProps={{
            style: {
              fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
            }
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>

      {/* Instructions */}
      <p className="text-secondary mb-sm" style={{ fontSize: 'var(--font-small)' }}>
        What will be the output of this code?
      </p>

      {/* Output options */}
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
            <code style={{ whiteSpace: 'pre-wrap' }}>{option}</code>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OutputPrediction;
