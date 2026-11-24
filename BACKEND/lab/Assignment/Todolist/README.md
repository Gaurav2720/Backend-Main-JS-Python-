# Lab Assignment 2 — Session-Based To-Do Web Application

**Course:** Backend Web Development  
**Semester:** 5th Semester  
**Student:** Gaurav Bhaskar (`590012457`)  
**Technology Stack:** Node.js, Express.js, `express-session`, EJS, CSS3  
**Directory:** `lab/Assignment/Todolist/`

---

## 1. Objective
To design and implement a stateful, user-specific To-Do management web application using **Express.js** and **Express Sessions (`express-session`)**, demonstrating how HTTP statelessness is resolved via server-side session stores and encrypted client session cookies.

---

## 2. Problem Statement
HTTP is inherently a stateless protocol — each incoming request has no built-in knowledge of preceding requests. In web applications requiring user-specific workflows (such as tasks, shopping carts, or drafts) prior to or independent of permanent database storage, server-side session tracking is critical. The requirement is to build an interactive To-Do system where:
1. Each unique browser/user session receives an isolated task list in memory.
2. Users can create, view, complete, and delete tasks.
3. Tasks can be filtered by state (`all`, `active`, `completed`).
4. Session state persists across refreshes without leaking between different users.

---

## 3. Core Concepts Covered
- **HTTP Statelessness & Session Management**: Overcoming stateless HTTP by generating a unique session ID (`connect.sid`) stored inside an `httpOnly` cookie.
- **Server-Side Session Store**: Managing user task arrays in `req.session.tasks`.
- **EJS Server-Side Rendering**: Dynamically rendering HTML views with tasks, priority tags, and statistics.
- **Request Lifecycle**: Handling `POST` actions (add, toggle, delete, clear, reset) and redirecting (`PRG` pattern — Post/Redirect/Get) to avoid duplicate form submissions.
- **Flash Messages**: Ephemeral session notifications informing users of operations.

---

## 4. Application Architecture & Data Flow

```plaintext
Client Browser                       Express Server                       Session Memory
      |                                    |                                    |
      |--- 1. GET / (no cookie) ---------->|                                    |
      |                                    |--- 2. Create session ------------->|
      |<-- 3. Set-Cookie: todo.sid --------|    (req.session.tasks = [])        |
      |                                    |                                    |
      |--- 4. POST /tasks (with cookie) -->|                                    |
      |                                    |--- 5. Append task to session ----->|
      |<-- 6. 302 Redirect to / -----------|                                    |
      |                                    |                                    |
      |--- 7. GET / (with cookie) -------->|--- 8. Read req.session.tasks ----->|
      |<-- 9. Render index.ejs ------------|                                    |
```

---

## 5. API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Render dashboard with tasks (supports `?filter=all\|active\|completed`) |
| `POST` | `/tasks` | Add a new task (`title`, `priority`) to current session |
| `POST` | `/tasks/:id/toggle` | Toggle task completion status (`completed = !completed`) |
| `POST` | `/tasks/:id/delete` | Delete specific task from user session |
| `POST` | `/tasks/clear-completed` | Remove all completed tasks for current session |
| `POST` | `/session/reset` | Destroy session and start with a clean state |

---

## 6. Installation & Execution

### Prerequisites
- Node.js (v16.0.0 or higher)
- npm

### Step-by-Step Run Instructions
```bash
# 1. Navigate to the Assignment directory
cd "c:\Users\GAURAV\OneDrive\Desktop\Sem5Backend\Backend\BACKEND\lab\Assignment\Todolist"

# 2. Install dependencies
npm install

# 3. Start the application
npm start
# Alternatively, for development auto-restart:
npm run dev
```

### Accessing the Application
Open your web browser and navigate to:  
👉 **`http://localhost:3000`**

---

## 7. Verification & Multi-Session Testing
To prove that session isolation works:
1. Open `http://localhost:3000` in Google Chrome and add 2 tasks: `"Finish Backend Lab"` and `"Review Docker"`.
2. Open an **Incognito Window** (or a different browser like Firefox or Edge) and go to `http://localhost:3000`.
3. Notice that the Incognito session has **zero tasks** and a completely different Session ID!
4. Tasks added in window 1 do not affect window 2.

---

## 8. Learning Outcomes
- Configured `express-session` with secure cookie policies (`httpOnly`, `sameSite`, `maxAge`).
- Implemented stateful user interactions in an Express application.
- Applied the Post/Redirect/Get (PRG) pattern for smooth UX and CSRF prevention.
- Validated server-side user input before mutating session arrays.
