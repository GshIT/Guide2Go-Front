import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

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

	get(): Promise<{}> {
		return this.httputils.authHeaders()
		.then((opt) => this.http.get(this.zoneUrl, opt).toPromise())
		.then(this.printInside)
		.catch((error:any) => Promise.reject(error));
	}

	private printInside(res: Response) {
		let body = res.json();
		return body;
	}

}


