import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
	providedIn: 'root'
})
export class InvestorService {
	constructor(private angularFireStore: AngularFirestore) {}

	public getAllLoanRequests() {
		return this.angularFireStore
			.collection('loans', (ref) => ref.where('status', '==', 'request'))
			.snapshotChanges();
	}

	public createLoanSuggestion(loanData) {
		return this.angularFireStore.collection('loans').add(loanData);
	}

	public addSuggestionId(refId) {
		return this.angularFireStore.collection('loans').doc(refId).set({ $suggestionId: refId }, { merge: true });
	}
}
