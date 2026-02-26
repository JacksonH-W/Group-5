export const UNITS = [
    {
      id: 1,
      title: 'Functions',
      subtitle: '',
      showKeyboard: true,
      lessons: [
        {
          stepId: 1,
          label: 'Build a function',
          learnText:
            'We will build a real function step by step. Each time you finish, it unlocks the next version.',
          targets: [
            'function',
            'function hello',
            'function hello()',
            'function hello() { }',
            'function hello() { return "Hello"; }',
          ],
        },
        {
          stepId: 2,
          label: 'Call the function',
          learnText:
            'Calling a function runs it. Parentheses and the semicolon matter.',
          targets: [
            'hello();',
            'function hello() { return "Hello"; }\nhello();',
          ],
        },
        {
          stepId: 3,
          label: 'Parameters (inputs)',
          learnText:
            'A parameter is an input to a function. Here, name is the input.',
          targets: [
            'function greet(name) { }',
            'function greet(name) { return "Hi " + name; }',
            'function greet(name) { return "Hi " + name; }\ngreet("Rustic");',
          ],
        },
        {
          stepId: 4,
          label: 'Mini program',
          learnText:
            'Type a tiny program: define a function, then call it.',
          targets: [
            'function hello() { return "Hello"; }\nhello();',
          ],
        },
      ],
    },
  
    {
      id: 2,
      title: 'Variables',
      subtitle: '',
      showKeyboard: true,
      lessons: [
        {
          stepId: 1,
          label: 'Make a variable',
          learnText:
            'A variable stores information you want to use later. We build the line piece by piece.',
          targets: [
            'let',
            'let username',
            'let username =',
            'let username = "Rustic";',
          ],
        },
        {
          stepId: 2,
          label: 'Numbers (no quotes)',
          learnText:
            'Numbers do not use quotes. This makes a score variable and increases it.',
          targets: [
            'let score = 0;',
            'score = score + 1;',
            'score = score + 1;\nscore = score + 1;',
          ],
        },
        {
          stepId: 3,
          label: 'const (should not change)',
          learnText:
            'Use const for values you do not want to reassign.',
          targets: [
            'const maxLives = 3;',
            'let lives = maxLives;',
            'const maxLives = 3;\nlet lives = maxLives;',
          ],
        },
        {
          stepId: 4,
          label: 'Mini program',
          learnText:
            'Now type a tiny program using variables. Pay attention to quotes and semicolons.',
          targets: [
            'let username = "Rustic";\nlet score = 0;\nscore = score + 1;',
          ],
        },
      ],
    },
  
    {
      id: 3,
      title: 'If Statements',
      subtitle: '',
      showKeyboard: true,
      lessons: [
        {
          stepId: 1,
          label: 'If basics',
          learnText:
            'An if statement lets your program make decisions based on a condition.',
          targets: [
            'if',
            'if (score >= 10) { }',
            'if (score >= 10) {\n  // TODO\n}',
          ],
        },
        {
          stepId: 2,
          label: 'If + else',
          learnText:
            'else runs when the condition is false.',
          targets: [
            'if (score >= 10) { }\nelse { }',
            'if (score >= 10) {\n  // TODO\n}\nelse {\n  // TODO\n}',
          ],
        },
        {
          stepId: 3,
          label: 'Exact match (===)',
          learnText:
            '=== checks if two values are exactly the same (including type).',
          targets: [
            'if (username === "Rustic") { }',
            'if (username === "Rustic") {\n  // TODO\n}',
          ],
        },
        {
          stepId: 4,
          label: 'Mini program',
          learnText:
            'Type a small decision program: set score, then check it.',
          targets: [
            'let score = 9;\nif (score >= 10) {\n  // TODO\n}\nelse {\n  // TODO\n}',
          ],
        },
      ],
    },
  
    {
      id: 4,
      title: 'Loops (for)',
      subtitle: '',
      showKeyboard: true,
      lessons: [
        {
          stepId: 1,
          label: 'For loop header',
          learnText:
            'A for loop repeats code. It has: start; condition; update.',
          targets: [
            'for',
            'for (let i = 0; i < 5; i = i + 1) { }',
            'for (let i = 0; i < 5; i = i + 1) {\n  // TODO\n}',
          ],
        },
        {
          stepId: 2,
          label: 'Loop body',
          learnText:
            'The braces hold the code that repeats. Indentation helps readability.',
          targets: [
            'for (let i = 0; i < 5; i = i + 1) {\n  score = score + 1;\n}',
            'let score = 0;\nfor (let i = 0; i < 5; i = i + 1) {\n  score = score + 1;\n}',
          ],
        },
        {
          stepId: 3,
          label: 'Mini program',
          learnText:
            'Now type a tiny program: loop 5 times and increase score.',
          targets: [
            'let score = 0;\nfor (let i = 0; i < 5; i = i + 1) {\n  score = score + 1;\n}',
          ],
        },
      ],
    },
  ]