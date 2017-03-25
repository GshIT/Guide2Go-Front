import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { MainPage } from '../main/main';

@Component({
  selector: 'page-refered',
  templateUrl: 'refered.html'
})
export class ReferedPage {
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  MainView() {
  	this.navCtrl.setRoot(MainPage, {}, {
  		animate: true
  	});
  }
}
