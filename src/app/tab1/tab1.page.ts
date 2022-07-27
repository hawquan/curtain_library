import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import firebase from 'firebase';
import { TailorTaskDetailPage } from '../tailor-task-detail/tailor-task-detail.page';
import { TaskDetailCompletedReviewPage } from '../task-detail-completed-review/task-detail-completed-review.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  constructor(
    private nav: NavController,
    private http: HttpClient,
    private modal: ModalController,
    private actRoute: ActivatedRoute,
  ) { }

  user = [] as any
  pleatlist = []
  blindlist = []

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
  salesListRejected = []
  tailorList = []

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

    firebase.auth().onAuthStateChanged(a => {
      if (a) {
        this.uid = a.uid
        this.http.post('https://6dbe-175-140-151-140.ap.ngrok.io/onestaff', { id: a.uid }).subscribe((s) => {
          this.user = s['data'][0]
          console.log(this.user);

          this.http.get('https://6dbe-175-140-151-140.ap.ngrok.io/pleatlist').subscribe((s) => {
            this.pleatlist = s['data']
            console.log(this.pleatlist)
          })

          this.http.get('https://6dbe-175-140-151-140.ap.ngrok.io/blindlist').subscribe((s) => {
            this.blindlist = s['data']
            console.log(this.blindlist)
          })

          this.actRoute.queryParams.subscribe((c) => {
            this.refresher(a.uid)

          })

        })

      }
    })
  }

  refresher(x) {
    if (this.user.position == "Sales" || this.user.position == "Technician" || this.user.position == "Installer") {
      this.http.post('https://6dbe-175-140-151-140.ap.ngrok.io/getsaleslist', { id_sales: x, id_tech: x, id_inst: x }).subscribe((s) => {
        this.salesList = s['data']
        console.log(this.salesList);
      })

      this.http.post('https://6dbe-175-140-151-140.ap.ngrok.io/getrejected', { id_sales: x }).subscribe((s) => {
        this.salesListRejected = s['data']
        console.log(this.salesListRejected.length, this.salesListRejected);

      })

    } else if (this.user.position == "Tailor") {
      this.http.post('https://6dbe-175-140-151-140.ap.ngrok.io/getorderlist2', { id_tail: x }).subscribe((s) => {
        this.tailorList = s['data']
        console.log(this.tailorList);
      })
    }
  }

  filterPendingList(type) {
    if (type == 'sales') {
      return this.salesList.filter(x => x.step == 1)
    } else if (type == 'tech') {
      return this.salesList.filter(x => x.step == 2)
    } else if (type == 'tailor') {
      return this.tailorList.filter(x => x.step == 3)
    } else if (type == 'installer') {
      return this.salesList.filter(x => x.step == 4)
    }
  }

  filterOnGoingList(type) {
    if (type == 'sales') {
      return this.salesList.filter(x => x.step >= 2 && x.step < 5)
    } else if (type == 'tech') {
      return this.salesList.filter(x => x.step >= 3 && x.step < 5)
    } else if (type == 'tailor') {
      return this.tailorList.filter(x => x.step >= 4 && x.step < 5)
    }
    // else if (type == 'installer') {
    //   return this.pendingListInstaller.filter(x => x.step >= 4 && x.step < 5)
    // }
  }

  filterCompletedList(type) {
    if (type == 'sales') {
      return this.salesList.filter(x => x.step == 5)
    } else if (type == 'tech') {
      return this.salesList.filter(x => x.step == 5)
    } else if (type == 'tailor') {
      return this.tailorList.filter(x => x.step == 5)
    } else if (type == 'installer') {
      return this.salesList.filter(x => x.step == 5)
    }
  }

  selectTab(x) {
    this.status = x
  }

  toProfile() {
    this.nav.navigateForward('profile?id=' + this.uid)
  }

  toDetail(x) {

    let navExtra: NavigationExtras = {
      queryParams: {
        info: JSON.stringify(x),
        user: JSON.stringify(this.user),
      }
    }
    this.nav.navigateForward(['task-detail'], navExtra)
  }

  toTailorDetail(x, i) {

    let navExtra: NavigationExtras = {
      queryParams: {
        info: JSON.stringify(x),
        pleatlist: JSON.stringify(this.pleatlist),
        blindlist: JSON.stringify(this.blindlist),
      }
    }
    this.nav.navigateForward(['tailor-task-detail'], navExtra)

  }

  toTailorDetailOngoing(x, i) {

    let navExtra: NavigationExtras = {
      queryParams: {
        info: JSON.stringify(x),
        pleatlist: JSON.stringify(this.pleatlist),
      }
    }
    this.nav.navigateForward(['tailor-task-detail-ongoing'], navExtra)

  }

  // async toTailorDetail(x,i) {

  //   const modal = await this.modal.create({
  //     cssClass: 'task',
  //     component: TailorTaskDetailPage,
  //     componentProps: {
  //       item: x,
  //       pleatlist: this.pleatlist,
  //     }
  //   });

  //   await modal.present();
  //   const { data } = await modal.onWillDismiss();
  //   console.log(data)

  //   if (data == 1) {
  //     this.refresher(data)
  //   }
  // }

  toDetailRejected(x) {

    let navExtra: NavigationExtras = {
      queryParams: {
        info: JSON.stringify(x),
        user: JSON.stringify(this.user),
      }
    }
    this.nav.navigateForward(['task-detail-rejected'], navExtra)
  }

  toOngoing(x) {

    let navExtra: NavigationExtras = {
      queryParams: {
        info: JSON.stringify(x),
        user: JSON.stringify(this.user),
      }
    }

    this.nav.navigateForward(['task-ongoing'], navExtra)
  }

  toCompletedDetail(x) {

    let navExtra: NavigationExtras = {
      queryParams: {
        info: JSON.stringify(x),
        user: JSON.stringify(this.user),
      }
    }
    this.nav.navigateForward(['task-detail-completed'], navExtra)
  }

  async reviewTaskCompleted(x) {

    const modal = await this.modal.create({
      cssClass: 'task',
      component: TaskDetailCompletedReviewPage,
      componentProps: {
        item: x,
        pleatlist: this.pleatlist,
        position: this.user['position'],
      }
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log(data)

    if (data == 1) {
      // x = data
    }
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
