# Software Architecture

Type2Code will use a three-tier client-server architecture with a React frontend, FastAPI backend, and PostgreSQL database. The server/backend will follow a MCS design pattern (model controller service). The model will focus on data access and persistence, interacting directly with the database through SQLAlchemy. The service will handle the core business logic, and the controller is responsible for handling user requests (HTTPS REST API), performing the validation, and returning the response to the client. It will be deployed with cloud-hosted components.

## Deployment Architecture

- **Frontend:** React app hosted on Vercel  
- **Backend:** FastAPI server hosted on Render  
- **Database:** PostgreSQL hosted on Supabase  
- **Communication:** HTTPS REST API  

## Major Components

- FastAPI backend that handles managing data persistence, lesson content and retrieval, and tracking typing sessions and accuracy.
- Authentication service with hashing for password storage. (FastAPI Sessions or JWT tokens for keeping track of user sessions)
- PostgreSQL database to store login details, lessons, lesson completion, and accuracy.
- React frontend interface for typing games, dashboard, and mini games.

## Component Interfaces

### REST API for Backend ←→ Frontend

- `POST /api/auth/register` – Create user account (username, email, password)  
- `POST /api/auth/login` – Authenticate user and return session  
- `POST /api/auth/logout` – Invalidate current session  
- `GET /api/lessons` – Fetch all lessons  
- `GET /api/lessons/{lesson_id}` – Fetch a specific lesson  
- `POST /api/practice/start` – Initialize’s user’s practice session  
- `POST /api/practice/submit` – Submit the user’s practice results  
- `GET /api/dashboard/{user_id}` – Get aggregated user dashboard data  

### SQL for Backend ←→ Database

- SQLAlchemy ORM for database operations  

## Frontend

- React Router for navigation  
- Axios for HTTP api calls  
- Individual components and pages  

## Database Schema

### users

- `id` (PK)  
- `username` (unique)  
- `email` (unique)  
- `password_hash`  
- `created_at`  

### lessons

- `id` (PK)  
- `title`  
- `description`  
- `content` (code snippets)  
- `prerequisites` (array of lesson_ids)  
- `difficulty` (1-5)  

### practice_sessions

- `id` (PK)  
- `user_id` (FK - users.id)  
- `lesson_id` (FK - lessons.id)  
- `accuracy`  
- `error_count`  
- `time_seconds`  
- `completed_at`  

### User_progress

- `id` (PK)  
- `user_id` (FK -> users.id)  
- `current-streak` (consecutive days)  
- `lessons_completed`  
- `average_accuracy`  
- `updated_at`  

## Main assumptions

- The frontend would immediately handle character comparison for correct syntax (No need for calling the backend).
- Backend stores session results for progress tracking
- No more than 100 users for MVP.
- Practice sessions submitted after they’re completed.

## Architecture Alternatives

### 1: Microservices Architecture

Would have separate services for managing lessons, UI, authentication, and business logic.

**Pros:**  
- Would allow for more scalability.  
- Isolates issues to one service when they arise.

**Cons:**  
- Would require more thorough communication on how services interact/communicate with each other.  
- It would also require more development time.  
- Additionally, it would prove more difficult to host all the microservices if we take a hosting approach.

### 2: MVC Architecture

Django is more powerful with a built-in ORM.

**Pros:**  
- Single framework, built-in admin panel, everything consolidated into one architecture (views, controller, models).

**Cons:**  
- Heavier framework and would take more time to adjust to Django.  
- Also would stray away from normal API patterns.

## Software Design

### Backend (API)

- `auth/`  
  Handles authentication, login, password hashing, and JWT validation.
- `lessons/`  
  Lesson retrieval and metadata. 
- `practice/`  
  Practice session lifecycle and metrics submission.
- `dashboard/`  
  Aggregation logic for user progress and statistics. 
- `models/`  
  SQLAlchemy ORM models. 
- `schemes/`  
  Pydantic request/response validation.
- `db/`  
  Database session and configuration. 

## Coding Guidelines

- **Python (most recent version):** https://peps.python.org/pep-0008/  
- **SQLAlchemy:** https://docs.sqlalchemy.org/en/21/orm/session_basics.html  
- **JavaScript:** https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Code_style_guide/JavaScript  
- **HTML:** https://www.w3schools.com/html/html5_syntax.asp  
- **CSS:** https://docs.ckan.org/en/2.9/contributing/css.html  

## Process description

### i. Risk assessment

- Likelihood of occurring (high, medium, low);  
- Impact if it occurs (high, medium, low);  
- Evidence upon which you base your estimates, such as what information you have already gathered or what experiments you have done;  
- Steps you are taking to reduce the likelihood or impact, and steps to permit better estimates;  
- Plan for detecting the problem (trivial example: running automated tests to determine that a file format has changed);  
- Mitigation plan should it occur.  

### Risk 1: Practice Session API Data Contract Mismatch

