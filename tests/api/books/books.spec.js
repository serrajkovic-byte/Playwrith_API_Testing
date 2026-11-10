import { test, expect } from '@playwright/test';
import { apiFixtures } from '../fixtures/api-fixtures';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from '../requests/books-api-requests';
import { buildBookPayload } from './books-api';

test.describe('Books API', () => {
  test('GET /Books returns a non-empty list with expected fields', async ({ request }) => {
    const response = await getBooks(request);

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
    const response = await getBookById(request, apiFixtures.books.knownId);

    expect(response.status()).toBe(200);

    const book = await response.json();
    expect(book).toEqual(expect.objectContaining({
      id: apiFixtures.books.knownId,
      title: expect.any(String),
      description: expect.any(String),
      pageCount: expect.any(Number),
      excerpt: expect.any(String),
      publishDate: expect.any(String),
    }));
  });

  test('GET /Books/{id} returns 404 for an unknown book ID', async ({ request }) => {
    const response = await getBookById(request, apiFixtures.books.unknownId);

    expect(response.status()).toBe(404);
  });

  test('POST /Books creates a book and returns submitted fields', async ({ request }) => {
    const payload = buildBookPayload();
    const response = await createBook(request, payload);

    expect(response.status()).toBe(200);

    const createdBook = await response.json();
    expect(createdBook).toEqual(expect.objectContaining({
      title: payload.title,
      description: payload.description,
      pageCount: payload.pageCount,
    }));
  });

  test('PUT /Books/{id} updates a book', async ({ request }) => {
    const payload = buildBookPayload({
      id: apiFixtures.books.knownId,
      title: 'Updated Demo Book',
    });

    const response = await updateBook(request, apiFixtures.books.knownId, payload);

    expect(response.status()).toBe(200);

    const updatedBook = await response.json();
    expect(updatedBook).toEqual(expect.objectContaining({
      id: apiFixtures.books.knownId,
      title: payload.title,
      pageCount: payload.pageCount,
    }));
  });

  test('DELETE /Books/{id} accepts a request for an existing book', async ({ request }) => {
    const response = await deleteBook(request, apiFixtures.books.knownId);

    expect(response.status()).toBe(200);
  });
});
