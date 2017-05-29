import { Component, ViewChild } from '@angular/core';

import { NavParams, NavController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';

import { Zones } from '../../providers/zones';
import { SubzoneProvider } from '../../providers/subzone-provider';
import { ParadaProvider } from '../../providers/parada-provider';

@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
  providers: [Zones,SubzoneProvider,ParadaProvider]
})
export class MapaPage {

  @ViewChild('map') mapElement;
  map: any;
  latLng: any;
  intervalId: any;
  marker: any;
  follow: boolean;
  zone: any;
  subzones: any;
  paradas: any;

  constructor(
    public zonesProvider: Zones,
    public params: NavParams,
    public navCtrl: NavController,
    public subzoneProb: SubzoneProvider,
    public paradaProb: ParadaProvider) {

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
      zoom: 3,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: myStyles,
      disableDefaultUI: true
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    if (typeof(this.zone) !== 'undefined') {
      let polygon = this.getPolygon(this.zone);
      this.previewZone(polygon,'#FF0000');
      this.centerPolygon(polygon);

      this.subzoneProb.getZone(this.zone.id)
      .subscribe(this.previewSubZone.bind(this), (err)=>{console.log(err);});
    }
  }

  previewSubZone(res){
    this.subzones = res;

    for(let subzone in this.subzones){
      let subZ = this.subzones[subzone]
      let polygon = this.getPolygon(subZ);
      this.previewZone(polygon,'#4286f4');

      this.bindParadas(subZ.id);
    }
  }

  bindParadas(id){
    this.paradaProb.getParadas(id)
    .subscribe(this.previewParadas.bind(this), (err)=>{console.log(err);});
  }

  previewParadas(res){
    this.paradas = res;

    for(let parada in this.paradas){
      let par = this.paradas[parada]
      let point = this.getPoint(par);
      this.createMarker(point,par.nombre,par.descripcion);
    }
  }

  createMarker(point,name,description){

    var contentString = '<h2>'+name+'</h2>'+'<p>'+description+'</p>';
    var infowindow = new google.maps.InfoWindow({
          content: contentString
    });

    var marker = new google.maps.Marker({
      position: point,
      map: this.map,
      title: name,
      animation: google.maps.Animation.DROP
    });

    marker.addListener('click', function() {
      infowindow.open(this.map, marker);
    });

  }

  getPoint(sub){
    return {lat: sub.punto.lat, lng: sub.punto.lon};
  }

  uploadCycle(){
    this.getGeo().then(() => {this.marker.setMap(this.map);})
    this.intervalId = setInterval(this.intervalFunc.bind(this), 2000);
  }

  setPlace(position: any){
    this.map.setCenter(position);
  }

  setMarker(position: any){
    this.marker.setPosition( position );
  }

  intervalFunc(){
    this.getGeo().then(() => {this.setMarker(this.latLng);})
  }

  getGeo() {
    return Geolocation.getCurrentPosition().then((position) => {
      console.log("Posicion actualizada");
      this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      }, (err) => {
        console.log(err);
    });
  }

  centerPolygon(polygon){
    let hola = this.zonesProvider.getZoneLatLng(polygon);
    this.latLng = new google.maps.LatLng(hola.lat, hola.lng);
    this.map.setCenter(this.latLng);
  }

  getPolygon(sub){
    let polygon = [{}];
    for (let z of sub.poligono.linestrings[0].points) {
      polygon.push({lat: z.lat, lng: z.lon});
    }
    polygon.shift();
    return polygon
  }

  previewZone(polygon, color) {
    

    //let hola = this.zonesProvider.getZoneLatLng(polygon);
    //this.latLng = new google.maps.LatLng(hola.lat, hola.lng);

      let zonePolygon = new google.maps.Polygon({
        paths: polygon,
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: color,
        fillOpacity: 0.35
      });
      //console.log(this.zone.poligono.linestrings.pop().points);
      //this.map.setCenter(this.latLng);
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
