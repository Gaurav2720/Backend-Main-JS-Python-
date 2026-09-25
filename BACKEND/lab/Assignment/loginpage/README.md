# Login System

A simple session-based login system built with Node.js and Express.

## Project Structure

```
loginpage/
  server.js          — Main server file (Express setup, routes, middleware)
  package.json       — Dependencies and scripts
  README.md          — This file
  views/
    login.ejs        — Login form
    register.ejs     — Registration form
    dashboard.ejs    — Protected dashboard page
  public/
    styles.css       — Minimal plain CSS
```

## How to Run

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

3. Open your browser and go to:

```
http://localhost:3000
```

## Routes

| Method | Path         | Description                                |
|--------|--------------|--------------------------------------------|
| GET    | /register    | Show registration form                     |
| POST   | /register    | Create a new user (hashed password)        |
| GET    | /login       | Show login form                            |
| POST   | /login       | Authenticate and start session             |
| GET    | /dashboard   | Protected page — requires valid session    |
| GET    | /logout      | Destroy session and clear cookies          |

## Login/Session Flow

1. User visits `/register` and submits a username + password.
2. The server hashes the password with bcrypt and stores the user in memory.
3. User is redirected to `/login` and enters their credentials.
4. The server uses `bcrypt.compare()` to verify the password against the stored hash.
5. On success, user data is stored in `req.session.user` and a session cookie (`connect.sid`) is sent to the browser.
6. A separate custom cookie (`demoUsername`) is also set to demonstrate cookie-parser usage.
7. When the user visits `/dashboard`, the `requireAuth` middleware checks for `req.session.user`. If absent, the user is redirected to `/login`.
8. On logout, the session is destroyed and both cookies are cleared.

## Technologies Used

- **Express** — Web framework for routing and middleware
- **express-session** — Server-side session management with cookie-based session IDs
- **cookie-parser** — Cookie parsing and manual cookie setting
- **bcrypt** — Password hashing (salted, one-way)
- **EJS** — Templating engine for rendering HTML pages
