import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import Swal from 'sweetalert2';

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
  blindTape = [] as any
  price = 0
  pass = false
  calc = [] as any

  ngOnInit() {

    this.item = this.navparam.get('item')
    this.tracklist = this.navparam.get('tracklist')
    this.pleatlist = this.navparam.get('pleatlist')
    this.blindlist = this.navparam.get('blindlist')

    this.http.get('https://curtain.vsnap.my/tapeList').subscribe(a => {
      this.blindTape = a['data']
      console.log(this.blindTape);
    })


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

    let alacarte = false
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

    if (this.item.type == '1') {
      alacarte = true

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

    } else if (this.item.type == '2') {
      alacarte = true

      if (this.item.track != null) {
        track = true
        track_id = this.tracklist.filter(x => x.name == this.item.track)[0]['id']
      } else {
        track = false
      }

    } else if (this.item.type == '3') {
      alacarte = true

      if (this.item.accessories.length > 0) {
        isAccessory = true

      }

    } else if (this.item.type == '4') {
      this.item.motorized_upgrade = true
      alacarte = true

    } else if (this.item.type == '5') {
      alacarte = true

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

    } else if (this.item.type == '6') {
      alacarte = true

      if (this.lengthof(this.item.wallpaper) > 0) {
        isWallpaper = true
      }

    } else if (this.item.type == 'Tailor-Made Curtains') {

      if (this.item.fabric != null) {
        if (this.item.fabric_type == 'C' || this.item.fabric_type == 'CS') {
          curtain = true
          try {
            curtain_id = this.fabricCurtain.filter(x => x.name == this.item.fabric)[0]['id']
          } catch (error) {
            this.calcErrorMsg('Fabric', "curtain's fabric", this.item.location + " " + this.item.location_ref)
            this.back()
            return
          }
        } else {
          curtain = false
        }
      } else {
        curtain = false
      }

      if (this.item.fabric_lining != null) {
        if (this.item.fabric_type == 'C' || this.item.fabric_type == 'CS') {
          lining = true
          try {
            lining_id = this.fabricLining.filter(x => x.name == this.item.fabric_lining)[0]['id']
          } catch (error) {
            this.calcErrorMsg('Lining', "lining's fabric", this.item.location + " " + this.item.location_ref)
            this.back()
            return
          }
        } else {
          lining = false
        }
      } else {
        lining = false
      }

      if (this.item.fabric_sheer != null) {
        if (this.item.fabric_type == 'S' || this.item.fabric_type == 'CS') {
          sheer = true
          try {
            sheer_id = this.fabricSheer.filter(x => x.name == this.item.fabric_sheer)[0]['id']
          } catch (error) {
            this.calcErrorMsg('Sheer', "sheer's fabric", this.item.location + " " + this.item.location_ref)
            this.back()
            return
          }
        } else {
          sheer = false
        }
      } else {
        sheer = false
      }

      if (this.item.track != null) {
        if (this.item.fabric_type == 'C' || this.item.fabric_type == 'CS') {
          track = true
          try {
            track_id = this.tracklist.filter(x => x.name == this.item.track)[0]['id']
          } catch (error) {
            this.calcErrorMsg('Track', "track", this.item.location + " " + this.item.location_ref)
            return
          }
        } else {
          track = false
        }
      } else {
        track = false
      }

      if (this.item.track_sheer != null) {
        if (this.item.fabric_type == 'S' || this.item.fabric_type == 'CS') {
          track_sheer = true
          try {
            track_sheer_id = this.tracklist.filter(x => x.name == this.item.track_sheer)[0]['id']
          } catch (error) {
            this.calcErrorMsg("Sheer's Track", "sheer's track", this.item.location + " " + this.item.location_ref)
            return
          }
        } else {
          track_sheer = false
        }
      } else {
        track_sheer = false
      }

      if (this.item.pleat != null && this.item.pleat != '') {
        try {
          pleat_id = this.pleatlist.filter(x => x.name == this.item.pleat)[0]['id']
        } catch (error) {
          this.calcErrorMsg("Pleat", "pleat", this.item.location + " " + this.item.location_ref)
          return
        }
      }

      if (this.item.pleat_sheer != null && this.item.pleat_sheer != '') {
        try {
          pleat_sheer_id = this.pleatlist.filter(x => x.name == this.item.pleat_sheer)[0]['id']
        } catch (error) {
          this.calcErrorMsg("Sheer's Pleat", "sheer's pleat", this.item.location + " " + this.item.location_ref)
          return
        }
      }

      if ((this.item.sidehook == 'Yes' && (this.item.belt != 'No' || this.item.belt)) || (this.item.sheer_sidehook == 'Yes' && (this.item.sheer_belt != 'No' || this.item.sheer_belt))) {
        belt_hook = true
      }

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
          try {
            blind_id = this.fabricBlind.filter(x => x.name == this.item.fabric_blind)[0]['id']
          } catch (error) {
            this.calcErrorMsg('Blind', "blind's fabric", this.item.location + " " + this.item.location_ref)
            return
          }
        }

        if (this.item.fabric != null) {
          curtain = true
          try {
            curtain_id = this.fabricCurtain.filter(x => x.name == this.item.fabric)[0]['id']
          } catch (error) {
            this.calcErrorMsg('Fabric', "curtain's fabric", this.item.location + " " + this.item.location_ref)
            return
          }
        } else {
          curtain = false
        }

        if (this.item.fabric_lining != null) {
          lining = true
          try {
            lining_id = this.fabricLining.filter(x => x.name == this.item.fabric_lining)[0]['id']
          } catch (error) {
            this.calcErrorMsg('Lining', "lining's fabric", this.item.location + " " + this.item.location_ref)
            return
          }
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
          try {
            blind_id = (this.fabricBlind.filter(x => x.name == this.item.fabric_blind))[0]['id']
          } catch (error) {
            this.calcErrorMsg('Blind', "blind's fabric", this.item.location + " " + this.item.location_ref)
            return
          }
        }

        if (this.item.pleat == 'Wooden Blind') {
          if (this.item.blind_tape) {
            tape = true
            try {
              tape_id = (this.blindTape.filter(x => x.name == this.item.blind_tape))[0]['id']
            } catch (error) {
              this.calcErrorMsg('Tape', "blind's tape", this.item.location + " " + this.item.location_ref)
              return
            }
          }
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
      motorized: this.item.motorized_upgrade, motorized_cost: this.item.motorized_cost, motorized_power: this.item.motorized_power, motorized_choice: this.item.motorized_choice, motorized_pieces: this.item.motorized_pieces, motorized_lift: this.item.motorized_lift,
      belt_hook: belt_hook, isRomanBlind: isRomanBlind, tape: tape, tape_id: tape_id, blind_spring: this.item.blind_spring, blind_tube: this.item.blind_tube, blind_easylift: this.item.blind_easylift, blind_monosys: this.item.blind_monosys,
      eyelet_curtain: this.item.eyelet_curtain, eyelet_sheer: this.item.eyelet_sheer, alacarte: alacarte, type: this.item.type, accessories: this.item.accessories, wallpaper: this.item.wallpaper, install_fee: this.item.install_fee
    }

    console.log(temp);

    this.http.post('https://curtain.vsnap.my/calcPrice', temp).subscribe(a => {

      console.log(a);
      this.pass = true
      this.calc = a['data']

      if (this.item.type == 'Blinds') {
        this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0)
      } else {
        if (this.item.motorized_upgrade) {
          this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + a['data']['install']['belt_hook'] + a['data']['motorized']['install']
        } else {
          this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + a['data']['install']['belt_hook']
          // this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + a['data']['install']['belt_hook'] + a['data']['install']['ladder_price'] + a['data']['install']['scaftfolding_price']
        }
        // this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + a['data']['install']['belt_hook']
      }
      // this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + a['data']['install']['belt_hook']

    })

  }

  calcErrorMsg(x, y, z) {
    Swal.fire({
      title: z + ' Error',
      // text: "Please check the curtain's fabric?",
      html: "Please check the " + y + ", possible issues:<br>- " + x + " Availability<br>- " + x + " Name Changed<br>(Try reselect the " + y + ")",
      heightAuto: false,
      icon: 'error',
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: false,
    })
  }

  back() {
    this.model.dismiss()
  }
}
