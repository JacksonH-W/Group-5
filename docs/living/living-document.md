TITLE: Type2Code
1. Team info:
Git Repo: https://github.com/JacksonH-W/Group-5
Rustislav Boulton (role:)
Email: boultonr@oregonstate.edu
Discord: pikadrago


Logan Bachman (role:): 
Email: bachmanl@oregonstate.edu
Discord: loganbachman_43291


Jackson Happel-Walvatne (role:): 
Email: happelwj@oregonstate.edu
Discord: jacksonhw


Ulises (role:): 
Email: cordovau@oregonstate.edu
Discord: ulises_58165

Communication:
We plan to communicate using Microsoft Teams, Discord, Zoom, and Email. 
Rules: Weekly meetings (Discord, Zoom, or in person at least once a week). Respond in 24 hours to messages.

2. Product description:
Abstract: An educational game, where students write out code for practice, memorizing patterns, and learning as they progress through the game. The game will be structured around multiple mini-game concepts/ideas, where each section of the game will have the player quickly read what they will be learning and typing out. Then they will have five minutes to practice the material, before lastly playing the mini game, which will progress in difficulty(speed, accuracy, and typing skill will be used and learned throughout this game).   
If someone read nothing but that one paragraph, what do you want them to know?
Learning from doing(Repetition through chunking). 
Structured, goal-oriented learning where students learn code through typing exercises and small game integrations(Learn for 5 or more minutes to master a section of a topic, and unlock minigames or other rewards). 

Goal: What are you trying to do? For example, what task or problem will your system help users with?
The goal of this project is to help beginners or experienced coders start or continue learning coding skills through guided step-by-step typing exercises. This project will provide users with multiple options, topics, and difficulties based on their personal skill level or interests.

Current practice: How is it done today, and what are the limits of current practice?
The way kids are currently learning is by "follow-along" videos or tutorials on YouTube or coding websites. Our group found that multiple websites/products on the market have a similar approach to teaching coding skills to new or experienced coders/programmers. We found that most, if not all, platforms that provide educational programming games often teach/tell students to copy and paste the code into the box and press print. This way of teaching feels cheap, and teaching students to memorize content too quickly often finds the content to be unrewarding or stressful. This also applies to others who may be at a certain level. Students often find it hard to track their actual progress or learning, and it can be very easy to quit if they don't feel that there is progress. 

Novelty: What is new in your approach, and why do you think it will be more successful than other approaches? 
Our approach will be more successful than what others have done in the past because we aren’t focusing on a fast learning environment that just gives students stacks of stressful information. Our combination is not only coding but also typing practice, which is largely relevant in our world, given the time we spend using our computers. We plan to focus on pattern recognition and repetition to emphasize memorization and understanding. Highlighting errors in code for improvement helps show what went wrong, where, and allows you to know what to work on or improve. As you progress, difficulty will increase, but so will your understanding, which will help you recreate/create mini games or projects as you progress through each section.  Ultimately, this is a great way to help students transition from beginner block coding to real text-based coding. 

Effects: Who cares? If you are successful, what difference will it make?
Our target audience is K-12 grade students who want to learn programming skills or get comfortable typing code, as well as teachers and parents who want a structured way to teach coding, at home or in class. If successful, we expect students to feel more confident in their coding syntax, comprehension, and understanding, which are essential in solving real problems they’ll need in future endeavors. This will also encourage students to stick with coding as they will feel less frustrated or burnt out. Tailoring real coding applications and information to a younger audience will allow accessibility to CS education, especially since earlier exposure can spark passion at a young age. With this goal in mind, students will be able to pursue a career in STEM with more confidence, and not just because it pays, but because it’s something they connect with or have a passion for. 

Technical approach
Our approach will be to create the backend using Python and FastAPI, with the frontend being React. 

Risks 
Being able to fully implement visual features/graphics that tie in with the game. A built-in IDE that allows us to confirm/deny the code output would be challenging at this point in our project. Deciding how to structure the learning environment and what will be the most effective approach will also be challenging. Figuring out the correct pacing/content for the project also seems hard right now. 

External Requirements:
ER-1: Platform Compatibility
The application/system must run on a modern web browser such as Chrome, Firefox, Edge, or Safari. 
The application/systemmust be accessible on most platforms, such as desktops, tablets, and mobile phones. 
ER-2: Authentication and privacy
The application/system must support different user accounts(students, teachers, parents).
Users' data must comply with basic FERPA-aware privacy principles used in school settings. 
Passwords must be stored correctly and securely using hashing.
ER-3: Classroom Usability
The application/system must allow teachers to create/moderate student accounts. 
The application/system should allow shared device features(multiple students can use the same machine to sign in). 
ER-4: Offline/Internet Dependency
The MVP will work with an internet connection and will allow students to download lessons/content. 

Non-functional Requirements:
NFR-1: Performance
Pages must load between 1 and 3 seconds on average. 
Student typing feedback must appear in real time(<200 ms delay).
NFR-2: Usability
The interface must have a simple design for K-12 students.
Lessons must start within 3 clicks from the home page.
Errors must be clear, highlighted, and color-coded. 
NFR-4: Reliability 
The system/application must not lose the user's progress or data.
Lessons and practice must be saved automatically.
NFR-5: Scalability
The backend development must support at least 100 concurrent users at once.
Content should be modular, so it’s easy to add more lessons, activities, and mini-games. 
NFR-6: Security
The application/system should have secure privacy and authentication. 
Input sanitization should be monitored when typing code.
There should be basic protection against basic injection attacks. 

Use Cases:
Use Case 1 - Log in, start a lesson:
Students are able to log in or sign up with their username and password. 
Then the student is able to start the modules from the beginning.
The system then shows a short "learn" page 
The student chooses "Start Practice." 
The system starts a timed typing exercise(which can be turned off in settings).	
Use Case 2 - Practice Typing Code:
The system should display code snippets at the top half of the screen.
The student should type what they see on the screen.
The student should highlight errors in real time and in a different color.
The system needs to track the student's speed and accuracy.
Student completes the practice lesson.	
Use Case 3 - Play Mini-Game
Students complete the lesson section and enter the mini-game mode. 
Code appears on one side of the screen and the game on the other.
Use information from lessons to write the code inside the broken game code.
The difficulty will increase dynamically with each lesson mastered.
The student can ask for help and see what they did in the mini-game.
Use Case 4 - View Progress Dashboard
The user opens the dashboard.
The system shows an overview of completed topics and next lessons.
The dashboard shows accuracy, speed, plus the student's progress.
The system displays weak areas and areas for improvement.
User chooses the next lesson.

Timeline: 
Week 1: Planning & setup.
Week 2-3: Backend system.
Week 3-4: Frontend system.
Week 5-6: Practice mode.
Week 6-7: Mini-game mode.
Week 7-8: Dashboard
Week 8-9 Testing & Polish
Week 10: Extra implementation if time.

Additionally, add the following:
4+ major features you will implement.
Progress tracking dashboard for scores, accuracy, and completed topics
Timed practice mode with code typing prompts
Mini-game challenge mode tied to lessons
Feedback with error-highlighting.
Instant Feedback System

2+ stretch goals you hope to implement.
More languages than just one.
Offline practice mode.
Achievements & Rewards
Teacher Tools
