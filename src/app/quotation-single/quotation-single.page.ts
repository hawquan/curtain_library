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
  fabricBlind = []
  price = 0
  pass = false
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
      this.fabricBlind = this.fabriclist.filter(x => x.type == 'Blind')

      console.log(this.item, this.fabriclist);
      this.calcPrice()

    })

  }

  lengthof(x) {
    return Object.keys(x || {}).length
  }

  calcPrice() {

    let width = 0 as any
    let height = 0 as any
    if (this.item.height_tech != null || this.item.width_tech != null) {
      if (this.item.status_tech == 'Approved' && this.item.status_sale == 'Completed') {
        width = this.item.width
        height = this.item.height
      } else {
        width = this.item.width_tech
        height = this.item.height_tech
      }

    } else {
      width = this.item.width
      height = this.item.height
    }

    let curtain = false
    let curtain_id
    let lining = false
    let lining_id
    let sheer = false
    let sheer_id
    let track = false
    let track_id
    let track_sheer = false
    let track_sheer_id
    let blind = false
    let blind_id
    let pleat_sheer_id
    let pleat_id
    let belt_hook = false

    if (this.item.type != 'Blinds') {

      if (this.item.fabric != null) {
        if (this.item.fabric_type == 'C' || this.item.fabric_type == 'CS') {
          curtain = true
          curtain_id = this.fabricCurtain.filter(x => x.name == this.item.fabric)[0]['id']
        } else {
          curtain = false
        }
      } else {
        curtain = false
      }

      if (this.item.fabric_lining != null) {
        if (this.item.fabric_type == 'C' || this.item.fabric_type == 'CS') {
          lining = true
          lining_id = this.fabricLining.filter(x => x.name == this.item.fabric_lining)[0]['id']
        } else {
          lining = false
        }
      } else {
        lining = false
      }

      if (this.item.fabric_sheer != null) {
        if (this.item.fabric_type == 'S' || this.item.fabric_type == 'CS') {
          sheer = true
          sheer_id = this.fabricSheer.filter(x => x.name == this.item.fabric_sheer)[0]['id']
        } else {
          sheer = false
        }
      } else {
        sheer = false
      }

      if (this.item.track != null) {
        if (this.item.fabric_type == 'C' || this.item.fabric_type == 'CS') {
          track = true
          track_id = this.tracklist.filter(x => x.name == this.item.track)[0]['id']
        } else {
          track = false
        }
      } else {
        track = false
      }

      if (this.item.track_sheer != null) {
        if (this.item.fabric_type == 'S' || this.item.fabric_type == 'CS') {
          track_sheer = true
          track_sheer_id = this.tracklist.filter(x => x.name == this.item.track_sheer)[0]['id']
        } else {
          track_sheer = false
        }
      } else {
        track_sheer = false
      }

      if (this.item.pleat != null && this.item.pleat != '') {
        pleat_id = this.pleatlist.filter(x => x.name == this.item.pleat)[0]['id']
      }

      if (this.item.pleat_sheer != null && this.item.pleat_sheer != '') {
        pleat_sheer_id = this.pleatlist.filter(x => x.name == this.item.pleat_sheer)[0]['id']
      }

      if((this.item.sidehook == 'Yes' && this.item.belt == 'Yes') || (this.item.sheer_sidehook == 'Yes' && this.item.sheer_belt == 'Yes')){
        belt_hook = true
      }
      console.log(curtain_id, sheer_id, track_id, pleat_id);

    } else {
      if (this.item.pleat == 'Roman Blind') {
        curtain = true
        sheer = false
        track = false
        track_sheer = false
        lining = false
        blind = true
        console.log('blindcurtain');

        if ((this.item.fabric_blind != null && this.item.fabric_blind != '') && (this.item.fabric != null && this.item.fabric != '')) {
          curtain_id = this.fabricCurtain.filter(x => x.name == this.item.fabric)[0]['id']
          blind_id = this.fabricBlind.filter(x => x.name == this.item.fabric_blind)[0]['id']
        }

      } else {
        curtain = false
        sheer = false
        track = false
        track_sheer = false
        lining = false
        blind = true
        console.log('blind');

        if (this.item.fabric_blind != null && this.item.fabric_blind != '') {
          blind_id = (this.fabricBlind.filter(x => x.name == this.item.fabric_blind))[0]['id']
        }
      }

      // if (this.item.pleat != null && this.item.pleat != '') {
      //   pleat_id = this.pleatlist.filter(x => x.name == this.item.pleat)[0]['id']
      // }

    }

    let temp = {
      width: parseFloat(width), height: parseFloat(height), curtain: curtain, lining: lining, lining_id: lining_id,
      curtain_id: curtain_id, sheer: sheer, sheer_id: sheer_id, track: track, track_id: track_id, track_sheer: track_sheer, track_sheer_id: track_sheer_id, pleat_id: pleat_id, pleat_sheer_id: pleat_sheer_id, blind: blind, blind_id: blind_id,
      pieces_curtain: this.item.pieces_curtain || 0, pieces_sheer: this.item.pieces_sheer || 0, pieces_blind: this.item.pieces_blind || 0,
      promo_curtain: this.item.promo_curtain || 0, promo_lining: this.item.promo_lining || 0, promo_sheer: this.item.promo_sheer || 0, promo_blind: this.item.promo_blind || 0,
      motorized: this.item.motorized_upgrade, motorized_cost: this.item.motorized_cost, motorized_power: this.item.motorized_power, belt_hook : belt_hook, 

    }

    console.log(temp);

    this.http.post('https://curtain.vsnap.my/calcPrice', temp).subscribe(a => {

      console.log(a);
      this.pass = true
      this.calc = a['data']

      if (this.item.type == 'Blinds') {
        this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + a['data']['install']['ladder_price'] + a['data']['install']['scaftfolding_price']
      } else {
        if (this.item.motorized_upgrade) {
          this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + a['data']['install']['belt_hook'] + a['data']['motorized']['install'] + a['data']['install']['ladder_price'] + a['data']['install']['scaftfolding_price']
        } else {
          this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + a['data']['install']['belt_hook'] + a['data']['install']['ladder_price'] + a['data']['install']['scaftfolding_price']
        }
        // this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + a['data']['install']['belt_hook']
      }
      // this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + a['data']['install']['belt_hook']

    })

  }

  back() {
    this.model.dismiss()
  }
}
