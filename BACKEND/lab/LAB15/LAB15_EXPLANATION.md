# Lab 15: Complete Walkthrough & Progress Summary

**Course:** Backend Web Development  
**Lab:** Experiment 15 — Django To-Do Application  
**Workspace:** `LAB15/`  
**Framework:** Django 6.1.2 with Python 3.14  
**Package & Runtime Manager:** `uv`  

---

## 1. Overview: What is Lab 15 About?

The core objective of **Lab 15** is to build a full-featured, secure, and production-conscious **CRUD (Create, Read, Update, Delete) To-Do Application** using Django and SQLite, and to master four fundamental architectural pillars:

1. **Django's MVT (Model–View–Template) Architecture & Project/App Structure**.
2. **Data Modeling & SQLite Persistence via Django ORM & Migrations**.
3. **Template Inheritance & Component Reusability (`base.html`, `header.html`, `footer.html`)**.
4. **Web Security & CSRF Defense** (restricting state-mutating actions to `POST` requests).
5. **Django Admin Customization & AppConfig Configuration**.
6. **Application Static Asset Management (`style.css`, `app.js`, `logo.png`)**.
7. **Custom Request/Response Middleware Hooks**.
8. **Modern Dependency & Virtual Environment Management via `uv`**.

---

## 2. Chronological Timeline: What Happened Till Now

### Phase 1: Initial State & Scaffolding
* The project was scaffolded with a container package (`todo_project`) and an application package (`todo`).
* A basic `Task` model was defined with `title`, `completed`, and `created_at`.
* However, the project had several critical gaps compared to the official Lab 15 manual and 20-mark evaluation rubric.

---

### Phase 2: Audit & Identified Misalignments
A rigorous review against the **UPES Lab 15 Manual** revealed 5 critical issues:
1. **Critical Security Flaw on State Changes**:
   * *Problem*: "Mark Complete" and "Delete" actions were implemented as plain `<a>` links (HTTP `GET`).
   * *Risk*: Web crawlers or browser pre-fetch engines could trigger task completion or deletion without user intent; also exposed the app to Cross-Site Request Forgery (CSRF).
2. **Missing Template Componentization**:
   * *Problem*: The site header and footer were hardcoded directly inside `base.html`.
   * *Risk*: Failed the rubric requirement for separate, reusable `header.html` and `footer.html` includes using `{% include %}`.
3. **Misplaced & Missing Static Assets**:
   * *Problem*: `style.css` was sitting at the root `LAB15/static/`, while `app.js` and `logo.png` did not exist at all.
   * *Manual requirement*: An app-namespaced structure `todo/static/todo/{css, js, images}/`.
4. **Incomplete Admin & AppConfig Setup**:
   * *Problem*: `admin.py` lacked in-place `list_editable = ('completed',)`. `apps.py` lacked `verbose_name = 'To-Do Tasks'`.
5. **Discrepancy in `report.md`**:
   * *Problem*: Section 7 of the report documented fictional fields (`description` and `updated_at`) that did not exist in the code or database schema.

---

### Phase 3: Implementing the Fixes
We systematically updated the entire codebase:

1. **Secured Views & Routing (`todo/views.py` & `todo/urls.py`)**:
   * Decorated `toggle_task` and `delete_task` with `@require_POST`.
   * Switched URLs to `toggle/<int:task_id>/` and `delete/<int:task_id>/`.
   * Added `.strip()` to task title inputs to prevent blank submissions.
2. **Modularized Templates (`todo/templates/todo/`)**:
   * Created **`header.html`**: Contains logo branding (`logo.png`) and navigation links.
   * Created **`footer.html`**: Contains footer branding.
   * Refactored **`base.html`**: Uses `{% include %}` for header and footer, loads `style.css` and `app.js` (with `defer`), and provides `{% block extra_css %}` and `{% block extra_js %}`.
   * Refactored **`task_list.html`**: Replaced plain `<a>` tags with CSRF-protected `<form method="post">` buttons.
   * Refactored **`add_task.html`**: Clean input form extending `base.html`.
3. **Static Files Directory (`todo/static/todo/`)**:
   * Added `css/style.css` (clean responsive styling with mobile media queries).
   * Added `js/app.js` (DOM script that autofocuses the task input on page load).
   * Added `images/logo.png` (crisp application logo).
4. **Enhanced Admin & AppConfig (`todo/admin.py` & `todo/apps.py`)**:
   * Added `list_editable = ('completed',)` in `TaskAdmin`.
   * Added `verbose_name = 'To-Do Tasks'` and configured `default_auto_field` in `TodoConfig`.
   * Registered `'todo.apps.TodoConfig'` in `settings.py`.

---

### Phase 4: Adding `uv` Package & Environment Management
Per the modern Python workflow tutorial:
* Initialized `pyproject.toml` and generated `uv.lock`.
* Added `django` using `uv add django`.
* Configured `.venv` managed seamlessly by `uv`.
* **Advantage**: Eliminates manual `venv\Scripts\activate` commands; any Django management command can now be executed directly via `uv run python manage.py <command>`.

---

