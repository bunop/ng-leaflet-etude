import { Component, OnInit } from '@angular/core';

import * as L from 'leaflet';
import 'leaflet.markercluster';
import "leaflet/dist/images/marker-shadow.png";

import { CdpService } from './cdp.service';

@Component({
  selector: 'app-image-gis-search',
  templateUrl: './image-gis-search.component.html',
  styleUrls: ['./image-gis-search.component.scss']
})
export class ImageGisSearchComponent implements OnInit {
  organisms: L.GeoJSON;
  specimens: L.GeoJSON;
  map: L.Map;

  // Define our base layers so we can reference them multiple times
  streetMaps = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  wMaps = L.tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
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
    zoom: 4,
    center: L.latLng([ 40, 5 ])
  };

  // Marker cluster stuff
	markerClusterGroup: L.MarkerClusterGroup;
  markerClusterData: L.Marker[] = [];
	markerClusterOptions: L.MarkerClusterGroupOptions;

  constructor(private cdpService: CdpService) { }

  ngOnInit(): void {
    // get organisms data
    this.cdpService.getOrganisms().subscribe(organisms => {
      this.organisms = organisms;
      // this.organisms.addTo(this.map);
      this.markerClusterGroup.addLayer(this.organisms);

      this.layersControl.overlays['organisms'] = this.markerClusterGroup;
    });

    // get specimens data
    this.cdpService.getSpecimens().subscribe(specimens => {
      this.specimens = specimens;
      // this.specimens.addTo(this.map);
      this.markerClusterGroup.addLayer(this.specimens);

      this.layersControl.overlays['specimens'] = this.markerClusterGroup;

      this.map.fitBounds(this.specimens.getBounds(), {
        padding: L.point(24, 24),
        maxZoom: 12,
        animate: true
      });
    });
  }

  onMapReady(map: L.Map) {
    this.map = map;

    this.map.on("click", e => {
      console.log(e);
    });
  }

  markerClusterReady(group: L.MarkerClusterGroup) {
    // Do stuff with group
    this.markerClusterGroup = group;
  }

}
