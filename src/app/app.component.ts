import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { StatusBar, Splashscreen } from 'ionic-native';

import { Login } from '../pages/login/login';
import { ZonesPage } from '../pages/zones/zones';
import { MainPage } from '../pages/main/main';
import { RecommendPage } from '../pages/recommend/recommend';
import { UserZonesPage } from '../pages/user-zones/user-zones';
import { MapaPage } from '../pages/mapa/mapa';
//import { GuideLoginPage } from '../pages/guide-login/guide-login';

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;

	// make Login the root (or first) page
	rootPage: any = MainPage;
	pages: Array<{title: string, component: any}>;

	constructor(
		public platform: Platform,
		public menu: MenuController
	) {
		this.initializeApp();

		// set our app's pages
		this.pages = [
			{ title: 'Mi Perfil', component: null },
			{ title: 'Mis Zonas', component: UserZonesPage },
			{ title: 'Recomendar', component: RecommendPage },
			{ title: 'Todas las Zonas', component: ZonesPage },
			{ title: 'Mapa', component: MapaPage },
			{ title: 'Cerrar Sesion', component: Login }
		];
	}

	initializeApp() {
		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			StatusBar.styleDefault();
			Splashscreen.hide();
		});
	}

	openPage(page) {
		// close the menu when clicking a link from the menu
		this.menu.close();
		// navigate to the new page if it is not the current page
		this.nav.setRoot(page.component, {}, {
			animate: true,
			direction: 'back'
		})
			.catch(() => {
				console.log('Esa pagina no existe todavia...');
			})
	}
}
