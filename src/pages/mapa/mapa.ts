import { Component, ViewChild } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';


@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html'
})
export class MapaPage {

  @ViewChild('map') mapElement;
  map: any;
  latLng: any;
  intervalId: any;
  marker: any;

  constructor(public navCtrl: NavController) {
    this.latLng = new google.maps.LatLng(-34.9290, 138.6010);
    this.marker = new google.maps.Marker({
        position: this.latLng
      });
  }

  ionViewDidLoad(){
    this.initMap();

    //aca pon algo para que no se ejecute si hubo parametros
    this.uploadCycle();
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
      zoom: 2,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: myStyles,
      disableDefaultUI: true
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
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

  getGeo(){
     return Geolocation.getCurrentPosition().then((position) => {
      console.log("Posicion actualizada");
      this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    }, (err) => {
      console.log(err);
    });
  }


}
