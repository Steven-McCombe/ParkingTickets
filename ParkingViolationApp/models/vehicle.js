// models/vehicle.js
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nickName: { type: String, required: true },
    licensePlate: { type: String, required: true },
    licenseType: { type: String, required: true },
    state: { type: String, required: true },
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports = Vehicle;
