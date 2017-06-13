import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { MapaPage } from '../mapa/mapa';

import { UserZoneProvider } from '../../providers/user-zone-provider';
import { ActiveProvider } from '../../providers/active-provider';

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

  userGuides: any;

  constructor(
    public zonesProvider: UserZoneProvider,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public activeProv: ActiveProvider) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserZonesPage');
    // Revisa el token en localStorage 
    // Realiza un request para obtener las zonas
    // O retorna al login
    console.log(this.activeProv.seeActive());
    // Obtiene las zonas (guias) del usuario
    this.zonesProvider.fetchZones() // Provider;
      .then( (zones) => {
				this.userGuides = zones;
				//console.log(zones);
			})
      .catch( () => 'Token no encontrado' );
  }

  download() {
    // Poner codigo aqui
    // Mandar una peticion de descarga del audio
    // Si el usuario tiene permisos se descarga
    console.log('Descargada zona con exito');
  }

  isActive(guide: any){
    return this.activeProv.isActive(guide);
  }
 
  activate(guide: any){
    return this.activeProv.activate(guide);
  }
  
  deactivate(){
    return this.activeProv.deactivate();
  }
  /* No creo que esto funcione */
  setZone(zone) {
    this.navCtrl.push(MapaPage, {zone: zone});
  }
}
