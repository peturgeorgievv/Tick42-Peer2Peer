import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private readonly angularFireStore: AngularFirestore) {}

  public getAllUsers() {
    return this.angularFireStore
      .collection('users', ref => ref.orderBy('firstName', 'asc'))
      .valueChanges();
  }

  public getUserLoans(userId: string) {
    return this.angularFireStore
      .collection('loans', ref => ref.where('$userId', '==', userId))
      .valueChanges();
  }
}
