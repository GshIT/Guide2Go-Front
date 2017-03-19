import { Component } from '@angular/core';
import { MenuController,NavController } from 'ionic-angular';
import { ReferedPage} from '../refered/refered';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class Login {
  constructor(private menu: MenuController, private navCtrl : NavController) {}

  ionViewDidEnter() {
  	this.menu.enable(false);
  }

  refered() {
  	this.navCtrl.push(ReferedPage);
  }
}
