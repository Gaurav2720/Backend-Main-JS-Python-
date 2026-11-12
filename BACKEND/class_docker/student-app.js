// Student Management Express Application
const express = require("express");
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

const PORT = 3000;

// In-memory array to store student records
let students = [
    { id: 1, name: "Rahul", course: "BCA" },
    { id: 2, name: "Amit", course: "MCA" }
];
let nextId = 3;

// GET / - Display application welcome message
app.get("/", (req, res) => {
    res.send("Welcome to Student Management API");
});

// GET /students - Display all students
app.get("/students", (req, res) => {
    res.json(students);
});

// GET /students/:id - Display a particular student
app.get("/students/:id", (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) {
        return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
});

// POST /students - Add a new student
app.post("/students", (req, res) => {
    const { name, course } = req.body;
    if (!name || !course) {
        return res.status(400).json({ error: "Name and course are required" });
    }
    const newStudent = { id: nextId++, name, course };
    students.push(newStudent);
    res.status(201).json(newStudent);
});

// DELETE /students/:id - Delete a student
app.delete("/students/:id", (req, res) => {
    const index = students.findIndex(s => s.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: "Student not found" });
    }
    const deleted = students.splice(index, 1);
    res.json({ message: "Student deleted", student: deleted[0] });
});

// Start the Express server on all network interfaces
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Student Management API running on port ${PORT}`);
});