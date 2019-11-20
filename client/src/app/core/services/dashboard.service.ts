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
      .collection('users', (ref) => ref.where('$userId', '==', userId))
      .snapshotChanges()
      .subscribe(
        (е) => {
          е.forEach((docs) => {
            console.log(docs.payload.doc.data());

          });
        }
      );
  }


}

