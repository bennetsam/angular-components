import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IDay, ITimeList, IWeek, IWeekDate } from '../calendar.helper';
import { CommonModule } from '@angular/common';
import { DateTime } from 'luxon';

@Component({
  selector: 'week-view',
  imports: [CommonModule],
  templateUrl: './week-view.component.html',
  styleUrl: './week-view.component.scss'
})
export class WeekViewComponent implements OnChanges, OnInit {
  @Input() daylist = new Map<string, IWeekDate>();
  @Input() days: IDay[] = [];
  @Input() startWithSunday: boolean | undefined = false;
  @Input() calendarView = new Map<string, IWeek>();

  @Output() navigateToDate = new EventEmitter<DateTime>();

  weekDays = new Map();
  timeList: ITimeList[] = [];
  weekNumber: number | undefined;
  weekString: string = ``;

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes.hasOwnProperty('calendarView') || changes.hasOwnProperty('days')) && this.calendarView) {
      const week = this.calendarView.get('week');
      const startWithSunday = week?.options?.startWithSunday;
      let date = startWithSunday ? week?.startDate.minus({ days: 1 }) : week?.startDate;
      this.weekNumber = week?.weekNumber;
      this.weekString = this.createWeekString(date);
      this.highlightCurrentTime();
      this.daylist.forEach((value: IWeekDate, key: string) => {
        value.date = date?.day;
        date = date?.plus({ days: 1 })
      });
    }
  }

  createWeekString(date: DateTime<boolean> | undefined): string {
    let week = ``;
    if (date) {
      const startDate = date;
      const endDate = date?.plus({ day: 6 });
      const year = date.year;

      const startDateString = `${startDate.day} ${startDate.monthLong}`;
      const endDateString = `${endDate.day} ${endDate.monthLong}`

      week = `${startDateString} - ${endDateString}, ${year}`;
      if (startDate.year !== endDate.year) {
        week = `${startDateString}, ${year} - ${endDateString}, ${endDate.year}`;
      }

    }
    return week;
  }

  highlightCurrentTime(): void {
    const today = DateTime.now();
    const time = today.toObject();
    if (!this.timeList.length) {
      this.getTimeList();
    }
    this.timeList.forEach((item: ITimeList) => {
      item.highlight = false;
      if (time.hour === item.hour && time.minute >= item.minute && time.minute <= item.limit) {
        item.highlight = true;
      };
    });
    // scroll to the current time element.
    setTimeout(() => {
      const classElement = document.getElementsByClassName('highlight');
      if (classElement.length > 0) {
        classElement[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);


  }

  ngOnInit(): void {
    this.highlightCurrentTime();
  }


  getTimeList(): void {
    this.timeList = Array.from({
      length: 48
    }, (_, index) => {
      const hour = Math.floor(index / 2);
      const minute = (index % 2 === 0 ? 0 : 30);
      return {
        hour,
        minute,
        limit: minute === 0 ? 30 : 60,
        time: DateTime.fromObject({ hour, minute }).toFormat('hh:mm a')
      }
    });
    console.log(this.timeList);
  }

  navigateToDay(val?: DateTime): void {
    const date = val ?? DateTime.now();
    this.navigateToDate.emit(date);
  }

}
