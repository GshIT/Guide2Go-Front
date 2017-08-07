import { Component } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus';
import { Storage } from '@ionic/storage';
import { 
	MenuController,
	NavController,
	ToastController
} from 'ionic-angular';

import { GuideLoginPage } from '../guide-login/guide-login';
import { ReferedPage } from '../refered/refered';
import { MainPage } from '../main/main';
import { RegisterPage } from '../register/register';

import { Login as LoginService } from '../../providers/login'

@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
	providers: [ LoginService ]
})
export class Login {

	login: {};
	token: {};
	errorMsg: string;

	constructor(
		private storage: Storage,
		private loginServ: LoginService,
		private menu: MenuController, 
		private navCtrl : NavController,
		private toastCtrl: ToastController,
		private googlePlus: GooglePlus
	) {
		this.errorMsg = "";
		this.login = {};
	}

	ionViewDidEnter() {
		// Cerrar sesion cuando entra para estar seguros.
		this.menu.enable(false);
	}

	refered() {
		this.navCtrl.push(ReferedPage);
	}

	/* Ya no es usado... */
	guideLogin() {
		this.navCtrl.push(GuideLoginPage);
	}

	authenticate() {
		// Obtener data del form
		console.log(this.login);
		console.log('Validando...');

		this.loginServ.authenticate(this.login)
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

		const toast = this.toastCtrl.create({
			message: 'Correo o contraseña incorrectos',
			closeButtonText: "Ok!",
			showCloseButton: true,
			dismissOnPageChange: true,
			duration: 3500
		});
		toast.present();

	}

	register(){
		this.navCtrl.push(RegisterPage);
	}

	/* Google Auth */
	googleAuth() {

		/* Debo mover esto a un provider */
		this.googlePlus.login({
			"webClientId": "1092787362861-9ncl8m072o20elimluignnbpvuff8caa.apps.googleusercontent.com",
		})
			.then((res) => {
				/* Debo añadir aqui el referer id */
				let req = { 'token': res.idToken } 
				return this.loginServ.googleAuth(req);
			})
			.then((token) => this.handleToken(token))
			.catch((err) => console.log(err));

	}

}
