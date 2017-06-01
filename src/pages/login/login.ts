import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { 
	MenuController,
	NavController,
} from 'ionic-angular';

import { GuideLoginPage } from '../guide-login/guide-login';
import { ReferedPage } from '../refered/refered';

@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class Login {

	constructor(
		private storage: Storage,
		private menu: MenuController, 
		private navCtrl : NavController) {}

	ionViewDidEnter() {
		// Cerrar sesion cuando entra para estar seguros.
		this.menu.enable(false);
	}

	refered() {
		this.navCtrl.push(ReferedPage);
	}

	guideLogin() {
		this.navCtrl.push(GuideLoginPage);
	}
}
