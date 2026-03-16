const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['expense', 'active-income', 'passive-income'], required: true },
    category: { type: String },
    entity: { type: String, enum: ['personal', 'family', 'business1', 'business2', 'freelancing', 'rental', 'sidehustle'], default: 'personal' },
    sourceExpenseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expense' },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
