import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskDetailCompletedQuotationPage } from './task-detail-completed-quotation.page';

const routes: Routes = [
  {
    path: '',
    component: TaskDetailCompletedQuotationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskDetailCompletedQuotationPageRoutingModule {}
