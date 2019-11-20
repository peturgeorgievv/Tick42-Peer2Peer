import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-withdraw',
  templateUrl: './create-withdraw.component.html',
  styleUrls: ['./create-withdraw.component.css']
})
export class CreateWithdrawComponent implements OnInit {
  public createWithdraw: FormGroup;

  @Output() public readonly createWithdrawRequest: EventEmitter<any> = new EventEmitter();

  constructor(private readonly fb: FormBuilder) { }

  ngOnInit() {
    this.createWithdraw = this.fb.group({
      amount: ['', [Validators.required]]
    });
  }

  public emitWithdrawData(withdrawData){
    const withdrawToRemove = {
      ...withdrawData
    };

    this.createWithdrawRequest.emit(withdrawData);
    this.createWithdraw.reset();
  }

}