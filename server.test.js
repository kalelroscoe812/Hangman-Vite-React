import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import { app } from './server.js';

const DB_FILE = path.resolve('./data/players.json');

async function resetDb() {
  await fs.mkdir(path.dirname(DB_FILE), { recursive: true });
  await fs.writeFile(DB_FILE, JSON.stringify({}, null, 2), 'utf8');
}

describe('Player API', () => {
  beforeEach(async () => {
    await resetDb();
  });

  it('creates, retrieves, and updates a player', async () => {
    const createResponse = await request(app)
      .post('/api/player')
      .send({ name: 'tester' })
      .expect(201);

    expect(createResponse.body).toEqual({ name: 'TESTER', wins: 0, losses: 0 });

    const getResponse = await request(app)
      .get('/api/player')
      .query({ name: 'tester' })
      .expect(200);

    expect(getResponse.body).toEqual({ name: 'TESTER', wins: 0, losses: 0 });

    const putResponse = await request(app)
      .put('/api/player/TESTER')
      .send({ wins: 1, losses: 2 })
      .expect(200);

    expect(putResponse.body).toEqual({ name: 'TESTER', wins: 1, losses: 2 });
  });
});
