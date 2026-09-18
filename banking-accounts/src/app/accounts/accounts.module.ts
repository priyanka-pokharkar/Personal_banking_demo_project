import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';
import { AccountOverviewComponent } from './account-overview/account-overview.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AccountOverviewComponent
  ],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    FormsModule
  ]
})
export class AccountsModule { }
