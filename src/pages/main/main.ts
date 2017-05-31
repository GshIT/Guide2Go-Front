import { Component } from '@angular/core';
import {
	Loading,
	LoadingController,
	MenuController, 
	NavController, 
	NavParams 
} from 'ionic-angular';

import { 
	OfflineProvider 
} from '../../providers/offline-provider';

import { ZonesPage } from '../zones/zones';

@Component({
	selector: 'page-main',
	templateUrl: 'main.html',
	providers: [ OfflineProvider ]
})
export class MainPage {

	loader: Loading;

	/* Estoy planeando hacer de esta clase una especie 
	de intermidiario entre las paginas para no repetir
	codigo */

	constructor(
		public offln: OfflineProvider,
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

		// Verificar si es la primera vez
		// inicializar base de datos y 
		// creacion de tablas
		this.offln.initDatabase();
		this.offln.storeUserInfo();

		// Guarda informacion local del usuario 
		// para estar disponible offline
	}
	
}
