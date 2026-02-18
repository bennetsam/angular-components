import { DateTime } from 'luxon';
import { DateUtils } from './date.utils';

describe('DateUtils', () => {
  describe('generateCalendarDays', () => {
    it('should generate 42 days for a month', () => {
      const days = DateUtils.generateCalendarDays(2026, 2, false);
      expect(days.length).toBe(42);
    });

    it('should mark current month days correctly', () => {
      const days = DateUtils.generateCalendarDays(2026, 2, false);
      const currentMonthDays = days.filter(d => d.isCurrentMonth);
      expect(currentMonthDays.length).toBe(28); // February 2026 has 28 days
    });

    it('should start with Sunday when startWithSunday is true', () => {
      const days = DateUtils.generateCalendarDays(2026, 2, true);
      expect(days[0].date.weekday).toBe(7); // Sunday in Luxon
    });

    it('should start with Monday when startWithSunday is false', () => {
      const days = DateUtils.generateCalendarDays(2026, 2, false);
      expect(days[0].date.weekday).toBe(1); // Monday in Luxon
    });

    it('should mark today correctly', () => {
      const now = DateTime.now();
      const days = DateUtils.generateCalendarDays(now.year, now.month, false);
      const today = days.find(d => d.isToday);
      expect(today).toBeDefined();
      expect(today?.dayNumber).toBe(now.day);
    });

    it('should mark weekends correctly', () => {
      const days = DateUtils.generateCalendarDays(2026, 2, false);
      const weekends = days.filter(d => d.isWeekend);
      expect(weekends.length).toBeGreaterThan(0);
      weekends.forEach(day => {
        expect([6, 7]).toContain(day.date.weekday);
      });
    });
  });

  describe('isDateInRange', () => {
    it('should return true for date within range', () => {
      const start = DateTime.local(2026, 2, 1);
      const end = DateTime.local(2026, 2, 28);
      const date = DateTime.local(2026, 2, 15);
      expect(DateUtils.isDateInRange(date, start, end)).toBe(true);
    });

    it('should return false for date outside range', () => {
      const start = DateTime.local(2026, 2, 1);
      const end = DateTime.local(2026, 2, 28);
      const date = DateTime.local(2026, 3, 1);
      expect(DateUtils.isDateInRange(date, start, end)).toBe(false);
    });

    it('should return false when range is null', () => {
      const date = DateTime.local(2026, 2, 15);
      expect(DateUtils.isDateInRange(date, null, null)).toBe(false);
    });

    it('should include boundary dates', () => {
      const start = DateTime.local(2026, 2, 1);
      const end = DateTime.local(2026, 2, 28);
      expect(DateUtils.isDateInRange(start, start, end)).toBe(true);
      expect(DateUtils.isDateInRange(end, start, end)).toBe(true);
    });
  });

  describe('isDateDisabled', () => {
    it('should disable dates before minDate', () => {
      const minDate = DateTime.local(2026, 2, 10);
      const date = DateTime.local(2026, 2, 5);
      expect(DateUtils.isDateDisabled(date, minDate, null)).toBe(true);
    });

    it('should disable dates after maxDate', () => {
      const maxDate = DateTime.local(2026, 2, 20);
      const date = DateTime.local(2026, 2, 25);
      expect(DateUtils.isDateDisabled(date, null, maxDate)).toBe(true);
    });

    it('should not disable dates within range', () => {
      const minDate = DateTime.local(2026, 2, 1);
      const maxDate = DateTime.local(2026, 2, 28);
      const date = DateTime.local(2026, 2, 15);
      expect(DateUtils.isDateDisabled(date, minDate, maxDate)).toBe(false);
    });

    it('should not disable when no constraints', () => {
      const date = DateTime.local(2026, 2, 15);
      expect(DateUtils.isDateDisabled(date, null, null)).toBe(false);
    });
  });

  describe('daysBetween', () => {
    it('should calculate days between two dates', () => {
      const start = DateTime.local(2026, 2, 1);
      const end = DateTime.local(2026, 2, 10);
      expect(DateUtils.daysBetween(start, end)).toBe(9);
    });

    it('should handle same date', () => {
      const date = DateTime.local(2026, 2, 15);
      expect(DateUtils.daysBetween(date, date)).toBe(0);
    });

    it('should handle month boundaries', () => {
      const start = DateTime.local(2026, 1, 31);
      const end = DateTime.local(2026, 2, 1);
      expect(DateUtils.daysBetween(start, end)).toBe(1);
    });
  });

  describe('getWeekdayHeaders', () => {
    it('should return Monday-first headers by default', () => {
      const headers = DateUtils.getWeekdayHeaders(false);
      expect(headers[0]).toBe('Mon');
      expect(headers[6]).toBe('Sun');
    });

    it('should return Sunday-first headers when specified', () => {
      const headers = DateUtils.getWeekdayHeaders(true);
      expect(headers[0]).toBe('Sun');
      expect(headers[6]).toBe('Sat');
    });

    it('should return 7 headers', () => {
      expect(DateUtils.getWeekdayHeaders(false).length).toBe(7);
      expect(DateUtils.getWeekdayHeaders(true).length).toBe(7);
    });
  });

  describe('formatDateRange', () => {
    it('should format date range with default format', () => {
      const start = DateTime.local(2026, 2, 1);
      const end = DateTime.local(2026, 2, 28);
      const result = DateUtils.formatDateRange(start, end);
      expect(result).toBe('01 Feb 2026 - 28 Feb 2026');
    });

    it('should format with custom format', () => {
      const start = DateTime.local(2026, 2, 1);
      const end = DateTime.local(2026, 2, 28);
      const result = DateUtils.formatDateRange(start, end, 'yyyy-MM-dd');
      expect(result).toBe('2026-02-01 - 2026-02-28');
    });

    it('should return empty string for null dates', () => {
      expect(DateUtils.formatDateRange(null, null)).toBe('');
    });
  });
});
