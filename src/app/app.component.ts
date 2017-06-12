import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { JwtHelper } from 'angular2-jwt';

import { DefaultPage } from '../pages/default/default';
import { Login } from '../pages/login/login';
import { ZonesPage } from '../pages/zones/zones';
import { MainPage } from '../pages/main/main';
import { RecommendPage } from '../pages/recommend/recommend';
import { UserZonesPage } from '../pages/user-zones/user-zones';
import { MapaPage } from '../pages/mapa/mapa';
import { PerfilPage } from '../pages/perfil/perfil';
import { HttpUtils } from '../providers/custom-http';
//import { GuideLoginPage } from '../pages/guide-login/guide-login';

@Component({
	templateUrl: 'app.html'
})
export class MyApp {

	@ViewChild(Nav) nav: Nav;

	// make Login the root (or first) page
	rootPage: any = DefaultPage;
	pages: Array<{title: string, component: any}>;

	constructor(
		public jwt: JwtHelper,
		public storage: Storage,
		public platform: Platform,
		public menu: MenuController,
		public httputils: HttpUtils) {

		this.initializeApp();
		this.pages = [
			{ title: 'Mi Perfil', component: PerfilPage },
			{ title: 'Mis Zonas', component: UserZonesPage },
			{ title: 'Recomendar', component: RecommendPage },
			{ title: 'Todas las Zonas', component: ZonesPage },
			{ title: 'Mapa', component: MapaPage },
			// { title: 'Cerrar Sesion', component: Login }
		];
	}

	initializeApp() {
		this.platform.ready()
			.then(() => this.verifyToken())
			.then(() => {
				StatusBar.styleDefault();
				Splashscreen.hide();
			});
	}

	verifyToken() {

		// Aqui vamos a verificar que hay 
		// conexion a internet
		// Y verificamos tambien que hay una sesion abierta

		return this.storage.ready()
			.then(() => this.storage.get('token'))
			.then((token) => {
				console.log(`Found token => ${token}`);
				this.httputils.expiredToken(token)
				.then((token)=>{

					if (token) {
						this.rootPage = MainPage;
					}
					else {
						this.rootPage = Login;
					}
					
				});
				// Verifica si el token ya expiro
			})
			.catch((e) => console.log(e));

	}

	openPage(page) {

		// Cierra el menu cuando se 
		// selecciona una pagina
		this.menu.close();

		this.nav.setRoot(page.component, {}, {
			animate: true,
			direction: 'back'
		})
			.catch(() => {
				console.log('Esa pagina no existe todavia...');
			})
	}

	closeSession() {

		this.menu.close();
		
		// Hacemos el root page el Login
		this.nav.setRoot(Login, {}, {
			animate: true,
			direction: 'back'
		})
			.then(() => this.rootPage = Login);

		// No hay problema con hacer esto
		// asincrono?
		this.storage.ready()
			.then(() => this.storage.remove('token'))
			.then(() => this.storage.remove('user'))
			.catch((e) => console.log(e));

	}
}
