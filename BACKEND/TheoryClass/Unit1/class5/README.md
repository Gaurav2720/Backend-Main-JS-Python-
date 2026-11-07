# Theory Class 5 — HTTP Cookies & Session Management

**Course:** Backend Web Development  
**Directory:** `TheoryClass/class5/`  
**Technologies:** Node.js, Express.js, `cookie-parser`, `express-session`

---

## 1. Overview
Theory Class 5 explores client-server state maintenance over stateless HTTP:
- **HTTP Cookies:** Setting cookies via `res.cookie()`, reading incoming cookies with `req.cookies`, setting attributes (`httpOnly: true`, `maxAge: 3600000`, `secure: false`), and clearing cookies with `res.clearCookie()`.
- **Sessions vs Cookies:** Differences between client-stored cookies and server-side session state.

---

## 2. Directory Contents
- `Express-session/app.js`: Implementation of cookie lifecycle (`/setcookie`, `/getcookie`, `/deletecookie`).

---

## 3. Running the Implementation
```bash
cd TheoryClass/class5/Express-session
npm install
node app.js
```
Visit **`http://localhost:3000/setcookie`** to test.
