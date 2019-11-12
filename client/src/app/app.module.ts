import { HomepageComponent } from './components/homepage/homepage.component';
import { RegisterComponent } from './components/register/register.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AuthenticationService } from './core/services/authentication.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AppComponent } from './app.component';
import { UsersComponent } from './features/users/users.component';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
	declarations: [ AppComponent, UsersComponent, SignInComponent, RegisterComponent, HomepageComponent ],
	imports: [
		AppRoutingModule,
		BrowserModule,
		AngularFireModule.initializeApp(environment.firebaseConfig),
		AngularFireAuthModule,
		AngularFireDatabaseModule,
		AngularFirestoreModule,
		SharedModule
	],
	providers: [ AuthenticationService ],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
