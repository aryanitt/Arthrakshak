const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    entity: { type: String, enum: ['personal', 'family', 'business1', 'business2', 'freelancing', 'rental', 'sidehustle'], default: 'personal' },
    paymentMode: { type: String, default: 'UPI' },
    notes: { type: String, default: '' },
    tag: { type: String, default: '' },
    taxDeductible: { type: Boolean, default: false },
    recurring: { type: Boolean, default: false },
    recurringType: { type: String, enum: ['monthly', 'weekly', 'yearly', ''], default: '' },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
