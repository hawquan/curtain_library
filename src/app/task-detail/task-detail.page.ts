import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { QuotationSinglePage } from '../quotation-single/quotation-single.page';
import { TaskCreatorPage } from '../task-creator/task-creator.page';
import { TaskDetailCompletedReviewPage } from '../task-detail-completed-review/task-detail-completed-review.page';
import { TaskDetailCompletedPage } from '../task-detail-completed/task-detail-completed.page';
import { TaskDetailReviewPage } from '../task-detail-review/task-detail-review.page';
import { TaskEditorPage } from '../task-editor/task-editor.page';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.page.html',
  styleUrls: ['./task-detail.page.scss'],
})
export class TaskDetailPage implements OnInit {

  constructor(
    private nav: NavController,
    private actroute: ActivatedRoute,
    public modal: ModalController,
    private http: HttpClient,
  ) { }

  Pleat = []
  PleatChoice = ''
  PleatSingle = false
  PleatRipple = false
  PleatDouble = false
  PleatFrench = false
  PleatEyelet = false

  RomanBlinds = false
  RollerBlinds = false
  ZebraBlinds = false
  WoodenBlinds = false
  blindsChoice = ''

  PlainWall = false
  FabricWall = false
  NonWovenWall = false
  PatternWall = false
  VinylWall = false
  WallpaperChoice = ''

  info = []
  img = []
  items = [] as any
  show = null
  sales_id = 0
  user = []
  calc = [] as any

  tracklist = []
  pleatlist = []
  blindlist = []
  fabriclist = []
  fabricCurtain = []
  fabricLining = []
  fabricSheer = []

  ngOnInit() {

    this.actroute.queryParams.subscribe(a => {
      // console.log(a);

      this.info = JSON.parse(a["info"])
      this.sales_id = this.info['no']
      this.user = JSON.parse(a["user"])
    })
    console.log(this.info, this.sales_id, this.user);

    this.http.get('https://curtain.vsnap.my/tracklist').subscribe((s) => {
      this.tracklist = s['data']
      // console.log(this.tracklist)
    })

    this.http.get('https://curtain.vsnap.my/pleatlist').subscribe((s) => {
      this.pleatlist = s['data']
      // console.log(this.pleatlist)
    })

    this.http.get('https://curtain.vsnap.my/blindlist').subscribe((s) => {
      this.blindlist = s['data']
      // console.log(this.blindlist)
    })

    this.http.get('https://curtain.vsnap.my/fabricList').subscribe((s) => {
      this.fabriclist = s['data']
      // console.log(this.fabriclist)

      this.fabricCurtain = this.fabriclist.filter(x => x.type == 'Curtain')
      this.fabricSheer = this.fabriclist.filter(x => x.type == 'Sheer')
      this.fabricLining = this.fabriclist.filter(x => x.type == 'Lining')

      this.refreshList()

    })
  }

  refreshList() {
    this.calc = []
    this.http.post('https://curtain.vsnap.my/getorderlist', { sales_id: this.sales_id }).subscribe(a => {
      this.items = a['data']
      // for (let i = 0; i < this.items.length; i++) {
      //   this.calcPrice(i)
      //   console.log(i);
      // }
      console.log('Refresh List', this.items);
    })
  }

  typeChanged() {
    this.PleatSingle = false
    this.PleatRipple = false
    this.PleatDouble = false
    this.PleatFrench = false
    this.PleatEyelet = false
    this.PleatChoice = ''

    this.RomanBlinds = false
    this.RollerBlinds = false
    this.ZebraBlinds = false
    this.WoodenBlinds = false
    this.blindsChoice = ''

    this.PlainWall = false
    this.FabricWall = false
    this.NonWovenWall = false
    this.PatternWall = false
    this.VinylWall = false
    this.WallpaperChoice = ''
  }

