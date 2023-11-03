// routes/testRoutes.js
const express = require('express');
const User = require('../models/user'); 

const router = express.Router();

router.get('/allUsers', async (req, res) => {
    console.log("test")
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
