const fetch = require('node-fetch');

const apiUrl = `https://api.netlify.com/api/v1/sites/${process.env.SITE_ID}/files`;
const apiToken = process.env.NETLIFY_API_TOKEN;

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
