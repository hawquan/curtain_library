import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import Swal from 'sweetalert2';
import { SelectorPage } from '../selector/selector.page';

@Component({
  selector: 'app-task-editor',
  templateUrl: './task-editor.page.html',
  styleUrls: ['./task-editor.page.scss'],
})
export class TaskEditorPage implements OnInit {

  //   constructor(
  //     private nav: NavController,
  //     private actroute: ActivatedRoute,
  //     private model: ModalController,
  //     private navparam: NavParams,
  //   ) { }

  //   item = [] as any
  //   info = []
  //   Header = []
  //   HeaderChoice = ''
  //   HeaderSingle = false
  //   HeaderRipple = false
  //   HeaderDouble = false
  //   HeaderFrench = false
  //   HeaderEyelet = false

  //   RomanBlinds = false
  //   RollerBlinds = false
  //   ZebraBlinds = false
  //   WoodenBlinds = false
  //   blindsChoice = ''

  //   PlainWall = false
  //   FabricWall = false
  //   NonWovenWall = false
  //   PatternWall = false
  //   VinylWall = false
  //   WallpaperChoice = ''
  //   price = 0

  //   ngOnInit() {
  //     this.item = this.navparam.get('item')
  //     console.log(this.item);

  //     if (this.item.type == 'Tailor-Made Curtains' || this.item.type == 'Motorised Curtains') {
  //       this.HeaderSelection(this.item.header)
  //     }
  //     else if (this.item.type == 'Blinds') {
  //       this.blindsSelection(this.item.header)
  //     }
  //     else {
  //       this.wallpaperSelection(this.item.header)
  //     }
  //     // console.log(this.info, this.Header);
  //   }

  //   typeChanged() {
  //     this.HeaderSingle = false
  //     this.HeaderRipple = false
  //     this.HeaderDouble = false
  //     this.HeaderFrench = false
  //     this.HeaderEyelet = false
  //     this.HeaderChoice = ''

  //     this.RomanBlinds = false
  //     this.RollerBlinds = false
  //     this.ZebraBlinds = false
  //     this.WoodenBlinds = false
  //     this.blindsChoice = ''

  //     this.PlainWall = false
  //     this.FabricWall = false
  //     this.NonWovenWall = false
  //     this.PatternWall = false
  //     this.VinylWall = false
  //     this.WallpaperChoice = ''
  //   }

  //   HeaderSelection(x) {
  //     this.HeaderSingle = false
  //     this.HeaderRipple = false
  //     this.HeaderDouble = false
  //     this.HeaderFrench = false
  //     this.HeaderEyelet = false

  //     if (x == 'Single Pleat') {
  //       this.HeaderSingle = true
  //       this.HeaderChoice = 'Single Pleat'
  //     } else if (x == 'Ripple Fold') {
  //       this.HeaderRipple = true
  //       this.HeaderChoice = 'Ripple Fold'
  //     } else if (x == 'Double Pleat') {
  //       this.HeaderDouble = true
  //       this.HeaderChoice = 'Double Pleat'
  //     } else if (x == 'French Pleat') {
  //       this.HeaderFrench = true
  //       this.HeaderChoice = 'French Pleat'
  //     } else if (x == 'Eyelet') {
  //       this.HeaderEyelet = true
  //       this.HeaderChoice = 'Eyelet'
  //     }

  //   }

  //   blindsSelection(x) {
  //     this.RomanBlinds = false
  //     this.RollerBlinds = false
  //     this.ZebraBlinds = false
  //     this.WoodenBlinds = false

  //     if (x == 'Roman Blinds') {
  //       this.RomanBlinds = true
  //       this.blindsChoice = 'Roman Blinds'
  //     } else if (x == 'Roller Blinds') {
  //       this.RollerBlinds = true
  //       this.blindsChoice = 'Roller Blinds'
  //     } else if (x == 'Zebra Blinds') {
  //       this.ZebraBlinds = true
  //       this.blindsChoice = 'Zebra Blinds'
  //     } else if (x == 'Wooden Blinds') {
  //       this.WoodenBlinds = true
  //       this.blindsChoice = 'Wooden Blinds'
  //     }

  //   }

  //   wallpaperSelection(x) {
  //     this.PlainWall = false
  //     this.FabricWall = false
  //     this.NonWovenWall = false
  //     this.PatternWall = false
  //     this.VinylWall = false

  //     if (x == 'Plain') {
  //       this.PlainWall = true
  //       this.WallpaperChoice = 'Plain'
  //     } else if (x == 'Fabric') {
  //       this.FabricWall = true
  //       this.WallpaperChoice = 'Fabric'
  //     } else if (x == 'Non-Woven') {
  //       this.NonWovenWall = true
  //       this.WallpaperChoice = 'Non-Woven'
  //     } else if (x == 'Patterned') {
  //       this.PatternWall = true
  //       this.WallpaperChoice = 'Patterned'
  //     } else if (x == 'Vinyl') {
  //       this.VinylWall = true
  //       this.WallpaperChoice = 'Vinyl'
  //     }

