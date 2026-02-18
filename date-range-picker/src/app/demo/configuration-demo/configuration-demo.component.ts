import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DateRangePickerComponent } from '../../components/date-range-picker/date-range-picker.component';
import { IDateRangeConfig } from '../../models/date-range-config.interface';
import { IDatePreset, DEFAULT_PRESETS } from '../../models/date-preset.interface';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-configuration-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DateRangePickerComponent],
  templateUrl: './configuration-demo.component.html',
  styleUrl: './configuration-demo.component.scss'
})
export class ConfigurationDemoComponent {
  form: FormGroup;
  activeTab = signal<number>(1); // Start with first tab active

  tabs = [
    { id: 1, label: 'Basic Configuration' },
    { id: 2, label: 'Custom Date Format' },
    { id: 3, label: 'Min/Max Constraints' },
    { id: 4, label: 'Maximum Range Limit' },
    { id: 5, label: 'Single Day Selection' },
    { id: 6, label: 'Disabled State' },
    { id: 7, label: 'Sunday Start Week' },
    { id: 8, label: 'No Clear Button' },
    { id: 9, label: 'Dual Month (Current + Next)' },
    { id: 10, label: 'Dual Month (Previous + Current)' },
    { id: 11, label: 'Dark Theme' },
    { id: 12, label: 'Green Theme' },
    { id: 13, label: 'Custom Presets' },
    { id: 14, label: 'Single Month No Presets' },
    { id: 15, label: 'Dual Month No Presets' },
    { id: 16, label: 'Custom Width' },
    { id: 17, label: 'All Features Combined' }
  ]

  // Example 1: Basic configuration
  basicConfig: IDateRangeConfig = {
    showPresets: true,
    startWithSunday: false,
    placeholder: 'Select date range'
  };

  // Example 2: Custom date format
  customFormatConfig: IDateRangeConfig = {
    dateFormat: 'yyyy-MM-dd',
    showPresets: false,
    placeholder: 'YYYY-MM-DD format'
  };

  // Example 3: Min/Max date constraints
  constrainedConfig: IDateRangeConfig = {
    minDate: DateTime.now().minus({ months: 3 }),
    maxDate: DateTime.now().plus({ months: 3 }),
    showPresets: true,
    placeholder: 'Last 3 months to next 3 months'
  };

  // Example 4: Max range days limit
  maxRangeConfig: IDateRangeConfig = {
    maxRangeDays: 30,
    showPresets: true,
    placeholder: 'Maximum 30 days range'
  };

  // Example 5: Single day selection
  singleDayConfig: IDateRangeConfig = {
    allowSingleDay: true,
    maxRangeDays: 0,
    showPresets: false,
    placeholder: 'Single day only'
  };

  // Example 6: Disabled state
  disabledConfig: IDateRangeConfig = {
    disabled: true,
    placeholder: 'Disabled picker'
  };

  // Example 7: Sunday start
  sundayStartConfig: IDateRangeConfig = {
    startWithSunday: true,
    showPresets: true,
    placeholder: 'Week starts on Sunday'
  };

  // Example 8: No clear button
  noClearConfig: IDateRangeConfig = {
    showClearButton: false,
    showPresets: true,
    placeholder: 'No clear button'
  };

  // Example 9: Dual month - current and next
  dualMonthNextConfig: IDateRangeConfig = {
    showTwoMonths: true,
    twoMonthsMode: 'current-next',
    showPresets: true,
    placeholder: 'Current + Next month'
  };

  // Example 10: Dual month - previous and current
  dualMonthPrevConfig: IDateRangeConfig = {
    showTwoMonths: true,
    twoMonthsMode: 'previous-current',
    showPresets: true,
    placeholder: 'Previous + Current month'
  };

  // Example 11: Custom theme - Dark
  darkThemeConfig: IDateRangeConfig = {
    showPresets: true,
    customTheme: {
      primaryColor: '#bb86fc',
      selectedBgColor: '#bb86fc',
      selectedTextColor: '#000000',
      rangeBgColor: '#3700b3',
      hoverBgColor: '#6200ea',
      disabledColor: '#757575',
      borderColor: '#bb86fc',
      headerBgColor: '#121212',
      weekendColor: '#cf6679'
    },
    placeholder: 'Dark theme'
  };

