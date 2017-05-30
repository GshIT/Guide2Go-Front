import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { AuthHttp } from 'angular2-jwt';
import { JwtHelper } from 'angular2-jwt';

/*
	Generated class for the ZoneProvider provider.

	See https://angular.io/docs/ts/latest/guide/dependency-injection.html
	for more info on providers and Angular 2 DI.
 */
@Injectable()
export class ZoneProvider {

	zoneUrl: string;

	constructor(
		public http: Http, 
		public authHttp: AuthHttp, 
		public JwtHelper: JwtHelper) {

		console.log('Started zones provider');

		// this.zoneUrl = 'http://localhost:8000/api/zona';
		this.zoneUrl = 'http://digitalcook.info:8000/api/zona';
	}

	get(token): Observable<{}> {

		// Obten el token de localStorage aqui
		// y no desde afuera

		let headers = new Headers({ 
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Authorization': `Bearer <${token}>`
		});
		let options = new RequestOptions({ headers: headers });

		return this.http.get(this.zoneUrl, options)
		.map(this.printInside)
		.catch((error:any) => Observable.throw('Server error'));
	}

	private printInside(res: Response) {
		let body = res.json();
		return body;
	}

}


