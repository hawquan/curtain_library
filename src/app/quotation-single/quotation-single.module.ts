import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuotationSinglePageRoutingModule } from './quotation-single-routing.module';

import { QuotationSinglePage } from './quotation-single.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuotationSinglePageRoutingModule
  ],
  declarations: [QuotationSinglePage]
})
export class QuotationSinglePageModule {}
