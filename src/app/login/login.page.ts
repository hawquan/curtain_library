import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private authService: AuthService,
    private nav: NavController,

  ) { }

  user = [] as any
show 
  ngOnInit() {
  }

  async loginUser(credentials): Promise<void> {

    console.log(credentials);
    Swal.fire({
      title: 'Loading...',
      text: "Please Wait...",
      icon: 'info',
      showConfirmButton: false,
      heightAuto: false,
    })
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

