# My Notes — Full-Stack Notes Management Application (Lab Test & Viva)

**Course:** Backend Web Development  
**Practical Exam:** Lab Test / Viva Project  
**Student:** Gaurav Bhaskar (`590012457`)  
**Technology Stack:** Node.js, Express.js, EJS, MongoDB / MongoDB Atlas, HTML5, CSS3  
**Directory:** `Note-taking-Test-viva/`

---

## 1. Project Overview
**My Notes** is a full-stack, database-backed web application built for the Semester 5 Backend Development Lab Examination. It enables users to create, categorize, view, validate, and delete personal notes with persistent storage in MongoDB.

---

## 2. Key Features & Rubric Coverage
- **Server-Side Templating:** Dynamic multi-page rendering using EJS (`views/index.ejs`, `views/new.ejs`).
- **Data Persistence:** MongoDB collection storage with native ObjectId handling and timestamp sorting (`createdAt: -1`).
- **Comprehensive Input Validation:**
  - Mandatory Title (non-empty, minimum 3 characters, maximum 100 characters).
  - Title character constraints (no numeric digits permitted).
  - Mandatory Content (minimum 5 characters).
  - Category validation (letters and spaces only).
- **CRUD Endpoints:**
  - `GET /` — Display all notes ordered by recency.
  - `GET /notes/new` — Render note creation form with validation error feedback.
  - `POST /notes` — Validate inputs, create timestamped document, insert into MongoDB.
  - `POST /notes/:id/delete` — Delete note by `_id`.

---

## 3. Installation & Execution

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account or local MongoDB Community Server

### Setup Instructions
```bash
# 1. Navigate to the project directory
cd "c:\Users\GAURAV\OneDrive\Desktop\Sem5Backend\Backend\BACKEND\Note-taking-Test-viva"

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional, defaults to local MongoDB)
# Copy .env.example to .env and set your MONGO_URI
# cp .env.example .env

# 4. Start the application
npm start
```

Open your browser at:  
👉 **`http://localhost:3000`**

---

## 4. Documentation References
For in-depth practical reports and theoretical interview preparation created for this practical:
- 📄 [Complete Lab Examination Report](file:///c:/Users/GAURAV/OneDrive/Desktop/Sem5Backend/Backend/BACKEND/Note-taking-Test-viva/Testreport.md)
- 📄 [Exhaustive Viva Examination Preparation Guide](file:///c:/Users/GAURAV/OneDrive/Desktop/Sem5Backend/Backend/BACKEND/Note-taking-Test-viva/Vivaprep.md)
