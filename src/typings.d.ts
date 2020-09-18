// Import Leaflet into L in case you want to reference Leaflet types
import * as L from 'leaflet';

// Declare the leaflet module so we can modify it
declare module 'leaflet' {

  // We want to alter the control namespace
  export class LeafletGeotiff {
    constructor (url: string, options: object);
    addTo(map: Map|LayerGroup): this;
  }

  namespace LeafletGeotiff {
    export class Plotty {
      constructor (options: object);
    }
  }
}
