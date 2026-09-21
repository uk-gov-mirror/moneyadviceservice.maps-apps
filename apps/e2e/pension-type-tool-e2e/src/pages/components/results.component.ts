import { BasePage } from '@pages/Base.page';

export class ResultsComponent extends BasePage {
  get heading() {
    return this.page.getByRole('heading', { level: 1 });
  }

  async waitForResultsPage(checkYourAnswersHeading = 'Check your answers') {
    await this.page
      .getByRole('heading', { level: 1, name: checkYourAnswersHeading })
      .waitFor({ state: 'hidden' });
    await this.heading.waitFor();
  }

  get bookAppointmentButton() {
    return this.page.locator('#pension-appointment-button');
  }
}
