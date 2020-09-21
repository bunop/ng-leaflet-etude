// Import Leaflet into L in case you want to reference Leaflet types
import * as L from 'leaflet';

// Declare the leaflet module so we can modify it
declare module 'leaflet' {

  // We want to alter the control namespace
  export class LeafletGeotiff {
    constructor (url: string, options: object);
    addTo(map: Map|LayerGroup): this;
    getValueAtLatLng(lat: number, lng: number): number;
  }

  namespace LeafletGeotiff {
    export class Plotty {
      constructor (options: object);
    }
  }

  namespace control {
    export class Coordinates {
      addTo(map: Map|LayerGroup): this;
    }
    
    function coordinates(v: any): Coordinates;
  }
}
