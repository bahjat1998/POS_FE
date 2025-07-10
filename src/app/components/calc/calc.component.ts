import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-calc',
  templateUrl: './calc.component.html',
  styleUrls: ['./calc.component.css']
})
export class CalcComponent {
  @Output() bindVal = new EventEmitter<any>();
  @Input() style = {
    padding: "p-5"
  }
  @Input() set ResetCounter(val: any) {
    if (val == 0) {
      this.inputValue = ''
    }
  }
  inputValue: any = ''
  keys: (string | number)[] = [
    1, 2, 3,
    4, 5, 6,
    7, 8, 9,
    'backspace', 0, '.'
  ];

  onKeyPress(key: string | number) {
    if (key === 'backspace') {
      this.inputValue = this.inputValue.slice(0, -1);
    } else {
      this.inputValue += key.toString();
    }

    this.bindVal.emit(this.inputValue)
  }
}
