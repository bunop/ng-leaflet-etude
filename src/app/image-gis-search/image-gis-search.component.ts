import { Component, OnInit } from '@angular/core';

import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/images/marker-shadow.png';

import { CdpService, GeoOrganism, GeoSpecimen } from './cdp.service';

@Component({
  selector: 'app-image-gis-search',
  templateUrl: './image-gis-search.component.html',
  styleUrls: ['./image-gis-search.component.scss']
})
export class ImageGisSearchComponent implements OnInit {
  // this will be my geojson layers
  organisms_lyr: L.GeoJSON;
  specimens_lyr: L.GeoJSON;

  // this will be my leaflet map instance
  map: L.Map;

  // this will track drawn items with leaflet.draw
  drawnItems: L.FeatureGroup = L.featureGroup();

  drawOptions = {
    position: 'bottomright',
    draw: {
      // disable those editing features
      polygon : false,
      polyline : false,
      rectangle : false,
      marker: false,
      circlemarker: false
    },
    edit: {
      featureGroup: this.drawnItems
    }
  };

  // here I will track data to visualize tables
  organisms_data: GeoOrganism[];
  specimens_data: GeoSpecimen[];

  // two flags to determine if I'm waiting for data or not
  isFetchingOrganisms = false;
  isFetchingSpecimens = false;

  // for the accordion(?), track the status of organism panel (example)
  panelOpenState = false;

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
    // setting flag values
    this.isFetchingOrganisms = true;
    this.isFetchingSpecimens = true;

    // get organisms data
    this.cdpService.getOrganisms().subscribe(data => {
      this.organisms_lyr = data.organisms_lyr;
      this.organisms_data = data.organisms_data;

      // add organisms layer to marker cluster group
      this.markerClusterGroup.addLayer(this.organisms_lyr);

      // set flag values
      this.isFetchingOrganisms = false;
    });

    // get specimens data
    this.cdpService.getSpecimens().subscribe(data => {
      this.specimens_lyr = data.specimens_lyr;
      this.specimens_data = data.specimens_data;

      // add organisms layer to marker cluster group
      this.markerClusterGroup.addLayer(this.specimens_lyr);

      // set flag values
      this.isFetchingSpecimens = false;

      // zoom map on specimens
      this.map.fitBounds(this.specimens_lyr.getBounds(), {
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
    this.layersControl.overlays['cluster'] = this.markerClusterGroup;
  }

  public onDrawCreated(e: L.DrawEvents.Created) {
    const circleLayer = (e.layer as L.Circle);
    this.drawnItems.addLayer(circleLayer);
    console.log(circleLayer.getLatLng());
    console.log(circleLayer.getRadius());
  }

  public onDrawStart(e: L.DrawEvents.DrawStart) {
    // clear up items from drawn layer
    this.drawnItems.clearLayers();
    // tslint:disable-next-line:no-console
    console.log('Draw Started Event!', e);
  }

}
