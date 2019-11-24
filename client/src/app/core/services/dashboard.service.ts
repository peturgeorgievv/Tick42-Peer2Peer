import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private angularFireStore: AngularFirestore,
    private db: AngularFireDatabase
  ) { }

  public getUser(userId: string) {
    return this.angularFireStore
      .collection('users', (ref) => ref.where('$userId', '==', userId)).get();
  }

  public addOrRemoveMoney(userId) {
    return this.angularFireStore.collection('users').doc(userId);
  }

  public getCurrentUserLoans(userId: string) {
    return this.angularFireStore
      .collection('loans', (ref) => ref.where('$userId', '==', userId).where('status', '==', 'current')
        .orderBy('period', 'desc'))
      .snapshotChanges();
  }

}

