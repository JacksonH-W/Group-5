# Milestone 5 – Testing & Continuous Integration
### Testing Framework
Test suites in our backend are being implemented using 
- Pytest for actual test executions
- pytest-cov to check code coverage
- fastpi.testclient.TestClient for testing of endpoint API

We found that this aligned with our project's testing requiremets. And alos allowed for isolalated unit testing, route validation, integration testing, and overall full application system testing. 

### How to add a new test/Test Directory Structure
```
backend/
  tests/
    unit/
    validation/
    integration/
    system/
    conftest.py
  pytest.ini
```
This is our current testing directory structure which allows for easy to read and clear seperations of testing scopes. 

##### Unit Tests
- Function-level logic

##### Validation Tests
- Route-level behavior verification
  
##### Integration Tests
- API endpoint testing using TestClient
- Monkeypatched authentication and Supabase

##### Systems Tests
- /health endpoint tested with full app instance
---
To add file: 
Create file under backend/tests under corresponding category. 
- Name the file test_<topic>.py
- Add a function named test_<behavior>()
- Test locally from backend/:
  - pytest
  - or with coverage:
    - pytest --cov=app --cov-report=term-missing --cov-report=xml


### CI Service and Repository
CI Service: GitHub Actions
Linking method: The repository is linked via a workflow file committed in the repo:
`.github/workflows/backend-frontend-ci.yml`

When this file is present on our default branch, GitHub Actions auto runs based on configurations of file. 

### Why we chose this CI
- The main reason is because its native to github integrations and its all in the repo itslef.
- Works automaticlly on any triggers you configure
- Also supprots cross-platform runners, which we have right now ubunty-latest and windows. 

### CI services Considered: 
| CI Service         | Pros                                                                                                                           | Cons                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| **GitHub Actions** | Built-in with GitHub repos, great PR integration, easy YAML workflows, strong community actions, supports artifacts + matrices | Can get complex with large workflows, free-tier limits depending on account type                                    |
| **GitLab CI**      | Very strong CI/CD features, good caching, excellent pipelines if hosted on GitLab                                              | Less convenient if the repo is on GitHub; migration or mirroring adds friction                                      |
| **CircleCI**       | Fast builds, good caching, strong UI/insights, common in industry                                                              | Requires third-party integration; pricing/limits can become an issue; extra setup compared to native GitHub Actions |


### Which Tests Run in CI
CI runs in backend:
- All pytes test under backend/tests
- And coverage report is included as well
CI runs in frontned:
- npm run build
- npm run lint

### Triggers
The CI workflow is triggerd on any:
- push
- pull_request



