const { updateBalance } = require('./database');

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    const { child, amount, type } = JSON.parse(event.body);
    console.log('Received data:', { child, amount, type });

    const balances = await updateBalance(child, amount, type);

    console.log('Updated balances:', balances);

    return {
        statusCode: 200,
        body: JSON.stringify(balances),
    };
};
