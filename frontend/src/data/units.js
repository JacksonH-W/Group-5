export const UNITS = [
    {
      id: 1,
      title: 'Functions',
      subtitle: '',
      showKeyboard: true,
      lessons: [
        {
          stepId: 1,
          backendLessonId: '8b8fa262-d683-4f9c-a20d-793b1d25b557',
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
          backendLessonId: '36bb7f66-b6db-4939-94b9-d010884520e9',
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
          backendLessonId: 'f6b7d614-518b-4e45-bb47-f48b5a82d38d',
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
          backendLessonId: '75511eb8-551f-431f-8506-980bdd77bd23',
          label: 'Mini program (adaptive)',
          learnText:
            'A full tiny program. Higher tiers add more calls and structure.',
          targetsByTier: {
            1: ['function hello() { return "Hello"; }\nhello();'],
            2: ['function hello() { return "Hello"; }\nhello();\nhello();'],
            3: [
              'function hello() { return "Hello"; }\nhello();\nhello();\nhello();',
            ],
          },
        },
      ],
      finalChallenge: {
        label: 'Final Challenge',
        language: 'javascript',
        prompt:
          'Write a function named greet that takes a parameter called name and returns "Hello " + name. Call greet with the argument "World" and log the result with console.log.',
        starterCode: '// Write your code here\n',
        expectedOutput: 'Hello World',
      },
    },
  
    {
      id: 2,
      title: 'Variables',
      subtitle: '',
      showKeyboard: true,
      lessons: [
        {
          stepId: 1,
          backendLessonId: '1ea1251b-bb01-4bf0-9484-28aff13dc59e',
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
          backendLessonId: '378b809d-a472-40d1-ab80-2621e647f3c5',
          label: 'Numbers (adaptive)',
          learnText: 'Numbers don’t use quotes. Higher tiers do more updates.',
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
          backendLessonId: '24c9be0d-a410-4fb9-8f7f-00dad0580175',
          label: 'const (adaptive)',
          learnText:
            'Use const for values you should not reassign. Higher tiers combine lines.',
          targetsByTier: {
            1: ['const maxLives = 3;'],
            2: ['let lives = maxLives;', 'const maxLives = 3;\nlet lives = maxLives;'],
            3: ['const maxLives = 3;\nlet lives = maxLives;\nlives = lives - 1;'],
          },
        },
        {
          stepId: 4,
          backendLessonId: '3ad6c530-411e-4417-8703-d213955dd7cf',
          label: 'Mini program (adaptive)',
          learnText: 'Put variables together. Higher tiers add another update.',
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
      finalChallenge: {
        label: 'Final Challenge',
        language: 'javascript',
        prompt:
          'Declare a variable score starting at 0. Add 3 to it, then log your updated score with console.log.',
        starterCode: '// Write your code here\n',
        expectedOutput: '3',
      },
    },
  
    {
      id: 3,
      title: 'If Statements',
      subtitle: '',
      showKeyboard: true,
      lessons: [
        {
          stepId: 1,
          backendLessonId: '61af8e09-7372-4fac-8688-816db04e99c6',
          label: 'If basics (adaptive)',
          learnText: 'Make a decision with if. Higher tiers add a body and else.',
          targetsByTier: {
            1: ['if', 'if (score >= 10) { }'],
            2: ['if (score >= 10) {\n  // TODO\n}'],
            3: ['if (score >= 10) {\n  // TODO\n}\nelse {\n  // TODO\n}'],
          },
        },
        {
          stepId: 2,
          backendLessonId: '7eda3673-a238-4a5a-8cc6-6156eb08a9e0',
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
          backendLessonId: 'e47f9d60-f788-443a-9338-417a62c9e0e9',
          label: 'Exact match (===) (adaptive)',
          learnText:
            '=== checks exact equality. Higher tiers add a second condition.',
          targetsByTier: {
            1: ['if (username === "Rustic") { }'],
            2: ['if (username === "Rustic") {\n  // TODO\n}'],
            3: ['if (username === "Rustic" && score >= 10) {\n  // TODO\n}'],
          },
        },
        {
          stepId: 4,
          backendLessonId: '2c1aec10-115b-4610-86bf-5afe0229e62a',
          label: 'Mini program (adaptive)',
          learnText: 'Set a value then branch. Higher tiers add more setup.',
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
      finalChallenge: {
        label: 'Final Challenge',
        language: 'javascript',
        prompt:
          'Declare a variable score and set it to 15. Write an if/else statement: if score is greater than or equal to 10, log "You win!" — otherwise log "Try again".',
        starterCode: '// Write your code here\n',
        expectedOutput: 'You win!',
      },
    },
  
    {
      id: 4,
      title: 'Loops (for)',
      subtitle: '',
      showKeyboard: true,
      lessons: [
        {
          stepId: 1,
          backendLessonId: '127db732-8cad-4152-8edf-0ea67d17be20',
          label: 'For loop header (adaptive)',
          learnText: 'A for loop repeats code. Higher tiers add a body.',
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
          backendLessonId: 'a78136b7-ba5d-494d-b572-80002dad67cb',
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
          backendLessonId: '75df32e6-1117-40d5-b88e-9f2c459f1cda',
          label: 'Mini program (adaptive)',
          learnText:
            'Loop 5 times and increase score. Higher tiers add extra work.',
          targetsByTier: {
            1: [
              'let score = 0;\nfor (let i = 0; i < 5; i = i + 1) {\n  score = score + 1;\n}',
            ],
            2: [
              'let score = 0;\nfor (let i = 0; i < 5; i = i + 1) {\n  score = score + 1;\n}\nscore = score + 1;',
            ],
            3: [
              'let score = 0;\nfor (let i = 0; i < 5; i = i + 1) {\n  score = score + 1;\n}\nscore = score + 1;\nscore = score + 1;',
            ],
          },
        },
      ],
      finalChallenge: {
        label: 'Final Challenge',
        language: 'javascript',
        prompt:
          'Declare a variable score starting at 0. Write a for loop that runs 5 times and adds 1 to score each iteration using score = score + 1. On each iteration log score with console.log.',
        starterCode: '// Write your code here\n',
        expectedOutput: '1\n2\n3\n4\n5\n',
      },
    },
  ]
