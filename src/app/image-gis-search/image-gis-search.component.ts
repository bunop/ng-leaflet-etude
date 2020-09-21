import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable, zip } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';

import { Feature } from 'geojson';

import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet-draw';
import 'leaflet-easybutton';

// geotiff extensions
import plotty from 'plotty';
import GeoTIFF from 'geotiff';
import 'geotiff-layer-leaflet/dist/geotiff-layer-leaflet';
import 'geotiff-layer-leaflet/src/geotiff-layer-leaflet-plotty';
import 'geotiff-layer-leaflet/src/geotiff-layer-leaflet-vector-arrows';

// coordinates extension
import 'leaflet.coordinates/dist/Leaflet.Coordinates-0.1.5.src.js';

import {
  CdpService,
  GeoOrganism,
  GeoSpecimen,
  organismDescription,
  specimenDescription,
  OrganismsResponse,
  SpecimensResponse
} from './cdp.service';

@Component({
  selector: 'app-image-gis-search',
  templateUrl: './image-gis-search.component.html',
  styleUrls: ['./image-gis-search.component.scss']
})
export class ImageGisSearchComponent implements OnInit {
  // this will listen for the sideNav local reference on html template. I can
  // manage the mat-sidenav using this property
  @ViewChild('sideNav') public sideNav: MatSidenav;

  // start with angular material forms
  filterForm: FormGroup;

  // this will be my geojson layers
  organismsLyr: L.GeoJSON;
  specimensLyr: L.GeoJSON;

  // this will be my selected layer
  selectedItem: L.GeoJSON;

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
  organismsData: GeoOrganism[];
  specimensData: GeoSpecimen[];

  // in order to use material autocomplete
  uniqueBreeds: string[] = [];
  filteredBreeds: Observable<string[]>;

  uniqueSpecies: string[] = [];
  filteredSpecies: Observable<string[]>;

  uniqueParts: string[] = [];
  filteredParts: Observable<string[]>;

  uniqueIds: string[] = [];
  filteredIds: Observable<string[]>;

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
    this.collectData();

