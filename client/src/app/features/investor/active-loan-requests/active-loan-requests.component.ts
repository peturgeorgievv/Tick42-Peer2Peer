import { UserDTO } from './../../../common/models/users/user-data.dto';
import { AuthenticationService } from './../../../core/services/authentication.service';
import { Component, OnInit, Input } from '@angular/core';
import { InvestorService } from 'src/app/core/services/investor.service';
import { NotificatorService } from 'src/app/core/services/notificator.service';
import * as moment from 'moment';
import { StatusENUM } from 'src/app/common/enums/status.enum';
import { User } from 'firebase';
import undefined = require('firebase/empty-import');

@Component({
  selector: 'app-active-loan-requests',
  templateUrl: './active-loan-requests.component.html',
  styleUrls: ['./active-loan-requests.component.css']
})
export class ActiveLoanRequestsComponent implements OnInit {
  @Input() requestData;
  @Input() user: User;

  public userBalanceData: UserDTO;

  public loanReqId;
  public loanUser;

  public name;
  public totalAmount;
  public period;
  public dateSubmited;
  public partial;

  constructor(
    private readonly investorService: InvestorService,
    private readonly notificatorService: NotificatorService,
    private readonly authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.name = this.requestData.$userId;
    this.totalAmount = this.requestData.amount;
    this.period = this.requestData.period;
    this.dateSubmited = this.requestData.dateSubmited;
    this.partial = this.requestData.partial;
    this.loanReqId = this.requestData.$requestId;
    this.loanUser = this.user.uid;

    this.authService.userBalanceDataSubject$.subscribe((res) => {
      if (res !== undefined) {
        this.userBalanceData = res;
      }
    });


  }

  public createSuggestion(suggsetion): void {
    this.investorService
      .createLoanSuggestion({
        $requestId: this.loanReqId,
        $investorId: this.user.uid,
        $investorDocId: this.userBalanceData.$userDocId,
        $userId: this.loanUser,
        status: StatusENUM.suggestionPending,
        dateSubmited: moment(new Date()).format('YYYY-DD-MM'),
        ...suggsetion
      })
      .then((ref) => {
        this.investorService.addSuggestionId(ref.id);
        this.notificatorService.success('Your proposal has been added!');
      })
      .catch(() => {
        this.notificatorService.error('Oops, something went wrong!');
      });
  }

  public createPartialSuggestion(suggsetion): void {
    this.investorService
      .createLoanSuggestion({
        $requestId: this.loanReqId,
        $investorId: this.user.uid,
        $investorDocId: this.userBalanceData.$userDocId,
        $userId: this.loanUser,
        status: StatusENUM.suggestionPending,
        dateSubmited: moment(new Date()).format('YYYY-DD-MM'),
        ...suggsetion
      })
      .then((ref) => {
        this.investorService.addSuggestionId(ref.id);
        this.notificatorService.success('Your proposal has been added!');
      })
      .catch(() => {
        this.notificatorService.error('Oops, something went wrong!');
      });
  }

}
