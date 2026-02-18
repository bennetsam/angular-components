import { Component, input, output, signal, inject, forwardRef, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, AbstractControl, ValidationErrors, Validator } from '@angular/forms';
import { DateTime } from 'luxon';
import { CalendarPopupComponent } from './calendar-popup/calendar-popup.component';
import { PresetButtonsComponent } from './preset-buttons/preset-buttons.component';
import { DateRangeService } from '../../services/date-range.service';
import { IDateRangeConfig, DEFAULT_CONFIG } from '../../models/date-range-config.interface';
import { IDateRangeValue } from '../../models/date-range.interface';
import { IDatePreset } from '../../models/date-preset.interface';
import { DateUtils } from '../../utils/date.utils';

@Component({
  selector: 'app-date-range-picker',
  standalone: true,
  imports: [CommonModule, CalendarPopupComponent, PresetButtonsComponent],
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true
    },
    DateRangeService // Provide service at component level for isolation
  ]
})
export class DateRangePickerComponent implements ControlValueAccessor, Validator, OnInit {
  private dateRangeService = inject(DateRangeService);

  // Signal inputs
  config = input<IDateRangeConfig>(DEFAULT_CONFIG);
  presets = input<IDatePreset[]>([]);

  // Signal outputs
  rangeChanged = output<IDateRangeValue>();

  // Internal signals
  isOpen = signal<boolean>(false);
  displayValue = signal<string>('');
  isFocused = signal<boolean>(false);
  isDisabled = signal<boolean>(false);

  // ControlValueAccessor
  private onChange: (value: IDateRangeValue) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    // Watch for config changes to update disabled state
    effect(() => {
      const cfg = this.config();
      this.isDisabled.set(cfg.disabled ?? false);
    });
  }

  ngOnInit(): void {
    const cfg = this.config();
    this.dateRangeService.updateConfig({
      startWithSunday: cfg.startWithSunday,
      minDate: cfg.minDate,
      maxDate: cfg.maxDate
    });
  }

  // ControlValueAccessor implementation
  writeValue(value: IDateRangeValue): void {
    if (value && value.start && value.end) {
      const startDate = DateTime.fromISO(value.start);
      const endDate = DateTime.fromISO(value.end);
      this.dateRangeService.setRange(startDate, endDate);
      this.updateDisplayValue(startDate, endDate);
    } else {
      this.dateRangeService.clearSelection();
      this.displayValue.set('');
    }
  }

  registerOnChange(fn: (value: IDateRangeValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  // Validator implementation
  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value as IDateRangeValue;

    if (!value || !value.start || !value.end) {
      return null; // Use Validators.required separately if needed
    }

    const startDate = DateTime.fromISO(value.start);
    const endDate = DateTime.fromISO(value.end);
    const cfg = this.config();

    // Validate date range order
    if (endDate < startDate) {
      return { invalidRange: true };
    }

    // Validate min/max dates
    if (cfg.minDate && startDate < cfg.minDate.startOf('day')) {
      return { minDate: true };
    }
    if (cfg.maxDate && endDate > cfg.maxDate.endOf('day')) {
      return { maxDate: true };
    }

    // Validate max range
    if (cfg.maxRangeDays) {
      const days = DateUtils.daysBetween(startDate, endDate);
      if (days > cfg.maxRangeDays) {
        return { maxRangeDays: { max: cfg.maxRangeDays, actual: days } };
      }
    }

    return null;
  }

  onInputClick(): void {
    if (this.isDisabled()) return;
    this.isOpen.set(true);
    this.isFocused.set(true);
  }

  onInputBlur(): void {
    this.isFocused.set(false);
    this.onTouched();
  }

  onRangeComplete(range: { startDate: DateTime; endDate: DateTime }): void {
    this.updateDisplayValue(range.startDate, range.endDate);
    this.emitValue(range.startDate, range.endDate);
    this.isOpen.set(false);
  }

  onPresetSelected(range: { startDate: DateTime; endDate: DateTime }): void {
    this.dateRangeService.setRange(range.startDate, range.endDate);
    this.updateDisplayValue(range.startDate, range.endDate);
    this.emitValue(range.startDate, range.endDate);
    this.isOpen.set(false);
  }

  onCancel(): void {
    this.isOpen.set(false);
  }

  onClear(): void {
    this.dateRangeService.clearSelection();
    this.displayValue.set('');
    this.emitValue(null, null);
    this.isOpen.set(false);
  }

  private updateDisplayValue(startDate: DateTime, endDate: DateTime): void {
    const format = this.config().dateFormat ?? 'dd MMM yyyy';
    this.displayValue.set(DateUtils.formatDateRange(startDate, endDate, format));
  }

  private emitValue(startDate: DateTime | null, endDate: DateTime | null): void {
    const value: IDateRangeValue = {
      start: startDate?.toISODate() ?? null,
      end: endDate?.toISODate() ?? null
    };
    this.onChange(value);
    this.rangeChanged.emit(value);
  }

  get placeholder(): string {
    return this.config().placeholder ?? 'Select date range';
  }

  get showPresets(): boolean {
    return this.config().showPresets ?? true;
  }

  get showClearButton(): boolean {
    return this.config().showClearButton ?? true;
  }
}
