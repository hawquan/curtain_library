import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import Swal from 'sweetalert2';

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
  ) { }

  item = [] as any
  sales_no = 0
  info = []
  position = ''
  pleatlist = []
  blindlist = []
  tracklist = []
  fabriclist = []
  fabricCurtain = []
  fabricSheer = []

  calc = [] as any

  ngOnInit() {

    this.actroute.queryParams.subscribe(a => {
      this.item = JSON.parse(a["items"])
      this.info = JSON.parse(a["info"])
      this.position = a["position"]
      this.sales_no = this.info['no']
      this.calc = JSON.parse(a["calc"])

      console.log(this.item, this.info, this.sales_no, this.pleatlist, this.blindlist, this.tracklist, this.fabriclist);
      console.log(this.calc);

    })
  }

  // calcPrice(i) {
  //   console.log('calc');

  //   // this.item.curtain

  //   let curtain = false as any
  //   let curtain_id
  //   let sheer = false
  //   let sheer_id
  //   let track = false
  //   let track_id

  //   let pleat_id

  //   this.http.get('https://6dbe-175-140-151-140.ap.ngrok.io/fabricList').subscribe((s) => {
  //     let temp = s['data']

  //     this.fabricCurtain = temp.filter(x => x.type == 'Curtain')
  //     this.fabricSheer = temp.filter(x => x.type == 'Sheer')

  //     console.log(this.fabricCurtain, this.fabricSheer)
  //   })

  //   console.log(this.item[i]);


  //   if (this.item[i].curtain != 'Blinds') {

  //     if (this.item[i].fabric != null && this.item[i].fabric != 'NA') {
  //       curtain = true
  //       curtain_id = this.fabricCurtain.filter(x => x.name == this.item[i].fabric)[0]['id']
  //     } else {
  //       curtain = false
  //     }

  //     if (this.item[i].fabric_sheer != null && this.item[i].fabric_sheer != 'NA') {
  //       sheer = true
  //       sheer_id = this.fabricSheer.filter(x => x.name == this.item[i].fabric_sheer)[0]['id']
  //     } else {
  //       sheer = false
  //     }

  //     if (this.item[i].track != null && this.item[i].track != 'NA') {
  //       track = true
  //       track_id = this.tracklist.filter(x => x.name == this.item[i].track)[0]['id']
  //     } else {
  //       track = false
  //     }

  //     pleat_id = this.pleatlist.filter(x => x.name == this.item[i].pleat)[0]['id']

  //     console.log(curtain_id, sheer_id, track_id, pleat_id);

  //   } else {
  //     curtain = false
  //     sheer = false
  //     track = false

  //     pleat_id = this.pleatlist.filter(x => x.name == this.item[i].pleat)[0]['id']
  //   }

  //   let temp = {
  //     width: this.item[i].width, height: this.item[i].height, curtain: curtain,
  //     curtain_id: curtain_id, sheer: sheer, sheer_id: sheer_id, track: track, track_id: track_id, pleat_id: pleat_id
  //   }

  //   console.log(temp);

  //   this.http.post('https://6dbe-175-140-151-140.ap.ngrok.io/calcPrice', temp).subscribe(a => {

  //     this.calc.push(a)
  //     console.log(this.calc);
  //   })

  // }

  totalPrice() {
    let total = 0
    for (let i = 0; i < this.item.length; i++) {
      total += this.item[i].price
    }
    return total || 0
  }

  checkout() {

    if (this.info['rejected'] == true) {
      let temp = {
        no: this.sales_no,
        rejected: false,
        step: 4,
      }

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
          this.http.post('https://6dbe-175-140-151-140.ap.ngrok.io/updatesales', temp).subscribe(a => {
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
        no: this.sales_no,
        step: 2,
      }

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
          this.http.post('https://6dbe-175-140-151-140.ap.ngrok.io/updatesales', temp).subscribe(a => {
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

  lengthof(x) {
    return Object.keys(x || {}).length
  }

  back() {
    this.nav.pop()
  }

}
