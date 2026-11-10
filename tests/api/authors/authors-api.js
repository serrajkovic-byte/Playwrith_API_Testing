export const AUTHORS_ENDPOINT = 'Authors';
export const KNOWN_AUTHOR_ID = 1;
export const UNKNOWN_AUTHOR_ID = 2147483000;

export function buildAuthorPayload(overrides = {}) {
  return {
    id: 0,
    idBook: 1,
    firstName: 'Demo',
    lastName: 'Author',
    ...overrides,
  };
}
