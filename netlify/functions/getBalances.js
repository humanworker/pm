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

exports.handler = async function (event, context) {
    try {
        const balances = await getBalances();
        return {
            statusCode: 200,
            body: JSON.stringify(balances),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
