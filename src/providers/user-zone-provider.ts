import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

// import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { Transfer } from '@ionic-native/transfer';

import { AuthHttp } from 'angular2-jwt';
import { JwtHelper } from 'angular2-jwt';
import { HttpUtils } from '../providers/custom-http';

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
    public transfer: Transfer,
		public storage: Storage,
		public jwt: JwtHelper,
		public auth: AuthHttp,
		public http: Http,
		private httputils: HttpUtils) {

		console.log('Hello UserZoneProvider Provider');

		// Esto podria ir en otro lugar..
    // const apiUrl = "http://localhost:8000/api/";
    
    const apiUrl = this.httputils.apiUrl;
 
		this.apiGuideUrl = apiUrl + "/guia";
		this.apiZoneUrl  = apiUrl + "/zona";
	}


	fetchZones() {

		// Get token from localstorage
		// whateva
		const params = `?self=true`;
		const url = this.apiGuideUrl + params;

		return this.httputils.authHeaders()
		.then((opt) => this.http.get(url, opt).toPromise())
		.then(this.handleResp)
		.catch(this.handleError);
	}

	private handleResp(resp: Response) {
		return resp.json() || {};
	}
	
	private handleError(error: Response | any) {
		let err = error.json().error || 'Server error';
		return Promise.reject(err);
	}


}
