let balances = {
    amelie: 0,
    oscar: 0
  };
  
  let transactionLog = [];
  
  function getBalances() {
    return balances;
  }
  
  function updateBalances(newBalances, logEntry) {
    balances = newBalances;
    if (logEntry) {
      transactionLog.push(logEntry);
    }
  }
  
  function getTransactionLog() {
    return transactionLog;
  }
  
  module.exports = { getBalances, updateBalances, getTransactionLog };
  