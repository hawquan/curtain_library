import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  user = {
    email: "",
    password: "",
  }
  
  show

  constructor(public nav: NavController) { }

  ngOnInit() {
  }

  tab2() {
    this.nav.navigateForward('tabs/tab2')
  }

}
