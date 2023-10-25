import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskEditorAlacartePage } from './task-editor-alacarte.page';

const routes: Routes = [
  {
    path: '',
    component: TaskEditorAlacartePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskEditorAlacartePageRoutingModule {}
