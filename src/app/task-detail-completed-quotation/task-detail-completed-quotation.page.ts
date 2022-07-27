import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import Swal from 'sweetalert2';

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
  ) { }

  item = []
  sales_no = 0
  calc = [] as any

  ngOnInit() {

    this.actroute.queryParams.subscribe(a => {
      this.item = JSON.parse(a["items"])
      this.sales_no = a["sales_no"]
      this.calc = JSON.parse(a["calc"])

      console.log(this.item, this.calc);
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

  lengthof(x) {
    return Object.keys(x || {}).length
  }

  
  back() {
    this.nav.pop()
  }

}

