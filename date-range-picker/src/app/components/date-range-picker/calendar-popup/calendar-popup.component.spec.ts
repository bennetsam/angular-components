import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarPopupComponent } from './calendar-popup.component';
import { DateRangeService } from '../../../services/date-range.service';
import { DateTime } from 'luxon';

describe('CalendarPopupComponent', () => {
  let component: CalendarPopupComponent;
  let fixture: ComponentFixture<CalendarPopupComponent>;
  let service: DateRangeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarPopupComponent],
      providers: [DateRangeService]
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarPopupComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(DateRangeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display 7 weekday headers', () => {
    const headers = fixture.nativeElement.querySelectorAll('.weekday-header');
    expect(headers.length).toBe(7);
  });

  it('should display 42 calendar days', () => {
    const days = fixture.nativeElement.querySelectorAll('.calendar-day');
    expect(days.length).toBe(42);
  });

  it('should display current month and year', () => {
    const monthYear = fixture.nativeElement.querySelector('.month-year');
    expect(monthYear.textContent).toBeTruthy();
  });

  it('should navigate to previous month', () => {
    const initialMonth = component.currentMonthYear();
    component.onPreviousMonth();
    fixture.detectChanges();
    expect(component.currentMonthYear()).not.toBe(initialMonth);
  });

  it('should navigate to next month', () => {
    const initialMonth = component.currentMonthYear();
    component.onNextMonth();
    fixture.detectChanges();
    expect(component.currentMonthYear()).not.toBe(initialMonth);
  });

  it('should select date on day click', () => {
    const day = component.calendarDays()[15];
    component.onDayClick(day);
    const selection = service.getSelection();
    expect(selection.startDate).toBeTruthy();
  });

  it('should not select disabled day', () => {
    const disabledDay = { ...component.calendarDays()[0], isDisabled: true };
    const initialSelection = service.getSelection();
    component.onDayClick(disabledDay);
    expect(service.getSelection()).toEqual(initialSelection);
  });

  it('should emit rangeComplete when range is selected', () => {
    spyOn(component.rangeComplete, 'emit');
    const day1 = component.calendarDays()[10];
    const day2 = component.calendarDays()[20];
    component.onDayClick(day1);
    component.onDayClick(day2);
    expect(component.rangeComplete.emit).toHaveBeenCalled();
  });

  it('should emit cancelled on cancel button click', () => {
    spyOn(component.cancelled, 'emit');
    component.onCancel();
    expect(component.cancelled.emit).toHaveBeenCalled();
  });

  it('should clear selection on clear button click', () => {
    service.selectDate(DateTime.now());
    component.onClear();
    const selection = service.getSelection();
    expect(selection.startDate).toBeNull();
    expect(selection.endDate).toBeNull();
  });

  it('should start with Sunday when configured', () => {
    fixture.componentRef.setInput('startWithSunday', true);
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.weekdayHeaders[0]).toBe('Sun');
  });

  it('should start with Monday by default', () => {
    expect(component.weekdayHeaders[0]).toBe('Mon');
  });
});
