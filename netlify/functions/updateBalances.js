const { updateBalances, getBalances } = require('./database.js');

exports.handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body);
    const { child, amount, action } = body;

    let balances = getBalances();

    if (action === 'add') {
      balances[child] += amount;
    } else if (action === 'subtract') {
      balances[child] -= amount;
    }

    const logEntry = {
      date: new Date().toISOString(),
      description: `${action === 'add' ? 'Added' : 'Spent'} $${amount.toFixed(2)} by ${child.charAt(0).toUpperCase() + child.slice(1)}`
    };

    updateBalances(balances, logEntry);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, balances })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
