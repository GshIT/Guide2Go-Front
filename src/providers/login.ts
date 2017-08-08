import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { GooglePlus } from '@ionic-native/google-plus';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { HttpUtils } from '../providers/custom-http';

/*
	Generated class for the Login provider.

	See https://angular.io/docs/ts/latest/guide/dependency-injection.html
	for more info on providers and Angular 2 DI.  */
@Injectable()
export class Login {

	loginUrl: string;
	googleLoginUrl: string;
	webClientId: string;

	constructor(
		public http: Http, 
		private httputils: HttpUtils,
		private storage: Storage,
		private googlePlus: GooglePlus
	) {
		console.log('Hello Login Provider');
		this.loginUrl = this.httputils.routes['login'];

		/* Deberia ir aqui, perdon */
		this.googleLoginUrl = this.httputils.apiUrl + "/login/google";
		this.webClientId = "1092787362861-9ncl8m072o20elimluignnbpvuff8caa.apps.googleusercontent.com";
	}

	/* Deberia hacer dos argumentos? */
	authenticate(args: {}): Promise<{}> {
		return this.httputils.defaultHeaders()
		.then((opt) => this.http.post(this.loginUrl, args, opt).toPromise())
		.then((resp) => this.getToken(resp))
		.then((token) => this.handleToken(token))
		.catch(this.handleError);
	}

	private getToken(resp: Response) {
		let body = resp.json();
		console.log(body);
		return body.token;
	}

	private handleToken(token: {}) {
		console.log(token);
		return this.storage.ready()
			.then(() => {
				this.storage.set('token', token);
				return token;
			})
	}

	// Si ya existe el usuario...
	// O otra clase de error
	//
	// Retorna 0 -  {"isTrusted":true} si el servidor esta apagado
	private handleError (error: Response | any) {
		let errMsg: string;
		if (error instanceof Response) { // ?
			const body = error.json() || '';
			const err = body.error || JSON.stringify(body);
			errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		} else {
			errMsg = error.message ? error.message : error.toString();
		}
		console.error(errMsg);
		return Promise.reject(errMsg);
	}

	/* Creo que ya no sirve */
	register(args: {}): Observable<{}> {

		let options = this.httputils.authHeaders();

		// Obten el token al crear la cuenta
		// Verifica que ya existe el usuario
		//
		return this.http.post(this.loginUrl, args, options)
		.map(this.getToken)
		.catch(this.handleError);

	}

	/* Args:
	 * idToken: string
	 * referer_id: string
	 */
	googleAuth() {

		let url = this.googleLoginUrl;
		let req = {};

		let flow = this.googlePlus.login({
			"webClientId": this.webClientId,
		})
			.then((res) => {
				req = { 'token': res.idToken } // Debo añadir el referer_id
				return this.httputils.defaultHeaders();
			})
			.then((opt) => this.http.post(url, req, opt).toPromise())
			.then((resp) => this.getToken(resp))
			.then((token) => this.handleToken(token))

		flow.then(() => {
			console.log('Google Plus Logout!');
			this.googlePlus.logout();
		});

		return flow;

	}

	logout() {

		this.storage.ready()
			.then(() => this.storage.remove('token'))
			.then(() => this.storage.remove('user'))
			.catch((e) => console.log(e));

	}

}
