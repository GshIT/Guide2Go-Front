import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class UserProvider {

	userUrl: string;

 	constructor(public http: Http) {
    	this.userUrl = 'http://digitalcook.info:8000/api/user';
  	}

	createUser(args: {}): Observable<{}>{
		let bodyString = JSON.stringify(args);
        let headers      = new Headers({ 'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' });
        let options       = new RequestOptions({ headers: headers });

		return this.http.post(this.userUrl, bodyString, options)
                         .map(this.printInside)
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error'));

	}

	private printInside(res: Response) {
		let body = res.json();
		
		return body;
	}

}
