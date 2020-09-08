import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { GeoSpecimen } from '../cdp.service';

@Component({
  selector: 'app-specimens',
  templateUrl: './specimens.component.html',
  styleUrls: ['./specimens.component.css']
})
export class SpecimensComponent implements OnInit, AfterViewInit {
  // I will receive this data using property binding from the component which is
  // calling this component
  @Input() specimens: GeoSpecimen[];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public displayedColumns = ['id', 'species', 'organism_part', 'derived_from'];
  public dataSource = new MatTableDataSource<GeoSpecimen>();

  constructor() { }

  ngOnInit(): void {
    this.dataSource.data = this.specimens;
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
