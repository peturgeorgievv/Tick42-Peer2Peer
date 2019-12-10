import { User } from 'firebase';
import { UserDTO } from './../../../common/models/users/user-data.dto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StatusENUM } from '../../../common/enums/status.enum';
import { Subscription } from 'rxjs';
import { RequestDataDTO } from './../../../common/models/request-data.dto';
import { InvestorService } from 'src/app/core/services/investor.service';
import { NotificatorService } from 'src/app/core/services/notificator.service';
import { ProposeSuggestionDTO } from './../../../common/models/propose-suggestion.dto';
import { ProposeModalComponent } from './../propose-modal/propose-modal.component';
import { AuthenticationService } from './../../../core/services/authentication.service';
import { PartialProposeModalComponent } from '../partial-propose-modal/partial-propose-modal.component';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import * as moment from 'moment';


@Component({
  selector: 'app-active-loan-requests',
  templateUrl: './active-loan-requests.component.html',
  styleUrls: ['./active-loan-requests.component.css']
})
export class ActiveLoanRequestsComponent implements OnInit, OnDestroy {
  @Input() user: User;
  @Input() requestData: RequestDataDTO;

  public period: number;
  public partial: boolean;
  public lastName: string;
  public loanUser: string;
  public loanReqId: string;
  public firstName: string;
  public totalAmount: number;
  public dateSubmited: string;
  public userBalanceData: UserDTO;
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
    this.subscriptions.push(this.investorService.getUserDocData(this.requestData.$userDocId).subscribe((data) => {
      const userData = data.data();
      this.firstName = userData.firstName;
      this.lastName = userData.lastName;
    }));

    this.totalAmount = this.requestData.amount;
    this.period = this.requestData.period;
    this.dateSubmited = this.requestData.dateSubmited;
    this.partial = this.requestData.partial;
    this.loanReqId = this.requestData.$requestId;
    this.loanUser = this.user.uid;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  public createSuggestion(suggestion: ProposeSuggestionDTO): void {
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

  public createPartialSuggestion(suggestion: ProposeSuggestionDTO): void {
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
    createProposeModal.componentInstance.userBalanceData = this.userBalanceData;

    createProposeModal.componentInstance.createSuggestion
      .subscribe((proposeData) => {
        this.createSuggestion(proposeData);
      });
  }

  createPartialProposeModal(): void {
    const createPartialProposeModal = this.modalService.open(PartialProposeModalComponent);
    createPartialProposeModal.componentInstance.requestData = this.requestData;
    createPartialProposeModal.componentInstance.userBalanceData = this.userBalanceData;

    createPartialProposeModal.componentInstance.createPartialSuggestion
      .subscribe((proposeData) => {
        this.createPartialSuggestion(proposeData);
      });
  }
}
