import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, ViewChild } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from 'src/app/material/material.module';
import { SpecimensComponent } from './specimens.component';

import { GeoSpecimen } from '../cdp.service';

describe('SpecimensComponent', () => {
  let component: TestSpecimensComponent;
  let fixture: ComponentFixture<TestSpecimensComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecimensComponent, TestSpecimensComponent ],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        MaterialModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSpecimensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  @Component({
    selector: `app-test-specimens`,
    template: `<app-specimens [geoSpecimens]="specimensData"></app-specimens>`
  })
  class TestSpecimensComponent {
    @ViewChild(SpecimensComponent)
    public specimensComponent: SpecimensComponent;

    specimensData: GeoSpecimen[] = [];
  }
});