  //   }

  //   updateItem() {
  //     this.item.header = this.HeaderChoice
  //     if (this.item['type'] == 'Tailor-Made Curtains' || this.item['type'] == 'Motorised Curtains') {
  //       console.log('in 1st');
  //       console.log(this.item);

  //       if (['width', 'height', 'type', 'header', 'fabric', 'colours', 'patterns'].every(a => this.item[a])) {

  //         console.log('pass1');

  //         this.model.dismiss(this.item)

  //       } else {
  //         console.log('error empty')
  //         const Toast = Swal.mixin({
  //           toast: true,
  //           position: 'top',
  //           showConfirmButton: false,
  //           timer: 1500,
  //           timerProgressBar: true,
  //         })

  //         Toast.fire({
  //           icon: 'error',
  //           title: 'Please Fill in all fields.'
  //         })

  //       }

  //     } else if (this.item['type'] == 'Blinds') {
  //       this.item.header = this.blindsChoice

  //       console.log('in 2nd');
  //       console.log(this.item);

  //       if (['width', 'height', 'type', 'header', 'styles', 'patterns', 'textures'].every(a => this.item[a])) {
  //         console.log('pass2');
  //         this.model.dismiss(this.item)

  //       } else {
  //         console.log('error empty')
  //         const Toast = Swal.mixin({
  //           toast: true,
  //           position: 'top',
  //           showConfirmButton: false,
  //           timer: 1500,
  //           timerProgressBar: true,
  //         })

  //         Toast.fire({
  //           icon: 'error',
  //           title: 'Please Fill in all fields.'
  //         })
  //       }
  //     } else {
  //       this.item.header = this.WallpaperChoice

  //       console.log('in 2nd');
  //       console.log(this.item);

  //       if (['width', 'height', 'type', 'header', 'colours', 'prints', 'textures'].every(a => this.item[a])) {
  //         console.log('pass2');
  //         this.model.dismiss(this.item)

  //       } else {
  //         console.log('error empty')
  //         const Toast = Swal.mixin({
  //           toast: true,
  //           position: 'top',
  //           showConfirmButton: false,
  //           timer: 1500,
  //           timerProgressBar: true,
  //         })

  //         Toast.fire({
  //           icon: 'error',
  //           title: 'Please Fill in all fields.'
  //         })
  //       }
  //     }

  //   }

  //   calcPrice() {
  //     if (this.item.width + this.item.heigh != 'NaN') {
  //       this.price = this.item.width + this.item.height
  //     } else {
  //       this.price = 0
  //     }
  //   }

  //   back() {
  //     this.model.dismiss()
  //   }

  // }


  constructor(
    private nav: NavController,
    private actroute: ActivatedRoute,
    private model: ModalController, private modalcontroller: ModalController,
    private navparam: NavParams,
    private http: HttpClient,
  ) { }

  item = [] as any
  info = []

  Pleat = []
  PleatChoice = ''
  PleatSingle = false
  PleatRipple = false
  PleatDouble = false
  PleatFrench = false
  PleatEyelet = false

  RomanBlinds = false
  RollerBlinds = false
  ZebraBlinds = false
  WoodenBlinds = false
  blindsChoice = ''

  PlainWall = false
  FabricWall = false
  NonWovenWall = false
  PatternWall = false
  VinylWall = false
  WallpaperChoice = ''
  price = 0

  tracks = [
    "Bendable", "Curve", "Rod", "Cubicle", "Motorised (Battery)", "Motorised (Power Point)"
  ]


  ngOnInit() {
    this.item = this.navparam.get('item')
    
    console.log(this.item);

    this.price = this.item.price

    if (this.item.type == 'Tailor-Made Curtains' || this.item.type == 'Motorised Curtains') {
      this.PleatSelection(this.item.pleat)
    }
    else if (this.item.type == 'Blinds') {
      this.blindsSelection(this.item.pleat)
    }
    else {
      this.wallpaperSelection(this.item.pleat)
    }
  }

  typeChanged() {
    this.PleatSingle = false
    this.PleatRipple = false
    this.PleatDouble = false
    this.PleatFrench = false
    this.PleatEyelet = false
    this.PleatChoice = ''

    this.RomanBlinds = false
    this.RollerBlinds = false
    this.ZebraBlinds = false
    this.WoodenBlinds = false
    this.blindsChoice = ''

    this.PlainWall = false
    this.FabricWall = false
    this.NonWovenWall = false
    this.PatternWall = false
    this.VinylWall = false
    this.WallpaperChoice = ''
  }

