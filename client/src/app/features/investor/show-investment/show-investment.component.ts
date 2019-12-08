import { InvestorService } from './../../../core/services/investor.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { User } from 'firebase';
import { calculateNextDueDate } from '../../../common/calculate-functions/calculate-func';
import { AllPaymentsDTO } from './../../../common/models/all-payments.dto';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-show-investment',
  templateUrl: './show-investment.component.html',
  styleUrls: ['./show-investment.component.css']
})

export class ShowInvestmentComponent implements OnInit, OnDestroy {
  @Input() investmentData;
  @Input() user: User;

  private paymentsSubscription: Subscription;


  public amount: number;
  public period: number;
  public $userId: string;
  public installment: number;
  public interestRate: number;
  public date: string;
  public allPayments: AllPaymentsDTO[] = [];
  public amountLeft: number;

  constructor(private readonly investorService: InvestorService) { }

  ngOnInit() {
    this.getPayments(this.investmentData.$suggestionId, this.investmentData.$userId);

    this.amount = this.investmentData.amount;
    this.period = this.investmentData.period;
    this.$userId = this.investmentData.$userId;
    this.installment = this.investmentData.installment;
    this.interestRate = this.investmentData.interestRate;
    this.date = this.investmentData.date;
  }

  ngOnDestroy() {
    this.paymentsSubscription.unsubscribe();
  }

  public getPayments(suggestionId: string, userId: string): void {
    this.paymentsSubscription = this.investorService
      .getPayments(suggestionId, userId)
      .subscribe((querySnapshot: AllPaymentsDTO[]) => {
        this.allPayments = querySnapshot;
        this.amountLeft = this.amount;
<<<<<<< HEAD
=======

>>>>>>> cd46e6bf35a69f9e1aeca776648812b36b6a9339
        this.allPayments.forEach((data) => (this.amountLeft -= data.amount));
        return this.amountLeft;
      });
  }

  public calcNextDueDate(): string {
    return calculateNextDueDate(this.date, this.historyAmountsLength(this.allPayments));
  }

  private historyAmountsLength(payments: AllPaymentsDTO[]): number {
    const history = [...payments];
    return history.reduce((acc, data) => {
      if (data.$requestId === this.investmentData.$requestId) {
        return (acc += 1);
      }
      return acc;
    }, 0);
  }


}
