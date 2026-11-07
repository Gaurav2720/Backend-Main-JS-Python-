# Theory Assignment 1 — Notes Application Using LocalStorage

**Course:** Backend Web Development  
**Semester:** 5th Semester  
**Student:** Gaurav Bhaskar (`590012457`)  
**Topic:** Client-Side Web Storage API, JSON Serialization, and State Persistence  
**Directory:** `TheoryClass/Theory-Assignments/LocalStorage-Notes-App/`

---

## 1. Objective
To understand and implement client-side persistent storage using the Web Storage API (`window.localStorage`), demonstrating how client applications serialize, store, retrieve, update, and deserialize structured data using `JSON.stringify()` and `JSON.parse()`.

---

## 2. Theory & Core Concepts

### A. What is LocalStorage?
`localStorage` is part of the HTML5 Web Storage API specification. It provides a key-value storage mechanism in the web browser with the following characteristics:
- **Persistence:** Data persists even after closing the browser or restarting the operating system (unlike `sessionStorage` which expires on tab close).
- **Scope:** Isolated per origin (protocol + domain + port).
- **Capacity:** Typically 5MB to 10MB per origin (substantially higher than HTTP cookies' 4KB limit).
- **Data Format:** Strictly stores strings (UTF-16 DOMString). Complex data structures (objects, arrays) must be serialized before writing and deserialized upon retrieval.

### B. Comparison: LocalStorage vs SessionStorage vs Cookies

| Feature | LocalStorage | SessionStorage | HTTP Cookies |
| :--- | :--- | :--- | :--- |
| **Lifetime** | Persistent until explicitly deleted | Closes with browser tab | Configurable (`Expires`/`Max-Age`) |
| **Capacity** | ~5 MB - 10 MB | ~5 MB | ~4 KB |
| **Sent with HTTP?** | No (purely client-side) | No | Yes (attached to every request) |
| **Access API** | `window.localStorage` | `window.sessionStorage` | `document.cookie` / Server headers |
| **Use Cases** | Offline notes, preferences, drafts | Multi-step form wizards | Session IDs, auth tokens |

---

## 3. Implementation Details

### Features Implemented:
1. **Full CRUD Operations**:
   - **Create:** Store notes containing unique UUID, Title, Content, Category (`Work`, `Study`, `Personal`, `Ideas`), and Pinned flag.
   - **Read:** Render all stored notes from memory and display cards.
   - **Update:** Edit note in-place, toggle pinned status.
   - **Delete:** Remove individual notes or wipe storage entirely.
2. **JSON Serialization & Deserialization**:
   - `JSON.stringify(notes)` before writing to `localStorage.setItem(STORAGE_KEY, ...)`.
   - `JSON.parse(localStorage.getItem(STORAGE_KEY))` with safety fallbacks inside `try...catch` blocks to protect against corrupted storage payloads.
3. **Search & Category Filtering**:
   - Live text search across note titles and content.
   - Filter dropdown by category tag.
4. **Storage Diagnostics**:
   - Real-time byte calculation of storage usage via JavaScript `Blob` sizing.

---

## 4. Execution Instructions

Since this is a client-side web application:
1. Open the file directly in any modern browser:
   ```bash
   # Windows PowerShell command to launch in default browser:
   Start-Process "TheoryClass\Theory-Assignments\LocalStorage-Notes-App\index.html"
   ```
2. Or serve it via any static file server:
   ```bash
   npx serve "TheoryClass/Theory-Assignments/LocalStorage-Notes-App"
   ```

---

## 5. Verification & Persistence Test
1. Create 3 notes with different categories and pin one of them.
2. Close your browser completely.
3. Re-open `index.html`.
4. **Result:** All notes, categories, and pinned states are instantly restored from `localStorage`.
