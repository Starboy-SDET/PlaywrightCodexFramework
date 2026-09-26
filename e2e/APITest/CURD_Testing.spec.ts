import { test, expect, APIRequestContext } from '@playwright/test';

let request: APIRequestContext;
let userId: number;

test.beforeAll(async ({ playwright }) => {
  request = await playwright.request.newContext({
    baseURL: 'https://jsonplaceholder.typicode.com',
    extraHTTPHeaders: { 'Content-Type': 'application/json' },
  });
});

test.afterAll(async () => {
  await request.dispose();
});

// ─── CREATE ───────────────────────────────────────────────
test('CREATE - POST /posts', async () => {
  const response = await request.post('/posts', {
    data: {
      title: 'QA Automation Post',
      body: 'Testing CRUD with Playwright',
      userId: 1,
    },
  });

  expect(response.status()).toBe(201);

  const body = await response.json();
  console.log('Created:', body);

  expect(body.title).toBe('QA Automation Post');
  expect(body.id).toBeTruthy();

  userId = body.id;
});

// ─── READ ─────────────────────────────────────────────────
test('READ - GET /posts/:id', async () => {
  const response = await request.get('/posts/1');

  expect(response.status()).toBe(200);

  const body = await response.json();
  console.log('Fetched:', body);

  expect(body.id).toBe(1);
  expect(body.title).toBeTruthy();
});

// ─── READ LIST ────────────────────────────────────────────
test('READ LIST - GET /posts', async () => {
  const response = await request.get('/posts');

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body).toBeInstanceOf(Array);
  expect(body.length).toBeGreaterThan(0);
});

// ─── UPDATE (PUT) ─────────────────────────────────────────
test('UPDATE - PUT /posts/:id', async () => {
  const response = await request.put('/posts/1', {
    data: {
      id: 1,
      title: 'Updated Title',
      body: 'Updated body content',
      userId: 1,
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.title).toBe('Updated Title');
});

// ─── PATCH ────────────────────────────────────────────────
test('PARTIAL UPDATE - PATCH /posts/:id', async () => {
  const response = await request.patch('/posts/1', {
    data: { title: 'Patched Title Only' },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.title).toBe('Patched Title Only');
});

// ─── DELETE ───────────────────────────────────────────────
test('DELETE - DELETE /posts/:id', async () => {
  const response = await request.delete('/posts/1');

  expect(response.status()).toBe(200);   // JSONPlaceholder returns 200 on delete

  const body = await response.json();
  expect(body).toEqual({});              // Returns empty object
});

// ─── NEGATIVE TEST ────────────────────────────────────────
test('READ - Non-existent post returns 404', async () => {
  const response = await request.get('/posts/99999');

  expect(response.status()).toBe(404);
});