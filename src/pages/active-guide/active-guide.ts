import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the ActiveGuidePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-active-guide',
  templateUrl: 'active-guide.html'
})
export class ActiveGuidePage {

  constructor(
		public navCtrl: NavController, 
		public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('Guide details!');
  }

	dismissModal() {
		/* Puedes usar navCtrl en lugar de ViewController */
		this.navCtrl.pop();
	}
}
