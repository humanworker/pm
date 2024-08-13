const fetch = require('node-fetch');
const { NETLIFY_API_ID, NETLIFY_API_TOKEN, SITE_ID } = process.env;

exports.handler = async () => {
  try {
    const response = await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}/functions/getBalances`, {
      headers: {
        'Authorization': `Bearer ${NETLIFY_API_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error('Error fetching balances');
    }

    const balances = await response.json();
    console.log("Fetched balances:", balances);

    return {
      statusCode: 200,
      body: JSON.stringify(balances),
    };
  } catch (error) {
    console.error("Error in getBalances function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to retrieve balances' }),
    };
  }
};
