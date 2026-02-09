/**
 * Sandbox Page Component
 * 
 * An interactive code editor similar to W3Schools Tryit Editor.
 * Users can write and run Python or Java code, and try coding challenges.
 * Code is not saved - it's purely for practice and experimentation.
 */
import { useState, useCallback, useEffect } from 'react';
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
 * Code execution simulator (client-side only)
 * 
 * This simulator provides realistic output for educational/demonstration purposes.
 * It parses and evaluates simple code constructs to show what the output would be.
 * 
 * NOTE: This is a SIMULATION. Real code execution would require a secure backend
 * service with proper sandboxing. This simulator handles common patterns but
 * won't cover all edge cases.
 */

/**
 * Safely evaluate simple arithmetic expressions
 */
function safeEvaluateExpression(expr, variables = {}) {
  try {
    // Clean the expression
    let cleanExpr = expr.trim();
    
    // Replace variables with their values
    for (const [varName, varValue] of Object.entries(variables)) {
      const varRegex = new RegExp(`\\b${varName}\\b`, 'g');
      cleanExpr = cleanExpr.replace(varRegex, JSON.stringify(varValue));
    }
    
    // Only allow safe characters: numbers, operators, parentheses, brackets, quotes, commas, spaces, colons
    if (!/^[\d\s+\-*/%()[\],."':\w]+$/.test(cleanExpr)) {
      return null;
    }
    
    // Evaluate using Function constructor (safer than eval for simple math)
    // eslint-disable-next-line no-new-func
    const result = new Function(`"use strict"; return (${cleanExpr})`)();
    return result;
  } catch {
    return null;
  }
}

/**
 * Parse Python code and extract variable assignments
 */
function parsePythonVariables(code) {
  const variables = {};
  const lines = code.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip comments and empty lines
    if (trimmed.startsWith('#') || !trimmed) continue;
    
    // Simple variable assignment: var = value
    const assignMatch = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
    if (assignMatch) {
      const [, varName, valueExpr] = assignMatch;
      
      // Skip function definitions and complex assignments
      if (valueExpr.includes('def ') || valueExpr.includes('lambda')) continue;
      
      // Handle list literals
      const listMatch = valueExpr.match(/^\[(.*)\]$/);
      if (listMatch) {
        try {
          const items = listMatch[1].split(',').map(item => {
            const trimmedItem = item.trim();
            // String item
            if (/^["'].*["']$/.test(trimmedItem)) {
              return trimmedItem.slice(1, -1);
            }
            // Number item
            const num = parseFloat(trimmedItem);
            if (!isNaN(num)) return num;
            // Variable reference
            if (variables[trimmedItem] !== undefined) return variables[trimmedItem];
            return trimmedItem;
          });
          variables[varName] = items;
        } catch {
          variables[varName] = valueExpr;
        }
        continue;
      }
      
      // Handle string literals
      if (/^["'].*["']$/.test(valueExpr.trim())) {
        variables[varName] = valueExpr.trim().slice(1, -1);
        continue;
      }
      
      // Handle numeric/expression values
      const evaluated = safeEvaluateExpression(valueExpr, variables);
      if (evaluated !== null) {
        variables[varName] = evaluated;
      }
    }
    
    // Handle list.append() operations
    const appendMatch = trimmed.match(/^(\w+)\.append\((.+)\)$/);
    if (appendMatch) {
      const [, listName, valueExpr] = appendMatch;
      if (Array.isArray(variables[listName])) {
        let value = valueExpr.trim();
        if (/^["'].*["']$/.test(value)) {
          value = value.slice(1, -1);
        } else {
          const num = parseFloat(value);
          if (!isNaN(num)) value = num;
        }
        variables[listName].push(value);
      }
    }
  }
  
  return variables;
}

/**
 * Execute a Python print statement with variable substitution
 */
function executePythonPrint(printContent, variables, isFString) {
  if (!printContent) return '';
  
  let result = printContent;
  
  if (isFString) {
    // Handle f-string: replace {expression} with evaluated values
    result = result.replace(/\{([^}]+)\}/g, (match, expr) => {
      const trimmedExpr = expr.trim();
      
      // Check for len() function
      const lenMatch = trimmedExpr.match(/^len\((\w+)\)$/);
      if (lenMatch) {
        const arr = variables[lenMatch[1]];
        if (Array.isArray(arr)) return arr.length;
        if (typeof arr === 'string') return arr.length;
        return match;
      }
      
      // Direct variable reference
      if (variables[trimmedExpr] !== undefined) {
        const val = variables[trimmedExpr];
        if (Array.isArray(val)) return JSON.stringify(val).replace(/"/g, "'");
        return String(val);
      }
      
      // Try to evaluate as expression
      const evaluated = safeEvaluateExpression(trimmedExpr, variables);
      if (evaluated !== null) {
        if (Array.isArray(evaluated)) return JSON.stringify(evaluated).replace(/"/g, "'");
        return String(evaluated);
      }
      
      return match;
    });
  } else {
    // Regular string - just return as-is
    // But check if it's a variable reference
    if (variables[result] !== undefined) {
      const val = variables[result];
      if (Array.isArray(val)) return JSON.stringify(val).replace(/"/g, "'");
      return String(val);
    }
  }
  
  return result;
}

/**
 * Simulate Python code execution
 */
function simulatePython(code) {
  const output = [];
  const variables = parsePythonVariables(code);
  const lines = code.split('\n');
  
  // Track indentation for loops
  let inForLoop = false;
  let loopVar = '';
  let loopIterable = [];
  let loopBody = [];
  let loopIndent = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const indent = line.search(/\S/);
    
    // Skip comments and empty lines
    if (trimmed.startsWith('#') || !trimmed) {
      if (inForLoop && indent > loopIndent) continue;
      if (inForLoop && indent <= loopIndent) {
        // Execute the loop
        for (const iterValue of loopIterable) {
          variables[loopVar] = iterValue;
          for (const bodyLine of loopBody) {
            const printOutput = processPythonPrintLine(bodyLine, variables);
            if (printOutput !== null) output.push(printOutput);
          }
        }
        inForLoop = false;
        loopBody = [];
      }
      continue;
    }
    
    // Check for for loop start
    const forMatch = trimmed.match(/^for\s+(\w+)\s+in\s+(.+):$/);
    if (forMatch) {
      inForLoop = true;
      loopVar = forMatch[1];
      loopIndent = indent;
      loopBody = [];
      
      const iterableExpr = forMatch[2].trim();
      
      // Handle range()
      const rangeMatch = iterableExpr.match(/^range\(([^)]+)\)$/);
      if (rangeMatch) {
        const args = rangeMatch[1].split(',').map(a => {
          const trimmed = a.trim();
          const num = parseInt(trimmed);
          if (!isNaN(num)) return num;
          if (variables[trimmed] !== undefined) return variables[trimmed];
          return 0;
        });
        
        if (args.length === 1) {
          loopIterable = Array.from({ length: args[0] }, (_, i) => i);
        } else if (args.length === 2) {
          loopIterable = Array.from({ length: args[1] - args[0] }, (_, i) => args[0] + i);
        } else if (args.length === 3) {
          loopIterable = [];
          for (let j = args[0]; j < args[1]; j += args[2]) {
            loopIterable.push(j);
          }
        }
      } else if (variables[iterableExpr] && Array.isArray(variables[iterableExpr])) {
        loopIterable = variables[iterableExpr];
      }
      continue;
    }
    
    // Inside a loop - collect body
    if (inForLoop && indent > loopIndent) {
      loopBody.push(trimmed);
      continue;
    }
    
    // Loop ended - execute it
    if (inForLoop && indent <= loopIndent) {
      for (const iterValue of loopIterable) {
        variables[loopVar] = iterValue;
        for (const bodyLine of loopBody) {
          const printOutput = processPythonPrintLine(bodyLine, variables);
          if (printOutput !== null) output.push(printOutput);
        }
      }
      inForLoop = false;
      loopBody = [];
    }
    
    // Process print statements outside of loops
    if (!inForLoop) {
      const printOutput = processPythonPrintLine(trimmed, variables);
      if (printOutput !== null) output.push(printOutput);
    }
  }
  
  // Execute remaining loop if code ends inside one
  if (inForLoop && loopBody.length > 0) {
    for (const iterValue of loopIterable) {
      variables[loopVar] = iterValue;
      for (const bodyLine of loopBody) {
        const printOutput = processPythonPrintLine(bodyLine, variables);
        if (printOutput !== null) output.push(printOutput);
      }
    }
  }
  
  return output;
}

/**
 * Process a single Python print line
 */
function processPythonPrintLine(line, variables) {
  // Match print() with various formats
  const printMatch = line.match(/^print\s*\(\s*(.*)\s*\)$/);
  if (!printMatch) return null;
  
  const printArg = printMatch[1].trim();
  
  // Empty print
  if (!printArg) return '';
  
  // f-string: f"..." or f'...'
  const fstringMatch = printArg.match(/^f(["'])(.*)\1$/);
  if (fstringMatch) {
    return executePythonPrint(fstringMatch[2], variables, true);
  }
  
  // Regular string: "..." or '...'
  const stringMatch = printArg.match(/^(["'])(.*)\1$/);
  if (stringMatch) {
    return stringMatch[2];
  }
  
  // Variable or expression
  if (variables[printArg] !== undefined) {
    const val = variables[printArg];
    if (Array.isArray(val)) return JSON.stringify(val).replace(/"/g, "'");
    return String(val);
  }
  
  // Try evaluating as expression
  const evaluated = safeEvaluateExpression(printArg, variables);
  if (evaluated !== null) {
    if (Array.isArray(evaluated)) return JSON.stringify(evaluated).replace(/"/g, "'");
    return String(evaluated);
  }
  
  return printArg;
}

/**
 * Parse Java code and extract variable declarations
 */
function parseJavaVariables(code) {
  const variables = {};
  const lines = code.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip comments
    if (trimmed.startsWith('//') || trimmed.startsWith('/*')) continue;
    
    // Variable declaration: type name = value;
    const varMatch = trimmed.match(/^(int|double|float|String|boolean|char)\s+(\w+)\s*=\s*(.+?);?$/);
    if (varMatch) {
      const [, type, varName, valueExpr] = varMatch;
      
      // Handle string literals
      if (type === 'String' && /^".*"$/.test(valueExpr.trim())) {
        variables[varName] = valueExpr.trim().slice(1, -1);
        continue;
      }
      
      // Handle array initialization: {1, 2, 3}
      const arrayMatch = valueExpr.match(/^\{(.+)\}$/);
      if (arrayMatch) {
        const items = arrayMatch[1].split(',').map(item => {
          const trimmedItem = item.trim();
          if (/^".*"$/.test(trimmedItem)) return trimmedItem.slice(1, -1);
          const num = parseFloat(trimmedItem);
          if (!isNaN(num)) return num;
          return trimmedItem;
        });
        variables[varName] = items;
        continue;
      }
      
      // Handle numeric/expression
      const evaluated = safeEvaluateExpression(valueExpr, variables);
      if (evaluated !== null) {
        variables[varName] = evaluated;
      }
    }
    
    // Array declaration: type[] name = {values};
    const arrayDeclMatch = trimmed.match(/^(\w+)\[\]\s+(\w+)\s*=\s*\{(.+)\};?$/);
    if (arrayDeclMatch) {
      const [, , varName, itemsStr] = arrayDeclMatch;
      const items = itemsStr.split(',').map(item => {
        const trimmedItem = item.trim();
        if (/^".*"$/.test(trimmedItem)) return trimmedItem.slice(1, -1);
        const num = parseFloat(trimmedItem);
        if (!isNaN(num)) return num;
        return trimmedItem;
      });
      variables[varName] = items;
    }
  }
  
  return variables;
}

/**
 * Execute a Java print statement with variable substitution
 */
function executeJavaPrint(printContent, variables, isPrintln) {
  if (!printContent) return isPrintln ? '' : null;
  
  let result = '';
  
  // Handle string concatenation
  const parts = printContent.split(/\s*\+\s*/);
  
  for (const part of parts) {
    const trimmedPart = part.trim();
    
    // String literal
    if (/^".*"$/.test(trimmedPart)) {
      result += trimmedPart.slice(1, -1);
      continue;
    }
    
    // Variable reference
    if (variables[trimmedPart] !== undefined) {
      const val = variables[trimmedPart];
      if (Array.isArray(val)) {
        result += val.join(' ');
      } else {
        result += String(val);
      }
      continue;
    }
    
    // Try to evaluate as expression
    const evaluated = safeEvaluateExpression(trimmedPart, variables);
    if (evaluated !== null) {
      result += String(evaluated);
      continue;
    }
    
    // Unknown - keep as placeholder
    result += trimmedPart;
  }
  
  return result;
}

/**
 * Simulate Java code execution
 */
function simulateJava(code) {
  const output = [];
  const variables = parseJavaVariables(code);
  const lines = code.split('\n');
  
  let currentOutput = '';
  let inForLoop = false;
  let loopVar = '';
  let loopStart = 0;
  let loopEnd = 0;
  let loopStep = 1;
  let loopBody = [];
  let braceCount = 0;
  let isForEachLoop = false;
  let forEachArray = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Skip comments
    if (trimmed.startsWith('//') || trimmed.startsWith('/*')) continue;
    
    // Check for standard for loop: for (int i = 0; i < n; i++)
    const forMatch = trimmed.match(/^for\s*\(\s*int\s+(\w+)\s*=\s*(\d+)\s*;\s*\w+\s*(<|<=)\s*(\d+|\w+)\s*;\s*\w+\+\+\s*\)/);
    if (forMatch && !inForLoop) {
      inForLoop = true;
      isForEachLoop = false;
      loopVar = forMatch[1];
      loopStart = parseInt(forMatch[2]);
      const comparison = forMatch[3];
      let endVal = forMatch[4];
      
      // Check if endVal is a variable
      if (variables[endVal] !== undefined) {
        endVal = variables[endVal];
      } else {
        endVal = parseInt(endVal);
      }
      
      loopEnd = comparison === '<' ? endVal : endVal + 1;
      loopStep = 1;
      loopBody = [];
      braceCount = (trimmed.includes('{') ? 1 : 0);
      continue;
    }
    
    // Check for for-each loop: for (Type item : array)
    const forEachMatch = trimmed.match(/^for\s*\(\s*\w+\s+(\w+)\s*:\s*(\w+)\s*\)/);
    if (forEachMatch && !inForLoop) {
      inForLoop = true;
      isForEachLoop = true;
      loopVar = forEachMatch[1];
      const arrayName = forEachMatch[2];
      forEachArray = variables[arrayName] || [];
      loopBody = [];
      braceCount = (trimmed.includes('{') ? 1 : 0);
      continue;
    }
    
    // Track braces inside loop
    if (inForLoop) {
      if (trimmed.includes('{')) braceCount++;
      if (trimmed.includes('}')) braceCount--;
      
      if (braceCount === 0 || (braceCount === 1 && trimmed === '}')) {
        // Execute the loop
        if (isForEachLoop) {
          for (const iterValue of forEachArray) {
            variables[loopVar] = iterValue;
            for (const bodyLine of loopBody) {
              const printResult = processJavaPrintLine(bodyLine, variables);
              if (printResult !== null) {
                if (printResult.isPrintln) {
                  output.push(currentOutput + printResult.text);
                  currentOutput = '';
                } else {
                  currentOutput += printResult.text;
                }
              }
            }
          }
        } else {
          for (let j = loopStart; j < loopEnd; j += loopStep) {
            variables[loopVar] = j;
            for (const bodyLine of loopBody) {
              const printResult = processJavaPrintLine(bodyLine, variables);
              if (printResult !== null) {
                if (printResult.isPrintln) {
                  output.push(currentOutput + printResult.text);
                  currentOutput = '';
                } else {
                  currentOutput += printResult.text;
                }
              }
            }
          }
        }
        inForLoop = false;
        loopBody = [];
        continue;
      }
      
      // Collect loop body
      if (trimmed && trimmed !== '{') {
        loopBody.push(trimmed);
      }
      continue;
    }
    
    // Process print statements outside loops
    const printResult = processJavaPrintLine(trimmed, variables);
    if (printResult !== null) {
      if (printResult.isPrintln) {
        output.push(currentOutput + printResult.text);
        currentOutput = '';
      } else {
        currentOutput += printResult.text;
      }
    }
  }
  
  // Add any remaining non-newline output
  if (currentOutput) {
    output.push(currentOutput);
  }
  
  return output;
}

/**
 * Process a single Java print line
 */
function processJavaPrintLine(line, variables) {
  // Match System.out.println() or System.out.print()
  const printlnMatch = line.match(/System\.out\.println\s*\(\s*(.*?)\s*\);?$/);
  const printMatch = line.match(/System\.out\.print\s*\(\s*(.*?)\s*\);?$/);
  
  if (printlnMatch) {
    const content = executeJavaPrint(printlnMatch[1], variables, true);
    return { text: content, isPrintln: true };
  }
  
  if (printMatch) {
    const content = executeJavaPrint(printMatch[1], variables, false);
    return { text: content || '', isPrintln: false };
  }
  
  return null;
}

/**
 * Main simulation function
 */
function simulateCodeExecution(code, language) {
  const output = [];
  
  try {
    if (language === 'python') {
      const pythonOutput = simulatePython(code);
      if (pythonOutput.length === 0) {
        output.push('(No output - add print() statements to see results)');
      } else {
        output.push(...pythonOutput);
      }
    } else if (language === 'java') {
      const javaOutput = simulateJava(code);
      if (javaOutput.length === 0) {
        output.push('(No output - add System.out.println() statements to see results)');
      } else {
        output.push(...javaOutput);
      }
    }
  } catch (error) {
    output.push(`Error: ${error.message}`);
  }
  
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
  const [isRunning, setIsRunning] = useState(false);
  const [executionMode, setExecutionMode] = useState('checking'); // 'backend', 'simulation', 'checking'

  // Check backend availability on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('/api/sandbox/status');
        if (response.ok) {
          setExecutionMode('backend');
        } else {
          setExecutionMode('simulation');
        }
      } catch {
        setExecutionMode('simulation');
      }
    };
    checkBackend();
  }, []);

  // Handle language change
  const handleLanguageChange = useCallback((newLanguage) => {
    setLanguage(newLanguage);
    setCode(DEFAULT_CODE[newLanguage]);
    setOutput('');
    setSelectedChallenge(null);
    setShowHint(false);
  }, []);

  // Handle code execution
  const handleRunCode = useCallback(async () => {
    setIsRunning(true);
    setOutput('Running...');

    try {
      // Try backend execution first
      if (executionMode === 'backend') {
        const response = await fetch('/api/sandbox/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: code,
            language: language
          })
        });

        if (response.ok) {
          const result = await response.json();
          let outputText = result.output || '';
          if (result.error) {
            outputText += (outputText ? '\n' : '') + result.error;
          }
          if (result.execution_time) {
            outputText += `\n\n⏱️ Execution time: ${result.execution_time}s`;
          }
          setOutput(outputText || '(No output)');
          setIsRunning(false);
          return;
        }
      }

      // Fallback to simulation
      const result = simulateCodeExecution(code, language);
      setOutput(result + '\n\n💡 (Simulated output - backend not available)');
    } catch (error) {
      // Fallback to simulation on any error
      const result = simulateCodeExecution(code, language);
      setOutput(result + '\n\n💡 (Simulated output - backend not available)');
    }

    setIsRunning(false);
  }, [code, language, executionMode]);

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
            disabled={isRunning}
          />
          <div className="editor-footer">
            <button 
              className="btn-primary run-btn" 
              onClick={handleRunCode}
              disabled={isRunning}
            >
              {isRunning ? '⏳ Running...' : '▶ Run Code'}
            </button>
            {executionMode === 'backend' && (
              <span className="execution-mode-badge backend">🔗 Live Execution</span>
            )}
            {executionMode === 'simulation' && (
              <span className="execution-mode-badge simulation">🔮 Simulation Mode</span>
            )}
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
          <li>
            {executionMode === 'backend' 
              ? 'Code is executed securely on the server with time limits and restrictions'
              : 'Running in simulation mode - output shows what the code would produce'}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sandbox;
