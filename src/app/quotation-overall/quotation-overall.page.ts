import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController, Platform } from '@ionic/angular';
import Swal from 'sweetalert2';
import firebase from 'firebase';

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { SafariViewController } from '@awesome-cordova-plugins/safari-view-controller/ngx';

pdfMake.vfs = pdfFonts.pdfMake.vfs
@Component({
  selector: 'app-quotation-overall',
  templateUrl: './quotation-overall.page.html',
  styleUrls: ['./quotation-overall.page.scss'],
})
export class QuotationOverallPage implements OnInit {

  constructor(
    private actroute: ActivatedRoute,
    private nav: NavController,
    private http: HttpClient,
    private datepipe: DatePipe,
    private file: File,
    private fileOpener: FileOpener,
    private plt: Platform,
    private alertController: AlertController,
    private safariViewController: SafariViewController,
  ) { }

  item = [] as any
  sales_id = 0
  info = [] as any
  user = []
  salesmaninfo = [] as any
  pleatlist = []
  blindlist = []
  tracklist = []
  fabriclist = []
  fabricCurtain = []
  fabricSheer = []
  fabricLining = []
  fabricBlind = []
  blindTape = [] as any
  calc = [] as any
  packageList = [] as any
  packageApplied = [] as any
  packageViewed = [] as any
  packageName
  loading = false
  count = 0

  due = 0

  ladder = false
  scaftfolding = false
  scaftfoldingDeliver = false
  ladderDeliver = false

  pdfObj = null;
  quoRef
  quoDate
  quoValidity
  quoSales
  quoPhone

  ref = ''
  thismonthsales = []
  soNum
  soNumDigit
  customSoNum
  soInstDate = ''
  soRemark = ''
  soInstTime = ''
  isCreateSo = false
  checkChangeSO = false
  viewPackage = false
  focMotorised = 0

  ngOnInit() {

    firebase.auth().onAuthStateChanged(a => {
      if (a) {
        this.http.post('https://curtain.vsnap.my/onestaff', { id: a.uid }).subscribe((s) => {
          this.user = s['data'][0]
          console.log(this.user);

        })

      }
    })

    this.actroute.queryParams.subscribe(a => {
      this.sales_id = a['sales_id']
      this.http.post('https://curtain.vsnap.my/getonesales', { no: this.sales_id }).subscribe((s) => {
        this.info = s['data'][0]
        console.log(this.info);
        this.info.scaftfolding_quantity = 1

        this.http.post('https://curtain.vsnap.my/onestaff', { id: this.info['id_sales'] }).subscribe(a => {
          this.salesmaninfo = a['data'][0]
          console.log(this.salesmaninfo);
        })

        this.http.post('https://curtain.vsnap.my/getthismonthsales', { month: this.datepipe.transform(new Date(), 'MMyyyy') }).subscribe(a => {
          this.thismonthsales = a['data'].sort((a, b) => b.sales_so_id - a.sales_so_id) || []
          console.log(this.thismonthsales);

          let regex = /^(\d{1,2})_/;
          if (this.info.so_pdf.length > 0) {
            let match = this.info.so_pdf[this.info.so_pdf.length - 1].name.match(regex);
            let digits = match[1]
            if (
              digits.length == 1 ? (this.info.so_pdf[this.info.so_pdf.length - 1].name).slice(2, 6) == this.datepipe.transform(new Date(), 'yyMM') : (this.info.so_pdf[this.info.so_pdf.length - 1].name).slice(3, 7) == this.datepipe.transform(new Date(), 'yyMM')
            ) {
              this.soNum = this.datepipe.transform(new Date(), 'yyMM') + '-' + ("000" + this.info.sales_so_id).slice(-4)
              this.soNumDigit = this.info.sales_so_id
            } else {
              this.soNum = this.datepipe.transform(new Date(), 'yyMM') + '-' + ("000" + (this.thismonthsales[0].sales_so_id + 1)).slice(-4)
              this.soNumDigit = (this.thismonthsales[0].sales_so_id + 1)
            }

          } else {
            if (this.thismonthsales.length == 0) {
              this.soNum = this.datepipe.transform(new Date(), 'yyMM') + '-' + ("000" + (Object.keys(a['data'] || {}).length + 1)).slice(-4)
              // this.soNum = this.datepipe.transform(new Date(), 'yyMM') + '-' + ("000" + (Object.keys(a['data'] || {}).length + 1)).slice(-4)
              this.soNumDigit = (Object.keys(a['data'] || {}).length + 1)
            } else {
              this.soNum = this.datepipe.transform(new Date(), 'yyMM') + '-' + ("000" + (this.thismonthsales[0].sales_so_id + 1)).slice(-4)
              // this.soNum = this.datepipe.transform(new Date(), 'yyMM') + '-' + ("000" + (Object.keys(a['data'] || {}).length + 1)).slice(-4)
              this.soNumDigit = (this.thismonthsales[0].sales_so_id + 1)
            }

          }

          console.log(this.soNum);
          console.log(this.soNumDigit);
        })

        this.pleatlist = JSON.parse(a["pleatlist"])
        this.blindlist = JSON.parse(a["blindlist"])
        this.tracklist = JSON.parse(a["tracklist"])

        this.http.get('https://curtain.vsnap.my/tapeList').subscribe(a => {
          this.blindTape = a['data']
          console.log(this.blindTape);
        })

        if (this.info.package_code) {
          this.http.get('https://curtain.vsnap.my/packageList').subscribe(a => {
            this.packageApplied = a['data'].filter(a => (a.id) == (this.info.package_code))[0]
            this.packageViewed = this.packageApplied
          })
        }

        this.http.get('https://curtain.vsnap.my/fabricList').subscribe((s) => {
          this.fabriclist = s['data']
          this.fabricCurtain = this.fabriclist.filter(x => x.type == 'Curtain')
          this.fabricSheer = this.fabriclist.filter(x => x.type == 'Sheer')
          this.fabricLining = this.fabriclist.filter(x => x.type == 'Lining')
          this.fabricBlind = this.fabriclist.filter(x => x.type == 'Blind')

          this.http.post('https://curtain.vsnap.my/getorderlist', { sales_id: this.sales_id }).subscribe(a => {
            this.item = a['data'].sort((a, b) => a.no - b.no)

            console.log(this.info, this.item, this.sales_id, this.pleatlist, this.blindlist, this.tracklist, this.fabriclist);

            this.loop()

          })
        })

      })

      // this.http.post('https://curtain.vsnap.my/getonesales', { id: this.sales_id }).subscribe(a => {
      //   this.sales = a['data'][0]
      //   console.log(this.salesmaninfo);
      // })

    })

  }

  loop() {
    console.log(this.count);
    this.calcPrice(this.count)
  }

  totalPrice() {
    let total = 0
    for (let i = 0; i < this.item.length; i++) {
      total += this.item[i].price
    }

    // if (this.ladderDeliver) {
    //   total += 100
    // }
    // if (this.scaftfoldingDeliver) {
    //   total += 200
    // }
    if (this.info.ladder_fee_status) {
      total += 200
    }
    if (this.info.scaftfolding_fee_status) {
      total += 500 * this.info.scaftfolding_quantity
    }

    total += this.info.transport_fee_status ? this.info.transport_fee : 0
    return total || 0
  }

  packageView() {
    this.http.get('https://curtain.vsnap.my/packageList').subscribe(a => {
      this.packageList = a['data']

      if (this.packageList.some(a => ((a.code)).toLowerCase() == ((this.packageName)).toLowerCase())) {
        this.packageViewed = this.packageList.filter(a => ((a.code)).toLowerCase() == ((this.packageName)).toLowerCase())[0]
        this.viewPackage = true

        console.log(this.packageViewed);

      } else {
        Swal.fire({
          title: 'Error',
          text: 'Package code not found.',
          icon: 'error',
          timer: 3000,
          heightAuto: false,
        });
      }
    })
  }

