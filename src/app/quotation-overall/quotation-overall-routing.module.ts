import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuotationOverallPage } from './quotation-overall.page';

const routes: Routes = [
  {
    path: '',
    component: QuotationOverallPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuotationOverallPageRoutingModule {}
