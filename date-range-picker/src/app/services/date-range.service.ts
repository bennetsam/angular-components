import { Injectable, signal, computed } from '@angular/core';
import { DateTime } from 'luxon';
import { IDateRange } from '../models/date-range.interface';
import { DateUtils } from '../utils/date.utils';

@Injectable({
  providedIn: 'root'
})
export class DateRangeService {
  // Signals for state management
  private currentMonth = signal<DateTime>(DateTime.now());
  private selectedRange = signal<IDateRange>({ startDate: null, endDate: null });
  private hoverDate = signal<DateTime | null>(null);
  private startWithSunday = signal<boolean>(false);
  private minDate = signal<DateTime | null>(null);
  private maxDate = signal<DateTime | null>(null);

  // Computed calendar days
  calendarDays = computed(() => {
    const month = this.currentMonth();
    const days = DateUtils.generateCalendarDays(
      month.year,
      month.month,
      this.startWithSunday()
    );

    const range = this.selectedRange();
    const hover = this.hoverDate();
    const min = this.minDate();
    const max = this.maxDate();

    return days.map(day => ({
      ...day,
      isSelected: this.isDaySelected(day.date, range),
      isInRange: this.isDayInRange(day.date, range, hover),
      isRangeStart: range.startDate?.hasSame(day.date, 'day') ?? false,
      isRangeEnd: range.endDate?.hasSame(day.date, 'day') ?? false,
      isDisabled: DateUtils.isDateDisabled(day.date, min, max)
    }));
  });

  // Computed month/year display
  currentMonthYear = computed(() => {
    const month = this.currentMonth();
    return month.toFormat('MMMM yyyy');
  });

  /**
   * Navigate to previous month
   */
  previousMonth(): void {
    this.currentMonth.update(month => month.minus({ months: 1 }));
  }

  /**
   * Navigate to next month
   */
  nextMonth(): void {
    this.currentMonth.update(month => month.plus({ months: 1 }));
  }

  /**
   * Select a date (handles range selection logic)
   */
  selectDate(date: DateTime): void {
    const current = this.selectedRange();

    // If no start date, set start date
    if (!current.startDate) {
      this.selectedRange.set({ startDate: date, endDate: null });
      return;
    }

    // If start date exists but no end date, set end date
    if (current.startDate && !current.endDate) {
      if (date < current.startDate) {
        // User selected earlier date, swap
        this.selectedRange.set({ startDate: date, endDate: current.startDate });
      } else {
        this.selectedRange.set({ startDate: current.startDate, endDate: date });
      }
      return;
    }

    // Both dates exist, start new selection
    this.selectedRange.set({ startDate: date, endDate: null });
  }

  /**
   * Set hover date for preview
   */
  setHoverDate(date: DateTime | null): void {
    this.hoverDate.set(date);
  }

  /**
   * Clear selection
   */
  clearSelection(): void {
    this.selectedRange.set({ startDate: null, endDate: null });
  }

  /**
   * Set range directly (for presets)
   */
  setRange(startDate: DateTime, endDate: DateTime): void {
    this.selectedRange.set({ startDate, endDate });
  }

  /**
   * Get current selection
   */
  getSelection(): IDateRange {
    return this.selectedRange();
  }

  /**
   * Update configuration
   */
  updateConfig(config: {
    startWithSunday?: boolean;
    minDate?: DateTime | null;
    maxDate?: DateTime | null;
  }): void {
    if (config.startWithSunday !== undefined) {
      this.startWithSunday.set(config.startWithSunday);
    }
    if (config.minDate !== undefined) {
      this.minDate.set(config.minDate);
    }
    if (config.maxDate !== undefined) {
      this.maxDate.set(config.maxDate);
    }
  }

  /**
   * Navigate to specific month
   */
  navigateToMonth(date: DateTime): void {
    this.currentMonth.set(date);
  }

  /**
   * Check if day is selected
   */
  private isDaySelected(date: DateTime, range: IDateRange): boolean {
    if (!range.startDate && !range.endDate) return false;
    return (
      (range.startDate?.hasSame(date, 'day') ?? false) ||
      (range.endDate?.hasSame(date, 'day') ?? false)
    );
  }

  /**
   * Check if day is in range (including hover preview)
   */
  private isDayInRange(
    date: DateTime,
    range: IDateRange,
    hover: DateTime | null
  ): boolean {
    const { startDate, endDate } = range;

    // Complete range
    if (startDate && endDate) {
      return DateUtils.isDateInRange(date, startDate, endDate);
    }

    // Preview range with hover
    if (startDate && !endDate && hover) {
      const previewStart = hover < startDate ? hover : startDate;
      const previewEnd = hover < startDate ? startDate : hover;
      return DateUtils.isDateInRange(date, previewStart, previewEnd);
    }

    return false;
  }
}
