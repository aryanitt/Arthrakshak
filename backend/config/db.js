const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    const tryConnect = async () => {
        try {
            const conn = await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 8000,
            });
            console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        } catch (error) {
            console.error(`❌ MongoDB connection failed: ${error.message}`);
            console.error('👉 Fix: Go to MongoDB Atlas → Network Access → Add your current IP address (or 0.0.0.0/0 for dev)');
            console.log('🔄 Retrying connection in 5 seconds...');
            setTimeout(tryConnect, 5000);
        }
    };
    await tryConnect();
};

module.exports = connectDB;
