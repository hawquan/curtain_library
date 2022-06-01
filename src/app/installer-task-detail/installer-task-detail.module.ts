import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InstallerTaskDetailPageRoutingModule } from './installer-task-detail-routing.module';

import { InstallerTaskDetailPage } from './installer-task-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InstallerTaskDetailPageRoutingModule
  ],
  declarations: [InstallerTaskDetailPage]
})
export class InstallerTaskDetailPageModule {}
