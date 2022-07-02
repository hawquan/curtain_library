import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import firebase from 'firebase';
import { HttpClient } from '@angular/common/http';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private authService: AuthService,
    private nav: NavController,
    private http: HttpClient,
  ) { }

  user = {
    email: "",
    password: "",
  }
  show

  ngOnInit() {
    firebase.auth().onAuthStateChanged(a => {
      if (a) {
        console.log(a);

        Swal.fire({
          title: 'Loading',
          text: "Please Wait...",
          icon: 'info',
          showConfirmButton: false,
          heightAuto: false,
        })
        this.http.post('https://bde6-124-13-53-82.ap.ngrok.io/onestaff', { id: a.uid }).subscribe((s) => {
          console.log(s);

          if (s['data'][0].status) {
            Swal.fire({
              title: 'Logged in successfully.',
              icon: 'success',
              heightAuto: false,
              showConfirmButton: false,
              timer: 1000
            })
            this.nav.navigateRoot('tabs/tab1', { animationDirection: 'forward' })
          } else {
            firebase.auth().signOut();
            Swal.fire({
              title: 'Error',
              text: "This user is deactivated, please contact admin for more information.",
              icon: 'error',
              heightAuto: false,
              showConfirmButton: true,
            })
          }
        }, e => {
          Swal.fire({
            title: 'Error',
            text: "Please check your internet connection!",
            icon: 'error',
            heightAuto: false,
            showConfirmButton: false,
            timer: 2000
          })
        })
      }
    })
  }

  async loginUser(credentials): Promise<void> {

    console.log(credentials);
    // Swal.fire({
    //   title: 'Loading...',
    //   text: "Please Wait...",
    //   icon: 'info',
    //   showConfirmButton: false,
    //   heightAuto: false,
    // })
    this.authService.loginUser(credentials.email, credentials.password).then(
      (a) => {
        console.log(a);

      },
      async error => {
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'error',
          timer: 2000,
          heightAuto: false,
          showConfirmButton: false,
        })
      }
    );
  }

  tohome() {
    this.nav.navigateForward('tabs/tab1')
  }

}

