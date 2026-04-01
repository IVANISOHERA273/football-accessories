require('dotenv').config();
const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, forename, email, password, phone, dob, flag, gender } = req.body;

        const newUser = new User({
            name,
            forename,
            email,
            password, 
            phone,
            dob,
            flag,
            gender
        });

        const savedUser = await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: savedUser });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ error: 'Email already exists' });
        } else {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Failed to create user', details: error.message });
        }
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Received email:', email);
        console.log('Received password:', password);

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'No account found with this email' });
        }

        const resetLink = `http://localhost:5600/reset-password?email=${encodeURIComponent(email)}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            text: `To reset your password, please click the following link: ${resetLink}`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send password reset email' });
    }
});
const saveOrder = async (orderDetails) => {
    console.log('Order details:', orderDetails);
    return { success: true, message: 'Order placed successfully!' };
};

router.post('/api/checkout', async (req, res) => {
    try {
        const orderDetails = req.body;
        const result = await saveOrder(orderDetails);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error processing checkout:', error);
        res.status(500).json({ message: 'Failed to process order' });
    }
});


module.exports = router;
