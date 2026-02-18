import { Component, output, input, inject, OnInit, computed, signal, effect, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateTime } from 'luxon';
import { DateRangeService } from '../../../services/date-range.service';
import { DateUtils } from '../../../utils/date.utils';
import { ICalendarDay } from '../../../models/calendar-day.interface';
import { IDateRangeTheme, DEFAULT_THEME } from '../../../models/date-range-config.interface';

@Component({
  selector: 'app-calendar-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-popup.component.html',
  styleUrl: './calendar-popup.component.scss'
})
export class CalendarPopupComponent implements OnInit {
  private dateRangeService = inject(DateRangeService);
  private elementRef = inject(ElementRef);

  // Signal inputs
  startWithSunday = input<boolean>(false);
  minDate = input<DateTime | null>(null);
  maxDate = input<DateTime | null>(null);
  showTwoMonths = input<boolean>(false);
  twoMonthsMode = input<'current-next' | 'previous-current'>('current-next');
  customTheme = input<IDateRangeTheme | undefined>(undefined);
  width = input<string>('300px');

  // Signal outputs
  rangeComplete = output<{ startDate: DateTime; endDate: DateTime }>();
  cancelled = output<void>();

  // Computed from service
  calendarDays = this.dateRangeService.calendarDays;
  currentMonthYear = this.dateRangeService.currentMonthYear;

  // Second month for dual display
  private currentMonth = signal<DateTime>(DateTime.now());

  constructor() {
    // Apply custom theme when it changes
    effect(() => {
      const theme = this.customTheme();
      this.applyTheme(theme);
    });
  }

  secondMonthDays = computed(() => {
    if (!this.showTwoMonths()) return [];

    const month = this.currentMonth();
    const secondMonth = this.twoMonthsMode() === 'current-next'
      ? month.plus({ months: 1 })
      : month.minus({ months: 1 });

    const days = DateUtils.generateCalendarDays(
      secondMonth.year,
      secondMonth.month,
      this.startWithSunday()
    );

    const range = this.dateRangeService.getSelection();
    const min = this.minDate();
    const max = this.maxDate();

    return days.map(day => ({
      ...day,
      isSelected: this.isDaySelected(day.date, range),
      isInRange: this.isDayInRange(day.date, range),
      isRangeStart: range.startDate?.hasSame(day.date, 'day') ?? false,
      isRangeEnd: range.endDate?.hasSame(day.date, 'day') ?? false,
      isDisabled: DateUtils.isDateDisabled(day.date, min, max)
    }));
  });

  secondMonthYear = computed(() => {
    if (!this.showTwoMonths()) return '';
    const month = this.currentMonth();
    const secondMonth = this.twoMonthsMode() === 'current-next'
      ? month.plus({ months: 1 })
      : month.minus({ months: 1 });
    return secondMonth.toFormat('MMMM yyyy');
  });

  weekdayHeaders: string[] = [];

  ngOnInit(): void {
    this.weekdayHeaders = DateUtils.getWeekdayHeaders(this.startWithSunday());
    this.dateRangeService.updateConfig({
      startWithSunday: this.startWithSunday(),
      minDate: this.minDate(),
      maxDate: this.maxDate()
    });

    // Initialize currentMonth signal
    this.currentMonth.set(DateTime.now());
  }

  onPreviousMonth(): void {
    this.dateRangeService.previousMonth();
    this.currentMonth.update(month => month.minus({ months: 1 }));
  }

  onNextMonth(): void {
    this.dateRangeService.nextMonth();
    this.currentMonth.update(month => month.plus({ months: 1 }));
  }

  onDayClick(day: ICalendarDay): void {
    if (day.isDisabled) return;

    this.dateRangeService.selectDate(day.date);

    // Check if range is complete
    const selection = this.dateRangeService.getSelection();
    if (selection.startDate && selection.endDate) {
      this.rangeComplete.emit({
        startDate: selection.startDate,
        endDate: selection.endDate
      });
    }
  }

  onDayHover(day: ICalendarDay): void {
    if (day.isDisabled) return;
    this.dateRangeService.setHoverDate(day.date);
  }

  onDayLeave(): void {
    this.dateRangeService.setHoverDate(null);
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  onClear(): void {
    this.dateRangeService.clearSelection();
  }

  private applyTheme(theme?: IDateRangeTheme): void {
    const element = this.elementRef.nativeElement as HTMLElement;
    const mergedTheme = { ...DEFAULT_THEME, ...theme };

    // Apply CSS custom properties for theming
    element.style.setProperty('--primary-color', mergedTheme.primaryColor!);
    element.style.setProperty('--accent-color', mergedTheme.accentColor!);
    element.style.setProperty('--selected-bg-color', mergedTheme.selectedBgColor!);
    element.style.setProperty('--selected-text-color', mergedTheme.selectedTextColor!);
    element.style.setProperty('--range-bg-color', mergedTheme.rangeBgColor!);
    element.style.setProperty('--hover-bg-color', mergedTheme.hoverBgColor!);
    element.style.setProperty('--disabled-color', mergedTheme.disabledColor!);
    element.style.setProperty('--border-color', mergedTheme.borderColor!);
    element.style.setProperty('--header-bg-color', mergedTheme.headerBgColor!);
    element.style.setProperty('--weekend-color', mergedTheme.weekendColor!);
  }

  private isDaySelected(date: DateTime, range: { startDate: DateTime | null; endDate: DateTime | null }): boolean {
    if (!range.startDate && !range.endDate) return false;
    return (
      (range.startDate?.hasSame(date, 'day') ?? false) ||
      (range.endDate?.hasSame(date, 'day') ?? false)
    );
  }

  private isDayInRange(date: DateTime, range: { startDate: DateTime | null; endDate: DateTime | null }): boolean {
    const { startDate, endDate } = range;
    if (startDate && endDate) {
      return DateUtils.isDateInRange(date, startDate, endDate);
    }
    return false;
  }
}
