import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskDetailCompletedReviewPageRoutingModule } from './task-detail-completed-review-routing.module';

import { TaskDetailCompletedReviewPage } from './task-detail-completed-review.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskDetailCompletedReviewPageRoutingModule
  ],
  declarations: [TaskDetailCompletedReviewPage]
})
export class TaskDetailCompletedReviewPageModule {}
