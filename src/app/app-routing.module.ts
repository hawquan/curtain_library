import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'task-detail',
    loadChildren: () => import('./task-detail/task-detail.module').then( m => m.TaskDetailPageModule)
  },
  {
    path: 'task-creator',
    loadChildren: () => import('./task-creator/task-creator.module').then( m => m.TaskCreatorPageModule)
  },
  {
    path: 'task-editor',
    loadChildren: () => import('./task-editor/task-editor.module').then( m => m.TaskEditorPageModule)
  },
  {
    path: 'tech-task-detail',
    loadChildren: () => import('./tech-task-detail/tech-task-detail.module').then( m => m.TechTaskDetailPageModule)
  },
  {
    path: 'tailor-task-detail',
    loadChildren: () => import('./tailor-task-detail/tailor-task-detail.module').then( m => m.TailorTaskDetailPageModule)
  },
  {
    path: 'installer-task-detail',
    loadChildren: () => import('./installer-task-detail/installer-task-detail.module').then( m => m.InstallerTaskDetailPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
