import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ZonesPage } from '../zones/zones';

@Component({
  selector: 'page-refered',
  templateUrl: 'refered.html'
})
export class ReferedPage {
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  zonesMain() {
  	this.navCtrl.setRoot(ZonesPage);
  }

}
