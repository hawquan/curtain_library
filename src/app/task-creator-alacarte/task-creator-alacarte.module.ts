import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskCreatorAlacartePageRoutingModule } from './task-creator-alacarte-routing.module';

import { TaskCreatorAlacartePage } from './task-creator-alacarte.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskCreatorAlacartePageRoutingModule
  ],
  declarations: [TaskCreatorAlacartePage]
})
export class TaskCreatorAlacartePageModule {}
