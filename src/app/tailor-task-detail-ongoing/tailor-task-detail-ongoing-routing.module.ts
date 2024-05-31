import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TailorTaskDetailOngoingPage } from './tailor-task-detail-ongoing.page';

const routes: Routes = [
  {
    path: '',
    component: TailorTaskDetailOngoingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TailorTaskDetailOngoingPageRoutingModule {}
