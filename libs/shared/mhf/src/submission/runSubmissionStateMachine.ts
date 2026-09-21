import { type Language } from '@maps-react/utils/language';

import { ResponseMessage, SubmissionState } from '../constants';
import { setStoreEntry } from '../store';
import { ResponseData, SubmissionEntry } from '../types';
import { getSubmissionMeta } from './getSubmissionMeta';
import { isStaleSubmission } from './isStaleSubmission';

export type SubmissionResult = {
  redirect: { destination: string; permanent: false };
};

export type RunSubmissionStateMachineOptions<
  TEntry extends SubmissionEntry = SubmissionEntry,
> = {
  entry: TEntry;
  key: string;
  locale: Language;
  /** Route shown while a fresh (non-stale) submission is IN_PROGRESS. */
  loadingDestination: string;
  /** Builds the error route for a resolved status code. */
  errorDestination: (status: string) => string;
  /** Maps a thrown error to the status code used by errorDestination. */
  resolveErrorStatus: (error: unknown) => string;
  /** Performs the API call; throw to fail the submission. */
  submit: (entry: TEntry) => Promise<ResponseData>;
  /** Called once a submission has SUCCEEDED; owns step advance + destination. */
  onSuccess: (
    entry: TEntry,
    key: string,
    locale: Language,
  ) => Promise<SubmissionResult>;
  /** Defaults to console.warn; override to customize logging context. */
  onError?: (error: unknown, entry: TEntry) => void;
};

const defaultOnError = <TEntry extends SubmissionEntry>(
  error: unknown,
  entry: TEntry,
) =>
  console.warn(
    'Error on submit page | flow:',
    entry.data?.flow,
    '| meta:',
    entry.meta,
    error,
  );

/**
 * Shared IDLE -> IN_PROGRESS -> SUCCEEDED | FAILED submission orchestration.
 * Apps supply the API call, success routing, and error status/route mapping.
 *
 * @example
 * runSubmissionStateMachine({
 *   entry,
 *   key,
 *   locale,
 *   loadingDestination: `/${locale}/loading`,
 *   errorDestination: (status) => `/${locale}/error?status=${status}`,
 *   resolveErrorStatus: (error) =>
 *     error instanceof Error ? error.message : ResponseMessage.GENERIC_ERROR,
 *   submit: async (entry) => {
 *     const response = await fetch(url, { method: 'POST', body: JSON.stringify(entry.data) });
 *     const responseData = await response.json();
 *     if (!response.ok) throw new Error(String(responseData.message));
 *     return responseData;
 *   },
 *   onSuccess: (entry, key, locale) => incrementAndRedirectToConfirmation(entry, key, locale),
 *   onError: (error, entry) => console.error(error, entry), // optional custom error handler
 * });
 * @returns {Promise<SubmissionResult>} The result of the submission state machine.
 */
export async function runSubmissionStateMachine<
  TEntry extends SubmissionEntry,
>({
  entry,
  key,
  locale,
  loadingDestination,
  errorDestination,
  resolveErrorStatus,
  submit,
  onSuccess,
  onError = defaultOnError,
}: RunSubmissionStateMachineOptions<TEntry>): Promise<SubmissionResult> {
  try {
    const meta = getSubmissionMeta(entry);

    // SUCCEEDED: don't resubmit, hand off to the app's success routing
    if (meta.submissionState === SubmissionState.SUCCEEDED) {
      return await onSuccess(entry, key, locale);
    }

    // FAILED: don't resubmit
    if (meta.submissionState === SubmissionState.FAILED) {
      throw new Error(ResponseMessage.SUBMISSION_FAILED);
    }

    // IN_PROGRESS: redirect to loading while fresh, otherwise mark failed
    if (meta.submissionState === SubmissionState.IN_PROGRESS) {
      if (!isStaleSubmission(meta.submissionStartedAt)) {
        return {
          redirect: { destination: loadingDestination, permanent: false },
        };
      }
      entry.meta = {
        submissionState: SubmissionState.FAILED,
        responseData: {
          status: 'false',
          message: ResponseMessage.SUBMISSION_FAILED,
        },
      };
      await setStoreEntry(key, entry);
      throw new Error(ResponseMessage.SUBMISSION_FAILED);
    }

    entry.meta = {
      ...meta,
      submissionState: SubmissionState.IN_PROGRESS,
      submissionStartedAt: new Date().toISOString(),
    };
    await setStoreEntry(key, entry);

    const responseData = await submit(entry);
    entry.meta = { submissionState: SubmissionState.SUCCEEDED, responseData };
    return await onSuccess(entry, key, locale);
  } catch (error) {
    // Only a submit() failure needs a fresh FAILED write; the FAILED/stale branches above already persisted.
    if (entry.meta?.submissionState === SubmissionState.IN_PROGRESS) {
      entry.meta = {
        submissionState: SubmissionState.FAILED,
        responseData: {
          status: 'false',
          message: resolveErrorStatus(error),
        },
      };
      await setStoreEntry(key, entry);
    }

    onError(error, entry);
    return {
      redirect: {
        destination: errorDestination(resolveErrorStatus(error)),
        permanent: false,
      },
    };
  }
}
