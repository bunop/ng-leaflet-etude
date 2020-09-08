import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// need to import MaterialModule even here
import { MaterialModule } from '../material/material.module';

import { OrganismsComponent } from './organisms/organisms.component';
import { SpecimensComponent } from './specimens/specimens.component';

@NgModule({
  declarations: [
    OrganismsComponent,
    SpecimensComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [
    OrganismsComponent,
    SpecimensComponent
  ]
})
export class ImageGisSearchModule { }
