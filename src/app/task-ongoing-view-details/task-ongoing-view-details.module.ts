import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskOngoingViewDetailsPageRoutingModule } from './task-ongoing-view-details-routing.module';

import { TaskOngoingViewDetailsPage } from './task-ongoing-view-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskOngoingViewDetailsPageRoutingModule
  ],
  declarations: [TaskOngoingViewDetailsPage]
})
export class TaskOngoingViewDetailsPageModule {}
