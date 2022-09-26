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
  snapURL = ''

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
