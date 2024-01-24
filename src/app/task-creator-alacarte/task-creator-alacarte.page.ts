import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { SelectorPage } from '../selector/selector.page';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

@Component({
  selector: 'app-task-creator-alacarte',
  templateUrl: './task-creator-alacarte.page.html',
  styleUrls: ['./task-creator-alacarte.page.scss'],
})
export class TaskCreatorAlacartePage implements OnInit {

  item = {
    wallpaper: {} as any
  } as any;

  fabriclist = []
  fabricCurtain = []
  fabricLining = []
  fabricSheer = []
  fabricBlind = []
  fabricCurtainSheer = []
  accessoryList = []
  wallpaperList = []

  pleatlist = []
  blindlist = []
  tracklist = []
  misclist = []
  bracketlist = []
  bracketlistblind = [{ name: 'Wall' }, { name: 'Ceiling' }, { name: 'Ceiling Pelmet' }]
  hooklist = []
  hooklistadjust = []
  beltlist = []
  otherslist = []
  pieceslist = []

  sales_no
  price = 0
  keyword = ''
  areaList = ['Living Hall', 'Dining Hall', 'Master Bedroom', 'Kitchen', 'Daughter Room', 'Son Room', 'Guestroom', 'Balcony', 'Room', 'Laundry Area', 'Parent Room'
    , 'Study Room', 'Prayer Room', 'Entertainment Hall'].sort((a: any, b: any) => (a > b ? 1 : -1))
  showSelection = false
  hookview = true
  hookviewsheer = true

  constructor(
    private model: ModalController,
    private modalcontroller: ModalController,
    private http: HttpClient,
    private navparam: NavParams,
    private camera: Camera,
  ) { }

  ngOnInit() {
    this.sales_no = this.navparam.get('sales_no')
    this.tracklist = this.navparam.get('tracklist')
    this.item.type = this.navparam.get('type')
    this.item.accessories = []

    this.http.get('https://curtain.vsnap.my/pleatlist').subscribe((s) => {
      this.pleatlist = s['data']
    })

    this.http.get('https://curtain.vsnap.my/blindlist').subscribe((s) => {
      this.blindlist = s['data']
    })

    this.http.get('https://curtain.vsnap.my/fabricList').subscribe((s) => {
      this.fabriclist = s['data']

      this.fabricCurtain = this.fabriclist.filter(x => x.type == 'Curtain')
      this.fabricSheer = this.fabriclist.filter(x => x.type == 'Sheer')
      this.fabricLining = this.fabriclist.filter(x => x.type == 'Lining')
      this.fabricBlind = this.fabriclist.filter(x => x.type == 'Blind').sort((a, b) => (a['type_category'] > b['type_category'] ? 1 : -1) && (a['name'] > b['name'] ? 1 : -1) && (a['id'] > b['id'] ? 1 : -1))
      this.fabricCurtainSheer = this.fabriclist.filter(x => x.type == 'Curtain' || x.type == 'Sheer')
      console.log(this.sales_no, this.fabricBlind);

    })

    this.http.get('https://curtain.vsnap.my/accessoryListApp').subscribe(a => {
      this.accessoryList = a['data']
      console.log('Accessories', this.accessoryList);

    })

    this.http.get('https://curtain.vsnap.my/miscList').subscribe((s) => {
      this.misclist = s['data'].filter(a => a.status)
      console.log(this.misclist)

      for (let i = 0; i < this.misclist.length; i++) {

        if (this.misclist[i]['type'] == "Bracket") {
          this.bracketlist.push(this.misclist[i])
        } else if (this.misclist[i]['type'] == "Hook") {
          this.hooklist.push(this.misclist[i])
          if (this.misclist[i].name != 'Adjust') {
            this.hooklistadjust.push(this.misclist[i])
          }
        } else if (this.misclist[i]['type'] == "Belt") {
          this.beltlist.push(this.misclist[i])
        } else if (this.misclist[i]['type'] == "Others") {
          this.otherslist.push(this.misclist[i])
        } else if (this.misclist[i]['type'] == "Pieces") {
          this.pieceslist.push(this.misclist[i])
        }
      }
    })

    this.http.get('https://curtain.vsnap.my/wallpaperList').subscribe(a => {
      this.wallpaperList = a['data']
      console.log(this.wallpaperList);
    })

    this.item.custom_bracket = false
    this.item.custom_hook = false
    this.item.custom_belt = false
    this.item.custom_sheer_bracket = false
    this.item.custom_sheer_hook = false
    this.item.custom_sheer_belt = false

  }

  selectAcce(x) {
    const index = this.item.accessories.findIndex(item => item.id === x.id);

    if (index === -1) {
      // If not selected, push into item.accessories
      this.item.accessories.push(x);
    } else {
      // If already selected, splice it
      this.item.accessories.splice(index, 1);
    }

  }

  focus(x) {
    if (x) {
      this.showSelection = true
    } else {
      setTimeout(() => {
        this.showSelection = false
      }, 250);
    }
  }

  selectedArea(x) {
    this.keyword = x
    this.item.location = this.keyword
  }

  filterer(x) {
    return x ? x.filter(a => (((a || '')).toLowerCase()).includes((this.keyword).toLowerCase())) : []
  }

  typeChanged() {
    this.item.remark_sale = null
    this.item.motorized_upgrade = null

    if (this.item.type == 2) {
      this.item.remark_sale = 'Supply Track Only'
    } else if (this.item.type == 4) {
      this.item.motorized_upgrade = true
    }

  }

