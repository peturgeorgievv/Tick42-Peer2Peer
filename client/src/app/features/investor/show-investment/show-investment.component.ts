import { User } from 'firebase';
import { Subscription } from 'rxjs';
import { AllPaymentsDTO } from './../../../common/models/all-payments.dto';
import { InvestorService } from './../../../core/services/investor.service';
import { CurrentInvestmentsDTO } from '../../../common/models/current-investments.dto';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { calculateNextDueDate, overallAmount } from '../../../common/calculate-functions/calculate-func';

@Component({
  selector: 'app-show-investment',
  templateUrl: './show-investment.component.html',
  styleUrls: ['./show-investment.component.css']
})

export class ShowInvestmentComponent implements OnInit, OnDestroy {
  @Input() user: User;
  @Input() investmentData: CurrentInvestmentsDTO;

  private subscriptions: Subscription[] = [];

  public date: string;
  public amount: number;
  public period: number;
  public $userId: string;
  public lastName: string;
  public firstName: string;
  public amountLeft: number;
  public totalAmount: number;
  public installment: string;
  public interestRate: number;
  public allPayments: AllPaymentsDTO[] = [];

  constructor(private readonly investorService: InvestorService) { }

  ngOnInit() {

    this.getPayments(this.investmentData.$suggestionId, this.investmentData.$userId);

    this.subscriptions.push(this.investorService.getUserDocData(this.investmentData.$userDocId).subscribe((data) => {
      const userData = data.data();
      this.lastName = userData.lastName;
      this.firstName = userData.firstName;
    }));

    this.amount = this.investmentData.amount;
    this.period = this.investmentData.period;
    this.installment = this.investmentData.installment;
    this.interestRate = this.investmentData.interestRate;
    this.date = this.investmentData.date;

    this.totalAmount = overallAmount(this.amount, this.interestRate, this.period);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  public getPayments(suggestionId: string, userId: string): void {
    this.subscriptions.push(this.investorService
      .getPayments(suggestionId, userId)
      .subscribe((querySnapshot: AllPaymentsDTO[]) => {
        this.allPayments = querySnapshot;
        this.amountLeft = this.totalAmount;
        this.allPayments.forEach((data: AllPaymentsDTO) => (this.amountLeft -= data.amount));
        return this.amountLeft;
      }));
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
