import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import Swal from 'sweetalert2';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { SignaturePage } from '../signature/signature.page';

@Component({
  selector: 'app-po-detail-update',
  templateUrl: './po-detail-update.page.html',
  styleUrls: ['./po-detail-update.page.scss'],
})
export class PoDetailUpdatePage implements OnInit {


  constructor(
    private nav: NavController,
    private actroute: ActivatedRoute,
    private model: ModalController,
    private modalcontroller: ModalController,
    private navparam: NavParams,
    private http: HttpClient,
    private camera: Camera,
  ) { }

  loading = false
  sales_id
  fabric
  target
  poData
  pic = ''

  groupedCurtainItems
  groupedLiningItems
  groupedSheerItems
  groupedBlind
  groupedMechanismItems
  product

  updateList
  rejectList

  signStatus = false

  ngOnInit() {

    this.sales_id = this.navparam.get('sales_id')
    this.fabric = this.navparam.get('fabric')
    this.target = this.navparam.get('target')


    this.http.get('https://curtain.vsnap.my/getallpurchasestatus').subscribe(s => {

      this.updateList = s['data'].filter(a => a.type == 'update')
      this.rejectList = s['data'].filter(a => a.type == 'reject')

      console.log(this.updateList, this.rejectList);

    })

    this.http.post('https://curtain.vsnap.my/getpurchase', { sales_id: this.sales_id }).subscribe(s => {
      this.poData = s['data'][0]

      if (this.fabric == 'curtain') {
        this.product = this.poData.po_curtain
      } else if (this.fabric == 'lining') {
        this.product = this.poData.po_lining
      } else if (this.fabric == 'sheer') {
        this.product = this.poData.po_sheer
      } else if (this.fabric == 'blind') {
        this.product = this.poData.po_blind
      } else if (this.fabric == 'mechanism') {
        this.product = this.poData.po_mechanism
      }

      this.loading = true
      console.log(this.poData, this.product);

    })

  }

  poStatus(x) {
    this.product[this.target].po_status_no = x.no
    this.product[this.target].po_status_text = x.name
  }

  async customersign() {
    const modal = await this.model.create({
      cssClass: 'signaturemodal',
      component: SignaturePage,
      componentProps: { uid: 1, }
    })

    await modal.present()

    modal.onDidDismiss().then(a => {
      if (a['data']) {
        this.product[this.target].po_signature = a['data']
      }
    })

  }

  reject() {

    let temp = this.getTemp()

    Swal.fire({
      title: 'Reject Order',
      text: "Do you want to 'REJECT' this purchase order ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Reject',
      heightAuto: false,
      reverseButtons: true,
    }).then((result) => {

      if (result.isConfirmed) {

        Swal.fire({
          title: 'Processing',
          text: 'please wait...',
          showCancelButton: false, // There won't be any cancel button
          showConfirmButton: false,

        })

        this.http.post('https://curtain.vsnap.my/updatepurchase', temp).subscribe(a => {

          Swal.fire({
            icon: 'success',
            title: 'Update Successfully',
            text: 'User\'s profile has been updated',
            timer: 3000

          })

          this.model.dismiss(1)

        },
          err => (console.log(err),

            Swal.fire({
              icon: 'error',
              title: 'Update Fail',
              text: 'Please try again later',
              timer: 3000

            })

          )
        )
      }
    });

  }

  updateOrder() {

    console.log(this.product[this.target]);

    let temp = this.getTemp()
    let text
    let buttonText

    if (!('po_signature' in this.product[this.target])) {

      const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      })

      Toast.fire({
        icon: 'error',
        title: 'Signature is required.'
      })

