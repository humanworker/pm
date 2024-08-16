const fetch = require('node-fetch');

// Hardcoded API details
const apiUrl = 'https://api.netlify.com/api/v1/sites/nfp_roUwmbjKjTtk2SUyoE3GX67ix1Hd62qo611c/files';
const apiToken = '6f07843f-db30-4112-9fc8-7922a0f3a045';

const getBalances = async () => {
    const url = `${apiUrl}/balances.json`;
    console.log(`Fetching balances from: ${url}`);

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${apiToken}`
            }
        });

        if (!response.ok) {
            console.error(`Error response status: ${response.status} ${response.statusText}`);
            throw new Error(`Error fetching balances: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`Balances fetched: ${JSON.stringify(data)}`);
        return data;
    } catch (error) {
        console.error(`Error in getBalances: ${error.message}`);
        throw error;
    }
};

const updateBalance = async (child, amount, type) => {
    try {
        const balances = await getBalances();
        // Update logic for the balance
        if (!balances[child]) {
            balances[child] = 0;
        }
        balances[child] += (type === 'add' ? amount : -amount);

        const url = `${apiUrl}/balances.json`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(balances)
        });

        if (!response.ok) {
            console.error(`Error updating balances: ${response.statusText}`);
            throw new Error(`Error updating balances: ${response.statusText}`);
        }

        console.log(`Balance updated: ${JSON.stringify(balances)}`);
        return balances;
    } catch (error) {
        console.error(`Error in updateBalance: ${error.message}`);
        throw error;
    }
};

exports.handler = async (event, context) => {
    const { child, amount, type } = JSON.parse(event.body);
    console.log(`Received data: ${JSON.stringify({ child, amount, type })}`);

    try {
        const updatedBalances = await updateBalance(child, amount, type);
        return {
            statusCode: 200,
            body: JSON.stringify(updatedBalances),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error updating balances' }),
        };
    }
};
