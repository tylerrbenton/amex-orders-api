const request = require('supertest');

const app = require('./app.js').default;

describe('POST /orders/checkout', () => {
  it('should return correct total', () => {
    return request(app)
      .post('/orders/checkout')
      .send({ items: { apple: 1, orange: 2 } })
      .expect(200)
      .then(response => {
        expect(response.body).toEqual({
          items: {
            apple: 1,
            orange: 2,
          },
          total: 110,
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

  it('should return a total using the "buy one get one free" offer for apples', () => {
    return request(app)
      .post('/orders/checkout')
      .send({ items: { apple: 7 } })
      .expect(200)
      .then(response => {
        expect(response.body).toEqual({
          items: {
            apple: 7,
          },
          total: 240,
        });
      });
  });

  it('should return a total using the "3 for the price of 2" offer for oranges', () => {
    return request(app)
      .post('/orders/checkout')
      .send({ items: { orange: 13 } })
      .expect(200)
      .then(response => {
        expect(response.body).toEqual({
          items: {
            orange: 13,
          },
          total: 225,
        });
      });
  });

  it('should return a total using both promos', () => {
    return request(app)
      .post('/orders/checkout')
      .send({ items: { apple: 5, orange: 17 } })
      .expect(200)
      .then(response => {
        expect(response.body).toEqual({
          items: {
            orange: 17,
            apple: 5,
          },
          total: 480,
        });
      });
  });
});
