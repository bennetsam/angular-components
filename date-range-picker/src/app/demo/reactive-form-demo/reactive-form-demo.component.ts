import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateRangePickerComponent } from '../../components/date-range-picker/date-range-picker.component';
import { DateRangeValidators } from '../../validators/date-range.validators';
import { DEFAULT_PRESETS } from '../../models/date-preset.interface';

@Component({
  selector: 'app-reactive-form-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DateRangePickerComponent],
  templateUrl: './reactive-form-demo.component.html',
  styleUrl: './reactive-form-demo.component.scss'
})
export class ReactiveFormDemoComponent implements OnInit {
  form!: FormGroup;
  submittedValue: any = null;
  presets = DEFAULT_PRESETS;

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

  onReset(): void {
    this.form.reset();
    this.submittedValue = null;
  }

  get dateRangeControl() {
    return this.form.get('dateRange');
  }
}
