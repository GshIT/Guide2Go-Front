import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { MapaPage } from '../mapa/mapa';

import { Zones } from '../../providers/zones';

/*
  Generated class for the Zones page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-zones',
  templateUrl: 'zones.html',
  providers: [Zones]
})
export class ZonesPage {

	/* Should not be any */
	mapPage: any;
	zones: any[];

  constructor(
  	public zonesProvider: Zones,
  	public navCtrl: NavController, 
  	public navParams: NavParams) {

  	this.zones = zonesProvider.getZones();
  	this.mapPage = MapaPage;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ZonesPage');
  }

  setZone(zone) {
  	return { zone: zone };
  }

}
