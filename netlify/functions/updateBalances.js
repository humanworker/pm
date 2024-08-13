const { updateBalance } = require('./database');

exports.handler = async (event) => {
    try {
        const { child, amount, type } = JSON.parse(event.body);
        console.log('Received data:', { child, amount, type });

        const updatedBalances = await updateBalance(child, amount, type);
        console.log('Updated balances:', updatedBalances);

        return {
            statusCode: 200,
            body: JSON.stringify(updatedBalances),
        };
    } catch (error) {
        console.error('Error updating balances:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
