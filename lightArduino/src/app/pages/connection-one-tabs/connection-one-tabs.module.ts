import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnectionOneTabsPageRoutingModule } from './connection-one-tabs-routing.module';

import { ConnectionOneTabsPage } from './connection-one-tabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectionOneTabsPageRoutingModule
  ],
  declarations: [ConnectionOneTabsPage]
})
export class ConnectionOneTabsPageModule {}
