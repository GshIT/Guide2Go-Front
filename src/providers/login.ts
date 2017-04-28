import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/*
	Generated class for the Login provider.

	See https://angular.io/docs/ts/latest/guide/dependency-injection.html
	for more info on providers and Angular 2 DI.
 */
@Injectable()
export class Login {

	loginUrl: string;

	constructor(
		public storage: Storage,
		public http: Http) {
		console.log('Hello Login Provider');

		// this.loginUrl = 'http://127.0.0.1:8000/api/login';
		this.loginUrl = 'http://digitalcook.info:8000/api/login';
	}

	/* Deberia hacer dos argumentos? */
	authenticate(args: {}): Observable<{}> {
		let headers = new Headers({ 
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*' // CORS
		});
		let options = new RequestOptions({ headers: headers });

		return this.http.post(this.loginUrl, args, options)
										.map(this.getToken)
										.catch(this.handleError);
	}

	// Guarda el token en local storage
	//
	private getToken(resp: Response) {
		let body = resp.json();
		
		// Verificar si ya existe un token
		// Si ya esta expirado
		// ...
		this.storage.ready().then(() => {
			// {} or String ?
			this.storage.set('token', body.token);
		});

		console.log(body); // { token: '...' } 
		return body.token || {}; // Que deberia retornar?
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
			console.log(body);
			errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		} else {
			errMsg = error.message ? error.message : error.toString();
		}
		console.error(errMsg);
		return Observable.throw(errMsg);
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
