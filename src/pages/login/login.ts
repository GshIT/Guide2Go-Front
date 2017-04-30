import { Component } from '@angular/core';

import { Login as LoginService } from '../../providers/login';

import { 
	MenuController,
	NavController,
	AlertController
} from 'ionic-angular';

import { ReferedPage } from '../refered/refered';
import { GuideLoginPage } from '../guide-login/guide-login';

@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class Login {
	constructor(
		private loginService: LoginService,
		private alertCtrl: AlertController,
		private menu: MenuController, 
		private navCtrl : NavController) {}

	ionViewDidEnter() {
		// Cerrar sesion cuando entra para estar seguros.
		this.menu.enable(false);
	}

	// Luego pensamos donde vamos a poner esto
	refered() {
		this.navCtrl.push(ReferedPage);
	}

	googleLogin() {
		//
		this.loginService.googleLogin();
	}

	guideLogin() {
		this.navCtrl.push(GuideLoginPage);
	}
}
