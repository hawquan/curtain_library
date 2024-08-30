import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PoDetailPageRoutingModule } from './po-detail-routing.module';

import { PoDetailPage } from './po-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PoDetailPageRoutingModule
  ],
  declarations: [PoDetailPage]
})
export class PoDetailPageModule {}
