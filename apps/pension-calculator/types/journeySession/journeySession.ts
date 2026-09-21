import type { AboutYouData } from 'types/aboutYou';

/** App-shaped journey session stored under one Redis key. Map to EV at results. */
export type JourneySessionData = {
  aboutYou?: AboutYouData;
};
