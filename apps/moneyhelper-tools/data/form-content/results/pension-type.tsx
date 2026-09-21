import { Condition, TranslationGroup, TranslationGroupString } from 'types';

import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ListElement } from '@maps-react/common/components/ListElement';

type ConditionalTitles = {
  title: TranslationGroupString;
  conditions: Condition[];
  conditionOperator?: 'and' | 'or';
};

type Headings = {
  defaultTitle: TranslationGroupString;
  conditionalTitles: ConditionalTitles[];
};

type ConditionalContent = {
  content: TranslationGroup;
  conditions: Condition[];
  conditionOperator?: 'and' | 'or';
};

type Content = {
  defaultContent: TranslationGroup;
  conditionalContent: ConditionalContent[];
};

type Data = {
  headings: Headings;
  content: Content;
};

const headings: Headings = {
  defaultTitle: {
    en: 'In most cases, you’ll have a defined benefit pension',
    cy: 'Yn y mwyafrif o achosion bydd gennych bensiwn buddion wedi’u diffinio',
  },
  conditionalTitles: [
    {
      title: {
        en: 'You might have a defined contribution pension',
        cy: 'Efallai bod gennych bensiwn cyfraniadau wedi’u diffinio',
      },
      conditions: [
        {
          question: '4', // When did you start this pension?
          answer: '2', // Don't know
        },
      ],
    },
    {
      title: {
        en: 'In most cases you’ll have a defined contribution pension',
        cy: 'Efallai bod gennych bensiwn cyfraniadau wedi’u diffinio',
      },
      conditionOperator: 'or',
      conditions: [
        {
          question: '1', // Was your pension set up by your employer?
          answer: '1', // No
        },
        {
          question: '3', // Is your pension provider one of the following?
          answer: '0', // Yes
        },
        {
          question: '4', // when did you start this pension?
          answer: '1', // 2000 or later
        },
      ],
    },
  ],
};

const content: Content = {
  defaultContent: {
    en: (
      <>
        <Paragraph>
          This is just a rough guide. Your provider or employer can confirm the
          exact type you have. You can also{' '}
          <Link href="https://www.moneyhelper.org.uk/en/contact-us">
            contact our pension specialists
          </Link>{' '}
          for free help.
        </Paragraph>
        <Paragraph>
          A defined contribution pension is the most common type in the UK. It’s
          a pot of money that you (and sometimes your employer) pay into for
          your retirement. It might also be called a money purchase pension.
        </Paragraph>
        <Paragraph>
          Your pension is invested, so your retirement income depends on how
          well the investments perform and how and when you choose to take it.
        </Paragraph>
        <Paragraph>For more information, see our guides:</Paragraph>
        <ListElement
          variant="unordered"
          color="blue"
          className="mb-4 ml-7"
          items={[
            <Link
              key="defined-contribution-pension-schemes-explained"
              href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/defined-contribution-pension-schemes"
            >
              Defined contribution pension schemes explained
            </Link>,
            <Link
              key="what-can-i-do-with-my-pension-pot"
              href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-wise/pension-pot-options"
            >
              What can I do with my pension pot?
            </Link>,
          ]}
        />
        <Paragraph>
          If you have more than one pension, you can{' '}
          <Link href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-wise/find-out-your-pension-type">
            check another pension
          </Link>
          .
        </Paragraph>
      </>
    ),
    cy: (
      <>
        <Paragraph>
          Canllaw bras yn unig yw hwn. Gall eich darparwr neu eich cyflogwr
          gadarnhau’n union pa fath o bensiwn sydd gennych. Gallwch hefyd{' '}
          <Link href="https://www.moneyhelper.org.uk/cy/contact-us">
            gysylltu â'n harbenigwyr pensiynau
          </Link>{' '}
          am gymorth am ddim.
        </Paragraph>
        <Paragraph>
          Y math mwyaf cyffredin o bensiwn yn y DU yw pensiwn cyfraniadau wedi'u
          diffinio. Mae’n gronfa o arian rydych chi (ac weithiau eich cyflogwr)
          yn cyfrannu ati ar gyfer eich ymddeoliad. Efallai y bydd hefyd yn cael
          ei alw’n bensiwn prynu arian.
        </Paragraph>
        <Paragraph>
          Mae eich pensiwn yn cael ei fuddsoddi, felly mae eich incwm ymddeol yn
          dibynnu ar berfformiad y buddsoddiadau ac ar sut a phryd rydych chi'n
          dewis ei gymryd.
        </Paragraph>
        <Paragraph>Am ragor o wybodaeth, gweler ein canllawiau:</Paragraph>
        <ListElement
          variant="unordered"
          color="blue"
          className="mb-4 ml-7"
          items={[
            <Link
              key="esboniad-o-gynlluniau-pensiwn-cyfraniadau-wedi-u-diffinio"
              href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/defined-contribution-pension-schemes"
            >
              Esboniad o gynlluniau pensiwn cyfraniadau wedi'u diffinio
            </Link>,
            <Link
              key="beth-allaf-ei-wneud-gyda-fy-nghronfa-bensiwn"
              href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pension-wise/pension-pot-options"
            >
              Beth allaf ei wneud gyda fy nghronfa bensiwn?
            </Link>,
          ]}
        />
        <Paragraph>
          Os oes gennych fwy nag un pensiwn, gallwch{' '}
          <Link href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pension-wise/find-out-your-pension-type">
            wirio pensiwn arall
          </Link>
          .
        </Paragraph>
      </>
    ),
  },
  conditionalContent: [
    {
      content: {
        en: (
          <>
            <Paragraph>
              Pension Wise only gives guidance on defined contribution pensions.
            </Paragraph>
            <Paragraph>
              See our guidance on{' '}
              <Link href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/building-your-retirement-pot/pension-investment-options-an-overview">
                pension investment options
              </Link>{' '}
              and the{' '}
              <Link href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/state-pension.html">
                State Pension
              </Link>
              .
            </Paragraph>
            <Paragraph>
              If you have more than one pension, you may also have a defined
              contribution pension –{' '}
              <Link href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-wise/find-out-your-pension-type">
                check another pension
              </Link>
              .
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph>
              Dim ond ar bensiynau cyfraniadau wed’u diffinio y mae Pension Wise
              yn rhoi arweiniad.
            </Paragraph>
            <Paragraph>
              Gweler ein canllaw ar{' '}
              <Link href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/building-your-retirement-pot/pension-investment-options-an-overview">
                opsiynau buddsoddi pensiwn
              </Link>{' '}
              a{' '}
              <Link href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/state-pension.html">
                Phensiwn y Wladwriaeth
              </Link>
              .
            </Paragraph>
            <Paragraph>
              Os oes gennych fwy nag un pensiwn, efallai bod gennych bensiwn
              cyfraniadau wedi’u diffinio hefyd –{' '}
              <Link href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pension-wise/find-out-your-pension-type">
                gwirio pensiwn arall
              </Link>
              .
            </Paragraph>
          </>
        ),
      },
      conditionOperator: 'or',
      conditions: [
        {
          question: '2', // Did your pension come from working for one of the following...
          answer: '0', // Yes
        },
        {
          question: '4', // When did you start this pension?
          answer: '0', // 1999 or before
        },
      ],
    },
  ],
};

export const data: Data = {
  headings,
  content,
};
