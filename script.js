const WEEKLY_AMOUNT_AMELIE = 11;
const WEEKLY_AMOUNT_OSCAR = 9;
const DAILY_INTEREST_RATE = 1 / 365; // 100% per annum

// Fetch and update balances on page load
async function fetchBalances() {
    try {
        const response = await fetch('/.netlify/functions/getBalances');
        const balances = await response.json();

        amelieBalance = parseFloat(balances.amelieBalance);
        oscarBalance = parseFloat(balances.oscarBalance);

        document.getElementById('amelieBalance').textContent = `$${amelieBalance.toFixed(2)}`;
        document.getElementById('oscarBalance').textContent = `$${oscarBalance.toFixed(2)}`;
    } catch (error) {
        console.error('Error fetching balances:', error);
    }
}

// Update balances after adding money or expense
async function updateBalances(child, amount, type) {
    try {
        const response = await fetch('/.netlify/functions/updateBalances', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ child, amount, type }),
        });

        const updatedBalances = await response.json();
        amelieBalance = parseFloat(updatedBalances.amelieBalance);
        oscarBalance = parseFloat(updatedBalances.oscarBalance);

        document.getElementById('amelieBalance').textContent = `$${amelieBalance.toFixed(2)}`;
        document.getElementById('oscarBalance').textContent = `$${oscarBalance.toFixed(2)}`;
    } catch (error) {
        console.error('Error updating balances:', error);
    }
}

function addExpense(event) {
    event.preventDefault();
    const child = document.getElementById('child').value;
    const amount = parseFloat(document.getElementById('amount').value);

    updateBalances(child, amount, 'expense');
    document.getElementById('expenseForm').reset();
}

function addMoney(event) {
    event.preventDefault();
    const child = document.getElementById('addChild').value;
    const amount = parseFloat(document.getElementById('addAmount').value);

    updateBalances(child, amount, 'add');
    document.getElementById('addMoneyForm').reset();
}

// Event listeners for form submissions
document.getElementById('expenseForm').addEventListener('submit', addExpense);
document.getElementById('addMoneyForm').addEventListener('submit', addMoney);

// Initial balance update
fetchBalances();
