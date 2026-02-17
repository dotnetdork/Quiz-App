/**
 * DebuggingQuestion Component
 * 
 * Shows buggy code and asks users to identify the bug or correct line.
 * Users select from multiple choice options.
 */
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * @param {Object} props
 * @param {string} props.code - Buggy code snippet to display
 * @param {Array} props.options - List of possible fixes or bug descriptions
 * @param {string} props.selectedAnswer - Currently selected answer
 * @param {Function} props.onSelect - Callback when an option is selected
 */
function DebuggingQuestion({ code, options, selectedAnswer, onSelect }) {
  const letters = 'ABCDEFGHIJ';

  return (
    <div className="debugging-question">
      {/* Code block display with bug and syntax highlighting */}
      <div className="code-display" style={{ 
        backgroundColor: 'var(--color-background-alt, #f5f5f5)',
        borderRadius: '8px',
        marginBottom: '1rem',
        overflow: 'auto',
        borderLeft: '4px solid var(--color-error, #f44336)'
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
        What is the bug in this code, or how should it be fixed?
      </p>

      {/* Fix options */}
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
            <span>{option}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DebuggingQuestion;
