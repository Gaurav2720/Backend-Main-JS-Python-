# Theory Class 4 — FastAPI CRUD API & Pydantic Data Validation

**Course:** Backend Web Development  
**Directory:** `TheoryClass/class4/`  
**Technologies:** Python 3.x, FastAPI, Pydantic, Uvicorn

---

## 1. Overview
Theory Class 4 demonstrates a production-conscious RESTful CRUD API for **Student Management** using FastAPI and Pydantic:
- **Pydantic Schemas:** `Student` (with auto-generated ID) and `StudentCreate` (for request validation).
- **CRUD Endpoints:**
  - `GET /students` — List all students with optional query parameter filtering (`?branch=CSE`).
  - `GET /students/{student_id}` — Retrieve student by ID with `404 Not Found` handling.
  - `POST /students` — Create new student record with `201 Created` status code.
  - `PUT /students/{student_id}` — Update existing student attributes.
  - `DELETE /students/{student_id}` — Remove student with `204 No Content`.

---

## 2. Running the Application
```bash
cd TheoryClass/class4
pip install fastapi uvicorn pydantic
python main.py
```
Interactive API documentation available at **`http://127.0.0.1:5000/docs`**.
