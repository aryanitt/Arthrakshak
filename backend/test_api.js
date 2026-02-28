const axios = require('axios');

async function test() {
    try {
        const res = await axios.post('http://127.0.0.1:5000/api/transactions', {
            title: 'Test Expense',
            amount: 1000,
            type: 'expense',
            category: 'Food'
        });
        console.log('Success:', res.data);
    } catch (e) {
        console.error('Error:', e.response ? e.response.data : e.message);
    }
}

test();
