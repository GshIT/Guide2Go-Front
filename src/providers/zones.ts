import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ZONES } from './mock-zones';
import 'rxjs/add/operator/map';

/*
  Generated class for the Zones provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Zones {

  constructor(public http: Http) {
    console.log('Hello Zones Provider');
  }

  /* Debe hacerse con promesas.... */
  /* Y crearse un objeto especial para las zonas */
  getZoneData(id) {
    return ZONES.find((elem) => elem.id === id);
  }

  /* Hay que quitar el getZoneData de aqui */
  getZoneLatLng(resp) {

    let coord = { lat: 0, lng: 0 };
    if (!resp) return coord;

    const sub = resp;
    const len = sub.length;

    let size = sub.length;
    if (size != 0) {
      coord.lat += sub.reduce((acc, val) => acc + val.lat, 0) / size;
      coord.lng += sub.reduce((acc, val) => acc + val.lng, 0) / size;
    }
    

    /* Codigo feo */
    if (len != 0) {
      coord.lat /= len;
      coord.lng /= len;
    }

    return coord;

  }

  getZones() {
    return ZONES;
  }

}