### Phase 5: Adding Syllabus-Compliant Custom Middleware
To demonstrate Django's request/response lifecycle hooks without adding out-of-syllabus bloat:
* Created **`todo/middleware.py`** (`RequestLoggingMiddleware`):
  ```python
  class RequestLoggingMiddleware:
      def __init__(self, get_response):
          self.get_response = get_response

      def __call__(self, request):
          # BEFORE View: Log incoming request
          print(f"[Middleware] Incoming: {request.method} {request.path}")
          response = self.get_response(request)
          # AFTER View: Attach confirmation header
          response['X-Middleware-Applied'] = 'RequestLoggingMiddleware'
          return response
  ```
* Registered in `todo_project/settings.py` under `MIDDLEWARE`.
* Kept the frontend minimal, clean, and strictly within the standard Lab 15 HTML/CSS syllabus.

---

### Phase 6: Automated Testing & Verification
We wrote 9 comprehensive automated tests in `todo/tests.py`:
1. `test_task_str_representation`: Validates `__str__` model method.
2. `test_task_list_view`: Validates HTTP 200, context variables, and template inheritance (`base.html`, `header.html`, `footer.html`).
3. `test_add_task_get`: Validates form page rendering.
4. `test_add_task_post`: Validates task creation and redirect.
5. `test_toggle_task_post`: Validates flipping completion state.
6. `test_toggle_task_get_rejected`: Verifies HTTP 405 when attempting GET on toggle.
7. `test_delete_task_post`: Validates task deletion and redirect.
8. `test_delete_task_get_rejected`: Verifies HTTP 405 when attempting GET on delete.
9. `test_custom_middleware_applied`: Verifies custom middleware runs and injects `X-Middleware-Applied` header.

**Result:** `9 passed in 0.288s`, 0 issues.

---

## 3. Current Project Structure

```text
LAB15/
├── manage.py                          # Command-line administrative script
├── pyproject.toml                     # uv / PEP 621 project configuration
├── uv.lock                            # Deterministic dependency lockfile
├── db.sqlite3                         # SQLite database file
├── report.md                          # Comprehensive 800+ line technical lab report
├── LAB15_EXPLANATION.md               # This summary walkthrough document
├── .venv/                             # Python virtual environment (managed by uv)
├── todo_project/                      # Root configuration package
│   ├── __init__.py
│   ├── settings.py                    # App registration, middleware, templates, static configs
│   ├── urls.py                        # Project root URL dispatcher (admin/ and root include)
│   ├── wsgi.py                        # Synchronous WSGI gateway
│   └── asgi.py                        # Asynchronous ASGI gateway
└── todo/                              # Application package
    ├── __init__.py
    ├── admin.py                       # ModelAdmin configuration with filters, search, inline edit
    ├── apps.py                        # AppConfig (verbose_name = 'To-Do Tasks')
    ├── middleware.py                  # Custom RequestLoggingMiddleware
    ├── models.py                      # Task model (title, completed, created_at)
    ├── views.py                       # task_list, add_task, toggle_task, delete_task
    ├── urls.py                        # App routes ('', add/, toggle/<int>/, delete/<int>/)
    ├── tests.py                       # 9 unit & integration tests
    ├── migrations/
    │   └── 0001_initial.py            # Initial Task table migration
    ├── templates/todo/
    │   ├── base.html                  # Master parent template
    │   ├── header.html                # Reusable header fragment with logo and navigation
    │   ├── footer.html                # Reusable footer fragment
    │   ├── task_list.html             # Child template listing tasks with CSRF POST forms
    │   └── add_task.html              # Child template with new task form
    └── static/todo/
        ├── css/style.css              # Responsive styles and media queries
        ├── js/app.js                  # Autofocus client script
        └── images/logo.png            # Branded logo image
```

---

## 4. How the Application Works Under the Hood

```
                         Browser Request
                                │
                                ▼
                       [ WSGI / ASGI ]
                                │
                                ▼
                   [ RequestLoggingMiddleware ]  <-- (Prints incoming method & path)
                                │
                                ▼
                   [ urls.py (URL Dispatcher) ]
                                │
                                ▼
                       [ views.py (View) ]
                        /               \
            Queries/Mutates           Injects Context
                      ▼                   ▼
                [ models.py ]      [ base.html ]
                (SQLite DB)         ├── {% include 'header.html' %}
                                    ├── {% block content %} (task_list.html)
                                    └── {% include 'footer.html' %}
                                          │
                                          ▼
                   [ RequestLoggingMiddleware ]  <-- (Attaches X-Middleware-Applied)
                                │
                                ▼
                         HTTP Response
```

---

## 5. Quick Reference: How to Run and Test

All commands can be executed using `uv run` without activating the virtual environment manually:

| Action | Command | Expected Output / URL |
| :--- | :--- | :--- |
| **Start Server** | `uv run python manage.py runserver` | Accessible at `http://127.0.0.1:8000/` |
| **Run Tests** | `uv run python manage.py test` | `Ran 9 tests ... OK` |
| **Check System** | `uv run python manage.py check` | `0 issues identified` |
| **Admin Panel** | Open in browser | `http://127.0.0.1:8000/admin/` |
| **Add New Task** | Open in browser | `http://127.0.0.1:8000/add/` |
