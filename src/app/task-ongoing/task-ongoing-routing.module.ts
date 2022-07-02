import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskOngoingPage } from './task-ongoing.page';

const routes: Routes = [
  {
    path: '',
    component: TaskOngoingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskOngoingPageRoutingModule {}
