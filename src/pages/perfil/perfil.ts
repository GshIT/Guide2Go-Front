import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { UserProvider } from '../../providers/user-provider'
import { LangProvider } from '../../providers/lang/lang'

/*
  Generated class for the Zones page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
  providers: [UserProvider,LangProvider]
})
export class PerfilPage {

  user: {};
  lang: any;
  acLang: any;

  constructor(
  	public UserProvider: UserProvider,
    public storage: Storage,
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    public langProv: LangProvider) {

  	this.user = {
			nombre: 'Wait',  
			email: 'Wait', 
			dolares: 'Wait',
      ref_code: 'Wait'
		};

   this.langProv.get().then((res)=>{this.lang = res});

   this.acLang = localStorage.getItem("lang");

    this.storage.ready().then(() => {
    	this.storage.get('token').then((val) => {
				this.UserProvider.show(val, this.user);
			})
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilPage');
  }

  inAppPayment(){

  }

  onChange(value){
    this.acLang = value;
    localStorage.setItem("lang",this.acLang); 
  }
}
