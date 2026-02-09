/**
 * Glossary Page Component
 * 
 * An IT and Programmer's Dictionary/Reference guide.
 * Organized by pathways: Programming, Cybersecurity, Networking, etc.
 * Contains key terms, concepts, diagrams, and important information.
 */
import { useState } from 'react';
import './Glossary.css';

// Maximum number of search results to display
const MAX_SEARCH_RESULTS = 20;

/**
 * Data for each pathway/category
 */
const PATHWAYS = [
  {
    id: 'programming',
    name: 'Programming',
    icon: '💻',
    color: '#3776ab',
    description: 'Learn programming languages, concepts, and best practices',
    subcategories: [
      {
        id: 'languages',
        name: 'Programming Languages',
        content: [
          {
            term: 'Python',
            definition: 'A high-level, interpreted programming language known for its readability and versatility. Used in web development, data science, AI/ML, automation, and more.',
            example: 'print("Hello, World!")',
            keyFeatures: ['Easy to learn', 'Large standard library', 'Dynamic typing', 'Great for beginners']
          },
          {
            term: 'Java',
            definition: 'A class-based, object-oriented programming language designed to have as few implementation dependencies as possible. Widely used in enterprise applications, Android development, and large-scale systems.',
            example: 'System.out.println("Hello, World!");',
            keyFeatures: ['Platform independent (JVM)', 'Strongly typed', 'Object-oriented', 'Memory management']
          },
          {
            term: 'JavaScript',
            definition: 'A lightweight, interpreted programming language primarily used for web development. It enables interactive web pages and is an essential part of web applications.',
            example: 'console.log("Hello, World!");',
            keyFeatures: ['Runs in browsers', 'Event-driven', 'Supports functional programming', 'Node.js for backend']
          },
          {
            term: 'C++',
            definition: 'A general-purpose programming language created as an extension of C. Known for high performance, it\'s used in game development, system programming, and embedded systems.',
            example: 'std::cout << "Hello, World!" << std::endl;',
            keyFeatures: ['High performance', 'Memory control', 'Object-oriented', 'Used in games/systems']
          },
          {
            term: 'C#',
            definition: 'A modern, object-oriented programming language developed by Microsoft. Used for Windows applications, game development (Unity), and enterprise software.',
            example: 'Console.WriteLine("Hello, World!");',
            keyFeatures: ['Part of .NET', 'Strong typing', 'Unity game engine', 'Cross-platform with .NET Core']
          },
          {
            term: 'HTML',
            definition: 'HyperText Markup Language - a markup language for creating web pages. While not a programming language, it defines the structure and content of web pages.',
            example: '<h1>Welcome</h1>\n<p>This is a paragraph.</p>',
            keyFeatures: ['Markup language (not programming)', 'Web page structure', 'Tags and elements', 'Foundation of web']
          }
        ]
      },
      {
        id: 'python',
        name: 'Python Fundamentals',
        content: [
          {
            term: 'def Keyword',
            definition: 'The keyword used to define (create) a function in Python. Functions are reusable blocks of code that perform specific tasks.',
            example: 'def greet(name):\n    return f"Hello, {name}!"',
            keyFeatures: ['Defines functions', 'Followed by function name', 'Uses colon and indentation', 'Can have parameters']
          },
          {
            term: 'print() Function',
            definition: 'A built-in Python function that outputs text or values to the console. Essential for displaying information and debugging.',
            example: 'print("Hello, World!")\nprint(42)\nprint("The answer is", 42)',
            keyFeatures: ['Outputs to console', 'Accepts multiple arguments', 'Converts to string', 'Adds newline by default']
          },
          {
            term: 'Python Comments (#)',
            definition: 'Single-line comments in Python start with the hash symbol (#). Everything after # on that line is ignored by the interpreter.',
            example: '# This is a comment\nage = 25  # This is an inline comment',
            keyFeatures: ['Uses # symbol', 'Single-line only', 'Ignored by interpreter', 'Used for documentation']
          },
          {
            term: 'Python File Extension (.py)',
            definition: 'Python source code files use the .py extension. This tells the operating system and tools that the file contains Python code.',
            example: 'main.py\nutils.py\ntest_app.py',
            keyFeatures: ['.py for source files', '.pyc for compiled', '.pyw for Windows GUI', 'Standard convention']
          },
          {
            term: 'Exponentiation Operator (**)',
            definition: 'The double asterisk (**) is Python\'s exponentiation operator, used to raise a number to a power.',
            example: 'result = 2 ** 3  # 8\nsquare = 5 ** 2  # 25\nsqrt = 16 ** 0.5  # 4.0',
            keyFeatures: ['Raises to power', 'Works with floats', 'Higher precedence than *', 'Different from ^ (XOR)']
          },
          {
            term: 'Floor Division (//)',
            definition: 'The double slash (//) operator performs floor division in Python, dividing and rounding down to the nearest integer.',
            example: 'result = 10 // 3  # 3\nresult = 7 // 2   # 3\nresult = -7 // 2  # -4',
            keyFeatures: ['Rounds down', 'Returns integer', 'Works with negatives', 'Different from / (true division)']
          },
          {
            term: 'Type Casting - int()',
            definition: 'The int() function converts a value to an integer. Commonly used to convert strings containing numbers to actual integers.',
            example: 'num = int("5")     # 5\nnum = int(3.7)    # 3\nnum = int("42")   # 42',
            keyFeatures: ['String to integer', 'Truncates floats', 'Raises error if invalid', 'Base conversion possible']
          },
          {
            term: 'Boolean Operators (and, or, not)',
            definition: 'Python\'s logical operators for combining boolean expressions. "and" returns True if both are true, "or" if either is true, "not" inverts.',
            example: 'True and True   # True\nTrue or False   # True\nnot True        # False',
            keyFeatures: ['and - both must be true', 'or - either can be true', 'not - inverts value', 'Short-circuit evaluation']
          },
          {
            term: 'input() Function',
            definition: 'A built-in function that reads input from the user via the console. Always returns a string that may need conversion.',
            example: 'name = input("Enter name: ")\nage = int(input("Enter age: "))',
            keyFeatures: ['Reads user input', 'Returns string', 'Optional prompt', 'Blocks until Enter']
          },
          {
            term: 'range() Function',
            definition: 'Generates a sequence of numbers, commonly used with for loops. Can specify start, stop, and step values.',
            example: 'range(5)        # 0, 1, 2, 3, 4\nrange(2, 5)     # 2, 3, 4\nrange(0, 10, 2) # 0, 2, 4, 6, 8',
            keyFeatures: ['Generates sequences', 'Used in for loops', 'Stop value excluded', 'Memory efficient']
          },
          {
            term: 'while Loop',
            definition: 'A control flow statement that executes a block of code repeatedly as long as a condition is True.',
            example: 'count = 3\nwhile count > 0:\n    print(count)\n    count -= 1',
            keyFeatures: ['Condition-based', 'Can be infinite', 'Use break to exit', 'Use continue to skip']
          },
          {
            term: 'if-else Statement',
            definition: 'Conditional statements that execute different code blocks based on whether conditions are True or False.',
            example: 'if score >= 60:\n    print("Passed")\nelse:\n    print("Failed")',
            keyFeatures: ['Conditional execution', 'elif for multiple conditions', 'else is optional', 'Uses indentation']
          }
        ]
      },
      {
        id: 'python_data',
        name: 'Python Data Structures',
        content: [
          {
            term: 'List',
            definition: 'An ordered, mutable collection that can hold items of different types. Created with square brackets [].',
            example: 'fruits = ["apple", "banana"]\nfruits.append("orange")\nprint(fruits[0])  # apple',
            keyFeatures: ['Ordered collection', 'Mutable (changeable)', 'Allows duplicates', 'Zero-indexed']
          },
          {
            term: 'Dictionary',
            definition: 'A collection of key-value pairs. Keys must be immutable and unique. Access values using keys, not indices.',
            example: 'person = {"name": "John", "age": 25}\nprint(person["name"])  # John',
            keyFeatures: ['Key-value pairs', 'Keys must be immutable', 'Fast lookup by key', 'Unordered (Python 3.6+: ordered)']
          },
          {
            term: 'Tuple',
            definition: 'An ordered, immutable collection. Once created, elements cannot be added, removed, or changed. Created with parentheses ().',
            example: 'coordinates = (10, 20)\nrgb = (255, 128, 0)\nx, y = coordinates  # unpacking',
            keyFeatures: ['Immutable', 'Ordered', 'Allows duplicates', 'Faster than lists']
          },
          {
            term: 'Set',
            definition: 'An unordered collection of unique elements. Automatically removes duplicates. Created with curly braces {} or set().',
            example: 'colors = {"red", "green", "blue"}\ncolors.add("yellow")\n{1, 2, 2, 3}  # {1, 2, 3}',
            keyFeatures: ['No duplicates', 'Unordered', 'Fast membership testing', 'Set operations (union, intersection)']
          },
          {
            term: 'List Indexing',
            definition: 'Accessing elements in a list by their position. Python uses zero-based indexing, so the first element is at index 0.',
            example: 'loot = ["sword", "shield", "potion"]\nfirst = loot[0]   # sword\nsecond = loot[1]  # shield\nlast = loot[-1]   # potion',
            keyFeatures: ['Zero-based', 'Negative indices from end', 'Raises IndexError if out of range', 'loot[1] gets second item']
          },
          {
            term: 'List Slicing',
            definition: 'Extracting a portion of a list using [start:stop:step]. The stop index is excluded from the result.',
            example: 'my_list = [0, 1, 2, 3, 4]\nmy_list[1:3]   # [1, 2]\nmy_list[::2]   # [0, 2, 4]',
            keyFeatures: ['[start:stop:step]', 'Stop is excluded', 'Creates new list', 'Negative indices work']
          },
          {
            term: 'append() Method',
            definition: 'Adds a single element to the end of a list. Modifies the list in place and returns None.',
            example: 'inventory = ["Mario", "Sonic"]\ninventory.append("Zelda")\n# ["Mario", "Sonic", "Zelda"]',
            keyFeatures: ['Adds to end', 'Single element only', 'Modifies in place', 'Returns None']
          },
          {
            term: 'pop() Method',
            definition: 'Removes and returns the last item from a list (or item at specified index). Raises IndexError if list is empty.',
            example: 'items = [1, 2, 3]\nlast = items.pop()    # 3\nfirst = items.pop(0)  # 1',
            keyFeatures: ['Removes and returns', 'Last item by default', 'Can specify index', 'Raises error if empty']
          },
          {
            term: 'len() Function',
            definition: 'Returns the number of items in an object (list, string, dictionary, etc.). Works with any iterable.',
            example: 'len([1, 2, 3])     # 3\nlen("hello")       # 5\nlen({"a": 1})      # 1',
            keyFeatures: ['Returns count', 'Works on any iterable', 'Strings count chars', 'Dicts count keys']
          },
          {
            term: 'in Operator',
            definition: 'Tests if a value exists in a sequence (list, string, dict keys). Returns True or False.',
            example: 'player = {"hp": 100, "mp": 50}\nif "hp" in player:\n    print("Health found")',
            keyFeatures: ['Membership testing', 'Works on sequences', 'Dict checks keys', 'Returns boolean']
          },
          {
            term: 'Nested Lists',
            definition: 'Lists that contain other lists as elements. Used to represent 2D grids, matrices, or hierarchical data.',
            example: 'grid = [[1, 2], [3, 4]]\ngrid[0][1]  # 2',
            keyFeatures: ['Lists within lists', '2D data structures', 'Access with multiple indices', 'Variable depth']
          },
          {
            term: 'Dictionary Key Access',
            definition: 'Access dictionary values using square bracket notation with the key. Raises KeyError if key doesn\'t exist.',
            example: 'person = {"name": "John"}\nprint(person["name"])  # John\n# person.get("age", 0)  # Safe access',
            keyFeatures: ['Square bracket syntax', 'Key must exist (or use .get())', 'Keys are case-sensitive', 'Fast O(1) lookup']
          }
        ]
      },
      {
        id: 'java',
        name: 'Java Fundamentals',
        content: [
          {
            term: 'class Keyword',
            definition: 'The keyword used to declare a class in Java. Every Java program must have at least one class.',
            example: 'public class Main {\n    // class body\n}',
            keyFeatures: ['Declares a class', 'Blueprint for objects', 'Contains methods/fields', 'Name matches filename']
          },
          {
            term: 'main Method',
            definition: 'The entry point of every Java application. Must be declared as: public static void main(String[] args)',
            example: 'public static void main(String[] args) {\n    System.out.println("Hello!");\n}',
            keyFeatures: ['Entry point', 'public static void', 'String[] args parameter', 'Case-sensitive']
          },
          {
            term: 'System.out.println()',
            definition: 'The standard way to print output to the console in Java. Adds a newline after the output.',
            example: 'System.out.println("Hello Java");\nSystem.out.print("No newline");',
            keyFeatures: ['Console output', 'Adds newline', 'print() no newline', 'Part of java.lang']
          },
          {
            term: 'String Data Type',
            definition: 'A sequence of characters in Java. String is a class (capital S), not a primitive type. Immutable once created.',
            example: 'String name = "John";\nString greeting = "Hello " + name;',
            keyFeatures: ['Reference type', 'Immutable', 'Capital S', 'Use equals() to compare']
          },
          {
            term: 'int Data Type',
            definition: 'A primitive data type for storing whole numbers (integers) in Java. 32-bit signed integer.',
            example: 'int age = 25;\nint count = -100;',
            keyFeatures: ['Primitive type', '32-bit', 'Range: -2^31 to 2^31-1', 'No decimal points']
          },
          {
            term: 'boolean Data Type',
            definition: 'A primitive data type that can only hold two values: true or false. Used for logical operations.',
            example: 'boolean isActive = true;\nboolean hasPermission = false;',
            keyFeatures: ['true or false only', 'Primitive type', 'Used in conditions', 'Lowercase keywords']
          },
          {
            term: 'Semicolon (;)',
            definition: 'Every statement in Java must end with a semicolon. It marks the end of a statement.',
            example: 'int x = 10;\nSystem.out.println(x);',
            keyFeatures: ['Ends statements', 'Required', 'Missing causes error', 'Not after blocks {}']
          },
          {
            term: 'Java Comments',
            definition: 'Single-line comments use //. Multi-line comments use /* */. Javadoc comments use /** */.',
            example: '// Single line comment\n/* Multi-line\n   comment */\n/** Javadoc */  ',
            keyFeatures: ['// single line', '/* */ multi-line', '/** */ Javadoc', 'Ignored by compiler']
          },
          {
            term: 'final Keyword',
            definition: 'Creates a constant - a variable whose value cannot be changed after initialization.',
            example: 'final int MAX_SIZE = 100;\nfinal String NAME = "App";',
            keyFeatures: ['Creates constants', 'Cannot be reassigned', 'Convention: UPPER_CASE', 'Can apply to methods/classes']
          },
          {
            term: 'Equality Operator (==)',
            definition: 'Compares two primitive values or object references for equality. For objects, use .equals() method.',
            example: 'int a = 5, b = 5;\nif (a == b)  // true\n// Use equals() for Strings',
            keyFeatures: ['Compares values', 'Works on primitives', 'Reference comparison for objects', 'Use equals() for Strings']
          },
          {
            term: 'Modulus Operator (%)',
            definition: 'Returns the remainder of a division operation. Useful for checking even/odd, wrapping values, etc.',
            example: '10 % 3  // 1\n15 % 5  // 0\n7 % 2   // 1 (odd)',
            keyFeatures: ['Returns remainder', 'Check even/odd', 'Wrap around values', 'Works with negatives']
          },
          {
            term: 'Java Arrays',
            definition: 'Fixed-size collections of elements of the same type. Declared with [] and initialized with {}.',
            example: 'int[] numbers = {1, 2, 3, 4, 5};\nString[] names = new String[3];',
            keyFeatures: ['Fixed size', 'Same type elements', 'Zero-indexed', 'Initialize with {}']
          },
          {
            term: 'for Loop (Java)',
            definition: 'A control structure that repeats code a specific number of times. Has initialization, condition, and update.',
            example: 'for (int i = 0; i < 5; i++) {\n    System.out.println(i);\n}',
            keyFeatures: ['Three parts', 'Initialization; condition; update', 'Counter variable', 'Curly braces for body']
          },
          {
            term: 'if Statement (Java)',
            definition: 'Executes code conditionally based on a boolean expression. Uses parentheses for condition.',
            example: 'if (x > 18) {\n    System.out.println("Adult");\n}',
            keyFeatures: ['Condition in parentheses', 'Body in braces', 'else and else if optional', 'No colon needed']
          }
        ]
      },
      {
        id: 'java_oop',
        name: 'Java OOP Concepts',
        content: [
          {
            term: 'Inheritance',
            definition: 'A mechanism where a class acquires properties and methods from another class. Use "extends" keyword.',
            example: 'public class Dog extends Animal {\n    // Dog inherits from Animal\n}',
            keyFeatures: ['extends keyword', 'Reuse code', 'IS-A relationship', 'Single inheritance only']
          },
          {
            term: 'Encapsulation',
            definition: 'Bundling data (fields) and methods that operate on that data within a class, hiding internal details.',
            example: 'private int balance;\npublic int getBalance() {\n    return balance;\n}',
            keyFeatures: ['Data hiding', 'Private fields', 'Public getters/setters', 'Protects internal state']
          },
          {
            term: 'Polymorphism',
            definition: 'The ability of objects to take many forms. Same method name can behave differently based on the object.',
            example: 'Animal animal = new Dog();\nanimal.speak();  // Dog\'s version',
            keyFeatures: ['Many forms', 'Method overriding', 'Method overloading', 'Runtime polymorphism']
          },
          {
            term: 'Abstraction',
            definition: 'Hiding complex implementation details and showing only essential features. Achieved through abstract classes and interfaces.',
            example: 'abstract class Shape {\n    abstract void draw();\n}',
            keyFeatures: ['Hide complexity', 'Show essentials', 'abstract keyword', 'Cannot instantiate']
          },
          {
            term: 'this Keyword',
            definition: 'Refers to the current object instance. Used to distinguish between instance variables and parameters.',
            example: 'public void setName(String name) {\n    this.name = name;\n}',
            keyFeatures: ['Current object', 'Resolve ambiguity', 'Call other constructors', 'Pass current object']
          },
          {
            term: 'private Access Modifier',
            definition: 'Makes a member accessible only within its own class. Most restrictive access level.',
            example: 'private int secretCode;\nprivate void internalMethod() {}',
            keyFeatures: ['Class-only access', 'Most restrictive', 'Encapsulation', 'Getters/setters needed']
          },
          {
            term: 'Constructor',
            definition: 'A special method called when an object is created. Same name as the class, no return type.',
            example: 'public class Car {\n    public Car(String model) {\n        this.model = model;\n    }\n}',
            keyFeatures: ['Same name as class', 'No return type', 'Called on new', 'Can be overloaded']
          },
          {
            term: 'import Statement',
            definition: 'Used to include classes or entire packages from other locations into your code.',
            example: 'import java.util.ArrayList;\nimport java.util.*;',
            keyFeatures: ['Access other classes', 'Specific or wildcard (*)', 'java.lang auto-imported', 'Top of file']
          },
          {
            term: 'Method Overloading',
            definition: 'Having multiple methods with the same name but different parameters (number, type, or order).',
            example: 'void print(int x) {}\nvoid print(String s) {}\nvoid print(int x, int y) {}',
            keyFeatures: ['Same name', 'Different parameters', 'Compile-time polymorphism', 'Return type not enough']
          },
          {
            term: 'Method Overriding',
            definition: 'Providing a new implementation for a method inherited from a parent class.',
            example: 'class Dog extends Animal {\n    @Override\n    void speak() {\n        System.out.println("Bark");\n    }\n}',
            keyFeatures: ['Same signature', 'Different implementation', '@Override annotation', 'Runtime polymorphism']
          },
          {
            term: 'Interface',
            definition: 'A blueprint of a class containing abstract methods. Classes implement interfaces to provide method bodies.',
            example: 'interface Drawable {\n    void draw();\n}\nclass Circle implements Drawable {}',
            keyFeatures: ['Abstract methods', 'implements keyword', 'Multiple allowed', 'Contract for classes']
          },
          {
            term: 'static Keyword',
            definition: 'Makes a member belong to the class itself rather than to instances. Shared across all objects.',
            example: 'static int count = 0;\nstatic void printCount() {}',
            keyFeatures: ['Class-level', 'Shared by all instances', 'No this reference', 'Memory efficient']
          },
          {
            term: 'java.lang Package',
            definition: 'The core Java package that is automatically imported into every Java program. Contains String, System, Math, etc.',
            example: '// Automatically available:\nString s = "hello";\nMath.abs(-5);',
            keyFeatures: ['Auto-imported', 'Contains String, System', 'Math, Object classes', 'Core functionality']
          },
          {
            term: 'try-catch Block',
            definition: 'Exception handling mechanism. Code that might throw an exception goes in try, handling logic in catch.',
            example: 'try {\n    int result = 10 / 0;\n} catch (ArithmeticException e) {\n    System.out.println("Error: " + e);\n}',
            keyFeatures: ['Exception handling', 'try block for risky code', 'catch handles errors', 'finally for cleanup']
          },
          {
            term: 'Enhanced for Loop',
            definition: 'A simplified for loop for iterating over arrays or collections. Also called for-each loop.',
            example: 'String[] names = {"Alice", "Bob"};\nfor (String name : names) {\n    System.out.println(name);\n}',
            keyFeatures: ['Simpler syntax', 'for-each style', 'Works on arrays/collections', 'No index variable']
          },
          {
            term: 'Creating Objects (new)',
            definition: 'The new keyword creates a new instance of a class by calling its constructor.',
            example: 'Car myCar = new Car();\nArrayList<String> list = new ArrayList<>();',
            keyFeatures: ['new keyword', 'Calls constructor', 'Returns reference', 'Allocates memory']
          }
        ]
      },
      {
        id: 'concepts',
        name: 'Programming Concepts',
        content: [
          {
            term: 'Variables',
            definition: 'Named storage locations in memory that hold values. Variables have a type, name, and value that can change during program execution.',
            example: 'age = 25  # Python\nint age = 25;  // Java'
          },
          {
            term: 'Functions/Methods',
            definition: 'Reusable blocks of code that perform a specific task. They can accept inputs (parameters) and return outputs (return values).',
            example: 'def greet(name):\n    return f"Hello, {name}!"'
          },
          {
            term: 'Loops',
            definition: 'Control structures that repeat a block of code multiple times. Common types include for loops, while loops, and do-while loops.',
            example: 'for i in range(5):\n    print(i)'
          },
          {
            term: 'Conditionals',
            definition: 'Statements that execute different code based on whether a condition is true or false. Includes if, else if, and else statements.',
            example: 'if score >= 90:\n    grade = "A"\nelse:\n    grade = "B"'
          },
          {
            term: 'Arrays/Lists',
            definition: 'Data structures that store multiple values in a single variable. Elements are accessed by their index (position).',
            example: 'fruits = ["apple", "banana", "orange"]'
          },
          {
            term: 'Object-Oriented Programming (OOP)',
            definition: 'A programming paradigm based on the concept of objects, which contain data (attributes) and code (methods). Key principles include encapsulation, inheritance, and polymorphism.',
            example: 'class Dog:\n    def __init__(self, name):\n        self.name = name\n    def bark(self):\n        print("Woof!")'
          }
        ]
      },
      {
        id: 'sdlc',
        name: 'Software Development Life Cycle (SDLC)',
        content: [
          {
            term: 'Planning',
            definition: 'The initial phase where project goals, scope, purpose, and procedures are determined. Includes feasibility studies and resource allocation.',
            keyFeatures: ['Define objectives', 'Identify stakeholders', 'Create project plan', 'Risk assessment']
          },
          {
            term: 'Requirements Analysis',
            definition: 'Gathering and documenting what the software should do. Involves working with stakeholders to understand their needs and expectations.',
            keyFeatures: ['Functional requirements', 'Non-functional requirements', 'User stories', 'Use cases']
          },
          {
            term: 'Design',
            definition: 'Creating the architecture and detailed design of the software. Includes system design, database design, and UI/UX design.',
            keyFeatures: ['System architecture', 'Database schema', 'API design', 'User interface mockups']
          },
          {
            term: 'Implementation/Coding',
            definition: 'The actual development phase where code is written according to the design specifications. Includes unit testing and code reviews.',
            keyFeatures: ['Write code', 'Follow coding standards', 'Version control', 'Code review']
          },
          {
            term: 'Testing',
            definition: 'Verifying that the software works correctly and meets requirements. Includes various types of testing like unit, integration, and user acceptance testing.',
            keyFeatures: ['Unit testing', 'Integration testing', 'System testing', 'Bug fixing']
          },
          {
            term: 'Deployment',
            definition: 'Releasing the software to users. Can be done in stages (beta, production) and includes setting up servers and infrastructure.',
            keyFeatures: ['Release management', 'Environment setup', 'User training', 'Documentation']
          },
          {
            term: 'Maintenance',
            definition: 'Ongoing support and updates after deployment. Includes bug fixes, performance improvements, and new feature development.',
            keyFeatures: ['Bug fixes', 'Updates', 'Performance optimization', 'User support']
          }
        ]
      }
    ]
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    icon: '🔐',
    color: '#d32f2f',
    description: 'Security concepts, threats, and best practices',
    subcategories: [
      {
        id: 'owasp',
        name: 'OWASP Top 10',
        content: [
          {
            term: 'Broken Access Control',
            definition: 'When users can act outside their intended permissions. This can allow unauthorized access to other users\' data or admin functions.',
            keyFeatures: ['Principle of least privilege', 'Deny by default', 'Rate limiting', 'Logging access failures']
          },
          {
            term: 'Cryptographic Failures',
            definition: 'Failures related to cryptography that often lead to sensitive data exposure. Includes weak algorithms, improper key management, and lack of encryption.',
            keyFeatures: ['Use strong encryption', 'Secure key storage', 'HTTPS everywhere', 'Don\'t store unnecessary data']
          },
          {
            term: 'Injection',
            definition: 'When untrusted data is sent to an interpreter as part of a command or query. SQL injection, NoSQL injection, and command injection are common types.',
            keyFeatures: ['Parameterized queries', 'Input validation', 'Escape special characters', 'Use ORMs']
          },
          {
            term: 'Insecure Design',
            definition: 'Flaws in the design and architecture of an application. No amount of implementation security can fix an insecure design.',
            keyFeatures: ['Threat modeling', 'Secure design patterns', 'Reference architectures', 'Security requirements']
          },
          {
            term: 'Security Misconfiguration',
            definition: 'Improperly configured security settings, default credentials, unnecessary features enabled, or missing security hardening.',
            keyFeatures: ['Remove defaults', 'Disable unused features', 'Update regularly', 'Automated configuration']
          },
          {
            term: 'Vulnerable Components',
            definition: 'Using components with known vulnerabilities. This includes libraries, frameworks, and other software modules.',
            keyFeatures: ['Regular updates', 'Monitor CVEs', 'Dependency scanning', 'Remove unused dependencies']
          },
          {
            term: 'Authentication Failures',
            definition: 'Weaknesses in authentication mechanisms that allow attackers to compromise passwords, keys, or session tokens.',
            keyFeatures: ['Multi-factor auth', 'Strong passwords', 'Session management', 'Account lockout']
          },
          {
            term: 'Software & Data Integrity Failures',
            definition: 'Code and infrastructure that does not protect against integrity violations. Includes insecure CI/CD pipelines and auto-updates.',
            keyFeatures: ['Digital signatures', 'Integrity verification', 'Secure CI/CD', 'Trusted repositories']
          },
          {
            term: 'Security Logging & Monitoring Failures',
            definition: 'Insufficient logging, detection, monitoring, and active response. Makes it difficult to detect and respond to attacks.',
            keyFeatures: ['Comprehensive logging', 'Alerting', 'Incident response', 'Log integrity']
          },
          {
            term: 'Server-Side Request Forgery (SSRF)',
            definition: 'When an attacker can make a server-side application make requests to unintended locations, potentially accessing internal services.',
            keyFeatures: ['Validate URLs', 'Whitelist allowed domains', 'Network segmentation', 'Disable redirects']
          }
        ]
      },
      {
        id: 'threats',
        name: 'Common Threats',
        content: [
          {
            term: 'Malware',
            definition: 'Malicious software designed to damage, disrupt, or gain unauthorized access to systems. Includes viruses, worms, trojans, and ransomware.',
            keyFeatures: ['Antivirus software', 'Regular scans', 'Email filtering', 'User education']
          },
          {
            term: 'Phishing',
            definition: 'Social engineering attacks that trick users into revealing sensitive information or installing malware, typically through deceptive emails or websites.',
            keyFeatures: ['Email authentication', 'Security awareness', 'URL verification', 'Report suspicious emails']
          },
          {
            term: 'DDoS Attack',
            definition: 'Distributed Denial of Service attack that overwhelms systems with traffic from multiple sources, making services unavailable.',
            keyFeatures: ['Traffic filtering', 'CDN protection', 'Rate limiting', 'Redundancy']
          },
          {
            term: 'Man-in-the-Middle (MITM)',
            definition: 'An attack where the attacker secretly intercepts and potentially alters communication between two parties who believe they are communicating directly.',
            keyFeatures: ['Use HTTPS', 'Certificate pinning', 'VPN usage', 'Public Wi-Fi caution']
          },
          {
            term: 'Social Engineering',
            definition: 'Psychological manipulation of people into performing actions or divulging confidential information. Goes beyond just phishing.',
            keyFeatures: ['Security training', 'Verification procedures', 'Healthy skepticism', 'Clear reporting process']
          }
        ]
      },
      {
        id: 'bestpractices',
        name: 'Security Best Practices',
        content: [
          {
            term: 'Password Security',
            definition: 'The practice of creating and managing strong, unique passwords for all accounts to protect against unauthorized access.',
            example: 'Strong: Tr0ub4dor&3 (mixed case, numbers, symbols, 12+ chars)\nWeak: password123, admin',
            keyFeatures: ['Long & complex', 'Unique per account', 'Password manager', 'MFA enabled']
          },
          {
            term: 'Regular Updates',
            definition: 'Keeping all software, operating systems, and applications up to date with the latest security patches.',
            keyFeatures: ['Automatic updates', 'Patch management', 'Update schedule', 'Test before deploy']
          },
          {
            term: 'Backup Strategy',
            definition: 'Regularly backing up important data following the 3-2-1 rule: 3 copies, 2 different media types, 1 offsite. Critical for preventing data loss.',
            keyFeatures: ['Regular backups', 'Test restoration', 'Encrypted backups', 'Offsite storage']
          },
          {
            term: 'Principle of Least Privilege',
            definition: 'Users and programs should only have the minimum level of access necessary to perform their functions.',
            keyFeatures: ['Minimal permissions', 'Role-based access', 'Regular audits', 'Time-limited access']
          }
        ]
      },
      {
        id: 'fundamentals',
        name: 'Security Fundamentals',
        content: [
          {
            term: 'Firewall',
            definition: 'A network security device that monitors and controls incoming and outgoing network traffic based on predetermined security rules.',
            keyFeatures: ['Traffic filtering', 'Rule-based', 'Network boundary', 'Hardware or software']
          },
          {
            term: 'Encryption',
            definition: 'The process of converting readable data (plaintext) into an unreadable format (ciphertext) that can only be decoded with a specific key.',
            keyFeatures: ['Scrambles data', 'Requires key to decrypt', 'Protects confidentiality', 'AES, RSA common']
          },
          {
            term: 'Ransomware',
            definition: 'A type of malicious software that encrypts the victim\'s files and demands payment (ransom) to restore access to the data.',
            keyFeatures: ['Encrypts files', 'Demands payment', 'Often via phishing', 'Backups are defense']
          },
          {
            term: 'Multi-Factor Authentication (MFA)',
            definition: 'A security method requiring two or more verification factors: something you know (password), something you have (phone/token), something you are (biometrics).',
            keyFeatures: ['Multiple factors', 'Knowledge + possession + biometrics', 'Much more secure', 'SMS or authenticator app']
          },
          {
            term: 'Zero-Day Vulnerability',
            definition: 'A software security flaw unknown to those who should be interested in fixing it, including the vendor. "Zero days" to fix before exploitation.',
            keyFeatures: ['Unknown to vendor', 'No patch available', 'Highly valuable to attackers', 'Zero days to prepare']
          },
          {
            term: 'VPN (Virtual Private Network)',
            definition: 'A service that creates a secure, encrypted connection over a less secure network, protecting data privacy and masking IP address.',
            keyFeatures: ['Encrypted tunnel', 'Hides IP address', 'Secure remote access', 'Bypasses geo-restrictions']
          },
          {
            term: 'Network Packet',
            definition: 'A small unit of data transmitted over a network. Contains both the data payload and header information (source, destination, etc.).',
            keyFeatures: ['Data unit', 'Has header + payload', 'Routed independently', 'Reassembled at destination']
          },
          {
            term: 'Cyber Kill Chain',
            definition: 'A framework describing the stages of a cyber attack: Reconnaissance, Weaponization, Delivery, Exploitation, Installation, Command & Control, Actions on Objectives.',
            keyFeatures: ['Attack stages', 'Reconnaissance first', 'Delivery via email/web', 'Exploitation follows']
          },
          {
            term: 'Penetration Testing',
            definition: 'Authorized simulated attacks on computer systems to evaluate security. Tools like Metasploit are commonly used.',
            keyFeatures: ['Authorized testing', 'Finds vulnerabilities', 'Metasploit tool', 'Red team activity']
          },
          {
            term: 'SQL Injection',
            definition: 'An attack that inserts malicious SQL code into application queries, potentially accessing or modifying database data.',
            keyFeatures: ['Database attack', 'Malicious input', 'Use parameterized queries', 'Input validation']
          },
          {
            term: 'Brute Force Attack',
            definition: 'An attack method that systematically tries all possible passwords or keys until the correct one is found.',
            keyFeatures: ['Trial and error', 'Time-consuming', 'Account lockout defense', 'Strong passwords help']
          },
          {
            term: 'Cross-Site Scripting (XSS)',
            definition: 'A vulnerability that allows attackers to inject malicious scripts into web pages viewed by other users.',
            keyFeatures: ['Injects scripts', 'Runs in browser', 'Steals sessions/data', 'Sanitize input']
          },
          {
            term: 'Digital Signature/Checksum',
            definition: 'Cryptographic methods to verify the authenticity and integrity of digital messages or documents.',
            keyFeatures: ['Verifies authenticity', 'Detects tampering', 'Non-repudiation', 'Used in software updates']
          }
        ]
      }
    ]
  },
  {
    id: 'networking',
    name: 'Networking',
    icon: '🌐',
    color: '#1976d2',
    description: 'Network fundamentals, protocols, and infrastructure',
    subcategories: [
      {
        id: 'basics',
        name: 'Network Basics',
        content: [
          {
            term: 'IP Address',
            definition: 'A unique numerical identifier assigned to each device on a network. IPv4 uses 32 bits (e.g., 192.168.1.1), while IPv6 uses 128 bits.',
            keyFeatures: ['Identifies devices', 'IPv4 vs IPv6', 'Public vs Private', 'Static vs Dynamic']
          },
          {
            term: 'MAC Address',
            definition: 'Media Access Control address - a unique hardware identifier assigned to network interface cards. Used for communication within a local network.',
            keyFeatures: ['Hardware address', '48-bit identifier', 'Unique per NIC', 'Used in LAN']
          },
          {
            term: 'DNS (Domain Name System)',
            definition: 'The internet\'s phone book - translates human-readable domain names (like google.com) into IP addresses that computers can understand.',
            keyFeatures: ['Name resolution', 'Hierarchical', 'Caching', 'DNS records (A, CNAME, MX)']
          },
          {
            term: 'DHCP (Dynamic Host Configuration Protocol)',
            definition: 'A protocol that automatically assigns IP addresses and other network configuration to devices when they connect to a network.',
            keyFeatures: ['Automatic IP assignment', 'Lease time', 'IP pool management', 'Reduces manual config']
          },
          {
            term: 'Subnet',
            definition: 'A logical subdivision of an IP network. Subnetting improves network performance and security by dividing large networks into smaller segments.',
            keyFeatures: ['Network segmentation', 'Subnet mask', 'CIDR notation', 'Improved security']
          }
        ]
      },
      {
        id: 'protocols',
        name: 'Network Protocols',
        content: [
          {
            term: 'TCP (Transmission Control Protocol)',
            definition: 'A connection-oriented protocol that ensures reliable, ordered delivery of data. Used for web browsing, email, file transfers.',
            keyFeatures: ['Reliable delivery', 'Error checking', 'Ordered packets', 'Connection-oriented']
          },
          {
            term: 'UDP (User Datagram Protocol)',
            definition: 'A connectionless protocol that sends data without establishing a connection. Faster but less reliable than TCP. Used for streaming, gaming.',
            keyFeatures: ['Fast', 'No connection setup', 'No guarantee', 'Good for real-time']
          },
          {
            term: 'HTTP/HTTPS',
            definition: 'Hypertext Transfer Protocol (Secure) - the foundation of data communication on the web. HTTPS adds encryption via TLS/SSL.',
            keyFeatures: ['Web communication', 'Request/Response', 'Stateless', 'HTTPS = encrypted']
          },
          {
            term: 'FTP/SFTP',
            definition: 'File Transfer Protocol - used to transfer files between computers. SFTP adds security through SSH encryption.',
            keyFeatures: ['File transfer', 'Client-server', 'SFTP is secure', 'Port 21 (FTP) / 22 (SFTP)']
          },
          {
            term: 'SSH (Secure Shell)',
            definition: 'A cryptographic network protocol for secure communication over an unsecured network. Used for remote server access and file transfers.',
            keyFeatures: ['Encrypted connection', 'Remote access', 'Key authentication', 'Port 22']
          }
        ]
      },
      {
        id: 'osi',
        name: 'OSI Model',
        content: [
          {
            term: 'Layer 1: Physical',
            definition: 'The physical connection between devices - cables, switches, NICs. Deals with raw bit transmission over physical media.',
            keyFeatures: ['Cables', 'Signals', 'Connectors', 'Hub']
          },
          {
            term: 'Layer 2: Data Link',
            definition: 'Handles node-to-node data transfer. Includes MAC addressing, error detection, and frame synchronization.',
            keyFeatures: ['MAC addresses', 'Switches', 'Frames', 'Error detection']
          },
          {
            term: 'Layer 3: Network',
            definition: 'Handles routing of data packets between different networks. IP addressing and routing decisions happen here.',
            keyFeatures: ['IP addresses', 'Routers', 'Packets', 'Routing']
          },
          {
            term: 'Layer 4: Transport',
            definition: 'Provides end-to-end communication services. TCP and UDP operate at this layer.',
            keyFeatures: ['TCP/UDP', 'Ports', 'Segments', 'Flow control']
          },
          {
            term: 'Layer 5: Session',
            definition: 'Manages sessions between applications. Handles setup, coordination, and termination of connections.',
            keyFeatures: ['Session management', 'Authentication', 'Synchronization', 'Dialog control']
          },
          {
            term: 'Layer 6: Presentation',
            definition: 'Translates data between the application layer and the network. Handles encryption, compression, and data formatting.',
            keyFeatures: ['Encryption', 'Compression', 'Data formatting', 'Character encoding']
          },
          {
            term: 'Layer 7: Application',
            definition: 'The layer closest to the end user. Provides network services directly to user applications (HTTP, FTP, SMTP).',
            keyFeatures: ['HTTP, FTP, SMTP', 'User interface', 'Application protocols', 'End-user layer']
          }
        ]
      }
    ]
  },
  {
    id: 'robotics',
    name: 'Robotics & Hardware',
    icon: '🤖',
    color: '#388e3c',
    description: 'Raspberry Pi, Arduino, circuit boards, and electronics',
    subcategories: [
      {
        id: 'raspberrypi',
        name: 'Raspberry Pi',
        content: [
          {
            term: 'Raspberry Pi',
            definition: 'A small, affordable single-board computer developed by the Raspberry Pi Foundation. Used for learning programming, building projects, and prototyping.',
            keyFeatures: ['Linux-based', 'GPIO pins', 'Low cost', 'Great for learning']
          },
          {
            term: 'GPIO (General Purpose Input/Output)',
            definition: 'Pins on the Raspberry Pi that can be programmed to send or receive electrical signals. Used to connect sensors, LEDs, motors, and other components.',
            keyFeatures: ['40-pin header', 'Digital I/O', 'PWM support', 'I2C, SPI, UART']
          },
          {
            term: 'Raspbian/Raspberry Pi OS',
            definition: 'The official operating system for Raspberry Pi, based on Debian Linux. Comes with programming tools and educational software pre-installed.',
            keyFeatures: ['Debian-based', 'Free', 'Pre-configured', 'Educational tools']
          },
          {
            term: 'Common Pi Projects',
            definition: 'Popular projects include: media centers (Kodi), retro gaming (RetroPie), web servers, home automation, weather stations, and robot controllers.',
            keyFeatures: ['Media center', 'Retro gaming', 'IoT projects', 'Learning platform']
          }
        ]
      },
      {
        id: 'arduino',
        name: 'Arduino',
        content: [
          {
            term: 'Arduino',
            definition: 'An open-source electronics platform based on easy-to-use hardware and software. Great for creating interactive electronic projects.',
            keyFeatures: ['Microcontroller', 'Open source', 'Easy to use', 'Large community']
          },
          {
            term: 'Arduino IDE',
            definition: 'The Integrated Development Environment for writing and uploading code to Arduino boards. Uses a simplified version of C++.',
            keyFeatures: ['Code editor', 'Serial monitor', 'Library manager', 'Board manager']
          },
          {
            term: 'Sketch',
            definition: 'The name for an Arduino program. Contains two main functions: setup() (runs once at start) and loop() (runs repeatedly).',
            example: 'void setup() {\n  pinMode(LED_BUILTIN, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(LED_BUILTIN, HIGH);\n  delay(1000);\n  digitalWrite(LED_BUILTIN, LOW);\n  delay(1000);\n}'
          },
          {
            term: 'Common Arduino Projects',
            definition: 'Popular projects include: LED controllers, temperature monitors, robot cars, automatic plant watering, line followers, and musical instruments.',
            keyFeatures: ['LED projects', 'Sensor reading', 'Motor control', 'IoT devices']
          }
        ]
      },
      {
        id: 'electronics',
        name: 'Basic Electronics',
        content: [
          {
            term: 'Voltage (V)',
            definition: 'The electrical potential difference between two points. Measured in volts (V). Think of it as the "pressure" pushing electrons through a circuit.',
            keyFeatures: ['Measured in Volts', 'Potential difference', '"Electrical pressure"', 'V = IR']
          },
          {
            term: 'Current (I)',
            definition: 'The flow of electrical charge through a circuit. Measured in amperes (A). Think of it as the "amount" of electricity flowing.',
            keyFeatures: ['Measured in Amps', 'Electron flow', '"Electrical flow"', 'I = V/R']
          },
          {
            term: 'Resistance (R)',
            definition: 'The opposition to the flow of current. Measured in ohms (Ω). Resistors are used to limit current and divide voltage.',
            keyFeatures: ['Measured in Ohms', 'Limits current', 'Resistors', 'R = V/I']
          },
          {
            term: 'Ohm\'s Law',
            definition: 'The fundamental equation relating voltage, current, and resistance: V = I × R. Essential for calculating values in electronic circuits.',
            keyFeatures: ['V = I × R', 'I = V / R', 'R = V / I', 'Foundation of electronics']
          },
          {
            term: 'LED (Light Emitting Diode)',
            definition: 'A semiconductor device that emits light when current flows through it. Has a positive (anode) and negative (cathode) terminal.',
            keyFeatures: ['Needs resistor', 'Polarity matters', 'Low power', 'Various colors']
          },
          {
            term: 'Breadboard',
            definition: 'A reusable platform for building and testing electronic circuits without soldering. Holes are connected in specific patterns.',
            keyFeatures: ['Prototyping', 'No soldering', 'Reusable', 'Connected rows']
          }
        ]
      },
      {
        id: 'logicgates',
        name: 'Logic Gates',
        content: [
          {
            term: 'AND Gate',
            definition: 'Output is 1 (HIGH) only when ALL inputs are 1. Truth table: 0 AND 0 = 0, 0 AND 1 = 0, 1 AND 0 = 0, 1 AND 1 = 1',
            example: 'A && B in programming',
            keyFeatures: ['Both must be true', 'Multiplication logic', 'Symbol: flat bottom']
          },
          {
            term: 'OR Gate',
            definition: 'Output is 1 (HIGH) when ANY input is 1. Truth table: 0 OR 0 = 0, 0 OR 1 = 1, 1 OR 0 = 1, 1 OR 1 = 1',
            example: 'A || B in programming',
            keyFeatures: ['Either can be true', 'Addition logic', 'Symbol: curved bottom']
          },
          {
            term: 'NOT Gate (Inverter)',
            definition: 'Inverts the input. Output is opposite of input. NOT 0 = 1, NOT 1 = 0',
            example: '!A in programming',
            keyFeatures: ['Single input', 'Inverts signal', 'Symbol: triangle with circle']
          },
          {
            term: 'NAND Gate',
            definition: 'Opposite of AND gate. Output is 0 only when ALL inputs are 1. Can be used to build any other logic gate.',
            example: '!(A && B) in programming',
            keyFeatures: ['NOT + AND', 'Universal gate', 'Very common in ICs']
          },
          {
            term: 'NOR Gate',
            definition: 'Opposite of OR gate. Output is 1 only when ALL inputs are 0.',
            example: '!(A || B) in programming',
            keyFeatures: ['NOT + OR', 'Universal gate', 'All inputs must be 0']
          },
          {
            term: 'XOR Gate (Exclusive OR)',
            definition: 'Output is 1 when inputs are DIFFERENT. 0 XOR 0 = 0, 0 XOR 1 = 1, 1 XOR 0 = 1, 1 XOR 1 = 0',
            example: 'A ^ B in programming',
            keyFeatures: ['Inputs must differ', 'Used in encryption', 'Toggle operations']
          }
        ]
      },
      {
        id: 'robotics_fundamentals',
        name: 'Robotics Fundamentals',
        content: [
          {
            term: 'Actuator',
            definition: 'A device that converts energy (electrical, hydraulic, pneumatic) into motion. Examples include motors, solenoids, and pneumatic cylinders.',
            keyFeatures: ['Converts energy to motion', 'Motors are actuators', 'Opposite of sensors', 'Creates physical action']
          },
          {
            term: 'Ultrasonic Sensor',
            definition: 'A sensor that measures distance using sound waves. Emits high-frequency sound and measures the time for the echo to return.',
            keyFeatures: ['Uses sound waves', 'Measures distance', 'Good for obstacles', 'HC-SR04 common model']
          },
          {
            term: 'Degrees of Freedom (DOF)',
            definition: 'The number of independent movements a robot or mechanism can make. A 6-DOF arm can move in 6 independent ways.',
            keyFeatures: ['Independent movements', 'Robot arm flexibility', '6-DOF is common', 'More DOF = more versatile']
          },
          {
            term: 'End Effector',
            definition: 'The device at the end of a robotic arm that interacts with the environment. Examples: grippers, welders, suction cups, tools.',
            keyFeatures: ['End of robot arm', 'Grippers common', 'Task-specific', 'Interacts with objects']
          },
          {
            term: 'Servo Motor',
            definition: 'A motor that can be precisely controlled for position (angle), velocity, and acceleration. Commonly used for robot joints and RC vehicles.',
            keyFeatures: ['Precise control', 'Position feedback', 'Set specific angles', 'PWM controlled']
          },
          {
            term: 'LIDAR',
            definition: 'Light Detection and Ranging - a sensor that uses laser light to measure distances and create detailed 3D maps of the environment.',
            keyFeatures: ['Uses laser light', '3D mapping', 'Self-driving cars', 'High precision']
          },
          {
            term: 'PWM (Pulse Width Modulation)',
            definition: 'A technique for controlling power to devices by rapidly switching between on and off states. Duty cycle controls average power.',
            keyFeatures: ['Controls motor speed', 'LED brightness', 'Duty cycle %', 'Digital signal analog effect']
          },
          {
            term: 'Autonomous Robot',
            definition: 'A robot that can perform tasks and make decisions without human intervention, using sensors, processors, and algorithms.',
            keyFeatures: ['No human control', 'Uses AI/algorithms', 'Sensor-based decisions', 'Self-driving example']
          },
          {
            term: 'Digital GPIO Pin',
            definition: 'A General Purpose Input/Output pin that handles only On/Off (HIGH/LOW) signals. Used for buttons, LEDs, digital sensors.',
            keyFeatures: ['On or Off only', 'Digital signals', 'HIGH = 1, LOW = 0', 'No intermediate values']
          },
          {
            term: 'E-Stop (Emergency Stop)',
            definition: 'A safety mechanism, typically a large red button, that immediately halts all robot motion when pressed. Required for safety.',
            keyFeatures: ['Safety device', 'Stops all motion', 'Usually red button', 'Required by safety standards']
          },
          {
            term: 'Control Loop (Sense-Plan-Act)',
            definition: 'The fundamental cycle of robotics: Sense (input from environment), Plan (process data), Act (output to motors/actuators).',
            keyFeatures: ['Sense → Plan → Act', 'Continuous cycle', 'Core of autonomy', 'Feedback loop']
          },
          {
            term: 'Infrared Sensor',
            definition: 'A sensor that detects infrared light/heat. Used for proximity detection, line following, and remote controls.',
            keyFeatures: ['Detects IR light', 'Line following', 'Proximity sensing', 'Remote controls']
          },
          {
            term: 'Gyroscope',
            definition: 'A sensor that measures angular velocity (rotation speed). Used for balance, orientation, and navigation in robots.',
            keyFeatures: ['Measures rotation', 'Balance control', 'Orientation', 'Often paired with accelerometer']
          },
          {
            term: 'Motor Driver',
            definition: 'An electronic circuit that controls power delivery to motors. Allows microcontrollers to safely control high-power motors.',
            keyFeatures: ['Power control', 'H-bridge common', 'Protects microcontroller', 'Direction control']
          },
          {
            term: 'Microcontroller',
            definition: 'A compact integrated circuit designed to govern a specific operation in an embedded system. The "brain" of robots like Arduino.',
            keyFeatures: ['Small computer', 'Runs program', 'Controls I/O', 'Arduino, ESP32 examples']
          }
        ]
      }
    ]
  },
  {
    id: 'databases',
    name: 'Databases',
    icon: '🗄️',
    color: '#7b1fa2',
    description: 'Database concepts, SQL, and data management',
    subcategories: [
      {
        id: 'concepts',
        name: 'Database Concepts',
        content: [
          {
            term: 'Database',
            definition: 'An organized collection of structured information or data, typically stored electronically in a computer system.',
            keyFeatures: ['Organized data', 'Persistent storage', 'Query capability', 'Data integrity']
          },
          {
            term: 'Table',
            definition: 'A collection of related data organized in rows (records) and columns (fields). Each table represents a specific entity type.',
            keyFeatures: ['Rows = records', 'Columns = fields', 'Schema defined', 'Related data']
          },
          {
            term: 'Primary Key',
            definition: 'A unique identifier for each record in a table. No two rows can have the same primary key value.',
            keyFeatures: ['Unique', 'Not null', 'Identifies record', 'Often auto-increment']
          },
          {
            term: 'Foreign Key',
            definition: 'A field that refers to the primary key in another table, establishing a relationship between tables.',
            keyFeatures: ['Links tables', 'Referential integrity', 'Creates relationships', 'Can be null']
          },
          {
            term: 'Index',
            definition: 'A data structure that improves the speed of data retrieval operations. Like a book index, it helps find data quickly.',
            keyFeatures: ['Speeds up queries', 'Uses extra storage', 'Auto on primary keys', 'B-tree structure']
          }
        ]
      },
      {
        id: 'sql',
        name: 'SQL Basics',
        content: [
          {
            term: 'SELECT',
            definition: 'Retrieves data from one or more tables. The most commonly used SQL command.',
            example: 'SELECT name, age FROM users WHERE age > 18;'
          },
          {
            term: 'INSERT',
            definition: 'Adds new records (rows) to a table.',
            example: 'INSERT INTO users (name, age) VALUES (\'John\', 25);'
          },
          {
            term: 'UPDATE',
            definition: 'Modifies existing records in a table.',
            example: 'UPDATE users SET age = 26 WHERE name = \'John\';'
          },
          {
            term: 'DELETE',
            definition: 'Removes records from a table.',
            example: 'DELETE FROM users WHERE name = \'John\';'
          },
          {
            term: 'JOIN',
            definition: 'Combines rows from two or more tables based on a related column. Types include INNER, LEFT, RIGHT, and FULL joins.',
            example: 'SELECT users.name, orders.total FROM users INNER JOIN orders ON users.id = orders.user_id;'
          }
        ]
      },
      {
        id: 'types',
        name: 'Database Types',
        content: [
          {
            term: 'Relational Database (RDBMS)',
            definition: 'Stores data in tables with predefined schemas and relationships. Uses SQL for queries. Examples: MySQL, PostgreSQL, SQLite.',
            keyFeatures: ['Structured data', 'ACID compliant', 'SQL queries', 'Strong consistency']
          },
          {
            term: 'NoSQL Database',
            definition: 'Non-relational databases designed for specific data models. More flexible schemas. Examples: MongoDB, Redis, Cassandra.',
            keyFeatures: ['Flexible schema', 'Horizontal scaling', 'Various types', 'High performance']
          },
          {
            term: 'Document Database',
            definition: 'Stores data as documents (usually JSON). Each document is self-contained. Example: MongoDB.',
            keyFeatures: ['JSON/BSON format', 'Flexible structure', 'Easy to scale', 'Good for varied data']
          },
          {
            term: 'Key-Value Store',
            definition: 'Simple database that stores data as key-value pairs. Very fast for simple lookups. Example: Redis.',
            keyFeatures: ['Simple structure', 'Very fast', 'Caching use', 'Limited queries']
          }
        ]
      }
    ]
  },
  {
    id: 'webdev',
    name: 'Web Development',
    icon: '🌍',
    color: '#ff5722',
    description: 'Frontend, backend, and full-stack web development',
    subcategories: [
      {
        id: 'frontend',
        name: 'Frontend Technologies',
        content: [
          {
            term: 'HTML (HyperText Markup Language)',
            definition: 'The standard markup language for creating web pages. Defines the structure and content of web pages.',
            example: '<html>\n  <head><title>Page</title></head>\n  <body><h1>Hello!</h1></body>\n</html>',
            keyFeatures: ['Page structure', 'Semantic elements', 'Forms', 'Links & media']
          },
          {
            term: 'CSS (Cascading Style Sheets)',
            definition: 'A styling language used to describe the presentation of HTML documents. Controls layout, colors, fonts, and more.',
            example: 'body {\n  background: #fff;\n  color: #333;\n  font-family: Arial;\n}',
            keyFeatures: ['Styling', 'Layout (Flexbox, Grid)', 'Responsive design', 'Animations']
          },
          {
            term: 'JavaScript',
            definition: 'A programming language that enables interactive and dynamic content on web pages. Essential for modern web applications.',
            example: 'document.getElementById("btn")\n  .addEventListener("click", () => {\n    alert("Clicked!");\n  });',
            keyFeatures: ['Interactivity', 'DOM manipulation', 'Event handling', 'AJAX requests']
          },
          {
            term: 'React',
            definition: 'A JavaScript library for building user interfaces, developed by Facebook. Uses components and virtual DOM for efficient rendering.',
            keyFeatures: ['Components', 'Virtual DOM', 'JSX syntax', 'State management']
          }
        ]
      },
      {
        id: 'backend',
        name: 'Backend Technologies',
        content: [
          {
            term: 'Server',
            definition: 'A computer or program that provides functionality to other programs or devices (clients). Handles requests and sends responses.',
            keyFeatures: ['Handles requests', 'Business logic', 'Data processing', 'API endpoints']
          },
          {
            term: 'API (Application Programming Interface)',
            definition: 'A set of rules and protocols that allows different software applications to communicate with each other.',
            keyFeatures: ['Endpoints', 'Request/Response', 'REST or GraphQL', 'JSON data']
          },
          {
            term: 'REST API',
            definition: 'Representational State Transfer - an architectural style for designing networked applications. Uses HTTP methods (GET, POST, PUT, DELETE).',
            keyFeatures: ['Stateless', 'HTTP methods', 'Resource-based', 'JSON responses']
          },
          {
            term: 'Node.js',
            definition: 'A JavaScript runtime built on Chrome\'s V8 engine. Allows running JavaScript on the server side.',
            keyFeatures: ['JavaScript backend', 'Non-blocking I/O', 'npm packages', 'Express.js']
          },
          {
            term: 'FastAPI',
            definition: 'A modern, fast Python web framework for building APIs. Used in this Quiz App! Features automatic documentation.',
            keyFeatures: ['Python', 'High performance', 'Auto docs', 'Type hints']
          }
        ]
      },
      {
        id: 'tools',
        name: 'Development Tools',
        content: [
          {
            term: 'Git',
            definition: 'A distributed version control system for tracking changes in code. Essential for collaboration and code management.',
            keyFeatures: ['Version control', 'Branching', 'Collaboration', 'History tracking']
          },
          {
            term: 'GitHub',
            definition: 'A web-based platform for hosting Git repositories. Provides collaboration features, issue tracking, and CI/CD.',
            keyFeatures: ['Repository hosting', 'Pull requests', 'Issues', 'Actions (CI/CD)']
          },
          {
            term: 'VS Code',
            definition: 'Visual Studio Code - a popular, free code editor by Microsoft. Highly extensible with plugins.',
            keyFeatures: ['Free', 'Extensions', 'IntelliSense', 'Integrated terminal']
          },
          {
            term: 'npm (Node Package Manager)',
            definition: 'The default package manager for Node.js. Used to install and manage JavaScript libraries and tools.',
            keyFeatures: ['Package management', 'package.json', 'Scripts', 'Dependencies']
          }
        ]
      }
    ]
  },
  {
    id: 'technology',
    name: 'Technology Fundamentals',
    icon: '🖥️',
    color: '#607d8b',
    description: 'Computer hardware, software, and general technology concepts',
    subcategories: [
      {
        id: 'hardware',
        name: 'Computer Hardware',
        content: [
          {
            term: 'CPU (Central Processing Unit)',
            definition: 'The "brain" of the computer that executes instructions and performs calculations. Measured in clock speed (GHz).',
            keyFeatures: ['Executes instructions', 'Measured in GHz', 'Multiple cores', 'Intel, AMD, ARM']
          },
          {
            term: 'RAM (Random Access Memory)',
            definition: 'Volatile memory that stores data currently being used by running programs. Faster than storage but loses data when powered off.',
            keyFeatures: ['Temporary storage', 'Fast access', 'Volatile (loses data)', 'Measured in GB']
          },
          {
            term: 'SSD (Solid State Drive)',
            definition: 'A storage device with no moving parts that is faster and more reliable than traditional Hard Disk Drives (HDD).',
            keyFeatures: ['No moving parts', 'Faster than HDD', 'More reliable', 'Flash memory']
          },
          {
            term: 'HDD (Hard Disk Drive)',
            definition: 'A traditional storage device using spinning magnetic platters. Cheaper per GB but slower and less reliable than SSD.',
            keyFeatures: ['Spinning platters', 'Cheaper storage', 'Slower than SSD', 'Moving parts can fail']
          },
          {
            term: 'GPU (Graphics Processing Unit)',
            definition: 'A specialized processor designed for rendering graphics and parallel processing tasks like AI/ML.',
            keyFeatures: ['Graphics rendering', 'Parallel processing', 'AI/ML workloads', 'NVIDIA, AMD']
          },
          {
            term: 'Motherboard',
            definition: 'The main circuit board that connects all computer components together, including CPU, RAM, and storage.',
            keyFeatures: ['Connects components', 'Contains chipset', 'Expansion slots', 'BIOS/UEFI']
          }
        ]
      },
      {
        id: 'software',
        name: 'Software & Operating Systems',
        content: [
          {
            term: 'Operating System (OS)',
            definition: 'Software that manages computer hardware and provides services for programs. Examples: Windows, macOS, Linux.',
            keyFeatures: ['Manages hardware', 'Runs applications', 'File management', 'User interface']
          },
          {
            term: 'Linux',
            definition: 'A free, open-source operating system kernel. Many distributions exist (Ubuntu, Fedora, Debian). Popular for servers.',
            keyFeatures: ['Open source', 'Free', 'Many distributions', 'Server dominant']
          },
          {
            term: 'Binary (Base 2)',
            definition: 'The fundamental number system used by computers, using only 0s and 1s. All data is ultimately stored in binary.',
            example: 'Decimal 1 = Binary 01\nDecimal 5 = Binary 101\nDecimal 10 = Binary 1010',
            keyFeatures: ['0s and 1s only', 'Computer native', 'Bit = 1 digit', 'Byte = 8 bits']
          },
          {
            term: 'Version Control System',
            definition: 'Software that tracks changes to files over time, allowing collaboration and reverting to previous versions. Git is the most popular.',
            keyFeatures: ['Tracks changes', 'Collaboration', 'Git most common', 'Branching support']
          }
        ]
      },
      {
        id: 'storage_units',
        name: 'Storage Units',
        content: [
          {
            term: 'Bit',
            definition: 'The smallest unit of data in computing, representing a single binary digit (0 or 1).',
            keyFeatures: ['Smallest unit', 'Binary digit', '0 or 1', '8 bits = 1 byte']
          },
          {
            term: 'Byte',
            definition: 'A unit of digital information consisting of 8 bits. The basic unit for measuring file sizes.',
            keyFeatures: ['8 bits', 'Basic file unit', 'One character', 'Building block']
          },
          {
            term: 'Kilobyte (KB)',
            definition: 'Approximately 1,000 bytes (1,024 bytes exactly). Small text files are measured in KB.',
            keyFeatures: ['~1,000 bytes', 'Small files', 'Text documents', '1,024 bytes exactly']
          },
          {
            term: 'Megabyte (MB)',
            definition: 'Approximately 1,000 KB or 1 million bytes. Music files and images are typically measured in MB.',
            keyFeatures: ['~1,000 KB', 'Music/images', 'MP3s typically', '1,024 KB exactly']
          },
          {
            term: 'Gigabyte (GB)',
            definition: 'Approximately 1,000 MB or 1 billion bytes. RAM, videos, and apps are typically measured in GB.',
            keyFeatures: ['~1,000 MB', 'RAM, videos', 'App sizes', '1,024 MB exactly']
          },
          {
            term: 'Terabyte (TB)',
            definition: 'Approximately 1,000 GB or 1 trillion bytes. Hard drives and large storage are measured in TB.',
            keyFeatures: ['~1,000 GB', 'Hard drives', 'Large storage', '1,024 GB exactly']
          }
        ]
      },
      {
        id: 'computing_cycle',
        name: 'Computing Fundamentals',
        content: [
          {
            term: 'Input-Processing-Output-Storage (IPOS)',
            definition: 'The basic computing processing cycle: Input (receive data), Processing (manipulate data), Output (display results), Storage (save data).',
            keyFeatures: ['Input devices (keyboard)', 'CPU processes', 'Output devices (monitor)', 'Storage (disk)']
          },
          {
            term: 'Algorithm',
            definition: 'A step-by-step procedure or set of rules for solving a problem or accomplishing a task.',
            keyFeatures: ['Step-by-step', 'Problem solving', 'Finite steps', 'Unambiguous']
          },
          {
            term: 'Compiler',
            definition: 'A program that translates source code written in a programming language into machine code that a computer can execute.',
            keyFeatures: ['Translates code', 'Creates executable', 'Catches errors', 'One-time process']
          },
          {
            term: 'Interpreter',
            definition: 'A program that executes source code line by line without prior compilation. Python and JavaScript use interpreters.',
            keyFeatures: ['Line by line', 'No compilation', 'Python, JS', 'Slower execution']
          }
        ]
      }
    ]
  },
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    icon: '🤖',
    color: '#9c27b0',
    description: 'Artificial intelligence, machine learning, and data science concepts',
    subcategories: [
      {
        id: 'ai-basics',
        name: 'AI Fundamentals',
        content: [
          {
            term: 'Artificial Intelligence (AI)',
            definition: 'The simulation of human intelligence in machines programmed to think and learn like humans. AI systems can perform tasks like speech recognition, decision-making, and language translation.',
            keyFeatures: ['Mimics human intelligence', 'Learns from data', 'Makes decisions', 'Automates tasks']
          },
          {
            term: 'Machine Learning (ML)',
            definition: 'A subset of AI where computers learn from data without being explicitly programmed. The system improves its performance over time as it processes more data.',
            keyFeatures: ['Learns from data', 'Improves over time', 'Pattern recognition', 'Predictions']
          },
          {
            term: 'Neural Network',
            definition: 'A computing system inspired by biological neural networks in the brain. Consists of layers of interconnected nodes (neurons) that process information.',
            keyFeatures: ['Inspired by brain', 'Layers of nodes', 'Pattern recognition', 'Deep learning foundation']
          },
          {
            term: 'Deep Learning',
            definition: 'A subset of machine learning using neural networks with many layers (deep networks). Excels at image recognition, natural language processing, and complex pattern detection.',
            keyFeatures: ['Many layers', 'Complex patterns', 'Image/speech recognition', 'Requires large datasets']
          },
          {
            term: 'Training Data',
            definition: 'The dataset used to teach a machine learning model. The quality and quantity of training data directly affects model performance.',
            keyFeatures: ['Input for learning', 'Quality matters', 'Labeled or unlabeled', 'Represents real-world']
          },
          {
            term: 'Model',
            definition: 'The mathematical representation of a real-world process created by training on data. A trained model can make predictions on new, unseen data.',
            keyFeatures: ['Learned patterns', 'Makes predictions', 'Trained on data', 'Can be deployed']
          }
        ]
      },
      {
        id: 'ml-types',
        name: 'Types of Machine Learning',
        content: [
          {
            term: 'Supervised Learning',
            definition: 'Training with labeled data where the correct answers are provided. The model learns to map inputs to known outputs (e.g., classifying emails as spam or not spam).',
            example: 'Training a model with images labeled "cat" or "dog" to classify new images.',
            keyFeatures: ['Labeled data', 'Known outputs', 'Classification/Regression', 'Most common type']
          },
          {
            term: 'Unsupervised Learning',
            definition: 'Training with unlabeled data to find hidden patterns or groupings. The algorithm discovers structure in the data on its own.',
            example: 'Grouping customers by purchasing behavior without predefined categories.',
            keyFeatures: ['No labels', 'Finds patterns', 'Clustering', 'Dimensionality reduction']
          },
          {
            term: 'Reinforcement Learning',
            definition: 'Learning through trial and error with rewards and penalties. The agent learns to make decisions by performing actions and receiving feedback.',
            example: 'Training an AI to play chess by rewarding wins and penalizing losses.',
            keyFeatures: ['Rewards/penalties', 'Trial and error', 'Game playing', 'Robotics']
          },
          {
            term: 'Classification',
            definition: 'A supervised learning task that predicts categorical labels (discrete categories) for input data.',
            example: 'Is this email spam or not? Is this tumor malignant or benign?',
            keyFeatures: ['Discrete categories', 'Supervised task', 'Binary or multi-class', 'Examples: spam detection']
          },
          {
            term: 'Regression',
            definition: 'A supervised learning task that predicts continuous numerical values.',
            example: 'Predicting house prices based on features like size, location, and bedrooms.',
            keyFeatures: ['Continuous values', 'Numerical prediction', 'Price/temperature', 'Linear/polynomial']
          }
        ]
      },
      {
        id: 'ai-applications',
        name: 'AI Applications',
        content: [
          {
            term: 'Natural Language Processing (NLP)',
            definition: 'The branch of AI focused on enabling computers to understand, interpret, and generate human language.',
            keyFeatures: ['Text analysis', 'Chatbots', 'Translation', 'Sentiment analysis']
          },
          {
            term: 'Computer Vision',
            definition: 'The field of AI that enables computers to interpret and understand visual information from images and videos.',
            keyFeatures: ['Image recognition', 'Object detection', 'Facial recognition', 'Self-driving cars']
          },
          {
            term: 'Large Language Model (LLM)',
            definition: 'A type of AI trained on massive amounts of text data to understand and generate human-like text. Examples include GPT, Claude, and LLaMA.',
            keyFeatures: ['Trained on text', 'Generates responses', 'ChatGPT/Claude', 'Billions of parameters']
          },
          {
            term: 'Generative AI',
            definition: 'AI systems that can create new content including text, images, audio, and video. Learns patterns from training data to generate similar but original content.',
            keyFeatures: ['Creates content', 'Images/text/audio', 'DALL-E, Midjourney', 'Creative applications']
          },
          {
            term: 'Prompt Engineering',
            definition: 'The practice of designing and optimizing inputs (prompts) to get desired outputs from AI models, especially LLMs.',
            keyFeatures: ['Crafting inputs', 'Better outputs', 'Context matters', 'Emerging skill']
          }
        ]
      }
    ]
  },
  {
    id: 'software-engineering',
    name: 'Software Engineering & Career',
    icon: '👔',
    color: '#2196f3',
    description: 'Professional software development practices and career guidance',
    subcategories: [
      {
        id: 'dev-practices',
        name: 'Development Practices',
        content: [
          {
            term: 'Agile Development',
            definition: 'An iterative approach to software development that emphasizes flexibility, collaboration, and delivering working software in short cycles (sprints).',
            keyFeatures: ['Iterative', 'Flexible', 'Short sprints', 'Customer feedback']
          },
          {
            term: 'Scrum',
            definition: 'A popular Agile framework with defined roles (Scrum Master, Product Owner, Team), ceremonies (standups, sprints), and artifacts (backlog, board).',
            keyFeatures: ['Sprint cycles', 'Daily standups', 'Product backlog', 'Scrum Master role']
          },
          {
            term: 'Code Review',
            definition: 'The practice of having other developers examine code changes before they are merged. Catches bugs, ensures quality, and shares knowledge.',
            keyFeatures: ['Peer review', 'Quality assurance', 'Knowledge sharing', 'Pull requests']
          },
          {
            term: 'Technical Debt',
            definition: 'The implied cost of additional work caused by choosing quick solutions instead of better approaches. Like financial debt, it accumulates interest over time.',
            keyFeatures: ['Shortcuts cost later', 'Needs refactoring', 'Slows development', 'Should be managed']
          },
          {
            term: 'Refactoring',
            definition: 'Restructuring existing code without changing its external behavior. Improves code readability, reduces complexity, and makes maintenance easier.',
            keyFeatures: ['Improves structure', 'Same behavior', 'Reduces complexity', 'Ongoing process']
          },
          {
            term: 'CI/CD (Continuous Integration/Deployment)',
            definition: 'Practices that automate building, testing, and deploying code changes. CI merges code frequently; CD automatically deploys to production.',
            keyFeatures: ['Automated builds', 'Automated tests', 'Fast feedback', 'Frequent releases']
          }
        ]
      },
      {
        id: 'career',
        name: 'Career Paths',
        content: [
          {
            term: 'Frontend Developer',
            definition: 'A developer who specializes in building the user interface and user experience of websites and applications using HTML, CSS, and JavaScript.',
            keyFeatures: ['UI/UX focus', 'HTML/CSS/JS', 'React/Vue/Angular', 'Visual design']
          },
          {
            term: 'Backend Developer',
            definition: 'A developer who builds and maintains the server-side logic, databases, and APIs that power applications.',
            keyFeatures: ['Server-side', 'Databases', 'APIs', 'Python/Java/Node']
          },
          {
            term: 'Full-Stack Developer',
            definition: 'A developer skilled in both frontend and backend development, capable of building complete applications from start to finish.',
            keyFeatures: ['Both frontend/backend', 'Complete applications', 'Versatile', 'In high demand']
          },
          {
            term: 'DevOps Engineer',
            definition: 'A professional who bridges development and operations, focusing on automation, infrastructure, and deployment pipelines.',
            keyFeatures: ['Automation', 'Infrastructure', 'CI/CD pipelines', 'Cloud platforms']
          },
          {
            term: 'Data Scientist',
            definition: 'A professional who uses statistics, programming, and domain knowledge to extract insights from data and build predictive models.',
            keyFeatures: ['Data analysis', 'Machine learning', 'Statistics', 'Python/R']
          },
          {
            term: 'Software Architect',
            definition: 'A senior role responsible for high-level design decisions, technology choices, and overall system structure.',
            keyFeatures: ['System design', 'Technical decisions', 'Senior role', 'Big picture thinking']
          }
        ]
      },
      {
        id: 'soft-skills',
        name: 'Professional Skills',
        content: [
          {
            term: 'Technical Communication',
            definition: 'The ability to explain complex technical concepts clearly to both technical and non-technical audiences. Essential for documentation and collaboration.',
            keyFeatures: ['Clear explanations', 'Documentation', 'Presentations', 'Cross-team work']
          },
          {
            term: 'Problem Decomposition',
            definition: 'Breaking down complex problems into smaller, manageable pieces. A fundamental skill for tackling any programming challenge.',
            keyFeatures: ['Break down problems', 'Manageable pieces', 'Step by step', 'Core skill']
          },
          {
            term: 'Debugging',
            definition: 'The process of finding and fixing errors (bugs) in code. Involves reading error messages, using debugging tools, and systematic investigation.',
            keyFeatures: ['Find errors', 'Read error messages', 'Use debugger', 'Systematic approach']
          },
          {
            term: 'Version Control',
            definition: 'Systems like Git that track changes to code over time, enabling collaboration and the ability to revert to previous versions.',
            keyFeatures: ['Track changes', 'Collaboration', 'Git/GitHub', 'Branch/merge']
          },
          {
            term: 'Portfolio',
            definition: 'A collection of projects that demonstrates your skills to potential employers. Essential for landing your first tech job.',
            keyFeatures: ['Showcase projects', 'GitHub profile', 'Personal website', 'Job applications']
          },
          {
            term: 'Open Source',
            definition: 'Software whose source code is freely available for anyone to view, use, modify, and distribute. Contributing to open source is great for learning and networking.',
            keyFeatures: ['Free to use', 'Community driven', 'Great for learning', 'Build reputation']
          }
        ]
      }
    ]
  }
];

