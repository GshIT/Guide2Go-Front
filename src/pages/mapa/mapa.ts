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

  constructor(public navCtrl: NavController) {
    this.latLng = new google.maps.LatLng(-34.9290, 138.6010);
  }

  ionViewDidLoad(){
    this.getGeo();
    this.initMap();
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
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: myStyles,
      disableDefaultUI: true
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }


  getGeo(){
     Geolocation.getCurrentPosition().then((position) => {

      this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.map.setCenter(this.latLng);
 
    }, (err) => {
      console.log(err);
    });
  }


}
