import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-deposit',
  templateUrl: './create-deposit.component.html',
  styleUrls: ['./create-deposit.component.css']
})
export class CreateDepositComponent implements OnInit {
  public createDeposit: FormGroup;

  @Output() public readonly createDepositRequest: EventEmitter<any> = new EventEmitter();

  constructor(private readonly fb: FormBuilder) { }

  ngOnInit() {
    this.createDeposit = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]]
    });
  }

  public emitDepositData(depositData) {
    const depositToAdd = {
      ...depositData
    };

    this.createDepositRequest.emit(depositToAdd);
    this.createDeposit.reset();
  }

}
