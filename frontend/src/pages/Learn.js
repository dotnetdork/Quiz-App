/**
 * Learn Page Component
 * 
 * An IT and Programmer's Dictionary/Reference guide.
 * Organized by pathways: Programming, Cybersecurity, Networking, etc.
 * Contains key terms, concepts, diagrams, and important information.
 */
import { useState } from 'react';
import './Learn.css';

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
            definition: 'Creating and managing strong, unique passwords for all accounts. Use password managers and enable multi-factor authentication.',
            keyFeatures: ['Long & complex', 'Unique per account', 'Password manager', 'MFA enabled']
          },
          {
            term: 'Regular Updates',
            definition: 'Keeping all software, operating systems, and applications up to date with the latest security patches.',
            keyFeatures: ['Automatic updates', 'Patch management', 'Update schedule', 'Test before deploy']
          },
          {
            term: 'Backup Strategy',
            definition: 'Regularly backing up important data following the 3-2-1 rule: 3 copies, 2 different media types, 1 offsite.',
            keyFeatures: ['Regular backups', 'Test restoration', 'Encrypted backups', 'Offsite storage']
          },
          {
            term: 'Principle of Least Privilege',
            definition: 'Users and programs should only have the minimum level of access necessary to perform their functions.',
            keyFeatures: ['Minimal permissions', 'Role-based access', 'Regular audits', 'Time-limited access']
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
 * Main Learn Page Component
 */
function Learn() {
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

    return results.slice(0, 20); // Limit results
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
    <div className="learn-page">
      <div className="learn-header">
        <h1>📚 Learn</h1>
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
      <div className="learn-footer">
        <p>
          💡 <strong>Tip:</strong> Use the search bar to quickly find any topic across all categories!
        </p>
      </div>
    </div>
  );
}

export default Learn;
