import { test, expect } from '@playwright/test';

const newBook = () => ({
    id: 0,
    title: 'Demo API Automation Book',
    description: 'Created by the Playwright API demo',
    pageCount: 120,
    excerpt: 'A short test excerpt',
    publishDate: '2026-11-15T00:00:00.000Z',
});

test.describe('Books API', () => {
    test('GET /Books returns a non-empty list of books', async ({ request }) => {
        const response = await request.get('Books');
        expect(response.status()).toBe(200);
        const books = await response.json();
        expect(Array.isArray(books)).toBe(true);
        expect(books.length).toBeGreaterThan(0);
        expect(books[0]).toEqual(expect.objectContaining({
            id: expect.any(Number),
            title: expect.any(String),
            pageCount: expect.any(Number),
        }));
    });

    test('GET /Books/1 returns the requested book', async ({ request }) => {
        const response = await request.get('Books/1');
        expect(response.status()).toBe(200);
        const book = await response.json();
        expect(book).toEqual(expect.objectContaining({
            id: 1,
            title: expect.any(String),
            description: expect.any(String),
            pageCount: expect.any(Number),
        }));
    });

    test('GET /Books/{unknown ID} returns a response for a missing book', async ({ request }) => {
        const response = await request.get('Books/2147483000');
        // Confirm expected status/body against the live demo API first.
        // Mock services can return a default object for unknown IDs.
        expect([200, 404]).toContain(response.status());
        if (response.status() === 200) console.log('Unknown ID response:', await response.json());
    });

    test('POST /Books accepts a valid book payload', async ({ request }) => {
        const payload = newBook();
        const response = await request.post('Books', { data: payload });
        expect(response.status()).toBe(200);
        const created = await response.json();
        expect(created).toEqual(expect.objectContaining({
            title: payload.title,
            description: payload.description,
            pageCount: payload.pageCount,
        }));
    });

    test('PUT /Books/1 accepts updated book fields', async ({ request }) => {
        const payload = { ...newBook(), id: 1, title: 'Updated Demo Book' };
        const response = await request.put('Books/1', { data: payload });
        expect(response.status()).toBe(200);
        const updated = await response.json();
        expect(updated).toEqual(expect.objectContaining({
            id: 1,
            title: payload.title,
            pageCount: payload.pageCount,
        }));
    });

    test('DELETE /Books/1 accepts a delete request', async ({ request }) => {
        const response = await request.delete('Books/1');
        expect(response.status()).toBe(200);
    });
});