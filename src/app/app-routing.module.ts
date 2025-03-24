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
  },
  {
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
  },
  {
    path: 'task-ongoing',
    loadChildren: () => import('./task-ongoing/task-ongoing.module').then( m => m.TaskOngoingPageModule)
  },
  {
    path: 'task-ongoing-view-details',
    loadChildren: () => import('./task-ongoing-view-details/task-ongoing-view-details.module').then( m => m.TaskOngoingViewDetailsPageModule)
  },
  {
    path: 'task-ongoing-view-quotation',
    loadChildren: () => import('./task-ongoing-view-quotation/task-ongoing-view-quotation.module').then( m => m.TaskOngoingViewQuotationPageModule)
  },
  {
    path: 'task-detail-review',
    loadChildren: () => import('./task-detail-review/task-detail-review.module').then( m => m.TaskDetailReviewPageModule)
  },
  {
    path: 'task-detail-rejected',
    loadChildren: () => import('./task-detail-rejected/task-detail-rejected.module').then( m => m.TaskDetailRejectedPageModule)
  },
  {
    path: 'task-detail-rejected-review',
    loadChildren: () => import('./task-detail-rejected-review/task-detail-rejected-review.module').then( m => m.TaskDetailRejectedReviewPageModule)
  },
  {
    path: 'tailor-task-detail-ongoing',
    loadChildren: () => import('./tailor-task-detail-ongoing/tailor-task-detail-ongoing.module').then( m => m.TailorTaskDetailOngoingPageModule)
  },
  {
    path: 'task-detail-completed',
    loadChildren: () => import('./task-detail-completed/task-detail-completed.module').then( m => m.TaskDetailCompletedPageModule)
  },
  {
    path: 'task-detail-completed-review',
    loadChildren: () => import('./task-detail-completed-review/task-detail-completed-review.module').then( m => m.TaskDetailCompletedReviewPageModule)
  },
  {
    path: 'task-detail-completed-quotation',
    loadChildren: () => import('./task-detail-completed-quotation/task-detail-completed-quotation.module').then( m => m.TaskDetailCompletedQuotationPageModule)
  },
  {
    path: 'product-details',
    loadChildren: () => import('./product-details/product-details.module').then( m => m.ProductDetailsPageModule)
  },
  {
    path: 'product-category',
    loadChildren: () => import('./product-category/product-category.module').then( m => m.ProductCategoryPageModule)
  },
  {
    path: 'tab4',
    loadChildren: () => import('./tab4/tab4.module').then( m => m.Tab4PageModule)
  },
  {
    path: 'add-sales',
    loadChildren: () => import('./add-sales/add-sales.module').then( m => m.AddSalesPageModule)
  },
  {
    path: 'task-creator-alacarte',
    loadChildren: () => import('./task-creator-alacarte/task-creator-alacarte.module').then( m => m.TaskCreatorAlacartePageModule)
  },
  {
    path: 'task-editor-alacarte',
    loadChildren: () => import('./task-editor-alacarte/task-editor-alacarte.module').then( m => m.TaskEditorAlacartePageModule)
  },
  {
    path: 'task-ongoing-view-alacarte',
    loadChildren: () => import('./task-ongoing-view-alacarte/task-ongoing-view-alacarte.module').then( m => m.TaskOngoingViewAlacartePageModule)
  },
  {
    path: 'po-detail',
    loadChildren: () => import('./po-detail/po-detail.module').then( m => m.PoDetailPageModule)
  },
  {
    path: 'po-detail-update',
    loadChildren: () => import('./po-detail-update/po-detail-update.module').then( m => m.PoDetailUpdatePageModule)
  },
  {
    path: 'signature',
    loadChildren: () => import('./signature/signature.module').then( m => m.SignaturePageModule)
  },
  {
    path: 'task-check-in',
    loadChildren: () => import('./task-check-in/task-check-in.module').then( m => m.TaskCheckInPageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
