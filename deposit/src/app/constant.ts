export const DEPOSIT_CONSTANTS: Record<string, Record<string, any>> = {
  'deposit-header': {
    title: 'Deposit Portal (Const)',
    subtitle: 'Welcome back, Sarah! Manage your fixed, recurring, and savings investments.',
    statusBadge: 'Active Portfolio'
  },
  'deposit-metrics': {
    totalInvestedLabel: 'TOTAL INVESTED',
    totalInvested: '₹1,25,000.00',
    investedReturn: '+8.4% return p.a.',
    fdLabel: 'FIXED DEPOSITS (FD)',
    fdAmount: '₹1,00,000.00',
    fdSubtext: 'Active FDs: 2 Accounts',
    rdLabel: 'RECURRING DEPOSITS (RD)',
    rdAmount: '₹25,000.00',
    rdSubtext: 'Active RDs: 1 Account'
  },
  'deposit-actions': {
    bookFdBtn: 'Book Fixed Deposit',
    openRdBtn: 'Open Recurring Deposit',
    savingsTopupBtn: 'Savings Top-up'
  },
  'fd-form-content': {
    formTitle: 'Book New Fixed Deposit',
    amountLabel: 'Principal Investment Amount (₹)',
    tenureLabel: 'Tenure:',
    interestRateLabel: 'Interest Rate',
    maturityLabel: 'Maturity Value',
    submitBtn: 'Confirm & Book FD',
    listTitle: 'Active Fixed Deposits',
    statusText: 'Active'
  },
  'rd-form-content': {
    formTitle: 'Open Recurring Deposit',
    amountLabel: 'Monthly Installment (₹)',
    tenureLabel: 'Tenure:',
    interestRateLabel: 'Interest Rate',
    maturityLabel: 'Total Maturity',
    submitBtn: 'Open Recurring Deposit',
    listTitle: 'Active Recurring Deposits',
    statusText: 'Running'
  },
  'savings-form-content': {
    formTitle: 'Instant Savings Top-up',
    targetAccountLabel: 'Target Account',
    amountLabel: 'Deposit Amount (₹)',
    submitBtn: 'Add Funds',
    listTitle: 'Account Summaries'
  }
};