  PleatSelection(x) {
    this.PleatSingle = false
    this.PleatRipple = false
    this.PleatDouble = false
    this.PleatFrench = false
    this.PleatEyelet = false

    if (x == 'Single Pleat') {
      this.PleatSingle = true
      this.PleatChoice = 'Single Pleat'
    } else if (x == 'Ripple Fold') {
      this.PleatRipple = true
      this.PleatChoice = 'Ripple Fold'
    } else if (x == 'Double Pleat') {
      this.PleatDouble = true
      this.PleatChoice = 'Double Pleat'
    } else if (x == 'French Pleat') {
      this.PleatFrench = true
      this.PleatChoice = 'French Pleat'
    } else if (x == 'Eyelet') {
      this.PleatEyelet = true
      this.PleatChoice = 'Eyelet'
    }

  }

  blindsSelection(x) {
    this.RomanBlinds = false
    this.RollerBlinds = false
    this.ZebraBlinds = false
    this.WoodenBlinds = false

    if (x == 'Roman Blinds') {
      this.RomanBlinds = true
      this.blindsChoice = 'Roman Blinds'
    } else if (x == 'Roller Blinds') {
      this.RollerBlinds = true
      this.blindsChoice = 'Roller Blinds'
    } else if (x == 'Zebra Blinds') {
      this.ZebraBlinds = true
      this.blindsChoice = 'Zebra Blinds'
    } else if (x == 'Wooden Blinds') {
      this.WoodenBlinds = true
      this.blindsChoice = 'Wooden Blinds'
    }

  }

  wallpaperSelection(x) {
    this.PlainWall = false
    this.FabricWall = false
    this.NonWovenWall = false
    this.PatternWall = false
    this.VinylWall = false

    if (x == 'Plain') {
      this.PlainWall = true
      this.WallpaperChoice = 'Plain'
    } else if (x == 'Fabric') {
      this.FabricWall = true
      this.WallpaperChoice = 'Fabric'
    } else if (x == 'Non-Woven') {
      this.NonWovenWall = true
      this.WallpaperChoice = 'Non-Woven'
    } else if (x == 'Patterned') {
      this.PatternWall = true
      this.WallpaperChoice = 'Patterned'
    } else if (x == 'Vinyl') {
      this.VinylWall = true
      this.WallpaperChoice = 'Vinyl'
    }

  }

