const express = require('express');
const database = require('./database');

const { validateItems, getTotalCost } = require('./utils');

const app = express();

app.use(express.json());

app.post('/orders/new', (request, response) => {
  const items = request.body.items;
  const error = validateItems(items);
  if (error) {
    response.status(400).send({ error });
  } else {
    const total = getTotalCost(items);
    const order = database.set({
      items,
      total,
    });
    response.send(order);
  }
});

app.get('/orders/all', (_, response) => {
  const orders = database.getAll();
  response.send(orders);
})

app.get('/orders/:id', (request, response) => {
  const id = request.params.id;
  const order = database.get(id);
  if (order === undefined) {
    response.status(404).send({
      error: `Order \`${id}\` could not be found.`,
    });
  } else {
    response.send(order);
  }
});

app.listen(8080, () => console.log(`Server is running on port 8080.`));

module.exports.default = app;
