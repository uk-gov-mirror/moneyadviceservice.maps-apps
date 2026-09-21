import { type Page, type Locator } from '@maps/playwright';

class CookiesPreferencesSideBanner {
  constructor(private readonly page: Page) {}

  get cookiePolicyLink(): Locator {
    return this.page.getByRole('link', { name: 'Cookie policy' });
  }
}

export default CookiesPreferencesSideBanner;
