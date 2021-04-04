import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopOverConnectionsPageRoutingModule } from './pop-over-connections-routing.module';

import { PopOverConnectionsPage } from './pop-over-connections.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopOverConnectionsPageRoutingModule
  ],
  declarations: [PopOverConnectionsPage]
})
export class PopOverConnectionsPageModule {}
