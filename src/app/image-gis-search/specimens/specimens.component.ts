import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { GeoSpecimen } from '../cdp.service';

interface Specimen {
  id?: string | number;
  species: string;
  organism_part: string;
  derived_from: string;
}

@Component({
  selector: 'app-specimens',
  templateUrl: './specimens.component.html',
  styleUrls: ['./specimens.component.css']
})
export class SpecimensComponent implements OnInit, AfterViewInit {
  // I will receive this data using property binding from the component which is
  // calling this component
  @Input('specimens') geo_specimens: GeoSpecimen[];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public displayedColumns = ['id', 'species', 'organism_part', 'derived_from'];
  public dataSource = new MatTableDataSource<Specimen>();

  constructor() { }

  ngOnInit(): void {
    let specimens: Specimen[] = [];
    
    for (let geo_specimen of this.geo_specimens) {
      specimens.push({
        id: geo_specimen.id,
        species: geo_specimen.properties.species,
        organism_part: geo_specimen.properties.organism_part,
        derived_from: geo_specimen.properties.derived_from
      });
    }

    this.dataSource.data = specimens;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public pageChanged = (event: object) => {
    console.log(event);
  }

  public customSort = (event: object) => {
    console.log(event);
  }

}
