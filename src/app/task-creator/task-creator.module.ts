import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskCreatorPageRoutingModule } from './task-creator-routing.module';

import { TaskCreatorPage } from './task-creator.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskCreatorPageRoutingModule
  ],
  declarations: [TaskCreatorPage]
})
export class TaskCreatorPageModule {}
