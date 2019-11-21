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
			.snapshotChanges();
	}

	public getUserRequests(userId) {
		return this.angularFireStore
			.collection('loans', (ref) => ref.where('$userId', '==', userId).where('status', '==', 'request'))
			.valueChanges();
	}

	public getUserSuggestions() {
		return this.angularFireStore
			.collection('loans', (ref) => ref.where('status', '==', 'suggestion'))
			.valueChanges();
	}

	public createLoanRequest(loanData) {
		return this.angularFireStore.collection('loans').add(loanData);
	}

	public addRequestIdToLoan(refId: string) {
		return this.angularFireStore.collection('loans').doc(refId).set({ $requestId: refId }, { merge: true });
	}

	public createPayment(data) {
		return this.angularFireStore.collection('loansHistory').add(data);
	}

	public acceptLoanRequest(loanData) {
		return this.angularFireStore.collection('loans').add(loanData);
	}

	public getPayments(reqId, userId) {
		return this.angularFireStore
			.collection('loansHistory', (ref) => ref.where('$requestId', '==', reqId).where('$userId', '==', userId))
			.snapshotChanges();
	}

	public getAllPayments(userId) {
		return this.angularFireStore
			.collection('loansHistory', (ref) => ref.where('$userId', '==', userId))
			.snapshotChanges();
	}

	public getUser(userId) {
		return this.angularFireStore.collection('users', (ref) => ref.where('$userId', '==', userId)).get();
	}

	public getUserDocData(userId) {
		return this.angularFireStore.collection('users').doc(userId);
	}

	public deleteLoanRequest(requestId) {
		console.log(requestId);
		return this.angularFireStore
			.collection('loans', (ref) => ref.where('$requestId', '==', requestId).where('status', '==', 'request'))
			.snapshotChanges()
			.subscribe((snaphost) => {
				snaphost.forEach((docs) => {
					this.angularFireStore.collection('loans').doc(docs.payload.doc.id).delete();
				});
				this.angularFireStore
					.collection('loans', (ref) =>
						ref.where('status', '==', 'suggestion').where('$requestId', '==', requestId)
					)
					.snapshotChanges()
					.subscribe((snapshot) => {
						snapshot.forEach((docs) => {
							this.angularFireStore.collection('loans').doc(docs.payload.doc.id).delete();
						});
					});
			});
	}

	public deleteLoanSuggestion(suggestionId) {
		return this.angularFireStore
			.collection('loans', (ref) =>
				ref.where('status', '==', 'suggestion').where('$suggestionId', '==', suggestionId)
			)
			.snapshotChanges()
			.subscribe((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					this.angularFireStore.collection('loans').doc(doc.payload.doc.id).delete();
				});
			});
	}
}
