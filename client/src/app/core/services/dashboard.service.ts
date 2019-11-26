import { StatusENUM } from './../../common/enums/status.enum';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private angularFireStore: AngularFirestore,
  ) { }

  public getUser(userId: string) {
    return this.angularFireStore
      .collection('users', (ref) => ref.where('$userId', '==', userId)).get();
  }

  public addOrRemoveMoney(userId) {
    return this.angularFireStore.collection('users').doc(userId);
  }

  public getCurrentUserInvestments(userId: string) {
    return this.angularFireStore
      .collection('loans', (ref) => ref.where('$investorId', '==', userId).where('status', '==', StatusENUM.current)
        .orderBy('period', 'desc'))
      .snapshotChanges();
  }

  public getCurrentUserLoans(userId: string) {
    return this.angularFireStore
      .collection('loans', (ref) => ref.where('$userId', '==', userId).where('status', '==', StatusENUM.current)
        .orderBy('period', 'desc'))
      .snapshotChanges();
  }


}

