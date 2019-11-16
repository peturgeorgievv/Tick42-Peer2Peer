import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from 'firebase';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class AuthenticationService {
	private readonly isLoggedInSubject$ = new BehaviorSubject<boolean>(this.isUserLoggedIn());

	private readonly user$: BehaviorSubject<User> = new BehaviorSubject(this.loggedUser());

	constructor(private angularFireAuth: AngularFireAuth, private readonly router: Router) {
		this.angularFireAuth.authState.subscribe((user) => {
			if (user) {
				this.user$.next(user);
				this.isLoggedInSubject$.next(true);
				localStorage.setItem('user', JSON.stringify(user));
				JSON.parse(localStorage.getItem('user'));
			} else {
				this.user$.next(null);
				this.isLoggedInSubject$.next(null);
				localStorage.setItem('user', null);
				JSON.parse(localStorage.getItem('user'));
			}
		});
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
				this.router.navigate([ '/dashboard' ]);
			})
			.catch((err) => {
				console.log('Something is wrong:', err.message);
			});
	}

	public signOut() {
		this.angularFireAuth.auth.signOut().then((res) => {
			this.user$.next(null);
			localStorage.removeItem('user');
			this.router.navigate([ '/' ]);
		});
	}
}
