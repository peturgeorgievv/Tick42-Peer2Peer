import { FirebaseService } from "./services/firebase.service";
import { environment } from "./../environments/environment";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";

import { AppComponent } from "./app.component";
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { BorrowerComponent } from './features/borrower/borrower.component';
import { InvestorComponent } from './features/investor/investor.component';
import { UsersComponent } from './features/users/users.component';

@NgModule({
  declarations: [AppComponent, DashboardComponent, BorrowerComponent, InvestorComponent, UsersComponent],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
