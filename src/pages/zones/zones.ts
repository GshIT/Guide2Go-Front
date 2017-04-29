import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { MapaPage } from '../mapa/mapa';

import { Zones } from '../../providers/zones';
import { JwtHelper} from 'angular2-jwt';
import { Storage } from '@ionic/storage';


/*
  Generated class for the Zones page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-zones',
  templateUrl: 'zones.html',
  providers: [Zones] /* Add ngInit Hook */
})
export class ZonesPage {

	/* Should not be any */
	mapPage: any;
	zones: any[];
  token: string;

  constructor(
    public storage: Storage,
    public jwtHelper: JwtHelper,
  	public zonesProvider: Zones,
  	public navCtrl: NavController, 
  	public navParams: NavParams) {

  	this.zones = zonesProvider.getZones();
  	this.mapPage = MapaPage;

    this.storage.ready().then(() => {
      this.storage.get('token').then((val) => {this.token = val;})
     });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ZonesPage');
  }

  setZone(zone) {
  	return { zone: zone };
  }

  probar(){ 
    console.log(
    this.jwtHelper.decodeToken(this.token),
    this.jwtHelper.getTokenExpirationDate(this.token),
    this.jwtHelper.isTokenExpired(this.token)
    );
  }

}