  packageDelete() {

    Swal.fire({
      title: 'Delete Applied Package?',
      text: "This will clear the applied package?",
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
      heightAuto: false,
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {

        this.packageApplied = [] as any
        this.info.package_code = null
        this.info.package_addon = false
        this.info.package_location = null
        this.info.package_remark = null
        this.info.package_selection = null

        let temp = {
          no: this.sales_id,
          package_code: null,
        }

        this.http.post('https://curtain.vsnap.my/updatesales', temp).subscribe(a => {

          const Toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          })

          Toast.fire({
            icon: 'success',
            title: 'Applied Package Cleared.'
          })

        })



      }
    })

  }

  packageApply() {
    this.http.get('https://curtain.vsnap.my/packageList').subscribe(a => {
      this.packageList = a['data']

      if (this.packageList.some(a => ((a.code)).toLowerCase() == ((this.packageName)).toLowerCase())) {
        this.packageApplied = this.packageList.filter(a => ((a.code)).toLowerCase() == ((this.packageName)).toLowerCase())[0]
        this.info.package_code = this.packageApplied.id

        console.log(this.packageApplied);

        let temp = {
          no: this.sales_id,
          package_code: this.info.package_code ? this.info.package_code : null,
        }

        this.http.post('https://curtain.vsnap.my/updatesales', temp).subscribe(a => {

          const Toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          })

          Toast.fire({
            icon: 'success',
            title: 'Package Applied.'
          })

        })

      } else {
        Swal.fire({
          title: 'Error',
          text: 'Package code not found.',
          icon: 'error',
          timer: 3000,
          heightAuto: false,
        });
      }

    })

  }

  closePackage() {
    this.viewPackage = false
  }

  addCharges() {
    let addCharges = 0

    // if (this.ladderDeliver) {
    //   addCharges += 100
    // }
    // if (this.scaftfoldingDeliver) {
    //   addCharges += 200
    // }
    if (this.info.ladder_fee_status) {
      addCharges += 200
    }
    if (this.info.scaftfolding_fee_status) {
      addCharges += 500 * this.info.scaftfolding_quantity
    }

    addCharges += this.info.transport_fee_status ? this.info.transport_fee : 0

    return addCharges || 0
  }

  async quotationinfo(x) {

    console.log(this.info);


    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      header: 'Create Quotation?',
      // subHeader: 'Default Password: forcar123',
      // inputs: [
      //   {
      //     name: 'ref',
      //     type: 'text',
      //     placeholder: 'Ref (eg. WI-AA)',
      //     value: this.ref,
      //   },
      // ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          }
        }, {
          text: 'Confirm',
          handler: (data) => {
            console.log(data)
            // if (data['ref'] == null || data['ref'] == '') {

            //   Swal.fire({
            //     title: 'Ref. is Empty',
            //     text: 'Please enter Reference and try again!',
            //     icon: 'error',
            //     timer: 5000,
            //     heightAuto: false,
            //   });

            // } else {
            // let buttoners = {
            //   Cancel: { name: 'Cancel', value: 'Cancel' },
            //   Confirm: { name: 'Confirm', value: 'Confirm' }
            // }

            // console.log(data['ref']);
            this.ref = this.info.reference + '-' + this.salesmaninfo.shortname

            this.quoRef = 'QT' + this.datepipe.transform(new Date(), 'yyyyMMdd') + this.ref
            this.quoDate = this.datepipe.transform(new Date(), 'd/M/yyyy')
            this.quoValidity = '30 Days'
            this.quoSales = this.salesmaninfo.name
            this.quoPhone = this.salesmaninfo.phone

            if (x == 'client') {

              this.pdfmakerClient(false)

            } else if (x == 'detailed') {

              this.pdfmaker(false)

            } else {

              Swal.fire({
                title: 'Submitting...',
                icon: 'warning',
                heightAuto: false,
                showConfirmButton: false,
                showCancelButton: false,
              })

              this.pdfmaker(true)

            }


          }
        }
      ]
    });

    await alert.present();
  }

  confirmation() {

    if (this.info.customer_nric == '' || this.info.customer_nric == null) {

      Swal.fire({
        title: 'Customer NRIC Required',
        text: "Please enter customer IC, and try again",
        icon: 'error',
        heightAuto: false,
        reverseButtons: true,
      })

    } else {
      Swal.fire({
        title: 'Create Sales Order',
        text: "This will create a sales order, are you sure?",
        icon: 'question',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm',
        heightAuto: false,
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            icon: 'warning',
            title: 'Generating SO...',
            heightAuto: false,
            showConfirmButton: false,
          })

          this.pdfmakerSO()
        }
      })
    }

  }

  close() {
    Swal.fire({
      title: 'Cancel Create Sales Order',
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Back',
      confirmButtonText: `Don't create`,
      heightAuto: false,
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Task Proceeded Successfully',
          icon: 'success',
          heightAuto: false,
          showConfirmButton: false,
          showCancelButton: false,
          timer: 1500,
        })
        this.isCreateSo = false
        this.nav.navigateRoot('/tabs/tab1')
      }
    })

  }

  checkout() {

    if (this.info['rejected'] == true) {
      let temp = {
        no: this.sales_id,
        step: 3,
        rejected: false,
        latest_quo_id: this.quoRef,
        need_scaftfolding: this.info.scaftfolding_fee_status ? true : false,
        need_ladder: this.info.ladder_fee_status ? true : false,
        scaftfolding_fee_status: this.info.scaftfolding_fee_status,
        ladder_fee_status: this.info.ladder_fee_status,
        transport_fee_status: this.info.transport_fee_status,
      }

      console.log('rejected');

      // Swal.fire({
      //   title: 'Checkout?',
      //   text: 'Checkout the sales?',
      //   heightAuto: false,
      //   icon: 'warning',
      //   showConfirmButton: true,
      //   showCancelButton: true,
      //   cancelButtonText: 'Cancel',
      //   cancelButtonColor: '#d33',
      //   confirmButtonText: 'Checkout',
      //   reverseButtons: true,
      // }).then((y) => {
      //   if (y.isConfirmed) {
      this.http.post('https://curtain.vsnap.my/updatesales', temp).subscribe(a => {
        Swal.fire({
          title: 'Checked Out Successfully',
          icon: 'success',
          heightAuto: false,
          showConfirmButton: false,
          showCancelButton: false,
          timer: 1500,
        })
        this.nav.navigateRoot('/tabs/tab1')
      })

      //   }
      // })

    } else {
      let temp = {
        no: this.sales_id,
        step: 2,
        latest_quo_id: this.quoRef,
        need_scaftfolding: this.info.scaftfolding_fee_status ? true : false,
        need_ladder: this.info.ladder_fee_status ? true : false,
        scaftfolding_fee_status: this.info.scaftfolding_fee_status,
        ladder_fee_status: this.info.ladder_fee_status,
        transport_fee_status: this.info.transport_fee_status,
        package_code: this.info.package_code ? this.info.package_code : null,

      }

      if (this.info.package_addon) {
        temp['package_selection'] = this.info.package_selection
        temp['package_location'] = this.info.package_location
        temp['package_remark'] = this.info.package_remark
        temp['package_addon'] = this.info.package_addon
      }
      console.log('xrejected');

      // Swal.fire({
      //   title: 'Checkout?',
      //   text: 'Checkout the sales?',
      //   heightAuto: false,
      //   icon: 'warning',
      //   showConfirmButton: true,
      //   showCancelButton: true,
      //   cancelButtonText: 'Cancel',
      //   cancelButtonColor: '#d33',
      //   confirmButtonText: 'Checkout',
      //   reverseButtons: true,
      // }).then((y) => {
      //   if (y.isConfirmed) {
      this.http.post('https://curtain.vsnap.my/updatesales', temp).subscribe(a => {
        // Swal.fire({
        //   title: 'Checked Out Successfully',
        //   icon: 'success',
        //   heightAuto: false,
        //   showConfirmButton: false,
        //   showCancelButton: false,
        //   timer: 1500,
        // })
        //   // this.nav.navigateRoot('/tabs/tab1')
        Swal.close()
        // this.createSo()
        this.isCreateSo = true

      })

      //   }
      // })
    }

  }

  calcPrice(i) {
    let width = 0 as any
    let height = 0 as any
    if (this.item[i].height_tech != null || this.item[i].width_tech != null) {
      if (this.item[i].status_tech == 'Approved' && this.item[i].status_sale == 'Completed') {
        width = this.item[i].width
        height = this.item[i].height
      } else {
        width = this.item[i].width_tech
        height = this.item[i].height_tech
      }

    } else {
      width = this.item[i].width
      height = this.item[i].height
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

    console.log(this.item[i]);

    if (this.item[i].type == '1') {
      alacarte = true

      if (this.item[i].fabric != null) {
        if (this.item[i].fabric_type == 'C' || this.item[i].fabric_type == 'CS') {
          curtain = true
          curtain_id = this.fabricCurtain.filter(x => x.name == this.item[i].fabric)[0]['id']
        } else {
          curtain = false
        }
      } else {
        curtain = false
      }

      if (this.item[i].fabric_sheer != null) {
        if (this.item[i].fabric_type == 'S' || this.item[i].fabric_type == 'CS') {
          sheer = true
          sheer_id = this.fabricSheer.filter(x => x.name == this.item[i].fabric_sheer)[0]['id']
        } else {
          sheer = false
        }
      } else {
        sheer = false
      }

    } else if (this.item[i].type == '2') {
      alacarte = true

      if (this.item[i].track != null) {
        track = true
        track_id = this.tracklist.filter(x => x.name == this.item[i].track)[0]['id']
      } else {
        track = false
      }

    } else if (this.item[i].type == '3') {
      alacarte = true

      if (this.item[i].accessories.length > 0) {
        isAccessory = true

      }

    } else if (this.item[i].type == '4') {
      this.item[i].motorized_upgrade = true
      alacarte = true

    } else if (this.item[i].type == '5') {
      alacarte = true

      if (this.item[i].track != null) {
        if (this.item[i].fabric_type == 'C' || this.item[i].fabric_type == 'CS' || this.item[i].type == 2) {
          track = true
          track_id = this.tracklist.filter(x => x.name == this.item[i].track)[0]['id']
        } else {
          track = false
        }
      } else {
        track = false
      }

      if (this.item[i].track_sheer != null) {
        console.log(this.item[i]);

        if (this.item[i].fabric_type == 'S' || this.item[i].fabric_type == 'CS') {
          track_sheer = true
          track_sheer_id = this.tracklist.filter(x => x.name == this.item[i].track_sheer)[0]['id']
        } else {
          track_sheer = false
        }
      } else {
        track_sheer = false
      }

      if (this.item[i].pleat != null && this.item[i].pleat != '') {
        curtain = true
        pleat_id = this.pleatlist.filter(x => x.name == this.item[i].pleat)[0]['id']
      }

      if (this.item[i].pleat_sheer != null && this.item[i].pleat_sheer != '') {
        sheer = true
        pleat_sheer_id = this.pleatlist.filter(x => x.name == this.item[i].pleat_sheer)[0]['id']
      }

      if ((this.item[i].sidehook == 'Yes' && (this.item[i].belt != 'No' || this.item[i].belt)) || (this.item[i].sheer_sidehook == 'Yes' && (this.item[i].sheer_belt != 'No' || this.item[i].sheer_belt))) {
        belt_hook = true
      }

    } else if (this.item[i].type == '6') {
      alacarte = true

      if (this.lengthof(this.item[i].wallpaper) > 0) {
        isWallpaper = true
      }

    } else if (this.item[i].type == 'Tailor-Made Curtains') {

      if (this.item[i].fabric != null) {
        if (this.item[i].fabric_type == 'C' || this.item[i].fabric_type == 'CS') {
          curtain = true
          try {
            curtain_id = this.fabricCurtain.filter(x => x.name == this.item[i].fabric)[0]['id']
          } catch (error) {
            this.calcErrorMsg('Fabric', "curtain's fabric", this.item[i].location + " " + this.item[i].location_ref)
            this.back()
            return
          }
        } else {
          curtain = false
        }
      } else {
        curtain = false
      }

      if (this.item[i].fabric_lining != null) {
        if (this.item[i].fabric_type == 'C' || this.item[i].fabric_type == 'CS') {
          lining = true
          try {
            lining_id = this.fabricLining.filter(x => x.name == this.item[i].fabric_lining)[0]['id']
          } catch (error) {
            this.calcErrorMsg('Lining', "lining's fabric", this.item[i].location + " " + this.item[i].location_ref)
            this.back()
            return
          }
        } else {
          lining = false
        }
      } else {
        lining = false
      }

      if (this.item[i].fabric_sheer != null) {
        if (this.item[i].fabric_type == 'S' || this.item[i].fabric_type == 'CS') {
          sheer = true
          try {
            sheer_id = this.fabricSheer.filter(x => x.name == this.item[i].fabric_sheer)[0]['id']
          } catch (error) {
            this.calcErrorMsg('Sheer', "sheer's fabric", this.item[i].location + " " + this.item[i].location_ref)
            this.back()
            return
          }
        } else {
          sheer = false
        }
      } else {
        sheer = false
      }

      if (this.item[i].track != null) {
        if (this.item[i].fabric_type == 'C' || this.item[i].fabric_type == 'CS') {
          track = true
          try {
            track_id = this.tracklist.filter(x => x.name == this.item[i].track)[0]['id']
          } catch (error) {
            this.calcErrorMsg('Track', "track", this.item[i].location + " " + this.item[i].location_ref)
            return
          }
        } else {
          track = false
        }
      } else {
        track = false
      }

      if (this.item[i].track_sheer != null) {
        if (this.item[i].fabric_type == 'S' || this.item[i].fabric_type == 'CS') {
          track_sheer = true
          try {
            track_sheer_id = this.tracklist.filter(x => x.name == this.item[i].track_sheer)[0]['id']
          } catch (error) {
            this.calcErrorMsg("Sheer's Track", "sheer's track", this.item[i].location + " " + this.item[i].location_ref)
            return
          }
        } else {
          track_sheer = false
        }
      } else {
        track_sheer = false
      }

      if (this.item[i].pleat != null && this.item[i].pleat != '') {
        try {
          pleat_id = this.pleatlist.filter(x => x.name == this.item[i].pleat)[0]['id']
        } catch (error) {
          this.calcErrorMsg("Pleat", "pleat", this.item[i].location + " " + this.item[i].location_ref)
          return
        }
      }

      if (this.item[i].pleat_sheer != null && this.item[i].pleat_sheer != '') {
        try {
          pleat_sheer_id = this.pleatlist.filter(x => x.name == this.item[i].pleat_sheer)[0]['id']
        } catch (error) {
          this.calcErrorMsg("Sheer's Pleat", "sheer's pleat", this.item[i].location + " " + this.item[i].location_ref)
          return
        }
      }

      if ((this.item[i].sidehook == 'Yes' && (this.item[i].belt != 'No' || this.item[i].belt)) || (this.item[i].sheer_sidehook == 'Yes' && (this.item[i].sheer_belt != 'No' || this.item[i].sheer_belt))) {
        belt_hook = true
      }

    } else {
      if (this.item[i].pleat == 'Roman Blind') {
        // curtain = true
        sheer = false
        track = false
        track_sheer = false
        // lining = false
        blind = true
        isRomanBlind = true
        belt_hook = false
        console.log('blindcurtain');

        if (this.item[i].fabric_blind != null) {
          blind = true
          try {
            blind_id = this.fabricBlind.filter(x => x.name == this.item[i].fabric_blind)[0]['id']
          } catch (error) {
            this.calcErrorMsg('Blind', "blind's fabric", this.item[i].location + " " + this.item[i].location_ref)
            return
          }
        }

        if (this.item[i].fabric != null) {
          curtain = true
          try {
            curtain_id = this.fabricCurtain.filter(x => x.name == this.item[i].fabric)[0]['id']
          } catch (error) {
            this.calcErrorMsg('Fabric', "curtain's fabric", this.item[i].location + " " + this.item[i].location_ref)
            return
          }
        } else {
          curtain = false
        }

        if (this.item[i].fabric_lining != null) {
          lining = true
          try {
            lining_id = this.fabricLining.filter(x => x.name == this.item[i].fabric_lining)[0]['id']
          } catch (error) {
            this.calcErrorMsg('Lining', "lining's fabric", this.item[i].location + " " + this.item[i].location_ref)
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

        if (this.item[i].fabric_blind != null && this.item[i].fabric_blind != '') {
          try {
            blind_id = (this.fabricBlind.filter(x => x.name == this.item[i].fabric_blind))[0]['id']
          } catch (error) {
            this.calcErrorMsg('Blind', "blind's fabric", this.item[i].location + " " + this.item[i].location_ref)
            return
          }
        }

        if (this.item[i].pleat == 'Wooden Blind' || this.item[i].pleat == 'Venetian Blinds') {
          if (this.item[i].blind_tape) {
            tape = true
            try {
              tape_id = (this.blindTape.filter(x => x.name == this.item[i].blind_tape))[0]['id']
            } catch (error) {
              this.calcErrorMsg('Tape', "blind's tape", this.item[i].location + " " + this.item[i].location_ref)
              return
            }
          }
        }

      }

      // if (this.item[i].pleat != null && this.item[i].pleat != '') {
      //   pleat_id = this.pleatlist.filter(x => x.name == this.item[i].pleat)[0]['id']
      // }
    }

    if (this.item[i].motorized_cost == 'FOC') {
      this.focMotorised++
    }

    let temp = {
      width: parseFloat(width), height: parseFloat(height), curtain: curtain, lining: lining, lining_id: lining_id,
      curtain_id: curtain_id, sheer: sheer, sheer_id: sheer_id, track: track, track_id: track_id, pleat_id: pleat_id, pleat_sheer_id: pleat_sheer_id, track_sheer: track_sheer, track_sheer_id: track_sheer_id, blind: blind, blind_id: blind_id,
      pieces_curtain: this.item[i].pieces_curtain || 0, pieces_sheer: this.item[i].pieces_sheer || 0, pieces_blind: this.item[i].pieces_blind || 0,
      promo_curtain: this.item[i].promo_curtain || 0, promo_lining: this.item[i].promo_lining || 0, promo_sheer: this.item[i].promo_sheer || 0, promo_blind: this.item[i].promo_blind || 0,
      motorized: this.item[i].motorized_upgrade, motorized_cost: this.item[i].motorized_cost, motorized_power: this.item[i].motorized_power, motorized_choice: this.item[i].motorized_choice, motorized_pieces: this.item[i].motorized_pieces, motorized_lift: this.item[i].motorized_lift,
      belt_hook: belt_hook, isRomanBlind: isRomanBlind, tape: tape, tape_id: tape_id, blind_spring: this.item[i].blind_spring, blind_tube: this.item[i].blind_tube, blind_easylift: this.item[i].blind_easylift, blind_monosys: this.item[i].blind_monosys,
      eyelet_curtain: this.item[i].eyelet_curtain, eyelet_sheer: this.item[i].eyelet_sheer, alacarte: alacarte, type: this.item[i].type, accessories: this.item[i].accessories, wallpaper: this.item[i].wallpaper, install_fee: this.item[i].install_fee

    }

    console.log(temp);

    this.http.post('https://curtain.vsnap.my/calcPrice', temp).subscribe(a => {

      this.calc.push(a['data'])
      this.count++
      this.dueamount(i)

      if (this.calc[i].install.scaftfolding) {
        this.scaftfolding = true
        this.info.scaftfolding_fee_status = true
        this.scaftfoldingDeliver = true
      }

      if (this.calc[i].install.ladder) {
        this.ladder = true
        this.info.ladder_fee_status = true
        this.ladderDeliver = true
      }

      if (this.calc.length != this.item.length) {
        this.loop()
      }
      console.log(this.calc);

      if (this.calc.length == this.item.length) {
        console.log('finish');


        // if (this.item.height > 180) {
        //   this.item.need_scaftfolding = true
        // } else if (this.item.height >= 156 && this.item.height <= 180) {
        //   this.item.need_ladder = true
        // } else {
        //   this.item.need_scaftfolding = false
        //   this.item.need_ladder = false
        // }
        console.log('FOC Motorised = ', this.focMotorised);

        Swal.close()
        this.loading = true
      }

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

  dueamount(i) {
    if (this.item[i].price_old != null) {
      let temp = this.item[i].price - this.item[i].price_old
      this.due += temp
      console.log(this.due);

    }
  }

  lengthof(x) {
    return Object.keys(x || {}).length
  }

  back() {
    this.nav.pop()
  }

  pdfmakerSO() {

    if (this.customSoNum != null && this.customSoNum != '' && this.checkChangeSO) {
      this.soNum = this.datepipe.transform(new Date(), 'yyMM') + '-' + ("000" + this.customSoNum).slice(-4)
      this.soNumDigit = this.customSoNum
    }

    let customer_info = []
    let today = new Date()
    let width = null
    let height = null

    //Customer
    let ci = ''
    ci = this.info.customer_name + '\n\n\n' + this.info.customer_address + '\n\n\n' + this.info.customer_phone + '\n '

    customer_info.push(ci)

    //Ref & Date & Validity & Sales
    // let ref = 'QT' + this.datepipe.transform(today, 'yyyyMMdd') + 'WI-TM'
    // let date = this.datepipe.transform(new Date(today), 'd/M/yyyy')
    // let validity = 'COD'
    // let salesphone = 'TM\n' + this.salesmaninfo.phone

    //SO number
    let sonum = { text: 'SO NO : ' + this.soNum }

    //SO info left
    let soinfoleft = [
      [{ text: 'Company Name:', border: [], bold: true, fontSize: 9 }, { text: ': ', border: [false, true, false, true], bold: true, fontSize: 9 }],
      [{ text: 'Client Name', border: [], bold: true, fontSize: 9 }, { text: ': ' + this.info.customer_name, border: [false, true, false, true], bold: true, fontSize: 9 }],
      [{ text: 'Phone No', border: [], bold: true, fontSize: 9 }, { text: ': ' + this.info.customer_phone, border: [false, true, false, true], bold: true, fontSize: 9 }],
      [{ text: 'Address', border: [], bold: true, fontSize: 9 }, { text: ': ' + this.info.customer_address, border: [false, true, false, true], bold: true, fontSize: 9 }],
      [{ text: 'Site Add', border: [], bold: true, fontSize: 9 }, { text: ': ' + this.info.customer_address, border: [false, true, false, true], bold: true, fontSize: 9 }],
      [{ text: 'Sew By', border: [false, false, false, true], bold: true, fontSize: 9 }, { text: ': ', border: [false, true, false, true], bold: true, fontSize: 9 }],
    ] as any

    //SO info right
    let soinforight = [
      [{ text: 'QT No.', border: [], bold: true, fontSize: 9, alignment: 'right' }, { text: ': ' + this.quoRef, border: [false, false, false, true], bold: true, fontSize: 9 }],
      [{ text: 'Date Order', border: [], bold: true, fontSize: 9, alignment: 'right' }, { text: ': ' + this.datepipe.transform(new Date(), 'd/M/yyyy'), border: [false, true, false, true], bold: true, fontSize: 9 }],
      [{ text: 'Scheduled Inst Date', border: [], bold: true, fontSize: 9, alignment: 'right' }, { text: ': ' + (this.datepipe.transform(this.soInstDate, 'd/M/yyyy') || ''), border: [false, true, false, true], bold: true, fontSize: 9 }],
      [{ text: 'Sales P.I.C', border: [], bold: true, fontSize: 9, alignment: 'right' }, { text: ': ' + this.salesmaninfo.name, border: [false, true, false, true], bold: true, fontSize: 9 }],
      [{ text: 'FOC Motorised', border: [], bold: true, fontSize: 9, alignment: 'right' }, { text: ': ' + this.focMotorised, border: [false, true, false, true], bold: true, fontSize: 9 }],
      // [{ text: 'Est. Inst Time', border: [], bold: true, fontSize: 9, alignment: 'right' }, { text: ': ' + this.soInstTime, border: [false, true, false, true], bold: true, fontSize: 9 }],
      [{ text: 'Remarks', border: [], bold: true, fontSize: 9, alignment: 'right' }, { text: ': ' + this.soRemark, border: [false, true, false, true], bold: true, fontSize: 9 }],
    ] as any

    //Items
    let items = [
      [
        { text: 'Installer Measurement / Area', bold: true, alignment: 'center', fontSize: 8.5 },
        { text: 'Track', bold: true, alignment: 'center', fontSize: 8.5 },
        { text: 'Bracket', bold: true, alignment: 'center', fontSize: 8.5 },
        { text: 'Tailor Measurement / Area', bold: true, alignment: 'center', fontSize: 8.5 },
        { text: 'Material Code', bold: true, alignment: 'center', fontSize: 8.5 },
        { text: 'Fabric\nwidth', bold: true, alignment: 'center', fontSize: 8.5 },
        { text: 'Pleat', bold: true, alignment: 'center', fontSize: 8.5 },
        { text: 'Pcs', bold: true, alignment: 'center', fontSize: 8.5 },
        { text: 'Tieback', bold: true, alignment: 'center', fontSize: 8.5 },
        { text: 'Fullness', bold: true, alignment: 'center', fontSize: 8.5 },
        { text: 'Hook\n(101,\n104)', bold: true, alignment: 'center', fontSize: 8.5 },
        { text: 'Panel/\nMeter', bold: true, alignment: 'center', fontSize: 8.5 },
        { text: 'Remark', bold: true, alignment: 'center', fontSize: 8.5 }
      ],
    ] as any

    for (let i = 0; i < this.item.length; i++) {

      if (this.item[i].height_tech != null || this.item[i].width_tech != null) {
        if (this.item[i].status_tech == 'Approved' && this.item[i].status_sale == 'Completed') {
          width = this.item[i].width
          height = this.item[i].height
        } else {
          width = this.item[i].width_tech
          height = this.item[i].height_tech
        }

      } else {
        width = this.item[i].width
        height = this.item[i].height
      }

      // CL = Curtain & Lining
      // S = Sheer
      let CL_height = height
      let S_height = height

      if (this.item[i].type == 'Tailor-Made Curtains') {

        // Curtain / Lining
        if (this.item[i].motorized_upgrade && (this.item[i].motorized_choice == 'Both' || this.item[i].motorized_choice == 'Curtain')) {

          if (this.item[i].pleat == 'Fake Double Pleat') {
            CL_height = height - 1.5
          } else if (this.item[i].track) {
            if (this.item[i].track == 'Ripplefold') {
              CL_height = height - 1.5
            } else if (this.item[i].track == 'Ripplefold Curve') {
              CL_height = height - 1.75
            } else if (this.item[i].track.includes('Camoor')) {
              CL_height = height - 1.75
            }
          }

        } else {
          if (this.item[i].track) {
            if (this.item[i].track == 'Ripplefold') {
              CL_height = height - 1.75
            } else if (this.item[i].track == 'Ripplefold Curve') {
              CL_height = height - 1.5
            } else if (this.item[i].track.includes('Camoor')) {
              CL_height = height - 1.5
            } else if (this.item[i].track == 'Cubicle / Hospital') {
              CL_height = height - (this.item[i].bracket == 'Wall' ? 0 : 1.5)
            } else if (this.item[i].track == 'Super Track') {
              CL_height = height - (this.item[i].bracket == 'Ceiling Pelmet' ? 1.25 : 0.25)
            } else if (this.item[i].track == 'Curve') {
              CL_height = height - (this.item[i].bracket == 'Ceiling Pelmet' ? 1.25 : 0.25)
            } else if (this.item[i].track.includes('Metal Rod') && this.item[i].pleat) {
              if (this.item[i].pleat == 'Fake Double Pleat') {
                CL_height = height - 2
              }
            } else if (this.item[i].track == 'Wooden Rod' && this.item[i].pleat) {
              if (this.item[i].pleat == 'Fake Double Pleat') {
                CL_height = height - 2
              }
            } else if (this.item[i].track.includes('Metal Rod') && this.item[i].pleat) {
              if (this.item[i].pleat.includes('Eyelet')) {
                CL_height = height + 1.75
              }
            } else if (this.item[i].track == 'Wooden Rod' && this.item[i].pleat) {
              if (this.item[i].pleat.includes('Eyelet')) {
                CL_height = height + 1.75
              }
            }
          }
        }

        // Sheer
        if (this.item[i].motorized_upgrade && (this.item[i].motorized_choice == 'Both' || this.item[i].motorized_choice == 'Sheer')) {
          if (this.item[i].pleat_sheer == 'Fake Double Pleat') {
            S_height = height - 1.5
          } else if (this.item[i].track_sheer) {
            if (this.item[i].track_sheer == 'Ripplefold') {
              S_height = height - 1.5
            } else if (this.item[i].track_sheer == 'Ripplefold Curve') {
              S_height = height - 1.75
            } else if (this.item[i].track_sheer.includes('Camoor')) {
              S_height = height - 1.75
            }
          }
        } else {
          if (this.item[i].track_sheer) {
            if (this.item[i].track_sheer == 'Ripplefold') {
              S_height = height - 1.75
            } else if (this.item[i].track_sheer == 'Ripplefold Curve') {
              S_height = height - 1.5
            } else if (this.item[i].track_sheer.includes('Camoor')) {
              S_height = height - 1.5
            } else if (this.item[i].track_sheer == 'Cubicle / Hospital') {
              S_height = height - (this.item[i].sheer_bracket == 'Wall' ? 0 : 1.5)
            } else if (this.item[i].track_sheer == 'Super Track') {
              S_height = height - (this.item[i].sheer_bracket == 'Ceiling Pelmet' ? 1.25 : 0.25)
            } else if (this.item[i].track_sheer == 'Curve') {
              S_height = height - (this.item[i].sheer_bracket == 'Ceiling Pelmet' ? 1.25 : 0.25)
            } else if (this.item[i].track_sheer.includes('Metal Rod') && this.item[i].pleat_sheer) {
              if (this.item[i].pleat_sheer == 'Fake Double Pleat') {
                S_height = height - 2
              }
            } else if (this.item[i].track_sheer == 'Wooden Rod' && this.item[i].pleat_sheer) {
              if (this.item[i].pleat_sheer == 'Fake Double Pleat') {
                S_height = height - 2
              }
            } else if (this.item[i].track_sheer.includes('Metal Rod') && this.item[i].pleat_sheer) {
              if (this.item[i].pleat_sheer.includes('Eyelet')) {
                S_height = height + 1.75
              }
            } else if (this.item[i].track_sheer == 'Wooden Rod' && this.item[i].pleat_sheer) {
              if (this.item[i].pleat_sheer.includes('Eyelet')) {
                S_height = height + 1.75
              }
            }
          }
        }
      }

      if (this.item[i].type != 'Tailor-Made Curtains' && this.item[i].type != 'Blinds') {

        // Curtain / Lining
        if (this.item[i].motorized_upgrade && (this.item[i].motorized_choice == 'Both' || this.item[i].motorized_choice == 'Curtain')) {

          if (this.item[i].pleat == 'Fake Double Pleat') {
            CL_height = height - 1.5
          } else if (this.item[i].track) {
            if (this.item[i].track == 'Ripplefold') {
              CL_height = height - 1.5
            } else if (this.item[i].track == 'Ripplefold Curve') {
              CL_height = height - 1.75
            } else if (this.item[i].track.includes('Camoor')) {
              CL_height = height - 1.75
            }
          }

        } else {
          if (this.item[i].track) {
            if (this.item[i].track == 'Ripplefold') {
              CL_height = height - 1.75
            } else if (this.item[i].track == 'Ripplefold Curve') {
              CL_height = height - 1.5
            } else if (this.item[i].track.includes('Camoor')) {
              CL_height = height - 1.5
            } else if (this.item[i].track == 'Cubicle / Hospital') {
              CL_height = height - (this.item[i].bracket == 'Wall' ? 0 : 1.5)
            } else if (this.item[i].track == 'Super Track') {
              CL_height = height - 0.25
            } else if (this.item[i].track == 'Curve') {
              CL_height = height - 0.25
            } else if (this.item[i].track.includes('Metal Rod')) {
              CL_height = height - 2
            } else if (this.item[i].track == 'Wooden Rod') {
              CL_height = height - 2
            }
          }
        }

        // Sheer
        if (this.item[i].motorized_upgrade && (this.item[i].motorized_choice == 'Both' || this.item[i].motorized_choice == 'Sheer')) {
          if (this.item[i].pleat_sheer == 'Fake Double Pleat') {
            S_height = height - 1.5
          } else if (this.item[i].track_sheer) {
            if (this.item[i].track_sheer == 'Ripplefold') {
              S_height = height - 1.5
            } else if (this.item[i].track_sheer == 'Ripplefold Curve') {
              S_height = height - 1.75
            } else if (this.item[i].track_sheer.includes('Camoor')) {
              S_height = height - 1.75
            }
          }
        } else {
          if (this.item[i].track_sheer) {
            if (this.item[i].track_sheer == 'Ripplefold') {
              S_height = height - 1.75
            } else if (this.item[i].track_sheer == 'Ripplefold Curve') {
              S_height = height - 1.5
            } else if (this.item[i].track_sheer.includes('Camoor')) {
              S_height = height - 1.5
            } else if (this.item[i].track_sheer == 'Cubicle / Hospital') {
              S_height = height - (this.item[i].sheer_bracket == 'Wall' ? 0 : 1.5)
            } else if (this.item[i].track_sheer == 'Super Track') {
              S_height = height - 1.25
            } else if (this.item[i].track_sheer == 'Curve') {
              S_height = height - 1.25
            } else if (this.item[i].track_sheer.includes('Metal Rod')) {
              S_height = height - 2
            } else if (this.item[i].track_sheer == 'Wooden Rod') {
              S_height = height - 2
            }
          }
        }
      }

      let motorSides

      if (this.item[i].motorized_sides == 'Left') {
        motorSides = 'L'
      } else if (this.item[i].motorized_sides == 'Right') {
        motorSides = 'R'
      }

      //ITEMS PUSH START HERE
      items.push(
        [
          { text: this.item[i].location, bold: true, fontSize: 8.5, decoration: 'underline' },
          { text: '', fontSize: 8.5 },
          { text: '', fontSize: 8.5 },
          { text: '', fontSize: 8.5 },
          { text: '', fontSize: 8.5 },
          { text: '', fontSize: 8.5 },
          { text: '', fontSize: 8.5 },
          { text: '', fontSize: 8.5 },
          { text: '', fontSize: 8.5 },
          { text: '', fontSize: 8.5 },
          { text: '', fontSize: 8.5 },
          { text: '', fontSize: 8.5 },
          { text: '', fontSize: 8.5 },
        ],
      )


      let curtainBelt
      let sheerBelt

      if (this.item[i].belt == 'Tieback') {
        curtainBelt = 'TB'
      } else if (this.item[i].belt == 'Velcro') {
        curtainBelt = 'VC'
      } else {
        curtainBelt = 'X'
      }

      if (this.item[i].sheer_belt == 'Tieback') {
        sheerBelt = 'TB'
      } else if (this.item[i].sheer_belt == 'Velcro') {
        sheerBelt = 'VC'
      } else {
        sheerBelt = 'X'
      }

      let rope_chain

      if (this.item[i].rope_chain == 'Left') {
        rope_chain = 'L'
      } else {
        rope_chain = 'R'
      }

      if (this.item[i].type != 'Blinds') {

        if (this.item[i].type == 'Tailor-Made Curtains') {

          if (this.item[i].fabric_type == 'C') {

            if (this.item[i].fabric != null) {
              let fabricWidth = this.fabricCurtain.filter(a => a.name == this.item[i].fabric)[0]['size']
              let pleatShort = this.pleatlist.filter(a => a.name == this.item[i].pleat)[0]['name_short']

              items.push(
                [
                  { text: 'Curtain', fontSize: 8.5, decoration: 'underline' },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },

                ],
              )

              if (this.item[i].motorized_upgrade && (this.item[i].motorized_choice == 'Both' || this.item[i].motorized_choice == 'Curtain')) {
                items.push(
                  [
                    { text: width + '" ( W )' + ' x ' + height + '" ( H )' + ' ( ' + motorSides + ' )', fontSize: 8.5 },
                    { text: 'Motorized ' + this.item[i].motorized_power, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].bracket || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: width + '" ( W )' + ' x ' + CL_height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].fabric + (this.item[i].code_curtain ? '-' + this.item[i].code_curtain : ''), alignment: 'center', fontSize: 8.5 },
                    { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
                    { text: pleatShort, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].pieces_curtain, alignment: 'center', fontSize: 8.5 },
                    { text: curtainBelt, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].fullness, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].hook || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: this.calc[i].curtain.unit.toUpperCase(), alignment: 'center', fontSize: 8.5 },
                    { text: (this.item[i].remark_curtain || '') + (this.item[i].remark_sale ? ('\n\n *' + (this.item[i].remark_sale || '')) : '') + ((this.info.package_addon && this.info.package_location == this.item[i].no) ? ('\n *' + (this.packageApplied.add_name || '')) : ''), bold: true, fontSize: 8.5 }
                  ],
                )
              } else {
                items.push(
                  [
                    { text: width + '" ( W )' + ' x ' + height + '" ( H )', fontSize: 8.5 },
                    { text: this.item[i].track || '-', alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].bracket || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: width + '" ( W )' + ' x ' + CL_height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].fabric + (this.item[i].code_curtain ? '-' + this.item[i].code_curtain : ''), alignment: 'center', fontSize: 8.5 },
                    { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
                    { text: pleatShort, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].pieces_curtain, alignment: 'center', fontSize: 8.5 },
                    { text: curtainBelt, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].fullness, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].hook || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: this.calc[i].curtain.unit.toUpperCase(), alignment: 'center', fontSize: 8.5 },
                    { text: (this.item[i].remark_curtain || '') + (this.item[i].remark_sale ? ('\n\n *' + (this.item[i].remark_sale || '')) : '') + ((this.info.package_addon && this.info.package_location == this.item[i].no) ? ('\n *' + (this.packageApplied.add_name || '')) : ''), bold: true, fontSize: 8.5 }
                  ],
                )
              }

            }

            if (this.item[i].fabric_lining != null) {
              let fabricWidth = this.fabricLining.filter(a => a.name == this.item[i].fabric_lining)[0]['size']
              let pleatShort = this.pleatlist.filter(a => a.name == this.item[i].pleat)[0]['name_short']

              // items.push(
              //   [
              //     { text: 'Lining', fontSize: 8.5, decoration: 'underline' },
              //     { text: '', fontSize: 8.5 },
              //     { text: '', fontSize: 8.5 },
              //     { text: '', fontSize: 8.5 },
              //     { text: '', fontSize: 8.5 },
              //     { text: '', fontSize: 8.5 },
              //     { text: '', fontSize: 8.5 },
              //     { text: '', fontSize: 8.5 },
              //     { text: '', fontSize: 8.5 },
              //     { text: '', fontSize: 8.5 },
              //     { text: '', fontSize: 8.5 },
              //     { text: '', fontSize: 8.5 },
              //     { text: '', fontSize: 8.5 },
              //   ],
              // )

              items.push(
                [
                  // { text: width + '" ( W )' + ' x ' + height + '" ( H )', fontSize: 8.5 },
                  { text: 'Lining', fontSize: 8.5, decoration: 'underline' },
                  { text: this.item[i].track, alignment: 'center', fontSize: 8.5 },
                  { text: this.item[i].bracket || 'X', alignment: 'center', fontSize: 8.5 },
                  // { text: width + '" ( W )' + ' x ' + CL_height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
                  { text: '', bold: true, alignment: 'center', fontSize: 8.5 },
                  { text: this.item[i].fabric_lining + (this.item[i].code_lining ? '-' + this.item[i].code_lining : ''), alignment: 'center', fontSize: 8.5 },
                  { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
                  { text: pleatShort, alignment: 'center', fontSize: 8.5 },
                  { text: this.item[i].pieces_curtain, alignment: 'center', fontSize: 8.5 },
                  { text: curtainBelt, alignment: 'center', fontSize: 8.5 },
                  { text: '-', alignment: 'center', fontSize: 8.5 },
                  { text: '-', alignment: 'center', fontSize: 8.5 },
                  { text: this.calc[i].lining.unit.toUpperCase(), alignment: 'center', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 }
                ],
              )
            }

            items.push(
              [
                { text: ' ', fontSize: 8.5 },
                { text: ' ', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
              ],
            )

          } else if (this.item[i].fabric_type == 'S') {

            if (this.item[i].fabric_sheer != null) {
              let fabricWidth = this.fabricSheer.filter(a => a.name == this.item[i].fabric_sheer)[0]['size']
              let pleatSheerShort = this.pleatlist.filter(a => a.name == this.item[i].pleat_sheer)[0]['name_short']

              items.push(
                [
                  { text: 'Sheer', fontSize: 8.5, decoration: 'underline' },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                ],
              )

              if (this.item[i].motorized_upgrade && (this.item[i].motorized_choice == 'Both' || this.item[i].motorized_choice == 'Sheer')) {
                items.push(
                  [
                    { text: width + '" ( W )' + ' x ' + height + '" ( H )' + ' ( ' + motorSides + ' )', fontSize: 8.5 },
                    { text: 'Motorized ' + this.item[i].motorized_power, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].sheer_bracket || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: width + '" ( W )' + ' x ' + S_height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].fabric_sheer + (this.item[i].code_sheer ? '-' + this.item[i].code_sheer : ''), alignment: 'center', fontSize: 8.5 },
                    { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
                    { text: pleatSheerShort, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].pieces_sheer, alignment: 'center', fontSize: 8.5 },
                    { text: sheerBelt, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].fullness_sheer, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].sheer_hook || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: this.calc[i].sheer.unit.toUpperCase(), alignment: 'center', fontSize: 8.5 },
                    { text: (this.item[i].remark_sheer || '') + (this.item[i].remark_sale ? ('\n\n *' + (this.item[i].remark_sale || '')) : '') + ((this.info.package_addon && this.info.package_location == this.item[i].no) ? ('\n *' + (this.packageApplied.add_name || '')) : ''), bold: true, fontSize: 8.5 }
                  ],
                )
              } else {
                items.push(
                  [
                    { text: width + '" ( W )' + ' x ' + height + '" ( H )', fontSize: 8.5 },
                    { text: this.item[i].track_sheer || '-', alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].sheer_bracket || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: width + '" ( W )' + ' x ' + S_height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].fabric_sheer + (this.item[i].code_sheer ? '-' + this.item[i].code_sheer : ''), alignment: 'center', fontSize: 8.5 },
                    { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
                    { text: pleatSheerShort, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].pieces_sheer, alignment: 'center', fontSize: 8.5 },
                    { text: sheerBelt, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].fullness_sheer, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].sheer_hook || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: this.calc[i].sheer.unit.toUpperCase(), alignment: 'center', fontSize: 8.5 },
                    { text: (this.item[i].remark_sheer || '') + (this.item[i].remark_sale ? ('\n\n *' + (this.item[i].remark_sale || '')) : '') + ((this.info.package_addon && this.info.package_location == this.item[i].no) ? ('\n *' + (this.packageApplied.add_name || '')) : ''), bold: true, fontSize: 8.5 }
                  ],
                )
              }


            }

            items.push(
              [
                { text: ' ', fontSize: 8.5 },
                { text: ' ', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
              ],
            )
          } else if (this.item[i].fabric_type == 'CS') {
            if (this.item[i].fabric != null) {
              let fabricWidth = this.fabricCurtain.filter(a => a.name == this.item[i].fabric)[0]['size']
              let pleatShort = this.pleatlist.filter(a => a.name == this.item[i].pleat)[0]['name_short']

              items.push(
                [
                  { text: 'Curtain', fontSize: 8.5, decoration: 'underline' },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                ],
              )

              if (this.item[i].motorized_upgrade && (this.item[i].motorized_choice == 'Both' || this.item[i].motorized_choice == 'Curtain')) {
                items.push(
                  [
                    { text: width + '" ( W )' + ' x ' + height + '" ( H )' + ' ( ' + motorSides + ' )', fontSize: 8.5 },
                    { text: 'Motorized ' + this.item[i].motorized_power, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].bracket || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: width + '" ( W )' + ' x ' + CL_height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].fabric + (this.item[i].code_curtain ? '-' + this.item[i].code_curtain : ''), alignment: 'center', fontSize: 8.5 },
                    { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
                    { text: pleatShort, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].pieces_curtain, alignment: 'center', fontSize: 8.5 },
                    { text: curtainBelt, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].fullness, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].hook || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: this.calc[i].curtain.unit.toUpperCase(), alignment: 'center', fontSize: 8.5 },
                    { text: (this.item[i].remark_curtain || ''), fontSize: 8.5 }
                  ],
                )
              } else {
                items.push(
                  [
                    { text: width + '" ( W )' + ' x ' + height + '" ( H )', fontSize: 8.5 },
                    { text: this.item[i].track || '-', alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].bracket || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: width + '" ( W )' + ' x ' + CL_height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].fabric + (this.item[i].code_curtain ? '-' + this.item[i].code_curtain : ''), alignment: 'center', fontSize: 8.5 },
                    { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
                    { text: pleatShort, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].pieces_curtain, alignment: 'center', fontSize: 8.5 },
                    { text: curtainBelt, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].fullness, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].hook || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: this.calc[i].curtain.unit.toUpperCase(), alignment: 'center', fontSize: 8.5 },
                    { text: (this.item[i].remark_curtain || ''), fontSize: 8.5 }
                  ],
                )
              }



            }

            if (this.item[i].fabric_lining != null) {
              let fabricWidth = this.fabricLining.filter(a => a.name == this.item[i].fabric_lining)[0]['size']
              let pleatShort = this.pleatlist.filter(a => a.name == this.item[i].pleat)[0]['name_short']

              // items.push(
              //   [
              //     { text: 'Lining', fontSize: 8.5, decoration: 'underline' },
              //     { text: '', fontSize: 8.5 },
              //     { text: '', fontSize: 8.5 },
              //     { text: '', fontSize: 8.5 },
              //     { text: '', fontSize: 8.5 },
              //     { text: '', fontSize: 8.5 },
              //     { text: '', fontSize: 8.5 },
              //     { text: '', fontSize: 8.5 },
              //     { text: '', fontSize: 8.5 },
              //     { text: '', fontSize: 8.5 },
              //     { text: '', fontSize: 8.5 },
              //     { text: '', fontSize: 8.5 },
              //     { text: '', fontSize: 8.5 },
              //   ],
              // )

              items.push(
                [
                  // { text: width + '" ( W )' + ' x ' + height + '" ( H )', fontSize: 8.5 },
                  { text: 'Lining', fontSize: 8.5, decoration: 'underline' },
                  { text: this.item[i].motorized_upgrade && (this.item[i].motorized_choice == 'Both' || this.item[i].motorized_choice == 'Curtain') ? '-' : this.item[i].track, alignment: 'center', fontSize: 8.5 },
                  { text: this.item[i].bracket || 'X', alignment: 'center', fontSize: 8.5 },
                  // { text: width + '" ( W )' + ' x ' + CL_height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
                  { text: '-', bold: true, alignment: 'center', fontSize: 8.5 },
                  { text: this.item[i].fabric_lining + (this.item[i].code_lining ? '-' + this.item[i].code_lining : ''), alignment: 'center', fontSize: 8.5 },
                  { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
                  { text: pleatShort, alignment: 'center', fontSize: 8.5 },
                  { text: this.item[i].pieces_curtain, alignment: 'center', fontSize: 8.5 },
                  { text: curtainBelt, alignment: 'center', fontSize: 8.5 },
                  { text: '-', alignment: 'center', fontSize: 8.5 },
                  { text: '-', alignment: 'center', fontSize: 8.5 },
                  { text: this.calc[i].lining.unit.toUpperCase(), alignment: 'center', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 }
                ],
              )
            }

            if (this.item[i].fabric_sheer != null) {
              let fabricWidth = this.fabricSheer.filter(a => a.name == this.item[i].fabric_sheer)[0]['size']
              let pleatSheerShort = this.pleatlist.filter(a => a.name == this.item[i].pleat_sheer)[0]['name_short']

              items.push(
                [
                  { text: 'Sheer', fontSize: 8.5, decoration: 'underline' },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                ],
              )

              if (this.item[i].motorized_upgrade && (this.item[i].motorized_choice == 'Both' || this.item[i].motorized_choice == 'Sheer')) {
                items.push(
                  [
                    { text: width + '" ( W )' + ' x ' + height + '" ( H )' + ' ( ' + motorSides + ' )', fontSize: 8.5 },
                    { text: 'Motorized ' + this.item[i].motorized_power, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].sheer_bracket || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: width + '" ( W )' + ' x ' + S_height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].fabric_sheer + (this.item[i].code_sheer ? '-' + this.item[i].code_sheer : ''), alignment: 'center', fontSize: 8.5 },
                    { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
                    { text: pleatSheerShort, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].pieces_sheer, alignment: 'center', fontSize: 8.5 },
                    { text: sheerBelt, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].fullness_sheer, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].sheer_hook || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: this.calc[i].sheer.unit.toUpperCase(), alignment: 'center', fontSize: 8.5 },
                    { text: (this.item[i].remark_sheer || '') + (this.item[i].remark_sale ? ('\n\n *' + (this.item[i].remark_sale || '')) : '') + ((this.info.package_addon && this.info.package_location == this.item[i].no) ? ('\n *' + (this.packageApplied.add_name || '')) : ''), bold: true, fontSize: 8.5 }
                  ],
                )
              } else {
                items.push(
                  [
                    { text: width + '" ( W )' + ' x ' + height + '" ( H )', fontSize: 8.5 },
                    { text: this.item[i].track_sheer, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].sheer_bracket || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: width + '" ( W )' + ' x ' + S_height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].fabric_sheer + (this.item[i].code_sheer ? '-' + this.item[i].code_sheer : ''), alignment: 'center', fontSize: 8.5 },
                    { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
                    { text: pleatSheerShort, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].pieces_sheer, alignment: 'center', fontSize: 8.5 },
                    { text: sheerBelt, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].fullness_sheer, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].sheer_hook || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: this.calc[i].sheer.unit.toUpperCase(), alignment: 'center', fontSize: 8.5 },
                    { text: (this.item[i].remark_sheer || '') + (this.item[i].remark_sale ? ('\n\n *' + (this.item[i].remark_sale || '')) : '') + ((this.info.package_addon && this.info.package_location == this.item[i].no) ? ('\n *' + (this.packageApplied.add_name || '')) : ''), bold: true, fontSize: 8.5 }
                  ],
                )
              }
            }

            items.push(
              [
                { text: ' ', fontSize: 8.5 },
                { text: ' ', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
              ],
            )
          }

        } else {

          if (this.item[i].type == '1') {

            if (this.item[i].fabric_type == 'C') {

              if (this.item[i].fabric != null) {
                let fabricWidth = this.fabricCurtain.filter(a => a.name == this.item[i].fabric)[0]['size']
                // let pleatShort = this.pleatlist.filter(a => a.name == this.item[i].pleat)[0]['name_short']

                items.push(
                  [
                    { text: 'Supply Fabric Only', bold: true, fontSize: 8.5, decoration: 'underline' },
                    { text: '', fontSize: 8.5 },
                    { text: '', fontSize: 8.5 },
                    { text: '', fontSize: 8.5 },
                    { text: '', fontSize: 8.5 },
                    { text: '', fontSize: 8.5 },
                    { text: '', fontSize: 8.5 },
                    { text: '', fontSize: 8.5 },
                    { text: '', fontSize: 8.5 },
                    { text: '', fontSize: 8.5 },
                    { text: '', fontSize: 8.5 },
                    { text: '', fontSize: 8.5 },
                    { text: '', fontSize: 8.5 },

                  ],
                )

                items.push(
                  [
                    { text: 'x', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].fabric + (this.item[i].code_curtain ? '-' + this.item[i].code_curtain : ''), alignment: 'center', fontSize: 8.5 },
                    { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].pieces_curtain + 'm\n' + ((this.item[i].remark_curtain || '') + (this.item[i].remark_sale ? ('\n\n *' + (this.item[i].remark_sale || '')) : '')) + ((this.info.package_addon && this.info.package_location == this.item[i].no) ? ('\n *' + (this.packageApplied.add_name || '')) : ''), bold: true, fontSize: 8.5 }
                  ],
                )

              }

              items.push(
                [
                  { text: ' ', fontSize: 8.5 },
                  { text: ' ', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                ],
              )

            } else if (this.item[i].fabric_type == 'S') {

              if (this.item[i].fabric_sheer != null) {
                let fabricWidth = this.fabricSheer.filter(a => a.name == this.item[i].fabric_sheer)[0]['size']
                // let pleatSheerShort = this.pleatlist.filter(a => a.name == this.item[i].pleat_sheer)[0]['name_short']

                items.push(
                  [
                    { text: 'Supply Fabric Only', bold: true, fontSize: 8.5, decoration: 'underline' },
                    { text: '', fontSize: 8.5 },
                    { text: '', fontSize: 8.5 },
                    { text: '', fontSize: 8.5 },
                    { text: '', fontSize: 8.5 },
                    { text: '', fontSize: 8.5 },
                    { text: '', fontSize: 8.5 },
                    { text: '', fontSize: 8.5 },
                    { text: '', fontSize: 8.5 },
                    { text: '', fontSize: 8.5 },
                    { text: '', fontSize: 8.5 },
                    { text: '', fontSize: 8.5 },
                    { text: '', fontSize: 8.5 },

                  ],
                )

                items.push(
                  [
                    { text: 'x', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].fabric_sheer + (this.item[i].code_sheer ? '-' + this.item[i].code_sheer : ''), alignment: 'center', fontSize: 8.5 },
                    { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].pieces_sheer + 'm\n' + (this.item[i].remark_sheer || '') + (this.item[i].remark_sale ? ('\n\n *' + (this.item[i].remark_sale || '')) : '') + ((this.info.package_addon && this.info.package_location == this.item[i].no) ? ('\n *' + (this.packageApplied.add_name || '')) : ''), bold: true, fontSize: 8.5 }
                  ],
                )

              }

              items.push(
                [
                  { text: ' ', fontSize: 8.5 },
                  { text: ' ', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                ],
              )

            } else if (this.item[i].fabric_type == 'CS') {

              items.push(
                [
                  { text: 'Supply Fabric Only', bold: true, fontSize: 8.5, decoration: 'underline' },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },

                ],
              )

              if (this.item[i].fabric != null) {
                let fabricWidth = this.fabricCurtain.filter(a => a.name == this.item[i].fabric)[0]['size']
                // let pleatShort = this.pleatlist.filter(a => a.name == this.item[i].pleat)[0]['name_short']

                items.push(
                  [
                    { text: 'x', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].fabric + (this.item[i].code_curtain ? '-' + this.item[i].code_curtain : ''), alignment: 'center', fontSize: 8.5 },
                    { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].pieces_curtain + 'm\n' + ((this.item[i].remark_curtain || '') + (this.item[i].remark_sale ? ('\n\n *' + (this.item[i].remark_sale || '')) : '')) + ((this.info.package_addon && this.info.package_location == this.item[i].no) ? ('\n *' + (this.packageApplied.add_name || '')) : ''), bold: true, fontSize: 8.5 }
                  ],
                )

              }

              if (this.item[i].fabric_sheer != null) {
                let fabricWidth = this.fabricSheer.filter(a => a.name == this.item[i].fabric_sheer)[0]['size']
                // let pleatSheerShort = this.pleatlist.filter(a => a.name == this.item[i].pleat_sheer)[0]['name_short']

                items.push(
                  [
                    { text: 'x', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].fabric_sheer + (this.item[i].code_sheer ? '-' + this.item[i].code_sheer : ''), alignment: 'center', fontSize: 8.5 },
                    { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].pieces_sheer + 'm\n' + (this.item[i].remark_sheer || '') + (this.item[i].remark_sale ? ('\n\n *' + (this.item[i].remark_sale || '')) : '') + ((this.info.package_addon && this.info.package_location == this.item[i].no) ? ('\n *' + (this.packageApplied.add_name || '')) : ''), bold: true, fontSize: 8.5 }
                  ],
                )

              }

              items.push(
                [
                  { text: ' ', fontSize: 8.5 },
                  { text: ' ', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                ],
              )
            }

          } else if (this.item[i].type == '2') {
            // let fabricWidth = this.fabricCurtain.filter(a => a.name == this.item[i].fabric)[0]['size']
            // let pleatShort = this.pleatlist.filter(a => a.name == this.item[i].pleat)[0]['name_short']

            items.push(
              [
                { text: 'Supply Track Only', bold: true, fontSize: 8.5, decoration: 'underline' },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
              ],
            )

            items.push(
              [
                { text: width + '"', fontSize: 8.5 },
                { text: this.item[i].track || '-', alignment: 'center', fontSize: 8.5 },
                { text: this.item[i].bracket || 'X', alignment: 'center', fontSize: 8.5 },
                { text: 'x', alignment: 'center', fontSize: 8.5 },
                { text: 'x', alignment: 'center', fontSize: 8.5 },
                { text: 'x', alignment: 'center', fontSize: 8.5 },
                { text: 'x', alignment: 'center', fontSize: 8.5 },
                { text: 'x', alignment: 'center', fontSize: 8.5 },
                { text: 'x', alignment: 'center', fontSize: 8.5 },
                { text: 'x', alignment: 'center', fontSize: 8.5 },
                { text: 'x', alignment: 'center', fontSize: 8.5 },
                { text: 'x', alignment: 'center', fontSize: 8.5 },
                { text: '1 pcs\n' + (this.item[i].remark_sale ? ('\n\n *' + (this.item[i].remark_sale || '')) : '') + ((this.info.package_addon && this.info.package_location == this.item[i].no) ? ('\n *' + (this.packageApplied.add_name || '')) : ''), bold: true, fontSize: 8.5 }
              ],
            )

            items.push(
              [
                { text: ' ', fontSize: 8.5 },
                { text: ' ', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
              ],
            )

          } else if (this.item[i].type == '3') {

            items.push(
              [
                { text: 'Supply Accessories Only', bold: true, fontSize: 8.5, decoration: 'underline' },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
              ],
            )

            for (let j = 0; j < this.item[i].accessories.length; j++) {

              let temp = this.item[i].accessories[j]
              items.push(
                [
                  { text: temp.acce_title + ' ( ' + temp.acce_selected.name + ' )', fontSize: 8.5 },
                  { text: 'x', alignment: 'center', fontSize: 8.5 },
                  { text: 'x', alignment: 'center', fontSize: 8.5 },
                  { text: 'x', alignment: 'center', fontSize: 8.5 },
                  { text: 'x', alignment: 'center', fontSize: 8.5 },
                  { text: 'x', alignment: 'center', fontSize: 8.5 },
                  { text: 'x', alignment: 'center', fontSize: 8.5 },
                  { text: 'x', alignment: 'center', fontSize: 8.5 },
                  { text: 'x', alignment: 'center', fontSize: 8.5 },
                  { text: 'x', alignment: 'center', fontSize: 8.5 },
                  { text: 'x', alignment: 'center', fontSize: 8.5 },
                  { text: 'x', alignment: 'center', fontSize: 8.5 },
                  { text: temp.acce_quantity + ' pcs' + ((this.item[i].remark_sale && (j == this.item[i].accessories.length - 1)) ? ('\n\n *' + (this.item[i].remark_sale || '')) : '') + ((this.info.package_addon && this.info.package_location == this.item[i].no) ? ('\n *' + (this.packageApplied.add_name || '')) : ''), bold: true, fontSize: 8.5 }
                ],
              )

            }

            items.push(
              [
                { text: ' ', fontSize: 8.5 },
                { text: ' ', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
              ],
            )

          } else if (this.item[i].type == '4') {

            // items.push(
            //   [
            //     { text: 'Supply & Install Motor Track Only ( ' + this.item[i].motorized_choice + ' )', fontSize: 8.5, decoration: 'underline' },
            //     { text: '', fontSize: 8.5 },
            //     { text: '', fontSize: 8.5 },
            //     { text: '', fontSize: 8.5 },
            //     { text: '', fontSize: 8.5 },
            //     { text: '', fontSize: 8.5 },
            //     { text: '', fontSize: 8.5 },
            //     { text: '', fontSize: 8.5 },
            //     { text: '', fontSize: 8.5 },
            //     { text: '', fontSize: 8.5 },
            //     { text: '', fontSize: 8.5 },
            //     { text: '', fontSize: 8.5 },
            //     { text: '', fontSize: 8.5 },
            //   ],
            // )

            items.push(
              [
                { text: 'Supply & Install Motor Track Only ( ' + this.item[i].motorized_choice + ' )', fontSize: 8.5 },
                { text: 'Motorized ' + this.item[i].motorized_power, alignment: 'center', fontSize: 8.5 },
                { text: this.item[i].bracket || 'X', alignment: 'center', fontSize: 8.5 },
                { text: 'x', alignment: 'center', fontSize: 8.5 },
                { text: 'x', alignment: 'center', fontSize: 8.5 },
                { text: 'x', alignment: 'center', fontSize: 8.5 },
                { text: 'x', alignment: 'center', fontSize: 8.5 },
                { text: 'x', alignment: 'center', fontSize: 8.5 },
                { text: 'x', alignment: 'center', fontSize: 8.5 },
                { text: 'x', alignment: 'center', fontSize: 8.5 },
                { text: 'x', alignment: 'center', fontSize: 8.5 },
                { text: 'x', alignment: 'center', fontSize: 8.5 },
                { text: this.item[i].motorized_pieces + ' pcs' + (this.item[i].remark_sale ? ('\n\n *' + (this.item[i].remark_sale || '')) : '') + ((this.info.package_addon && this.info.package_location == this.item[i].no) ? ('\n *' + (this.packageApplied.add_name || '')) : ''), bold: true, fontSize: 8.5 }
              ],
            )

            items.push(
              [
                { text: ' ', fontSize: 8.5 },
                { text: ' ', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
              ],
            )

          } else if (this.item[i].type == '5') {

            items.push(
              [
                { text: 'Sewing ' + ((this.item[i].track || this.item[i].track_sheer) ? '& Supply Track' : 'Only'), bold: true, fontSize: 8.5, decoration: 'underline' },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },

              ],
            )

            if (this.item[i].fabric_type == 'C') {

              let fabricWidth = ''
              let pleatShort = this.pleatlist.filter(a => a.name == this.item[i].pleat)[0]['name_short']

              items.push(
                [
                  { text: 'Curtain', fontSize: 8.5, decoration: 'underline' },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },

                ],
              )

              if (this.item[i].motorized_upgrade && (this.item[i].motorized_choice == 'Both' || this.item[i].motorized_choice == 'Curtain')) {
                items.push(
                  [
                    { text: width + '" ( W )' + ' x ' + height + '" ( H )' + ' ( ' + motorSides + ' )', fontSize: 8.5 },
                    { text: 'Motorized ' + this.item[i].motorized_power, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].bracket || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: width + '" ( W )' + ' x ' + CL_height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
                    { text: 'Client Own Fabric (Alter)', alignment: 'center', fontSize: 8.5 },
                    { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
                    { text: pleatShort, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].pieces_curtain || 'x', alignment: 'center', fontSize: 8.5 },
                    { text: curtainBelt, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].fullness, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].hook || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: (this.item[i].remark_curtain || '') + (this.item[i].remark_sale ? ('\n\n *' + (this.item[i].remark_sale || '')) : '') + ((this.info.package_addon && this.info.package_location == this.item[i].no) ? ('\n *' + (this.packageApplied.add_name || '')) : ''), bold: true, fontSize: 8.5 }
                  ],
                )
              } else {
                items.push(
                  [
                    { text: width + '" ( W )' + ' x ' + height + '" ( H )', fontSize: 8.5 },
                    { text: this.item[i].track || '-', alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].bracket || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: width + '" ( W )' + ' x ' + CL_height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
                    { text: 'Client Own Fabric (Alter)', alignment: 'center', fontSize: 8.5 },
                    { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
                    { text: pleatShort, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].pieces_curtain || 'x', alignment: 'center', fontSize: 8.5 },
                    { text: curtainBelt, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].fullness, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].hook || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: 'P/M', alignment: 'center', fontSize: 8.5 },
                    { text: (this.item[i].remark_curtain || '') + (this.item[i].remark_sale ? ('\n\n *' + (this.item[i].remark_sale || '')) : '') + ((this.info.package_addon && this.info.package_location == this.item[i].no) ? ('\n *' + (this.packageApplied.add_name || '')) : ''), bold: true, fontSize: 8.5 }
                  ],
                )
              }

              items.push(
                [
                  { text: ' ', fontSize: 8.5 },
                  { text: ' ', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                ],
              )

            } else if (this.item[i].fabric_type == 'S') {

              let fabricWidth = ''
              let pleatSheerShort = this.pleatlist.filter(a => a.name == this.item[i].pleat_sheer)[0]['name_short']

              items.push(
                [
                  { text: 'Sheer', fontSize: 8.5, decoration: 'underline' },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                ],
              )

              if (this.item[i].motorized_upgrade && (this.item[i].motorized_choice == 'Both' || this.item[i].motorized_choice == 'Sheer')) {
                items.push(
                  [
                    { text: width + '" ( W )' + ' x ' + height + '" ( H )' + ' ( ' + motorSides + ' )', fontSize: 8.5 },
                    { text: 'Motorized ' + this.item[i].motorized_power, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].sheer_bracket || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: width + '" ( W )' + ' x ' + S_height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
                    { text: 'Client Own Fabric (Alter)', alignment: 'center', fontSize: 8.5 },
                    { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
                    { text: pleatSheerShort, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].pieces_sheer || 'x', alignment: 'center', fontSize: 8.5 },
                    { text: sheerBelt, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].fullness_sheer, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].sheer_hook || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: (this.item[i].remark_sheer || '') + (this.item[i].remark_sale ? ('\n\n *' + (this.item[i].remark_sale || '')) : '') + ((this.info.package_addon && this.info.package_location == this.item[i].no) ? ('\n *' + (this.packageApplied.add_name || '')) : ''), bold: true, fontSize: 8.5 }
                  ],
                )
              } else {
                items.push(
                  [
                    { text: width + '" ( W )' + ' x ' + height + '" ( H )', fontSize: 8.5 },
                    { text: this.item[i].track_sheer || '-', alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].sheer_bracket || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: width + '" ( W )' + ' x ' + S_height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
                    { text: 'Client Own Fabric (Alter)', alignment: 'center', fontSize: 8.5 },
                    { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
                    { text: pleatSheerShort, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].pieces_sheer || 'x', alignment: 'center', fontSize: 8.5 },
                    { text: sheerBelt, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].fullness_sheer, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].sheer_hook || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: (this.item[i].remark_sheer || '') + (this.item[i].remark_sale ? ('\n\n *' + (this.item[i].remark_sale || '')) : '') + ((this.info.package_addon && this.info.package_location == this.item[i].no) ? ('\n *' + (this.packageApplied.add_name || '')) : ''), bold: true, fontSize: 8.5 }
                  ],
                )
              }

              items.push(
                [
                  { text: ' ', fontSize: 8.5 },
                  { text: ' ', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                ],
              )
            } else if (this.item[i].fabric_type == 'CS') {
              let fabricWidth = ''
              let pleatShort = this.pleatlist.filter(a => a.name == this.item[i].pleat)[0]['name_short']

              items.push(
                [
                  { text: 'Curtain', fontSize: 8.5, decoration: 'underline' },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                ],
              )

              if (this.item[i].motorized_upgrade && (this.item[i].motorized_choice == 'Both' || this.item[i].motorized_choice == 'Curtain')) {
                items.push(
                  [
                    { text: width + '" ( W )' + ' x ' + height + '" ( H )' + ' ( ' + motorSides + ' )', fontSize: 8.5 },
                    { text: 'Motorized ' + this.item[i].motorized_power, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].bracket || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: width + '" ( W )' + ' x ' + CL_height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
                    { text: 'Client Own Fabric (Alter)', alignment: 'center', fontSize: 8.5 },
                    { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
                    { text: pleatShort, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].pieces_curtain || 'x', alignment: 'center', fontSize: 8.5 },
                    { text: curtainBelt, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].fullness, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].hook || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: (this.item[i].remark_curtain || ''), fontSize: 8.5 }
                  ],
                )
              } else {
                items.push(
                  [
                    { text: width + '" ( W )' + ' x ' + height + '" ( H )', fontSize: 8.5 },
                    { text: this.item[i].track || '-', alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].bracket || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: width + '" ( W )' + ' x ' + CL_height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
                    { text: 'Client Own Fabric (Alter)', alignment: 'center', fontSize: 8.5 },
                    { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
                    { text: pleatShort, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].pieces_curtain || 'x', alignment: 'center', fontSize: 8.5 },
                    { text: curtainBelt, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].fullness, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].hook || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: (this.item[i].remark_curtain || ''), fontSize: 8.5 }
                  ],
                )
              }

              // let fabricWidth = ''
              let pleatSheerShort = this.pleatlist.filter(a => a.name == this.item[i].pleat_sheer)[0]['name_short']

              items.push(
                [
                  { text: 'Sheer', fontSize: 8.5, decoration: 'underline' },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                ],
              )

              if (this.item[i].motorized_upgrade && (this.item[i].motorized_choice == 'Both' || this.item[i].motorized_choice == 'Sheer')) {
                items.push(
                  [
                    { text: width + '" ( W )' + ' x ' + height + '" ( H )' + ' ( ' + motorSides + ' )', fontSize: 8.5 },
                    { text: 'Motorized ' + this.item[i].motorized_power, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].sheer_bracket || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: width + '" ( W )' + ' x ' + S_height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
                    { text: 'Client Own Fabric (Alter)', alignment: 'center', fontSize: 8.5 },
                    { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
                    { text: pleatSheerShort, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].pieces_sheer || 'x', alignment: 'center', fontSize: 8.5 },
                    { text: sheerBelt, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].fullness_sheer, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].sheer_hook || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: (this.item[i].remark_sheer || '') + (this.item[i].remark_sale ? ('\n\n *' + (this.item[i].remark_sale || '')) : '') + ((this.info.package_addon && this.info.package_location == this.item[i].no) ? ('\n *' + (this.packageApplied.add_name || '')) : ''), bold: true, fontSize: 8.5 }
                  ],
                )
              } else {
                items.push(
                  [
                    { text: width + '" ( W )' + ' x ' + height + '" ( H )', fontSize: 8.5 },
                    { text: this.item[i].track_sheer, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].sheer_bracket || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: width + '" ( W )' + ' x ' + S_height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
                    { text: 'Client Own Fabric (Alter)', alignment: 'center', fontSize: 8.5 },
                    { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
                    { text: pleatSheerShort, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].pieces_sheer || 'x', alignment: 'center', fontSize: 8.5 },
                    { text: sheerBelt, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].fullness_sheer, alignment: 'center', fontSize: 8.5 },
                    { text: this.item[i].sheer_hook || 'X', alignment: 'center', fontSize: 8.5 },
                    { text: 'x', alignment: 'center', fontSize: 8.5 },
                    { text: (this.item[i].remark_sheer || '') + (this.item[i].remark_sale ? ('\n\n *' + (this.item[i].remark_sale || '')) : '') + ((this.info.package_addon && this.info.package_location == this.item[i].no) ? ('\n *' + (this.packageApplied.add_name || '')) : ''), bold: true, fontSize: 8.5 }
                  ],
                )
              }

              items.push(
                [
                  { text: ' ', fontSize: 8.5 },
                  { text: ' ', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                  { text: '', fontSize: 8.5 },
                ],
              )
            }

          } else if (this.item[i].type == '6') {

            items.push(
              [
                { text: 'Supply Wallpaper', bold: true, fontSize: 8.5, decoration: 'underline' },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
              ],
            )

            let temp = this.item[i].wallpaper
            items.push(
              [
                { text: 'x', alignment: 'center', fontSize: 8.5 },
                { text: 'x', alignment: 'center', fontSize: 8.5 },
                { text: 'x', alignment: 'center', fontSize: 8.5 },
                { text: 'x', alignment: 'center', fontSize: 8.5 },
                { text: ['Wallpaper\n', { text: temp.name, bold: false }], alignment: 'center', bold: true, fontSize: 8.5 },
                { text: 'x', alignment: 'center', fontSize: 8.5 },
                { text: 'x', alignment: 'center', fontSize: 8.5 },
                { text: 'x', alignment: 'center', fontSize: 8.5 },
                { text: 'x', alignment: 'center', fontSize: 8.5 },
                { text: 'x', alignment: 'center', fontSize: 8.5 },
                { text: 'x', alignment: 'center', fontSize: 8.5 },
                { text: 'x', alignment: 'center', fontSize: 8.5 },
                { text: temp.quantity + ' ' + temp.unit + (this.item[i].remark_sale ? ('\n\n *' + (this.item[i].remark_sale || '')) : '') + ((this.info.package_addon && this.info.package_location == this.item[i].no) ? ('\n *' + (this.packageApplied.add_name || '')) : ''), bold: true, fontSize: 8.5 }
              ],
            )

            items.push(
              [
                { text: ' ', fontSize: 8.5 },
                { text: ' ', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
              ],
            )

          }

        }

      } else if (this.item[i].type == 'Blinds') {

        if (this.item[i].fabric_blind != null && this.item[i].pleat != 'Roman Blind') {
          let fabricWidth = this.fabricBlind.filter(a => a.name == this.item[i].fabric_blind)[0]['size']

          items.push(
            [
              { text: this.item[i].pleat, fontSize: 8.5, decoration: 'underline' },
              { text: '', fontSize: 8.5 },
              { text: '', fontSize: 8.5 },
              { text: '', fontSize: 8.5 },
              { text: '', fontSize: 8.5 },
              { text: '', fontSize: 8.5 },
              { text: '', fontSize: 8.5 },
              { text: '', fontSize: 8.5 },
              { text: '', fontSize: 8.5 },
              { text: '', fontSize: 8.5 },
              { text: '', fontSize: 8.5 },
              { text: '', fontSize: 8.5 },
              { text: '', fontSize: 8.5 },
            ],
          )

          items.push(
            [
              { text: width + '" ( W )' + ' x ' + height + '" ( H ) ' + (this.item[i].rope_chain ? ' (' + rope_chain + ')' : ''), fontSize: 8.5 },
              { text: 'x', alignment: 'center', fontSize: 8.5 },
              { text: this.item[i].bracket || 'x', alignment: 'center', fontSize: 8.5 },
              { text: width + '" ( W )' + ' x ' + height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
              { text: this.item[i].fabric_blind + (this.item[i].code_blind ? '-' + this.item[i].code_blind : '') + (this.item[i].blind_tape ? ' + ' + (this.item[i].blind_tape.includes('Tape') ? '' : 'Tape ') + this.item[i].blind_tape : '') + (this.item[i].blind_easylift ? ' + Easy Lift System' : ''), alignment: 'center', fontSize: 8.5 },
              { text: 'x', alignment: 'center', fontSize: 8.5 },
              { text: 'x', alignment: 'center', fontSize: 8.5 },
              { text: this.item[i].pieces_blind, alignment: 'center', fontSize: 8.5 },
              { text: 'x', alignment: 'center', fontSize: 8.5 },
              { text: 'x', alignment: 'center', fontSize: 8.5 },
              { text: 'x', alignment: 'center', fontSize: 8.5 },
              { text: 'x', alignment: 'center', fontSize: 8.5 },
              { text: (this.item[i].remark_sale || ''), bold: true, fontSize: 8.5 }
            ],
          )

        }

        if (this.item[i].pleat == 'Roman Blind') {

          if (this.item[i].fabric != null) {
            let fabricWidth = this.fabricCurtain.filter(a => a.name == this.item[i].fabric)[0]['size']

            items.push(
              [
                { text: 'Roman Blind', fontSize: 8.5, decoration: 'underline' },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
                { text: '', fontSize: 8.5 },
              ],
            )

            items.push(
              [
                { text: width + '" ( W )' + ' x ' + height + '" ( H ) ' + (this.item[i].rope_chain ? ' (' + rope_chain + ')' : ''), fontSize: 8.5 },
                { text: 'Roman Blind', alignment: 'center', fontSize: 8.5 },
                { text: this.item[i].bracket || 'X', alignment: 'center', fontSize: 8.5 },
                { text: width + '" ( W )' + ' x ' + height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
                { text: this.item[i].fabric + (this.item[i].code_curtain ? '-' + this.item[i].code_curtain : ''), alignment: 'center', fontSize: 8.5 },
                { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
                { text: '-', alignment: 'center', fontSize: 8.5 },
                { text: this.item[i].pieces_blind, alignment: 'center', fontSize: 8.5 },
                { text: curtainBelt, alignment: 'center', fontSize: 8.5 },
                { text: '-', alignment: 'center', fontSize: 8.5 },
                { text: '-', alignment: 'center', fontSize: 8.5 },
                { text: this.calc[i].curtain.unit.toUpperCase(), alignment: 'center', fontSize: 8.5 },
                { text: (this.item[i].remark_sale || ''), bold: true, fontSize: 8.5 }
                // { text: '', fontSize: 8.5 }
              ],
            )
          }

        }

        if (this.item[i].fabric_lining != null) {
          let fabricWidth = this.fabricLining.filter(a => a.name == this.item[i].fabric_lining)[0]['size']
          // let pleatShort = this.pleatlist.filter(a => a.name == this.item[i].pleat)[0]['name_short']

          // items.push(
          //   [
          //     { text: 'Lining', fontSize: 8.5, decoration: 'underline' },
          //     { text: '', fontSize: 8.5 },
          //     { text: '', fontSize: 8.5 },
          //     { text: '', fontSize: 8.5 },
          //     { text: '', fontSize: 8.5 },
          //     { text: '', fontSize: 8.5 },
          //     { text: '', fontSize: 8.5 },
          //     { text: '', fontSize: 8.5 },
          //     { text: '', fontSize: 8.5 },
          //     { text: '', fontSize: 8.5 },
          //     { text: '', fontSize: 8.5 },
          //     { text: '', fontSize: 8.5 },
          //     { text: '', fontSize: 8.5 },
          //   ],
          // )

          items.push(
            [
              // { text: width + '" ( W )' + ' x ' + height + '" ( H )', fontSize: 8.5 },
              { text: 'Lining', fontSize: 8.5, decoration: 'underline' },
              { text: '-', alignment: 'center', fontSize: 8.5 },
              { text: this.item[i].bracket || 'X', alignment: 'center', fontSize: 8.5 },
              // { text: width + '" ( W )' + ' x ' + height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
              { text: '', bold: true, alignment: 'center', fontSize: 8.5 },
              { text: this.item[i].fabric_lining + (this.item[i].code_lining ? '-' + this.item[i].code_lining : ''), alignment: 'center', fontSize: 8.5 },
              { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
              { text: '-', alignment: 'center', fontSize: 8.5 },
              { text: this.item[i].pieces_blind, alignment: 'center', fontSize: 8.5 },
              { text: curtainBelt, alignment: 'center', fontSize: 8.5 },
              { text: '-', alignment: 'center', fontSize: 8.5 },
              { text: '-', alignment: 'center', fontSize: 8.5 },
              { text: this.calc[i].lining.unit.toUpperCase(), alignment: 'center', fontSize: 8.5 },
              { text: '', fontSize: 8.5 }
            ],
          )
        }

        items.push(
          [
            { text: ' ', fontSize: 8.5 },
            { text: ' ', fontSize: 8.5 },
            { text: '', fontSize: 8.5 },
            { text: '', fontSize: 8.5 },
            { text: '', fontSize: 8.5 },
            { text: '', fontSize: 8.5 },
            { text: '', fontSize: 8.5 },
            { text: '', fontSize: 8.5 },
            { text: '', fontSize: 8.5 },
            { text: '', fontSize: 8.5 },
            { text: '', fontSize: 8.5 },
            { text: '', fontSize: 8.5 },
            { text: '', fontSize: 8.5 },
          ],
        )
      }
    }
    console.log(items);

    var dd = {
      pageOrientation: 'landscape',

      header: function (currentPage, pageCount, pageSize) {
        // you can apply any logic and return any valid pdfmake element

        return [
          {
            columns: [
              [
                {
                  alignment: 'left',
                  text: 'Crystalace Deco Sdn Bhd (959240-H)',
                  fontSize: 14,
                  bold: true,
                  width: '60%',
                  margin: [20, 10, 0, 0]
                },
                {
                  width: '50%',
                  margin: [20, 0, 0, 0],
                  table: {
                    widths: ['30%', '70%'],
                    body: soinfoleft
                  },
                },
              ],
              [
                {
                  alignment: 'right',
                  text: sonum,
                  fontSize: 14,
                  bold: true,
                  width: '30%',
                  margin: [0, 10, 20, 0],
                },
                {
                  width: '30%',
                  margin: [20, 0, 0, 0],
                  table: {
                    widths: ['52%', '40%'],
                    body: soinforight
                  },
                },
                {
                  alignment: 'right',
                  text: 'SALES ORDER FORM',
                  fontSize: 14,
                  bold: true,
                  width: '30%',
                  margin: [0, 5, 80, 0],
                },
              ]

            ]
          },
          { canvas: [{ type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 }] }
        ]
      },

      content: [
        // 		NON_DETAILED QUOTATION START
        {
          width: '100%',
          table: {
            headerRows: 1,
            //  dontBreakRows: true,
            //  keepWithHeaderRows: 1,
            widths: ['17%', '7%', '5%', '15%', '12%', '4%', '3%', '3%', '5%', '5%', '4%', '4%', '16%'],
            body: items
          },
          layout: {
            hLineWidth: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 1 : 1;
            },
            hLineColor: function (i, node) {
              return (i === 0 || i === node.table.body.length || i === 1) ? 'black' : 'white';
            },
          }
        },
        // 	    NON_DETAILED QUOTATION END
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      },
      defaultStyle: {
        columnGap: 20
      },
      pageMargins: [20, 145, 20, 60]

    }

    this.pdfObj = pdfMake.createPdf(dd);
    this.uploadSoPdf()
  }

  uploadSoPdf() {
    this.pdfObj.getBuffer((buffer) => {
      var blob = new Blob([buffer], { type: 'application/pdf' });

      this.toBase64(blob).then(data => {
        console.log(data)
        this.http.post('https://forcar.vsnap.my/uploadPDF', { base64: data }).subscribe((link) => {
          console.log(link['imageURL']);

          this.info.so_pdf.push({ name: (this.info.so_pdf.length + 1) + '_' + this.soNum + ' ' + this.datepipe.transform(new Date(), 'dd/MM/yyyy hh:mm:ss a'), link: link['imageURL'] })

          let temp = [] as any
          if (this.info.sales_confirmed_date != null) {
            temp = {
              no: this.info.no,
              so_pdf: JSON.stringify(this.info.so_pdf),
              sales_so_id: this.soNumDigit,
              customer_nric: this.info.customer_nric
            }
          } else {
            temp = {
              no: this.info.no,
              so_pdf: JSON.stringify(this.info.so_pdf),
              sales_confirmed_date: new Date().getTime(),
              sales_so_id: this.soNumDigit,
              customer_nric: this.info.customer_nric
            }
          }


          this.http.post('https://curtain.vsnap.my/updatesales', temp).subscribe(a => {
            // this.pdfmakerClient(true)
            // window.open(link['imageURL'], '_system');
            Swal.fire({
              icon: 'success',
              title: 'SO Generated Successfully.',
              heightAuto: false,
              showConfirmButton: false,
              timer: 2500,
            })

            this.safariViewController.isAvailable()
              .then(async (available: boolean) => {
                if (available) {

                  this.safariViewController.show({
                    url: link['imageURL'],
                  })
                    .subscribe((result: any) => {
                      if (result.event === 'opened') console.log('Opened');
                      else if (result.event === 'loaded') console.log('Loaded');
                      else if (result.event === 'closed') console.log('Closed');
                    },
                      (error: any) => console.error(error)
                    );

                } else {
                  window.open(link['imageURL'], '_system');
                  // use fallback browser, example InAppBrowser
                }
              }).catch(async (error) => {
                window.open(link['imageURL'], '_system');
              })

            this.isCreateSo = false
            this.nav.navigateRoot('/tabs/tab1')
          })

        }, awe => {
          console.log(awe);
        })
      });

    })
  }

  pdfmaker(pass) {
    console.log(this.info);

    let customer_info = []
    let today = new Date()
    let width = null
    let height = null

    //Customer
    let ci = ''
    ci = this.info.customer_name + '\n\n\n' + this.info.customer_address + '\n\n\n' + this.info.customer_phone + '\n '

    customer_info.push(ci)

    //Quotation info
    let quoinfo = [
      [{ text: 'Ref:', alignment: 'center' }, { text: 'Date:', alignment: 'center' }],
      [{ text: this.quoRef, alignment: 'center' }, { text: this.quoDate, alignment: 'center' }],
      [{ text: '' }, { text: 'Validity:', alignment: 'center' }],
      [{ text: '' }, { text: this.quoValidity, alignment: 'center' }],
      [{ text: 'Sales:', alignment: 'center', border: [true, true, false, true] }, { text: 'Prepared by:', alignment: 'center', border: [false, true, true, true] }],
      [{ text: this.quoSales + '\n' + this.quoPhone, alignment: 'center', border: [true, true, false, true] }, { text: '', border: [false, true, true, true] }],
    ]

    //Items
    let items = [
      [
        { text: 'Description', bold: true },
        { text: 'Unit', alignment: 'center', bold: true },
        { text: 'Qty', alignment: 'center', bold: true },
        { text: 'Rate (RM)', alignment: 'center', bold: true },
        { text: 'Total (RM)', alignment: 'center', bold: true }
      ]
    ] as any

    for (let i = 0; i < this.item.length; i++) {

      if (this.item[i].height_tech != null || this.item[i].width_tech != null) {
        if (this.item[i].status_tech == 'Approved' && this.item[i].status_sale == 'Completed') {
          width = this.item[i].width
          height = this.item[i].height
        } else {
          width = this.item[i].width_tech
          height = this.item[i].height_tech
        }

      } else {
        width = this.item[i].width
        height = this.item[i].height
      }

      if (this.item[i].type == '1' || this.item[i].type == '2' || this.item[i].type == '3' || this.item[i].type == '4' || this.item[i].type == '5' || this.item[i].type == '6') {
        items.push(
          [
            {
              text: 'A La Carte - ' + (this.item[i].type == '1' ? 'Supply Fabrics Only' : this.item[i].type == '2' ? 'Supply Track Only' : this.item[i].type == '3' ? 'Supply Accessories' :
                this.item[i].type == '4' ? 'Supply & Install Motorised Track' : this.item[i].type == '5' ? 'Sewing ' + ((this.item[i].track || this.item[i].track_sheer) ? '& Track' : 'Only') :
                  this.item[i].type == '6' ? 'Supply Wallpaper Only' : ''),
              border: [true, false, true, false], bold: true, decoration: 'underline'
            },
            { text: '', alignment: 'center', border: [true, false, true, false] },
            { text: '', alignment: 'center', border: [true, false, true, false] },
            { text: '', alignment: 'right', border: [true, false, true, false] },
            { text: '', alignment: 'right', border: [true, false, true, false] }
          ]
        )
      }

      if (this.item[i].type == 'Tailor-Made Curtains' || this.item[i].type == 'Blinds' || this.item[i].type == '4') {
        items.push(
          [
            { text: this.item[i].location + (this.item[i].location_ref ? ' - ' + this.item[i].location_ref : ''), border: [true, false, true, false], bold: true, decoration: 'underline' },
            { text: '', alignment: 'center', border: [true, false, true, false] },
            { text: '', alignment: 'center', border: [true, false, true, false] },
            { text: '', alignment: 'right', border: [true, false, true, false] },
            { text: '', alignment: 'right', border: [true, false, true, false] }
          ]
        )
      }

      if (this.item[i].type == 'Tailor-Made Curtains' || this.item[i].type == 'Blinds' || this.item[i].type == '5') {
        items.push(
          [
            { text: width + '"(w)' + ' x ' + height + '"(h)' + (this.item[i].pleat == 'Roller Blind' ? " (" + (this.item[i].rope_chain == 'Right' ? "R" : "L") + ")" : ""), border: [true, false, true, false] },
            { text: '', alignment: 'center', border: [true, false, true, false] },
            { text: '', alignment: 'center', border: [true, false, true, false] },
            { text: '', alignment: 'right', border: [true, false, true, false] },
            { text: '', alignment: 'right', border: [true, false, true, false] }
          ]
        )
      }

      if (this.item[i].fabric_blind != null && this.item[i].pleat != 'Roman Blind') {
        // <span
        //           *ngIf="calc[i].blind.promo_rate != 0 && calc[i].blind.promo_rate != null">
        //           (-{{calc[i].blind.promo_rate}}%)</span>
        if (this.calc[i].blind.promo_rate != 0 && this.calc[i].blind.promo_rate != null) {
          items.push(
            [
              this.item[i].pleat + ' - ' + this.item[i].fabric_blind + (this.item[i].code_blind ? '-' + this.item[i].code_blind : '') + (this.item[i].blind_tape && (this.item[i].pleat == 'Wooden Blind' || this.item[i].pleat == 'Venetian Blinds') ? (this.item[i].blind_tape.includes('Tape') ? ' (' : ' (Tape ') + this.item[i].blind_tape + ')' : ''),
              { text: this.calc[i].blind.unit, alignment: 'center' },
              { text: this.calc[i].blind.qty, alignment: 'center' },
              { text: ((this.calc[i].blind.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })), alignment: 'right' },
              { text: '(-' + this.calc[i].blind.promo_rate + '%) ' + ((this.calc[i].blind.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })), alignment: 'right' }
            ]
          )
        } else {
          items.push(
            [
              this.item[i].pleat + ' - ' + this.item[i].fabric_blind + (this.item[i].code_blind ? '-' + this.item[i].code_blind : '') + (this.item[i].blind_tape && (this.item[i].pleat == 'Wooden Blind' || this.item[i].pleat == 'Venetian Blinds') ? (this.item[i].blind_tape.includes('Tape') ? ' (' : ' (Tape ') + this.item[i].blind_tape + ')' : ''),
              { text: this.calc[i].blind.unit, alignment: 'center' },
              { text: this.calc[i].blind.qty, alignment: 'center' },
              { text: ((this.calc[i].blind.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })), alignment: 'right' },
              { text: ((this.calc[i].blind.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })), alignment: 'right' }
            ]
          )
        }

        if (this.item[i].pleat == 'Roller Blind' && this.calc[i].blind_spring.total > 0) {
          items.push(
            [
              'Add Spring',
              { text: this.calc[i].blind_spring.unit, alignment: 'center' },
              { text: this.calc[i].blind_spring.qty, alignment: 'center' },
              { text: ((this.calc[i].blind_spring.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })), alignment: 'right' },
              { text: ((this.calc[i].blind_spring.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })), alignment: 'right' }
            ]
          )
        }

        if ((this.item[i].pleat == 'Roller Blind' || this.item[i].pleat == 'Zebra Blind') && this.calc[i].blind_tube.total > 0) {
          items.push(
            [
              'Add 2.8mm Tube',
              { text: this.calc[i].blind_tube.unit, alignment: 'center' },
              { text: this.calc[i].blind_tube.qty, alignment: 'center' },
              { text: ((this.calc[i].blind_tube.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })), alignment: 'right' },
              { text: ((this.calc[i].blind_tube.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })), alignment: 'right' }
            ]
          )
        }

        if (this.item[i].pleat == 'Wooden Blind' && this.calc[i].blind_easylift.total > 0) {
          items.push(
            [
              'Easy Lift System',
              { text: this.calc[i].blind_easylift.unit, alignment: 'center' },
              { text: this.calc[i].blind_easylift.qty, alignment: 'center' },
              { text: ((this.calc[i].blind_easylift.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })), alignment: 'right' },
              { text: ((this.calc[i].blind_easylift.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })), alignment: 'right' }
            ]
          )
        }

        if (this.item[i].pleat == 'Wooden Blind' && this.calc[i].blind_monosys.total > 0) {
          items.push(
            [
              'Mono System',
              { text: this.calc[i].blind_monosys.unit, alignment: 'center' },
              { text: this.calc[i].blind_monosys.qty, alignment: 'center' },
              { text: ((this.calc[i].blind_monosys.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })), alignment: 'right' },
              { text: ((this.calc[i].blind_monosys.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })), alignment: 'right' }
            ]
          )
        }
      }

      if (this.item[i].pleat == 'Roman Blind' && this.item[i].fabric != null) {
        if (this.calc[i].curtain.promo_rate != 0 && this.calc[i].curtain.promo_rate != null) {
          items.push(
            [
              'Roman Blind - ' + this.item[i].fabric + (this.item[i].code_curtain ? '-' + this.item[i].code_curtain : ''),
              { text: 'm', alignment: 'center' },
              { text: this.calc[i].curtain.qty, alignment: 'center' },
              { text: (this.calc[i].curtain.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
              { text: '(-' + this.calc[i].curtain.promo_rate + '%) ' + (this.calc[i].curtain.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
            ]
          )

        } else {

          items.push(
            [
              'Roman Blind - ' + this.item[i].fabric + (this.item[i].code_curtain ? '-' + this.item[i].code_curtain : ''),
              { text: 'm', alignment: 'center' },
              { text: this.calc[i].curtain.qty, alignment: 'center' },
              { text: (this.calc[i].curtain.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
              { text: (this.calc[i].curtain.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
            ]
          )
        }
      } else if (this.item[i].fabric != null && this.item[i].type != 'Blinds') {

        if (this.calc[i].curtain.promo_rate != 0 && this.calc[i].curtain.promo_rate != null) {
          items.push(
            [
              'Curtain - ' + this.item[i].fabric + (this.item[i].code_curtain ? '-' + this.item[i].code_curtain : ''),
              { text: 'm', alignment: 'center' },
              { text: this.calc[i].curtain.qty, alignment: 'center' },
              { text: (this.calc[i].curtain.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
              { text: '(-' + this.calc[i].curtain.promo_rate + '%) ' + (this.calc[i].curtain.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
            ]
          )

        } else {

          items.push(
            [
              'Curtain - ' + this.item[i].fabric + (this.item[i].code_curtain ? '-' + this.item[i].code_curtain : ''),
              { text: 'm', alignment: 'center' },
              { text: this.calc[i].curtain.qty, alignment: 'center' },
              { text: (this.calc[i].curtain.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
              { text: (this.calc[i].curtain.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
            ]
          )
        }

      }

      if (this.item[i].fabric_lining != null) {
        if (this.calc[i].lining.promo_rate != 0 && this.calc[i].lining.promo_rate != null) {
          items.push(
            [
              'Lining - ' + this.item[i].fabric_lining + (this.item[i].code_lining ? '-' + this.item[i].code_lining : ''),
              { text: 'm', alignment: 'center' },
              { text: this.calc[i].lining.qty, alignment: 'center' },
              { text: (this.calc[i].lining.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
              { text: '(-' + this.calc[i].lining.promo_rate + '%) ' + (this.calc[i].lining.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
            ]
          )
        }
        else {
          items.push(
            [
              'Lining - ' + this.item[i].fabric_lining + (this.item[i].code_lining ? '-' + this.item[i].code_lining : ''),
              { text: 'm', alignment: 'center' },
              { text: this.calc[i].lining.qty, alignment: 'center' },
              { text: (this.calc[i].lining.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
              { text: (this.calc[i].lining.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
            ]
          )
        }

      }

      if (this.item[i].fabric_sheer != null && this.item[i].type != 'Blinds') {
        if (this.calc[i].sheer.promo_rate != 0 && this.calc[i].sheer.promo_rate != null) {
          items.push(
            [
              'Sheer - ' + this.item[i].fabric_sheer + (this.item[i].code_sheer ? '-' + this.item[i].code_sheer : ''),
              { text: 'm', alignment: 'center' },
              { text: this.calc[i].sheer.qty, alignment: 'center' },
              { text: (this.calc[i].sheer.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
              { text: '(-' + this.calc[i].sheer.promo_rate + '%) ' + (this.calc[i].sheer.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
            ]
          )
        } else {
          items.push(
            [
              'Sheer - ' + this.item[i].fabric_sheer + (this.item[i].code_sheer ? '-' + this.item[i].code_sheer : ''),
              { text: 'm', alignment: 'center' },
              { text: this.calc[i].sheer.qty, alignment: 'center' },
              { text: (this.calc[i].sheer.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
              { text: (this.calc[i].sheer.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
            ]
          )
        }

      }

      if (this.item[i].type != 'Blinds') {

        if (this.item[i].fabric != null && this.item[i].fabric_lining != null && this.lengthof(this.calc[i].sewing_curtain) > 0) {
          items.push(
            [
              'Sewing ' + this.item[i].pleat_short + ' Curtain + Lining',
              { text: this.calc[i].sewing_curtain.unit, alignment: 'center' },
              { text: this.calc[i].sewing_curtain.qty, alignment: 'center' },
              { text: (this.calc[i].sewing_curtain.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
              { text: (this.calc[i].sewing_curtain.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
            ]
          )
        } else if (this.item[i].fabric != null && this.lengthof(this.calc[i].sewing_curtain) > 0) {
          items.push(
            [
              'Sewing ' + this.item[i].pleat_short + ' Curtain',
              { text: this.calc[i].sewing_curtain.unit, alignment: 'center' },
              { text: this.calc[i].sewing_curtain.qty, alignment: 'center' },
              { text: (parseInt(this.calc[i].sewing_curtain.rate)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
              { text: (parseInt(this.calc[i].sewing_curtain.total)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
            ]
          )
        } else if (this.item[i].fabric_lining != null) {
          items.push(
            [
              'Sewing ' + this.item[i].pleat_short + ' Lining',
              { text: this.calc[i].sewing_curtain.unit, alignment: 'center' },
              { text: this.calc[i].sewing_curtain.qty, alignment: 'center' },
              { text: (this.calc[i].sewing_curtain.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
              { text: (this.calc[i].sewing_curtain.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
            ]
          )
        } else if (this.lengthof(this.calc[i].sewing_curtain) > 0 && this.item[i].type == '5') {
          items.push(
            [
              'Sewing ' + this.item[i].pleat_short + ' Curtain',
              { text: this.calc[i].sewing_curtain.unit, alignment: 'center' },
              { text: this.calc[i].sewing_curtain.qty, alignment: 'center' },
              { text: (parseInt(this.calc[i].sewing_curtain.rate)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
              { text: (parseInt(this.calc[i].sewing_curtain.total)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
            ]
          )
        }

        if (this.item[i].fabric_sheer != null && this.lengthof(this.calc[i].sewing_sheer) > 0) {
          items.push(
            [
              'Sewing ' + this.item[i].pleat_sheer_short + ' Sheer',
              { text: this.calc[i].sewing_sheer.unit, alignment: 'center' },
              { text: this.calc[i].sewing_sheer.qty, alignment: 'center' },
              { text: (parseInt(this.calc[i].sewing_sheer.rate)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
              { text: (parseInt(this.calc[i].sewing_sheer.total)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
            ]
          )
        } else if (this.lengthof(this.calc[i].sewing_sheer) > 0 && this.item[i].type == '5') {
          items.push(
            [
              'Sewing ' + this.item[i].pleat_sheer_short + ' Sheer',
              { text: this.calc[i].sewing_sheer.unit, alignment: 'center' },
              { text: this.calc[i].sewing_sheer.qty, alignment: 'center' },
              { text: (parseInt(this.calc[i].sewing_sheer.rate)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
              { text: (parseInt(this.calc[i].sewing_sheer.total)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
            ]
          )
        }

        if (this.item[i].eyelet_curtain) {
          items.push(
            [
              '(C) Eyelet Ring',
              { text: 'ft', alignment: 'center' },
              { text: (this.item[i].type == '5' ? (this.calc[i].install.eyelet_curtain / this.calc[i].install.eyelet_rate) : (this.calc[i].curtain.eyelet_curtain / this.calc[i].curtain.eyelet_rate)), alignment: 'center' },
              { text: (this.item[i].type == '5' ? this.calc[i].install.eyelet_rate : this.calc[i].curtain.eyelet_rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
              { text: (this.item[i].type == '5' ? this.calc[i].install.eyelet_curtain : this.calc[i].curtain.eyelet_curtain).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
            ]
          )
        }

        if (this.item[i].eyelet_sheer) {
          items.push(
            [
              '(S) Eyelet Ring',
              { text: 'ft', alignment: 'center' },
              { text: (this.item[i].type == '5' ? (this.calc[i].install.eyelet_sheer / this.calc[i].install.eyelet_rate) : (this.calc[i].sheer.eyelet_sheer / this.calc[i].sheer.eyelet_rate)), alignment: 'center' },
              { text: (this.item[i].type == '5' ? this.calc[i].install.eyelet_rate : this.calc[i].sheer.eyelet_rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
              { text: (this.item[i].type == '5' ? this.calc[i].install.eyelet_sheer : this.calc[i].sheer.eyelet_sheer).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
            ]
          )
        }

      } else {

        if (this.item[i].pleat == 'Roman Blind') {

          if (this.item[i].fabric != null) {
            items.push(
              [
                'Sewing for Roman Blind',
                { text: this.calc[i].sewing_curtain.unit, alignment: 'center' },
                { text: this.calc[i].sewing_curtain.qty, alignment: 'center' },
                { text: (this.calc[i].sewing_curtain.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
                { text: (this.calc[i].sewing_curtain.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
              ]
            )
          }

          if (this.item[i].fabric_lining != null) {
            items.push(
              [
                'Sewing for Lining',
                { text: this.calc[i].sewing_lining.unit, alignment: 'center' },
                { text: this.calc[i].sewing_lining.qty, alignment: 'center' },
                { text: (this.calc[i].sewing_lining.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
                { text: (this.calc[i].sewing_lining.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
              ]
            )
          }

          items.push(
            [
              'Mechanism',
              { text: this.calc[i].mechanism.unit, alignment: 'center' },
              { text: this.calc[i].mechanism.qty, alignment: 'center' },
              { text: (this.calc[i].mechanism.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
              { text: (this.calc[i].mechanism.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
            ]
          )

        }

      }

      // Accessories
      if (this.item[i].type == 3) {

        for (let j = 0; j < this.calc[i].accessories.products.length; j++) {

          items.push(
            [
              { text: 'Accessory - ' + this.calc[i].accessories.products[j].acce_title, border: [true, false, true, false] },
              { text: 'pcs', alignment: 'center', border: [true, false, true, false] },
              { text: this.calc[i].accessories.products[j].acce_quantity, alignment: 'center', border: [true, false, true, false] },
              { text: (parseInt(this.calc[i].accessories.products[j].acce_selected.price)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] },
              { text: (this.calc[i].accessories.products[j].acce_total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] },
            ]
          )

        }
      }

      // Wallpaper
      if (this.item[i].type == 6) {

        items.push(
          [
            { text: 'Wallpaper - ' + this.calc[i].wallpaper.products.name, border: [true, false, true, false] },
            { text: this.calc[i].wallpaper.products.unit, alignment: 'center', border: [true, false, true, false] },
            { text: this.calc[i].wallpaper.products.quantity, alignment: 'center', border: [true, false, true, false] },
            { text: (parseInt(this.calc[i].wallpaper.products.price)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] },
            { text: (this.calc[i].wallpaper.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] },
          ]
        )

      }

      if (this.item[i].track != null && this.item[i].type == 'Tailor-Made Curtains') {
        if (this.calc[i].track.total > 0) {
          items.push(
            [
              '(C) ' + this.item[i].track + (this.item[i].track == 'Super Track' ? '' : ' Track'),
              { text: this.calc[i].track.unit, alignment: 'center' },
              { text: this.calc[i].track.qty, alignment: 'center' },
              { text: (this.calc[i].track.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
              { text: (this.calc[i].track.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
            ]
          )
        } else {
          items.push(
            [
              '(C) ' + this.item[i].track + (this.item[i].track == 'Super Track' ? '' : ' Track'),
              { text: this.calc[i].track.unit, alignment: 'center' },
              { text: this.calc[i].track.qty, alignment: 'center' },
              { text: 'WAIVED', alignment: 'right' },
              { text: 'WAIVED', alignment: 'right' }
            ]
          )
        }

      } else if (this.item[i].track != null && this.item[i].type == '2') {
        if (this.calc[i].track.total > 0) {

          items.push(
            [
              { text: width + '"(w)', border: [true, false, true, false] },
              { text: '', alignment: 'center', border: [true, false, true, false] },
              { text: '', alignment: 'center', border: [true, false, true, false] },
              { text: '', alignment: 'right', border: [true, false, true, false] },
              { text: '', alignment: 'right', border: [true, false, true, false] }
            ]
          )

          items.push(
            [
              this.item[i].track + (this.item[i].track == 'Super Track' ? '' : ' Track'),
              { text: this.calc[i].track.unit, alignment: 'center' },
              { text: this.calc[i].track.qty, alignment: 'center' },
              { text: (this.calc[i].track.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
              { text: (this.calc[i].track.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
            ]
          )
        }
      } else if (this.item[i].track != null && this.item[i].type == '5') {
        if (this.calc[i].track.total > 0) {
          items.push(
            [
              '(C) ' + this.item[i].track + (this.item[i].track == 'Super Track' ? '' : ' Track'),
              { text: this.calc[i].track.unit, alignment: 'center' },
              { text: this.calc[i].track.qty, alignment: 'center' },
              { text: (this.calc[i].track.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
              { text: (this.calc[i].track.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
            ]
          )
        } else {
          items.push(
            [
              '(C) ' + this.item[i].track + (this.item[i].track == 'Super Track' ? '' : ' Track'),
              { text: this.calc[i].track.unit, alignment: 'center' },
              { text: this.calc[i].track.qty, alignment: 'center' },
              { text: 'WAIVED', alignment: 'right' },
              { text: 'WAIVED', alignment: 'right' }
            ]
          )
        }
      }

      if (this.item[i].track_sheer != null) {
        if (this.calc[i].track_sheer.total > 0) {
          items.push(
            [
              '(S) ' + this.item[i].track_sheer + (this.item[i].track_sheer == 'Super Track' ? '' : ' Track'),
              { text: this.calc[i].track_sheer.unit, alignment: 'center' },
              { text: this.calc[i].track_sheer.qty, alignment: 'center' },
              { text: (this.calc[i].track_sheer.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
              { text: (this.calc[i].track_sheer.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
            ]
          )
        } else {
          items.push(
            [
              '(S) ' + this.item[i].track_sheer + (this.item[i].track_sheer == 'Super Track' ? '' : ' Track'),
              { text: this.calc[i].track_sheer.unit, alignment: 'center' },
              { text: this.calc[i].track_sheer.qty, alignment: 'center' },
              { text: 'WAIVED', alignment: 'right' },
              { text: 'WAIVED', alignment: 'right' }
            ]
          )
        }
      } else if (this.item[i].track_sheer != null && this.item[i].type == '5') {
        if (this.calc[i].track_sheer.total > 0) {
          items.push(
            [
              '(S) ' + this.item[i].track_sheer + (this.item[i].track_sheer == 'Super Track' ? '' : ' Track'),
              { text: this.calc[i].track_sheer.unit, alignment: 'center' },
              { text: this.calc[i].track_sheer.qty, alignment: 'center' },
              { text: (this.calc[i].track_sheer.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
              { text: (this.calc[i].track_sheer.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
            ]
          )
        } else {
          items.push(
            [
              '(S) ' + this.item[i].track_sheer + (this.item[i].track_sheer == 'Super Track' ? '' : ' Track'),
              { text: this.calc[i].track_sheer.unit, alignment: 'center' },
              { text: this.calc[i].track_sheer.qty, alignment: 'center' },
              { text: 'WAIVED', alignment: 'right' },
              { text: 'WAIVED', alignment: 'right' }
            ]
          )
        }
      }

      if (this.item[i].motorized_upgrade) {
        if (this.calc[i].motorized.cost != 'FOC') {
          items.push(
            [
              (this.item[i].type == '4' ? 'Motorized Track' : 'Upgrade Motorized Track'),
              { text: 'set', alignment: 'center' },
              { text: this.calc[i].motorized.qty, alignment: 'center' },
              { text: (this.calc[i].motorized.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
              { text: (this.calc[i].motorized.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
            ]
          )
        } else {
          items.push(
            [
              (this.item[i].type == '4' ? 'Motorized Track' : 'Upgrade Motorized Track'),
              { text: 'set', alignment: 'center' },
              { text: this.calc[i].motorized.qty, alignment: 'center' },
              { text: 'FOC', alignment: 'right' },
              { text: 'FOC', alignment: 'right' }
            ]
          )
        }

        if (this.calc[i].motorized.lift != 0) {
          items.push(
            [
              'Upgrade Lift System',
              { text: 'set', alignment: 'center' },
              { text: this.calc[i].motorized.qty, alignment: 'center' },
              { text: (this.calc[i].motorized.lift_rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
              { text: (this.calc[i].motorized.lift).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
            ]
          )
        }

        items.push(
          [
            'Installation Motorized Track',
            { text: 'set', alignment: 'center' },
            { text: this.calc[i].motorized.qty, alignment: 'center' },
            { text: (this.calc[i].motorized.install_rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
            { text: (this.calc[i].motorized.install).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
          ]
        )

      }

      // if (this.calc[i].install.ladder) {

      //   items.push(
      //     [
      //       'Installation w/Ladder',
      //       { text: this.calc[i].install.unit, alignment: 'center' },
      //       { text: this.calc[i].install.qty, alignment: 'center' },
      //       { text: (this.calc[i].install.ladder_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
      //       { text: (this.calc[i].install.ladder_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
      //     ]
      //   )
      // }

      // if (this.calc[i].install.scaftfolding) {

      //   items.push(
      //     [
      //       'Installation w/Scaftfolding',
      //       { text: this.calc[i].install.unit, alignment: 'center' },
      //       { text: this.calc[i].install.qty, alignment: 'center' },
      //       { text: (this.calc[i].install.scaftfolding_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
      //       { text: (this.calc[i].install.scaftfolding_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
      //     ]
      //   )
      // }

      if (this.item[i].type == 'Blinds') {
        items.push(
          [
            'Installation',
            { text: this.calc[i].install.unit, alignment: 'center' },
            { text: this.calc[i].install.qty, alignment: 'center' },
            { text: (this.calc[i].install.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
            { text: (this.calc[i].install.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
          ]
        )
      } else if (this.item[i].type == 'Tailor-Made Curtains' || this.item[i].type == '5') {

        items.push(
          [
            'Installation & Hang',
            { text: this.calc[i].install.unit, alignment: 'center' },
            { text: this.calc[i].install.qty, alignment: 'center' },
            { text: (this.calc[i].install.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
            { text: (this.calc[i].install.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
          ]
        )

      }

      if (this.calc[i].install.scaftfolding) {
        items.push(
          [
            'Climbing w/Scaftfolding',
            { text: this.calc[i].install.unit, alignment: 'center' },
            { text: this.info.scaftfolding_quantity, alignment: 'center' },
            { text: (this.calc[i].install.climbing_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
            { text: (this.calc[i].install.climbing_price * this.info.scaftfolding_quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
          ]
        )
      }

      if (this.item[i].type != 'Blinds' && this.calc[i].install.belt_hook != 0) {
        items.push(
          [
            'Belt & Hook',
            { text: 'set', alignment: 'center' },
            { text: 1, alignment: 'center' },
            { text: (this.calc[i].install.belt_hook).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
            { text: (this.calc[i].install.belt_hook).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
          ]
        )
      }

      items.push(
        [
          { text: '', border: [true, false, true, false] },
          { text: '', border: [true, false, true, false] },
          { text: '', border: [true, false, true, false] },
          { text: '', border: [true, false, true, false] },
          { text: 'RM ' + (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, true, true, true], decoration: 'underline', bold: true }
        ],
      )
      items.push(['', '', '', '', ''])
      items.push(['', '', '', '', ''])
      items.push(['', '', '', '', ''])

    }
    console.log(items);

    //Ladder & Scaftfolding
    let ladderscaft = ''
    let LSprice = ''
    let insladderscaft = ''
    let insLSprice = ''

    // if (this.ladderDeliver && this.info.ladder_fee_status) {
    //   ladderscaft = 'LADDER (DELIVERY) + LADDER (INSTALLATION)'
    //   LSprice = '200.00'
    // } else {
    //   if (this.ladderDeliver) {
    //     ladderscaft = 'LADDER (DELIVERY)'
    //     LSprice = '100.00'
    //   }
    if (this.info.ladder_fee_status) {
      ladderscaft = 'BOMBA LADDER'
      LSprice = '200.00'
    }
    // }

    if (this.info.scaftfolding_fee_status) {
      insladderscaft = 'SCAFTFOLDING (DELIVER, INSTALL, DISMANTLE)'
      insLSprice = '500.00'
    }
    // else {
    //   if (this.info.ladder_fee_status) {
    //     insladderscaft = 'LADDER (INSTALLATION)'
    //     insLSprice = '100.00'
    //   }
    //   if (this.info.scaftfolding_fee_status) {
    //     insladderscaft = 'SCAFTFOLDING (INSTALLATION)'
    //     insLSprice = '500.00'
    //   }
    // }


    //Get Before Additional Price
    let total = 0
    for (let i = 0; i < this.item.length; i++) {
      total += this.item[i].price
    }

    let packageWord = ''
    let packagePrice = 0
    if (this.info.package_code) {
      packageWord = this.packageApplied.type + ' PACKAGE OFFER (RM)'
      packagePrice = total - this.packageApplied.price + this.addCharges()
    }

    // Package Upgrade
    let tempItem
    let upgradeSelected

    if (this.info.package_addon) {
      tempItem = this.item.filter(a => a.no == this.info.package_location)[0]
      console.log(tempItem);

      if (tempItem.type == '1' || tempItem.type == '6') {
        upgradeSelected = 'Fabric Only ( ' + this.info.package_selection + ' )'
      } else if (tempItem.type == '2') {
        upgradeSelected = 'Track Only ( ' + this.info.package_selection + ' )'
      } else if (tempItem.type == '3') {
        upgradeSelected = 'Accessories Only ( ' + this.info.package_selection + ' )'
      } else if (tempItem.type == '5') {
        upgradeSelected = 'Sewing Only ( ' + this.info.package_selection + ' )'
      } else {
        upgradeSelected = tempItem.location + ' ' + tempItem.location_ref + ' ( ' + this.info.package_selection + ' )'
      }

      console.log(upgradeSelected);

    }


    // Playground start here
    var dd = {
      //Header
      header: function (currentPage, pageCount, pageSize) {

        return [
          {
            columns: [
              [
                {
                  alignment: 'left',
                  text: 'Crystalace Deco Sdn Bhd (959240-H)',
                  fontSize: 17,
                  bold: true,
                  width: '60%',
                  margin: [40, 20, 0, 0]
                },
                {
                  alignment: 'left',
                  text: '15, Jln PJU 3/49 Sunway Damansara Technology Park,47810 Petaling Jaya Selangor.',
                  fontSize: 8,
                  color: '#888',
                  bold: false,
                  width: '60%',
                  margin: [40, 0, 0, 0]
                },
                {
                  alignment: 'left',
                  text: 'www.crystalace.com.my        03-7803 1686',
                  fontSize: 8,
                  color: '#888',
                  bold: false,
                  width: '60%',
                  margin: [40, 0, 0, 0]
                }
              ],
              {
                alignment: 'right',
                text: 'Quotation Page ' + currentPage + ' of ' + pageCount,
                fontSize: 14,
                bold: true,
                width: '40%',
                margin: [0, 20, 40, 30],
              },
            ]
          },
          { canvas: [{ type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 }] }
        ]
      },

      //Content
      content: [
        {
          columns: [
            {
              width: '50%',
              table: {
                widths: '100%',
                body: [
                  ['Customer:'],
                  customer_info
                  // ['Ms Chloe \n\n\n No 21, Jalan U13/53UC, Eco Ardence Seksyen U13, 40170 Shah Alam, Selangor \n\n\n 012-5256304 \n ']
                ]
              },
              layout: {
                fillColor: function (rowIndex, node, columnIndex) {
                  return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                }
              }
            },
            {
              width: '50%',
              table: {
                widths: ['50%', '50%'],
                body: quoinfo
              },
              layout: {
                fillColor: function (rowIndex, node, columnIndex) {
                  return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                }
              }
            }
          ]
        },
        {
          width: '100%',
          margin: [0, 15, 0, 0],
          table: {
            widths: ['100%'],
            body: [
              ['Job'],
              [{ text: 'Supply & Install\n ', bold: true }]
            ]
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
            }
          }
        },

        //Item List
        {
          width: '100%',
          margin: [0, 15, 0, 0],
          table: {
            headerRows: 1,
            dontBreakRows: true,
            keepWithHeaderRows: 1,
            widths: ['40%', '10%', '10%', '20%', '20%'],
            body: items,
          },
          layout: {
            hLineWidth: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 1 : 1;
            },
            hLineColor: function (i, node) {
              return (i === 0 || i === node.table.body.length || i === 1) ? 'black' : 'white';
            },
          }
        },

        //Final Price Calculation
        {
          width: '100%',
          table: {
            widths: ['80%', '20%'],
            body: [
              [
                { text: 'Total', alignment: 'right', border: [true, false, false, true] },
                { text: ((total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })), alignment: 'right', border: [false, false, true, true] },
              ],
              [
                { text: ladderscaft, bold: true, border: [true, false, false, true] },
                { text: LSprice, alignment: 'right', border: [false, false, true, true] }
              ],
              [
                { text: this.info.scaftfolding_fee_status ? (insladderscaft + (this.info.scaftfolding_quantity > 1 ? ' x' + this.info.scaftfolding_quantity : '')) : '', bold: true, border: [true, false, false, true] },
                { text: this.info.scaftfolding_fee_status ? (500 * this.info.scaftfolding_quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '', alignment: 'right', border: [false, false, true, true] }
              ],
              [
                { text: this.info.transport_fee_status ? 'TRANSPORTATION FEES (RM)' : 'SELF PICK-UP (RM)', bold: true, border: [true, false, false, true] },
                { text: this.info.transport_fee_status ? (this.info.transport_fee).toFixed(2) : 'WAIVED', alignment: 'right', border: [false, false, true, true] },
              ],
              [
                { text: packageWord, bold: true, border: [true, false, false, true] },
                { text: this.info.package_code ? '(-' + (packagePrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ')' : '', alignment: 'right', border: [false, false, true, true] },
              ],
              [
                { text: this.info.package_code ? this.packageApplied.description : '', fontSize: 8, border: [true, false, false, true] },
                { text: '', alignment: 'right', border: [false, false, true, true] },
              ],
              [
                { text: this.info.package_addon ? 'TOP UP UPGRADE (RM)' : '', bold: true, border: [true, false, false, true] },
                { text: this.info.package_addon ? (this.packageApplied.add_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '', alignment: 'right', border: [false, false, true, true] },
              ],
              [
                { text: this.info.package_addon ? '- ' + upgradeSelected : '', fontSize: 10, border: [true, false, false, true] },
                { text: '', alignment: 'right', border: [false, false, true, true] },
              ],
              [
                { text: this.info.package_remark ? this.info.package_remark : '', fontSize: 8, border: [true, false, false, true] },
                { text: '', alignment: 'right', border: [false, false, true, true] },
              ],
              // This is the long remark This is the long remark 2 This is the long remark 3 And the long remark 4
              // Yes this is the next line
              // The third line
              // [
              //   { text: 'LESS DISCOUNT (RM)', bold: true, border: [true, false, false, true] },
              //   { text: '5,159.00', alignment: 'right', border: [false, false, true, true] },
              // ],
              // [
              //   { text: '50% Discount 2 sets Motorized System', bold: true, border: [true, false, false, true] },
              //   { text: '2,500.00', alignment: 'right', border: [false, false, true, true] },
              // ],
              [
                '',
                '',
              ],
              [
                '',
                '',
              ],
              [
                '',
                '',
              ],
              [
                { text: 'FINAL TOTAL (RM)', bold: true, border: [true, false, false, true] },
                { text: (this.info.package_code ? (this.totalPrice() - packagePrice + (this.info.package_addon ? this.packageApplied.add_price : 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : (this.totalPrice()).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })), bold: true, alignment: 'right', border: [false, false, true, true] },
              ],
              [
                '',
                '',
              ],
              [
                '',
                '',
              ],
            ]
          },
          layout: {
            hLineWidth: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 1 : 1;
            },
            vLineWidth: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 1 : 1;
            },
            hLineColor: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 'black' : 'white';
            },
            vLineColor: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 'black' : 'white';
            },
          }
        },
        // {
        //   width: '100%',
        //   table: {
        //     widths: ['100%'],
        //     body: [
        //       [{ text: 'Price above is estimation.', fontSize: 9, border: [true, false, true, false] }],
        //       [{ text: 'Final price will be adjusted according to actual site measurement and material selection', fontSize: 9, border: [true, false, true, true] }],
        //     ]
        //   }
        // },
        {
          width: '100%',
          table: {
            widths: ['100%'],
            body: [
              [{ text: 'Terms & Condition', bold: true }],
            ]
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
            },
            hLineWidth: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 0 : 0;
            },
            vLineWidth: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 1 : 1;
            },
            hLineColor: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 'black' : 'white';
            },
            vLineColor: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 'black' : 'white';
            },
          }
        },
        {
          width: '100%',
          table: {
            widths: ['100%'],
            body: [
              [{ text: 'Payment ', bold: true }],
              [{ text: 'Payment Detail: Ambank Account Number 2442 0220 04795 Crystalace Deco Sdn Bhd', fontSize: 9 }],
              [{ text: '' }],
              [{ text: 'Delivery ', bold: true }],
              [{ text: ': Within 2 to 4 working weeks after confirmation of order and it is subject to stock availability.', fontSize: 9 }],
              [{ text: ': Quotation valid for 30days. Prices are subjected to change according to actual final site measurement and condition.', fontSize: 9 }],
              [{ text: ': Work contracted is not inclusive of reinforcement and/or site modifications. Crystalace Deco Sdn Bhd is not responsible for cost incurred resulting from delayed site handover or/and unsuitable installation condition.', fontSize: 9 }],
              [{ text: '' }],
            ]
          },
          layout: {
            hLineWidth: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 1 : 1;
            },
            vLineWidth: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 1 : 1;
            },
            hLineColor: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 'black' : 'white';
            },
            vLineColor: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 'black' : 'white';
            },
          }
        },
        {
          text: '\nPlease do not hestitate to contact us at 03-7803 1686 if you have any enquiry, Thank You.', alignment: 'center', italics: true
        },

      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      },
      defaultStyle: {
        columnGap: 20
      },
      pageMargins: [40, 70, 40, 60]

    };

    // pdfMake.createPdf(dd).open();
    this.pdfObj = pdfMake.createPdf(dd);

    if (pass) {
      this.uploadPdf(1)
    } else {
      this.downloadPdf()
    }

  }

  pdfmakerClient(pass) {
    console.log(this.info);

    let customer_info = []
    let today = new Date()
    let width = null
    let height = null
    let count = 0

    let isCurtain = false
    let isSheer = false
    let isBlind = false
    let isFabric = false
    let isTrack = false
    let isAccessories = false
    let isMotor = false
    let isSewing = false
    let isWallpaper = false

    //Customer
    let ci = ''
    ci = this.info.customer_name + '\n\n\n' + this.info.customer_address + '\n\n\n' + this.info.customer_phone + '\n '

    customer_info.push(ci)

    //Quotation info
    let quoinfo = [
      [{ text: 'Ref:', alignment: 'center' }, { text: 'Date:', alignment: 'center' }],
      [{ text: this.quoRef, alignment: 'center' }, { text: this.quoDate, alignment: 'center' }],
      [{ text: '' }, { text: 'Validity:', alignment: 'center' }],
      [{ text: '' }, { text: this.quoValidity, alignment: 'center' }],
      [{ text: 'Sales:', alignment: 'center', border: [true, true, false, true] }, { text: 'Prepared by:', alignment: 'center', border: [false, true, true, true] }],
      [{ text: this.quoSales + '\n' + this.quoPhone, alignment: 'center', border: [true, true, false, true] }, { text: '', border: [false, true, true, true] }],
    ]

    //Items
    let items = [
      [{ text: 'Description', bold: true },
      { text: 'Unit', alignment: 'center', bold: true },
      { text: 'Qty', alignment: 'center', bold: true },
      // { text: 'Amount (RM)', alignment: 'center', bold: true },
      { text: 'Total (RM)', alignment: 'center', bold: true }]
    ] as any

    for (let i = 0; i < this.item.length; i++) {

      if (this.item[i].height_tech != null || this.item[i].width_tech != null) {
        if (this.item[i].status_tech == 'Approved' && this.item[i].status_sale == 'Completed') {
          width = this.item[i].width
          height = this.item[i].height
        } else {
          width = this.item[i].width_tech
          height = this.item[i].height_tech
        }

      } else {
        width = this.item[i].width
        height = this.item[i].height
      }

      if (i >= 1) {
        if (this.item[i].location != this.item[i - 1].location) {
          count = 0
        }
      }
      count++

      //ITEMS PUSH START HERE
      if (this.item[i].type == '1') {

        isFabric = true

        if (this.item[i].fabric_type == 'C') {

          items.push(
            [
              { text: 'A La Carte - Supply Fabrics Only', border: [true, false, true, false], bold: true, decoration: 'underline' },
              { text: '', alignment: 'center', border: [true, false, true, false] },
              { text: '', alignment: 'center', border: [true, false, true, false] },
              { text: '', alignment: 'right', border: [true, false, true, false] },
              // { text: '', alignment: 'right', border: [true, false, true, false] }
            ]
          )

          if (this.item[i].fabric != null) {

            items.push(
              [
                { text: 'Curtain - ' + this.item[i].fabric + (this.item[i].code_curtain ? '-' + this.item[i].code_curtain : ''), border: [true, false, true, false] },
                { text: 'set', alignment: 'center', border: [true, false, true, false] },
                { text: 1, alignment: 'center', border: [true, false, true, false] },
                { text: (this.calc[i].curtain.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] },
              ]
            )

          }

          // if (this.item[i].fabric_lining != null) {
          //   items.push(
          //     [
          //       { text: 'Lining - ' + this.item[i].fabric_lining + (this.item[i].code_lining ? '-' + this.item[i].code_lining : ''), border: [true, false, true, false] },
          //       { text: 'set', alignment: 'center', border: [true, false, true, false] },
          //       { text: 1, alignment: 'center', border: [true, false, true, false] },
          //       { text: (this.calc[i].lining.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] },
          //     ]
          //   )
          // }

          items.push(
            [
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] }
            ]
          )

          items.push(
            [
              { text: ' ', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false], bold: true, decoration: 'underline' }
            ]
          )

          items.push(
            [
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] }
            ]
          )

          if (this.item[i].remark_curtain || this.item[i].remark_sale) {

            items.push(
              [
                { text: 'Remark', border: [true, false, true, false], decoration: 'underline' },
                { text: '', fontSize: 8.5, border: [true, false, true, false] },
                { text: '', alignment: 'center', border: [true, false, true, false] },
                { text: '', border: [true, false, true, false] },
              ]
            )

            if (this.item[i].remark_curtain) {
              items.push(
                [
                  { text: 'Curtain : ' + (this.item[i].remark_curtain || ''), fontSize: 8, border: [true, false, true, false] },
                  { text: '', fontSize: 8.5, border: [true, false, true, false] },
                  { text: '', alignment: 'center', border: [true, false, true, false] },
                  { text: '', border: [true, false, true, false] },
                ]
              )
            }

            if (this.item[i].remark_sale) {
              items.push(
                [
                  { text: 'Overall : \n' + (this.item[i].remark_sale || ''), fontSize: 8, border: [true, false, true, false] },
                  { text: '', fontSize: 8.5, border: [true, false, true, false] },
                  { text: '', alignment: 'center', border: [true, false, true, false] },
                  { text: '', border: [true, false, true, false] },
                ]
              )
            }

          }

          items.push(
            [
              { text: '', border: [true, false, true, true] },
              { text: '', border: [true, false, true, true] },
              { text: '', border: [true, false, true, true] },
              { text: '', border: [true, false, true, true] }
            ]
          )
        } else if (this.item[i].fabric_type == 'S') {

          items.push(
            [
              { text: 'A La Carte - Supply Fabrics Only', border: [true, false, true, false], bold: true, decoration: 'underline' },
              { text: '', alignment: 'center', border: [true, false, true, false] },
              { text: '', alignment: 'center', border: [true, false, true, false] },
              { text: '', alignment: 'right', border: [true, false, true, false] },
              // { text: '', alignment: 'right', border: [true, false, true, false] }
            ]
          )
          console.log(this.calc[i]);


          if (this.item[i].fabric_sheer != null) {

            items.push(
              [
                { text: 'Sheer - ' + this.item[i].fabric_sheer + (this.item[i].code_sheer ? '-' + this.item[i].code_sheer : ''), border: [true, false, true, false] },
                { text: 'set', alignment: 'center', border: [true, false, true, false] },
                { text: 1, alignment: 'center', border: [true, false, true, false] },
                { text: (this.calc[i].sheer.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] },
              ]
            )


          }

          items.push(
            [
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] }
            ]
          )

          items.push(
            [
              { text: ' ', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false], bold: true, decoration: 'underline' }
            ]
          )

          items.push(
            [
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] }
            ]
          )

          if (this.item[i].remark_sheer || this.item[i].remark_sale) {

            items.push(
              [
                { text: 'Remark', border: [true, false, true, false], decoration: 'underline' },
                { text: '', fontSize: 8.5, border: [true, false, true, false] },
                { text: '', alignment: 'center', border: [true, false, true, false] },
                { text: '', border: [true, false, true, false] },
              ]
            )

            if (this.item[i].remark_sheer) {

              items.push(
                [
                  { text: 'Sheer : ' + (this.item[i].remark_sheer || ''), fontSize: 8, border: [true, false, true, false] },
                  { text: '', fontSize: 8.5, border: [true, false, true, false] },
                  { text: '', alignment: 'center', border: [true, false, true, false] },
                  { text: '', border: [true, false, true, false] },
                ]
              )
            }

            if (this.item[i].remark_sale) {
              items.push(
                [
                  { text: 'Overall : \n' + (this.item[i].remark_sale || ''), fontSize: 8, border: [true, false, true, false] },
                  { text: '', fontSize: 8.5, border: [true, false, true, false] },
                  { text: '', alignment: 'center', border: [true, false, true, false] },
                  { text: '', border: [true, false, true, false] },
                ]
              )
            }

          }

          items.push(
            [
              { text: '', border: [true, false, true, true] },
              { text: '', border: [true, false, true, true] },
              { text: '', border: [true, false, true, true] },
              { text: '', border: [true, false, true, true] }
            ]
          )
        } else if (this.item[i].fabric_type == 'CS') {

          console.log(this.calc[i]);

          items.push(
            [
              { text: 'A La Carte - Supply Fabrics Only', border: [true, false, true, false], bold: true, decoration: 'underline' },
              { text: '', alignment: 'center', border: [true, false, true, false] },
              { text: '', alignment: 'center', border: [true, false, true, false] },
              { text: '', alignment: 'right', border: [true, false, true, false] },
            ]
          )

          if (this.item[i].fabric != null) {
            items.push(
              [
                { text: 'Curtain - ' + this.item[i].fabric + (this.item[i].code_curtain ? '-' + this.item[i].code_curtain : ''), border: [true, false, true, false] },
                { text: 'set', alignment: 'center', border: [true, false, true, false] },
                { text: 1, alignment: 'center', border: [true, false, true, false] },
                { text: (this.calc[i].curtain.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] },
              ]
            )
          }

          // if (this.item[i].fabric_lining != null) {
          //   items.push(
          //     [
          //       { text: 'Lining - ' + this.item[i].fabric_lining + (this.item[i].code_lining ? '-' + this.item[i].code_lining : ''), border: [true, false, true, false] },
          //       { text: 'set', alignment: 'center', border: [true, false, true, false] },
          //       { text: 1, alignment: 'center', border: [true, false, true, false] },
          //       { text: (this.calc[i].lining.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] },
          //     ]
          //   )
          // }

          if (this.item[i].fabric_sheer != null) {

            items.push(
              [
                { text: 'Sheer - ' + this.item[i].fabric_sheer + (this.item[i].code_sheer ? '-' + this.item[i].code_sheer : ''), border: [true, false, true, false] },
                { text: 'set', alignment: 'center', border: [true, false, true, false] },
                { text: 1, alignment: 'center', border: [true, false, true, false] },
                { text: this.calc[i].sheer.total, alignment: 'right', border: [true, false, true, false] },
              ]
            )

          }

          items.push(
            [
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] }
            ]
          )

          items.push(
            [
              { text: ' ', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false], bold: true, decoration: 'underline' }
            ]
          )

          items.push(
            [
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] }
            ]
          )

          if (this.item[i].remark_curtain || this.item[i].remark_sheer || this.item[i].remark_sale) {
            items.push(
              [
                { text: 'Remark', border: [true, false, true, false], decoration: 'underline' },
                { text: '', fontSize: 8.5, border: [true, false, true, false] },
                { text: '', alignment: 'center', border: [true, false, true, false] },
                { text: '', border: [true, false, true, false] },
              ]
            )

            if (this.item[i].remark_curtain) {
              items.push(
                [
                  { text: 'Curtain : ' + (this.item[i].remark_curtain || ''), fontSize: 8, border: [true, false, true, false] },
                  { text: '', fontSize: 8.5, border: [true, false, true, false] },
                  { text: '', alignment: 'center', border: [true, false, true, false] },
                  { text: '', border: [true, false, true, false] },
                ]
              )
            }

            if (this.item[i].remark_sheer) {
              items.push(
                [
                  { text: 'Sheer : ' + (this.item[i].remark_sheer || ''), fontSize: 8, border: [true, false, true, false] },
                  { text: '', fontSize: 8.5, border: [true, false, true, false] },
                  { text: '', alignment: 'center', border: [true, false, true, false] },
                  { text: '', border: [true, false, true, false] },
                ]
              )
            }

            if (this.item[i].remark_sale) {
              items.push(
                [
                  { text: 'Overall : \n' + (this.item[i].remark_sale || ''), fontSize: 8, border: [true, false, true, false] },
                  { text: '', fontSize: 8.5, border: [true, false, true, false] },
                  { text: '', alignment: 'center', border: [true, false, true, false] },
                  { text: '', border: [true, false, true, false] },
                ]
              )
            }

          }

          items.push(
            [
              { text: '', border: [true, false, true, true] },
              { text: '', border: [true, false, true, true] },
              { text: '', border: [true, false, true, true] },
              { text: '', border: [true, false, true, true] }
            ]
          )
        }

      } else if (this.item[i].type == '2') {
        isTrack = true
        items.push(
          [
            { text: 'A La Carte - Supply Track Only', border: [true, false, true, false], bold: true, decoration: 'underline' },
            { text: '', alignment: 'center', border: [true, false, true, false] },
            { text: '', alignment: 'center', border: [true, false, true, false] },
            { text: '', alignment: 'right', border: [true, false, true, false] },
          ]
        )

        if (this.lengthof(this.calc[i].track) > 0) {
          items.push(
            [
              { text: 'Track - ' + this.item[i].track, border: [true, false, true, false] },
              { text: 'set', alignment: 'center', border: [true, false, true, false] },
              { text: 1, alignment: 'center', border: [true, false, true, false] },
              { text: (this.calc[i].track.total + this.calc[i].install.belt_hook).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] },
            ]
          )
        }

        items.push(
          [
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] }
          ]
        )

        items.push(
          [
            { text: ' ', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false], bold: true, decoration: 'underline' }
          ]
        )

        items.push(
          [
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] }
          ]
        )

        if (this.item[i].remark_sale) {

          items.push(
            [
              { text: 'Remark', border: [true, false, true, false], decoration: 'underline' },
              { text: '', fontSize: 8.5, border: [true, false, true, false] },
              { text: '', alignment: 'center', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
            ]
          )

          items.push(
            [
              { text: 'Overall : \n' + (this.item[i].remark_sale || ''), fontSize: 8, border: [true, false, true, false] },
              { text: '', fontSize: 8.5, border: [true, false, true, false] },
              { text: '', alignment: 'center', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
            ]
          )

        }

        items.push(
          [
            { text: '', border: [true, false, true, true] },
            { text: '', border: [true, false, true, true] },
            { text: '', border: [true, false, true, true] },
            { text: '', border: [true, false, true, true] }
          ]
        )

      } else if (this.item[i].type == '3') {
        isAccessories = true



        items.push(
          [
            { text: 'A La Carte - Supply Accessories Only', border: [true, false, true, false], bold: true, decoration: 'underline' },
            { text: '', alignment: 'center', border: [true, false, true, false] },
            { text: '', alignment: 'center', border: [true, false, true, false] },
            { text: '', alignment: 'right', border: [true, false, true, false] },
          ]
        )

        for (let j = 0; j < this.calc[i].accessories.products.length; j++) {

          items.push(
            [
              { text: 'Accessory - ' + this.calc[i].accessories.products[j].acce_title, border: [true, false, true, false] },
              { text: 'pcs', alignment: 'center', border: [true, false, true, false] },
              { text: this.calc[i].accessories.products[j].acce_quantity, alignment: 'center', border: [true, false, true, false] },
              { text: (this.calc[i].accessories.products[j].acce_total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] },
            ]
          )

        }

        items.push(
          [
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] }
          ]
        )

        items.push(
          [
            { text: ' ', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false], bold: true, decoration: 'underline' }
          ]
        )

        items.push(
          [
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] }
          ]
        )

        if (this.item[i].remark_sale) {

          items.push(
            [
              { text: 'Remark', border: [true, false, true, false], decoration: 'underline' },
              { text: '', fontSize: 8.5, border: [true, false, true, false] },
              { text: '', alignment: 'center', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
            ]
          )

          items.push(
            [
              { text: 'Overall : \n' + (this.item[i].remark_sale || ''), fontSize: 8, border: [true, false, true, false] },
              { text: '', fontSize: 8.5, border: [true, false, true, false] },
              { text: '', alignment: 'center', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
            ]
          )

        }

        items.push(
          [
            { text: '', border: [true, false, true, true] },
            { text: '', border: [true, false, true, true] },
            { text: '', border: [true, false, true, true] },
            { text: '', border: [true, false, true, true] }
          ]
        )

      } else if (this.item[i].type == '4') {
        isMotor = true
        items.push(
          [
            { text: 'A La Carte - Supply & Install Motorised Track', border: [true, false, true, false], bold: true, decoration: 'underline' },
            { text: '', alignment: 'center', border: [true, false, true, false] },
            { text: '', alignment: 'center', border: [true, false, true, false] },
            { text: '', alignment: 'right', border: [true, false, true, false] },
          ]
        )

        if (this.lengthof(this.calc[i].motorized) > 0) {
          items.push(
            [
              { text: 'Motorised Track - ' + this.item[i].motorized_choice + ' (' + this.item[i].motorized_power + ')', border: [true, false, true, false] },
              { text: 'set', alignment: 'center', border: [true, false, true, false] },
              { text: 1, alignment: 'center', border: [true, false, true, false] },
              { text: (this.calc[i].motorized.total + this.calc[i].motorized.install + this.calc[i].motorized.lift).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] },
            ]
          )

        }

        items.push(
          [
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] }
          ]
        )

        items.push(
          [
            { text: ' ', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false], bold: true, decoration: 'underline' }
          ]
        )

        items.push(
          [
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] }
          ]
        )

        if (this.item[i].remark_sale) {

          items.push(
            [
              { text: 'Remark', border: [true, false, true, false], decoration: 'underline' },
              { text: '', fontSize: 8.5, border: [true, false, true, false] },
              { text: '', alignment: 'center', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
            ]
          )

          if (this.item[i].remark_sale) {
            items.push(
              [
                { text: 'Overall : \n' + (this.item[i].remark_sale || ''), fontSize: 8, border: [true, false, true, false] },
                { text: '', fontSize: 8.5, border: [true, false, true, false] },
                { text: '', alignment: 'center', border: [true, false, true, false] },
                { text: '', border: [true, false, true, false] },
              ]
            )
          }

        }

        items.push(
          [
            { text: '', border: [true, false, true, true] },
            { text: '', border: [true, false, true, true] },
            { text: '', border: [true, false, true, true] },
            { text: '', border: [true, false, true, true] }
          ]
        )


      } else if (this.item[i].type == '5') {
        isSewing = true

        items.push(
          [
            { text: 'A La Carte - Sewing ' + ((this.item[i].track || this.item[i].track_sheer) ? '& Track' : 'Only'), border: [true, false, true, false], bold: true, decoration: 'underline' },
            { text: '', alignment: 'center', border: [true, false, true, false] },
            { text: '', alignment: 'center', border: [true, false, true, false] },
            { text: '', alignment: 'right', border: [true, false, true, false] },
          ]
        )

        if (this.lengthof(this.calc[i].sewing_curtain) > 0) {
          items.push(
            [
              { text: 'Sewing - Curtain', border: [true, false, true, false] },
              { text: 'set', alignment: 'center', border: [true, false, true, false] },
              { text: 1, alignment: 'center', border: [true, false, true, false] },
              {
                text: (
                  this.calc[i].sewing_curtain.total +
                  this.calc[i].install.total +
                  this.calc[i].install.belt_hook +
                  (this.calc[i].install.eyelet_curtain != 0 ? this.calc[i].install.eyelet_curtain : 0) +
                  (this.lengthof(this.calc[i].track) > 0 ? this.calc[i].track.total : 0) +
                  (this.lengthof(this.calc[i].motorized) > 0 ? this.calc[i].motorized.total + this.calc[i].motorized.install + this.calc[i].motorized.lift : 0)
                ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false]
              },
            ]
          )
        }

        if (this.lengthof(this.calc[i].sewing_sheer) > 0) {
          items.push(
            [
              { text: 'Sewing - Sheer', border: [true, false, true, false] },
              { text: 'set', alignment: 'center', border: [true, false, true, false] },
              { text: 1, alignment: 'center', border: [true, false, true, false] },
              {
                text: (
                  this.calc[i].sewing_sheer.total +
                  (this.item[i].fabric_type != 'CS' ? this.calc[i].install.total : 0) +
                  (this.calc[i].install.eyelet_sheer != 0 ? this.calc[i].install.eyelet_sheer : 0) +
                  (this.lengthof(this.calc[i].track_sheer) > 0 ? this.calc[i].track_sheer.total : 0) +
                  (this.lengthof(this.calc[i].motorized) > 0 && this.item[i].fabric_type != 'CS' ? this.calc[i].motorized.total + this.calc[i].motorized.install + this.calc[i].motorized.lift : 0)
                ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false]
              },
            ]
          )
        }

        items.push(
          [
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] }
          ]
        )

        items.push(
          [
            { text: ' ', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false], bold: true, decoration: 'underline' }
          ]
        )

        items.push(
          [
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] }
          ]
        )

        if (this.item[i].remark_sale) {

          items.push(
            [
              { text: 'Remark', border: [true, false, true, false], decoration: 'underline' },
              { text: '', fontSize: 8.5, border: [true, false, true, false] },
              { text: '', alignment: 'center', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
            ]
          )

          if (this.item[i].remark_sale) {
            items.push(
              [
                { text: 'Overall : \n' + (this.item[i].remark_sale || ''), fontSize: 8, border: [true, false, true, false] },
                { text: '', fontSize: 8.5, border: [true, false, true, false] },
                { text: '', alignment: 'center', border: [true, false, true, false] },
                { text: '', border: [true, false, true, false] },
              ]
            )
          }

        }

        items.push(
          [
            { text: '', border: [true, false, true, true] },
            { text: '', border: [true, false, true, true] },
            { text: '', border: [true, false, true, true] },
            { text: '', border: [true, false, true, true] }
          ]
        )

      } else if (this.item[i].type == '6') {
        isWallpaper = true

        items.push(
          [
            { text: 'A La Carte - Supply Wallpaper Only', border: [true, false, true, false], bold: true, decoration: 'underline' },
            { text: '', alignment: 'center', border: [true, false, true, false] },
            { text: '', alignment: 'center', border: [true, false, true, false] },
            { text: '', alignment: 'right', border: [true, false, true, false] },
          ]
        )

        items.push(
          [
            { text: 'Wallpaper - ' + this.calc[i].wallpaper.products.name, border: [true, false, true, false] },
            { text: this.calc[i].wallpaper.products.unit, alignment: 'center', border: [true, false, true, false] },
            { text: this.calc[i].wallpaper.products.quantity, alignment: 'center', border: [true, false, true, false] },
            { text: (this.calc[i].wallpaper.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] },
          ]
        )

        items.push(
          [
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] }
          ]
        )

        items.push(
          [
            { text: ' ', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false], bold: true, decoration: 'underline' }
          ]
        )

        items.push(
          [
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] }
          ]
        )

        if (this.item[i].remark_sale) {

          items.push(
            [
              { text: 'Remark', border: [true, false, true, false], decoration: 'underline' },
              { text: '', fontSize: 8.5, border: [true, false, true, false] },
              { text: '', alignment: 'center', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
            ]
          )

          items.push(
            [
              { text: 'Overall : \n' + (this.item[i].remark_sale || ''), fontSize: 8, border: [true, false, true, false] },
              { text: '', fontSize: 8.5, border: [true, false, true, false] },
              { text: '', alignment: 'center', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
            ]
          )

        }

        items.push(
          [
            { text: '', border: [true, false, true, true] },
            { text: '', border: [true, false, true, true] },
            { text: '', border: [true, false, true, true] },
            { text: '', border: [true, false, true, true] }
          ]
        )

      } else if (this.item[i].type == 'Tailor-Made Curtains') {

        if (this.item[i].fabric_type == 'C') {
          isCurtain = true
          items.push(
            [
              { text: this.item[i].location + ' ' + this.item[i].location_ref, border: [true, false, true, false], bold: true, decoration: 'underline' },
              { text: '', alignment: 'center', border: [true, false, true, false] },
              { text: '', alignment: 'center', border: [true, false, true, false] },
              { text: '', alignment: 'right', border: [true, false, true, false] },
              // { text: '', alignment: 'right', border: [true, false, true, false] }
            ]
          )

          if (this.item[i].fabric != null) {
            if (this.lengthof(this.calc[i].track) > 0) {
              if (this.lengthof(this.calc[i].motorized) > 0) {
                items.push(
                  [
                    { text: 'Curtain - ' + this.item[i].fabric + (this.item[i].code_curtain ? '-' + this.item[i].code_curtain : ''), border: [true, false, true, false] },
                    { text: 'set', alignment: 'center', border: [true, false, true, false] },
                    { text: 1, alignment: 'center', border: [true, false, true, false] },
                    { text: (this.calc[i].curtain.total + this.calc[i].install.total + this.calc[i].sewing_curtain.total + this.calc[i].track.total + this.calc[i].motorized.total + this.calc[i].motorized.install + this.calc[i].motorized.lift + this.calc[i]['install']['belt_hook'] + this.calc[i]['install']['climbing_price'] + (this.item[i].eyelet_curtain ? this.calc[i].curtain.eyelet_curtain : 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] },
                    // { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] } + this.calc[i]['install']['scaftfolding_price']
                  ]
                )

              } else {
                items.push(
                  [
                    { text: 'Curtain - ' + this.item[i].fabric + (this.item[i].code_curtain ? '-' + this.item[i].code_curtain : ''), border: [true, false, true, false] },
                    { text: 'set', alignment: 'center', border: [true, false, true, false] },
                    { text: 1, alignment: 'center', border: [true, false, true, false] },
                    { text: (this.calc[i].curtain.total + this.calc[i].install.total + this.calc[i].sewing_curtain.total + this.calc[i].track.total + this.calc[i]['install']['belt_hook'] + this.calc[i]['install']['climbing_price'] + (this.item[i].eyelet_curtain ? this.calc[i].curtain.eyelet_curtain : 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] },
                    // { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] }+ this.calc[i]['install']['scaftfolding_price']
                  ]
                )
              }
            } else {
              items.push(
                [
                  { text: 'Curtain - ' + this.item[i].fabric + (this.item[i].code_curtain ? '-' + this.item[i].code_curtain : ''), border: [true, false, true, false] },
                  { text: 'set', alignment: 'center', border: [true, false, true, false] },
                  { text: 1, alignment: 'center', border: [true, false, true, false] },
                  { text: (this.calc[i].curtain.total + this.calc[i].install.total + this.calc[i].sewing_curtain.total + this.calc[i]['install']['belt_hook'] + this.calc[i]['install']['climbing_price'] + (this.item[i].eyelet_curtain ? this.calc[i].curtain.eyelet_curtain : 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] },
                  // { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] }+ this.calc[i]['install']['scaftfolding_price']
                ]
              )
            }

          }

          if (this.item[i].fabric_lining != null) {
            items.push(
              [
                { text: 'Lining - ' + this.item[i].fabric_lining + (this.item[i].code_lining ? '-' + this.item[i].code_lining : ''), border: [true, false, true, false] },
                { text: 'set', alignment: 'center', border: [true, false, true, false] },
                { text: 1, alignment: 'center', border: [true, false, true, false] },
                { text: (this.calc[i].lining.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] },
                // { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] }
              ]
            )
          }

          items.push(
            [
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] }
            ]
          )

          items.push(
            [
              { text: ' ', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false], bold: true, decoration: 'underline' }
            ]
          )

          items.push(
            [
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] }
            ]
          )

          if (this.item[i].remark_curtain || this.item[i].remark_sale) {

            items.push(
              [
                { text: 'Remark', border: [true, false, true, false], decoration: 'underline' },
                { text: '', fontSize: 8.5, border: [true, false, true, false] },
                { text: '', alignment: 'center', border: [true, false, true, false] },
                { text: '', border: [true, false, true, false] },
                // { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] }
              ]
            )

            if (this.item[i].remark_curtain) {
              items.push(
                [
                  { text: 'Curtain : ' + (this.item[i].remark_curtain || ''), fontSize: 8, border: [true, false, true, false] },
                  { text: '', fontSize: 8.5, border: [true, false, true, false] },
                  { text: '', alignment: 'center', border: [true, false, true, false] },
                  { text: '', border: [true, false, true, false] },
                  // { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] }
                ]
              )
            }

            if (this.item[i].remark_sale) {
              items.push(
                [
                  { text: 'Overall : \n' + (this.item[i].remark_sale || ''), fontSize: 8, border: [true, false, true, false] },
                  { text: '', fontSize: 8.5, border: [true, false, true, false] },
                  { text: '', alignment: 'center', border: [true, false, true, false] },
                  { text: '', border: [true, false, true, false] },
                  // { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] }
                ]
              )
            }

          }

          // if (this.item[i].remark_sale) {
          //   items.push(
          //     [
          //       { text: 'Remark Order : ' + (this.item[i].remark_sale || ''), fontSize: 8, border: [true, false, true, false] },
          //       { text: '', fontSize: 8.5, border: [true, false, true, false] },
          //       { text: '', alignment: 'center', border: [true, false, true, false] },
          //       { text: '', border: [true, false, true, false] },
          //       // { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] }
          //     ]
          //   )
          // }

          items.push(
            [
              { text: '', border: [true, false, true, true] },
              { text: '', border: [true, false, true, true] },
              { text: '', border: [true, false, true, true] },
              { text: '', border: [true, false, true, true] }
            ]
          )
        } else if (this.item[i].fabric_type == 'S') {
          isSheer = true
          items.push(
            [
              { text: this.item[i].location + ' ' + this.item[i].location_ref, border: [true, false, true, false], bold: true, decoration: 'underline' },
              { text: '', alignment: 'center', border: [true, false, true, false] },
              { text: '', alignment: 'center', border: [true, false, true, false] },
              { text: '', alignment: 'right', border: [true, false, true, false] },
              // { text: '', alignment: 'right', border: [true, false, true, false] }
            ]
          )
          console.log(this.calc[i]);


          if (this.item[i].fabric_sheer != null) {
            if (this.lengthof(this.calc[i].track_sheer) > 0) {
              if (this.lengthof(this.calc[i].motorized) > 0) {
                items.push(
                  [
                    { text: 'Sheer - ' + this.item[i].fabric_sheer + (this.item[i].code_sheer ? '-' + this.item[i].code_sheer : ''), border: [true, false, true, false] },
                    { text: 'set', alignment: 'center', border: [true, false, true, false] },
                    { text: 1, alignment: 'center', border: [true, false, true, false] },
                    { text: (this.calc[i].sheer.total + this.calc[i].sewing_sheer.total + this.calc[i].install.total + this.calc[i].track_sheer.total + this.calc[i].motorized.total + this.calc[i].motorized.lift + this.calc[i].motorized.install + this.calc[i]['install']['belt_hook'] + this.calc[i]['install']['climbing_price'] + (this.item[i].eyelet_sheer ? this.calc[i].sheer.eyelet_sheer : 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] },
                    // { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] }+ this.calc[i]['install']['scaftfolding_price']
                  ]
                )
              } else {
                items.push(
                  [
                    { text: 'Sheer - ' + this.item[i].fabric_sheer + (this.item[i].code_sheer ? '-' + this.item[i].code_sheer : ''), border: [true, false, true, false] },
                    { text: 'set', alignment: 'center', border: [true, false, true, false] },
                    { text: 1, alignment: 'center', border: [true, false, true, false] },
                    { text: (this.calc[i].sheer.total + this.calc[i].sewing_sheer.total + this.calc[i].install.total + this.calc[i].track_sheer.total + this.calc[i]['install']['belt_hook'] + this.calc[i]['install']['climbing_price'] + (this.item[i].eyelet_sheer ? this.calc[i].sheer.eyelet_sheer : 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] },
                    // { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] }+ this.calc[i]['install']['scaftfolding_price']
                  ]
                )
              }

            } else {
              items.push(
                [
                  { text: 'Sheer - ' + this.item[i].fabric_sheer + (this.item[i].code_sheer ? '-' + this.item[i].code_sheer : ''), border: [true, false, true, false] },
                  { text: 'set', alignment: 'center', border: [true, false, true, false] },
                  { text: 1, alignment: 'center', border: [true, false, true, false] },
                  { text: (this.calc[i].sheer.total + this.calc[i].sewing_sheer.total + this.calc[i].install.total + this.calc[i]['install']['climbing_price'] + (this.item[i].eyelet_sheer ? this.calc[i].sheer.eyelet_sheer : 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] },
                  // { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] }
                ]
              )
            }


          }

          items.push(
            [
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] }
            ]
          )

          items.push(
            [
              { text: ' ', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false], bold: true, decoration: 'underline' }
            ]
          )

          items.push(
            [
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] }
            ]
          )

          if (this.item[i].remark_sheer || this.item[i].remark_sale) {

            items.push(
              [
                { text: 'Remark', border: [true, false, true, false], decoration: 'underline' },
                { text: '', fontSize: 8.5, border: [true, false, true, false] },
                { text: '', alignment: 'center', border: [true, false, true, false] },
                { text: '', border: [true, false, true, false] },
                // { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] }
              ]
            )

            if (this.item[i].remark_sheer) {

              items.push(
                [
                  { text: 'Sheer : ' + (this.item[i].remark_sheer || ''), fontSize: 8, border: [true, false, true, false] },
                  { text: '', fontSize: 8.5, border: [true, false, true, false] },
                  { text: '', alignment: 'center', border: [true, false, true, false] },
                  { text: '', border: [true, false, true, false] },
                  // { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] }
                ]
              )
            }

            if (this.item[i].remark_sale) {
              items.push(
                [
                  { text: 'Overall : \n' + (this.item[i].remark_sale || ''), fontSize: 8, border: [true, false, true, false] },
                  { text: '', fontSize: 8.5, border: [true, false, true, false] },
                  { text: '', alignment: 'center', border: [true, false, true, false] },
                  { text: '', border: [true, false, true, false] },
                  // { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] }
                ]
              )
            }

          }

          // if (this.item[i].remark_sale) {
          //   items.push(
          //     [
          //       { text: 'Remark Order : ' + (this.item[i].remark_sale || ''), fontSize: 8, border: [true, false, true, false] },
          //       { text: '', fontSize: 8.5, border: [true, false, true, false] },
          //       { text: '', alignment: 'center', border: [true, false, true, false] },
          //       { text: '', border: [true, false, true, false] },
          //       // { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] }
          //     ]
          //   )
          // }

          items.push(
            [
              { text: '', border: [true, false, true, true] },
              { text: '', border: [true, false, true, true] },
              { text: '', border: [true, false, true, true] },
              { text: '', border: [true, false, true, true] }
            ]
          )
        } else if (this.item[i].fabric_type == 'CS') {

          console.log(this.calc[i]);

          isCurtain = true
          isSheer = true
          items.push(
            [
              { text: this.item[i].location + ' ' + this.item[i].location_ref, border: [true, false, true, false], bold: true, decoration: 'underline' },
              { text: '', alignment: 'center', border: [true, false, true, false] },
              { text: '', alignment: 'center', border: [true, false, true, false] },
              { text: '', alignment: 'right', border: [true, false, true, false] },
              // { text: '', alignment: 'right', border: [true, false, true, false] }
            ]
          )

          if (this.item[i].fabric != null) {
            if (this.lengthof(this.calc[i].track) > 0) {
              if (this.lengthof(this.calc[i].motorized) > 0) {
                items.push(
                  [
                    { text: 'Curtain - ' + this.item[i].fabric + (this.item[i].code_curtain ? '-' + this.item[i].code_curtain : ''), border: [true, false, true, false] },
                    { text: 'set', alignment: 'center', border: [true, false, true, false] },
                    { text: 1, alignment: 'center', border: [true, false, true, false] },
                    { text: (this.calc[i].curtain.total + this.calc[i].install.total + this.calc[i].sewing_curtain.total + this.calc[i].track.total + this.calc[i].motorized.total + this.calc[i].motorized.lift + this.calc[i].motorized.install + this.calc[i]['install']['belt_hook'] + this.calc[i]['install']['climbing_price'] + (this.item[i].eyelet_curtain ? this.calc[i].curtain.eyelet_curtain : 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] },
                    // { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] } + this.calc[i]['install']['scaftfolding_price']
                  ]
                )
              } else {
                items.push(
                  [
                    { text: 'Curtain - ' + this.item[i].fabric + (this.item[i].code_curtain ? '-' + this.item[i].code_curtain : ''), border: [true, false, true, false] },
                    { text: 'set', alignment: 'center', border: [true, false, true, false] },
                    { text: 1, alignment: 'center', border: [true, false, true, false] },
                    { text: (this.calc[i].curtain.total + this.calc[i].install.total + this.calc[i].sewing_curtain.total + this.calc[i].track.total + this.calc[i]['install']['belt_hook'] + this.calc[i]['install']['climbing_price'] + (this.item[i].eyelet_curtain ? this.calc[i].curtain.eyelet_curtain : 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] },
                    // { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] }+ this.calc[i]['install']['scaftfolding_price']
                  ]
                )
              }

            } else {
              items.push(
                [
                  { text: 'Curtain - ' + this.item[i].fabric + (this.item[i].code_curtain ? '-' + this.item[i].code_curtain : ''), border: [true, false, true, false] },
                  { text: 'set', alignment: 'center', border: [true, false, true, false] },
                  { text: 1, alignment: 'center', border: [true, false, true, false] },
                  { text: (this.calc[i].curtain.total + this.calc[i].install.total + this.calc[i].sewing_curtain.total + this.calc[i]['install']['belt_hook'] + this.calc[i]['install']['climbing_price'] + (this.item[i].eyelet_curtain ? this.calc[i].curtain.eyelet_curtain : 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] },
                  // { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] }  + this.calc[i]['install']['scaftfolding_price']
                ]
              )
            }


          }

          if (this.item[i].fabric_lining != null) {
            items.push(
              [
                { text: 'Lining - ' + this.item[i].fabric_lining + (this.item[i].code_lining ? '-' + this.item[i].code_lining : ''), border: [true, false, true, false] },
                { text: 'set', alignment: 'center', border: [true, false, true, false] },
                { text: 1, alignment: 'center', border: [true, false, true, false] },
                { text: (this.calc[i].lining.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] },
                // { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] }
              ]
            )
          }

          if (this.item[i].fabric_sheer != null) {
            if (this.lengthof(this.calc[i].track_sheer) > 0) {
              items.push(
                [
                  { text: 'Sheer - ' + this.item[i].fabric_sheer + (this.item[i].code_sheer ? '-' + this.item[i].code_sheer : ''), border: [true, false, true, false] },
                  { text: 'set', alignment: 'center', border: [true, false, true, false] },
                  { text: 1, alignment: 'center', border: [true, false, true, false] },
                  { text: (this.calc[i].sheer.total + this.calc[i].sewing_sheer.total + this.calc[i].track_sheer.total + (this.item[i].eyelet_sheer ? this.calc[i].sheer.eyelet_sheer : 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] },
                  // { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] }
                ]
              )
            } else {
              items.push(
                [
                  { text: 'Sheer - ' + this.item[i].fabric_sheer + (this.item[i].code_sheer ? '-' + this.item[i].code_sheer : ''), border: [true, false, true, false] },
                  { text: 'set', alignment: 'center', border: [true, false, true, false] },
                  { text: 1, alignment: 'center', border: [true, false, true, false] },
                  { text: (this.calc[i].sheer.total + this.calc[i].sewing_sheer.total + (this.item[i].eyelet_sheer ? this.calc[i].sheer.eyelet_sheer : 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] },
                  // { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] }
                ]
              )
            }

          }

          items.push(
            [
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] }
            ]
          )

          items.push(
            [
              { text: ' ', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false], bold: true, decoration: 'underline' }
            ]
          )

          items.push(
            [
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] }
            ]
          )

          if (this.item[i].remark_curtain || this.item[i].remark_sheer || this.item[i].remark_sale) {
            items.push(
              [
                { text: 'Remark', border: [true, false, true, false], decoration: 'underline' },
                { text: '', fontSize: 8.5, border: [true, false, true, false] },
                { text: '', alignment: 'center', border: [true, false, true, false] },
                { text: '', border: [true, false, true, false] },
                // { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] }
              ]
            )

            if (this.item[i].remark_curtain) {
              items.push(
                [
                  { text: 'Curtain : ' + (this.item[i].remark_curtain || ''), fontSize: 8, border: [true, false, true, false] },
                  { text: '', fontSize: 8.5, border: [true, false, true, false] },
                  { text: '', alignment: 'center', border: [true, false, true, false] },
                  { text: '', border: [true, false, true, false] },
                  // { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] }
                ]
              )
            }

            if (this.item[i].remark_sheer) {
              items.push(
                [
                  { text: 'Sheer : ' + (this.item[i].remark_sheer || ''), fontSize: 8, border: [true, false, true, false] },
                  { text: '', fontSize: 8.5, border: [true, false, true, false] },
                  { text: '', alignment: 'center', border: [true, false, true, false] },
                  { text: '', border: [true, false, true, false] },
                  // { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] }
                ]
              )
            }

            if (this.item[i].remark_sale) {
              items.push(
                [
                  { text: 'Overall : \n' + (this.item[i].remark_sale || ''), fontSize: 8, border: [true, false, true, false] },
                  { text: '', fontSize: 8.5, border: [true, false, true, false] },
                  { text: '', alignment: 'center', border: [true, false, true, false] },
                  { text: '', border: [true, false, true, false] },
                  // { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] }
                ]
              )
            }

          }

          // if (this.item[i].remark_sale) {
          //   items.push(
          //     [
          //       { text: 'Order : ' + (this.item[i].remark_sale || ''), fontSize: 8, border: [true, false, true, false] },
          //       { text: '', fontSize: 8.5, border: [true, false, true, false] },
          //       { text: '', alignment: 'center', border: [true, false, true, false] },
          //       { text: '', border: [true, false, true, false] },
          //       // { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] }
          //     ]
          //   )
          // }

          items.push(
            [
              { text: '', border: [true, false, true, true] },
              { text: '', border: [true, false, true, true] },
              { text: '', border: [true, false, true, true] },
              { text: '', border: [true, false, true, true] }
            ]
          )
        }

      } else if (this.item[i].type == 'Blinds') {
        isBlind = true

        items.push(
          [
            { text: this.item[i].location + ' ' + this.item[i].location_ref, border: [true, false, true, false], bold: true, decoration: 'underline' },
            { text: '', alignment: 'center', border: [true, false, true, false] },
            { text: '', alignment: 'center', border: [true, false, true, false] },
            { text: '', alignment: 'right', border: [true, false, true, false] },
            // { text: '', alignment: 'right', border: [true, false, true, false] }
          ]
        )

        if (this.item[i].pleat != 'Roman Blind') {
          items.push(
            [
              { text: this.item[i].pleat + ' - ' + this.item[i].fabric_blind + (this.item[i].code_blind ? '-' + this.item[i].code_blind : '') + (this.item[i].blind_tape && (this.item[i].pleat == 'Wooden Blind' || this.item[i].pleat == 'Venetian Blinds') ? (this.item[i].blind_tape.includes('Tape') ? ' (' : ' (Tape ') + this.item[i].blind_tape + ')' : ''), border: [true, false, true, false] },
              { text: 'set', alignment: 'center', border: [true, false, true, false] },
              { text: this.item[i].pieces_blind, alignment: 'center', border: [true, false, true, false] },
              { text: ((this.calc[i].blind.total + this.calc[i].install.total + this.calc[i].blind_spring.total + this.calc[i].blind_tube.total + this.calc[i].blind_easylift.total + this.calc[i].blind_monosys.total + this.calc[i]['install']['climbing_price']).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })), alignment: 'right', border: [true, false, true, false] },
              // { text: ((this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })), alignment: 'right', border: [true, false, true, false] }
            ]
          )
        }

        if (this.item[i].fabric != null && this.item[i].pleat == 'Roman Blind') {
          isCurtain = true
          items.push(
            [
              { text: 'Roman Blind - ' + this.item[i].fabric + (this.item[i].code_curtain ? '-' + this.item[i].code_curtain : ''), border: [true, false, true, false] },
              { text: 'set', alignment: 'center', border: [true, false, true, false] },
              { text: this.item[i].pieces_blind, alignment: 'center', border: [true, false, true, false] },
              { text: (this.calc[i].curtain.total + this.calc[i].sewing_curtain.total + this.calc[i].mechanism.total + this.calc[i]['install']['climbing_price'] + this.calc[i].install.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] },
              // { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] }
            ]
          )
        }

        if (this.item[i].fabric_lining != null) {
          items.push(
            [
              { text: 'Lining - ' + this.item[i].fabric_lining + (this.item[i].code_lining ? '-' + this.item[i].code_lining : ''), border: [true, false, true, false] },
              { text: 'set', alignment: 'center', border: [true, false, true, false] },
              { text: this.item[i].pieces_blind, alignment: 'center', border: [true, false, true, false] },
              { text: (this.calc[i].lining.total + this.calc[i].sewing_lining.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] },
              // { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] }
            ]
          )
        }

        items.push(
          [
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] }
          ]
        )

        items.push(
          [
            { text: ' ', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false], bold: true, decoration: 'underline' }
          ]
        )

        items.push(
          [
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] },
            { text: '', border: [true, false, true, false] }
          ]
        )

        if (this.item[i].remark_sale) {

          items.push(
            [
              { text: 'Remark', border: [true, false, true, false], decoration: 'underline' },
              { text: '', fontSize: 8.5, border: [true, false, true, false] },
              { text: '', alignment: 'center', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              // { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] }
            ]
          )

          items.push(
            [
              { text: 'Overall : \n' + (this.item[i].remark_sale || ''), fontSize: 8, border: [true, false, true, false] },
              { text: '', fontSize: 8.5, border: [true, false, true, false] },
              { text: '', alignment: 'center', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              // { text: (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, false, true, false] }
            ]
          )
        }

        items.push(
          [
            { text: '', border: [true, false, true, true] },
            { text: '', border: [true, false, true, true] },
            { text: '', border: [true, false, true, true] },
            { text: '', border: [true, false, true, true] }
          ]
        )
      }

    }
    console.log(items);

    //Ladder & Scaftfolding
    let ladderscaft = ''
    let LSprice = ''
    let insladderscaft = ''
    let insLSprice = ''

    // if (this.ladderDeliver && this.info.ladder_fee_status) {
    //   ladderscaft = 'LADDER (DELIVERY) + LADDER (INSTALLATION)'
    //   LSprice = '200.00'
    // } else {
    //   if (this.ladderDeliver) {
    //     ladderscaft = 'LADDER (DELIVERY)'
    //     LSprice = '100.00'
    //   }
    if (this.info.ladder_fee_status) {
      ladderscaft = 'BOMBA LADDER'
      LSprice = '200.00'
    }
    // }

    if (this.info.scaftfolding_fee_status) {
      insladderscaft = 'SCAFTFOLDING (DELIVER, INSTALL, DISMANTLE)'
      insLSprice = '500.00'
    }
    // else {
    //   if ( this.info.ladder_fee_status) {
    //     insladderscaft = 'LADDER (INSTALLATION)'
    //     insLSprice = '100.00'
    //   }
    //   if (this.info.scaftfolding_fee_status) {
    //     insladderscaft = 'SCAFTFOLDING (INSTALLATION)'
    //     insLSprice = '500.00'
    //   }
    // }
    // if (this.scaftfolding && this.info.scaftfolding_fee_status) {
    //   insladderscaft = 'SCAFTFOLDING (INSTALLATION)'
    //   insLSprice = '500.00'
    // }

    //Get Before Additional Price
    let total = 0
    for (let i = 0; i < this.item.length; i++) {
      total += this.item[i].price
    }

    // Package
    let packageWord = ''
    let packagePrice = 0
    if (this.info.package_code) {
      packageWord = this.packageApplied.type + ' PACKAGE OFFER (RM)'
      packagePrice = total - this.packageApplied.price + this.addCharges()
    }

    //is Curtain / Sheer / Blind
    isAccessories
    isMotor
    isSewing
    let job = ''
    if (isCurtain) {
      job = 'Curtain';
      if (isSheer) {
        job += ', Sheer';
      }
      if (isBlind) {
        job += ', Blinds';
      }
      if (isAccessories) {
        job += ', Accessories';
      }
      if (isMotor) {
        job += ', Motorized';
      }
      if (isSewing) {
        job += ', Sewing';
      }
      if (isTrack) {
        job += ', Track';
      }
      if (isFabric) {
        job += ', Fabric';
      }
    } else if (isBlind) {
      job = 'Blinds';
      if (isSheer) {
        job += ', Sheer';
      }
      if (isAccessories) {
        job += ', Accessories';
      }
      if (isMotor) {
        job += ', Motorized';
      }
      if (isSewing) {
        job += ', Sewing';
      }
      if (isTrack) {
        job += ', Track';
      }
      if (isFabric) {
        job += ', Fabric';
      }
    } else if (isSheer) {
      job = 'Sheer';
      if (isAccessories) {
        job += ', Accessories';
      }
      if (isMotor) {
        job += ', Motorized';
      }
      if (isSewing) {
        job += ', Sewing';
      }
      if (isTrack) {
        job += ', Track';
      }
      if (isFabric) {
        job += ', Fabric';
      }
    } else if (isAccessories) {
      job = 'Accessories';
      if (isMotor) {
        job += ', Motorized';
      }
      if (isSewing) {
        job += ', Sewing';
      }
      if (isTrack) {
        job += ', Track';
      }
      if (isFabric) {
        job += ', Fabric';
      }
    } else if (isMotor) {
      job = 'Motorized';
      if (isSewing) {
        job += ', Sewing';
      }
      if (isTrack) {
        job += ', Track';
      }
      if (isFabric) {
        job += ', Fabric';
      }
    } else if (isSewing) {
      job = 'Sewing';
      if (isTrack) {
        job += ', Track';
      }
      if (isFabric) {
        job += ', Fabric';
      }
    } else if (isTrack) {
      job = 'Track';
      if (isFabric) {
        job += ', Fabric';
      }
    } else if (isFabric) {
      job = 'Fabric';
    } else {
      job = '-';
    }



    var dd = {
      header: function (currentPage, pageCount, pageSize) {
        // you can apply any logic and return any valid pdfmake element

        return [
          {
            columns: [
              [
                {
                  alignment: 'left',
                  text: 'Crystalace Deco Sdn Bhd (959240-H)',
                  fontSize: 17,
                  bold: true,
                  width: '60%',
                  margin: [40, 20, 0, 0]
                },
                {
                  alignment: 'left',
                  text: '15, Jln PJU 3/49 Sunway Damansara Technology Park,47810 Petaling Jaya Selangor.',
                  fontSize: 8,
                  color: '#888',
                  bold: false,
                  width: '60%',
                  margin: [40, 0, 0, 0]
                },
                {
                  alignment: 'left',
                  text: 'www.crystalace.com.my        03-7803 1686',
                  fontSize: 8,
                  color: '#888',
                  bold: false,
                  width: '60%',
                  margin: [40, 0, 0, 0]
                }

              ],
              {
                alignment: 'right',
                text: 'Quotation Page ' + currentPage + ' of ' + pageCount,
                fontSize: 14,
                bold: true,
                width: '40%',
                margin: [0, 20, 40, 30],
              },
            ]
          },
          { canvas: [{ type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 }] }
        ]
      },

      content: [
        {
          columns: [
            {
              width: '50%',
              table: {
                widths: '100%',
                body: [
                  ['Customer:'],
                  customer_info
                  // ['Ms Chloe \n\n\n No 21, Jalan U13/53UC, Eco Ardence Seksyen U13, 40170 Shah Alam, Selangor \n\n\n 012-5256304 \n ']
                ]
              },
              layout: {
                fillColor: function (rowIndex, node, columnIndex) {
                  return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                }
              }
            },
            {
              width: '50%',
              table: {
                widths: ['50%', '50%'],
                body: quoinfo
              },
              layout: {
                fillColor: function (rowIndex, node, columnIndex) {
                  return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                }
              }
            }
          ]
        },

        // 		NON_DETAILED QUOTATION START
        // 	    HERE 1
        {
          width: '100%',
          margin: [0, 15, 0, 0],
          table: {
            widths: ['100%'],
            body: [
              ['Job'],
              [{ text: job + '\n ', bold: true, alignment: 'center' }]
            ]
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
            }
          }
        },

        //      HERE 3
        {
          width: '100%',
          margin: [0, 15, 0, 0],
          table: {
            headerRows: 1,
            //  dontBreakRows: true,
            //  keepWithHeaderRows: 1,
            widths: ['60%', '10%', '10%', '20%'],
            body: items
          },
        },
        {
          width: '100%',
          table: {
            widths: ['80%', '20%'],
            body: [
              [
                { text: 'Total', alignment: 'right', border: [true, false, false, true] },
                { text: ((total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })), alignment: 'right', border: [false, false, true, true] },
              ],
              [
                { text: ladderscaft, bold: true, border: [true, false, false, false] },
                { text: LSprice, alignment: 'right', border: [false, false, true, false] }
              ],
              [
                { text: this.info.scaftfolding_fee_status ? (insladderscaft + (this.info.scaftfolding_quantity > 1 ? ' x' + this.info.scaftfolding_quantity : '')) : '', bold: true, border: [true, false, false, true] },
                { text: this.info.scaftfolding_fee_status ? (500 * this.info.scaftfolding_quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '', alignment: 'right', border: [false, false, true, true] }
              ],
              [
                { text: this.info.transport_fee_status ? 'TRANSPORTATION FEES (RM)' : 'SELF PICK-UP (RM)', bold: true, border: [true, false, false, true] },
                { text: this.info.transport_fee_status ? (this.info.transport_fee).toFixed(2) : 'WAIVED', alignment: 'right', border: [false, false, true, true] },
              ],
              [
                { text: packageWord, bold: true, border: [true, false, false, true] },
                { text: this.info.package_code ? '(-' + (packagePrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ')' : '', alignment: 'right', border: [false, false, true, true] },
              ],
              [
                { text: this.info.package_code ? this.packageApplied.description : '', fontSize: 8, border: [true, false, false, true] },
                { text: '', alignment: 'right', border: [false, false, true, true] },
              ],
              [
                { text: this.info.package_addon ? 'TOP UP UPGRADE (RM)' : '', bold: true, border: [true, false, false, true] },
                { text: this.info.package_addon ? (this.packageApplied.add_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '', alignment: 'right', border: [false, false, true, true] },
              ],
              [
                '',
                '',
              ],
              [
                '',
                '',
              ],
              [
                '',
                '',
              ],
              [
                { text: 'FINAL TOTAL (RM)', bold: true, border: [true, false, false, true] },
                { text: (this.info.package_code ? (this.totalPrice() - packagePrice + (this.info.package_addon ? this.packageApplied.add_price : 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : (this.totalPrice()).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })), bold: true, alignment: 'right', border: [false, false, true, true] },
              ],
              [
                '',
                '',
              ],
              [
                '',
                '',
              ],
            ]
          },
          layout: {
            hLineWidth: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 1 : 1;
            },
            vLineWidth: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 1 : 1;
            },
            hLineColor: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 'black' : 'white';
            },
            vLineColor: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 'black' : 'white';
            },
          }
        },
        // {
        //   width: '100%',
        //   table: {
        //     widths: ['100%'],
        //     body: [
        //       [{ text: 'Price above is estimation.', fontSize: 9, border: [true, false, true, false] }],
        //       [{ text: 'Final price willbe adjusted according to actual site measurement and material selection', fontSize: 9, border: [true, false, true, true] }],
        //     ]
        //   }
        // },
        {
          width: '100%',
          table: {
            widths: ['100%'],
            body: [
              [{ text: 'Terms & Condition', bold: true }],
            ]
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
            },
            hLineWidth: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 0 : 0;
            },
            vLineWidth: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 1 : 1;
            },
            hLineColor: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 'black' : 'white';
            },
            vLineColor: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 'black' : 'white';
            },
          }
        },
        {
          width: '100%',
          table: {
            widths: ['100%'],
            body: [
              [{ text: 'Payment ', bold: true }],
              [{ text: 'Payment Detail: Ambank Account Number 2442 0220 04795 Crystalace Deco Sdn Bhd', fontSize: 9 }],
              [{ text: '' }],
              [{ text: 'Delivery ', bold: true }],
              [{ text: ': Within 2 to 4 working weeks after confirmation of order and it is subject to stock availability.', fontSize: 9 }],
              [{ text: ': Quotation valid for 30days. Prices are subjected to change according to actual final site measurement and condition.', fontSize: 9 }],
              [{ text: ': Work contracted is not inclusive of reinforcement and/or site modifications. Crystalace Deco Sdn Bhd is not responsible for cost incurred resulting from delayed site handover or/and unsuitable installation condition.', fontSize: 9 }],
              [{ text: '' }],
            ]
          },
          layout: {
            hLineWidth: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 1 : 1;
            },
            vLineWidth: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 1 : 1;
            },
            hLineColor: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 'black' : 'white';
            },
            vLineColor: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 'black' : 'white';
            },
          }
        },
        {
          text: '\nPlease do not hestitate to contact us at 03-7803 1686 if you have any enquiry, Thank You.', alignment: 'center', italics: true
        },
        // 	    NON_DETAILED QUOTATION END

      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      },
      defaultStyle: {
        columnGap: 20
      },
      pageMargins: [40, 70, 40, 60]

    }

    // pdfMake.createPdf(dd).open();
    this.pdfObj = pdfMake.createPdf(dd);

    if (pass) {
      this.uploadPdf(2)
    } else {
      this.downloadPdf()
    }
  }

  downloadPdf() {
    if (this.plt.is('cordova')) {
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });

        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.dataDirectory, this.quoRef + '.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + this.quoRef + '.pdf', 'application/pdf');
        })
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download(this.quoRef + '.pdf');
    }
  }

  uploadPdf(x) {
    this.pdfObj.getBuffer((buffer) => {
      var blob = new Blob([buffer], { type: 'application/pdf' });

      this.toBase64(blob).then(data => {
        console.log(data)
        this.http.post('https://forcar.vsnap.my/uploadPDF', { base64: data }).subscribe((link) => {
          console.log(link['imageURL']);

          if (x == 1) {
            console.log(this.info.quotation_detailed);

            this.info.quotation_detailed.push({ name: this.quoRef, link: link['imageURL'] })

            let temp = {
              no: this.sales_id,
              quotation_detailed: JSON.stringify(this.info.quotation_detailed),
              scaftfolding_quantity: this.info.scaftfolding_quantity
            }

            this.http.post('https://curtain.vsnap.my/updatesales', temp).subscribe(a => {
              this.pdfmakerClient(true)
            })
          } else if (x == 2) {
            this.info.quotation_client.push({ name: this.quoRef, link: link['imageURL'] })

            let temp = {
              no: this.sales_id,
              quotation_client: JSON.stringify(this.info.quotation_client),
              scaftfolding_quantity: this.info.scaftfolding_quantity
            }

            this.http.post('https://curtain.vsnap.my/updatesales', temp).subscribe(a => {
              this.checkout()
            })
          }

        }, awe => {
          console.log(awe);
        })
      });

    })
  }

  toBase64(blob) {
    const reader = new FileReader();
    return new Promise((res, rej) => {
      reader.readAsDataURL(blob);
      reader.onload = function () {
        res(reader.result);
      };
    });
  }

  checkTape(x) {

    if (x.includes('Tape')) {
      return true
    } else {
      return false
    }
  }

}
