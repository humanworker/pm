const fetch = require('node-fetch');

const { NETLIFY_API_TOKEN, SITE_ID } = process.env;

async function getBalances() {
    const response = await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}/environment_variables/balances`, {
        headers: {
            Authorization: `Bearer ${NETLIFY_API_TOKEN}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch balances');
    }

    const balances = await response.json();
    return JSON.parse(balances.value);
}

async function saveBalances(balances) {
    const response = await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}/environment_variables/balances`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${NETLIFY_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: JSON.stringify(balances) }),
    });

    if (!response.ok) {
        throw new Error('Failed to update balances');
    }
}

async function updateBalance(child, amount, type) {
    const balances = await getBalances();

    if (type === 'add') {
        balances[child] += amount;
    } else if (type === 'subtract') {
        balances[child] -= amount;
    }

    await saveBalances(balances);
}

exports.handler = async function (event, context) {
    const { child, amount, type } = JSON.parse(event.body);

    try {
        await updateBalance(child, amount, type);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Balance updated successfully' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
