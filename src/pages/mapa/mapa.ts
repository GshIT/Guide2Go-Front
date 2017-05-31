import { Component, ViewChild } from '@angular/core';

import { NavParams, NavController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';

import { Zones } from '../../providers/zones';
import { SubzoneProvider } from '../../providers/subzone-provider';
import { ParadaProvider } from '../../providers/parada-provider';
import { NativeAudio } from '@ionic-native/native-audio';

@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
  providers: [Zones,SubzoneProvider,ParadaProvider,NativeAudio]
})
export class MapaPage {

  @ViewChild('map') mapElement;
  map: any;
  latLng: any;
  intervalId: any;
  intervalStop: any;
  intervalSubzone: any;
  marker: any;
  follow: boolean;
  zone: any;
  subzones: any;
  paradas: any;
  subPolygon: any;
  aktivParada: any;

  constructor(
    public zonesProvider: Zones,
    public params: NavParams,
    public navCtrl: NavController,
    public subzoneProb: SubzoneProvider,
    public paradaProb: ParadaProvider,
    private nativeAudio: NativeAudio) {

    this.paradas = [];
    this.aktivParada = [];
    this.subPolygon = [];
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
    clearInterval(this.intervalStop);
    clearInterval(this.intervalSubzone);
  }

  //revisa las subzonas y dice en cual estoy yo y filtra las paradas a solo en la subzona en la que estoy
  uploadSubZone(){
    this.intervalSubzone = setInterval(this.filterStops.bind(this), 5000);
  }

  filterStops(){
    let i;
    let inside = false;
    for (i = 0; i < this.subPolygon.length && !inside; i++){
      //console.log(this.subPolygon[i]);
      if(google.maps.geometry.poly.containsLocation(this.latLng, this.subPolygon[i].polygon)){
        console.log("dentro de " + this.subPolygon[i].id);
        this.getAktiv(this.subPolygon[i].id);
      }
    }
  }

  getAktiv(id: any){
    let i;
    this.aktivParada = [];
    for (i = 0; i < this.paradas.length; i++){
      if(this.paradas[i].subzona == id){
        this.aktivParada.push(this.paradas[i]);
      }
    }
  }

  uploadStop(){
    this.intervalStop = setInterval(this.nearStop.bind(this), 5000);
  }

  nearStop(){
    let i;
    let distance;
    var audio;
    for (i = 0; i < this.aktivParada.length; i++){
      //console.log(this.aktivParada[i].point);
      distance = this.calcDistance(i);
      //console.log(distance);
      if(distance <= 50){
        //esto funciona para navegador
        audio = new Audio('http://soundbible.com/mp3/Censored_Beep-Mastercard-569981218.mp3');
        audio.play();
        //hasta aca
        //audio nativo
        //this.nativeAudio.preloadSimple(this.aktivParada[i].id, 'http://soundbible.com/mp3/Censored_Beep-Mastercard-569981218.mp3')
        //.then(() => console.log(this.aktivParada[i].id), () => console.log("error"));
        //hasta aca audio nativo
        console.log('beeep '+this.aktivParada[i].nombre);
      }
    }
  }

  calcDistance(i: any){
    let p2 = new google.maps.LatLng(this.aktivParada[i].point.lat, this.aktivParada[i].point.lng);
    return google.maps.geometry.spherical.computeDistanceBetween(this.latLng,p2);
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
      this.subPolygon.push({polygon:this.previewZone(polygon,'#4286f4'),id: subZ.id});

      this.bindParadas(subZ.id);
    }
    this.uploadSubZone();
    this.uploadStop();
  }

  bindParadas(id){
    this.paradaProb.getParadas(id)
    .subscribe(this.previewParadas.bind(this), (err)=>{console.log(err);});
  }

  previewParadas(res){

    for(let parada in res){
      let par = res[parada];
      let point = this.getPoint(par);

      this.createMarker(point,par.nombre,par.descripcion);
      this.paradas.push({point: point, id: par.id, subzona: par.sub_zonas_id, nombre: par.nombre});
      //console.log(par);
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
      return zonePolygon;
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
