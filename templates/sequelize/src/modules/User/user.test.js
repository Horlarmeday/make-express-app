/* eslint-disable camelcase */
// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, afterAll, it, expect } from '@jest/globals';
import server from '../../startup/server';

// eslint-disable-next-line import/no-extraneous-dependencies
const request = require('supertest');
const { User } = require('../../database/models');

describe('User Endpoints /users', () => {
  let token;

  afterAll(async () => {
    await User.destroy({ truncate: true, cascade: false });
  });

  it('should create a new user', async () => {
    const res = await request(server)
      .post('/api/users')
      .send({
        firstname: 'Ajao',
        lastname: 'Mahmud',
        phone: '07035120699',
        username: 'mahmud',
        address: 'Kubwa',
        password: '123456',
        email: 'ajao@gmail.com'
      });
    await expect(res.status).toBe(201);
    await expect(res.body).toHaveProperty('data');
    await expect(res.body.data).toHaveProperty('id');
    await expect(res.body.data).toHaveProperty('firstname', 'Ajao');
    await expect(res.body.data).not.toHaveProperty('state');
  }, 10000);

  it('should not allow to create a new user', async () => {
    const res = await request(server)
      .post('/api/users')
      .send({
        firstname: 'Ajao',
        lastname: 'Mahmud',
        phone: '07035120699',
        username: 'mahmud',
        address: 'Kubwa',
        password: '123456',
        email: 'ajao@gmail.com'
      });
    await expect(res.status).toBe(500);
  }, 10000);

  it('should login user', async () => {
    const res = await request(server)
      .post('/api/users/login')
      .send({
        password: '123456',
        username: 'mahmud',
      });
    token = res.body.token;
    await expect(res.status).toBe(200);
    await expect(res.body).toHaveProperty('token');
  }, 10000);
  
  it('should not allow user login', async () => {
    const res = await request(server)
      .post('/api/users/login')
      .send({
        password: '12345',
        email: 'ajao@gmail.com',
      });
    await expect(res.status).toBe(500);
  }, 10000);

  it('should return searched user', async () => {
    const res = await request(server)
      .get('/api/users?currentPage=1&pageLimit=10&search=Mahmud')
      .set('Authorization', `Bearer ${token}`);
    await expect(res.status).toBe(200);
    await expect(res.body.data).toHaveProperty('docs');
    await expect(res.body.data.docs).toHaveLength(1);
    await expect(res.body.data).toHaveProperty('total');
    await expect(res.body.data.total).toBeGreaterThan(0);
  }, 10000);

  it('should return all users', async () => {
    const res = await request(server)
      .get('/api/users?currentPage=1&pageLimit=10')
      .set('Authorization', `Bearer ${token}`);
    await expect(res.status).toBe(200);
    await expect(res.body.data).toHaveProperty('docs');
    await expect(res.body.data).toHaveProperty('total');
    await expect(res.body.data.total).toBeGreaterThan(0);
  }, 10000);
});
