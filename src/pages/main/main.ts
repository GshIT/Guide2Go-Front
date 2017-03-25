import { Component } from '@angular/core';
import {
	Loading,
	LoadingController,
	MenuController, 
	NavController, 
	NavParams 
} from 'ionic-angular';

import { ZonesPage } from '../zones/zones';

@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {

	loader: Loading;

  /* Estoy planeando hacer de esta clase una especie 
  de intermidiario entre las paginas para no repetir
  codigo */

  constructor(
  	public loadCtrl: LoadingController,
  	public menuCtrl: MenuController,
  	public navCtrl: NavController, 
  	public navParams: NavParams) {}

  ionViewDidEnter() {
  	console.log('Entering to the main.');

  	// Enable side menu
  	this.menuCtrl.enable(true);

  	// Registrar o login...
  	// Por ahora solo se redirecciona al main
  	this.loader.dismiss();
  	this.navCtrl.setRoot(ZonesPage);
  }

  ionViewWillEnter() {
  	console.log('Entering to the main.');
  	this.loader = this.loadCtrl.create({
  		content: 'Cargando...'
  	});
  	this.loader.present();
  }

}
