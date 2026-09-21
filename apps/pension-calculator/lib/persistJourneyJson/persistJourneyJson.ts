export type PersistJourneyJsonResult<TErrors> = {
  success: boolean;
  redirectPath?: string;
  errors?: TErrors;
};

export const persistJourneyJson = async <TErrors>(
  url: string,
  action: string,
  language: string,
  sessionId: string,
  data: object,
): Promise<PersistJourneyJsonResult<TErrors>> => {
  const response = await fetch(`${url}?action=${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language,
      sessionId,
      ...data,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to persist journey data (${response.status})`);
  }

  return response.json() as Promise<PersistJourneyJsonResult<TErrors>>;
};
