const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ViolationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    vehicle: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true,
    },
    summonsNumber: {
        type: String,
        required: true,
    },
    issueDate: {
        type: Date,
        required: true,
    },
    plate: String,
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
    manuallyUpdated: {
        type: Boolean,
        default: false,
    },
});

const Violation = mongoose.model('Violation', ViolationSchema);

module.exports = Violation;
