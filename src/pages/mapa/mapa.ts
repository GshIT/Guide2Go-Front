import { Component, ViewChild } from '@angular/core';

import { NavController } from 'ionic-angular';


@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html'
})
export class MapaPage {

  @ViewChild('map') mapElement;
  map: any;

  constructor(public navCtrl: NavController) {
    
  }

  ionViewDidLoad(){
    this.initMap();
  }

  initMap(){

    let latLng = new google.maps.LatLng(-34.9290, 138.6010);
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
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: myStyles,
      disableDefaultUI: true
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

}
