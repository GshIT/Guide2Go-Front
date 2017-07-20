import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
/*
  Generated class for the ModalPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html'
})
export class ModalPagePage {

	titulo: any;
	descripcion: any;
	urlFoto: any;
	keyFoto: any;
  lUrl: any;

  constructor(
		public navCtrl: NavController, 
		public navParams: NavParams, 
		public viewCtrl: ViewController) {

  	this.titulo = navParams.get("titulo");
  	this.descripcion = navParams.get("desc");
  	this.urlFoto = navParams.get("url");
    if(this.urlFoto != -1){
  	  this.keyFoto = Object.keys(this.urlFoto); 
      this.lUrl = this.urlFoto.length;
    }
    else{
      this.lUrl = 0;
    }
    console.log(this.urlFoto);
  }
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalPagePage');
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
