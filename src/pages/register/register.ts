import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user-provider'

/*
  Generated class for the Register page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers: [UserProvider]
})
export class RegisterPage {

	user: {};
	errorMsg: string;

	constructor(public navCtrl: NavController, public navParams: NavParams, public UserProvider: UserProvider){
		this.user = {};
	}

	ionViewDidLoad() {
	  console.log('ionViewDidLoad RegisterPage');
	}

	createUser(){
		this.UserProvider.createUser(this.user).subscribe(
				bn => console.log('todobn'),
				error =>  this.errorMsg = <any>error);
	} 

}
//jenny