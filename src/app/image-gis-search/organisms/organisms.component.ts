import { Component, OnInit, Input, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { GeoOrganism, CdpService } from '../cdp.service';

interface Organism {
  id?: string | number;
  species: string;
  supplied_breed: string;
  sex: string;
}

@Component({
  selector: 'app-organisms',
  templateUrl: './organisms.component.html',
  styleUrls: ['./organisms.component.scss']
})
export class OrganismsComponent implements OnInit, AfterViewInit {
  // I will receive this data using property binding from the component which is
  // calling this component. organisms is the name of the property binding element
  @Input() geoOrganisms: GeoOrganism[];

  // this will be the selected item that I want to display on map
  @Output() selectedOrganism = new EventEmitter<GeoOrganism>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public displayedColumns = ['id', 'species', 'supplied_breed', 'sex', 'show_on_map', 'details'];
  public dataSource = new MatTableDataSource<Organism>();

  constructor(private cdpService: CdpService) { }

  ngOnInit(): void {
    const organisms: Organism[] = [];

    // I need to flatten GeoOrganism objects in order to sort tables properly with
    // default MatSort functions
    for (const geoOrganism of this.geoOrganisms) {
      if ( this.cdpService.chooseOrganism(geoOrganism) ) {
        organisms.push({
          id: geoOrganism.id,
          species: geoOrganism.properties.species,
          supplied_breed: geoOrganism.properties.supplied_breed,
          sex: geoOrganism.properties.sex
        });
      }
    }

    this.dataSource.data = organisms;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public pageChanged = (event: object) => {
    // console.log(event);
  }

  public customSort = (event: object) => {
    // console.log(event);
  }

  showOnMap(id: string | number) {
    const geoOrganism = this.geoOrganisms.find(item => item.id === id);

    // pass selected organism like an event
    this.selectedOrganism.emit(geoOrganism);
  }

}
