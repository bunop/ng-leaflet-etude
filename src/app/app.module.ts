import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { LayoutComponent } from './layout/layout.component';
import { AsymmetricTutorialComponent } from './asymmetric-tutorial/asymmetric-tutorial.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';

import { ImageGisSearchComponent } from './image-gis-search/image-gis-search.component';
import { ImageGisSearchModule } from './image-gis-search/image-gis-search.module';
import { NotFoundComponent } from './error-pages/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    AsymmetricTutorialComponent,
    HomeComponent,
    HeaderComponent,
    SidenavListComponent,
    ImageGisSearchComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    LeafletModule,
    LeafletMarkerClusterModule,
    LeafletDrawModule,
    ImageGisSearchModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
