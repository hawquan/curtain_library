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
      this.info = JSON.parse(a['info'])
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

    total += this.info.transport_fee
    return total || 0
  }

  addCharges() {
    let addCharges = 0

    if (this.ladder) {
      addCharges += 100
    }
    if (this.scaftfolding) {
      addCharges += 200
    }

    addCharges += this.info.transport_fee

    return addCharges || 0
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
    let pleat_id
    let blind_id

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
        track = true
        track_id = this.tracklist.filter(x => x.name == this.item[i].track)[0]['id']
      } else {
        track = false
      }

      if (this.item[i].track_sheer != null) {
        track_sheer = true
        track_sheer_id = this.tracklist.filter(x => x.name == this.item[i].track_sheer)[0]['id']
      } else {
        track_sheer = false
      }

      if (this.item[i].pleat != null && this.item[i].pleat != '') {
        pleat_id = this.pleatlist.filter(x => x.name == this.item[i].pleat)[0]['id']
      }

    } else {
      if (this.item[i].pleat == 'Roman Blind') {
        curtain = true
        sheer = false
        track = false
        track_sheer = false
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
        track_sheer = false
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
      curtain_id: curtain_id, sheer: sheer, sheer_id: sheer_id, track: track, track_id: track_id, pleat_id: pleat_id, track_sheer: track_sheer, track_sheer_id: track_sheer_id, blind: blind, blind_id: blind_id, 
      pieces_curtain: this.item[i].pieces_curtain || 0, pieces_sheer: this.item[i].pieces_sheer || 0, pieces_blind: this.item[i].pieces_blind || 0,
      promo_curtain: this.item[i].promo_curtain || 0, promo_lining: this.item[i].promo_lining || 0, promo_sheer: this.item[i].promo_sheer || 0, promo_blind: this.item[i].promo_blind || 0
    }

    console.log(temp);

    this.http.post('https://curtain.vsnap.my/calcPrice', temp).subscribe(a => {

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
              window.open(data, '_system');
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

}

