// ./routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); 
const Vehicle = require('../models/vehicle');
const Violation = require('../models/violation');
const authMiddleware = require('../middleware/authMiddleware'); 

const router = express.Router();

// User Registration Route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        // Create new user
        const user = new User({ username, email: email.toLowerCase(), passwordHash: password });
        await user.save();
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, message: 'User registered successfully' });  // Combine the status, token, and message into one response
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// User Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).send('User not found');
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

router.post('/validate', authMiddleware, (req, res) => {
    // If this point is reached, the token is valid
    console.log("Token is valid")
    res.sendStatus(200);  // OK
});

module.exports = router;
