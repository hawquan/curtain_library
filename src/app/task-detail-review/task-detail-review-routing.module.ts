import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskDetailReviewPage } from './task-detail-review.page';

const routes: Routes = [
  {
    path: '',
    component: TaskDetailReviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskDetailReviewPageRoutingModule {}
