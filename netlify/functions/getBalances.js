const { getBalances, getTransactionLog } = require('./database.js');

exports.handler = async (event, context) => {
  const balances = getBalances();
  const log = getTransactionLog();

  return {
    statusCode: 200,
    body: JSON.stringify({ balances, log })
  };
};
