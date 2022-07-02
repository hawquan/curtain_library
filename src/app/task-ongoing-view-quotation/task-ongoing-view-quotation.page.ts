import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-ongoing-view-quotation',
  templateUrl: './task-ongoing-view-quotation.page.html',
  styleUrls: ['./task-ongoing-view-quotation.page.scss'],
})
export class TaskOngoingViewQuotationPage implements OnInit {

  constructor(
    private actroute: ActivatedRoute,
    private nav : NavController,
    private http: HttpClient,
  ) { }

  item = []
  sales_no = 0

  ngOnInit() {

    this.actroute.queryParams.subscribe(a => {
      this.item = JSON.parse(a["items"])
      this.sales_no = a["sales_no"]
      console.log(this.item);
    })
  }

  totalPrice() {
    let total = 0
    for (let i = 0; i < this.item.length; i++) {
      total += this.item[i].price
    }
    return total || 0
  }

  checkout(){

    let temp = {
      no : this.sales_no,
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

  back(){
    this.nav.pop()
  }

}

