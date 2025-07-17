const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session'); // <- Add session support

const app = express();
const PORT = process.env.PORT || 3000;

// Config
const ACCESS_CODE = "secret123"; // You can change this or move it to an .env file

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware (for remembering access)
app.use(session({
  secret: 'your-secret-key', // change this to something secure
  resave: false,
  saveUninitialized: true
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route: login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Route: handle login submission
app.post('/login', (req, res) => {
  const { code } = req.body;
  if (code === ACCESS_CODE) {
    req.session.authorized = true;
    res.redirect('/');
  } else {
    res.send('<h3>Incorrect Code</h3><a href="/login">Try Again</a>');
  }
});

// Middleware to protect main routes
app.use((req, res, next) => {
  if (req.session.authorized || req.path.startsWith('/login')) {
    next();
  } else {
    res.redirect('/login');
  }
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/privacypolicy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'privacypolicy.html'));
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
