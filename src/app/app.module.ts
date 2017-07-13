import { NgModule, ErrorHandler } from '@angular/core';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import { SQLite } from '@ionic-native/sqlite';
import { AuthHttp, AuthConfig, JwtHelper } from 'angular2-jwt';
import { Transfer } from '@ionic-native/transfer';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';

import { DefaultPage } from '../pages/default/default';
import { Login } from '../pages/login/login';
import { ReferedPage} from '../pages/refered/refered';
import { ZonesPage } from '../pages/zones/zones';
import { MainPage } from '../pages/main/main';
import { RecommendPage } from '../pages/recommend/recommend';
import { UserZonesPage } from '../pages/user-zones/user-zones';
import { MapaPage } from '../pages/mapa/mapa';
import { GuideLoginPage } from '../pages/guide-login/guide-login';
import { RegisterPage } from '../pages/register/register';
import { PerfilPage } from '../pages/perfil/perfil';
import { ModalPagePage } from '../pages/modal/modal';

import { HttpUtils } from '../providers/custom-http';
import { ActiveProvider } from '../providers/active-provider';
import { PhotoProvider } from '../providers/photo/photo';

// Mover esto a un modulo o algo...
//
export function getAuthHttp(http, storage) {
	let config = new AuthConfig({
		noJwtError: true,
		globalHeaders: [{
			'Accept': 'applcation/json',
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*' 
		}],
		tokenGetter: () => storage.get('token'),
	}); 
	return new AuthHttp(config, http);
}

@NgModule({
	declarations: [
		MyApp,
		DefaultPage,
		Login,
		ReferedPage,
		ZonesPage,
		MainPage,
		RecommendPage,
		UserZonesPage,
		MapaPage,
		GuideLoginPage,
		RegisterPage,
		PerfilPage,
		ModalPagePage
	],
	imports: [
		IonicModule.forRoot(MyApp, {
			backButtonText: ''
		}),
		IonicStorageModule.forRoot()
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		DefaultPage,
		Login,
		ReferedPage,
		ZonesPage,
		MainPage,
		RecommendPage,
		UserZonesPage,
		MapaPage,
		GuideLoginPage,
		RegisterPage,
		PerfilPage,
		ModalPagePage
	],
	providers: [
		{
			provide: AuthHttp,
			useFactory: getAuthHttp,
			deps: [Http, Storage]
		}, {
			provide: ErrorHandler,
			useClass: IonicErrorHandler
		},
		Transfer,
		SQLite,
		HttpUtils,
		JwtHelper,
		ActiveProvider,
    PhotoProvider
	]
})
export class AppModule {}
