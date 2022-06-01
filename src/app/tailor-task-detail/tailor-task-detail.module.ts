import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TailorTaskDetailPageRoutingModule } from './tailor-task-detail-routing.module';

import { TailorTaskDetailPage } from './tailor-task-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TailorTaskDetailPageRoutingModule
  ],
  declarations: [TailorTaskDetailPage]
})
export class TailorTaskDetailPageModule {}
