import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { SafariViewController } from '@awesome-cordova-plugins/safari-view-controller/ngx';
import { ActionSheetController, ModalController, NavController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { QuotationSinglePage } from '../quotation-single/quotation-single.page';
import { TaskCreatorPage } from '../task-creator/task-creator.page';
import { TaskDetailCompletedReviewPage } from '../task-detail-completed-review/task-detail-completed-review.page';
import { TaskDetailReviewPage } from '../task-detail-review/task-detail-review.page';
import { TaskEditorPage } from '../task-editor/task-editor.page';

@Component({
  selector: 'app-task-detail-completed',
  templateUrl: './task-detail-completed.page.html',
  styleUrls: ['./task-detail-completed.page.scss'],
})
export class TaskDetailCompletedPage implements OnInit {

  constructor(
    private nav: NavController,
    private actroute: ActivatedRoute,
    public modal: ModalController,
    private http: HttpClient,
    private actionSheetController: ActionSheetController,
    private safariViewController: SafariViewController,
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
  fabricSheer = []
  fabricLining = []

  ngOnInit() {

    this.actroute.queryParams.subscribe(a => {
      console.log(a);

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

  async reviewTaskCompleted(x) {

    const modal = await this.modal.create({
      cssClass: 'task',
      component: TaskDetailCompletedReviewPage,
      componentProps: {
        item: x,
        pleatlist: this.pleatlist,
        blindlist: this.blindlist,
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

  async quotationSingle(x, i) {

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
    this.nav.navigateForward(['task-detail-completed-quotation'], navExtra)
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

  //   let curtain = false as any
  //   let curtain_id
  //   let sheer = false
  //   let sheer_id
  //   let track = false
  //   let track_id

  //   let pleat_id

  //   this.http.get('https://curtain.vsnap.my/fabricList').subscribe((s) => {
  //     let temp = s['data']

  //     this.fabricCurtain = temp.filter(x => x.type == 'Curtain')
  //     this.fabricSheer = temp.filter(x => x.type == 'Sheer')

  //     // console.log(this.fabricCurtain, this.fabricSheer)
  //   })

  //   console.log(this.items[i]);


  //   if (this.items[i].curtain != 'Blinds') {

  //     if (this.items[i].fabric != null && this.items[i].fabric != 'NA') {
  //       curtain = true
  //       curtain_id = this.fabricCurtain.filter(x => x.name == this.items[i].fabric)[0]['id']
  //     } else {
  //       curtain = false
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

  //     pleat_id = this.pleatlist.filter(x => x.name == this.items[i].pleat)[0]['id']

  //     // console.log(curtain_id, sheer_id, track_id, pleat_id);

  //   } else {
  //     curtain = false
  //     sheer = false
  //     track = false

  //     pleat_id = this.pleatlist.filter(x => x.name == this.items[i].pleat)[0]['id']
  //   }

  //   let temp = {
  //     width: width, height: height, curtain: curtain,lining: false, lining_id: 41,
  //     curtain_id: curtain_id, sheer: sheer, sheer_id: sheer_id, track: track, track_id: track_id, pleat_id: pleat_id
  //   }

  //   // console.log(temp);

  //   this.http.post('https://curtain.vsnap.my/calcPrice', temp).subscribe(a => {

  //     this.calc.push(a['data'])
  //     console.log(this.calc);
  //   })

  // }

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

  back() {
    this.nav.pop()
  }

}
