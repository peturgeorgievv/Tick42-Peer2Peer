import { UserDTO } from './../../common/models/users/user-data.dto';
import { CreateLoanModalComponent } from './create-loan-modal/create-loan-modal.component';
import { StatusENUM } from './../../common/enums/status.enum';
import { CurrentLoanDTO } from './../../common/models/current-loan.dto';
import { AllPaymentsDTO } from './../../common/models/all-payments.dto';
import { LoanSuggestionDTO } from './../../common/models/loan-suggestion.dto';
import { LoanRequestDTO } from './../../common/models/loan-request.dto';
import { NotificatorService } from './../../core/services/notificator.service';
import { AuthenticationService } from './../../core/services/authentication.service';
import { BorrowerService } from './../../core/services/borrower.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'firebase';
import { Subscription, merge } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-borrower',
  templateUrl: './borrower.component.html',
  styleUrls: ['./borrower.component.css']
})
export class BorrowerComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  public currentLoans: CurrentLoanDTO[] = [];
  public loanRequests: LoanRequestDTO[] = [];
  public loanSuggestions: LoanSuggestionDTO[] = [];

  public user: User;
  public userBalanceData: UserDTO;

  public allPayments: AllPaymentsDTO[] = [];
  public amountPaid = 0;

  constructor(
    private readonly borrowerService: BorrowerService,
    private readonly notificatorService: NotificatorService,
    private readonly authService: AuthenticationService,
    private readonly modalService: NgbModal
  ) {}

  public ngOnInit(): void {
    this.subscriptions.push(
      this.authService.loggedUser$
        .pipe(
          switchMap(res => {
            this.user = res;
            if (this.user) {
              return merge(
                this.borrowerService
                  .getUserLoans(this.user.uid)
                  .pipe(
                    tap(
                      (userLoans: CurrentLoanDTO[]) =>
                        (this.currentLoans = userLoans)
                    )
                  ),
                this.borrowerService
                  .getUserSuggestions()
                  .pipe(
                    tap(
                      (userSuggestions: LoanSuggestionDTO[]) =>
                        (this.loanSuggestions = userSuggestions)
                    )
                  ),
                this.borrowerService
                  .getAllPayments(this.user.uid)
                  .pipe(
                    tap(
                      (allPayment: AllPaymentsDTO[]) =>
                        (this.allPayments = allPayment)
                    )
                  )
              );
            }
            return [];
          })
        )
        .subscribe(() => {
          this.orderLoansAsc('amount');
        })
    );
    this.subscriptions.push(
      this.authService.userBalanceDataSubject$.subscribe(res => {
        this.userBalanceData = res;
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public createLoanRequestModal(): void {
    const createLoanRequestModal = this.modalService.open(
      CreateLoanModalComponent
    );
    createLoanRequestModal.componentInstance.createLoanRequest.subscribe(
      loanData => {
        this.borrowerService
          .createLoanRequest({
            $userId: this.user.uid,
            $userDocId: this.userBalanceData.$userDocId,
            status: StatusENUM.requestOpen,
            ...loanData
          })
          .then(ref => {
            this.borrowerService.addRequestIdToLoan(ref.id);
            this.notificatorService.success(
              'Your request have been added to pending!'
            );
          })
          .catch(() => {
            this.notificatorService.error('Oops, something went wrong!');
          });
      }
    );
  }

  public orderLoansAsc(property: string): void {
    this.subscriptions.push(
      this.borrowerService
        .getUserRequestsAsc(this.user.uid, property)
        .subscribe((querySnapshot: LoanRequestDTO[]): LoanRequestDTO[] => {
          return (this.loanRequests = querySnapshot);
        })
    );
  }

  public orderLoansDesc(property: string): void {
    this.subscriptions.push(
      this.borrowerService
        .getUserRequestsDesc(this.user.uid, property)
        .subscribe((querySnapshot: LoanRequestDTO[]): LoanRequestDTO[] => {
          return (this.loanRequests = querySnapshot);
        })
    );
  }
}
