import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskEditorPageRoutingModule } from './task-editor-routing.module';

import { TaskEditorPage } from './task-editor.page';
import { ImageDrawingModule } from 'ngx-image-drawing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskEditorPageRoutingModule,
    ImageDrawingModule,
  ],
  declarations: [TaskEditorPage]
})
export class TaskEditorPageModule {}
