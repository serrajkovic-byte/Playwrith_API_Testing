import { AUTHORS_ENDPOINT, buildAuthorPayload, KNOWN_AUTHOR_ID } from '../authors/authors-api';

export async function getAuthors(request) {
  return request.get(AUTHORS_ENDPOINT);
}

export async function getAuthorById(request, id = KNOWN_AUTHOR_ID) {
  return request.get(`${AUTHORS_ENDPOINT}/${id}`);
}

export async function createAuthor(request, overrides = {}) {
  const payload = buildAuthorPayload(overrides);
  return request.post(AUTHORS_ENDPOINT, { data: payload });
}

export async function updateAuthor(request, id = KNOWN_AUTHOR_ID, overrides = {}) {
  const payload = buildAuthorPayload({ id, ...overrides });
  return request.put(`${AUTHORS_ENDPOINT}/${id}`, { data: payload });
}

export async function deleteAuthor(request, id = KNOWN_AUTHOR_ID) {
  return request.delete(`${AUTHORS_ENDPOINT}/${id}`);
}
