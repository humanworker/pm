const { readFileSync, writeFileSync } = require('fs');
const path = require('path');

// Ensure this path is correct
const balancesFile = path.resolve(__dirname, 'balances.json');

function getBalances() {
    try {
        const balances = JSON.parse(readFileSync(balancesFile, 'utf8'));
        return balances;
    } catch (error) {
        console.error("Error reading balances:", error);
        return { amelie: 0, oscar: 0 };
    }
}

function updateBalance(child, amount, type) {
    const balances = getBalances();

    if (type === 'add') {
        balances[child] += amount;
    } else if (type === 'expense') {
        balances[child] -= amount;
    }

    writeFileSync(balancesFile, JSON.stringify(balances, null, 2));
    return balances;
}

module.exports = {
    getBalances,
    updateBalance,
};
