const express = require('express');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to Express!');
});

app.get('/text', (req, res) => {
  res.send('This is plain text response');
});

app.get('/html', (req, res) => {
  res.send('<h1>HTML Response</h1><p>This is HTML content</p>');
});

app.get('/json', (req, res) => {
  res.json({
    message: 'This is JSON response',
    status: 'success',
    data: {
      name: 'Student',
      course: 'Backend Development'
    }
  });
});

app.get('/status', (req, res) => {
  res.status(201).json({ message: 'Created successfully' });
});

app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  res.json({
    message: 'User details',
    userId: userId
  });
});

app.get('/product/:category/:id', (req, res) => {
  const { category, id } = req.params;
  res.json({
    category: category,
    productId: id
  });
});

app.get('/search', (req, res) => {
  const { q, page, limit } = req.query;
  res.json({
    searchQuery: q,
    page: page || 1,
    limit: limit || 10
  });
});

app.get('/calculate', (req, res) => {
  const { num1, num2, operation } = req.query;
  const n1 = parseFloat(num1);
  const n2 = parseFloat(num2);

  let result;
  switch (operation) {
    case 'add':
      result = n1 + n2;
      break;
    case 'subtract':
      result = n1 - n2;
      break;
    case 'multiply':
      result = n1 * n2;
      break;
    case 'divide':
      result = n2 !== 0 ? n1 / n2 : 'Error: Division by zero';
      break;
    default:
      result = 'Invalid operation';
  }

  res.json({ num1: n1, num2: n2, operation, result });
});

app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  res.json({
    message: 'Registration successful',
    user: {
      username,
      email
    }
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === 'test@example.com' && password === 'password123') {
    res.json({
      success: true,
      message: 'Login successful',
      token: 'sample-jwt-token'
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

app.get('/register-form', (req, res) => {
  res.render('register');
});

app.post('/students/register', (req, res) => {
  const { name, email, course, semester } = req.body;
  res.render('result', { name, email, course, semester });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});