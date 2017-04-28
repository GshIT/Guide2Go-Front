import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { MainPage } from '../main/main';

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

	login: {}
	token: {}
	errorMsg: string

	constructor(
		private loginService: LoginService,
		public navCtrl: NavController, 
		public navParams: NavParams) {

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
			.subscribe(
				token => this.token = token,
				this.handleError);

		// Redireccionar si es valido
		// 	- Guardar token
		//
		// Mostrar error si es incorrecto
		// 	- (Agregar funcion fashion para esto)
	}

	// Quiza deberia ir en un proveedor
	private handleToken(token: {}) {

		// Hay que ver como mostrar el cargador...
		//
		// Actualiza la vista
		// (Se mueve a otra pagina)
		this.navCtrl.push(MainPage);
	}

	private handleError(error: any) {
		// Modificar la vista para que haga
		// algo mas bonito aqui
		console.log('Ups, hubo un error intenta de nuevo');
		console.log(error);
		this.errorMsg = error;
	}

	register(){
		this.navCtrl.push(RegisterPage);
	}

}
