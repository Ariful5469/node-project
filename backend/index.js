const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');

require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 8080;

const app = express();

// Allow CORS from your frontend (localhost:3000)
app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

// Ping route to check if the server is working
app.get('/ping', (req, res) => {
    res.send('PONG');
});

// Parse JSON request body
app.use(bodyParser.json());

// Routes
app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
