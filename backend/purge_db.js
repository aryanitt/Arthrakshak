const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');
const dotenv = require('dotenv');
dotenv.config();

async function purgeDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/arth');
        const result = await Transaction.deleteMany({});
        console.log(`Deleted ${result.deletedCount} transactions. Database is now clean.`);
    } catch (e) {
        console.error('Purge failed:', e);
    } finally {
        await mongoose.disconnect();
    }
}

purgeDatabase();
