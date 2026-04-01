require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/users');
const cartRoutes = require('./routes/cart');
const bodyParser = require('body-parser');
const dashboardRoutes = require('./routes/dashboard');
const nodemailer = require('nodemailer');
const app = express();
const port = 5600;
const secretKey = process.env.SECRET_KEY;

mongoose.connect('mongodb+srv://FOOTIVSO:Footivso1234@cluster0.krc7d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => {
    console.log("The Database Is Connected Successfully");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/users', userRoutes);
app.use('/cart', cartRoutes);
app.use('/dashboard', dashboardRoutes);
app.use(express.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
console.log('Secret Key:', process.env.SECRET_KEY);
