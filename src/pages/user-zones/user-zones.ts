import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { UserZoneProvider } from '../../providers/user-zone-provider';

/*
  Generated class for the UserZones page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user-zones',
  templateUrl: 'user-zones.html',
	providers: [ UserZoneProvider ]
})
export class UserZonesPage {
	
	userZones: any;

  constructor(
		public zonesProvider: UserZoneProvider,
		public navCtrl: NavController, 
		public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserZonesPage');
		// Revisa el token en localStorage 
		// Realiza un request para obtener las zonas
		// O retorna al login
		
		// Obtiene las zonas (guias) del usuario
		this.zonesProvider.fetchZones() // Provider;
			.then( (zones) => this.userZones = zones )
			.catch( () => 'Token no encontrado');
  }

	download() {
		// Poner condigo aqui
		console.log('Descargada zona con exito');
	}
}