      return;
    }

    // if (this.product[this.target].po_signature) {
    //   return;
    // }

    if (this.product[this.target].po_status == '1') {
      text = `Are you sure to update this order ?`
      buttonText = `Update`
    } else if (this.product[this.target].po_status == '2') {
      text = `Do you want to 'REJECT' this order ?`
      buttonText = `Reject`
    }

    Swal.fire({
      title: 'Update Order',
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: buttonText,
      heightAuto: false,
      reverseButtons: true,
    }).then(async (result) => {

      if (result.isConfirmed) {

        Swal.fire({
          title: 'Processing',
          text: 'please wait...',
          showCancelButton: false, // There won't be any cancel button
          showConfirmButton: false,
          heightAuto: false,

        })

        this.http.post('https://curtain.vsnap.my/updatepurchase', temp).subscribe(a => {

          Swal.fire({
            icon: 'success',
            title: 'Update Successfully',
            text: 'User\'s profile has been updated',
            heightAuto: false,
            timer: 3000

          })

          this.model.dismiss(1)

        },
          err => (console.log(err),

            Swal.fire({
              icon: 'error',
              title: 'Update Fail',
              text: 'Please try again later',
              heightAuto: false,
              timer: 3000

            })

          )
        )
      }
    });

  }

  getTemp() {
    let temp

    if (this.fabric == 'curtain') {
      temp = {
        no: this.poData.no,
        po_curtain: JSON.stringify(this.product)
      }
    } else if (this.fabric == 'lining') {
      temp = {
        no: this.poData.no,
        po_lining: JSON.stringify(this.product)
      }
    } else if (this.fabric == 'sheer') {
      temp = {
        no: this.poData.no,
        po_sheer: JSON.stringify(this.product)
      }

    } else if (this.fabric == 'blind') {
      temp = {
        no: this.poData.no,
        po_blind: JSON.stringify(this.product)
      }
    } else if (this.fabric == 'mechanism') {
      temp = {
        no: this.poData.no,
        po_mechanism: JSON.stringify(this.product)
      }
    }

    return temp
  }

  back() {
    this.model.dismiss(1)
  }

  lengthof(x) {
    return x ? x.length : 0
  }

  openPic(x) {
    this.pic = x
  }

  closePic(x) {
    this.pic = ''
  }

  deletePic(x) {
    this.product[this.target].img.splice(x, 1)
    // console.log(this.item.photos);
  }

  opencamera() {
    const options: CameraOptions = {
      quality: 55,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.product[this.target]['img'].push('https://i.pinimg.com/originals/a2/dc/96/a2dc9668f2cf170fe3efeb263128b0e7.gif');

      let base64Image = 'data:image/jpeg;base64,' + imageData;

      this.http.post('https://forcar.vsnap.my/upload', { image: base64Image, folder: 'goalgame', userid: Date.now() }).subscribe((link) => {
        console.log(link['imageURL']);
        this.product[this.target]['img'][this.lengthof(this.product[this.target]['img']) - 1] = link['imageURL']
        console.log(this.product[this.target]['img']);

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
    if (event.target.files && event.target.files[0]) {

      Swal.fire({
        title: 'processing...',
        icon: 'info',
        heightAuto: false,
        allowOutsideClick: false,
        showConfirmButton: false,
        timer: 2000
      })

      // this.imagectype = event.target.files[0].type;
      // EXIF.getData(event.target.files[0], () => {
      // console.log(event.target.files[0]);
      //  console.log(event.target.files[0].exifdata.Orientation);
      //  const orientation = EXIF.getTag(this, 'Orientation');
      const can = document.createElement('canvas');
      const ctx = can.getContext('2d');
      const thisImage = new Image;

      // const maxW = maxsize;
      // const maxH = maxsize;
      thisImage.onload = (a) => {
        // console.log(a);
        const iw = thisImage.width;
        const ih = thisImage.height;
        // const scale = Math.min((maxW / iw), (maxH / ih));
        can.width = iw;
        can.height = ih;
        ctx.save();
        // const width = can.width; const styleWidth = can.style.width;
        // const height = can.height; const styleHeight = can.style.height;
        // console.log(event.target.files[0]);
        ctx.drawImage(thisImage, 0, 0, iw, ih);
        let quality = 0.85; // Start with high quality
        this.imagec = can.toDataURL('image/jpeg', quality);
        // const imgggg = this.imagec.replace(';base64,', 'thisisathingtoreplace;');
        // const imgarr = imgggg.split('thisisathingtoreplace;');
        // this.base64img = imgarr[1];
        // event.target.value = '';
        this.product[this.target]['img'].push('https://i.pinimg.com/originals/a2/dc/96/a2dc9668f2cf170fe3efeb263128b0e7.gif');

        this.http.post('https://forcar.vsnap.my/upload', { image: this.imagec, folder: 'goalgame', userid: Date.now() }).subscribe((link) => {
          console.log(link['imageURL']);
          this.product[this.target]['img'][this.lengthof(this.product[this.target]['img']) - 1] = link['imageURL']
          console.log(this.product[this.target]['img']);

        });
      };
      thisImage.src = URL.createObjectURL(event.target.files[0]);

    } else {
      // S.close();
      alert('Your Current Image Too Large, ' + event.target.files[0].size / (10241024) + 'MB! (Please choose file lesser than 8MB)');
    }
  }

}
