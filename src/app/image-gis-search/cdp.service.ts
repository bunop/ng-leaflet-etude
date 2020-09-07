import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { geoJSON, LatLng, circleMarker } from 'leaflet';
import { Feature } from 'geojson';

@Injectable({
  providedIn: 'root'
})
export class CdpService {
  constructor(private http: HttpClient) { }

  organismMarker(geoJsonPoint: Feature, latlng: LatLng) {
    console.log(geoJsonPoint);
    return circleMarker(latlng, { color: 'deeppink', radius:10}).bindTooltip(`${geoJsonPoint.id}<br>${geoJsonPoint.properties.species}<br>${geoJsonPoint.properties.supplied_breed}`);
  }

  specimenMarker(geoJsonPoint: Feature, latlng: LatLng) {
    console.log(geoJsonPoint);
    return circleMarker(latlng, { color: 'green', radius:10}).bindTooltip(`${geoJsonPoint.id}<br>${geoJsonPoint.properties.species}<br>${geoJsonPoint.properties.organism_part}`);;
  }

  getOrganisms() {
    // return a GeoJSON observable
    return this.http
      .get<any>("https://api.image2020genebank.eu/backend/organism.geojson/?page_size=1000")
      .pipe(
        map(data => {
          return geoJSON(data, { pointToLayer: this.organismMarker });
        })
      )
  }

  getSpecimens() {
    // return a GeoJSON observable
    return this.http
      .get<any>("https://api.image2020genebank.eu/backend/specimen.geojson/?page_size=1000")
      .pipe(
        map(data => {
          return geoJSON(data, { pointToLayer: this.specimenMarker });
        })
      )
  }

}
