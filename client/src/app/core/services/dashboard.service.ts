import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private angularFireStore: AngularFirestore) { }

  public getUser(userId: string) {
    return this.angularFireStore.collection('users', (ref) => ref.where('$userId', '==', userId))
      .snapshotChanges();
  }

}
