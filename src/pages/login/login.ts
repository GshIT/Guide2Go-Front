import { Component } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus';

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
		private alertCtrl: AlertController,
		private googlePlus: GooglePlus,
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

	// Google Oauth Login
	// Todavia falta mucho por descubrir
	googleLogin() {

		console.log('Google Login!');
		this.googlePlus.login({
			// Sera seguro dejar esto aqui ? 
			'webClientId': '96779452065-5jeqgrfmlp64eptahte2eq1hatl5rkfe.apps.googleusercontent.com'
		})
			.then(this.googleResponse.bind(this))
			.catch(err => console.log(err));

		// Mas tarde
		// this.navCtrl.push(MainPage);
	}

	private googleResponse(res) {

		console.log(res);
		let alert = this.alertCtrl.create({
			title: 'Login',
			subTitle: 'Google ha respondido!',
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					handler: data => {
						console.log('Disconnect dat token!');
						this.googlePlus.logout();
					}
				},
				{
					text: 'Keep',
					handler: data => {
						// No hace algo...
						console.log('Keep dat token!');
					}
				}
			]
		});
		alert.present();

		// Aqui debe mandar al servidor 
		// el token de Google
	}

	guideLogin() {
		this.navCtrl.push(GuideLoginPage);
	}
}