  async addTask() {
    const modal = await this.modal.create({
      cssClass: 'task',
      component: TaskCreatorPage,
      componentProps: {
        sales_no: this.sales_id,
        pleatlist: this.pleatlist,
        blindlist: this.blindlist,
        position: this.user['position'],
        tracklist: this.tracklist,
      }
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log(data)

    if (data == 1) {
      this.refreshList()
    }
  }

  async editTask(x) {

    const modal = await this.modal.create({
      cssClass: 'task',
      component: TaskEditorPage,
      componentProps: {
        item: x,
        sales_no: this.sales_id,
        pleatlist: this.pleatlist,
        blindlist: this.blindlist,
        tracklist: this.tracklist,
      }
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data == 1) {
      // x = data
      this.refreshList()
    }
  }

  async reviewTask(x) {

    const modal = await this.modal.create({
      cssClass: 'task',
      component: TaskDetailReviewPage,
      componentProps: {
        item: x,
        position: this.user['position'],
      }
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data == 1) {
      // x = data
      this.refreshList()
    }
  }

  async reviewTaskCompleted(x) {

    const modal = await this.modal.create({
      cssClass: 'task',
      component: TaskDetailCompletedReviewPage,
      componentProps: {
        item: x,
        position: this.user['position'],
      }
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log(data)

    if (data == 1) {
      // x = data
      this.refreshList()
    }
  }

  async quotationSingle(x) {

    const modal = await this.modal.create({
      cssClass: 'task',
      component: QuotationSinglePage,
      componentProps: {
        item: x,
        sales_id: this.sales_id,
        tracklist: this.tracklist,
        pleatlist: this.pleatlist,
        blindlist: this.blindlist,
      }
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log(data)

    if (data != null) {
      x = data
    }
  }

  deleteTask(x) {
    console.log(x.no);

    Swal.fire({
      title: 'Delete Item',
      text: 'Delete "' + x.location + '" from the list. Are you sure?',
      heightAuto: false,
      icon: 'error',
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete',
      reverseButtons: true,
    }).then((y) => {
      if (y.isConfirmed) {
        this.http.post('https://curtain.vsnap.my/deleteorder', { no: x.no }).subscribe(a => {
          this.refreshList()
        })
        // this.items.splice(x, 1)
      }
    })

  }

  totalPrice() {
    let total = 0
    for (let i = 0; i < this.items.length; i++) {
      total += this.items[i].price
    }
    return total || 0
  }

  proceed() {
    let navExtra: NavigationExtras = {
      queryParams: {
        sales_id: this.sales_id,
        info: JSON.stringify(this.info),
        tracklist: JSON.stringify(this.tracklist),
        pleatlist: JSON.stringify(this.pleatlist),
        blindlist: JSON.stringify(this.blindlist),
      }
    }

    Swal.fire({
      title: 'Calculating Quotation...',
      heightAuto: false,
      icon: 'info',
      showConfirmButton: false,
      showCancelButton: false,
    })

    this.nav.navigateForward(['quotation-overall'], navExtra)
  }

  complete() {
    let pass = false
    console.log(this.items.length);

    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].status_tech == 'Pending') {
        pass = false
        break
      } else {
        pass = true
      }
    }

    if (pass) {

      Swal.fire({
        title: 'Complete Task?',
        text: 'Submit your confirmation of this sales order?',
        heightAuto: false,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Submit',
        reverseButtons: true,
      }).then((y) => {
        if (y.isConfirmed) {
          let pass2 = false
          for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].status_tech == 'Rejected') {
              pass2 = true
              break
            }
          }
          if (pass2) {

            Swal.fire({
              title: 'Rejected Order Detected!',
              text: 'This sales order will be submit back to sales person. Continue submitting?',
              heightAuto: false,
              icon: 'warning',
              showConfirmButton: true,
              showCancelButton: true,
              cancelButtonText: 'Cancel',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, Submit',
              reverseButtons: true,
            }).then((y) => {
              if (y.isConfirmed) {
                let temp = {
                  no: this.sales_id,
                  step: 1,
                  rejected: true,
                }
                // let navExtra: NavigationExtras = {
                //   queryParams: {
                //     items: JSON.stringify(this.items),
                //     sales_no: this.sales_id,
                //   }
                // }
                // this.nav.navigateForward(['quotation-overall'], navExtra)
                this.http.post('https://curtain.vsnap.my/updatesales', temp).subscribe(a => {
                  Swal.fire({
                    title: 'Task Completed Successfully',
                    icon: 'success',
                    heightAuto: false,
                    showConfirmButton: false,
                    showCancelButton: false,
                    timer: 1500,
                  })
                  this.nav.navigateRoot('/tabs/tab1')
                })
              }

            })

          } else {
            let temp = {
              no: this.sales_id,
              step: 3,
            }
            this.http.post('https://curtain.vsnap.my/updatesales', temp).subscribe(a => {
              Swal.fire({
                title: 'Task Completed Successfully',
                icon: 'success',
                heightAuto: false,
                showConfirmButton: false,
                showCancelButton: false,
                timer: 1500,
              })
              this.nav.navigateRoot('/tabs/tab1')
            })
          }
        }

      })

    } else {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      })

      Toast.fire({
        icon: 'error',
        title: 'All orders must be reviewed before proceeding.'
      })
    }

  }

