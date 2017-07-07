import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as L from 'leaflet'

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  @ViewChild('map') mapContainer

  center: L.PointTuple
  zoom: number
  map: L.Map

  ionViewDidLoad() {
    this.center = [110.712246, -7.614529]; // Pulau Jawa
    this.zoom = 7
    this.initMap()
  }

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  initMap() {
    this.map = L.map(this.mapContainer.nativeElement, {
      center: this.center,
      zoom: this.zoom,
      layers: [
        L.tileLayer("http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png")
      ]
    })
  }
}
