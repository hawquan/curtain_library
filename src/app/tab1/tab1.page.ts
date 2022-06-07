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

  user = {
    name : 'Maverick',
    position: 'Salesman',
    photo: 'https://www.giantfreakinrobot.com/wp-content/uploads/2022/04/top-gun-maverick-tom-cruise-936x527-1.jpeg'
  }

  position = ''
  today = new Date().toISOString()
  salesSelection = ['Pending', 'On-Going', 'Completed']
  pendingList = [{
    client: 'Tom Cruise',
    address: 'F-3A-16, IOI Boulevard, Jalan Kenari 5, Bandar Puchong Jaya, 47170 Puchong, Selangor',
    contact: '010-1234567',
    house_type: 'semi-d',
    step: 1,
    img: ['https://wallpaperaccess.com/full/3292878.jpg', 'https://expertphotography.b-cdn.net/wp-content/uploads/2019/05/beautiful-photography-man-sitting-in-front-of-lake.jpg']
  },
  
  {
    client: 'Val Kilmer',
    address: 'F-3A-16, IOI Boulevard, Jalan Kenari 5, Bandar Puchong Jaya, 47170 Puchong, Selangor',
    contact: '010-1234567',
    house_type: 'semi-d',
    step: 1,
    img: ['https://wallpaperaccess.com/full/3292878.jpg', 'https://expertphotography.b-cdn.net/wp-content/uploads/2019/05/beautiful-photography-man-sitting-in-front-of-lake.jpg']
  },{
    client: 'Lorem Ipsum2',
    address: 'No.123 Jalan 4 dddddddd dddddddddd',
    contact: '010-1234567',
    house_type: 'bangalow',
    step: 2,
    img: ['https://wallpaperaccess.com/full/3292878.jpg', 'https://expertphotography.b-cdn.net/wp-content/uploads/2019/05/beautiful-photography-man-sitting-in-front-of-lake.jpg']
  }, {
    client: 'Lorem Ipsum3',
    address: 'No.123 Jalan 4 dddddddd dddddddddd dddddddd ddddddddd ddddddddddd',
    contact: '010-1234567',
    house_type: 'condo',
    step: 3,
    img: ['https://wallpaperaccess.com/full/3292878.jpg', 'https://expertphotography.b-cdn.net/wp-content/uploads/2019/05/beautiful-photography-man-sitting-in-front-of-lake.jpg']
  }, {
    client: 'Lorem Ipsum4',
    address: 'No.123 Jalan 4 dddddddd dddddddddd dddddddd ddddddddd ddddddddddd',
    contact: '010-1234567',
    house_type: 'bangalow',
    step: 4,
    img: ['https://wallpaperaccess.com/full/3292878.jpg', 'https://expertphotography.b-cdn.net/wp-content/uploads/2019/05/beautiful-photography-man-sitting-in-front-of-lake.jpg']
  }, {
    client: 'Lorem Ipsum5',
    address: 'No.123 Jalan 4 dddddddd dddddddddd',
    contact: '010-1234567',
    house_type: 'semi-d',
    step: 5,
    img: ['https://wallpaperaccess.com/full/3292878.jpg', 'https://expertphotography.b-cdn.net/wp-content/uploads/2019/05/beautiful-photography-man-sitting-in-front-of-lake.jpg']
  },]

  pendingListTailor = [{
    height: 100,
    width: 100,
    type: "Tailor-Made Curtains",
    step: 3,
    header: "Ripple Fold",
  }]

  statusPending = true
  statusOnGoing = false
  statusCompleted = false
  statusRejected = false

  status = 'p'

  ngOnInit() {
    this.position = 'sales'
  }

  filterPendingList(type) {
    if (type == 'sales') {
      return this.pendingList.filter(x => x.step == 1)
    } else if (type == 'tech') {
      return this.pendingList.filter(x => x.step == 2)
    } else if (type == 'tailor') {
      return this.pendingListTailor.filter(x => x.step == 3)
    } else if (type == 'installer') {
      return this.pendingList.filter(x => x.step == 4)
    }
  }

  changeStatus(x) {
    this.position = x
  }

  // status(x) {
  //   this.statusPending = false
  //   this.statusOnGoing = false
  //   this.statusCompleted = false
  //   this.statusRejected = false

  //   if (x == 'p') {
  //     this.statusPending = true
  //   } else if (x == 'o') {
  //     this.statusOnGoing = true
  //   } else if (x == 'c') {
  //     this.statusCompleted = true
  //   } else if (x == 'r') {
  //     this.statusRejected = true
  //   }
  // }

  selectTab(x){
    this.status = x
  }

  toDetail(x) {

    let navExtra: NavigationExtras = {
      queryParams: {
        info: JSON.stringify(x),
      }
    }
    this.nav.navigateForward(['task-detail'], navExtra)
  }

  toTechDetail(x) {

    let item = {
      colours: "c0192",
      fabric: "f9283",
      header: "Ripple Fold",
      height: 100,
      patterns: "p7652",
      type: "Tailor-Made Curtains",
      width: 100,
    }
    let navExtra: NavigationExtras = {
      queryParams: {
        info: JSON.stringify(x),
        item: JSON.stringify(item)
      }
    }
    this.nav.navigateForward(['tech-task-detail'], navExtra)
  }

  toTailorDetail(x) {

    let item = {
      colours: "c0192",
      fabric: "f9283",
      header: "Ripple Fold",
      height: 100,
      patterns: "p7652",
      type: "Tailor-Made Curtains",
      width: 100,
    }
    let navExtra: NavigationExtras = {
      queryParams: {
        item: JSON.stringify(item)
      }
    }
    this.nav.navigateForward(['tailor-task-detail'], navExtra)
  }

  toInstallerDetail(x) {

    let item = {
      colours: "c0192",
      fabric: "f9283",
      header: "Ripple Fold",
      height: 100,
      patterns: "p7652",
      type: "Tailor-Made Curtains",
      width: 100,
    }
    let navExtra: NavigationExtras = {
      queryParams: {
        info: JSON.stringify(x),
        item: JSON.stringify(item)
      }
    }
    this.nav.navigateForward(['installer-task-detail'], navExtra)
  }

}
