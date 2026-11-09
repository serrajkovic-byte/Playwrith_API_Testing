# Online Bookstore API Automation Demo Guide

This guide explains how to set up, extend, run, report, and present this Playwright API automation project. It is written for the repository as it currently exists.

## 1. What is in this repository now

- `tests/api_tests.spec.js`: three Books API checks (list, get by ID, create).
- `playwright.config.js`: HTML reporter and Chromium, Firefox, and WebKit projects.
- `.github/workflows/playwright.yml`: GitHub Actions workflow for push and pull request events.
- `tests/example.spec.js`: two browser UI examples for playwright.dev. They are unrelated to the bookstore API; exclude them from an API-only run or remove them if the deliverable should contain API tests only.
- `package.json`: Playwright dependency is present, but no npm convenience scripts are defined yet.

The assessment emphasizes the Books API test cases. Authors endpoints are in the overview, but not in the specific test case implementation requirement.

## 2. Prerequisites

Install Node.js LTS (includes npm), Git, and an editor such as VS Code. The demo needs network access to `https://fakerestapi.azurewebsites.net`.

Open PowerShell in the repository root:

```powershell
Set-Location 'C:\Playwright_Course\Playwrith_API_Testing'
node --version
npm --version
git status
```

Install dependencies from the lockfile and browser binaries (the latter are used by the existing browser examples and configured projects):

```powershell
npm ci
npx playwright install
```

For Linux CI, install browser system dependencies with `npx playwright install --with-deps`.

## 3. Understand the API before writing checks

Base URL: `https://fakerestapi.azurewebsites.net/api/v1`

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/Books` | List books |
| GET | `/Books/{id}` | Get one book |
| POST | `/Books` | Submit a new book |
| PUT | `/Books/{id}` | Submit an update |
| DELETE | `/Books/{id}` | Submit a delete |

The demo service may behave like a mock and not persist writes between requests. A successful POST/PUT/DELETE response alone does not prove later reads reflect the mutation. Keep create/update/delete assertions centered on the response contract unless you have verified persistence. Do not assume a particular error status for invalid IDs without checking the service's current behavior.

## 4. Recommended implementation sequence

### Step 1 — Make the API base URL configurable

In `playwright.config.js`, set the request base URL under `use`:

```js
use: {
  baseURL: process.env.API_BASE_URL ?? 'https://fakerestapi.azurewebsites.net/api/v1',
  trace: 'on-first-retry',
},
```

Keep the existing `reporter: 'html'`. For an API-only deliverable, remove the browser projects and `tests/example.spec.js`, or use the API project filter shown below. The API request fixture does not require a browser installation.

### Step 2 — Define a reusable test payload

Create a fresh object per test so parallel tests do not share mutable data:

```js
const newBook = () => ({
  id: 0,
  title: 'Demo API Automation Book',
  description: 'Created by the Playwright API demo',
  pageCount: 120,
  excerpt: 'A short test excerpt',
  publishDate: '2026-01-15T00:00:00.000Z',
});
```

### Step 3 — Cover Books CRUD and useful edge checks

The following is a complete example spec. Save as `tests/books_api.spec.js` (or adapt `tests/api_tests.spec.js`). It uses relative routes, so the configured base URL is applied.

```js
const { test, expect } = require('@playwright/test');

const newBook = () => ({
  id: 0,
  title: 'Demo API Automation Book',
  description: 'Created by the Playwright API demo',
  pageCount: 120,
  excerpt: 'A short test excerpt',
  publishDate: '2026-01-15T00:00:00.000Z',
});

