# Theory Class 15 — Relational Data Modeling with SQLAlchemy ORM

**Course:** Backend Web Development  
**Directory:** `TheoryClass/Class15/`  
**Technologies:** Python 3.x, SQLAlchemy ORM, SQLite3, Node.js

---

## 1. Overview
Theory Class 15 provides an enterprise implementation of relational database modeling using Python's **SQLAlchemy ORM** and SQLite:
- **Entities & Relationships:**
  - `Department` (One-to-Many with Student and Course).
  - `Student` (Belongs to Department, Many-to-Many with Course via Enrollment).
  - `Course` (Belongs to Department).
  - `Enrollment` (Association model with composite primary key, semester, and grade).
- **Cascade Deletion:** `cascade="all, delete-orphan"` ensuring referential integrity when students or courses are deleted.
- **CRUD Operations:** Querying with filters, updates, and cascading removals demonstrated in `student_management.py`.
- **Blog Application:** Node.js backend demonstration in `blog_application.js`.

---

## 2. Running the Implementation
```bash
cd TheoryClass/Class15
pip install sqlalchemy
python student_management.py
```
Outputs complete relational transaction logs to SQLite database `students_lab.db`.
