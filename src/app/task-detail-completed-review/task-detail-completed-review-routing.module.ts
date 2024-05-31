import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskDetailCompletedReviewPage } from './task-detail-completed-review.page';

const routes: Routes = [
  {
    path: '',
    component: TaskDetailCompletedReviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskDetailCompletedReviewPageRoutingModule {}
