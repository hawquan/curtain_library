import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import firebase from 'firebase';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  constructor(
    private nav: NavController,
    private http: HttpClient,
    private actRoute: ActivatedRoute,
  ) { }

  user = [] as any

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
  }, {
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

  salesList = []

  pendingListTailor = [{
    height: 100,
    width: 100,
    type: "Tailor-Made Curtains",
    step: 3,
    pleat: "Ripple Fold",
  }]
  pendingListInstaller = [{
    height: 100,
    width: 100,
    type: "Tailor-Made Curtains",
    step: 3,
    pleat: "Ripple Fold",
  }]

  statusPending = true
  statusOnGoing = false
  statusCompleted = false
  statusRejected = false

  status = 'p'
  uid = ""

  ngOnInit() {
    this.position = 'sales'

    firebase.auth().onAuthStateChanged(a => {
      if (a) {
        this.uid = a.uid
        this.http.post('http://192.168.1.117/onestaff', { id: a.uid }).subscribe((s) => {
          this.user = s['data'][0]
          console.log(this.user);
        })

        this.http.post('http://192.168.1.117/getsaleslist', { id_sales: a.uid }).subscribe((s) => {
          this.salesList = s['data']
          console.log(this.salesList);
        })
      }
    })

  }

  filterPendingList(type) {
    if (type == 'sales') {
      return this.salesList.filter(x => x.step == 1)
    } else if (type == 'tech') {
      return this.pendingList.filter(x => x.step == 2)
    } else if (type == 'tailor') {
      return this.pendingListTailor.filter(x => x.step == 3)
    } else if (type == 'installer') {
      return this.pendingList.filter(x => x.step == 4)
    }
  }

  filterOnGoingList(type) {
    if (type == 'sales') {
      return this.salesList.filter(x => x.step >= 2 && x.step < 5)
    } else if (type == 'tech') {
      return this.pendingList.filter(x => x.step >= 3 && x.step < 5)
    } else if (type == 'tailor') {
      return this.pendingListTailor.filter(x => x.step >= 4 && x.step < 5)
    } 
    // else if (type == 'installer') {
    //   return this.pendingListInstaller.filter(x => x.step >= 4 && x.step < 5)
    // }
  }

  filterCompletedList(type) {
    if (type == 'sales') {
      return this.salesList.filter(x => x.step == 5)
    } else if (type == 'tech') {
      return this.pendingList.filter(x => x.step == 5)
    } else if (type == 'tailor') {
      return this.pendingListTailor.filter(x => x.step == 5)
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

  selectTab(x) {
    this.status = x
  }

  toProfile() {
    this.nav.navigateForward('profile?id=' + this.uid)
  }

  toDetail(x) {

    let navExtra: NavigationExtras = {
      queryParams: {
        info: JSON.stringify(this.salesList),
      }
    }
    this.nav.navigateForward(['task-detail'], navExtra)
  }

  toTechDetail(x) {

    let item = {
      colours: "c0192",
      fabric: "f9283",
      pleat: "Ripple Fold",
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
      pleat: "Ripple Fold",
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
      pleat: "Ripple Fold",
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
