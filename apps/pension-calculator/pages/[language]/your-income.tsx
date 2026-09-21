import { GetServerSideProps } from 'next';

import { JOURNEY_PAGES } from 'data/journey';
import { PensionCalculatorBase } from 'layouts/PensionCalculatorBase';
import { getJourneyContext } from 'lib/getJourneyContext';
import { requireJourneyAccess } from 'lib/requireJourneyAccess';
import { journeyPath } from 'utils/journeyPath';

import { useTranslation } from '@maps-react/hooks/useTranslation';

type Props = {
  sessionId: string;
  language: string;
};

const YourIncomeStubPage = ({ sessionId, language }: Props) => {
  const { z } = useTranslation();

  return (
    <PensionCalculatorBase
      pageHeading={z({ en: 'Your income', cy: '' })}
      backHref={journeyPath(language, JOURNEY_PAGES.ABOUT_YOU, sessionId)}
      sectionLabel={z({ en: 'Section 2 of 8', cy: '' })}
      intro={z({
        en: 'This section will be added in a later story.',
        cy: '',
      })}
    >
      <></>
    </PensionCalculatorBase>
  );
};

export default YourIncomeStubPage;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
  params,
}) => {
  const context = getJourneyContext(query, params, JOURNEY_PAGES.YOUR_INCOME);
  if ('redirect' in context) {
    return context;
  }

  const access = await requireJourneyAccess({
    page: JOURNEY_PAGES.YOUR_INCOME,
    language: context.language,
    sessionId: context.sessionId,
  });
  if ('redirect' in access) {
    return access;
  }

  return { props: context };
};
