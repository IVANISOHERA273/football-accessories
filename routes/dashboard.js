const express = require('express');
const User = require('../models/user');
const auth = require('../utils/auth');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user info' });
    }
});

router.get('/cart', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        res.json(user.cart);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cart items' });
    }
});

module.exports = router;
