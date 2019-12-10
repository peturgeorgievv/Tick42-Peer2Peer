import { Injectable } from '@angular/core';
import { StatusENUM } from './../../common/enums/status.enum';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
	providedIn: 'root'
})
export class DashboardService {
	constructor(private angularFireStore: AngularFirestore) {}

	public getUserDocData(userId: string) {
		return this.angularFireStore.collection('users').doc(userId).get();
	}

	public addOrRemoveMoney(userId: string) {
		return this.angularFireStore.collection('users').doc(userId);
	}

	public getCurrentUserInvestments(userId: string) {
		return this.angularFireStore
			.collection('loans', (ref) =>
				ref
					.where('$investorId', '==', userId)
					.where('status', '==', StatusENUM.current)
					.orderBy('period', 'desc')
			)
			.valueChanges();
	}

	public getCurrentUserLoans(userId: string) {
		return this.angularFireStore
			.collection('loans', (ref) =>
				ref.where('$userId', '==', userId).where('status', '==', StatusENUM.current).orderBy('period', 'desc')
			)
			.valueChanges();
	}
}
