// models/user.js
const mongoose = require('mongoose');

const licensePlateSchema = new mongoose.Schema({
    licensePlate: { type: String, required: true },
    licenseType: { type: String, required: true },
    state: { type: String, required: true }
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    licensePlates: [licensePlateSchema]  // Updated to use the licensePlateSchema
});

module.exports = mongoose.model('User', userSchema);