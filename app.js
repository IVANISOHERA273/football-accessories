require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/users');
const cartRoutes = require('./routes/cart');
const dashboardRoutes = require('./routes/dashboard');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 5600; // Use Render port if available

// Serve static files from public
app.use(express.static('public'));

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);
app.use('/cart', cartRoutes);
app.use('/dashboard', dashboardRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("The Database Is Connected Successfully"))
.catch(err => console.error("MongoDB connection error:", err));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});