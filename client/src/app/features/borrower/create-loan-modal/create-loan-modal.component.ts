import { LoanRequestDTO } from 'src/app/common/models/loan-request.dto';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-loan-modal',
  templateUrl: './create-loan-modal.component.html',
  styleUrls: ['./create-loan-modal.component.css']
})
export class CreateLoanModalComponent implements OnInit {
  public createLoan: FormGroup;

  @Output() public readonly createLoanRequest: EventEmitter<
    any
  > = new EventEmitter();

  constructor(
    private readonly formBuilder: FormBuilder,
    public activeModal: NgbActiveModal
  ) {}

  public ngOnInit(): void {
    this.createLoan = this.formBuilder.group({
      period: [
        '',
        [Validators.required, Validators.min(1), Validators.max(240)]
      ],
      amount: [
        '',
        [Validators.required, Validators.min(1), Validators.max(1000000)]
      ],
      partial: [false]
    });
  }

  public emitLoanData(loanData: LoanRequestDTO): void {
    const loanToAdd = {
      ...loanData,
      dateSubmited: moment(new Date()).format('YYYY-DD-MM')
    };

    this.createLoanRequest.emit(loanToAdd);
    this.createLoan.reset();
    this.activeModal.close();
  }

  public closeModal(): void {
    this.activeModal.dismiss();
  }
}
