import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { geoJSON, LatLng, circleMarker, GeoJSON } from 'leaflet';
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

export interface OrganismsResponse {
  organismsLyr: GeoJSON;
  organismsData: GeoOrganism[];
  uniqueSpecies: string[];
  uniqueBreeds: string[];
}

export interface SpecimensResponse {
  specimensLyr: GeoJSON;
  specimensData: GeoSpecimen[];
  uniqueSpecies: string[];
  uniqueParts: string[];
}

export interface CircleLocation {
  lat: number;
  lng: number;
  rad: number;
}

export function organismDescription(geoJsonPoint: GeoOrganism) {
  return `${geoJsonPoint.id}<br>${geoJsonPoint.properties.species}<br>${geoJsonPoint.properties.supplied_breed}`;
}

export function specimenDescription(geoJsonPoint: GeoSpecimen) {
  return `${geoJsonPoint.id}<br>${geoJsonPoint.properties.species}<br>${geoJsonPoint.properties.organism_part}`;
}

export function filterSpecie(feature: GeoOrganism | GeoSpecimen, selectedSpecie: string) {
  // erasing the form field, will set the field as empty, not null. So:
  if (selectedSpecie == null || selectedSpecie === '') {
    return true;
  }
  return (feature.properties.species === selectedSpecie);
}

export function filterBreeed(feature: GeoOrganism, selectedBreed: string) {
  if (selectedBreed == null || selectedBreed === '') {
    return true;
  }
  return (feature.properties.supplied_breed === selectedBreed);
}

export function filterPart(feature: GeoSpecimen, selectedPart: string) {
  if (selectedPart == null || selectedPart === '') {
    return true;
  }
  return (feature.properties.organism_part === selectedPart);
}


@Injectable({
  providedIn: 'root'
})
export class CdpService {
  // used to filter data
  selectedSpecie: string;
  selectedBreed: string;
  selectedPart: string;

  // filter data by location
  selectedCircle: CircleLocation = {
    lat: null,
    lng: null,
    rad: null
  };

  constructor(private http: HttpClient) { }

  organismMarker(geoJsonPoint: GeoOrganism, latlng: LatLng) {
    return circleMarker(latlng, { color: 'deeppink', radius: 10 }).bindTooltip(organismDescription(geoJsonPoint));
  }

  specimenMarker(geoJsonPoint: GeoSpecimen, latlng: LatLng) {
    return circleMarker(latlng, { color: 'green', radius: 10 }).bindTooltip(specimenDescription(geoJsonPoint));
  }

  getOrganisms() {
    let url = 'https://api.image2020genebank.eu/backend/organism.geojson/?page_size=1000';

    // console.log([lat, lng, rad]);

    if (this.selectedCircle.lat && this.selectedCircle.lng && this.selectedCircle.rad) {
      const lat = this.selectedCircle.lat;
      const lng = this.selectedCircle.lng;
      const rad = this.selectedCircle.rad;
      url += `&lat=${lat}&lng=${lng}&rad=${rad}`;
    }

    // console.log(url);

    // return a GeoJSON observable
    return this.http
      .get<any>(url)
      .pipe<OrganismsResponse>(
        map(data => {
          const organisms: GeoOrganism[] = data.features;

          // get unique items from geojson:
          // https://stackoverflow.com/a/57638289/4385116
          const uniqueSpecies = new Set<string>();
          const uniqueBreeds = new Set<string>();

          data.features.forEach((item: GeoOrganism) => {
            uniqueSpecies.add(item.properties.species);
            uniqueBreeds.add(item.properties.supplied_breed);
          });

          return {
            organismsLyr: geoJSON(
              data,
              {
                pointToLayer: this.organismMarker,
                filter: (feature: GeoOrganism) => {
                  return filterSpecie(feature, this.selectedSpecie) && filterBreeed(feature, this.selectedBreed);
                }
              }),
            organismsData: organisms,
            uniqueSpecies: Array.from(uniqueSpecies),
            uniqueBreeds: Array.from(uniqueBreeds)
          };
        })
      );
  }

  getSpecimens() {
    let url = 'https://api.image2020genebank.eu/backend/specimen.geojson/?page_size=1000';

    if (this.selectedCircle.lat && this.selectedCircle.lng && this.selectedCircle.rad) {
      const lat = this.selectedCircle.lat;
      const lng = this.selectedCircle.lng;
      const rad = this.selectedCircle.rad;
      url += `&lat=${lat}&lng=${lng}&rad=${rad}`;
    }

    // console.log(url);

    // return a GeoJSON observable
    return this.http
      .get<any>(url)
      .pipe<SpecimensResponse>(
        map(data => {
          const specimens: GeoSpecimen[] = data.features;

          // get unique items from geojson:
          // https://stackoverflow.com/a/57638289/4385116
          const uniqueSpecies = new Set<string>();
          const uniqueParts = new Set<string>();

          data.features.forEach((item: GeoSpecimen) => {
            uniqueSpecies.add(item.properties.species);
            uniqueParts.add(item.properties.organism_part);
          });

          return {
            specimensLyr: geoJSON(
              data,
              {
                pointToLayer: this.specimenMarker,
                filter: (feature: GeoSpecimen) => {
                  return filterSpecie(feature, this.selectedSpecie) && filterPart(feature, this.selectedPart);
                }
              }),
            specimensData: specimens,
            uniqueSpecies: Array.from(uniqueSpecies),
            uniqueParts: Array.from(uniqueParts)
          };
        })
      );
  }

}
