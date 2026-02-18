import { DateTime } from 'luxon';
import { ICalendarDay } from '../models/calendar-day.interface';

export class DateUtils {
  /**
   * Generate calendar days for a given month
   */
  static generateCalendarDays(
    year: number,
    month: number,
    startWithSunday: boolean = false
  ): ICalendarDay[] {
    const firstDayOfMonth = DateTime.local(year, month, 1);
    const lastDayOfMonth = firstDayOfMonth.endOf('month');
    const days: ICalendarDay[] = [];

    // Calculate start of calendar (including previous month days)
    let startDay: DateTime;
    if (startWithSunday) {
      // For Sunday start, find the Sunday on or before the first day of the month
      // Luxon weekday: 1=Monday, 2=Tuesday, ..., 7=Sunday
      // If first day is Sunday (7), use it (0 days back)
      // If first day is Monday (1), go back 1 day to Sunday
      // If first day is Saturday (6), go back 6 days to Sunday
      const daysSinceSunday = firstDayOfMonth.weekday === 7 ? 0 : firstDayOfMonth.weekday;
      startDay = firstDayOfMonth.minus({ days: daysSinceSunday });
    } else {
      // For Monday start, use Luxon's built-in startOf('week') which starts on Monday
      startDay = firstDayOfMonth.startOf('week');
    }

    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const currentDay = startDay.plus({ days: i });
      days.push({
        date: currentDay,
        dayNumber: currentDay.day,
        isCurrentMonth: currentDay.month === month,
        isToday: currentDay.hasSame(DateTime.now(), 'day'),
        isSelected: false,
        isInRange: false,
        isRangeStart: false,
        isRangeEnd: false,
        isDisabled: false,
        isWeekend: currentDay.weekday === 6 || currentDay.weekday === 7
      });
    }

    return days;
  }

  /**
   * Check if a date is within a range
   */
  static isDateInRange(
    date: DateTime,
    startDate: DateTime | null,
    endDate: DateTime | null
  ): boolean {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  }

  /**
   * Check if a date is disabled
   */
  static isDateDisabled(
    date: DateTime,
    minDate: DateTime | null,
    maxDate: DateTime | null
  ): boolean {
    if (minDate && date < minDate.startOf('day')) return true;
    if (maxDate && date > maxDate.endOf('day')) return true;
    return false;
  }

  /**
   * Calculate difference in days between two dates
   */
  static daysBetween(startDate: DateTime, endDate: DateTime): number {
    return Math.floor(endDate.diff(startDate, 'days').days);
  }

  /**
   * Get weekday headers
   */
  static getWeekdayHeaders(startWithSunday: boolean = false): string[] {
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return startWithSunday ? [weekdays[6], ...weekdays.slice(0, 6)] : weekdays;
  }

  /**
   * Format date range for display
   */
  static formatDateRange(
    startDate: DateTime | null,
    endDate: DateTime | null,
    format: string = 'dd MMM yyyy'
  ): string {
    if (!startDate || !endDate) return '';
    return `${startDate.toFormat(format)} - ${endDate.toFormat(format)}`;
  }
}
