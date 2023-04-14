import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import Swal from 'sweetalert2';
import { SelectorPage } from '../selector/selector.page';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

@Component({
  selector: 'app-task-detail-rejected-review',
  templateUrl: './task-detail-rejected-review.page.html',
  styleUrls: ['./task-detail-rejected-review.page.scss'],
})
export class TaskDetailRejectedReviewPage implements OnInit {

  constructor(
    private nav: NavController,
    private actroute: ActivatedRoute,
    private model: ModalController, private modalcontroller: ModalController,
    private navparam: NavParams,
    private http: HttpClient,
    private camera: Camera,
  ) { }

  item = [] as any
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
  fabricType = ''

  keyword = ''
  areaList = ['Living Hall', 'Dining Hall', 'Master Bedroom', 'Kitchen', 'Daughter Room', 'Son Room', 'Guestroom', 'Balcony', 'Room', 'Laundry Area', 'Parent Room'
    , 'Study Room', 'Prayer Room', 'Entertainment Hall'].sort((a: any, b: any) => (a > b ? 1 : -1))
  showSelection = false

  ngOnInit() {
    this.item = this.navparam.get('item')

    console.log(this.item, this.pleatlist, this.blindlist, this.tracklist, this.fabriclist);

    this.price = this.item.price


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

      // console.log(this.bracketlist, this.hooklist, this.beltlist, this.otherslist);

    })

    this.http.get('https://curtain.vsnap.my/fabricList').subscribe((s) => {
      this.fabriclist = s['data']

      this.fabricCurtain = this.fabriclist.filter(x => x.type == 'Curtain')
      this.fabricSheer = this.fabriclist.filter(x => x.type == 'Sheer')
      this.fabricLining = this.fabriclist.filter(x => x.type == 'Lining')
      this.fabricBlind = this.fabriclist.filter(x => x.type == 'Blind')

      console.log(this.sales_no, this.pleatlist, this.blindlist, this.position, this.tracklist, this.fabriclist);
      this.checkFabric()
    })
    this.pleatSelection()

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

  checkFabric() {

    if (this.item.fabric_type == 'C') {
      this.fabricType = 'Curtain'
      this.showCurtain = true
    } else if (this.item.fabric_type == 'S') {
      this.fabricType = 'Sheer'
      this.showSheer = true
    } else if (this.item.fabric_type == 'CS') {
      this.fabricType = 'Curtain + Sheer'
      this.showCurtain = true
      this.showSheer = true
    }

  }

  blindsSelection(x) {
    this.BlindsChoice = x.pleat
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

    for (let i = 0; i < this.instPhoto.photos.length; i++) {
      this.item.photos.push(this.instPhoto.photos[i])
    }

    let temp = {
      no: this.item.no,
      price_old: this.item.price_old,
      price: this.price,
      status_sale: 'Revisited',
      status_tech: 'Approved',
      step: 3,
      photos: JSON.stringify(this.item.photos),
      need_ladder: this.item.need_ladder,
      need_scaftfolding: this.item.need_scaftfolding,
      remark_sale: this.item.remark_sales,
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

    if (this.item['type'] == 'Tailor-Made Curtains' || this.item['type'] == 'Motorised Curtains') {

      Swal.fire({
        title: 'Update Task?',
        text: 'Update task of "' + this.item.location + '" to REVISITED. Are you sure?',
        icon: 'question',
        heightAuto: false,
        showConfirmButton: true,
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: 'Update',
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#d33',
      }).then((y) => {
        if (y.isConfirmed) {
          this.http.post('https://curtain.vsnap.my/updateorders', temp).subscribe(a => {
            this.model.dismiss(1)
          })
        }
      })

    } else if (this.item['type'] == 'Blinds') {

      Swal.fire({
        title: 'Update Item?',
        text: 'Update task of "' + this.item.location + '" to REVISITED. Are you sure?',
        icon: 'question',
        heightAuto: false,
        showConfirmButton: true,
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: 'Update',
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#d33',
      }).then((y) => {
        if (y.isConfirmed) {
          this.http.post('https://curtain.vsnap.my/updateorders', temp).subscribe(a => {
            this.model.dismiss(1)
          })
        }
      })

    } else {
      this.item.pleat = this.WallpaperChoice

      console.log(this.item);

      console.log('pass2');
      this.item.price = this.price
      this.model.dismiss(this.item)

    }

  }

  calcPrice(pass) {

    let width = 0 as any
    let height = 0 as any

    if (this.item.height_tech != null || this.item.height_tech != '' || this.item.width_tech != null || this.item.width_tech != '') {
      width = this.item.width_tech
      height = this.item.height_tech
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
      console.log(curtain_id, sheer_id, track_id, pleat_id);

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

    }

    console.log(height);

    if (height > 180) {
      this.item.need_scaftfolding = true
    } else if (height >= 156 && height <= 180) {
      this.item.need_ladder = true
    } else {
      this.item.need_scaftfolding = false
      this.item.need_ladder = false
    }

    let temp = {
      width: parseFloat(width), height: parseFloat(height), curtain: curtain, lining: lining, lining_id: lining_id,
      curtain_id: curtain_id, sheer: sheer, sheer_id: sheer_id, track: track, track_id: track_id, track_sheer: track_sheer, track_sheer_id: track_sheer_id, pleat_id: pleat_id, pleat_sheer_id: pleat_sheer_id, blind: blind, blind_id: blind_id,
      pieces_curtain: this.item.pieces_curtain || 0, pieces_sheer: this.item.pieces_sheer || 0, pieces_blind: this.item.pieces_blind || 0,
      promo_curtain: this.item.promo_curtain || 0, promo_lining: this.item.promo_lining || 0, promo_sheer: this.item.promo_sheer || 0, promo_blind: this.item.promo_blind || 0,
      motorized: this.item.motorized_upgrade, motorized_cost: this.item.motorized_cost, motorized_power: this.item.motorized_power, motorized_choice: this.item.motorized_choice, motorized_pieces: this.item.motorized_pieces, motorized_lift: this.item.motorized_lift,
      belt_hook: belt_hook, isRomanBlind: isRomanBlind, tape: tape, tape_id: tape_id, blind_spring: this.item.blind_spring, blind_tube: this.item.blind_tube, blind_easylift: this.item.blind_easylift, blind_monosys: this.item.blind_monosys,
    }

    console.log(temp);

    this.http.post('https://curtain.vsnap.my/calcPrice', temp).subscribe(a => {

      console.log(a);
      this.item.price_old = this.item.price
      // if (this.item.type == 'Blinds') {
      //   this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0)
      // } else {
      //   if (this.item.motorized_upgrade) {
      //     this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + 25 + a['data']['motorized']['install']
      //   } else {
      //     this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + 25
      //   }
      //   // this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + 25
      // }

      if (this.item.type == 'Blinds') {
        this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + a['data']['install']['ladder_price'] + a['data']['install']['scaftfolding_price']
      } else {
        if (this.item.motorized_upgrade) {
          this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + a['data']['install']['belt_hook'] + a['data']['motorized']['install'] + a['data']['motorized']['lift']+ a['data']['install']['ladder_price'] + a['data']['install']['scaftfolding_price']
        } else {
          this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + a['data']['install']['belt_hook'] + a['data']['install']['ladder_price'] + a['data']['install']['scaftfolding_price']
        }
        // this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + a['data']['install']['belt_hook']
      }
      if (pass) {
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
    this.instPhoto.photos.splice(x, 1)
    console.log(this.instPhoto.photos);

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
      this.instPhoto['photos'].push('https://i.pinimg.com/originals/a2/dc/96/a2dc9668f2cf170fe3efeb263128b0e7.gif');

      let base64Image = 'data:image/jpeg;base64,' + imageData;

      this.http.post('https://forcar.vsnap.my/upload', { image: base64Image, folder: 'goalgame', userid: Date.now() }).subscribe((link) => {
        console.log(link['imageURL']);
        this.instPhoto['photos'][this.lengthof(this.instPhoto['photos']) - 1] = link['imageURL']
        console.log(this.instPhoto['photos']);

      });
    }, (err) => {
      // Handle error
    });
  }


  imagectype;
  imagec;
  base64img;
  instPhoto = { photos: [] as any } as any;

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
        this.instPhoto['photos'].push('https://i.pinimg.com/originals/a2/dc/96/a2dc9668f2cf170fe3efeb263128b0e7.gif');

        this.http.post('https://forcar.vsnap.my/upload', { image: this.imagec, folder: 'goalgame', userid: Date.now() }).subscribe((link) => {
          console.log(link['imageURL']);
          this.instPhoto['photos'][this.lengthof(this.instPhoto['photos']) - 1] = link['imageURL']
          console.log(this.instPhoto['photos']);

        });
      };
      thisImage.src = URL.createObjectURL(event.target.files[0]);

    } else {
      // S.close();
      alert('Your Current Image Too Large, ' + event.target.files[0].size / (10241024) + 'MB! (Please choose file lesser than 8MB)');
    }
  }
}


