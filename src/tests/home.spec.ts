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
      await homePage.fillSecretDecoder(testData.secret);
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
        await homePage.clickJwtEncoderTab();
        await homePage.fillSecretEncoder(testData.newSecret);
        await homePage.clickJwtDecoderTab();
        const newToken = await homePage.getEncodedValue();
        expect(newToken).not.toEqual(originalToken);
        const newPayload = await homePage.getDecodedPayloadText();
        expect(newPayload).toEqual(originalPayload);
    });
  });

  test('Scenario 1: Verify user can paste a JWT token and see it decoded into header/payload with "Invalid Signature" warning.', async () => {

    await test.step('Navigate to JWT.io and ensure JWT Decoder tab is active', async () => {
      await homePage.navigate();
      expect(await homePage.isJwtDecoderTabActive()).toBe(true);
    });

    await test.step('Paste a valid JWT token in the Encoded Value text area', async () => {
      await homePage.fillEncodedValue(testData.jwtToken);
    });

    await test.step('Verify the decoded header shows correct algorithm (HS256) and type (JWT)', async () => {
      await expect(homePage.DecodedHeader).toContainText('"alg": "HS256"');
      await expect(homePage.DecodedHeader).toContainText('"typ": "JWT"');
    });

    await test.step('Verify the decoded payload contains expected values', async () => {
      await expect(homePage.DecodedPayload).toContainText('"a": 1');
      await expect(homePage.DecodedPayload).toContainText('"b": 2');
      await expect(homePage.DecodedPayload).toContainText('"c": 3');
    });

    await test.step('Assert "Invalid Signature" message appears (without secret)', async () => {
      await expect(homePage.InvalidSignatureText).toHaveText('Invalid Signature');
    });
  });

  test('Scenario 2: Verify user can enter correct secret to change status from "Invalid Signature" to "Signature Verified".', async () => {

    let originalToken: string;

    await test.step('Navigate to JWT.io and ensure JWT Decoder tab is active', async () => {
      await homePage.navigate();
      expect(await homePage.isJwtDecoderTabActive()).toBe(true);
    });

    await test.step('Paste a valid JWT token in the Encoded Value text area', async () => {
      await homePage.fillEncodedValue(testData.jwtToken);
      originalToken = await homePage.getEncodedValue();
    });

    await test.step('Verify "Invalid Signature" message initially appears', async () => {
      await expect(homePage.InvalidSignatureText).toHaveText('Invalid Signature');
    });

    await test.step('Enter the correct secret in the Secret field', async () => {
      await homePage.fillSecretDecoder(testData.secret);
    });

    await test.step('Verify "Signature Verified" message appears', async () => {
      await expect(homePage.SignatureVerifiedText).toHaveText('Signature Verified');
    });

    await test.step('Confirm token remains unchanged', async () => {
      const currentToken = await homePage.getEncodedValue();
      expect(currentToken).toBe(originalToken);
    });

    await test.step('Verify payload values remain consistent', async () => {
      await expect(homePage.DecodedPayload).toContainText('"a": 1');
      await expect(homePage.DecodedPayload).toContainText('"b": 2');
      await expect(homePage.DecodedPayload).toContainText('"c": 3');
    });
  });

  test('Scenario 3: Verify user sees "Invalid Signature" with wrong secrets but can still read decoded content.', async () => {

    await test.step('Navigate to JWT.io and ensure JWT Decoder tab is active', async () => {
      await homePage.navigate();
      expect(await homePage.isJwtDecoderTabActive()).toBe(true);
    });

    await test.step('Paste a valid JWT token in the Encoded Value text area', async () => {
      await homePage.fillEncodedValue(testData.jwtToken);
    });

    await test.step('Enter an incorrect secret in the Secret field', async () => {
      await homePage.fillSecretDecoder(testData.incorrectSecret);
    });

    await test.step('Verify "Invalid Signature" message persists', async () => {
      await expect(homePage.InvalidSignatureText).toHaveText('Invalid Signature');
    });

    await test.step('Try multiple incorrect secrets', async () => {
      await homePage.fillSecretDecoder('anotherwrongsecretanotherwrongsecretanotherwrongsecret');
      await expect(homePage.InvalidSignatureText).toHaveText('Invalid Signature');
      
      await homePage.fillSecretDecoder('yetanotherwrongsecretyetanotherwrongsecretyetanotherwrongsecret');
      await expect(homePage.InvalidSignatureText).toHaveText('Invalid Signature');
    });

    await test.step('Verify payload is still readable despite invalid signature', async () => {
      await expect(homePage.DecodedPayload).toContainText('"a": 1');
      await expect(homePage.DecodedPayload).toContainText('"b": 2');
      await expect(homePage.DecodedPayload).toContainText('"c": 3');
    });

    await test.step('Verify header information remains accessible', async () => {
      await expect(homePage.DecodedHeader).toContainText('"alg": "HS256"');
      await expect(homePage.DecodedHeader).toContainText('"typ": "JWT"');
    });
  });

  test('Scenario 4: JVerify user can create new JWT by entering custom header/payload/secret and decode it successfully.', async () => {

    let generatedToken: string | null;

    await test.step('Navigate to JWT.io and switch to JWT Encoder tab', async () => {
      await homePage.navigate();
      await homePage.clickJwtEncoderTab();
      expect(await homePage.isJwtEncoderTabActive()).toBe(true);
    });

    await test.step('Modify the header JSON (algorithm, type)', async () => {
      await homePage.fillEncoderHeader(JSON.stringify(testData.customHeader, null, 2));
    });

    await test.step('Modify the payload JSON with custom data', async () => {
      await homePage.fillEncoderPayload(JSON.stringify(testData.customPayload, null, 2));
    });

    await test.step('Enter a secret for signing', async () => {
      await homePage.fillSecretEncoder(testData.encoderSecret);
    });

    await test.step('Verify a new JWT token is generated', async () => {
      const tokenOutput = await homePage.getEncoderTokenOutput();
      generatedToken = tokenOutput!; 
      expect(generatedToken.split('.')).toHaveLength(3);
    });

    await test.step('Switch back to Decoder tab', async () => {
      await homePage.clickJwtDecoderTab();
      expect(await homePage.isJwtDecoderTabActive()).toBe(true);
    });

    await test.step('Verify the generated token decodes correctly', async () => {
      await homePage.fillEncodedValue(generatedToken!);
      
      await expect(homePage.DecodedHeader).toContainText('"alg": "HS256"');
      await expect(homePage.DecodedHeader).toContainText('"typ": "JWT"');
      
      await expect(homePage.DecodedPayload).toContainText('"sub": "123456789056"');
      await expect(homePage.DecodedPayload).toContainText('"name": "sumit kumar"');
      await expect(homePage.DecodedPayload).toContainText('"admin": true');
    });

    await test.step('Verify signature is valid with the same secret', async () => {
      await homePage.fillSecretDecoder(testData.encoderSecret);
      await expect(homePage.SignatureVerifiedText).toHaveText('Signature Verified');
    });
  });

  test('Scenario 5: Verify user can modify payload data and see JWT token automatically regenerate with new values.', async () => {

    let initialToken: string | null;
    let modifiedToken: string | null;

    await test.step('Navigate to JWT.io and switch to JWT Encoder tab', async () => {
      await homePage.navigate();
      await homePage.clickJwtEncoderTab();
      expect(await homePage.isJwtEncoderTabActive()).toBe(true);
    });

    await test.step('Enter initial payload data', async () => {
      await homePage.fillEncoderPayload(JSON.stringify(testData.customPayload, null, 2));
    });

    await test.step('Set a secret for signing', async () => {
      await homePage.fillSecretEncoder(testData.encoderSecret);
    });

    await test.step('Note the generated token', async () => {
      const tokenOutput = await homePage.getEncoderTokenOutput();
      initialToken = tokenOutput!;
      expect(initialToken.split('.')).toHaveLength(3);
    });

    await test.step('Modify payload values (add/remove/change fields)', async () => {
      await homePage.fillEncoderPayload(JSON.stringify(testData.modifiedPayload, null, 2));
    });

    await test.step('Verify token changes automatically', async () => {
      const newTokenOutput = await homePage.getEncoderTokenOutput();
      modifiedToken = newTokenOutput!;
      expect(modifiedToken).not.toBe(initialToken);
      expect(modifiedToken.split('.')).toHaveLength(3);
    });

    await test.step('Switch to Decoder tab and verify new payload', async () => {
      await homePage.clickJwtDecoderTab();
      expect(await homePage.isJwtDecoderTabActive()).toBe(true);
      
      await homePage.fillEncodedValue(modifiedToken!);
      
      await expect(homePage.DecodedPayload).toContainText('"sub": "987654321"');
      await expect(homePage.DecodedPayload).toContainText('"name": "Jane Smith"');
      await expect(homePage.DecodedPayload).toContainText('"admin": false');
      await expect(homePage.DecodedPayload).toContainText('"role": "user"');
    });

    await test.step('Confirm signature verification works', async () => {
      await homePage.fillSecretDecoder(testData.encoderSecret);
      await expect(homePage.SignatureVerifiedText).toHaveText('Signature Verified');
    });
  });

  test('Scenario 6: Verify user can switch algorithm from HS256 to HS512 and generate different valid tokens', async () => {

    let hs256Token: string | null;
    let hs512Token: string | null;

    await test.step('Navigate to JWT.io and switch to JWT Encoder tab', async () => {
      await homePage.navigate();
      await homePage.clickJwtEncoderTab();
      expect(await homePage.isJwtEncoderTabActive()).toBe(true);
    });

    await test.step('Create a token with HS256 algorithm', async () => {
      await homePage.fillEncoderHeader(JSON.stringify(testData.customHeader, null, 2));
      await homePage.fillEncoderPayload(JSON.stringify(testData.customPayload, null, 2));
      await homePage.fillSecretEncoder(testData.encoderSecret);
    });

    await test.step('Note the generated token and signature length', async () => {
      const tokenOutput = await homePage.getEncoderTokenOutput();
      hs256Token = tokenOutput!;
      expect(hs256Token.split('.')).toHaveLength(3);
    });

    await test.step('Change algorithm to HS512 in header and  512 bits secret for signing', async () => {
      await homePage.fillEncoderHeader(JSON.stringify(testData.hs512Header, null, 2));
      await homePage.fillSecretEncoder(testData.encoderSecret512);
    });

    await test.step('Verify token regenerates with different signature', async () => {
      const newTokenOutput = await homePage.getEncoderTokenOutput();
      hs512Token = newTokenOutput!;
      expect(hs512Token).not.toBe(hs256Token);
      expect(hs512Token.split('.')).toHaveLength(3);
    });

    await test.step('Test decoding for each algorithm variant', async () => {
      await homePage.clickJwtDecoderTab();
      expect(await homePage.isJwtDecoderTabActive()).toBe(true);
      await homePage.fillEncodedValue(hs256Token!);
      await expect(homePage.DecodedHeader).toContainText('"alg": "HS256"');
      await homePage.fillEncodedValue(hs512Token!);
      await expect(homePage.DecodedHeader).toContainText('"alg": "HS512"');
    });

    await test.step('Verify signature verification works for each', async () => {
      await homePage.fillEncodedValue(hs256Token!);
      await homePage.fillSecretDecoder(testData.encoderSecret);
      await expect(homePage.SignatureVerifiedText).toHaveText('Signature Verified');
      await homePage.fillEncodedValue(hs512Token!);
      await homePage.fillSecretDecoder(testData.encoderSecret512);
      await expect(homePage.SignatureVerifiedText).toHaveText('Signature Verified');
    });
  });

  test('Scenario 7: Verify JWT handles special characters and Unicode in payload data', async () => {

    let generatedToken: string | null;

    await test.step('Navigate to JWT.io and switch to JWT Encoder tab', async () => {
      await homePage.navigate();
      await homePage.clickJwtEncoderTab();
      expect(await homePage.isJwtEncoderTabActive()).toBe(true);
    });

    await test.step('Create payload with special characters (!@#$%^&*)', async () => {
      await homePage.fillEncoderHeader(JSON.stringify(testData.customHeader, null, 2));
      await homePage.fillEncoderPayload(JSON.stringify(testData.specialCharPayload, null, 2));
      await homePage.fillSecretEncoder(testData.encoderSecret);
    });

    await test.step('Generate token and verify encoding', async () => {
      const tokenOutput = await homePage.getEncoderTokenOutput();
      generatedToken = tokenOutput!;
      expect(generatedToken.split('.')).toHaveLength(3);
    });

    await test.step('Switch to Decoder tab and verify decoding', async () => {
      await homePage.clickJwtDecoderTab();
      expect(await homePage.isJwtDecoderTabActive()).toBe(true);
      await homePage.fillEncodedValue(generatedToken!);
    });

    await test.step('Verify Unicode characters are preserved', async () => {
      await expect(homePage.DecodedPayload).toContainText('"name": "José María"');
      await expect(homePage.DecodedPayload).toContainText('"emoji": "🚀✨🎉"');
      await expect(homePage.DecodedPayload).toContainText('"chinese": "你好世界"');
      await expect(homePage.DecodedPayload).toContainText('"arabic": "مرحبا بالعالم"');
    });

    await test.step('Verify special characters are encoded/decoded correctly', async () => {
      await expect(homePage.DecodedPayload).toContainText('"specialChars": "!@#$%^&*()_+-=[]{}|;:,.<>?"');
    });


    await test.step('Verify very long string values are shown in decoded payload', async () => {
      await expect(homePage.DecodedPayload).toContainText('"longString": "This is a very long string');
      await expect(homePage.DecodedPayload).toContainText('encoding and decoding processes"');
    });

    await test.step('Verify signature with secret', async () => {
      await homePage.fillSecretDecoder(testData.encoderSecret);
      await expect(homePage.SignatureVerifiedText).toHaveText('Signature Verified');
    });

  });

  test('Scenario 8: Verify token is not generated when required fields are empty', async () => {
    await test.step('Navigate to JWT.io and switch to JWT Encoder tab', async () => {
      await homePage.navigate();
      await homePage.clickJwtEncoderTab();
      expect(await homePage.isJwtEncoderTabActive()).toBe(true);
    });

    await test.step('Test with empty header - verify no token generated', async () => {
      await homePage.fillEncoderHeader("");
      await homePage.fillEncoderPayload(JSON.stringify(testData.customPayload, null, 2));
      const tokenOutput = await homePage.getEncoderTokenOutput();
      expect(tokenOutput).toBe('');
    });

    await test.step('Test with empty payload - verify no token generated', async () => {
      await homePage.fillEncoderHeader(JSON.stringify(testData.customHeader, null, 2));
      await homePage.fillEncoderPayload('');
      await homePage.fillSecretEncoder(testData.encoderSecret);
      
      const tokenOutput = await homePage.getEncoderTokenOutput();
      expect(tokenOutput).toBe('');
    });

    await test.step('Test with empty secret - verify no token generated', async () => {
      await homePage.fillEncoderHeader(JSON.stringify(testData.customHeader, null, 2));
      await homePage.fillEncoderPayload(JSON.stringify(testData.customPayload, null, 2));
      await homePage.fillSecretEncoder('');
      
      const tokenOutput = await homePage.getEncoderTokenOutput();
      expect(tokenOutput).toBe('');
    });
  });
});