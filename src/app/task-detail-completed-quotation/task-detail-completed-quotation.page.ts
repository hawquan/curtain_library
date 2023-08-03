import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController, Platform } from '@ionic/angular';
import Swal from 'sweetalert2';

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { DatePipe } from '@angular/common';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { SafariViewController } from '@awesome-cordova-plugins/safari-view-controller/ngx';

pdfMake.vfs = pdfFonts.pdfMake.vfs

@Component({
  selector: 'app-task-detail-completed-quotation',
  templateUrl: './task-detail-completed-quotation.page.html',
  styleUrls: ['./task-detail-completed-quotation.page.scss'],
})
export class TaskDetailCompletedQuotationPage implements OnInit {

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
  salesmaninfo = [] as any
  info = [] as any
  blindTape = [] as any
  pleatlist = []
  blindlist = []
  tracklist = []
  fabriclist = []
  fabricCurtain = []
  fabricSheer = []
  fabricLining = []
  fabricBlind = []
  packageApplied = [] as any
  packageViewed = [] as any
  packageName
  calc = [] as any
  loading = false
  count = 0

  showadditional = false
  viewPackage = false
  ladder = false
  scaftfolding = false
  ladderDelivery = false
  scaftfoldingDelivery = false

  pdfObj = null;

  soNumber
  soInstDate
  soSalesName
  soRemark

