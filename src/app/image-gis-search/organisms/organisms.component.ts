import { Component, OnInit, Input } from '@angular/core';

import { GeoOrganism } from '../cdp.service';

@Component({
  selector: 'app-organisms',
  templateUrl: './organisms.component.html',
  styleUrls: ['./organisms.component.css']
})
export class OrganismsComponent implements OnInit {
  // I will receive this data using property binding from the component which is
  // calling this component
  @Input() organisms: GeoOrganism[];

  constructor() { }

  ngOnInit(): void {
  }

}
