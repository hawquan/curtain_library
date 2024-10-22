import { HttpClient } from '@angular/common/http';
import { ANALYZE_FOR_ENTRY_COMPONENTS, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { SafariViewController } from '@awesome-cordova-plugins/safari-view-controller/ngx';
import { ActionSheetController, ModalController, NavController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { QuotationSinglePage } from '../quotation-single/quotation-single.page';
import { TaskCreatorPage } from '../task-creator/task-creator.page';
import { TaskEditorPage } from '../task-editor/task-editor.page';
import { TaskOngoingViewDetailsPage } from '../task-ongoing-view-details/task-ongoing-view-details.page';
import { TaskOngoingViewAlacartePage } from '../task-ongoing-view-alacarte/task-ongoing-view-alacarte.page';

@Component({
  selector: 'app-task-ongoing',
  templateUrl: './task-ongoing.page.html',
  styleUrls: ['./task-ongoing.page.scss'],
})
export class TaskOngoingPage implements OnInit {

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
  task = []
  items = [] as any
  show = null
  sales_id = 0
  user = []

  tracklist = []
  pleatlist = []
  blindlist = []
  fabriclist = []
  fabricCurtain = []
  fabricSheer = []
  fabricLining = []
  calc = [] as any

  ngOnInit() {

    this.actroute.queryParams.subscribe(a => {
      this.sales_id = JSON.parse(a["no"])
      this.user = JSON.parse(a["user"])
    })
    console.log(this.info, this.sales_id, this.user);

    this.http.get('https://curtain.vsnap.my/tracklist').subscribe((s) => {
      this.tracklist = s['data']
      console.log(this.tracklist)
    })

    this.http.get('https://curtain.vsnap.my/pleatlist').subscribe((s) => {
      this.pleatlist = s['data']
      console.log(this.pleatlist)
    })

    this.http.get('https://curtain.vsnap.my/blindlist').subscribe((s) => {
      this.blindlist = s['data']
      console.log(this.blindlist)
    })

    this.http.get('https://curtain.vsnap.my/fabricList').subscribe((s) => {
      this.fabriclist = s['data']
      console.log(this.fabriclist)

      this.fabricCurtain = this.fabriclist.filter(x => x.type == 'Curtain')
      this.fabricSheer = this.fabriclist.filter(x => x.type == 'Sheer')
      this.fabricLining = this.fabriclist.filter(x => x.type == 'Lining')

      this.refreshList()

    })
    // let temp = {
    //   belt: "Velco",
    //   bracket: "Ceiling",
    //   fabric: "a003",
    //   fullness: "1.8",
    //   height: 1,
    //   hook: "104-L",
    //   location: "Living Room",
    //   others: "Panel",
    //   pieces: "2",
    //   pleat: "Ripple Fold",
    //   price: 3200,
    //   sidehook: "No",
    //   touchfloor: "Yes",
    //   track: "Curve",
    //   type: "Motorised Curtains",
    //   width: 32,
    //   remark: 'the remark',
    // }

    // let temp2 = {
    //   belt: "Velco",
    //   bracket: "Ceiling",
    //   fabric: "a003",
    //   fullness: "1.8",
    //   height: 1,
    //   hook: "104-L",
    //   location: "Master Room 1",
    //   others: "Panel",
    //   pieces: "2",
    //   pleat: "Single Pleat",
    //   price: 1100,
    //   sidehook: "No",
    //   touchfloor: "Yes",
    //   track: "Curve",
    //   type: "Tailor-Made Curtains",
    //   width: 32,
    //   remark: 'the remark',
    // }

    // this.items.push(temp)
    // this.items.push(temp2)
  }

  refreshList() {
    this.calc = []

    this.http.post('https://curtain.vsnap.my/getonesales', { no: this.sales_id }).subscribe(a => {
      this.info = a['data'][0]

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
      });

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

  async ongoingViewDetails(x) {
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

  deleteTask(x) {
    console.log(x.no);

    Swal.fire({
      title: 'Delete Item',
      text: 'Delete "' + x.location + '" from the list. Are you sure?',
      heightAuto: false,
      icon: 'warning',
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

  //     console.log(this.fabricCurtain, this.fabricSheer)
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

  //     console.log(curtain_id, sheer_id, track_id, pleat_id);

  //   } else {
  //     curtain = false
  //     sheer = false
  //     track = false

  //     pleat_id = this.pleatlist.filter(x => x.name == this.items[i].pleat)[0]['id']
  //   }

  //   let temp = {
  //     width: width, height: height, curtain: curtain, lining: false, lining_id: 41,
  //     curtain_id: curtain_id, sheer: sheer, sheer_id: sheer_id, track: track, track_id: track_id, pleat_id: pleat_id
  //   }

  //   console.log(temp);

  //   this.http.post('https://curtain.vsnap.my/calcPrice', temp).subscribe(a => {

  //     this.calc.push(a['data'])
  //     console.log(this.calc);
  //   })

  // }

  totalPrice() {
    let total = 0
    for (let i = 0; i < this.items.length; i++) {
      total += this.items[i].price
    }
    return total || 0
  }

  viewQuotation() {
    let navExtra: NavigationExtras = {
      queryParams: {
        sales_id: this.sales_id,
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

    this.nav.navigateForward(['task-ongoing-view-quotation'], navExtra)
  }

  retractProgress() {
    let temp = {
      no: this.sales_id,
      step: 1,
    }

    Swal.fire({
      title: 'Retract Progress',
      text: 'Progress will be retract back to sales person (Sales will be able to edit item again). Are you sure?',
      heightAuto: false,
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Retract',
      reverseButtons: true,
    }).then((y) => {
      if (y.isConfirmed) {
        this.http.post('https://curtain.vsnap.my/updatesales', temp).subscribe(a => {

          let body2 = {
            title: "Sales Retracted",
            body: "Sales have been RETRACTED back to you.",
            path: 'tabs/tab1',
            topic: this.user['id'],
          }
          this.http.post('https://curtain.vsnap.my/fcmAny', body2).subscribe(data2 => {
            console.log(data2);
          }, e => {
            console.log(e);
          });

          Swal.fire({
            title: 'Retract Completed',
            icon: 'success',
            heightAuto: false,
            showConfirmButton: false,
            showCancelButton: false,
            timer: 2000,
          })
          this.nav.pop()
        })
        // this.items.splice(x, 1)
      }
    })
  }

  async presentActionSheet() {

    let destination = this.info['customer_address']
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
              // alert('1')
              this.safariViewController.show({
                url: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(destination),
              })
                .subscribe((result: any) => {
                  // alert(result)

                  if (result.event === 'opened') console.log('Opened');
                  else if (result.event === 'loaded') console.log('Loaded');
                  else if (result.event === 'closed') console.log('Closed');
                },
                  (error: any) => {
                    // alert(error)

                  }
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
              // alert('1')
              this.safariViewController.show({
                url: "https://waze.com/ul?q=" + encodeURIComponent(destination) + "&navigate=yes&z=6",
              })
                .subscribe((result: any) => {
                  // alert(result)
                  if (result.event === 'opened') console.log('Opened');
                  else if (result.event === 'loaded') console.log('Loaded');
                  else if (result.event === 'closed') console.log('Closed');
                },
                  (error: any) => {
                    // alert(error)
                  }
                );

            } else {
              alert('2')

              window.open("https://waze.com/ul?q=" + encodeURIComponent(destination) + "&navigate=yes&z=6", '_system');
              // use fallback browser, example InAppBrowser
            }
          }).catch(async (error) => {
            alert('3')

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
