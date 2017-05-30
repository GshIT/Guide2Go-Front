import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { AuthHttp } from 'angular2-jwt';
import { JwtHelper } from 'angular2-jwt';


@Injectable()
export class UserProvider {

	userUrl: string;

	constructor(
		public http: Http, 
		public authHttp: AuthHttp, 
		public JwtHelper: JwtHelper) {

		//this.userUrl = 'http://127.0.0.1:8000/api/user';
		this.userUrl = 'http://digitalcook.info:8000/api/user';
	}

	createUser(args: {}): Observable<{}>{
		let bodyString = JSON.stringify(args);
		let headers = new Headers({ 
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*' 
		});
		let options = new RequestOptions({ headers: headers });

		return this.http.post(this.userUrl, bodyString, options)
		.map(this.printInside)
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));

	}

	private printInside(res: Response) {
		let body = res.json();
		console.log(body);
		return body;
	}

	show(token, user){
		
		// Aqui hay q ver como se manda el token solo
		// this.userUrl + '/' + this.JwtHelper.decodeToken(token).sub+'?token=' + token
		
		// Ya deberia funcionar sin el token de parametro

		let url = `${this.userUrl}/${this.JwtHelper.decodeToken(token).sub}?token=${token}`;

		return this.authHttp.get(url)
			.subscribe(
				data => { 
					user.nombre  = data.json().users.pop().name; 
					user.email   = data.json().users.pop().email; 
					user.dolares = data.json().users.pop().dolares
				},
				err => console.log(err),
				() => console.log('Request Complete')
			);
	}

}
