import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular';

import { MapaPage } from '../mapa/mapa';
import { PerfilPage } from '../perfil/perfil';
import { ActiveGuidePage } from '../active-guide/active-guide';

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
    public activeProv: ActiveProvider,
		public modalCtrl: ModalController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserZonesPage');
		
    // Revisa el token en localStorage 
    // Realiza un request para obtener las zonas
    // O retorna al login
    console.log(this.activeProv.seeActive());
		
    // Obtiene las zonas (guias) del usuario
    this.zonesProvider.fetchZones() // Provider;
      .then( (zones) => this.userGuides = zones )
      .catch( () => 'Token no encontrado' )
			.then( () => {
				this.userGuides = [{
					costo: 1000,
					zona: {
						name: 'Guevon'
					}
				}];
			});
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

	/* Muestra la pagina de configuracion/perfil  */
	goToProfile() {
		this.navCtrl.push(PerfilPage);
	}

	/* Invoca los detalles de la guia para poder 
	 * activarla o descargarla...
	 */
	guideDetails(guide: any) {
		let modal = this.modalCtrl.create(ActiveGuidePage, {
			guide: guide
		});
		modal.present();
	}


}
