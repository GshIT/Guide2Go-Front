import { Component } from '@angular/core';
import { MenuController,NavController } from 'ionic-angular';
import { ReferedPage } from '../refered/refered';
import { GuideLoginPage } from '../guide-login/guide-login';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class Login {
  constructor(
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
