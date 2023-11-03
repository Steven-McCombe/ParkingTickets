const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/user');
const authRoutes = require('../routes/auth');
const violationRoutes = require('../routes/violations');


const app = express();
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/violations', violationRoutes);

const connectionString = process.env.MONGODB_URI;
console.log(connectionString);  
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
