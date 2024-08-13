const { getBalances } = require('./database');

exports.handler = async (event) => {
    try {
        // Fetch the balances from the persistent data storage
        const balances = await getBalances();
        console.log('Fetched balances:', balances);

        return {
            statusCode: 200,
            body: JSON.stringify(balances),
        };
    } catch (error) {
        console.error('Error fetching balances:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
