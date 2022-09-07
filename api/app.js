const express = require('express');

const { validateItems, getTotalCost } = require('./utils');

const app = express();

app.use(express.json());

app.post('/orders/checkout', (request, response) => {
  const items = request.body.items;
  const error = validateItems(items);
  if (error) {
    response.status(400).send({ error });
  } else {
    const total = getTotalCost(items);
    response.send({
      items,
      total,
    });
  }
});

app.listen(8080, () => console.log(`Server is running on port 8080.`));

module.exports.default = app;
