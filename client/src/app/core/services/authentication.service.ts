import { StatusENUM } from './../../common/enums/status.enum';
import { NotificatorService } from 'src/app/core/services/notificator.service';
import { calculateNextDueDate } from './../../common/calculate-functions/calculate-func';
import { UserDTO } from './../../common/models/users/user-data.dto';
import { CurrentLoanDTO } from './../../common/models/current-loan.dto';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, BehaviorSubject, Subscription, merge } from 'rxjs';
import { User } from 'firebase';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly user$: BehaviorSubject<User> = new BehaviorSubject(
    this.loggedUser()
  );

  private readonly userBalanceData$: BehaviorSubject<any> = new BehaviorSubject(
    this.userBalanceDataCalculation()
  );

  private subscriptions: Subscription[] = [];

  constructor(
    private readonly angularFireAuth: AngularFireAuth,
    private readonly angularFireStore: AngularFirestore,
    private readonly router: Router,
    private readonly notificatorService: NotificatorService
  ) {
    this.angularFireAuth.authState.subscribe((user: User) => {
      try {
        if (user) {
          this.user$.next(user);
          localStorage.setItem('user', JSON.stringify(user));
          this.userBalanceData$.next(this.userBalanceDataCalculation());
        } else {
          this.user$.next(null);
          this.userBalanceData$.next(null);
          localStorage.setItem('user', null);
        }
      } catch (error) {
        return null;
      }
    });
  }

  public getNextDueDate(userId: string) {
    let loans = [];
    let payments = [];
    let nextDueDate = [];
    return this.angularFireStore
      .collection('loans', ref =>
        ref
          .where('$userId', '==', userId)
          .where('status', '==', StatusENUM.current)
      )
      .valueChanges()
      .pipe(
        switchMap(loansData => {
          loans = loansData;
          return this.angularFireStore
            .collection('paymentsHistory', ref =>
              ref.where('$userId', '==', userId)
            )
            .valueChanges();
        })
      )
      .pipe(
        map(data => {
          nextDueDate = [];
          payments = data;
          loans.forEach((loanData: CurrentLoanDTO) => {
            const paymentsHistory = payments.reduce((acc, paymentData) => {
              if (paymentData.$requestId === loanData.$requestId) {
                return (acc += 1);
              }
              return acc;
            }, 0);
            nextDueDate.push(
              calculateNextDueDate(loanData.date, paymentsHistory)
            );
            nextDueDate.sort((a, b) => {
              a = a
                .split('/')
                .reverse()
                .join('');
              b = b
                .split('/')
                .reverse()
                .join('');
              return a.localeCompare(b);
            });
          });
          return nextDueDate;
        })
      );
  }

  private userBalanceDataCalculation(): void {
    try {
      let userData = {
        totalDebt: 0,
        totalInvestment: 0
      };
      let userDebts = 0;
      let userInvestments = 0;
      this.angularFireAuth.user.subscribe((user: User) => {
        if (user) {
          this.subscriptions.push(
            this.angularFireStore
              .collection('users', ref => ref.where('$userId', '==', user.uid))
              .valueChanges()
              .pipe(
                switchMap(
                  (userDataSnapshot: Partial<UserDTO[]>) => {
                    if (!userDataSnapshot[0]) {
                      return;
                    }
                    userData = {
                      ...userDataSnapshot[0],
                      ...userData
                    };
                    return merge(
                      this.getUserLoans(user.uid).pipe(
                        tap(
                          (debts: CurrentLoanDTO[]) => {
                            userDebts = this.reduceLoanAmount(debts);
                          }
                        )
                      ),
                      this.getUserPayments(user.uid).pipe(
                        tap(
                          (payments: CurrentLoanDTO[]) => {
                            const paymentsAmount = this.reduceLoanAmount(payments);
                            userData.totalDebt = Number(userDebts) - Number(paymentsAmount);
                          }
                        )
                      ),
                      this.getUserInvestments(user.uid).pipe(
                        tap(
                          (debts: CurrentLoanDTO[]) => {
                            userInvestments = this.reduceLoanAmount(debts);
                          }
                        )
                      ),
                      this.getInvestorPayments(user.uid).pipe(
                        tap(
                          (payments: CurrentLoanDTO[]) => {
                            const investPaymentsAmount = this.reduceLoanAmount(payments);
                            userData.totalInvestment = Number(userInvestments) - Number(investPaymentsAmount);
                          }
                        )
                      )
                    )
                  }
                )
              ).subscribe(() => {
                this.userBalanceData$.next(userData);
              })
          );
        }
      });
    } catch (error) {
      this.userBalanceData$.next(false);
      return null;
    }
  }

  private reduceLoanAmount(element: CurrentLoanDTO[]): number {
    return element.reduce((acc: number, curValue: CurrentLoanDTO) => {
      return acc += curValue.amount;
    }, 0);
  }

  private getUserLoans(userId: string) {
    return this.angularFireStore
      .collection('loans', ref => ref.where('$userId', '==', userId))
      .valueChanges();
  }

  private getUserInvestments(userId: string) {
    return this.angularFireStore
      .collection('loans', ref => ref.where('$investorId', '==', userId))
      .valueChanges();
  }

  private getInvestorPayments(userId: string) {
    return this.angularFireStore
      .collection('paymentsHistory', ref =>
        ref.where('$investorId', '==', userId)
      )
      .valueChanges();
  }
  private getUserPayments(userId: string) {
    return this.angularFireStore
      .collection('paymentsHistory', ref => ref.where('$userId', '==', userId))
      .valueChanges();
  }

  private loggedUser(): User {
    try {
      const value = JSON.parse(localStorage.getItem('user'));
      const res = value && value !== 'undefined' ? value : null;
      return res;
    } catch (error) {
      return null;
    }
  }

  public get userBalanceDataSubject$(): Observable<UserDTO> {
    return this.userBalanceData$.asObservable();
  }

  public get isLoggedIn(): boolean {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user !== null;
    } catch (error) {
      return null;
    }
  }

  public get loggedUser$(): Observable<User> {
    return this.user$.asObservable();
  }

  public signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    status: string
  ) {
    this.angularFireAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(res => {
        this.angularFireStore
          .collection('users')
          .add({
            $userId: res.user.uid,
            currentBalance: 0,
            email,
            firstName,
            lastName,
            status
          })
          .then(ref => {
            return this.angularFireStore
              .collection('users')
              .doc(ref.id)
              .set({ $userDocId: ref.id }, { merge: true });
          })
          .then(() => {
            this.router.navigate(['/dashboard']);
            this.notificatorService.success('Successful login!');
            this.userBalanceData$.next(this.userBalanceDataCalculation());
          })
          .catch(error => {
            this.notificatorService.error('Something is wrong:');
          });
      });
  }

  public signIn(email: string, password: string) {
    this.angularFireAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        this.user$.next(res.user);
        this.router.navigate(['/dashboard']);
        this.notificatorService.success('Successful login!');
        this.userBalanceData$.next(this.userBalanceDataCalculation());
      })
      .catch(err => {
        this.notificatorService.error('Invalid Username or Password!');
      });
  }

  public signOut() {
    this.angularFireAuth.auth.signOut().then(res => {
      this.user$.next(null);
      localStorage.removeItem('user');
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
      this.userBalanceData$.next(null);
      this.router.navigate(['/']);
    });
  }
}
