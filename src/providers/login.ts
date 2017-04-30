import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import { GooglePlus } from '@ionic-native/google-plus';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/*
	Generated class for the Login provider.

	See https://angular.io/docs/ts/latest/guide/dependency-injection.html
	for more info on providers and Angular 2 DI.
 */
@Injectable()
export class Login {

	requestHeaders: Headers;
	googleClientId: string;
	loginUrl: string;

	constructor(
		private googlePlus: GooglePlus,
		private http: Http) {

		console.log('Hello Login Provider');

		this.loginUrl = 'http://localhost:8000/api/login';
		this.requestHeaders = new Headers({ 
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		});

		this.googleClientId = '96779452065-5jeqgrfmlp64eptahte2eq1hatl5rkfe.apps.googleusercontent.com';


	}

	/* Deberia hacer dos argumentos? */
	authenticate(args: {}): Observable<{}> {

		let options = new RequestOptions({ 
			headers: this.requestHeaders 
		});

		return this.http.post(this.loginUrl, args, options)
		.map(this.getToken)
		.catch(this.handleError);
	}

	private getToken(resp: Response) {
		let body = resp.json();
		return body.token;
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
		return Observable.throw(errMsg);
	}

	// Google Oauth Login
	// Todavia falta mucho por descubrir
	googleLogin() {

		console.log('Google Login!');

		// Deberia ir esto aqui?
		this.googlePlus.login({
			// Sera seguro dejar esto aqui ?
			'webClientId': this.googleClientId
		})
			.then(res => {
				console.log(res);

				// Sera que lo hago antes o despues ?
				this.googlePlus.logout();

				// Aqui debe mandar al servidor 
				// el token de Google
				// HTTP POST con token dentro `res`

				// Luego guarda el token de Guide2Go
				// en localStorage
			})
			.catch(err => console.log(err));

		// Cambiar retornar una Promesa o Observable...
	}



	register(args: {}): Observable<{}> {

		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });

		// Obten el token al crear la cuenta
		// Verifica que ya existe el usuario
		//
		return this.http.post(this.loginUrl, args, options)
		.map(this.getToken)
		.catch(this.handleError);

	}


}
