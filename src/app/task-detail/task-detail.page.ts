import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { SafariViewController } from '@awesome-cordova-plugins/safari-view-controller/ngx';
import { ActionSheetController, AlertController, ModalController, NavController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { QuotationSinglePage } from '../quotation-single/quotation-single.page';
import { TaskCreatorPage } from '../task-creator/task-creator.page';
import { TaskDetailCompletedReviewPage } from '../task-detail-completed-review/task-detail-completed-review.page';
import { TaskDetailCompletedPage } from '../task-detail-completed/task-detail-completed.page';
import { TaskDetailReviewPage } from '../task-detail-review/task-detail-review.page';
import { TaskEditorPage } from '../task-editor/task-editor.page';
import { TaskCreatorAlacartePage } from '../task-creator-alacarte/task-creator-alacarte.page';
import { TaskEditorAlacartePage } from '../task-editor-alacarte/task-editor-alacarte.page';
import { TaskOngoingViewDetailsPage } from '../task-ongoing-view-details/task-ongoing-view-details.page';
import { TaskOngoingViewAlacartePage } from '../task-ongoing-view-alacarte/task-ongoing-view-alacarte.page';

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
    private actionSheetController: ActionSheetController,
    private safariViewController: SafariViewController,
    private alertController: AlertController
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

  info = [] as any
  img = []
  items = [] as any
  show = null
  sales_id = 0
  user = []
  calc = [] as any
  isEdit = false

  tracklist = []
  pleatlist = []
  blindlist = []
  fabriclist = []
  fabricCurtain = []
  fabricLining = []
  fabricSheer = []
  blindTape = []
  fabricBlind = []

  keywordPro = ''
  showSelection = false
  propertyList = ['Apartment', 'Bungalow', 'Condominium', 'Semi-D', 'Terrace', 'Others']

  price: any = 0
  count = 0

  role
  checklist = {} as any
  checktype = 'in'

  ngOnInit() {

    this.actroute.queryParams.subscribe(a => {
      // console.log(a);

      this.sales_id = JSON.parse(a["no"])
      this.user = JSON.parse(a["user"])
      this.role = a['role']
      console.log(this.sales_id, this.user);

      this.http.post('https://curtain.vsnap.my/getlatestcheckin', { sales_id: this.sales_id }).subscribe(a => {

        this.checklist = a['data']
        console.log(this.checklist);

        if (this.checklist) {
          if (this.checklist.check_type == 'in') {
            this.checktype = 'out'
          } else {
            this.checktype = 'in'
          }
        } else {
          this.checktype = 'in'
        }

      })

    })

    this.http.get('https://curtain.vsnap.my/tracklist').subscribe((s) => {
      this.tracklist = s['data']
      // console.log(this.tracklist)
    })

    this.http.get('https://curtain.vsnap.my/pleatlist').subscribe((s) => {
      this.pleatlist = s['data']
      // console.log(this.pleatlist)
    })

    this.http.get('https://curtain.vsnap.my/blindlist').subscribe((s) => {
      this.blindlist = s['data'].filter(a => a.status)
      // console.log(this.blindlist)
    })

    this.http.get('https://curtain.vsnap.my/tapeList').subscribe(a => {
      this.blindTape = a['data']
      console.log(this.blindTape);
    })

    this.http.get('https://curtain.vsnap.my/fabricList').subscribe((s) => {
      this.fabriclist = s['data']
      // console.log(this.fabriclist)

      this.fabricCurtain = this.fabriclist.filter(x => x.type == 'Curtain')
      this.fabricSheer = this.fabriclist.filter(x => x.type == 'Sheer')
      this.fabricLining = this.fabriclist.filter(x => x.type == 'Lining')
      this.fabricBlind = this.fabriclist.filter(x => x.type == 'Blind').sort((a, b) => (a['type_category'] > b['type_category'] ? 1 : -1) && (a['name'] > b['name'] ? 1 : -1) && (a['id'] > b['id'] ? 1 : -1))

      this.refreshList()

    })

  }

  refreshList() {
    this.calc = []
    this.http.post('https://curtain.vsnap.my/getonesales', { no: this.sales_id }).subscribe(a => {
      this.info = a['data'][0]

      this.keywordPro = this.info.customer_property ? this.info.customer_property : ''
      console.log(this.info);
    })

    this.http.post('https://curtain.vsnap.my/getorderlist', { sales_id: this.sales_id }).subscribe(a => {
      this.items = a['data'].sort((a, b) => {
        // First, sort by location alphabetically, with null/empty locations at the end
        if (!a.location) return 1; // Move null/undefined/empty location to the end
        if (!b.location) return -1; // Move null/undefined/empty location to the end
        if (a.location !== b.location) {
          return a.location.localeCompare(b.location); // Sort by location alphabetically
        }

        // If locations are the same, sort by location_ref within the same location
        const locationRefA = a.location_ref || ''; // Default to empty string if null/undefined
        const locationRefB = b.location_ref || ''; // Default to empty string if null/undefined
        return locationRefA.localeCompare(locationRefB);
      });      // for (let i = 0; i < this.items.length; i++) {
      //   this.calcPrice(i)
      //   console.log(i);
      // }
      console.log('Refresh List', this.items);
    })
  }

  condis(x) {
    if (x) {
      if (((x || '').toString()).substring(0, 1) == '+') {
        return x.substring(1, x.length)
      } else if (((x || '').toString()).substring(0, 1) == '6') {
        return x
      } else if (((x || '').toString()).substring(0, 1) == '0') {
        return '6' + x
      } else {
        return '60' + x
      }
    }
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
    } else if (x == 'Fake Double Pleat') {
      this.PleatDouble = true
      this.PleatChoice = 'Fake Double Pleat'
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
        // pleatlist: this.pleatlist,
        // blindlist: this.blindlist,
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

  async selectALaCarte() {
    const alert = await this.alertController.create({
      header: 'À La Carte',
      cssClass: 'alacarte-alert',
      inputs: [
        {
          name: 'Fabrics',
          type: 'radio',
          label: 'Fabrics',
          value: '1',
        },
        {
          name: 'Track',
          type: 'radio',
          label: 'Track',
          value: '2',
        },
        {
          name: 'Supply Accessories Only',
          type: 'radio',
          label: 'Supply Accessories Only',
          value: '3',
        },
        {
          name: 'Supply & Install Motor Track',
          type: 'radio',
          label: 'Supply & Install Motor Track',
          value: '4',
        },
        {
          name: 'Sewing Only',
          type: 'radio',
          label: 'Sewing Only',
          value: '5',
        },
        {
          name: 'Supply Wallpaper',
          type: 'radio',
          label: 'Wallpaper Only',
          value: '6',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Canceled');
          },
        },
        {
          text: 'OK',
          handler: (x) => {
            // Now, you can pass the selected fruits to your modal
            if (x) {
              this.aLaCarte(x)
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async aLaCarte(x) {

    const modal = await this.modal.create({
      cssClass: 'task',
      component: TaskCreatorAlacartePage,
      componentProps: {
        sales_no: this.sales_id,
        // pleatlist: this.pleatlist,
        // blindlist: this.blindlist,
        type: x,
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

  async editTask(x, y) {
    if (x.type == 'Tailor-Made Curtains' || x.type == 'Blinds') {

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
      // x = data
      this.refreshList()

    } else {

      const modal = await this.modal.create({
        cssClass: 'task',
        component: TaskEditorAlacartePage,
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
      // x = data
      this.refreshList()

    }

  }

  checkTailorAction(x) {
    if (this.info.log_action == 'Completed') {
      this.reviewTaskCompleted(x)
    } else if (this.info.log_action == 'Order Accepted') {
      this.reviewTask(x)
    } else if (this.info.log_action != 'Order Accepted') {
      this.reviewTailor(x)
    }
  }

  checkInstallerAction(x) {
    if (this.info.log_action2 == 'Completed') {
      this.reviewTaskCompleted(x)
    } else if (this.info.log_action2 == 'Order Accepted') {
      this.reviewTask(x)
    } else if (this.info.log_action2 != 'Order Accepted') {
      this.reviewTailor(x)
    }
  }

  async reviewTailor(x) {
    if (x.type == 'Tailor-Made Curtains' || x.type == 'Blinds') {
      const modal = await this.modal.create({
        cssClass: 'task',
        component: TaskOngoingViewDetailsPage,
        componentProps: {
          item: x,
          sales_no: this.sales_id,
          pleatlist: this.pleatlist,
          blindlist: this.blindlist,
          position: this.user['position'],
        }
      });

      await modal.present();
      const { data } = await modal.onWillDismiss();
      console.log(data)

      if (data != null) {
        // x = data
        this.refreshList()
      }
    } else {

      const modal = await this.modal.create({
        cssClass: 'task',
        component: TaskOngoingViewAlacartePage,
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
      // x = data
      this.refreshList()

    }
  }

  async reviewTask(x) {

    // if (this.checktype == 'in') {
    //   const Toast = Swal.mixin({
    //     toast: true,
    //     position: 'top',
    //     showConfirmButton: false,
    //     timer: 3000,
    //     timerProgressBar: true,
    //   })

    //   Toast.fire({
    //     icon: 'error',
    //     title: 'Please Check-In before you proceed to review task.'
    //   })
    // } else {
      const modal = await this.modal.create({
        cssClass: 'task',
        component: TaskDetailReviewPage,
        componentProps: {
          item: x,
          position: this.user['position'],
          blindlist: this.blindlist,
          tracklist: this.tracklist,
          role: this.user['position'] == 'Technician' ? this.role : ''
        }
      });

      await modal.present();
      const { data } = await modal.onWillDismiss();
      if (data == 1) {
        // x = data
        this.refreshList()
      }
    // }

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
        // info: JSON.stringify(this.info),
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
      if (this.items[i].status_tech == 'Pending' && (this.items[i].type == 'Tailor-Made Curtains' || this.items[i].type == 'Blinds')) {
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
                  been_rejected: true,
                }
                // let navExtra: NavigationExtras = {
                //   queryParams: {
                //     items: JSON.stringify(this.items),
                //     sales_no: this.sales_id,
                //   }
                // }
                // this.nav.navigateForward(['quotation-overall'], navExtra)
                this.http.post('https://curtain.vsnap.my/updatesales', temp).subscribe(a => {

                  let body2 = {
                    title: "Site Revisit Needed",
                    body: "Measurement of " + this.info['customer_name'] + "'s order adjusted beyond scope of acceptance.",
                    path: 'tabs/tab1',
                    topic: this.info['id_sales'],
                  }
                  this.http.post('https://curtain.vsnap.my/fcmAny', body2).subscribe(data2 => {
                    console.log(data2);
                  }, e => {
                    console.log(e);
                  });

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

  downloadSO() {
    console.log(this.info.so_pdf[this.info.so_pdf.length - 1]);

    this.safariViewController.isAvailable()
      .then(async (available: boolean) => {
        if (available) {

          this.safariViewController.show({
            url: this.info.so_pdf[this.info.so_pdf.length - 1].link,
          })
            .subscribe((result: any) => {
              if (result.event === 'opened') console.log('Opened');
              else if (result.event === 'loaded') console.log('Loaded');
              else if (result.event === 'closed') console.log('Closed');
            },
              (error: any) => console.error(error)
            );

        } else {
          window.open(this.info.so_pdf[this.info.so_pdf.length - 1].link, '_system');
          // use fallback browser, example InAppBrowser
        }
      }).catch(async (error) => {
        window.open(this.info.so_pdf[this.info.so_pdf.length - 1].link, '_system');
      })
  }

  completeTailor() {
    let pass = false
    console.log(this.items.length);

    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].tailor_status_no != '1') {
        pass = false
        break
      } else {
        pass = true
      }
    }

    if (pass) {

      Swal.fire({
        title: 'Complete Order?',
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

  async presentActionSheet() {

    let destination = this.info['customer_address'].replaceAll(' ', '%')
    console.log(destination);

    //1. Declaring an empty array
    let actionLinks = [];

    //2. Populating the empty array

    //2A. Add Google Maps App
    actionLinks.push({
      text: 'Google Maps App',
      icon: 'navigate',
      handler: () => {
        // window.open("https://www.google.com/maps/search/?api=1&query=" + destination)
        this.safariViewController.isAvailable()
          .then(async (available: boolean) => {
            if (available) {

              this.safariViewController.show({
                url: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(destination),
              })
                .subscribe((result: any) => {
                  if (result.event === 'opened') console.log('Opened');
                  else if (result.event === 'loaded') console.log('Loaded');
                  else if (result.event === 'closed') console.log('Closed');
                },
                  (error: any) => console.error(error)
                );

            } else {
              window.open("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(destination), '_system');
              // use fallback browser, example InAppBrowser
            }
          }).catch(async (error) => {
            window.open("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(destination), '_system');
          })
      }
    })


    //2B. Add Waze App
    actionLinks.push({
      text: 'Waze App',
      icon: 'navigate',
      handler: () => {
        // window.open("https://waze.com/ul?q=" + destination + "&navigate=yes&z=6");
        this.safariViewController.isAvailable()
          .then(async (available: boolean) => {
            if (available) {

              this.safariViewController.show({
                url: "https://waze.com/ul?q=" + encodeURIComponent(destination) + "&navigate=yes&z=6",
              })
                .subscribe((result: any) => {
                  if (result.event === 'opened') console.log('Opened');
                  else if (result.event === 'loaded') console.log('Loaded');
                  else if (result.event === 'closed') console.log('Closed');
                },
                  (error: any) => console.error(error)
                );

            } else {
              window.open("https://waze.com/ul?q=" + encodeURIComponent(destination) + "&navigate=yes&z=6", '_system');
              // use fallback browser, example InAppBrowser
            }
          }).catch(async (error) => {
            window.open("https://waze.com/ul?q=" + encodeURIComponent(destination) + "&navigate=yes&z=6", '_system');
          })
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

  emailValidator(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email) {
      return re.test(String(email).toLowerCase());
    }
  }

  focus(x) {
    if (x) {
      this.showSelection = true
    } else {
      setTimeout(() => {
        this.showSelection = false
      }, 250);
    }
  }

  selectedArea(x) {
    this.keywordPro = x
    this.info.customer_property = this.keywordPro
  }

  filtererPro(x) {
    return x ? x.filter(a => (((a || '')).toLowerCase()).includes(this.keywordPro.toLowerCase())) : []
  }

  isEditSave() {
    let temp = {}

    temp = {
      no: this.info.no,
      customer_address: this.info.customer_address,
      customer_email: this.info.customer_email,
      customer_name: this.info.customer_name,
      customer_phone: this.condis(this.info.customer_phone),
      customer_property: this.keywordPro,
    }

    console.log(temp);

    if (!this.info['customer_name']) {

      Swal.fire({
        icon: 'error',
        title: 'Missing Info',
        text: 'Customer name is missing',
        heightAuto: false,
        timer: 3000,
      })

    }
    // else if (!this.info['customer_email']) {

    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Error',
    //     text: 'Customer email is missing',
    //     timer: 3000,
    //     heightAuto: false,

    //   })

    // }
    //  else if (!this.emailValidator(this.info.customer_email)) {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Error',
    //     text: 'Email is invalid',
    //     timer: 3000,
    //     heightAuto: false,
    //   })
    // }
    else if (!this.info['customer_phone']) {

      Swal.fire({
        icon: 'error',
        title: 'Missing Info',
        text: 'Customer phone is missing',
        timer: 3000,
        heightAuto: false,

      })

    } else if (!this.info['customer_property']) {

      Swal.fire({
        icon: 'error',
        title: 'Missing Info',
        text: 'Customer property type is missing',
        timer: 3000,
        heightAuto: false,
      })

    } else if (!this.info['customer_address']) {

      Swal.fire({
        icon: 'error',
        title: 'Missing Info',
        text: 'Customer address is missing',
        timer: 3000,
        heightAuto: false,

      })

    } else {

      Swal.fire({
        title: 'Update Details',
        text: `Are you sure to update customer's details?`,
        heightAuto: false,
        icon: 'success',
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Update',
        reverseButtons: true,
      }).then((y) => {
        if (y.isConfirmed) {
          this.http.post('https://curtain.vsnap.my/updatesales', temp).subscribe(a => {

            Swal.fire({
              title: 'Details Updated',
              icon: 'success',
              heightAuto: false,
              showConfirmButton: false,
              showCancelButton: false,
              timer: 2000,
            })

            this.isEdit = false
          })
        } else {

        }
      })
    }
  }

  changeStatus(x) {

    if (x == 'active') {
      let temp = {
        no: this.sales_id,
        status: true,
      }

      Swal.fire({
        title: 'Activate Sales?',
        text: 'Are you sure to activate back this sales?',
        heightAuto: false,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Activate',
        reverseButtons: true,
      }).then((y) => {

        if (y.isConfirmed) {

          this.http.post('https://curtain.vsnap.my/updatesales', temp).subscribe(a => {

            Swal.fire({
              title: 'Sales Status Updated',
              icon: 'success',
              heightAuto: false,
              showConfirmButton: false,
              showCancelButton: false,
              timer: 2000,
            })

            this.nav.pop()

          })

        }

      })
    } else if (x == 'delete') {

      let temp = {
        no: this.sales_id,
        status: false,
      }

      Swal.fire({
        title: 'Void Sales?',
        text: 'Are you sure to void this sales? (Can trace back at "Voided Sales" tab.)',
        heightAuto: false,
        icon: 'warning',
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Void it',
        reverseButtons: true,
      }).then((y) => {

        if (y.isConfirmed) {

          this.http.post('https://curtain.vsnap.my/updatesales', temp).subscribe(a => {

            Swal.fire({
              title: 'Sales Status Updated',
              icon: 'success',
              heightAuto: false,
              showConfirmButton: false,
              showCancelButton: false,
              timer: 2000,
            })

            this.nav.pop()

          })

        }

      })

    }
  }

  updateAll() {
    Swal.fire({
      title: 'Update All Order',
      text: 'Are you sure to update all order to latest price?',
      heightAuto: false,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update',
      reverseButtons: true,
    }).then((y) => {

      if (y.isConfirmed) {


        Swal.fire({
          title: 'Calculating Quotation...',
          heightAuto: false,
          icon: 'info',
          showConfirmButton: false,
          showCancelButton: false,
        })

        this.updateFinish()

      }

    })

  }

  updateFinish() {
    let i = this.count
    if (this.items[i]['type'] == 'Tailor-Made Curtains' || this.items[i]['type'] == 'Blinds') {


      console.log(this.items[i]);

      let curtain = false
      let curtain_id
      let lining = false
      let lining_id
      let sheer = false
      let sheer_id
      let track = false
      let track_id
      let track_sheer = false
      let track_sheer_id
      let blind = false
      let blind_id
      let pleat_id
      let pleat_sheer_id
      let belt_hook = false
      let isRomanBlind = false
      let tape = false
      let tape_id

      this.items[i].eyelet_curtain = this.items[i].pleat && (this.items[i].fabric_type == 'C' || this.items[i].fabric_type == 'CS') ? this.items[i].pleat.includes('Eyelet') : false
      this.items[i].eyelet_sheer = this.items[i].pleat_sheer && (this.items[i].fabric_type == 'S' || this.items[i].fabric_type == 'CS') ? this.items[i].pleat_sheer.includes('Eyelet') : false

      if (this.items[i].motorized_upgrade) {
        if (!this.items[i].motorized_choice || !this.items[i].motorized_cost || !this.items[i].motorized_power || !this.items[i].motorized_sides || !this.items[i].motorized_pieces) {
          // this.items[i].motorized_upgrade = false
          // console.log('upgrade false');

          Swal.fire({
            title: 'Motorised Not Completed',
            text: "Please select all required motorise upgrade before continuing or un-tick it",
            heightAuto: false,
            icon: 'error',
            allowOutsideClick: false,
            showConfirmButton: true,
            showCancelButton: false,
          })

          return
        }
      }

      if (this.items[i].type != 'Blinds') {

        if (this.items[i].fabric != null) {
          if (this.items[i].fabric_type == 'C' || this.items[i].fabric_type == 'CS') {
            curtain = true
            try {
              curtain_id = this.fabricCurtain.filter(x => x.name == this.items[i].fabric)[0]['id']
            } catch (error) {
              this.calcErrorMsg('Fabric', "curtain's fabric")
              return
            }
          } else {
            curtain = false
          }
        } else {
          curtain = false
        }

        if (this.items[i].fabric_lining != null) {
          if (this.items[i].fabric_type == 'C' || this.items[i].fabric_type == 'CS') {
            lining = true
            try {
              lining_id = this.fabricLining.filter(x => x.name == this.items[i].fabric_lining)[0]['id']
            } catch (error) {
              this.calcErrorMsg('Lining', "lining's fabric")
              return
            }
          } else {
            lining = false
          }
        } else {
          lining = false
        }

        if (this.items[i].fabric_sheer != null) {
          if (this.items[i].fabric_type == 'S' || this.items[i].fabric_type == 'CS') {
            sheer = true
            try {
              sheer_id = this.fabricSheer.filter(x => x.name == this.items[i].fabric_sheer)[0]['id']
            } catch (error) {
              this.calcErrorMsg('Sheer', "sheer's fabric")
              return
            }
          } else {
            sheer = false
          }
        } else {
          sheer = false
        }

        if (this.items[i].track != null) {
          if (this.items[i].fabric_type == 'C' || this.items[i].fabric_type == 'CS') {
            track = true
            try {
              track_id = this.tracklist.filter(x => x.name == this.items[i].track)[0]['id']
            } catch (error) {
              this.calcErrorMsg('Track', "track")
              return
            }
          } else {
            track = false
          }
        } else {
          track = false
        }

        if (this.items[i].track_sheer != null) {
          if (this.items[i].fabric_type == 'S' || this.items[i].fabric_type == 'CS') {
            track_sheer = true
            try {
              track_sheer_id = this.tracklist.filter(x => x.name == this.items[i].track_sheer)[0]['id']
            } catch (error) {
              this.calcErrorMsg("Sheer's Track", "sheer's track")
              return
            }
          } else {
            track_sheer = false
          }
        } else {
          track_sheer = false
        }

        if (this.items[i].pleat != null && this.items[i].pleat != '') {
          try {
            pleat_id = this.pleatlist.filter(x => x.name == this.items[i].pleat)[0]['id']
          } catch (error) {
            this.calcErrorMsg("Pleat", "pleat")
            return
          }
        }

        if (this.items[i].pleat_sheer != null && this.items[i].pleat_sheer != '') {
          try {
            pleat_sheer_id = this.pleatlist.filter(x => x.name == this.items[i].pleat_sheer)[0]['id']
          } catch (error) {
            this.calcErrorMsg("Sheer's Pleat", "sheer's pleat")
            return
          }
        }

        if ((this.items[i].sidehook == 'Yes' && (this.items[i].belt != 'No' || this.items[i].belt)) || (this.items[i].sheer_sidehook == 'Yes' && (this.items[i].sheer_belt != 'No' || this.items[i].sheer_belt))) {
          belt_hook = true
        }

        console.log(curtain_id, sheer_id, track_id, pleat_id, pleat_sheer_id);

      } else {
        if (this.items[i].pleat == 'Roman Blind') {
          // curtain = true
          sheer = false
          track = false
          track_sheer = false
          // lining = false
          blind = true
          isRomanBlind = true
          belt_hook = false
          console.log('blindcurtain');

          if (this.items[i].fabric_blind != null) {
            blind = true
            try {
              blind_id = this.fabricBlind.filter(x => x.name == this.items[i].fabric_blind)[0]['id']
            } catch (error) {
              this.calcErrorMsg('Blind', "blind's fabric")
              return
            }
          }

          // if (this.items[i].fabric != null) {
          //   curtain = true
          //   try {
          //     curtain_id = this.fabricCurtain.filter(x => x.name == this.items[i].fabric)[0]['id']
          //   } catch (error) {
          //     this.calcErrorMsg('Fabric', "curtain's fabric")
          //     return
          //   }
          // } else {
          //   curtain = false
          // }
          if (this.items[i].fabric != null) {
            curtain = true
            try {
              if (this.fabricCurtain.filter(x => x.name == this.items[i].fabric)[0]) {
                curtain_id = this.fabricCurtain.filter(x => x.name == this.items[i].fabric)[0]['id']
              } else {
                curtain_id = this.fabricSheer.filter(x => x.name == this.items[i].fabric)[0]['id']
              }
            } catch (error) {
              this.calcErrorMsg('Fabric', "curtain's fabric")
              return
            }
          } else {
            curtain = false
          }

          if (this.items[i].fabric_lining != null) {
            lining = true
            try {
              lining_id = this.fabricLining.filter(x => x.name == this.items[i].fabric_lining)[0]['id']
            } catch (error) {
              this.calcErrorMsg('Lining', "lining's fabric")
              return
            }
          } else {
            lining = false
          }

        } else {
          curtain = false
          sheer = false
          track = false
          track_sheer = false
          lining = false
          belt_hook = false
          isRomanBlind = false
          blind = true
          console.log('blind');

          if (this.items[i].fabric_blind != null && this.items[i].fabric_blind != '') {
            try {
              blind_id = this.fabricBlind.filter(x => x.name == this.items[i].fabric_blind)[0]['id']
            } catch (error) {
              this.calcErrorMsg('Blind', "blind's fabric")
              return
            }
          }

          if (this.items[i].pleat == 'Wooden Blind' || this.items[i].pleat == 'Venetian Blinds') {
            if (this.items[i].blind_tape) {
              tape = true
              try {
                tape_id = (this.blindTape.filter(x => x.name == this.items[i].blind_tape))[0]['id']
              } catch (error) {
                this.calcErrorMsg('Tape', "blind's tape")
                return
              }
            }
          }
        }
        // if (this.items[i].pleat != null && this.items[i].pleat != '') {
        //   pleat_id = this.blindlist.filter(x => x.name == this.items[i].pleat)[0]['id']
        // }
      }

      if (this.items[i].height > 180) {
        this.items[i].need_scaftfolding = true
        console.log('yes');

      } else if (this.items[i].height >= 156 && this.items[i].height <= 180) {
        this.items[i].need_ladder = true
      } else {
        this.items[i].need_scaftfolding = false
        this.items[i].need_ladder = false
        console.log('no');

      }

      let temp = {
        width: parseFloat(this.items[i].width), height: parseFloat(this.items[i].height), curtain: curtain, lining: lining, lining_id: lining_id,
        curtain_id: curtain_id, sheer: sheer, sheer_id: sheer_id, track: track, track_id: track_id, track_sheer: track_sheer, track_sheer_id: track_sheer_id, pleat_id: pleat_id, pleat_sheer_id: pleat_sheer_id, blind: blind, blind_id: blind_id,
        pieces_curtain: this.items[i].pieces_curtain || 0, pieces_sheer: this.items[i].pieces_sheer || 0, pieces_blind: this.items[i].pieces_blind || 0,
        promo_curtain: this.items[i].promo_curtain || 0, promo_lining: this.items[i].promo_lining || 0, promo_sheer: this.items[i].promo_sheer || 0, promo_blind: this.items[i].promo_blind || 0,
        motorized: this.items[i].motorized_upgrade, motorized_cost: this.items[i].motorized_cost, motorized_power: this.items[i].motorized_power, motorized_choice: this.items[i].motorized_choice, motorized_pieces: this.items[i].motorized_pieces, motorized_lift: this.items[i].motorized_lift,
        belt_hook: belt_hook, isRomanBlind: isRomanBlind, tape: tape, tape_id: tape_id, blind_spring: this.items[i].blind_spring, blind_tube: this.items[i].blind_tube, blind_easylift: this.items[i].blind_easylift, blind_monosys: this.items[i].blind_monosys,
        eyelet_curtain: this.items[i].eyelet_curtain, eyelet_sheer: this.items[i].eyelet_sheer
      }

      console.log(temp);

      this.http.post('https://curtain.vsnap.my/calcPrice', temp).subscribe(a => {

        console.log(a);

        if (this.items[i].type == 'Blinds') {
          this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + a['data']['install']['climbing_price']
          // this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + a['data']['install']['ladder_price'] + a['data']['install']['scaftfolding_price']
        } else {
          if (this.items[i].motorized_upgrade) {
            this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + a['data']['install']['belt_hook'] + a['data']['motorized']['install'] + a['data']['motorized']['lift'] + a['data']['install']['climbing_price']
            // this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + a['data']['install']['belt_hook'] + a['data']['motorized']['install'] + a['data']['motorized']['lift'] + a['data']['install']['ladder_price'] + a['data']['install']['scaftfolding_price']
            if (this.items[i].eyelet_curtain) {
              this.price += a['data']['curtain']['eyelet_curtain']
            }
            if (this.items[i].eyelet_sheer) {
              this.price += a['data']['sheer']['eyelet_sheer']
            }
          } else {
            // this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + a['data']['install']['belt_hook'] + a['data']['install']['ladder_price'] + a['data']['install']['scaftfolding_price']
            this.price = <any>Object.values(a['data'] || []).reduce((x: number, y: number) => (x + (y['total'] || 0)), 0) + a['data']['install']['belt_hook'] + a['data']['install']['climbing_price']
            if (this.items[i].eyelet_curtain) {
              this.price += a['data']['curtain']['eyelet_curtain']
            }
            if (this.items[i].eyelet_sheer) {
              this.price += a['data']['sheer']['eyelet_sheer']
            }
          }

        }

        this.items[i].price = this.price

        this.updateItem()


      })

    } else {

      if (this.count == (this.items.length - 1)) {
        Swal.fire({
          title: 'Update Completed',
          heightAuto: false,
          icon: 'info',
          showCancelButton: false,
          timer: 3000
        })
        this.count = 0
      } else {
        this.count++
        this.updateFinish()
      }

    }

  }

  updateItem() {

    let i = this.count

    // if (this.items[i].fabric_type == 'C' || this.items[i].fabric_type == 'CS') {
    //   this.items[i].hook = null
    //   this.items[i].custom_hook = null

    //   if (this.items[i].motorized_upgrade && this.items[i].pleat == 'Fake Double Pleat') {
    //     this.items[i].hook = '104'

    //     if (this.items[i].fabric_type == 'CS') {
    //       this.items[i].sheer_hook = '104'
    //     }

    //   } else if (this.items[i].track) {
    //     if (this.items[i].track == 'Super Track' || this.items[i].track == 'Curve' || this.items[i].track.includes('Existing Super Track') || this.items[i].track.includes('Existing Curve')) {
    //       this.items[i].hook = this.items[i].bracket == 'Wall' ? '101' : this.items[i].bracket == 'Ceiling' ? '101' : this.items[i].bracket == 'Ceiling Pelmet' ? '104' : null

    //       if (this.items[i].fabric_type == 'CS') {
    //         this.items[i].sheer_hook = '101'
    //       }

    //     } else if (this.items[i].track == 'Wooden Rod' || this.items[i].track.includes('Wooden Rod') || this.items[i].track.includes('Cubicle')) {
    //       this.items[i].hook = '104'

    //       if (this.items[i].fabric_type == 'CS') {
    //         this.items[i].sheer_hook = '104'
    //       }

    //     }
    //   }

    // }

    // if (this.items[i].fabric_type == 'S' || this.items[i].fabric_type == 'CS') {
    //   this.items[i].sheer_hook = null
    //   this.items[i].custom_sheer_hook = null

    //   if (this.items[i].motorized_upgrade && this.items[i].pleat_sheer == 'Fake Double Pleat') {
    //     this.items[i].sheer_hook = '104'
    //   } else if (this.items[i].track_sheer) {
    //     if (this.items[i].track_sheer == 'Super Track' || this.items[i].track_sheer == 'Curve' || this.items[i].track_sheer.includes('Existing Super Track') || this.items[i].track_sheer.includes('Existing Curve')) {
    //       this.items[i].sheer_hook = this.items[i].sheer_bracket == 'Wall' ? '101' : this.items[i].sheer_bracket == 'Ceiling' ? '101' : this.items[i].sheer_bracket == 'Ceiling Pelmet' ? '104' : null

    //       if (this.items[i].fabric_type == 'CS') {
    //         this.items[i].sheer_hook = '104'
    //       }

    //     } else if (this.items[i].track_sheer == 'Wooden Rod' || this.items[i].track_sheer.includes('Wooden Rod') || this.items[i].track_sheer.includes('Cubicle')) {
    //       this.items[i].sheer_hook = '104'
    //     }
    //   }
    // }

    if (this.items[i]['type'] == 'Tailor-Made Curtains' || this.items[i]['type'] == 'Motorised Curtains') {

      if (this.items[i].pleat == 'Eyelet Design' || this.items[i].pleat == 'Ripplefold' || this.items[i].pleat == 'Fake Double Pleat') {
        console.log('C1');

        if (this.items[i].fabric_type == 'C') {

          if (['location', 'location_ref', 'width', 'height', 'type', 'pleat', 'pieces_curtain', 'bracket', 'sidehook', 'belt', 'touchfloor', 'fabric'].every(a => this.items[i][a])) {

            let temp = {
              no: this.items[i].no,
              sales_id: this.items[i].sales_id,
              location: this.items[i].location,
              location_ref: this.items[i].location_ref,
              height: this.items[i].height,
              width: this.items[i].width,
              track: this.items[i].track,
              type: this.items[i].type,
              pleat: this.items[i].pleat,
              pleat_sheer: null,
              fullness: this.items[i].fullness,
              eyelet_curtain: this.items[i].eyelet_curtain,
              eyelet_sheer: this.items[i].eyelet_sheer,
              pieces_curtain: this.items[i].pieces_curtain,
              bracket: this.items[i].bracket,
              hook: this.items[i].hook,
              sidehook: this.items[i].sidehook,
              belt: this.items[i].belt,
              touchfloor: this.items[i].touchfloor,
              fabric: this.items[i].fabric,
              fabric_sheer: null,
              fabric_lining: this.items[i].fabric_lining,
              code_lining: this.items[i].code_lining,
              code_curtain: this.items[i].code_curtain,
              fabric_type: this.items[i].fabric_type,
              custom_bracket: this.items[i].custom_bracket,
              custom_belt: this.items[i].custom_belt,
              price: this.price,
              status: true,
              photos: JSON.stringify(this.items[i].photos),
              remark_sale: this.items[i].remark_sale,
              remark_curtain: this.items[i].remark_curtain,
              status_sale: 'Completed',
              status_tech: 'Pending',
              need_ladder: this.items[i].need_ladder,
              need_scaftfolding: this.items[i].need_scaftfolding,
              step: 2,
              promo_curtain: this.items[i].promo_curtain || 0,
              promo_lining: this.items[i].promo_lining || 0,
              motorized_upgrade: null,
              motorized_power: null,
              motorized_sides: null,
              motorized_cost: null,
              motorized_choice: null,
              motorized_pieces: null,
              motorized_lift: null,

              // Additional
              track_sheer: null,
              fullness_sheer: null,
              pieces_sheer: null,
              sheer_bracket: null,
              sheer_sidehook: null,
              sheer_belt: null,
              sheer_touchfloor: null,
              code_sheer: null,
              custom_sheer_bracket: null,
              custom_sheer_belt: null,
              remark_sheer: null,
              promo_sheer: null || 0,

              pieces_blind: null,
              blind_decoration: null,
              rope_chain: null,
              promo_blind: null || 0,

              blind_tape: null,
              fabric_blind: null,
              code_blind: null,
              blind_spring: null,
              blind_tube: null,
              blind_easylift: null,
              blind_monosys: null,
            }

            if (this.items[i].motorized_upgrade) {
              temp.motorized_upgrade = this.items[i].motorized_upgrade
              temp.motorized_power = this.items[i].motorized_power
              temp.motorized_sides = this.items[i].motorized_sides
              temp.motorized_cost = this.items[i].motorized_cost
              temp.motorized_choice = this.items[i].motorized_choice
              temp.motorized_pieces = this.items[i].motorized_pieces
              temp.motorized_lift = this.items[i].motorized_lift
            }

            console.log(temp);

            this.updateOrder(temp)

          } else {
            console.log('error empty')
            this.errorEmpty()
          }
        } else if (this.items[i].fabric_type == 'S') {
          console.log('S1');
          if (['location', 'location_ref', 'width', 'height', 'type', 'pieces_sheer', 'sheer_bracket', 'sheer_sidehook', 'fabric_sheer'].every(a => this.items[i][a])) {

            let temp = {
              no: this.items[i].no,
              sales_id: this.items[i].sales_id,
              location: this.items[i].location,
              location_ref: this.items[i].location_ref,
              height: this.items[i].height,
              width: this.items[i].width,
              track_sheer: this.items[i].track_sheer,
              type: this.items[i].type,
              pleat: null,
              pleat_sheer: this.items[i].pleat_sheer,
              fullness_sheer: this.items[i].fullness_sheer,
              eyelet_curtain: this.items[i].eyelet_curtain,
              eyelet_sheer: this.items[i].eyelet_sheer,
              pieces_sheer: this.items[i].pieces_sheer,
              sheer_bracket: this.items[i].sheer_bracket,
              sheer_hook: this.items[i].sheer_hook,
              sheer_sidehook: this.items[i].sheer_sidehook,
              sheer_belt: this.items[i].sheer_belt,
              sheer_touchfloor: this.items[i].sheer_touchfloor,
              fabric: null,
              fabric_sheer: this.items[i].fabric_sheer,
              fabric_lining: null,
              code_sheer: this.items[i].code_sheer,
              fabric_type: this.items[i].fabric_type,
              custom_sheer_bracket: this.items[i].custom_sheer_bracket,
              custom_sheer_belt: this.items[i].custom_sheer_belt,
              price: this.price,
              status: true,
              photos: JSON.stringify(this.items[i].photos),
              remark_sale: this.items[i].remark_sale,
              remark_sheer: this.items[i].remark_sheer,
              status_sale: 'Completed',
              status_tech: 'Pending',
              need_ladder: this.items[i].need_ladder,
              need_scaftfolding: this.items[i].need_scaftfolding,
              step: 2,
              promo_sheer: this.items[i].promo_sheer || 0,
              motorized_upgrade: null,
              motorized_power: null,
              motorized_sides: null,
              motorized_cost: null,
              motorized_choice: null,
              motorized_pieces: null,
              motorized_lift: null,

              // Additional
              track: null,
              fullness: null,
              pieces_curtain: null,
              bracket: null,
              sidehook: null,
              belt: null,
              touchfloor: null,
              code_lining: null,
              code_curtain: null,
              custom_bracket: null,
              custom_belt: null,
              remark_curtain: null,
              promo_curtain: null || 0,
              promo_lining: null || 0,

              pieces_blind: null,
              blind_decoration: null,
              rope_chain: null,
              promo_blind: null || 0,

              blind_tape: null,
              fabric_blind: null,
              code_blind: null,
              blind_spring: null,
              blind_tube: null,
              blind_easylift: null,
              blind_monosys: null,
            }

            if (this.items[i].motorized_upgrade) {
              temp.motorized_upgrade = this.items[i].motorized_upgrade
              temp.motorized_power = this.items[i].motorized_power
              temp.motorized_sides = this.items[i].motorized_sides
              temp.motorized_cost = this.items[i].motorized_cost
              temp.motorized_choice = this.items[i].motorized_choice
              temp.motorized_pieces = this.items[i].motorized_pieces
              temp.motorized_lift = this.items[i].motorized_lift
            }

            console.log(temp);

            this.updateOrder(temp)

          } else {
            console.log('error empty')
            this.errorEmpty()
          }
        } else if (this.items[i].fabric_type == 'CS') {
          console.log('CS1');

          this.items[i].custom_sheer_bracket = this.items[i].custom_bracket
          this.items[i].sheer_bracket = this.items[i].bracket
          this.items[i].custom_sheer_belt = true
          this.items[i].sheer_belt = 'X'

          if (['location', 'location_ref', 'width', 'height', 'type', 'pleat', 'pleat_sheer', 'pieces_curtain', 'pieces_sheer', 'bracket', 'sidehook', 'belt', 'touchfloor', 'sheer_sidehook', 'fabric', 'fabric_sheer'].every(a => this.items[i][a])) {
            // , 'sheer_touchfloor' 'track', 'track_sheer',
            let temp = {
              no: this.items[i].no,
              sales_id: this.items[i].sales_id,
              location: this.items[i].location,
              location_ref: this.items[i].location_ref,
              height: this.items[i].height,
              width: this.items[i].width,
              track: this.items[i].track,
              track_sheer: this.items[i].track_sheer,
              type: this.items[i].type,
              pleat: this.items[i].pleat,
              pleat_sheer: this.items[i].pleat_sheer,
              eyelet_curtain: this.items[i].eyelet_curtain,
              eyelet_sheer: this.items[i].eyelet_sheer,
              fullness: this.items[i].fullness,
              fullness_sheer: this.items[i].fullness_sheer,
              pieces_curtain: this.items[i].pieces_curtain,
              pieces_sheer: this.items[i].pieces_sheer,
              bracket: this.items[i].bracket,
              hook: this.items[i].hook,
              sidehook: this.items[i].sidehook,
              belt: this.items[i].belt,
              touchfloor: this.items[i].touchfloor,
              sheer_bracket: this.items[i].sheer_bracket,
              sheer_hook: this.items[i].sheer_hook,
              sheer_sidehook: this.items[i].sheer_sidehook,
              sheer_belt: this.items[i].sheer_belt,
              // sheer_touchfloor: this.items[i].sheer_touchfloor,
              fabric: this.items[i].fabric,
              fabric_sheer: this.items[i].fabric_sheer,
              fabric_lining: this.items[i].fabric_lining,
              code_sheer: this.items[i].code_sheer,
              code_lining: this.items[i].code_lining,
              code_curtain: this.items[i].code_curtain,
              fabric_type: this.items[i].fabric_type,
              custom_bracket: this.items[i].custom_bracket,
              custom_belt: this.items[i].custom_belt,
              custom_sheer_bracket: this.items[i].custom_sheer_bracket,
              custom_sheer_hook: this.items[i].custom_sheer_hook,
              custom_sheer_belt: this.items[i].custom_sheer_belt,
              price: this.price,
              status: true,
              photos: JSON.stringify(this.items[i].photos),
              remark_sale: this.items[i].remark_sale,
              remark_curtain: this.items[i].remark_curtain,
              remark_sheer: this.items[i].remark_sheer,
              status_sale: 'Completed',
              status_tech: 'Pending',
              need_ladder: this.items[i].need_ladder,
              need_scaftfolding: this.items[i].need_scaftfolding,
              step: 2,
              promo_curtain: this.items[i].promo_curtain || 0,
              promo_lining: this.items[i].promo_lining || 0,
              promo_sheer: this.items[i].promo_sheer || 0,
              motorized_upgrade: null,
              motorized_power: null,
              motorized_sides: null,
              motorized_cost: null,
              motorized_choice: null,
              motorized_pieces: null,
              motorized_lift: null,

              // Additional
              sheer_touchfloor: null,
              pieces_blind: null,
              blind_decoration: null,
              rope_chain: null,
              promo_blind: null || 0,

              blind_tape: null,
              fabric_blind: null,
              code_blind: null,
              blind_spring: null,
              blind_tube: null,
              blind_easylift: null,
              blind_monosys: null,
            }

            if (this.items[i].motorized_upgrade) {
              temp.motorized_upgrade = this.items[i].motorized_upgrade
              temp.motorized_power = this.items[i].motorized_power
              temp.motorized_sides = this.items[i].motorized_sides
              temp.motorized_cost = this.items[i].motorized_cost
              temp.motorized_choice = this.items[i].motorized_choice
              temp.motorized_pieces = this.items[i].motorized_pieces
              temp.motorized_lift = this.items[i].motorized_lift
            }

            console.log(temp);

            this.updateOrder(temp)

          } else {
            console.log('error empty')
            this.errorEmpty()
          }
        }

      } else {
        if (this.items[i].fabric_type == 'C') {
          console.log('C2');
          if (['location', 'location_ref', 'width', 'height', 'type', 'pleat', 'pieces_curtain', 'bracket', 'sidehook', 'belt', 'touchfloor', 'fabric'].every(a => this.items[i][a])) {

            let temp = {
              no: this.items[i].no,
              sales_id: this.items[i].sales_id,
              location: this.items[i].location,
              location_ref: this.items[i].location_ref,
              height: this.items[i].height,
              width: this.items[i].width,
              track: this.items[i].track,
              type: this.items[i].type,
              pleat: this.items[i].pleat,
              pleat_sheer: null,
              eyelet_curtain: this.items[i].eyelet_curtain,
              eyelet_sheer: this.items[i].eyelet_sheer,
              fullness: this.items[i].fullness,
              pieces_curtain: this.items[i].pieces_curtain,
              bracket: this.items[i].bracket,
              hook: this.items[i].hook,
              sidehook: this.items[i].sidehook,
              belt: this.items[i].belt,
              touchfloor: this.items[i].touchfloor,
              fabric: this.items[i].fabric,
              fabric_sheer: null,
              fabric_lining: this.items[i].fabric_lining,
              code_lining: this.items[i].code_lining,
              code_curtain: this.items[i].code_curtain,
              fabric_type: this.items[i].fabric_type,
              custom_bracket: this.items[i].custom_bracket,
              custom_hook: this.items[i].custom_hook,
              custom_belt: this.items[i].custom_belt,
              price: this.price,
              status: true,
              photos: JSON.stringify(this.items[i].photos),
              remark_sale: this.items[i].remark_sale,
              remark_curtain: this.items[i].remark_curtain,
              status_sale: 'Completed',
              status_tech: 'Pending',
              need_ladder: this.items[i].need_ladder,
              need_scaftfolding: this.items[i].need_scaftfolding,
              step: 2,
              promo_curtain: this.items[i].promo_curtain || 0,
              promo_lining: this.items[i].promo_lining || 0,
              motorized_upgrade: null,
              motorized_power: null,
              motorized_sides: null,
              motorized_cost: null,
              motorized_choice: null,
              motorized_pieces: null,
              motorized_lift: null,

              // Additional
              track_sheer: null,
              fullness_sheer: null,
              pieces_sheer: null,
              sheer_bracket: null,
              sheer_sidehook: null,
              sheer_belt: null,
              sheer_touchfloor: null,
              code_sheer: null,
              custom_sheer_bracket: null,
              custom_sheer_belt: null,
              remark_sheer: null,
              promo_sheer: null || 0,

              pieces_blind: null,
              blind_decoration: null,
              rope_chain: null,
              promo_blind: null || 0,

              blind_tape: null,
              fabric_blind: null,
              code_blind: null,
              blind_spring: null,
              blind_tube: null,
              blind_easylift: null,
              blind_monosys: null,
            }

            if (this.items[i].motorized_upgrade) {
              temp.motorized_upgrade = this.items[i].motorized_upgrade
              temp.motorized_power = this.items[i].motorized_power
              temp.motorized_sides = this.items[i].motorized_sides
              temp.motorized_cost = this.items[i].motorized_cost
              temp.motorized_choice = this.items[i].motorized_choice
              temp.motorized_pieces = this.items[i].motorized_pieces
              temp.motorized_lift = this.items[i].motorized_lift
            }

            console.log(temp);

            this.updateOrder(temp)

          } else {
            console.log('error empty')
            this.errorEmpty()

          }

        } else if (this.items[i].fabric_type == 'S') {
          console.log('S2');
          if (['location', 'location_ref', 'width', 'height', 'type', 'pleat_sheer', 'pieces_sheer', 'sheer_sidehook', 'fabric_sheer'].every(a => this.items[i][a])) {

            let temp = {
              no: this.items[i].no,
              sales_id: this.items[i].sales_id,
              location: this.items[i].location,
              location_ref: this.items[i].location_ref,
              height: this.items[i].height,
              width: this.items[i].width,
              track_sheer: this.items[i].track_sheer,
              type: this.items[i].type,
              pleat: null,
              pleat_sheer: this.items[i].pleat_sheer,
              eyelet_curtain: this.items[i].eyelet_curtain,
              eyelet_sheer: this.items[i].eyelet_sheer,
              fullness_sheer: this.items[i].fullness_sheer,
              pieces_sheer: this.items[i].pieces_sheer,
              sheer_bracket: this.items[i].sheer_bracket,
              sheer_hook: this.items[i].sheer_hook,
              sheer_sidehook: this.items[i].sheer_sidehook,
              sheer_belt: this.items[i].sheer_belt,
              sheer_touchfloor: this.items[i].sheer_touchfloor,
              fabric: null,
              fabric_sheer: this.items[i].fabric_sheer,
              fabric_lining: null,
              code_sheer: this.items[i].code_sheer,
              fabric_type: this.items[i].fabric_type,
              custom_sheer_bracket: this.items[i].custom_sheer_bracket,
              custom_sheer_hook: this.items[i].custom_sheer_hook,
              custom_sheer_belt: this.items[i].custom_sheer_belt,
              price: this.price,
              status: true,
              photos: JSON.stringify(this.items[i].photos),
              remark_sale: this.items[i].remark_sale,
              remark_sheer: this.items[i].remark_sheer,
              status_sale: 'Completed',
              status_tech: 'Pending',
              need_ladder: this.items[i].need_ladder,
              need_scaftfolding: this.items[i].need_scaftfolding,
              step: 2,
              promo_sheer: this.items[i].promo_sheer || 0,
              motorized_upgrade: null,
              motorized_power: null,
              motorized_sides: null,
              motorized_cost: null,
              motorized_choice: null,
              motorized_pieces: null,
              motorized_lift: null,

              // Additional
              track: null,
              fullness: null,
              pieces_curtain: null,
              bracket: null,
              sidehook: null,
              belt: null,
              touchfloor: null,
              code_lining: null,
              code_curtain: null,
              custom_bracket: null,
              custom_belt: null,
              remark_curtain: null,
              promo_curtain: null || 0,
              promo_lining: null || 0,

              pieces_blind: null,
              blind_decoration: null,
              rope_chain: null,
              promo_blind: null || 0,
              blind_tape: null,
              fabric_blind: null,
              code_blind: null,
              blind_spring: null,
              blind_tube: null,
              blind_easylift: null,
              blind_monosys: null,
            }

            if (this.items[i].motorized_upgrade) {
              temp.motorized_upgrade = this.items[i].motorized_upgrade
              temp.motorized_power = this.items[i].motorized_power
              temp.motorized_sides = this.items[i].motorized_sides
              temp.motorized_cost = this.items[i].motorized_cost
              temp.motorized_choice = this.items[i].motorized_choice
              temp.motorized_pieces = this.items[i].motorized_pieces
              temp.motorized_lift = this.items[i].motorized_lift
            }

            console.log(temp);

            this.updateOrder(temp)

          } else {
            console.log('error empty')
            this.errorEmpty()
          }
        } else if (this.items[i].fabric_type == 'CS') {
          console.log('CS2');

          this.items[i].custom_sheer_bracket = this.items[i].custom_bracket
          this.items[i].sheer_bracket = this.items[i].bracket
          this.items[i].custom_sheer_belt = true
          this.items[i].sheer_belt = 'X'

          if (['location', 'location_ref', 'width', 'height', 'type', 'pleat', 'pleat_sheer', 'pieces_curtain', 'pieces_sheer', 'bracket', 'sidehook', 'belt', 'touchfloor', 'sheer_sidehook', 'fabric', 'fabric_sheer'].every(a => this.items[i][a])) {
            // 'sheer_touchfloor', 'track', 'track_sheer',
            let temp = {
              no: this.items[i].no,
              sales_id: this.items[i].sales_id,
              location: this.items[i].location,
              location_ref: this.items[i].location_ref,
              height: this.items[i].height,
              width: this.items[i].width,
              track: this.items[i].track,
              track_sheer: this.items[i].track_sheer,
              type: this.items[i].type,
              pleat: this.items[i].pleat,
              pleat_sheer: this.items[i].pleat_sheer,
              eyelet_curtain: this.items[i].eyelet_curtain,
              eyelet_sheer: this.items[i].eyelet_sheer,
              fullness: this.items[i].fullness,
              fullness_sheer: this.items[i].fullness_sheer,
              pieces_curtain: this.items[i].pieces_curtain,
              pieces_sheer: this.items[i].pieces_sheer,
              bracket: this.items[i].bracket,
              hook: this.items[i].hook,
              sidehook: this.items[i].sidehook,
              belt: this.items[i].belt,
              touchfloor: this.items[i].touchfloor,
              sheer_bracket: this.items[i].sheer_bracket,
              sheer_hook: this.items[i].sheer_hook,
              sheer_sidehook: this.items[i].sheer_sidehook,
              sheer_belt: this.items[i].sheer_belt,
              // sheer_touchfloor: this.items[i].sheer_touchfloor,
              fabric: this.items[i].fabric,
              fabric_sheer: this.items[i].fabric_sheer,
              fabric_lining: this.items[i].fabric_lining,
              code_sheer: this.items[i].code_sheer,
              code_lining: this.items[i].code_lining,
              code_curtain: this.items[i].code_curtain,
              fabric_type: this.items[i].fabric_type,
              custom_bracket: this.items[i].custom_bracket,
              custom_hook: this.items[i].custom_hook,
              custom_belt: this.items[i].custom_belt,
              custom_sheer_bracket: this.items[i].custom_sheer_bracket,
              custom_sheer_hook: this.items[i].custom_sheer_hook,
              custom_sheer_belt: this.items[i].custom_sheer_belt,
              price: this.price,
              status: true,
              photos: JSON.stringify(this.items[i].photos),
              remark_sale: this.items[i].remark_sale,
              remark_curtain: this.items[i].remark_curtain,
              remark_sheer: this.items[i].remark_sheer,
              status_sale: 'Completed',
              status_tech: 'Pending',
              need_ladder: this.items[i].need_ladder,
              need_scaftfolding: this.items[i].need_scaftfolding,
              step: 2,
              promo_curtain: this.items[i].promo_curtain || 0,
              promo_lining: this.items[i].promo_lining || 0,
              promo_sheer: this.items[i].promo_sheer || 0,
              motorized_upgrade: null,
              motorized_power: null,
              motorized_sides: null,
              motorized_cost: null,
              motorized_choice: null,
              motorized_pieces: null,
              motorized_lift: null,

              // Additional
              sheer_touchfloor: null,
              pieces_blind: null,
              blind_decoration: null,
              rope_chain: null,
              promo_blind: null || 0,
              blind_tape: null,
              fabric_blind: null,
              code_blind: null,
              blind_spring: null,
              blind_tube: null,
              blind_easylift: null,
              blind_monosys: null,
            }

            if (this.items[i].motorized_upgrade) {
              temp.motorized_upgrade = this.items[i].motorized_upgrade
              temp.motorized_power = this.items[i].motorized_power
              temp.motorized_sides = this.items[i].motorized_sides
              temp.motorized_cost = this.items[i].motorized_cost
              temp.motorized_choice = this.items[i].motorized_choice
              temp.motorized_pieces = this.items[i].motorized_pieces
              temp.motorized_lift = this.items[i].motorized_lift
            }

            console.log(temp);

            this.updateOrder(temp)

          } else {
            console.log('error empty')
            this.errorEmpty()
          }
        }

      }

    } else if (this.items[i]['type'] == 'Blinds') {

      if (this.items[i].pleat == 'Roman Blind') {
        if (['location', 'location_ref', 'width', 'height', 'type', 'pieces_blind', 'fabric', 'bracket', 'rope_chain'].every(a => this.items[i][a])) {

          let temp = {
            no: this.items[i].no,
            sales_id: this.items[i].sales_id,
            location: this.items[i].location,
            location_ref: this.items[i].location_ref,
            height: this.items[i].height,
            width: this.items[i].width,
            type: this.items[i].type,
            pleat: this.items[i].pleat,
            pieces_blind: this.items[i].pieces_blind,
            blind_decoration: null,
            bracket: this.items[i].bracket,
            rope_chain: this.items[i].rope_chain,
            // hook: this.items[i].hook,
            // sidehook: this.items[i].sidehook,
            // belt: this.items[i].belt,
            // fabric_blind: this.items[i].fabric_blind,
            fabric: this.items[i].fabric,
            fabric_lining: this.items[i].fabric_lining,
            code_lining: this.items[i].code_lining,
            code_curtain: this.items[i].code_curtain,
            custom_bracket: this.items[i].custom_bracket,
            // custom_hook: this.items[i].custom_hook,
            // custom_belt: this.items[i].custom_belt,
            price: this.price,
            status: true,
            photos: JSON.stringify(this.items[i].photos),
            remark_sale: this.items[i].remark_sale,
            status_sale: 'Completed',
            status_tech: 'Pending',
            need_ladder: this.items[i].need_ladder,
            need_scaftfolding: this.items[i].need_scaftfolding,
            step: 2,
            promo_lining: this.items[i].promo_lining || 0,
            promo_blind: this.items[i].promo_blind || 0,

            // Additional
            track: null,
            pleat_sheer: null,
            eyelet_curtain: null,
            eyelet_sheer: null,
            fullness: null,
            pieces_curtain: null,
            sidehook: null,
            belt: null,
            touchfloor: null,
            fabric_sheer: null,
            fabric_type: null,
            custom_belt: null,
            remark_curtain: null,
            promo_curtain: null || 0,
            motorized_upgrade: null,
            motorized_power: null,
            motorized_sides: null,
            motorized_cost: null,
            motorized_choice: null,
            motorized_pieces: null,
            motorized_lift: null,

            track_sheer: null,
            fullness_sheer: null,
            pieces_sheer: null,
            sheer_bracket: null,
            sheer_sidehook: null,
            sheer_belt: null,
            sheer_touchfloor: null,
            code_sheer: null,
            custom_sheer_bracket: null,
            custom_sheer_belt: null,
            remark_sheer: null,
            promo_sheer: null || 0,

            blind_tape: null,
            fabric_blind: null,
            code_blind: null,
            blind_spring: null,
            blind_tube: null,
            blind_easylift: null,
            blind_monosys: null,
          }

          if (this.info['show_decoration']) {
            temp.blind_decoration = this.items[i].blind_decoration
          }

          console.log(temp);

          this.updateOrder(temp)


        } else {
          console.log('error empty')
          this.errorEmpty()
        }
      } else if (this.items[i].pleat == 'Zebra Blind' || this.items[i].pleat == 'Roller Blind' || this.items[i].pleat == 'Wooden Blind' || this.items[i].pleat == 'Venetian Blinds') {
        if (['location', 'location_ref', 'width', 'height', 'type', 'rope_chain', 'pieces_blind', 'fabric_blind', 'bracket'].every(a => this.items[i][a])) {


          if (this.items[i].pleat == 'Wooden Blind' && ((this.items[i].blind_decoration && !this.items[i].blind_tape) || (!this.items[i].blind_decoration && this.items[i].blind_tape))) {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top',
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true,
            })

            Toast.fire({
              icon: 'error',
              title: 'Decorations or Tape is empty.'
            })
          } else {

            let temp = {
              no: this.items[i].no,
              sales_id: this.items[i].sales_id,
              location: this.items[i].location,
              location_ref: this.items[i].location_ref,
              height: this.items[i].height,
              width: this.items[i].width,
              type: this.items[i].type,
              pleat: this.items[i].pleat,
              pieces_blind: this.items[i].pieces_blind,
              blind_decoration: null,
              blind_tape: null,
              bracket: this.items[i].bracket,
              rope_chain: this.items[i].rope_chain,
              // hook: this.items[i].hook,
              // sidehook: this.items[i].sidehook,
              // belt: this.items[i].belt,
              fabric_blind: this.items[i].fabric_blind,
              code_blind: this.items[i].code_blind,
              custom_bracket: this.items[i].custom_bracket,
              // custom_hook: this.items[i].custom_hook,
              // custom_belt: this.items[i].custom_belt,
              price: this.price,
              status: true,
              photos: JSON.stringify(this.items[i].photos),
              remark_sale: this.items[i].remark_sale,
              status_sale: 'Completed',
              status_tech: 'Pending',
              need_ladder: this.items[i].need_ladder,
              need_scaftfolding: this.items[i].need_scaftfolding,
              step: 2,
              promo_blind: this.items[i].promo_blind || 0,
              blind_spring: null,
              blind_tube: null,
              blind_easylift: null,
              blind_monosys: null,

              // Additional
              track: null,
              pleat_sheer: null,
              eyelet_curtain: null,
              eyelet_sheer: null,
              fullness: null,
              pieces_curtain: null,
              sidehook: null,
              belt: null,
              touchfloor: null,
              fabric: null,
              fabric_sheer: null,
              fabric_lining: null,
              code_lining: null,
              code_curtain: null,
              fabric_type: null,
              custom_belt: null,
              remark_curtain: null,
              promo_curtain: null || 0,
              promo_lining: null || 0,
              motorized_upgrade: null,
              motorized_power: null,
              motorized_sides: null,
              motorized_cost: null,
              motorized_choice: null,
              motorized_pieces: null,
              motorized_lift: null,

              track_sheer: null,
              fullness_sheer: null,
              pieces_sheer: null,
              sheer_bracket: null,
              sheer_sidehook: null,
              sheer_belt: null,
              sheer_touchfloor: null,
              code_sheer: null,
              custom_sheer_bracket: null,
              custom_sheer_belt: null,
              remark_sheer: null,
              promo_sheer: null || 0,
            }

            if (this.items[i].pleat == 'Zebra Blind') {
              temp.blind_tube = this.items[i].blind_tube
            }
            if (this.items[i].pleat == 'Roller Blind') {
              temp.blind_spring = this.items[i].blind_spring
              temp.blind_tube = this.items[i].blind_tube
            }
            if (this.items[i].pleat == 'Wooden Blind') {
              temp.blind_easylift = this.items[i].blind_easylift
              temp.blind_monosys = this.items[i].blind_monosys
            }
            if (this.items[i].pleat == 'Wooden Blind' || this.items[i].pleat == 'Venetian Blinds') {
              temp.blind_tape = this.items[i].blind_tape
            }

            if (this.info['show_decoration']) {
              temp.blind_decoration = this.items[i].blind_decoration
            }
            console.log(temp);

            this.updateOrder(temp)
          }


        } else {
          console.log('error empty')
          this.errorEmpty()
        }
      } else {
        if (['location', 'location_ref', 'width', 'height', 'type', 'pieces_blind', 'rope_chain', 'fabric_blind', 'bracket'].every(a => this.items[i][a])) {

          let temp = {
            no: this.items[i].no,
            sales_id: this.items[i].sales_id,
            location: this.items[i].location,
            location_ref: this.items[i].location_ref,
            height: this.items[i].height,
            width: this.items[i].width,
            type: this.items[i].type,
            pleat: this.items[i].pleat,
            pieces_blind: this.items[i].pieces_blind,
            bracket: this.items[i].bracket,
            rope_chain: this.items[i].rope_chain,
            // hook: this.items[i].hook,
            // sidehook: this.items[i].sidehook,
            // belt: this.items[i].belt,
            fabric_blind: this.items[i].fabric_blind,
            code_blind: this.items[i].code_blind,
            custom_bracket: this.items[i].custom_bracket,
            // custom_hook: this.items[i].custom_hook,
            // custom_belt: this.items[i].custom_belt,
            price: this.price,
            status: true,
            photos: JSON.stringify(this.items[i].photos),
            remark_sale: this.items[i].remark_sale,
            status_sale: 'Completed',
            status_tech: 'Pending',
            need_ladder: this.items[i].need_ladder,
            need_scaftfolding: this.items[i].need_scaftfolding,
            step: 2,
            promo_blind: this.items[i].promo_blind || 0,

            // Additional
            track: null,
            pleat_sheer: null,
            eyelet_curtain: null,
            eyelet_sheer: null,
            fullness: null,
            pieces_curtain: null,
            sidehook: null,
            belt: null,
            touchfloor: null,
            fabric: null,
            fabric_sheer: null,
            fabric_lining: null,
            code_lining: null,
            code_curtain: null,
            fabric_type: null,
            custom_belt: null,
            remark_curtain: null,
            promo_curtain: null || 0,
            promo_lining: null || 0,
            motorized_upgrade: null,
            motorized_power: null,
            motorized_sides: null,
            motorized_cost: null,
            motorized_choice: null,
            motorized_pieces: null,
            motorized_lift: null,
            track_sheer: null,
            fullness_sheer: null,
            pieces_sheer: null,
            sheer_bracket: null,
            sheer_sidehook: null,
            sheer_belt: null,
            sheer_touchfloor: null,
            code_sheer: null,
            custom_sheer_bracket: null,
            custom_sheer_belt: null,
            remark_sheer: null,
            promo_sheer: null || 0,

            blind_decoration: null,
            blind_tape: null,
            blind_spring: null,
            blind_tube: null,
            blind_easylift: null,
            blind_monosys: null,
          }
          console.log(temp);

          this.updateOrder(temp)


        } else {
          console.log('error empty')
          this.errorEmpty()
        }
      }

    }

  }

  updateOrder(temp) {
    this.http.post('https://curtain.vsnap.my/updateorders', temp).subscribe(a => {
      if (this.count == (this.items.length - 1)) {

        Swal.fire({
          title: 'Update Completed',
          heightAuto: false,
          icon: 'info',
          showCancelButton: false,
          timer: 3000
        })

        this.count = 0
      } else {
        this.count++
        this.updateFinish()
      }
    })
  }

  errorEmpty() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    })

    Toast.fire({
      icon: 'error',
      title: 'Please Fill in all fields.'
    })
  }

  calcErrorMsg(x, y) {
    Swal.fire({
      title: x + ' Error',
      // text: "Please check the curtain's fabric?",
      html: "Please check the " + y + ", possible issues:<br>- " + x + " Availability<br>- " + x + " Name Changed<br>(Try reselect the " + y + ")",
      heightAuto: false,
      icon: 'error',
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: false,
    })
  }

  checkin() {
    this.nav.navigateForward('task-check-in?id=' + this.sales_id + '&role=' + this.role)
  }

  isEditCancel() {
    this.isEdit = false
    this.refreshList()
  }

  back() {
    this.nav.pop()
  }

  lengthof(x) {
    return x ? Object.keys(x).length : 0
  }

}
