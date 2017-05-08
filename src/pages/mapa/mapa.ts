import { Component, ViewChild } from '@angular/core';

import { NavParams, NavController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';

import { Zones } from '../../providers/zones';

@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
  providers: [Zones]
})
export class MapaPage {

  @ViewChild('map') mapElement;
  map: any;
  latLng: any;
  intervalId: any;
  marker: any;
  follow: boolean;
  zone: any;

  constructor(
    public zonesProvider: Zones,
    public params: NavParams,
    public navCtrl: NavController) {

    this.zone = params.get('zone');
    this.follow = (typeof(this.zone) !== 'undefined') ? false : true;
    
    //const coords = zonesProvider.getZoneLatLng(this.zone);
    const coords = { lat: 0, lng: 0 };
    /* -13.163109, -72.544961 */
    this.latLng = new google.maps.LatLng(coords.lat, coords.lng);
    this.marker = new google.maps.Marker({
      position: this.latLng
    });
  }

  ionViewDidLoad() {
    this.initMap();
    if (this.follow) this.uploadCycle(); 
  }

  ionViewWillUnload(){
    console.log("saliendo")
    clearInterval(this.intervalId);
  }

  initMap(){

    var myStyles = [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [
              { visibility: "off" }
        ]
      }
    ];

    let mapOptions = {
      center: this.latLng,
      zoom: 3,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: myStyles,
      disableDefaultUI: true
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    if (typeof(this.zone) !== 'undefined') {
      this.previewZone(this.zone);
    }
  }

  uploadCycle(){
    this.getGeo().then(() => {this.marker.setMap(this.map);}).then(() => {this.setPlace(this.latLng);this.map.setZoom(17);})
    this.intervalId = setInterval(this.intervalFunc.bind(this), 2000);
  }

  setPlace(position: any){
    this.map.setCenter(position);
  }

  setMarker(position: any){
    this.marker.setPosition( position );
  }

  intervalFunc(){
    this.getGeo().then(() => {this.setPlace(this.latLng);this.setMarker(this.latLng);})
  }

  getGeo() {
    return Geolocation.getCurrentPosition().then((position) => {
      console.log("Posicion actualizada");
      this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      }, (err) => {
        console.log(err);
    });
  }

  previewZone(sub) {
    let polygon = [{}];
    console.log(polygon);
    for (let z of sub.poligono.linestrings[0].points) {
      polygon.push({lat: z.lat, lng: z.lon});
    }
    polygon.shift();

    let hola = this.zonesProvider.getZoneLatLng(polygon);
    this.latLng = new google.maps.LatLng(hola.lat, hola.lng);
    console.log(hola);

      let zonePolygon = new google.maps.Polygon({
        paths: polygon,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: '#FF0000',
        fillOpacity: 0.35
      });
      //console.log(this.zone.poligono.linestrings.pop().points);
      this.map.setCenter(this.latLng);
      zonePolygon.setMap(this.map);

      /*for (let p of z.points) {
        new google.maps.Marker({
          animation: google.maps.Animation.DROP,
          position: p,
          clickable: true,
          map: this.map,
          title: 'Nombre de la parada' 
          Aqui deberia haber un nombre de la parada 
        });
      }*/

    //}

  }

}
