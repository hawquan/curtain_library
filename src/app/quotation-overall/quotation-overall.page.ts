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

  item = []
  sales_no = 0
  info = []
  position = ''

  ngOnInit() {

    this.actroute.queryParams.subscribe(a => {
      this.item = JSON.parse(a["items"])
      this.info = JSON.parse(a["info"])
      this.position = a["position"]
      this.sales_no = this.info['no']
      console.log(this.item, this.info, this.sales_no);
    })
  }

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
          this.http.post('https://bde6-124-13-53-82.ap.ngrok.io/updatesales', temp).subscribe(a => {
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
          this.http.post('https://bde6-124-13-53-82.ap.ngrok.io/updatesales', temp).subscribe(a => {
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

  back() {
    this.nav.pop()
  }

}
