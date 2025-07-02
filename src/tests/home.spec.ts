import { test, expect, Page } from '@playwright/test';
import { HomePage } from '../pages/home';
import testData from '../utils/testData.json';

test.describe('JWT Decoder Tests', () => {
  let page: Page;
  let homePage: HomePage;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    homePage = new HomePage(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('EXAMPLE 1: JWT Decoder Test', async () => {
    test.setTimeout(100 * 1000);

    await test.step('Navigate to JWT.io and ensure JWT Decoder is active', async () => {
      await homePage.navigate();
      expect(await homePage.isJwtDecoderTabActive()).toBe(true);
    });

    await test.step('Paste the token and verify payload value', async () => {
      await homePage.fillEncodedValue(testData.jwtToken);
    });

    await test.step('Verify if the value of "c" is 3 in the Decoded Payload', async () => {
      await expect(homePage.DecodedPayload).toContainText('"c": 3');
    });

    await test.step('Verify "Invalid Signature" message', async () => {
      await expect(homePage.InvalidSignatureText).toHaveText('Invalid Signature');
    });
  });

  test('EXAMPLE 2: JWT Decoder with Secret Verification', async () => {
    test.setTimeout(100 * 1000);

    let originalToken: string;

    await test.step('Navigate to JWT.io and ensure JWT Decoder is active', async () => {
      await homePage.navigate();
      expect(await homePage.isJwtDecoderTabActive()).toBe(true);
    });

    await test.step('Paste the token in the Encoded Value text area', async () => {
      await homePage.fillEncodedValue(testData.jwtToken);
      originalToken = await homePage.getEncodedValue();
    });

    await test.step('Verify if  getting "Invalid Signature" above the Encoded Value text area', async () => {
      await expect(homePage.InvalidSignatureText).toHaveText('Invalid Signature');
    });

    await test.step('Paste the secret in the Secret text area', async () => {
      await homePage.fillSecret(testData.secret);
    });

    await test.step('Verify if you are getting "Signature Verified" above the Encoded Value text area', async () => {
      await expect(homePage.SignatureVerifiedText).toHaveText('Signature Verified');
    });

    await test.step('Assert if the token is the same as the one you entered.', async () => {
        const currentToken = await homePage.getEncodedValue();
        expect(currentToken).toBe(originalToken);
    });

    await test.step('Verify if the value of "c" is 3 in the Decoded Payload', async () => {
      await expect(homePage.DecodedPayload).toContainText('"c": 3');
    });

    await test.step('Assert if changing the secret changes the token but the payload remains the same.', async () => {
        const originalPayload = await homePage.getDecodedPayloadText();
        await homePage.fillSecret(testData.newSecret);
        const newToken = await homePage.getEncodedValue();
        expect(newToken).not.toEqual(originalToken);
        const newPayload = await homePage.getDecodedPayloadText();
        expect(newPayload).toEqual(originalPayload);
    });
  });
});