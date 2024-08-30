import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PoDetailUpdatePage } from './po-detail-update.page';

const routes: Routes = [
  {
    path: '',
    component: PoDetailUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoDetailUpdatePageRoutingModule {}
