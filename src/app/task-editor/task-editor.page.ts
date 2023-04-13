import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import Swal from 'sweetalert2';
import { SelectorPage } from '../selector/selector.page';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

@Component({
  selector: 'app-task-editor',
  templateUrl: './task-editor.page.html',
  styleUrls: ['./task-editor.page.scss'],
})
export class TaskEditorPage implements OnInit {

  constructor(
    private nav: NavController,
    private actroute: ActivatedRoute,
    private model: ModalController, private modalcontroller: ModalController,
    private navparam: NavParams,
    private http: HttpClient,
    private camera: Camera,
  ) { }

  item = { photos: [] as any } as any
  info = []
  sales_no = 0
  position = ""

  pleatlist = []
  blindlist = []
  tracklist = []
  fabriclist = []
  misclist = []
  bracketlist = []
  bracketlistblind = [{ name: 'Wall' }, { name: 'Ceiling' }, { name: 'Ceiling Pelmet' }]
  hooklist = []
  hooklistadjust = []
  beltlist = []
  otherslist = []
  pieceslist = []
  fabricCurtain = []
  fabricSheer = []
  fabricLining = []
  fabricBlind = []
  blindTape = []

  BlindsChoice = ''

  PlainWall = false
  FabricWall = false
  NonWovenWall = false
  PatternWall = false
  VinylWall = false
  WallpaperChoice = ''

  price: any = 0
  hookview = true
  hookviewsheer = true
  show = false
  showCurtain = false
  showSheer = false
  curtainswitch = 'Expand'
  xcurtainswitch = 'Collapse'
  sheerswitch = 'Expand'
  xsheerswitch = 'Collapse'

  keyword = ''
  areaList = ['Living Hall', 'Dining Hall', 'Master Bedroom', 'Kitchen', 'Daughter Room', 'Son Room', 'Guestroom', 'Balcony', 'Room', 'Laundry Area', 'Parent Room'
    , 'Study Room', 'Prayer Room', 'Entertainment Hall'].sort((a: any, b: any) => (a > b ? 1 : -1))
  showSelection = false
  snapURL
  ngOnInit() {

    this.http.get('https://curtain.vsnap.my/miscList').subscribe((s) => {
      this.misclist = s['data']
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

      this.item = this.navparam.get('item')
      this.sales_no = this.navparam.get('sales_no')
      this.pleatlist = this.navparam.get('pleatlist')
      this.blindlist = this.navparam.get('blindlist')
      this.tracklist = this.navparam.get('tracklist')

      this.price = this.item.price

      console.log(this.item);
      this.keyword = this.item.location

      this.http.post('https://curtain.vsnap.my/getonesales', { no: this.sales_no }).subscribe(a => {
        this.info = a['data'][0]
        console.log('info', this.info);
      })

      this.http.get('https://curtain.vsnap.my/fabricList').subscribe((s) => {
        this.fabriclist = s['data']

        this.fabricCurtain = this.fabriclist.filter(x => x.type == 'Curtain')
        this.fabricSheer = this.fabriclist.filter(x => x.type == 'Sheer')
        this.fabricLining = this.fabriclist.filter(x => x.type == 'Lining')
        this.fabricBlind = this.fabriclist.filter(x => x.type == 'Blind').sort((a, b) => (a['type_category'] > b['type_category'] ? 1 : -1) && (a['name'] > b['name'] ? 1 : -1) && (a['id'] > b['id'] ? 1 : -1))

        console.log(this.sales_no, this.pleatlist, this.blindlist, this.position, this.tracklist, this.fabriclist);
        this.checkFabric()
      })

      console.log(this.bracketlist, this.hooklist, this.beltlist, this.otherslist);
      this.pleatSelection()

    })

    this.http.get('https://curtain.vsnap.my/tapeList').subscribe(a => {
      this.blindTape = a['data']
      console.log(this.blindTape);
    })

  }

  typeChanged() {
    this.item.pleat = ''
    this.item.pleat_sheer = ''
    this.item.fullness = ''
    this.item.fullness_sheer = ''
    this.PlainWall = false
    this.FabricWall = false
    this.NonWovenWall = false
    this.PatternWall = false
    this.VinylWall = false
    this.WallpaperChoice = ''
  }

