const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Goal = require('./models/Goal');
const Loan = require('./models/Loan');
const Transaction = require('./models/Transaction');
const Setting = require('./models/Setting');
const Expense = require('./models/Expense');
const Budget = require('./models/Budget');

dotenv.config();
connectDB();

// --- GEMINI AI SETUP ---
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// --- TRANSACTION ROUTES ---
app.get('/api/transactions', async (req, res) => {
    try { res.json(await Transaction.find().sort({ date: -1 }).limit(50)); }
    catch (e) { res.status(500).json({ message: e.message }); }
});

app.post('/api/transactions', async (req, res) => {
    try { res.status(201).json(await new Transaction(req.body).save()); }
    catch (e) { res.status(400).json({ message: e.message }); }
});

app.get('/api/financial-summary', async (req, res) => {
    try {
        const { clientDate } = req.query;
        let now = new Date();
        if (clientDate) {
            const [y, m, d] = clientDate.split('-').map(Number);
            now = new Date(y, m - 1, d, 23, 59, 59);
        }

        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        startOfWeek.setDate(now.getDate() - now.getDay());

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

        const transactions = await Transaction.find();
        const activeIncomeSetting = await Setting.findOne({ key: 'fixedActiveIncome' });
        const startingBalanceSetting = await Setting.findOne({ key: 'startingBalance' });
        const fixedMonthlyIncome = activeIncomeSetting ? Number(activeIncomeSetting.value) : 0;
        const startingBalance = startingBalanceSetting ? Number(startingBalanceSetting.value) : 0;

        const calc = (ts) => {
            const s = { active: 0, passive: 0, expense: 0 };
            ts.forEach(t => {
                const amount = Math.abs(t.amount);
                if (t.type === 'active-income') s.active += amount;
                else if (t.type === 'passive-income') s.passive += amount;
                else if (t.type === 'expense' || t.type === 'Expense') s.expense += amount;
            });
            return s;
        };

        const allTimeData = calc(transactions);
        const dayData = calc(transactions.filter(t => new Date(t.date) >= startOfDay));
        const weekData = calc(transactions.filter(t => new Date(t.date) >= startOfWeek));
        const monthData = calc(transactions.filter(t => new Date(t.date) >= startOfMonth));

        if (fixedMonthlyIncome > 0) {
            monthData.active += fixedMonthlyIncome;
            allTimeData.active += fixedMonthlyIncome;
            dayData.active += Math.round(fixedMonthlyIncome / 30);
            weekData.active += Math.round((fixedMonthlyIncome / 30) * 7);
        }

        const summary = {
            today: dayData,
            week: weekData,
            month: monthData,
            allTime: allTimeData,
            startingBalance,
            totalBalance: startingBalance + allTimeData.active + allTimeData.passive - allTimeData.expense
        };
        res.json(summary);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// --- GOAL ROUTES ---
app.get('/api/goals', async (req, res) => { try { res.json(await Goal.find()); } catch (e) { res.status(500).json({ message: e.message }); } });
app.post('/api/goals', async (req, res) => { try { res.status(201).json(await new Goal(req.body).save()); } catch (e) { res.status(400).json({ message: e.message }); } });
app.put('/api/goals/:id/toggle-pin', async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) return res.status(404).json({ message: 'Goal not found' });
        if (!goal.pinned) { const c = await Goal.countDocuments({ pinned: true }); if (c >= 2) return res.status(400).json({ message: 'Max 2 pinned goals.' }); }
        goal.pinned = !goal.pinned;
        res.json(await goal.save());
    } catch (e) { res.status(400).json({ message: e.message }); }
});
app.put('/api/goals/:id/pay', async (req, res) => {
    try {
        const { amount, month } = req.body;
        const goal = await Goal.findById(req.params.id);
        if (!goal) return res.status(404).json({ message: 'Goal not found' });
        goal.currentBalance += Number(amount);
        const idx = goal.contributions.findIndex(c => c.month === month);
        if (idx > -1) { goal.contributions[idx].status = 'done'; goal.contributions[idx].amount = Number(amount); goal.contributions[idx].paidAt = new Date(); }
        else { goal.contributions.push({ month, status: 'done', amount: Number(amount), paidAt: new Date() }); }
        res.json(await goal.save());
    } catch (e) { res.status(400).json({ message: e.message }); }
});
app.put('/api/goals/:id', async (req, res) => { try { res.json(await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (e) { res.status(400).json({ message: e.message }); } });
app.delete('/api/goals/:id', async (req, res) => { try { await Goal.findByIdAndDelete(req.params.id); res.json({ message: 'Goal deleted' }); } catch (e) { res.status(500).json({ message: e.message }); } });

// --- SETTINGS ROUTES ---
app.get('/api/settings/:key', async (req, res) => { try { const s = await Setting.findOne({ key: req.params.key }); if (!s) return res.status(404).json({ message: 'Not found' }); res.json(s); } catch (e) { res.status(500).json({ message: e.message }); } });
app.post('/api/settings/:key', async (req, res) => { try { res.json(await Setting.findOneAndUpdate({ key: req.params.key }, { value: req.body.value }, { new: true, upsert: true })); } catch (e) { res.status(400).json({ message: e.message }); } });

// --- LOAN ROUTES ---
app.get('/api/loans', async (req, res) => { try { res.json(await Loan.find()); } catch (e) { res.status(500).json({ message: e.message }); } });
app.post('/api/loans', async (req, res) => { try { res.status(201).json(await new Loan(req.body).save()); } catch (e) { res.status(400).json({ message: e.message }); } });
app.put('/api/loans/:id/pay', async (req, res) => {
    try {
        const { amount, month } = req.body;
        const loan = await Loan.findById(req.params.id);
        if (!loan) return res.status(404).json({ message: 'Loan not found' });
        loan.outstandingBalance -= Number(amount);
        loan.tenureLeft = Math.max(0, loan.tenureLeft - 1);
        const idx = loan.payments.findIndex(p => p.month === month);
        if (idx > -1) { loan.payments[idx].status = 'done'; loan.payments[idx].amount = Number(amount); loan.payments[idx].paidAt = new Date(); }
        else { loan.payments.push({ month, status: 'done', amount: Number(amount), paidAt: new Date() }); }
        res.json(await loan.save());
    } catch (e) { res.status(400).json({ message: e.message }); }
});
app.put('/api/loans/:id', async (req, res) => { try { res.json(await Loan.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (e) { res.status(400).json({ message: e.message }); } });
app.delete('/api/loans/:id', async (req, res) => { try { await Loan.findByIdAndDelete(req.params.id); res.json({ message: 'Loan deleted' }); } catch (e) { res.status(500).json({ message: e.message }); } });

// --- EXPENSE ROUTES ---
app.get('/api/expenses', async (req, res) => {
    try {
        const filter = {};
        if (req.query.entity) filter.entity = req.query.entity;
        res.json(await Expense.find(filter).sort({ date: -1 }).limit(100));
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// --- BUDGET ROUTES ---
app.get('/api/budgets', async (req, res) => {
    try {
        const filter = {};
        if (req.query.entity) filter.entity = req.query.entity;
        res.json(await Budget.find(filter));
    } catch (e) { res.status(500).json({ message: e.message }); }
});

app.post('/api/budgets', async (req, res) => {
    try {
        const { category, amount, entity = 'personal' } = req.body;
        const budget = await Budget.findOneAndUpdate(
            { category, entity },
            { amount: Number(amount) },
            { new: true, upsert: true }
        );
        res.json(budget);
    } catch (e) { res.status(400).json({ message: e.message }); }
});


app.post('/api/expenses', async (req, res) => {
    console.log('Incoming Expense Request:', req.body);
    try {
        const expenseData = { ...req.body };
        // Basic cleanup if needed
        if (expenseData.amount) expenseData.amount = Number(expenseData.amount);

        const expense = await new Expense(expenseData).save();
        console.log('Expense saved:', expense._id);

        // Create matching transaction
        const transaction = await new Transaction({
            title: expense.notes || expense.category,
            amount: expense.amount,
            type: 'expense',
            category: expense.category,
            entity: expense.entity,
            sourceExpenseId: expense._id,
            date: expense.date
        }).save();
        console.log('Transaction linked:', transaction._id);

        res.status(201).json(expense);
    } catch (e) {
        console.error('ERROR in POST /api/expenses:', e.message);
        res.status(400).json({ message: e.message });
    }
});

app.delete('/api/expenses/:id', async (req, res) => {
    try {
        await Transaction.deleteMany({ sourceExpenseId: req.params.id });
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: 'Expense and linked transaction deleted' });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/expenses/summary/:entity', async (req, res) => {
    try {
        const { entity } = req.params;
        const { period = 'month', clientDate } = req.query;

        // Use client date (YYYY-MM-DD) if provided, to avoid UTC timezone offset issues at midnight
        let now = new Date();
        if (clientDate) {
            const [y, m, d] = clientDate.split('-').map(Number);
            now = new Date(y, m - 1, d, 23, 59, 59); // End of the client's local day
        }

        // Define Start Dates based on period
        let startDate;
        if (period === 'day') {
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        } else if (period === 'week') {
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
            startDate.setDate(now.getDate() - now.getDay());
        } else {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        }

        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // Fetch Current Expenses (filtered by period)
        const currentExp = await Expense.find({ entity, date: { $gte: startDate } });

        // Fetch Last Month Expenses (always month-over-month for analytics)
        const lastMonthExp = await Expense.find({ entity, date: { $gte: startOfLastMonth, $lt: startDate } });

        // Fetch Income for this Entity (filtered by period)
        const currentIncome = await Transaction.find({
            entity,
            type: { $in: ['active-income', 'passive-income'] },
            date: { $gte: startDate }
        });

        // Global Balances (for total balance display)
        const allTransactions = await Transaction.find();
        const startingBalanceSetting = await Setting.findOne({ key: 'startingBalance' });
        const startingBalance = startingBalanceSetting ? Number(startingBalanceSetting.value) : 0;

        let totalIncomeAllTime = 0;
        let totalExpenseAllTime = 0;
        let totalPassiveAllTime = 0;

        allTransactions.forEach(t => {
            if (t.type === 'expense') totalExpenseAllTime += t.amount;
            else if (t.type === 'passive-income') { totalIncomeAllTime += t.amount; totalPassiveAllTime += t.amount; }
            else if (t.type === 'active-income') totalIncomeAllTime += t.amount;
        });

        // Fetch fixed monthly income from settings and apply proportionally to the selected period
        const activeIncomeSetting = await Setting.findOne({ key: 'fixedActiveIncome' });
        const fixedActiveIncome = activeIncomeSetting ? Number(activeIncomeSetting.value) || 0 : 0;

        // Match the Dashboard's global logic: Add fixedActiveIncome to all-time active income
        if (entity === 'personal') {
            totalIncomeAllTime += fixedActiveIncome;
        }

        const totalBalance = startingBalance + totalIncomeAllTime - totalExpenseAllTime;

        // Current Period Stats
        const totalExpense = currentExp.reduce((s, e) => s + e.amount, 0);
        let totalIncome = currentIncome.reduce((s, t) => s + t.amount, 0);
        let activeIncome = currentIncome.filter(t => t.type === 'active-income').reduce((s, t) => s + t.amount, 0);
        const passiveIncome = currentIncome.filter(t => t.type === 'passive-income').reduce((s, t) => s + t.amount, 0);

        // Apportion and add fixedActiveIncome to current period totals to perfectly match Dashboard logic
        if (entity === 'personal' && fixedActiveIncome > 0) {
            let apportionedFixedIncome = fixedActiveIncome; // Defaults to month
            if (period === 'day') apportionedFixedIncome = Math.round(fixedActiveIncome / 30);
            if (period === 'week') apportionedFixedIncome = Math.round((fixedActiveIncome / 30) * 7);

            totalIncome += apportionedFixedIncome;
            activeIncome += apportionedFixedIncome;
        }

        // MoM Analytics
        const lastMonthTotal = lastMonthExp.reduce((s, e) => s + e.amount, 0);
        const momChange = lastMonthTotal > 0 ? (((totalExpense - lastMonthTotal) / lastMonthTotal) * 100).toFixed(1) : '0';

        // Breakdown & Budgets
        const budgets = await Budget.find({ entity });
        const catMap = {};
        const colors = ['#0076F5', '#7C3AED', '#F97316', '#EC4899', '#14B8A6', '#64748B', '#22c55e', '#ef4444'];

        currentExp.forEach(e => { catMap[e.category] = (catMap[e.category] || 0) + e.amount; });

        const catBreakdown = Object.entries(catMap).map(([name, value], i) => {
            const b = budgets.find(bu => bu.category === name);
            return {
                name,
                value,
                color: colors[i % colors.length],
                budget: b ? b.amount : Math.round(value * 1.2) // Fallback to 1.2x if no budget set
            };
        }).sort((a, b) => b.value - a.value);

        // Metrics
        const daysPassed = period === 'day' ? 1 : (period === 'week' ? Math.max(now.getDay(), 1) : Math.max(now.getDate(), 1));
        const dailyAvg = Math.round(totalExpense / daysPassed);
        const utilizationPct = totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0;
        const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;
        const passiveRatio = totalIncome > 0 ? Math.round((passiveIncome / totalIncome) * 100) : 0;
        const fiProgress = totalExpense > 0 ? Math.round((passiveIncome / totalExpense) * 100) : 0;

        // Recent Transactions
        const recentTransactionsRaw = await Transaction.find({ entity }).sort({ date: -1 }).limit(10);
        const recentTransactions = recentTransactionsRaw.map(t => ({
            id: t._id,
            title: t.title,
            amount: t.amount,
            category: t.category,
            date: t.date,
            mode: 'UPI',
            type: t.type
        }));

        const response = {
            totalBalance: totalBalance || 0,
            totalIncome,
            activeIncome: activeIncome || 0,
            passiveIncome: passiveIncome || 0,
            totalExpense,
            lastMonthTotal,
            momChange,
            catBreakdown,
            dailyAvg,
            utilizationPct: utilizationPct || 0,
            savingsRate,
            passiveRatio,
            fiProgress,
            projected: period === 'month' ? Math.round(dailyAvg * 30) : 0,
            topCategory: catBreakdown[0]?.name || 'N/A',
            highestSingle: currentExp.length > 0 ? Math.max(...currentExp.map(e => e.amount)) : 0,
            count: currentExp.length,
            recentTransactions
        };
        console.log(`Summary for ${entity} (${period}):`, { totalBalance: response.totalBalance, exp: response.totalExpense });
        res.json(response);
    } catch (e) { res.status(500).json({ message: e.name + ': ' + e.message }); }
});

// Helper to get all app context for Gemini
async function getAppContext() {
    try {
        const [goals, loans, transactions, expenses, settings] = await Promise.all([
            Goal.find(),
            Loan.find(),
            Transaction.find().sort({ date: -1 }).limit(20),
            Expense.find().sort({ date: -1 }).limit(20),
            Setting.find()
        ]);

        const goalCtx = goals.map(g => `- Goal: ${g.title}, Target: ₹${g.targetAmount}, Current: ₹${g.currentBalance}, Date: ${g.targetDate}, Pinned: ${g.pinned}`).join('\n');
        const loanCtx = loans.map(l => `- Loan: ${l.type} from ${l.lender}, Balance: ₹${l.outstandingBalance}, EMI: ₹${l.emi}, Left: ${l.tenureLeft} months`).join('\n');
        const txCtx = transactions.map(t => `- Tx: ${t.title}, ₹${t.amount}, Type: ${t.type}, Cat: ${t.category}`).join('\n');
        const expCtx = expenses.map(e => `- Exp: ${e.category}, ₹${e.amount}, Entity: ${e.entity}, Note: ${e.notes || 'N/A'}`).join('\n');

        return `
CURRENT FINANCIAL DATA:
--- GOALS ---
${goalCtx || 'No goals set.'}

--- LOANS ---
${loanCtx || 'No loans found.'}

--- RECENT TRANSACTIONS ---
${txCtx || 'No transactions yet.'}

--- RECENT EXPENSE MODULE ENTRIES ---
${expCtx || 'No expenses logged in module.'}
`;
    } catch (e) {
        console.error('Context Error:', e.message);
        return 'Context unavailable.';
    }
}

// --- AI ROUTES ---
app.post('/api/ai/chat', async (req, res) => {
    try {
        const { message, context: uiContext } = req.body;
        const appContext = await getAppContext();

        const systemPrompt = `You are Arth AI, the intelligent core of Arthrakshak Finance App. 
You have FULL ACCESS to the user's financial data provided below. 
Answer questions accurately based on this data. If asked about a specific loan or goal, check the data first.
Be professional, encouraging, and concise. Use ₹ for currency.

${appContext}
USER UI CONTEXT: ${uiContext || 'General'}

Reply in 2-3 sentences max.`;

        const result = await model.generateContent([systemPrompt, message]);
        const response = await result.response;
        res.json({ reply: response.text() });
    } catch (e) {
        console.error('AI Chat Error Details:', {
            message: e.message,
            stack: e.stack,
            cause: e.cause
        });
        res.status(500).json({ reply: 'Arth AI is resting. Please try again later.' });
    }
});

app.post('/api/ai/analyze', async (req, res) => {
    try {
        const { entity } = req.body;
        const appContext = await getAppContext();
        const systemPrompt = `You are a Senior Financial Analyst for Arthrakshak. 
Analyze the user's data and provide 3 actionable, high-impact tips to improve their financial health.
Focus on the ${entity || 'General'} aspect. Use ₹.

${appContext}

Return 3 bullet points. Be concise.`;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        res.json({ analysis: response.text() });
    } catch (e) {
        console.error('AI Analyze Error:', e.message);
        res.status(500).json({ analysis: 'Analysis unavailable.' });
    }
});

app.post('/api/ai/voice-parse', async (req, res) => {
    try {
        const { text } = req.body;
        const systemPrompt = `Parse the following spoken financial entry into a structured JSON object.
Extract: 
- amount (number)
- category (Choose one: Food, Transport, Utilities, Shopping, Health, Entertainment, Education, Rent, EMI, Subscriptions, Salary, Office, Marketing, Tax, Other)
- notes (string)
- date (ISO string, assume "today" if not specified)

Return ONLY valid JSON.
Text: "${text}"`;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const raw = response.text();
        const match = raw.match(/\{[\s\S]*\}/);
        const parsed = match ? JSON.parse(match[0]) : {};

        if (!parsed.date || parsed.date === 'today') parsed.date = new Date().toISOString();
        res.json(parsed);
    } catch (e) {
        console.error('Voice Parse Error:', e.message);
        res.status(500).json({ error: 'Could not parse voice.' });
    }
});

// 404
app.use((req, res) => { res.status(404).json({ message: `Route ${req.method} ${req.url} not found` }); });

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;