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
import { DatePipe } from '@angular/common';
import { SafariViewController } from '@awesome-cordova-plugins/safari-view-controller/ngx';

pdfMake.vfs = pdfFonts.pdfMake.vfs
@Component({
  selector: 'app-task-ongoing-view-quotation',
  templateUrl: './task-ongoing-view-quotation.page.html',
  styleUrls: ['./task-ongoing-view-quotation.page.scss'],
})
export class TaskOngoingViewQuotationPage implements OnInit {

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
  packageApplied = [] as any
  packageViewed = [] as any
  packageName
  loading = false
  count = 0

  ladder = false
  scaftfolding = false
  scaftfoldingDeliver = false
  ladderDeliver = false
  due = 0

  pdfObj = null;

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
      this.pleatlist = JSON.parse(a["pleatlist"])
      this.blindlist = JSON.parse(a["blindlist"])
      this.tracklist = JSON.parse(a["tracklist"])

      this.http.post('https://curtain.vsnap.my/getonesales', { no: this.sales_id }).subscribe((s) => {
        this.info = s['data'][0]
        console.log(this.info);

        this.http.post('https://curtain.vsnap.my/onestaff', { id: this.info['id_sales'] }).subscribe(a => {
          this.salesmaninfo = a['data'][0]
          console.log(this.salesmaninfo);
        })

        this.http.post('https://curtain.vsnap.my/getthismonthsales', { month: this.datepipe.transform(new Date(), 'MMyyyy') }).subscribe(a => {
          this.thismonthsales = a['data'].sort((a, b) => b.sales_so_id - a.sales_so_id) || []
          console.log(this.thismonthsales);

          if (this.info.so_pdf.length > 0) {
            if ((this.info.so_pdf[this.info.so_pdf.length - 1].name).slice(2, 6) == this.datepipe.transform(new Date(), 'yyMM')) {
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

      })

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

  dueamount(i) {
    if (this.item[i].price_old != null) {
      let temp = this.item[i].price - this.item[i].price_old
      this.due += temp
      console.log(this.due);

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
    let tape_id
    let tape = false

    console.log(this.item[i]);

    if (this.item[i].type != 'Blinds') {

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

        if (this.item[i].pleat == 'Wooden Blind') {
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

    let temp = {
      width: parseFloat(width), height: parseFloat(height), curtain: curtain, lining: lining, lining_id: lining_id,
      curtain_id: curtain_id, sheer: sheer, sheer_id: sheer_id, track: track, track_id: track_id, pleat_id: pleat_id, pleat_sheer_id: pleat_sheer_id, track_sheer: track_sheer, track_sheer_id: track_sheer_id, blind: blind, blind_id: blind_id,
      pieces_curtain: this.item[i].pieces_curtain || 0, pieces_sheer: this.item[i].pieces_sheer || 0, pieces_blind: this.item[i].pieces_blind || 0,
      promo_curtain: this.item[i].promo_curtain || 0, promo_lining: this.item[i].promo_lining || 0, promo_sheer: this.item[i].promo_sheer || 0, promo_blind: this.item[i].promo_blind || 0,
      motorized: this.item[i].motorized_upgrade, motorized_cost: this.item[i].motorized_cost, motorized_power: this.item[i].motorized_power, motorized_choice: this.item[i].motorized_choice, motorized_pieces: this.item[i].motorized_pieces, motorized_lift: this.item[i].motorized_lift,
      belt_hook: belt_hook, isRomanBlind: isRomanBlind, tape: tape, tape_id: tape_id, blind_spring: this.item[i].blind_spring, blind_tube: this.item[i].blind_tube, blind_easylift: this.item[i].blind_easylift, blind_monosys: this.item[i].blind_monosys,
      eyelet_curtain: this.item[i].eyelet_curtain, eyelet_sheer: this.item[i].eyelet_sheer

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

  lengthof(x) {
    return Object.keys(x || {}).length
  }
  back() {
    this.nav.pop()
  }

  packageView() {
    this.viewPackage = true
  }

  closePackage() {
    this.viewPackage = false
  }

  async choosePDF(x) {
    console.log(x.length);

    if (x.length == 0) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      })

      Toast.fire({
        icon: 'info',
        title: 'List is Empty'
      })
    } else {


      let temp = []

      for (let i = 0; i < x.length; i++) {
        temp.push({
          label: x[i].name,
          type: 'radio',
          value: x[i].link,
        })
      }

      temp = temp.reverse()

      const alert = await this.alertController.create({
        header: 'Select Date',
        cssClass: 'alert-custom',
        inputs: temp,
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
              // window.open(data, '_system');
              this.safariViewController.isAvailable()
                .then(async (available: boolean) => {
                  if (available) {

                    this.safariViewController.show({
                      url: data,
                    })
                      .subscribe((result: any) => {
                        if (result.event === 'opened') console.log('Opened');
                        else if (result.event === 'loaded') console.log('Loaded');
                        else if (result.event === 'closed') console.log('Closed');
                      },
                        (error: any) => console.error(error)
                      );

                  } else {
                    window.open(data, '_system');
                    // use fallback browser, example InAppBrowser
                  }
                }).catch(async (error) => {
                  window.open(data, '_system');
                })
            }
          }
        ]
      });

      await alert.present();
    }

  }

  downloadPdf() {
    if (this.plt.is('cordova')) {
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });

        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.dataDirectory, 'quotation.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + 'quotation.pdf', 'application/pdf');
        })
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download();
    }
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
        // Swal.fire({
        //   title: 'Task Proceeded Successfully',
        //   icon: 'success',
        //   heightAuto: false,
        //   showConfirmButton: false,
        //   showCancelButton: false,
        //   timer: 1500,
        // })
        this.isCreateSo = false
        // this.nav.navigateRoot('/tabs/tab1')
      }
    })

  }

  // pdfmakerSO() {

  //   this.ref = this.info.reference + '-' + this.salesmaninfo.shortname

  //   let quoRef = 'QT' + this.datepipe.transform(new Date(), 'yyyyMMdd') + this.ref

  //   if (this.customSoNum != null && this.customSoNum != '' && this.checkChangeSO) {
  //     this.soNum = this.datepipe.transform(new Date(), 'yyMM') + '-' + ("000" + this.customSoNum).slice(-4)
  //     this.soNumDigit = this.customSoNum
  //   }

  //   let customer_info = []
  //   let today = new Date()
  //   let width = null
  //   let height = null

  //   //Customer
  //   let ci = ''
  //   ci = this.info.customer_name + '\n\n\n' + this.info.customer_address + '\n\n\n' + this.info.customer_phone + '\n '

  //   customer_info.push(ci)

  //   //Ref & Date & Validity & Sales
  //   // let ref = 'QT' + this.datepipe.transform(today, 'yyyyMMdd') + 'WI-TM'
  //   // let date = this.datepipe.transform(new Date(today), 'd/M/yyyy')
  //   // let validity = 'COD'
  //   // let salesphone = 'TM\n' + this.salesmaninfo.phone

  //   //SO number
  //   let sonum = { text: 'SO NO : ' + this.soNum }

  //   //SO info left
  //   let soinfoleft = [
  //     [{ text: 'Company Name:', border: [], bold: true, fontSize: 9 }, { text: ': ', border: [false, true, false, true], bold: true, fontSize: 9 }],
  //     [{ text: 'Client Name', border: [], bold: true, fontSize: 9 }, { text: ': ' + this.info.customer_name, border: [false, true, false, true], bold: true, fontSize: 9 }],
  //     [{ text: 'Phone No', border: [], bold: true, fontSize: 9 }, { text: ': ' + this.info.customer_phone, border: [false, true, false, true], bold: true, fontSize: 9 }],
  //     [{ text: 'Address', border: [], bold: true, fontSize: 9 }, { text: ': ' + this.info.customer_address, border: [false, true, false, true], bold: true, fontSize: 9 }],
  //     [{ text: 'Site Add', border: [], bold: true, fontSize: 9 }, { text: ': ' + this.info.customer_address, border: [false, true, false, true], bold: true, fontSize: 9 }],
  //     [{ text: 'Sew By', border: [false, false, false, true], bold: true, fontSize: 9 }, { text: ': ', border: [false, true, false, true], bold: true, fontSize: 9 }],
  //   ] as any

  //   //SO info right
  //   let soinforight = [
  //     [{ text: 'QT No.', border: [], bold: true, fontSize: 9, alignment: 'right' }, { text: ': ' + quoRef, border: [false, false, false, true], bold: true, fontSize: 9 }],
  //     [{ text: 'Date Order', border: [], bold: true, fontSize: 9, alignment: 'right' }, { text: ': ' + this.datepipe.transform(new Date(), 'd/M/yyyy'), border: [false, true, false, true], bold: true, fontSize: 9 }],
  //     [{ text: 'Scheduled Inst Date', border: [], bold: true, fontSize: 9, alignment: 'right' }, { text: ': ' + this.datepipe.transform(this.soInstDate, 'd/M/yyyy'), border: [false, true, false, true], bold: true, fontSize: 9 }],
  //     [{ text: 'Sales P.I.C', border: [], bold: true, fontSize: 9, alignment: 'right' }, { text: ': ' + this.salesmaninfo.name, border: [false, true, false, true], bold: true, fontSize: 9 }],
  //     [{ text: 'Est. Inst Time', border: [], bold: true, fontSize: 9, alignment: 'right' }, { text: ': ' + this.soInstTime, border: [false, true, false, true], bold: true, fontSize: 9 }],
  //     [{ text: 'Remarks', border: [], bold: true, fontSize: 9, alignment: 'right' }, { text: ': ' + this.soRemark, border: [false, true, false, true], bold: true, fontSize: 9 }],
  //   ] as any

  //   //Items
  //   let items = [
  //     [
  //       { text: 'Installer Measurement / Area', bold: true, alignment: 'center', fontSize: 8.5 },
  //       { text: 'Track', bold: true, alignment: 'center', fontSize: 8.5 },
  //       { text: 'Bracket', bold: true, alignment: 'center', fontSize: 8.5 },
  //       { text: 'Tailor Measurement / Area', bold: true, alignment: 'center', fontSize: 8.5 },
  //       { text: 'Material Code', bold: true, alignment: 'center', fontSize: 8.5 },
  //       { text: 'Fabric\nwidth', bold: true, alignment: 'center', fontSize: 8.5 },
  //       { text: 'Pleat', bold: true, alignment: 'center', fontSize: 8.5 },
  //       { text: 'Pcs', bold: true, alignment: 'center', fontSize: 8.5 },
  //       { text: 'Tieback', bold: true, alignment: 'center', fontSize: 8.5 },
  //       { text: 'Fullness', bold: true, alignment: 'center', fontSize: 8.5 },
  //       { text: 'Hook\n(101,\n104)', bold: true, alignment: 'center', fontSize: 8.5 },
  //       { text: 'Panel/\nMeter', bold: true, alignment: 'center', fontSize: 8.5 },
  //       { text: 'Remark', bold: true, alignment: 'center', fontSize: 8.5 }
  //     ],
  //   ] as any

  //   for (let i = 0; i < this.item.length; i++) {

  //     if (this.item[i].height_tech != null || this.item[i].width_tech != null) {
  //       if (this.item[i].status_tech == 'Approved' && this.item[i].status_sale == 'Completed') {
  //         width = this.item[i].width
  //         height = this.item[i].height
  //       } else {
  //         width = this.item[i].width_tech
  //         height = this.item[i].height_tech
  //       }

  //     } else {
  //       width = this.item[i].width
  //       height = this.item[i].height
  //     }



  //     //ITEMS PUSH START HERE
  //     items.push(
  //       [
  //         { text: this.item[i].location, bold: true, fontSize: 8.5, decoration: 'underline' },
  //         { text: '', fontSize: 8.5 },
  //         { text: '', fontSize: 8.5 },
  //         { text: '', fontSize: 8.5 },
  //         { text: '', fontSize: 8.5 },
  //         { text: '', fontSize: 8.5 },
  //         { text: '', fontSize: 8.5 },
  //         { text: '', fontSize: 8.5 },
  //         { text: '', fontSize: 8.5 },
  //         { text: '', fontSize: 8.5 },
  //         { text: '', fontSize: 8.5 },
  //         { text: '', fontSize: 8.5 },
  //         { text: '', fontSize: 8.5 },
  //       ],
  //     )


  //     let curtainBelt
  //     let sheerBelt

  //     if (this.item[i].belt == 'Yes') {
  //       curtainBelt = 'Yes'
  //     } else {
  //       curtainBelt = 'X'
  //     }

  //     if (this.item[i].sheer_belt == 'Yes') {
  //       sheerBelt = 'Yes'
  //     } else {
  //       sheerBelt = 'X'
  //     }

  //     let rope_chain

  //     if (this.item[i].rope_chain == 'Left') {
  //       rope_chain = 'L'
  //     } else {
  //       rope_chain = 'R'
  //     }

  //     if (this.item[i].type != 'Blinds') {
  //       if (this.item[i].fabric_type == 'C') {

  //         if (this.item[i].fabric != null) {
  //           let fabricWidth = this.fabricCurtain.filter(a => a.name == this.item[i].fabric)[0]['size']
  //           let pleatShort = this.pleatlist.filter(a => a.name == this.item[i].pleat)[0]['name_short']

  //           items.push(
  //             [
  //               { text: 'Curtain', fontSize: 8.5, decoration: 'underline' },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },

  //             ],
  //           )

  //           if (this.item[i].motorized_upgrade) {
  //             items.push(
  //               [
  //                 { text: width + '" ( W )' + ' x ' + height + '" ( H )', fontSize: 8.5 },
  //                 { text: 'Motorized ' + this.item[i].track, alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].bracket || 'X', alignment: 'center', fontSize: 8.5 },
  //                 { text: width + '" ( W )' + ' x ' + height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].fabric, alignment: 'center', fontSize: 8.5 },
  //                 { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
  //                 { text: pleatShort, alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].pieces_curtain, alignment: 'center', fontSize: 8.5 },
  //                 { text: curtainBelt, alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].fullness, alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].hook || 'X', alignment: 'center', fontSize: 8.5 },
  //                 { text: 'P', alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].remark_curtain + '\n\n *' + this.item[i].remark_sale || '', fontSize: 8.5 }
  //               ],
  //             )
  //           } else {
  //             items.push(
  //               [
  //                 { text: width + '" ( W )' + ' x ' + height + '" ( H )', fontSize: 8.5 },
  //                 { text: this.item[i].track || '-', alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].bracket || 'X', alignment: 'center', fontSize: 8.5 },
  //                 { text: width + '" ( W )' + ' x ' + height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].fabric, alignment: 'center', fontSize: 8.5 },
  //                 { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
  //                 { text: pleatShort, alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].pieces_curtain, alignment: 'center', fontSize: 8.5 },
  //                 { text: curtainBelt, alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].fullness, alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].hook || 'X', alignment: 'center', fontSize: 8.5 },
  //                 { text: 'P', alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].remark_curtain + '\n\n *' + this.item[i].remark_sale || '', fontSize: 8.5 }
  //               ],
  //             )
  //           }

  //         }

  //         if (this.item[i].fabric_lining != null) {
  //           let fabricWidth = this.fabricLining.filter(a => a.name == this.item[i].fabric_lining)[0]['size']
  //           let pleatShort = this.pleatlist.filter(a => a.name == this.item[i].pleat)[0]['name_short']

  //           items.push(
  //             [
  //               { text: 'Lining', fontSize: 8.5, decoration: 'underline' },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //             ],
  //           )

  //           items.push(
  //             [
  //               { text: width + '" ( W )' + ' x ' + height + '" ( H )', fontSize: 8.5 },
  //               { text: this.item[i].track, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].bracket || 'X', alignment: 'center', fontSize: 8.5 },
  //               { text: width + '" ( W )' + ' x ' + height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].fabric_lining, alignment: 'center', fontSize: 8.5 },
  //               { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
  //               { text: pleatShort, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].pieces_curtain, alignment: 'center', fontSize: 8.5 },
  //               { text: curtainBelt, alignment: 'center', fontSize: 8.5 },
  //               { text: '-', alignment: 'center', fontSize: 8.5 },
  //               { text: '-', alignment: 'center', fontSize: 8.5 },
  //               { text: 'P', alignment: 'center', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 }
  //             ],
  //           )
  //         }

  //         items.push(
  //           [
  //             { text: ' ', fontSize: 8.5 },
  //             { text: ' ', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //           ],
  //         )

  //       } else if (this.item[i].fabric_type == 'S') {

  //         if (this.item[i].fabric_sheer != null) {
  //           let fabricWidth = this.fabricSheer.filter(a => a.name == this.item[i].fabric_sheer)[0]['size']
  //           let pleatShort = this.pleatlist.filter(a => a.name == this.item[i].pleat)[0]['name_short']

  //           items.push(
  //             [
  //               { text: 'Sheer', fontSize: 8.5, decoration: 'underline' },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //             ],
  //           )

  //           if (this.item[i].motorized_upgrade) {
  //             items.push(
  //               [
  //                 { text: width + '" ( W )' + ' x ' + height + '" ( H )', fontSize: 8.5 },
  //                 { text: 'Motorized ' + this.item[i].track_sheer, alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].sheer_bracket || 'X', alignment: 'center', fontSize: 8.5 },
  //                 { text: width + '" ( W )' + ' x ' + height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].fabric_sheer, alignment: 'center', fontSize: 8.5 },
  //                 { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
  //                 { text: pleatShort, alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].pieces_sheer, alignment: 'center', fontSize: 8.5 },
  //                 { text: sheerBelt, alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].fullness, alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].sheer_hook || 'X', alignment: 'center', fontSize: 8.5 },
  //                 { text: 'M', alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].remark_sheer + '\n\n *' + this.item[i].remark_sale || '', fontSize: 8.5 }
  //               ],
  //             )
  //           } else {
  //             items.push(
  //               [
  //                 { text: width + '" ( W )' + ' x ' + height + '" ( H )', fontSize: 8.5 },
  //                 { text: this.item[i].track_sheer || '-', alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].sheer_bracket || 'X', alignment: 'center', fontSize: 8.5 },
  //                 { text: width + '" ( W )' + ' x ' + height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].fabric_sheer, alignment: 'center', fontSize: 8.5 },
  //                 { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
  //                 { text: pleatShort, alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].pieces_sheer, alignment: 'center', fontSize: 8.5 },
  //                 { text: sheerBelt, alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].fullness, alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].sheer_hook || 'X', alignment: 'center', fontSize: 8.5 },
  //                 { text: 'M', alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].remark_sheer + '\n\n *' + this.item[i].remark_sale || '', fontSize: 8.5 }
  //               ],
  //             )
  //           }


  //         }

  //         items.push(
  //           [
  //             { text: ' ', fontSize: 8.5 },
  //             { text: ' ', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //           ],
  //         )
  //       } else if (this.item[i].fabric_type == 'CS') {
  //         if (this.item[i].fabric != null) {
  //           let fabricWidth = this.fabricCurtain.filter(a => a.name == this.item[i].fabric)[0]['size']
  //           let pleatShort = this.pleatlist.filter(a => a.name == this.item[i].pleat)[0]['name_short']

  //           items.push(
  //             [
  //               { text: 'Curtain', fontSize: 8.5, decoration: 'underline' },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //             ],
  //           )

  //           if (this.item[i].motorized_upgrade) {
  //             items.push(
  //               [
  //                 { text: width + '" ( W )' + ' x ' + height + '" ( H )', fontSize: 8.5 },
  //                 { text: 'Motorized ' + this.item[i].track, alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].bracket || 'X', alignment: 'center', fontSize: 8.5 },
  //                 { text: width + '" ( W )' + ' x ' + height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].fabric, alignment: 'center', fontSize: 8.5 },
  //                 { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
  //                 { text: pleatShort, alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].pieces_curtain, alignment: 'center', fontSize: 8.5 },
  //                 { text: curtainBelt, alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].fullness, alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].hook || 'X', alignment: 'center', fontSize: 8.5 },
  //                 { text: 'P', alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].remark_curtain, fontSize: 8.5 }
  //               ],
  //             )
  //           } else {
  //             items.push(
  //               [
  //                 { text: width + '" ( W )' + ' x ' + height + '" ( H )', fontSize: 8.5 },
  //                 { text: this.item[i].track || '-', alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].bracket || 'X', alignment: 'center', fontSize: 8.5 },
  //                 { text: width + '" ( W )' + ' x ' + height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].fabric, alignment: 'center', fontSize: 8.5 },
  //                 { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
  //                 { text: pleatShort, alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].pieces_curtain, alignment: 'center', fontSize: 8.5 },
  //                 { text: curtainBelt, alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].fullness, alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].hook || 'X', alignment: 'center', fontSize: 8.5 },
  //                 { text: 'P', alignment: 'center', fontSize: 8.5 },
  //                 { text: this.item[i].remark_curtain, fontSize: 8.5 }
  //               ],
  //             )
  //           }



  //         }

  //         if (this.item[i].fabric_lining != null) {
  //           let fabricWidth = this.fabricLining.filter(a => a.name == this.item[i].fabric_lining)[0]['size']
  //           let pleatShort = this.pleatlist.filter(a => a.name == this.item[i].pleat)[0]['name_short']

  //           items.push(
  //             [
  //               { text: 'Lining', fontSize: 8.5, decoration: 'underline' },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //             ],
  //           )

  //           items.push(
  //             [
  //               { text: width + '" ( W )' + ' x ' + height + '" ( H )', fontSize: 8.5 },
  //               { text: this.item[i].track, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].bracket || 'X', alignment: 'center', fontSize: 8.5 },
  //               { text: width + '" ( W )' + ' x ' + height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].fabric_lining, alignment: 'center', fontSize: 8.5 },
  //               { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
  //               { text: pleatShort, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].pieces_curtain, alignment: 'center', fontSize: 8.5 },
  //               { text: curtainBelt, alignment: 'center', fontSize: 8.5 },
  //               { text: '-', alignment: 'center', fontSize: 8.5 },
  //               { text: '-', alignment: 'center', fontSize: 8.5 },
  //               { text: 'P', alignment: 'center', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 }
  //             ],
  //           )
  //         }

  //         if (this.item[i].fabric_sheer != null) {
  //           let fabricWidth = this.fabricSheer.filter(a => a.name == this.item[i].fabric_sheer)[0]['size']
  //           let pleatShort = this.pleatlist.filter(a => a.name == this.item[i].pleat)[0]['name_short']

  //           items.push(
  //             [
  //               { text: 'Sheer', fontSize: 8.5, decoration: 'underline' },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 },
  //             ],
  //           )

  //           items.push(
  //             [
  //               { text: width + '" ( W )' + ' x ' + height + '" ( H )', fontSize: 8.5 },
  //               { text: this.item[i].track_sheer, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].sheer_bracket || 'X', alignment: 'center', fontSize: 8.5 },
  //               { text: width + '" ( W )' + ' x ' + height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].fabric_sheer, alignment: 'center', fontSize: 8.5 },
  //               { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
  //               { text: pleatShort, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].pieces_sheer, alignment: 'center', fontSize: 8.5 },
  //               { text: sheerBelt, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].fullness, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].sheer_hook || 'X', alignment: 'center', fontSize: 8.5 },
  //               { text: 'M', alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].remark_sheer + '\n\n *' + this.item[i].remark_sale || '', fontSize: 8.5 }
  //             ],
  //           )
  //         }

  //         items.push(
  //           [
  //             { text: ' ', fontSize: 8.5 },
  //             { text: ' ', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //           ],
  //         )
  //       }

  //     } else if (this.item[i].type == 'Blinds') {

  //       if (this.item[i].fabric_blind != null) {
  //         let fabricWidth = this.fabricBlind.filter(a => a.name == this.item[i].fabric_blind)[0]['size']

  //         items.push(
  //           [
  //             { text: this.item[i].pleat + ' (' + rope_chain + ')', fontSize: 8.5, decoration: 'underline' },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //           ],
  //         )

  //         items.push(
  //           [
  //             { text: width + '" ( W )' + ' x ' + height + '" ( H ) ', fontSize: 8.5 },
  //             { text: '-', alignment: 'center', fontSize: 8.5 },
  //             { text: this.item[i].bracket || 'X', alignment: 'center', fontSize: 8.5 },
  //             { text: width + '" ( W )' + ' x ' + height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
  //             { text: this.item[i].fabric_blind, alignment: 'center', fontSize: 8.5 },
  //             { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
  //             { text: this.item[i].pleat, alignment: 'center', fontSize: 8.5 },
  //             { text: this.item[i].pieces_blind, alignment: 'center', fontSize: 8.5 },
  //             { text: '-', alignment: 'center', fontSize: 8.5 },
  //             { text: '-', alignment: 'center', fontSize: 8.5 },
  //             { text: '-', alignment: 'center', fontSize: 8.5 },
  //             { text: 'P', alignment: 'center', fontSize: 8.5 },
  //             { text: this.item[i].remark_sale, fontSize: 8.5 }
  //           ],
  //         )

  //       }

  //       if (this.item[i].fabric != null) {
  //         let fabricWidth = this.fabricCurtain.filter(a => a.name == this.item[i].fabric)[0]['size']

  //         items.push(
  //           [
  //             { text: 'Curtain', fontSize: 8.5, decoration: 'underline' },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 },
  //           ],
  //         )

  //         items.push(
  //           [
  //             { text: width + '" ( W )' + ' x ' + height + '" ( H )', fontSize: 8.5 },
  //             { text: '-', alignment: 'center', fontSize: 8.5 },
  //             { text: this.item[i].bracket || 'X', alignment: 'center', fontSize: 8.5 },
  //             { text: width + '" ( W )' + ' x ' + height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
  //             { text: this.item[i].fabric, alignment: 'center', fontSize: 8.5 },
  //             { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
  //             { text: this.item[i].pleat, alignment: 'center', fontSize: 8.5 },
  //             { text: this.item[i].pieces_blind, alignment: 'center', fontSize: 8.5 },
  //             { text: curtainBelt, alignment: 'center', fontSize: 8.5 },
  //             { text: '-', alignment: 'center', fontSize: 8.5 },
  //             { text: '-', alignment: 'center', fontSize: 8.5 },
  //             { text: 'P', alignment: 'center', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 }
  //           ],
  //         )
  //       }

  //       items.push(
  //         [
  //           { text: ' ', fontSize: 8.5 },
  //           { text: ' ', fontSize: 8.5 },
  //           { text: '', fontSize: 8.5 },
  //           { text: '', fontSize: 8.5 },
  //           { text: '', fontSize: 8.5 },
  //           { text: '', fontSize: 8.5 },
  //           { text: '', fontSize: 8.5 },
  //           { text: '', fontSize: 8.5 },
  //           { text: '', fontSize: 8.5 },
  //           { text: '', fontSize: 8.5 },
  //           { text: '', fontSize: 8.5 },
  //           { text: '', fontSize: 8.5 },
  //           { text: '', fontSize: 8.5 },
  //         ],
  //       )
  //     }
  //   }
  //   console.log(items);

  //   var dd = {
  //     pageOrientation: 'landscape',

  //     header: function (currentPage, pageCount, pageSize) {
  //       // you can apply any logic and return any valid pdfmake element

  //       return [
  //         {
  //           columns: [
  //             [
  //               {
  //                 alignment: 'left',
  //                 text: 'Crystalace Deco Sdn Bhd (959240-H)',
  //                 fontSize: 14,
  //                 bold: true,
  //                 width: '60%',
  //                 margin: [20, 10, 0, 0]
  //               },
  //               {
  //                 width: '50%',
  //                 margin: [20, 0, 0, 0],
  //                 table: {
  //                   widths: ['30%', '70%'],
  //                   body: soinfoleft
  //                 },
  //               },
  //             ],
  //             [
  //               {
  //                 alignment: 'right',
  //                 text: sonum,
  //                 fontSize: 14,
  //                 bold: true,
  //                 width: '30%',
  //                 margin: [0, 10, 20, 0],
  //               },
  //               {
  //                 width: '30%',
  //                 margin: [20, 0, 0, 0],
  //                 table: {
  //                   widths: ['52%', '40%'],
  //                   body: soinforight
  //                 },
  //               },
  //               {
  //                 alignment: 'right',
  //                 text: 'SALES ORDER FORM',
  //                 fontSize: 14,
  //                 bold: true,
  //                 width: '30%',
  //                 margin: [0, 5, 80, 0],
  //               },
  //             ]

  //           ]
  //         },
  //         { canvas: [{ type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 }] }
  //       ]
  //     },

  //     content: [
  //       // 		NON_DETAILED QUOTATION START
  //       {
  //         width: '100%',
  //         table: {
  //           headerRows: 1,
  //           //  dontBreakRows: true,
  //           //  keepWithHeaderRows: 1,
  //           widths: ['17%', '7%', '5%', '15%', '12%', '4%', '3%', '3%', '5%', '5%', '4%', '4%', '16%'],
  //           body: items
  //         },
  //         layout: {
  //           hLineWidth: function (i, node) {
  //             return (i === 0 || i === node.table.body.length) ? 1 : 1;
  //           },
  //           hLineColor: function (i, node) {
  //             return (i === 0 || i === node.table.body.length || i === 1) ? 'black' : 'white';
  //           },
  //         }
  //       },
  //       // 	    NON_DETAILED QUOTATION END
  //     ],
  //     styles: {
  //       header: {
  //         fontSize: 18,
  //         bold: true,
  //         margin: [0, 0, 0, 10]
  //       },
  //       subheader: {
  //         fontSize: 16,
  //         bold: true,
  //         margin: [0, 10, 0, 5]
  //       },
  //       tableExample: {
  //         margin: [0, 5, 0, 15]
  //       },
  //       tableHeader: {
  //         bold: true,
  //         fontSize: 13,
  //         color: 'black'
  //       }
  //     },
  //     defaultStyle: {
  //       columnGap: 20
  //     },
  //     pageMargins: [20, 145, 20, 60]

  //   }

  //   this.pdfObj = pdfMake.createPdf(dd);
  //   this.uploadSoPdf()
  // }
  pdfmakerSO() {

    this.ref = this.info.reference + '-' + this.salesmaninfo.shortname

    let quoRef = 'QT' + this.datepipe.transform(new Date(), 'yyyyMMdd') + this.ref

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
      [{ text: 'QT No.', border: [], bold: true, fontSize: 9, alignment: 'right' }, { text: ': ' + quoRef, border: [false, false, false, true], bold: true, fontSize: 9 }],
      [{ text: 'Date Order', border: [], bold: true, fontSize: 9, alignment: 'right' }, { text: ': ' + this.datepipe.transform(new Date(), 'd/M/yyyy'), border: [false, true, false, true], bold: true, fontSize: 9 }],
      [{ text: 'Scheduled Inst Date', border: [], bold: true, fontSize: 9, alignment: 'right' }, { text: ': ' + (this.datepipe.transform(this.soInstDate, 'd/M/yyyy') || ''), border: [false, true, false, true], bold: true, fontSize: 9 }],
      [{ text: 'Sales P.I.C', border: [], bold: true, fontSize: 9, alignment: 'right' }, { text: ': ' + this.salesmaninfo.name, border: [false, true, false, true], bold: true, fontSize: 9 }],
      [{ text: 'Est. Inst Time', border: [], bold: true, fontSize: 9, alignment: 'right' }, { text: ': ' + this.soInstTime, border: [false, true, false, true], bold: true, fontSize: 9 }],
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

      if (this.item[i].type != 'Blinds') {

        // Curtain / Lining
        if (this.item[i].motorized_upgrade && (this.item[i].motorized_choice == 'Both' || this.item[i].motorized_choice == 'Curtain')) {

          if (this.item[i].pleat == 'Fake Double Pleat') {
            CL_height = height - 1.5
          } else if (this.item[i].track) {
            if (this.item[i].track == 'Ripplefold') {
              CL_height = height - 1.75
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
            } else if (this.item[i].track.includes('Camoor')) {
              CL_height = height - 1.5
            }
          }
        }

        // Sheer
        if (this.item[i].motorized_upgrade && (this.item[i].motorized_choice == 'Both' || this.item[i].motorized_choice == 'Sheer')) {
          if (this.item[i].pleat_sheer == 'Fake Double Pleat') {
            S_height = height - 1.5
          } else if (this.item[i].track) {
            if (this.item[i].track_sheer == 'Ripplefold') {
              S_height = height - 1.75
            } else if (this.item[i].track_sheer == 'Ripplefold Curve') {
              S_height = height - 1.75
            }
          }
        } else {
          if (this.item[i].track_sheer) {
            if (this.item[i].track_sheer == 'Ripplefold') {
              S_height = height - 1.75
            } else if (this.item[i].track_sheer == 'Ripplefold Curve') {
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
                  { text: (this.item[i].remark_curtain || '') + (this.item[i].remark_sale ? ('\n\n *' + (this.item[i].remark_sale || '')) : ''), fontSize: 8.5 }
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
                  { text: (this.item[i].remark_curtain || '') + (this.item[i].remark_sale ? ('\n\n *' + (this.item[i].remark_sale || '')) : ''), fontSize: 8.5 }
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
                  { text: (this.item[i].remark_sheer || '') + (this.item[i].remark_sale ? ('\n\n *' + (this.item[i].remark_sale || '')) : ''), fontSize: 8.5 }
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
                  { text: (this.item[i].remark_sheer || '') + (this.item[i].remark_sale ? ('\n\n *' + (this.item[i].remark_sale || '')) : ''), fontSize: 8.5 }
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
                  { text: (this.item[i].remark_sheer || '') + (this.item[i].remark_sale ? ('\n\n *' + (this.item[i].remark_sale || '')) : ''), fontSize: 8.5 }
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
                  { text: (this.item[i].remark_sheer || '') + (this.item[i].remark_sale ? ('\n\n *' + (this.item[i].remark_sale || '')) : ''), fontSize: 8.5 }
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
              { text: '-', alignment: 'center', fontSize: 8.5 },
              { text: this.item[i].bracket || 'X', alignment: 'center', fontSize: 8.5 },
              { text: width + '" ( W )' + ' x ' + height + '" ( H )', bold: true, alignment: 'center', fontSize: 8.5 },
              { text: this.item[i].fabric_blind + (this.item[i].code_blind ? '-' + this.item[i].code_blind : '') + (this.item[i].blind_tape ? ' + Tape ' + this.item[i].blind_tape : ''), alignment: 'center', fontSize: 8.5 },
              { text: '-', alignment: 'center', fontSize: 8.5 },
              { text: '-', alignment: 'center', fontSize: 8.5 },
              { text: this.item[i].pieces_blind, alignment: 'center', fontSize: 8.5 },
              { text: '-', alignment: 'center', fontSize: 8.5 },
              { text: '-', alignment: 'center', fontSize: 8.5 },
              { text: '-', alignment: 'center', fontSize: 8.5 },
              { text: '-', alignment: 'center', fontSize: 8.5 },
              { text: (this.item[i].remark_sale || ''), fontSize: 8.5 }
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
                { text: '', fontSize: 8.5 }
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
            // this.nav.navigateRoot('/tabs/tab1')
          })

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

}

