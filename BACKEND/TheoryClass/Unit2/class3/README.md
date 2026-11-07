# Theory Class 3 — Introduction to FastAPI & ASGI Server (Uvicorn)

**Course:** Backend Web Development  
**Directory:** `TheoryClass/class3/`  
**Technologies:** Python 3.x, FastAPI, Uvicorn, ASGI

---

## 1. Overview
Theory Class 3 covers the fundamentals of the **FastAPI** web framework in Python:
- Asynchronous Server Gateway Interface (ASGI) architecture.
- Initializing the `FastAPI()` application instance.
- Defining routing decorators (`@app.get("/")`).
- Running the development server programmatically with **Uvicorn** (`uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)`).

---

## 2. Running the Application
```bash
cd TheoryClass/class3
pip install fastapi uvicorn
python main2.py
```
Open **`http://127.0.0.1:8000`** in browser or visit interactive Swagger UI at **`http://127.0.0.1:8000/docs`**.
