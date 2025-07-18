// server.js - Main server file with code authentication
const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const serverless = require("serverless-http");

const app = express();
const PORT = process.env.PORT || 3000;

// Access codes - you can modify these or load from environment variables
const VALID_CODES = [
    'SECRET123',
    'WELCOME2024',
    'PRIVATE001'
];

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware for authentication
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Authentication middleware
function requireAuth(req, res, next) {
    if (req.session && req.session.authenticated) {
        return next();
    } else {
        return res.redirect('/login');
    }
}

// Serve static files from public directory (only for authenticated users)
app.use('/public', requireAuth, express.static(path.join(__dirname, 'public')));

// Login page route (accessible without authentication)
app.get('/login', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Mr. Speedy Development - Access Required</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
                
                :root {
                    --primary-orange: #ff6b00;
                    --secondary-orange: #ff8533;
                    --accent-yellow: #ffc107;
                    --dark-bg: #0a0a0a;
                    --card-bg: rgba(20, 20, 20, 0.8);
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Poppins', sans-serif;
                    overflow-x: hidden;
                    min-height: 100vh;
                    line-height: 1.6;
                }

                .space-grotesk {
                    font-family: 'Space Grotesk', sans-serif;
                    line-height: 1.4;
                }

                /* Enhanced Background Animation */
                .bg-animated {
                    background: linear-gradient(135deg, #0a0a0a, #1a1a1a, #0f0f0f, #2a2a2a);
                    background-size: 400% 400%;
                    animation: gradientFlow 15s ease infinite;
                    position: relative;
                }

                .bg-animated::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: radial-gradient(circle at 20% 50%, rgba(255, 107, 0, 0.1) 0%, transparent 50%),
                                radial-gradient(circle at 80% 20%, rgba(255, 193, 7, 0.08) 0%, transparent 50%),
                                radial-gradient(circle at 40% 80%, rgba(255, 107, 0, 0.05) 0%, transparent 50%);
                    animation: backgroundPulse 20s ease-in-out infinite;
                }

                @keyframes gradientFlow {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                @keyframes backgroundPulse {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.6; }
                }

                /* Enhanced Glow Effects */
                @keyframes pulseGlow {
                    0%, 100% {
                        box-shadow: 0 0 20px var(--primary-orange), 0 0 40px rgba(255, 107, 0, 0.3);
                    }
                    50% {
                        box-shadow: 0 0 30px var(--primary-orange), 0 0 80px rgba(255, 107, 0, 0.5);
                    }
                }

                .glow {
                    animation: pulseGlow 3s infinite;
                }

                .enhanced-glow {
                    position: relative;
                    overflow: hidden;
                }

                .enhanced-glow::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 107, 0, 0.3), transparent);
                    animation: shine 3s infinite;
                }

                @keyframes shine {
                    0% { left: -100%; }
                    50%, 100% { left: 100%; }
                }

                .login-card {
                    background: var(--card-bg);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 107, 0, 0.2);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .login-card::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle, rgba(255, 107, 0, 0.1) 0%, transparent 70%);
                    opacity: 0.3;
                    animation: cardPulse 4s ease-in-out infinite;
                }

                @keyframes cardPulse {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.6; }
                }

                .btn-primary {
                    background: linear-gradient(135deg, var(--primary-orange), var(--accent-yellow));
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }

                .btn-primary::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s ease;
                }

                .btn-primary:hover::before {
                    left: 100%;
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(255, 107, 0, 0.4);
                }

                .input-field {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 107, 0, 0.3);
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                }

                .input-field:focus {
                    border-color: var(--primary-orange);
                    box-shadow: 0 0 20px rgba(255, 107, 0, 0.3);
                    outline: none;
                }

                .text-reveal {
                    opacity: 0;
                    transform: translateY(30px);
                    animation: fadeInUp 0.8s ease forwards;
                }

                @keyframes fadeInUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .error-message {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    backdrop-filter: blur(10px);
                    animation: shake 0.5s ease-in-out;
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }

                @media (max-width: 768px) {
                    .text-4xl { font-size: 2rem; }
                    .text-2xl { font-size: 1.5rem; }
                }
            </style>
        </head>
        <body class="bg-animated text-white min-h-screen flex items-center justify-center p-4">
            <div class="login-card rounded-3xl p-8 w-full max-w-md mx-auto text-center text-reveal">
                <!-- Logo/Brand -->
                <div class="mb-8">
                    <div class="text-4xl font-bold text-orange-400 mb-2 space-grotesk">
                        <i class="fas fa-lock mr-3"></i>Mr. Speedy Development
                    </div>
                    <div class="w-16 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 mx-auto mb-4"></div>
                </div>

                <!-- Access Required Message -->
                <div class="mb-8">
                    <h2 class="text-2xl font-semibold text-white mb-3 space-grotesk">Access Required</h2>
                    <p class="text-gray-300 text-sm leading-relaxed">
                        This is a private area. Please enter your access code to continue to our exclusive content.
                    </p>
                </div>

                <!-- Login Form -->
                <form method="POST" action="/authenticate" class="space-y-6">
                    <div class="space-y-4">
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <i class="fas fa-key text-orange-400"></i>
                            </div>
                            <input 
                                type="text" 
                                name="code" 
                                placeholder="Enter your access code"
                                required
                                class="input-field w-full pl-12 pr-4 py-4 rounded-xl text-white placeholder-gray-400 focus:placeholder-gray-300"
                            >
                        </div>
                    </div>

                    <button type="submit" class="btn-primary w-full py-4 text-white font-semibold rounded-xl glow shadow-lg transition duration-300 enhanced-glow">
                        <i class="fas fa-sign-in-alt mr-2"></i>Enter Site
                    </button>
                </form>

                ${req.query.error ? `
                    <div class="error-message mt-6 p-4 rounded-xl text-red-300 text-sm">
                        <i class="fas fa-exclamation-triangle mr-2"></i>
                        Invalid access code. Please check your code and try again.
                    </div>
                ` : ''}

                <!-- Additional Info -->
                <div class="mt-8 pt-6 border-t border-orange-500/20">
                    <p class="text-gray-400 text-xs">
                        <i class="fas fa-shield-alt mr-1"></i>
                        Authorized access only. Contact support if you need assistance.
                    </p>
                </div>
            </div>

            <!-- Background Elements -->
            <div class="fixed inset-0 pointer-events-none overflow-hidden">
                <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-orange-400/10 rounded-full blur-2xl animate-pulse" style="animation-delay: 4s;"></div>
            </div>

            <script>
                // Add focus animation to input
                document.querySelector('input[name="code"]').addEventListener('focus', function() {
                    this.parentElement.style.transform = 'scale(1.02)';
                });

                document.querySelector('input[name="code"]').addEventListener('blur', function() {
                    this.parentElement.style.transform = 'scale(1)';
                });

                // Add ripple effect to button
                document.querySelector('button[type="submit"]').addEventListener('click', function(e) {
                    const ripple = document.createElement('span');
                    const rect = this.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const x = e.clientX - rect.left - size / 2;
                    const y = e.clientY - rect.top - size / 2;
                    
                    ripple.style.width = ripple.style.height = size + 'px';
                    ripple.style.left = x + 'px';
                    ripple.style.top = y + 'px';
                    ripple.style.position = 'absolute';
                    ripple.style.borderRadius = '50%';
                    ripple.style.background = 'rgba(255, 255, 255, 0.3)';
                    ripple.style.transform = 'scale(0)';
                    ripple.style.animation = 'rippleEffect 0.6s linear';
                    ripple.style.pointerEvents = 'none';
                    
                    this.appendChild(ripple);
                    
                    setTimeout(() => {
                        ripple.remove();
                    }, 600);
                });

                // Add keyframe for ripple effect
                const style = document.createElement('style');
                style.textContent = \`
                    @keyframes rippleEffect {
                        to {
                            transform: scale(4);
                            opacity: 0;
                        }
                    }
                \`;
                document.head.appendChild(style);

                // Auto-focus on input
                document.querySelector('input[name="code"]').focus();
            </script>
        </body>
        </html>
    `);
});

// Authentication route
app.post('/authenticate', (req, res) => {
    const { code } = req.body;
    
    if (VALID_CODES.includes(code)) {
        req.session.authenticated = true;
        req.session.accessCode = code;
        res.redirect('/');
    } else {
        res.redirect('/login?error=1');
    }
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Protected routes
app.get('/', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/privacypolicy', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'privacypolicy.html'));
});

app.get('/api/test', requireAuth, (req, res) => {
    res.json({ 
        message: 'API is working!', 
        timestamp: new Date(),
        user: req.session.accessCode 
    });
});

// 404 handler - must be last route
app.use((req, res) => {
    if (req.session && req.session.authenticated) {
        res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
    } else {
        res.redirect('/login');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Valid access codes:', VALID_CODES);
});

module.exports.handler = serverless(app);