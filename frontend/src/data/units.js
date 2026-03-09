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
        label: 'Build a function',
        learnText:
          'Practice writing JavaScript functions — declarations, return values, and calls.',
        targetsByTier: {
          1: [
            'function hello() {',
            '  return "Hello";',
            '}',
            'hello();',

            'function greet() {',
            '  return "Hi";',
            '}',
            'greet();',

            'function run() {',
            '  return 1;',
            '}',
            'run();',

            'function greet(name) {',
            '  return "Hi " + name;',
            '}',
            'greet("World");',

            'function add(a, b) {',
            '  return a + b;',
            '}',
            'add(1, 2);',

            'function double(n) {',
            '  return n + n;',
            '}',
            'double(5);',
          ],
        },
        tierRules: {
          minTier: 1,
          maxTier: 1,
          promoteIf: { wpm: 28, accuracy: 0.95, streak: 2 },
          demoteIf: { wpm: 14, accuracy: 0.85, streak: 2 },
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
        label: 'Variables in JavaScript',
        learnText:
          'Practice declaring and updating variables with let and const.',
        targetsByTier: {
          1: [
            'let score = 0;',
            'score = score + 1;',

            'let name = "Rustic";',
            'let level = 1;',

            'let lives = 3;',
            'lives = lives - 1;',

            'let points = 10;',
            'points = points + 5;',
            'console.log(points);',

            'const maxLives = 3;',
            'let remaining = maxLives;',
            'remaining = remaining - 1;',

            'let count = 0;',
            'count = count + 1;',
            'count = count + 1;',
            'count = count + 1;',
            'console.log(count);',

            'const bonus = 5;',
            'let total = 0;',
            'total = total + bonus;',
            'total = total + bonus;',
            'console.log(total);',
          ],
        },
        tierRules: {
          minTier: 1,
          maxTier: 1,
          promoteIf: { wpm: 28, accuracy: 0.95, streak: 2 },
          demoteIf: { wpm: 14, accuracy: 0.85, streak: 2 },
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
        label: 'If statements',
        learnText:
          'Practice if/else branching with real JavaScript conditions.',
        targetsByTier: {
          1: [
            'if (score >= 10) {',
            '  console.log("win");',
            '}',

            'if (lives > 0) {',
            '  console.log("keep going");',
            '}',

            'if (score >= 10) {',
            '  console.log("win");',
            '} else {',
            '  console.log("try again");',
            '}',

            'if (lives > 0) {',
            '  console.log("keep going");',
            '} else {',
            '  console.log("game over");',
            '}',

            'let score = 9;',
            'if (score >= 10) {',
            '  console.log("win");',
            '} else {',
            '  console.log("try again");',
            '}',
          ],
        },
        tierRules: {
          minTier: 1,
          maxTier: 1,
          promoteIf: { wpm: 28, accuracy: 0.95, streak: 2 },
          demoteIf: { wpm: 14, accuracy: 0.85, streak: 2 },
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
        label: 'For loops',
        learnText:
          'Practice writing for loops and using them to update variables.',
        targetsByTier: {
          1: [
            'for (let i = 0; i < 5; i = i + 1) {',
            '  console.log(i);',
            '}',

            'for (let x = 0; x < 3; x = x + 1) {',
            '  console.log(x);',
            '}',

            'let score = 0;',
            'for (let i = 0; i < 5; i = i + 1) {',
            '  score = score + 1;',
            '}',
            'console.log(score);',

            'let lives = 3;',
            'for (let x = 0; x < 3; x = x + 1) {',
            '  lives = lives - 1;',
            '}',
            'console.log(lives);',

            'let points = 0;',
            'for (let i = 0; i < 4; i = i + 1) {',
            '  points = points + 5;',
            '}',
            'console.log(points);',
          ],
        },
        tierRules: {
          minTier: 1,
          maxTier: 1,
          promoteIf: { wpm: 28, accuracy: 0.95, streak: 2 },
          demoteIf: { wpm: 14, accuracy: 0.85, streak: 2 },
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
