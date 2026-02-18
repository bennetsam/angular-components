import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DateTime } from 'luxon';
import { CurrentDate, FIRST_DAY_IN_MONTH, ICalendarOptions, IDay, IWeek, MONTHS, WEEKDAYS } from './calendar.helper';
import { MonthViewComponent } from './month-view/month-view.component';
import { CalendarService } from './calendar.service';
import { DayViewComponent } from './day-view/day-view.component';
import { WeekViewComponent } from './week-view/week-view.component';
@Component({
  selector: 'app-calendar',
  imports: [CommonModule, MonthViewComponent, DayViewComponent, WeekViewComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  days: IDay[] = [];
  // follows the id as luxon lib. i.e 1 for Monday
  monthName: string = '';
  currentSelection: CurrentDate = {
    year: DateTime.now().year,
    month: DateTime.now().month,
    today: DateTime.now()
  };
  calendarWeek = new Map();
  options: ICalendarOptions = {
    enableOtherMonth: false,
    startWithSunday: true
  };

  tabs = [{
    id: 1,
    name: 'Month'
  }, {
    id: 2,
    name: 'Week'
  }, {
    id: 3,
    name: 'Day'
  }]
  selectedTab: number = 1;
  calendarView = new Map<string, IWeek>();

  constructor(private calendarService: CalendarService) { }

  ngOnInit(): void {
    const today = DateTime.now();
    this.createCalendar(today, this.options);
  }

  navigateMonth(action: number): void {
    this.days = this.calendarService.navigateMonth(action);
    this.currentSelection = this.calendarService.getCurrentSelection();
    const date = DateTime.local(this.currentSelection.year, this.currentSelection.month, FIRST_DAY_IN_MONTH);
    this.monthName = date.monthLong ?? '';
  }

  createCalendar(date: DateTime, options?: ICalendarOptions): void {
    this.monthName = date.monthLong ?? '';
    this.days = this.calendarService.createCalendar(date, (options ?? this.calendarService.getOptions()));
    this.calendarWeek = this.calendarService.getCalendarWeek();
    this.calendarView = this.calendarService.getWeekObj();
  }

  showOtherMonthDates(): void {
    this.options = this.calendarService.updateOptions({
      enableOtherMonth: !this.calendarService.getOptions().enableOtherMonth
    });
    this.currentSelection = this.calendarService.getCurrentSelection();
    const date = DateTime.local(this.currentSelection.year, this.currentSelection.month, FIRST_DAY_IN_MONTH);
    this.createCalendar(date);
  }

  toggleSundayOption(): void {
    this.options = this.calendarService.updateOptions({
      startWithSunday: !this.calendarService.getOptions().startWithSunday
    });
    this.currentSelection = this.calendarService.getCurrentSelection();
    const date = DateTime.local(this.currentSelection.year, this.currentSelection.month, FIRST_DAY_IN_MONTH);
    this.createCalendar(date);
  }

  tabSelected(tabId: number): void {
    this.selectedTab = tabId;
  }

  updateWeek(value: IDay): void {
    const date = DateTime.local(this.currentSelection.year, this.currentSelection.month, value.date as number);
    console.log(value);
    this.calendarService.updateWeekView(date, this.calendarService.getOptions());
    this.calendarView = this.calendarService.getWeekObj();
    this.days = [...this.days];

  }

  navigateToDate(date: DateTime): void {
    this.createCalendar(date, this.options);
  }
}
