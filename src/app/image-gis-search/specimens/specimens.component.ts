import { Component, OnInit, Input } from '@angular/core';

import { GeoSpecimen } from '../cdp.service';

@Component({
  selector: 'app-specimens',
  templateUrl: './specimens.component.html',
  styleUrls: ['./specimens.component.css']
})
export class SpecimensComponent implements OnInit {
  @Input() specimens: GeoSpecimen[];

  constructor() { }

  ngOnInit(): void {
  }

}
