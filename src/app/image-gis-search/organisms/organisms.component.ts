import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { GeoOrganism } from '../cdp.service';

interface Organism {
  id?: string | number;
  species: string;
  supplied_breed: string;
  sex: string;
}

@Component({
  selector: 'app-organisms',
  templateUrl: './organisms.component.html',
  styleUrls: ['./organisms.component.css']
})
export class OrganismsComponent implements OnInit, AfterViewInit {
  // I will receive this data using property binding from the component which is
  // calling this component. organisms is the name of the property binding element
  @Input('organisms') geo_organisms: GeoOrganism[];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public displayedColumns = ['id', 'species', 'supplied_breed', 'sex'];
  public dataSource = new MatTableDataSource<Organism>();

  constructor() { }

  ngOnInit(): void {
    let organisms: Organism[] = [];

    // I need to flatten GeoOrganism objects in order to sort tables properly with
    // default MatSort functions
    for (let geo_organism of this.geo_organisms) {
      organisms.push({
        id: geo_organism.id,
        species: geo_organism.properties.species,
        supplied_breed: geo_organism.properties.supplied_breed,
        sex: geo_organism.properties.sex
      });
    }

    this.dataSource.data = organisms;
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
