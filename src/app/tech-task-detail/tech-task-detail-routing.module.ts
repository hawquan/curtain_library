import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TechTaskDetailPage } from './tech-task-detail.page';

const routes: Routes = [
  {
    path: '',
    component: TechTaskDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TechTaskDetailPageRoutingModule {}
