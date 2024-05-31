import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuotationSinglePage } from './quotation-single.page';

const routes: Routes = [
  {
    path: '',
    component: QuotationSinglePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuotationSinglePageRoutingModule {}
