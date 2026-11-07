// Import the Express framework.
const express = require("express");

// Create an Express application instance.
const app = express();

// Define the port on which the server listens.
const PORT = 3000;

// Handle requests to the home page.
app.get("/", (req, res) => {
    res.send("Hello! Express is running inside Docker.");
});

// Return JSON data through an API endpoint.
app.get("/api/students", (req, res) => {
    res.json([
        { id: 1, name: "Rahul", course: "BCA" },
        { id: 2, name: "Amit", course: "MCA" }
    ]);
});

// Start the Express server on all network interfaces.
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});