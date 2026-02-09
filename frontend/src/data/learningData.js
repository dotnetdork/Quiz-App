/**
 * Learning Data
 * 
 * Comprehensive mini-courses for the Learn Hub.
 * Each module contains structured educational content with:
 * - Core Concepts
 * - Syntax examples
 * - Best Practices
 * - Common Pitfalls
 * - Mermaid diagrams for complex logic
 */

export const learningModules = [
  // ============================================
  // PYTHON FUNDAMENTALS
  // ============================================
  {
    id: 'python-fundamentals',
    title: 'Python Fundamentals',
    icon: '🐍',
    color: '#3776ab',
    category: 'python',
    description: 'Master the basics of Python programming - from variables to functions.',
    estimatedTime: '45 min',
    sections: [
      {
        id: 'intro',
        title: 'Introduction to Python',
        content: `
Python is a high-level, interpreted programming language created by Guido van Rossum in 1991. It emphasizes code readability and simplicity, making it an excellent choice for beginners while remaining powerful enough for professional applications.

Python follows a philosophy summarized in "The Zen of Python," which includes principles like:
- **Beautiful is better than ugly**
- **Explicit is better than implicit**
- **Simple is better than complex**
- **Readability counts**

Python files use the \`.py\` extension. To run a Python program, use the command \`python filename.py\` in your terminal.
        `
      },
      {
        id: 'core-concepts',
        title: 'Core Concepts',
        content: `
### Variables and Data Types

Variables in Python are created when you assign a value. No explicit declaration is needed.

\`\`\`python
# Basic data types
name = "Alice"        # String (str)
age = 25              # Integer (int)
height = 5.9          # Float (float)
is_student = True     # Boolean (bool)

# Python is dynamically typed
x = 10       # x is an integer
x = "hello"  # x is now a string
\`\`\`

### Print Function

The \`print()\` function outputs text to the console:

\`\`\`python
print("Hello, World!")
print("Name:", name)
print(f"Age: {age}")  # f-string formatting
\`\`\`

### Comments

Comments help document your code:

\`\`\`python
# This is a single-line comment

"""
This is a 
multi-line comment
(actually a docstring)
"""
\`\`\`

### Operators

Python supports various operators:

\`\`\`python
# Arithmetic
a + b   # Addition
a - b   # Subtraction
a * b   # Multiplication
a / b   # Division (returns float)
a // b  # Floor division (returns int)
a % b   # Modulus (remainder)
a ** b  # Exponentiation

# Comparison
a == b  # Equal
a != b  # Not equal
a > b   # Greater than
a < b   # Less than

# Logical
and     # True if both are true
or      # True if either is true
not     # Inverts boolean
\`\`\`
        `
      },
      {
        id: 'syntax',
        title: 'Syntax',
        content: `
### Defining Functions

Functions are defined using the \`def\` keyword:

\`\`\`python
def greet(name):
    """Return a greeting message."""
    return f"Hello, {name}!"

# Call the function
message = greet("Alice")
print(message)  # Hello, Alice!
\`\`\`

### Control Flow

#### If-Else Statements

\`\`\`python
score = 75

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 60:
    grade = "Pass"
else:
    grade = "Fail"
\`\`\`

#### For Loops

\`\`\`python
# Using range()
for i in range(5):
    print(i)  # Prints 0, 1, 2, 3, 4

# Iterating over a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)
\`\`\`

#### While Loops

\`\`\`python
count = 3
while count > 0:
    print(count)
    count -= 1
# Prints 3, 2, 1
\`\`\`

### User Input

\`\`\`python
name = input("Enter your name: ")
age = int(input("Enter your age: "))  # Convert to integer
\`\`\`
        `
      },
      {
        id: 'best-practices',
        title: 'Best Practices',
        content: `
### Writing Clean Python Code

1. **Use descriptive variable names**
   \`\`\`python
   # Bad
   x = 25
   
   # Good
   user_age = 25
   \`\`\`

2. **Follow PEP 8 style guide**
   - Use 4 spaces for indentation
   - Limit lines to 79 characters
   - Use snake_case for variables and functions
   - Use PascalCase for class names

3. **Add docstrings to functions**
   \`\`\`python
   def calculate_area(radius):
       """
       Calculate the area of a circle.
       
       Args:
           radius: The radius of the circle
           
       Returns:
           The area of the circle
       """
       return 3.14159 * radius ** 2
   \`\`\`

4. **Use f-strings for string formatting** (Python 3.6+)
   \`\`\`python
   name = "Alice"
   print(f"Hello, {name}!")  # Cleaner than concatenation
   \`\`\`
        `
      },
      {
        id: 'pitfalls',
        title: 'Common Pitfalls',
        content: `
### Mistakes to Avoid

**1. Forgetting Indentation**

Python uses indentation to define code blocks. Mixing tabs and spaces causes errors.

\`\`\`python
# WRONG - will cause IndentationError
if True:
print("Hello")

# CORRECT
if True:
    print("Hello")
\`\`\`

**2. Modifying Lists While Iterating**

\`\`\`python
# WRONG - unexpected behavior
numbers = [1, 2, 3, 4, 5]
for n in numbers:
    if n % 2 == 0:
        numbers.remove(n)

# CORRECT - use list comprehension
numbers = [n for n in numbers if n % 2 != 0]
\`\`\`

**3. Mutable Default Arguments**

\`\`\`python
# WRONG - default list is shared between calls
def add_item(item, items=[]):
    items.append(item)
    return items

# CORRECT
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items
\`\`\`

**4. Integer Division vs Float Division**

\`\`\`python
# In Python 3:
10 / 3   # Returns 3.333... (float)
10 // 3  # Returns 3 (integer, floor division)
\`\`\`
        `
      }
    ]
  },

  // ============================================
  // PYTHON DATA STRUCTURES
  // ============================================
  {
    id: 'python-data-structures',
    title: 'Python Data Structures',
    icon: '📦',
    color: '#3776ab',
    category: 'python',
    description: 'Learn about lists, dictionaries, tuples, and sets - the building blocks of Python programs.',
    estimatedTime: '50 min',
    sections: [
      {
        id: 'intro',
        title: 'Overview',
        content: `
Python provides several built-in data structures that are essential for organizing and storing data efficiently. Each structure has unique properties that make it suitable for different use cases.

| Data Structure | Ordered | Mutable | Duplicates | Syntax |
|----------------|---------|---------|------------|--------|
| List           | ✅      | ✅      | ✅         | \`[]\`   |
| Tuple          | ✅      | ❌      | ✅         | \`()\`   |
| Set            | ❌      | ✅      | ❌         | \`{}\`   |
| Dictionary     | ✅*     | ✅      | Keys: ❌   | \`{k:v}\` |

*Dictionaries maintain insertion order in Python 3.7+
        `
      },
      {
        id: 'lists',
        title: 'Lists',
        content: `
### Creating and Using Lists

Lists are ordered, mutable collections that can hold items of any type.

\`\`\`python
# Creating lists
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", 3.14, True]
empty = []

# Accessing elements (0-indexed)
first = fruits[0]     # "apple"
last = fruits[-1]     # "cherry"
second = fruits[1]    # "banana"

# Slicing
fruits[1:3]   # ["banana", "cherry"]
fruits[:2]    # ["apple", "banana"]
fruits[::2]   # ["apple", "cherry"] (every 2nd item)
\`\`\`

### List Methods

\`\`\`python
inventory = ["sword", "shield"]

# Adding items
inventory.append("potion")      # Add to end
inventory.insert(0, "helmet")   # Insert at index

# Removing items
inventory.pop()           # Remove and return last item
inventory.pop(0)          # Remove at index
inventory.remove("sword") # Remove by value

# Other operations
len(inventory)            # Number of items
"sword" in inventory      # Check membership
inventory.sort()          # Sort in place
inventory.reverse()       # Reverse in place
\`\`\`
        `
      },
      {
        id: 'dictionaries',
        title: 'Dictionaries',
        content: `
### Key-Value Storage

Dictionaries store data as key-value pairs, providing fast lookup by key.

\`\`\`python
# Creating dictionaries
player = {
    "name": "Hero",
    "hp": 100,
    "level": 5
}

# Accessing values
player["name"]           # "Hero"
player.get("hp")         # 100
player.get("mp", 0)      # 0 (default if key missing)

# Modifying
player["hp"] = 90        # Update value
player["mp"] = 50        # Add new key
del player["level"]      # Remove key

# Checking keys
"name" in player         # True
"armor" in player        # False
\`\`\`

### Iterating Over Dictionaries

\`\`\`python
# Loop through keys
for key in player:
    print(key)

# Loop through values
for value in player.values():
    print(value)

# Loop through key-value pairs
for key, value in player.items():
    print(f"{key}: {value}")
\`\`\`

### Dictionary Keys Must Be Immutable

Keys must be hashable (immutable) types like strings, numbers, or tuples.

\`\`\`python
# Valid keys
data = {
    "name": "Alice",
    42: "answer",
    (1, 2): "coordinates"
}

# INVALID - lists cannot be keys
# data = {[1, 2]: "error"}  # TypeError
\`\`\`
        `
      },
      {
        id: 'tuples-sets',
        title: 'Tuples and Sets',
        content: `
### Tuples - Immutable Sequences

Tuples are like lists but cannot be modified after creation.

\`\`\`python
# Creating tuples
coordinates = (10, 20)
rgb = (255, 128, 0)
single = (42,)  # Note the comma for single-item tuple

# Accessing (same as lists)
x = coordinates[0]  # 10
y = coordinates[1]  # 20

# Tuple unpacking
x, y = coordinates
r, g, b = rgb

# Use cases:
# - Returning multiple values from functions
# - Dictionary keys (since immutable)
# - Data that shouldn't change
\`\`\`

### Sets - Unique Collections

Sets are unordered collections with no duplicate elements.

\`\`\`python
# Creating sets
colors = {"red", "green", "blue"}
numbers = set([1, 2, 2, 3, 3, 3])  # {1, 2, 3}

# Adding/removing
colors.add("yellow")
colors.remove("red")    # Error if not found
colors.discard("pink")  # No error if not found

# Set operations
a = {1, 2, 3}
b = {2, 3, 4}

a | b    # Union: {1, 2, 3, 4}
a & b    # Intersection: {2, 3}
a - b    # Difference: {1}
a ^ b    # Symmetric difference: {1, 4}
\`\`\`
        `
      },
      {
        id: 'pitfalls',
        title: 'Common Pitfalls',
        content: `
### Data Structure Mistakes

**1. Accessing Invalid Index**
\`\`\`python
items = [1, 2, 3]
# items[5]  # IndexError: list index out of range

# Safe access
if len(items) > 5:
    print(items[5])
\`\`\`

**2. Confusing \`append\` and \`extend\`**
\`\`\`python
a = [1, 2]
a.append([3, 4])   # [1, 2, [3, 4]]

b = [1, 2]
b.extend([3, 4])   # [1, 2, 3, 4]
\`\`\`

**3. Shallow vs Deep Copy**
\`\`\`python
import copy

original = [[1, 2], [3, 4]]
shallow = original.copy()       # or original[:]
deep = copy.deepcopy(original)

original[0][0] = 99
print(shallow)  # [[99, 2], [3, 4]] - affected!
print(deep)     # [[1, 2], [3, 4]] - independent
\`\`\`

**4. Using Mutable Objects as Dictionary Keys**
\`\`\`python
# WRONG - lists are mutable
# d = {[1, 2]: "value"}  # TypeError

# CORRECT - use tuple instead
d = {(1, 2): "value"}  # Works!
\`\`\`
        `
      }
    ]
  },

  // ============================================
  // JAVA FUNDAMENTALS
  // ============================================
  {
    id: 'java-fundamentals',
    title: 'Java Fundamentals',
    icon: '☕',
    color: '#f89820',
    category: 'java',
    description: 'Learn Java basics - syntax, data types, and program structure.',
    estimatedTime: '55 min',
    sections: [
      {
        id: 'intro',
        title: 'Introduction to Java',
        content: `
Java is a class-based, object-oriented programming language designed to have as few implementation dependencies as possible. Created by James Gosling at Sun Microsystems in 1995, Java follows the "Write Once, Run Anywhere" (WORA) principle.

### Key Characteristics

- **Platform Independent**: Java code compiles to bytecode that runs on the Java Virtual Machine (JVM)
- **Strongly Typed**: All variables must be declared with a specific type
- **Object-Oriented**: Everything is an object (except primitives)
- **Garbage Collected**: Automatic memory management

### Program Structure

Every Java program requires at least one class and a \`main\` method as the entry point:

\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
\`\`\`

Files are saved with the \`.java\` extension and the filename must match the public class name.
        `
      },
      {
        id: 'core-concepts',
        title: 'Core Concepts',
        content: `
### Data Types

Java has two categories of data types:

**Primitive Types:**
\`\`\`java
// Integers
byte b = 127;           // 8-bit
short s = 32000;        // 16-bit
int i = 2000000000;     // 32-bit (most common)
long l = 9000000000L;   // 64-bit

// Floating-point
float f = 3.14f;        // 32-bit
double d = 3.14159;     // 64-bit (default)

// Other
boolean flag = true;    // true or false
char c = 'A';           // Single character
\`\`\`

**Reference Types:**
\`\`\`java
String name = "Alice";              // String class
int[] numbers = {1, 2, 3, 4, 5};   // Array
ArrayList<String> list = new ArrayList<>();  // Collection
\`\`\`

### Variables and Constants

\`\`\`java
// Variable declaration
int age;
age = 25;

// Declaration with initialization
String name = "Bob";

// Constants (use final keyword)
final double PI = 3.14159;
final int MAX_SIZE = 100;
\`\`\`

### Comments

\`\`\`java
// Single-line comment

/* Multi-line
   comment */

/**
 * Javadoc comment
 * Used for documentation
 * @param args Command-line arguments
 */
\`\`\`
        `
      },
      {
        id: 'syntax',
        title: 'Syntax',
        content: `
### Control Flow

#### If-Else Statements
\`\`\`java
int score = 75;

if (score >= 90) {
    System.out.println("A");
} else if (score >= 80) {
    System.out.println("B");
} else if (score >= 60) {
    System.out.println("Pass");
} else {
    System.out.println("Fail");
}
\`\`\`

#### For Loops
\`\`\`java
// Standard for loop
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}

// Enhanced for loop (for-each)
String[] names = {"Alice", "Bob", "Charlie"};
for (String name : names) {
    System.out.println(name);
}
\`\`\`

#### While Loops
\`\`\`java
int count = 3;
while (count > 0) {
    System.out.println(count);
    count--;
}
\`\`\`

### Arrays
\`\`\`java
// Declaration and initialization
int[] numbers = {1, 2, 3, 4, 5};
String[] names = new String[3];

// Accessing elements
int first = numbers[0];
numbers[1] = 10;

// Array length
int length = numbers.length;
\`\`\`

### Methods
\`\`\`java
public static int add(int a, int b) {
    return a + b;
}

public static void greet(String name) {
    System.out.println("Hello, " + name);
}

// Calling methods
int sum = add(5, 3);
greet("Alice");
\`\`\`
        `
      },
      {
        id: 'operators',
        title: 'Operators',
        content: `
### Arithmetic Operators
\`\`\`java
int a = 10, b = 3;

a + b   // Addition: 13
a - b   // Subtraction: 7
a * b   // Multiplication: 30
a / b   // Division: 3 (integer division)
a % b   // Modulus: 1 (remainder)
\`\`\`

### Comparison Operators
\`\`\`java
a == b  // Equal to
a != b  // Not equal to
a > b   // Greater than
a < b   // Less than
a >= b  // Greater than or equal
a <= b  // Less than or equal
\`\`\`

### Logical Operators
\`\`\`java
boolean x = true, y = false;

x && y  // AND: false
x || y  // OR: true
!x      // NOT: false
\`\`\`

### Assignment Operators
\`\`\`java
int n = 10;
n += 5;   // n = n + 5 → 15
n -= 3;   // n = n - 3 → 12
n *= 2;   // n = n * 2 → 24
n /= 4;   // n = n / 4 → 6
n++;      // n = n + 1 → 7
n--;      // n = n - 1 → 6
\`\`\`
        `
      },
      {
        id: 'pitfalls',
        title: 'Common Pitfalls',
        content: `
### Java Mistakes to Avoid

**1. Forgetting Semicolons**

Every statement in Java must end with a semicolon:
\`\`\`java
// WRONG
int x = 5

// CORRECT
int x = 5;
\`\`\`

**2. Using == for String Comparison**
\`\`\`java
String a = "hello";
String b = new String("hello");

// WRONG - compares references
if (a == b) { }  // false!

// CORRECT - compares values
if (a.equals(b)) { }  // true
\`\`\`

**3. Array Index Out of Bounds**
\`\`\`java
int[] arr = {1, 2, 3};
// arr[3]  // ArrayIndexOutOfBoundsException

// Safe access
if (index < arr.length) {
    System.out.println(arr[index]);
}
\`\`\`

**4. Integer Division Truncation**
\`\`\`java
int a = 5, b = 2;
int result = a / b;      // 2, not 2.5

// To get decimal result:
double result = (double) a / b;  // 2.5
\`\`\`

**5. Uninitialized Variables**
\`\`\`java
int x;
// System.out.println(x);  // Error: variable not initialized

int x = 0;  // Always initialize
System.out.println(x);  // OK
\`\`\`
        `
      }
    ]
  },

  // ============================================
  // JAVA OOP
  // ============================================
  {
    id: 'java-oop',
    title: 'Java Object-Oriented Programming',
    icon: '🏗️',
    color: '#f89820',
    category: 'java',
    description: 'Master classes, objects, inheritance, and the four pillars of OOP.',
    estimatedTime: '60 min',
    sections: [
      {
        id: 'intro',
        title: 'The Four Pillars of OOP',
        content: `
Object-Oriented Programming (OOP) is a programming paradigm based on the concept of "objects" that contain data and code. Java is fundamentally an OOP language.

### The Four Pillars

1. **Encapsulation** - Bundling data and methods that operate on that data within a class
2. **Inheritance** - Creating new classes based on existing classes
3. **Polymorphism** - Objects taking multiple forms
4. **Abstraction** - Hiding complex implementation details
        `,
        mermaid: `graph TB
    OOP[Object-Oriented Programming]
    OOP --> E[Encapsulation]
    OOP --> I[Inheritance]
    OOP --> P[Polymorphism]
    OOP --> A[Abstraction]
    
    E --> E1[Private fields]
    E --> E2[Public methods]
    
    I --> I1[extends keyword]
    I --> I2[Code reuse]
    
    P --> P1[Method Overriding]
    P --> P2[Method Overloading]
    
    A --> A1[Abstract classes]
    A --> A2[Interfaces]`
      },
      {
        id: 'classes-objects',
        title: 'Classes and Objects',
        content: `
### Defining a Class

A class is a blueprint for creating objects:

\`\`\`java
public class Car {
    // Fields (attributes)
    private String model;
    private int year;
    private double speed;
    
    // Constructor
    public Car(String model, int year) {
        this.model = model;
        this.year = year;
        this.speed = 0;
    }
    
    // Methods
    public void accelerate(double amount) {
        this.speed += amount;
    }
    
    public void brake() {
        this.speed = 0;
    }
    
    // Getter
    public String getModel() {
        return this.model;
    }
    
    // Setter
    public void setModel(String model) {
        this.model = model;
    }
}
\`\`\`

### Creating Objects

\`\`\`java
// Create objects using 'new' keyword
Car myCar = new Car("Tesla Model 3", 2023);
Car yourCar = new Car("Honda Civic", 2020);

// Use object methods
myCar.accelerate(60);
System.out.println(myCar.getModel());  // Tesla Model 3
\`\`\`

### The \`this\` Keyword

\`this\` refers to the current object instance:

\`\`\`java
public void setModel(String model) {
    this.model = model;  // this.model is the field
                         // model is the parameter
}
\`\`\`
        `
      },
      {
        id: 'encapsulation',
        title: 'Encapsulation',
        content: `
### Access Modifiers

Control visibility of class members:

| Modifier    | Class | Package | Subclass | World |
|-------------|-------|---------|----------|-------|
| public      | ✅    | ✅      | ✅       | ✅    |
| protected   | ✅    | ✅      | ✅       | ❌    |
| (default)   | ✅    | ✅      | ❌       | ❌    |
| private     | ✅    | ❌      | ❌       | ❌    |

### Getters and Setters

\`\`\`java
public class BankAccount {
    private double balance;  // Private field
    
    // Getter - read access
    public double getBalance() {
        return balance;
    }
    
    // Setter - write access with validation
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }
    
    public void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
        }
    }
}
\`\`\`

### Why Encapsulation?

- **Data protection**: Prevent invalid data states
- **Flexibility**: Change internal implementation without affecting external code
- **Maintainability**: Easier to debug and update
        `
      },
      {
        id: 'inheritance',
        title: 'Inheritance',
        content: `
### Creating Subclasses

Use \`extends\` to inherit from a parent class:

\`\`\`java
// Parent class (superclass)
public class Animal {
    protected String name;
    
    public Animal(String name) {
        this.name = name;
    }
    
    public void speak() {
        System.out.println("Animal sound");
    }
}

// Child class (subclass)
public class Dog extends Animal {
    private String breed;
    
    public Dog(String name, String breed) {
        super(name);  // Call parent constructor
        this.breed = breed;
    }
    
    @Override
    public void speak() {
        System.out.println(name + " says: Woof!");
    }
    
    public void fetch() {
        System.out.println(name + " is fetching!");
    }
}
\`\`\`

### Using Inheritance

\`\`\`java
Dog myDog = new Dog("Buddy", "Golden Retriever");
myDog.speak();   // Buddy says: Woof!
myDog.fetch();   // Buddy is fetching!
\`\`\`
        `,
        mermaid: `classDiagram
    Animal <|-- Dog
    Animal <|-- Cat
    Animal <|-- Bird
    
    class Animal {
        #String name
        +Animal(String name)
        +speak()
    }
    
    class Dog {
        -String breed
        +Dog(String name, String breed)
        +speak()
        +fetch()
    }
    
    class Cat {
        +speak()
        +purr()
    }
    
    class Bird {
        +speak()
        +fly()
    }`
      },
      {
        id: 'polymorphism',
        title: 'Polymorphism',
        content: `
### Method Overriding (Runtime Polymorphism)

Subclasses provide specific implementations of parent methods:

\`\`\`java
Animal[] animals = {
    new Dog("Buddy", "Lab"),
    new Cat("Whiskers"),
    new Bird("Tweety")
};

for (Animal animal : animals) {
    animal.speak();  // Each calls its own version
}
// Output:
// Buddy says: Woof!
// Whiskers says: Meow!
// Tweety says: Chirp!
\`\`\`

### Method Overloading (Compile-time Polymorphism)

Same method name, different parameters:

\`\`\`java
public class Calculator {
    public int add(int a, int b) {
        return a + b;
    }
    
    public double add(double a, double b) {
        return a + b;
    }
    
    public int add(int a, int b, int c) {
        return a + b + c;
    }
}

Calculator calc = new Calculator();
calc.add(5, 3);        // Uses int version
calc.add(5.0, 3.0);    // Uses double version
calc.add(1, 2, 3);     // Uses three-parameter version
\`\`\`
        `
      },
      {
        id: 'interfaces',
        title: 'Interfaces and Abstract Classes',
        content: `
### Interfaces

An interface defines a contract that classes must follow:

\`\`\`java
public interface Drawable {
    void draw();  // Abstract method (no body)
    
    default void clear() {  // Default implementation (Java 8+)
        System.out.println("Clearing...");
    }
}

public class Circle implements Drawable {
    @Override
    public void draw() {
        System.out.println("Drawing a circle");
    }
}

public class Rectangle implements Drawable {
    @Override
    public void draw() {
        System.out.println("Drawing a rectangle");
    }
}
\`\`\`

### Abstract Classes

Abstract classes cannot be instantiated and may contain abstract methods:

\`\`\`java
public abstract class Shape {
    protected String color;
    
    public Shape(String color) {
        this.color = color;
    }
    
    // Abstract method - must be implemented by subclasses
    public abstract double getArea();
    
    // Concrete method
    public void displayColor() {
        System.out.println("Color: " + color);
    }
}

public class Circle extends Shape {
    private double radius;
    
    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }
    
    @Override
    public double getArea() {
        return Math.PI * radius * radius;
    }
}
\`\`\`

### Interface vs Abstract Class

| Feature | Interface | Abstract Class |
|---------|-----------|----------------|
| Multiple inheritance | ✅ | ❌ |
| Constructors | ❌ | ✅ |
| Instance variables | ❌ (only constants) | ✅ |
| Default methods | ✅ (Java 8+) | ✅ |
        `
      }
    ]
  },

  // ============================================
  // TECHNOLOGY CONCEPTS
  // ============================================
  {
    id: 'technology-concepts',
    title: 'Technology Concepts',
    icon: '🖥️',
    color: '#607d8b',
    category: 'technology',
    description: 'Understand computer hardware, software, and fundamental tech concepts.',
    estimatedTime: '40 min',
    sections: [
      {
        id: 'hardware',
        title: 'Computer Hardware',
        content: `
### Core Components

**CPU (Central Processing Unit)**
The "brain" of the computer that executes instructions. Measured in clock speed (GHz) and number of cores.

**RAM (Random Access Memory)**
Temporary, volatile memory for running programs. Data is lost when power is off. Measured in GB.

**Storage (HDD/SSD)**
- **HDD**: Hard Disk Drive with spinning platters. Cheaper, slower.
- **SSD**: Solid State Drive with flash memory. Faster, more reliable, no moving parts.

**GPU (Graphics Processing Unit)**
Specialized processor for rendering graphics and parallel computing tasks.
        `,
        mermaid: `flowchart LR
    Input[Input Devices] --> CPU
    CPU <--> RAM
    CPU <--> Storage[(Storage)]
    CPU --> Output[Output Devices]
    CPU <--> GPU
    
    subgraph Processing
        CPU
        RAM
        GPU
    end`
      },
      {
        id: 'software',
        title: 'Software and Operating Systems',
        content: `
### Operating Systems

An Operating System (OS) manages hardware resources and provides services for programs.

**Major Operating Systems:**
- **Windows**: Microsoft's OS, most common for personal computers
- **macOS**: Apple's OS for Mac computers
- **Linux**: Open-source OS, popular for servers and developers

### Software Types

| Type | Description | Examples |
|------|-------------|----------|
| System Software | Manages computer resources | OS, drivers |
| Application Software | Performs specific tasks | Word, Chrome |
| Development Tools | Create other software | VS Code, Git |

### Binary and Data

Computers use binary (base-2) to store all data:
- **Bit**: Single 0 or 1
- **Byte**: 8 bits
- **Kilobyte (KB)**: ~1,000 bytes
- **Megabyte (MB)**: ~1,000 KB
- **Gigabyte (GB)**: ~1,000 MB
- **Terabyte (TB)**: ~1,000 GB
        `
      },
      {
        id: 'ipos',
        title: 'The Computing Cycle',
        content: `
### Input → Processing → Output → Storage (IPOS)

The fundamental cycle of computing:

1. **Input**: Data enters the computer (keyboard, mouse, sensors)
2. **Processing**: CPU manipulates data according to instructions
3. **Output**: Results are displayed or communicated (monitor, speakers)
4. **Storage**: Data is saved for later use (disk, cloud)
        `,
        mermaid: `flowchart LR
    I[📥 Input] --> P[⚙️ Processing]
    P --> O[📤 Output]
    P <--> S[💾 Storage]
    
    I1[Keyboard] --> I
    I2[Mouse] --> I
    I3[Camera] --> I
    
    O --> O1[Monitor]
    O --> O2[Speakers]
    O --> O3[Printer]`
      },
      {
        id: 'networks',
        title: 'Networking Basics',
        content: `
### Network Protocols

**HTTP/HTTPS**: HyperText Transfer Protocol - web communication
- HTTP: Unencrypted
- HTTPS: Encrypted (secure)

**The OSI Model** (7 Layers):
1. Physical - Cables, signals
2. Data Link - MAC addresses, switches
3. Network - IP addresses, routers
4. Transport - TCP/UDP, ports
5. Session - Connection management
6. Presentation - Encryption, formatting
7. Application - HTTP, FTP, SMTP

### Version Control

**Git**: A distributed version control system for tracking code changes.

Key concepts:
- **Repository**: Project folder tracked by Git
- **Commit**: Snapshot of changes
- **Branch**: Parallel version of code
- **Merge**: Combining branches
        `
      }
    ]
  },

  // ============================================
  // CYBERSECURITY
  // ============================================
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Fundamentals',
    icon: '🔐',
    color: '#d32f2f',
    category: 'technology',
    description: 'Learn about protecting systems, networks, and data from digital attacks.',
    estimatedTime: '50 min',
    sections: [
      {
        id: 'intro',
        title: 'Introduction to Cybersecurity',
        content: `
Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These attacks typically aim to:
- Access, change, or destroy sensitive information
- Extort money from users
- Interrupt normal business processes

### The CIA Triad

The three fundamental principles of information security:

- **Confidentiality**: Only authorized users can access data
- **Integrity**: Data is accurate and hasn't been tampered with
- **Availability**: Systems and data are accessible when needed
        `,
        mermaid: `pie title CIA Triad
    "Confidentiality" : 33
    "Integrity" : 33
    "Availability" : 34`
      },
      {
        id: 'threats',
        title: 'Common Threats',
        content: `
### Types of Malware

**Ransomware**
Encrypts victim's files and demands payment to restore access.

**Phishing**
Fraudulent attempts to obtain sensitive information by disguising as a trustworthy entity.

**Social Engineering**
Psychological manipulation to trick people into divulging confidential information.

**Denial of Service (DoS/DDoS)**
Overwhelming a system with traffic to make it unavailable.

### Attack Methods

| Attack | Description | Prevention |
|--------|-------------|------------|
| Phishing | Fake emails/websites | Verify sender, check URLs |
| Man-in-the-Middle | Intercepting communication | Use HTTPS, VPNs |
| SQL Injection | Malicious database queries | Parameterized queries |
| Brute Force | Trying all password combinations | Strong passwords, lockouts |
        `
      },
      {
        id: 'defenses',
        title: 'Security Defenses',
        content: `
### Firewalls

Software or hardware that monitors and controls network traffic based on security rules.

### Encryption

Converting data into unreadable format that requires a key to decrypt.
- **Symmetric**: Same key for encrypt/decrypt (AES)
- **Asymmetric**: Public/private key pairs (RSA)

### Multi-Factor Authentication (MFA)

Requires multiple forms of verification:
1. **Something you know**: Password, PIN
2. **Something you have**: Phone, security key
3. **Something you are**: Fingerprint, face

### VPN (Virtual Private Network)

Creates an encrypted tunnel for secure internet access, masking your IP address.
        `,
        mermaid: `flowchart TB
    User --> Auth{Authentication}
    Auth --> |Password| K[Something You Know]
    Auth --> |Phone/Token| H[Something You Have]
    Auth --> |Biometrics| A[Something You Are]
    K --> V{Verified?}
    H --> V
    A --> V
    V --> |Yes| Access[Access Granted]
    V --> |No| Deny[Access Denied]`
      },
      {
        id: 'best-practices',
        title: 'Best Practices',
        content: `
### Password Security

**Strong Password Rules:**
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- No personal information
- Unique for each account

**Example Strong Password:** \`Tr0ub4dor&3x@mple\`

### Security Hygiene

1. **Keep software updated** - Patches fix vulnerabilities
2. **Regular backups** - Protect against ransomware
3. **Use MFA** - Extra layer of protection
4. **Be skeptical** - Verify before clicking links
5. **Least privilege** - Only give necessary access

### Incident Response

If you suspect a breach:
1. Don't panic
2. Document what happened
3. Report to IT/security team
4. Change affected passwords
5. Monitor accounts for suspicious activity
        `
      }
    ]
  },

  // ============================================
  // ROBOTICS
  // ============================================
  {
    id: 'robotics',
    title: 'Robotics Fundamentals',
    icon: '🤖',
    color: '#388e3c',
    category: 'technology',
    description: 'Learn about sensors, actuators, and control systems in robotics.',
    estimatedTime: '45 min',
    sections: [
      {
        id: 'intro',
        title: 'Introduction to Robotics',
        content: `
Robotics combines mechanical engineering, electrical engineering, and computer science to create machines that can interact with the physical world.

### Key Components

- **Sensors**: Input devices that detect the environment
- **Actuators**: Output devices that create movement
- **Controller**: The "brain" that processes information and makes decisions
- **Power Supply**: Provides energy to all components
        `,
        mermaid: `flowchart LR
    S[Sensors] --> C[Controller/MCU]
    C --> A[Actuators]
    P[Power Supply] --> C
    P --> A
    
    subgraph Input
        S1[Ultrasonic]
        S2[IR Sensor]
        S3[Camera]
    end
    
    subgraph Output
        A1[Motors]
        A2[Servos]
        A3[LEDs]
    end
    
    S1 & S2 & S3 --> S
    A --> A1 & A2 & A3`
      },
      {
        id: 'sensors',
        title: 'Sensors',
        content: `
### Common Sensor Types

**Ultrasonic Sensor**
Measures distance using sound waves. Emits high-frequency sound and measures echo return time.
- Common model: HC-SR04
- Range: 2cm to 400cm

**Infrared (IR) Sensor**
Detects infrared light/heat. Used for line following and proximity detection.

**LIDAR (Light Detection and Ranging)**
Uses laser light to create detailed 3D maps. Used in autonomous vehicles.

**Gyroscope**
Measures angular velocity (rotation speed). Essential for balance and orientation.

**Accelerometer**
Measures acceleration and tilt. Often combined with gyroscope in IMU (Inertial Measurement Unit).

### Degrees of Freedom (DOF)

The number of independent movements a robot can make:
- 2-DOF: Up/down + left/right
- 6-DOF robot arm: Full position and orientation control
        `
      },
      {
        id: 'actuators',
        title: 'Actuators and Motors',
        content: `
### Types of Motors

**DC Motor**
Simple motor that spins when voltage is applied. Speed controlled by voltage level.

**Servo Motor**
Motor with position feedback. Can rotate to a specific angle (0-180° typically).
- Controlled by PWM signal
- Used for precise positioning

**Stepper Motor**
Divides rotation into discrete steps. Precise control without feedback needed.
- Common in 3D printers and CNC machines

### PWM (Pulse Width Modulation)

Controls power to motors by rapidly switching on/off:

\`\`\`
Duty Cycle:
0%   ▓░░░░░░░░░  Motor off
50%  ▓▓▓▓▓░░░░░  Half speed
100% ▓▓▓▓▓▓▓▓▓▓  Full speed
\`\`\`

### End Effectors

The device at the end of a robotic arm:
- **Grippers**: Grab objects
- **Suction cups**: Lift flat surfaces
- **Tools**: Welders, drills, etc.
        `
      },
      {
        id: 'control',
        title: 'Control Systems',
        content: `
### The Sense-Plan-Act Loop

The fundamental control cycle in robotics:

1. **Sense**: Read sensor data
2. **Plan**: Process data and decide action
3. **Act**: Execute movement
4. **Repeat**: Continuous loop
        `,
        mermaid: `flowchart TB
    Sense[👁️ Sense<br>Read sensors] --> Plan[🧠 Plan<br>Make decisions]
    Plan --> Act[🦾 Act<br>Move motors]
    Act --> Sense
    
    subgraph Example: Obstacle Avoidance
        E1[Read distance sensor]
        E2{Distance < 10cm?}
        E3[Stop & turn]
        E4[Move forward]
        
        E1 --> E2
        E2 --> |Yes| E3
        E2 --> |No| E4
        E3 --> E1
        E4 --> E1
    end`
      },
      {
        id: 'safety',
        title: 'Robot Safety',
        content: `
### Safety Principles

**E-Stop (Emergency Stop)**
A large, easily accessible button that immediately halts all robot motion. Required for all industrial robots.

**Safety Zones**
- **Danger zone**: Area where robot can reach
- **Warning zone**: Buffer area around danger zone
- **Safe zone**: Outside robot's reach

### Autonomous vs Teleoperated

| Type | Description | Examples |
|------|-------------|----------|
| Autonomous | Operates without human control | Self-driving cars, Roomba |
| Teleoperated | Human-controlled remotely | Surgical robots, drones |
| Semi-autonomous | Combination of both | Assisted driving |

### GPIO Pins

**Digital GPIO**: On/Off signals only (HIGH/LOW)
- Used for: Buttons, LEDs, simple sensors

**Analog**: Variable voltage levels
- Used for: Potentiometers, temperature sensors
        `
      }
    ]
  },

  // ============================================
  // COMPUTER SCIENCE FUNDAMENTALS
  // ============================================
  {
    id: 'cs-fundamentals',
    title: 'Computer Science Fundamentals',
    icon: '🎓',
    color: '#9c27b0',
    category: 'computer-science',
    description: 'Core concepts that underpin all of computing: algorithms, data structures, and computational thinking.',
    estimatedTime: '60 min',
    sections: [
      {
        id: 'intro',
        title: 'What is Computer Science?',
        content: `
Computer Science is the study of computation, algorithms, and information. It's not just about programming—it's about solving problems efficiently and understanding the fundamental limits of what can be computed.

### Core Areas

- **Algorithms**: Step-by-step procedures for solving problems
- **Data Structures**: Ways to organize and store data
- **Theory of Computation**: What can and cannot be computed
- **Computer Architecture**: How computers are built
- **Software Engineering**: Building reliable, maintainable software
- **Artificial Intelligence**: Creating intelligent systems
        `
      },
      {
        id: 'algorithms',
        title: 'Algorithms',
        content: `
### What is an Algorithm?

An algorithm is a finite sequence of well-defined instructions to solve a problem or accomplish a task.

**Properties of a good algorithm:**
- **Correct**: Produces the right output
- **Efficient**: Uses minimal resources (time, memory)
- **Clear**: Easy to understand and implement
- **Finite**: Terminates in a finite number of steps

### Algorithm Complexity (Big O)

Describes how an algorithm's performance scales with input size:

| Notation | Name | Example |
|----------|------|---------|
| O(1) | Constant | Array access |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | Simple search |
| O(n log n) | Linearithmic | Merge sort |
| O(n²) | Quadratic | Bubble sort |
| O(2ⁿ) | Exponential | Recursive Fibonacci |
        `
      },
      {
        id: 'data-structures',
        title: 'Data Structures',
        content: `
### Common Data Structures

**Arrays**
Fixed-size collection of elements stored in contiguous memory.
- Access: O(1)
- Search: O(n)
- Insert/Delete: O(n)

**Linked Lists**
Elements connected by pointers, not contiguous in memory.
- Access: O(n)
- Insert/Delete: O(1) if at position

**Stacks (LIFO - Last In, First Out)**
\`\`\`
Push: [1] → [1,2] → [1,2,3]
Pop:  [1,2,3] → [1,2] → [1]
\`\`\`

**Queues (FIFO - First In, First Out)**
\`\`\`
Enqueue: [1] → [1,2] → [1,2,3]
Dequeue: [1,2,3] → [2,3] → [3]
\`\`\`

**Trees**
Hierarchical structure with root, branches, and leaves.
- Binary Tree: Each node has at most 2 children
- Binary Search Tree: Left < Parent < Right

**Hash Tables**
Key-value storage with O(1) average access using hash functions.
        `
      },
      {
        id: 'problem-solving',
        title: 'Computational Thinking',
        content: `
### The Four Pillars

**1. Decomposition**
Breaking complex problems into smaller, manageable parts.

**2. Pattern Recognition**
Finding similarities or patterns in problems.

**3. Abstraction**
Focusing on important information and ignoring irrelevant details.

**4. Algorithm Design**
Creating step-by-step solutions.

### Problem-Solving Process

1. **Understand** the problem completely
2. **Plan** your approach
3. **Divide** into smaller sub-problems
4. **Solve** each part
5. **Combine** solutions
6. **Review** and optimize
        `,
        mermaid: `flowchart TD
    P[Problem] --> D[Decompose]
    D --> A[Analyze Patterns]
    A --> Ab[Abstract Key Details]
    Ab --> Alg[Design Algorithm]
    Alg --> I[Implement]
    I --> T[Test & Debug]
    T --> |Issues| I
    T --> |Success| S[Solution]`
      },
      {
        id: 'binary',
        title: 'Binary and Number Systems',
        content: `
### Number Systems

**Binary (Base 2)**
Uses only 0 and 1. The language of computers.

\`\`\`
Decimal  Binary
0        0
1        1
2        10
3        11
4        100
5        101
10       1010
255      11111111
\`\`\`

**Hexadecimal (Base 16)**
Uses 0-9 and A-F. Compact way to represent binary.

\`\`\`
Decimal  Hex    Binary
10       A      1010
15       F      1111
16       10     10000
255      FF     11111111
\`\`\`

### Binary Arithmetic

\`\`\`
  1011  (11)      1101  (13)
+ 0110  (6)     - 0101  (5)
------          ------
 10001  (17)     1000  (8)
\`\`\`

### Why Binary?

Computers use electrical signals that are either ON (1) or OFF (0). This two-state system is reliable and efficient for digital circuits.
        `
      }
    ]
  },

  // ============================================
  // COMPUTER HISTORY
  // ============================================
  {
    id: 'computer-history',
    title: 'History of Computing',
    icon: '📜',
    color: '#795548',
    category: 'computer-science',
    description: 'Journey through the evolution of computing from ancient times to the modern era.',
    estimatedTime: '30 min',
    isTimeline: true,
    timeline: [
      {
        year: '~2000 BCE',
        title: 'The Abacus',
        description: 'One of the earliest computing devices, used for arithmetic calculations in ancient Mesopotamia and later throughout Asia.',
        icon: '🧮'
      },
      {
        year: '1642',
        title: 'Pascaline',
        description: 'Blaise Pascal invents the first mechanical calculator, capable of addition and subtraction.',
        icon: '⚙️'
      },
      {
        year: '1837',
        title: 'Analytical Engine',
        description: 'Charles Babbage designs the first general-purpose computer concept. Ada Lovelace writes the first algorithm.',
        icon: '📐'
      },
      {
        year: '1936',
        title: 'Turing Machine',
        description: 'Alan Turing proposes a theoretical model that defines the limits of what can be computed, laying the foundation for computer science.',
        icon: '📜'
      },
      {
        year: '1945',
        title: 'ENIAC',
        description: 'The first general-purpose electronic digital computer. Weighed 30 tons and used 18,000 vacuum tubes.',
        icon: '💡'
      },
      {
        year: '1947',
        title: 'The Transistor',
        description: 'Bell Labs invents the transistor, replacing bulky vacuum tubes and enabling smaller, more reliable computers.',
        icon: '🔌'
      },
      {
        year: '1958',
        title: 'Integrated Circuit',
        description: 'Jack Kilby and Robert Noyce independently develop the integrated circuit (microchip), revolutionizing electronics.',
        icon: '🔲'
      },
      {
        year: '1969',
        title: 'ARPANET',
        description: 'The precursor to the internet connects four universities, enabling the first computer-to-computer communication.',
        icon: '🌐'
      },
      {
        year: '1971',
        title: 'Intel 4004',
        description: 'The first commercial microprocessor, packing 2,300 transistors onto a single chip.',
        icon: '🎛️'
      },
      {
        year: '1976',
        title: 'Apple I',
        description: 'Steve Wozniak and Steve Jobs introduce the Apple I, one of the first personal computers.',
        icon: '🍎'
      },
      {
        year: '1981',
        title: 'IBM PC',
        description: 'IBM releases the Personal Computer, establishing the standard architecture for decades of PCs.',
        icon: '💻'
      },
      {
        year: '1991',
        title: 'World Wide Web',
        description: 'Tim Berners-Lee releases the World Wide Web, transforming how humanity shares information.',
        icon: '🕸️'
      },
      {
        year: '1998',
        title: 'Google Founded',
        description: 'Larry Page and Sergey Brin create Google, revolutionizing internet search.',
        icon: '🔍'
      },
      {
        year: '2007',
        title: 'iPhone Launch',
        description: 'Apple introduces the iPhone, ushering in the smartphone era and mobile computing revolution.',
        icon: '📱'
      },
      {
        year: '2010s',
        title: 'Cloud Computing',
        description: 'AWS, Azure, and Google Cloud transform how applications are deployed and scaled.',
        icon: '☁️'
      },
      {
        year: '2020s',
        title: 'AI Revolution',
        description: 'Large Language Models and generative AI become mainstream, transforming industries worldwide.',
        icon: '🤖'
      }
    ],
    sections: [
      {
        id: 'pioneers',
        title: 'Computing Pioneers',
        content: `
### Key Figures in Computing History

**Charles Babbage (1791-1871)**
"Father of the Computer" - Designed the Analytical Engine, the first concept for a programmable computer.

**Ada Lovelace (1815-1852)**
The first computer programmer. Wrote the first algorithm intended for machine processing.

**Alan Turing (1912-1954)**
Created the theoretical foundation of computer science. Broke the Enigma code in WWII. The Turing Test assesses machine intelligence.

**Grace Hopper (1906-1992)**
Pioneered computer programming, developed the first compiler, and popularized the term "debugging."

**Tim Berners-Lee (1955-)**
Invented the World Wide Web, HTML, HTTP, and URLs while working at CERN.
        `
      },
      {
        id: 'evolution',
        title: 'The Evolution of Hardware',
        content: `
### From Room-Sized to Pocket-Sized

**Generation 1: Vacuum Tubes (1940s-1950s)**
- Massive machines filling entire rooms
- Unreliable, generated enormous heat
- Example: ENIAC (30 tons, 18,000 tubes)

**Generation 2: Transistors (1950s-1960s)**
- Smaller, faster, more reliable
- Reduced size and power consumption
- Example: IBM 7090

**Generation 3: Integrated Circuits (1960s-1970s)**
- Multiple transistors on one chip
- Even smaller and more powerful
- Example: IBM System/360

**Generation 4: Microprocessors (1970s-Present)**
- Entire CPU on a single chip
- Personal computers become possible
- Moore's Law: Transistor count doubles every ~2 years

**Today's processors contain BILLIONS of transistors!**
        `
      }
    ]
  },

  // ============================================
  // AI & MACHINE LEARNING
  // ============================================
  {
    id: 'ai-ml-fundamentals',
    title: 'AI & Machine Learning',
    icon: '🧠',
    color: '#9c27b0',
    category: 'ai-ml',
    description: 'Understand the fundamentals of artificial intelligence and machine learning.',
    estimatedTime: '55 min',
    sections: [
      {
        id: 'intro',
        title: 'What is AI?',
        content: `
Artificial Intelligence (AI) is the simulation of human intelligence in machines. These systems are designed to think, learn, and make decisions similarly to humans.

### Key Concepts

- **Artificial Intelligence**: The broad field of creating intelligent machines
- **Machine Learning**: Teaching computers to learn from data
- **Deep Learning**: Using neural networks with many layers
- **Natural Language Processing**: Understanding human language

### Why AI Matters

AI is transforming every industry:
- Healthcare: Disease diagnosis, drug discovery
- Transportation: Self-driving cars
- Entertainment: Recommendation systems (Netflix, Spotify)
- Education: Personalized learning, tutoring systems
        `
      },
      {
        id: 'ml-basics',
        title: 'Machine Learning Basics',
        content: `
### How Machines Learn

Machine learning is a subset of AI where computers learn patterns from data without being explicitly programmed for each task.

**Traditional Programming:**
Data + Rules → Answer

**Machine Learning:**
Data + Answers → Rules (Model)

### The ML Workflow

1. **Collect Data**: Gather relevant examples
2. **Prepare Data**: Clean and format for training
3. **Choose Model**: Select appropriate algorithm
4. **Train Model**: Let it learn from data
5. **Evaluate**: Test on new data
6. **Deploy**: Use in real applications
        `,
        mermaid: `flowchart LR
    D[📊 Data] --> P[🔧 Prepare]
    P --> T[🎯 Train]
    T --> E[📈 Evaluate]
    E --> |Good| Deploy[🚀 Deploy]
    E --> |Poor| T`
      },
      {
        id: 'ml-types',
        title: 'Types of Machine Learning',
        content: `
### Supervised Learning

The model learns from labeled examples where the correct answer is known.

**Examples:**
- Email spam detection (spam/not spam labels)
- Image classification (cat/dog labels)
- Price prediction (historical prices)

### Unsupervised Learning

The model finds patterns in unlabeled data without guidance.

**Examples:**
- Customer segmentation
- Anomaly detection
- Topic modeling

### Reinforcement Learning

The model learns through trial and error with rewards and penalties.

**Examples:**
- Game playing (Chess, Go)
- Robotics
- Resource management

| Type | Data | Goal | Example |
|------|------|------|---------|
| Supervised | Labeled | Predict labels | Spam filter |
| Unsupervised | Unlabeled | Find patterns | Customer groups |
| Reinforcement | Rewards | Maximize reward | Game AI |
        `
      },
      {
        id: 'neural-networks',
        title: 'Neural Networks',
        content: `
### Inspired by the Brain

Neural networks are computing systems loosely inspired by biological neural networks in our brains.

### Structure

Input Layer → Hidden Layer(s) → Output Layer

**Key Components:**
- **Neurons (Nodes)**: Processing units that receive and transmit information
- **Weights**: Numbers that determine the strength of connections
- **Activation Functions**: Determine if a neuron should "fire"
- **Layers**: Groups of neurons at different stages

### Deep Learning

When neural networks have many hidden layers (deep networks), we call it deep learning. These can learn very complex patterns.

**Applications:**
- Image recognition (faces, objects)
- Speech recognition (Siri, Alexa)
- Language translation
- Art generation
        `
      },
      {
        id: 'ai-tools',
        title: 'AI in Practice',
        content: `
### Large Language Models (LLMs)

LLMs like GPT, Claude, and LLaMA are trained on massive text datasets to understand and generate human-like text.

**Capabilities:**
- Answer questions
- Write code
- Summarize documents
- Creative writing
- Language translation

### Prompt Engineering

The art of crafting inputs to get better outputs from AI models.

**Tips for Good Prompts:**
1. Be specific and clear
2. Provide context
3. Give examples of desired output
4. Break complex tasks into steps
5. Iterate and refine

### Generative AI

AI that creates new content:
- **Text**: ChatGPT, Claude
- **Images**: DALL-E, Midjourney, Stable Diffusion
- **Audio**: Music generation, voice synthesis
- **Video**: Animation, visual effects

### Ethical Considerations

- **Bias**: AI can reflect biases in training data
- **Privacy**: Data collection concerns
- **Misinformation**: Fake content generation
- **Job displacement**: Automation concerns
- **Transparency**: Understanding AI decisions
        `
      }
    ]
  },

  // ============================================
  // SOFTWARE ENGINEERING & CAREER
  // ============================================
  {
    id: 'software-engineering',
    title: 'Software Engineering & Career',
    icon: '👔',
    color: '#2196f3',
    category: 'career',
    description: 'Professional practices, methodologies, and career paths in software development.',
    estimatedTime: '50 min',
    sections: [
      {
        id: 'intro',
        title: 'What is Software Engineering?',
        content: `
Software Engineering is the systematic application of engineering principles to the design, development, testing, and maintenance of software.

### Beyond Coding

While programming is writing code, software engineering encompasses:
- **Planning**: Requirements, design, architecture
- **Collaboration**: Working with teams
- **Quality**: Testing, code reviews
- **Maintenance**: Updates, bug fixes
- **Documentation**: Making code understandable

### Why It Matters

Good software engineering practices lead to:
- Fewer bugs
- Faster development
- Easier maintenance
- Better collaboration
- Scalable systems
        `
      },
      {
        id: 'methodologies',
        title: 'Development Methodologies',
        content: `
### Agile Development

An iterative approach emphasizing flexibility and rapid delivery.

**Core Principles:**
- Individuals over processes
- Working software over documentation
- Customer collaboration over contracts
- Responding to change over following plans

### Scrum Framework

A popular Agile implementation:

**Sprint (2-4 weeks)**
- Sprint Planning
- Daily Standups (15 min)
- Development Work
- Sprint Review
- Sprint Retrospective

**Roles:**
- **Product Owner**: Defines what to build
- **Scrum Master**: Facilitates the process
- **Development Team**: Builds the product

### Kanban

Visual workflow management using boards with columns:
To Do → In Progress → Review → Done
        `,
        mermaid: `flowchart LR
    PB[Product Backlog] --> SP[Sprint Planning]
    SP --> S[Sprint 2-4 weeks]
    S --> SR[Sprint Review]
    SR --> Retro[Retrospective]
    Retro --> SP`
      },
      {
        id: 'practices',
        title: 'Best Practices',
        content: `
### Code Review

Having peers examine your code before merging.

**Benefits:**
- Catches bugs early
- Shares knowledge across team
- Maintains code quality
- Mentorship opportunity

### CI/CD (Continuous Integration/Deployment)

Automating the build, test, and deployment process.

Code Push → Build → Test → Deploy

### Testing Pyramid

- **Unit Tests (Many)**: Test individual functions
- **Integration Tests (Some)**: Test component interactions
- **E2E Tests (Few)**: Test entire user flows

### Technical Debt

Shortcuts taken that need to be paid back later.

**Managing Technical Debt:**
- Track it explicitly
- Allocate time for refactoring
- Don't let it accumulate
- Balance speed vs. quality
        `
      },
      {
        id: 'career-paths',
        title: 'Career Paths',
        content: `
### Software Development Roles

| Role | Focus | Skills |
|------|-------|--------|
| Frontend Developer | User interfaces | HTML, CSS, JavaScript, React |
| Backend Developer | Server logic, APIs | Python, Java, Databases |
| Full-Stack Developer | Both frontend & backend | Versatile skillset |
| Mobile Developer | iOS/Android apps | Swift, Kotlin, React Native |
| DevOps Engineer | Infrastructure, deployment | Cloud, CI/CD, Linux |
| Data Engineer | Data pipelines | SQL, Python, Spark |
| Data Scientist | Analysis, ML models | Statistics, Python, ML |
| Security Engineer | System security | Networking, cryptography |

### Career Progression

Junior Developer (0-2 years)
↓
Mid-Level Developer (2-5 years)
↓
Senior Developer (5+ years)
↓
Tech Lead / Architect / Engineering Manager

### Skills for Success

**Technical:**
- Programming languages
- Data structures & algorithms
- Version control (Git)
- Testing
- System design

**Non-Technical:**
- Communication
- Problem-solving
- Teamwork
- Time management
- Continuous learning
        `
      },
      {
        id: 'getting-started',
        title: 'Getting Started',
        content: `
### Building Your Portfolio

Your portfolio is your proof of skills. Include:

1. **Personal Projects**: Build things you're passionate about
2. **GitHub Profile**: Keep it active and organized
3. **Documentation**: Explain what you built and why
4. **Deployed Projects**: Show working applications
5. **Contributions**: Open source participation

### Learning Path

1. Learn Programming Basics
2. Build Small Projects
3. Learn Version Control (Git)
4. Study Data Structures
5. Build Larger Projects
6. Contribute to Open Source
7. Apply for Internships/Jobs

### Resources

**Free Learning:**
- freeCodeCamp
- The Odin Project
- CS50 (Harvard)
- Codecademy

**Practice:**
- LeetCode
- HackerRank
- Codewars
- Project Euler

**Community:**
- Stack Overflow
- GitHub
- Discord servers
- Local meetups

### First Job Tips

1. **Apply broadly**: Don't wait until you feel "ready"
2. **Network**: Connections matter
3. **Practice interviews**: Technical and behavioral
4. **Be humble**: You'll learn a lot on the job
5. **Ask questions**: It's expected of beginners
        `
      }
    ]
  }
];

/**
 * Get all unique categories
 */
export const getCategories = () => {
  const categories = new Set();
  learningModules.forEach(module => categories.add(module.category));
  return Array.from(categories);
};

/**
 * Get modules by category
 */
export const getModulesByCategory = (category) => {
  return learningModules.filter(module => module.category === category);
};

/**
 * Get a single module by ID
 */
export const getModuleById = (id) => {
  return learningModules.find(module => module.id === id);
};

export default learningModules;
