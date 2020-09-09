import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { geoJSON, LatLng, circleMarker } from 'leaflet';
import { Feature } from 'geojson';

export interface GeoOrganism extends Feature {
  id?: string | number;
  properties: {
    species: string;
    supplied_breed: string;
    sex: string;
  };
}

export interface GeoSpecimen extends Feature {
  id?: string | number;
  properties: {
    species: string;
    organism_part: string;
    derived_from: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CdpService {
  constructor(private http: HttpClient) { }

  organismMarker(geoJsonPoint: GeoOrganism, latlng: LatLng) {
    return circleMarker(latlng, { color: 'deeppink', radius: 10 }).bindTooltip(`${geoJsonPoint.id}<br>${geoJsonPoint.properties.species}<br>${geoJsonPoint.properties.supplied_breed}`);
  }

  specimenMarker(geoJsonPoint: GeoSpecimen, latlng: LatLng) {
    return circleMarker(latlng, { color: 'green', radius: 10 }).bindTooltip(`${geoJsonPoint.id}<br>${geoJsonPoint.properties.species}<br>${geoJsonPoint.properties.organism_part}`);
  }

  getOrganisms(lat?: number, lng?: number, rad?: number) {
    let url = 'https://api.image2020genebank.eu/backend/organism.geojson/?page_size=1000';

    // console.log([lat, lng, rad]);

    if (lat && lng && rad) {
      url += `&lat=${lat}&lng=${lng}&rad=${rad}`;
    }

    // console.log(url);

    // return a GeoJSON observable
    return this.http
      .get<any>(url)
      .pipe(
        map(data => {
          const organisms: GeoOrganism[] = data.features;
          return {
            organismsLyr: geoJSON(data, { pointToLayer: this.organismMarker }),
            organismsData: organisms
          };
        })
      );
  }

  getSpecimens(lat?: number, lng?: number, rad?: number) {
    let url = 'https://api.image2020genebank.eu/backend/specimen.geojson/?page_size=1000';

    if (lat && lng && rad) {
      url += `&lat=${lat}&lng=${lng}&rad=${rad}`;
    }

    // console.log(url);

    // return a GeoJSON observable
    return this.http
      .get<any>(url)
      .pipe(
        map(data => {
          const specimens: GeoSpecimen[] = data.features;
          return {
            specimensLyr: geoJSON(data, { pointToLayer: this.specimenMarker }),
            specimensData: specimens
          };
        })
      );
  }

}
