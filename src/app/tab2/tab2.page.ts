import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import firebase from 'firebase';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  constructor(public nav: NavController) { }

  goProductCategory(passData) {
    this.nav.navigateForward('product-category?isCategory=' + passData)
  }

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay:true
   };

   products = [{
    img: 'https://abef3c1b204b2c90c.zapwp.com/q:lossless/retina:true/webp:true/w:412/url:https://images.squarespace-cdn.com/content/v1/5cb5f0cf7eb88c562b08911a/1580747159100-GINMCH0GWNG5DNOXYUR0/curtains-and-draperies.jpg?format=2500w',
    h1: 'Curtains',
    h2: 'Custom Curtains Fitted To Perfection'
   },{
    img: 'https://images.makey.com/media%2F02-21%2FCurtains-in-front-of-blinds-1500?width=1440&crop=16:9,smart&format=pjpg&auto=webp&quality=85,75',
    h1: 'Blinds',
    h2: 'Find The Perfect Blinds For Your Windows'
   },{
    img: 'https://d2idwy38ncsfm5.cloudfront.net/media/images/graha.2e16d0ba.fill-1000x825.format-webp.webpquality-75.webp',
    h1: 'Wallpapers',
    h2: 'Add Personality To Your Walls'
   }]

   services = [{
    img: 'https://briteclean.my/img/gallery/20.jpg',
    h1: 'Curtain Cleaning',
    h2: 'When it comes to cleaning curtains, we’re the experts'
   }]

   newsImage = [{
    pic: 'https://evolveindia.co/wp-content/webp-express/webp-images/doc-root/wp-content/uploads/2021/07/21_Design-A-Room-Youll-Want-To-Stay-In-Forever-Modern-Bedroom-Interior-Design-1024x651.jpg.webp'
   },{
    pic: 'https://evolveindia.co/wp-content/webp-express/webp-images/doc-root/wp-content/uploads/2021/07/20_A-Modern-Bedroom-Interior-Design-Idea-Thatll-Leave-You-Bedazzled-Modern-Bedroom-Interior-Design-1024x641.jpg.webp'
   },{
    pic: 'https://evolveindia.co/wp-content/webp-express/webp-images/doc-root/wp-content/uploads/2021/07/33_Warm-Blue-Accents-Modern-Bedroom-Interior-Design-1024x640.jpg.webp'
   }]


  // user = [] as any
  // uid = ""

  ngOnInit() {
    // firebase.auth().onAuthStateChanged(a => {
    //   if (a) {
    //     this.uid = a.uid
    //     this.actRoute.queryParams.subscribe((c) => {
    //       this.refresh()
    //     })
    //   }
    // })

  }

  // refresh() {
  //   this.http.post('https://curtain.vsnap.my/onestaff', { id: this.uid }).subscribe((s) => {
  //     this.user = s['data'][0]
  //     console.log(this.user);
  //   })
  // }

  // toProfile() {
  //   this.nav.navigateForward('profile?id=' + this.uid)
  // }

  // logout() {

  //   Swal.fire({
  //     title: 'Logout?',
  //     text: 'Are you sure you want to logout?',
  //     icon: 'warning',
  //     heightAuto: false,
  //     showCancelButton: true,
  //     showConfirmButton: true,
  //     cancelButtonText: 'Cancel',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Logout',
  //     reverseButtons: true,
  //   }).then((y) => {
  //     if (y.isConfirmed) {
  //       this.fcm.unsubscribeFromTopic(this.uid).then(() => {
  //         firebase.auth().signOut();
  //       })

  //       setTimeout(() => {
  //         this.nav.navigateBack('')

  //         const Toast = Swal.mixin({
  //           toast: true,
  //           position: 'top',
  //           showConfirmButton: false,
  //           timer: 2000,
  //           timerProgressBar: true,
  //         })

  //         Toast.fire({
  //           icon: 'success',
  //           title: 'Logged out.'
  //         })
  //       }, 100);

  //     }
  //   })

  // }


}
