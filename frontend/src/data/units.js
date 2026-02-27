// frontend/src/data/units.js

export const UNITS = [
    {
      id: 1,
      title: 'Functions',
      subtitle: '',
      showKeyboard: true,
      lessons: [
        {
          stepId: 1,
          label: 'Build a function (adaptive)',
          learnText:
            'Start simple. If you type fast and accurate, the function grows.',
          targetsByTier: {
            1: ['function', 'function hello', 'function hello()'],
            2: ['function hello() { }', 'function hello() { return "Hello"; }'],
            3: [
              'function hello() { return "Hello"; }',
              'function hello() { return "Hello"; }\nhello();',
            ],
          },
          tierRules: {
            minTier: 1,
            maxTier: 3,
            promoteIf: { wpm: 28, accuracy: 0.95, streak: 2 },
            demoteIf: { wpm: 14, accuracy: 0.85, streak: 2 },
          },
        },
        {
          stepId: 2,
          label: 'Call the function (adaptive)',
          learnText:
            'Calling runs the function. Faster accuracy unlocks multi-line calls.',
          targetsByTier: {
            1: ['hello();'],
            2: ['function hello() { return "Hello"; }\nhello();'],
            3: [
              'function hello() { return "Hello"; }\nhello();\nhello();',
              'function hello() { return "Hello"; }\nhello();\nhello();\nhello();',
            ],
          },
        },
        {
          stepId: 3,
          label: 'Parameters (adaptive)',
          learnText:
            'Add an input parameter and return a message. Tier 3 adds a call.',
          targetsByTier: {
            1: ['function greet(name) { }'],
            2: ['function greet(name) { return "Hi " + name; }'],
            3: [
              'function greet(name) { return "Hi " + name; }\ngreet("Rustic");',
            ],
          },
        },
        {
          stepId: 4,
          label: 'Mini program (adaptive)',
          learnText:
            'A full tiny program. Higher tiers add more calls and structure.',
          targetsByTier: {
            1: ['function hello() { return "Hello"; }\nhello();'],
            2: [
              'function hello() { return "Hello"; }\nhello();\nhello();',
            ],
            3: [
              'function hello() { return "Hello"; }\nhello();\nhello();\nhello();',
            ],
          },
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
          label: 'Make a variable (adaptive)',
          learnText:
            'Build a variable line-by-line. Higher tiers add a second variable.',
          targetsByTier: {
            1: ['let', 'let username', 'let username =', 'let username = "Rustic";'],
            2: [
              'let username = "Rustic";\nlet score = 0;',
              'let username = "Rustic";\nlet score = 0;\nscore = score + 1;',
            ],
            3: [
              'let username = "Rustic";\nlet score = 0;\nscore = score + 1;\nscore = score + 1;',
            ],
          },
        },
        {
          stepId: 2,
          label: 'Numbers (adaptive)',
          learnText:
            'Numbers don’t use quotes. Higher tiers do more updates.',
          targetsByTier: {
            1: ['let score = 0;', 'score = score + 1;'],
            2: ['let score = 0;\nscore = score + 1;\nscore = score + 1;'],
            3: [
              'let score = 0;\nscore = score + 1;\nscore = score + 1;\nscore = score + 1;',
            ],
          },
        },
        {
          stepId: 3,
          label: 'const (adaptive)',
          learnText:
            'Use const for values you should not reassign. Higher tiers combine lines.',
          targetsByTier: {
            1: ['const maxLives = 3;'],
            2: ['let lives = maxLives;', 'const maxLives = 3;\nlet lives = maxLives;'],
            3: [
              'const maxLives = 3;\nlet lives = maxLives;\nlives = lives - 1;',
            ],
          },
        },
        {
          stepId: 4,
          label: 'Mini program (adaptive)',
          learnText:
            'Put variables together. Higher tiers add another update.',
          targetsByTier: {
            1: ['let username = "Rustic";\nlet score = 0;\nscore = score + 1;'],
            2: [
              'let username = "Rustic";\nlet score = 0;\nscore = score + 1;\nscore = score + 1;',
            ],
            3: [
              'let username = "Rustic";\nlet score = 0;\nscore = score + 1;\nscore = score + 1;\nscore = score + 1;',
            ],
          },
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
          label: 'If basics (adaptive)',
          learnText:
            'Make a decision with if. Higher tiers add a body and else.',
          targetsByTier: {
            1: ['if', 'if (score >= 10) { }'],
            2: ['if (score >= 10) {\n  // TODO\n}'],
            3: [
              'if (score >= 10) {\n  // TODO\n}\nelse {\n  // TODO\n}',
            ],
          },
        },
        {
          stepId: 2,
          label: 'If + else (adaptive)',
          learnText:
            'else runs when the condition is false. Higher tiers add setup.',
          targetsByTier: {
            1: ['if (score >= 10) { }\nelse { }'],
            2: ['if (score >= 10) {\n  // TODO\n}\nelse {\n  // TODO\n}'],
            3: [
              'let score = 9;\nif (score >= 10) {\n  // TODO\n}\nelse {\n  // TODO\n}',
            ],
          },
        },
        {
          stepId: 3,
          label: 'Exact match (===) (adaptive)',
          learnText:
            '=== checks exact equality. Higher tiers add a second condition.',
          targetsByTier: {
            1: ['if (username === "Rustic") { }'],
            2: ['if (username === "Rustic") {\n  // TODO\n}'],
            3: [
              'if (username === "Rustic" && score >= 10) {\n  // TODO\n}',
            ],
          },
        },
        {
          stepId: 4,
          label: 'Mini program (adaptive)',
          learnText:
            'Set a value then branch. Higher tiers add more setup.',
          targetsByTier: {
            1: ['let score = 9;\nif (score >= 10) { }\nelse { }'],
            2: [
              'let score = 9;\nif (score >= 10) {\n  // TODO\n}\nelse {\n  // TODO\n}',
            ],
            3: [
              'let username = "Rustic";\nlet score = 9;\nif (score >= 10) {\n  // TODO\n}\nelse {\n  // TODO\n}',
            ],
          },
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
          label: 'For loop header (adaptive)',
          learnText:
            'A for loop repeats code. Higher tiers add a body.',
          targetsByTier: {
            1: ['for', 'for (let i = 0; i < 5; i = i + 1) { }'],
            2: ['for (let i = 0; i < 5; i = i + 1) {\n  // TODO\n}'],
            3: [
              'let score = 0;\nfor (let i = 0; i < 5; i = i + 1) {\n  // TODO\n}',
            ],
          },
        },
        {
          stepId: 2,
          label: 'Loop body (adaptive)',
          learnText:
            'The braces hold repeated code. Higher tiers add setup + more work.',
          targetsByTier: {
            1: ['for (let i = 0; i < 5; i = i + 1) {\n  score = score + 1;\n}'],
            2: [
              'let score = 0;\nfor (let i = 0; i < 5; i = i + 1) {\n  score = score + 1;\n}',
            ],
            3: [
              'let score = 0;\nfor (let i = 0; i < 5; i = i + 1) {\n  score = score + 1;\n}\nscore = score + 1;',
            ],
          },
        },
        {
          stepId: 3,
          label: 'Mini program (adaptive)',
          learnText:
            'Loop 5 times and increase score. Higher tiers add extra work.',
          targetsByTier: {
            1: ['let score = 0;\nfor (let i = 0; i < 5; i = i + 1) {\n  score = score + 1;\n}'],
            2: [
              'let score = 0;\nfor (let i = 0; i < 5; i = i + 1) {\n  score = score + 1;\n}\nscore = score + 1;',
            ],
            3: [
              'let score = 0;\nfor (let i = 0; i < 5; i = i + 1) {\n  score = score + 1;\n}\nscore = score + 1;\nscore = score + 1;',
            ],
          },
        },
      ],
    },
  ]