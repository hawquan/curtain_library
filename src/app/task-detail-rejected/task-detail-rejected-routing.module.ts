import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskDetailRejectedPage } from './task-detail-rejected.page';

const routes: Routes = [
  {
    path: '',
    component: TaskDetailRejectedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskDetailRejectedPageRoutingModule {}
