# Backend Development (`CSFS3008P`) — Theory Class

Organized according to the **5 Units** of the **Backend Development (`CSFS3008P`)** syllabus (60 Lecture Hours).

---

## Syllabus & Folder Structure

| Unit | Title | Lecture Hours | Directory |
| :--- | :--- | :---: | :--- |
| **Unit 1** | Introduction to Backend Development & Server-Side Programming | 12 | [`Unit1/`](./Unit1) |
| **Unit 2** | Data Management, API Development and Frameworks | 12 | [`Unit2/`](./Unit2) |
| **Unit 3** | Frameworks and Performance Optimization | 12 | [`Unit3/`](./Unit3) |
| **Unit 4** | Deployment and DevOps | 12 | [`Unit4/`](./Unit4) |
| **Unit 5** | Advanced Topics | 12 | [`Unit5/`](./Unit5) |

---

## Unit-Wise Contents

### Unit 1 — Introduction to Backend Development & Server-Side Programming
- [`Unit1/Class1`](./Unit1/Class1) — Express.js setup & EJS server-side template rendering (`express-demo/`, `task_2/`)
- [`Unit1/Class2`](./Unit1/Class2) — Browser DevTools, HTTP methods/status codes & Postman API testing
- [`Unit1/class5`](./Unit1/class5) — HTTP Cookies & Server-Side Session Management (`Express-session/`)
- [`Unit1/Assignment1-LocalStorage-Notes-App`](./Unit1/Assignment1-LocalStorage-Notes-App) — Theory Assignment 1: Client-side Web Storage (`localStorage`, `JSON.stringify`/`JSON.parse`)

### Unit 2 — Data Management, API Development and Frameworks
- [`Unit2/ORM`](./Unit2/ORM) — SQLAlchemy 2.x Declarative Relationships & SQLite (`students.db`)
- [`Unit2/class3`](./Unit2/class3) — FastAPI fundamentals, ASGI & Uvicorn (`main.py`, `main2.py`)
- [`Unit2/class4`](./Unit2/class4) — FastAPI RESTful CRUD API & Pydantic validation
- [`Unit2/Class15`](./Unit2/Class15) — Relational Data Modeling with SQLAlchemy (`student_management.py`) & Node.js Blog App (`blog_application.js`)
- [`Unit2/Assignment2-PostgreSQL-JSONB`](./Unit2/Assignment2-PostgreSQL-JSONB) — Theory Assignment 2: PostgreSQL `JSONB`, containment operators & GIN indexing

### Unit 3 — Frameworks and Performance Optimization
- [`Unit3/dJango`](./Unit3/dJango) — Django Task Manager API (`project_core/`, `tasks/`) demonstrating:
  - URL routing & REST endpoints (`/api/tasks/`, `/api/tasks/<id>/`)
  - Custom logging & latency middleware (`RequestTimingMiddleware` → `X-Process-Time-Ms`)
  - In-memory caching (`LocMemCache`) with cache invalidation
  - JSON validation (`400`), missing-resource handling (`404`), and Django unit tests (`tasks/tests.py`)
- [`Unit3/README.md`](./Unit3/README.md) — Unit III syllabus overview

### Unit 4 — Deployment and DevOps
- [`Unit4/class_docker`](./Unit4/class_docker) — Multi-stage FastAPI `Dockerfile`, Docker Hub registry & GitHub Actions CI/CD workflow specification

### Unit 5 — Advanced Topics
- [`Unit5/README.md`](./Unit5/README.md) — Unit V syllabus overview (WebSockets, Microservices, Serverless/FaaS, Performance Profiling)

---

## Quick Run Reference

- **LocalStorage Notes App (Unit 1):** Open `Unit1/Assignment1-LocalStorage-Notes-App/index.html` in a browser.
- **FastAPI CRUD (Unit 2):** `cd Unit2/class4` → `python main.py`
- **PostgreSQL JSONB Explorer (Unit 2):** `cd Unit2/Assignment2-PostgreSQL-JSONB` → `npm install && npm start`
- **Django Task Manager (Unit 3):** `cd Unit3/dJango` → `python manage.py migrate` → `python manage.py test tasks` → `python manage.py runserver`
