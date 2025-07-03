import { Page,Locator } from "@playwright/test";

export class HomePage {

    readonly jwtDecoderTab: Locator;
    readonly jwtEncoderTab: Locator;
    readonly encodedValueTextArea: Locator;
    readonly DecodedPayload: Locator;
    readonly DecodedHeader: Locator;
    readonly InvalidSignatureText: Locator;
    readonly SecretInputBoxDecoder: Locator;
    readonly SecretInputBoxEncoder: Locator;
    readonly SignatureVerifiedText: Locator;
    readonly EncoderHeaderTextArea: Locator;
    readonly EncoderPayloadTextArea: Locator;
    readonly EncoderTokenOutput: Locator;

  constructor(private page: Page) {
    this.jwtDecoderTab = page.locator('//li[@data-testid="decoder-tab"]');
    this.jwtEncoderTab = page.locator('//li[@data-testid="encoder-tab"]');
    this.encodedValueTextArea = page.locator("//*[@class='editor_container__oankr']/textarea");
    this.DecodedPayload = page.locator("//*[@data-testid='decoder__payload__json']");
    this.DecodedHeader = page.locator("//*[@data-testid='decoder__header__json']");
    this.InvalidSignatureText = page.locator('//*[@data-testid="decoder__jwtEditor___notificationBar__error"]');
    this.SecretInputBoxDecoder = page.locator("//div[contains(@data-testid,'decoder__se')]/following-sibling::div[1]//textarea");
    this.SecretInputBoxEncoder = page.locator("//div[contains(@data-testid,'encoder__se')]/following-sibling::div[1]//textarea");
    this.SignatureVerifiedText = page.locator('//*[@data-testid="decoder__jwtEditor___notificationBar__success"]');
    this.EncoderHeaderTextArea = page.locator("//div[@data-testid='encoder__headerEditor']/div[3]/div/textarea");
    this.EncoderPayloadTextArea = page.locator("//div[@data-testid='encoder__payloadEditor']/div[3]/div/textarea");
    this.EncoderTokenOutput = page.locator("//*[@data-testid='encoder__jwt']/div[2]/div/textarea");
  }

  async navigate() {
    await this.page.goto('/');
  }
  async isJwtDecoderTabActive(): Promise<boolean> {
    const isActive = await this.jwtDecoderTab.getAttribute('data-active');
    return isActive === 'true';
  }

  async isJwtEncoderTabActive() {
    const isActive = await this.jwtEncoderTab.getAttribute('data-active');
    return isActive === 'true';
  }

  async clickJwtDecoderTab() {
    await this.jwtDecoderTab.click();
  }

  async clickJwtEncoderTab() {
    await this.jwtEncoderTab.click();
  }
  
  async fillEncodedValue(token: string) {
    await this.encodedValueTextArea.fill(token);
  }

  async fillSecretDecoder(secret: string) {
    await this.SecretInputBoxDecoder.fill(secret);
  }

  async fillSecretEncoder(secret: string) {
    await this.SecretInputBoxEncoder.fill("");
     await this.SecretInputBoxEncoder.pressSequentially(secret, {delay: 100});
     return await this.SecretInputBoxEncoder.inputValue();
  }

  async getEncodedValue() {
    return await this.encodedValueTextArea.inputValue();
  }

  async getDecodedPayloadText() {
    return await this.DecodedPayload.textContent();
  }

  async fillEncoderHeader(headerJson: string) {
    await this.EncoderHeaderTextArea.fill(headerJson);
  }

  async fillEncoderPayload(payloadJson: string) {
    await this.EncoderPayloadTextArea.fill(payloadJson);
  }

  async getEncoderTokenOutput() {
    return await this.EncoderTokenOutput.inputValue();
  }
}