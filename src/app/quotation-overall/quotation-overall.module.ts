import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuotationOverallPageRoutingModule } from './quotation-overall-routing.module';

import { QuotationOverallPage } from './quotation-overall.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuotationOverallPageRoutingModule
  ],
  declarations: [QuotationOverallPage]
})
export class QuotationOverallPageModule {}
