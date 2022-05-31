import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  constructor(
    private nav: NavController,
  ) { }

  position = ''
  today = new Date()
  salesSelection = ['Pending', 'On-Going', 'Completed']
  pendingList = [{
    client: 'Lorem Ipsum1',
    address: 'No.123 Jalan 4 dddddddd dddddddddd dddddddd ddddddddd ddddddddddd',
    contact: '010-1234567',
    house_type: 'semi-d',
    img: ['https://wallpaperaccess.com/full/3292878.jpg','https://expertphotography.b-cdn.net/wp-content/uploads/2019/05/beautiful-photography-man-sitting-in-front-of-lake.jpg']
  }, {
    client: 'Lorem Ipsum2',
    address: 'No.123 Jalan 4 dddddddd dddddddddd',
    contact: '010-1234567',
    house_type: 'bangalow',
    img: ['https://wallpaperaccess.com/full/3292878.jpg','https://expertphotography.b-cdn.net/wp-content/uploads/2019/05/beautiful-photography-man-sitting-in-front-of-lake.jpg']
  }, {
    client: 'Lorem Ipsum3',
    address: 'No.123 Jalan 4 dddddddd dddddddddd dddddddd ddddddddd ddddddddddd',
    contact: '010-1234567',
    house_type: 'semi-d',
    img: ['https://wallpaperaccess.com/full/3292878.jpg','https://expertphotography.b-cdn.net/wp-content/uploads/2019/05/beautiful-photography-man-sitting-in-front-of-lake.jpg']
  }, {
    client: 'Lorem Ipsum4',
    address: 'No.123 Jalan 4 dddddddd dddddddddd dddddddd ddddddddd ddddddddddd',
    contact: '010-1234567',
    house_type: 'bangalow',
    img: ['https://wallpaperaccess.com/full/3292878.jpg','https://expertphotography.b-cdn.net/wp-content/uploads/2019/05/beautiful-photography-man-sitting-in-front-of-lake.jpg']
  }, {
    client: 'Lorem Ipsum5',
    address: 'No.123 Jalan 4 dddddddd dddddddddd',
    contact: '010-1234567',
    house_type: 'semi-d',
    img: ['https://wallpaperaccess.com/full/3292878.jpg','https://expertphotography.b-cdn.net/wp-content/uploads/2019/05/beautiful-photography-man-sitting-in-front-of-lake.jpg']
  },]
  statusPending = true
  statusOnGoing = false
  statusCompleted = false
  statusRejected = false

  ngOnInit() {
    this.position = 'sales'
  }

  changeStatus(x){
    this.position = x
  }

  status(x) {
    this.statusPending = false
    this.statusOnGoing = false
    this.statusCompleted = false
    this.statusRejected = false

    if (x == 'p') {
      this.statusPending = true
    } else if (x == 'o') {
      this.statusOnGoing = true
    } else if (x == 'c') {
      this.statusCompleted = true
    } else if (x == 'r') {
      this.statusRejected = true
    }
  }

  toDetail(x) {

    let navExtra: NavigationExtras = {
      queryParams:{
        info: JSON.stringify(x),
      }
    }    
    this.nav.navigateForward(['task-detail'], navExtra)
  }

}
