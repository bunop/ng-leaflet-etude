import { Component, OnInit } from '@angular/core';

import { GeoJSON, latLng, Map, tileLayer, point } from 'leaflet';
import "leaflet/dist/images/marker-shadow.png";

import { CdpService } from './cdp.service';

@Component({
  selector: 'app-image-gis-search',
  templateUrl: './image-gis-search.component.html',
  styleUrls: ['./image-gis-search.component.scss']
})
export class ImageGisSearchComponent implements OnInit {
  organisms: GeoJSON;
  map: Map;

  // Define our base layers so we can reference them multiple times
  streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  wMaps = tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Layers control object with our two base layers and the three overlay layers
  layersControl = {
    baseLayers: {
      'Street Maps': this.streetMaps,
      'Wikimedia Maps': this.wMaps
    },
    overlays: { }
  };

  layers = [ this.streetMaps ];

  // Set the initial set of displayed layers (we could also use the leafletLayers input binding for this)
  options = {
    layers: this.layers,
    zoom: 7,
    center: latLng([ 46.879966, -121.726909 ])
  };

  constructor(private cdpService: CdpService) { }

  ngOnInit(): void {
    // get organisms data
    this.cdpService.getOrganisms().subscribe(organisms => {
      this.organisms = organisms;
      this.organisms.addTo(this.map);

      this.layersControl.overlays['organisms'] = this.organisms;

      this.map.fitBounds(this.organisms.getBounds(), {
        padding: point(24, 24),
        maxZoom: 12,
        animate: true
      });
    });
  }

  onMapReady(map: Map) {
    this.map = map;
  }

}
