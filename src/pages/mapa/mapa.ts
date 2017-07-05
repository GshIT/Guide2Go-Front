import { Component, ViewChild } from '@angular/core';
import { Geolocation } from 'ionic-native';
import { 
	NavParams,
	NavController,
	Toast,
	ToastController,
} from 'ionic-angular';

import { Zones } from '../../providers/zones';
import { SubzoneProvider } from '../../providers/subzone-provider';
import { ParadaProvider } from '../../providers/parada-provider';
import { AudioProvider } from '../../providers/audio-provider';

@Component({
	selector: 'page-mapa',
	templateUrl: 'mapa.html',
	providers: [Zones,SubzoneProvider,ParadaProvider,AudioProvider]
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
	audio: any;

	// Toast
	toast: Toast;
	lastStop: Object;

	/**
	 * Este componente lo que tiene
	 * e esteroides no jo
	 */
	constructor(
		public toastCtrl: ToastController,
		public zonesProvider: Zones,
		public params: NavParams,
		public navCtrl: NavController,
		public subzoneProb: SubzoneProvider,
		public paradaProb: ParadaProvider,
		public audioProv: AudioProvider) {

		this.lastStop = null;

		this.paradas = [];
		this.aktivParada = [];
		this.subPolygon = [];
		this.zone = params.get('zone');
		this.follow = (typeof(this.zone) !== 'undefined') ? false : true;
		this.audio = new Audio()

		//const coords = zonesProvider.getZoneLatLng(this.zone);
		const coords = { lat: 0, lng: 0 };
		/* -13.163109, -72.544961 */
		this.latLng = new google.maps.LatLng(coords.lat, coords.lng);


		const iconSelf = {
			url: '/assets/self.png',
			anchor: new google.maps.Point(16, 16)
		};

		this.marker = new google.maps.Marker({
			position: this.latLng,
			icon: iconSelf
		});


	}

	ionViewDidLoad() {
		this.initMap();
		this.uploadCycle();  
	}

	ionViewWillUnload(){
		console.log("Saliendo")
		clearInterval(this.intervalId);
		clearInterval(this.intervalStop);
		clearInterval(this.intervalSubzone);
		this.audio.pause();
		this.audio = "";
	}

	// Revisa las subzonas y dice en cual estoy yo y 
	// filtra las paradas a solo en la subzona en la que estoy
	uploadSubZone(){
		this.intervalSubzone = setInterval(this.filterStops.bind(this), 5000);
	}

	filterStops(){
		let i;
		let inside = false;
		for (i = 0; i < this.subPolygon.length && !inside; i++){
			//console.log(this.subPolygon[i]);
			if(google.maps.geometry.poly.containsLocation(this.latLng, this.subPolygon[i].polygon)){
				console.log("Dentro de " + this.subPolygon[i].id);
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

		//const url = 'http://digitalcook.info:8000/storage/audios/vhbPaYBeWdRr7opp47K8spm12rPQjkf6WAQ59nj3.mpga';
		const storageUrl = 'http://digitalcook.info:8000/storage/';
		let actStop;
		let i;
		let distance;

		/**
		 * Aqui cambie las paradas filtradas por todas
		 * para probar si suena
		 */
		for (i = 0; i < this.paradas.length; i++){

			actStop = this.paradas[i]; // for of?
			distance = this.calcDistance(i);

			//console.log(actStop.point);
			//console.log(distance);

			if(distance <= 50){
				this.audioProv.getAudio(actStop.id)
				.then((aud) => {
					if(this.audio.paused){
						this.audio = new Audio(storageUrl+aud);
						this.audio.play();
					}
				});

				// Esto funciona para navegador
				

				

				console.log(`beeep ${actStop.nombre}`);

				/**
				 * Muestra el toast si la ultima parada
				 * es distinta a la actual
				 */
				if (this.lastStop != actStop) {
					console.log('Mostrando toast...');
					this.showToast(`Beep en ${actStop.nombre}`);
					this.lastStop = actStop;
				}

			}
		}
	}

	showToast(msg: string) {

		// Hay que hacer una especie de lock 
		// para cuando las paradas estan muy cerca
		this.toast = this.toastCtrl.create({
			message: msg,
			closeButtonText: "Ok!",
			showCloseButton: true,
			dismissOnPageChange: true
		});
		this.toast.present();

		console.log('Toast creado!');

		this.toast.onDidDismiss(() => {
			console.log('Stop toasting');
		});

	}

	calcDistance(i: any){
		let p2 = new google.maps.LatLng(
			// Aqui tambien cambie las paradas
			// filtradas por todas
			this.paradas[i].point.lat,
			this.paradas[i].point.lng
		);
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
			

			/* Fit polygon bounds wink wink */

            let bounds = new google.maps.LatLngBounds();
            polygon.forEach((p) => bounds.extend(p));

            this.map.fitBounds(bounds);
            this.map.setCenter(bounds.getCenter());

            /********************************/

			this.subzoneProb.getZone(this.zone.id)
				.then(this.previewSubZone.bind(this)) 
				.catch((err)=>{console.log(err);}); 
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

		// Deberia ir esto aqui?
		this.uploadSubZone();
		this.uploadStop();
		//
	}

	bindParadas(id){
		this.paradaProb.getParadas(id)
			.then(this.previewParadas.bind(this)) 
			.catch((err)=>{console.log(err);});
	}

	previewParadas(res){

		for(let parada in res){
			let par = res[parada];
			let point = this.getPoint(par);

			this.createMarker(point,par.nombre,par.descripcion);
			this.paradas.push({
				point: point,
				id: par.id,
				subzona: par.sub_zonas_id,
				nombre: par.nombre
			});
			// console.log(par);
		}
	}

	createMarker(point,name,description){

		var contentString = '<h2>'+name+'</h2>'+'<p>'+description+'</p>';
		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});

		const logoMarker = {
			url: '/assets/marker.png',
			scaledSize: new google.maps.Size(29, 37)
		}

		var marker = new google.maps.Marker({
			position: point,
			map: this.map,
			title: name,
			animation: google.maps.Animation.DROP,
			icon: logoMarker
		});

		marker.addListener('click', function() {
			infowindow.open(this.map, marker);
			this.map.setZoom(13);
			this.map.setCenter(marker.getPosition());
		});

	}

	getPoint(sub){
		return {lat: sub.punto.lat, lng: sub.punto.lon};
	}

	uploadCycle(){
		this.getGeo().then(() => this.marker.setMap(this.map))
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
		return Geolocation.getCurrentPosition()
			.then((position) => {
				console.log("Posicion actualizada");
				this.latLng = new google.maps.LatLng(
					position.coords.latitude,
					position.coords.longitude
				);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	centerPolygon(polygon){
		let hola = this.zonesProvider.getZoneLatLng(polygon);
		this.latLng = new google.maps.LatLng(hola.lat, hola.lng);
		this.map.setCenter(this.latLng);
	}

	getPolygon(sub){
		let polygon = [];
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
