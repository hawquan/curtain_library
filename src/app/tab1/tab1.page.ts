import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ActionSheetController, ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import firebase from 'firebase';
import { TailorTaskDetailPage } from '../tailor-task-detail/tailor-task-detail.page';
import { TaskDetailCompletedReviewPage } from '../task-detail-completed-review/task-detail-completed-review.page';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';

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
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private fcm: FCM,
    private toastController: ToastController,
    private platform: Platform,
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
  snapURL = 'data:image/png;base64,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'

  async presentToastWithOptions(header, msg, id, path) {

    const toast = await this.toastController.create({
      header: header,
      message: msg,
      position: 'top',
      duration: 5000,
      buttons: [
        {
          text: 'Go',
          handler: () => {
            this.nav.navigateForward(path);
          }
        }
      ]
    });
    toast.present();
  }

  fcmNotification() {
    this.fcm.onNotification().subscribe(async data => {
      if (data.wasTapped) {
        setTimeout(() => {
          this.nav.navigateForward(data.path);
        }, 2000);
      }
      else {
        this.presentToastWithOptions(data.title, data.message, data.id, data.path)
      }
    })
  }

  ngOnInit() {

    firebase.auth().onAuthStateChanged(a => {
      if (a) {
        this.uid = a.uid

        if (!this.platform.is('desktop') && !this.platform.is('mobileweb')) {
          this.fcm.subscribeToTopic(a.uid);
          this.fcmNotification()
        } else {
          console.log(this.platform.platforms(), 'NO FCM');
        }

        this.actRoute.queryParams.subscribe((c) => {
          this.refresher(a.uid)

        })

      }
    })
  }

  opencamera(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):

      console.log(imageData)
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.snapURL = base64Image
     }, (err) => {
      // Handle error
     });
  }

  save(event){
    console.log(event)
  }

  refresher(x) {
    this.http.post('https://curtain.vsnap.my/onestaff', { id: this.uid }).subscribe((s) => {
      this.user = s['data'][0]
      console.log(this.user);

      this.http.get('https://curtain.vsnap.my/pleatlist').subscribe((s) => {
        this.pleatlist = s['data']
        console.log(this.pleatlist)
      })

      this.http.get('https://curtain.vsnap.my/blindlist').subscribe((s) => {
        this.blindlist = s['data']
        console.log(this.blindlist)
      })

    })
    // if (this.user.position == "Sales" || this.user.position == "Technician" || this.user.position == "Installer") {
    this.http.post('https://curtain.vsnap.my/getsaleslist', { id_sales: x, id_tech: x, id_tail: x, id_inst: x }).subscribe((s) => {
      this.salesList = s['data']
      console.log(this.salesList);
    })

    this.http.post('https://curtain.vsnap.my/getrejected', { id_sales: x }).subscribe((s) => {
      this.salesListRejected = s['data']
      console.log(this.salesListRejected.length, this.salesListRejected);

    })

    // } else if (this.user.position == "Tailor") {
    //   this.http.post('https://curtain.vsnap.my/getorderlist2', { id_tail: x }).subscribe((s) => {
    //     this.tailorList = s['data']
    //     console.log(this.tailorList);
    //   })
    // }
  }

  filterPendingList(type) {
    if (type == 'sales') {
      return this.salesList.filter(x => x.step == 1 && x.rejected != true)
    } else if (type == 'tech') {
      return this.salesList.filter(x => x.step == 2)
    } else if (type == 'tailor') {
      return this.salesList.filter(x => x.step == 3)
    } else if (type == 'installer') {
      return this.salesList.filter(x => x.step == 4)
    }
  }

  filterOnGoingList(type) {
    if (type == 'sales') {
      return this.salesList.filter(x => x.step >= 2 && x.step < 5).sort((a, b) => b.no - a.no)
    } else if (type == 'tech') {
      return this.salesList.filter(x => x.step >= 3 && x.step < 5).sort((a, b) => b.no - a.no)
    } else if (type == 'tailor') {
      return this.salesList.filter(x => x.step >= 4 && x.step < 5).sort((a, b) => b.no - a.no)
    }
    // else if (type == 'installer') {
    //   return this.pendingListInstaller.filter(x => x.step >= 4 && x.step < 5)
    // }
  }

  filterCompletedList(type) {
    // if (type == 'sales') {
    //   return this.salesList.filter(x => x.step == 5)
    // } else if (type == 'tech') {
    //   return this.salesList.filter(x => x.step == 5)
    // } else if (type == 'tailor') {
    //   return this.tailorList.filter(x => x.step == 5)
    // } else if (type == 'installer') {
    //   return this.salesList.filter(x => x.step == 5)
    // }
    return this.salesList.filter(x => x.step == 5).sort((a, b) => b.no - a.no)

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

  async presentActionSheet(x) {

    let destination = x.customer_address
    console.log(destination);

    //1. Declaring an empty array
    let actionLinks = [];

    //2. Populating the empty array

    //2A. Add Google Maps App
    actionLinks.push({
      text: 'Google Maps App',
      icon: 'navigate',
      handler: () => {
        window.open("https://www.google.com/maps/search/?api=1&query=" + destination)
      }
    })


    //2B. Add Waze App
    actionLinks.push({
      text: 'Waze App',
      icon: 'navigate',
      handler: () => {
        window.open("https://waze.com/ul?q=" + destination + "&navigate=yes&z=6");
      }
    });

    //2C. Add a cancel button, you know, just to close down the action sheet controller if the user can't make up his/her mind
    actionLinks.push({
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        // console.log('Cancel clicked');
      }
    })

    const actionSheet = await this.actionSheetController.create({
      header: 'Navigate',
      buttons: actionLinks
    });
    await actionSheet.present();
  }

}
