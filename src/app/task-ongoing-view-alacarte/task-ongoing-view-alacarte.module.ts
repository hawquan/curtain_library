import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskOngoingViewAlacartePageRoutingModule } from './task-ongoing-view-alacarte-routing.module';

import { TaskOngoingViewAlacartePage } from './task-ongoing-view-alacarte.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskOngoingViewAlacartePageRoutingModule
  ],
  declarations: [TaskOngoingViewAlacartePage]
})
export class TaskOngoingViewAlacartePageModule {}
