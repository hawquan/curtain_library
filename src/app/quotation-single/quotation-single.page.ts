import { HttpClient } from '@angular/common/http';
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
    private nav: NavController,
    private model: ModalController,
    private modalcontroller: ModalController,
    private navparam: NavParams,
    private http: HttpClient,
  ) { }

  item = [] as any
  pleatlist = []
  blindlist = []
  tracklist = []
  fabriclist = []
  fabricCurtain = []
  fabricSheer = []

  calc = [] as any

  ngOnInit() {

    this.item = this.navparam.get('item')
    this.calc = this.navparam.get('calc')

    this.lengthof(this.calc[1])
    console.log(this.item, this.calc);

  }

  lengthof(x) {
    return Object.keys(x || {}).length
  }

  back() {
    this.model.dismiss()
  }
}
