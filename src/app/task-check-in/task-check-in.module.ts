import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskCheckInPageRoutingModule } from './task-check-in-routing.module';

import { TaskCheckInPage } from './task-check-in.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskCheckInPageRoutingModule
  ],
  declarations: [TaskCheckInPage]
})
export class TaskCheckInPageModule {}
