const { readFileSync, writeFileSync } = require('fs');
const path = require('path');

const balancesFile = path.resolve(__dirname, 'balances.json');

function getBalances() {
    const balances = JSON.parse(readFileSync(balancesFile, 'utf8'));
    return balances;
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
