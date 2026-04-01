require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const userRoutes = require('./routes/users');
const cartRoutes = require('./routes/cart');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 5600;
const secretKey = process.env.SECRET_KEY;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://FOOTIVSO:Footivso1234@cluster0.krc7d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log("The Database Is Connected Successfully"))
    .catch(err => console.error("MongoDB connection error:", err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/users', userRoutes);
app.use('/cart', cartRoutes);
app.use('/dashboard', dashboardRoutes);

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
console.log('Secret Key:', secretKey);