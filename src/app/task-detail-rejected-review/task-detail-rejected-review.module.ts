import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskDetailRejectedReviewPageRoutingModule } from './task-detail-rejected-review-routing.module';

import { TaskDetailRejectedReviewPage } from './task-detail-rejected-review.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskDetailRejectedReviewPageRoutingModule
  ],
  declarations: [TaskDetailRejectedReviewPage]
})
export class TaskDetailRejectedReviewPageModule {}
