import { Component, OnInit, Input, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { GeoSpecimen, CdpService } from '../cdp.service';

interface Specimen {
  id?: string | number;
  species: string;
  organism_part: string;
  derived_from: string;
}

@Component({
  selector: 'app-specimens',
  templateUrl: './specimens.component.html',
  styleUrls: ['./specimens.component.scss']
})
export class SpecimensComponent implements OnInit, AfterViewInit {
  // I will receive this data using property binding from the component which is
  // calling this component
  @Input() geoSpecimens: GeoSpecimen[];

  // this will be the selected item that I want to display on map
  @Output() selectedSpecimen = new EventEmitter<GeoSpecimen>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public displayedColumns = ['id', 'species', 'organism_part', 'derived_from', 'show_on_map', 'details'];
  public dataSource = new MatTableDataSource<Specimen>();

  constructor(private cdpService: CdpService) { }

  ngOnInit(): void {
    const specimens: Specimen[] = [];

    for (const geoSpecimen of this.geoSpecimens) {
      if (this.cdpService.chooseSpecimen(geoSpecimen)) {
        specimens.push({
          id: geoSpecimen.id,
          species: geoSpecimen.properties.species,
          organism_part: geoSpecimen.properties.organism_part,
          derived_from: geoSpecimen.properties.derived_from
        });
      }
    }

    this.dataSource.data = specimens;
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
    const geoSpecimen = this.geoSpecimens.find(item => item.id === id);

    // pass selected organism like an event
    this.selectedSpecimen.emit(geoSpecimen);
  }

}
