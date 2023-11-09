const mongoose = require('mongoose');
const User = require('../models/user');
const Vehicle = require('../models/vehicle');
const Violation = require('../models/violation');

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
const usersData = [
  {
    username: 'user1',
    email: 'user1@example.com',
    passwordHash: bcrypt.hashSync('password', 10),
  },
  {
    username: 'user2',
    email: 'user2@example.com',
    passwordHash: bcrypt.hashSync('password', 10),
  },
  {
    username: 'user3',
    email: 'user3@example.com',
    passwordHash: bcrypt.hashSync('password', 10),
  },
  {
    username: 'user4',
    email: 'user4@example.com',
    passwordHash: bcrypt.hashSync('password', 10),
  }
];

const vehiclesData = [
  { nickName: "Black Car", licensePlate: 'KNP1409', licenseType: 'PAS', state: 'NY' },
  { nickName: "White Van", licensePlate: 'JPY7482', licenseType: 'PAS', state: 'NY' },
  { nickName: "White Car", licensePlate: 'KNP1408', licenseType: 'PAS', state: 'NY' },
  { nickName: "Blue Van", licensePlate: 'JPY7483', licenseType: 'PAS', state: 'NY' },
  { nickName: "Green Truck", licensePlate: 'GTR1234', licenseType: 'PAS', state: 'NY' },
];


const seedDatabase = async () => {
  try {
    await User.deleteMany();
    await Vehicle.deleteMany();
    await Violation.deleteMany();

    const [user1, user2, user3, user4] = await User.insertMany(usersData);
    
    const user1VehiclesData = vehiclesData.slice(0, 2).map(vehicle => ({ ...vehicle, user: user1._id }));
    const user2VehiclesData = vehiclesData.slice(2, 4).map(vehicle => ({ ...vehicle, user: user2._id }));
    const user3VehiclesData = vehiclesData.slice(4, 5).map(vehicle => ({ ...vehicle, user: user3._id }));

    const [user1Vehicles, user2Vehicles, user3Vehicles] = await Promise.all([
        Vehicle.insertMany(user1VehiclesData),
        Vehicle.insertMany(user2VehiclesData),
        Vehicle.insertMany(user3VehiclesData)
    ]);
    const violationsData = [
      {
          vehicle: user1Vehicles[0]._id,
          summonsNumber: '123456',
          issueDate: new Date(2023, 0, 10),
          violationTime: '08:30 AM',
          violation: 'Speeding',
          fineAmount: 150,
          penaltyAmount: 25,
          interestAmount: 0,
          reductionAmount: 0,
          paymentAmount: 175,
          amountDue: 0,
          precinct: '19',
          county: 'NY',
          issuingAgency: 'NYPD',
          summonsImage: {
              url: 'https://example.com/summons/123456.jpg',
              description: 'Summons for speeding'
          },
          createdAt: new Date(2023, 0, 10),
          updatedAt: new Date(2023, 0, 10)
      },
      {
          vehicle: user1Vehicles[0]._id,
          summonsNumber: '123457',
          issueDate: new Date(2023, 0, 11),
          violationTime: '09:00 AM',
          violation: 'Red Light',
          fineAmount: 100,
          penaltyAmount: 25,
          interestAmount: 0,
          reductionAmount: 0,
          paymentAmount: 125,
          amountDue: 0,
          precinct: '19',
          county: 'NY',
          issuingAgency: 'NYPD',
          summonsImage: {
              url: 'https://example.com/summons/123457.jpg',
              description: 'Summons for red light violation'
          },
          createdAt: new Date(2023, 0, 11),
          updatedAt: new Date(2023, 0, 11)
      },
      {
          vehicle: user2Vehicles[1]._id,
          summonsNumber: '123458',
          issueDate: new Date(2023, 0, 12),
          violationTime: '08:45 AM',
          violation: 'Speeding',
          fineAmount: 150,
          penaltyAmount: 25,
          interestAmount: 0,
          reductionAmount: 0,
          paymentAmount: 175,
          amountDue: 0,
          precinct: '19',
          county: 'NY',
          issuingAgency: 'NYPD',
          summonsImage: {
              url: 'https://example.com/summons/123458.jpg',
              description: 'Summons for speeding'
          },
          createdAt: new Date(2023, 0, 12),
          updatedAt: new Date(2023, 0, 12)
      },
      {
          vehicle: user2Vehicles[1]._id,
          summonsNumber: '123459',
          issueDate: new Date(2023, 0, 13),
          violationTime: '09:15 AM',
          violation: 'Red Light',
          fineAmount: 100,
          penaltyAmount: 25,
          interestAmount: 0,
          reductionAmount: 0,
          paymentAmount: 125,
          amountDue: 0,
          precinct: '19',
          county: 'NY',
          issuingAgency: 'NYPD',
          summonsImage: {
              url: 'https://example.com/summons/123459.jpg',
              description: 'Summons for red light violation'
          },
          createdAt: new Date(2023, 0, 13),
          updatedAt: new Date(2023, 0, 13)
      },
      {
          vehicle: user3Vehicles[0]._id,
          summonsNumber: '129',
          issueDate: new Date(2023, 0, 13),
          violationTime: '09:15 AM',
          violation: 'Red Light',
          fineAmount: 100,
          penaltyAmount: 25,
          interestAmount: 0,
          reductionAmount: 0,
          paymentAmount: 125,
          amountDue: 0,
          precinct: '19',
          county: 'NY',
          issuingAgency: 'NYPD',
          summonsImage: {
              url: 'https://example.com/summons/123459.jpg',
              description: 'Summons for red light violation'
          },
          createdAt: new Date(2023, 0, 13),
          updatedAt: new Date(2023, 0, 13)
      },
    ];
    // Create violations for the first vehicle of user1 and user2
    const user1ViolationsData = violationsData.slice(0, 2).map(violation => ({ ...violation, vehicle: user1Vehicles[0]._id }));
    const user2ViolationsData = violationsData.slice(2, 4).map(violation => ({ ...violation, vehicle: user2Vehicles[1]._id }));
    const user3ViolationsData = violationsData.slice(4, 5).map(violation => ({ ...violation, vehicle: user3Vehicles[0]._id }));
    
    const [user1Violations, user2Violations, user3Violations] = await Promise.all([
        Violation.insertMany(user1ViolationsData),
        Violation.insertMany(user2ViolationsData),
        Violation.insertMany(user3ViolationsData),
    ]);

    // Update the user documents to reference the created vehicles and violations
    await User.updateOne(
      { _id: user1._id },
      { $set: { vehicles: user1Vehicles.map(vehicle => vehicle._id), violations: user1Violations.map(violation => violation._id) }}
    );
    
    await User.updateOne(
      { _id: user2._id },
      { $set: { vehicles: user2Vehicles.map(vehicle => vehicle._id), violations: user2Violations.map(violation => violation._id) }}
    );
    await User.updateOne(
      { _id: user3._id },
      { $set: { vehicles: user3Vehicles.map(vehicle => vehicle._id), violations: user3Violations.map(violation => violation._id) }}
    );

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Ensure all Promises have resolved before closing the connection
    await mongoose.connection.close();
    console.log('Connection closed');
  }
};

const  DropDatabase = async () => {
  try {
    await User.deleteMany();
    await Vehicle.deleteMany();
    await Violation.deleteMany();
  } catch (error) {

  } finally {
    await mongoose.connection.close();
    console.log('Connection closed');
  }
}

DropDatabase();