  pleatSelection() {

    if (this.item.type != 'Blinds') {

      if (this.item.fabric_type == 'C') {
        this.item.fullness = this.pleatlist.find(a => a.name == this.item.pleat)['fullness']
      } else if (this.item.fabric_type == 'S') {
        this.item.fullness_sheer = this.pleatlist.find(a => a.name == this.item.pleat_sheer)['fullness']
      } else if (this.item.fabric_type == 'CS') {
        if (this.item.pleat) {
          this.item.fullness = this.pleatlist.find(a => a.name == this.item.pleat)['fullness']
        }
        if (this.item.pleat_sheer) {
          this.item.fullness_sheer = this.pleatlist.find(a => a.name == this.item.pleat_sheer)['fullness']
        }
      }

    }

    if (this.item.pleat == 'Eyelet Design' || this.item.pleat == 'Ripplefold') {
      this.hookview = false
      this.item.hook = ''
    } else {
      this.hookview = true
    }

    if (this.item.pleat_sheer == 'Eyelet Design' || this.item.pleat_sheer == 'Ripplefold') {
      this.hookviewsheer = false
      this.item.sheer_hook = ''
    } else {
      this.hookviewsheer = true
    }

    if (this.item.pleat == 'French Pleat') {
      if (this.item.hook == 'Adjust') {
        this.item.hook = ''
      }
    }

    this.item.motorized_upgrade = false

  }

  selectCustom(x) {

    if (x == 'bracket') {
      this.item.bracket = null
    } else if (x == 'hook') {
      this.item.hook = null
    } else if (x == 'belt') {
      this.item.belt = null
    } else if (x == 'sheer_bracket') {
      this.item.sheer_bracket = null
    } else if (x == 'sheer_hook') {
      this.item.sheer_hook = null
    } else if (x == 'sheer_belt') {
      this.item.sheer_belt = null
    }

  }

  clearFabric(x) {
    if (x == 'curtain') {
      this.item.fabric = null
    } else if (x == 'sheer') {
      this.item.fabric_sheer = null
    } else if (x == 'lining') {
      this.item.fabric_lining = null
    } else if (x == 'blind') {
      this.item.fabric_blind = null
    } else if (x == 'tape') {
      this.item.blind_tape = null
    } else if (x == 'wallpaper') {
      this.item.wallpaper = {}
    }
  }

  clearTrack(x) {
    if (x == 'curtain') {
      this.item.track = null
    } else if (x == 'sheer') {
      this.item.track_sheer = null
    }
  }

  checkError(x) {

    console.log('item', this.item);

    if (this.item.type == 1) {

      if (['type', 'pieces_curtain', 'fabric'].every(a => this.item[a])) {
        this.calcPrice(x)
      } else {
        console.log('error empty')
        this.errorEmpty()

      }

    } else if (this.item.type == 2) {

      if (['width', 'type', 'track'].every(a => this.item[a])) {
        this.calcPrice(x)
      } else {
        console.log('error empty')
        this.errorEmpty()

      }

    } else if (this.item.type == 3) {

      if (this.item.accessories.length > 0 && this.item.accessories.every(accessory => 'acce_selected' in accessory && 'acce_quantity' in accessory && accessory.acce_quantity)) {
        this.calcPrice(x)

      } else {
        console.log('error empty');
        this.errorEmpty();
      }

    } else if (this.item.type == 4) {

      if (['location', 'type', 'motorized_choice', 'motorized_cost', 'motorized_power', 'motorized_pieces', 'motorized_sides'].every(a => this.item[a])) {
        this.calcPrice(x)

      } else {
        console.log('error empty');
        this.errorEmpty();
      }

    } else if (this.item.type == 5) {

      if (this.item.fabric_type == 'C') {

        if (['width', 'height', 'type', 'pleat'].every(a => this.item[a])) {
          this.calcPrice(x)
        } else {
          console.log('error empty')
          this.errorEmpty()
        }

      } else if (this.item.fabric_type == 'S') {

        if (['width', 'height', 'type', 'pleat_sheer'].every(a => this.item[a])) {
          this.calcPrice(x)
        } else {
          console.log('error empty')
          this.errorEmpty()
        }

      } else if (this.item.fabric_type == 'CS') {

        if (['width', 'height', 'type', 'pleat', 'pleat_sheer'].every(a => this.item[a])) {
          this.calcPrice(x)
        } else {
          console.log('error empty')
          this.errorEmpty()
        }

      }

    } else if (this.item.type == 6) {

      if (Object.keys(this.item.wallpaper).length !== 0) {
        this.calcPrice(x)

      } else {
        console.log('error empty');
        this.errorEmpty();
      }

    } else {
      this.calcPrice(x)
    }

  }

