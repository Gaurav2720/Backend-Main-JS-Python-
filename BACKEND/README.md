# 🚀 Backend Development

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.11%20%7C%203.12-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x%20%7C%205.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Django](https://img.shields.io/badge/Django-6.x-092E20?logo=django&logoColor=white)](https://www.djangoproject.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-JSONB-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Containerization-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Apache Kafka](https://img.shields.io/badge/Apache%20Kafka-KRaft-231F20?logo=apachekafka&logoColor=white)](https://kafka.apache.org/)

---

## 👨‍💻 Student Profile

| Attribute | Details |
| :--- | :--- |
| **Student Name** | **Gaurav Bhaskar** |
| **SAP ID** | `590012457` |
| **Program** | B.Tech Computer Science & Engineering (Core) |
| **Batch & Semester** | Batch B3 — 5th Semester |
| **Institution** | School of Computer Science (SOCS), UPES Dehradun |
| **Course** | Backend Web Development |
| **Repository** | [Gaurav2720/Backend-Main-JS-Python-](https://github.com/Gaurav2720/Backend-Main-JS-Python-) |

---

## 📖 1. Project Overview

This repository represents the official, comprehensive academic submission and technical portfolio for the **5th Semester Backend Web Development Coursework** at the School of Computer Science, UPES.

It contains end-to-end practical implementations, weekly laboratory experiments, continuous assessment assignments, theory classroom demonstrations, containerization setups, and examination projects spanning **JavaScript (Node.js ecosystem)** and **Python backend frameworks**. Every component adheres to clean architecture, input validation, robust error handling, security standards, and comprehensive documentation.

---

## 🛠️ 2. Technology Stack & Tools

All listed technologies are backed by concrete source implementations within this repository:

### Programming Languages & Runtimes
- **JavaScript (ES6+)**: Server-side scripting, async event loops, promises, classes, and modular design.
- **Node.js (v18+)**: Asynchronous non-blocking runtime environment.
- **Python (3.11 / 3.12)**: Type hinting, object-oriented modeling, ASGI services, and ORM integration.

### Backend Frameworks & Libraries
- **Node.js Ecosystem**: Express.js (v4.x & v5.x), REST routing, custom middlewares.
- **Python Ecosystem**: FastAPI (ASGI), Django 6.x (MVT), Flask REST concepts.

### Templating & Server-Side Rendering (SSR)
- **EJS (Embedded JavaScript)**: Server-side rendering, partials, layouts, dynamic data passing.
- **Django Templates**: Multi-tier inheritance (`base.html`, `header.html`, `footer.html`), CSRF tokens.

### Databases, ORMs & Query Engines
- **MongoDB & Mongoose ODM**: Document modeling, schema validation, Atlas cloud cluster integration.
- **PostgreSQL**: Relational tables, `JSONB` semi-structured columns, GIN (Generalized Inverted Index) queries.
- **SQLite3**: In-process serverless database for lightweight persistence and testing.
- **SQLAlchemy ORM (2.x)**: Declarative base models, foreign keys, cascade deletions, bidirectional `relationship(back_populates=...)`.

### State Management & Authentication
- **Express-Session**: Server-side session stores, session cookie serialization.
- **Cookie-Parser**: HTTP cookies, security flags (`httpOnly`, `secure`, `sameSite`, `maxAge`).
- **Bcrypt**: Salt generation and one-way password hashing for authentication.
- **Web Storage API**: Client-side `window.localStorage` JSON serialization.

### DevOps, Containers & Event Streaming
- **Docker**: Containerization, multi-stage Dockerfiles, layer caching, Alpine base images, port mapping.
- **GitHub Actions**: Continuous Integration (CI), automated linting, test execution, Docker Hub deployment.
- **Apache Kafka & KafkaJS**: Distributed event streaming, message broker in KRaft mode, pub/sub architecture.

---

## 📂 3. Preserved Repository Directory Structure

```plaintext
BACKEND/
├── class_docker/                             # Dockerized Express Student Management Service
│   ├── Dockerfile                           # Container definition (node:18-alpine)
│   ├── .dockerignore                        # Build context exclusions
│   ├── student-app.js                       # Containerized REST API
│   ├── app.js                               # Express application
│   ├── package.json                         # Node package configuration
│   └── README.md                            # Containerization & Docker commands guide
│
├── dJango/                                  # Django foundational workspace
│   └── firstproj/                           # Initial project configuration & Pipfile
│
├── KAFKA/                                   # Apache Kafka Event-Driven Microservices
│   ├── kafka.js                             # KafkaJS client broker connection
│   ├── order-service.js                     # Order producer service (HTTP 202 Accepted)
│   ├── inventory-service.js                 # Inventory consumer service (Eventual consistency)
│   ├── notification-service.js              # Notification consumer service
│   ├── stock.json                           # Local inventory state simulation
│   └── README.md                            # Architecture & KRaft broker setup guide
│
├── lab/                                     # Laboratory Experiments & Practical Assignments
│   ├── lAB1/                                # Experiment 1: Semantic HTML5 Structure & Forms
│   │   ├── Exp1.html                        # Semantic HTML5 elements & validation form
│   │   └── Report.md                        # Academic lab report
│   ├── Lab5/                                # Experiment 5: JavaScript Core Concepts
│   │   └── Lab_05_JS_Concepts/              # Functions, closures, prototypes, arrays
│   ├── Lab7,8,9/                            # Experiments 7, 8, 9: DOM, ES6+, Events & To-Do
│   │   ├── dom.js                           # DOM tree traversal and mutation
│   │   ├── es6.js                           # Arrow functions, destructuring, spread, classes
│   │   ├── events.js                        # Event listeners, bubbling, delegation
│   │   ├── index.html                       # Demonstration interface
│   │   ├── todo/                            # Client-side DOM To-Do List application
│   │   └── Report.md                        # Combined experiment report
│   ├── Lab12/                               # Experiment 12: Express.js, EJS, Cookies & Sessions
│   │   ├── Lab12A/                          # Exp 12A: Node.js Express server with EJS forms
│   │   │   ├── nodejs-express-lab/          # Express app, routes, Register/Result views
│   │   │   └── report.md                    # Lab report
│   │   └── LAB12b/                          # Exp 12B: HTTP Cookies & Express Sessions
│   │       ├── cookie-example.js.js         # Cookie setting, reading, and clearing
│   │       ├── session-example.js           # Session visit counter & state
│   │       └── report.md                    # Lab report
│   ├── Lab13/                               # Experiment 13: MongoDB & Mongoose ODM
│   │   ├── mongoose-demo/                   # Mongoose schemas, Atlas connection, CRUD
│   │   └── report.md                        # Lab report
│   ├── LAB15/                               # Experiment 15: Django To-Do Web Application
│   │   ├── todo/                            # Django app (Models, Views, Admin, Tests)
│   │   ├── todo_project/                    # Root Django configuration & routing
│   │   ├── static/                          # Static assets (CSS styling)
│   │   ├── db.sqlite3                       # SQLite persistence database
│   │   ├── LAB15_EXPLANATION.md             # Technical walkthrough & rubric alignment
│   │   └── report.md                        # Comprehensive lab report
│   └── Assignment/                          # Continuous Assessment Lab Assignments
│       ├── loginpage/                       # Assignment 1: Session-Based User Login System
│       │   ├── server.js                    # Express auth server with bcrypt & sessions
│       │   ├── views/                       # EJS templates (login, register, dashboard)
│       │   ├── public/                      # Responsive CSS styles
│       │   ├── .env.example                 # Environment configuration sample
│       │   └── README.md                    # Assignment documentation
│       └── Todolist/                        # Assignment 2: Session-Based To-Do Application
│           ├── server.js                    # Isolated session-backed task state server
│           ├── views/index.ejs              # Interactive task management UI with filters
│           ├── public/style.css             # Polished dark-mode CSS styling
│           ├── package.json                 # Express & express-session manifests
│           ├── .env.example                 # Environment configuration sample
│           └── README.md                    # Architectural overview & testing guide
│
├── Note-taking-Test-viva/                   # Lab Examination / Viva Project: My Notes App
│   ├── app.js                               # Express & MongoDB Atlas backend server
│   ├── views/                               # EJS views (index.ejs list, new.ejs form)
│   ├── public/style.css                     # Responsive styling
│   ├── .env.example                         # MongoDB connection configuration
│   ├── package.json                         # Node.js project manifest
│   ├── Testreport.md                        # Complete practical examination report
│   ├── Vivaprep.md                          # In-depth viva voce examination study guide
│   └── README.md                            # Project overview & running instructions
│
├── Server/                                  # Sandbox Express API Server
│   ├── server.js                            # REST endpoint demonstrations
│   └── package.json                         # Dependencies
│
├── TheoryClass/                             # Classroom Theory Implementations
│   ├── Class1/                              # Express setup & EJS dynamic rendering
│   │   ├── express-demo/                    # Express initial routing
│   │   ├── task_2/                          # Dynamic EJS templating
│   │   └── README.md                        # Documentation
│   ├── Class2/                              # Web DevTools, HTTP methods & Postman
│   │   ├── whatwedid                        # Notes
│   │   └── README.md                        # Practical guide
│   ├── class3/                              # FastAPI fundamentals & Uvicorn runner
│   │   ├── main.py / main2.py               # Minimal ASGI REST endpoints
│   │   └── README.md                        # Setup & API docs
│   ├── class4/                              # FastAPI Student Management CRUD API
│   │   ├── main.py                          # Pydantic schemas, validation, CRUD endpoints
│   │   ├── purpose                          # Notes
│   │   └── README.md                        # Endpoints documentation
│   ├── class5/                              # State management: Cookies & Sessions
│   │   ├── Express-session/app.js           # Cookie-parser lifecycle demonstration
│   │   └── README.md                        # Comparative analysis
│   ├── Class15/                             # Relational modeling with SQLAlchemy ORM
│   │   ├── student_management.py            # Department-Student-Course-Enrollment models
│   │   ├── blog_application.js             # Node.js backend integration
│   │   ├── students_lab.db                  # Generated SQLite relational database
│   │   └── README.md                        # Relational schema & cascade rules
│   ├── Unit2/ORM/                           # SQLAlchemy Bidirectional Relationships
│   │   ├── main.py                          # `back_populates` relationship synchronization
│   │   ├── students.db                      # SQLite database
│   │   └── README.md                        # Declarative ORM documentation
│   ├── class_docker/                        # FastAPI Dockerization & GitHub Actions CI/CD
│   │   └── README.md                        # Full CI/CD blueprint, Dockerfile & workflow YAML
│   └── Theory-Assignments/                  # Theory Coursework Research Assignments
│       ├── LocalStorage-Notes-App/          # Theory Assignment 1: LocalStorage Notes Engine
│       │   ├── index.html                   # Interactive browser notes UI
│       │   ├── styles.css                   # Glassmorphic layout & tags
│       │   ├── app.js                       # Serialization & LocalStorage CRUD engine
│       │   └── README.md                    # Storage API analysis & lifetime comparison
│       └── PostgreSQL-JSONB/                # Theory Assignment 2: PostgreSQL JSONB Deep Dive
│           ├── schema.sql                   # SQL table, JSONB columns, GIN index, queries
│           ├── server.js                    # Express + pg query explorer with fallback
│           ├── views/index.ejs              # Comparative JSON vs JSONB dashboard
│           ├── public/style.css             # Dark theme UI
│           ├── package.json                 # Node dependencies
│           ├── .env.example                 # PostgreSQL credentials example
│           └── README.md                    # Comprehensive technical report
│
└── README.md                                # Master Coursework Documentation (This File)
```

---

## 🧪 4. Lab Experiments Matrix

| Experiment | Title & Topic | Technologies | Folder Link | Status |
| :---: | :--- | :--- | :--- | :---: |
| **Exp 1** | Semantic HTML5 & Form Validation | HTML5, CSS | [`lab/lAB1/`](file:///c:/Users/GAURAV/OneDrive/Desktop/Sem5Backend/Backend/BACKEND/lab/lAB1) | **Completed** |
| **Exp 5** | JavaScript Core Concepts (Functions, Scope, PBL) | JavaScript (ES5/ES6) | [`lab/Lab5/Lab_05_JS_Concepts/`](file:///c:/Users/GAURAV/OneDrive/Desktop/Sem5Backend/Backend/BACKEND/lab/Lab5/Lab_05_JS_Concepts) | **Completed** |
| **Exp 7, 8, 9** | DOM Manipulation, ES6+ Features & Events | JavaScript, DOM API | [`lab/Lab7,8,9/`](file:///c:/Users/GAURAV/OneDrive/Desktop/Sem5Backend/Backend/BACKEND/lab/Lab7,8,9) | **Completed** |
| **Exp 12A** | Node.js Server & Express with EJS Views | Node.js, Express, EJS | [`lab/Lab12/Lab12A/`](file:///c:/Users/GAURAV/OneDrive/Desktop/Sem5Backend/Backend/BACKEND/lab/Lab12/Lab12A) | **Completed** |
| **Exp 12B** | Client-Server State via Cookies & Sessions | Express, Session, Cookie | [`lab/Lab12/LAB12b/`](file:///c:/Users/GAURAV/OneDrive/Desktop/Sem5Backend/Backend/BACKEND/lab/Lab12/LAB12b) | **Completed** |
| **Exp 13A** | MongoDB & Mongoose ODM CRUD Operations | MongoDB, Mongoose, Node.js | [`lab/Lab13/mongoose-demo/`](file:///c:/Users/GAURAV/OneDrive/Desktop/Sem5Backend/Backend/BACKEND/lab/Lab13/mongoose-demo) | **Completed** |
| **Exp 15** | Django To-Do Application (MVT, ORM, CSRF) | Django, Python, SQLite | [`lab/LAB15/`](file:///c:/Users/GAURAV/OneDrive/Desktop/Sem5Backend/Backend/BACKEND/lab/LAB15) | **Completed** |

---

## 📝 5. Continuous Assessment Lab Assignments

### Assignment 1: Session-Based User Login System
- **Folder:** [`lab/Assignment/loginpage/`](file:///c:/Users/GAURAV/OneDrive/Desktop/Sem5Backend/Backend/BACKEND/lab/Assignment/loginpage)
- **Objective:** Build a secure session-based authentication system without relying on plain text credentials.
- **Concepts Implemented:**
  - Password hashing with **Bcrypt** (salt rounds = 10).
  - Session cookie issuance via `express-session` (`connect.sid`).
  - Protected dashboard middleware restricting unauthenticated requests.
  - Safe user logout by invalidating server session.
- **Status:** **Completed**

### Assignment 2: Session-Based To-Do Web Application
- **Folder:** [`lab/Assignment/Todolist/`](file:///c:/Users/GAURAV/OneDrive/Desktop/Sem5Backend/Backend/BACKEND/lab/Assignment/Todolist)
- **Objective:** Create a multi-user task management application storing state exclusively in session memory to study HTTP statefulness.
- **Concepts Implemented:**
  - Dynamic user-isolated task arrays stored in `req.session.tasks`.
  - Add task with priority (`Low`, `Medium`, `High`), toggle completion, delete task.
  - Status filtering (`all`, `active`, `completed`) and clear completed action.
  - Flash messages for user operation feedback.
  - Verification across regular and incognito sessions proving isolation.
- **Status:** **Completed**

---

## 💡 6. Theory Coursework Assignments

### Theory Assignment 1: Notes Application Using LocalStorage
- **Folder:** [`TheoryClass/Theory-Assignments/LocalStorage-Notes-App/`](file:///c:/Users/GAURAV/OneDrive/Desktop/Sem5Backend/Backend/BACKEND/TheoryClass/Theory-Assignments/LocalStorage-Notes-App)
- **Objective:** Implement client-side persistent storage and examine data lifecycle, JSON serialization, and quota constraints.
- **Concepts Implemented:**
  - Browser Web Storage API (`window.localStorage`).
  - Serializing objects with `JSON.stringify()` and recovering with `JSON.parse()`.
  - Full CRUD: Create, read, edit in-place, toggle pinned status, delete notes.
  - Category tags (`Work`, `Study`, `Personal`, `Ideas`) and real-time live search.
  - Diagnostic widget computing exact byte consumption in memory.
- **Status:** **Completed**

### Theory Assignment 2: PostgreSQL JSONB Deep Dive
- **Folder:** [`TheoryClass/Theory-Assignments/PostgreSQL-JSONB/`](file:///c:/Users/GAURAV/OneDrive/Desktop/Sem5Backend/Backend/BACKEND/TheoryClass/Theory-Assignments/PostgreSQL-JSONB)
- **Objective:** Research and demonstrate PostgreSQL's semi-structured `JSONB` data type, query operators, and GIN indexing versus traditional NoSQL databases.
- **Concepts Implemented:**
  - Rigorous comparative analysis: `JSON` (text) vs `JSONB` (binary decomposed).
  - Containment (`@>`), path extraction (`->>`, `#>>`), and key existence (`?`) queries.
  - GIN (Generalized Inverted Index) definition on JSONB columns.
  - Express.js query explorer interface with simulated fallback for viva readiness.
  - Architectural framework: PostgreSQL JSONB vs MongoDB.
- **Status:** **Completed**

---

## 🎓 7. Theory Classroom Implementations

| Class | Topic | Source Files | Key Features |
| :--- | :--- | :--- | :--- |
| **Class 1** | Express.js & EJS Templates | `TheoryClass/Class1/` | Server setup, EJS dynamic profile views |
| **Class 2** | DevTools & API Testing | `TheoryClass/Class2/` | Network tab inspection, HTTP status codes, Postman |
| **Class 3** | FastAPI Basics & Uvicorn | `TheoryClass/class3/` | ASGI architecture, `@app.get("/")`, Uvicorn runner |
| **Class 4** | FastAPI CRUD & Pydantic | `TheoryClass/class4/` | Pydantic data schemas, query filtering, full CRUD |
| **Class 5** | Cookies & State Management | `TheoryClass/class5/` | `cookie-parser`, setting/reading/clearing cookies |
| **Class 15** | SQLAlchemy Relational ORM | `TheoryClass/Class15/` | 1-to-N & N-to-N relationships, cascade deletes |
| **Unit 2** | Declarative ORM Mapping | `TheoryClass/Unit2/ORM/` | `back_populates` synchronization across entities |
| **Docker CI** | FastAPI Dockerization & CI/CD | `TheoryClass/class_docker/` | Dockerfile, GitHub Actions workflow, Docker Hub PAT |

---

## 🎯 8. Lab Test / Viva Examination Project

- **Project Name:** **My Notes — Full-Stack Notes Management Web App**
- **Folder:** [`Note-taking-Test-viva/`](file:///c:/Users/GAURAV/OneDrive/Desktop/Sem5Backend/Backend/BACKEND/Note-taking-Test-viva)
- **Backend Stack:** Node.js, Express.js, MongoDB Atlas (or local MongoDB), EJS
- **Frontend Stack:** HTML5, CSS3, Responsive Design
- **Architecture & Security:**
  - Separation of database configuration via environment variable `MONGO_URI`.
  - Comprehensive input validation (Title min 3, max 100 chars, no numbers, Content min 5 chars, alphabetical category).
  - Timestamped descending sorting (`createdAt: -1`).
  - Secure deletion by `ObjectId`.
- **Examination Documentation:**
  - 📄 [`Testreport.md`](file:///c:/Users/GAURAV/OneDrive/Desktop/Sem5Backend/Backend/BACKEND/Note-taking-Test-viva/Testreport.md) — 900+ lines comprehensive practical test report.
  - 📄 [`Vivaprep.md`](file:///c:/Users/GAURAV/OneDrive/Desktop/Sem5Backend/Backend/BACKEND/Note-taking-Test-viva/Vivaprep.md) — 80,000+ characters viva voce Q&A preparation guide.
- **Status:** **Completed**

---

## 🌐 9. Advanced Backend Demonstrations

### 1. Apache Kafka Distributed Event Streaming (`KAFKA/`)
Demonstrates decoupled event-driven microservices architecture:
- **Order Service:** Accepts order requests, publishes `order-created` event to Kafka topic, and responds with `HTTP 202 Accepted` immediately without blocking.
- **Inventory Service:** Subscribes to `order-created`, updates inventory stock in `stock.json` asynchronously (eventual consistency).
- **Notification Service:** Subscribes to `order-created`, logs customer email alerts.

### 2. Dockerized Microservice (`class_docker/`)
Demonstrates containerization of a Node.js Express REST API:
- Multi-stage Alpine containerization (`Dockerfile`).
- Docker layer caching on `package*.json` dependencies.
- Container isolation and host port forwarding (`-p 3000:3000`).

### 3. Production Django MVT To-Do Application (`lab/LAB15/`)
Demonstrates full-featured Django web application architecture:
- MVT separation with reusable template includes (`header.html`, `footer.html`).
- CSRF token protection on all state-altering requests.
- Custom middleware for request/response logging and performance timing.
- SQLite ORM migrations and automated unit tests (`tests.py`).

---

## ⚙️ 10. Installation & Execution Guide

### Running Node.js Applications (e.g. Lab Assignments, Test Viva)
```bash
# 1. Session Login Application
cd lab/Assignment/loginpage
npm install
npm start
# -> http://localhost:3000

# 2. Session To-Do Application
cd lab/Assignment/Todolist
npm install
npm start
# -> http://localhost:3000

# 3. Lab Test Viva Notes App
cd Note-taking-Test-viva
npm install
npm start
# -> http://localhost:3000

# 4. PostgreSQL JSONB Explorer
cd TheoryClass/Theory-Assignments/PostgreSQL-JSONB
npm install
npm start
# -> http://localhost:4000
```

### Running Python Applications (FastAPI, Django, SQLAlchemy)
```bash
# 1. FastAPI Student CRUD API (Class 4)
cd TheoryClass/class4
pip install fastapi uvicorn pydantic
python main.py
# -> http://127.0.0.1:5000/docs

# 2. SQLAlchemy Relational Model (Class 15)
cd TheoryClass/Class15
pip install sqlalchemy
python student_management.py

# 3. Django To-Do Application (Lab 15)
cd lab/LAB15
python manage.py migrate
python manage.py runserver
# -> http://127.0.0.1:8000
```

### Running Dockerized Services
```bash
cd class_docker
docker build -t student-management:1.0 .
docker run -d -p 3000:3000 --name student-service student-management:1.0
# -> http://localhost:3000/students
```

---

## 🏆 11. Key Learning Outcomes

1. **Protocol Mastery:** Deep appreciation of HTTP statelessness, resolving state tracking via cookies, sessions, and headers.
2. **API Engineering:** Developing production-grade REST APIs across both Node.js (Express) and Python (FastAPI) with schema validation (Pydantic).
3. **Data Modeling & Integrity:** Managing both document databases (MongoDB/Mongoose), relational databases (PostgreSQL, SQLite), and ORMs (SQLAlchemy, Django ORM) with cascade deletions and foreign keys.
4. **Hybrid Database Architecture:** Utilizing PostgreSQL `JSONB` columns with GIN indexes to achieve document flexibility within relational ACID guarantees.
5. **Modern Containerization & CI/CD:** Building minimal container images with Docker and orchestrating automated build/test/publish workflows with GitHub Actions.
6. **Event-Driven Architecture:** Decoupling microservices and implementing eventual consistency via Apache Kafka.

---

## 📊 12. Coursework Completion Tracker & Audit Matrix

| Category | Component | Expected Concepts | Status | Evidence / Location |
| :--- | :--- | :--- | :---: | :--- |
| **Lab Exp** | Exp 1 | Semantic HTML5 & Form validation | ✅ Completed | `lab/lAB1/Exp1.html` |
| **Lab Exp** | Exp 5 | Functions, Scopes, PBL JS | ✅ Completed | `lab/Lab5/Lab_05_JS_Concepts/` |
| **Lab Exp** | Exp 7, 8, 9 | DOM API, ES6+, Events, Todo | ✅ Completed | `lab/Lab7,8,9/` |
| **Lab Exp** | Exp 12A | Express server, EJS templates | ✅ Completed | `lab/Lab12/Lab12A/nodejs-express-lab/` |
| **Lab Exp** | Exp 12B | HTTP Cookies, Session state | ✅ Completed | `lab/Lab12/LAB12b/` |
| **Lab Exp** | Exp 13A | MongoDB connection & Mongoose ODM | ✅ Completed | `lab/Lab13/mongoose-demo/` |
| **Lab Exp** | Exp 15 | Django MVT, ORM, CSRF, Templates | ✅ Completed | `lab/LAB15/` |
| **Lab Assign** | Assign 1 | Session login, bcrypt, dashboard | ✅ Completed | `lab/Assignment/loginpage/` |
| **Lab Assign** | Assign 2 | Session To-Do, user-isolated state | ✅ Completed | `lab/Assignment/Todolist/` |
| **Theory Assign** | Theory Assign 1 | LocalStorage, JSON serialize, CRUD | ✅ Completed | `TheoryClass/Theory-Assignments/LocalStorage-Notes-App/` |
| **Theory Assign** | Theory Assign 2 | PostgreSQL JSONB, GIN index, SQL vs NoSQL | ✅ Completed | `TheoryClass/Theory-Assignments/PostgreSQL-JSONB/` |
| **Theory Class** | Class 1 | Express & EJS templating | ✅ Completed | `TheoryClass/Class1/` |
| **Theory Class** | Class 2 | DevTools, HTTP methods, Postman | ✅ Completed | `TheoryClass/Class2/` |
| **Theory Class** | Class 3 | FastAPI ASGI hello REST, Uvicorn | ✅ Completed | `TheoryClass/class3/` |
| **Theory Class** | Class 4 | FastAPI CRUD API, Pydantic validation | ✅ Completed | `TheoryClass/class4/` |
| **Theory Class** | Class 5 | Cookies vs Sessions, cookie-parser | ✅ Completed | `TheoryClass/class5/` |
| **Theory Class** | Class 15 | SQLAlchemy ORM, relationships, cascade | ✅ Completed | `TheoryClass/Class15/` |
| **Theory Class** | Unit 2 ORM | SQLAlchemy bidirectional back_populates | ✅ Completed | `TheoryClass/Unit2/ORM/` |
| **Theory Class** | Docker CI/CD | FastAPI Dockerfile, GitHub Actions CI/CD | ✅ Completed | `TheoryClass/class_docker/README.md` |
| **Lab Test / Viva**| My Notes App | Express, MongoDB Atlas, EJS, Validation | ✅ Completed | `Note-taking-Test-viva/` |
| **Microservices**| Apache Kafka | Event-driven Order-Inventory-Notification | ✅ Completed | `KAFKA/` |
| **Containers** | Docker Service | Containerized Express student app | ✅ Completed | `class_docker/` |

---

## 📜 Academic Integrity & Attribution
Maintained and submitted by **Gaurav Bhaskar** (`590012457`), School of Computer Science, UPES.  
All implementations adhere to academic integrity standards with original source code, verifiable configurations, and thorough documentation.
