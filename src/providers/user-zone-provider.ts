import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers } from '@angular/http';
import 'rxjs/add/operator/map';

// import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';

import { AuthHttp } from 'angular2-jwt';
import { JwtHelper } from 'angular2-jwt';


/*
	Generated class for the UserZoneProvider provider.

	See https://angular.io/docs/ts/latest/guide/dependency-injection.html
	for more info on providers and Angular 2 DI.
 */
@Injectable()
export class UserZoneProvider {

	apiGuideUrl : string;
	apiZoneUrl  : string;

	constructor(
		public storage: Storage,
		public jwt: JwtHelper,
		public auth: AuthHttp,
		public http: Http) {

		console.log('Hello UserZoneProvider Provider');

		// Esto podria ir en otro lugar..
		const apiUrl = "http://localhost:8000/api/";
		this.apiGuideUrl = apiUrl + "guia";
		this.apiZoneUrl  = apiUrl + "zona";
	}


	fetchZones() {

		const headers = new Headers({
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		});

		// Get token from localstorage
		// whateva
		return this.storage.get('token')
			.then( token => {
				const params = `?token=${token}`;
				const url = this.apiGuideUrl + params;

				return this.http.get(url, { headers: headers })
					.toPromise()
					.then(this.handleResp)
					.catch(this.handleError);

			})
	}

	private handleResp(resp: Response) {
		return resp.json() || {};
	}
	
	private handleError(error: Response | any) {
		let err = error.json().error || 'Server error';
		return Promise.reject(err);
	}
}
