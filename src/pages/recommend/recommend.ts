import { Component } from '@angular/core';
import { 
	MenuController,
	NavController, 
	NavParams 
} from 'ionic-angular';

/*
  Generated class for the Recommend page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-recommend',
  templateUrl: 'recommend.html'
})
export class RecommendPage {

  constructor(
  	public menuCtrl: MenuController,
  	public navCtrl: NavController, 
  	public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecommendPage');
    this.menuCtrl.enable(true);
  }

}
