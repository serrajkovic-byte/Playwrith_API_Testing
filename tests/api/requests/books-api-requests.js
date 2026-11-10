import { BOOKS_ENDPOINT, buildBookPayload, KNOWN_BOOK_ID } from '../books/books-api';

export async function getBooks(request) {
  return request.get(BOOKS_ENDPOINT);
}

export async function getBookById(request, id = KNOWN_BOOK_ID) {
  return request.get(`${BOOKS_ENDPOINT}/${id}`);
}

export async function createBook(request, overrides = {}) {
  const payload = buildBookPayload(overrides);
  return request.post(BOOKS_ENDPOINT, { data: payload });
}

export async function updateBook(request, id = KNOWN_BOOK_ID, overrides = {}) {
  const payload = buildBookPayload({ id, ...overrides });
  return request.put(`${BOOKS_ENDPOINT}/${id}`, { data: payload });
}

export async function deleteBook(request, id = KNOWN_BOOK_ID) {
  return request.delete(`${BOOKS_ENDPOINT}/${id}`);
}
