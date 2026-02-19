## Type2Code
<h3>A high-level description</h3>
  This software provides a learning environment for students and programmers to learn code through repetition. Oftentimes, when someone is learning how to code, jumping straight into learning syntax offers a harsh learning curve. Type2Code eases this by helping users adjust to this syntax by repetitively typing and mastering specific concepts and functions in Python.
  
<h3>How to install the software</h3>  
To install the software, copy the GitHub repository with the link and paste it into your IDE with "git clone <github-link>". Then you want to start up your virtual environment in Python with "python -m venv <env-name>", followed by "source <env-name>/bin/activate" if you are on MacOS, or "<env-name>/Scripts/activate.bat" if you are on Windows. Next, to install the needed packages run "pip3 install -r requirements.txt" in the terminal. Lastly, you will now need to set up your Supabase database, go to this link: https://supabase.com/ and click "start your project", then follow the instructions to configure a PostgreSQL database hosted on Supabase, updating your environment variables with the needed keys.

<h3>How to run the software</h3>  
To startup the software, you will want to run "uvicorn app.main:app --reload" to startup the FastAPI backend, and "npm run dev" to startup the React.JS frontend. This will allow you to test the application in localhost:3000.

<h3>How to use the software</h3>  
To run the software, we will have it hosted on a publicly accessible web page, which is currently a work in progress (WIP).

<h3>How to report a bug</h3>
We will be using GitHub issues to track bugs and features. To report an issue please open a new issue, GitHub → Issues → “New Issue”, here is where you can report an issue here: https://github.com/JacksonH-W/Group-5/issues/new/choose. Here is an example of what reporting an issue could look like https://github.com/JacksonH-W/Group-5/tree/main/docs/example-issue/bug-report-example.md. 

<h3>Known bugs</h3>
We are early in development as of now, this brings out many bugs while setting up. The following issues or limitations are currently known. 

1. **Supabase Setup Required**
    - Currently Supabase is having to be configured manually. Incorrect environment variables will not allow the backend to function properly or to start at all. 
3. **Session Authentication Requires Same Host**
    - If frontend and backend run on a origin mismatch authentication will fail due to CORS restrictions. 
5. **Public Deployment (WIP)**
    - It is not publicly deployed and is currently only supposed to run locally. 
7. **Limited Browser Testing**
    - As we start to build the frontend we have not yet tested styling and UI consistancy around different browsers. 
