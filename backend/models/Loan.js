const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
    type: { type: String, required: true },
    lender: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    outstandingBalance: { type: Number, required: true },
    interestRate: { type: String, required: true },
    emi: { type: Number, required: true },
    tenureTotal: { type: Number, required: true },
    tenureLeft: { type: Number, required: true },
    color: { type: String, default: '#0076F5' },
    payments: [{
        month: { type: String },
        status: { type: String, enum: ['done', 'pending'], default: 'pending' },
        amount: { type: Number },
        paidAt: { type: Date }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Loan', LoanSchema);
