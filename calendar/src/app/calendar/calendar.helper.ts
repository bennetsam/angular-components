import { DateTime } from "luxon";

export interface IDay {
    selected?: boolean;
    date?: number;
    week?: number;
    weekday: number;
    isFirstweekday?: boolean;
    isFirst?: boolean;
    disabled?: boolean;
    isToday?: boolean;
}

export const WEEKDAYS = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thrusday: 4,
    friday: 5,
    saturday: 6,
    sunday: 7

};
export const FIRST_DAY_IN_MONTH = 1;

export const MONTHS = {
    firstMonth: 1,
    lastMonth: 12
};

export interface CurrentDate {
    year: number;
    month: number;
    today: DateTime;
}

export interface ICalendarOptions {
    enableOtherMonth?: boolean;
    startWithSunday?: boolean;
};

export interface IWeek {
    startDate: DateTime<boolean>;
    endDate: DateTime<boolean>;
    weekNumber: number;
    options: ICalendarOptions | undefined;
}

export interface IWeekDate {
    eventName?: any;
    title: string;
    date?: number;
}

export interface ITimeList {
    time: string;
    hour: number;
    minute: number;
    limit: number;
    highlight?: boolean;
}
