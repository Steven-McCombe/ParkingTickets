const mongoose = require('mongoose');
const User = require('../models/user'); 
require('dotenv').config();
const bcrypt = require('bcrypt');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });


// sample data
const users = [
    {
        username: 'user1',
        email: 'user1@example.com',
        passwordHash: bcrypt.hashSync('password', 10),
        licensePlates: [
            { nickName:"Black Car", licensePlate: 'KNP1409', licenseType: 'PAS', state: 'NY' },
            { nickName: "White Van", licensePlate: 'JPY7482', licenseType: 'PAS', state: 'NY' }
        ]
    },
    {
        username: 'user2',
        email: 'user2@example.com',
        passwordHash: bcrypt.hashSync('password', 10),
        licensePlates: [
          { nickName:"White Car", licensePlate: 'KNP1408', licenseType: 'PAS', state: 'NY' },
          { nickName: "Blue Van", licensePlate: 'JPY7483', licenseType: 'PAS', state: 'NY' }
        ]
    },
 
];

// Seed the database
User.insertMany(users)
    .then(() => {
        console.log('Database seeded successfully');
        mongoose.connection.close();
    })
    .catch(error => {
        console.error('Error seeding database:', error);
        mongoose.connection.close();
    });
