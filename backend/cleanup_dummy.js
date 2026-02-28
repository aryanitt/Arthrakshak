const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');
const dotenv = require('dotenv');
dotenv.config();

async function checkTransactions() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/arth');
    const ts = await Transaction.find({ amount: { $in: [12400, 18200] } });
    console.log('Dummy Transactions found:', ts.length);
    ts.forEach(t => console.log(`ID: ${t._id}, Type: ${t.type}, Amount: ${t.amount}, Title: ${t.title}`));

    if (ts.length > 0) {
        const result = await Transaction.deleteMany({ amount: { $in: [12400, 18200] } });
        console.log('Deleted dummy transactions:', result.deletedCount);
    }

    await mongoose.disconnect();
}

checkTransactions();
