# Lab 15: Django Web Framework Architecture and Implementation Report

**Course/Subject:** Backend Web Development  
**Lab Folder:** `LAB15`  
**Project Name:** `todo_project`  
**Application Name:** `todo`  
**Framework Version:** Django 6.1.2 (Python 3.14 / venv)  

---

## 1. Executive Summary

This report provides an in-depth architectural and code-level breakdown of the Django project located in the `LAB15` directory. The codebase represents a clean, modular Django project structure consisting of a configuration project package (`todo_project`) and a dedicated application package (`todo`), managed via `manage.py` within an isolated Python virtual environment (`venv`).

This document details:
1. **Core Django Architectural Concepts** (MVT Pattern, Project vs. App, ORM, Middleware, Routing, and Gateways).
2. **File-by-File Code Breakdown** with complete code snippets from the codebase.
3. **Exhaustive Explanation of Every Method and Function Used**.
4. **Comprehensive Glossary of Django Terms**.
5. **Practical Implementation Guide**: How the scaffolded files are extended to build a functional CRUD To-Do application.

---

## 2. Directory Structure of `LAB15`

```text
LAB15/
├── manage.py                  # Command-line entry point for project administration
├── venv/                      # Isolated Python virtual environment
├── todo_project/              # Project configuration package (Container)
│   ├── __init__.py            # Marks directory as a Python package
│   ├── settings.py            # Global project configurations and settings
│   ├── urls.py                # Root URL dispatcher / routing table
│   ├── wsgi.py                # WSGI entry point for synchronous web servers
│   └── asgi.py                # ASGI entry point for async/WebSocket servers
└── todo/                      # Django application package (Component)
    ├── __init__.py            # Marks directory as a Python package
    ├── admin.py               # Django Admin registration and configuration
    ├── apps.py                # Application metadata and registry configuration
    ├── models.py              # Data models and database schema definition (ORM)
    ├── views.py               # Request handlers and business logic
    ├── tests.py               # Unit and integration test suites
    └── migrations/            # Database schema migration history
        └── __init__.py
```

---

## 3. Core Django Concepts and Architecture

### 3.1 MVT (Model - View - Template) Architecture

Django follows the **MVT** architectural pattern, which is a variant of the classic MVC (Model-View-Controller) design pattern:

```
                  HTTP Request
                       │
                       ▼
                 [ urls.py ] (URL Dispatcher)
                       │
                       ▼
                 [ views.py ] (View / Controller Logic)
                  /         \
   Queries / ORM /           \ Context Data
                ▼             ▼
          [ models.py ]   [ Template (*.html) ]
          (Data Layer)    (Presentation Layer)
                │             │
                └──────┬──────┘
                       ▼
                 HTTP Response
```

* **Model (Data Layer)**: Defined in `models.py`. Encapsulates data structure, constraints, and business logic using Django's Object-Relational Mapper (ORM). Each class represents a database table, and class attributes represent database columns.
* **View (Business Logic / Handler)**: Defined in `views.py`. Receives an `HttpRequest` object, performs required computations, interacts with models to query or persist data, and returns an `HttpResponse` (often by rendering a template or returning JSON). In traditional MVC terminology, Django's View acts as the **Controller**.
* **Template (Presentation Layer)**: HTML files enhanced with Django Template Language (DTL) tags and filters (`{{ variable }}`, `{% for %}`). Responsible for displaying the user interface.

### 3.2 Project vs. Application (App)

| Feature | Django Project (`todo_project`) | Django App (`todo`) |
| :--- | :--- | :--- |
| **Definition** | The entire web application instance, containing configuration and routing. | A modular Python package providing a specific set of features. |
| **Portability** | Bound to a specific deployment. | Reusable across multiple Django projects. |
| **Key Files** | `settings.py`, root `urls.py`, `wsgi.py`, `asgi.py`. | `models.py`, `views.py`, `admin.py`, `apps.py`. |
| **Command** | `django-admin startproject <name>` | `python manage.py startapp <name>` |

