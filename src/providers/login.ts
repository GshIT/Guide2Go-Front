import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

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

	constructor(public http: Http) {
		console.log('Hello Login Provider');
		this.loginUrl = 'http://localhost:8000/api/login';
	}

	/* Deberia hacer dos argumentos? */
	authenticate(args: {}): Observable<{}> {
		let headers = new Headers({ 
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		});
		let options = new RequestOptions({ headers: headers });

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
