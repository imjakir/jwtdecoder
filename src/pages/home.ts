import { Page,Locator } from "@playwright/test";

export class HomePage {

    readonly jwtDecoderTab: Locator;
    readonly encodedValueTextArea: Locator;
    readonly DecodedPayload: Locator;
    readonly InvalidSignatureText: Locator;
    readonly SecretInputBox: Locator;
    readonly SignatureVerifiedText: Locator;

  constructor(private page: Page) {
    this.jwtDecoderTab = page.locator('//li[@data-testid="decoder-tab"]');
    this.encodedValueTextArea = page.locator("//*[contains(@class,'npm__react-simple-code-editor__textarea')]");
    this.DecodedPayload = page.locator("//*[@data-testid='decoder__payload__json']");
    this.InvalidSignatureText = page.locator('//*[@data-testid="decoder__jwtEditor___notificationBar__error"]');
    this.SecretInputBox = page.locator("//div[contains(@data-testid,'decoder__se')]/following-sibling::div[1]//textarea");
    this.SignatureVerifiedText = page.locator('//*[@data-testid="decoder__jwtEditor___notificationBar__success"]');
  }

  async navigate() {
    await this.page.goto('/');
  }
  async isJwtDecoderTabActive(): Promise<boolean> {
    const isActive = await this.jwtDecoderTab.getAttribute('data-active');
    return isActive === 'true';
  }
  
  async fillEncodedValue(token: string) {
    await this.encodedValueTextArea.fill(token);
  }

  async fillSecret(secret: string) {
    await this.SecretInputBox.fill(secret);
  }

  async getEncodedValue() {
    return await this.encodedValueTextArea.inputValue();
  }

  async getDecodedPayloadText() {
    return await this.DecodedPayload.textContent();
  }
}