test.describe('Books API', () => {
  test('GET /Books returns a non-empty list of books', async ({ request }) => {
    const response = await request.get('/Books');
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
    const response = await request.get('/Books/1');
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
    const response = await request.get('/Books/2147483000');
    // Confirm expected status/body against the live demo API first.
    // Mock services can return a default object for unknown IDs.
    expect([200, 404]).toContain(response.status());
    if (response.status() === 200) console.log('Unknown ID response:', await response.json());
  });

  test('POST /Books accepts a valid book payload', async ({ request }) => {
    const payload = newBook();
    const response = await request.post('/Books', { data: payload });
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
    const response = await request.put('/Books/1', { data: payload });
    expect(response.status()).toBe(200);
    const updated = await response.json();
    expect(updated).toEqual(expect.objectContaining({
      id: 1,
      title: payload.title,
      pageCount: payload.pageCount,
    }));
  });

  test('DELETE /Books/1 accepts a delete request', async ({ request }) => {
    const response = await request.delete('/Books/1');
    expect(response.status()).toBe(200);
  });
});
```

For the unknown ID check, first run the request and observe the service behavior. Replace the exploratory assertion with the exact status and body expectation once verified. For a negative POST test, use an invalid field only if the API documents validation behavior; otherwise the test would invent a contract.

### Step 4 — Add npm scripts

Add these entries to the `scripts` object in `package.json`:

```json
"scripts": {
  "test": "playwright test",
  "test:api": "playwright test tests/api_tests.spec.js",
  "test:headed": "playwright test --headed",
  "report": "playwright show-report"
}
```

If you saved the full example as `tests/books_api.spec.js`, change `test:api` to that path. If the default command should run API tests only, remove the browser examples or narrow the test/project configuration.

## 5. Run the demo locally

```powershell
npm test
npm run test:api
npx playwright test tests/api_tests.spec.js --project=chromium
npx playwright test --list
npm run report
```

The HTML report is generated under `playwright-report/`; raw run artifacts and failure output are under `test-results/`. Both generated folders are ignored by Git. Run a test command before opening the report.

## 6. Suggested live presentation flow

A 5–8 minute walkthrough:

1. **Scope:** “This is a Playwright API suite for the FakeRestAPI Online Bookstore Books endpoints.”
2. **Structure:** show `playwright.config.js`, `tests/api_tests.spec.js`, and `package.json`.
3. **Assertions:** explain that the GET checks verify both HTTP status and JSON response shape.
4. **Run:** execute `npm run test:api` (or `npx playwright test tests/api_tests.spec.js --project=chromium`).
5. **Report:** execute `npm run report` and show case status and duration.
6. **CI:** show `.github/workflows/playwright.yml`; explain the install, test, and report artifact steps.
7. **Limits:** note that the demo API may simulate writes. Do not claim persistence without a follow-up GET proving it.

From a clean checkout:

```powershell
git clone <your-repository-url>
Set-Location <repository-folder>
npm ci
npx playwright install
npm run test:api
npm run report
```

## 7. GitHub Actions CI workflow

The current `.github/workflows/playwright.yml` runs for pushes and pull requests targeting `main` or `master`. It checks out the repo, installs Node and dependencies, installs Playwright browsers, runs tests, and uploads `playwright-report/` as a 30-day artifact, including on test failure unless cancelled.

To present CI:

1. Commit and push the workflow to GitHub.
2. Open the repository's **Actions** tab and select the run started by the push.
3. Show the test step and downloaded `playwright-report` artifact.
4. For failures, inspect the failed test and trace before presenting results.

To make CI run only the API spec, change its test command to:

```yaml
run: npx playwright test tests/api_tests.spec.js
```

## 8. Git and deliverable checklist

Review and commit the source and documentation (not generated reports or dependencies):

```powershell
git status
git add playwright.config.js package.json package-lock.json tests .github/workflows/playwright.yml DEMO_GUIDE.md
git commit -m "Document bookstore API test demo"
git push
```

Before submission, confirm:

- [ ] Setup instructions and exact run commands are documented.
- [ ] Books list, detail, create, update, delete, and a verified edge case are covered.
- [ ] Assertions check status and relevant response data.
- [ ] The HTML report opens after a run.
- [ ] CI runs the intended tests and exposes the report artifact.
- [ ] No secrets or machine-specific paths are committed.
- [ ] The submitted report comes from final code and its result is described accurately.

## 9. Troubleshooting

- **`npm ci` fails:** check Node/npm versions and network access; use the checked-in `package-lock.json`.
- **Browser executable missing:** run `npx playwright install` locally.
- **API request times out or fails:** check network and service availability; the remote service is outside this repository's control.
- **Report does not open:** run tests first, then `npx playwright show-report`.
- **Unexpected status for invalid IDs or writes:** inspect the response body and verify the demo API behavior before changing the test expectation.
- **Browser tests run during an API demo:** use the exact API spec path or remove/relocate `tests/example.spec.js`.

