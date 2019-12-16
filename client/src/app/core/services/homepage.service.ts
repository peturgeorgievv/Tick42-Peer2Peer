import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { StatusENUM } from '../../common/enums/status.enum';

@Injectable({
  providedIn: 'root'
})
export class HomepageService {

  constructor(private angularFireStore: AngularFirestore) { }

  public getAllUsers() {
    return this.angularFireStore
      .collection('users')
      .valueChanges();
  }

  public getAllLoans() {
    return this.angularFireStore
      .collection('loans')
      .valueChanges();
  }

  public getAllRequests() {
    return this.angularFireStore
      .collection('requests', (ref) => ref.where('status', '==', StatusENUM.requestOpen))
      .valueChanges();
  }
}
