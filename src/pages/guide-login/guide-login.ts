import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { MainPage } from '../main/main';
import { Storage } from '@ionic/storage';

import { Login as LoginService } from '../../providers/login'


/*
	Generated class for the GuideLogin page.

	See http://ionicframework.com/docs/v2/components/#navigation for more info on
	Ionic pages and navigation.
 */
@Component({
	selector: 'page-guide-login',
	templateUrl: 'guide-login.html',
	providers: [LoginService]
})
export class GuideLoginPage {

	login: {};
	token: {};
	errorMsg: string;

	constructor(
		public storage: Storage,
		private loginService: LoginService,
		public navCtrl: NavController, 
		public navParams: NavParams) {
		this.errorMsg = "";
		this.login = {};
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad GuideLoginPage');
	}

	authenticate() {
		// Obtener data del form
		console.log(this.login);
		console.log('Validando...');


		this.loginService.authenticate(this.login)
			.then(this.handleToken.bind(this))
			.catch(this.handleError.bind(this));

		// Redireccionar si es valido
		// 	- Guardar token
		//
		// Mostrar error si es incorrecto
		// 	- (Agregar funcion fashion para esto)
	}

	// Quiza deberia ir en un proveedor
	private handleToken(token: {}) {
		this.token = token;
		this.saveToken(); 
		this.navCtrl.push(MainPage);
	}

	private saveToken(){
		this.storage.ready().then(() => {
			this.storage.set('token', this.token);
		});
	}

	private handleError(error: any) {
		// Modificar la vista para que haga
		// algo mas bonito aqui
		this.errorMsg = error;
		console.log('Ups, hubo un error intenta de nuevo');
		console.log(error);
	}

	register(){
		this.navCtrl.push(RegisterPage);
	}

}
