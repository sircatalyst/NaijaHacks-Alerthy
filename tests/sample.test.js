import supertest from 'supertest';

import app from '../src/createServer';

const request = supertest(app);

describe('Test Endpoints', () => {
  it('should create a new post', async (done) => {
    const res = await request.get('/api/posts');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
    done();
  });
});

test('two plus two is four', () => {
  expect(2 + 2).toBe(4);
});
