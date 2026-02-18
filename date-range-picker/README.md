# Date Range Picker for Angular 19

A modern, highly configurable date range picker component built with Angular 19 standalone components, Signals, and Luxon. Fully compatible with Angular Forms (reactive and template-driven) through `ControlValueAccessor`.

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Usage Examples](#-usage-examples)
  - [Reactive Forms](#reactive-forms)
  - [Template-Driven Forms](#template-driven-forms)
  - [Standalone Usage](#standalone-usage)
- [Configuration Options](#-configuration-options)
- [API Documentation](#-api-documentation)
- [All Configuration Examples](#-all-configuration-examples)
- [Validation](#-validation)
- [Theming](#-theming)
- [Testing](#-testing)
- [Development](#-development)
- [Build](#-build)

---

## ✨ Features

### Core Functionality
- ✅ **Single & Dual Month Views** - Display one or two months side-by-side
- ✅ **Flexible Month Modes** - Show current+next or previous+current months
- ✅ **Date Range Selection** - Intuitive click-and-drag range selection
- ✅ **Hover Preview** - Visual preview of range while hovering
- ✅ **Quick Presets** - Built-in presets (Today, Last 7 Days, Last 30 Days, etc.)
- ✅ **Custom Presets** - Define your own date range shortcuts
- ✅ **Week Start Configuration** - Start weeks on Sunday or Monday

### Validation & Constraints
- ✅ **Min/Max Date Limits** - Restrict selectable date ranges
- ✅ **Maximum Range Days** - Limit the span of selectable ranges
- ✅ **Built-in Validators** - Form validators for required, min, max, range validation
- ✅ **Custom Validation** - Component-level validator implementation

### Customization
- ✅ **Custom Themes** - Full theme customization with CSS variables
- ✅ **Dark Mode Support** - Pre-built dark theme example
- ✅ **Custom Width** - Configurable picker width
- ✅ **Date Format** - Customizable display format using Luxon tokens
- ✅ **Optional Clear Button** - Show/hide clear functionality

### Integration
- ✅ **ControlValueAccessor** - Seamless Angular Forms integration
- ✅ **Reactive Forms** - Full support with validators
- ✅ **Template-Driven Forms** - NgModel compatible
- ✅ **Disabled State** - Programmatic enable/disable
- ✅ **Signal-Based** - Modern Angular Signals architecture

### Developer Experience
- ✅ **Standalone Components** - No NgModule dependencies
- ✅ **TypeScript** - Fully typed interfaces and models
- ✅ **Unit Tests** - Comprehensive test coverage
- ✅ **Accessibility** - ARIA labels and keyboard navigation ready
- ✅ **ISO Date Format** - Standard ISO string output

---

## 📦 Installation

### Prerequisites
- Angular 19.x
- Node.js 18.x or later
- npm 9.x or later

### Steps

```bash
# Clone or copy the date-range-picker folder to your project
cd your-angular-project

# Install dependencies
npm install luxon @types/luxon
```

### Import the Component

```typescript
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';

@Component({
  standalone: true,
  imports: [DateRangePickerComponent, /* other imports */],
  // ...
})
export class YourComponent {}
```

---

## 🚀 Quick Start

### Basic Usage

```typescript
import { Component } from '@angular/core';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';
import { IDateRangeValue } from './models/date-range.interface';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [DateRangePickerComponent],
  template: `
    <app-date-range-picker
      (rangeChanged)="onRangeChanged($event)">
    </app-date-range-picker>
  `
})
export class ExampleComponent {
  onRangeChanged(range: IDateRangeValue) {
    console.log('Selected range:', range);
    // range = { start: '2026-02-01', end: '2026-02-28' }
  }
}
```

---

## 📚 Usage Examples

### Reactive Forms

Full example with form validation:

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';
import { DateRangeValidators } from './validators/date-range.validators';
import { IDateRangeConfig } from './models/date-range-config.interface';
import { DEFAULT_PRESETS } from './models/date-preset.interface';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-reactive-demo',
  standalone: true,
  imports: [ReactiveFormsModule, DateRangePickerComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <app-date-range-picker
        formControlName="dateRange"
        [config]="config"
        [presets]="presets">
      </app-date-range-picker>

      @if (dateRangeControl?.invalid && dateRangeControl?.touched) {
        <div class="error">
          @if (dateRangeControl?.errors?.['required']) {
            <p>Date range is required</p>
          }
          @if (dateRangeControl?.errors?.['maxRangeDays']) {
            <p>Range cannot exceed {{ dateRangeControl.errors['maxRangeDays'].max }} days</p>
          }
        </div>
      }

      <button type="submit" [disabled]="form.invalid">Submit</button>
    </form>

    @if (submittedValue) {
      <div class="result">
        <h3>Selected Range:</h3>
        <p>Start: {{ submittedValue.start }}</p>
        <p>End: {{ submittedValue.end }}</p>
      </div>
    }
  `
})
export class ReactiveDemoComponent implements OnInit {
  form!: FormGroup;
  submittedValue: any = null;
  presets = DEFAULT_PRESETS;

  config: IDateRangeConfig = {
    showPresets: true,
    minDate: DateTime.now().minus({ months: 6 }),
    maxDate: DateTime.now().plus({ months: 6 }),
    placeholder: 'Select date range'
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      dateRange: [
        null,
        [
          DateRangeValidators.required(),
          DateRangeValidators.validRange(),
          DateRangeValidators.maxRangeDays(90)
        ]
      ]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submittedValue = this.form.value.dateRange;
      console.log('Form submitted:', this.submittedValue);
    }
  }

  get dateRangeControl() {
    return this.form.get('dateRange');
  }
}
```

### Template-Driven Forms

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';
import { IDateRangeValue } from './models/date-range.interface';
import { DEFAULT_PRESETS } from './models/date-preset.interface';

@Component({
  selector: 'app-template-demo',
  standalone: true,
  imports: [FormsModule, DateRangePickerComponent],
  template: `
    <form #form="ngForm" (ngSubmit)="onSubmit()">
      <app-date-range-picker
        name="dateRange"
        [(ngModel)]="dateRange"
        [presets]="presets"
        (rangeChanged)="onRangeChanged($event)">
      </app-date-range-picker>

      <button type="submit">Submit</button>
    </form>
  `
})
export class TemplateDemoComponent {
  dateRange: IDateRangeValue = { start: null, end: null };
  presets = DEFAULT_PRESETS;

  onSubmit(): void {
    console.log('Form submitted:', this.dateRange);
  }

  onRangeChanged(value: IDateRangeValue): void {
    console.log('Range changed:', value);
  }
}
```

### Standalone Usage

Without forms:

```typescript
import { Component } from '@angular/core';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';
import { IDateRangeValue } from './models/date-range.interface';

@Component({
  selector: 'app-standalone',
  standalone: true,
  imports: [DateRangePickerComponent],
  template: `
    <app-date-range-picker
      (rangeChanged)="handleRangeChange($event)">
    </app-date-range-picker>

    <p>Selected: {{ selectedRange?.start }} to {{ selectedRange?.end }}</p>
  `
})
export class StandaloneComponent {
  selectedRange: IDateRangeValue | null = null;

  handleRangeChange(range: IDateRangeValue): void {
    this.selectedRange = range;
  }
}
```

---

## ⚙️ Configuration Options

### IDateRangeConfig Interface

```typescript
interface IDateRangeConfig {
  startWithSunday?: boolean;        // Start week on Sunday (default: false)
  minDate?: DateTime | null;         // Minimum selectable date
  maxDate?: DateTime | null;         // Maximum selectable date
  maxRangeDays?: number | null;      // Maximum range span in days
  showPresets?: boolean;             // Show preset buttons (default: true)
  allowSingleDay?: boolean;          // Allow single day selection (default: true)
  dateFormat?: string;               // Display format (default: 'dd MMM yyyy')
  showClearButton?: boolean;         // Show clear button (default: true)
  placeholder?: string;              // Input placeholder text
  disabled?: boolean;                // Disabled state
  showTwoMonths?: boolean;           // Show dual month view (default: false)
  twoMonthsMode?: 'current-next' | 'previous-current'; // Dual month mode
  customTheme?: IDateRangeTheme;     // Custom theme colors
  width?: string;                    // Picker width (e.g., '300px', '100%')
}
```

### Default Configuration

```typescript
const DEFAULT_CONFIG: IDateRangeConfig = {
  startWithSunday: false,
  minDate: null,
  maxDate: null,
  maxRangeDays: null,
  showPresets: true,
  allowSingleDay: true,
  dateFormat: 'dd MMM yyyy',
  showClearButton: true,
  placeholder: 'Select date range',
  disabled: false,
  showTwoMonths: false,
  twoMonthsMode: 'current-next',
  customTheme: undefined,
  width: '300px'
};
```

---

## 📖 API Documentation

### Component: DateRangePickerComponent

#### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `config` | `IDateRangeConfig` | `DEFAULT_CONFIG` | Configuration object |
| `presets` | `IDatePreset[]` | `[]` | Custom preset buttons |

#### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `rangeChanged` | `IDateRangeValue` | Emitted when date range changes |

#### Form Control Integration

Implements `ControlValueAccessor` and `Validator`:

```typescript
// Use with formControlName
<app-date-range-picker formControlName="dateRange" />

// Use with ngModel
<app-date-range-picker [(ngModel)]="dateRange" />
```

### Models

#### IDateRangeValue

```typescript
interface IDateRangeValue {
  start: string | null;  // ISO format: '2026-02-01'
  end: string | null;    // ISO format: '2026-02-28'
}
```

#### IDatePreset

```typescript
interface IDatePreset {
  label: string;
  getValue: () => { startDate: DateTime; endDate: DateTime };
}
```

Example custom preset:

```typescript
const customPresets: IDatePreset[] = [
  {
    label: 'Q1 2026',
    getValue: () => ({
      startDate: DateTime.local(2026, 1, 1),
      endDate: DateTime.local(2026, 3, 31)
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
```

#### IDateRangeTheme

```typescript
interface IDateRangeTheme {
  primaryColor?: string;        // Primary accent color
  accentColor?: string;         // Secondary accent color
  selectedBgColor?: string;     // Selected date background
  selectedTextColor?: string;   // Selected date text
  rangeBgColor?: string;        // Range background
  hoverBgColor?: string;        // Hover state background
  disabledColor?: string;       // Disabled date color
  borderColor?: string;         // Border color
  headerBgColor?: string;       // Calendar header background
  weekendColor?: string;        // Weekend date color
}
```

---

## 🎯 All Configuration Examples

### 1. Basic Configuration

```typescript
const basicConfig: IDateRangeConfig = {
  showPresets: true,
  startWithSunday: false,
  placeholder: 'Select date range'
};
```

### 2. Custom Date Format

```typescript
const customFormatConfig: IDateRangeConfig = {
  dateFormat: 'yyyy-MM-dd',
  showPresets: false,
  placeholder: 'YYYY-MM-DD format'
};
```

### 3. Min/Max Date Constraints

```typescript
const constrainedConfig: IDateRangeConfig = {
  minDate: DateTime.now().minus({ months: 3 }),
  maxDate: DateTime.now().plus({ months: 3 }),
  showPresets: true,
  placeholder: 'Last 3 months to next 3 months'
};
```

### 4. Maximum Range Limit

```typescript
const maxRangeConfig: IDateRangeConfig = {
  maxRangeDays: 30,
  showPresets: true,
  placeholder: 'Maximum 30 days range'
};
```

### 5. Single Day Selection

```typescript
const singleDayConfig: IDateRangeConfig = {
  allowSingleDay: true,
  maxRangeDays: 0,
  showPresets: false,
  placeholder: 'Single day only'
};
```

### 6. Disabled State

```typescript
const disabledConfig: IDateRangeConfig = {
  disabled: true,
  placeholder: 'Disabled picker'
};
```

### 7. Sunday Start Week

```typescript
const sundayStartConfig: IDateRangeConfig = {
  startWithSunday: true,
  showPresets: true,
  placeholder: 'Week starts on Sunday'
};
```

### 8. No Clear Button

```typescript
const noClearConfig: IDateRangeConfig = {
  showClearButton: false,
  showPresets: true,
  placeholder: 'No clear button'
};
```

### 9. Dual Month (Current + Next)

```typescript
const dualMonthNextConfig: IDateRangeConfig = {
  showTwoMonths: true,
  twoMonthsMode: 'current-next',
  showPresets: true,
  placeholder: 'Current + Next month'
};
```

### 10. Dual Month (Previous + Current)

```typescript
const dualMonthPrevConfig: IDateRangeConfig = {
  showTwoMonths: true,
  twoMonthsMode: 'previous-current',
  showPresets: true,
  placeholder: 'Previous + Current month'
};
```

### 11. Dark Theme

```typescript
const darkThemeConfig: IDateRangeConfig = {
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
```

### 12. Green Theme

```typescript
const greenThemeConfig: IDateRangeConfig = {
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
```

### 13. Custom Presets

```typescript
const customPresets: IDatePreset[] = [
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
  }
];

const customPresetsConfig: IDateRangeConfig = {
  showPresets: true,
  placeholder: 'Custom presets (Quarters)'
};
```

### 14. Single Month No Presets

```typescript
const singleMonthNoPresetsConfig: IDateRangeConfig = {
  showPresets: false,
  showTwoMonths: false,
  placeholder: 'Single month, no presets'
};
```

### 15. Dual Month No Presets

```typescript
const dualMonthNoPresetsConfig: IDateRangeConfig = {
  showPresets: false,
  showTwoMonths: true,
  twoMonthsMode: 'current-next',
  placeholder: 'Dual month, no presets'
};
```

### 16. Custom Width

```typescript
const customWidthConfig: IDateRangeConfig = {
  showPresets: true,
  width: '400px',
  placeholder: 'Custom width: 400px'
};
```

### 17. All Features Combined

```typescript
const allFeaturesConfig: IDateRangeConfig = {
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
```

---

## ✅ Validation

### Built-in Component Validator

The component implements Angular's `Validator` interface:

```typescript
// Automatically validates:
// - End date after start date
// - Min/max date constraints
// - Maximum range days limit

<app-date-range-picker formControlName="dateRange" [config]="config" />
```

### Custom Validators

Import and use standalone validators:

```typescript
import { DateRangeValidators } from './validators/date-range.validators';

this.form = this.fb.group({
  dateRange: [
    null,
    [
      DateRangeValidators.required(),           // Both dates required
      DateRangeValidators.validRange(),         // End after start
      DateRangeValidators.minDate(minDateTime), // Minimum date
      DateRangeValidators.maxDate(maxDateTime), // Maximum date
      DateRangeValidators.maxRangeDays(30)      // Max 30 days range
    ]
  ]
});
```

### Error Handling

```typescript
// Check for validation errors
@if (control?.errors?.['required']) {
  <p>Date range is required</p>
}
@if (control?.errors?.['invalidRange']) {
  <p>End date must be after start date</p>
}
@if (control?.errors?.['minDate']) {
  <p>Start date is before minimum allowed date</p>
}
@if (control?.errors?.['maxDate']) {
  <p>End date is after maximum allowed date</p>
}
@if (control?.errors?.['maxRangeDays']) {
  <p>Range exceeds {{ control.errors['maxRangeDays'].max }} days</p>
}
```

---

## 🎨 Theming

### Default Theme

```typescript
const DEFAULT_THEME: IDateRangeTheme = {
  primaryColor: '#1976d2',
  accentColor: '#1976d2',
  selectedBgColor: '#1976d2',
  selectedTextColor: '#ffffff',
  rangeBgColor: '#bbdefb',
  hoverBgColor: '#e3f2fd',
  disabledColor: '#ccc',
  borderColor: '#ccc',
  headerBgColor: '#ffffff',
  weekendColor: '#d32f2f'
};
```

### Custom Theme Example

```typescript
const myTheme: IDateRangeTheme = {
  primaryColor: '#9c27b0',      // Purple
  selectedBgColor: '#9c27b0',
  selectedTextColor: '#ffffff',
  rangeBgColor: '#e1bee7',
  hoverBgColor: '#f3e5f5',
  weekendColor: '#ff5722'
};

const config: IDateRangeConfig = {
  customTheme: myTheme
};
```

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Test Coverage

The project includes comprehensive unit tests:
- ✅ Component tests (date-range-picker.component.spec.ts)
- ✅ Service tests (date-range.service.spec.ts)
- ✅ Subcomponent tests (calendar-popup, preset-buttons)
- ✅ Utility tests (date.utils.spec.ts)
- ✅ Validator tests (date-range.validators.spec.ts)

### Example Test

```typescript
it('should validate valid range', () => {
  const control = new FormControl({
    start: '2026-02-01',
    end: '2026-02-28'
  });
  const errors = component.validate(control);
  expect(errors).toBeNull();
});
```

---

## 💻 Development

### Prerequisites

```bash
node --version  # v18.x or later
npm --version   # v9.x or later
```

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm start

# Application runs at http://localhost:4200
```

### Project Structure

```
src/app/
├── components/
│   └── date-range-picker/
│       ├── date-range-picker.component.ts
│       ├── date-range-picker.component.html
│       ├── date-range-picker.component.scss
│       ├── calendar-popup/
│       │   ├── calendar-popup.component.ts
│       │   ├── calendar-popup.component.html
│       │   └── calendar-popup.component.scss
│       └── preset-buttons/
│           ├── preset-buttons.component.ts
│           ├── preset-buttons.component.html
│           └── preset-buttons.component.scss
├── services/
│   └── date-range.service.ts           # State management
├── models/
│   ├── date-range-config.interface.ts  # Configuration types
│   ├── date-range.interface.ts         # Range value types
│   ├── date-preset.interface.ts        # Preset types
│   └── calendar-day.interface.ts       # Calendar cell types
├── validators/
│   └── date-range.validators.ts        # Form validators
├── utils/
│   └── date.utils.ts                   # Date utilities
└── demo/
    ├── configuration-demo/             # All config examples
    ├── reactive-form-demo/             # Reactive forms demo
    └── template-driven-demo/           # Template forms demo
```

### Architecture

- **Standalone Components:** No NgModule dependencies
- **Signal-Based State:** Modern reactive state with Angular Signals
- **Service Layer:** `DateRangeService` manages calendar state
- **Utility Layer:** Pure functions for date calculations
- **Type-Safe:** Full TypeScript interfaces

---

## 🔨 Build

### Development Build

```bash
npm run build
```

### Production Build

```bash
npm run build -- --configuration production
```

Build artifacts will be stored in the `dist/` directory.

### Watch Mode

```bash
npm run watch
```

Automatically rebuilds on file changes.

---

## 🚀 Demo Pages

The project includes three demo pages accessible via routes:

1. **Configuration Demo** (`/configuration-demo`)
   - Shows all 17 configuration examples
   - Interactive tabbed interface
   - Live code examples

2. **Reactive Form Demo** (`/reactive-demo`)
   - Full reactive forms integration
   - Validation examples
   - Form submission handling

3. **Template-Driven Demo** (`/template-driven-demo`)
   - NgModel integration
   - Two-way data binding
   - Event handling

Access demos at: http://localhost:4200

---

## 📄 Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server on port 4200 |
| `npm run build` | Build for production |
| `npm run watch` | Build in watch mode |
| `npm test` | Run unit tests |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:watch` | Run tests in watch mode |

---

## 🔗 Dependencies

### Production
- `@angular/common`: ^19.2.0
- `@angular/core`: ^19.2.0
- `@angular/forms`: ^19.2.0
- `luxon`: ^3.7.2
- `@types/luxon`: ^3.7.1

### Development
- `@angular/cli`: ^19.2.9
- `jasmine-core`: ~5.6.0
- `karma`: ~6.4.0
- `typescript`: ~5.7.2

---

## 🤝 Contributing

When contributing:
1. Maintain signal-based architecture
2. Add unit tests for new features
3. Update documentation
4. Follow Angular style guide
5. Ensure all tests pass

---

## 📝 Notes

- All dates use **ISO format** (YYYY-MM-DD) for consistency
- Internally uses **Luxon DateTime** objects
- Calendar generates **42 days** (6 weeks) for consistent grid
- Service provided at **component level** for isolation
- Supports both **reactive** and **template-driven** forms

---

## 🐛 Known Issues

- None currently reported

---

## 📅 Roadmap

Potential future enhancements:
- Time picker integration
- Year/month quick navigation
- Keyboard shortcuts
- Multi-range selection
- Recurring date patterns

---

**Built with Angular 19 & Signals | February 2026**

For issues or questions, refer to the demo pages or review the comprehensive test suite.
