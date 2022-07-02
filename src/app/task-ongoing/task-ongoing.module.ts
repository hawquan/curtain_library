import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskOngoingPageRoutingModule } from './task-ongoing-routing.module';

import { TaskOngoingPage } from './task-ongoing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskOngoingPageRoutingModule
  ],
  declarations: [TaskOngoingPage]
})
export class TaskOngoingPageModule {}
