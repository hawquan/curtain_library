import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskDetailCompletedPage } from './task-detail-completed.page';

const routes: Routes = [
  {
    path: '',
    component: TaskDetailCompletedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskDetailCompletedPageRoutingModule {}
