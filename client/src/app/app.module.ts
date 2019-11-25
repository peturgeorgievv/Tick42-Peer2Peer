import { CoreModule } from './core/core.module';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
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
import { GoogleComponent } from './components/sign-in/google/google.component';
import { SpinnerIntercerptorService } from './interceptors/spinner-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';

@NgModule({
	declarations: [
		NavbarComponent,
		FooterComponent,
		AppComponent,
		UsersComponent,
		SignInComponent,
		RegisterComponent,
		HomepageComponent,
		GoogleComponent,
		NotFoundComponent,
		ServerErrorComponent
	],
	imports: [
		AppRoutingModule,
		BrowserModule,
		BrowserAnimationsModule,
		AngularFontAwesomeModule,
		AngularFireModule.initializeApp(environment.firebaseConfig),
		AngularFireAuthModule,
		AngularFireDatabaseModule,
		AngularFirestoreModule,
		SharedModule,
		CoreModule,
		NgxSpinnerModule
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: SpinnerIntercerptorService,
			multi: true
		},
		AuthenticationService,
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