  blindChanged() {
    this.item.blind_decoration = null
    this.item.fabric_blind = null
  }

  pleatSelection() {

    if (this.item.type != 'Blinds') {

      // if (this.item.fabric_type == 'C') {
      //   this.item.fullness = this.pleatlist.find(a => a.name == this.item.pleat)['fullness']

      // } else if (this.item.fabric_type == 'S') {
      //   this.item.fullness_sheer = this.pleatlist.find(a => a.name == this.item.pleat_sheer)['fullness']

      // } else {
      //   this.item.fullness = this.pleatlist.find(a => a.name == this.item.pleat)['fullness']
      //   this.item.fullness_sheer = this.pleatlist.find(a => a.name == this.item.pleat_sheer)['fullness']
      // }
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
    }
  }

  clearTrack(x) {
    if (x == 'curtain') {
      this.item.track = null
    } else if (x == 'sheer') {
      this.item.track_sheer = null
    }
  }

  checkFabric() {

    if (this.item.fabric_type == 'C') {
      this.showCurtain = true
    } else if (this.item.fabric_type == 'S') {
      this.showSheer = true
    } else if (this.item.fabric_type == 'CS') {
      this.showCurtain = true
      this.showSheer = true
    }

  }

  blindsSelection(x) {
    this.BlindsChoice = x.name
  }

  blindChoice() {
    return this.BlindsChoice
  }

  wallpaperSelection(x) {
    this.PlainWall = false
    this.FabricWall = false
    this.NonWovenWall = false
    this.PatternWall = false
    this.VinylWall = false

    if (x == 'Plain') {
      this.PlainWall = true
      this.WallpaperChoice = 'Plain'
    } else if (x == 'Fabric') {
      this.FabricWall = true
      this.WallpaperChoice = 'Fabric'
    } else if (x == 'Non-Woven') {
      this.NonWovenWall = true
      this.WallpaperChoice = 'Non-Woven'
    } else if (x == 'Patterned') {
      this.PatternWall = true
      this.WallpaperChoice = 'Patterned'
    } else if (x == 'Vinyl') {
      this.VinylWall = true
      this.WallpaperChoice = 'Vinyl'
    }

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
    return x ? x.filter(a => (((a || '')).toLowerCase()).includes(this.keyword.toLowerCase())) : []
  }


