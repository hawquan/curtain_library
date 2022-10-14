import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.page.html',
  styleUrls: ['./product-category.page.scss'],
})
export class ProductCategoryPage implements OnInit {

  constructor(private activateRoute: ActivatedRoute, public nav: NavController) { }

  isCategory

  ngOnInit() {
    this.activateRoute.queryParams.subscribe((getData) => {
      this.isCategory = getData['isCategory']
    })
  }

  categoryDetails = [{
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR21clCjW2Lp_olWdC5ZYKrCbiUDUw1JCn2Ig&usqp=CAU',
    h1: 'Roman Blinds',
    h2: 'Providing privacy, insulation and complete light control. Our fabric roman blinds are hand finished to the highest standards. Suitable for any area of the home, offices and other commercial locations.'
  },{
    img: 'https://www.newwaykl.com/wp-content/uploads/2021/05/8dfc2b2e-9992-4f08-9b15-2bd7c5dcfc7f-1024x767.jpg',
    h1: 'Roller Blinds',
    h2: 'The simplest form of blinds, yet effective in its intended use. An easy to use and install piece of window accessory that would create an immediate effect to reduce sunlight, increase privacy and darken a room'
  },{
    img: 'https://image.made-in-china.com/226f3j00FNTaqOzgbEos/Blackout-Horizontal-Sheer-Elegance-Blinds-Sun-Shading-Zebra-Blinds.jpg',
    h1: 'Zebra Blinds',
    h2: 'With a range of fabrics to suit all tastes, this innovative solution is a smart design that gives you style and light control within the one system. Be bold and stylish whilst maximising privacy and natural light.'
  },{
    img: 'https://www.comfortblinds.co.uk/assets/comfort-blinds-wood-blinds-large-7-4168f78a4f7a9da2c7bf04c07a2a8ba3b1d02d8a2fb46e041ec94d601f88a3b3.jpg',
    h1: 'Wooden Blinds',
    h2: 'Also known as Venetian blinds, this style allows you to either gather all the slats at the top of the window to reveal the view, or simply angle the slats to allow some light to travel through the blind, yet retain some level of privacy.'
  }]

  back() {
    this.nav.pop()
  }

}
