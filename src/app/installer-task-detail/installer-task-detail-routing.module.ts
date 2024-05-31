import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InstallerTaskDetailPage } from './installer-task-detail.page';

const routes: Routes = [
  {
    path: '',
    component: InstallerTaskDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstallerTaskDetailPageRoutingModule {}
