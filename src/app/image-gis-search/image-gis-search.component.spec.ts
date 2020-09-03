import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageGisSearchComponent } from './image-gis-search.component';

describe('ImageGisSearchComponent', () => {
  let component: ImageGisSearchComponent;
  let fixture: ComponentFixture<ImageGisSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageGisSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageGisSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
