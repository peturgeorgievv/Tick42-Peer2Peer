import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { User } from 'firebase';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable({
	providedIn: 'root'
})
export class AuthenticationService {
	user: Observable<User>;

	constructor(
		private angularFireAuth: AngularFireAuth,
		private angularFireStore: AngularFirestore,
		private readonly router: Router
	) {
		this.user = this.angularFireAuth.authState.pipe(
			switchMap((user) => {
				if (user) {
					return this.angularFireStore.doc<User>(`users/${user.uid}`).valueChanges();
				} else {
					return of(null);
				}
			})
		);
	}

	private updateUserData(user) {
		// Sets user data to firestore on login

		const userRef: AngularFirestoreDocument<any> = this.angularFireStore.doc(`users/${user.uid}`);

		const data = {
			uid: user.uid,
			email: user.email,
			displayName: user.displayName
		};

		return userRef.set(data, { merge: true });
	}

	/* Sign up */
	SignUp(email: string, password: string) {
		this.angularFireAuth.auth
			.createUserWithEmailAndPassword(email, password)
			.then((res) => {
				return res;
			})
			.catch((error) => {
				console.log('Something is wrong:', error.message);
			});
	}

	/* Sign in */
	SignIn(email: string, password: string) {
		this.angularFireAuth.auth
			.signInWithEmailAndPassword(email, password)
			.then((res) => {
				this.updateUserData(res);
				this.router.navigate([ '/dashboard' ]);
				console.log('Successfully signed in!');
			})
			.catch((err) => {
				console.log('Something is wrong:', err.message);
			});
	}

	/* Sign out */
	SignOut() {
		this.angularFireAuth.auth.signOut();
	}
}
