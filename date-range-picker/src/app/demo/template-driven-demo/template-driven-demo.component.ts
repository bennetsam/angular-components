import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DateRangePickerComponent } from '../../components/date-range-picker/date-range-picker.component';
import { IDateRangeValue } from '../../models/date-range.interface';
import { DEFAULT_PRESETS } from '../../models/date-preset.interface';

@Component({
  selector: 'app-template-driven-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, DateRangePickerComponent],
  templateUrl: './template-driven-demo.component.html',
  styleUrl: './template-driven-demo.component.scss'
})
export class TemplateDrivenDemoComponent {
  dateRange: IDateRangeValue = { start: null, end: null };
  submittedValue: any = null;
  presets = DEFAULT_PRESETS;

  onSubmit(): void {
    this.submittedValue = { ...this.dateRange };
    console.log('Form submitted:', this.submittedValue);
  }

  onReset(): void {
    this.dateRange = { start: null, end: null };
    this.submittedValue = null;
  }

  onRangeChanged(value: IDateRangeValue): void {
    console.log('Range changed:', value);
  }
}
