import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { NavController,Platform } from '@ionic/angular';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import firebase from 'firebase';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(
    private nav: NavController,
    private http: HttpClient,
    private actRoute: ActivatedRoute,
    private fcm: FCM,
    private platform: Platform,
    ) { }

  user = [] as any
  uid = ""

  ngOnInit() {
    firebase.auth().onAuthStateChanged(a => {
      if (a) {
        this.uid = a.uid
        this.actRoute.queryParams.subscribe((c) => {
          this.refresh()
        })
      } else {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top',
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
        })

        Toast.fire({
          icon: 'warning',
          title: 'Account login is needed before proceeding.'
        })

        this.nav.pop()
      }
    })

  }

  refresh() {
    this.http.post('https://curtain.vsnap.my/onestaff', { id: this.uid }).subscribe((s) => {
      this.user = s['data'][0]
      console.log(this.user);
    })
  }

  toProfile() {
    this.nav.navigateForward('profile?id=' + this.uid)
  }

  logout() {

    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      heightAuto: false,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Logout',
      reverseButtons: true,
    }).then((y) => {
      if (y.isConfirmed) {
        console.log(this.uid);

        if (!this.platform.is('desktop') && !this.platform.is('mobileweb')) {
          // this.platform.ready().then(() => {
            // this.fcm.unsubscribeFromTopic(this.uid).then(() => {
              firebase.auth().signOut();
            // })
          // })
          
        } else if(this.platform.is('desktop') || this.platform.is('mobileweb')){
          firebase.auth().signOut();

        } else {
          console.log(this.platform.platforms(), 'Contact Developer');
        }


        setTimeout(() => {
          this.nav.navigateBack('')

          const Toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          })

          Toast.fire({
            icon: 'success',
            title: 'Logged out.'
          })
        }, 100);

      }
    })

  }

}