---

## 4. File-by-File Code Breakdown and Snippets

### 4.1 `manage.py` (Project Administrative Tool)

`manage.py` is an auto-generated command-line utility that wraps `django.core.management`. It enables administrative operations such as running the development server, applying database migrations, and creating administrative superusers.

#### Code Snippet:
```python
#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'todo_project.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
```

#### Detailed Explanation:
1. **`os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'todo_project.settings')`**: Sets the environment variable `DJANGO_SETTINGS_MODULE` to point to the project's settings file (`todo_project.settings`), informing Django where to load database, middleware, and app definitions.
2. **`from django.core.management import execute_from_command_line`**: Lazily imports Django's command parser. If Django is not installed or the virtual environment is inactive, an informative `ImportError` is raised.
3. **`execute_from_command_line(sys.argv)`**: Passes the command-line arguments (e.g., `runserver`, `migrate`, `makemigrations`) to Django's internal command routing system.
4. **`if __name__ == '__main__': main()`**: Standard Python boilerplate ensuring `main()` runs only when the file is directly executed from the terminal.

---

### 4.2 `todo_project/settings.py` (Global Configuration)

This file contains all configuration parameters for the Django instance.

#### Code Snippet & Analysis of Core Sections:

#### 1. Base Directory Computation
```python
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
```
* **`Path(__file__).resolve().parent.parent`**: Determines the absolute path to the project root (`LAB15`).
  * `__file__`: Current file path (`.../LAB15/todo_project/settings.py`).
  * `.resolve()`: Canonical absolute path, resolving any symlinks.
  * `.parent`: First parent is `todo_project/`.
  * `.parent.parent`: Second parent is `LAB15/`.

#### 2. Security and Debug Settings
```python
SECRET_KEY = 'django-insecure-1*_$za$op5o-k^kgotb6=z7=6+ox#ah)j6g(p+6q=ud1bxm6in'
DEBUG = True
ALLOWED_HOSTS = []
```
* **`SECRET_KEY`**: A cryptographic key used for cryptographic signing, session hashing, password reset tokens, and CSRF protection. In production, this must remain confidential and loaded via environment variables.
* **`DEBUG = True`**: Enables detailed error pages with stack traces and local variable dumps. Must be set to `False` in production to prevent sensitive data leakage.
* **`ALLOWED_HOSTS`**: A list of valid domain names/IP addresses that this Django site can serve, defending against HTTP Host header attacks.

#### 3. Installed Applications (`INSTALLED_APPS`)
```python
INSTALLED_APPS = [
    'django.contrib.admin',        # Admin interface and site generator
    'django.contrib.auth',         # Authentication framework (Users, Permissions, Groups)
    'django.contrib.contenttypes', # Generic relations and model tracking system
    'django.contrib.sessions',     # Session management framework
    'django.contrib.messages',     # Cookie- and session-based temporary messaging framework
    'django.contrib.staticfiles',  # Static file collection and serving management
]
```
* This list specifies the active applications within this Django instance. Custom apps (such as `'todo'`) must be appended here to activate their models, admin configurations, and templates.

#### 4. Middleware Pipeline (`MIDDLEWARE`)
```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```
* **Middleware** operates as a pipeline of hooks executed during the request-response lifecycle:
  * **`SecurityMiddleware`**: Adds HTTP security headers (X-Content-Type-Options, SSL redirects).
  * **`SessionMiddleware`**: Manages sessions across requests via cookies.
  * **`CommonMiddleware`**: Handles URL normalization (e.g., appending trailing slashes) and user-agent handling.
  * **`CsrfViewMiddleware`**: Protects against Cross-Site Request Forgery by validating hidden tokens in `POST` forms.
  * **`AuthenticationMiddleware`**: Associates users with requests using sessions, attaching `request.user`.
  * **`MessageMiddleware`**: Enables flash messages accessible in views and templates.
  * **`XFrameOptionsMiddleware`**: Protects against Clickjacking attacks via `X-Frame-Options` headers.

