import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { GeoOrganism } from '../cdp.service';

@Component({
  selector: 'app-organisms',
  templateUrl: './organisms.component.html',
  styleUrls: ['./organisms.component.css']
})
export class OrganismsComponent implements OnInit, AfterViewInit {
  // I will receive this data using property binding from the component which is
  // calling this component
  @Input() organisms: GeoOrganism[];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public displayedColumns = ['id', 'species', 'supplied_breed', 'sex'];
  public dataSource = new MatTableDataSource<GeoOrganism>();

  constructor() { }

  ngOnInit(): void {
    this.dataSource.data = this.organisms;
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
