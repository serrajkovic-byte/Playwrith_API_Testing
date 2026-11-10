# Bookstore API tests

Playwright API test suite for the Books and Authors endpoints of [Fake REST API](https://fakerestapi.azurewebsites.net/).

## Overview

This repository contains a lightweight API automation framework built with Playwright. The purpose is to validate the public REST contract for the demo bookstore API and keep the suite easy to extend as new resources are added.

The project follows a resource-first structure: each domain (Books, Authors) has its own consolidated spec file, while reusable request helpers, fixtures, and utilities live in dedicated folders.

## Team / collaboration notes

This layout is designed for maintainability in a team environment:

- Resource-specific specs keep the business context close to the behavior under test.
- Request wrappers isolate low-level API calls from the test logic.
- Fixtures centralize IDs, routes, and shared testing values.
- Shared helpers reduce duplication and make assertions consistent across endpoints.

This separation makes it easier for multiple people to work on the same project without mixing test logic, API call wrappers, and fixture data in the same file.

## Resources covered

- Books API
- Authors API

## Quick start

```bash
npm ci
npm run test:api
npm run report
```

## Commands

```bash
npm test            # run all Playwright tests
npm run test:api    # run the API suite under tests/api
npx playwright test --list
npm run report      # open HTML report
```

## Configuration

The default API base URL is configured in `playwright.config.js`:

```js
https://fakerestapi.azurewebsites.net/api/v1/
```

Override it when needed:

```bash
API_BASE_URL=https://example.com/api/v1/ npm run test:api
```

## Project structure

```text
tests/
└── api/
    ├── books/
    │   ├── books-api.js
    │   └── books.spec.js
    ├── authors/
    │   ├── authors-api.js
    │   └── authors.spec.js
    ├── requests/
    │   ├── books-api-requests.js
    │   └── authors-api-requests.js
    ├── fixtures/
    │   └── api-fixtures.js
    └── helpers/
        └── api.js
```

## Structure responsibilities

- `books/` and `authors/`: consolidated end-to-end API tests for each resource
- `requests/`: wrappers around Playwright `request` calls
- `fixtures/`: data used across tests such as known/unknown IDs and endpoint names
- `helpers/`: generic utilities such as URL builders and reusable assertion helpers

## Test coverage

The suite validates the core CRUD flow for both resources:

- GET list
- GET by ID
- GET with unknown ID returns 404
- POST create
- PUT update
- DELETE existing record

This gives a stable baseline for verifying API behavior without coupling tests to UI automation.

## Maintenance guidance

When adding a new resource:

1. Create a new folder under `tests/api/<resource>/`
2. Add a resource payload helper file, for example `resource-api.js`
3. Add a consolidated `resource.spec.js` file containing all CRUD checks
4. Add request wrappers under `tests/api/requests/`
5. Add shared constants/IDs under `tests/api/fixtures/`

This keeps the suite consistent and easy to scale.

## Troubleshooting

- If requests fail, verify the API is reachable and `API_BASE_URL` is correct.
- If a test starts failing after an API contract change, review the response body and update the assertion accordingly.
- If the report is missing, run tests first and then `npm run report`.
