# Experiment 13: State Management in Express.js (Cookies and Sessions)

---

### **Student Information**
- **Name:** Gaurav Bhaskar
- **SAP ID:** 590012457
- **Course:** Backend Development
- **Semester:** 5th Semester

---

## 1. Aim
To understand and implement state management mechanisms in backend web development using **Node.js** and **Express.js** by creating, reading, and destroying client-side **Cookies** via `cookie-parser` and managing server-side **Sessions** via `express-session`.

---

## 2. Objectives
- Understand why HTTP is a stateless protocol and why state management (sessions/cookies) is essential for modern web applications.
- Implement client-side storage using HTTP cookies with configurable options such as `maxAge`.
- Parse and retrieve incoming cookies from requests using the `cookie-parser` middleware.
- Configure and implement server-side session management with `express-session` using encrypted session identifiers.
- Track user state across multiple HTTP requests (e.g., page view counter).
- Invalidate and destroy sessions and cookies securely on user exit / logout.

---

## 3. High-Level Flowcharts & Execution Pipelines

### 3.1 One-Liner Core Flowcharts

1. **Cookie Creation & Retrieval Lifecycle:**
   ```
   [Client GET /set-cookie] ➔ [Server sets Set-Cookie header (maxAge: 900s)] ➔ [Browser stores cookie] ➔ [Client sends Cookie header on /get-cookie] ➔ [cookie-parser populates req.cookies] ➔ [Server returns "Cookie Retrieved: JohnDoe"]
   ```

2. **Cookie Invalidation Flow:**
   ```
   [Client GET /delete-cookie] ➔ [Server sends Set-Cookie with expired timestamp via res.clearCookie] ➔ [Browser immediately purges cookie] ➔ [Response "Cookie deleted"]
   ```

3. **Session Visit Counter Lifecycle:**
   ```
   [Client GET / (No Session)] ➔ [express-session creates session in store & sets connect.sid cookie] ➔ [req.session.views = 1] ➔ [Client refreshes GET / with connect.sid] ➔ [Server looks up session in store] ➔ [req.session.views++] ➔ [Response "Welcome back! You visited N times."]
   ```

4. **Session Termination Flow:**
   ```
   [Client GET /destroy] ➔ [Server invokes req.session.destroy()] ➔ [Session data purged from server memory/store] ➔ [Response "Session destroyed"]
   ```

---

### 3.2 Mermaid State Architecture Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as Client (Browser)
    participant Server as Express Server
    participant Middlewares as cookie-parser / express-session
    participant Store as Session Store (Memory)

    Note over User, Store: Part 1: Cookie Handling Workflow
    User->>Server: GET /set-cookie
    Server-->>User: HTTP 200 OK (Header: Set-Cookie: username=JohnDoe; Max-Age=900)
    Note over User: Browser stores cookie in local cookie jar
    User->>Server: GET /get-cookie (Header: Cookie: username=JohnDoe)
    Server->>Middlewares: Parse Cookie header
    Middlewares-->>Server: req.cookies['username'] = "JohnDoe"
    Server-->>User: "Cookie Retrieved: JohnDoe"

    Note over User, Store: Part 2: Session State Management Workflow
    User->>Server: GET / (First Visit)
    Server->>Middlewares: Check for session cookie
    Middlewares->>Store: Create new Session ID (connect.sid)
    Store-->>Server: Initialize req.session { views: 1 }
    Server-->>User: "Welcome to the session demo" + (Set-Cookie: connect.sid=s%3A...)
    
    User->>Server: GET / (Second Visit, sends connect.sid)
    Server->>Middlewares: Decrypt connect.sid
    Middlewares->>Store: Lookup Session ID in Store
    Store-->>Server: Return existing session { views: 1 }
    Server->>Server: req.session.views++ (Now 2)
    Server-->>User: "Welcome back! You visited 2 times."

    User->>Server: GET /destroy
    Server->>Store: req.session.destroy() (Purge session record)
    Server-->>User: "Session destroyed"
```

---

## 4. Theory & Core Concepts

### 4.1 The Stateless Nature of HTTP
The Hypertext Transfer Protocol (HTTP) is inherently **stateless**, meaning each request sent by a client is independent and has no built-in awareness of past requests. To create continuous user journeys (such as maintaining login states, shopping carts, and tracking page views), mechanisms like **Cookies** and **Sessions** are required.

### 4.2 Cookies vs. Sessions

| Feature | Cookie | Session |
| :--- | :--- | :--- |
| **Storage Location** | Client-side (in the browser) | Server-side (Memory, Redis, Database) |
| **Capacity** | Limited (~4KB per cookie) | Scalable (depends on server memory/storage) |
| **Security** | Vulnerable to XSS/tampering if unencrypted | More secure; client only stores an encrypted session ID (`connect.sid`) |
| **Performance** | Sent in HTTP headers on every request | Fast lookup; only the ID is transmitted |
| **Primary Use Cases** | User preferences, theme settings, tracking IDs | User authentication, shopping carts, sensitive data |

---

### 4.3 Key Middlewares Used

#### 1. `cookie-parser`
- Middleware that reads the `Cookie` header from incoming HTTP requests and populates `req.cookies` as a convenient JavaScript object.
- Syntax: `app.use(cookieParser())`

#### 2. `express-session`
- Manages server-side sessions by creating a unique session ID for each client, saving the session data on the server, and sending back a signed cookie (by default `connect.sid`).
- **Configuration Options:**
  - `secret`: A cryptographic salt string used to sign the session ID cookie and prevent tampering.
  - `resave`: Forces the session to be saved back to the session store, even if it was not modified during the request (set to `false` for performance).
  - `saveUninitialized`: Forces a session that is "uninitialized" to be saved to the store (set to `true` to track new visits).

---

## 5. Implementation & Code Breakdown

### 5.1 Project Structure
```
lab/LAB13/
├── package.json               # Dependencies: cookie-parser, express, express-session
├── cookie-example.js.js       # Express server demonstrating Cookie operations
└── session-example.js         # Express server demonstrating Session tracking & destruction
```

---

### 5.2 Source Code Walkthrough

#### 1. `cookie-example.js.js` — Setting, Retrieving, and Deleting Cookies
```javascript
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

