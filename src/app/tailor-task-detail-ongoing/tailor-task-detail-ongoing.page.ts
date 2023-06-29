import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { SelectorPage } from '../selector/selector.page';

@Component({
  selector: 'app-tailor-task-detail-ongoing',
  templateUrl: './tailor-task-detail-ongoing.page.html',
  styleUrls: ['./tailor-task-detail-ongoing.page.scss'],
})
export class TailorTaskDetailOngoingPage implements OnInit {

  constructor(
    private nav: NavController,
    private actroute: ActivatedRoute,
    private model: ModalController,
    private modalcontroller: ModalController,
    private http: HttpClient,
  ) { }

  item = [] as any
  info = []

  pleatlist = []
  misclist = []
  bracketlist = []
  hooklist = []
  hooklistadjust = []
  beltlist = []
  otherslist = []

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

    this.actroute.queryParams.subscribe(a => {
      console.log(a);

      this.item = JSON.parse(a["info"])
      this.pleatlist = JSON.parse(a["pleatlist"])
    })

    console.log(this.info, this.pleatlist);
    // this.item = this.navparam.get('item')
    // this.pleatlist = this.navparam.get('pleatlist')
    // console.log(this.item, this.pleatlist);

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

    this.http.get('https://curtain.vsnap.my/miscList').subscribe((s) => {
      this.misclist = s['data'].filter(a => a.status)
      console.log(this.misclist)

      for (let i = 0; i < this.misclist.length; i++) {
        // if (this.misclist['type'] == "Pieces") {
        // } 
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
    console.log(x)
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

  updateItem() {
    this.calcPrice()
    this.item.pleat = this.PleatChoice
    if (this.item['type'] == 'Tailor-Made Curtains' || this.item['type'] == 'Motorised Curtains') {
      console.log('in 1st');
      console.log(this.item);

      console.log('pass1');
      this.item.price = this.price

      let temp = {
        no: this.item.no,
        remark_tail: this.item.remark_tail,
        status_tail: 'Completed',
        step: 4,
      }

      Swal.fire({
        title: 'Complete Task',
        text: 'Are you sure to submit task?',
        heightAuto: false,
        icon: 'success',
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Submit',
        reverseButtons: true,
      }).then((y) => {
        if (y.isConfirmed) {
          this.http.post('https://curtain.vsnap.my/updateorders', temp).subscribe(a => {
            Swal.fire({
              title: 'Task Submitted Successfully',
              icon: 'success',
              heightAuto: false,
              showConfirmButton: false,
              showCancelButton: false,
              timer: 1500,
            })

            this.nav.navigateRoot('/tabs/tab1')
          })
        }
      })

    } else if (this.item['type'] == 'Blinds') {
      this.item.pleat = this.BlindsChoice

      console.log(this.item);

      console.log('pass2');
      this.item.price = this.price

      let temp = {
        no: this.item.no,
        remark_tail: this.item.remark_tail,
        status_tail: 'Completed',
        step: 4,
      }

      Swal.fire({
        title: 'Complete Task',
        text: 'Are you sure to submit task?',
        heightAuto: false,
        icon: 'success',
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Submit',
        reverseButtons: true,
      }).then((y) => {
        if (y.isConfirmed) {
          this.http.post('https://curtain.vsnap.my/updateorders', temp).subscribe(a => {
            Swal.fire({
              title: 'Task Submitted Successfully',
              icon: 'success',
              heightAuto: false,
              showConfirmButton: false,
              showCancelButton: false,
              timer: 1500,
            })

            this.nav.navigateRoot('/tabs/tab1')
          })
        }
      })

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
    this.nav.pop()
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


