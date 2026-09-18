const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  name: 'banking-deposit', // Or 'deposit' depending on what you named it in host webpack

  exposes: {
    // Change './Component' to './Module' to match your host router expectation
    './Module': './src/app/app.module.ts', // or your specific deposit feature module path
  },

  shared: {
    ...shareAll({ 
      singleton: true, 
      strictVersion: false, 
      requiredVersion: 'auto' 
    }),
  },

});