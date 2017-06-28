import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

import { AuthHttp } from 'angular2-jwt';
import { JwtHelper } from 'angular2-jwt';
import { HttpUtils } from '../providers/custom-http';

/*
  Generated class for the SubzoneProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SubzoneProvider {

	zoneUrl: string;

	constructor(public http: Http, public authHttp: AuthHttp, public JwtHelper: JwtHelper,
		private httputils: HttpUtils) {
		console.log('Hello SubzoneProvider Provider');

		this.zoneUrl = this.httputils.routes['subZone'];
	}

	getZone(id): Promise<{}>{
		return this.httputils.authHeaders()
		.then((options) => this.http.get(this.zoneUrl+id, options).toPromise())
		.then(this.printInside)
		.catch((error:any) => Promise.reject(error.json().error || 'Server error'));
	}

	private printInside(res: Response) {
		let body = res.json();
		//console.log(body);
		return body;
	}

}
