import { FormControl } from '@angular/forms';
import { DateTime } from 'luxon';
import { DateRangeValidators } from './date-range.validators';
import { IDateRangeValue } from '../models/date-range.interface';

describe('DateRangeValidators', () => {
  describe('required', () => {
    it('should return error when value is null', () => {
      const control = new FormControl(null);
      const result = DateRangeValidators.required()(control);
      expect(result).toEqual({ required: true });
    });

    it('should return error when start is missing', () => {
      const value: IDateRangeValue = { start: null, end: '2026-02-28' };
      const control = new FormControl(value);
      const result = DateRangeValidators.required()(control);
      expect(result).toEqual({ required: true });
    });

    it('should return error when end is missing', () => {
      const value: IDateRangeValue = { start: '2026-02-01', end: null };
      const control = new FormControl(value);
      const result = DateRangeValidators.required()(control);
      expect(result).toEqual({ required: true });
    });

    it('should return null when both dates are provided', () => {
      const value: IDateRangeValue = { start: '2026-02-01', end: '2026-02-28' };
      const control = new FormControl(value);
      const result = DateRangeValidators.required()(control);
      expect(result).toBeNull();
    });
  });

  describe('minDate', () => {
    const minDate = DateTime.local(2026, 2, 1);

    it('should return error when start date is before minDate', () => {
      const value: IDateRangeValue = { start: '2026-01-31', end: '2026-02-28' };
      const control = new FormControl(value);
      const result = DateRangeValidators.minDate(minDate)(control);
      expect(result).toEqual({
        minDate: {
          min: '2026-02-01',
          actual: '2026-01-31'
        }
      });
    });

    it('should return null when start date is after or equal to minDate', () => {
      const value: IDateRangeValue = { start: '2026-02-01', end: '2026-02-28' };
      const control = new FormControl(value);
      const result = DateRangeValidators.minDate(minDate)(control);
      expect(result).toBeNull();
    });

    it('should return null when start is missing', () => {
      const value: IDateRangeValue = { start: null, end: '2026-02-28' };
      const control = new FormControl(value);
      const result = DateRangeValidators.minDate(minDate)(control);
      expect(result).toBeNull();
    });
  });

  describe('maxDate', () => {
    const maxDate = DateTime.local(2026, 2, 28);

    it('should return error when end date is after maxDate', () => {
      const value: IDateRangeValue = { start: '2026-02-01', end: '2026-03-01' };
      const control = new FormControl(value);
      const result = DateRangeValidators.maxDate(maxDate)(control);
      expect(result).toEqual({
        maxDate: {
          max: '2026-02-28',
          actual: '2026-03-01'
        }
      });
    });

    it('should return null when end date is before or equal to maxDate', () => {
      const value: IDateRangeValue = { start: '2026-02-01', end: '2026-02-28' };
      const control = new FormControl(value);
      const result = DateRangeValidators.maxDate(maxDate)(control);
      expect(result).toBeNull();
    });

    it('should return null when end is missing', () => {
      const value: IDateRangeValue = { start: '2026-02-01', end: null };
      const control = new FormControl(value);
      const result = DateRangeValidators.maxDate(maxDate)(control);
      expect(result).toBeNull();
    });
  });

  describe('maxRangeDays', () => {
    it('should return error when range exceeds maxDays', () => {
      const value: IDateRangeValue = { start: '2026-02-01', end: '2026-02-20' };
      const control = new FormControl(value);
      const result = DateRangeValidators.maxRangeDays(10)(control);
      expect(result).toEqual({
        maxRangeDays: {
          max: 10,
          actual: 19
        }
      });
    });

    it('should return null when range is within maxDays', () => {
      const value: IDateRangeValue = { start: '2026-02-01', end: '2026-02-10' };
      const control = new FormControl(value);
      const result = DateRangeValidators.maxRangeDays(10)(control);
      expect(result).toBeNull();
    });

    it('should return null when dates are missing', () => {
      const value: IDateRangeValue = { start: null, end: null };
      const control = new FormControl(value);
      const result = DateRangeValidators.maxRangeDays(10)(control);
      expect(result).toBeNull();
    });
  });

  describe('validRange', () => {
    it('should return error when end date is before start date', () => {
      const value: IDateRangeValue = { start: '2026-02-20', end: '2026-02-10' };
      const control = new FormControl(value);
      const result = DateRangeValidators.validRange()(control);
      expect(result).toEqual({ validRange: true });
    });

    it('should return null when end date is after start date', () => {
      const value: IDateRangeValue = { start: '2026-02-01', end: '2026-02-28' };
      const control = new FormControl(value);
      const result = DateRangeValidators.validRange()(control);
      expect(result).toBeNull();
    });

    it('should return null when dates are equal', () => {
      const value: IDateRangeValue = { start: '2026-02-15', end: '2026-02-15' };
      const control = new FormControl(value);
      const result = DateRangeValidators.validRange()(control);
      expect(result).toBeNull();
    });

    it('should return null when dates are missing', () => {
      const value: IDateRangeValue = { start: null, end: null };
      const control = new FormControl(value);
      const result = DateRangeValidators.validRange()(control);
      expect(result).toBeNull();
    });
  });
});
