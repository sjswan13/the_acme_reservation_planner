try {
  const customers = require('./customers/index.js');
  console.log('Customers module loaded successfully:', customers);
} catch (error) {
  console.error('Failed to load customers module:', error);
}
