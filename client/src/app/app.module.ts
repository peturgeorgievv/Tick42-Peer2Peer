import { CoreModule } from './core/core.module';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { RegisterComponent } from './components/register/register.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FusionChartsModule } from 'angular-fusioncharts';

import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

FusionChartsModule.fcRoot(FusionCharts, Charts, FusionTheme)
@NgModule({
	declarations: [
		NavbarComponent,
		FooterComponent,
		AppComponent,
		SignInComponent,
		RegisterComponent,
		HomepageComponent,
		NotFoundComponent,
		ServerErrorComponent
	],
	imports: [
		FusionChartsModule,
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
		NgxSpinnerModule,
		// tslint:disable-next-line: deprecation
		NgbModule.forRoot()
	],
	providers: [],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
