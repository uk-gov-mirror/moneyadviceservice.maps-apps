import { z } from 'zod';

export const NONE_OF_THE_ABOVE_OPTION = 'none';

export interface ValidateAccessOptionsData {
  accessOptionsRequest: string;
  accessOptionsCompanion?: string;
  accessOptionsDetails?: string;
}

export const validateAccessOptions = (
  data: ValidateAccessOptionsData,
  ctx: z.RefinementCtx,
) => {
  const isNoneOfTheAbove =
    data.accessOptionsRequest === NONE_OF_THE_ABOVE_OPTION;
  const hasCompanion = Boolean(data.accessOptionsCompanion);
  const hasAdditionalDetails = Boolean(data.accessOptionsDetails?.trim());

  if (isNoneOfTheAbove && !hasCompanion && !hasAdditionalDetails) {
    ctx.addIssue({
      code: 'custom',
      path: ['accessOptionsCompanion'],
      message: 'companion-checkbox',
    });
    ctx.addIssue({
      code: 'custom',
      path: ['accessOptionsDetails'],
      message: 'additional-details',
    });
  }
};
