# Developer Documentation

This document is intended for developers who want to contribute to the Type2Code project.


## Obtaining the Source Code

Clone the repository from GitHub:

```bash
git clone https://github.com/JacksonH-W/Group-5.git
cd Group-5
Group-5/
├── backend/            # FastAPI backend
│   ├── app/
│   │   ├── auth/       # Authentication logic
│   │   ├── routes/     # API route definitions
│   │   ├── schemas.py  # Pydantic request/response schemas
│   │   ├── db.py       # Database and Supabase configuration
│   │   └── main.py     # FastAPI application entry point
│   ├── requirements.txt
│
├── frontend/           # React frontend (Vite)
│
├── usermanual/         # End-user documentation
│   └── usermanual.md
│
├── reports/            # Project reports and milestone writeups
├── README.md
└── DEVELOPING.md       # Developer documentation (this file)
```

Building the Software

Backend (FastAPI)

Building the Software

Backend Setup (FastAPI)

1.	Navigate to the backend directory:
cd backend

2.	Create and activate a Python virtual environment:
python -m venv venv
source venv/bin/activate      # macOS/Linux
venv\Scripts\activate.bat     # Windows

3.	Install backend dependencies:
pip install -r requirements.txt

4.	Create a .env file in the backend/ directory and configure Supabase:
SUPABASE_URL=<your_supabase_url>
SUPABASE_ANON_KEY=<your_supabase_anon_key>
DATABASE_URL=<your_postgres_connection_string>
 
Frontend Setup (React)

1.	Navigate to the frontend directory:
    ~cd frontend

2.	Install frontend dependencies:
    ~npm install
 
4. Running the Software

Run the Backend
uvicorn app.main:app --reload

The backend will be available at:
http://127.0.0.1:8000

FastAPI documentation:
http://127.0.0.1:8000/docs
 
Run the Frontend
~npm run dev
The frontend will be available at:
http://localhost:3000
 
5. Testing the Software

At this stage of development, testing is performed using:
•	FastAPI Swagger UI (/docs) for API validation
•	Manual API testing via Postman or curl
•	Manual frontend testing through the browser
Automated test suites are planned but currently work in progress.
 
6. Adding New Tests

Backend
•	Tests should be written using pytest
•	Test files should follow the naming convention:
test_<feature_name>.py
•	Tests will be placed in a future backend/tests/ directory
Frontend
•	Frontend testing strategy is currently under development
 
7. Building a Release

Before merging code into the main branch:

1.	Ensure the backend and frontend run locally
2.	Verify API endpoints via Swagger UI
3.	Confirm environment variables are documented
4.	Submit changes through a Pull Request
5.	At least one team member must review and approve the PR
Release automation and deployment pipelines are currently work in progress.
 
8. Contribution Guidelines

•	All development must be done on feature branches

•	Pull Requests must include:
  o	A clear description of changes
  o	Tested functionality
  o	No committed secrets or .env files

•	Continuous Integration (CI) and code review are required before merging into main
