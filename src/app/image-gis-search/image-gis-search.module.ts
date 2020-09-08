import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganismsComponent } from './organisms/organisms.component';
import { SpecimensComponent } from './specimens/specimens.component';

@NgModule({
  declarations: [
    OrganismsComponent,
    SpecimensComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    OrganismsComponent,
    SpecimensComponent
  ]
})
export class ImageGisSearchModule { }
