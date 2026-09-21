import { z } from 'zod';

import {
  NONE_OF_THE_ABOVE_OPTION,
  validateAccessOptions,
} from './validateAccessOptions';

const schema = z
  .object({
    accessOptionsRequest: z.string(),
    accessOptionsCompanion: z.string().optional(),
    accessOptionsDetails: z.string().optional(),
  })
  .superRefine(validateAccessOptions);

describe('validateAccessOptions', () => {
  it('requires a companion or additional details when none of the above is selected', () => {
    const result = schema.safeParse({
      accessOptionsRequest: NONE_OF_THE_ABOVE_OPTION,
      accessOptionsCompanion: '',
      accessOptionsDetails: '   ',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual([
        expect.objectContaining({
          path: ['accessOptionsCompanion'],
          message: 'companion-checkbox',
        }),
        expect.objectContaining({
          path: ['accessOptionsDetails'],
          message: 'additional-details',
        }),
      ]);
    }
  });

  it.each([
    {
      accessOptionsRequest: NONE_OF_THE_ABOVE_OPTION,
      accessOptionsCompanion: 'someone-to-attend-appointment',
      accessOptionsDetails: '',
    },
    {
      accessOptionsRequest: NONE_OF_THE_ABOVE_OPTION,
      accessOptionsCompanion: '',
      accessOptionsDetails: 'Please explain information slowly.',
    },
    {
      accessOptionsRequest: 'bsl-interpreter|access-bsl',
      accessOptionsCompanion: '',
      accessOptionsDetails: '',
    },
  ])('accepts a valid access-options submission', (data) => {
    expect(schema.safeParse(data).success).toBe(true);
  });
});
