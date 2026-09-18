export interface NavigationLink {
  label: string;
  path: string;
  exact?: boolean;
  iconSvg: string;
}

export interface MetricCard {
  id: string;
  icon: string;
  iconClass: string;
  label: string;
  value: string;
  trendOrSublabel: string;
  isPositiveTrend?: boolean;
}

export interface BannerPromo {
  id: string;
  tag: string;
  title: string;
  description: string;
  buttonText: string;
  serviceName: string;
  serviceFee: number;
  cssClass: string;
  isOutlineButton?: boolean;
}

export const DASHBOARD_CONSTANTS: Record<string, Record<string, any>> = {
  'brand-info': {
    title: 'Global Retail Bank (Const)',
    subtitle: 'Host Shell Portal • Angular 16'
  },
  'user-info': {
    name: 'Sarah Jenkins',
    role: 'Premium Member',
    avatarUrl: 'https://picsum.photos/id/1005/100/100'
  },
  'hero-section': {
    badge: 'Host Shell Portal v16.2',
    welcomeTitle: 'Welcome back, Sarah! 👋',
    description:
      'Manage multi-channel accounts, request instant credit line upgrades, and access integrated financial services securely from a single dashboard',
    ctaCardsText: 'Manage Cards MFE ↗',
    ctaAccountsText: 'View Accounts ↗'
  },
  'card-preview': {
    maskedNumber: '•••• •••• •••• 8842',
    holderLabel: 'CARDHOLDER',
    holderName: 'SARAH JENKINS',
    logo: 'VISA'
  },
  'cart-info': {
    title: '🛒 Banking Requests Basket',
    triggerText: 'Pending Requests',
    emptyMessage: 'No pending banking services added.',
    emptySubtext: 'Select from the available options below to add requests.',
    totalLabel: 'Total Processing Fees:',
    checkoutBtnText: 'Submit Requests'
  },
  'sidebar-info': {
    navHeader: 'Navigation',
    footerText: 'Micro-Frontend Gateway Active'
  },
    'auth-info': {
        title: 'Welcome Back',
        subtitle: 'Please sign in to access your dashboard',
        usernameLabel: 'Username',
        usernamePlaceholder: 'Enter your username',
        passwordLabel: 'Password',
        passwordPlaceholder: 'Enter your password',
        submitButtonText: 'Sign In'
    }

};

export const NAV_LINKS: NavigationLink[] = [
  {
    label: 'Dashboard',
    path: '/',
    exact: true,
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`
  },
  {
    label: 'Account',
    path: '/accounts',
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/></svg>`
  },
  {
    label: 'Deposit',
    path: '/deposit',
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>`
  },
  {
    label: 'Cards',
    path: '/cards',
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`
  },

];

export const FINANCIAL_METRICS: MetricCard[] = [
  {
    id: 'net-worth',
    icon: '💰',
    iconClass: 'green',
    label: 'Total Net Worth',
    value: '10,48,920.50',
    trendOrSublabel: '↑ +3.8% this month',
    isPositiveTrend: true
  },
  {
    id: 'active-cards',
    icon: '💳',
    iconClass: 'blue',
    label: 'Active Cards',
    value: '3 Connected',
    trendOrSublabel: '2 Credit • 1 Debit'
  },
  {
    id: 'reward-points',
    icon: '🎁',
    iconClass: 'purple',
    label: 'Reward Points',
    value: '24,850 PTS',
    trendOrSublabel: 'Value: ~$248.50'
  },
  {
    id: 'security-score',
    icon: '🛡️',
    iconClass: 'orange',
    label: 'Security Score',
    value: '98 / 100',
    trendOrSublabel: '2FA Active',
    isPositiveTrend: true
  }
];

export const PROMO_BANNERS: BannerPromo[] = [
  {
    id: 'titanium-upgrade',
    tag: 'Exclusive Offer',
    title: 'Titanium Rewards Credit Line',
    description: 'Earn 5x bonus points on travel and enjoy zero foreign transaction fees worldwide.',
    buttonText: 'Apply ($15 Processing Fee)',
    serviceName: 'Titanium Rewards Upgrade',
    serviceFee: 15.0,
    cssClass: 'gold-promo'
  },
  {
    id: 'express-checkbook',
    tag: 'Instant Banking',
    title: 'Express Checkbook & Paper Statements',
    description: 'Order printed account statements or physical checks delivered within 48 hours.',
    buttonText: 'Order Checkbook ($5.00)',
    serviceName: 'Express Checkbook Order',
    serviceFee: 5.0,
    cssClass: 'blue-promo',
    isOutlineButton: true
  }
];
