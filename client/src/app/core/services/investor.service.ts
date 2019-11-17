import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
	providedIn: 'root'
})
export class InvestorService {
	constructor(private angularFireStore: AngularFirestore) {}

	public getAllLoanRequests() {
		return this.angularFireStore.collection('loans', (ref) => ref.where('status', '==', 'request')).get();
	}

	public createLoanSuggestion(loanData) {
		return this.angularFireStore.collection('loans').add(loanData);
	}

	// public getUserLoans(userId) {
	// 	return this.angularFireStore
	// 		.collection('loans', (ref) => ref.where('$userId', '==', userId).where('status', '==', 'current'))
	// 		.get();
	// }

	// public getUserRequests(userId) {
	// 	return this.angularFireStore
	// 		.collection('loans', (ref) => ref.where('$userId', '==', userId).where('status', '==', 'request'))
	// 		.get();
	// }

	// public getUserSuggestions(requestId) {
	// 	return this.angularFireStore
	// 		.collection('loans', (ref) => ref.where('$requestId', '==', requestId).where('status', '==', 'suggestion'))
	// 		.get();
	// }

	// public acceptLoanRequest(loanData) {
	// 	return this.angularFireStore.collection('loans').add(loanData);
	// }

	// public deleteLoanRequest(requestId) {
	// 	return this.angularFireStore
	// 		.collection('loans', (ref) => ref.where('$requestId', '==', requestId).where('status', '==', 'suggestion'))
	// 		.get()
	// 		.subscribe((snaphost) => {
	// 			snaphost.forEach((docs) => {
	// 				this.angularFireStore.collection('loans').doc(docs.id).delete();
	// 			});
	// 		});
	// }

	// public deleteLoanSuggestion(requestId) {
	// 	return this.angularFireStore.collection('loans').doc(requestId).get().subscribe((data) => {
	// 		this.angularFireStore.collection('loans').doc(data.id).delete();
	// 	});
	// }
}