/**
 * Component for displaying a single term/definition
 */
function TermCard({ item }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`term-card ${expanded ? 'expanded' : ''}`}>
      <div 
        className="term-header"
        onClick={() => setExpanded(!expanded)}
      >
        <h4>{item.term}</h4>
        <span className="expand-icon">{expanded ? '−' : '+'}</span>
      </div>
      
      <div className={`term-content ${expanded ? 'show' : ''}`}>
        <p className="term-definition">{item.definition}</p>
        
        {item.example && (
          <div className="term-example">
            <strong>Example:</strong>
            <pre><code>{item.example}</code></pre>
          </div>
        )}
        
        {item.keyFeatures && (
          <div className="term-features">
            <strong>Key Points:</strong>
            <ul>
              {item.keyFeatures.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Main Glossary Page Component
 */
function Glossary() {
  const [selectedPathway, setSelectedPathway] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Get current pathway data
  const currentPathway = PATHWAYS.find(p => p.id === selectedPathway);
  
  // Get current subcategory data
  const currentSubcategory = currentPathway?.subcategories.find(
    s => s.id === selectedSubcategory
  );

  // Filter content based on search term
  const getFilteredContent = () => {
    if (!searchTerm.trim()) {
      return currentSubcategory?.content || [];
    }

    const term = searchTerm.toLowerCase();
    return (currentSubcategory?.content || []).filter(item => 
      item.term.toLowerCase().includes(term) ||
      item.definition.toLowerCase().includes(term)
    );
  };

  // Search across all pathways
  const getGlobalSearchResults = () => {
    if (!searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase();
    const results = [];

    PATHWAYS.forEach(pathway => {
      pathway.subcategories.forEach(subcategory => {
        subcategory.content.forEach(item => {
          if (item.term.toLowerCase().includes(term) ||
              item.definition.toLowerCase().includes(term)) {
            results.push({
              ...item,
              pathway: pathway.name,
              pathwayId: pathway.id,
              subcategory: subcategory.name,
              subcategoryId: subcategory.id
            });
          }
        });
      });
    });

    return results.slice(0, MAX_SEARCH_RESULTS);
  };

  const handleBack = () => {
    if (selectedSubcategory) {
      setSelectedSubcategory(null);
    } else {
      setSelectedPathway(null);
    }
    setSearchTerm('');
  };

  const handleSearchResultClick = (result) => {
    setSelectedPathway(result.pathwayId);
    setSelectedSubcategory(result.subcategoryId);
    setSearchTerm('');
  };

  const globalResults = !selectedPathway && searchTerm ? getGlobalSearchResults() : [];

  return (
    <div className="glossary-page">
      <div className="glossary-header">
        <h1>📖 Glossary</h1>
        <p>Your IT and Programming Dictionary</p>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder={selectedSubcategory 
            ? `Search in ${currentSubcategory?.name}...` 
            : "Search all topics..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className="search-clear" onClick={() => setSearchTerm('')}>
            ✕
          </button>
        )}
      </div>

      {/* Global Search Results */}
      {globalResults.length > 0 && (
        <div className="search-results">
          <h3>Search Results</h3>
          {globalResults.map((result, idx) => (
            <div 
              key={idx} 
              className="search-result-item"
              onClick={() => handleSearchResultClick(result)}
            >
              <span className="result-term">{result.term}</span>
              <span className="result-path">
                {result.pathway} → {result.subcategory}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Navigation Breadcrumb */}
      {selectedPathway && (
        <div className="breadcrumb">
          <button onClick={() => { setSelectedPathway(null); setSelectedSubcategory(null); }}>
            Home
          </button>
          <span>›</span>
          <button onClick={() => setSelectedSubcategory(null)}>
            {currentPathway?.name}
          </button>
          {selectedSubcategory && (
            <>
              <span>›</span>
              <span className="current">{currentSubcategory?.name}</span>
            </>
          )}
        </div>
      )}

      {/* Main Content */}
      {!selectedPathway ? (
        /* Pathway Selection Grid */
        <div className="pathways-grid">
          {PATHWAYS.map((pathway) => (
            <div
              key={pathway.id}
              className="pathway-card"
              style={{ '--pathway-color': pathway.color }}
              onClick={() => setSelectedPathway(pathway.id)}
            >
              <div className="pathway-icon">{pathway.icon}</div>
              <h3>{pathway.name}</h3>
              <p>{pathway.description}</p>
              <span className="pathway-count">
                {pathway.subcategories.reduce((acc, sub) => acc + sub.content.length, 0)} topics
              </span>
            </div>
          ))}
        </div>
      ) : !selectedSubcategory ? (
        /* Subcategory Selection */
        <div className="subcategory-view">
          <button className="back-btn" onClick={handleBack}>
            ← Back to Pathways
          </button>
          
          <div className="pathway-header" style={{ '--pathway-color': currentPathway?.color }}>
            <span className="pathway-icon-large">{currentPathway?.icon}</span>
            <div>
              <h2>{currentPathway?.name}</h2>
              <p>{currentPathway?.description}</p>
            </div>
          </div>

          <div className="subcategories-grid">
            {currentPathway?.subcategories.map((subcategory) => (
              <div
                key={subcategory.id}
                className="subcategory-card"
                onClick={() => setSelectedSubcategory(subcategory.id)}
              >
                <h3>{subcategory.name}</h3>
                <span className="topic-count">{subcategory.content.length} topics</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Term List */
        <div className="terms-view">
          <button className="back-btn" onClick={handleBack}>
            ← Back to {currentPathway?.name}
          </button>
          
          <div className="subcategory-header">
            <h2>{currentSubcategory?.name}</h2>
            <span className="topic-count">
              {getFilteredContent().length} of {currentSubcategory?.content.length} topics
            </span>
          </div>

          <div className="terms-list">
            {getFilteredContent().length > 0 ? (
              getFilteredContent().map((item, idx) => (
                <TermCard key={idx} item={item} />
              ))
            ) : (
              <div className="no-results">
                <p>No topics found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Info Footer */}
      <div className="glossary-footer">
        <p>
          💡 <strong>Tip:</strong> Use the search bar to quickly find any topic across all categories!
        </p>
      </div>
    </div>
  );
}

export default Glossary;
