import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, AlertController, Platform } from '@ionic/angular';
import Swal from 'sweetalert2';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-add-sales',
  templateUrl: './add-sales.page.html',
  styleUrls: ['./add-sales.page.scss'],
})
export class AddSalesPage implements OnInit {

  constructor(private modal: ModalController,
    private http: HttpClient,
    private navparam: NavParams,
    private datepipe: DatePipe,
    private alertcontroller: AlertController,
    private platform: Platform) { }

  id = ''
  // user = { photo: 'https://vsnap-photo-server.s3.ap-southeast-1.amazonaws.com/hockwong/5KLVpP3MdneiM1kgcHR26LGFSW52l2k5ahbao' }

  tab = 0

  date = ''

  sales = [] as any
  keyword = ''
  id_sales = null
  keyword2 = ''
  id_tech = ''
  staffList = []
  techList = []
  saleList = []
  feeList = []
  sales_name = ''
  tech_name = ''

  keywordPro = ''
  keywordSales = ''
  propertyList = ['Apartment', 'Bungalow', 'Condominium', 'Semi-D', 'Terrace', 'Others']
  // propertyList = ['Bungalow', 'Condominium', 'Semi-D', 'Others'].sort((a: any, b: any) => (a > b ? 1 : -1))
  showSelection = false
  selectionSales = false

  ngOnInit() {
    this.http.get('https://curtain.vsnap.my/staffList').subscribe(a => {
      this.staffList = a['data']
      console.log(this.staffList);
      this.techList = Object.values(this.staffList).filter(a => a['position'] == 'Technician')
      this.saleList = Object.values(this.staffList).filter(a => a['position'] == 'Sales')
    })

    this.http.get('https://curtain.vsnap.my/feeList').subscribe(a => {
      this.feeList = a['data']
      console.log(this.feeList);
    })

  }

  selectedId(x) {
    this.id_sales = x.id
    this.sales_name = x.name
    this.keyword = ''
  }

  selectedId2(x) {
    this.id_tech = x.id
    this.tech_name = x.name

    this.keyword2 = ''
  }


  focus(x) {
    if (x) {
      this.showSelection = true
    } else {
      setTimeout(() => {
        this.showSelection = false
      }, 150);
    }
  }

  selectedArea(x) {
    this.keywordPro = x
    this.sales.customer_property = this.keywordPro
  }

  filtererPro(x) {
    return x ? x.filter(a => (((a || '')).toLowerCase()).includes(this.keywordPro.toLowerCase())) : []
  }

  focus2(x) {
    if (x) {
      this.selectionSales = true
    } else {
      setTimeout(() => {
        this.selectionSales = false
      }, 150);
    }
  }

  close() {
    this.modal.dismiss()
  }

  filterer(x) {
    return x ? x.filter(a => (((a.name || '')).toLowerCase()).includes(this.keyword.toLowerCase())) : []
  }

  imgurheaders = new HttpHeaders({
    'Authorization': 'Client-ID 2dc0beb00bb3279'
    // f425e102d31b175576a219bc7d3ba8ad82d85364
    // CHANGE TO YOUR OWN ID
  });

  imagec = ''

  // imgur(event, maxsize) {

  //   return new Promise((resolve, reject) => {
  //     if (event.target.files && event.target.files[0] && event.target.files[0].size < (10485768)) {
  //       let imagectype = event.target.files[0].type;
  //       EXIF.getData(event.target.files[0], () => {
  //         console.log(event.target.files[0])
  //         console.log(event.target.files[0].exifdata.Orientation);
  //         var orientation = EXIF.getTag(this, "Orientation");
  //         var can = document.createElement('canvas');
  //         var ctx = can.getContext('2d');
  //         var thisImage = new Image;

  //         var maxW = maxsize;
  //         var maxH = maxsize;
  //         thisImage.onload = (a) => {

