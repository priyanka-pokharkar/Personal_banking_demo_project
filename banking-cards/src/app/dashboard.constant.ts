export interface CardsPortalConfig {
  headerTitle: string;
  badgeText: string;
  freezeAllText: string;
  unfreezeAllText: string;
  totalLimitLabel: string;
  totalLimitVal: string;
  availableSpendLabel: string;
  availableSpendVal: string;
  statementDueLabel: string;
  statementDueVal: string;
  statementSubText: string;

  card1Type: string;
  card1Title: string;
  card1Number: string;
  card1Expiry: string;
  card1Cvv: string;
  card1Status: string;

  card2Type: string;
  card2Title: string;
  card2Number: string;
  card2Expiry: string;
  card2Cvv: string;
  card2Status: string;

  card3Type: string;
  card3Title: string;
  card3Number: string;
  card3Expiry: string;
  card3Cvv: string;
  card3Status: string;

  securityTitle: string;
  securitySubtitle: string;
  setting1Title: string;
  setting1Desc: string;
  setting2Title: string;
  setting2Desc: string;
  setting3Title: string;
  setting3Desc: string;
  setting4Title: string;
  setting4Desc: string;
  [key: string]: string;
}

export const DASHBOARD_CONSTANTS: Record<string, CardsPortalConfig> = {
  'cards-portal': {
    headerTitle: '💳 Cards Management Portal(Const)',
    badgeText: 'Secure Portal',
    freezeAllText: 'Freeze All Cards',
    unfreezeAllText: 'Unfreeze All',
    totalLimitLabel: 'Total Credit Limit',
    totalLimitVal: '₹4,50,000.00',
    availableSpendLabel: 'Available Spend',
    availableSpendVal: '₹3,85,240.50',
    statementDueLabel: 'Current Statement Due',
    statementDueVal: '₹12,450.00',
    statementSubText: 'Due by 25th Oct',

    card1Type: 'Platinum Debit',
    card1Title: 'Titanium Rewards Visa',
    card1Number: '•••• •••• •••• 4821',
    card1Expiry: '08/28',
    card1Cvv: '482',
    card1Status: 'Active',

    card2Type: 'Rewards Credit',
    card2Title: 'Preferred Cashback Mastercard',
    card2Number: '•••• •••• •••• 9012',
    card2Expiry: '12/29',
    card2Cvv: '912',
    card2Status: 'Active',

    card3Type: 'Virtual Corporate',
    card3Title: 'Business Platinum Visa',
    card3Number: '•••• •••• •••• 3456',
    card3Expiry: '05/27',
    card3Cvv: '331',
    card3Status: 'Active',

    securityTitle: 'Card Security & Control Settings',
    securitySubtitle: 'Manage transaction channels, international limits, and contactless payments instantly.',
    setting1Title: 'E-Commerce Transactions',
    setting1Desc: 'Enable online purchases and subscriptions',
    setting2Title: 'International Usage',
    setting2Desc: 'Allow transactions outside India',
    setting3Title: 'Contactless / NFC Payments',
    setting3Desc: 'Tap-and-pay at retail terminals',
    setting4Title: 'ATM Cash Withdrawals',
    setting4Desc: 'Enable cash withdrawals at ATMs',
  },
};