import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskCreatorPage } from './task-creator.page';

const routes: Routes = [
  {
    path: '',
    component: TaskCreatorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskCreatorPageRoutingModule {}
