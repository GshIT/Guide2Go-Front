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
			.then(this.handleSuccess.bind(this))
			.catch(this.handleError.bind(this));
	}

	/* Google OAuth Flow */
	googleAuth() {
		this.loginServ.googleAuth()
			.then(() => this.handleSuccess())
			.catch((err) => this.handleError(err));
	}


	private handleSuccess() {
		this.navCtrl.push(MainPage);
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

}
