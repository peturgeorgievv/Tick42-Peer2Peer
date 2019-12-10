import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
	providedIn: 'root'
})
export class UsersService {
	constructor(private readonly angularFireStore: AngularFirestore) {}

	public getAllUsers() {
		return this.angularFireStore.collection('users', (ref) => ref.orderBy('firstName', 'asc')).valueChanges();
	}

	public getUserDoc(userDocId: string) {
		return this.angularFireStore.collection('users').doc(userDocId).get();
	}

	public getUserPayments(userId: string) {
		return this.angularFireStore
			.collection('paymentsHistory', (ref) => ref.where('$userId', '==', userId))
			.valueChanges();
	}
}
