import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormDemoComponent } from './reactive-form-demo.component';

describe('ReactiveFormDemoComponent', () => {
  let component: ReactiveFormDemoComponent;
  let fixture: ComponentFixture<ReactiveFormDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormDemoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ReactiveFormDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form', () => {
    expect(component.form).toBeDefined();
    expect(component.dateRangeControl).toBeDefined();
  });

  it('should be invalid when empty', () => {
    expect(component.form.valid).toBe(false);
  });

  it('should submit when valid', () => {
    component.form.patchValue({
      dateRange: { start: '2026-02-01', end: '2026-02-28' }
    });
    component.onSubmit();
    expect(component.submittedValue).toBeTruthy();
  });

  it('should reset form', () => {
    component.form.patchValue({
      dateRange: { start: '2026-02-01', end: '2026-02-28' }
    });
    component.onReset();
    expect(component.form.value.dateRange).toBeNull();
    expect(component.submittedValue).toBeNull();
  });
});
