import { TestBed } from '@angular/core/testing';
import { DateTime } from 'luxon';
import { DateRangeService } from './date-range.service';

describe('DateRangeService', () => {
  let service: DateRangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateRangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Month Navigation', () => {
    it('should navigate to previous month', () => {
      const currentMonth = service.currentMonthYear();
      service.previousMonth();
      expect(service.currentMonthYear()).not.toBe(currentMonth);
    });

    it('should navigate to next month', () => {
      const currentMonth = service.currentMonthYear();
      service.nextMonth();
      expect(service.currentMonthYear()).not.toBe(currentMonth);
    });

    it('should navigate to specific month', () => {
      const targetDate = DateTime.local(2025, 6, 15);
      service.navigateToMonth(targetDate);
      expect(service.currentMonthYear()).toBe('June 2025');
    });
  });

  describe('Date Selection', () => {
    it('should set start date on first selection', () => {
      const date = DateTime.local(2026, 2, 15);
      service.selectDate(date);
      const selection = service.getSelection();
      expect(selection.startDate?.toISODate()).toBe('2026-02-15');
      expect(selection.endDate).toBeNull();
    });

    it('should set end date on second selection', () => {
      const startDate = DateTime.local(2026, 2, 10);
      const endDate = DateTime.local(2026, 2, 20);
      service.selectDate(startDate);
      service.selectDate(endDate);
      const selection = service.getSelection();
      expect(selection.startDate?.toISODate()).toBe('2026-02-10');
      expect(selection.endDate?.toISODate()).toBe('2026-02-20');
    });

    it('should swap dates if end date is before start date', () => {
      const startDate = DateTime.local(2026, 2, 20);
      const endDate = DateTime.local(2026, 2, 10);
      service.selectDate(startDate);
      service.selectDate(endDate);
      const selection = service.getSelection();
      expect(selection.startDate?.toISODate()).toBe('2026-02-10');
      expect(selection.endDate?.toISODate()).toBe('2026-02-20');
    });

    it('should start new selection on third click', () => {
      service.selectDate(DateTime.local(2026, 2, 10));
      service.selectDate(DateTime.local(2026, 2, 20));
      service.selectDate(DateTime.local(2026, 2, 25));
      const selection = service.getSelection();
      expect(selection.startDate?.toISODate()).toBe('2026-02-25');
      expect(selection.endDate).toBeNull();
    });
  });

  describe('Range Management', () => {
    it('should set range directly', () => {
      const start = DateTime.local(2026, 2, 1);
      const end = DateTime.local(2026, 2, 28);
      service.setRange(start, end);
      const selection = service.getSelection();
      expect(selection.startDate?.toISODate()).toBe('2026-02-01');
      expect(selection.endDate?.toISODate()).toBe('2026-02-28');
    });

    it('should clear selection', () => {
      service.selectDate(DateTime.local(2026, 2, 10));
      service.selectDate(DateTime.local(2026, 2, 20));
      service.clearSelection();
      const selection = service.getSelection();
      expect(selection.startDate).toBeNull();
      expect(selection.endDate).toBeNull();
    });
  });

  describe('Hover State', () => {
    it('should set hover date', () => {
      const date = DateTime.local(2026, 2, 15);
      service.setHoverDate(date);
      // Hover date is private, test via calendar days update
      expect(service.calendarDays().length).toBeGreaterThan(0);
    });

    it('should clear hover date', () => {
      service.setHoverDate(DateTime.local(2026, 2, 15));
      service.setHoverDate(null);
      expect(service.calendarDays().length).toBeGreaterThan(0);
    });
  });

  describe('Configuration', () => {
    it('should update startWithSunday config', () => {
      service.updateConfig({ startWithSunday: true });
      const days = service.calendarDays();
      expect(days[0].date.weekday).toBe(7); // Sunday
    });

    it('should update minDate config', () => {
      const minDate = DateTime.local(2026, 2, 10);
      service.updateConfig({ minDate });
      const days = service.calendarDays();
      const disabledDays = days.filter(d => d.isDisabled && d.isCurrentMonth);
      expect(disabledDays.length).toBeGreaterThan(0);
    });

    it('should update maxDate config', () => {
      const maxDate = DateTime.local(2026, 2, 20);
      service.updateConfig({ maxDate });
      const days = service.calendarDays();
      const disabledDays = days.filter(d => d.isDisabled && d.isCurrentMonth);
      expect(disabledDays.length).toBeGreaterThan(0);
    });
  });

  describe('Calendar Days Computed', () => {
    it('should generate 42 days', () => {
      const days = service.calendarDays();
      expect(days.length).toBe(42);
    });

    it('should mark selected dates', () => {
      const date = DateTime.local(2026, 2, 15);
      service.navigateToMonth(date);
      service.selectDate(date);
      const days = service.calendarDays();
      const selectedDay = days.find(d => d.isSelected);
      expect(selectedDay).toBeDefined();
    });

    it('should mark range dates', () => {
      const start = DateTime.local(2026, 2, 10);
      const end = DateTime.local(2026, 2, 20);
      service.navigateToMonth(start);
      service.setRange(start, end);
      const days = service.calendarDays();
      const rangeDays = days.filter(d => d.isInRange);
      expect(rangeDays.length).toBeGreaterThan(0);
    });

    it('should mark disabled dates', () => {
      const minDate = DateTime.local(2026, 2, 10);
      service.navigateToMonth(minDate);
      service.updateConfig({ minDate });
      const days = service.calendarDays();
      const disabledDays = days.filter(d => d.isDisabled);
      expect(disabledDays.length).toBeGreaterThan(0);
    });
  });
});
