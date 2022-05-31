import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskEditorPageRoutingModule } from './task-editor-routing.module';

import { TaskEditorPage } from './task-editor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskEditorPageRoutingModule
  ],
  declarations: [TaskEditorPage]
})
export class TaskEditorPageModule {}