#### 5. URL Routing and WSGI Configuration
```python
ROOT_URLCONF = 'todo_project.urls'
WSGI_APPLICATION = 'todo_project.wsgi.application'
```
* **`ROOT_URLCONF`**: Points to the root Python module containing the primary `urlpatterns` list.
* **`WSGI_APPLICATION`**: Points to the callable application object used by WSGI servers.

#### 6. Templates Configuration
```python
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
```
* **`BACKEND`**: Specifies the template engine (`DjangoTemplates`).
* **`DIRS`**: Additional filesystem directories to search for template files.
* **`APP_DIRS = True`**: Instructs the template engine to look inside a `templates/` directory inside each installed app.
* **`context_processors`**: Callables that inject default variables into the rendering context of all templates (e.g., `request`, `user`, `messages`).

#### 7. Database Engine Configuration
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```
* Configured by default to use **SQLite3**, a serverless, file-based relational database engine located at `<BASE_DIR>/db.sqlite3`.

#### 8. Internationalization and Static Files
```python
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True
STATIC_URL = 'static/'
```
* **`USE_TZ = True`**: Django stores datetimes in UTC internally and converts them to local time zones during rendering.
* **`STATIC_URL`**: URL prefix used to access static assets (CSS, JavaScript, images) in the browser.

---

### 4.3 `todo_project/urls.py` (URL Routing)

The root URL configuration maps incoming HTTP request URLs to the corresponding view functions or delegates sub-routes to application-level URL configurations.

#### Code Snippet:
```python
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
]
```

#### Detailed Explanation:
* **`path(route, view, kwargs=None, name=None)`**: Maps a URL string pattern to a view callable.
* **`admin.site.urls`**: A tuple containing all URL patterns for the built-in Django administration site.
* Accessing `http://127.0.0.1:8000/admin/` routes directly into the Django administrative interface.

---

### 4.4 `todo_project/wsgi.py` & `todo_project/asgi.py` (Deployment Gateways)

#### WSGI (`wsgi.py`):
```python
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'todo_project.settings')

application = get_wsgi_application()
```
* **WSGI (Web Server Gateway Interface - PEP 3333)**: Standard interface between synchronous Python web applications and web servers (Gunicorn, uWSGI, Apache mod_wsgi).
* `application`: Callable object invoked by the web server for each incoming synchronous request.

#### ASGI (`asgi.py`):
```python
import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'todo_project.settings')

application = get_asgi_application()
```
* **ASGI (Asynchronous Server Gateway Interface)**: The asynchronous successor to WSGI. Enables asynchronous request handling, WebSockets, background tasks, and HTTP/2 protocol support using servers like Uvicorn or Daphne.

---

### 4.5 `todo/apps.py` (Application Configuration)

Encapsulates application-specific configuration and metadata.

#### Code Snippet:
```python
from django.apps import AppConfig


class TodoConfig(AppConfig):
    name = 'todo'
```

#### Detailed Explanation:
* Subclasses **`AppConfig`**, representing the `todo` application in Django’s application registry.
* Used by Django to configure signals, custom startup routines, and human-readable application labels.

---

### 4.6 `todo/models.py` (Data Models & ORM)

The module where database entities are declared. Currently scaffolded as:

#### Code Snippet:
```python
from django.db import models

# Create your models here.
```

#### Detailed Explanation:
* Imports `models`, providing base classes (`models.Model`) and field types (`CharField`, `BooleanField`, `DateTimeField`, `ForeignKey`, etc.) for building relational schemas without writing SQL.

---

### 4.7 `todo/views.py` (View Handlers)

Defines request handlers that return HTTP responses. Scaffolded as:

#### Code Snippet:
```python
from django.shortcuts import render

# Create your views here.
```

#### Detailed Explanation:
* Imports **`render`**, a shortcut helper combining a template with a context dictionary and returning an `HttpResponse` containing the rendered HTML.