  completeTailor() {
    let pass = false
    console.log(this.items.length);

    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].status_tail != 'Completed') {
        pass = false
        break
      } else {
        pass = true
      }
    }

    if (pass) {

      Swal.fire({
        title: 'Complete Task?',
        text: 'Submit completion of tailoring process?',
        heightAuto: false,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Submit',
        reverseButtons: true,
      }).then((y) => {
        if (y.isConfirmed) {

          let temp = {
            no: this.sales_id,
            date_complete: new Date().getTime(),
            step: 4,
          }
          this.http.post('https://curtain.vsnap.my/updatesales', temp).subscribe(a => {
            Swal.fire({
              title: 'Task Completed!',
              icon: 'success',
              heightAuto: false,
              showConfirmButton: false,
              showCancelButton: false,
              timer: 1500,
            })
            this.nav.navigateRoot('/tabs/tab1')
          })

        }

      })

    } else {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      })

      Toast.fire({
        icon: 'error',
        title: 'All orders must be reviewed before proceeding.'
      })
    }

  }

  completeInstaller() {
    let pass = false
    console.log(this.items.length);

    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].status_inst != 'Completed') {
        pass = false
        break
      } else {
        pass = true
      }
    }

    if (pass) {

      Swal.fire({
        title: 'Complete Task?',
        text: 'Submit completion of installtion process?',
        heightAuto: false,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Submit',
        reverseButtons: true,
      }).then((y) => {
        if (y.isConfirmed) {

          let temp = {
            no: this.sales_id,
            date_complete: new Date().getTime(),
            step: 5,
          }
          this.http.post('https://curtain.vsnap.my/updatesales', temp).subscribe(a => {
            Swal.fire({
              title: 'Task Completed Successfully',
              icon: 'success',
              heightAuto: false,
              showConfirmButton: false,
              showCancelButton: false,
              timer: 1500,
            })
            this.nav.navigateRoot('/tabs/tab1')
          })

        }

      })

    } else {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      })

      Toast.fire({
        icon: 'error',
        title: 'All orders must be reviewed before proceeding.'
      })
    }

  }

  // calcPrice(i) {

  //   let width = 0
  //   let height = 0
  //   if (this.items[i].height_tech != null || this.items[i].width_tech != null) {
  //     width = this.items[i].width_tech
  //     height = this.items[i].height_tech
  //   } else {
  //     width = this.items[i].width
  //     height = this.items[i].height
  //   }

  //   let curtain = false
  //   let curtain_id
  //   let lining = false
  //   let lining_id
  //   let sheer = false
  //   let sheer_id
  //   let track = false
  //   let track_id

  //   let pleat_id

  //   this.http.get('https://curtain.vsnap.my/fabricList').subscribe((s) => {
  //     let temp = s['data']

  //     this.fabricCurtain = temp.filter(x => x.type == 'Curtain')
  //     this.fabricSheer = temp.filter(x => x.type == 'Sheer')
  //     this.fabricLining = temp.filter(x => x.type == 'Lining')

  //     console.log(this.fabricCurtain, this.fabricSheer, this.fabricLining)
  //   })

  //   console.log(this.items[i]);


  //   if (this.items[i].curtain != 'Blinds') {

  //     if (this.items[i].fabric != null && this.items[i].fabric != 'NA') {
  //       curtain = true
  //       curtain_id = this.fabricCurtain.filter(x => x.name == this.items[i].fabric)[0]['id']
  //     } else {
  //       curtain = false
  //     }

  //     if (this.items[i].fabric_lining != null && this.items[i].fabric_lining != 'NA') {
  //       lining = true
  //       lining_id = this.fabricLining.filter(x => x.name == this.items[i].fabric_lining)[0]['id']
  //     } else {
  //       lining = false
  //     }

  //     if (this.items[i].fabric_sheer != null && this.items[i].fabric_sheer != 'NA') {
  //       sheer = true
  //       sheer_id = this.fabricSheer.filter(x => x.name == this.items[i].fabric_sheer)[0]['id']
  //     } else {
  //       sheer = false
  //     }

  //     if (this.items[i].track != null && this.items[i].track != 'NA') {
  //       track = true
  //       track_id = this.tracklist.filter(x => x.name == this.items[i].track)[0]['id']
  //     } else {
  //       track = false
  //     }

  //     if (this.items[i].pleat != null && this.items[i].pleat != '') {
  //       pleat_id = this.pleatlist.filter(x => x.name == this.items[i].pleat)[0]['id']
  //     }

  //     console.log(curtain_id, sheer_id, track_id, pleat_id);

  //   } else {
  //     curtain = false
  //     sheer = false
  //     track = false
  //     lining = false

  //     pleat_id = this.pleatlist.filter(x => x.name == this.items[i].pleat)[0]['id']
  //   }

  //   let temp = {
  //     width: width, height: height, curtain: curtain, lining: lining, lining_id: lining_id,
  //     curtain_id: curtain_id, sheer: sheer, sheer_id: sheer_id, track: track, track_id: track_id, pleat_id: pleat_id
  //   }

  //   console.log(temp);

  //   this.http.post('https://curtain.vsnap.my/calcPrice', temp).subscribe(a => {

  //     this.calc.push(a['data'])
  //     console.log(this.calc);
  //   })

  // }

  back() {
    this.nav.pop()
  }

}
