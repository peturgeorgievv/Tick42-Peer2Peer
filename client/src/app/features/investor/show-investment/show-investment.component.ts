import { Component, OnInit, Input } from '@angular/core';
import { User } from 'firebase';

@Component({
  selector: 'app-show-investment',
  templateUrl: './show-investment.component.html',
  styleUrls: ['./show-investment.component.css']
})
export class ShowInvestmentComponent implements OnInit {
  @Input() investmentData;
  @Input() user: User;

  public amount: number;
  public period: number;
  public $requestId: string;
  public installment: number;
  public interestRate: number;

  constructor() { }

  ngOnInit() {
    console.log(this.investmentData);

    this.amount = this.investmentData.amount;
    this.period = this.investmentData.period;
    this.$requestId = this.investmentData.$requestId;
    this.installment = this.investmentData.installment;
    this.interestRate = this.investmentData.interestRate;
  }

}