- **Likelihood:** Medium  
- **Impact:** High  
- **Evidence:** Practice results are generated client-side and submitted through `/api/practice/submit`, creating potential schema inconsistencies between frontend payloads and backend persistence in `practice_sessions`
- **Steps to reduce likelihood / improve estimates:** We’ll be defining shared request/response schemas and keep them version-controlled with the backend API. With a prototype of our project we'll be testing and confirming that frontend and backend expectations match before moving forward.  
- **Detection plan:** We’ll be automating tests that validate requests using known payload, and backend validation errors and http responses will be monitored to identify mismatches.  
- **Mitigation:** If a mismatch is detected, we temporarily stop the API contract and patch the mismatching side (either frontend payload or backend parsing) to restore compatibility. If necessary for the MVP, we can reduce the practice payload to a minimal required subset (lesson_id, accuracy, duration, error_count) and then defer the optional fields until schema alignment is re-established.

### Risk 2: Practice Submission Endpoint Performance Degradation

- **Likelihood:** Medium  
- **Impact:** Medium  
- **Evidence:** System performance requirements specify <200ms feedback and support for ~100 concurrent users, placing load pressure on practice submission endpoints  
- **Steps to reduce likelihood / improve estimates:** We’ll be profiling practice submissions early on and ensure use of realistic payloads sized and simulated concurrent requests. Database queries will be indexed and reviewed as well.  
- **Detection plan:** We plan on load-testing with adequate tools to simulate up to 100 concurrent users and logging response times.  
- **Mitigation:** If submission latency exceeds the acceptable limit, we can simplify the submission logic by redirecting non-critical computations (dashboard) to background or on-demand calculations. We can also reduce payload size and add basic rate limiting or batching to stabilize performance under concurrent load.

### Risk 3: Practice Metrics Calculation Errors

- **Likelihood:** Medium  
- **Impact:** High  
- **Evidence:** Accuracy and timing values directly feed progress tracking and dashboard aggregation logic, making incorrect calculations highly visible to users  
- **Steps to reduce likelihood / improve estimates:** Calculations will be made very clear and have a single shared backend module. Tests will be conducted with known inputs and expected outputs logged and validated on correctness.  
- **Detection plan:** Separation of unit tests which ensure metric calculations, and integration tests which will compare session submissions with resulting dashboard metrics will ensure consistency.  
- **Mitigation:** If calculation errors are found, we will centralize metric calculations in a single validated backend function and recompute affected user metrics from stored practice session data. Incorrect dashboard values will be recalculated server-side to ensure consistency without requiring users to redo completed practice sessions.

### Risk 4: Practice Session Database Persistence Failure

- **Likelihood:** Low  
- **Impact:** High  
- **Evidence:** The system depends on PostgreSQL persistence to store completed practice sessions and maintain user progress reliability, making failed writes a critical data-loss risk  
- **Steps to reduce likelihood / improve estimates:** Enforcing database constraints and transaction handling will minimize errors, and to ensure this database error handling will be tested as we develop.  
- **Detection plan:** Logs will notify us of database writes and exceptions, and integration tests will verify the errors are handled adequately.  
- **Mitigation:** If the database fails, we will implement retry logic and show save-status feedback to the user. In the event of persistent failures, the practice results will be temporarily cached on the client-side and resubmitted once the database connection is restored to help with data loss.

### Risk 5: Practice-to-Dashboard Data Integration Errors

- **Likelihood:** Medium  
- **Impact:** Medium  
- **Evidence:** Dashboard aggregation logic depends on `practice_sessions` data for streaks, accuracy summaries, and progress visualization, increasing the risk of integration mismatches between modules  
- **Steps to reduce likelihood / improve estimates:** A clear definition of data contracts between `practice_sessions` and dashboard aggregation logic will let us incrementally test dashboard outputs as more practice data comes through.  
- **Detection plan:** Manual verification of raw practice data and dashboard values will be used to verify that completed practice sessions update the dashboard.  
- **Mitigation:** If integration issues arise, we can separate dashboard aggregation from real-time practice submission and regenerate dashboard data from raw `practice_sessions` records. This allows us to correct aggregation logic without modifying or losing underlying practice data.

### Risk 6: Real-Time Typing Feedback Latency or Inconsistency

- **Likelihood:** Medium  
- **Impact:** High  
- **Evidence:** A core feature of our system is to highlight errors as users type code. This is going to be handled mostly by the frontend and will be subject to input handling, rendering performance, and browser differences.  
- **Steps to reduce likelihood / improve estimates:** We will optimize as much as possible to ensure that that are minimal state updates and we will ensure to test across multiple platforms to aim for realistic goals throughout all of them  
- **Detection plan:** Manual testing of browser performance will measure input latency and rendering time.  
- **Mitigation:** If real-time feedback becomes inconsistent or slow, we will reduce rendering complexity by batching keystroke updates and limiting re-renders. As a fallback for the MVP, we will prioritize correctness over animation by simplifying visual feedback while preserving accurate error detection.