  ngOnInit() {

    this.actroute.queryParams.subscribe(a => {
      this.sales_id = a['sales_id']
      this.pleatlist = JSON.parse(a["pleatlist"])
      this.blindlist = JSON.parse(a["blindlist"])
      this.tracklist = JSON.parse(a["tracklist"])

      this.http.post('https://curtain.vsnap.my/getonesales', { no: this.sales_id }).subscribe((s) => {
        this.info = s['data'][0]
        console.log(this.info);
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

      this.http.post('https://curtain.vsnap.my/onestaff', { id: this.info['id_sales'] }).subscribe(a => {
        this.salesmaninfo = a['data'][0]
        console.log(this.salesmaninfo);
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

    if (this.ladderDelivery) {
      total += 100
    }
    if (this.scaftfoldingDelivery) {
      total += 200
    }
    if (this.scaftfolding) {
      total += 550
    }

    total += this.info.transport_fee_status ? this.info.transport_fee : 0
    return total || 0
  }

  addCharges() {
    let addCharges = 0

    if (this.ladderDelivery) {
      addCharges += 100
    }
    if (this.scaftfoldingDelivery) {
      addCharges += 200
    }
    if (this.scaftfolding) {
      addCharges += 550
    }

    addCharges += this.info.transport_fee_status ? this.info.transport_fee : 0

    return addCharges || 0
  }

  packageView() {
    this.viewPackage = true
  }

  closePackage() {
    this.viewPackage = false
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
          curtain_id = this.fabricCurtain.filter(x => x.name == this.item[i].fabric)[0]['id']
        } else {
          curtain = false
        }
      } else {
        curtain = false
      }

      if (this.item[i].fabric_lining != null) {
        if (this.item[i].fabric_type == 'C' || this.item[i].fabric_type == 'CS') {
          lining = true
          lining_id = this.fabricLining.filter(x => x.name == this.item[i].fabric_lining)[0]['id']
        } else {
          lining = false
        }
      } else {
        lining = false
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

      if (this.item[i].track != null) {
        if (this.item[i].fabric_type == 'C' || this.item[i].fabric_type == 'CS') {
          track = true
          track_id = this.tracklist.filter(x => x.name == this.item[i].track)[0]['id']
        } else {
          track = false
        }
      } else {
        track = false
      }

      if (this.item[i].track_sheer != null) {
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
        pleat_id = this.pleatlist.filter(x => x.name == this.item[i].pleat)[0]['id']
      }
      if (this.item[i].pleat_sheer != null && this.item[i].pleat_sheer != '') {
        pleat_sheer_id = this.pleatlist.filter(x => x.name == this.item[i].pleat_sheer)[0]['id']
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
          blind_id = this.fabricBlind.filter(x => x.name == this.item[i].fabric_blind)[0]['id']
        }

        if (this.item[i].fabric != null) {
          curtain = true
          curtain_id = this.fabricCurtain.filter(x => x.name == this.item[i].fabric)[0]['id']
        } else {
          curtain = false
        }

        if (this.item[i].fabric_lining != null) {
          lining = true
          lining_id = this.fabricLining.filter(x => x.name == this.item[i].fabric_lining)[0]['id']
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
          blind_id = (this.fabricBlind.filter(x => x.name == this.item[i].fabric_blind))[0]['id']
        }

        if (this.item[i].pleat == 'Wooden Blind') {
          if (this.item[i].blind_tape) {
            tape_id = (this.blindTape.filter(x => x.name == this.item[i].blind_tape))[0]['id']
            tape = true
          }
        }

      }

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

      // this.calc.push(a['data'])

      // this.count++
      // if (this.calc.length != this.item.length) {
      //   this.loop()
      // }
      // console.log(this.calc);

      // if (this.calc.length == this.item.length) {
      //   console.log('finish');


      //   if (this.info.need_scaftfolding) {
      //     this.scaftfolding = true
      //     this.showadditional = true
      //   }
      //   if (this.info.need_ladder) {
      //     this.ladder = true
      //     this.showadditional = true
      //   }

      //   Swal.close()
      //   this.loading = true
      // }
      if (this.info.need_scaftfolding == true) {
        this.scaftfolding = true
      }
      if (this.info.need_ladder == true) {
        this.ladder = true
      }

      this.calc.push(a['data'])
      this.count++
      if (this.calc.length != this.item.length) {
        this.loop()
      }
      console.log(this.calc);

      if (this.calc.length == this.item.length) {
        console.log('finish');

        Swal.close()
        this.loading = true
      }
    })

  }

  lengthof(x) {
    return Object.keys(x || {}).length
  }

  back() {
    this.nav.pop()
  }

  async choosePDF(x) {
    console.log(x.length);

    if (x.length == 0) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 1000,
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

  async salesorderinfo() {
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      header: 'Sales Order Info',
      // subHeader: 'Default Password: forcar123',
      inputs: [
        {
          name: 'sonum',
          type: 'number',
          placeholder: 'Sales Order Number'
        },
        {
          name: 'instdate',
          type: 'date',
          placeholder: 'Select Installer Date'
        },
        {
          name: 'sales',
          type: 'text',
          placeholder: 'Enter your name'
        },
        {
          name: 'remark',
          type: 'text',
          placeholder: 'Remark'
        },
      ],
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
            if (data['sonum'] == null) {

              Swal.fire({
                title: 'SO number is Empty',
                text: 'Please enter a Sales Order number and try again!',
                icon: 'error',
                timer: 5000,
                heightAuto: false,
              });

            } else if (data['instdate'] == null) {

              Swal.fire({
                title: 'Installer Date is Empty',
                text: 'Please enter a date and try again!',
                icon: 'error',
                timer: 5000,
                heightAuto: false,
              });

            } else if (data['sales'] == null) {

              Swal.fire({
                title: 'Sales name is Empty',
                text: 'Please enter a sales person name, please try again!',
                icon: 'error',
                timer: 5000,
                heightAuto: false,
              });

            } else {
              let buttoners = {
                Cancel: { name: 'Cancel', value: 'Cancel' },
                Confirm: { name: 'Confirm', value: 'Confirm' }
              }

              Swal.fire({
                title: 'Submit Order',
                text: 'Complete this order, are you sure?',
                icon: 'question',
                showCancelButton: true,
                reverseButtons: true,
                heightAuto: false,
              }).then(a => {

                if (a.isConfirmed) {

                  this.soNumber = data['sonum']
                  this.soInstDate = data['instdate']
                  this.soSalesName = data['sales']
                  this.soRemark = data['remark']
                  // this.pdfmakerSO()
                  // this.http.post('https://forcar.vsnap.my/changepassword', {
                  //   uid: this.user['id'],
                  //   password: data['pw1'],
                  //   type: 'user'

                  // }).subscribe(f => {

                  //   console.log(f)
                  //   Swal.fire({
                  //     title: 'Change Password Complete',
                  //     text: 'Password Changed Successfully!',
                  //     icon: 'success',
                  //     heightAuto: false,
                  //     timer: 5000,
                  //   });

                  // })
                }
              })
            }


          }
        }
      ]
    });

    await alert.present();
  }

  // pdfmakerSO() {
  //   console.log(this.info);

  //   let customer_info = []
  //   let today = new Date()
  //   let width = null
  //   let height = null

  //   //Customer
  //   let ci = ''
  //   ci = this.info.customer_name + '\n\n\n' + this.info.customer_address + '\n\n\n' + this.info.customer_phone + '\n '

  //   customer_info.push(ci)

  //   //Ref & Date & Validity & Sales
  //   let ref = 'QT' + this.datepipe.transform(today, 'yyyyMMdd') + 'WI-TM'
  //   let date = this.datepipe.transform(new Date(today), 'd/M/yyyy')
  //   let validity = 'COD'
  //   let salesphone = 'TM\n' + this.salesmaninfo.phone

  //   //SO number
  //   let sonum = { text: 'SO NO : ' + this.soNumber }

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
  //     [{ text: 'QT No.', border: [], bold: true, fontSize: 9, alignment: 'right' }, { text: ': ', border: [false, false, false, true], bold: true, fontSize: 9 }],
  //     [{ text: 'Date Order', border: [], bold: true, fontSize: 9, alignment: 'right' }, { text: ': ' + this.datepipe.transform(new Date(), 'd/M/yyyy'), border: [false, true, false, true], bold: true, fontSize: 9 }],
  //     [{ text: 'Scheduled Inst Date', border: [], bold: true, fontSize: 9, alignment: 'right' }, { text: ': ' + this.datepipe.transform(this.soInstDate, 'd/M/yyyy'), border: [false, true, false, true], bold: true, fontSize: 9 }],
  //     [{ text: 'Sales P.I.C', border: [], bold: true, fontSize: 9, alignment: 'right' }, { text: ': ' + this.soSalesName, border: [false, true, false, true], bold: true, fontSize: 9 }],
  //     [{ text: 'Est. Inst Time', border: [], bold: true, fontSize: 9, alignment: 'right' }, { text: ': ', border: [false, true, false, true], bold: true, fontSize: 9 }],
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

  //     if (this.item[i].type != 'Blinds') {
  //       if (this.item[i].fabric_type == 'C') {

  //         if (this.item[i].fabric != null) {
  //           let fabricWidth = this.fabricCurtain.filter(a => a.name == this.item[i].fabric)[0]['size']
  //           let belt

  //           if (this.item[i].belt == 'Tieback') {
  //             belt = 'Yes'
  //           } else {
  //             belt = 'X'
  //           }

  //           items.push(
  //             [
  //               { text: width + '"' + ' x ' + height + '"' + ' - Curtain', fontSize: 8.5 },
  //               { text: this.item[i].track, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].bracket, alignment: 'center', fontSize: 8.5 },
  //               { text: width + '"' + ' x ' + height + '"', bold: true, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].fabric, alignment: 'center', fontSize: 8.5 },
  //               { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].pleat, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].pieces_curtain, alignment: 'center', fontSize: 8.5 },
  //               { text: belt, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].fullness, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].hook, alignment: 'center', fontSize: 8.5 },
  //               { text: 'P', alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].remark_sale, fontSize: 8.5 }
  //             ],
  //           )
  //         }

  //         if (this.item[i].fabric_lining != null) {
  //           let fabricWidth = this.fabricLining.filter(a => a.name == this.item[i].fabric_lining)[0]['size']
  //           let belt

  //           if (this.item[i].belt == 'Tieback') {
  //             belt = 'Yes'
  //           } else {
  //             belt = 'X'
  //           }
  //           items.push(
  //             [
  //               { text: width + '"' + ' x ' + height + '"' + ' - Lining', fontSize: 8.5 },
  //               { text: this.item[i].track, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].bracket, alignment: 'center', fontSize: 8.5 },
  //               { text: width + '"' + ' x ' + height + '"', bold: true, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].fabric_lining, alignment: 'center', fontSize: 8.5 },
  //               { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].pleat, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].pieces_curtain, alignment: 'center', fontSize: 8.5 },
  //               { text: belt, alignment: 'center', fontSize: 8.5 },
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

  //         if (this.item[i].fabric != null) {
  //           let fabricWidth = this.fabricSheer.filter(a => a.name == this.item[i].fabric)[0]['size']
  //           let belt

  //           if (this.item[i].belt == 'Tieback') {
  //             belt = 'Yes'
  //           } else {
  //             belt = 'X'
  //           }

  //           items.push(
  //             [
  //               { text: width + '"' + ' x ' + height + '"' + ' - Sheer', fontSize: 8.5 },
  //               { text: this.item[i].track, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].bracket, alignment: 'center', fontSize: 8.5 },
  //               { text: width + '"' + ' x ' + height + '"', bold: true, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].fabric_sheer, alignment: 'center', fontSize: 8.5 },
  //               { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].pleat, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].pieces_sheer, alignment: 'center', fontSize: 8.5 },
  //               { text: belt, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].fullness, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].hook, alignment: 'center', fontSize: 8.5 },
  //               { text: 'M', alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].remark_sale, fontSize: 8.5 }
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
  //       } else if (this.item[i].fabric_type == 'CS') {
  //         if (this.item[i].fabric != null) {
  //           let fabricWidth = this.fabricCurtain.filter(a => a.name == this.item[i].fabric)[0]['size']
  //           let belt

  //           if (this.item[i].belt == 'Tieback') {
  //             belt = 'Yes'
  //           } else {
  //             belt = 'X'
  //           }

  //           items.push(
  //             [
  //               { text: width + '"' + ' x ' + height + '"' + ' - Curtain', fontSize: 8.5 },
  //               { text: this.item[i].track, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].bracket, alignment: 'center', fontSize: 8.5 },
  //               { text: width + '"' + ' x ' + height + '"', bold: true, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].fabric, alignment: 'center', fontSize: 8.5 },
  //               { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].pleat, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].pieces_curtain, alignment: 'center', fontSize: 8.5 },
  //               { text: belt, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].fullness, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].hook, alignment: 'center', fontSize: 8.5 },
  //               { text: 'P', alignment: 'center', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 }
  //             ],
  //           )
  //         }

  //         if (this.item[i].fabric_lining != null) {
  //           let fabricWidth = this.fabricLining.filter(a => a.name == this.item[i].fabric_lining)[0]['size']
  //           let belt

  //           if (this.item[i].belt == 'Tieback') {
  //             belt = 'Yes'
  //           } else {
  //             belt = 'X'
  //           }
  //           items.push(
  //             [
  //               { text: width + '"' + ' x ' + height + '"' + ' - Lining', fontSize: 8.5 },
  //               { text: this.item[i].track, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].bracket, alignment: 'center', fontSize: 8.5 },
  //               { text: width + '"' + ' x ' + height + '"', bold: true, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].fabric_lining, alignment: 'center', fontSize: 8.5 },
  //               { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].pleat, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].pieces_curtain, alignment: 'center', fontSize: 8.5 },
  //               { text: belt, alignment: 'center', fontSize: 8.5 },
  //               { text: '-', alignment: 'center', fontSize: 8.5 },
  //               { text: '-', alignment: 'center', fontSize: 8.5 },
  //               { text: 'P', alignment: 'center', fontSize: 8.5 },
  //               { text: '', fontSize: 8.5 }
  //             ],
  //           )
  //         }

  //         if (this.item[i].fabric_blind != null) {
  //           let fabricWidth = this.fabricSheer.filter(a => a.name == this.item[i].fabric_blind)[0]['size']
  //           let belt

  //           if (this.item[i].belt == 'Tieback') {
  //             belt = 'Yes'
  //           } else {
  //             belt = 'X'
  //           }

  //           items.push(
  //             [
  //               { text: width + '"' + ' x ' + height + '"' + ' - Sheer', fontSize: 8.5 },
  //               { text: this.item[i].track, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].bracket, alignment: 'center', fontSize: 8.5 },
  //               { text: width + '"' + ' x ' + height + '"', bold: true, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].fabric_sheer, alignment: 'center', fontSize: 8.5 },
  //               { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].pleat, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].pieces_sheer, alignment: 'center', fontSize: 8.5 },
  //               { text: belt, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].fullness, alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].hook, alignment: 'center', fontSize: 8.5 },
  //               { text: 'M', alignment: 'center', fontSize: 8.5 },
  //               { text: this.item[i].remark_sale, fontSize: 8.5 }
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
  //         let belt

  //         if (this.item[i].belt == 'Tieback') {
  //           belt = 'Yes'
  //         } else {
  //           belt = 'X'
  //         }

  //         items.push(
  //           [
  //             { text: width + '"' + ' x ' + height + '"' + ' - Blind', fontSize: 8.5 },
  //             { text: '-', alignment: 'center', fontSize: 8.5 },
  //             { text: this.item[i].bracket, alignment: 'center', fontSize: 8.5 },
  //             { text: width + '"' + ' x ' + height + '"', bold: true, alignment: 'center', fontSize: 8.5 },
  //             { text: this.item[i].fabric_blind, alignment: 'center', fontSize: 8.5 },
  //             { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
  //             { text: this.item[i].pleat, alignment: 'center', fontSize: 8.5 },
  //             { text: this.item[i].pieces_blind, alignment: 'center', fontSize: 8.5 },
  //             { text: '-', alignment: 'center', fontSize: 8.5 },
  //             { text: '-', alignment: 'center', fontSize: 8.5 },
  //             { text: '-', alignment: 'center', fontSize: 8.5 },
  //             { text: 'P', alignment: 'center', fontSize: 8.5 },
  //             { text: '', fontSize: 8.5 }
  //           ],
  //         )
  //       }

  //       if (this.item[i].fabric != null) {
  //         let fabricWidth = this.fabricCurtain.filter(a => a.name == this.item[i].fabric)[0]['size']
  //         let belt

  //         if (this.item[i].belt == 'Tieback') {
  //           belt = 'Yes'
  //         } else {
  //           belt = 'X'
  //         }

  //         items.push(
  //           [
  //             { text: width + '"' + ' x ' + height + '"' + ' - Curtain', fontSize: 8.5 },
  //             { text: '-', alignment: 'center', fontSize: 8.5 },
  //             { text: this.item[i].bracket, alignment: 'center', fontSize: 8.5 },
  //             { text: width + '"' + ' x ' + height + '"', bold: true, alignment: 'center', fontSize: 8.5 },
  //             { text: this.item[i].fabric, alignment: 'center', fontSize: 8.5 },
  //             { text: fabricWidth + '"', alignment: 'center', fontSize: 8.5 },
  //             { text: this.item[i].pleat, alignment: 'center', fontSize: 8.5 },
  //             { text: this.item[i].pieces_curtain, alignment: 'center', fontSize: 8.5 },
  //             { text: belt, alignment: 'center', fontSize: 8.5 },
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
  //           widths: ['17%', '4%', '5%', '15%', '13%', '4%', '3%', '3%', '5%', '5%', '4%', '4%', '18%'],
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

  //   // pdfMake.createPdf(dd).open();
  //   this.pdfObj = pdfMake.createPdf(dd);
  //   this.downloadPdf()

  // }

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

}

