import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskCreatorAlacartePage } from './task-creator-alacarte.page';

const routes: Routes = [
  {
    path: '',
    component: TaskCreatorAlacartePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskCreatorAlacartePageRoutingModule {}
