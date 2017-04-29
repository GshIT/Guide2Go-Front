import { NgModule, ErrorHandler } from '@angular/core';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { Http } from '@angular/http';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { GooglePlus } from '@ionic-native/google-plus';

import { MyApp } from './app.component';

import { Login } from '../pages/login/login';
import { ReferedPage} from '../pages/refered/refered';
import { ZonesPage } from '../pages/zones/zones';
import { MainPage } from '../pages/main/main';
import { RecommendPage } from '../pages/recommend/recommend';
import { UserZonesPage } from '../pages/user-zones/user-zones';
import { MapaPage } from '../pages/mapa/mapa';
import { GuideLoginPage } from '../pages/guide-login/guide-login';
import { RegisterPage } from '../pages/register/register';


// Eto ta mu loco
const storage = new Storage();

export function getAuthHttp(http) {
	let config = new AuthConfig({
		headerPrefix: 'JWT', // ?
		noJwtError: true,
		globalHeaders: [{'Accept': 'applcation/json'}],
		tokenGetter: (() => storage.get('token')),
	}); 
	return new AuthHttp(config, http);
}

@NgModule({
	declarations: [
		MyApp,
		Login,
		ReferedPage,
		ZonesPage,
		MainPage,
		RecommendPage,
		UserZonesPage,
		MapaPage,
		GuideLoginPage,
		RegisterPage
	],
	imports: [
		IonicModule.forRoot(MyApp),
		IonicStorageModule.forRoot()
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		Login,
		ReferedPage,
		ZonesPage,
		MainPage,
		RecommendPage,
		UserZonesPage,
		MapaPage,
		GuideLoginPage,
		RegisterPage
	],
	providers: [
		GooglePlus,
		{
			provide: AuthHttp,
			useFactory: getAuthHttp,
			deps: [Http]
		}, {
			provide: ErrorHandler,
			useClass: IonicErrorHandler
		}]
})
export class AppModule {}
