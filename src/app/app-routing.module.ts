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
  },  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'selector',
    loadChildren: () => import('./selector/selector.module').then( m => m.SelectorPageModule)
  },
  {
    path: 'quotation-single',
    loadChildren: () => import('./quotation-single/quotation-single.module').then( m => m.QuotationSinglePageModule)
  },
  {
    path: 'quotation-overall',
    loadChildren: () => import('./quotation-overall/quotation-overall.module').then( m => m.QuotationOverallPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
