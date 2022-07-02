import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskDetailRejectedPageRoutingModule } from './task-detail-rejected-routing.module';

import { TaskDetailRejectedPage } from './task-detail-rejected.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskDetailRejectedPageRoutingModule
  ],
  declarations: [TaskDetailRejectedPage]
})
export class TaskDetailRejectedPageModule {}
