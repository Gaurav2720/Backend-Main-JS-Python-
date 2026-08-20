const express = require('express');
const app = express();
const PORT = 3000;

// MIDDLEWARE: This allows your server to read JSON data sent in the request body
app.use(express.json());

// ==========================================
// ENDPOINTS (The URLs you can visit)
// ==========================================

// 1. Basic GET Request (Test this by going to http://localhost:3000 in your browser)
app.get('/', (req, res) => {
    res.send('Hello! Your sandbox server is running smoothly.');
});

// 2. GET Request returning JSON data
app.get('/api/info', (req, res) => {
    res.json({
        status: 'success',
        message: 'This is a JSON response.',
        concept: 'Routing',
        timestamp: new Date()
    });
});

// 3. POST Request (Test this using Postman, Thunder Client, or cURL)
// This simulates receiving data from a frontend form
app.post('/api/users', (req, res) => {
    const incomingData = req.body; 
    
    // Basic validation test
    if (!incomingData.name) {
        return res.status(400).json({ error: 'Bad Request: Name is required!' });
    }

    // Send a success response back to the client
    res.status(201).json({
        message: `User ${incomingData.name} received successfully!`,
        dataSaved: incomingData
    });
});

// ==========================================
// START THE SERVER
// ==========================================
app.listen(PORT, () => {
    console.log(`🚀 Sandbox server is alive at http://localhost:${PORT}`);
});