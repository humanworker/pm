const WEEKLY_AMOUNT_AMELIE = 11;
const WEEKLY_AMOUNT_OSCAR = 9;
const DAILY_INTEREST_RATE = 1 / 365; // 100% per annum

async function fetchBalances() {
  const response = await fetch('/.netlify/functions/getBalances');
  const data = await response.json();
  return data;
}

async function updateBalances(child, amount, action) {
  await fetch('/.netlify/functions/updateBalances', {
    method: 'POST',
    body: JSON.stringify({ child, amount, action })
  });
}

function calculateDailyInterest(balance) {
  return balance * DAILY_INTEREST_RATE;
}

async function initialiseBalances() {
  const data = await fetchBalances();
  let { balances, log } = data;

  const amelieInterest = calculateDailyInterest(balances.amelie);
  const oscarInterest = calculateDailyInterest(balances.oscar);

  document.getElementById('amelieBalance').textContent = `$${balances.amelie.toFixed(2)}`;
  document.getElementById('oscarBalance').textContent = `$${balances.oscar.toFixed(2)}`;
  document.getElementById('amelieInterest').textContent = `Daily Interest: $${amelieInterest.toFixed(2)}`;
  document.getElementById('oscarInterest').textContent = `Daily Interest: $${oscarInterest.toFixed(2)}`;

  updateTransactionLog(log);
}

function updateTransactionLog(log) {
  const logElement = document.getElementById('transactionLog');
  logElement.innerHTML = '';
  const today = new Date();
  const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));

  const filteredLog = log.filter(entry => new Date(entry.date) >= thirtyDaysAgo);

  filteredLog.forEach(entry => {
    const newLogItem = document.createElement('li');
    newLogItem.textContent = `${new Date(entry.date).toLocaleDateString()}: ${entry.description}`;
    logElement.appendChild(newLogItem);
  });
}

document.getElementById('expenseForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const child = document.getElementById('child').value;
  const amount = parseFloat(document.getElementById('amount').value);
  
  await updateBalances(child, amount, 'subtract');
  await initialiseBalances();

  document.getElementById('expenseForm').reset();
});

document.getElementById('addMoneyForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const child = document.getElementById('addChild').value;
  const amount = parseFloat(document.getElementById('addAmount').value);
  
  await updateBalances(child, amount, 'add');
  await initialiseBalances();

  document.getElementById('addMoneyForm').reset();
});

// Initial load
initialiseBalances();
