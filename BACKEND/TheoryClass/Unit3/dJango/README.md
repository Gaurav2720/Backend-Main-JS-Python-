# Unit 3 — Django Task Manager (Middleware, Routing, Caching & Testing)

**Course:** Backend Development (`CSFS3008P`) — Unit III  
**Directory:** `TheoryClass/Unit3/django/`

## Concepts Demonstrated
- **Routing & Views:** URL dispatching in `project_core/urls.py` and `tasks/urls.py`
- **Custom Middleware & Logging:** `RequestTimingMiddleware` in `tasks/middleware.py` adds `X-Process-Time-Ms` header and logs latency
- **Caching:** `LocMemCache` in `tasks/views.py` caches `GET /api/tasks/` and invalidates on `POST` / `PATCH` / `DELETE`
- **Error Handling:** JSON validation (`400`) and missing record handling (`404`)
- **Automated Testing:** Unit tests in `tasks/tests.py`

## Setup & Run (PowerShell)
```powershell
cd C:\Users\GAURAV\OneDrive\Desktop\Sem5Backend\Backend\BACKEND\TheoryClass\Unit3\django

# 1. Install Django (or activate your venv)
pip install -r requirements.txt

# 2. Apply migrations (creates db.sqlite3)
python manage.py makemigrations tasks
python manage.py migrate

# 3. Run unit tests
python manage.py test

# 4. Start development server
python manage.py runserver
```

## Test Endpoints (PowerShell)
```powershell
# Create a task
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8000/api/tasks/ -ContentType "application/json" -Body '{"title":"Study Caching","description":"LocMemCache demo"}'

# First GET -> source: "database", Second GET -> source: "cache"
Invoke-RestMethod http://127.0.0.1:8000/api/tasks/

# Mark task #1 completed
Invoke-RestMethod -Method Patch -Uri http://127.0.0.1:8000/api/tasks/1/ -ContentType "application/json" -Body '{"completed":true}'

# Delete task #1
Invoke-RestMethod -Method Delete -Uri http://127.0.0.1:8000/api/tasks/1/
```
