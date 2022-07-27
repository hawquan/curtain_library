import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import * as EXIF from 'exif-js';
import Swal from 'sweetalert2';
import { SelectorPage } from '../selector/selector.page';

@Component({
  selector: 'app-task-creator',
  templateUrl: './task-creator.page.html',
  styleUrls: ['./task-creator.page.scss'],
})
export class TaskCreatorPage implements OnInit {

  constructor(
    private nav: NavController,
    private actroute: ActivatedRoute,
    private model: ModalController,
    private modalcontroller: ModalController,
    private http: HttpClient,
    private navparam: NavParams,
  ) { }

  item = { photos: [] as any } as any;
  info = []
  sales_no = 0
  position = ""

  pleatlist = []
  blindlist = []
  tracklist = []
  misclist = []
  bracketlist = []
  hooklist = []
  beltlist = []
  fabriclist = []
  fabricCurtain = []
  fabricSheer = []
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


  ngOnInit() {

    this.sales_no = this.navparam.get('sales_no')
    this.pleatlist = this.navparam.get('pleatlist')
    this.blindlist = this.navparam.get('blindlist')
    this.position = this.navparam.get('position')
    this.tracklist = this.navparam.get('tracklist')
    this.fabriclist = this.navparam.get('fabriclist')

    this.fabricCurtain = this.fabriclist.filter(x => x.type == 'Curtain')
    this.fabricSheer = this.fabriclist.filter(x => x.type == 'Sheer')

    console.log(this.sales_no, this.pleatlist, this.blindlist, this.position, this.tracklist, this.fabriclist);

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

    // this.http.get('https://6dbe-175-140-151-140.ap.ngrok.io/fabricList').subscribe((s) => {
    //   let temp = s['data']

    //   this.fabricCurtain = temp.filter(x => x.type == 'Curtain')
    //   this.fabricSheer = temp.filter(x => x.type == 'Sheer')

    //   console.log(this.fabricCurtain, this.fabricSheer)
    // })

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
    this.PleatChoice = x.name
    this.item.fullness = x.fullness
  }

