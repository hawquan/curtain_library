import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskDetailCompletedQuotationPageRoutingModule } from './task-detail-completed-quotation-routing.module';

import { TaskDetailCompletedQuotationPage } from './task-detail-completed-quotation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskDetailCompletedQuotationPageRoutingModule
  ],
  declarations: [TaskDetailCompletedQuotationPage]
})
export class TaskDetailCompletedQuotationPageModule {}
