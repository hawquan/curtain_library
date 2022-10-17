import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
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
        
        // this.fcm.unsubscribeFromTopic(this.uid).then(() => {
          firebase.auth().signOut();
        // })

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