  // Example 12: Custom theme - Green
  greenThemeConfig: IDateRangeConfig = {
    showPresets: true,
    customTheme: {
      primaryColor: '#4caf50',
      selectedBgColor: '#4caf50',
      selectedTextColor: '#ffffff',
      rangeBgColor: '#c8e6c9',
      hoverBgColor: '#a5d6a7',
      disabledColor: '#bdbdbd',
      borderColor: '#4caf50',
      headerBgColor: '#ffffff',
      weekendColor: '#ff5722'
    },
    placeholder: 'Green theme'
  };

  // Example 13: Custom presets
  customPresets: IDatePreset[] = [
    {
      label: 'Q1 2026',
      getValue: () => ({
        startDate: DateTime.local(2026, 1, 1),
        endDate: DateTime.local(2026, 3, 31)
      })
    },
    {
      label: 'Q2 2026',
      getValue: () => ({
        startDate: DateTime.local(2026, 4, 1),
        endDate: DateTime.local(2026, 6, 30)
      })
    },
    {
      label: 'This Year',
      getValue: () => ({
        startDate: DateTime.now().startOf('year'),
        endDate: DateTime.now().endOf('year')
      })
    }
  ];

  customPresetsConfig: IDateRangeConfig = {
    showPresets: true,
    placeholder: 'Custom presets (Quarters)'
  };

  // Example 14: Single month without presets
  singleMonthNoPresetsConfig: IDateRangeConfig = {
    showPresets: false,
    showTwoMonths: false,
    placeholder: 'Single month, no presets'
  };

  // Example 15: Dual month without presets
  dualMonthNoPresetsConfig: IDateRangeConfig = {
    showPresets: false,
    showTwoMonths: true,
    twoMonthsMode: 'current-next',
    placeholder: 'Dual month, no presets'
  };

  // Example 16: Custom width
  customWidthConfig: IDateRangeConfig = {
    showPresets: true,
    width: '400px',
    placeholder: 'Custom width: 400px'
  };

  // Example 17: All features combined
  allFeaturesConfig: IDateRangeConfig = {
    showPresets: true,
    showTwoMonths: true,
    twoMonthsMode: 'current-next',
    startWithSunday: false,
    minDate: DateTime.now().minus({ months: 6 }),
    maxDate: DateTime.now().plus({ months: 6 }),
    maxRangeDays: 90,
    dateFormat: 'dd/MM/yyyy',
    showClearButton: true,
    placeholder: 'All features enabled',
    customTheme: {
      primaryColor: '#1976d2',
      selectedBgColor: '#1976d2',
      selectedTextColor: '#ffffff',
      rangeBgColor: '#bbdefb',
      hoverBgColor: '#e3f2fd',
      disabledColor: '#ccc',
      borderColor: '#1976d2',
      headerBgColor: '#ffffff',
      weekendColor: '#d32f2f'
    }
  };

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      basic: [null],
      customFormat: [null],
      constrained: [null],
      maxRange: [null],
      singleDay: [null],
      disabled: [{ start: '2026-01-01', end: '2026-01-31' }],
      sundayStart: [null],
      noClear: [null],
      dualNext: [null],
      dualPrev: [null],
      darkTheme: [null],
      greenTheme: [null],
      customPresets: [null],
      singleMonthNoPresets: [null],
      dualMonthNoPresets: [null],
      customWidth: [null],
      allFeatures: [null]
    });
  }

  getFormValue(controlName: string): any {
    return this.form.get(controlName)?.value;
  }

  getConfigCode(config: IDateRangeConfig): string {
    const configCopy = { ...config };

    // Format the config object for display
    let configStr = JSON.stringify(configCopy, (key, value) => {
      if (value instanceof DateTime) {
        return `DateTime.now().minus({ months: 3 })`; // Placeholder for DateTime objects
      }
      return value;
    }, 2);

    // Clean up DateTime placeholders
    if (config.minDate) {
      configStr = configStr.replace(
        /"minDate": ".*?"/,
        'minDate: DateTime.now().minus({ months: 3 })'
      );
    }
    if (config.maxDate) {
      configStr = configStr.replace(
        /"maxDate": ".*?"/,
        'maxDate: DateTime.now().plus({ months: 3 })'
      );
    }

    // Remove quotes from keys and boolean/number values
    configStr = configStr.replace(/"(\w+)":/g, '$1:');
    configStr = configStr.replace(/: "true"/g, ': true');
    configStr = configStr.replace(/: "false"/g, ': false');
    configStr = configStr.replace(/: "(\d+)"/g, ': $1');

    return configStr;
  }

  setActiveTab(tabId: number): void {
    this.activeTab.set(tabId);
  }

  isActiveTab(tabId: number): boolean {
    return this.activeTab() === tabId;
  }

  defaultPresets = DEFAULT_PRESETS;
}
