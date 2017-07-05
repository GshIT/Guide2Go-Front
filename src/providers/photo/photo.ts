import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { HttpUtils } from '../../providers/custom-http';

/*
  Generated class for the PhotoProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PhotoProvider {

	photoUrl: any;

  constructor(public http: Http, public httputils: HttpUtils) {
    console.log('Hello PhotoProvider Provider');
    this.photoUrl = this.httputils.routes['photoParada'];
  }

  getPhoto(parada: any){
  	return this.httputils.authHeaders()
		.then((options) => this.http.get(this.photoUrl+parada, options).toPromise())
		.then((resp) => resp.json())
		.catch((error:any) => Promise.reject(error.json().error || 'Server error'));
  }

}
