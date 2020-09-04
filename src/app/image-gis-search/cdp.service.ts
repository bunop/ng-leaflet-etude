import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { geoJSON } from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class CdpService {
  constructor(private http: HttpClient) { }

  getOrganisms() {
    // return a GeoJSON observable
    return this.http
      .get<any>("https://api.image2020genebank.eu/backend/organism.geojson/?page_size=1000")
      .pipe(
        map(data => {
          return geoJSON(data);
        })
      )
  }

  getSpecimens() {
    // return a GeoJSON observable
    return this.http
      .get<any>("https://api.image2020genebank.eu/backend/specimen.geojson/?page_size=1000")
      .pipe(
        map(data => {
          return geoJSON(data);
        })
      )
  }

}