---

### 4.8 `todo/admin.py` (Admin Interface Registration)

Registers models with Django's automatic administrative interface. Scaffolded as:

#### Code Snippet:
```python
from django.contrib import admin

# Register your models here.
```

#### Detailed Explanation:
* Provides hooks to register models using `admin.site.register(MyModel)` or decorators (`@admin.register(MyModel)`) to enable automatic CRUD interfaces for staff users.

---

### 4.9 `todo/tests.py` (Automated Testing)

Defines unit and integration test cases. Scaffolded as:

#### Code Snippet:
```python
from django.test import TestCase

# Create your tests here.
```

#### Detailed Explanation:
* Imports `TestCase`, which inherits from Python's standard `unittest.TestCase` and adds Django-specific testing tools (isolated test databases, mock HTTP client `self.client`, template assertion helpers).

---

## 5. Comprehensive Glossary of Django Terms

1. **Django**: An open-source, high-level Python web framework designed to simplify the creation of database-driven, complex websites following the "Don't Repeat Yourself" (DRY) principle.
2. **ORM (Object-Relational Mapping)**: A programming technique that allows querying and manipulating data from a relational database using object-oriented code instead of raw SQL queries.
3. **Model**: A Python class that inherits from `django.db.models.Model`. It defines the fields, behavior, and constraints of a database table.
4. **Migration**: A Python file (stored in `migrations/`) describing changes to database models over time (e.g., adding a field, creating a table).
   * `makemigrations`: Inspects models and writes new migration files.
   * `migrate`: Executes migrations against the database.
5. **View**: A Python function or class that accepts an `HttpRequest` and returns an `HttpResponse`.
6. **Template**: A text document or HTML file containing presentation markup along with Django Template Language (DTL) tags and filters.
7. **URLconf (URL Configuration)**: A Python module containing a sequence of URL patterns (`urlpatterns`) that route incoming requests to view functions.
8. **Middleware**: A framework of hooks into Django’s request/response processing. It is a light, low-level plugin system for globally altering Django’s input or output.
9. **WSGI (Web Server Gateway Interface)**: The Python standard for synchronous web application communication with web servers.
10. **ASGI (Asynchronous Server Gateway Interface)**: The modern standard for asynchronous Python web apps, supporting WebSockets and async views.
11. **Context Processor**: A function that takes the `request` object and returns a dictionary of items to be merged into the context of every rendered template.
12. **CSRF (Cross-Site Request Forgery)**: A web security vulnerability where malicious websites trick a user's browser into performing unwanted actions. Django mitigates this via `CsrfViewMiddleware` and the `{% csrf_token %}` tag.
13. **Session**: A mechanism for persisting state between distinct HTTP requests across the same client browser.
14. **Superuser**: An administrator account created via `createsuperuser` with full administrative privileges over the Django Admin dashboard and database.
15. **Virtual Environment (`venv`)**: An isolated directory tree that contains a specific Python installation and a separate set of installed packages, preventing dependency collisions across projects.

---

## 6. Detailed Explanation of Methods and Functions Used

### 6.1 `manage.py` Methods

| Method / Function | Module / Origin | Description | Code Usage in LAB15 |
| :--- | :--- | :--- | :--- |
| **`main()`** | User-defined | Serves as the primary entry point function of the administrative script. | `def main():` |
| **`os.environ.setdefault()`** | Python Standard Library (`os`) | Sets an environment variable key if it is not already set. | `os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'todo_project.settings')` |
| **`execute_from_command_line()`** | `django.core.management` | Parses standard command-line arguments (`sys.argv`) and runs the appropriate Django command. | `execute_from_command_line(sys.argv)` |

---

### 6.2 Path and File Resolution Methods (`settings.py`)

