import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PoDetailPage } from './po-detail.page';

const routes: Routes = [
  {
    path: '',
    component: PoDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoDetailPageRoutingModule {}
