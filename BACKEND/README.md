# 🚀 Backend Development — Semester 5

A structured repository containing laboratory experiments, theory class exercises, and backend projects implemented using **JavaScript (Node.js / Express)** and **Python**.

---

## 👨‍💻 Student Details

| Field | Information |
| :--- | :--- |
| **Name** | **Gaurav Bhaskar** |
| **SAP ID** | `590012457` |
| **Course** | B.Tech Computer Science & Engineering (Core) |
| **Batch** | B3 |
| **Semester** | 5th Semester |

---

## 📚 Course Resources & References

- 🔗 **Official Course Material & Lectures**:  
  [UPES SOCS Backend Development Materials](https://upessocs.github.io/#dir=/Lectures/Backend%20Development/&file=list.txt)

---

## 📂 Repository Structure

```plaintext
BACKEND/
├── lab/                # Weekly laboratory experiments and reports
│   ├── lAB1/           # Initial lab exercises
│   ├── Lab12/          # Lab 12 practicals
│   └── Lab13/          # Lab 13 - Mongoose ODM demonstrations & reports
├── TheoryClass/        # Classroom lecture implementations & topics
│   ├── Class1/
│   ├── Class2/
│   ├── class3/
│   ├── class4/
│   └── class5/
└── Server/             # Node.js / Express server setup & API endpoints
    ├── server.js
    └── package.json
```

---

## 🛠️ Tech Stack & Tools

- **Languages:** JavaScript (ES6+), Python
- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database & ODM:** MongoDB, Mongoose
- **Version Control:** Git & GitHub

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local service or Atlas URI)
- [Python 3.x](https://www.python.org/)

### Development Process & Setup Instructions

#### Step 1: Initializing the Project
1. Initialize the backend project using Node.js:
   ```bash
   npm init -y
   ```
   *This creates the `package.json` file for managing dependencies.*

#### Step 2: Installing Dependencies
The following dependencies were installed to set up the server, database connectivity, and routing:
```bash
npm install express mongoose dotenv cors
```
*   **express**: Web framework for Node.js routing.
*   **mongoose**: Object Data Modeling (ODM) library for MongoDB.
*   **dotenv**: To manage environment variables.
*   **cors**: To enable Cross-Origin Resource Sharing.

For development, `nodemon` is installed globally or as a dev dependency to auto-restart the server on file changes:
```bash
npm install -g nodemon
```

#### Step 3: Server Configuration
1. Created `server.js` in the `Server/` directory.
2. Set up basic Express app configuration, added middleware (`express.json()`, `cors()`), and started the server listening on a specified port (e.g., 3000).

#### Step 4: Database Connection
1. Set up a MongoDB connection using Mongoose in `server.js` or a separate `config/db.js` file.
2. Verified connection success by logging a confirmation message to the console.

#### Step 5: Lab Work & Experiments Execution
1. Each lab experiment (e.g., `Lab5`, `Lab12`) is placed within the `lab/` directory.
2. Code is executed modularly using Node.js via the terminal, e.g., `node lab/Lab5/Lab_05_JS_Concepts/script.js`.

---

### Running the Server
1. Navigate to the server folder:
   ```bash
   cd Server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   node server.js
   ```

---

## 📝 License & Attribution
Maintained by [Gaurav Bhaskar](https://github.com/Gaurav2720) for academic coursework and reference.
