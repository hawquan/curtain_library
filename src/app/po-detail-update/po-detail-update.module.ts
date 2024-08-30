import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PoDetailUpdatePageRoutingModule } from './po-detail-update-routing.module';

import { PoDetailUpdatePage } from './po-detail-update.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PoDetailUpdatePageRoutingModule
  ],
  declarations: [PoDetailUpdatePage]
})
export class PoDetailUpdatePageModule {}
