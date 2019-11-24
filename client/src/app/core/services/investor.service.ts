import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ThrowStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class InvestorService {
  constructor(private angularFireStore: AngularFirestore) { }

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

  public getUserInvestments(userId: string) {
    return this.angularFireStore.
      collection('loans', ref => ref.where('$userId', '==', userId).where('status', '==', 'current'))
      .valueChanges();
  }

  public getUser(userId: string) {
		return this.angularFireStore.collection('users', (ref) => ref.where('$userId', '==', userId)).get();
	}
}
