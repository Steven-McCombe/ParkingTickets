const express = require('express');
const axios = require('axios');
const User = require('../models/user'); 
const authMiddleware = require('../middleware/authMiddleware');  // Adjust the path as necessary

const router = express.Router();

router.post('/getViolations', authMiddleware, async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        const violationsData = [];
        for (const licensePlateObj of user.licensePlates) {
            const { licensePlate, licenseType, state } = licensePlateObj;
            const response = await axios.get(`https://data.cityofnewyork.us/resource/nc67-uf89.json?$where=plate='${licensePlate}' AND license_type='${licenseType}' AND state='${state}'`);
            violationsData.push(...response.data);
        }
        res.json(violationsData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
