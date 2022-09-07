const request = require('supertest');

const app = require('./app.js').default;
const database = require('./database');

beforeEach(() => {
  database.clear();
});

describe('POST /orders/new', () => {
  it('should return correct total', () => {
    return request(app)
      .post('/orders/new')
      .send({ items: { apple: 1, orange: 2 } })
      .expect(200)
      .then(response => {
        expect(response.body).toMatchObject({
          items: {
            apple: 1,
            orange: 2,
          },
          total: 110,
          id: expect.any(Number),
        });
      });
  });

  it('should respond with status code `400` and error if no items are sent', () => {
    return request(app)
      .post('/orders/new')
      .expect(400)
      .then(response => {
        expect(response.body).toEqual({ error: '`items` is required.' });
      });
  });

  it('should respond with status code `400` and error if item specified is not listed', () => {
    return request(app)
      .post('/orders/new')
      .send({ items: { apple: 3, pears: 7 } })
      .expect(400)
      .then(response => {
        expect(response.body).toEqual({ error: '`pears` is not a valid item.' });
      });
  });

  it('should respond with status code `400` and error if item quantity is not a positive number', () => {
    return request(app)
      .post('/orders/new')
      .send({ items: { orange: -11 } })
      .expect(400)
      .then(response => {
        expect(response.body).toEqual({ error: 'quantity of `orange` must be one of more.' });
      });
  });

  it('should return a total using the "buy one get one free" offer for apples', () => {
    return request(app)
      .post('/orders/new')
      .send({ items: { apple: 7 } })
      .expect(200)
      .then(response => {
        expect(response.body).toMatchObject({
          items: {
            apple: 7,
          },
          total: 240,
          id: expect.any(Number),
        });
      });
  });

  it('should return a total using the "3 for the price of 2" offer for oranges', () => {
    return request(app)
      .post('/orders/new')
      .send({ items: { orange: 13 } })
      .expect(200)
      .then(response => {
        expect(response.body).toMatchObject({
          items: {
            orange: 13,
          },
          total: 225,
          id: expect.any(Number),
        });
      });
  });

  it('should return a total using both promos', () => {
    return request(app)
      .post('/orders/new')
      .send({ items: { apple: 5, orange: 17 } })
      .expect(200)
      .then(response => {
        expect(response.body).toMatchObject({
          items: {
            orange: 17,
            apple: 5,
          },
          total: 480,
          id: expect.any(Number),
        });
      });
  });
});

describe('GET /orders/:id', () => {
  it('should return order stored in database', () => {
    return request(app)
      .post('/orders/new')
      .send({ items: { apple: 7, orange: 12 } })
      .then(postResponse => {
        return request(app)
          .get(`/orders/${postResponse.body.id}`)
          .expect(200)
          .then(response => {
            expect(response.body).toEqual({
              items: {
                apple: 7,
                orange: 12,
              },
              total: 440,
              id: expect.any(Number),
            });
          });
      });
  });

  it("should return status code `404` when record doesn't exist", () => {
    return request(app)
      .get('/orders/8313')
      .expect(404)
      .then(response => {
        expect(response.body).toEqual({
          error: 'Order `8313` could not be found.',
        });
      });
  });
});

describe('GET /orders/all', () => {
  it('should return an empty array if no records exists', () => {
    return request(app)
      .get('/orders/all')
      .expect(200)
      .then(response => {
        expect(response.body).toEqual([]);
      });
  });

  it('should return all records in database', () => {
    const obj1 = {
      items: {
        orange: 17,
        apple: 5,
      },
      total: 480,
    };
    const obj2 = {
      items: {
        apple: 5,
      },
      total: 180,
    };
    database.set(obj1);
    database.set(obj2);
    return request(app)
      .get('/orders/all')
      .expect(200)
      .then(response => {
        expect(response.body).toEqual(
          expect.arrayContaining([expect.objectContaining(obj1), expect.objectContaining(obj2)])
        );
      });
  });
});
