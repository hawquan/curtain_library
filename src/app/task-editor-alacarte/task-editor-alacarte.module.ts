import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskEditorAlacartePageRoutingModule } from './task-editor-alacarte-routing.module';

import { TaskEditorAlacartePage } from './task-editor-alacarte.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskEditorAlacartePageRoutingModule
  ],
  declarations: [TaskEditorAlacartePage]
})
export class TaskEditorAlacartePageModule {}
