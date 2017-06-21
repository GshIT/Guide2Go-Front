import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { HttpUtils } from '../providers/custom-http';

/*
  Generated class for the AudioProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AudioProvider {

	audioUrl: any;

  constructor(public http: Http, public httputils: HttpUtils) {
    console.log('Hello AudioProvider Provider');
    this.audioUrl = this.httputils.routes['audioParada'];
  }

  getAudio(parada: any){
  	return this.httputils.authHeaders()
		.then((options) => this.http.get(this.audioUrl+parada, options).toPromise())
		.then((resp) => resp.json())
		.catch((error:any) => Promise.reject(error.json().error || 'Server error'));
  }

}
