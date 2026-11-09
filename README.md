# Bookstore API tests

Playwright API test suite for the Books endpoints of [Fake REST API](https://fakerestapi.azurewebsites.net/). The project uses JavaScript and `@playwright/test`.

## Requirements

- Node.js (LTS recommended) and npm
- Git
- Network access to the API base URL

## Setup

Clone the repository and install the locked dependencies:

```sh
git clone <repository-url>
cd <repository-folder>
npm ci
```

These API tests use Playwright's `request` fixture and do not require browser binaries.

## Run tests and view the report

```sh
npm test                 # Run all tests
npm run test:api          # Run the Books API spec
npx playwright test --list # List discovered tests
npm run report            # Open the HTML report from the latest run
```

The report is generated in `playwright-report/`. Run tests before `npm run report`. Test output is written to `test-results/`. Both folders are excluded from Git.

## Test coverage

`tests/api_tests.spec.js` contains six checks:

- `GET /Books`: successful response, non-empty list, and expected fields
- `GET /Books/1`: successful response and expected book fields
- `GET /Books/{id}`: 404 for an unknown ID
- `POST /Books`: successful response containing submitted fields
- `PUT /Books/1`: successful response containing updated fields
- `DELETE /Books/1`: successful response

Create, update, and delete tests validate the response. They do not claim that the demo service persists changes between requests.

## Configuration

The default API base URL is `https://fakerestapi.azurewebsites.net/api/v1/`, configured in `playwright.config.js`. To use a different compatible API, set `API_BASE_URL` before running the tests.

PowerShell:

```powershell
$env:API_BASE_URL = 'https://example.com/api/v1/'
npm run test:api
```

Bash:

```sh
API_BASE_URL=https://example.com/api/v1/ npm run test:api
```

## Project structure

```text
├── .github/workflows/playwright.yml  # GitHub Actions workflow
├── tests/api_tests.spec.js           # Books API tests
├── playwright.config.js              # Playwright and API configuration
├── package.json                      # Dependencies and npm scripts
└── package-lock.json                 # Locked dependency versions
```

## Continuous integration

The GitHub Actions workflow runs `npx playwright test` on pushes and pull requests targeting `main` or `master`. It installs dependencies and browser binaries, then uploads the HTML report as a 30-day artifact, including when tests fail unless the workflow is cancelled.

## Git deliverable

The project is maintained in Git. Before committing, inspect the changes and status:

```sh
git status
git diff
```

Commit the project source, lockfile, workflow, and documentation. Do not commit `node_modules/`, `playwright-report/`, or `test-results/`; these are listed in `.gitignore`.

## Troubleshooting

- If `npm ci` fails, check that Node.js and npm are installed and that the network is available.
- If requests fail, check connectivity to the API and the configured `API_BASE_URL`.
- If the report is unavailable, run `npm run test:api` first, then `npm run report`.
- If an API response changes, inspect the response and confirm the service behavior before changing an expected status.
