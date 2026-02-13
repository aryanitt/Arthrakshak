const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
    title: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    currentBalance: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now },
    targetDate: { type: String, required: true },
    category: { type: String, default: 'other' },
    contributions: [{
        month: { type: String },
        status: { type: String, enum: ['done', 'fail', 'pending'], default: 'pending' },
        amount: { type: Number },
        paidAt: { type: Date }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Goal', GoalSchema);
