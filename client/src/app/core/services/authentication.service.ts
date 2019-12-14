import { StatusENUM } from './../../common/enums/status.enum';
import { NotificatorService } from 'src/app/core/services/notificator.service';
import { calculateNextDueDate } from './../../common/calculate-functions/calculate-func';
import { UserDTO } from './../../common/models/users/user-data.dto';
import { CurrentLoanDTO } from './../../common/models/current-loan.dto';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { User } from 'firebase';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, map } from 'rxjs/operators';

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
    this.angularFireAuth.authState.subscribe(user => {
      if (user) {
        this.user$.next(user);
        localStorage.setItem('user', JSON.stringify(user));
        this.userBalanceData$.next(this.userBalanceDataCalculation());
        JSON.parse(localStorage.getItem('user'));
      } else {
        this.user$.next(null);
        this.userBalanceData$.next(null);
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
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

  private userBalanceDataCalculation() {
    try {
      const userData = {
        $userDocId: '',
        $userId: '',
        email: '',
        firstName: '',
        lastName: '',
        currentBalance: 0,
        totalInvestment: 0,
        totalDebt: 0,
        status: ''
      };
      this.angularFireAuth.user.subscribe((res: User) => {
        if (res) {
          this.subscriptions.push(
            this.angularFireStore
              .collection('users', ref => ref.where('$userId', '==', res.uid))
              .valueChanges()
              .subscribe((querySnapshot: UserDTO[]) => {
                this.userBalanceData$.next(userData);
                if (querySnapshot[0]) {
                  userData.$userDocId = querySnapshot[0].$userDocId;
                  userData.$userId = querySnapshot[0].$userId;
                  userData.email = querySnapshot[0].email;
                  userData.currentBalance = querySnapshot[0].currentBalance;
                  userData.firstName = querySnapshot[0].firstName;
                  userData.lastName = querySnapshot[0].lastName;
                  userData.status = querySnapshot[0].status;
                  this.subscriptions.push(
                    this.getUserLoans(res.uid).subscribe(debts => {
                      const userDebts = debts.reduce(
                        (acc: number, curValue: CurrentLoanDTO) => {
                          return (acc += curValue.amount);
                        },
                        0
                      );
                      this.subscriptions.push(
                        this.getUserPayments(res.uid).subscribe(
                          (payments: CurrentLoanDTO[]) => {
                            const paymentsAmount = payments.reduce(
                              (acc: number, curValue: CurrentLoanDTO) => {
                                return (acc += curValue.amount);
                              },
                              0
                            );
                            const totalDebt =
                              Number(userDebts) - Number(paymentsAmount);
                            return (userData.totalDebt = totalDebt);
                          }
                        )
                      );
                    })
                  );

                  this.subscriptions.push(
                    this.getUserInvestments(res.uid).subscribe(
                      (debts: CurrentLoanDTO[]) => {
                        const userInvestments = debts.reduce(
                          (acc: number, curValue: CurrentLoanDTO) => {
                            return (acc += curValue.amount);
                          },
                          0
                        );

                        this.subscriptions.push(
                          this.getInvestorPayments(res.uid).subscribe(
                            (payments: CurrentLoanDTO[]) => {
                              const paymentsAmount = payments.reduce(
                                (acc: number, curValue: CurrentLoanDTO) => {
                                  return (acc += curValue.amount);
                                },
                                0
                              );
                              const totalInvestment =
                                Number(userInvestments) -
                                Number(paymentsAmount);
                              return (userData.totalInvestment = totalInvestment);
                            }
                          )
                        );
                      }
                    )
                  );
                }
              })
          );
          return userData;
        }
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
      });
    } catch (error) {
      this.userBalanceData$.next(false);
      return null;
    }
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

  public get userBalanceDataSubject$() {
    return this.userBalanceData$.asObservable();
  }

  public get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null ? true : false;
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
            this.userBalanceData$.next(null);
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
        this.userBalanceData$.next(null);
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
      this.userBalanceData$.next(null);
      this.router.navigate(['/']);
    });
  }
}
