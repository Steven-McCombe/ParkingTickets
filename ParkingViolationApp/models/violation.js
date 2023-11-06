const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ViolationSchema = new Schema({
    vehicle: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true,
    },
    summonsNumber: {
        type: String,
        required: true,
        unique: true,
    },
    issueDate: {
        type: Date,
        required: true,
    },
    violationTime: String,
    violation: String,
    fineAmount: Number,
    penaltyAmount: Number,
    interestAmount: Number,
    reductionAmount: Number,
    paymentAmount: Number,
    amountDue: Number,
    precinct: String,
    county: String,
    issuingAgency: String,
    summonsImage: {
        url: String,
        description: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
});

const Violation = mongoose.model('Violation', ViolationSchema);

module.exports = Violation;