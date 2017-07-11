import { Component, ViewChild } from '@angular/core';
import { Geolocation } from 'ionic-native';
import { 
	NavParams,
	NavController,
	Toast,
	ToastController,
} from 'ionic-angular';

import {Observable} from 'rxjs/Observable'


import { Zones } from '../../providers/zones';
import { SubzoneProvider } from '../../providers/subzone-provider';
import { ParadaProvider } from '../../providers/parada-provider';
import { AudioProvider } from '../../providers/audio-provider';
import { PhotoProvider } from '../../providers/photo/photo';
import { ActiveProvider } from '../../providers/active-provider';

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
	closeParada:any;
	obs: any;
	nombreParadaAudio: any;

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
		public audioProv: AudioProvider,
		public photoProv: PhotoProvider,
		public activProv: ActiveProvider) {

		this.lastStop = null;

		this.paradas = [];
		this.aktivParada = [];
		this.subPolygon = [];
		this.zone = params.get('zone');
		this.follow = (typeof(this.zone) !== 'undefined') ? false : true;
		this.audio = {
			"sonidos": [{}],
			'idSonando': undefined
		};
		this.closeParada= 0;
		this.audio.sonidos.pop();
		//const coords = zonesProvider.getZoneLatLng(this.zone);
		const coords = { lat: 0, lng: 0 };
		/* -13.163109, -72.544961 */
		this.latLng = new google.maps.LatLng(coords.lat, coords.lng);


		const iconSelf = {
			url: './assets/self.png',
			anchor: new google.maps.Point(16, 16)
		};

		this.marker = new google.maps.Marker({
			position: this.latLng,
			icon: iconSelf
		});

		this.obs = undefined;
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
		//el this.audio mandarlo como output, para pararlo desde fuera.
		
		if(this.obs != undefined){
			console.log("Desuscribiendo");
			this.obs.unsubscribe();
		}

		if(this.audio.idSonando != undefined){
			let aktivsound = this.objectOfIndex(this.audio.sonidos,this.audio.idSonando).sonido;
			if(!aktivsound.paused) aktivsound.pause();
		}
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
		let i;
		let distance;
		let closeP = 0;
		let sonidos = new Array();
		let PArray = [];

		/**
		 * Aqui cambie las paradas filtradas por todas
		 * para probar si suena
		 */
		for (i = 0; i < this.paradas.length; i++){

			let actStop = this.paradas[i]; // for of?
			distance = this.calcDistance(i);
			if(distance <= actStop.metros){ 
				PArray.push(this.audioProv.getAudio(actStop.id)
				.then((aud) => {
					for(let audio in aud){
						closeP = closeP +1;
						sonidos.push({
							"nombreParada" : actStop.nombre,
							"idParada": actStop.id,
							"idSonido": aud[audio].id,
							"sonido": new Audio(storageUrl+aud[audio].path)
						});
					}
				}));

				/*if (this.lastStop != actStop) {
					console.log('Mostrando toast...');
					this.showToast(`Bienvenido a ${actStop.nombre}`);
					this.lastStop = actStop;
				}*/

			}
		}

		console.log("HECHA PA TRASSSSS");

		this.obs = Observable.fromPromise(Promise.all(PArray)).subscribe(()=>{
			let haySonido;
			this.closeParada = closeP;
			if(this.audio.sonidos.length == 0 && closeP != 0) {
				this.audio.idSonando = sonidos[0].idSonido;
				haySonido = true;
			}
			else{ 
				this.filterDiferent(this.audio.sonidos,sonidos);
			}
			this.putDiferent(this.audio.sonidos,sonidos);
			if(haySonido){
				let aktivS = this.objectOfIndex(this.audio.sonidos,this.audio.idSonando);
				aktivS.sonido.play();
				this.nombreParadaAudio = aktivS.nombreParada;
			}
		});

	}

	filterDiferent(arr1,arr2){
		let existe;
		let sonar = false;
		for(let i in arr1){
			existe = false;
			for(let j in arr2){
				if(arr1[j].idSonido == arr2[i].idSonido){
					existe = true;
				}
			}
			if(!existe){
				arr1.splice(i, 1);
				if(arr1.length != 0){
					this.audio.idSonando = arr1[0].idSonido;
				}
				sonar = true;
			}
		}
	}

	putDiferent(arr1,arr2){
		let existe;
		for(let i in arr2){
			existe = false;
			for(let j in arr1){
				if(arr1[j].idSonido == arr2[i].idSonido){
					existe = true;
				}
			}
			if(!existe){
				arr1.push(arr2[i]);
			}
		}
	}

	objectOfIndex(arr,id){
		let objeto;
		for(let i in arr){
			if(arr[i].idSonido == id){
				objeto = arr[i]
			}
		}
		return objeto;
	}

	indexOfIndex(arr,id){
		let index;
		for(let i in arr){
			if(arr[i].idSonido == id){
				index = i
			}
		}
		return parseInt(index);
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

			this.photoProv.getPhoto(par.id).then((photo)=>{this.createMarker(point,par.nombre,par.descripcion,photo);})
			.catch((error) => {this.createMarker(point,par.nombre,par.descripcion,-1);});
		
			this.paradas.push({
				point: point,
				id: par.id,
				subzona: par.sub_zonas_id,
				nombre: par.nombre,
				metros: par.metros
			});
			// console.log(par);
		}
	}

	createMarker(point, name, description, photo){

		let contentString = "";
		
		if(photo == -1){
			contentString += `
			<h2 class="spot-title">${name}</h2>
			<p class="spot-text">${description}</p>`;
		}
		else{
			contentString += `
			<h2 class="spot-title">${name}</h2>
			<p class="spot-text">${description}</p>
			<img 
				src="http://digitalcook.info:8000/storage/${photo}" 
				width="${window.innerWidth/2}" 
				class="image">`;
		}
		

		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});

		const logoMarker = {
			url: './assets/marker.png',
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
			//this.map.setZoom(13);
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
			strokeOpacity: 0,
			strokeWeight: 3,
			fillColor: color,
			fillOpacity: 0
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
 
      prev(){
      	if(this.audio.sonidos.length != 0){
      		let i = this.indexOfIndex(this.audio.sonidos,this.audio.idSonando);
      		let aktivsound = this.objectOfIndex(this.audio.sonidos,this.audio.idSonando).sonido;
      		i = i - 1;
      		if(i < 0) i = this.audio.sonidos.length -1;
      		this.audio.idSonando = this.audio.sonidos[i].idSonido;
      		if(!aktivsound.paused){
      			aktivsound.pause();
      		};
      		aktivsound.load();
      		aktivsound =this.objectOfIndex(this.audio.sonidos,this.audio.idSonando);
      		aktivsound.sonido.play();
      		this.nombreParadaAudio = aktivsound.nombreParada;
      	}
      } 

      next(){
      	if(this.audio.sonidos.length != 0){
      		let i = this.indexOfIndex(this.audio.sonidos,this.audio.idSonando);
      		let aktivsound = this.objectOfIndex(this.audio.sonidos,this.audio.idSonando).sonido;
      		i = i + 1;
      		console.log(i);
      		if(i == this.audio.sonidos.length) i = 0;
      		this.audio.idSonando = this.audio.sonidos[i].idSonido;  
      		if(!aktivsound.paused){
      			aktivsound.pause();
      		};
      		aktivsound.load();
      		aktivsound =this.objectOfIndex(this.audio.sonidos,this.audio.idSonando);
      		aktivsound.sonido.play();
      		this.nombreParadaAudio = aktivsound.nombreParada;
      	}
      }

      playPause(){
      	if(this.audio.sonidos.length != 0){
      		let aktivsound = this.objectOfIndex(this.audio.sonidos,this.audio.idSonando).sonido;

	      	if(aktivsound.paused){
	      		aktivsound.play();
	      	}
	      	else{
	      		aktivsound.pause();
	      	}
	    }
      }
}
