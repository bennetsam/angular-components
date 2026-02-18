import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DateRangePickerComponent } from './date-range-picker.component';
import { DateTime } from 'luxon';
import { IDateRangeValue } from '../../models/date-range.interface';

describe('DateRangePickerComponent', () => {
  let component: DateRangePickerComponent;
  let fixture: ComponentFixture<DateRangePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateRangePickerComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DateRangePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open popup on input click', () => {
    const input = fixture.nativeElement.querySelector('.date-input');
    input.click();
    fixture.detectChanges();
    expect(component.isOpen()).toBe(true);
  });

  it('should not open when disabled', () => {
    component.setDisabledState(true);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('.date-input');
    input.click();
    fixture.detectChanges();
    expect(component.isOpen()).toBe(false);
  });

  it('should write value', () => {
    const value: IDateRangeValue = {
      start: '2026-02-01',
      end: '2026-02-28'
    };
    component.writeValue(value);
    fixture.detectChanges();
    expect(component.displayValue()).toContain('Feb 2026');
  });

  it('should register onChange callback', () => {
    const fn = jasmine.createSpy('onChange');
    component.registerOnChange(fn);
    component.onRangeComplete({
      startDate: DateTime.local(2026, 2, 1),
      endDate: DateTime.local(2026, 2, 28)
    });
    expect(fn).toHaveBeenCalled();
  });

  it('should validate valid range', () => {
    const control = new FormControl({
      start: '2026-02-01',
      end: '2026-02-28'
    });
    const errors = component.validate(control);
    expect(errors).toBeNull();
  });

  it('should invalidate when end before start', () => {
    const control = new FormControl({
      start: '2026-02-28',
      end: '2026-02-01'
    });
    const errors = component.validate(control);
    expect(errors).toEqual({ invalidRange: true });
  });

  it('should emit rangeChanged on selection', () => {
    spyOn(component.rangeChanged, 'emit');
    component.onRangeComplete({
      startDate: DateTime.local(2026, 2, 1),
      endDate: DateTime.local(2026, 2, 28)
    });
    expect(component.rangeChanged.emit).toHaveBeenCalled();
  });

  it('should close popup on range complete', () => {
    component.isOpen.set(true);
    component.onRangeComplete({
      startDate: DateTime.local(2026, 2, 1),
      endDate: DateTime.local(2026, 2, 28)
    });
    expect(component.isOpen()).toBe(false);
  });

  it('should clear selection', () => {
    component.onRangeComplete({
      startDate: DateTime.local(2026, 2, 1),
      endDate: DateTime.local(2026, 2, 28)
    });
    component.onClear();
    expect(component.displayValue()).toBe('');
  });

  it('should work with FormControl', () => {
    const control = new FormControl(null);
    const onChange = (value: any) => control.setValue(value);
    component.registerOnChange(onChange);

    component.onRangeComplete({
      startDate: DateTime.local(2026, 2, 1),
      endDate: DateTime.local(2026, 2, 28)
    });

    expect(control.value).toBeTruthy();
    expect(control.value.start).toBe('2026-02-01');
    expect(control.value.end).toBe('2026-02-28');
  });
});
