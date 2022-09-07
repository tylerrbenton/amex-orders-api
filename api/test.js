const request = require('supertest');

const app = require('./app.js').default;

describe('POST /orders/checkout', () => {
  it('should return correct total', () => {
    return request(app)
      .post('/orders/checkout')
      .send({ items: { apple: 3, orange: 7 } })
      .expect(200)
      .then(response => {
        expect(response.body).toEqual({
          items: {
            apple: 3,
            orange: 7,
          },
          total: 355,
        });
      });
  });

  it('should respond with status code `400` and error if no items are sent', () => {
    return request(app)
      .post('/orders/checkout')
      .expect(400)
      .then(response => {
        expect(response.body).toEqual({ error: '`items` is required.' });
      });
  });

  it('should respond with status code `400` and error if item specified is not listed', () => {
    return request(app)
      .post('/orders/checkout')
      .send({ items: { apple: 3, pears: 7 } })
      .expect(400)
      .then(response => {
        expect(response.body).toEqual({ error: '`pears` is not a valid item.' });
      });
  });

  it('should respond with status code `400` and error if item quantity is not a positive number', () => {
    return request(app)
      .post('/orders/checkout')
      .send({ items: { orange: -11 } })
      .expect(400)
      .then(response => {
        expect(response.body).toEqual({ error: 'quantity of `orange` must be one of more.' });
      });
  });
});
