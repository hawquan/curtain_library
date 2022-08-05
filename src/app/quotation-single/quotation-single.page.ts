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
  sales_id = 0
  pleatlist = []
  blindlist = []
  tracklist = []
  fabriclist = []
  fabricCurtain = []
  fabricSheer = []
  fabricLining = []
  price = 0

  calc = [] as any

  ngOnInit() {

    this.item = this.navparam.get('item')
    this.tracklist = this.navparam.get('tracklist')
    this.pleatlist = this.navparam.get('pleatlist')
    this.blindlist = this.navparam.get('blindlist')

    this.http.get('https://curtain.vsnap.my/fabricList').subscribe((s) => {
      this.fabriclist = s['data']
      this.fabricCurtain = this.fabriclist.filter(x => x.type == 'Curtain')
      this.fabricSheer = this.fabriclist.filter(x => x.type == 'Sheer')
      this.fabricLining = this.fabriclist.filter(x => x.type == 'Lining')

      console.log(this.item);
      this.calcPrice()

    })


  }

  lengthof(x) {
    return Object.keys(x || {}).length
  }

  calcPrice() {

    let curtain = false
    let curtain_id
    let lining = false
    let lining_id
    let sheer = false
    let sheer_id
    let track = false
    let track_id

    let pleat_id

    if (this.item.curtain != 'Blinds') {

      if (this.item.fabric != null && this.item.fabric != 'NA') {
        curtain = true
        curtain_id = this.fabricCurtain.filter(x => x.name == this.item.fabric)[0]['id']
      } else {
        curtain = false
      }

      if (this.item.fabric_lining != null && this.item.fabric_lining != 'NA') {
        lining = true
        lining_id = this.fabricLining.filter(x => x.name == this.item.fabric_lining)[0]['id']
      } else {
        lining = false
      }

      if (this.item.fabric_sheer != null && this.item.fabric_sheer != 'NA') {
        sheer = true
        sheer_id = this.fabricSheer.filter(x => x.name == this.item.fabric_sheer)[0]['id']
      } else {
        sheer = false
      }

      if (this.item.track != null && this.item.track != 'NA') {
        track = true
        track_id = this.tracklist.filter(x => x.name == this.item.track)[0]['id']
      } else {
        track = false
      }

      if (this.item.pleat != null && this.item.pleat != '') {
        pleat_id = this.pleatlist.filter(x => x.name == this.item.pleat)[0]['id']
      }
      console.log(curtain_id, sheer_id, track_id, pleat_id);

    } else {
      curtain = false
      sheer = false
      track = false
      lining = false

      pleat_id = this.pleatlist.filter(x => x.name == this.item.pleat)[0]['id']
    }

    let temp = {
      width: this.item.width, height: this.item.height, curtain: curtain, lining: lining, lining_id: lining_id,
      curtain_id: curtain_id, sheer: sheer, sheer_id: sheer_id, track: track, track_id: track_id, pleat_id: pleat_id
    }

    console.log(temp);

    this.http.post('https://curtain.vsnap.my/calcPrice', temp).subscribe(a => {

      console.log(a);
      this.calc = a['data']
      this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + 25

    })

  }

  back() {
    this.model.dismiss()
  }
}
