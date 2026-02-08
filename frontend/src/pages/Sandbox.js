/**
 * Sandbox Page Component
 * 
 * An interactive code editor similar to W3Schools Tryit Editor.
 * Users can write and run Python or Java code, and try coding challenges.
 * Code is not saved - it's purely for practice and experimentation.
 */
import { useState, useCallback } from 'react';
import './Sandbox.css';

/**
 * Coding challenges for the sandbox
 */
const CHALLENGES = {
  python: [
    {
      id: 'py-hello',
      title: 'Hello World',
      description: 'Modify the code to print "Hello, World!" instead of "Hello".',
      boilerplate: `# Print a greeting message
print("Hello")`,
      hint: 'Change the string inside print() to include ", World!"'
    },
    {
      id: 'py-sum',
      title: 'Sum Two Numbers',
      description: 'Complete the function to return the sum of two numbers.',
      boilerplate: `def add_numbers(a, b):
    # TODO: Return the sum of a and b
    pass

# Test your function
result = add_numbers(5, 3)
print(f"5 + 3 = {result}")`,
      hint: 'Use the + operator and return statement'
    },
    {
      id: 'py-list',
      title: 'List Operations',
      description: 'Add three fruits to the list and print the total count.',
      boilerplate: `fruits = []

# TODO: Add "apple", "banana", and "orange" to the fruits list

# Print results
print(f"Fruits: {fruits}")
print(f"Total count: {len(fruits)}")`,
      hint: 'Use fruits.append() for each fruit'
    },
    {
      id: 'py-loop',
      title: 'Loop Practice',
      description: 'Use a for loop to print numbers 1 through 5.',
      boilerplate: `# TODO: Use a for loop to print numbers 1 to 5
# Expected output:
# 1
# 2
# 3
# 4
# 5`,
      hint: 'Use for i in range(1, 6): and print(i)'
    },
    {
      id: 'py-fizzbuzz',
      title: 'FizzBuzz',
      description: 'Complete the FizzBuzz program: print "Fizz" for multiples of 3, "Buzz" for multiples of 5, "FizzBuzz" for both.',
      boilerplate: `def fizzbuzz(n):
    for i in range(1, n + 1):
        # TODO: Implement FizzBuzz logic
        # If divisible by 3 AND 5, print "FizzBuzz"
        # If divisible by 3, print "Fizz"
        # If divisible by 5, print "Buzz"
        # Otherwise, print the number
        print(i)

fizzbuzz(15)`,
      hint: 'Use if/elif/else with the modulo operator (%)'
    }
  ],
  java: [
    {
      id: 'java-hello',
      title: 'Hello World',
      description: 'Modify the code to print "Hello, World!" instead of "Hello".',
      boilerplate: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello");
    }
}`,
      hint: 'Change the string inside println() to include ", World!"'
    },
    {
      id: 'java-sum',
      title: 'Sum Two Numbers',
      description: 'Complete the method to return the sum of two numbers.',
      boilerplate: `public class Main {
    public static int addNumbers(int a, int b) {
        // TODO: Return the sum of a and b
        return 0;
    }
    
    public static void main(String[] args) {
        int result = addNumbers(5, 3);
        System.out.println("5 + 3 = " + result);
    }
}`,
      hint: 'Replace "return 0" with "return a + b"'
    },
    {
      id: 'java-loop',
      title: 'Loop Practice',
      description: 'Use a for loop to print numbers 1 through 5.',
      boilerplate: `public class Main {
    public static void main(String[] args) {
        // TODO: Use a for loop to print numbers 1 to 5
        // Expected output:
        // 1
        // 2
        // 3
        // 4
        // 5
    }
}`,
      hint: 'Use for(int i = 1; i <= 5; i++) and System.out.println(i)'
    },
    {
      id: 'java-array',
      title: 'Array Practice',
      description: 'Create an array with 3 fruits and print each one.',
      boilerplate: `public class Main {
    public static void main(String[] args) {
        // TODO: Create a String array with "apple", "banana", "orange"
        
        // TODO: Use a for-each loop to print each fruit
    }
}`,
      hint: 'String[] fruits = {"apple", "banana", "orange"}; then use for(String fruit : fruits)'
    },
    {
      id: 'java-fizzbuzz',
      title: 'FizzBuzz',
      description: 'Complete the FizzBuzz program: print "Fizz" for multiples of 3, "Buzz" for multiples of 5, "FizzBuzz" for both.',
      boilerplate: `public class Main {
    public static void fizzbuzz(int n) {
        for (int i = 1; i <= n; i++) {
            // TODO: Implement FizzBuzz logic
            // If divisible by 3 AND 5, print "FizzBuzz"
            // If divisible by 3, print "Fizz"
            // If divisible by 5, print "Buzz"
            // Otherwise, print the number
            System.out.println(i);
        }
    }
    
    public static void main(String[] args) {
        fizzbuzz(15);
    }
}`,
      hint: 'Use if/else if/else with the modulo operator (%)'
    }
  ]
};

/**
 * Default code templates for each language
 */
const DEFAULT_CODE = {
  python: `# Welcome to the Python Sandbox!
# Write your code here and click "Run Code" to execute it.

# Example: Print a greeting
print("Hello from Python!")

# Try doing some math
result = 10 + 5
print(f"10 + 5 = {result}")

# Create a list
numbers = [1, 2, 3, 4, 5]
print(f"Numbers: {numbers}")
`,
  java: `// Welcome to the Java Sandbox!
// Write your code here and click "Run Code" to execute it.

public class Main {
    public static void main(String[] args) {
        // Example: Print a greeting
        System.out.println("Hello from Java!");
        
        // Try doing some math
        int result = 10 + 5;
        System.out.println("10 + 5 = " + result);
        
        // Create an array
        int[] numbers = {1, 2, 3, 4, 5};
        System.out.print("Numbers: ");
        for (int num : numbers) {
            System.out.print(num + " ");
        }
        System.out.println();
    }
}
`
};

/**
 * Simple code execution simulator (client-side only)
 * NOTE: This is a SIMULATION for educational purposes.
 * Real code execution would require a backend service.
 */
function simulateCodeExecution(code, language) {
  // This is a simple simulation that shows what the output would look like
  // In a real implementation, you would send this to a secure backend service
  
  const output = [];
  output.push(`[${language.toUpperCase()} Sandbox - Simulated Output]`);
  output.push('─'.repeat(40));
  
  if (language === 'python') {
    // Simple Python simulation
    const printRegex = /print\s*\(\s*(?:f?["'](.+?)["']|(.+?))\s*\)/g;
    let match;
    let foundPrints = false;
    
    while ((match = printRegex.exec(code)) !== null) {
      foundPrints = true;
      let printContent = match[1] || match[2];
      
      // Handle f-strings (very basic)
      if (printContent) {
        // Remove f-string syntax for display
        printContent = printContent.replace(/\{[^}]+\}/g, '<value>');
        output.push(printContent);
      }
    }
    
    if (!foundPrints) {
      output.push('(No print statements found in code)');
    }
  } else if (language === 'java') {
    // Simple Java simulation
    const printRegex = /System\.out\.print(?:ln)?\s*\(\s*["']?(.+?)["']?\s*\)/g;
    let match;
    let foundPrints = false;
    
    while ((match = printRegex.exec(code)) !== null) {
      foundPrints = true;
      let printContent = match[1];
      // Clean up concatenation for display
      printContent = printContent.replace(/"\s*\+\s*"/g, '');
      printContent = printContent.replace(/\s*\+\s*\w+/g, ' <value>');
      output.push(printContent);
    }
    
    if (!foundPrints) {
      output.push('(No print statements found in code)');
    }
  }
  
  output.push('─'.repeat(40));
  output.push('');
  output.push('💡 Note: This is a simulated preview.');
  output.push('   For actual execution, code would be');
  output.push('   sent to a secure backend service.');
  
  return output.join('\n');
}

/**
 * Language Icon Components
 */
function PythonLogo({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="12" fill="#3776ab"/>
      <path d="M50 15C35 15 35 25 35 25V35H52V38H28C28 38 18 37 18 52C18 67 26 67 26 67H35V57C35 57 34 47 45 47H55C55 47 65 47 65 37V25C65 25 66 15 50 15ZM42 22C44.2091 22 46 23.7909 46 26C46 28.2091 44.2091 30 42 30C39.7909 30 38 28.2091 38 26C38 23.7909 39.7909 22 42 22Z" fill="#ffd43b"/>
      <path d="M50 85C65 85 65 75 65 75V65H48V62H72C72 62 82 63 82 48C82 33 74 33 74 33H65V43C65 43 66 53 55 53H45C45 53 35 53 35 63V75C35 75 34 85 50 85ZM58 78C55.7909 78 54 76.2091 54 74C54 71.7909 55.7909 70 58 70C60.2091 70 62 71.7909 62 74C62 76.2091 60.2091 78 58 78Z" fill="#ffd43b"/>
    </svg>
  );
}

function JavaLogo({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="12" fill="#f89820"/>
      <path d="M35 25C35 25 40 30 50 30C60 30 65 25 65 25" stroke="white" strokeWidth="4" strokeLinecap="round"/>
      <path d="M30 35H70V70C70 75 65 80 50 80C35 80 30 75 30 70V35Z" fill="white"/>
      <path d="M30 35H70V45H30V35Z" fill="#5382a1"/>
      <path d="M72 45C75 45 78 48 78 52C78 56 75 60 72 60" stroke="white" strokeWidth="4" strokeLinecap="round"/>
      <text x="50" y="68" textAnchor="middle" fill="#f89820" fontSize="16" fontWeight="bold" fontFamily="Arial">JAVA</text>
    </svg>
  );
}

function Sandbox() {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(DEFAULT_CODE.python);
  const [output, setOutput] = useState('');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [showChallenges, setShowChallenges] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Handle language change
  const handleLanguageChange = useCallback((newLanguage) => {
    setLanguage(newLanguage);
    setCode(DEFAULT_CODE[newLanguage]);
    setOutput('');
    setSelectedChallenge(null);
    setShowHint(false);
  }, []);

  // Handle code execution
  const handleRunCode = useCallback(() => {
    const result = simulateCodeExecution(code, language);
    setOutput(result);
  }, [code, language]);

  // Handle challenge selection
  const handleSelectChallenge = useCallback((challenge) => {
    setSelectedChallenge(challenge);
    setCode(challenge.boilerplate);
    setOutput('');
    setShowChallenges(false);
    setShowHint(false);
  }, []);

  // Clear code
  const handleClear = useCallback(() => {
    if (selectedChallenge) {
      setCode(selectedChallenge.boilerplate);
    } else {
      setCode(DEFAULT_CODE[language]);
    }
    setOutput('');
  }, [language, selectedChallenge]);

  // Reset to default (exit challenge)
  const handleReset = useCallback(() => {
    setSelectedChallenge(null);
    setCode(DEFAULT_CODE[language]);
    setOutput('');
    setShowHint(false);
  }, [language]);

  const challenges = CHALLENGES[language];

  return (
    <div className="sandbox-page">
      <div className="sandbox-header">
        <h1>🖥️ Code Sandbox</h1>
        <p>Write and test code in a safe environment. Nothing is saved - experiment freely!</p>
      </div>

      {/* Controls Bar */}
      <div className="sandbox-controls">
        <div className="language-selector">
          <label htmlFor="language-select">Language:</label>
          <div className="language-buttons">
            <button
              className={`language-btn ${language === 'python' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('python')}
            >
              <PythonLogo size={20} />
              Python
            </button>
            <button
              className={`language-btn ${language === 'java' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('java')}
            >
              <JavaLogo size={20} />
              Java
            </button>
          </div>
        </div>

        <div className="challenge-selector">
          <button 
            className="btn-secondary challenges-btn"
            onClick={() => setShowChallenges(!showChallenges)}
          >
            📝 Challenges {showChallenges ? '▲' : '▼'}
          </button>
          
          {showChallenges && (
            <div className="challenges-dropdown">
              <div className="challenges-header">
                <strong>Select a Challenge:</strong>
              </div>
              {challenges.map((challenge) => (
                <button
                  key={challenge.id}
                  className={`challenge-item ${selectedChallenge?.id === challenge.id ? 'active' : ''}`}
                  onClick={() => handleSelectChallenge(challenge)}
                >
                  <span className="challenge-title">{challenge.title}</span>
                  <span className="challenge-desc">{challenge.description}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Challenge Info Banner */}
      {selectedChallenge && (
        <div className="challenge-banner">
          <div className="challenge-info">
            <h3>🎯 Challenge: {selectedChallenge.title}</h3>
            <p>{selectedChallenge.description}</p>
          </div>
          <div className="challenge-actions">
            <button 
              className="btn-hint"
              onClick={() => setShowHint(!showHint)}
            >
              💡 {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            <button 
              className="btn-reset"
              onClick={handleReset}
            >
              ✕ Exit Challenge
            </button>
          </div>
          {showHint && (
            <div className="hint-box">
              <strong>Hint:</strong> {selectedChallenge.hint}
            </div>
          )}
        </div>
      )}

      {/* Editor and Output */}
      <div className="sandbox-main">
        {/* Code Editor */}
        <div className="editor-panel">
          <div className="panel-header">
            <span>
              {language === 'python' ? <PythonLogo size={18} /> : <JavaLogo size={18} />}
              {language === 'python' ? ' Python Code' : ' Java Code'}
            </span>
            <div className="editor-actions">
              <button className="btn-clear" onClick={handleClear} title="Reset Code">
                ↺ Reset
              </button>
            </div>
          </div>
          <textarea
            className="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            placeholder={`Enter your ${language} code here...`}
          />
          <div className="editor-footer">
            <button className="btn-primary run-btn" onClick={handleRunCode}>
              ▶ Run Code
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="output-panel">
          <div className="panel-header">
            <span>📤 Output</span>
            {output && (
              <button className="btn-clear" onClick={() => setOutput('')} title="Clear Output">
                Clear
              </button>
            )}
          </div>
          <pre className="code-output">
            {output || 'Click "Run Code" to see the output here...'}
          </pre>
        </div>
      </div>

      {/* Info Section */}
      <div className="sandbox-info">
        <h3>💡 Tips</h3>
        <ul>
          <li>Use the language selector to switch between Python and Java</li>
          <li>Try the coding challenges to practice specific concepts</li>
          <li>Your code is not saved - copy it before leaving if you want to keep it</li>
          <li>This sandbox simulates output - for real execution, you would need a backend service</li>
        </ul>
      </div>
    </div>
  );
}

export default Sandbox;
