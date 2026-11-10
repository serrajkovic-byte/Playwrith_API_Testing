export const BOOKS_ENDPOINT = 'Books';
export const KNOWN_BOOK_ID = 1;
export const UNKNOWN_BOOK_ID = 2147483000;

export function buildBookPayload(overrides = {}) {
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
