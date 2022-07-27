import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import Swal from 'sweetalert2';
import { SelectorPage } from '../selector/selector.page';

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
  ) { }

  item = [] as any
  info = []
  calc = [] as any

  pleatlist = []
  blindlist = []
  tracklist = []
  fabriclist = []
  misclist = []
  bracketlist = []
  hooklist = []
  beltlist = []
  otherslist = []
  fabricCurtain = []
  fabricSheer = []

  PleatChoice = ''
  BlindsChoice = ''

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
    this.pleatlist = this.navparam.get('pleatlist')
    this.blindlist = this.navparam.get('blindlist')
    this.tracklist = this.navparam.get('tracklist')
    this.fabriclist = this.navparam.get('fabriclist')
    console.log(this.item, this.pleatlist);

    this.fabricCurtain = this.fabriclist.filter(x => x.type == 'Curtain')
    this.fabricSheer = this.fabriclist.filter(x => x.type == 'Sheer')
    this.price = this.item.price

    if (this.item.type == 'Tailor-Made Curtains' || this.item.type == 'Motorised Curtains') {
      this.pleatSelection(this.item)
    }
    else if (this.item.type == 'Blinds') {
      this.blindsSelection(this.item)
    }
    else {
      this.wallpaperSelection(this.item.pleat)
    }

    this.http.get('https://6dbe-175-140-151-140.ap.ngrok.io/miscList').subscribe((s) => {
      this.misclist = s['data']
      console.log(this.misclist)

      for (let i = 0; i < this.misclist.length; i++) {
        // if (this.misclist['type'] == "Pieces") {
        // } 
        if (this.misclist[i]['type'] == "Bracket") {
          this.bracketlist.push(this.misclist[i])
        } else if (this.misclist[i]['type'] == "Hook") {
          this.hooklist.push(this.misclist[i])
        } else if (this.misclist[i]['type'] == "Belt") {
          this.beltlist.push(this.misclist[i])
        } else if (this.misclist[i]['type'] == "Others") {
          this.otherslist.push(this.misclist[i])
        }
      }

      // console.log(this.bracketlist, this.hooklist, this.beltlist, this.otherslist);

    })

  }

  typeChanged() {
    this.PleatChoice = ''

    this.BlindsChoice = ''

    this.PlainWall = false
    this.FabricWall = false
    this.NonWovenWall = false
    this.PatternWall = false
    this.VinylWall = false
    this.WallpaperChoice = ''
  }

  pleatSelection(x) {
    console.log(x);
    this.PleatChoice = x.pleat
    this.item.fullness = x.fullness
  }

  pleatChoice() {
    return this.PleatChoice
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
    this.item.pleat = this.PleatChoice
    if (this.item['type'] == 'Tailor-Made Curtains' || this.item['type'] == 'Motorised Curtains') {
      console.log('in 1st');
      console.log(this.item);

      if (['location', 'width', 'height', 'track', 'type', 'pleat', 'pieces', 'bracket', 'hook', 'sidehook', 'belt', 'fabric', 'others', 'touchfloor'].every(a => this.item[a])) {

        console.log('pass1');
        this.item.price = this.price

        let temp = {
          no: this.item.no,
          // location: this.item.location,
          height: this.item.height,
          width: this.item.width,
          height_tech: this.item.height_tech,
          width_tech: this.item.width_tech,
          // track: this.item.track,
          // type: this.item.type,
          // pleat: this.item.pleat,
          // fullness: this.item.fullness,
          // pieces: this.item.pieces,
          // bracket: this.item.bracket,
          // hook: this.item.hook,
          // sidehook: this.item.sidehook,
          // belt: this.item.belt,
          // fabric: this.item.fabric,
          // others: this.item.others,
          // touchfloor: this.item.touchfloor,
          price: this.item.price,
          photos: JSON.stringify(this.item.photos),
          status_tech: 'Revisited',
          step: 3,
          remark_tech: this.item.remark_tech
        }

        Swal.fire({
          title: 'Update Item Status?',
          text: 'Update order of "' + this.item.location + '" to Revisited. Are you sure?',
          icon: 'success',
          heightAuto: false,
          showConfirmButton: true,
          showCancelButton: true,
          reverseButtons: true,
          confirmButtonText: 'Update',
          cancelButtonText: 'Cancel',
          cancelButtonColor: '#d33',
        }).then((y) => {
          if (y.isConfirmed) {
            this.http.post('https://6dbe-175-140-151-140.ap.ngrok.io/updateorders', temp).subscribe(a => {
              this.model.dismiss(1)
            })
          }
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
      this.item.pleat = this.BlindsChoice

      console.log(this.item);

      if (['location', 'width', 'height', 'type', 'pleat', 'pieces', 'bracket', 'hook', 'belt', 'others'].every(a => this.item[a])) {

        console.log('pass2');
        this.item.price = this.price

        let temp = {
          no: this.item.no,
          height: this.item.height,
          width: this.item.width,
          height_tech: this.item.height_tech,
          width_tech: this.item.width_tech,
          // track: this.item.track,
          // type: this.item.type,
          // pleat: this.item.pleat,
          // fullness: this.item.fullness,
          // pieces: this.item.pieces,
          // bracket: this.item.bracket,
          // hook: this.item.hook,
          // sidehook: this.item.sidehook,
          // belt: this.item.belt,
          // fabric: this.item.fabric,
          // others: this.item.others,
          // touchfloor: this.item.touchfloor,
          price: this.item.price,
          status_tech: 'Revisited',
          photos: JSON.stringify(this.item.photos),
          step: 3,
          remark_tech: this.item.remark_tech
        }
        Swal.fire({
          title: 'Update Item Status?',
          text: 'Update order of "' + this.item.location + '" to Revisited. Are you sure?',
          icon: 'success',
          heightAuto: false,
          showConfirmButton: true,
          showCancelButton: true,
          reverseButtons: true,
          confirmButtonText: 'Update',
          cancelButtonText: 'Cancel',
          cancelButtonColor: '#d33',
        }).then((y) => {
          if (y.isConfirmed) {
            this.http.post('https://6dbe-175-140-151-140.ap.ngrok.io/updateorders', temp).subscribe(a => {
              this.model.dismiss(1)
            })
          }
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

  rejectItem() {
    this.item.pleat = this.PleatChoice
    if (this.item['type'] == 'Tailor-Made Curtains' || this.item['type'] == 'Motorised Curtains') {
      console.log('in 1st');
      console.log(this.item);

      if (['location', 'width', 'height', 'track', 'type', 'pleat', 'pieces', 'bracket', 'hook', 'sidehook', 'belt', 'fabric', 'others', 'touchfloor'].every(a => this.item[a])) {

        console.log('pass1');
        this.item.price = this.price

        let temp = {
          no: this.item.no,
          // location: this.item.location,
          height: this.item.height,
          width: this.item.width,
          height_tech: this.item.height_tech,
          width_tech: this.item.width_tech,
          // track: this.item.track,
          // type: this.item.type,
          // pleat: this.item.pleat,
          // fullness: this.item.fullness,
          // pieces: this.item.pieces,
          // bracket: this.item.bracket,
          // hook: this.item.hook,
          // sidehook: this.item.sidehook,
          // belt: this.item.belt,
          // fabric: this.item.fabric,
          // others: this.item.others,
          // touchfloor: this.item.touchfloor,
          price: this.item.price,
          status_tech: 'Rejected',
          photos: JSON.stringify(this.item.photos),
          step: 1,
          remark_tech: this.item.remark_tech
        }

        if (this.item.height_tech == null || this.item.width_tech == null) {

          const Toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          })

          Toast.fire({
            icon: 'error',
            title: 'Tech Height & Width cannot be empty when rejecting.'
          })

        } else {

          Swal.fire({
            title: 'Reject Item',
            text: 'Reject order of "' + this.item.location + '". Are you sure?',
            icon: 'error',
            heightAuto: false,
            showConfirmButton: true,
            showCancelButton: true,
            reverseButtons: true,
            confirmButtonText: 'Reject',
            cancelButtonText: 'Cancel',
            cancelButtonColor: '#d33',
          }).then((y) => {
            if (y.isConfirmed) {
              this.http.post('https://6dbe-175-140-151-140.ap.ngrok.io/updateorders', temp).subscribe(a => {
                this.model.dismiss(1)
              })
            }
          })
        }

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
      this.item.pleat = this.BlindsChoice

      console.log(this.item);

      if (['location', 'width', 'height', 'type', 'pleat', 'pieces', 'bracket', 'hook', 'belt', 'others'].every(a => this.item[a])) {

        console.log('pass2');
        this.item.price = this.price

        let temp = {
          no: this.item.no,
          // location: this.item.location,
          height: this.item.height,
          width: this.item.width,
          height_tech: this.item.height_tech,
          width_tech: this.item.width_tech,
          // track: this.item.track,
          // type: this.item.type,
          // pleat: this.item.pleat,
          // fullness: this.item.fullness,
          // pieces: this.item.pieces,
          // bracket: this.item.bracket,
          // hook: this.item.hook,
          // sidehook: this.item.sidehook,
          // belt: this.item.belt,
          // fabric: this.item.fabric,
          // others: this.item.others,
          // touchfloor: this.item.touchfloor,
          price: this.item.price,
          status_tech: 'Rejected',
          photos: JSON.stringify(this.item.photos),
          step: 1,
          remark_tech: this.item.remark_tech
        }

        Swal.fire({
          title: 'Reject Item',
          text: 'Reject order of "' + this.item.location + '". Are you sure?',
          icon: 'error',
          heightAuto: false,
          showConfirmButton: true,
          showCancelButton: true,
          reverseButtons: true,
          confirmButtonText: 'Reject',
          cancelButtonText: 'Cancel',
          cancelButtonColor: '#d33',
        }).then((y) => {
          if (y.isConfirmed) {
            this.http.post('https://6dbe-175-140-151-140.ap.ngrok.io/updateorders', temp).subscribe(a => {
              this.model.dismiss(1)
            })
          }
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

  calcPrice(pass) {

    let width = 0
    let height = 0
    if (this.item.height_tech != null || this.item.height_tech != '' || this.item.width_tech != null || this.item.width_tech != '') {
      width = this.item.width_tech
      height = this.item.height_tech
    } else {
      width = this.item.width
      height = this.item.height
    }

    // this.item.curtain

    let curtain = false as any
    let curtain_id
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

      pleat_id = this.pleatlist.filter(x => x.name == this.item.pleat)[0]['id']

      console.log(curtain_id, sheer_id, track_id, pleat_id);

    } else {
      curtain = false
      sheer = false
      track = false

      pleat_id = this.pleatlist.filter(x => x.name == this.item.pleat)[0]['id']
    }
    let temp = {
      width: width, height: height, curtain: curtain,lining: false, lining_id: 41,
      curtain_id: curtain_id, sheer: sheer, sheer_id: sheer_id, track: track, track_id: track_id, pleat_id: pleat_id
    }

    console.log(temp);

    this.http.post('https://6dbe-175-140-151-140.ap.ngrok.io/calcPrice', temp).subscribe(a => {

      console.log(a);

      this.price = <any>Object.values(a['data'] || []).reduce((x:number,y:number)=>(x + (y['total'] || 0)) , 0) + 25

      if (pass) {
        this.updateItem()
      }
    })


  }
  back() {
    this.model.dismiss()
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


