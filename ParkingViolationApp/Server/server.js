const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/users');

const app = express();
app.use(bodyParser.json());

const connectionString = process.env.MONGODB_URI;
console.log(connectionString);  
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/getViolations', async (req, res) => {
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

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
