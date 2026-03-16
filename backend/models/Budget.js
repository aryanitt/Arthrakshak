const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    entity: { type: String, default: 'personal' },
    limitType: { type: String, enum: ['monthly', 'weekly'], default: 'monthly' }
});

module.exports = mongoose.model('Budget', BudgetSchema);
