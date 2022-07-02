import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskOngoingViewDetailsPage } from './task-ongoing-view-details.page';

const routes: Routes = [
  {
    path: '',
    component: TaskOngoingViewDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskOngoingViewDetailsPageRoutingModule {}
