const express = require('express');
const User = require('../models/user'); 
const auth = require('../utils/auth'); 

const router = express.Router(); 

router.post('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.cart.push(req.body.product);
        await user.save();
        res.status(200).json({ message: 'Product added to cart', cart: user.cart });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ error: 'Failed to add product to cart' });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ cart: user.cart });
    } catch (error) {
        console.error('Error retrieving cart:', error);
        res.status(500).json({ error: 'Failed to retrieve cart' });
    }
});

module.exports = router;
