import { Injectable } from '@angular/core';
import { 
	Headers, RequestOptions 
} from '@angular/http';

import { JwtHelper } from 'angular2-jwt';
import { Storage } from '@ionic/storage';

import 'rxjs/add/operator/map';

/*
	Generated class for the CustomHttp provider.

	See https://angular.io/docs/ts/latest/guide/dependency-injection.html
	for more info on providers and Angular 2 DI.
 */
@Injectable()
export class HttpUtils {

	apiUrl: string;
	routes: {};
	headers: {};

	constructor(
		private jwt: JwtHelper,
		private storage: Storage) {

		console.log('Custom http provider started');

		this.headers = { 
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		};

		/**
		 * Cambia esto para debug
		 * this.apiUrl = "http://localhost:8000/api";
		 */
		this.apiUrl = "http://digitalcook.info:8000/api";

		this.routes = {
			'guide'	 : this.apiUrl + "/guia",
			'user'	 : this.apiUrl + "/user",
			'login'	 : this.apiUrl + "/login",
			'spot'	 : this.apiUrl + "/parada/sub_zone",
			'subZone': this.apiUrl + "/sub_zone/zone"
		};
	}

	/**
	 * Estas funciones pueden traer probleamas
	 * si se pasan directamente a un ".then()"
	 */
	defaultHeaders() {
		let h = new Headers(this.headers);
		let opts = new RequestOptions({ headers: h });
		return Promise.resolve(opts);
	}

	/**
	 * Es seguro no hacer catch aqui?
	 */
	authHeaders() {

		return this.storage.ready()
			.then(() => this.storage.get('token'))
			.then((token) => {
				let h = new Headers(this.headers);
				h.set('Authorization', `Bearer <${token}>`);
				return new RequestOptions({ headers: h });
			});
	}

	tokenSub(token) {
		return this.jwt.decodeToken(token).sub;
	}

}
