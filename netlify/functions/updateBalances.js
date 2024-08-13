const fetch = require('node-fetch');
const { NETLIFY_API_ID, NETLIFY_API_TOKEN, SITE_ID } = process.env;

async function getBalances() {
  console.log("Fetching balances...");
  const response = await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}/functions/getBalances`, {
    headers: {
      'Authorization': `Bearer ${NETLIFY_API_TOKEN}`
    }
  });

  if (!response.ok) {
    console.error("Error fetching balances:", response.statusText);
    throw new Error('Error fetching balances');
  }

  const balances = await response.json();
  console.log("Balances fetched:", balances);
  return balances;
}

async function updateBalance(child, amount, type) {
  console.log(`Updating balance for ${child} with ${amount} of type ${type}`);

  const balances = await getBalances();
  
  if (type === 'add') {
    balances[child] += amount;
  } else if (type === 'subtract') {
    balances[child] -= amount;
  }

  console.log("New balances:", balances);

  const response = await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}/functions/updateBalances`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NETLIFY_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(balances)
  });

  if (!response.ok) {
    console.error("Error updating balances:", response.statusText);
    throw new Error('Error updating balances');
  }

  console.log("Balances successfully updated");
}

exports.handler = async (event) => {
  try {
    const { child, amount, type } = JSON.parse(event.body);
    console.log("Received data:", { child, amount, type });

    await updateBalance(child, amount, type);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Balance updated successfully' }),
    };
  } catch (error) {
    console.error("Error in updateBalances function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update balance' }),
    };
  }
};
