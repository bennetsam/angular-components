import { Routes } from '@angular/router';
import { ReactiveFormDemoComponent } from './demo/reactive-form-demo/reactive-form-demo.component';
import { TemplateDrivenDemoComponent } from './demo/template-driven-demo/template-driven-demo.component';
import { ConfigurationDemoComponent } from './demo/configuration-demo/configuration-demo.component';

export const routes: Routes = [
  { path: '', redirectTo: '/configuration-demo', pathMatch: 'full' },
  { path: 'reactive-demo', component: ReactiveFormDemoComponent },
  { path: 'template-driven-demo', component: TemplateDrivenDemoComponent },
  { path: 'configuration-demo', component: ConfigurationDemoComponent }
];
