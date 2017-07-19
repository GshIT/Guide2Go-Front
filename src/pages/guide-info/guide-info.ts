import { Component } from '@angular/core';
import { 
	NavController, 
	NavParams,
	ViewController
} from 'ionic-angular';

import { MapaPage } from '../mapa/mapa';

@Component({
	selector: 'page-guide-info',
	templateUrl: 'guide-info.html'
})
export class GuideInfoPage {
	
	guide: any;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController) {
		this.guide = { name: '' }
	}

	ionViewDidLoad() {
		console.log('Guide details pages loaded...');
		this.guide = this.navParams.get('guide');
		console.log(this.guide);
	}

	ionViewCanEnter(): boolean {
		return this.navParams.get('guide') ? true : false;
	}

	preview() {
		this.navCtrl.push(MapaPage, {
			zone: this.guide
		});
	}

	cancel() {
		this.viewCtrl.dismiss();
	}

}
