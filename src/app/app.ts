import { Component } from '@angular/core';
import { CalculatorComponent } from './calculator/calculator.component';

@Component({
  selector: 'app-root',
  imports: [CalculatorComponent],
  template: '<app-calculator></app-calculator>',
  styles: []
})
export class App {}
