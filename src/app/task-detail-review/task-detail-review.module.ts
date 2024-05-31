import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskDetailReviewPageRoutingModule } from './task-detail-review-routing.module';

import { TaskDetailReviewPage } from './task-detail-review.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskDetailReviewPageRoutingModule
  ],
  declarations: [TaskDetailReviewPage]
})
export class TaskDetailReviewPageModule {}