  //           console.log(a)
  //           var iw = thisImage.width;
  //           var ih = thisImage.height;
  //           var scale = Math.min((maxW / iw), (maxH / ih));
  //           var iwScaled = iw * scale;
  //           var ihScaled = ih * scale;
  //           can.width = iwScaled;
  //           can.height = ihScaled;
  //           ctx.save();
  //           var width = can.width; var styleWidth = can.style.width;
  //           var height = can.height; var styleHeight = can.style.height;
  //           console.log(event.target.files[0])
  //           if (event.target.files[0] && event.target.files[0].exifdata.Orientation) {
  //             console.log(event.target.files[0].exifdata.Orientation)
  //             if (event.target.files[0].exifdata.Orientation > 4) {
  //               can.width = height; can.style.width = styleHeight;
  //               can.height = width; can.style.height = styleWidth;
  //             }
  //             switch (event.target.files[0].exifdata.Orientation) {
  //               case 2: ctx.translate(width, 0); ctx.scale(-1, 1); break;
  //               case 3: ctx.translate(width, height); ctx.rotate(Math.PI); break;
  //               case 4: ctx.translate(0, height); ctx.scale(1, -1); break;
  //               case 5: ctx.rotate(0.5 * Math.PI); ctx.scale(1, -1); break;
  //               case 6: ctx.rotate(0.5 * Math.PI); ctx.translate(0, -height); break;
  //               case 7: ctx.rotate(0.5 * Math.PI); ctx.translate(width, -height); ctx.scale(-1, 1); break;
  //               case 8: ctx.rotate(-0.5 * Math.PI); ctx.translate(-width, 0); break;
  //             }
  //           }

  //           ctx.drawImage(thisImage, 0, 0, iwScaled, ihScaled);
  //           ctx.restore();

  //           let imagec = can.toDataURL();
  //           // this.worker['photo'] = imagec;
  //           let imgggg = imagec.replace(';base64,', "thisisathingtoreplace;")
  //           let imgarr = imgggg.split("thisisathingtoreplace;")
  //           let base64img = imgarr[1]
  //           event.target.value = ''

  //           this.http.post('https://img.vsnap.my/upload', { image: this.imagec, folder: 'hockwong', userid: '2g0vK4v8pGV2pyc8jaAKrKuSQyr1' }).subscribe((link) => {
  //             // this.bento.swalclose()

  //             console.log(link['imageURL'])
  //             this.user['photo'] = link['imageURL']

  //           })

  //           // this.http.post('https://img.vsnap.my/upload', { image: this.imagec, folder: 'vsing', userid: 'gK2nkvzGDgYpY8A7irPDCWk1SvA2' }).subscribe((link) => {
  //           //   // this.bento.swalclose()

  //           //   console.log(link['imageURL'])
  //           //   this.user['photo'] = link['imageURL']

  //           // })

  //         }
  //         thisImage.src = URL.createObjectURL(event.target.files[0]);
  //         // eval('this.'+el+'.nativeElement.value = null;')
  //       });
  //     } else {
  //       reject("Your Current Image Too Large, " + event.target.files[0].size / (10241024) + "MB! (Please choose file lesser than 8MB)")
  //     }
  //   })


  // }

  // fileChange(x, y, z) {
  //   this.imgur(x, y).then(a => {
  //     eval(z + "=a")
  //   })
  // }

  async changedob() {
    const alert = await this.alertcontroller.create({
      cssClass: 'my-custom-class',
      header: 'Enter your birthday',
      inputs: [
        {
          name: 'date',
          type: 'date',
          max: this.datepipe.transform(new Date().getTime(), 'yyyy-MM-dd')
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (a) => {
            // console.log('Confirm Ok');

            this.date = a['date']

          }
        }
      ]
    });

    await alert.present();
  }

  numberOnlyValidation(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  condis(x) {
    if (((x || '').toString()).substring(0, 1) == '+') {
      return x.substring(1, x.length)
    } else if (((x || '').toString()).substring(0, 1) == '6') {
      return x
    } else if (((x || '').toString()).substring(0, 1) == '0') {
      return '6' + x
    } else {
      return '60' + x
    }
  }

  emailValidator(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email) {
      return re.test(String(email).toLowerCase());
    }
  }

