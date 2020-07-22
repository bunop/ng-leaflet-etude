import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { By } from '@angular/platform-browser';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        LeafletModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'ng-leaflet-etude'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('ng-leaflet-etude');
  });

  it('should have a leaflet map', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const leaflet = fixture.debugElement.query(By.css('[leaflet]'));
    expect(leaflet).toBeTruthy();
  });
});
