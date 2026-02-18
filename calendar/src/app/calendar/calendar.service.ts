import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { IDay, MONTHS, FIRST_DAY_IN_MONTH, WEEKDAYS, CurrentDate, ICalendarOptions, IWeek, IWeekDate } from './calendar.helper';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  currentSelection: CurrentDate = {
    year: DateTime.now().year,
    month: DateTime.now().month,
    today: DateTime.now()
  };
  calendarWeek = new Map<number, IWeekDate>();
  calendarWeek1 = new Map<number, IWeekDate>([
    [WEEKDAYS.monday, { title: 'Monday' }],
    [WEEKDAYS.tuesday, { title: 'Tuesday' }],
    [WEEKDAYS.wednesday, { title: 'Wednesday' }],
    [WEEKDAYS.thrusday, { title: 'Thursday' }],
    [WEEKDAYS.friday, { title: 'Friday' }],
    [WEEKDAYS.saturday, { title: 'Saturday' }],
    [WEEKDAYS.sunday, { title: 'Sunday' }]
  ]);
  calendarWeek2 = new Map<number, IWeekDate>([
    [WEEKDAYS.sunday, { title: 'Sunday' }],
    [WEEKDAYS.monday, { title: 'Monday' }],
    [WEEKDAYS.tuesday, { title: 'Tuesday' }],
    [WEEKDAYS.wednesday, { title: 'Wednesday' }],
    [WEEKDAYS.thrusday, { title: 'Thursday' }],
    [WEEKDAYS.friday, { title: 'Friday' }],
    [WEEKDAYS.saturday, { title: 'Saturday' }],
  ]);
  week: number = 1;
  days: IDay[] = [];

  private options: ICalendarOptions = {
    enableOtherMonth: false,
    startWithSunday: true
  };
  private calendarView = new Map<string, IWeek>();

  constructor() { }

  createCalendar(date: DateTime, options?: ICalendarOptions): IDay[] {
    const month = date.month;
    const firstday = DateTime.local(date.year, month, 1);

    const days: IDay[] = [];
    let weekday = firstday.weekday;
    let week = 1;
    this.calendarWeek = !options?.startWithSunday ? this.calendarWeek1 : this.calendarWeek2;
    this.calendarView.clear();
    this.updateWeekView(date, options);

    this.options = this.updateOptions(options);
    console.log(this.calendarWeek.size);

    // if the week has started but the month has not filled the week from the start, then show empty items for the items in the week.
    this.initPreviousMonth(date, week, weekday, days);

    // create a model of the dates for the calendar 
    const dayCount = new Date(date.year, month, 0).getDate();
    for (let val = 1; val <= dayCount; val++) {
      const isToday = val === this.currentSelection.today.day && month === this.currentSelection.today.month;
      days.push({ date: val, weekday, week, isFirstweekday: val === 1, isToday });
      if (weekday === this.calendarWeek.size) {
        weekday = 1;
        week++;
      } else {
        weekday++
      }
    }

    // if the week has started but the calendar has not filled the week , then show empty items for the rest of the week.
    this.initNextMonth(date, week, weekday, days);
    console.log(weekday);
    this.week = week;
    this.days = days;

    return days;


  }

  // compute the weekNumber and the week start date to show the week view calendar
  updateWeekView(date: DateTime<boolean>, options: ICalendarOptions | undefined) {
    const startDate = options?.startWithSunday ? date.plus({ day: 1 }) : date;
    this.calendarView.set('week', {
      weekNumber: startDate.weekNumber,
      startDate: startDate.startOf('week'),
      endDate: startDate.endOf('week'), // next Sunday at 23:59:59
      options
    });
  }

  getWeekObj(): Map<string, IWeek> {
    return this.calendarView;
  }

  getCurrentSelection(): CurrentDate {
    return this.currentSelection;
  }

  getCalendarWeek(): Map<number, IWeekDate> {
    return this.calendarWeek;
  }

  initNextMonth(date: DateTime<boolean>, week: number, weekday: number, days: IDay[]): IDay[] {
    const daysFilled = (weekday - 1);
    let startDate = 1;
    let endDate = this.calendarWeek.size - weekday;
    if (!this.options?.startWithSunday) {
      endDate = this.calendarWeek.size - daysFilled;
    }
    if (endDate !== this.calendarWeek.size && daysFilled < this.calendarWeek.size) {
      for (let val = startDate; val <= endDate; val++) {
        days.push({
          date: this.options?.enableOtherMonth ? val : undefined,
          weekday: this.options?.enableOtherMonth ? weekday++ : val,
          week,
          disabled: true
        });

      }
    }

    return days;
  }


  initPreviousMonth(date: DateTime<boolean>, week: number, weekday: number, days: IDay[]): IDay[] {
    const month = date.month;
    let startDate = 1;
    let endDate = weekday;
    if (this.options?.startWithSunday) {
      startDate = weekday === 7 ? weekday : 0;
      endDate = weekday;
    }
    if (this.options?.enableOtherMonth && startDate !== endDate) {
      const dateCount = new Date(date.year, month - 1, 0).getDate();
      const count = this.options?.startWithSunday ? endDate : endDate - 1;
      startDate = dateCount - count;
      endDate = dateCount;
    }
    // fill the calendar with empty fields before showing the month
    for (let val = startDate; val < endDate; val++) {
      days.push({
        date: this.options?.enableOtherMonth ? val + 1 : undefined,
        weekday: val,
        week,
        disabled: true,
        isFirst: val === startDate
      });
    }

    return days;
  }

  navigateMonth(action: number): IDay[] {
    this.currentSelection.month = action === 1 ? this.currentSelection.month + 1 : this.currentSelection.month - 1;
    console.log(this.currentSelection.month);
    if (this.currentSelection.month <= 0) {
      this.currentSelection.year--;
      this.currentSelection.month = MONTHS.lastMonth;
    }
    if (this.currentSelection.month > MONTHS.lastMonth) {
      this.currentSelection.year++;
      this.currentSelection.month = MONTHS.firstMonth;
    }
    const date = DateTime.local(this.currentSelection.year, this.currentSelection.month, FIRST_DAY_IN_MONTH);
    return this.createCalendar(date, this.options);

  }

  updateOptions(opt?: ICalendarOptions): ICalendarOptions {
    this.options = {
      ...this.options,
      ...(opt ?? {})
    };

    return this.options;
  }

  getOptions(): ICalendarOptions {
    return this.options;
  }
}
