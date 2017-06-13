import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ActiveProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ActiveProvider {

	active: any;

  constructor(public http: Http) {
    console.log('Hello ActiveProvider Provider');
  }

  activate(element: any){
  	this.active = element;
  }

  seeActive(){
  	return this.active;
  }

  deactivate(){
  	this.active = "";
  }

  isActive(element: any){
  	if(typeof(this.active) !== 'undefined'){
  		return this.active.id == element.id;
  	}
  	else{
  		return false;
  	}
  }
}
