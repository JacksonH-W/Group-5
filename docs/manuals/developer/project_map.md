# Type2Code Project Map

This document explains how the Type2Code frontend is structured, how lessons and practice flow work, and where progression logic is implemented. 

---

## Frontend Routing

Routes are defined in `frontend/src/App.jsx`.

### Public routes
- `/login` → `frontend/src/pages/LoginPage.jsx`
- `/register` → `frontend/src/pages/RegisterPage.jsx`

### Protected routes (require authentication)
- `/lessons` → `frontend/src/pages/LessonsPage.jsx`
- `/practice/:unitId/:stepId` → `frontend/src/pages/PracticePage.jsx`
- `/game` → `frontend/src/pages/GamePage.jsx`
- `/` → redirects to `/lessons`
- `/dashboard` → redirects to `/lessons`

Route protection is handled by:
- `PrivateRoute` → `frontend/src/components/PrivateRoute.jsx`
- `AuthProvider` → `frontend/src/context/AuthProvider.jsx`

---

## Lessons Page (Curriculum Selection)

### Files
- `frontend/src/pages/LessonsPage.jsx`
- `frontend/src/data/units.js`
- `frontend/src/utils/progress.js`
- `frontend/src/styles/lessonsGrid.css`

### Responsibilities
- Displays all learning units and steps in a grid layout
- Shows locked vs unlocked lessons
- Routes users into the correct practice step
- Reflects user progression visually

### Data source
Lessons are driven by shared curriculum data defined in:

frontend/src/data/units.js


Each unit contains:
- `id` — unit identifier
- `title` — displayed unit name
- `showKeyboard` — whether the on-screen keyboard is shown
- `steps[]` — ordered list of practice steps

Each step contains:
- `stepId` — step identifier within the unit
- `label` — display name shown in the Lessons grid
- `chunk` — text the user must type
- `repeats` — how many times the chunk is repeated in the practice grid

### Locking & unlocking
- Locked steps are visually disabled and show a lock icon
- Unlocked steps are clickable and route to `/practice/:unitId/:stepId`
- Lock state is computed using progression utilities (see below)

---

## Practice Page (Typing Engine)

### Files
- `frontend/src/pages/PracticePage.jsx`
- `frontend/src/styles/practice.css`

### Responsibilities
- Renders the typing grid for the current lesson step
- Captures all keyboard input through a hidden input
- Validates typed characters against the expected prompt
- Tracks mistakes (`Wrong`) and corrections (`Fixed`)
- Highlights the next expected key on the on-screen keyboard
- Automatically advances to the next step when completed

### Key behaviors
- Input auto-focuses on load and on click anywhere in the practice area
- Each character is marked as correct or incorrect in real time
- Backspace counts as a “fix”
- Completing a step:
  - Marks the step as completed in progress storage
  - Unlocks the next step
  - Allows advancing via button, Space, or ArrowRight
- After the final step of a unit, the user is routed back to `/lessons`

---

## Progression System

### Files
- `frontend/src/utils/progress.js`

### Storage
Progress is currently stored **client-side** using localStorage:

localStorage key: type2code_progress_v1


### Progress utilities
- `loadProgress()` — loads saved progress from localStorage
- `saveProgress(progress)` — persists progress to localStorage
- `markStepCompleted(progress, unitId, stepId)` — marks a step as complete and updates unlocks

### Progression rules
- Unit 1 is unlocked by default
- Within a unit:
  - Step N unlocks after Step N-1 is completed
- Between units:
  - Unit N unlocks only after all steps in Unit N-1 are completed
- Lessons page reflects the current unlock state dynamically
- Progress persists across page reloads

### Testing note
To reset progress during development or demos:
```js
localStorage.clear()
