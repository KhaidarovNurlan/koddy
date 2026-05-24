import type { Journey } from './types';

export const luaJourney: Journey = {
  id: 'lua-journey',
  language: 'lua',
  title: 'Lua Journey',
  chapters: [
    {
      id: 'ch1',
      title: 'Introduction',
      description: 'Get started with Lua',
      lessons: [
        {
          id: 'lua-ch1-l1',
          title: 'Your First Program',
          description: 'Write your first Python script.',
          type: 'lesson-all',
          codingChallenge: {
            title: 'Challenge',
            description: 'Complete the coding challenge below.',
            solution: "print(\"Hello World\")",
            hints: ['Think about the syntax.', 'Check for typos.'],
            starterCode: "// Write your code here",
            challengeDescription: 'Write a program that outputs exactly what is requested.',
            requiredOutput: 'Hello World',
            xp: 10,
            tokens: 1,
            energy: 0,
          },
        },
        {
          id: 'lua-ch1-l2',
          title: 'The Language',
          description: 'Learn the basics of Lua programming.',
          type: 'lesson-theory',
          quiz: {
            title: 'Quiz Time',
            description: 'Test what you just learned.',
            xp: 10,
            tokens: 1,
            energy: 0,
            questions: [
              {
                id: 'q1',
                type: 'mark-lines',
                question: 'Find the line that will NOT execute:',
                options: [
                  { text: 'print("Line one")', isCorrect: false, explanation: 'This is a valid print statement and will execute.' },
                  { text: '# print("Line two")', isCorrect: true, explanation: 'Comments start with # and are ignored by Python.' },
                  { text: 'print("Line three")', isCorrect: false, explanation: 'This is a valid print statement and will execute.' }
                ]
              },
              {
                id: 'q2',
                type: 'multiple-choice',
                question: 'What does this code output?',
                codeSnippet: 'print("Hello World!")',
                options: [
                  { text: 'print("Hello World!")', isCorrect: false, explanation: 'The print function evaluates the contents, it does not output the function call itself.' },
                  { text: 'Nothing appears', isCorrect: false, explanation: 'The print function will display the text provided.' },
                  { text: '"Hello World!"', isCorrect: false, explanation: 'Text strings in print() must be enclosed in quotation marks, but the quotation marks themselves are not printed.' },
                  { text: 'Hello World!', isCorrect: true, explanation: 'The print() function displays the text inside the quotation marks exactly as written.' }
                ]
              },
              {
                id: 'q3',
                type: 'fill-in-blank',
                question: 'Display "Welcome" on the screen',
                codeSnippet: '___("Welcome")',
                options: [
                  { text: 'show', isCorrect: false, explanation: 'There is no built-in "show" function in Python.' },
                  { text: 'display', isCorrect: false, explanation: 'There is no built-in "display" function in Python.' },
                  { text: 'print', isCorrect: true, explanation: 'The print() function is the correct way to output text to the screen.' }
                ]
              }
            ],
          },
        },
        {
          id: 'lua-ch1-l3',
          title: 'Mastery Challenge',
          description: 'Prove your knowledge with Mastery!',
          type: 'lesson-mastery',
          codingChallenge: {
            title: 'Mastery Challenge',
            description: 'Show your mastery of Lua print syntax and calculations.',
            solution: "print(5 * 5)\\nprint(\"Finished\")",
            hints: [
              'Use print(5 * 5) to print the numerical result.',
              'Use print("Finished") on the next line to output the completion message.'
            ],
            starterCode: "// Write your code here",
            challengeDescription: 'Write a program that outputs the calculation and the completion message.',
            requiredOutput: '25\nFinished',
            xp: 15, // +5 bonus
            tokens: 2, // +1 bonus
            energy: 0,
          }
        },
        {
          id: 'lua-ch1-l4',
          title: 'Variables',
          description: 'Learn how to store data using variables in Lua.',
          type: 'lesson-all',
          codingChallenge: {
            title: 'Variables Challenge',
            description: 'Create and use variables.',
            solution: "x = 5\\nprint(x)",
            hints: ['Assign the value 5 to a variable named x.', 'Use print(x) to output its value.'],
            starterCode: "// Write your code here",
            challengeDescription: 'Write a program that stores the number 5 in a variable x and prints it.',
            requiredOutput: '5',
            xp: 10,
            tokens: 1,
            energy: 0,
          },
        },
        {
          id: 'lua-ch1-l5',
          title: 'Chapter 1 Completed',
          description: 'Automatically completed when the previous lesson is done.',
          type: 'lesson-trophy',
        },
      ],
    },
    {
      id: 'ch2',
      title: 'Loops & Functions',
      description: 'Reusable blocks of code',
      lessons: [
        {
          id: 'lua-ch2-l1',
          title: 'Introduction to Loops',
          description: 'Understand for and while loops.',
          type: 'lesson-theory',
          quiz: {
            title: 'Loops Quiz',
            description: 'Test your understanding of repeat blocks and range.',
            xp: 15,
            tokens: 2,
            energy: 1,
            questions: [
              {
                id: 'q1',
                type: 'multiple-choice',
                question: 'What is the main difference between a for loop and a while loop?',
                options: [
                  { text: 'for loops run a specific number of times, while while loops run until a condition is false', isCorrect: true, explanation: 'for loops usually iterate over a sequence, whereas while loops continue until their condition becomes false.' },
                  { text: 'while loops are faster than for loops', isCorrect: false, explanation: 'Both loops have similar performance characteristics.' },
                  { text: 'for loops do not support indentation in Python', isCorrect: false, explanation: 'All loop blocks in Python must be indented.' }
                ]
              },
              {
                id: 'q2',
                type: 'multiple-choice',
                question: 'What numbers will range(3) generate inside a for loop?',
                options: [
                  { text: '0, 1, 2', isCorrect: true, explanation: 'range(n) starts from 0 and goes up to, but does not include, n.' },
                  { text: '1, 2, 3', isCorrect: false, explanation: 'Python range starts at 0 by default, not 1.' },
                  { text: '0, 1, 2, 3', isCorrect: false, explanation: 'The stop value in range is exclusive, so 3 is not generated.' }
                ]
              },
              {
                id: 'q3',
                type: 'multiple-choice',
                question: 'How do you prevent a while loop from running forever (infinite loop)?',
                options: [
                  { text: 'By making sure the loop condition eventually becomes False', isCorrect: true, explanation: 'A while loop executes as long as the condition is True, so updating variables in the block to make the condition False is necessary.' },
                  { text: 'By never using a while loop', isCorrect: false, explanation: 'while loops are a valid and useful programming construct.' },
                  { text: 'By printing a message inside the loop', isCorrect: false, explanation: 'Printing doesn\'t affect the loop condition evaluation.' }
                ]
              }
            ]
          }
        },
        {
          id: 'lua-ch2-l2',
          title: 'The While Loop',
          description: 'Repeat code while a condition is True.',
          type: 'lesson-all',
          codingChallenge: {
            title: 'Counting Challenge',
            description: 'Write a while loop to print numbers.',
            solution: "i = 1\\nwhile i <= 3:\\n    print(i)\\n    i += 1",
            hints: [
              'Write while followed by the condition i <= 3.',
              'Make sure you increment i by 1 (i += 1) inside the loop.'
            ],
            starterCode: "// Write your code here",
            challengeDescription: 'Print the numbers 1, 2, and 3 using a while loop.',
            requiredOutput: '1\n2\n3',
            xp: 15,
            tokens: 2,
            energy: 1,
          }
        },
        {
          id: 'lua-ch2-l3',
          title: 'Introduction to Functions',
          description: 'Learn how to write reusable blocks of code.',
          type: 'lesson-theory',
          quiz: {
            title: 'Functions Quiz',
            description: 'Test your knowledge on defining and calling functions.',
            xp: 15,
            tokens: 2,
            energy: 1,
            questions: [
              {
                id: 'q1',
                type: 'multiple-choice',
                question: 'Which keyword is used to define a function in Python?',
                options: [
                  { text: 'def', isCorrect: true, explanation: 'def is short for define and begins a function definition in Python.' },
                  { text: 'func', isCorrect: false, explanation: 'func is used in Go and Swift, not in Python.' },
                  { text: 'function', isCorrect: false, explanation: 'function is used in JavaScript, not in Python.' }
                ]
              },
              {
                id: 'q2',
                type: 'multiple-choice',
                question: 'What is the output of this code?\n\ndef greet():\n    print("Hi")',
                options: [
                  { text: 'Nothing, because the function is defined but not called', isCorrect: true, explanation: 'Defining a function only stores the code. You must write greet() to execute it.' },
                  { text: 'Hi', isCorrect: false, explanation: 'The function must be explicitly called to run its print statement.' },
                  { text: 'An error occurs', isCorrect: false, explanation: 'This is syntactically valid Python and will not crash.' }
                ]
              },
              {
                id: 'q3',
                type: 'multiple-choice',
                question: 'What is the purpose of the return statement in a function?',
                options: [
                  { text: 'It exits the function and sends a value back to the caller', isCorrect: true, explanation: 'return stops execution of the function and provides the output value back to where it was invoked.' },
                  { text: 'It restarts the function from the beginning', isCorrect: false, explanation: 'return exits the function, it does not restart it.' },
                  { text: 'It prints the value to the console screen', isCorrect: false, explanation: 'print outputs text to the screen; return passes data inside the program code.' }
                ]
              }
            ]
          }
        },
        {
          id: 'lua-ch2-l4',
          title: 'Mastery Challenge',
          description: 'Prove your knowledge with Mastery!',
          type: 'lesson-mastery',
          codingChallenge: {
            title: 'Mastery Challenge',
            description: 'Write a complex function containing a loop.',
            solution: "def sum_even(n):\\n    total = 0\\n    for i in range(1, n + 1):\\n        if i % 2 == 0:\\n            total += i\\n    return total\\n\\nprint(sum_even(5))",
            hints: [
              'Use range(1, n + 1) to loop through 1 to n.',
              'Use the modulo operator % to check if a number is even (i % 2 == 0).',
              'Keep a running sum and return it after the loop.'
            ],
            starterCode: "// Write your code here",
            challengeDescription: 'Write a function sum_even(n) that returns the sum of even numbers from 1 to n. Print the output of sum_even(5) (2 + 4 = 6).',
            requiredOutput: '6',
            xp: 20, // +5 bonus
            tokens: 3, // +1 bonus
            energy: 1,
          }
        },
        {
          id: 'lua-ch2-l5',
          title: 'Function Parameters',
          description: 'Test your understanding of functions.',
          type: 'lesson-challenge',
          codingChallenge: {
            title: 'Greeting Challenge',
            description: 'Define and invoke a function with an argument.',
            solution: "def greet(name):\\n    print(\"Hello, \" + name)\\n\\ngreet(\"Bob\")",
            hints: [
              'Define greet with one parameter named name: def greet(name):',
              'Concatenate "Hello, " with name inside print().',
              'Call greet passing "Bob" as a string.'
            ],
            starterCode: "// Write your code here",
            challengeDescription: 'Write a function greet(name) that prints "Hello, " followed by the name. Call it with "Bob".',
            requiredOutput: 'Hello, Bob',
            xp: 15,
            tokens: 2,
            energy: 1,
          }
        },
        {
          id: 'lua-ch2-l6',
          title: 'Return Statement',
          description: 'Apply your knowledge in a mini-project.',
          type: 'lesson-project',
          codingChallenge: {
            title: 'Multiplication Challenge',
            description: 'Write a function that returns a value.',
            solution: "def multiply(a, b):\\n    return a * b\\n\\nprint(multiply(3, 4))",
            hints: [
              'Use the return keyword to return the result of a * b.',
              'Use print() to display the output of multiply(3, 4).'
            ],
            starterCode: "// Write your code here",
            challengeDescription: 'Create a function multiply(a, b) that returns their product. Print the value of multiply(3, 4).',
            requiredOutput: '12',
            xp: 15,
            tokens: 2,
            energy: 1,
          }
        },
        {
          id: 'lua-ch2-l7',
          title: 'Chapter 2 Completed',
          description: 'Automatically completed when the previous lesson is done.',
          type: 'lesson-trophy',
        },
      ],
    },
    {
      id: 'ch3',
      title: 'Calculator',
      description: 'Build a calculator in Lua',
      lessons: [
        {
          id: 'lua-ch3-l1',
          title: 'Simple Math Operations',
          description: 'Learn basic arithmetic operations.',
          type: 'lesson-challenge',
          codingChallenge: {
            title: 'Arithmetic Operators',
            description: 'Perform addition using variables.',
            solution: "a = 10\\nb = 5\\nprint(a + b)",
            hints: ['Use the + operator.', 'Print the result of the addition.'],
            starterCode: "// Write your code here",
            challengeDescription: 'Print the sum of variables a and b.',
            requiredOutput: '15',
            xp: 20,
            tokens: 3,
            energy: 2,
          }
        },
        {
          id: 'lua-ch3-l2',
          title: 'Calculator Step 1: Addition & Subtraction',
          description: 'Define functions for adding and subtracting.',
          type: 'lesson-project',
          codingChallenge: {
            title: 'Calculator Project 1',
            description: 'Write addition and subtraction helpers.',
            solution: "def add(x, y):\\n    return x + y\\n\\ndef subtract(x, y):\\n    return x - y\\n\\nprint(add(10, 5))\\nprint(subtract(10, 5))",
            hints: [
              'Return x + y inside add(x, y).',
              'Return x - y inside subtract(x, y).',
              'Use print() to verify both functions.'
            ],
            starterCode: "// Write your code here",
            challengeDescription: 'Write add(x,y) and subtract(x,y) functions. Print add(10, 5) and subtract(10, 5) on separate lines.',
            requiredOutput: '15\n5',
            xp: 20,
            tokens: 3,
            energy: 2,
          }
        },
        {
          id: 'lua-ch3-l3',
          title: 'Calculator Step 2: Multiplication & Division',
          description: 'Add multiplication and division to your calculator.',
          type: 'lesson-project',
          codingChallenge: {
            title: 'Calculator Project 2',
            description: 'Add helper functions for multiplication and division.',
            solution: "def add(x, y):\\n    return x + y\\n\\ndef subtract(x, y):\\n    return x - y\\n\\ndef multiply(x, y):\\n    return x * y\\n\\ndef divide(x, y):\\n    return x / y\\n\\nprint(multiply(10, 5))\\nprint(divide(10, 5))",
            hints: [
              'Multiply using x * y.',
              'Divide using x / y.',
              'Print the results of multiply(10, 5) and divide(10, 5).'
            ],
            starterCode: "// Write your code here",
            challengeDescription: 'Implement multiply(x, y) and divide(x, y) functions along with previous functions. Print the product and quotient of 10 and 5.',
            requiredOutput: '50\n2.0',
            xp: 20,
            tokens: 3,
            energy: 2,
          }
        },
        {
          id: 'lua-ch3-l4',
          title: 'Calculator Step 3: Zero Division Handling',
          description: 'Handle errors safely in division.',
          type: 'lesson-mastery',
          codingChallenge: {
            title: 'Calculator Project 3',
            description: 'Prevent division by zero crashes.',
            solution: "def add(x, y):\\n    return x + y\\n\\ndef subtract(x, y):\\n    return x - y\\n\\ndef multiply(x, y):\\n    return x * y\\n\\ndef divide(x, y):\\n    if y == 0:\\n        return \"Error: Division by zero\"\\n    return x / y\\n\\nprint(divide(10, 0))",
            hints: [
              'Use if y == 0: inside divide().',
              'Return "Error: Division by zero" exactly if divisor is zero.',
              'Otherwise, return x / y.'
            ],
            starterCode: "// Write your code here",
            challengeDescription: 'Update your divide(x, y) function to return the string "Error: Division by zero" if y is 0. Print the result of divide(10, 0).',
            requiredOutput: 'Error: Division by zero',
            xp: 25, // +5 bonus
            tokens: 4, // +1 bonus
            energy: 2,
          }
        },
        {
          id: 'lua-ch3-l5',
          title: 'Calculator Step 4: Operations Menu',
          description: 'Create operation selection logic.',
          type: 'lesson-project',
          codingChallenge: {
            title: 'Calculator Project 4',
            description: 'Add selection menu function.',
            solution: "def add(x, y): return x + y\\ndef subtract(x, y): return x - y\\ndef multiply(x, y): return x * y\\ndef divide(x, y):\\n    if y == 0: return \"Error: Division by zero\"\\n    return x / y\\n\\ndef calculate(choice, x, y):\\n    if choice == 1:\\n        return add(x, y)\\n    elif choice == 2:\\n        return subtract(x, y)\\n    elif choice == 3:\\n        return multiply(x, y)\\n    elif choice == 4:\\n        return divide(x, y)\\n    else:\\n        return \"Invalid Choice\"\\n\\nprint(calculate(1, 10, 5))\\nprint(calculate(3, 10, 5))",
            hints: [
              'Use if/elif statements to match choice with functions.',
              'Choice 1 -> add, 2 -> subtract, 3 -> multiply, 4 -> divide.',
              'Return "Invalid Choice" in the else block.'
            ],
            starterCode: "// Write your code here",
            challengeDescription: 'Create a function calculate(choice, x, y) that processes selections. Print results of calling calculate(1, 10, 5) and calculate(3, 10, 5).',
            requiredOutput: '15\n50',
            xp: 20,
            tokens: 3,
            energy: 2,
          }
        },
        {
          id: 'lua-ch3-l6',
          title: 'Calculator Project Summary Quiz',
          description: 'Test your understanding of the complete calculator project.',
          type: 'lesson-all',
          quiz: {
            title: 'Calculator Quiz',
            description: 'Test your mastery of math logic and functional selection.',
            xp: 20,
            tokens: 3,
            energy: 2,
            questions: [
              {
                id: 'q1',
                type: 'multiple-choice',
                question: 'In our calculator, what did the divide function return when divisor y was zero?',
                options: [
                  { text: '"Error: Division by zero"', isCorrect: true, explanation: 'We implemented safety validation in the divide function to return a descriptive string instead of crashing.' },
                  { text: '0', isCorrect: false, explanation: 'Returning 0 is mathematically incorrect and not what we coded.' },
                  { text: 'An application crash', isCorrect: false, explanation: 'The program handles this error gracefully.' }
                ]
              },
              {
                id: 'q2',
                type: 'multiple-choice',
                question: 'Why do we write helper functions like add and subtract instead of writing everything in a single block of code?',
                options: [
                  { text: 'It makes code reusable, easier to test, and cleaner', isCorrect: true, explanation: 'Helper functions separate concerns, allowing code reuse and simple testing.' },
                  { text: 'Functions execute twice as fast as plain statements', isCorrect: false, explanation: 'Execution speed is practically identical.' },
                  { text: 'Python requires using functions for all mathematical operations', isCorrect: false, explanation: 'Math can be written inline anywhere.' }
                ]
              },
              {
                id: 'q3',
                type: 'multiple-choice',
                question: 'Which control structure did we use to select the operation in the calculate function?',
                options: [
                  { text: 'If-elif-else statements', isCorrect: true, explanation: 'We used conditionally chained if-elif-else statements to map integer choices to operations.' },
                  { text: 'A while loop', isCorrect: false, explanation: 'Loops are for repetition, not selection.' },
                  { text: 'A try-except statement', isCorrect: false, explanation: 'Exceptions are for handling errors, not menu routing.' }
                ]
              }
            ]
          }
        },
        {
          id: 'lua-ch3-l7',
          title: 'Chapter 3 Completed',
          description: 'Automatically completed when the previous lesson is done.',
          type: 'lesson-trophy',
        },
      ],
    },
  ],
};
