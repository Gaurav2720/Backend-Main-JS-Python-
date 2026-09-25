// =============================================================================
// server.js — Main entry point for the login system
// =============================================================================
// This file sets up the Express server, configures middleware (sessions,
// cookies, body parsing, EJS templating), defines all routes for
// registration, login, dashboard (protected), and logout, and stores
// users in an in-memory array.
// =============================================================================

const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
const PORT = 3000;

// -----------------------------------------------------------------------------
// In-memory user store
// -----------------------------------------------------------------------------
// We keep users in a simple array so we don't need a database for this base
// version. Each entry will look like: { id, username, password }.
// "password" is always a bcrypt hash — never plain text.
// -----------------------------------------------------------------------------
const users = [];

// -----------------------------------------------------------------------------
// Middleware: Parse URL-encoded bodies (form submissions)
// -----------------------------------------------------------------------------
// express.urlencoded() parses incoming request bodies from HTML forms
// (Content-Type: application/x-www-form-urlencoded) and makes the fields
// available on req.body. Without this, req.body would be undefined.
// -----------------------------------------------------------------------------
app.use(express.urlencoded({ extended: true }));

// -----------------------------------------------------------------------------
// Middleware: Parse cookies
// -----------------------------------------------------------------------------
// cookie-parser reads the Cookie header on every request and parses it into
// req.cookies. We use it to set a custom demo cookie (see POST /login).
// -----------------------------------------------------------------------------
app.use(cookieParser());

// -----------------------------------------------------------------------------
// Middleware: Serve static files (CSS)
// -----------------------------------------------------------------------------
// Anything inside the "public/" folder is served at the root URL so the
// browser can fetch styles.css directly.
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, "public")));

// -----------------------------------------------------------------------------
// Middleware: Session management
// -----------------------------------------------------------------------------
// express-session creates a server-side session for each unique visitor and
// stores a session ID in a cookie on the browser (connect.sid by default).
//
// Key settings:
//   secret          — Used to sign the session ID cookie. In production, use a
//                     long random string stored in an environment variable.
//   resave: false   — Don't re-save the session back to the store if it wasn't
//                     modified during the request. Saves unnecessary writes.
//   saveUninitialized: false — Don't create a session until something is stored
//                     in it. Prevents creating sessions for unauthenticated
//                     visitors, which wastes memory and can cause issues with
//                     cookie consent laws.
//   cookie.httpOnly  — Prevents client-side JavaScript from accessing the
//                     session cookie (mitigates XSS attacks).
//   cookie.maxAge    — Sets the session cookie lifetime to 1 hour (in ms).
//                     After this the browser deletes it and the user must log
//                     in again.
// -----------------------------------------------------------------------------
app.use(
  session({
    secret: "my-super-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // JS in the browser cannot read this cookie
      maxAge: 60 * 60 * 1000, // 1 hour
    },
  })
);

// -----------------------------------------------------------------------------
// Set EJS as the templating engine
// -----------------------------------------------------------------------------
// All .ejs files inside the "views/" directory can be rendered with res.render().
// -----------------------------------------------------------------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// =============================================================================
// ROUTES
// =============================================================================

// -----------------------------------------------------------------------------
// GET /register — Show the registration form
// -----------------------------------------------------------------------------
// Renders register.ejs. If the user already has an active session we could
// redirect them to /dashboard, but we keep it simple here.
// -----------------------------------------------------------------------------
app.get("/register", (req, res) => {
  // Pass any error message from a previous POST attempt (stored in query string)
  const error = req.query.error || null;
  res.render("register", { error });
});

// -----------------------------------------------------------------------------
// POST /register — Process registration form
// -----------------------------------------------------------------------------
// 1. Validate that both username and password are provided.
// 2. Check for duplicate usernames in our in-memory array.
// 3. Hash the password with bcrypt before storing — we never store plain text.
//    bcrypt automatically generates a random salt and embeds it in the hash,
//    so comparing later works without storing the salt separately.
// 4. Save the new user and redirect to /login.
// -----------------------------------------------------------------------------
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // --- Validate: both fields required ---
  if (!username || !password) {
    return res.redirect("/register?error=Please+fill+in+all+fields");
  }

  // --- Validate: no duplicate usernames ---
  const existingUser = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );
  if (existingUser) {
    return res.redirect("/register?error=Username+already+exists");
  }

  try {
    // Hash the password. The second argument is the salt round count —
    // 10 is a good default balancing security and performance.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user object with a simple incrementing ID
    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword,
    };

    users.push(newUser);

    // Redirect to login after successful registration
    res.redirect("/login");
  } catch (err) {
    // bcrypt can theoretically throw on very rare hash errors
    console.error("Registration error:", err);
    res.redirect("/register?error=Something+went+wrong+please+try+again");
  }
});

