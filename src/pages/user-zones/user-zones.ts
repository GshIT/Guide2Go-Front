import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the UserZones page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user-zones',
  templateUrl: 'user-zones.html'
})
export class UserZonesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserZonesPage');
		// Revisa el token en localStorage 
		// 	Realiza un request para obtener las zonas
		// 	O retorna al login
		

  }

}
