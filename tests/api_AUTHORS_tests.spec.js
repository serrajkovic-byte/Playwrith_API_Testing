import { test, expect } from '@playwright/test';

const AUTHORS_ENDPOINT = 'Authors';
const KNOWN_AUTHOR_ID = 1;
const UNKNOWN_AUTHOR_ID = 2147483000;

function buildAuthorPayload(overrides = {}) {
  return {
    id: 0,
    idBook: 1,
    firstName: 'Demo',
    lastName: 'Author',
    ...overrides,
  };
}

test.describe('Authors API', () => {
  test('GET /Authors returns a non-empty list with the expected author fields', async ({ request }) => {
    const response = await request.get(AUTHORS_ENDPOINT);

    expect(response.status()).toBe(200);

    const authors = await response.json();
    expect(Array.isArray(authors)).toBe(true);
    expect(authors.length).toBeGreaterThan(0);
    expect(authors[0]).toEqual(expect.objectContaining({
      id: expect.any(Number),
      idBook: expect.any(Number),
      firstName: expect.any(String),
      lastName: expect.any(String),
    }));
  });

  test('GET /Authors/{id} returns the requested author', async ({ request }) => {
    const response = await request.get(`${AUTHORS_ENDPOINT}/${KNOWN_AUTHOR_ID}`);

    expect(response.status()).toBe(200);

    const author = await response.json();
    expect(author).toEqual(expect.objectContaining({
      id: KNOWN_AUTHOR_ID,
      idBook: expect.any(Number),
      firstName: expect.any(String),
      lastName: expect.any(String),
    }));
  });

  test('GET /Authors/{id} returns 404 for an unknown author ID', async ({ request }) => {
    const response = await request.get(`${AUTHORS_ENDPOINT}/${UNKNOWN_AUTHOR_ID}`);

    expect(response.status()).toBe(404);
  });

  test('POST /Authors creates an author and returns its submitted fields', async ({ request }) => {
    const payload = buildAuthorPayload();
    const response = await request.post(AUTHORS_ENDPOINT, { data: payload });

    expect(response.status()).toBe(200);

    const createdAuthor = await response.json();
    expect(createdAuthor).toEqual(expect.objectContaining({
      idBook: payload.idBook,
      firstName: payload.firstName,
      lastName: payload.lastName,
    }));
  });

  test('PUT /Authors/{id} updates an author and returns the submitted fields', async ({ request }) => {
    const payload = buildAuthorPayload({
      id: KNOWN_AUTHOR_ID,
      firstName: 'Updated',
      lastName: 'Author',
    });
    const response = await request.put(
      `${AUTHORS_ENDPOINT}/${KNOWN_AUTHOR_ID}`,
      { data: payload },
    );

    expect(response.status()).toBe(200);

    const updatedAuthor = await response.json();
    expect(updatedAuthor).toEqual(expect.objectContaining({
      id: KNOWN_AUTHOR_ID,
      idBook: payload.idBook,
      firstName: payload.firstName,
      lastName: payload.lastName,
    }));
  });

  test('DELETE /Authors/{id} accepts a request for an existing author', async ({ request }) => {
    const response = await request.delete(`${AUTHORS_ENDPOINT}/${KNOWN_AUTHOR_ID}`);

    expect(response.status()).toBe(200);
  });
});
