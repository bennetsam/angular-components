import { Component, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IDatePreset, DEFAULT_PRESETS } from '../../../models/date-preset.interface';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-preset-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preset-buttons.component.html',
  styleUrl: './preset-buttons.component.scss'
})
export class PresetButtonsComponent {
  // Signal inputs
  presets = input<IDatePreset[]>(DEFAULT_PRESETS);
  disabled = input<boolean>(false);
  width = input<string>('300px');

  // Signal outputs
  presetSelected = output<{ startDate: DateTime; endDate: DateTime }>();

  onPresetClick(preset: IDatePreset): void {
    if (this.disabled()) return;
    const range = preset.getValue();
    this.presetSelected.emit(range);
  }
}
