import { Component } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus';

import { MenuController,NavController } from 'ionic-angular';
import { ReferedPage } from '../refered/refered';
import { GuideLoginPage } from '../guide-login/guide-login';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class Login {
  constructor(
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
		this.googlePlus.login({})
				.then(res => console.log(res))
				.catch(err => console.log(err));

	}

  guideLogin() {
    this.navCtrl.push(GuideLoginPage);
  }
}
