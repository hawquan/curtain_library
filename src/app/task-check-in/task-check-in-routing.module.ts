import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskCheckInPage } from './task-check-in.page';

const routes: Routes = [
  {
    path: '',
    component: TaskCheckInPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskCheckInPageRoutingModule {}
