import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigurationDemoComponent } from './configuration-demo.component';

describe('ConfigurationDemoComponent', () => {
  let component: ConfigurationDemoComponent;
  let fixture: ComponentFixture<ConfigurationDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurationDemoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigurationDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with all controls', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('basic')).toBeDefined();
    expect(component.form.get('customFormat')).toBeDefined();
    expect(component.form.get('constrained')).toBeDefined();
    expect(component.form.get('maxRange')).toBeDefined();
    expect(component.form.get('singleDay')).toBeDefined();
    expect(component.form.get('disabled')).toBeDefined();
    expect(component.form.get('sundayStart')).toBeDefined();
    expect(component.form.get('noClear')).toBeDefined();
    expect(component.form.get('dualNext')).toBeDefined();
    expect(component.form.get('dualPrev')).toBeDefined();
    expect(component.form.get('darkTheme')).toBeDefined();
    expect(component.form.get('greenTheme')).toBeDefined();
    expect(component.form.get('customPresets')).toBeDefined();
    expect(component.form.get('singleMonthNoPresets')).toBeDefined();
    expect(component.form.get('dualMonthNoPresets')).toBeDefined();
    expect(component.form.get('customWidth')).toBeDefined();
    expect(component.form.get('allFeatures')).toBeDefined();
  });

  it('should have basic config defined', () => {
    expect(component.basicConfig).toBeDefined();
    expect(component.basicConfig.showPresets).toBe(true);
  });

  it('should have custom format config', () => {
    expect(component.customFormatConfig.dateFormat).toBe('yyyy-MM-dd');
  });

  it('should have constrained config with min/max dates', () => {
    expect(component.constrainedConfig.minDate).toBeDefined();
    expect(component.constrainedConfig.maxDate).toBeDefined();
  });

  it('should have max range config', () => {
    expect(component.maxRangeConfig.maxRangeDays).toBe(30);
  });

  it('should have dual month configs', () => {
    expect(component.dualMonthNextConfig.showTwoMonths).toBe(true);
    expect(component.dualMonthNextConfig.twoMonthsMode).toBe('current-next');
    expect(component.dualMonthPrevConfig.twoMonthsMode).toBe('previous-current');
  });

  it('should have custom themes defined', () => {
    expect(component.darkThemeConfig.customTheme).toBeDefined();
    expect(component.greenThemeConfig.customTheme).toBeDefined();
  });

  it('should have custom presets', () => {
    expect(component.customPresets.length).toBeGreaterThan(0);
  });

  it('should get form value correctly', () => {
    component.form.patchValue({ basic: { start: '2026-01-01', end: '2026-01-31' } });
    const value = component.getFormValue('basic');
    expect(value).toEqual({ start: '2026-01-01', end: '2026-01-31' });
  });

  it('should have single month without presets config', () => {
    expect(component.singleMonthNoPresetsConfig.showPresets).toBe(false);
    expect(component.singleMonthNoPresetsConfig.showTwoMonths).toBe(false);
  });

  it('should have dual month without presets config', () => {
    expect(component.dualMonthNoPresetsConfig.showPresets).toBe(false);
    expect(component.dualMonthNoPresetsConfig.showTwoMonths).toBe(true);
  });

  it('should format config code as string', () => {
    const configCode = component.getConfigCode(component.basicConfig);
    expect(configCode).toContain('showPresets');
    expect(typeof configCode).toBe('string');
  });

  it('should have 17 tabs defined', () => {
    expect(component.tabs.length).toBe(17);
  });

  it('should have custom width config', () => {
    expect(component.customWidthConfig.width).toBe('400px');
  });

  it('should start with tab 1 active', () => {
    expect(component.activeTab()).toBe(1);
  });

  it('should set active tab', () => {
    component.setActiveTab(5);
    expect(component.activeTab()).toBe(5);
  });

  it('should check if tab is active', () => {
    component.setActiveTab(3);
    expect(component.isActiveTab(3)).toBe(true);
    expect(component.isActiveTab(1)).toBe(false);
  });
});
