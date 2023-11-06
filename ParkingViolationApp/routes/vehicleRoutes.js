// routes/vehicleRoutes.js
const express = require('express');
const User = require('../models/user');
const Vehicle = require('../models/vehicle');
const Violation = require('../models/violation');
const authMiddleware = require('../middleware/authMiddleware');  // Adjust the path as necessary

const router = express.Router();

// Route to add a vehicle
router.post('/addVehicle', authMiddleware, async (req, res) => {
    const { nickName, licensePlate, licenseType, state, user: userId } = req.body;

    console.log('Received request to add vehicle:', req.body);  // Log the request body

    try {
        // Check if a vehicle with the same license plate and user already exists
        const existingVehicle = await Vehicle.findOne({ licensePlate, user: userId });
        if (existingVehicle) {
            console.error('Vehicle already exists:', existingVehicle);  // Log the existing vehicle
            return res.status(400).json({ error: 'You have already added a vehicle with this license plate.' });
        }

        const newVehicle = new Vehicle({ nickName, licensePlate, licenseType, state, user: userId });
        await newVehicle.save();

        // Update User model to include the new vehicle
        const user = await User.findById(userId);
        if (!user) {
            console.error('User not found');  // Log the error
            return res.status(404).json({ error: 'User not found' });
        }
        user.vehicles.push(newVehicle._id);  // Add the new vehicle's ID to the user's vehicle array
        await user.save();

        res.json(newVehicle);
    } catch (error) {
        console.error(error);  // Log any errors that occur
        res.status(500).json({ error: 'Server error' });
    }
});


/// Route to get all vehicles of a user
router.get('/getVehicles', authMiddleware, async (req, res) => {
    const { userId } = req.query;
    console.log('userId:', userId);  // Log the userId to the console

    if (!userId) {
        return res.status(400).send('User ID is required');
    }

    try {
        const vehicles = await Vehicle.find({ user: userId });
        console.log('vehicles:', vehicles);  // Log the result of the query to the console
        
        
            if (vehicles.length === 0) {
                res.json([]);  // Return an empty array if no vehicles found
            } else {
                res.json(vehicles);
            }
    } catch (error) {
        console.error(error);
        res.status(500).send(`Server error: ${error.message}`);
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

// Server-side
router.delete('/deleteVehicle/:vehicleId', authMiddleware, async (req, res) => {
    const { userId } = req.body;

    try {
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) return res.status(404).send('User not found');

        // Find and remove the vehicle from the Vehicle model
        const vehicle = await Vehicle.findOneAndDelete({ _id: req.params.vehicleId, user: userId });
        if (!vehicle) return res.status(404).send('Vehicle not found');

        // Find all violations associated with the vehicle
        const violations = await Violation.find({ vehicle: req.params.vehicleId });
        const violationIds = violations.map(violation => violation._id.toString());

        // Delete all violations associated with the vehicle
        await Violation.deleteMany({ vehicle: req.params.vehicleId });

        // Remove the references to these violations from the user's violations array
        user.violations = user.violations.filter(violation =>
            !violationIds.includes(violation._id.toString())
        );

        // Remove the reference to the vehicle from the user's vehicles array
        user.vehicles = user.vehicles.filter(vehicleId =>
            vehicleId.toString() !== req.params.vehicleId
        );

        await user.save();

        res.json({ msg: 'Vehicle and associated violations deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});





module.exports = router;
