import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
	providedIn: 'root'
})
export class BorrowerService {
	constructor(private angularFireStore: AngularFirestore, private db: AngularFireDatabase) {}

	public createLoanRequest(loanData) {
		return this.angularFireStore.collection('loanRequests').add(loanData);
	}

	public getAllLoans() {
		return this.angularFireStore.collection('currentLoans').snapshotChanges();
	}

	public getLoanRequests() {
		return this.angularFireStore.collection('loanRequests').snapshotChanges();
	}

	public deleteLoan(loanId: string): void {
		this.angularFireStore.doc('currentLoans/' + loanId).delete();
	}
}
