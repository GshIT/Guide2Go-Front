import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { JwtHelper } from 'angular2-jwt';
import { 
	MenuController,
	NavController,
} from 'ionic-angular';

import { GuideLoginPage } from '../guide-login/guide-login';
import { ReferedPage } from '../refered/refered';
import { MainPage } from '../main/main';

@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class Login {

	constructor(
		private jwt: JwtHelper,
		private storage: Storage,
		private menu: MenuController, 
		private navCtrl : NavController) {}

	ionViewDidEnter() {
		// Cerrar sesion cuando entra para estar seguros.
		this.menu.enable(false);
	}

	ionViewWillEnter() {

		// Aqui vamos a verificar que hay 
		// conexion a internet
		// Y verificamos tambien que hay una sesion abierta
		this.storage.ready()
			.then(() => this.storage.get('token'))
			.then((token) => {
				// Verifica si el token ya expiro
				console.log(`Found token => ${token}`);

				if (token && !this.jwt.isTokenExpired(token)) {
					this.navCtrl.setRoot(MainPage);
				}
			})
			.catch((e) => console.log(e));

	}

	refered() {
		this.navCtrl.push(ReferedPage);
	}

	guideLogin() {
		this.navCtrl.push(GuideLoginPage);
	}
}