// 1. Set a cookie with expiration (maxAge: 900,000 ms = 15 minutes)
app.get('/set-cookie', (req, res) => {
    res.cookie('username', 'JohnDoe', { maxAge: 900000 });
    res.send('Cookie has been set');
});

// 2. Retrieve the cookie sent by the browser
app.get('/get-cookie', (req, res) => {
    const user = req.cookies['username'];
    res.send(`Cookie Retrieved: ${user}`);
});

// 3. Clear/delete the cookie from the browser
app.get('/delete-cookie', (req, res) => {
    res.clearCookie('username');
    res.send('Cookie deleted');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

- **Explanation of Methods:**
  - `res.cookie(name, value, [options])`: Instructs the browser to store key-value pair `username=JohnDoe` with a lifetime of 15 minutes (`900,000 ms`).
  - `req.cookies['username']`: `cookie-parser` extracts and parses the incoming HTTP header `Cookie: username=JohnDoe`.
  - `res.clearCookie(name)`: Sends an expired date header causing the client browser to immediately purge the cookie.

---

#### 2. `session-example.js` — Session-Based Visit Counter & Termination
```javascript
const express = require('express');
const session = require('express-session');

const app = express();

// Configure session middleware
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true
}));

// Route to track page visits
app.get('/', (req, res) => {
    if (req.session.views) {
        req.session.views++;
        res.send(`Welcome back! You visited ${req.session.views} times.`);
    } else {
        req.session.views = 1;
        res.send('Welcome to the session demo. Refresh to count visits.');
    }
});

// Route to destroy the active session
app.get('/destroy', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send('Error destroying session');
        }
        res.send('Session destroyed');
    });
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
```

- **Explanation of Methods:**
  - `req.session`: Object unique to the requesting client where custom session properties (e.g., `views`) are attached and preserved between requests.
  - `req.session.destroy(callback)`: Deletes the session from the server store, resetting any stored counter or credentials.

---

## 6. Endpoints & Test Execution Summary

### Cookie Operations (`cookie-example.js.js`)
| Step | Endpoint | HTTP Method | Action / Header | Output Response |
| :--- | :--- | :---: | :--- | :--- |
| 1 | `/set-cookie` | `GET` | Sends `Set-Cookie: username=JohnDoe` | `"Cookie has been set"` |
| 2 | `/get-cookie` | `GET` | Browser sends `Cookie: username=JohnDoe` | `"Cookie Retrieved: JohnDoe"` |
| 3 | `/delete-cookie`| `GET` | Sends `Set-Cookie` with epoch timestamp | `"Cookie deleted"` |
| 4 | `/get-cookie` | `GET` | No cookie sent by browser | `"Cookie Retrieved: undefined"` |

### Session Operations (`session-example.js`)
| Step | Endpoint | HTTP Method | Server State (`req.session.views`) | Output Response |
| :--- | :--- | :---: | :---: | :--- |
| 1 | `/` | `GET` (1st Visit) | Initialized to `1` | `"Welcome to the session demo. Refresh to count visits."` |
| 2 | `/` | `GET` (Refresh) | Incremented to `2` | `"Welcome back! You visited 2 times."` |
| 3 | `/` | `GET` (Refresh) | Incremented to `3` | `"Welcome back! You visited 3 times."` |
| 4 | `/destroy`| `GET` | Session destroyed / deleted | `"Session destroyed"` |
| 5 | `/` | `GET` (Next Visit) | Re-initialized to `1` | `"Welcome to the session demo. Refresh to count visits."` |

---

## 7. Security Best Practices for State Management
1. **HttpOnly Flag (`httpOnly: true`):** Prevents client-side JavaScript (`document.cookie`) from accessing cookies, mitigating Cross-Site Scripting (XSS) attacks.
2. **Secure Flag (`secure: true`):** Ensures cookies are only transmitted over encrypted HTTPS connections.
3. **SameSite Attribute (`sameSite: 'strict' | 'lax'`):** Defends against Cross-Site Request Forgery (CSRF) attacks by restricting when cookies are sent in cross-site requests.
4. **Strong Session Secrets:** Use cryptographically random strings for session secrets rather than hardcoded plain text strings in production.

---

## 8. Observations
- Cookies allow lightweight data storage directly on the user's browser, but should not store sensitive unencrypted data.
- The `cookie-parser` middleware is necessary to decode the `Cookie` request header into usable key-value pairs in `req.cookies`.
- Sessions store application state securely on the server side while maintaining a lightweight client reference via the signed session cookie `connect.sid`.
- Incrementing `req.session.views` demonstrates how the server recognizes the recurring client across stateless HTTP requests.
- Invoking `req.session.destroy()` successfully resets user context.

---

## 9. Conclusion
In this experiment, state management in web applications was successfully implemented using **Express.js**. The practical exercises demonstrated how **cookies** operate on the client-side and how **sessions** maintain state on the server-side. Mastering these techniques is critical for building stateful web services, secure authentication pipelines, and personalized user experiences.
