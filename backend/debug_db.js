const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Expense = require('./models/Expense');
const Transaction = require('./models/Transaction');

async function debug() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const entity = 'personal';
    const now = new Date();
    const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    console.log('Now:', now.toISOString());
    console.log('Start of Day:', startOfDay.toISOString());
    console.log('Start of Month:', startOfMonth.toISOString());

    const expenses = await Expense.find({ entity });
    console.log(`\n--- ALL EXPENSES (${expenses.length}) ---`);
    expenses.forEach(e => console.log(`${e.date.toISOString()} | ${e.category} | ${e.amount} | ${e.notes}`));

    const txs = await Transaction.find({ entity });
    console.log(`\n--- ALL TRANSACTIONS (${txs.length}) ---`);
    txs.forEach(t => console.log(`${t.date.toISOString()} | ${t.type} | ${t.title} | ${t.amount}`));

    const currentExp = await Expense.find({ entity, date: { $gte: startOfDay } });
    console.log(`\n--- DAY EXPENSES (${currentExp.length}) ---`);

    const currentExpMonth = await Expense.find({ entity, date: { $gte: startOfMonth } });
    console.log(`--- MONTH EXPENSES (${currentExpMonth.length}) ---`);

    process.exit();
}

debug();
