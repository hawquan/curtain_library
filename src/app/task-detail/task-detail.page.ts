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

  keywordPro = ''
  showSelection = false
  propertyList = ['Apartment', 'Bungalow', 'Condominium', 'Semi-D', 'Terrace', 'Others']
  ngOnInit() {

    this.actroute.queryParams.subscribe(a => {
      // console.log(a);

      this.sales_id = JSON.parse(a["no"])
      this.user = JSON.parse(a["user"])
      console.log(this.sales_id, this.user);

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
    this.http.post('https://curtain.vsnap.my/getonesales', { no: this.sales_id }).subscribe(a => {
      this.info = a['data'][0]

      this.keywordPro = this.info.customer_property ? this.info.customer_property : ''
      console.log(this.info);
    })

    this.http.post('https://curtain.vsnap.my/getorderlist', { sales_id: this.sales_id }).subscribe(a => {
      this.items = a['data']
      // for (let i = 0; i < this.items.length; i++) {
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

    const modal = await this.modal.create({
      cssClass: 'task',
      component: TaskDetailReviewPage,
      componentProps: {
        item: x,
        position: this.user['position'],
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

  isEditCancel() {
    this.isEdit = false
    this.refreshList()
  }

  back() {
    this.nav.pop()
  }

}
