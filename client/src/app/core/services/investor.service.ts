import { StatusENUM } from './../../common/enums/status.enum';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ThrowStmt } from '@angular/compiler';

@Injectable({
	providedIn: 'root'
})
export class InvestorService {
	constructor(private angularFireStore: AngularFirestore) {}

	public getAllLoanRequests() {
		return this.angularFireStore
			.collection('requests', (ref) => ref.where('status', '==', StatusENUM.requestOpen))
			.snapshotChanges();
	}

	public createLoanSuggestion(loanData) {
		return this.angularFireStore.collection('suggestions').add(loanData);
	}

	public addSuggestionId(refId) {
		return this.angularFireStore
			.collection('suggestions')
			.doc(refId)
			.set({ $suggestionId: refId }, { merge: true });
	}

	public getUserInvestments(userId: string) {
		return this.angularFireStore
			.collection('loans', (ref) => ref.where('$userId', '==', userId).where('status', '==', StatusENUM.current))
			.valueChanges();
	}

	public getUser(userId: string) {
		return this.angularFireStore.collection('users', (ref) => ref.where('$userId', '==', userId)).get();
	}
}
