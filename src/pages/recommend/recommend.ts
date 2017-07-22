import { Component } from '@angular/core';
import { 
	MenuController,
	NavController, 
	NavParams 
} from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';


/*
  Generated class for the Recommend page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-recommend',
  templateUrl: 'recommend.html',
  providers: [EmailComposer]
})
export class RecommendPage {

  email: any;

  constructor(
  	public menuCtrl: MenuController,
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    private emailComposer: EmailComposer) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecommendPage');
    this.menuCtrl.enable(true);
  }

  sendMail(){
    let em = {
        to: this.email,
        subject: 'Invitation to use Guide2Go',
        body: `<h1>Guide2Go</h1>
              <p> have you ever wanted to travel, all around the world, well never is to late to do it </p>`,
        isHtml: true
    };

    if (document.URL.indexOf('http://') === -1
         && document.URL.indexOf('https://') === -1 && this.email){
        this.emailComposer.open(em);
    }
  }

}
