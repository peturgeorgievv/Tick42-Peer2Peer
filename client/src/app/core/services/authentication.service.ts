import { UserDTO } from './../../common/models/users/user-data.dto';
import { CurrentLoanDTO } from './../../common/models/current-loan.dto';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from 'firebase';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
	providedIn: 'root'
})
export class AuthenticationService {
	private readonly isLoggedInSubject$ = new BehaviorSubject<boolean>(this.isUserLoggedIn());

	private readonly user$: BehaviorSubject<User> = new BehaviorSubject(this.loggedUser());

	private readonly userBalanceData$: BehaviorSubject<any> = new BehaviorSubject(this.userBalanceDataCalculation());

	constructor(
		private angularFireAuth: AngularFireAuth,
		private angularFireStore: AngularFirestore,
		private readonly router: Router
	) {
		this.angularFireAuth.authState.subscribe((user) => {
			if (user) {
				this.user$.next(user);
				this.isLoggedInSubject$.next(true);
				localStorage.setItem('user', JSON.stringify(user));
				this.userBalanceData$.next(this.userBalanceDataCalculation());
				JSON.parse(localStorage.getItem('user'));
			} else {
				this.user$.next(null);
				this.isLoggedInSubject$.next(null);
				this.userBalanceData$.next(null);
				localStorage.setItem('user', null);
				JSON.parse(localStorage.getItem('user'));
			}
		});
	}

	private userBalanceDataCalculation() {
		try {
			const value = JSON.parse(localStorage.getItem('user'));
			const res = value && value !== 'undefined' ? value : null;
			const userData = {
				$userDocId: '',
				$userId: '',
				email: '',
				currentBalance: 0,
				totalInvestment: 0,
				totalDebt: 0
			};
			console.log(res);
			this.angularFireStore
				.collection('users', (ref) => ref.where('$userId', '==', res.uid).where('email', '==', res.email))
				.valueChanges()
				.subscribe((querySnapshot: UserDTO[]) => {
					console.log(querySnapshot);
					this.userBalanceData$.next(userData);
					userData.$userDocId = querySnapshot[0].$userDocId;
					userData.$userId = querySnapshot[0].$userId;
					userData.email = querySnapshot[0].email;
					userData.currentBalance = querySnapshot[0].currentBalance;
					this.getUserLoans(res.uid).subscribe((debts) => {
						const userDebts = debts.reduce((acc: number, curValue: CurrentLoanDTO) => {
							return (acc += curValue.amount);
						}, 0);

						return this.getUserPayments(res.uid).subscribe((payments) => {
							const paymentsAmount = payments.reduce((acc: number, curValue: CurrentLoanDTO) => {
								return (acc += curValue.amount);
							}, 0);
							const totalDebt = Number(userDebts) - Number(paymentsAmount);
							return (userData.totalDebt = totalDebt);
						});
					});

					return this.getUserInvestments(res.uid).subscribe((debts) => {
						const userInvestments = debts.reduce((acc: number, curValue: CurrentLoanDTO) => {
							return (acc += curValue.amount);
						}, 0);

						return this.getInvestorPayments(res.uid).subscribe((payments) => {
							const paymentsAmount = payments.reduce((acc: number, curValue: CurrentLoanDTO) => {
								return (acc += curValue.amount);
							}, 0);
							const totalInvestment = Number(userInvestments) - Number(paymentsAmount);
							return (userData.totalInvestment = totalInvestment);
						});
					});
				});
			return userData;
		} catch (error) {
			this.userBalanceData$.next(false);
			return null;
		}
	}

	public getUserLoans(userId: string) {
		return this.angularFireStore.collection('loans', (ref) => ref.where('$userId', '==', userId)).valueChanges();
	}

	public getUserInvestments(userId: string) {
		return this.angularFireStore
			.collection('loans', (ref) => ref.where('$investorId', '==', userId))
			.valueChanges();
	}

	public getInvestorPayments(userId: string) {
		return this.angularFireStore
			.collection('paymentsHistory', (ref) => ref.where('$investorId', '==', userId))
			.valueChanges();
	}
	public getUserPayments(userId: string) {
		return this.angularFireStore
			.collection('paymentsHistory', (ref) => ref.where('$userId', '==', userId))
			.valueChanges();
	}

	private isUserLoggedIn(): boolean {
		const value = localStorage.getItem('user');
		const res = value && value !== 'undefined' ? value : null;
		return !!res;
	}

	private loggedUser(): User {
		try {
			const value = JSON.parse(localStorage.getItem('user'));
			const res = value && value !== 'undefined' ? value : null;
			return res;
		} catch (error) {
			// in case of storage tampering
			this.isLoggedInSubject$.next(false);

			return null;
		}
	}

	public get userBalanceDataSubject$() {
		return this.userBalanceData$.asObservable();
	}

	public get isLoggedIn$(): Observable<boolean> {
		return this.isLoggedInSubject$.asObservable();
	}

	public get loggedUser$(): Observable<User> {
		return this.user$.asObservable();
	}

	public signUp(email: string, password: string) {
		this.angularFireAuth.auth
			.createUserWithEmailAndPassword(email, password)
			.then((res) => {
				console.log('Logged successfully', res);
				this.angularFireStore
					.collection('users')
					.add({ $userId: res.user.uid, currentBalance: 0, email })
					.then((ref) =>
						this.angularFireStore
							.collection('users')
							.doc(ref.id)
							.set({ $userDocId: ref.id }, { merge: true })
					);
			})
			.catch((error) => {
				console.log('Something is wrong:', error.message);
			});
	}

	public signIn(email: string, password: string) {
		this.angularFireAuth.auth
			.signInWithEmailAndPassword(email, password)
			.then((res) => {
				this.user$.next(res.user);
				this.userBalanceDataCalculation();
				this.userBalanceData$.next(this.userBalanceDataCalculation());
				this.router.navigate([ '/dashboard' ]);
			})
			.catch((err) => {
				console.log('Something is wrong:', err.message);
			});
	}

	public signOut() {
		this.angularFireAuth.auth.signOut().then((res) => {
			this.user$.next(null);
			this.userBalanceData$.next(null);
			localStorage.removeItem('user');
			this.router.navigate([ '/' ]);
		});
	}
}
