const express = require('express');
const axios = require('axios');
const User = require('../models/user'); 
const Vehicle = require('../models/vehicle');
const Violation = require('../models/violation');
const authMiddleware = require('../middleware/authMiddleware');  // Adjust the path as necessary

const router = express.Router();

router.post('/getViolations', authMiddleware, async (req, res) => {
    const { userId } = req.body;

    try {
        const vehicles = await Vehicle.find({ userId });
        const violationsData = [];
        for (const vehicle of vehicles) {
            const { licensePlate, licenseType, state } = vehicle;
            const response = await axios.get(`https://data.cityofnewyork.us/resource/nc67-uf89.json?$where=plate='${licensePlate}' AND license_type='${licenseType}' AND state='${state}'`);
            violationsData.push(...response.data);
        }
        res.json(violationsData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

router.get('/violations', async (req, res) => {
    const { vehicleId } = req.query;
    try {
      let query = {};
      if (vehicleId) {
        query.vehicle = vehicleId; // Assuming 'vehicle' is the field name in the database
      }
      const violations = await Violation.find(query);
      res.json(violations);
    } catch (error) {
      res.status(500).send('Server error');
    }
  });

module.exports = router;
