import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { SelectorPage } from '../selector/selector.page';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

@Component({
  selector: 'app-task-ongoing-view-alacarte',
  templateUrl: './task-ongoing-view-alacarte.page.html',
  styleUrls: ['./task-ongoing-view-alacarte.page.scss'],
})
export class TaskOngoingViewAlacartePage implements OnInit {

  item = [] as any
  info = []
  sales_no = 0
  position = ""

  misclist = []
  bracketlist = []
  hooklist = []
  hooklistadjust = []
  beltlist = []
  otherslist = []
  pieceslist = []
  fabricCurtain = []
  fabricSheer = []
  fabricLining = []
  wallpaperList = []
  accessoryList = []

  BlindsChoice = ''

  PlainWall = false
  FabricWall = false
  NonWovenWall = false
  PatternWall = false
  VinylWall = false
  WallpaperChoice = ''

  price: any = 0
  hookview = true
  show = false
  showCurtain = false
  showSheer = false
  curtainswitch = 'Expand'
  xcurtainswitch = 'Collapse'
  sheerswitch = 'Expand'
  xsheerswitch = 'Collapse'
  fabricType = ''

  constructor(
    private model: ModalController,
    private modalcontroller: ModalController,
    private http: HttpClient,
    private navparam: NavParams,
    private camera: Camera,
  ) { }

  ngOnInit() {
    this.item = this.navparam.get('item')
    this.position = this.navparam.get('position')
    console.log(this.item, this.position);

    this.price = this.item.price
    this.pleatSelection()

    if (this.item.type == 3) {

      this.http.get('https://curtain.vsnap.my/accessoryListApp').subscribe(s => {

        this.accessoryList = s['data'].map(accessory => {
          const matchingItem = this.item.accessories.find(itemAccessory => itemAccessory.id === accessory.id);
          if (matchingItem) {
            // If a matching item is found, add acce_selected and acce_quantity to the existing item
            matchingItem.acce_selected = matchingItem.acce_selected || accessory.acce_selection[0]; // Set a default value if acce_selected is not present
            matchingItem.acce_quantity = matchingItem.acce_quantity || 1; // Set a default value if acce_quantity is not present
            return matchingItem;
          } else {
            // If no matching item is found, add acce_selected and acce_quantity to the accessory item
            accessory.acce_selected = { name: null, price: null }; // Set a default value
            accessory.acce_quantity = null; // Set a default value
            return accessory;
          }
        });

        console.log('Accessories', this.accessoryList);

      })
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
        } else if (this.misclist[i]['type'] == "Pieces") {
          this.pieceslist.push(this.misclist[i])
        }
      }
      this.checkFabric()

      // console.log(this.bracketlist, this.hooklist, this.beltlist, this.otherslist);

    })

    this.http.post('https://curtain.vsnap.my/getonesales', { no: this.sales_no }).subscribe(a => {
      this.info = a['data'][0]
      console.log('info', this.info);
    })

    this.http.get('https://curtain.vsnap.my/wallpaperList').subscribe(a => {
      this.wallpaperList = a['data']
      console.log(this.wallpaperList);
    })
  }

  typeChanged() {
    this.item.pleat = ''

    this.PlainWall = false
    this.FabricWall = false
    this.NonWovenWall = false
    this.PatternWall = false
    this.VinylWall = false
    this.WallpaperChoice = ''
  }

  pleatSelection() {
    if (this.item.pleat == 'Eyelet Design' || this.item.pleat == 'Ripplefold') {
      this.hookview = false
      this.item.hook = ''
    } else {
      this.hookview = true
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

  calcPrice() {
    return this.price = this.item.width + this.item.height || 0
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