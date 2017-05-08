import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { AuthHttp } from 'angular2-jwt';
import { JwtHelper } from 'angular2-jwt';

/*
  Generated class for the SubzoneProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SubzoneProvider {

	zoneUrl: string;

	constructor(public http: Http, public authHttp: AuthHttp, public JwtHelper: JwtHelper) {
		console.log('Hello SubzoneProvider Provider');

		//this.zoneUrl = 'http://localhost:8000/api/sub_zone/zone/';
		this.zoneUrl = 'http://digitalcook.info:8000/api/sub_zone/zone/';
	}

	getZone(id): Observable<{}>{
		let headers = new Headers({ 
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*' 
		});
		let options = new RequestOptions({ headers: headers });

		return this.http.get(this.zoneUrl+id, options)
		.map(this.printInside)
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}

	private printInside(res: Response) {
		let body = res.json();
		//console.log(body);
		return body;
	}

}