  update() {
    this.sales.customer_property = this.keywordPro

    if (!this.sales['customer_name']) {

      Swal.fire({
        icon: 'error',
        title: 'Missing Info',
        text: 'Customer name is missing',
        heightAuto: false,
        timer: 3000,
      })

    }
    //  else if (!this.sales['customer_email']) {

    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Error',
    //     text: 'Customer email is missing',
    //     timer: 3000,
    //     heightAuto: false,

    //   })

    // } 
    // else if (!this.emailValidator(this.sales.customer_email)) {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Error',
    //     text: 'Email is invalid',
    //     timer: 3000,
    //     heightAuto: false,
    //   })
    // } 
    else if (!this.sales['customer_phone']) {

      Swal.fire({
        icon: 'error',
        title: 'Missing Info',
        text: 'Customer phone is missing',
        timer: 3000,
        heightAuto: false,

      })

    } else if (!this.sales['customer_address']) {

      Swal.fire({
        icon: 'error',
        title: 'Missing Info',
        text: 'Customer address is missing',
        timer: 3000,
        heightAuto: false,

      })

    }
    else if (!this.sales['customer_property']) {

      Swal.fire({
        icon: 'error',
        title: 'Missing Info',
        text: 'Customer property type is missing',
        timer: 3000,
        heightAuto: false,
      })

    } else if (!this.sales['transport_fee']) {

      Swal.fire({
        icon: 'error',
        title: 'Missing Info',
        text: 'State/Area is missing',
        timer: 3000,
        heightAuto: false,
      })

    } else if (!this.sales['reference']) {

      Swal.fire({
        icon: 'error',
        title: 'Missing Info',
        text: 'Reference is missing',
        timer: 3000,
        heightAuto: false,
      })

    } else if (!this.id_sales) {

      Swal.fire({
        icon: 'error',
        title: 'Missing Info',
        text: 'Sales Person is missing',
        timer: 3000,
        heightAuto: false,
      })

    }
    else {

      let temp = {
        customer_name: this.sales.customer_name,
        // customer_email: this.sales.customer_email,
        customer_address: this.sales.customer_address,
        customer_phone: this.sales.customer_phone,
        customer_property: this.sales.customer_property,
        customer_nric: this.sales.customer_nric || null,
        customer_phone_2: this.sales.customer_phone_2 || null,
        customer_address_2: this.sales.customer_address_2 || null,
        reference: this.sales.reference,
        id_sales: this.id_sales,
        // id_tech: this.id_tech,
        date: new Date().getTime(),
        step: 1,
        offsets: 0,
        total_sales: 0,
        need_scaftfolding: false,
        need_ladder: false,
        quotation_client: JSON.stringify([]),
        quotation_detailed: JSON.stringify([]),
        so_pdf: JSON.stringify([]),
        mo_pdf: JSON.stringify([]),
        transport_fee: this.sales.transport_fee
      }

      console.log(temp);

      Swal.fire({
        title: 'Create Sales',
        text: "New Sales will be created, are you sure? ",
        icon: 'question',
        heightAuto: false,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm!',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {

          this.http.post('https://curtain.vsnap.my/insertsales', temp).subscribe(s => {
            console.log('Sales Created Successfully');

            let body2 = {
              title: "New Sales Appointed",
              body: "New sales have been appointed to you.",
              path: 'tabs/tab1',
              topic: this.id_sales,
            }
            this.http.post('https://curtain.vsnap.my/fcmAny', body2).subscribe(data2 => {
              console.log(data2);
            }, e => {
              console.log(e);
            });

            Swal.fire({
              title: 'Success',
              text: "New Sales Created Successfully! ",
              icon: 'success',
              heightAuto: false,
            })
            this.modal.dismiss(1)

          })
        }

      })

    }
    // console.log(this.user)

  }

  cancel() {
    this.modal.dismiss()
  }

  // delete() {

  //   this.user['photo'] = ''

  // }

  chgpassword() {

    let temp = {
      id: this.id,
      password: 'Vsing888',
    }

    Swal.fire({
      title: 'Update User',
      text: "Are you want to edit this users? ",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm!'
    }).then((result) => {
      if (result.isConfirmed) {

        Swal.fire({
          title: 'Processing',
          text: 'please wait...',
          showCancelButton: false, // There won't be any cancel button
          showConfirmButton: false,

        })

        this.http.post('https://vsinguniverse.vsing.my/changepassword', temp).subscribe(a => {
          if (a['message']) {

            Swal.fire({
              icon: 'success',
              title: 'Update Successfully',
              text: 'User\'s profile has been updated',
              timer: 3000

            })

            this.modal.dismiss()

          } else {

            Swal.fire({
              icon: 'error',
              title: 'Update Fail',
              text: 'Please try again later',
              timer: 3000

            })

          }
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

  widther() {
    return this.platform.width()
  }
}
