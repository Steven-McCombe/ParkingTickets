const express = require('express');
const axios = require('axios');
const User = require('../models/user'); 
const Vehicle = require('../models/vehicle');
const Violation = require('../models/violation');
const authMiddleware = require('../middleware/authMiddleware');  // Adjust the path as necessary
const { cleanSummonsImageUrl } = require('../helpers/cleanURL');


const router = express.Router();


// routes/vehicleRoutes.js
router.get('/violations', async (req, res) => {
  const { vehicleId, userId } = req.query;

  // Check if both vehicleId and userId are provided
  if (!vehicleId || !userId) {
    return res.status(400).json({ message: 'Vehicle ID and User ID are required.' });
  }

  try {
    // Fetch violations for the vehicle that belong to the user
    const violations = await Violation.find({ vehicle: vehicleId, user: userId });
    res.json(violations);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


router.post('/addViolations', authMiddleware, async (req, res) => {
  try {
    console.log("Heres the request body",req.body);
    const { violations, userId, vehicleId } = req.body; // Assuming userId and vehicleId are passed in the request body

    if (!violations || !Array.isArray(violations)) {
      return res.status(400).json({ message: 'Invalid violations data' });
    }

    for (const violationData of violations) {
      console.log('User ID:', violationData.user); // Log the user ID
  console.log('Vehicle ID:', violationData.vehicle);
      // Check if violation already exists for the user
      const existingViolation = await Violation.findOne({
        summonsNumber: violationData.summons_number,
        user: userId
        
      });

      if (!existingViolation) {
        // Save new violation if it doesn't exist
        const newViolation = new Violation({
          user: violationData.user,
          vehicle: violationData.vehicle,
          plate: violationData.plate,
          summonsNumber: violationData.summons_number,
          issueDate: violationData.issue_date,
          violationTime: violationData.violation_time,
          violation: violationData.violation,
          fineAmount: violationData.fine_amount,
          penaltyAmount: violationData.penalty_amount,
          interestAmount: violationData.interest_amount,
          reductionAmount: violationData.reduction_amount,
          paymentAmount: violationData.payment_amount,
          amountDue: violationData.amount_due,
          precinct: violationData.precinct,
          county: violationData.county,
          issuingAgency: violationData.issuing_agency,
          summonsImage: {
            url: cleanSummonsImageUrl(violationData.summons_image.url), // Clean the URL before saving
            description: violationData.summons_image.description,
          },
        });

        await newViolation.save();
      }
    }

    res.status(201).json({ message: 'Violations added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// PUT route to update violation status
router.put('/updateViolationStatus/:violationId', authMiddleware, async (req, res) => {
  const { violationId } = req.params;
  const { paymentAmount, amountDue, manuallyUpdated, updatedAt } = req.body;

  if (!violationId) {
    return res.status(400).json({ message: 'Violation ID is required.' });
  }

  try {
    const violation = await Violation.findById(violationId);
    if (!violation) {
      return res.status(404).json({ message: 'Violation not found.' });
    }

    // Update the violation fields
    violation.paymentAmount = paymentAmount;
    violation.amountDue = amountDue;
    violation.manuallyUpdated = manuallyUpdated;
    violation.updatedAt = new Date(updatedAt);

    await violation.save();
    res.json({ message: 'Violation updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// PUT route to undo mark as paid
router.put('/undoMarkAsPaid/:violationId', authMiddleware, async (req, res) => {
  const { violationId } = req.params;

  if (!violationId) {
    return res.status(400).json({ message: 'Violation ID is required.' });
  }

  try {
    const violation = await Violation.findById(violationId);
    if (!violation) {
      return res.status(404).json({ message: 'Violation not found.' });
    }

    // Revert the changes
    violation.amountDue = violation.paymentAmount;
    violation.paymentAmount = 0;
    violation.manuallyUpdated = false;
    await violation.save();

    res.json({ message: 'Violation reverted to unpaid status successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

router.post('/updateMultiple', authMiddleware, async (req, res) => {
  try {
    const { violations, userId, vehicleId } = req.body;
    console.log(vehicleId, "vehicleId");
    // Validate input
    if (!violations || !Array.isArray(violations)) {
      return res.status(400).json({ message: 'Invalid violations data' });
    }

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    let updateResults = {
      success: [],
      failed: []
    };

    // Process each violation
    await Promise.all(violations.map(async (violationData) => {
      try {
        // Map incoming data to schema
        const mappedData = {
          user: userId,
          vehicle: vehicleId,
          summonsNumber: violationData.summons_number,
          issueDate: violationData.issue_date,
          plate: violationData.plate,
          violationTime: violationData.violation_time,
          violation: violationData.violation,
          fineAmount: violationData.fine_amount,
          penaltyAmount: violationData.penalty_amount,
          interestAmount: violationData.interest_amount,
          reductionAmount: violationData.reduction_amount,
          paymentAmount: violationData.payment_amount,
          amountDue: violationData.amount_due,
          precinct: violationData.precinct,
          county: violationData.county,
          issuingAgency: violationData.issuing_agency,
          summonsImage: {
            url: cleanSummonsImageUrl(violationData.summons_image.url), // Clean the URL before saving
            description: violationData.summons_image.description,
          },
        };

        const existingViolation = await Violation.findOne({
          summonsNumber: violationData.summons_number,
          user: userId
        });

        if (existingViolation) {
          console.log(`Updating violation: ${violationData.summons_number}`);
          const updatedViolation = await Violation.findOneAndUpdate(
            { summonsNumber: violationData.summons_number, user: userId },
            { $set: mappedData },
            { new: true }
          );
          updateResults.success.push(updatedViolation);
        } else {
          console.log(`Adding new violation: ${violationData.summons_number}`);
          const newViolation = new Violation({ ...mappedData, user: userId });
          const savedViolation = await newViolation.save();
          updateResults.success.push(savedViolation);
        }
      } catch (innerError) {
        console.error(`Error processing individual violation data: ${violationData.summons_number}`, innerError);
        updateResults.failed.push({ summonsNumber: violationData.summons_number, error: innerError });
      }
    }));

    res.status(200).json({ message: 'Violations processed', results: updateResults });
  } catch (error) {
    console.error('Error processing violations:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
});




module.exports = router;
