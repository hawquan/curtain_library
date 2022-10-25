import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.page.html',
  styleUrls: ['./product-category.page.scss'],
})
export class ProductCategoryPage implements OnInit {

  constructor(
    private activateRoute: ActivatedRoute,
    public nav: NavController,
    private alertController: AlertController,
  ) { }

  goProductDetails() {
    this.nav.navigateForward('product-details')
  }

  isCategory

  ngOnInit() {
    this.activateRoute.queryParams.subscribe((getData) => {
      this.isCategory = getData['isCategory']
    })
  }

  goWhatsapp() {
    window.open("https://api.whatsapp.com/send?phone=60192253055&amp;text=I%20want%20to%20find%20out%20about%20your%20products");
    // 60192253055
  }


  categoryDetails = [{
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR21clCjW2Lp_olWdC5ZYKrCbiUDUw1JCn2Ig&usqp=CAU',
    h1: 'Roman Blinds',
    h2: 'Providing privacy, insulation and complete light control.'
  }, {
    img: 'https://www.newwaykl.com/wp-content/uploads/2021/05/8dfc2b2e-9992-4f08-9b15-2bd7c5dcfc7f-1024x767.jpg',
    h1: 'Roller Blinds',
    h2: 'The simplest form of blinds, yet effective in its intended use.'
  }, {
    img: 'https://image.made-in-china.com/226f3j00FNTaqOzgbEos/Blackout-Horizontal-Sheer-Elegance-Blinds-Sun-Shading-Zebra-Blinds.jpg',
    h1: 'Zebra Blinds',
    h2: 'This innovative solution is a smart design that gives you style and light control within the one system.'
  }, {
    img: 'https://www.comfortblinds.co.uk/assets/comfort-blinds-wood-blinds-large-7-4168f78a4f7a9da2c7bf04c07a2a8ba3b1d02d8a2fb46e041ec94d601f88a3b3.jpg',
    h1: 'Wooden Blinds',
    h2: 'This style allows you to either gather all the slats at the top of the window to reveal the view, or simply angle the slats to allow some light to travel through the blind.'
  }]

  async enquiry() {
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