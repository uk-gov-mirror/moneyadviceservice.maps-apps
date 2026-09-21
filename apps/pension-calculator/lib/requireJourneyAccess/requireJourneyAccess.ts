import type { Redirect } from 'next';

import { JOURNEY_PAGES, type JourneyPage } from 'data/journey';
import { getAboutYouFromSession } from 'lib/session/aboutYouSession';
import { hasAboutYouErrors, validateAboutYou } from 'lib/validation/aboutYou';
import { journeyPath } from 'utils/journeyPath';

type JourneyAccess = {
  language: string;
  sessionId: string;
};

type JourneyAccessRedirect = {
  redirect: Redirect;
};

/** Pages that require a completed About you before access. */
const requiresAboutYou = new Set<JourneyPage>([
  JOURNEY_PAGES.YOUR_INCOME,
  JOURNEY_PAGES.POTS_OF_MONEY,
  JOURNEY_PAGES.SAVE,
]);

const isAboutYouComplete = async (sessionId: string, language: string) => {
  const data = await getAboutYouFromSession(sessionId);
  if (!data) {
    return false;
  }

  return !hasAboutYouErrors(validateAboutYou(data, language));
};

export const requireJourneyAccess = async ({
  page,
  language,
  sessionId,
}: {
  page: JourneyPage;
  language: string;
  sessionId: string;
}): Promise<JourneyAccess | JourneyAccessRedirect> => {
  if (!requiresAboutYou.has(page)) {
    return { language, sessionId };
  }

  const complete = await isAboutYouComplete(sessionId, language);
  if (!complete) {
    return {
      redirect: {
        destination: journeyPath(language, JOURNEY_PAGES.ABOUT_YOU, sessionId),
        permanent: false,
      },
    };
  }

  return { language, sessionId };
};
