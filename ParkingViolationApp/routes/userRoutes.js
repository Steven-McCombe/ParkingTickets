// ./routes/userRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/user');  // Adjust the path to your User model
const Vehicle = require('../models/vehicle');
const Violation = require('../models/violation');

router.get('/me', authMiddleware, async (req, res) => {
    try {
        // Use the userId from the req object to look up the user in the database
        const user = await User.findById(req.userId)
                               .select('-passwordHash')  
                               .populate('vehicles')     
                               .populate('violations');  
        if (!user) {
            // If no user is found, send a 404 Not Found response
            return res.status(404).send('User not found');
        }
        // Return the user data (now without the passwordHash, and with vehicles and violations populated)
        res.json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        // If an error occurs, send a 500 Internal Server Error response
        res.status(500).send('Server error');
    }
});


module.exports = router;
