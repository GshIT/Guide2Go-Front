import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { MapaPage } from '../mapa/mapa';
import { PerfilPage } from '../perfil/perfil';

import { JwtHelper} from 'angular2-jwt';
import { Storage } from '@ionic/storage';

import { Zones } from '../../providers/zones';
import { ZoneProvider as ZoneProvider } from '../../providers/zone-provider';
import { ActiveProvider } from '../../providers/active-provider';

import { ModalController } from 'ionic-angular';
import { ModalPaymentPagePage } from '../modal-payment/modal-payment';

import { GuideInfoPage } from '../guide-info/guide-info';

/*
  Generated class for the Zones page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-zones',
  templateUrl: 'zones.html',
  providers: [Zones, ZoneProvider] /* Add ngInit Hook */
})
export class ZonesPage {

  /* Should not be any */
  mapPage: any;
  zones: any[];
  fetchedZones: {};

  constructor(
    public storage: Storage,
    public jwtHelper: JwtHelper,
    public zonesProvider: Zones,
    public navCtrl: NavController, 
    public navParams: NavParams,
    private zoneProvider: ZoneProvider,
    public activProv: ActiveProvider,
    public modalCtrl: ModalController) {
		
		// Ya hay que borrar este viejo provider
    // this.zones = zonesProvider.getZones();
		
    this.mapPage = MapaPage;


    this.zoneProvider.get()
      .then((res) => this.fetchedZones = res)
      .catch((err) => console.log(err));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ZonesPage');
  }

  setZone(zone) {
		/* (Guide = Zone) huehue */
		let modal = this.modalCtrl.create(
			GuideInfoPage, {
				guide: zone
			})
		modal.present();
  }

  // Hay que ver como reusamos esto 
  goToProfile() {
    this.navCtrl.push(PerfilPage);
  }

  comprar(zone){
    let myModal = this.modalCtrl.create(ModalPaymentPagePage, {
      zone: zone.id
    });
    myModal.present();
  }
}

