// =============================================================================
// server.js — Session-Based To-Do Application
// =============================================================================
// Course: Backend Web Development
// Practical: Lab Assignment 2 — Session-Based To-Do Application
// Concepts: Node.js, Express.js, Express-Session, Session State, EJS Templates
// =============================================================================

const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || "dev_secret_todo_session_key_12345";

// Middleware: Body parser for URL-encoded HTML form submissions
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware: Serve static styling assets
app.use(express.static(path.join(__dirname, "public")));

// View Engine Setup: Embedded JavaScript (EJS)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware: Express Session Configuration
// Session data is stored server-side in the memory store, keyed by a session ID
// stored in an HTTP-only cookie on the client's browser.
app.use(
  session({
    name: "todo.sid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true if running under HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      sameSite: "lax",
    },
  })
);

// Custom Middleware: Initialize user session tasks array and flash messages
app.use((req, res, next) => {
  if (!req.session.tasks) {
    req.session.tasks = [];
  }
  if (!req.session.flash) {
    req.session.flash = null;
  }
  next();
});

// Helper: Generate unique task identifier
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

// =============================================================================
// ROUTES
// =============================================================================

/**
 * GET /
 * Display all tasks for the current user's session.
 * Supports query filter: ?filter=all|active|completed
 */
app.get("/", (req, res) => {
  const filter = (req.query.filter || "all").toLowerCase();
  const allTasks = req.session.tasks || [];

  let filteredTasks = allTasks;
  if (filter === "active") {
    filteredTasks = allTasks.filter((t) => !t.completed);
  } else if (filter === "completed") {
    filteredTasks = allTasks.filter((t) => t.completed);
  }

  const flashMessage = req.session.flash;
  req.session.flash = null; // Clear one-time flash message

  const stats = {
    total: allTasks.length,
    active: allTasks.filter((t) => !t.completed).length,
    completed: allTasks.filter((t) => t.completed).length,
  };

  res.render("index", {
    tasks: filteredTasks,
    filter,
    stats,
    flash: flashMessage,
    sessionId: req.sessionID,
  });
});

/**
 * POST /tasks
 * Add a new task to the user's session.
 */
app.post("/tasks", (req, res) => {
  const title = req.body.title ? req.body.title.trim() : "";
  const priority = req.body.priority || "Medium";

  if (!title) {
    req.session.flash = { type: "error", message: "Task title cannot be empty." };
    return res.redirect("/");
  }

  if (title.length > 200) {
    req.session.flash = { type: "error", message: "Task title cannot exceed 200 characters." };
    return res.redirect("/");
  }

  const newTask = {
    id: generateId(),
    title,
    priority,
    completed: false,
    createdAt: new Date().toLocaleString(),
  };

  req.session.tasks.unshift(newTask);
  req.session.flash = { type: "success", message: `Task "${title}" added successfully!` };
  res.redirect("/");
});

/**
 * POST /tasks/:id/toggle
 * Toggle completion status of a specific task within the session.
 */
app.post("/tasks/:id/toggle", (req, res) => {
  const taskId = req.params.id;
  const task = req.session.tasks.find((t) => t.id === taskId);

  if (task) {
    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toLocaleString() : null;
  }

  res.redirect("/");
});

/**
 * POST /tasks/:id/delete
 * Delete a specific task from the user's session.
 */
app.post("/tasks/:id/delete", (req, res) => {
  const taskId = req.params.id;
  const initialLength = req.session.tasks.length;
  req.session.tasks = req.session.tasks.filter((t) => t.id !== taskId);

  if (req.session.tasks.length < initialLength) {
    req.session.flash = { type: "info", message: "Task deleted." };
  }

  res.redirect("/");
});

/**
 * POST /tasks/clear-completed
 * Remove all completed tasks for the current session.
 */
app.post("/tasks/clear-completed", (req, res) => {
  const beforeCount = req.session.tasks.length;
  req.session.tasks = req.session.tasks.filter((t) => !t.completed);
  const cleared = beforeCount - req.session.tasks.length;

  if (cleared > 0) {
    req.session.flash = { type: "info", message: `Cleared ${cleared} completed task(s).` };
  }

  res.redirect("/");
});

/**
 * POST /session/reset
 * Destroy session and start fresh.
 */
app.post("/session/reset", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/");
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Session-Based To-Do App is running at: http://localhost:${PORT}`);
  console.log(`🔒 Each visitor has isolated session-backed tasks!`);
  console.log(`=======================================================`);
});
