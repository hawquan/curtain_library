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
  register = [] as any
  show
  status = 'l'

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

        this.http.post('https://curtain.vsnap.my/onestaff', { id: a.uid }).subscribe((s) => {
          console.log(s);

          if (s['data'].length > 0) {
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
                text: "This user is deactivated or doesn't exist, please contact admin for more information.",
                icon: 'error',
                heightAuto: false,
                showConfirmButton: true,
              })
            }
          } else {
            this.http.post('https://curtain.vsnap.my/oneadmin', { id: a.uid }).subscribe((s) => {
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
                  text: "This user is deactivated or doesn't exist, please contact admin for more information.",
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

  selectTab(x) {
    this.status = x
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

  registerUser() {

    if (!this.register['name']) {

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Staff name is missing',
        timer: 3000,
        heightAuto: false,

      })

    } else if (!this.register['email']) {

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Staff email is missing',
        timer: 3000,
        heightAuto: false,


      })

    } else if (!this.register['phone']) {

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Staff phone is missing',
        timer: 3000,
        heightAuto: false,


      })

    } else if (!this.register['password']) {

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Password is missing',
        timer: 3000,
        heightAuto: false,


      })

    }
    else {

      let temp = {
        name: this.register.name,
        email: this.register.email,
        password: this.register.password,
        photo: "https://forcarserver.s3.ap-southeast-1.amazonaws.com/forcar/goalgame/1662972739683l7yj1aq48.png",
        phone: this.register.phone,
        date_join: new Date().getTime(),
        id: "",
        position: "Sales",
        status: true,
      }

      console.log(temp);

      Swal.fire({
        title: 'Register',
        text: "Are you sure to register?",
        icon: 'question',
        heightAuto: false,
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm!',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {

          this.http.post('https://curtain.vsnap.my/insertstaffs', temp).subscribe(s => {

            Swal.fire({
              icon: 'success',
              title: 'Register Successfully. Logging in...',
              timer: 3000,
              heightAuto: false

            })

            this.loginUser(this.register)

          }, e => {
            console.log(e);

            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: e.error.message.message,
              heightAuto: false

            })
          })
        }


      })

    }
    // console.log(this.user)

  }

  tohome() {
    this.nav.navigateForward('tabs/tab1')
  }

  tab2() {
    this.nav.navigateForward('tabs/tab2')
  }

}

