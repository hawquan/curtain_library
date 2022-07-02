import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskDetailRejectedReviewPage } from './task-detail-rejected-review.page';

const routes: Routes = [
  {
    path: '',
    component: TaskDetailRejectedReviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskDetailRejectedReviewPageRoutingModule {}
