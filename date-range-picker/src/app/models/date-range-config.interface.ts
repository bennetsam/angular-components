import { DateTime } from 'luxon';

export interface IDateRangeTheme {
  primaryColor?: string;
  accentColor?: string;
  selectedBgColor?: string;
  selectedTextColor?: string;
  rangeBgColor?: string;
  hoverBgColor?: string;
  disabledColor?: string;
  borderColor?: string;
  headerBgColor?: string;
  weekendColor?: string;
}

export interface IDateRangeConfig {
  startWithSunday?: boolean;
  minDate?: DateTime | null;
  maxDate?: DateTime | null;
  maxRangeDays?: number | null;
  showPresets?: boolean;
  allowSingleDay?: boolean;
  dateFormat?: string;
  showClearButton?: boolean;
  placeholder?: string;
  disabled?: boolean;
  showTwoMonths?: boolean;
  twoMonthsMode?: 'current-next' | 'previous-current';
  customTheme?: IDateRangeTheme;
  width?: string; // CSS width value (e.g., '300px', '100%', '20rem')
}

export const DEFAULT_CONFIG: IDateRangeConfig = {
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
  customTheme: undefined
};

export const DEFAULT_THEME: IDateRangeTheme = {
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
