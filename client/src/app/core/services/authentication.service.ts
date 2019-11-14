import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from 'firebase';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable({
	providedIn: 'root'
})
export class AuthenticationService {
	private readonly user$: BehaviorSubject<User> = new BehaviorSubject(null);

	constructor(
		private angularFireAuth: AngularFireAuth,
		private angularFireStore: AngularFirestore,
		private readonly router: Router
	) {}

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
			this.router.navigate([ '/' ]);
		});
	}
}
