import { DateTime } from 'luxon';

export interface IDateRange {
  startDate: DateTime | null;
  endDate: DateTime | null;
}

export interface IDateRangeValue {
  start: string | null; // ISO format
  end: string | null;   // ISO format
}
