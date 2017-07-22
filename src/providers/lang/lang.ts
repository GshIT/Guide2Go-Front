import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { HttpUtils } from '../../providers/custom-http';

/*
  Generated class for the LangProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LangProvider {

  langUrl: any;

  constructor(public http: Http, public utils: HttpUtils) {
    console.log('Hello LangProvider Provider');
    this.langUrl = utils.routes['language'];
  }

  get(){
    return this.utils.authHeaders()
		.then((options) => this.http.get(this.langUrl, options).toPromise())
		.then((resp) => resp.json())
		.catch((error:any) => Promise.reject(error.json().error || 'Server error'));
  }

}
