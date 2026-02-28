const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Goal = require('./models/Goal');
const Loan = require('./models/Loan');
const Transaction = require('./models/Transaction');
const Setting = require('./models/Setting');

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

// --- TRANSACTION ROUTES ---

// Get all transactions
app.get('/api/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ date: -1 }).limit(50);
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a transaction
app.post('/api/transactions', async (req, res) => {
    try {
        const transaction = new Transaction(req.body);
        const savedTransaction = await transaction.save();
        res.status(201).json(savedTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get financial summary
app.get('/api/financial-summary', async (req, res) => {
    try {
        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);

        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const transactions = await Transaction.find();
        const activeIncomeSetting = await Setting.findOne({ key: 'fixedActiveIncome' });
        const startingBalanceSetting = await Setting.findOne({ key: 'startingBalance' });

        const fixedMonthlyIncome = activeIncomeSetting ? Number(activeIncomeSetting.value) : 0;
        const startingBalance = startingBalanceSetting ? Number(startingBalanceSetting.value) : 0;

        const calculateSummary = (ts) => {
            const sum = { active: 0, passive: 0, expense: 0 };
            ts.forEach(t => {
                if (t.type === 'active-income') sum.active += t.amount;
                else if (t.type === 'passive-income') sum.passive += t.amount;
                else if (t.type === 'expense') sum.expense += t.amount;
            });
            return sum;
        };

        const todayTs = transactions.filter(t => new Date(t.date) >= startOfDay);
        const weekTs = transactions.filter(t => new Date(t.date) >= startOfWeek);
        const monthTs = transactions.filter(t => new Date(t.date) >= startOfMonth);
        const allTimeData = calculateSummary(transactions);

        const summary = {
            today: calculateSummary(todayTs),
            week: calculateSummary(weekTs),
            month: calculateSummary(monthTs),
            allTime: allTimeData,
            startingBalance,
            // Total balance = starting balance + all passive income earned - all expenses spent
            totalBalance: startingBalance + allTimeData.passive - allTimeData.expense
        };

        // DISTRIBUTE FIXED INCOME: Today = 1/30, Week = 7/30, Month = 1
        if (fixedMonthlyIncome > 0) {
            summary.today.active += Math.round(fixedMonthlyIncome / 30);
            summary.week.active += Math.round((fixedMonthlyIncome / 30) * 7);
            summary.month.active += fixedMonthlyIncome;
        }

        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
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

// Toggle pin status for a goal
app.put('/api/goals/:id/toggle-pin', async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) return res.status(404).json({ message: 'Goal not found' });

        if (!goal.pinned) {
            const pinnedCount = await Goal.countDocuments({ pinned: true });
            if (pinnedCount >= 2) {
                return res.status(400).json({ message: 'You can only pin up to 2 goals to the dashboard.' });
            }
        }

        goal.pinned = !goal.pinned;
        const savedGoal = await goal.save();
        res.json(savedGoal);
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

// Update a goal
app.put('/api/goals/:id', async (req, res) => {
    try {
        const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedGoal);
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

// --- SETTINGS ROUTES ---

// Get a setting by key
app.get('/api/settings/:key', async (req, res) => {
    try {
        const setting = await Setting.findOne({ key: req.params.key });
        if (!setting) return res.status(404).json({ message: 'Setting not found' });
        res.json(setting);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create or update a setting
app.post('/api/settings/:key', async (req, res) => {
    try {
        const { value } = req.body;
        const setting = await Setting.findOneAndUpdate(
            { key: req.params.key },
            { value },
            { new: true, upsert: true }
        );
        res.json(setting);
    } catch (error) {
        res.status(400).json({ message: error.message });
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

// Update a loan
app.put('/api/loans/:id', async (req, res) => {
    try {
        const updatedLoan = await Loan.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedLoan);
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
