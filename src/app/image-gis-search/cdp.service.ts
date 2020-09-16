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

export function organismDescription(geoJsonPoint: GeoOrganism) {
  return `${geoJsonPoint.id}<br>${geoJsonPoint.properties.species}<br>${geoJsonPoint.properties.supplied_breed}`;
}

export function specimenDescription(geoJsonPoint: GeoSpecimen) {
  return `${geoJsonPoint.id}<br>${geoJsonPoint.properties.species}<br>${geoJsonPoint.properties.organism_part}`;
}

function filterSpecie(feature: GeoOrganism | GeoSpecimen, selectedSpecie: string) {
  if (selectedSpecie == null) {
    return true;
  }
  return (feature.properties.species == selectedSpecie) ;
}

@Injectable({
  providedIn: 'root'
})
export class CdpService {
  selectedSpecie: string;

  constructor(private http: HttpClient) { }

  organismMarker(geoJsonPoint: GeoOrganism, latlng: LatLng) {
    return circleMarker(latlng, { color: 'deeppink', radius: 10 }).bindTooltip(organismDescription(geoJsonPoint));
  }

  specimenMarker(geoJsonPoint: GeoSpecimen, latlng: LatLng) {
    return circleMarker(latlng, { color: 'green', radius: 10 }).bindTooltip(specimenDescription(geoJsonPoint));
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
                  return filterSpecie(feature, this.selectedSpecie)
                }
              }),
            organismsData: organisms,
            uniqueSpecies: Array.from(uniqueSpecies),
            uniqueBreeds: Array.from(uniqueBreeds)
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
                  if (this.selectedSpecie == null) {
                    return true;
                  }
                  return (feature.properties.species == this.selectedSpecie) ;
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
