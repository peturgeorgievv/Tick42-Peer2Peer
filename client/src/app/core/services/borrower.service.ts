import { AllPaymentsDTO } from './../../common/models/all-payments.dto';
import { StatusENUM } from './../../common/enums/status.enum';
import { LoanSuggestionDTO } from './../../common/models/loan-suggestion.dto';
import { Subscription, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoanRequestDTO } from 'src/app/common/models/loan-request.dto';

@Injectable({
  providedIn: 'root'
})
export class BorrowerService {
  constructor(private angularFireStore: AngularFirestore) {}

  public getUserLoans(userId: string) {
    return this.angularFireStore
      .collection('loans', ref =>
        ref
          .where('$userId', '==', userId)
          .where('status', '==', StatusENUM.current)
      )
      .valueChanges();
  }

  public getOneUser(userDocId: string) {
    return this.angularFireStore
      .collection('users')
      .doc(userDocId)
      .get();
  }

  public getOneLoan(userId: string, suggestionId: string) {
    return this.angularFireStore
      .collection('loans', ref =>
        ref
          .where('$userId', '==', userId)
          .where('$suggestionId', '==', suggestionId)
          .where('status', '==', StatusENUM.current)
      )
      .snapshotChanges();
  }

  public payFullyLoan(loanId: string) {
    return this.angularFireStore
      .collection('loans')
      .doc(loanId)
      .set({ status: StatusENUM.paid }, { merge: true });
  }

  public getUserRequestsAsc(userId: string, property: string) {
    return this.angularFireStore
      .collection('requests', ref =>
        ref
          .where('$userId', '==', userId)
          .where('status', '==', StatusENUM.requestOpen)
          .orderBy(property, 'asc')
      )
      .valueChanges();
  }

  public getUserRequestsDesc(userId: string, property: string) {
    return this.angularFireStore
      .collection('requests', ref =>
        ref
          .where('$userId', '==', userId)
          .where('status', '==', StatusENUM.requestOpen)
          .orderBy(property, 'desc')
      )
      .valueChanges();
  }

  public getUserSuggestions() {
    return this.angularFireStore
      .collection('suggestions', ref =>
        ref.where('status', '==', StatusENUM.suggestionPending)
      )
      .valueChanges();
  }

  public createLoanRequest(loanData: LoanRequestDTO) {
    return this.angularFireStore.collection('requests').add(loanData);
  }

  public addRequestIdToLoan(refId: string) {
    return this.angularFireStore
      .collection('requests')
      .doc(refId)
      .set({ $requestId: refId }, { merge: true });
  }

  public editRequestAmount(requestId: string, amount: number) {
    return this.angularFireStore
      .collection('requests')
      .doc(requestId)
      .set({ amount }, { merge: true });
  }

  public createPayment(data: AllPaymentsDTO) {
    return this.angularFireStore.collection('paymentsHistory').add(data);
  }

  public acceptLoanRequest(loanData) {
    return this.angularFireStore.collection('loans').add(loanData);
  }

  public findLoanSuggestion(suggestionId: string) {
    return this.angularFireStore
      .collection('suggestions')
      .doc(suggestionId)
      .set({ status: StatusENUM.suggestionAccepted }, { merge: true });
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

  public getAllPayments(userId: string) {
    return this.angularFireStore
      .collection('paymentsHistory', ref => ref.where('$userId', '==', userId))
      .valueChanges();
  }

  public getUserDocData(userId: string) {
    return this.angularFireStore.collection('users').doc(userId);
  }

  public rejectLoanRequests(requestId: string): Subscription {
    return this.angularFireStore
      .collection('requests', ref =>
        ref
          .where('$requestId', '==', requestId)
          .where('status', '==', StatusENUM.requestOpen)
      )
      .snapshotChanges()
      .subscribe(snaphost => {
        snaphost.forEach(docs => {
          this.angularFireStore
            .collection('requests')
            .doc(docs.payload.doc.id)
            .set({ status: StatusENUM.requestClosed }, { merge: true });
        });
        this.angularFireStore
          .collection('suggestions', ref =>
            ref
              .where('status', '==', StatusENUM.suggestionPending)
              .where('$requestId', '==', requestId)
          )
          .snapshotChanges()
          .subscribe(snapshot => {
            snapshot.forEach(docs => {
              this.angularFireStore
                .collection('suggestions')
                .doc(docs.payload.doc.id)
                .set(
                  { status: StatusENUM.suggestionRejected },
                  { merge: true }
                );
            });
          });
      });
  }

  public rejectBiggerLoanSuggestions(requestId: string, amount: number) {
    return this.angularFireStore
      .collection('suggestions', ref =>
        ref
          .where('status', '==', StatusENUM.suggestionPending)
          .where('$requestId', '==', requestId)
          .where('amount', '>', amount)
      )
      .valueChanges()
      .subscribe((querySnapshot: LoanSuggestionDTO[]) => {
        querySnapshot.forEach((doc: LoanSuggestionDTO) => {
          this.angularFireStore
            .collection('suggestions')
            .doc(doc.$suggestionId)
            .set({ status: StatusENUM.suggestionRejected }, { merge: true });
        });
      });
  }

  public rejectBiggerPartialLoanSuggestions(requestId: string, amount: number) {
    return this.angularFireStore
      .collection('suggestions', ref =>
        ref
          .where('status', '==', StatusENUM.suggestionPending)
          .where('$requestId', '==', requestId)
          .where('amount', '>', amount)
      )
      .valueChanges()
      .subscribe((querySnapshot: LoanSuggestionDTO[]) => {
        querySnapshot.forEach((doc: LoanSuggestionDTO) => {
          this.angularFireStore
            .collection('suggestions')
            .doc(doc.$suggestionId)
            .set({ status: StatusENUM.suggestionRejected }, { merge: true });
        });
      });
  }

  public rejectLoanSuggestions(suggestionId: string): Subscription {
    return this.angularFireStore
      .collection('suggestions', ref =>
        ref
          .where('status', '==', StatusENUM.suggestionPending)
          .where('$suggestionId', '==', suggestionId)
      )
      .snapshotChanges()
      .subscribe(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.angularFireStore
            .collection('suggestions')
            .doc(doc.payload.doc.id)
            .set({ status: StatusENUM.suggestionRejected }, { merge: true });
        });
      });
  }

  public findPartialRequestLoans(requestId: string) {
    return this.angularFireStore
      .collection('loans', ref => ref.where('$requestId', '==', requestId))
      .valueChanges();
  }
}
