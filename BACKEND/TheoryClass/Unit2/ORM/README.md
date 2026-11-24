# Unit 2: ORM — SQLAlchemy Declarative Relationships

**Course:** Backend Web Development — Unit 2  
**Directory:** `TheoryClass/Unit2/ORM/`  
**Technologies:** Python 3.x, SQLAlchemy 2.x, SQLite

---

## 1. Overview
This practical demonstrates advanced object-relational mapping patterns in SQLAlchemy:
- **Declarative Base:** Defining tables as Python classes inheriting from `declarative_base()`.
- **Bidirectional Relationships:** Using `relationship(..., back_populates="...")` for automatic object synchronization between parent and child records.
- **Foreign Keys:** Enforcing referential constraints (`ForeignKey("departments.id")`).

---

## 2. Running the Script
```bash
cd TheoryClass/Unit2/ORM
pip install sqlalchemy
python main.py
```
Creates and populates `students.db`.
