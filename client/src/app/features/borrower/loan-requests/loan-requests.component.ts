import { EditLoanDTO } from './../../../common/models/edit-loan.dto';
import { AuthenticationService } from './../../../core/services/authentication.service';
import { UserDTO } from './../../../common/models/users/user-data.dto';
import { StatusENUM } from './../../../common/enums/status.enum';
import { Subscription } from 'rxjs';
import { LoanSuggestionDTO } from './../../../common/models/loan-suggestion.dto';
import { User } from 'firebase';
import { BorrowerService } from './../../../core/services/borrower.service';
import { LoanRequestDTO } from './../../../common/models/loan-request.dto';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import {
  calculateInstallment,
  overallAmount
} from '../../../common/calculate-functions/calculate-func';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-loan-requests',
  templateUrl: './loan-requests.component.html',
  styleUrls: ['./loan-requests.component.css']
})
export class LoanRequestsComponent implements OnInit, OnDestroy {
  @Input() loanRequestData: LoanRequestDTO;
  @Input() loanSuggestions: LoanRequestDTO;
  @Input() user: User;
  private subscriptions: Subscription[] = [];
  public userBalanceData: UserDTO;

  public amount: number;
  public period: number;
  public totalAmount: number;
  public dateSubmited: string;
  public partial: boolean;
  public amountLeftToInvest = 0;
  public $requestId: string;
  public edit = false;
  public validateMin = 0;
  public editLoanForm: FormGroup;

  constructor(
    private readonly borrowerService: BorrowerService,
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthenticationService
  ) {}

  public ngOnInit(): void {
    this.amount = this.loanRequestData.amount;
    this.period = this.loanRequestData.period;
    this.partial = this.loanRequestData.partial;
    this.$requestId = this.loanRequestData.$requestId;
    this.dateSubmited = this.loanRequestData.dateSubmited;

    if (this.loanRequestData.$requestId && this.partial) {
      this.subscriptions.push(
        this.borrowerService
          .findPartialRequestLoans(this.loanRequestData.$requestId)
          .subscribe((data: LoanRequestDTO[]) => {
            this.amountLeftToInvest = this.amount;
            data.forEach(loan => {
              if (loan.amount) {
                this.amountLeftToInvest -= loan.amount;
              }
              this.editFormValidation();
            });
          })
      );
    }

    this.editLoanForm = this.formBuilder.group({
      amount: [this.amount, [Validators.required]]
    });

    this.subscriptions.push(
      this.authService.userBalanceDataSubject$.subscribe(res => {
        this.userBalanceData = res;
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public calculateTotalAmount(
    amount: number,
    interestRate: number,
    period: number
  ): number {
    return (this.totalAmount = overallAmount(amount, interestRate, period));
  }

  public editFormValidation(): void {
    const validateAmount = this.amount - this.amountLeftToInvest;
    if (this.partial && this.amountLeftToInvest > 0) {
      return this.editLoanForm.controls['amount'].setValidators([
        Validators.min(validateAmount)
      ]);
    }
    return this.editLoanForm.controls['amount'].setValidators([
      Validators.min(0)
    ]);
  }

  public resetForm(): void {
    this.edit = !this.edit;
    this.editLoanForm.setValue({ amount: this.amount });
  }

  public editLoanRequest(data: EditLoanDTO): void {
    this.edit = false;
    if (this.partial) {
      this.amountLeftToInvest =
        this.amountLeftToInvest - (this.amount - data.amount);
    } else {
      this.amountLeftToInvest = data.amount;
    }
    this.borrowerService
      .editRequestAmount(this.$requestId, data.amount)
      .then(() => {
        this.subscriptions.push(
          this.borrowerService.rejectBiggerLoanSuggestions(
            this.$requestId,
            this.amountLeftToInvest
          )
        );
      });
  }

  public deleteRequest(): void {
    this.borrowerService.rejectLoanSuggestions(this.$requestId);
    this.borrowerService.rejectLoanRequests(this.$requestId);
  }

  public rejectSuggestion(suggestionId: string): void {
    this.borrowerService.rejectLoanSuggestions(suggestionId);
  }

  public acceptRequest(suggestion: LoanSuggestionDTO): void {
    let partial = false;
    if (this.partial && this.amountLeftToInvest - suggestion.amount > 0) {
      partial = true;
    } else {
      partial = false;
    }

    this.borrowerService
      .acceptLoanRequest({
        date: moment().format('YYYY-MM-DD'),
        installment: calculateInstallment(
          suggestion.amount,
          suggestion.interestRate,
          suggestion.period
        ).toFixed(2),
        ...suggestion,
        $userDocId: this.loanRequestData.$userDocId,
        $userId: this.user.uid,
        status: StatusENUM.current
      })
      .then(() => {
        const balance = (this.userBalanceData.currentBalance +=
          suggestion.amount);
        this.borrowerService
          .getUserDocData(this.userBalanceData.$userDocId)
          .set(
            {
              currentBalance: Number(balance.toFixed(2))
            },
            { merge: true }
          );

        this.subscriptions.push(
          this.borrowerService
            .getUserDocData(suggestion.$investorDocId)
            .get()
            .subscribe(userData => {
              const userBalanceData = userData.data();
              const investorBalance = (userBalanceData.currentBalance -=
                suggestion.amount);
              this.borrowerService
                .getUserDocData(suggestion.$investorDocId)
                .set(
                  {
                    currentBalance: Number(investorBalance.toFixed(2))
                  },
                  { merge: true }
                );
            })
        );
        if (partial) {
          this.borrowerService.findLoanSuggestion(suggestion.$suggestionId);
          this.subscriptions.push(
            this.borrowerService.rejectBiggerPartialLoanSuggestions(
              suggestion.$requestId,
              this.amountLeftToInvest
            )
          );
        } else {
          this.subscriptions.push(
            this.borrowerService.rejectLoanSuggestions(suggestion.$requestId)
          );
          this.subscriptions.push(
            this.borrowerService.rejectLoanRequests(suggestion.$requestId)
          );
        }
      });
  }
}
