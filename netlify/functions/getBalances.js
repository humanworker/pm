const { getBalances } = require('./database');

exports.handler = async function() {
    const balances = await getBalances();

    console.log('Retrieved balances:', balances);

    return {
        statusCode: 200,
        body: JSON.stringify(balances),
    };
};
