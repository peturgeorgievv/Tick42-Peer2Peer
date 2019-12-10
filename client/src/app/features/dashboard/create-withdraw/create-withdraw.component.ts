import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BalanceDataDTO } from './../../../common/models/balance-data.dto';
import { DepositWithdrawDTO } from './../../../common/models/deposit-withdral.dto';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-create-withdraw',
  templateUrl: './create-withdraw.component.html',
  styleUrls: ['./create-withdraw.component.css']
})

export class CreateWithdrawComponent implements OnInit {
  public createWithdraw: FormGroup;

  @Input() userData: BalanceDataDTO;
  @Output() public readonly createWithdrawRequest: EventEmitter<any> = new EventEmitter();

  constructor(
    private readonly fb: FormBuilder,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    this.createWithdraw = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1), Validators.max(this.userData.currentBalance)]]
    });
  }

  public emitWithdrawData(withdrawData: DepositWithdrawDTO) {
    const withdrawToRemove: DepositWithdrawDTO = {
      ...withdrawData
    };

    this.createWithdrawRequest.emit(withdrawToRemove);
    this.createWithdraw.reset();
    this.activeModal.close();
  }

  public closeModal(): void {
    this.activeModal.dismiss();
  }
}
