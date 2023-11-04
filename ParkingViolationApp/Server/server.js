const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' }); 
const User = require('../models/user');
const authRoutes = require('../routes/auth');
const violationRoutes = require('../routes/violations');
const testRoutes = require('../routes/testRoutes');
const vehicleRoutes = require('../routes/vehicleRoutes');

const app = express();
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/violations', violationRoutes);
app.use('/test', testRoutes);
app.use('/vehicles', vehicleRoutes);

const connectionString = process.env.MONGODB_URI;
console.log(connectionString);  

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
