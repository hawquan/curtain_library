import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskDetailCompletedPageRoutingModule } from './task-detail-completed-routing.module';

import { TaskDetailCompletedPage } from './task-detail-completed.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskDetailCompletedPageRoutingModule
  ],
  declarations: [TaskDetailCompletedPage]
})
export class TaskDetailCompletedPageModule {}
