import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PresetButtonsComponent } from './preset-buttons.component';
import { DEFAULT_PRESETS } from '../../../models/date-preset.interface';

describe('PresetButtonsComponent', () => {
  let component: PresetButtonsComponent;
  let fixture: ComponentFixture<PresetButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresetButtonsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PresetButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default presets', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.preset-button');
    expect(buttons.length).toBe(DEFAULT_PRESETS.length);
  });

  it('should emit presetSelected when button clicked', () => {
    spyOn(component.presetSelected, 'emit');
    const firstPreset = DEFAULT_PRESETS[0];
    component.onPresetClick(firstPreset);
    expect(component.presetSelected.emit).toHaveBeenCalled();
  });

  it('should not emit when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    spyOn(component.presetSelected, 'emit');
    component.onPresetClick(DEFAULT_PRESETS[0]);
    expect(component.presetSelected.emit).not.toHaveBeenCalled();
  });

  it('should apply disabled class when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.preset-button');
    buttons.forEach((btn: HTMLElement) => {
      expect(btn.classList.contains('disabled')).toBe(true);
    });
  });
});
