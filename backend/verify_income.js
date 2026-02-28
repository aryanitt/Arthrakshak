const axios = require('axios');

async function verify() {
    try {
        console.log("Saving fixedActiveIncome setting...");
        await axios.post('http://127.0.0.1:5000/api/settings/fixedActiveIncome', { value: 95000 });

        console.log("Fetching setting to confirm...");
        const settingRes = await axios.get('http://127.0.0.1:5000/api/settings/fixedActiveIncome');
        console.log("Setting value:", settingRes.data.value);

        console.log("Fetching financial summary...");
        const summaryRes = await axios.get('http://127.0.0.1:5000/api/financial-summary');
        console.log("Monthly active income (summary):", summaryRes.data.month.active);

        if (summaryRes.data.month.active >= 95000) {
            console.log("✅ Verification successful! Dashboard stats will reflect the updated income.");
        } else {
            console.log("❌ Verification failed. Summary didn't update as expected.");
        }
    } catch (e) {
        console.error("Error during verification:", e.response ? e.response.data : e.message);
    }
}

verify();
