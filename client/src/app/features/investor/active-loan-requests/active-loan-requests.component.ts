import { ProposeModalComponent } from './../propose-modal/propose-modal.component';
import { UserDTO } from './../../../common/models/users/user-data.dto';
import { AuthenticationService } from './../../../core/services/authentication.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { InvestorService } from 'src/app/core/services/investor.service';
import { NotificatorService } from 'src/app/core/services/notificator.service';
import * as moment from 'moment';
import { StatusENUM } from 'src/app/common/enums/status.enum';
import { User } from 'firebase';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PartialProposeModalComponent } from '../partial-propose-modal/partial-propose-modal.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-active-loan-requests',
  templateUrl: './active-loan-requests.component.html',
  styleUrls: ['./active-loan-requests.component.css']
})
export class ActiveLoanRequestsComponent implements OnInit, OnDestroy {
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

  private subscriptions: Subscription[] = [];

  constructor(
    private readonly investorService: InvestorService,
    private readonly notificatorService: NotificatorService,
    private readonly authService: AuthenticationService,
    private readonly modalService: NgbModal,
  ) {
    this.subscriptions.push(this.authService.userBalanceDataSubject$.subscribe((res) => {
      this.userBalanceData = res;
    }));
  }

  ngOnInit() {
    this.name = this.requestData.$userId;
    this.totalAmount = this.requestData.amount;
    this.period = this.requestData.period;
    this.dateSubmited = this.requestData.dateSubmited;
    this.partial = this.requestData.partial;
    this.loanReqId = this.requestData.$requestId;
    this.loanUser = this.user.uid;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  public createSuggestion(suggestion): void {
    this.investorService
      .createLoanSuggestion({
        $requestId: this.loanReqId,
        $investorId: this.user.uid,
        $investorDocId: this.userBalanceData.$userDocId,
        $userId: this.loanUser,
        status: StatusENUM.suggestionPending,
        dateSubmited: moment(new Date()).format('YYYY-DD-MM'),
        ...suggestion
      })
      .then((ref) => {
        this.investorService.addSuggestionId(ref.id);
        this.notificatorService.success('Your proposal has been added!');
      })
      .catch(() => {
        this.notificatorService.error('Oops, something went wrong!');
      });
  }

  public createPartialSuggestion(suggestion): void {
    this.investorService
      .createLoanSuggestion({
        $requestId: this.loanReqId,
        $investorId: this.user.uid,
        $investorDocId: this.userBalanceData.$userDocId,
        $userId: this.loanUser,
        status: StatusENUM.suggestionPending,
        dateSubmited: moment(new Date()).format('YYYY-DD-MM'),
        ...suggestion
      })
      .then((ref) => {
        this.investorService.addSuggestionId(ref.id);
        this.notificatorService.success('Your proposal has been added!');
      })
      .catch(() => {
        this.notificatorService.error('Oops, something went wrong!');
      });
  }

  createProposeModal(): void {
    const createProposeModal = this.modalService.open(ProposeModalComponent);
    createProposeModal.componentInstance.requestData = this.requestData;

    createProposeModal.componentInstance.createSuggestion
      .subscribe((proposeData) => {
        this.createSuggestion(proposeData);
      });
  }

  createPartialProposeModal(): void {
    const createPartialProposeModal = this.modalService.open(PartialProposeModalComponent);
    createPartialProposeModal.componentInstance.requestData = this.requestData;

    createPartialProposeModal.componentInstance.createPartialSuggestion
      .subscribe((proposeData) => {
        this.createPartialSuggestion(proposeData);
      });
  }

}
