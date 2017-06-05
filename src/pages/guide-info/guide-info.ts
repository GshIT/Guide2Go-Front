import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
	Generated class for the GuideInfo page.

	See http://ionicframework.com/docs/v2/components/#navigation for more info on
	Ionic pages and navigation.
 */
@Component({
	selector: 'page-guide-info',
	templateUrl: 'guide-info.html'
})
export class GuideInfoPage {
	
	guide: any;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams) {}

	ionViewDidLoad() {
		console.log('Guide details pages loaded...');
		this.guide = this.navParams.get('guide');
	}

	ionViewCanEnter(): boolean {
		return this.navParams.get('guide') ? true : false;
	}

}
