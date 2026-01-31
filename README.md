# IT23172500

This repository contains Playwright end-to-end tests for Singlish-to-Sinhala conversion scenarios.

## Public GitHub Repository

You can access the full project and its history at:

**https://github.com/Dinukaprathi/IT23172500**

## Project Structure

- `tests/` - Contains Playwright test specifications.
- `playwright.config.ts` - Playwright configuration file.
- `playwright-report/` - Generated Playwright HTML reports and data.
- `test-results/` - Output directory for test run results and error contexts.

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm (comes with Node.js)

### Clone the Repository

```
git clone https://github.com/Dinukaprathi/IT23172500.git
cd IT23172500
```

### Install Dependencies

```
npm install
```

### Running Tests

```
npx playwright test
```

### Viewing Reports

After running tests, open the HTML report:

```
npx playwright show-report
```
Or open `playwright-report/index.html` in your browser.

## Notes
- Test results and error contexts are saved in the `test-results/` directory.
- Update or add test cases in `tests/tests.spec.ts`.

## License
This project is for educational purposes.
