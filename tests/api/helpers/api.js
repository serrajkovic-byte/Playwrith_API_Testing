import { expect } from '@playwright/test';

export function buildUrl(path) {
  return `${path}`;
}

export async function expectJsonObject(response, expectedFields) {
  const body = await response.json();
  expect(body).toEqual(expect.objectContaining(expectedFields));
  return body;
}
