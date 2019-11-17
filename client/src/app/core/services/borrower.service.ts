import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
	providedIn: 'root'
})
export class BorrowerService {
	constructor(private angularFireStore: AngularFirestore, private db: AngularFireDatabase) {}

	public getUserLoans(userId) {
		return this.angularFireStore
			.collection('loans', (ref) => ref.where('$userId', '==', userId).where('status', '==', 'current'))
			.get();
	}

	public getUserRequests(userId) {
		return this.angularFireStore
			.collection('loans', (ref) => ref.where('$userId', '==', userId).where('status', '==', 'request'))
			.get();
	}

	public getUserSuggestions(requestId) {
		return this.angularFireStore
			.collection('loans', (ref) => ref.where('$requestId', '==', requestId).where('status', '==', 'suggestion'))
			.get();
	}

	public createLoanRequest(loanData) {
		return this.angularFireStore.collection('loans').add(loanData);
	}

	public addRequestIdToLoan(refId: string) {
		return this.angularFireStore.collection('loans').doc(refId).set({ $requestId: refId }, { merge: true });
	}

	public acceptLoanRequest(loanData) {
		return this.angularFireStore.collection('loans').add(loanData);
	}

	public deleteLoanRequest(requestId) {
		return this.angularFireStore
			.collection('loans', (ref) => ref.where('$requestId', '==', requestId).where('status', '==', 'suggestion'))
			.get()
			.subscribe((snaphost) => {
				snaphost.forEach((docs) => {
					this.angularFireStore.collection('loans').doc(docs.id).delete();
				});
			});
	}

	public deleteLoanSuggestion(requestId) {
		return this.angularFireStore.collection('loans').doc(requestId).get().subscribe((data) => {
			this.angularFireStore.collection('loans').doc(data.id).delete();
		});
	}
}
