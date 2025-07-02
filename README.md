# JWT Website Automation Testing

This project is a Playwright automation framework designed to perform end-to-end testing on the JWT.io website. The framework uses TypeScript and follows the Page Object Model architecture for testing JWT token decoding and signature verification functionality.

## Project Setup

To set up the project, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd jwtdecoder
   ```

2. **Install dependencies:**

   Ensure you have Node.js installed on your machine. Then, run the following command to install the necessary dependencies:

   ```bash
   npm ci && npx playwright install chromium
   ```

3. **Configure Playwright:**

   The Playwright configuration is located in `playwright.config.ts`. You can adjust settings such as the test directory, timeout, viewport size, and more.

## Running the Tests

To execute the tests, you can use the following npm scripts defined in `package.json`:

- **Run all tests:**

  This command will run all the tests in headless mode:

  ```bash
  npm test
  ```

- **Run tests in headed mode:**

  If you want to see the browser while the tests are running, use:

  ```bash
  npm run test:headed
  ```

- **Run tests in debug mode:**

  For step-by-step debugging with Playwright inspector:

  ```bash
  npm run test:debug
  ```

- **Run tests with UI mode:**

  Open Playwright's interactive test runner:

  ```bash
  npm run test:ui
  ```

- **View the test report:**

  After running tests, you can view the HTML report using:

  ```bash
  npm run test:report
  ```

## Test Structure

The tests are located in the `src/tests/` directory. The main test file is `home.spec.ts`, which contains a series of steps to automate the JWT decoding and signature verification process on the JWT.io website.

## Additional Information

- **Playwright Version:** The project uses Playwright version `^1.53.2`.
- **TypeScript Support:** The project is set up with TypeScript, and type definitions for Node.js are included.

For more detailed information on Playwright, visit the [official Playwright documentation](https://playwright.dev/docs/intro).

## Author

JAKIR

## License

This project is for educational and testing purposes. Please ensure compliance with JWT.io's terms of service when running these tests.