import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '', // Or your child routes here
    component: AppComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // <-- Change forRoot to forChild
  exports: [RouterModule]
})
export class AppRoutingModule { }