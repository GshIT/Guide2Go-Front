import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { UserProvider } from '../../providers/user-provider'

/*
  Generated class for the Zones page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
  providers: [UserProvider]
})
export class PerfilPage {

  user: {};

  constructor(
  	public UserProvider: UserProvider,
    public storage: Storage,
  	public navCtrl: NavController, 
  	public navParams: NavParams) {

  	this.user = {
			nombre: 'Wait', 
			email: 'Wait', 
			dolares: 'Wait'
		};

    this.storage.ready().then(() => {
    	this.storage.get('token').then((val) => {
				this.UserProvider.show(val, this.user);
			})
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilPage');
  }

}
