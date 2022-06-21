import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-quotation-single',
  templateUrl: './quotation-single.page.html',
  styleUrls: ['./quotation-single.page.scss'],
})
export class QuotationSinglePage implements OnInit {

  constructor(
    private nav :NavController,
    private model: ModalController, 
    private modalcontroller: ModalController,
    private navparam: NavParams,
  ) { }

item = [] as any

  ngOnInit() {

    this.item = this.navparam.get('item')
    console.log(this.item);
    
  }

  back() {
    this.model.dismiss()
  }
}
