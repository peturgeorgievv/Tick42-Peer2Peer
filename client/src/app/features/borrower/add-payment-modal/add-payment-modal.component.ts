import { AllPaymentsDTO } from './../../../common/models/all-payments.dto';
import { CurrentLoanDTO } from './../../../common/models/current-loan.dto';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { calculateInstallment } from '../../../common/calculate-functions/calculate-func';
import * as moment from 'moment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-payment-modal',
  templateUrl: './add-payment-modal.component.html',
  styleUrls: ['./add-payment-modal.component.css']
})
export class AddPaymentModalComponent implements OnInit {
  @Output() public readonly createPayment: EventEmitter<
    AllPaymentsDTO
  > = new EventEmitter();
  @Input() loanFullData: CurrentLoanDTO;
  @Input() overdueAmount: number;
  @Input() userCurrentBalance: number;
  public enoughMoney = true;

  constructor(public activeModal: NgbActiveModal) {}

  public ngOnInit(): void {
    if (this.userCurrentBalance < this.loanFullData.installment) {
      this.enoughMoney = false;
    }
  }

  public calcInstallment(amount, interestRate, period): number {
    return calculateInstallment(amount, interestRate, period);
  }

  public emitLoanData(): void {
    const loanToAdd: AllPaymentsDTO = {
      $requestId: this.loanFullData.$requestId,
      $userId: this.loanFullData.$userId,
      $investorId: this.loanFullData.$investorId,
      $investorDocId: this.loanFullData.$investorDocId,
      $suggestionId: this.loanFullData.$suggestionId,
      amount: Number(this.loanFullData.installment),
      date: moment().format('YYYY-MM-DD'),
      overdue: Number(this.overdueAmount.toFixed(2))
    };

    this.createPayment.emit(loanToAdd);
    this.activeModal.close();
  }

  public closeModal(): void {
    this.activeModal.dismiss();
  }
}
