import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskEditorPage } from './task-editor.page';

const routes: Routes = [
  {
    path: '',
    component: TaskEditorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskEditorPageRoutingModule {}
