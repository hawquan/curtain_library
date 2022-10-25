import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {

  constructor(
    public nav: NavController,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
  }

  goWhatsapp() {
    window.open("https://api.whatsapp.com/send?phone=60192253055&amp;text=I%20want%20to%20find%20out%20about%20your%20products");
    // 60192253055
  }

  async booking() {
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      header: 'Enquiry Info',
      // subHeader: 'Default Password: forcar123',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Name (Eg. Jenny)',
        },
        {
          name: 'phone',
          type: 'text',
          placeholder: 'Phone (Eg. 0101234567)',
        },
        {
          name: 'email',
          type: 'text',
          placeholder: 'Email (Eg. jen@mail.com)',
        },
        {
          name: 'address',
          type: 'text',
          placeholder: 'Address',
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
            if (data['name'] == null || data['name'] == '') {
              this.error('Name')
            } else if (data['phone'] == null || data['phone'] == '') {
              this.error('Phone')
            } else if (data['email'] == null || data['email'] == '') {
              this.error('Email')
            } else if (data['address'] == null || data['address'] == '') {
              this.error('Address')
            } else {

              Swal.fire({
                title: 'Enquiry Submitted',
                text: `Thanks for booking with us. We'll contact you soon.`,
                icon: 'success',
                heightAuto: false,
                showCancelButton: false,
              })

            }

          }
        }
      ]
    });

    await alert.present();
  }

  error(x) {
    Swal.fire({
      title: x + ' is Empty',
      text: 'Please ensure field is not empty and try again!',
      icon: 'error',
      timer: 5000,
      heightAuto: false,
    });
  }

  back() {
    this.nav.pop()
  }
}