  PleatSelection(x) {
    this.PleatSingle = false
    this.PleatRipple = false
    this.PleatDouble = false
    this.PleatFrench = false
    this.PleatEyelet = false

    if (x == 'Single Pleat') {
      this.PleatSingle = true
      this.PleatChoice = 'Single Pleat'
    } else if (x == 'Ripple Fold') {
      this.PleatRipple = true
      this.PleatChoice = 'Ripple Fold'
    } else if (x == 'Double Pleat') {
      this.PleatDouble = true
      this.PleatChoice = 'Double Pleat'
    } else if (x == 'French Pleat') {
      this.PleatFrench = true
      this.PleatChoice = 'French Pleat'
    } else if (x == 'Eyelet') {
      this.PleatEyelet = true
      this.PleatChoice = 'Eyelet'
    }

  }

  blindsSelection(x) {
    this.RomanBlinds = false
    this.RollerBlinds = false
    this.ZebraBlinds = false
    this.WoodenBlinds = false

    if (x == 'Roman Blinds') {
      this.RomanBlinds = true
      this.blindsChoice = 'Roman Blinds'
    } else if (x == 'Roller Blinds') {
      this.RollerBlinds = true
      this.blindsChoice = 'Roller Blinds'
    } else if (x == 'Zebra Blinds') {
      this.ZebraBlinds = true
      this.blindsChoice = 'Zebra Blinds'
    } else if (x == 'Wooden Blinds') {
      this.WoodenBlinds = true
      this.blindsChoice = 'Wooden Blinds'
    }

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

  updateData() {
    // this.item.pieces = this.info.pieces
    // this.item.bracket = x
    // this.item.hook = x
    // this.item.sidehook = x
    // this.item.belt = x
    // this.item.others = x
    // this.item.touchfloor = x
  }

  async selector(x) {
    const modal = await this.modalcontroller.create({
      component: SelectorPage,
      componentProps: { array: [{ name: "ok1", id: "a001" }, { name: "ok2", id: "a002" }, { name: "ok3", id: "a003" }, { name: "ok4", id: "a004" },] }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      eval(x + '="' + data.value.id + '"')
    }
  }

  updateItem() {
    this.calcPrice()
    this.item.pleat = this.PleatChoice
    if (this.item['type'] == 'Tailor-Made Curtains' || this.item['type'] == 'Motorised Curtains') {
      console.log('in 1st');
      console.log(this.item);

      if (['location', 'width', 'height', 'track', 'type', 'pleat', 'pieces', 'bracket', 'hook', 'sidehook', 'belt', 'fabric', 'others', 'touchfloor'].every(a => this.item[a])) {

          console.log('pass1');
          this.item.price = this.price

          let temp = {
            no: this.item.no,
            location: this.item.location,
            height: this.item.height,
            width: this.item.width,
            track: this.item.track,
            type: this.item.type,
            pleat: this.item.pleat,
            fullness: this.item.fullness,
            pieces: this.item.pieces,
            bracket: this.item.bracket,
            hook: this.item.hook,
            sidehook: this.item.sidehook,
            belt: this.item.belt,
            fabric: this.item.fabric,
            others: this.item.others,
            touchfloor: this.item.touchfloor,
            price: this.item.price,
            status: true,
            photos: JSON.stringify([]),
            remark_sale: this.item.remark_sale,
            step: 2,
          }

          this.http.post('http://192.168.1.117/updateorders', temp).subscribe(a => {
            this.model.dismiss(this.item)
          })


      } else {
        console.log('error empty')
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

    } else if (this.item['type'] == 'Blinds') {
      this.item.pleat = this.blindsChoice

      console.log(this.item);

      if (['location', 'width', 'height', 'track', 'type', 'pleat', 'pieces', 'bracket', 'hook', 'sidehook', 'belt', 'fabric', 'others', 'touchfloor'].every(a => this.item[a])) {

          console.log('pass2');
          this.item.price = this.price

          let temp = {
            no: this.item.no,
            location: this.item.location,
            height: this.item.height,
            width: this.item.width,
            track: this.item.track,
            type: this.item.type,
            pleat: this.item.pleat,
            fullness: this.item.fullness,
            pieces: this.item.pieces,
            bracket: this.item.bracket,
            hook: this.item.hook,
            sidehook: this.item.sidehook,
            belt: this.item.belt,
            fabric: this.item.fabric,
            others: this.item.others,
            touchfloor: this.item.touchfloor,
            price: this.item.price,
            status: true,
            photos: JSON.stringify([]),
            remark_sale: this.item.remark_sale,
            step: 2,
          }

          this.http.post('http://192.168.1.117/updateorders', temp).subscribe(a => {
            this.model.dismiss(this.item)

          })

      } else {
        console.log('error empty')
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
    } else {
      this.item.pleat = this.WallpaperChoice

      console.log(this.item);

      if (['location', 'width', 'height', 'track', 'type', 'pleat', 'pieces', 'bracket', 'hook', 'sidehook', 'belt', 'fabric', 'others', 'touchfloor'].every(a => this.item[a])) {

          console.log('pass2');
          this.item.price = this.price
          this.model.dismiss(this.item)

      } else {
        console.log('error empty')
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
    }

  }

  calcPrice() {
    return this.price = this.item.width + this.item.height || 0
  }

  back() {
    this.model.dismiss()
  }

}

