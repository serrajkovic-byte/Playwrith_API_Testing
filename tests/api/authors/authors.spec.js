import { test, expect } from '@playwright/test';
import { apiFixtures } from '../fixtures/api-fixtures';
import {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from '../requests/authors-api-requests';
import { buildAuthorPayload } from './authors-api';

test.describe('Authors API', () => {
  test('GET /Authors returns a non-empty list with expected fields', async ({ request }) => {
    const response = await getAuthors(request);

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
    const response = await getAuthorById(request, apiFixtures.authors.knownId);

    expect(response.status()).toBe(200);

    const author = await response.json();
    expect(author).toEqual(expect.objectContaining({
      id: apiFixtures.authors.knownId,
      idBook: expect.any(Number),
      firstName: expect.any(String),
      lastName: expect.any(String),
    }));
  });

  test('GET /Authors/{id} returns 404 for an unknown author ID', async ({ request }) => {
    const response = await getAuthorById(request, apiFixtures.authors.unknownId);

    expect(response.status()).toBe(404);
  });

  test('POST /Authors creates an author and returns submitted fields', async ({ request }) => {
    const payload = buildAuthorPayload();
    const response = await createAuthor(request, payload);

    expect(response.status()).toBe(200);

    const createdAuthor = await response.json();
    expect(createdAuthor).toEqual(expect.objectContaining({
      idBook: payload.idBook,
      firstName: payload.firstName,
      lastName: payload.lastName,
    }));
  });

  test('PUT /Authors/{id} updates an author', async ({ request }) => {
    const payload = buildAuthorPayload({
      id: apiFixtures.authors.knownId,
      firstName: 'Updated',
      lastName: 'Author',
    });

    const response = await updateAuthor(request, apiFixtures.authors.knownId, payload);

    expect(response.status()).toBe(200);

    const updatedAuthor = await response.json();
    expect(updatedAuthor).toEqual(expect.objectContaining({
      id: apiFixtures.authors.knownId,
      idBook: payload.idBook,
      firstName: payload.firstName,
      lastName: payload.lastName,
    }));
  });

  test('DELETE /Authors/{id} accepts a request for an existing author', async ({ request }) => {
    const response = await deleteAuthor(request, apiFixtures.authors.knownId);

    expect(response.status()).toBe(200);
  });
});
