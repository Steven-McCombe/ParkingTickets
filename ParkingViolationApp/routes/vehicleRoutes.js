// routes/vehicleRoutes.js
const express = require('express');
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');  // Adjust the path as necessary

const router = express.Router();

// Route to add a new vehicle
router.post('/addVehicle', authMiddleware, async (req, res) => {
    const { userId, nickName, licensePlate, licenseType, state } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).send('User not found');

        const newVehicle = { nickName, licensePlate, licenseType, state };
        user.licensePlates.push(newVehicle);
        await user.save();

        res.json(newVehicle);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Route to get all vehicles of a user
router.get('/getVehicles', authMiddleware, async (req, res) => {
    const { userId } = req.query;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).send('User not found');

        res.json(user.licensePlates);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Route to update a vehicle
router.put('/updateVehicle/:vehicleId', authMiddleware, async (req, res) => {
    const { userId, nickName, licensePlate, licenseType, state } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).send('User not found');

        const vehicleIndex = user.licensePlates.findIndex(vehicle => vehicle._id.toString() === req.params.vehicleId);
        if (vehicleIndex === -1) return res.status(404).send('Vehicle not found');

        const updatedVehicle = { nickName, licensePlate, licenseType, state };
        user.licensePlates[vehicleIndex] = updatedVehicle;
        await user.save();

        res.json(updatedVehicle);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Route to delete a vehicle
router.delete('/deleteVehicle/:vehicleId', authMiddleware, async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).send('User not found');

        const vehicleIndex = user.licensePlates.findIndex(vehicle => vehicle._id.toString() === req.params.vehicleId);
        if (vehicleIndex === -1) return res.status(404).send('Vehicle not found');

        user.licensePlates.splice(vehicleIndex, 1);
        await user.save();

        res.json({ msg: 'Vehicle deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
