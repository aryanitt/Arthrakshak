const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Goal = require('./models/Goal');
const Loan = require('./models/Loan');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Get all goals
app.get('/api/goals', async (req, res) => {
    try {
        const goals = await Goal.find();
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a goal
app.post('/api/goals', async (req, res) => {
    try {
        const goal = new Goal(req.body);
        const savedGoal = await goal.save();
        res.status(201).json(savedGoal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a goal
app.put('/api/goals/:id', async (req, res) => {
    try {
        const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedGoal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Pay towards a goal
app.put('/api/goals/:id/pay', async (req, res) => {
    try {
        const { amount, month } = req.body;
        console.log(`Processing payment for Goal ID: ${req.params.id}, Amount: ${amount}, Month: ${month}`);
        const goal = await Goal.findById(req.params.id);
        if (!goal) {
            console.log(`Goal with ID ${req.params.id} not found in database.`);
            return res.status(404).json({ message: 'Goal not found' });
        }
        console.log(`Goal found: ${goal.title}`);

        goal.currentBalance += Number(amount);

        // Add contribution or update existing pending one for the month
        const existingIdx = goal.contributions.findIndex(c => c.month === month);
        if (existingIdx > -1) {
            goal.contributions[existingIdx].status = 'done';
            goal.contributions[existingIdx].amount = Number(amount);
            goal.contributions[existingIdx].paidAt = new Date();
        } else {
            goal.contributions.push({
                month,
                status: 'done',
                amount: Number(amount),
                paidAt: new Date()
            });
        }

        const savedGoal = await goal.save();
        res.json(savedGoal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a goal
app.delete('/api/goals/:id', async (req, res) => {
    try {
        await Goal.findByIdAndDelete(req.params.id);
        res.json({ message: 'Goal deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- LOAN ROUTES ---

// Get all loans
app.get('/api/loans', async (req, res) => {
    try {
        const loans = await Loan.find();
        res.json(loans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a loan
app.post('/api/loans', async (req, res) => {
    try {
        const loan = new Loan(req.body);
        const savedLoan = await loan.save();
        res.status(201).json(savedLoan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a loan
app.put('/api/loans/:id', async (req, res) => {
    try {
        const updatedLoan = await Loan.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedLoan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Pay EMI for a loan
app.put('/api/loans/:id/pay', async (req, res) => {
    try {
        const { amount, month } = req.body;
        const loan = await Loan.findById(req.params.id);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        loan.outstandingBalance -= Number(amount);
        loan.tenureLeft = Math.max(0, loan.tenureLeft - 1);

        // Add payment or update existing pending one for the month
        const existingIdx = loan.payments.findIndex(p => p.month === month);
        if (existingIdx > -1) {
            loan.payments[existingIdx].status = 'done';
            loan.payments[existingIdx].amount = Number(amount);
            loan.payments[existingIdx].paidAt = new Date();
        } else {
            loan.payments.push({
                month,
                status: 'done',
                amount: Number(amount),
                paidAt: new Date()
            });
        }

        const savedLoan = await loan.save();
        res.json(savedLoan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a loan
app.delete('/api/loans/:id', async (req, res) => {
    try {
        await Loan.findByIdAndDelete(req.params.id);
        res.json({ message: 'Loan deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Catch-all 404 handler
app.use((req, res) => {
    console.log(`404 - Unmatched Request: ${req.method} ${req.url}`);
    res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
