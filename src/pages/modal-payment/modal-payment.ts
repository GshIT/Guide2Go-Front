import { Component } from '@angular/core';
import { 
	NavController, 
	NavParams, 
	ViewController 
} from 'ionic-angular';

/*
  Generated class for the ModalPaymentPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-modal-payment',
  templateUrl: 'modal-payment.html'
})
export class ModalPaymentPage {

  constructor(
		public navCtrl: NavController, 
		public navParams: NavParams, 
		public viewCtrl: ViewController) {}

  ionViewDidLoad() {
    console.log('Shut up and take my money!');
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
