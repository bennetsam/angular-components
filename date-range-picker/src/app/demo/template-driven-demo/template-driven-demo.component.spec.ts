import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateDrivenDemoComponent } from './template-driven-demo.component';

describe('TemplateDrivenDemoComponent', () => {
  let component: TemplateDrivenDemoComponent;
  let fixture: ComponentFixture<TemplateDrivenDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateDrivenDemoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateDrivenDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with null date range', () => {
    expect(component.dateRange).toEqual({ start: null, end: null });
  });

  it('should submit form', () => {
    component.dateRange = { start: '2026-02-01', end: '2026-02-28' };
    component.onSubmit();
    expect(component.submittedValue).toEqual({ start: '2026-02-01', end: '2026-02-28' });
  });

  it('should reset form', () => {
    component.dateRange = { start: '2026-02-01', end: '2026-02-28' };
    component.onReset();
    expect(component.dateRange).toEqual({ start: null, end: null });
    expect(component.submittedValue).toBeNull();
  });

  it('should handle range change', () => {
    spyOn(console, 'log');
    const value = { start: '2026-02-01', end: '2026-02-28' };
    component.onRangeChanged(value);
    expect(console.log).toHaveBeenCalledWith('Range changed:', value);
  });
});
