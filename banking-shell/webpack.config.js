const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  remotes: {
    // The key name must match what you use in routing
    "banking_accounts": "http://localhost:4201/remoteEntry.js",
    "banking_cards": "http://localhost:4202/remoteEntry.js",
    "banking_deposit": "http://localhost:4203/remoteEntry.js",
  },
  shared: {
    ...shareAll({ 
      singleton: true, 
      strictVersion: false, // Set to false to prevent runtime dependency conflicts and flickering
      requiredVersion: 'auto' 
    }),
  },
});