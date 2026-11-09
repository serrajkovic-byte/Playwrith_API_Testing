import { test, expect } from '@playwright/test';

const BOOKS_ENDPOINT = 'Books';
const KNOWN_BOOK_ID = 1;
const UNKNOWN_BOOK_ID = 2147483000;

function buildBookPayload(overrides = {}) {
  return {
    id: 0,
    title: 'Demo API Automation Book',
    description: 'Created by the Playwright API demo',
    pageCount: 120,
    excerpt: 'A short test excerpt',
    publishDate: '2026-11-15T00:00:00.000Z',
    ...overrides,
  };
}

test.describe('Books API', () => {
  test('GET /Books returns a non-empty list with the expected book fields', async ({ request }) => {
    const response = await request.get(BOOKS_ENDPOINT);

    expect(response.status()).toBe(200);

    const books = await response.json();
    expect(Array.isArray(books)).toBe(true);
    expect(books.length).toBeGreaterThan(0);
    expect(books[0]).toEqual(expect.objectContaining({
      id: expect.any(Number),
      title: expect.any(String),
      description: expect.any(String),
      pageCount: expect.any(Number),
      excerpt: expect.any(String),
      publishDate: expect.any(String),
    }));
  });

  test('GET /Books/{id} returns the requested book', async ({ request }) => {
    const response = await request.get(`${BOOKS_ENDPOINT}/${KNOWN_BOOK_ID}`);

    expect(response.status()).toBe(200);

    const book = await response.json();
    expect(book).toEqual(expect.objectContaining({
      id: KNOWN_BOOK_ID,
      title: expect.any(String),
      description: expect.any(String),
      pageCount: expect.any(Number),
      excerpt: expect.any(String),
      publishDate: expect.any(String),
    }));
  });

  test('GET /Books/{id} returns 404 for an unknown book ID', async ({ request }) => {
    const response = await request.get(`${BOOKS_ENDPOINT}/${UNKNOWN_BOOK_ID}`);

    expect(response.status()).toBe(404);
  });

  test('POST /Books creates a book and returns its submitted fields', async ({ request }) => {
    const payload = buildBookPayload();
    const response = await request.post(BOOKS_ENDPOINT, { data: payload });

    expect(response.status()).toBe(200);

    const createdBook = await response.json();
    expect(createdBook).toEqual(expect.objectContaining({
      title: payload.title,
      description: payload.description,
      pageCount: payload.pageCount,
    }));
  });

  test('PUT /Books/{id} updates a book and returns the submitted fields', async ({ request }) => {
    const payload = buildBookPayload({
      id: KNOWN_BOOK_ID,
      title: 'Updated Demo Book',
    });
    const response = await request.put(
      `${BOOKS_ENDPOINT}/${KNOWN_BOOK_ID}`,
      { data: payload },
    );

    expect(response.status()).toBe(200);

    const updatedBook = await response.json();
    expect(updatedBook).toEqual(expect.objectContaining({
      id: KNOWN_BOOK_ID,
      title: payload.title,
      pageCount: payload.pageCount,
    }));
  });

  test('DELETE /Books/{id} accepts a request for an existing book', async ({ request }) => {
    const response = await request.delete(`${BOOKS_ENDPOINT}/${KNOWN_BOOK_ID}`);

    expect(response.status()).toBe(200);
  });
});

