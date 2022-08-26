import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import Swal from 'sweetalert2';
import firebase from 'firebase';

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

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

  calc = [] as any
  loading = false
  count = 0

  due = 0

  ladder = false
  scaftfolding = false

  pdfObj = null;


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
      if (a["info"] != null) {
        this.info = JSON.parse(a["info"])

        this.http.post('https://curtain.vsnap.my/onestaff', { id: this.info['id_sales'] }).subscribe(a => {
          this.salesmaninfo = a['data'][0]
          console.log(this.salesmaninfo);
        })

      }
      this.pleatlist = JSON.parse(a["pleatlist"])
      this.blindlist = JSON.parse(a["blindlist"])
      this.tracklist = JSON.parse(a["tracklist"])

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

    if (this.ladder) {
      total += 100
    }
    if (this.scaftfolding) {
      total += 200
    }

    return total || 0
  }

  checkout() {

    if (this.info['rejected'] == true) {
      let temp = {
        no: this.sales_id,
        step: 3,
        rejected: false,
        need_scaftfolding: this.scaftfolding,
        need_ladder: this.ladder,
      }

      console.log('rejected');

      Swal.fire({
        title: 'Checkout?',
        text: 'Checkout the sales?',
        heightAuto: false,
        icon: 'warning',
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Checkout',
        reverseButtons: true,
      }).then((y) => {
        if (y.isConfirmed) {
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

        }
      })
    } else {
      let temp = {
        no: this.sales_id,
        step: 2,
        need_scaftfolding: this.scaftfolding,
        need_ladder: this.ladder,
      }
      console.log('xrejected');

      Swal.fire({
        title: 'Checkout?',
        text: 'Checkout the sales?',
        heightAuto: false,
        icon: 'warning',
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Checkout',
        reverseButtons: true,
      }).then((y) => {
        if (y.isConfirmed) {
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

        }
      })
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
    let blind = false
    let blind_id

    let pleat_id

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
          curtain = false
        }
      } else {
        lining = false
      }

      if (this.item[i].fabric_sheer != null) {
        if (this.item[i].fabric_type == 'S' || this.item[i].fabric_type == 'CS') {
          sheer = true
          sheer_id = this.fabricSheer.filter(x => x.name == this.item[i].fabric_sheer)[0]['id']
        } else {
          curtain = false
        }
      } else {
        sheer = false
      }

      if (this.item[i].track != null) {
        track = true
        track_id = this.tracklist.filter(x => x.name == this.item[i].track)[0]['id']
      } else {
        track = false
      }

      if (this.item[i].pleat != null && this.item[i].pleat != '') {
        pleat_id = this.pleatlist.filter(x => x.name == this.item[i].pleat)[0]['id']
      }

    } else {
      if (this.item[i].pleat == 'Roman Blind') {
        curtain = true
        sheer = false
        track = false
        lining = false
        blind = true
        console.log('blindcurtain');

        if ((this.item[i].fabric_blind != null && this.item[i].fabric_blind != '') && (this.item[i].fabric != null && this.item[i].fabric != '')) {
          curtain_id = this.fabricCurtain.filter(x => x.name == this.item[i].fabric)[0]['id']
          blind_id = this.fabricBlind.filter(x => x.name == this.item[i].fabric_blind)[0]['id']
        }

      } else {
        curtain = false
        sheer = false
        track = false
        lining = false
        blind = true
        console.log('blind');

        if (this.item[i].fabric_blind != null && this.item[i].fabric_blind != '') {
          blind_id = (this.fabricBlind.filter(x => x.name == this.item[i].fabric_blind))[0]['id']
        }
      }

    }

    let temp = {
      width: parseFloat(width), height: parseFloat(height), curtain: curtain, lining: lining, lining_id: lining_id,
      curtain_id: curtain_id, sheer: sheer, sheer_id: sheer_id, track: track, track_id: track_id, pleat_id: pleat_id, blind: blind, blind_id: blind_id
    }

    console.log(temp);

    this.http.post('https://curtain.vsnap.my/calcPrice', temp).subscribe(a => {

      this.dueamount(i)


      if (this.info.rejected) {
        if (this.info.need_scaftfolding) {
          this.scaftfolding = true
        }
        if (this.info.need_ladder) {
          this.ladder = true
        }
      } else {
        if (this.item[i].need_scaftfolding == true) {
          this.scaftfolding = true
        } else if (this.item[i].need_ladder == true) {
          this.ladder = true
        }
      }

      this.calc.push(a['data'])
      this.count++
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

  dueamount(i) {
    if (this.item[i].price_old != null) {
      let temp = this.item[i].price - this.item[i].price_old
      this.due += temp

    }
  }

  lengthof(x) {
    return Object.keys(x || {}).length
  }

  back() {
    this.nav.pop()
  }

  pdfmaker() {
    console.log(this.info);

    let customer_info = []
    let today = new Date()
    let width = null
    let height = null

    //Customer
    let ci = ''
    ci = this.info.customer_name + '\n\n\n' + this.info.customer_address + '\n\n\n' + this.info.customer_phone + '\n '

    customer_info.push(ci)

    //Ref & Date & Validity & Sales
    let ref = 'QT' + this.datepipe.transform(today, 'yyyyMMdd') + 'WI-TM'
    let date = this.datepipe.transform(new Date(today), 'd/M/yyyy')
    let validity = 'COD'
    let salesphone = 'TM\n' + this.salesmaninfo.phone

    //Items
    let items = [
      [{ text: 'Description', bold: true },
      { text: 'Unit', alignment: 'center', bold: true },
      { text: 'Qty', alignment: 'center', bold: true },
      { text: 'Rate (RM)', alignment: 'center', bold: true },
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

      for (let j = 0; j < 13; j++) {
        if (j == 0) {
          items.push(
            [
              { text: this.item[i].location, border: [true, false, true, false], bold: true, decoration: 'underline' },
              { text: '', alignment: 'center', border: [true, false, true, false] },
              { text: '', alignment: 'center', border: [true, false, true, false] },
              { text: '', alignment: 'right', border: [true, false, true, false] },
              { text: '', alignment: 'right', border: [true, false, true, false] }
            ]
          )
        } else if (j == 1) {
          items.push(
            [
              { text: width + '"' + ' x ' + height + '"', border: [true, false, true, false] },
              { text: '', alignment: 'center', border: [true, false, true, false] },
              { text: '', alignment: 'center', border: [true, false, true, false] },
              { text: '', alignment: 'right', border: [true, false, true, false] },
              { text: '', alignment: 'right', border: [true, false, true, false] }
            ]
          )
        } else if (j == 2) {
          if (this.item[i].fabric_blind != null) {
            items.push(
              [
                'Blind - ' + this.item[i].fabric_blind,
                { text: this.calc[i].blind.unit, alignment: 'center' },
                { text: this.calc[i].blind.qty, alignment: 'center' },
                { text: ((this.calc[i].blind.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })), alignment: 'right' },
                { text: ((this.calc[i].blind.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })), alignment: 'right' }
              ]
            )
          }
        } else if (j == 3) {
          if (this.item[i].fabric != null) {
            items.push(
              [
                'Curtain - ' + this.item[i].fabric,
                { text: this.calc[i].curtain.unit, alignment: 'center' },
                { text: this.calc[i].curtain.qty, alignment: 'center' },
                { text: (this.calc[i].curtain.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
                { text: (this.calc[i].curtain.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
              ]
            )
          }
        } else if (j == 4) {
          if (this.item[i].fabric_lining != null) {
            items.push(
              [
                'Lining - ' + this.item[i].fabric_lining,
                { text: this.calc[i].lining.unit, alignment: 'center' },
                { text: this.calc[i].lining.qty, alignment: 'center' },
                { text: (this.calc[i].lining.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
                { text: (this.calc[i].lining.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
              ]
            )
          }
        } else if (j == 5) {
          if (this.item[i].fabric_sheer != null) {
            items.push(
              [
                'Sheer - ' + this.item[i].fabric_sheer,
                { text: this.calc[i].sheer.unit, alignment: 'center' },
                { text: this.calc[i].sheer.qty, alignment: 'center' },
                { text: (this.calc[i].sheer.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
                { text: (this.calc[i].sheer.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
              ]
            )
          }
        } else if (j == 6) {
          if (this.item[i].fabric != null && this.item[i].fabric_lining != null) {
            items.push(
              [
                'Sewing D/P Curtain + Lining',
                { text: this.calc[i].sewing_curtain.unit, alignment: 'center' },
                { text: this.calc[i].sewing_curtain.qty, alignment: 'center' },
                { text: (this.calc[i].sewing_curtain.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
                { text: (this.calc[i].sewing_curtain.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
              ]
            )
          } else if (this.item[i].fabric != null) {
            items.push(
              [
                'Sewing D/P Curtain',
                { text: this.calc[i].sewing_curtain.unit, alignment: 'center' },
                { text: this.calc[i].sewing_curtain.qty, alignment: 'center' },
                { text: (this.calc[i].sewing_curtain.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
                { text: (this.calc[i].sewing_curtain.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
              ]
            )
          } else if (this.item[i].fabric_lining != null) {
            items.push(
              [
                'Sewing D/P Lining',
                { text: this.calc[i].sewing_curtain.unit, alignment: 'center' },
                { text: this.calc[i].sewing_curtain.qty, alignment: 'center' },
                { text: (this.calc[i].sewing_curtain.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
                { text: (this.calc[i].sewing_curtain.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
              ]
            )
          }
        } else if (j == 7) {
          if (this.item[i].fabric_sheer != null) {
            items.push(
              [
                'Sheer D/P Sheer',
                { text: this.calc[i].sewing_sheer.unit, alignment: 'center' },
                { text: this.calc[i].sewing_sheer.qty, alignment: 'center' },
                { text: (this.calc[i].sewing_sheer.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
                { text: (this.calc[i].sewing_sheer.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
              ]
            )
          }
        } else if (j == 8) {
          if (this.item[i].track != null) {
            items.push(
              [
                this.item[i].track + ' Track',
                { text: this.calc[i].track.unit, alignment: 'center' },
                { text: this.calc[i].track.qty, alignment: 'center' },
                { text: (this.calc[i].track.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
                { text: (this.calc[i].track.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
              ]
            )
          }
        } else if (j == 9) {
          items.push(
            [
              'Installation & Hang',
              { text: this.calc[i].install.unit, alignment: 'center' },
              { text: this.calc[i].install.qty, alignment: 'center' },
              { text: (this.calc[i].install.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' },
              { text: (this.calc[i].install.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right' }
            ]
          )
          // .toFixed(2)
        } else if (j == 10 && this.item[i].type != 'Blinds') {
          items.push(
            [
              'Belt & Hook',
              { text: 'set', alignment: 'center' },
              { text: 1, alignment: 'center' },
              { text: '25.00', alignment: 'right' },
              { text: '25.00', alignment: 'right' }
            ]
          )
        } else if (j == 11) {
          items.push(
            [
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: '', border: [true, false, true, false] },
              { text: 'RM ' + (this.item[i].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', border: [true, true, true, true], decoration: 'underline', bold: true }
            ],
          )
        } else if (j == 12) {
          items.push(['', '', '', '', ''])
          items.push(['', '', '', '', ''])
          items.push(['', '', '', '', ''])
        }
      }

    }
    console.log(items);

    //Ladder & Scaftfolding
    let ladderscaft = ''
    let LSprice = ''

    if (this.scaftfolding && this.ladder) {
      ladderscaft = 'Ladder + Scaftfolding'
      LSprice = '300.00'
    } else {
      if (this.ladder) {
        ladderscaft = 'Ladder'
        LSprice = '100.00'
      }
      if (this.scaftfolding) {
        ladderscaft = 'Scaftfolding'
        LSprice = '200.00'
      }
    }

    //Get Before Additional Price
    let total = 0
    for (let i = 0; i < this.item.length; i++) {
      total += this.item[i].price
    }

    // Playground start here
    var dd = {
      //Header
      header: function (currentPage, pageCount, pageSize) {

        return [
          {
            columns: [
              {
                alignment: 'left',
                text: 'Crystalace Deco Sdn Bhd (959240-H)\n15,Jln PJU 3/49 Sunway Damansara Technology Park,47810 Petaling Jaya Selangor. www.crystalace.com.my 03-7803 1686',
                fontSize: 17,
                bold: true,
                width: '60%',
                margin: [40, 20, 0, 0]
              },
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
                body: [
                  [{ text: 'Ref:', alignment: 'center' }, { text: 'Date:', alignment: 'center' }],
                  [{ text: ref, alignment: 'center' }, { text: date, alignment: 'center' }],
                  [{ text: '' }, { text: 'Validity:', alignment: 'center' }],
                  [{ text: '' }, { text: validity, alignment: 'center' }],
                  [{ text: 'Sales:', alignment: 'center', border: [true, true, false, true] }, { text: 'Prepared by:', alignment: 'center', border: [false, true, true, true] }],
                  [{ text: salesphone, alignment: 'center', border: [true, true, false, true] }, { text: '', border: [false, true, true, true] }],
                ],
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
              // [
              //   { text: 'TRANSPORTATION FEES (RM)', bold: true, border: [true, false, false, true] },
              //   { text: '100.00', alignment: 'right', border: [false, false, true, true] },
              // ],
              // [
              //   { text: 'TRANSPORTATION FEES (RM)', bold: true, border: [true, false, false, true] },
              //   { text: '100.00', alignment: 'right', border: [false, false, true, true] },
              // ],
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
                { text: ((this.totalPrice()).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })), bold: true, alignment: 'right', border: [false, false, true, true] },
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
        {
          width: '100%',
          table: {
            widths: ['100%'],
            body: [
              [{ text: 'Price above is estimation.', fontSize: 9, border: [true, false, true, false] }],
              [{ text: 'Final price will be adjusted according to actual site measurement and material selection', fontSize: 9, border: [true, false, true, true] }],
            ]
          }
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
    this.downloadPdf()

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

}
