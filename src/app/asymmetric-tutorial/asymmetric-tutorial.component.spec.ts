import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { AsymmetricTutorialComponent } from './asymmetric-tutorial.component';

describe('AsymmetricTutorialComponent', () => {
  let component: AsymmetricTutorialComponent;
  let fixture: ComponentFixture<AsymmetricTutorialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ LeafletModule ],
      declarations: [ AsymmetricTutorialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsymmetricTutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a leaflet map', () => {
    const fixture = TestBed.createComponent(AsymmetricTutorialComponent);
    fixture.detectChanges();
    const leaflet = fixture.debugElement.query(By.css('[leaflet]'));
    expect(leaflet).toBeTruthy();
  });

});
