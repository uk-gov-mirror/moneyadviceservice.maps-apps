import testData from '@data/pensionTypeData.json';
import { expect, test } from '@lib/test.lib';
import { CheckYourAnswersComponent } from '@pages/components/check-your-answers.component';
import { CommonComponent } from '@pages/components/common-component.component';

const headings = testData.headings;
const titles = testData.titles;

export enum SELECTION {
  Yes = '0',
  No = '1',
  dontKnow = '2',
}
export type SelectionKey = keyof typeof SELECTION;

export enum DATESELECTION {
  date1999 = '0',
  date2000 = '1',
  dontKnow = '2',
}
export type dateSelectionKey = keyof typeof DATESELECTION;

async function progressToResults(
  commonComponent: CommonComponent,
  checkYourAnswersComponent: CheckYourAnswersComponent,
  setUpBy: SelectionKey,
  pensionComeFrom: SelectionKey,
  pensionProvider?: SelectionKey,
  startDate?: dateSelectionKey,
  language: 'en' | 'cy' = 'en',
) {
  const checkYourAnswersTitle =
    language === 'cy' ? titles.checkYourAnswersCy : titles.checkYourAnswers;
  const questionTitles = {
    setUpBy: language === 'cy' ? titles.setUpByCy : titles.setUpBy,
    pensionComeFrom:
      language === 'cy' ? titles.pensionComeFromCy : titles.pensionComeFrom,
    pensionProvider:
      language === 'cy' ? titles.pensionProviderCy : titles.pensionProvider,
    pensionStartDate:
      language === 'cy' ? titles.pensionStartDateCy : titles.pensionStartDate,
  };

  await expect(commonComponent.title).toContainText(questionTitles.setUpBy);
  await commonComponent.getCheckbox(SELECTION[setUpBy]).click();
  await commonComponent.continueButton.click();
  await expect(commonComponent.title).toContainText(
    questionTitles.pensionComeFrom,
  );
  await commonComponent.getCheckbox(SELECTION[pensionComeFrom]).click();
  await commonComponent.continueButton.click();

  if (pensionProvider && startDate != null) {
    await expect(commonComponent.title).toContainText(
      questionTitles.pensionProvider,
    );
    await commonComponent.getCheckbox(SELECTION[pensionProvider]).click();
    await commonComponent.continueButton.click();
    await expect(commonComponent.title).toContainText(
      questionTitles.pensionStartDate,
    );
    await commonComponent.getCheckbox(DATESELECTION[startDate]).click();
    await commonComponent.continueButton.click();
  }
  await expect(commonComponent.title).toContainText(checkYourAnswersTitle);
  await checkYourAnswersComponent.continueButton.click();
}

test.describe('Workplace Pension Calculator', () => {
  test.beforeEach(async ({ commonComponent, setCookieControl }) => {
    await setCookieControl();
    await commonComponent.goto('/en/pension-type/question-1');
  });

  /**
   * @tests 56326 - Shows correct results heading based on answers
   * @tests 54928 AC 1 Test Case 1 : Verify updated defined benefit guidance text is displayed - en
   * @tests 54928 AC 2 Test Case 1 : Verify updated defined benefit guidance text is displayed - Cy
   * @tests 56330 - Shows correct results button based on answers
   */
  test('Should show correct results heading from answers', async ({
    commonComponent,
    checkYourAnswersComponent,
    resultsComponent,
  }) => {
    await progressToResults(
      commonComponent,
      checkYourAnswersComponent,
      'Yes',
      'No',
      'No',
      'date2000',
    );
    await resultsComponent.waitForResultsPage();
    await expect(resultsComponent.heading).toContainText(headings.en[2]);
    await commonComponent.goto('/en/pension-type/question-1');
    await progressToResults(
      commonComponent,
      checkYourAnswersComponent,
      'Yes',
      'No',
      'No',
      'dontKnow',
    );
    await resultsComponent.waitForResultsPage();
    await expect(resultsComponent.heading).toContainText(headings.en[1]);
    await commonComponent.goto('/en/pension-type/question-1');
    await progressToResults(
      commonComponent,
      checkYourAnswersComponent,
      'Yes',
      'No',
      'No',
      'date1999',
    );
    await resultsComponent.waitForResultsPage();
    await expect(resultsComponent.heading).toContainText(headings.en[0]);
  });

  test('Should show the updated Welsh defined benefit result heading', async ({
    commonComponent,
    checkYourAnswersComponent,
    resultsComponent,
  }) => {
    await commonComponent.goto('/cy/pension-type/question-1');
    await progressToResults(
      commonComponent,
      checkYourAnswersComponent,
      'Yes',
      'No',
      'No',
      'date1999',
      'cy',
    );
    await resultsComponent.waitForResultsPage(titles.checkYourAnswersCy);
    await expect(resultsComponent.heading).toContainText(headings.cy[0]);
  });

  test('Should show correct results button from answers', async ({
    commonComponent,
    checkYourAnswersComponent,
    resultsComponent,
  }) => {
    await progressToResults(
      commonComponent,
      checkYourAnswersComponent,
      'Yes',
      'No',
      'No',
      'dontKnow',
    );
    await expect(resultsComponent.bookAppointmentButton).toBeHidden();
    await commonComponent.goto('/en/pension-type/question-1');

    await progressToResults(
      commonComponent,
      checkYourAnswersComponent,
      'Yes',
      'No',
      'No',
      'date1999',
    );
    await expect(resultsComponent.bookAppointmentButton).toBeHidden();
    await commonComponent.goto('/en/pension-type/question-1');

    await progressToResults(
      commonComponent,
      checkYourAnswersComponent,
      'Yes',
      'Yes',
    );
    await expect(resultsComponent.bookAppointmentButton).toBeHidden();
  });
});
