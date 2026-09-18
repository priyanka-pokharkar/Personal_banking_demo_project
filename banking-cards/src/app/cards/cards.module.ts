import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { CardsRoutingModule } from './cards-routing.module';
import { CardsOverviewComponent } from './cards-overview/cards-overview.component';

@NgModule({
  declarations: [
    CardsOverviewComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    CardsRoutingModule
  ]
})
export class CardsModule { }