const fetch = require('node-fetch');

const API_ID = process.env.NETLIFY_API_ID; // Set this in your environment variables
const API_TOKEN = process.env.NETLIFY_API_TOKEN; // Set this in your environment variables
const SITE_ID = process.env.SITE_ID; // Set this in your environment variables

const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_TOKEN}`,
};

const BALANCES_KEY = 'balances';

async function getBalances() {
    const response = await fetch(`https://api.netlify.com/api/v1/accounts/${API_ID}/persistent-disk/${BALANCES_KEY}`, {
        method: 'GET',
        headers,
    });

    if (response.status === 404) {
        return { amelie: 0, oscar: 0 };
    }

    const data = await response.json();
    return data;
}

async function updateBalance(child, amount, type) {
    const balances = await getBalances();

    if (type === 'add') {
        balances[child] += amount;
    } else if (type === 'expense') {
        balances[child] -= amount;
    }

    await fetch(`https://api.netlify.com/api/v1/accounts/${API_ID}/persistent-disk/${BALANCES_KEY}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(balances),
    });

    return balances;
}

module.exports = {
    getBalances,
    updateBalance,
};
