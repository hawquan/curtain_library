import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TailorTaskDetailPage } from './tailor-task-detail.page';

const routes: Routes = [
  {
    path: '',
    component: TailorTaskDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TailorTaskDetailPageRoutingModule {}
