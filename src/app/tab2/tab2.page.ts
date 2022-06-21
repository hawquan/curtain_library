import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import firebase from 'firebase';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  constructor(
    private nav: NavController,
    private http: HttpClient,
  ) { }

  user = [] as any
  uid = ""

  ngOnInit() {
    firebase.auth().onAuthStateChanged(a => {
      if (a) {
        this.uid = a.uid
        this.http.post('http://192.168.1.117/onestaff', { id: a.uid }).subscribe((s) => {
          this.user = s['data'][0]
          console.log(this.user);
        })
      }
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
      confirmButtonText: 'Logout',
    }).then((y) => {
      if (y.isConfirmed) {
        firebase.auth().signOut();
        this.nav.navigateBack('')

        Swal.fire({
          title: 'Logged out.',
          icon: 'success',
          heightAuto: false,
          showConfirmButton: false,
          timer: 1000
        })
      }
    })

  }


}
