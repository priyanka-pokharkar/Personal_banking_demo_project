import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardsOverviewComponent } from './cards-overview/cards-overview.component';

const routes: Routes = [
  { path: '', component: CardsOverviewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardsRoutingModule { }