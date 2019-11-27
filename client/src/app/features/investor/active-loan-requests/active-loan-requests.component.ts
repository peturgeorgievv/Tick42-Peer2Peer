import { Component, OnInit, Input } from '@angular/core';
import { InvestorService } from 'src/app/core/services/investor.service';
import { NotificatorService } from 'src/app/core/services/notificator.service';
import * as moment from 'moment';
import { StatusENUM } from 'src/app/common/enums/status.enum';
import { User } from 'firebase';

@Component({
  selector: 'app-active-loan-requests',
  templateUrl: './active-loan-requests.component.html',
  styleUrls: ['./active-loan-requests.component.css']
})
export class ActiveLoanRequestsComponent implements OnInit {

  @Input() requestData;
  @Input() user: User;

  public loanReqId;
  public loanUser;

  public name;
  public totalAmount;
  public period;
  public dateSubmited;
  public partial;

  constructor(
    private readonly investorService: InvestorService,
    private readonly notificatorService: NotificatorService) { }

  ngOnInit() {
    console.log(this.requestData);

    this.name = this.requestData.$userId;
    this.totalAmount = this.requestData.amount;
    this.period = this.requestData.period;
    this.dateSubmited = this.requestData.dateSubmited;
    this.partial = this.requestData.partial;
    this.loanReqId = this.requestData.$requestId;
    this.loanUser = this.user.uid;

  }

  public createSuggestion(suggsetion): void {
    this.investorService
      .createLoanSuggestion({
        $requestId: this.loanReqId,
        $investorId: this.user.uid,
        $userId: this.loanUser,
        status: StatusENUM.suggestionPending,
        dateSubmited: moment(new Date()).format('YYYY-DD-MM'),
        ...suggsetion
      })
      .then((ref) => this.investorService.addSuggestionId(ref.id))
      .catch(() => {
        this.notificatorService.error('Oops, something went wrong!');
      });
  }

  // public loanRequestId(reqId: string) {
  //   return (this.loanReqId = reqId);
  // }

  // public loanUserId(userId: string) {
  //   return (this.loanUser = userId);
  // }

}
