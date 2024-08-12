const { getBalances } = require('./database');

exports.handler = async function() {
    const balances = await getBalances();

    return {
        statusCode: 200,
        body: JSON.stringify(balances),
    };
};
