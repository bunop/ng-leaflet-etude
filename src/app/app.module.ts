import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from "@asymmetrik/ngx-leaflet-markercluster";

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
import { OrganismsComponent } from './image-gis-search/organisms/organisms.component';
import { SpecimensComponent } from './image-gis-search/specimens/specimens.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    AsymmetricTutorialComponent,
    HomeComponent,
    HeaderComponent,
    SidenavListComponent,
    ImageGisSearchComponent,
    OrganismsComponent,
    SpecimensComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    LeafletModule,
    LeafletMarkerClusterModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