  async selector(x, y) {

    if (x == 'this.blindTape') {

      if (this.item.blind_decoration == '25mm') {
        x = eval(x).filter(a => a.size == 25)

      }
    }
    const modal = await this.modalcontroller.create({
      component: SelectorPage,
      componentProps: { array: eval(x) }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      eval(y + '="' + data.value.name + '"')
    }
  }

  async selectorblind(x, y, z) {

    let temp = [] as any

    // if (z == 'Roman Blind') {
    //   temp = this.fabricCurtain.concat(this.fabricBlind)
    //   temp = temp.filter(a => a.type_category == this.item.pleat || a.type == 'Curtain')
    // } else {
    temp = eval(x + '.filter(a => a.type_category == this.item.pleat)')
    // }

    const modal = await this.modalcontroller.create({
      component: SelectorPage,
      componentProps: { array: eval(temp) }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      eval(y + '="' + data.value.name + '"')
    }
  }

  // CurtainName = ''
  // SheerName = ''

  // async selectorCurtain() {
  //   const modal = await this.modalcontroller.create({
  //     component: SelectorPage,
  //     componentProps: { array: this.fabricCurtain }
  //   });
  //   await modal.present();
  //   const { data } = await modal.onWillDismiss();
  //   if (data) {
  //     this.item.fabric = data.value.id
  //     this.CurtainName = data.value.name
  //   }
  // }

  // async selectorSheer() {
  //   const modal = await this.modalcontroller.create({
  //     component: SelectorPage,
  //     componentProps: { array: this.fabricSheer }
  //   });
  //   await modal.present();
  //   const { data } = await modal.onWillDismiss();
  //   if (data) {
  //     this.item.fabric_sheer = data.value.id
  //     this.SheerName = data.value.name
  //   }
  // }

  updateItem() {
    this.item.location = this.keyword

    if (this.item['type'] == 'Tailor-Made Curtains' || this.item['type'] == 'Motorised Curtains') {

      if (this.item.pleat == 'Eyelet Design' || this.item.pleat == 'Ripplefold') {
        console.log('C1');

        if (this.item.fabric_type == 'C') {

          if (['location', 'location_ref', 'width', 'height', 'type', 'pleat', 'pieces_curtain', 'bracket', 'sidehook', 'belt', 'touchfloor', 'fabric'].every(a => this.item[a])) {

            let temp = {
              no: this.item.no,
              sales_id: this.sales_no,
              location: this.item.location,
              location_ref: this.item.location_ref,
              height: this.item.height,
              width: this.item.width,
              track: this.item.track,
              type: this.item.type,
              pleat: this.item.pleat,
              fullness: this.item.fullness,
              pieces_curtain: this.item.pieces_curtain,
              bracket: this.item.bracket,
              sidehook: this.item.sidehook,
              belt: this.item.belt,
              touchfloor: this.item.touchfloor,
              fabric: this.item.fabric,
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

            this.updateOrder(temp)

          } else {
            console.log('error empty')
            this.errorEmpty()
          }
        } else if (this.item.fabric_type == 'S') {
          console.log('S1');
          if (['location', 'location_ref', 'width', 'height', 'type', 'pieces_sheer', 'sheer_bracket', 'sheer_sidehook', 'fabric_sheer'].every(a => this.item[a])) {

            let temp = {
              no: this.item.no,
              sales_id: this.sales_no,
              location: this.item.location,
              location_ref: this.item.location_ref,
              height: this.item.height,
              width: this.item.width,
              track_sheer: this.item.track_sheer,
              type: this.item.type,
              pleat_sheer: this.item.pleat_sheer,
              fullness_sheer: this.item.fullness_sheer,
              pieces_sheer: this.item.pieces_sheer,
              sheer_bracket: this.item.sheer_bracket,
              sheer_sidehook: this.item.sheer_sidehook,
              sheer_belt: this.item.sheer_belt,
              sheer_touchfloor: this.item.sheer_touchfloor,
              fabric_sheer: this.item.fabric_sheer,
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

            this.updateOrder(temp)

          } else {
            console.log('error empty')
            this.errorEmpty()
          }
        } else if (this.item.fabric_type == 'CS') {
          console.log('CS1');

          this.item.custom_sheer_bracket = this.item.custom_bracket
          this.item.sheer_bracket = this.item.bracket
          this.item.custom_sheer_belt = true
          this.item.sheer_belt = 'X'

          if (['location', 'location_ref', 'width', 'height', 'type', 'pleat', 'pleat_sheer', 'pieces_curtain', 'pieces_sheer', 'bracket', 'sidehook', 'belt', 'touchfloor', 'sheer_sidehook', 'fabric', 'fabric_sheer'].every(a => this.item[a])) {
            // , 'sheer_touchfloor' 'track', 'track_sheer',
            let temp = {
              no: this.item.no,
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
              fullness: this.item.fullness,
              fullness_sheer: this.item.fullness_sheer,
              pieces_curtain: this.item.pieces_curtain,
              pieces_sheer: this.item.pieces_sheer,
              bracket: this.item.bracket,
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

            this.updateOrder(temp)

          } else {
            console.log('error empty')
            this.errorEmpty()
          }
        }

      } else {
        if (this.item.fabric_type == 'C') {
          console.log('C2');
          if (['location', 'location_ref', 'width', 'height', 'type', 'pleat', 'pieces_curtain', 'bracket', 'hook', 'sidehook', 'belt', 'touchfloor', 'fabric'].every(a => this.item[a])) {

            let temp = {
              no: this.item.no,
              sales_id: this.sales_no,
              location: this.item.location,
              location_ref: this.item.location_ref,
              height: this.item.height,
              width: this.item.width,
              track: this.item.track,
              type: this.item.type,
              pleat: this.item.pleat,
              fullness: this.item.fullness,
              pieces_curtain: this.item.pieces_curtain,
              bracket: this.item.bracket,
              hook: this.item.hook,
              sidehook: this.item.sidehook,
              belt: this.item.belt,
              touchfloor: this.item.touchfloor,
              fabric: this.item.fabric,
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

            this.updateOrder(temp)

          } else {
            console.log('error empty')
            this.errorEmpty()

          }

        } else if (this.item.fabric_type == 'S') {
          console.log('S2');
          if (['location', 'location_ref', 'width', 'height', 'type', 'pleat_sheer', 'pieces_sheer', 'sheer_sidehook', 'fabric_sheer'].every(a => this.item[a])) {

            let temp = {
              no: this.item.no,
              sales_id: this.sales_no,
              location: this.item.location,
              location_ref: this.item.location_ref,
              height: this.item.height,
              width: this.item.width,
              track_sheer: this.item.track_sheer,
              type: this.item.type,
              pleat_sheer: this.item.pleat_sheer,
              fullness_sheer: this.item.fullness_sheer,
              pieces_sheer: this.item.pieces_sheer,
              sheer_bracket: this.item.sheer_bracket,
              sheer_hook: this.item.sheer_hook,
              sheer_sidehook: this.item.sheer_sidehook,
              sheer_belt: this.item.sheer_belt,
              sheer_touchfloor: this.item.sheer_touchfloor,
              fabric_sheer: this.item.fabric_sheer,
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

            this.updateOrder(temp)

          } else {
            console.log('error empty')
            this.errorEmpty()
          }
        } else if (this.item.fabric_type == 'CS') {
          console.log('CS2');

          this.item.custom_sheer_bracket = this.item.custom_bracket
          this.item.sheer_bracket = this.item.bracket
          this.item.custom_sheer_belt = true
          this.item.sheer_belt = 'X'

          if (['location', 'location_ref', 'width', 'height', 'type', 'pleat', 'pleat_sheer', 'pieces_curtain', 'pieces_sheer', 'bracket', 'hook', 'sidehook', 'belt', 'touchfloor', 'sheer_sidehook', 'fabric', 'fabric_sheer'].every(a => this.item[a])) {
            // 'sheer_touchfloor', 'track', 'track_sheer',
            let temp = {
              no: this.item.no,
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
              code_sheer: this.item.code_sheer,
              code_lining: this.item.code_lining,
              code_curtain: this.item.code_curtain,
              fabric_type: this.item.fabric_type,
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

            this.updateOrder(temp)

          } else {
            console.log('error empty')
            this.errorEmpty()
          }
        }

      }

    } else if (this.item['type'] == 'Blinds') {

      if (this.item.pleat == 'Roman Blind') {
        if (['location', 'location_ref', 'width', 'height', 'type', 'pieces_blind', 'fabric', 'bracket', 'rope_chain'].every(a => this.item[a])) {

          let temp = {
            no: this.item.no,
            sales_id: this.sales_no,
            location: this.item.location,
            location_ref: this.item.location_ref,
            height: this.item.height,
            width: this.item.width,
            type: this.item.type,
            pleat: this.item.pleat,
            pieces_blind: this.item.pieces_blind,
            blind_decoration: this.item.blind_decoration,
            bracket: this.item.bracket,
            rope_chain: this.item.rope_chain,
            // hook: this.item.hook,
            // sidehook: this.item.sidehook,
            // belt: this.item.belt,
            // fabric_blind: this.item.fabric_blind,
            fabric: this.item.fabric,
            fabric_lining: this.item.fabric_lining,
            code_lining: this.item.code_lining,
            code_curtain: this.item.code_curtain,
            custom_bracket: this.item.custom_bracket,
            // custom_hook: this.item.custom_hook,
            // custom_belt: this.item.custom_belt,
            price: this.price,
            status: true,
            photos: JSON.stringify(this.item.photos),
            remark_sale: this.item.remark_sale,
            status_sale: 'Completed',
            status_tech: 'Pending',
            need_ladder: this.item.need_ladder,
            need_scaftfolding: this.item.need_scaftfolding,
            step: 2,
            promo_lining: this.item.promo_lining || 0,
            promo_blind: this.item.promo_blind || 0,
          }
          console.log(temp);

          this.updateOrder(temp)


        } else {
          console.log('error empty')
          this.errorEmpty()
        }
      } else if (this.item.pleat == 'Zebra Blind' || this.item.pleat == 'Roller Blind' || this.item.pleat == 'Wooden Blind') {
        if (['location', 'location_ref', 'width', 'height', 'type', 'rope_chain', 'pieces_blind', 'fabric_blind', 'bracket'].every(a => this.item[a])) {


          if (this.item.pleat == 'Wooden Blind' && ((this.item.blind_decoration && !this.item.blind_tape) || (!this.item.blind_decoration && this.item.blind_tape))) {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top',
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true,
            })

            Toast.fire({
              icon: 'error',
              title: 'Decorations or Tape is empty.'
            })
          } else {

            let temp = {
              no: this.item.no,
              sales_id: this.sales_no,
              location: this.item.location,
              location_ref: this.item.location_ref,
              height: this.item.height,
              width: this.item.width,
              type: this.item.type,
              pleat: this.item.pleat,
              pieces_blind: this.item.pieces_blind,
              blind_decoration: this.item.blind_decoration,
              blind_tape: this.item.blind_tape,
              bracket: this.item.bracket,
              rope_chain: this.item.rope_chain,
              // hook: this.item.hook,
              // sidehook: this.item.sidehook,
              // belt: this.item.belt,
              fabric_blind: this.item.fabric_blind,
              code_blind: this.item.code_blind,
              custom_bracket: this.item.custom_bracket,
              // custom_hook: this.item.custom_hook,
              // custom_belt: this.item.custom_belt,
              price: this.price,
              status: true,
              photos: JSON.stringify(this.item.photos),
              remark_sale: this.item.remark_sale,
              status_sale: 'Completed',
              status_tech: 'Pending',
              need_ladder: this.item.need_ladder,
              need_scaftfolding: this.item.need_scaftfolding,
              step: 2,
              promo_blind: this.item.promo_blind || 0,
            }
            console.log(temp);

            this.updateOrder(temp)
          }


        } else {
          console.log('error empty')
          this.errorEmpty()
        }
      } else {
        if (['location', 'location_ref', 'width', 'height', 'type', 'pieces_blind', 'rope_chain', 'fabric_blind', 'bracket'].every(a => this.item[a])) {

          let temp = {
            no: this.item.no,
            sales_id: this.sales_no,
            location: this.item.location,
            location_ref: this.item.location_ref,
            height: this.item.height,
            width: this.item.width,
            type: this.item.type,
            pleat: this.item.pleat,
            pieces_blind: this.item.pieces_blind,
            bracket: this.item.bracket,
            rope_chain: this.item.rope_chain,
            // hook: this.item.hook,
            // sidehook: this.item.sidehook,
            // belt: this.item.belt,
            fabric_blind: this.item.fabric_blind,
            code_blind: this.item.code_blind,
            custom_bracket: this.item.custom_bracket,
            // custom_hook: this.item.custom_hook,
            // custom_belt: this.item.custom_belt,
            price: this.price,
            status: true,
            photos: JSON.stringify(this.item.photos),
            remark_sale: this.item.remark_sale,
            status_sale: 'Completed',
            status_tech: 'Pending',
            need_ladder: this.item.need_ladder,
            need_scaftfolding: this.item.need_scaftfolding,
            step: 2,
            promo_blind: this.item.promo_blind || 0,
          }
          console.log(temp);

          this.updateOrder(temp)


        } else {
          console.log('error empty')
          this.errorEmpty()
        }
      }

    } else {
      this.item.pleat = this.WallpaperChoice

      console.log(this.item);

      if (['location', 'width', 'height', 'track', 'type', 'pleat', 'pieces', 'bracket', 'hook', 'sidehook', 'belt', 'fabric', 'touchfloor'].every(a => this.item[a])) {

        console.log('add wallpaper');
        this.item.price = this.price
        this.model.dismiss(this.item)

      } else {
        console.log('error empty')
        this.errorEmpty()
      }
    }

    // this.item.pleat = this.PleatChoice
    // if (this.item['type'] == 'Tailor-Made Curtains' || this.item['type'] == 'Motorised Curtains') {

    //   let temp = {
    //     no: this.item.no,
    //     location: this.item.location,
    //     height: this.item.height,
    //     width: this.item.width,
    //     track: this.item.track,
    //     type: this.item.type,
    //     pleat: this.item.pleat,
    //     fullness: this.item.fullness,
    //     pieces: this.item.pieces,
    //     bracket: this.item.bracket,
    //     hook: this.item.hook,
    //     sidehook: this.item.sidehook,
    //     belt: this.item.belt,
    //     fabric: this.item.fabric,
    //     fabric_sheer: this.item.fabric_sheer,
    //     others: this.item.others,
    //     touchfloor: this.item.touchfloor,
    //     price: this.price,
    //     status: true,
    //     status_sale: 'Completed',
    //     status_tech: 'Pending',
    //     photos: JSON.stringify(this.item.photos),
    //     remark_sale: this.item.remark_sale,
    //     step: 2,
    //   }

    //   console.log(temp);
    //   if (this.PleatChoice == 'Eyelet Design' || this.PleatChoice == 'Ripplefold') {

    //     if (['location', 'width', 'height', 'track', 'type', 'pleat', 'pieces', 'bracket', 'sidehook', 'belt', 'others', 'touchfloor'].every(a => this.item[a])) {

    //       Swal.fire({
    //         title: 'Update Order',
    //         text: 'Update this order?',
    //         heightAuto: false,
    //         icon: 'success',
    //         showConfirmButton: true,
    //         showCancelButton: true,
    //         cancelButtonText: 'Cancel',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Yes, Update',
    //         reverseButtons: true,
    //       }).then((y) => {
    //         if (y.isConfirmed) {
    //           this.http.post('https://curtain.vsnap.my/updateorders', temp).subscribe(a => {
    //             this.model.dismiss(1)
    //           })
    //         }
    //       })

    //     } else {
    //       console.log('error empty')
    //       const Toast = Swal.mixin({
    //         toast: true,
    //         position: 'top',
    //         showConfirmButton: false,
    //         timer: 1500,
    //         timerProgressBar: true,
    //       })

    //       Toast.fire({
    //         icon: 'error',
    //         title: 'Please Fill in all fields.'
    //       })

    //     }
    //   } else {
    //     if (['location', 'width', 'height', 'track', 'type', 'pleat', 'pieces', 'bracket', 'hook', 'sidehook', 'belt', 'others', 'touchfloor'].every(a => this.item[a])) {

    //       Swal.fire({
    //         title: 'Update Order',
    //         text: 'Update this order?',
    //         heightAuto: false,
    //         icon: 'success',
    //         showConfirmButton: true,
    //         showCancelButton: true,
    //         cancelButtonText: 'Cancel',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Yes, Update',
    //         reverseButtons: true,
    //       }).then((y) => {
    //         if (y.isConfirmed) {
    //           this.http.post('https://curtain.vsnap.my/updateorders', temp).subscribe(a => {
    //             this.model.dismiss(1)
    //           })
    //         }
    //       })


    //     } else {
    //       console.log('error empty')
    //       const Toast = Swal.mixin({
    //         toast: true,
    //         position: 'top',
    //         showConfirmButton: false,
    //         timer: 1500,
    //         timerProgressBar: true,
    //       })

    //       Toast.fire({
    //         icon: 'error',
    //         title: 'Please Fill in all fields.'
    //       })

    //     }
    //   }

    // } else if (this.item['type'] == 'Blinds') {
    //   this.item.pleat = this.BlindsChoice

    //   console.log(this.item);

    //   if (['location', 'width', 'height', 'type', 'pleat', 'pieces', 'bracket', 'hook', 'belt', 'others'].every(a => this.item[a])) {

    //     console.log('pass2');

    //     let temp = {
    //       no: this.item.no,
    //       location: this.item.location,
    //       height: this.item.height,
    //       width: this.item.width,
    //       track: this.item.track,
    //       type: this.item.type,
    //       pleat: this.item.pleat,
    //       fullness: this.item.fullness,
    //       pieces: this.item.pieces,
    //       bracket: this.item.bracket,
    //       hook: this.item.hook,
    //       sidehook: this.item.sidehook,
    //       belt: this.item.belt,
    //       fabric: this.item.fabric,
    //       fabric_sheer: this.item.fabric_sheer,
    //       others: this.item.others,
    //       touchfloor: this.item.touchfloor,
    //       price: this.price,
    //       status: true,
    //       status_sale: 'Completed',
    //       status_tech: 'Pending',
    //       photos: JSON.stringify(this.item.photos),
    //       remark_sale: this.item.remark_sale,
    //       step: 2,
    //     }

    //     Swal.fire({
    //       title: 'Update Order',
    //       text: 'Update this order?',
    //       heightAuto: false,
    //       icon: 'success',
    //       showConfirmButton: true,
    //       showCancelButton: true,
    //       cancelButtonText: 'Cancel',
    //       cancelButtonColor: '#d33',
    //       confirmButtonText: 'Yes, Create',
    //       reverseButtons: true,
    //     }).then((y) => {
    //       if (y.isConfirmed) {
    //         this.http.post('https://curtain.vsnap.my/updateorders', temp).subscribe(a => {
    //           this.model.dismiss(1)
    //         })
    //       }
    //     })

    //   } else {
    //     console.log('error empty')
    //     const Toast = Swal.mixin({
    //       toast: true,
    //       position: 'top',
    //       showConfirmButton: false,
    //       timer: 1500,
    //       timerProgressBar: true,
    //     })

    //     Toast.fire({
    //       icon: 'error',
    //       title: 'Please Fill in all fields.'
    //     })
    //   }
    // } else {
    //   this.item.pleat = this.WallpaperChoice

    //   console.log(this.item);

    //   if (['location', 'width', 'height', 'track', 'type', 'pleat', 'pieces', 'bracket', 'hook', 'sidehook', 'belt', 'fabric', 'others', 'touchfloor'].every(a => this.item[a])) {

    //     console.log('pass2');
    //     this.item.price = this.price
    //     this.model.dismiss(this.item)

    //   } else {
    //     console.log('error empty')
    //     const Toast = Swal.mixin({
    //       toast: true,
    //       position: 'top',
    //       showConfirmButton: false,
    //       timer: 1500,
    //       timerProgressBar: true,
    //     })

    //     Toast.fire({
    //       icon: 'error',
    //       title: 'Please Fill in all fields.'
    //     })
    //   }
    // }

  }

  updateOrder(temp) {
    console.log(this.sales_no);

    if (temp.promo_curtain < 0 || temp.promo_curtain > 20 || temp.promo_lining < 0 || temp.promo_lining > 20 || temp.promo_sheer < 0 || temp.promo_sheer > 20 || temp.promo_blind < 0 || temp.promo_blind > 20) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      })

      Toast.fire({
        icon: 'error',
        title: 'Promo price exceeded limit.'
      })
    } else {

      Swal.fire({
        title: 'Update Order',
        text: 'Update this order?',
        heightAuto: false,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Update',
        reverseButtons: true,
      }).then((y) => {
        if (y.isConfirmed) {
          this.http.post('https://curtain.vsnap.my/updateorders', temp).subscribe(a => {

            this.model.dismiss(1)

          })
        } else {

        }
      })

    }

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

  calcPrice(x) {

    console.log(this.item);

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
    let isRomanBlind = false
    let tape = false
    let tape_id

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

      if ((this.item.sidehook == 'Yes' && (this.item.belt != 'No' || this.item.belt)) || (this.item.sheer_sidehook == 'Yes' && (this.item.sheer_belt != 'No' || this.item.sheer_belt))) {
        belt_hook = true
      }

      console.log(curtain_id, sheer_id, track_id, pleat_id, pleat_sheer_id);

    } else {
      if (this.item.pleat == 'Roman Blind') {
        // curtain = true
        sheer = false
        track = false
        track_sheer = false
        // lining = false
        blind = true
        isRomanBlind = true
        belt_hook = false
        console.log('blindcurtain');

        if (this.item.fabric_blind != null) {
          blind = true
          blind_id = this.fabricBlind.filter(x => x.name == this.item.fabric_blind)[0]['id']
        }

        if (this.item.fabric != null) {
          curtain = true
          curtain_id = this.fabricCurtain.filter(x => x.name == this.item.fabric)[0]['id']
        } else {
          curtain = false
        }

        if (this.item.fabric_lining != null) {
          lining = true
          lining_id = this.fabricLining.filter(x => x.name == this.item.fabric_lining)[0]['id']
        } else {
          lining = false
        }

      } else {
        curtain = false
        sheer = false
        track = false
        track_sheer = false
        lining = false
        belt_hook = false
        isRomanBlind = false
        blind = true
        console.log('blind');

        if (this.item.fabric_blind != null && this.item.fabric_blind != '') {
          blind_id = (this.fabricBlind.filter(x => x.name == this.item.fabric_blind))[0]['id']
        }

        if (this.item.pleat == 'Wooden Blind') {
          if (this.item.blind_tape) {
            tape_id = (this.blindTape.filter(x => x.name == this.item.blind_tape))[0]['id']
            tape = true
          }
        }
      }
      // if (this.item.pleat != null && this.item.pleat != '') {
      //   pleat_id = this.blindlist.filter(x => x.name == this.item.pleat)[0]['id']
      // }
    }

    if (this.item.height > 180) {
      this.item.need_scaftfolding = true
      console.log('yes');

    } else if (this.item.height >= 156 && this.item.height <= 180) {
      this.item.need_ladder = true
    } else {
      this.item.need_scaftfolding = false
      this.item.need_ladder = false
      console.log('no');

    }

    let temp = {
      width: parseFloat(this.item.width), height: parseFloat(this.item.height), curtain: curtain, lining: lining, lining_id: lining_id,
      curtain_id: curtain_id, sheer: sheer, sheer_id: sheer_id, track: track, track_id: track_id, track_sheer: track_sheer, track_sheer_id: track_sheer_id, pleat_id: pleat_id, pleat_sheer_id: pleat_sheer_id, blind: blind, blind_id: blind_id,
      pieces_curtain: this.item.pieces_curtain || 0, pieces_sheer: this.item.pieces_sheer || 0, pieces_blind: this.item.pieces_blind || 0,
      promo_curtain: this.item.promo_curtain || 0, promo_lining: this.item.promo_lining || 0, promo_sheer: this.item.promo_sheer || 0, promo_blind: this.item.promo_blind || 0,
      motorized: this.item.motorized_upgrade, motorized_cost: this.item.motorized_cost, motorized_power: this.item.motorized_power, motorized_choice: this.item.motorized_choice, motorized_pieces: this.item.motorized_pieces, motorized_lift: this.item.motorized_lift,
      belt_hook: belt_hook, isRomanBlind: isRomanBlind, tape: tape, tape_id: tape_id,

    }

    console.log(temp);

    this.http.post('https://curtain.vsnap.my/calcPrice', temp).subscribe(a => {

      console.log(a);

      if (this.item.type == 'Blinds') {
        this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + a['data']['install']['ladder_price'] + a['data']['install']['scaftfolding_price']
      } else {
        if (this.item.motorized_upgrade) {
          this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + a['data']['install']['belt_hook'] + a['data']['motorized']['install'] + a['data']['motorized']['lift'] + a['data']['install']['ladder_price'] + a['data']['install']['scaftfolding_price']
        } else {
          this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + a['data']['install']['belt_hook'] + a['data']['install']['ladder_price'] + a['data']['install']['scaftfolding_price']
        }
      }

      if (x == 'sales') {
        this.updateItem()
      }

    })

  }

  numberOnlyValidation(event: any) {
    const pattern = /^(\d+(?:,\d{1,2})?).*/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  back() {
    this.model.dismiss(1)
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

  save(event) {
    alert(event)
    alert(JSON.stringify(event))
    console.log(event)
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

