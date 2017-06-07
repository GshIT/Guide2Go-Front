import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { HttpUtils } from '../providers/custom-http';

/*
	Generated class for the Login provider.

	See https://angular.io/docs/ts/latest/guide/dependency-injection.html
	for more info on providers and Angular 2 DI.
 */
@Injectable()
export class Login {

	loginUrl: string;

	constructor(public http: Http, private httputils: HttpUtils) {
		console.log('Hello Login Provider');
		this.loginUrl = this.httputils.routes['login'];
	}

	/* Deberia hacer dos argumentos? */
	authenticate(args: {}): Observable<{}> {
		let options = this.httputils.defaultHeaders();
		console.log(this.loginUrl);

		return this.http.post(this.loginUrl, args, options)
						.map(this.getToken)
						.catch(this.handleError);
	}

	private getToken(resp: Response) {
		let body = resp.json();
		console.log(body);
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

	register(args: {}): Observable<{}> {

		let options = this.httputils.authHeaders();
		
		// Obten el token al crear la cuenta
		// Verifica que ya existe el usuario
		//
		return this.http.post(this.loginUrl, args, options)
						.map(this.getToken)
						.catch(this.handleError);

	}
		

}
