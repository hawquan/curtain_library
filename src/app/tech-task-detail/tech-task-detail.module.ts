import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TechTaskDetailPageRoutingModule } from './tech-task-detail-routing.module';

import { TechTaskDetailPage } from './tech-task-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TechTaskDetailPageRoutingModule
  ],
  declarations: [TechTaskDetailPage]
})
export class TechTaskDetailPageModule {}
