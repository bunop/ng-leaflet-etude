import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AsymmetricTutorialComponent } from './asymmetric-tutorial/asymmetric-tutorial.component';
import { ImageGisSearchComponent } from './image-gis-search/image-gis-search.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'asymmetric-tutorial', component: AsymmetricTutorialComponent },
  { path: 'image-gis', component: ImageGisSearchComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