| Method / Function | Module / Origin | Description | Code Usage in LAB15 |
| :--- | :--- | :--- | :--- |
| **`Path()`** | Python Standard Library (`pathlib`) | Instantiates a concrete filesystem path object. | `Path(__file__)` |
| **`.resolve()`** | `pathlib.Path` | Resolves all symlinks and returns the canonical absolute path. | `Path(__file__).resolve()` |
| **`.parent`** | `pathlib.Path` attribute | Traverses upward one level in the directory hierarchy. | `.parent.parent` |
| **`/` (Division Operator)** | `pathlib.Path` overloaded operator | Safely joins path components using the OS-specific path separator. | `BASE_DIR / 'db.sqlite3'` |

---

### 6.3 Routing and Gateway Methods (`urls.py`, `wsgi.py`, `asgi.py`)

| Method / Function | Module / Origin | Description | Code Usage in LAB15 |
| :--- | :--- | :--- | :--- |
| **`path()`** | `django.urls` | Defines a URL routing entry with a pattern route, view callable, optional keyword arguments, and a name. | `path('admin/', admin.site.urls)` |
| **`admin.site.urls`** | `django.contrib.admin` | Property exposing the collection of URL patterns powering the administrative dashboard. | `path('admin/', admin.site.urls)` |
| **`get_wsgi_application()`** | `django.core.wsgi` | Initializes the Django application registry and constructs the WSGI callable handler. | `application = get_wsgi_application()` |
| **`get_asgi_application()`** | `django.core.asgi` | Initializes the Django application registry and constructs the ASGI callable handler for asynchronous servers. | `application = get_asgi_application()` |

---

### 6.4 Scaffolded Methods for App Extension (`views.py`, `admin.py`, `tests.py`)

| Method / Function | Module / Origin | Description | Code Usage in LAB15 |
| :--- | :--- | :--- | :--- |
| **`render()`** | `django.shortcuts` | Combines an `HttpRequest`, a template file, and a context dictionary into a rendered `HttpResponse`. | `from django.shortcuts import render` |
| **`admin.site.register()`** | `django.contrib.admin` | Registers a data model with the administrative interface for CRUD operations. | `from django.contrib import admin` |
| **`TestCase`** | `django.test` | Base test class providing transactional rollbacks, HTTP test client, and custom assertions. | `from django.test import TestCase` |

---

## 7. Practical Implementation Guide: Building the To-Do Application

To demonstrate how the scaffolded files in `LAB15` function together, the following implementation demonstrates building a complete To-Do feature.

### Step 1: Register `todo` App in `todo_project/settings.py`

Add `'todo'` to `INSTALLED_APPS`:

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'todo',  # Registered local application
]
```

---

### Step 2: Define Data Model in `todo/models.py`

```python
from django.db import models


class Task(models.Model):
    title = models.CharField(max_length=200, help_text="Title of the task")
    description = models.TextField(blank=True, null=True, help_text="Detailed task description")
    completed = models.BooleanField(default=False, help_text="Completion status")
    created_at = models.DateTimeField(auto_now_add=True, help_text="Timestamp when task was created")
    updated_at = models.DateTimeField(auto_now=True, help_text="Timestamp when task was last modified")

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({'Done' if self.completed else 'Pending'})"
```

---

### Step 3: Register Model in `todo/admin.py`

```python
from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'completed', 'created_at', 'updated_at')
    list_filter = ('completed', 'created_at')
    search_fields = ('title', 'description')
    list_editable = ('completed',)
```

---

### Step 4: Create Views in `todo/views.py`

```python
from django.shortcuts import render, redirect, get_object_or_404
from .models import Task


def task_list(request):
    """View to list all tasks and create a new task."""
    if request.method == 'POST':
        title = request.POST.get('title')
        description = request.POST.get('description', '')
        if title:
            Task.objects.create(title=title, description=description)
        return redirect('task_list')

    tasks = Task.objects.all()
    return render(request, 'todo/task_list.html', {'tasks': tasks})


def toggle_task(request, task_id):
    """View to toggle completion status of a task."""
    task = get_object_or_404(Task, id=task_id)
    task.completed = not task.completed
    task.save()
    return redirect('task_list')


