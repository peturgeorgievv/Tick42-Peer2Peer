import { StatusENUM } from './../../common/enums/status.enum';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class InvestorService {
  constructor(private angularFireStore: AngularFirestore) {}

  public getAllLoanRequests() {
    return this.angularFireStore
      .collection('requests', ref =>
        ref.where('status', '==', StatusENUM.requestOpen)
      )
      .valueChanges();
  }

  public getUserProposals(userId: string) {
    return this.angularFireStore
      .collection('suggestions', ref =>
        ref
          .where('$investorId', '==', userId)
          .where('status', '==', StatusENUM.suggestionPending)
      )
      .valueChanges();
  }

  public rejectLoanSuggestion(suggestionId: string) {
    return this.angularFireStore
      .collection('suggestions')
      .doc(suggestionId)
      .set({ status: StatusENUM.suggestionRejected }, { merge: true });
  }

  public createLoanSuggestion(loanData) {
    return this.angularFireStore.collection('suggestions').add(loanData);
  }

  public addSuggestionId(refId: string) {
    return this.angularFireStore
      .collection('suggestions')
      .doc(refId)
      .set({ $suggestionId: refId }, { merge: true });
  }

  public getUserInvestments(userId: string) {
    return this.angularFireStore
      .collection('loans', ref =>
        ref
          .where('$investorId', '==', userId)
          .where('status', '==', StatusENUM.current)
      )
      .valueChanges();
  }

  public getUserDocData(userDocId: string) {
    return this.angularFireStore
      .collection('users')
      .doc(userDocId)
      .get();
  }

  public getPayments(suggestionId: string, userId: string) {
    return this.angularFireStore
      .collection('paymentsHistory', ref =>
        ref
          .where('$suggestionId', '==', suggestionId)
          .where('$userId', '==', userId)
      )
      .valueChanges();
  }
}
