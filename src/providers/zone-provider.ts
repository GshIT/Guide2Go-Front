import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { AuthHttp } from 'angular2-jwt';
import { JwtHelper } from 'angular2-jwt';
import { HttpUtils } from '../providers/custom-http';

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
		public JwtHelper: JwtHelper,
		private httputils: HttpUtils) {

		console.log('Started zones provider');

		this.zoneUrl = this.httputils.routes['zone'];
	}

	get(token): Observable<{}> {

		// Obten el token de localStorage aqui
		// y no desde afuera

		token = this.httputils.expiredToken(token);
		let headers = new Headers({ 
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Authorization': `Bearer <${token}>`
		});
		let options = new RequestOptions({ headers: headers });


		return this.http.get(this.zoneUrl, options)
		.map(this.printInside)
		.catch((error:any) => Observable.throw(error));
	}

	private printInside(res: Response) {
		let body = res.json();
		return body;
	}

}


