import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HomepageService {

  constructor(private angularFireStore: AngularFirestore) { }

  public getAllUsers() {
    return this.angularFireStore
      .collection('users')
      .get();
  }
}
