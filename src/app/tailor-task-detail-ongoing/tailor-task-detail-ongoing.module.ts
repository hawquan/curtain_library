import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TailorTaskDetailOngoingPageRoutingModule } from './tailor-task-detail-ongoing-routing.module';

import { TailorTaskDetailOngoingPage } from './tailor-task-detail-ongoing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TailorTaskDetailOngoingPageRoutingModule
  ],
  declarations: [TailorTaskDetailOngoingPage]
})
export class TailorTaskDetailOngoingPageModule {}