  pleatChoice() {
    return this.PleatChoice
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

  async selector(x, y) {
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

  // CurtainName =''
  // SheerName =''

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

  addItem() {

    this.item.pleat = this.PleatChoice

    if (this.item['type'] == 'Tailor-Made Curtains' || this.item['type'] == 'Motorised Curtains') {
      console.log('in 1st');
      console.log(this.item);

      if (['location', 'width', 'height', 'track', 'type', 'pleat', 'pieces', 'bracket', 'hook', 'sidehook', 'belt', 'others', 'touchfloor'].every(a => this.item[a])) {

        console.log('add curtain');

        let temp = {
          sales_id: this.sales_no,
          location: this.item.location,
          height: this.item.height,
          width: this.item.width,
          track: this.item.track,
          type: this.item.type,
          pleat: this.PleatChoice,
          fullness: this.item.fullness,
          pieces: this.item.pieces,
          bracket: this.item.bracket,
          hook: this.item.hook,
          sidehook: this.item.sidehook,
          belt: this.item.belt,
          fabric: this.item.fabric,
          fabric_sheer: this.item.fabric_sheer,
          others: this.item.others,
          touchfloor: this.item.touchfloor,
          price: this.price,
          status: true,
          photos: JSON.stringify(this.item.photos),
          remark_sale: this.item.remark_sale,
          status_tech: 'Pending',
          step: 2,
        }

        console.log(temp);

        Swal.fire({
          title: 'Create Order',
          text: 'Create this new order?',
          heightAuto: false,
          icon: 'success',
          showConfirmButton: true,
          showCancelButton: true,
          cancelButtonText: 'Cancel',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, Create',
          reverseButtons: true,
        }).then((y) => {
          if (y.isConfirmed) {
            this.http.post('https://6dbe-175-140-151-140.ap.ngrok.io/insertorders', temp).subscribe(a => {
              console.log('insert orders success');
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

        console.log('add blinds');

        let temp = {
          sales_id: this.sales_no,
          location: this.item.location,
          height: this.item.height,
          width: this.item.width,
          type: this.item.type,
          pleat: this.item.pleat,
          pieces: this.item.pieces,
          bracket: this.item.bracket,
          hook: this.item.hook,
          belt: this.item.belt,
          // fabric: this.item.fabric,
          // fabric_sheer: this.item.fabric_sheer,
          others: this.item.others,
          price: this.price,
          status: true,
          photos: JSON.stringify(this.item.photos),
          remark_sale: this.item.remark_sale,
          status_tech: 'Pending',
          step: 2,
        }

        console.log(temp);

        Swal.fire({
          title: 'Create Order',
          text: 'Create this new order?',
          heightAuto: false,
          icon: 'success',
          showConfirmButton: true,
          showCancelButton: true,
          cancelButtonText: 'Cancel',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, Create',
          reverseButtons: true,
        }).then((y) => {
          if (y.isConfirmed) {
            this.http.post('https://6dbe-175-140-151-140.ap.ngrok.io/insertorders', temp).subscribe(a => {
              console.log('insert orders success');
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

        console.log('add wallpaper');
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

  addItemTech() {

    this.item.pleat = this.PleatChoice
    if (this.item['type'] == 'Tailor-Made Curtains' || this.item['type'] == 'Motorised Curtains') {
      console.log('in 1st');
      console.log(this.item);

      if (['location', 'width', 'height', 'track', 'type', 'pleat', 'pieces', 'bracket', 'hook', 'sidehook', 'belt', 'fabric', 'others', 'touchfloor'].every(a => this.item[a])) {

        console.log('add curtain');

        let temp = {
          sales_id: this.sales_no,
          location: this.item.location,
          height: this.item.height,
          width: this.item.width,
          track: this.item.track,
          type: this.item.type,
          pleat: this.PleatChoice,
          fullness: this.item.fullness,
          pieces: this.item.pieces,
          bracket: this.item.bracket,
          hook: this.item.hook,
          sidehook: this.item.sidehook,
          belt: this.item.belt,
          fabric: this.item.fabric,
          fabric_sheer: this.item.fabric_sheer,
          others: this.item.others,
          touchfloor: this.item.touchfloor,
          price: this.price,
          status: true,
          photos: JSON.stringify(this.item.photos),
          remark_sale: '- ITEM ADDED BY TECHNICIAN -',
          remark_tech: this.item.remark_tech,
          status_tech: 'Pending',
          step: 2,
        }

        console.log(temp);

        // Swal.fire({
        //   title: '',
        // })

        this.http.post('https://6dbe-175-140-151-140.ap.ngrok.io/insertorders', temp).subscribe(a => {
          console.log('insert orders success');
          this.model.dismiss(1)

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

        console.log('add blinds');
        this.item.price = this.price

        let temp = {
          sales_id: this.sales_no,
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
          photos: JSON.stringify(this.item.photos),
          remark_sale: '- ITEM ADDED BY TECHNICIAN -',
          remark_tech: this.item.remark_tech,
          status_tech: 'Pending',
          step: 2,
        }

        console.log(temp);

        // Swal.fire({
        //   title: '',
        // })

        this.http.post('https://6dbe-175-140-151-140.ap.ngrok.io/insertorders', temp).subscribe(a => {
          console.log('insert orders success');
          this.model.dismiss(1)

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

        console.log('add wallpaper');
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

  calcPrice(x) {

    this.item.curtain

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

      pleat_id = this.pleatlist.filter(x => x.name == this.PleatChoice)[0]['id']

      console.log(curtain_id, sheer_id, track_id, pleat_id);

    } else {
      curtain = false
      sheer = false
      track = false

      pleat_id = this.pleatlist.filter(x => x.name == this.item.pleat)[0]['id']
    }

    let temp = {
      width: this.item.width, height: this.item.height, curtain: curtain, lining: false, lining_id: 41,
      curtain_id: curtain_id, sheer: sheer, sheer_id: sheer_id, track: track, track_id: track_id, pleat_id: pleat_id
    }

    console.log(temp);

    this.http.post('https://6dbe-175-140-151-140.ap.ngrok.io/calcPrice', temp).subscribe(a => {

      console.log(a);

      this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + 25

      if (x == 'sales') {
        this.addItem()
      }  else if (x == 'tech') {
        this.addItemTech()
      }

    })

  }


  back() {
    this.model.dismiss()
  }

  // uploadImg(base64img) {    
  //   return new Promise((res, rej) => {
  //     this.http.post('https://forcar.vsnap.my/upload', { image: base64img, folder: 'goalgame', userid: Date.now() }).subscribe((link) => {
  //       console.log(link);

  //       // this.bento.swalclose()
  //       res(link['imageURL'])
  //     }, e => {
  //       rej({ failed: "Failed" })
  //     })
  //   })

  // }

  // fileChange(event, name, maxsize) {
  //   if (event.target.files && event.target.files[0] && event.target.files[0].size < (10485768)) {
  //     // eval(name + '="https://i.pinimg.com/originals/a2/dc/96/a2dc9668f2cf170fe3efeb263128b0e7.gif"');
  //     let imagectype = event.target.files[0].type;
  //     EXIF.getData(event.target.files[0], () => {

  //       var orientation = EXIF.getTag(this, "Orientation");
  //       var can = document.createElement('canvas');
  //       var ctx = can.getContext('2d');
  //       var thisImage = new Image;

  //       var maxW = maxsize;
  //       var maxH = maxsize;
  //       thisImage.onload = (a) => {

  //         console.log(a)
  //         var iw = thisImage.width;
  //         var ih = thisImage.height;
  //         var scale = Math.min((maxW / iw), (maxH / ih));
  //         var iwScaled = iw * scale;
  //         var ihScaled = ih * scale;
  //         can.width = iwScaled;
  //         can.height = ihScaled;
  //         // ctx.save();
  //         var width = can.width; var styleWidth = can.style.width;
  //         var height = can.height; var styleHeight = can.style.height;

  //         // if (event.target.files[0] && event.target.files[0].exifdata.Orientation) {
  //         //   console.log(event.target.files[0].exifdata.Orientation)
  //         //   if (event.target.files[0].exifdata.Orientation > 4) {
  //         //     can.width = height; can.style.width = styleHeight;
  //         //     can.height = width; can.style.height = styleWidth;
  //         //   }
  //         //   switch (event.target.files[0].exifdata.Orientation) {
  //         //     case 2: ctx.translate(width, 0); ctx.scale(-1, 1); break;
  //         //     case 3: ctx.translate(width, height); ctx.rotate(Math.PI); break;
  //         //     case 4: ctx.translate(0, height); ctx.scale(1, -1); break;
  //         //     case 5: ctx.rotate(0.5 * Math.PI); ctx.scale(1, -1); break;
  //         //     case 6: ctx.rotate(0.5 * Math.PI); ctx.translate(0, -height); break;
  //         //     case 7: ctx.rotate(0.5 * Math.PI); ctx.translate(width, -height); ctx.scale(-1, 1); break;
  //         //     case 8: ctx.rotate(-0.5 * Math.PI); ctx.translate(-width, 0); break;
  //         //   }
  //         // }

  //         ctx.drawImage(thisImage, 0, 0, iwScaled, ihScaled);
  //         // ctx.restore();

  //         let imagec = can.toDataURL();

  //         let imgggg = imagec.replace(';base64,', "thisisathingtoreplace;")
  //         let imgarr = imgggg.split("thisisathingtoreplace;")
  //         let base64img = imgarr[1]
  //         event.target.value = ''
  //         this.uploadImg(base64img).then((a: string) => {

  //           if (this.lengthof(this.item['photos']) > 0) {
  //             this.item['photos'].push(a)
  //           } else {
  //             this.item['photos'] = []
  //             this.item['photos'].push(a)
  //           }
  //         })
  //       }
  //       thisImage.src = URL.createObjectURL(event.target.files[0]);
  //       // eval('this.'+el+'.nativeElement.value = null;')
  //     });
  //   } else {
  //     alert("Your Current Image Too Large, " + event.target.files[0].size / (10241024) + "MB! (Please choose file lesser than 8MB)")
  //   }
  // }

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
