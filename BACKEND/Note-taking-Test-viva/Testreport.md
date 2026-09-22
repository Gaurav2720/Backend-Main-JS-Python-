# My Notes Application — Complete Lab Report

**Subject:** Backend Development Lab Examination  
**Stack:** Node.js + Express.js + EJS + MongoDB Atlas  
**Application:** My Notes — A Notes Management Web App  

---

## Table of Contents

1. [Project Setup](#step-1-project-setup)
2. [Installing Dependencies](#step-2-installing-dependencies)
3. [Creating Folder Structure](#step-3-creating-folder-structure)
4. [Backend — `app.js` (Main Server File)](#step-4-backend--appjs-main-server-file)
5. [Template — `views/index.ejs` (Display Notes)](#step-5-template--viewsindexejs-display-all-notes)
6. [Template — `views/new.ejs` (Add Note Form)](#step-6-template--viewsnewejs-add-note-form)
7. [Styling — `public/style.css`](#step-7-styling--publicstylecss)
8. [Running the Application](#step-8-running-the-application)
9. [Routes Summary](#routes-summary)
10. [MongoDB Document Structure](#mongodb-document-structure)

---

## Step 1: Project Setup

### Terminal Commands:

```bash
# Navigate to the lab directory
cd c:\Users\GAURAV\OneDrive\Desktop\Sem5Backend\Backend\BACKEND\lab

# Create a new project folder
mkdir TEST

# Navigate into it
cd TEST

# Initialize a new Node.js project (creates package.json)
npm init -y
```

**What `npm init -y` does:**  
Creates a `package.json` file with default values. This file tracks project metadata and dependencies.

---

## Step 2: Installing Dependencies

### Terminal Command:

```bash
npm install express ejs mongodb
```

### Packages Explained:

| Package | Purpose |
|---------|---------|
| `express` | Web framework for Node.js — handles routing, middleware, HTTP requests/responses |
| `ejs` | Embedded JavaScript Templates — server-side template engine to render HTML with dynamic data |
| `mongodb` | Official MongoDB Node.js driver — connects to MongoDB Atlas and performs CRUD operations |

---

## Step 3: Creating Folder Structure

### Terminal Commands:

```bash
# Create views folder (for EJS templates)
mkdir views

# Create public folder (for static files like CSS)
mkdir public
```

### Final Project Structure:

```
TEST/
├── node_modules/          # Installed packages (auto-generated)
├── views/
│   ├── index.ejs          # Home page — displays all notes
│   └── new.ejs            # Form page — add a new note
├── public/
│   └── style.css          # CSS styling
├── app.js                 # Main backend server file
├── package.json           # Project config & dependencies
├── package-lock.json      # Dependency lock file (auto-generated)
└── README.md              # Execution instructions
```

---

## Step 4: Backend — `app.js` (Main Server File)

This is the **core backend file** that handles everything: MongoDB connection, Express server configuration, and all CRUD route handlers.

### Full Code:

```js
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = 3000;

// MongoDB Atlas connection string
const mongoURL = "mongodb+srv://iamgaurav2702_db_user:1Xj2yt4TqOgSze75@cluster0.jvvdmps.mongodb.net/?appName=Cluster0";

const client = new MongoClient(mongoURL);
let notesCollection;

async function connectDB() {
  try {
    await client.connect();
    const database = client.db("notes_lab");
    notesCollection = database.collection("notes");
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("Failed to connect to MongoDB Atlas:", err);
    process.exit(1);
  }
}

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// ============ ROUTES ============

// GET / — Display all notes
app.get("/", async (req, res) => {
  try {
    const notes = await notesCollection.find().sort({ createdAt: -1 }).toArray();
    res.render("index", { notes });
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).send("Error fetching notes");
  }
});

// GET /notes — Also display all notes
app.get("/notes", async (req, res) => {
  try {
    const notes = await notesCollection.find().sort({ createdAt: -1 }).toArray();
    res.render("index", { notes });
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).send("Error fetching notes");
  }
});

// GET /notes/new — Show add-note form
app.get("/notes/new", (req, res) => {
  res.render("new");
});

// POST /notes — Add a new note
app.post("/notes", async (req, res) => {
  try {
    const { title, content, category } = req.body;

    // Validation: title and content must not be empty
    if (!title || !title.trim() || !content || !content.trim()) {
      return res.render("new", {
        error: "Title and Content are required!",
        title: title || "",
        content: content || "",
        category: category || "",
      });
    }

    await notesCollection.insertOne({
      title: title.trim(),
      content: content.trim(),
      category: category ? category.trim() : "General",
      createdAt: new Date(),
    });

    res.redirect("/");
  } catch (err) {
    console.error("Error adding note:", err);
    res.status(500).send("Error adding note");
  }
});

// POST /notes/:id/delete — Delete a note
app.post("/notes/:id/delete", async (req, res) => {
  try {
    await notesCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).send("Error deleting note");
  }
});

// Start server after DB connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
```

---

### Backend Code Breakdown (Line-by-Line Explanation)

#### 1. Importing Modules

```js
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
```

- `express` — the web framework that handles HTTP requests and routing.
- `MongoClient` — used to connect to MongoDB Atlas.
- `ObjectId` — used to convert string IDs into MongoDB ObjectId format (needed for delete operations).

---

#### 2. App & Port Initialization

```js
const app = express();
const PORT = 3000;
```

- Creates an Express application instance.
- Server will listen on port 3000.

---

#### 3. MongoDB Atlas Connection

```js
const mongoURL = "mongodb+srv://iamgaurav2702_db_user:1Xj2yt4TqOgSze75@cluster0.jvvdmps.mongodb.net/?appName=Cluster0";

const client = new MongoClient(mongoURL);
let notesCollection;

async function connectDB() {
  try {
    await client.connect();
    const database = client.db("notes_lab");
    notesCollection = database.collection("notes");
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("Failed to connect to MongoDB Atlas:", err);
    process.exit(1);
  }
}
```

- `mongoURL` — MongoDB Atlas connection string with `mongodb+srv://` protocol for cloud connection.
- `MongoClient(mongoURL)` — creates a reusable client instance (same client reused for all requests).
- `client.db("notes_lab")` — selects/creates the `notes_lab` database.
- `database.collection("notes")` — selects/creates the `notes` collection.
- `process.exit(1)` — exits the application if connection fails.

---

#### 4. Middleware Configuration

```js
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
```

| Middleware | Purpose |
|-----------|---------|
| `app.set("view engine", "ejs")` | Tells Express to use EJS as the template engine. Templates are looked up in `views/` folder by default. |
| `express.urlencoded({ extended: true })` | Parses incoming form data from POST requests. Makes `req.body` available with form field values. |
| `express.static("public")` | Serves static files (CSS, images, JS) from the `public/` folder. |

---

#### 5. Route — GET `/` (Display All Notes)

```js
app.get("/", async (req, res) => {
  try {
    const notes = await notesCollection.find().sort({ createdAt: -1 }).toArray();
    res.render("index", { notes });
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).send("Error fetching notes");
  }
});
```

- `notesCollection.find()` — retrieves all documents from the `notes` collection.
- `.sort({ createdAt: -1 })` — sorts by creation date, newest first.
- `.toArray()` — converts the MongoDB cursor into a JavaScript array.
- `res.render("index", { notes })` — renders `views/index.ejs` and passes the `notes` array as data.

---

#### 6. Route — GET `/notes/new` (Show Add Form)

```js
app.get("/notes/new", (req, res) => {
  res.render("new");
});
```

- Simply renders the `views/new.ejs` template which contains the HTML form.

---

#### 7. Route — POST `/notes` (Add a New Note)

```js
app.post("/notes", async (req, res) => {
  try {
    const { title, content, category } = req.body;

    // Validation: title and content must not be empty
    if (!title || !title.trim() || !content || !content.trim()) {
      return res.render("new", {
        error: "Title and Content are required!",
        title: title || "",
        content: content || "",
        category: category || "",
      });
    }

    await notesCollection.insertOne({
      title: title.trim(),
      content: content.trim(),
      category: category ? category.trim() : "General",
      createdAt: new Date(),
    });

    res.redirect("/");
  } catch (err) {
    console.error("Error adding note:", err);
    res.status(500).send("Error adding note");
  }
});
```

- `req.body` — contains the form data (parsed by `express.urlencoded` middleware).
- **Validation** — checks that title and content are not empty or whitespace-only.
- If validation fails, re-renders the form with an error message and preserves the entered values.
- `notesCollection.insertOne({...})` — inserts a new document into MongoDB.
- `new Date()` — generates the current timestamp for `createdAt`.
- `res.redirect("/")` — after successful insertion, redirects to the home page.

---

#### 8. Route — POST `/notes/:id/delete` (Delete a Note)

```js
app.post("/notes/:id/delete", async (req, res) => {
  try {
    await notesCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).send("Error deleting note");
  }
});
```

- `req.params.id` — extracts the note ID from the URL (e.g., `/notes/64abc123/delete` → `id = "64abc123"`).
- `new ObjectId(req.params.id)` — converts the string ID to a MongoDB ObjectId (required for `_id` matching).
- `notesCollection.deleteOne({...})` — deletes the matching document from MongoDB.
- Redirects to home after deletion.

---

#### 9. Server Startup

```js
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
```

- First connects to MongoDB Atlas, then starts the Express server.
- Server only starts **after** a successful DB connection.

---

## Step 5: Template — `views/index.ejs` (Display All Notes)

EJS (Embedded JavaScript) lets us write HTML with embedded JavaScript using `<% %>` tags.

### Full Code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Notes</title>
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <div class="container">
    <header>
      <h1>📝 My Notes</h1>
      <a href="/notes/new" class="btn btn-primary">+ Add New Note</a>
    </header>

    <% if (notes.length === 0) { %>
      <div class="empty-state">
        <p>No notes available. Start by adding one!</p>
      </div>
    <% } else { %>
      <div class="notes-grid">
        <% notes.forEach(note => { %>
          <div class="note-card">
            <div class="note-header">
              <h2><%= note.title %></h2>
              <span class="category-badge"><%= note.category || "General" %></span>
            </div>
            <p class="note-content"><%= note.content %></p>
            <div class="note-footer">
              <small class="note-date">
                🕐 <%= note.createdAt ? new Date(note.createdAt).toLocaleString() : "N/A" %>
              </small>
              <form action="/notes/<%= note._id %>/delete" method="POST" class="delete-form">
                <button type="submit" class="btn btn-danger" onclick="return confirm('Are you sure you want to delete this note?')">
                  🗑️ Delete
                </button>
              </form>
            </div>
          </div>
        <% }) %>
      </div>
    <% } %>
  </div>
</body>
</html>
```

### EJS Syntax Used:

| Syntax | Purpose |
|--------|---------|
| `<% %>` | Executes JavaScript (no output) — used for `if`, `else`, `forEach` |
| `<%= %>` | Outputs the value (HTML-escaped) — used to display `note.title`, `note.content`, etc. |

### Key Points:

- **Empty state check** — `notes.length === 0` shows "No notes available" message.
- **forEach loop** — iterates over all notes and renders a card for each.
- **Delete form** — each card has a POST form targeting `/notes/<note_id>/delete`.
- **Confirm dialog** — `onclick="return confirm(...)"` asks for confirmation before delete.
- **Date formatting** — `new Date(note.createdAt).toLocaleString()` converts the date to a readable format.

---

## Step 6: Template — `views/new.ejs` (Add Note Form)

### Full Code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Add Note</title>
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <div class="container">
    <header>
      <h1>📝 Add a New Note</h1>
      <a href="/" class="btn btn-secondary">← Back to Notes</a>
    </header>

    <% if (typeof error !== "undefined" && error) { %>
      <div class="error-msg">
        ⚠️ <%= error %>
      </div>
    <% } %>

    <form action="/notes" method="POST" class="note-form">
      <div class="form-group">
        <label for="title">Title <span class="required">*</span></label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Enter note title"
          value="<%= typeof title !== 'undefined' ? title : '' %>"
          required
        />
      </div>

      <div class="form-group">
        <label for="content">Content <span class="required">*</span></label>
        <textarea
          id="content"
          name="content"
          rows="6"
          placeholder="Write your note content here..."
          required
        ><%= typeof content !== 'undefined' ? content : '' %></textarea>
      </div>

      <div class="form-group">
        <label for="category">Category</label>
        <input
          type="text"
          id="category"
          name="category"
          placeholder="e.g. Study, Work, Personal"
          value="<%= typeof category !== 'undefined' ? category : '' %>"
        />
      </div>

      <button type="submit" class="btn btn-primary btn-full">Add Note</button>
    </form>
  </div>
</body>
</html>
```

### Key Points:

- **Form method is POST** — `<form action="/notes" method="POST">` sends data to the POST `/notes` route.
- **`name` attribute** — each input's `name` (title, content, category) maps to `req.body.title`, `req.body.content`, `req.body.category` in the backend.
- **Error display** — `typeof error !== "undefined"` checks if an error was passed from the backend (validation failure).
- **Value preservation** — on validation error, previously entered values are preserved using `<%= typeof title !== 'undefined' ? title : '' %>`.
- **`required` attribute** — HTML5 client-side validation as a first layer.

---

## Step 7: Styling — `public/style.css`

### Full Code:

```css
/* ============ CSS Variables & Reset ============ */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f0f2f5;
  color: #333;
  line-height: 1.6;
}

/* ============ Container ============ */
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px;
}

/* ============ Header ============ */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
}

header h1 {
  font-size: 1.8rem;
  color: #2c3e50;
}

/* ============ Buttons ============ */
.btn {
  display: inline-block;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.4);
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
  padding: 6px 14px;
  font-size: 0.85rem;
}

.btn-danger:hover {
  background-color: #c0392b;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.4);
}

.btn-full {
  width: 100%;
  padding: 12px;
  font-size: 1.05rem;
}

/* ============ Notes Grid ============ */
.notes-grid {
  display: grid;
  gap: 16px;
}

/* ============ Note Card ============ */
.note-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.note-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.note-header h2 {
  font-size: 1.2rem;
  color: #2c3e50;
  margin: 0;
}

.category-badge {
  background-color: #e8f4fd;
  color: #2980b9;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.note-content {
  color: #555;
  margin-bottom: 14px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.note-date {
  color: #999;
  font-size: 0.85rem;
}

.delete-form {
  margin: 0;
}

/* ============ Empty State ============ */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.empty-state p {
  font-size: 1.1rem;
  color: #999;
}

/* ============ Form ============ */
.note-form {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #2c3e50;
}

.required {
  color: #e74c3c;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

/* ============ Error Message ============ */
.error-msg {
  background-color: #fdeaea;
  color: #c0392b;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  border-left: 4px solid #e74c3c;
  font-weight: 500;
}
```

---

## Step 8: Running the Application

### Terminal Command:

```bash
node app.js
```

### Expected Output:

```
Connected to MongoDB Atlas
Server running at http://localhost:3000
```

### Open in Browser:

```
http://localhost:3000
```

### To Stop the Server:

```
Press Ctrl + C in the terminal
```

---

## Routes Summary

| Method | Route | Purpose | MongoDB Operation |
|--------|-------|---------|-------------------|
| GET | `/` | Display all notes | `find().sort().toArray()` |
| GET | `/notes` | Display all notes (alternate) | `find().sort().toArray()` |
| GET | `/notes/new` | Show add-note form | None |
| POST | `/notes` | Add a new note | `insertOne({...})` |
| POST | `/notes/:id/delete` | Delete a note | `deleteOne({ _id })` |

---

## MongoDB Document Structure

Each note stored in MongoDB follows this schema:

```json
{
  "_id": "ObjectId (auto-generated by MongoDB)",
  "title": "Backend Lab",
  "content": "Complete the Notes application.",
  "category": "Study",
  "createdAt": "2026-09-22T09:15:00.000Z"
}
```

### MongoDB Info:

| Property | Value |
|----------|-------|
| Connection | MongoDB Atlas (Cloud) |
| Protocol | `mongodb+srv://` |
| Database | `notes_lab` |
| Collection | `notes` |
| Cluster | Cluster0 (AWS Mumbai) |

---

## All Terminal Commands Used (Summary)

```bash
# 1. Navigate to lab folder
cd c:\Users\GAURAV\OneDrive\Desktop\Sem5Backend\Backend\BACKEND\lab

# 2. Create project folder
mkdir TEST

# 3. Enter project folder
cd TEST

# 4. Initialize Node.js project
npm init -y

# 5. Install all dependencies
npm install express ejs mongodb

# 6. Create folders for templates and static files
mkdir views
mkdir public

# 7. Create files (using any code editor):
#    - app.js            (main backend server)
#    - views/index.ejs   (home page template)
#    - views/new.ejs     (add note form template)
#    - public/style.css  (stylesheet)

# 8. Run the application
node app.js

# 9. Open in browser
# http://localhost:3000

# 10. Stop the server
# Ctrl + C
```

---

## How the Request-Response Flow Works

### Adding a Note:

```
Browser → GET /notes/new → Server renders new.ejs form
User fills form → clicks Submit
Browser → POST /notes (with form data in body)
Server → validates data → inserts into MongoDB → redirects to /
Browser → GET / → Server fetches all notes from MongoDB → renders index.ejs
```

### Deleting a Note:

```
User clicks Delete button on a note card
Browser → POST /notes/64abc123/delete
Server → extracts ID from URL → converts to ObjectId → deletes from MongoDB → redirects to /
Browser → GET / → Server fetches remaining notes → renders index.ejs
```

---
