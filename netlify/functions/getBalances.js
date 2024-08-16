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

exports.handler = async (event, context) => {
    try {
        const balances = await getBalances();
        return {
            statusCode: 200,
            body: JSON.stringify(balances),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error fetching balances' }),
        };
    }
};
