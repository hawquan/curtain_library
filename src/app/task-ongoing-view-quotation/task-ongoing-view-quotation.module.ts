import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskOngoingViewQuotationPageRoutingModule } from './task-ongoing-view-quotation-routing.module';

import { TaskOngoingViewQuotationPage } from './task-ongoing-view-quotation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskOngoingViewQuotationPageRoutingModule
  ],
  declarations: [TaskOngoingViewQuotationPage]
})
export class TaskOngoingViewQuotationPageModule {}