    // initialize form
    this.filterForm = new FormGroup({
      idControl: new FormControl(),
      specieControl: new FormControl(),
      breedControl: new FormControl(),
      partControl: new FormControl()
    });
  }

  private _filterBreed(value: string): string[] {
    if (value == null) {
      // TODO: workaround to be able to reset form using autocomplete
      return this.uniqueSpecies;
    }

    const filterValue = value.toLowerCase();
    return this.uniqueBreeds.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterSpecie(value: string): string[] {
    if (value == null) {
      // TODO: workaround to be able to reset form using autocomplete
      return this.uniqueSpecies;
    }

    const filterValue = value.toLowerCase();
    return this.uniqueSpecies.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterParts(value: string): string[] {
    if (value == null) {
      // TODO: workaround to be able to reset form using autocomplete
      return this.uniqueSpecies;
    }

    const filterValue = value.toLowerCase();
    return this.uniqueParts.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterIds(value: string): string[] {
    if (value == null) {
      // TODO: workaround to be able to reset form using autocomplete
      return this.uniqueIds;
    }

    const filterValue = value.toLowerCase();
    return this.uniqueIds.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  onMapReady(leafletMap: L.Map) {
    this.map = leafletMap;

    // add coordinates to map
    L.control.coordinates({
      // enableUserInput: false, //optional default true
    }).addTo(this.map);

    // defining the custombuttom here and assigning it to my map after it is ready
    // is the only way to toggle the material sidenav using leaflet.easybutton
    const customButton = L.easyButton(
      '<i style="font-size:18px;" class="material-icons">search</i>',
      () => {
        this.sideNav.toggle();
      }
    );
    customButton.options.position = 'bottomright'; // topleft, topright, bottomleft, bottomright

    customButton.addTo(this.map);

    // Hyperarid AI < 0.05 - 7.5% of the global land area
    // Arid 0.05 < AI < 0.20 - 12.1% of the global land area
    // Semi-arid 0.20 < AI < 0.50 - 17.7% of the global land area
    // Dry subhumid 0.50 < AI < 0.65 - 9.9% of the global land area
    plotty.addColorScale('aridity', ['#A80000', '#FF0000', '#FFAA00', '#FFFF00', '#D1FF73'], [0.01, 0.05, 0.20, 0.50, 0.65]);

    const aridity = new L.LeafletGeotiff(
      './assets/aridity.tif',
      {
        band: 0,
        name: 'FAO Aridity',
        opacity: 0.5,
        renderer: new L.LeafletGeotiff.Plotty({
          colorScale: 'aridity',
          // displayMin: 0.01,
          // displayMax: 7.8,
          clampLow: false,
          clampHigh: true,
        })
      }
    ); // .addTo(this.map);

    this.layersControl.overlays['FAO aridity'] = aridity;

    // This event is actually of type LeafletMouseEvent, which extends LeafletEvent.
    // So cast the event to gain access to the properties of LeafletMouseEvent
    // https://stackoverflow.com/a/48746870/4385116:
    this.map.on('click', <LeafletMouseEvent>(e) => {
      // console.log(e.latlng);
      console.log(`aridity value at ${e.latlng}: ` + aridity.getValueAtLatLng(e.latlng.lat, e.latlng.lng));
    });
  }

  markerClusterReady(group: L.MarkerClusterGroup) {
    // Do stuff with group
    this.markerClusterGroup = group;

    const key = 'IMAGE samples';
    this.layersControl.overlays[key] = this.markerClusterGroup;
  }

  public onDrawCreated(e: L.DrawEvents.Created) {
    const circleLayer = (e.layer as L.Circle);
    this.drawnItems.addLayer(circleLayer);

    // create a custom query and set data into CDP service
    const point = circleLayer.getLatLng();
    this.cdpService.selectedCircle.lat = point.lat;
    this.cdpService.selectedCircle.lng = point.lng;
    this.cdpService.selectedCircle.rad = Math.round(circleLayer.getRadius() / 1000); // get radius in Km

    // console.log([lat, lng, rad]);

    // erase all data selected on map
    this.clearData();

    // fetching data using coordinates stored in CDP service
    this.collectData(false);
  }

  public resetCDPselectedCircle(): void {
    this.cdpService.selectedCircle.lat = null;
    this.cdpService.selectedCircle.lng = null;
    this.cdpService.selectedCircle.rad = null;
  }

  public onDrawStart(e: L.DrawEvents.DrawStart) {
    // clear up items from drawn layer
    this.drawnItems.clearLayers();

    // rest circlelocation in CDP
    this.resetCDPselectedCircle();

    // tslint:disable-next-line:no-console
    // console.log('Draw Started Event!', e);
  }

  public onDrawDeleted(e: L.DrawEvents.Deleted) {
    // console.log('deleted event!!', e);

    // erase all data selected on map
    this.clearData();

    // rest circlelocation in CDP
    this.resetCDPselectedCircle();

    // read all data again
    this.collectData();
  }

  private updateUniqueSpecies(species: string[]) {
    // add new species to uniqueSpecies array
    species.forEach((item: string) => {
      if (! this.uniqueSpecies.includes(item)) {
        // console.log(`Add ${item} to unique species`);
        this.uniqueSpecies.push(item);
      }
    });
  }

  private updateUniqueIds(ids: string[]) {
    // add new species to uniqueSpecies array
    ids.forEach((item: string) => {
      if (! this.uniqueIds.includes(item)) {
        // console.log(`Add ${item} to unique ids`);
        this.uniqueIds.push(item);
      }
    });
  }

  readOrganisms(data: OrganismsResponse) {
    this.organismsLyr = data.organismsLyr;
    this.organismsData = data.organismsData;
    this.uniqueBreeds = data.uniqueBreeds;

    // add new species to uniqueSpecies array
    this.updateUniqueSpecies(data.uniqueSpecies);

    // add new unique ids to list
    this.updateUniqueIds(data.uniqueIds);

    // add organisms layer to marker cluster group
    this.markerClusterGroup.addLayer(this.organismsLyr);

    // set flag values
    this.isFetchingOrganisms = false;
  }

  readSpecimens(data: SpecimensResponse) {
    this.specimensLyr = data.specimensLyr;
    this.specimensData = data.specimensData;
    this.uniqueParts = data.uniqueParts;

    // add new species to uniqueSpecies array
    this.updateUniqueSpecies(data.uniqueSpecies);

    // add new unique ids to list
    this.updateUniqueIds(data.uniqueIds);

    // add organisms layer to marker cluster group
    this.markerClusterGroup.addLayer(this.specimensLyr);

    // set flag values
    this.isFetchingSpecimens = false;
  }

  public collectData(fitOnMap: boolean = true): void {
    // setting flag values
    this.isFetchingOrganisms = true;
    this.isFetchingSpecimens = true;

    // After all observables emit, emit values as an array
    const CDPfetch = zip(
      this.cdpService.getOrganisms(),
      this.cdpService.getSpecimens()
    );

    CDPfetch.subscribe((data) => {
      // deal with organism data
      this.readOrganisms(data[0]);

      // deal with specimen data
      this.readSpecimens(data[1]);

      // initialize filters
      this.filteredSpecies = this.filterForm.get('specieControl').valueChanges.pipe(
        startWith(''),
        map(value  => this._filterSpecie(value))
      );

      this.filteredBreeds = this.filterForm.get('breedControl').valueChanges.pipe(
        startWith(''),
        map(value => this._filterBreed(value))
      );

      this.filteredParts = this.filterForm.get('partControl').valueChanges.pipe(
        startWith(''),
        map(value => this._filterParts(value))
      );

      this.filteredIds = this.filterForm.get('idControl').valueChanges.pipe(
        startWith(''),
        map(value => this._filterIds(value))
      );

      // zoom map on group (if after select I have any group)
      if (fitOnMap) {
        if (this.markerClusterGroup.getLayers().length > 0) {
          this.map.fitBounds(this.markerClusterGroup.getBounds(), {
            padding: L.point(24, 24),
            maxZoom: 12,
            animate: true
          });
        }
      }

    });

  }

  clearData() {
    // erase markercluster layers
    this.markerClusterGroup.clearLayers();

    // remove organismsLyr and specimensLyr
    this.organismsLyr.clearLayers();
    this.specimensLyr.clearLayers();
  }

  onSelectedOrganism(geoOrganism: GeoOrganism) {
    // console.log(geoOrganism);
    this.addSelected(geoOrganism);
    this.selectedItem.bindTooltip(organismDescription(geoOrganism));
  }

  onSelectedSpecimen(geoSpecimen: GeoSpecimen) {
    // console.log(geoSpecimen);
    this.addSelected(geoSpecimen);
    this.selectedItem.bindTooltip(specimenDescription(geoSpecimen));
  }

  private addSelected(feature: Feature) {
    // the layer key
    const key = 'Selected item';

    // test if there is already a selected item
    if (key in this.layersControl.overlays) {
      // remove selected item
      this.selectedItem.clearLayers();
    }

    // read received GeoJSON object, Define manually the marker in order to set
    // the correct urls for icon images
    this.selectedItem = L.geoJSON(
      feature,
      {
        pointToLayer: (geojson, latlng) => {
          return L.marker(
            latlng, {
              icon: L.icon({
                iconSize: [ 25, 41 ],
                iconAnchor: [ 13, 41 ],
                iconUrl: 'leaflet/marker-icon.png',
                shadowUrl: 'leaflet/marker-shadow.png'
              })
            }
          );
        }
      }
    );

    // add marker to map
    this.map.addLayer(this.selectedItem);

    // center map on feature
    this.map.fitBounds(this.selectedItem.getBounds(), {
      padding: L.point(6, 6),
      maxZoom: 12,
      animate: true
    });

    // add layer to control
    this.layersControl.overlays[key] = this.selectedItem;
  }

  onSubmitForm() {
    // console.log(this.filterForm);
    // console.log(this.filterForm.value.specieControl);

    // closing sideNav
    this.sideNav.close();

    // setting value for selected items
    this.cdpService.setSelected({
      selectedSpecie: this.filterForm.value.specieControl,
      selectedBreed: this.filterForm.value.breedControl,
      selectedPart: this.filterForm.value.partControl,
      selectedId: this.filterForm.value.idControl
    });

    // erase all data selected on map
    this.clearData();

    // read all data again
    this.collectData();

    // log cdpService properties
    // console.log(this.cdpService.selectedSpecie);
    // console.log(this.cdpService.selectedBreed);
    // console.log(this.cdpService.selectedPart);
  }

  onResetForm() {
    // console.log(this.filterForm);

    // closing sideNav
    this.sideNav.close();

    // resetting value for selected items
    this.cdpService.resetSelected();

    // erase all data selected on map
    this.clearData();

    // read all data again
    this.collectData();

    // reset form to initial state
    this.filterForm.reset();
  }

}