// -----------------------------------------------------------------------------
// GET /login — Show the login form
// -----------------------------------------------------------------------------
app.get("/login", (req, res) => {
  const error = req.query.error || null;
  res.render("login", { error });
});

// -----------------------------------------------------------------------------
// POST /login — Process login form
// -----------------------------------------------------------------------------
// 1. Validate fields.
// 2. Look up the username in our array.
// 3. Use bcrypt.compare() to check the submitted password against the stored
//    hash. bcrypt.compare() extracts the salt from the hash automatically and
//    performs a constant-time comparison to prevent timing attacks.
// 4. On success, store user info in req.session and set a custom demo cookie.
// -----------------------------------------------------------------------------
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // --- Validate: both fields required ---
  if (!username || !password) {
    return res.redirect("/login?error=Please+fill+in+all+fields");
  }

  // --- Find the user by username (case-insensitive) ---
  const user = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );
  if (!user) {
    // We use a generic message so attackers can't enumerate valid usernames
    return res.redirect("/login?error=Invalid+username+or+password");
  }

  try {
    // Compare the plain-text password from the form with the stored hash.
    // Returns true if they match, false otherwise.
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.redirect("/login?error=Invalid+username+or+password");
    }

    // --- Login successful: store user data in the session ---
    // By assigning to req.session.user we tell express-session to create
    // (or update) the session. The session ID cookie is sent to the browser
    // automatically.
    req.session.user = {
      id: user.id,
      username: user.username,
    };

    // --- Set a custom cookie manually (separate from the session cookie) ---
    // This demonstrates cookie-parser usage. We set a simple cookie that
    // stores the username. httpOnly: true prevents JS access; sameSite: "lax"
    // is a good default CSRF mitigation for same-site navigation.
    // maxAge: 30 minutes (in milliseconds).
    res.cookie("demoUsername", user.username, {
      httpOnly: true,
      maxAge: 30 * 60 * 1000, // 30 minutes
      sameSite: "lax",
    });

    // Redirect to the protected dashboard
    res.redirect("/dashboard");
  } catch (err) {
    console.error("Login error:", err);
    res.redirect("/login?error=Something+went+wrong+please+try+again");
  }
});

// -----------------------------------------------------------------------------
// Auth middleware — Protect routes that require a logged-in user
// -----------------------------------------------------------------------------
// This function checks whether req.session.user exists. If not, the user
// hasn't authenticated, so we redirect them to /login.
// We pass this function as a second argument to any route we want to protect.
// -----------------------------------------------------------------------------
function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    // User is authenticated — proceed to the route handler
    return next();
  }
  // Not authenticated — redirect to login
  res.redirect("/login");
}

// -----------------------------------------------------------------------------
// GET /dashboard — Protected page showing user info
// -----------------------------------------------------------------------------
// requireAuth middleware runs first. Only if the session contains a user do we
// reach the route handler. We also read the custom demo cookie to show it
// works alongside the session cookie.
// -----------------------------------------------------------------------------
app.get("/dashboard", requireAuth, (req, res) => {
  // Read the custom cookie we set during login
  const demoCookieValue = req.cookies.demoUsername || "not set";

  res.render("dashboard", {
    user: req.session.user,
    demoCookie: demoCookieValue,
  });
});

// -----------------------------------------------------------------------------
// GET /logout — Destroy session and clear cookies
// -----------------------------------------------------------------------------
// req.session.destroy() removes the session from the server's store (or memory
// in our case). The browser's session cookie is also cleared. We additionally
// clear the custom demo cookie with res.clearCookie().
// After logout, the user is redirected to /login.
// -----------------------------------------------------------------------------
app.get("/logout", (req, res) => {
  // Clear the custom demo cookie
  res.clearCookie("demoUsername");

  // Destroy the session and its cookie, then redirect
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    // Clear the session cookie explicitly on the client side as well
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

// -----------------------------------------------------------------------------
// Start the server
// -----------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Register: http://localhost:${PORT}/register`);
  console.log(`Login:    http://localhost:${PORT}/login`);
});
