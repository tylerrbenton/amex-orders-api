const { PRODUCTS } = require('./constants.js');

module.exports.getTotalCost = items => {
  let total = 0;
  for (const name in items) {
    const quantity = items[name];
    const info = PRODUCTS[name];
    total += info.price * quantity;
  }
  return total;
};

module.exports.validateItems = items => {
  if (items === undefined) {
    return '`items` is required.';
  }
  for (const name in items) {
    if (PRODUCTS[name] === undefined) {
      return `\`${name}\` is not a valid item.`;
    } else if (items[name] < 1) {
      return `quantity of \`${name}\` must be one of more.`;
    }
  }
  return undefined;
};