def delete_task(request, task_id):
    """View to delete a task."""
    task = get_object_or_404(Task, id=task_id)
    task.delete()
    return redirect('task_list')
```

---

### Step 5: Configure Application URLs in `todo/urls.py`

Create `todo/urls.py`:

```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.task_list, name='task_list'),
    path('toggle/<int:task_id>/', views.toggle_task, name='toggle_task'),
    path('delete/<int:task_id>/', views.delete_task, name='delete_task'),
]
```

Include it in `todo_project/urls.py`:

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('todo.urls')),  # Delegate root routes to todo app
]
```

---

### Step 6: Create HTML Template in `todo/templates/todo/task_list.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Django To-Do List</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 600px; margin: 40px auto; padding: 0 20px; background: #f8fafc; color: #1e293b; }
        h1 { text-align: center; color: #0f172a; }
        .card { background: white; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); margin-bottom: 24px; }
        form input, form textarea { width: 100%; padding: 10px; margin-bottom: 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; }
        form button { background: #2563eb; color: white; border: none; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-weight: 600; width: 100%; }
        form button:hover { background: #1d4ed8; }
        ul { list-style: none; padding: 0; }
        li { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #f1f5f9; }
        .done { text-decoration: line-through; color: #94a3b8; }
        .btn-toggle { color: #10b981; text-decoration: none; margin-right: 8px; font-weight: bold; }
        .btn-delete { color: #ef4444; text-decoration: none; font-weight: bold; }
    </style>
</head>
<body>
    <h1>To-Do List</h1>
    <div class="card">
        <form method="POST" action="{% url 'task_list' %}">
            {% csrf_token %}
            <input type="text" name="title" placeholder="What needs to be done?" required>
            <textarea name="description" placeholder="Optional details..." rows="2"></textarea>
            <button type="submit">Add Task</button>
        </form>
    </div>

    <div class="card">
        <ul>
            {% for task in tasks %}
                <li>
                    <span class="{% if task.completed %}done{% endif %}">
                        <strong>{{ task.title }}</strong>
                        {% if task.description %}<br><small>{{ task.description }}</small>{% endif %}
                    </span>
                    <div>
                        <a href="{% url 'toggle_task' task.id %}" class="btn-toggle">{% if task.completed %}↺ Undo{% else %}✓ Done{% endif %}</a>
                        <a href="{% url 'delete_task' task.id %}" class="btn-delete">✕ Delete</a>
                    </div>
                </li>
            {% empty %}
                <li style="justify-content: center; color: #64748b;">No tasks yet. Enjoy your day!</li>
            {% endfor %}
        </ul>
    </div>
</body>
</html>
```

---

## 8. Essential Django CLI Command Reference

Execute these commands from within the `LAB15/` directory where `manage.py` is located (ensure `venv` is activated):

| Command | Action Description |
| :--- | :--- |
| `python manage.py runserver` | Launches the local lightweight development web server (default: `http://127.0.0.1:8000/`). |
| `python manage.py makemigrations` | Scans `models.py` in all installed apps and generates new migration files inside `migrations/`. |
| `python manage.py migrate` | Applies unapplied migrations to the configured database (`db.sqlite3`). |
| `python manage.py createsuperuser` | Prompts for username, email, and password to create an administrative user with full access to `/admin/`. |
| `python manage.py test` | Discovers and executes all test cases inheriting from `django.test.TestCase`. |
| `python manage.py shell` | Opens an interactive Python REPL with the Django environment and models pre-loaded. |
| `python manage.py collectstatic` | Compiles static files from all apps into a single directory defined by `STATIC_ROOT` for production serving. |

---

## 9. Conclusion

The `LAB15` workspace is structured around Django’s standard modular architecture. Through `manage.py`, `todo_project/` (settings and routing), and `todo/` (modular application components), Django provides a robust framework with clean separation of concerns, built-in security mechanisms, and a powerful ORM that accelerates full-stack web application development.
