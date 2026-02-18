import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DateTime } from 'luxon';
import { IDateRangeValue } from '../models/date-range.interface';

export class DateRangeValidators {
  /**
   * Validates that both start and end dates are provided
   */
  static required(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as IDateRangeValue;
      if (!value || !value.start || !value.end) {
        return { required: true };
      }
      return null;
    };
  }

  /**
   * Validates minimum date
   */
  static minDate(minDate: DateTime): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as IDateRangeValue;
      if (!value || !value.start) return null;

      const startDate = DateTime.fromISO(value.start);
      if (startDate < minDate.startOf('day')) {
        return {
          minDate: {
            min: minDate.toISODate(),
            actual: startDate.toISODate()
          }
        };
      }
      return null;
    };
  }

  /**
   * Validates maximum date
   */
  static maxDate(maxDate: DateTime): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as IDateRangeValue;
      if (!value || !value.end) return null;

      const endDate = DateTime.fromISO(value.end);
      if (endDate > maxDate.endOf('day')) {
        return {
          maxDate: {
            max: maxDate.toISODate(),
            actual: endDate.toISODate()
          }
        };
      }
      return null;
    };
  }

  /**
   * Validates maximum range in days
   */
  static maxRangeDays(maxDays: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as IDateRangeValue;
      if (!value || !value.start || !value.end) return null;

      const startDate = DateTime.fromISO(value.start);
      const endDate = DateTime.fromISO(value.end);
      const daysDiff = Math.floor(endDate.diff(startDate, 'days').days);

      if (daysDiff > maxDays) {
        return {
          maxRangeDays: {
            max: maxDays,
            actual: daysDiff
          }
        };
      }
      return null;
    };
  }

  /**
   * Validates that end date is after start date
   */
  static validRange(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as IDateRangeValue;
      if (!value || !value.start || !value.end) return null;

      const startDate = DateTime.fromISO(value.start);
      const endDate = DateTime.fromISO(value.end);

      if (endDate < startDate) {
        return { validRange: true };
      }
      return null;
    };
  }
}
