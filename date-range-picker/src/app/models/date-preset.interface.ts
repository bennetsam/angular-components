import { DateTime } from 'luxon';

export interface IDatePreset {
  label: string;
  getValue: () => { startDate: DateTime; endDate: DateTime };
}

export const DEFAULT_PRESETS: IDatePreset[] = [
  {
    label: 'Today',
    getValue: () => ({
      startDate: DateTime.now().startOf('day'),
      endDate: DateTime.now().endOf('day')
    })
  },
  {
    label: 'Yesterday',
    getValue: () => ({
      startDate: DateTime.now().minus({ days: 1 }).startOf('day'),
      endDate: DateTime.now().minus({ days: 1 }).endOf('day')
    })
  },
  {
    label: 'Last 7 Days',
    getValue: () => ({
      startDate: DateTime.now().minus({ days: 6 }).startOf('day'),
      endDate: DateTime.now().endOf('day')
    })
  },
  {
    label: 'Last 30 Days',
    getValue: () => ({
      startDate: DateTime.now().minus({ days: 29 }).startOf('day'),
      endDate: DateTime.now().endOf('day')
    })
  },
  {
    label: 'This Month',
    getValue: () => ({
      startDate: DateTime.now().startOf('month'),
      endDate: DateTime.now().endOf('month')
    })
  },
  {
    label: 'Last Month',
    getValue: () => ({
      startDate: DateTime.now().minus({ months: 1 }).startOf('month'),
      endDate: DateTime.now().minus({ months: 1 }).endOf('month')
    })
  }
];
