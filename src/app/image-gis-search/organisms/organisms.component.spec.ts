import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, ViewChild } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from 'src/app/material/material.module';
import { OrganismsComponent } from './organisms.component';

import { GeoOrganism } from '../cdp.service';

describe('OrganismsComponent', () => {
  let component: TestOrganismsComponent;
  let fixture: ComponentFixture<TestOrganismsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganismsComponent, TestOrganismsComponent ],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        MaterialModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestOrganismsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  @Component({
    selector: `app-test-organisms`,
    template: `<app-organisms [geoOrganisms]="organismsData"></app-organisms>`
  })
  class TestOrganismsComponent {
    @ViewChild(OrganismsComponent)
    public organismsComponent: OrganismsComponent;

    organismsData: GeoOrganism[] = [];
  }
});