**Explicitly state how this has changed since you submitted your Requirements document.**  
Since our requirement document, this risk assessment introduces many front-end usability and performance issues that we have had to thoroughly analyze the likelihood and impact that the risk could have. Overall, as a team, we have thought through scenarios in which issues arise. 

### ii. Project schedule

**Week 5 – Backend implementation (current week)**  
- Finalize database schema in Supabase  
- Implement authentication (registration, login, logout, session handling)  
- Implement core API endpoints:  
  - Fetch all lessons  
  - Fetch a specific lesson by ID  
  - Initialize practice sessions  
  - Submit practice results  
- Validate API contracts using FastAPI schemas  
- Begin backend unit and integration testing (pytest + FastAPI TestClient)  

**Week 6 – Frontend implementation**  
- Implement authentication UI and protected routes  
- Build lesson dashboard UI and lesson selection flow  
- Implement typing practice interface (text rendering, input capture, real-time validation scaffolding)  
- Connect frontend to backend APIs for lessons and practice session lifecycle  
- Add client-side input validation and basic error handling  

**Week 7 – Mini-games implementation**  
- Implement at least one interactive mini-game (e.g., debugger-style or bubble pop game)  
- Connect mini-game logic to lesson/practice correctness events  
- Implement a reward/feedback loop from correct solutions to game actions  
- Ensure mini-games integrate cleanly with existing practice session data  

**Week 8 – Dashboard implementation**  
- Implement backend aggregation logic (streaks, accuracy summaries, progress history)  
- Implement dashboard UI components:  
  - User progress overview  
  - Recent practice results  
  - Streak and performance indicators  
- Verify correct data flow from practice sessions to dashboard visualizations  

**Week 9 – Testing, debugging, and polishing**  
- Full end-to-end testing:  
  - Register → Login → Lesson selection → Practice → Mini-game → Dashboard  
- Fix critical bugs across frontend, backend, and database layers  
- Performance testing (target: ~100 concurrent users, acceptable page load times)  
- Usability testing with students and teachers; iterate based on feedback  

**Week 10 – Extra implementation (time permitting)**  
- Cloud host project online  
- Add additional mini-games or lesson types  
- Improve UI/UX polish and accessibility  
- Add small quality-of-life features (loading states, clearer feedback, error messaging)  
- Refactor and document any technical debt discovered during testing  

### iii. Team structure

- **Logan Bachman** – Implement authentication, registration, and logout logic and session tracking. Implement a model for users as well. Host SupaBase database.  
- **Rustic Boulton** – Implement a way to fetch all lessons from the dashboard. Also, implement a way to fetch a specific lesson from the dashboard  
- **Ulises Cordova** – Collecting all user data, compiling it individually, and inserting it into a high-level dataset.  
- **Jackson Happel-Walvatne** – Initialize’s user’s practice session and submits the user’s practice results.

### iv. Test plan & bugs

**Backend (Python/FastAPI)** – Framework: pytest  
- Authentication: password hashing, JWT validation, session management  
- Practice logic: accuracy calculation, error counting, timing functions  
- Dashboard: streak calculation, progress aggregation  

**Frontend (React)** – Framework: Jest + React Testing Library  
- TypingPractice: real-time error highlighting and character validation  
- Dashboard: data rendering, progress calculations  
- Auth forms: input validation, error messages  

- Tests critical business logic and real-time feedback components that directly impact user experience and data integrity.

**Framework:** pytest with FastAPI TestClient  

**Test Suites:**  
- End-to-end user flow: Register → Login → Fetch lessons → Start practice → Submit results → View dashboard  
- Authentication flow: Session generation, protected endpoints, session persistence  
- Practice workflow: Session creation, result submission, progress updates  
- Database constraints: Foreign keys, concurrent sessions, auto-save  
- Performance: 100 concurrent users, page load times  

**Why Sufficient:** Validates three-tier architecture integration, API contracts, and meets performance/reliability requirements.

**Usability Testing participants:** Students, teachers  

**Test Scenarios:**  
- First-time account creation and lesson access (3-click requirement)  
- Practice mode effectiveness and error highlighting clarity  
- Mobile/tablet accessibility  
- Dashboard comprehension  

### v. Documentation plan

Type2Code will have lightweight documentation that will have some different audiences, users (students, TAs, and Teachers), developers, and maintainers. For users, we will create documentation in order to guide them through account creation, starting lessons, completing practices, and playing mini games. For developers, we will have documentation that describes our system architecture, repository structure, and the process of adding lessons and mini games. This aims to streamline contributions and will live in our reports directory. Deployment and maintenance will be documented as well; this will, of course, include environment setup, API configuration, and database schema notes. This will act as the foundation for all of our future extensions of the system. This documentation will be added weekly as we move forward.