  calcPrice(x) {

    let alacarte = true
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
    let pleat_id
    let pleat_sheer_id
    let belt_hook = false
    let isAccessory = false
    let isWallpaper = false
    let isRomanBlind = false
    let tape_id
    let tape = false

    if (this.item.type == 1) {

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

    } else if (this.item.type == 2) {

      if (this.item.track != null) {
        track = true
        track_id = this.tracklist.filter(x => x.name == this.item.track)[0]['id']
      } else {
        track = false
      }

    } else if (this.item.type == 3) {

      if (this.item.accessories.length > 0) {
        isAccessory = true

      }

    } else if (this.item.type == 4) {
      this.item.motorized_upgrade = true

    } else if (this.item.type == 5) {

      if (this.item.track != null) {
        if (this.item.fabric_type == 'C' || this.item.fabric_type == 'CS' || this.item.type == 2) {
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
        curtain = true
        pleat_id = this.pleatlist.filter(x => x.name == this.item.pleat)[0]['id']
      }

      if (this.item.pleat_sheer != null && this.item.pleat_sheer != '') {
        sheer = true
        pleat_sheer_id = this.pleatlist.filter(x => x.name == this.item.pleat_sheer)[0]['id']
      }

      if ((this.item.sidehook == 'Yes' && (this.item.belt != 'No' || this.item.belt)) || (this.item.sheer_sidehook == 'Yes' && (this.item.sheer_belt != 'No' || this.item.sheer_belt))) {
        belt_hook = true
      }

      this.item.eyelet_curtain = this.item.pleat && (this.item.fabric_type == 'C' || this.item.fabric_type == 'CS') ? this.item.pleat.includes('Eyelet') : false
      this.item.eyelet_sheer = this.item.pleat_sheer && (this.item.fabric_type == 'S' || this.item.fabric_type == 'CS') ? this.item.pleat_sheer.includes('Eyelet') : false

    } else if (this.item.type == 6) {

      if (this.item.wallpaper.id) {
        isWallpaper = true
      }

    }

    if (this.item.height > 180 && this.item.type == 4) {
      this.item.need_scaftfolding = true
    } else if (this.item.height >= 156 && this.item.height <= 180 && this.item.type == 4) {
      this.item.need_ladder = true
    } else {
      this.item.need_scaftfolding = false
      this.item.need_ladder = false
    }

    let temp = {
      width: parseFloat(this.item.width), height: parseFloat(this.item.height), curtain: curtain, lining: lining, lining_id: lining_id,
      curtain_id: curtain_id, sheer: sheer, sheer_id: sheer_id, track: track, track_id: track_id, track_sheer: track_sheer, track_sheer_id: track_sheer_id, pleat_id: pleat_id, pleat_sheer_id: pleat_sheer_id, blind: blind, blind_id: blind_id,
      pieces_curtain: this.item.pieces_curtain || 0, pieces_sheer: this.item.pieces_sheer || 0, pieces_blind: this.item.pieces_blind || 0,
      promo_curtain: this.item.promo_curtain || 0, promo_lining: this.item.promo_lining || 0, promo_sheer: this.item.promo_sheer || 0, promo_blind: this.item.promo_blind || 0,
      motorized: this.item.motorized_upgrade, motorized_cost: this.item.motorized_cost, motorized_power: this.item.motorized_power, motorized_choice: this.item.motorized_choice, motorized_pieces: this.item.motorized_pieces, motorized_lift: this.item.motorized_lift,
      belt_hook: belt_hook, isRomanBlind: isRomanBlind, tape: tape, tape_id: tape_id, blind_spring: this.item.blind_spring, blind_tube: this.item.blind_tube, blind_easylift: this.item.blind_easylift, blind_monosys: this.item.blind_monosys,
      eyelet_curtain: this.item.eyelet_curtain, eyelet_sheer: this.item.eyelet_sheer, alacarte: alacarte, type: this.item.type, accessories: this.item.accessories, wallpaper: this.item.wallpaper, install_fee: this.item.install_fee
    }

    console.log(temp);

    this.http.post('https://curtain.vsnap.my/calcPrice', temp).subscribe(a => {

      console.log(a);

      if (this.item.type == 'Blinds') {
        // this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + a['data']['install']['ladder_price'] + a['data']['install']['scaftfolding_price']
        this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + a['data']['install']['climbing_price']
      } else {
        if (this.item.motorized_upgrade) {
          // this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + a['data']['install']['belt_hook'] + a['data']['motorized']['install'] + a['data']['motorized']['lift'] + a['data']['install']['ladder_price'] + a['data']['install']['scaftfolding_price']
          this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + a['data']['install']['belt_hook'] + a['data']['motorized']['install'] + a['data']['motorized']['lift'] + a['data']['install']['climbing_price']
          if (this.item.eyelet_curtain) {
            this.price += a['data']['install']['eyelet_curtain']
          }
          if (this.item.eyelet_sheer) {
            this.price += a['data']['install']['eyelet_sheer']
          }
        } else {
          // this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + a['data']['install']['belt_hook'] + a['data']['install']['ladder_price'] + a['data']['install']['scaftfolding_price']
          this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + a['data']['install']['belt_hook'] + a['data']['install']['climbing_price']
          if (this.item.eyelet_curtain) {
            this.price += a['data']['install']['eyelet_curtain']
          }
          if (this.item.eyelet_sheer) {
            this.price += a['data']['install']['eyelet_sheer']
          }
        }
        // this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + a['data']['install']['belt_hook']
      }


      if (x == 'sales') {

        this.addItem()
      }

    })

  }

  addItem() {

    this.item.location = this.keyword

    if (this.item.fabric_type == 'C' || this.item.fabric_type == 'CS') {
      this.item.custom_hook = null
      this.item.hook = null

      if (this.item.motorized_upgrade && this.item.pleat == 'Fake Double Pleat') {
        this.item.hook = '104'
      } else if (this.item.track) {
        if (this.item.track == 'Super Track' || this.item.track == 'Curve') {
          this.item.hook = this.item.bracket == 'Wall' ? '101' : this.item.bracket == 'Ceiling' ? '101' : this.item.bracket == 'Ceiling Pelmet' ? '104' : null
        } else if (this.item.track == 'Wooden Rod' || this.item.track.includes('Wooden Rod') || this.item.track.includes('Cubicle')) {
          this.item.hook = '104'
        }
      }

    }

    if (this.item.fabric_type == 'S' || this.item.fabric_type == 'CS') {
      this.item.custom_sheer_hook = null
      this.item.sheer_hook = null

      if (this.item.motorized_upgrade && this.item.pleat_sheer == 'Fake Double Pleat') {
        this.item.sheer_hook = '104'
      } else if (this.item.track_sheer) {
        if (this.item.track_sheer == 'Super Track' || this.item.track_sheer == 'Curve') {
          this.item.sheer_hook = this.item.sheer_bracket == 'Wall' ? '101' : this.item.sheer_bracket == 'Ceiling' ? '101' : this.item.sheer_bracket == 'Ceiling Pelmet' ? '104' : null
        } else if (this.item.track_sheer == 'Wooden Rod' || this.item.track_sheer.includes('Wooden Rod') || this.item.track_sheer.includes('Cubicle')) {
          this.item.sheer_hook = '104'
        }
      }
    }

    if (this.item.type == '1') {

      let isCurtain = this.item.fabric_type == 'C' || this.item.fabric_type == 'CS'
      let isSheer = this.item.fabric_type == 'S' || this.item.fabric_type == 'CS'

      let temp = {
        sales_id: this.sales_no,
        type: this.item.type,
        // Curtain
        pieces_curtain: isCurtain ? this.item.pieces_curtain : null,
        fabric: isCurtain ? this.item.fabric : null,
        code_curtain: isCurtain ? this.item.code_curtain : null,
        remark_curtain: isCurtain ? this.item.remark_curtain : null,
        // Sheer
        pieces_sheer: isSheer ? this.item.pieces_sheer : null,
        fabric_sheer: isSheer ? this.item.fabric_sheer : null,
        code_sheer: isSheer ? this.item.code_sheer : null,
        remark_sheer: isSheer ? this.item.remark_sheer : null,
        // Other
        fabric_type: this.item.fabric_type,
        price: this.price,
        status: true,
        photos: JSON.stringify(this.item.photos),
        remark_sale: this.item.remark_sale,
        status_sale: 'Completed',
        status_tech: 'Pending',
        step: 2,
      }

      this.createOrder(temp)

    } else if (this.item.type == '2') {

      let temp = {
        sales_id: this.sales_no,
        width: this.item.width,
        track: this.item.track,
        type: this.item.type,
        bracket: this.item.bracket,
        custom_bracket: this.item.custom_bracket,
        price: this.price,
        status: true,
        photos: JSON.stringify(this.item.photos),
        remark_sale: this.item.remark_sale,
        status_sale: 'Completed',
        status_tech: 'Pending',
        step: 2,

      }

      this.createOrder(temp)

    } else if (this.item.type == '3') {

      let temp = {
        sales_id: this.sales_no,
        type: this.item.type,
        price: this.price,
        accessories: JSON.stringify(this.item.accessories),
        status: true,
        photos: JSON.stringify(this.item.photos),
        remark_sale: this.item.remark_sale,
        status_sale: 'Completed',
        status_tech: 'Pending',
        step: 2,
      };

      this.createOrder(temp);



    } else if (this.item.type == '4') {

      if (['location', 'type', 'motorized_choice', 'motorized_cost', 'motorized_power', 'motorized_pieces', 'motorized_sides'].every(a => this.item[a])) {

        let temp = {
          sales_id: this.sales_no,
          location: this.item.location,
          location_ref: this.item.location_ref,
          type: this.item.type,
          price: this.price,
          status: true,
          photos: JSON.stringify(this.item.photos),
          remark_sale: this.item.remark_sale,
          status_sale: 'Completed',
          status_tech: 'Pending',
          step: 2,
          bracket: this.item.bracket,
          custom_bracket: this.item.custom_bracket,
          motorized_upgrade: this.item.motorized_upgrade,
          motorized_power: this.item.motorized_power,
          motorized_sides: this.item.motorized_sides,
          motorized_cost: this.item.motorized_cost,
          motorized_choice: this.item.motorized_choice,
          motorized_pieces: this.item.motorized_pieces,
          motorized_lift: this.item.motorized_lift,

        }

        this.createOrder(temp)

      } else {
        console.log('error empty')
        this.errorEmpty()

      }

    } else if (this.item.type == '5') {

      if (this.item.pleat == 'Eyelet Design' || this.item.pleat == 'Ripplefold' || this.item.pleat == 'Fake Double Pleat') {
        console.log('C1');
        if (this.item.fabric_type == 'C') {

          let temp = {
            sales_id: this.sales_no,
            location: this.item.location,
            location_ref: this.item.location_ref,
            height: this.item.height,
            width: this.item.width,
            track: this.item.track,
            type: this.item.type,
            pleat: this.item.pleat,
            pleat_sheer: null,
            eyelet_curtain: this.item.eyelet_curtain,
            eyelet_sheer: this.item.eyelet_sheer,
            fullness: this.item.fullness,
            pieces_curtain: this.item.pieces_curtain,
            bracket: this.item.bracket,
            hook: this.item.hook,
            sidehook: this.item.sidehook,
            belt: this.item.belt,
            touchfloor: this.item.touchfloor,
            fabric: this.item.fabric,
            fabric_sheer: null,
            fabric_lining: this.item.fabric_lining,
            code_lining: this.item.code_lining,
            code_curtain: this.item.code_curtain,
            fabric_type: this.item.fabric_type,
            custom_bracket: this.item.custom_bracket,
            custom_belt: this.item.custom_belt,
            price: this.price,
            status: true,
            photos: JSON.stringify(this.item.photos),
            remark_sale: this.item.remark_sale,
            remark_curtain: this.item.remark_curtain,
            status_sale: 'Completed',
            status_tech: 'Pending',
            need_ladder: this.item.need_ladder,
            need_scaftfolding: this.item.need_scaftfolding,
            step: 2,
            promo_curtain: this.item.promo_curtain || 0,
            promo_lining: this.item.promo_lining || 0,
            motorized_upgrade: null,
            motorized_power: null,
            motorized_sides: null,
            motorized_cost: null,
            motorized_choice: null,
            motorized_pieces: null,
            motorized_lift: null,

            // Additional
            track_sheer: null,
            fullness_sheer: null,
            pieces_sheer: null,
            sheer_bracket: null,
            sheer_sidehook: null,
            sheer_belt: null,
            sheer_touchfloor: null,
            code_sheer: null,
            custom_sheer_bracket: null,
            custom_sheer_belt: null,
            remark_sheer: null,
            promo_sheer: null || 0,

            pieces_blind: null,
            blind_decoration: null,
            rope_chain: null,
            promo_blind: null || 0,

            blind_tape: null,
            fabric_blind: null,
            code_blind: null,
            blind_spring: null,
            blind_tube: null,
            blind_easylift: null,
            blind_monosys: null,

            install_fee: this.item.install_fee
          }

          if (this.item.motorized_upgrade) {
            temp.motorized_upgrade = this.item.motorized_upgrade
            temp.motorized_power = this.item.motorized_power
            temp.motorized_sides = this.item.motorized_sides
            temp.motorized_cost = this.item.motorized_cost
            temp.motorized_choice = this.item.motorized_choice
            temp.motorized_pieces = this.item.motorized_pieces
            temp.motorized_lift = this.item.motorized_lift
          }

          console.log(temp);

          this.createOrder(temp)

        } else if (this.item.fabric_type == 'S') {
          console.log('S1');

          let temp = {
            sales_id: this.sales_no,
            location: this.item.location,
            location_ref: this.item.location_ref,
            height: this.item.height,
            width: this.item.width,
            track_sheer: this.item.track_sheer,
            type: this.item.type,
            pleat: null,
            pleat_sheer: this.item.pleat_sheer,
            eyelet_curtain: this.item.eyelet_curtain,
            eyelet_sheer: this.item.eyelet_sheer,
            fullness_sheer: this.item.fullness_sheer,
            pieces_sheer: this.item.pieces_sheer,
            sheer_bracket: this.item.sheer_bracket,
            sheer_hook: this.item.sheer_hook,
            sheer_sidehook: this.item.sheer_sidehook,
            sheer_belt: this.item.sheer_belt,
            sheer_touchfloor: this.item.sheer_touchfloor,
            fabric: null,
            fabric_sheer: this.item.fabric_sheer,
            fabric_lining: null,
            code_sheer: this.item.code_sheer,
            fabric_type: this.item.fabric_type,
            custom_sheer_bracket: this.item.custom_sheer_bracket,
            custom_sheer_belt: this.item.custom_sheer_belt,
            price: this.price,
            status: true,
            photos: JSON.stringify(this.item.photos),
            remark_sale: this.item.remark_sale,
            remark_sheer: this.item.remark_sheer,
            status_sale: 'Completed',
            status_tech: 'Pending',
            need_ladder: this.item.need_ladder,
            need_scaftfolding: this.item.need_scaftfolding,
            step: 2,
            promo_sheer: this.item.promo_sheer || 0,
            motorized_upgrade: null,
            motorized_power: null,
            motorized_sides: null,
            motorized_cost: null,
            motorized_choice: null,
            motorized_pieces: null,
            motorized_lift: null,

            // Additional
            track: null,
            fullness: null,
            pieces_curtain: null,
            bracket: null,
            sidehook: null,
            belt: null,
            touchfloor: null,
            code_lining: null,
            code_curtain: null,
            custom_bracket: null,
            custom_belt: null,
            remark_curtain: null,
            promo_curtain: null || 0,
            promo_lining: null || 0,

            pieces_blind: null,
            blind_decoration: null,
            rope_chain: null,
            promo_blind: null || 0,

            blind_tape: null,
            fabric_blind: null,
            code_blind: null,
            blind_spring: null,
            blind_tube: null,
            blind_easylift: null,
            blind_monosys: null,

            install_fee: this.item.install_fee
          }

          if (this.item.motorized_upgrade) {
            temp.motorized_upgrade = this.item.motorized_upgrade
            temp.motorized_power = this.item.motorized_power
            temp.motorized_sides = this.item.motorized_sides
            temp.motorized_cost = this.item.motorized_cost
            temp.motorized_choice = this.item.motorized_choice
            temp.motorized_pieces = this.item.motorized_pieces
            temp.motorized_lift = this.item.motorized_lift
          }

          console.log(temp);

          this.createOrder(temp)

        } else if (this.item.fabric_type == 'CS') {
          console.log('CS1');

          this.item.custom_sheer_bracket = this.item.custom_bracket
          this.item.sheer_bracket = this.item.bracket
          this.item.custom_sheer_belt = true
          this.item.sheer_belt = 'X'
          // 'sheer_touchfloor', 'track', 'track_sheer', 
          let temp = {
            sales_id: this.sales_no,
            location: this.item.location,
            location_ref: this.item.location_ref,
            height: this.item.height,
            width: this.item.width,
            track: this.item.track,
            track_sheer: this.item.track_sheer,
            type: this.item.type,
            pleat: this.item.pleat,
            pleat_sheer: this.item.pleat_sheer,
            eyelet_curtain: this.item.eyelet_curtain,
            eyelet_sheer: this.item.eyelet_sheer,
            fullness: this.item.fullness,
            fullness_sheer: this.item.fullness_sheer,
            pieces_curtain: this.item.pieces_curtain,
            pieces_sheer: this.item.pieces_sheer,
            bracket: this.item.bracket,
            hook: this.item.hook,
            sidehook: this.item.sidehook,
            belt: this.item.belt,
            touchfloor: this.item.touchfloor,
            sheer_bracket: this.item.sheer_bracket,
            sheer_sidehook: this.item.sheer_sidehook,
            sheer_belt: this.item.sheer_belt,
            // sheer_touchfloor: this.item.sheer_touchfloor,
            fabric: this.item.fabric,
            fabric_sheer: this.item.fabric_sheer,
            fabric_lining: this.item.fabric_lining,
            code_sheer: this.item.code_sheer,
            code_lining: this.item.code_lining,
            code_curtain: this.item.code_curtain,
            fabric_type: this.item.fabric_type,
            custom_bracket: this.item.custom_bracket,
            custom_belt: this.item.custom_belt,
            custom_sheer_bracket: this.item.custom_sheer_bracket,
            custom_sheer_belt: this.item.custom_sheer_belt,
            price: this.price,
            status: true,
            photos: JSON.stringify(this.item.photos),
            remark_sale: this.item.remark_sale,
            remark_curtain: this.item.remark_curtain,
            remark_sheer: this.item.remark_sheer,
            status_sale: 'Completed',
            status_tech: 'Pending',
            need_ladder: this.item.need_ladder,
            need_scaftfolding: this.item.need_scaftfolding,
            step: 2,
            promo_curtain: this.item.promo_curtain || 0,
            promo_lining: this.item.promo_lining || 0,
            promo_sheer: this.item.promo_sheer || 0,
            motorized_upgrade: null,
            motorized_power: null,
            motorized_sides: null,
            motorized_cost: null,
            motorized_choice: null,
            motorized_pieces: null,
            motorized_lift: null,

            // Additional
            sheer_touchfloor: null,
            pieces_blind: null,
            blind_decoration: null,
            rope_chain: null,
            promo_blind: null || 0,

            blind_tape: null,
            fabric_blind: null,
            code_blind: null,
            blind_spring: null,
            blind_tube: null,
            blind_easylift: null,
            blind_monosys: null,

            install_fee: this.item.install_fee
          }

          if (this.item.motorized_upgrade) {
            temp.motorized_upgrade = this.item.motorized_upgrade
            temp.motorized_power = this.item.motorized_power
            temp.motorized_sides = this.item.motorized_sides
            temp.motorized_cost = this.item.motorized_cost
            temp.motorized_choice = this.item.motorized_choice
            temp.motorized_pieces = this.item.motorized_pieces
            temp.motorized_lift = this.item.motorized_lift
          }

          console.log(temp);

          this.createOrder(temp)

        }

      } else {

        if (this.item.fabric_type == 'C') {
          console.log('C2');

          let temp = {
            sales_id: this.sales_no,
            location: this.item.location,
            location_ref: this.item.location_ref,
            height: this.item.height,
            width: this.item.width,
            track: this.item.track,
            type: this.item.type,
            pleat: this.item.pleat,
            pleat_sheer: null,
            eyelet_curtain: this.item.eyelet_curtain,
            eyelet_sheer: this.item.eyelet_sheer,
            fullness: this.item.fullness,
            pieces_curtain: this.item.pieces_curtain,
            bracket: this.item.bracket,
            hook: this.item.hook,
            sidehook: this.item.sidehook,
            belt: this.item.belt,
            touchfloor: this.item.touchfloor,
            fabric: this.item.fabric,
            fabric_sheer: null,
            fabric_lining: this.item.fabric_lining,
            code_lining: this.item.code_lining,
            code_curtain: this.item.code_curtain,
            fabric_type: this.item.fabric_type,
            custom_bracket: this.item.custom_bracket,
            custom_hook: this.item.custom_hook,
            custom_belt: this.item.custom_belt,
            price: this.price,
            status: true,
            photos: JSON.stringify(this.item.photos),
            remark_sale: this.item.remark_sale,
            remark_curtain: this.item.remark_curtain,
            status_sale: 'Completed',
            status_tech: 'Pending',
            need_ladder: this.item.need_ladder,
            need_scaftfolding: this.item.need_scaftfolding,
            step: 2,
            promo_curtain: this.item.promo_curtain || 0,
            promo_lining: this.item.promo_lining || 0,
            motorized_upgrade: null,
            motorized_power: null,
            motorized_sides: null,
            motorized_cost: null,
            motorized_choice: null,
            motorized_pieces: null,
            motorized_lift: null,

            // Additional
            track_sheer: null,
            fullness_sheer: null,
            pieces_sheer: null,
            sheer_bracket: null,
            sheer_sidehook: null,
            sheer_belt: null,
            sheer_touchfloor: null,
            code_sheer: null,
            custom_sheer_bracket: null,
            custom_sheer_belt: null,
            remark_sheer: null,
            promo_sheer: null || 0,

            pieces_blind: null,
            blind_decoration: null,
            rope_chain: null,
            promo_blind: null || 0,

            blind_tape: null,
            fabric_blind: null,
            code_blind: null,
            blind_spring: null,
            blind_tube: null,
            blind_easylift: null,
            blind_monosys: null,

            install_fee: this.item.install_fee
          }

          if (this.item.motorized_upgrade) {
            temp.motorized_upgrade = this.item.motorized_upgrade
            temp.motorized_power = this.item.motorized_power
            temp.motorized_sides = this.item.motorized_sides
            temp.motorized_cost = this.item.motorized_cost
            temp.motorized_choice = this.item.motorized_choice
            temp.motorized_pieces = this.item.motorized_pieces
            temp.motorized_lift = this.item.motorized_lift
          }

          console.log(temp);

          this.createOrder(temp)



        } else if (this.item.fabric_type == 'S') {
          console.log('S2');

          let temp = {
            sales_id: this.sales_no,
            location: this.item.location,
            location_ref: this.item.location_ref,
            height: this.item.height,
            width: this.item.width,
            track_sheer: this.item.track_sheer,
            type: this.item.type,
            pleat: null,
            pleat_sheer: this.item.pleat_sheer,
            eyelet_curtain: this.item.eyelet_curtain,
            eyelet_sheer: this.item.eyelet_sheer,
            fullness_sheer: this.item.fullness_sheer,
            pieces_sheer: this.item.pieces_sheer,
            sheer_bracket: this.item.sheer_bracket,
            sheer_hook: this.item.sheer_hook,
            sheer_sidehook: this.item.sheer_sidehook,
            sheer_belt: this.item.sheer_belt,
            sheer_touchfloor: this.item.sheer_touchfloor,
            fabric: null,
            fabric_sheer: this.item.fabric_sheer,
            fabric_lining: null,
            code_sheer: this.item.code_sheer,
            fabric_type: this.item.fabric_type,
            custom_sheer_bracket: this.item.custom_sheer_bracket,
            custom_sheer_hook: this.item.custom_sheer_hook,
            custom_sheer_belt: this.item.custom_sheer_belt,
            price: this.price,
            status: true,
            photos: JSON.stringify(this.item.photos),
            remark_sale: this.item.remark_sale,
            remark_sheer: this.item.remark_sheer,
            status_sale: 'Completed',
            status_tech: 'Pending',
            need_ladder: this.item.need_ladder,
            need_scaftfolding: this.item.need_scaftfolding,
            step: 2,
            promo_sheer: this.item.promo_sheer || 0,
            motorized_upgrade: null,
            motorized_power: null,
            motorized_sides: null,
            motorized_cost: null,
            motorized_choice: null,
            motorized_pieces: null,
            motorized_lift: null,

            // Additional
            track: null,
            fullness: null,
            pieces_curtain: null,
            bracket: null,
            sidehook: null,
            belt: null,
            touchfloor: null,
            code_lining: null,
            code_curtain: null,
            custom_bracket: null,
            custom_belt: null,
            remark_curtain: null,
            promo_curtain: null || 0,
            promo_lining: null || 0,

            pieces_blind: null,
            blind_decoration: null,
            rope_chain: null,
            promo_blind: null || 0,
            blind_tape: null,
            fabric_blind: null,
            code_blind: null,
            blind_spring: null,
            blind_tube: null,
            blind_easylift: null,
            blind_monosys: null,

            install_fee: this.item.install_fee
          }

          if (this.item.motorized_upgrade) {
            temp.motorized_upgrade = this.item.motorized_upgrade
            temp.motorized_power = this.item.motorized_power
            temp.motorized_sides = this.item.motorized_sides
            temp.motorized_cost = this.item.motorized_cost
            temp.motorized_choice = this.item.motorized_choice
            temp.motorized_pieces = this.item.motorized_pieces
            temp.motorized_lift = this.item.motorized_lift
          }
          console.log(temp);

          this.createOrder(temp)


        } else if (this.item.fabric_type == 'CS') {
          console.log('CS2');

          this.item.custom_sheer_bracket = this.item.custom_bracket
          this.item.sheer_bracket = this.item.bracket
          this.item.custom_sheer_belt = true
          this.item.sheer_belt = 'X'

          // 'sheer_touchfloor', 'track', 'track_sheer', 
          let temp = {
            sales_id: this.sales_no,
            location: this.item.location,
            location_ref: this.item.location_ref,
            height: this.item.height,
            width: this.item.width,
            track: this.item.track,
            track_sheer: this.item.track_sheer,
            type: this.item.type,
            pleat: this.item.pleat,
            pleat_sheer: this.item.pleat_sheer,
            eyelet_curtain: this.item.eyelet_curtain,
            eyelet_sheer: this.item.eyelet_sheer,
            fullness: this.item.fullness,
            fullness_sheer: this.item.fullness_sheer,
            pieces_curtain: this.item.pieces_curtain,
            pieces_sheer: this.item.pieces_sheer,
            bracket: this.item.bracket,
            hook: this.item.hook,
            sidehook: this.item.sidehook,
            belt: this.item.belt,
            touchfloor: this.item.touchfloor,
            sheer_bracket: this.item.sheer_bracket,
            sheer_hook: this.item.sheer_hook,
            sheer_sidehook: this.item.sheer_sidehook,
            sheer_belt: this.item.sheer_belt,
            // sheer_touchfloor: this.item.sheer_touchfloor,
            fabric: this.item.fabric,
            fabric_sheer: this.item.fabric_sheer,
            fabric_lining: this.item.fabric_lining,
            fabric_type: this.item.fabric_type,
            code_lining: this.item.code_lining,
            code_sheer: this.item.code_sheer,
            code_curtain: this.item.code_curtain,
            custom_bracket: this.item.custom_bracket,
            custom_hook: this.item.custom_hook,
            custom_belt: this.item.custom_belt,
            custom_sheer_bracket: this.item.custom_sheer_bracket,
            custom_sheer_hook: this.item.custom_sheer_hook,
            custom_sheer_belt: this.item.custom_sheer_belt,
            price: this.price,
            status: true,
            photos: JSON.stringify(this.item.photos),
            remark_sale: this.item.remark_sale,
            remark_curtain: this.item.remark_curtain,
            remark_sheer: this.item.remark_sheer,
            status_sale: 'Completed',
            status_tech: 'Pending',
            need_ladder: this.item.need_ladder,
            need_scaftfolding: this.item.need_scaftfolding,
            step: 2,
            promo_curtain: this.item.promo_curtain || 0,
            promo_lining: this.item.promo_lining || 0,
            promo_sheer: this.item.promo_sheer || 0,
            motorized_upgrade: null,
            motorized_power: null,
            motorized_sides: null,
            motorized_cost: null,
            motorized_choice: null,
            motorized_pieces: null,
            motorized_lift: null,

            // Additional
            sheer_touchfloor: null,
            pieces_blind: null,
            blind_decoration: null,
            rope_chain: null,
            promo_blind: null || 0,
            blind_tape: null,
            fabric_blind: null,
            code_blind: null,
            blind_spring: null,
            blind_tube: null,
            blind_easylift: null,
            blind_monosys: null,

            install_fee: this.item.install_fee
          }

          if (this.item.motorized_upgrade) {
            temp.motorized_upgrade = this.item.motorized_upgrade
            temp.motorized_power = this.item.motorized_power
            temp.motorized_sides = this.item.motorized_sides
            temp.motorized_cost = this.item.motorized_cost
            temp.motorized_choice = this.item.motorized_choice
            temp.motorized_pieces = this.item.motorized_pieces
            temp.motorized_lift = this.item.motorized_lift
          }

          console.log(temp);

          this.createOrder(temp)

        }

      }

    } else if (this.item.type == '6') {

      let temp = {
        sales_id: this.sales_no,
        type: this.item.type,
        price: this.price,
        wallpaper: JSON.stringify(this.item.wallpaper),
        status: true,
        photos: JSON.stringify(this.item.photos),
        remark_sale: this.item.remark_sale,
        status_sale: 'Completed',
        status_tech: 'Pending',
        step: 2,
      };

      this.createOrder(temp);



    }

  }

  createOrder(temp) {

    console.log(temp);

    Swal.fire({
      title: 'Create Order',
      text: 'Create this new order?',
      heightAuto: false,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Create',
      reverseButtons: true,
    }).then((y) => {
      if (y.isConfirmed) {
        this.http.post('https://curtain.vsnap.my/insertorders', temp).subscribe(a => {

          console.log('insert orders success');
          this.model.dismiss(1)

        })
      } else {

      }
    })


  }

  errorEmpty() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    })

    Toast.fire({
      icon: 'error',
      title: 'Please Fill in all fields.'
    })
  }



  async selector(x, y) {

    const modal = await this.modalcontroller.create({
      component: SelectorPage,
      componentProps: { array: (x == 'curtain' || x == 'sheer' || x == 'curtainsheer') ? x : eval(x) }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      eval(y + '="' + data.value.name + '"')
    }
  }

  async selector2(x) {

    const modal = await this.modalcontroller.create({
      component: SelectorPage,
      componentProps: { array: (x == 'curtain' || x == 'sheer' || x == 'curtainsheer') ? x : eval(x) }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.item.wallpaper.id = data.value.id
      this.item.wallpaper.name = data.value.name
      this.item.wallpaper.price = data.value.price
      this.item.wallpaper.unit = data.value.unit
    }
  }

  back() {

    if (this.item.track || this.item.fabric_type || this.item.bracket || this.item.width || this.item.location) {
      Swal.fire({
        title: 'Close Creation',
        text: 'Your order will not be saved. Are you sure?',
        heightAuto: false,
        icon: 'warning',
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Exit',
        reverseButtons: true,
      }).then((y) => {
        if (y.isConfirmed) {
          this.model.dismiss()
        }
      })
    } else {
      this.model.dismiss()
    }
  }

  lengthof(x) {
    return x ? x.length : 0
  }

  pic = ""

  openPic(x) {
    this.pic = x
  }

  closePic(x) {
    this.pic = ''
  }

  deletePic(x) {
    this.item.photos.splice(x, 1)
    console.log(this.item.photos);

  }

  opencamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.item['photos'].push('https://i.pinimg.com/originals/a2/dc/96/a2dc9668f2cf170fe3efeb263128b0e7.gif');

      let base64Image = 'data:image/jpeg;base64,' + imageData;

      this.http.post('https://forcar.vsnap.my/upload', { image: base64Image, folder: 'goalgame', userid: Date.now() }).subscribe((link) => {
        console.log(link['imageURL']);
        this.item['photos'][this.lengthof(this.item['photos']) - 1] = link['imageURL']
        console.log(this.item['photos']);

      });
    }, (err) => {
      // Handle error
    });
  }

  imagectype;
  imagec;
  base64img;

  fileChange(event, name, maxsize) {
    if (event.target.files && event.target.files[0] && event.target.files[0].size < (10485768)) {
      // this.imagectype = event.target.files[0].type;
      // EXIF.getData(event.target.files[0], () => {
      // console.log(event.target.files[0]);
      //  console.log(event.target.files[0].exifdata.Orientation);
      //  const orientation = EXIF.getTag(this, 'Orientation');
      const can = document.createElement('canvas');
      const ctx = can.getContext('2d');
      const thisImage = new Image;

      const maxW = maxsize;
      const maxH = maxsize;
      thisImage.onload = (a) => {
        // console.log(a);
        const iw = thisImage.width;
        const ih = thisImage.height;
        const scale = Math.min((maxW / iw), (maxH / ih));
        const iwScaled = iw * scale;
        const ihScaled = ih * scale;
        can.width = iwScaled;
        can.height = ihScaled;
        ctx.save();
        // const width = can.width; const styleWidth = can.style.width;
        // const height = can.height; const styleHeight = can.style.height;
        // console.log(event.target.files[0]);
        ctx.drawImage(thisImage, 0, 0, iwScaled, ihScaled);
        ctx.restore();
        this.imagec = can.toDataURL();
        // const imgggg = this.imagec.replace(';base64,', 'thisisathingtoreplace;');
        // const imgarr = imgggg.split('thisisathingtoreplace;');
        // this.base64img = imgarr[1];
        // event.target.value = '';
        this.item['photos'].push('https://i.pinimg.com/originals/a2/dc/96/a2dc9668f2cf170fe3efeb263128b0e7.gif');

        this.http.post('https://forcar.vsnap.my/upload', { image: this.imagec, folder: 'goalgame', userid: Date.now() }).subscribe((link) => {
          console.log(link['imageURL']);
          this.item['photos'][this.lengthof(this.item['photos']) - 1] = link['imageURL']
          console.log(this.item['photos']);

        });
      };
      thisImage.src = URL.createObjectURL(event.target.files[0]);

    } else {
      // S.close();
      alert('Your Current Image Too Large, ' + event.target.files[0].size / (10241024) + 'MB! (Please choose file lesser than 8MB)');
    }
  }

}
