import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { QuotationSinglePage } from '../quotation-single/quotation-single.page';
import { TaskCreatorPage } from '../task-creator/task-creator.page';
import { TaskEditorPage } from '../task-editor/task-editor.page';
import { TaskOngoingViewDetailsPage } from '../task-ongoing-view-details/task-ongoing-view-details.page';

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
  ngOnInit() {

    this.actroute.queryParams.subscribe(a => {
      this.info = JSON.parse(a["info"])
      this.sales_id = this.info['no']
      this.user = JSON.parse(a["user"])
    })
    console.log(this.info, this.sales_id,this.user);
    this.refreshList()

    this.http.get('https://bde6-124-13-53-82.ap.ngrok.io/pleatlist').subscribe((s) => {
      this.pleatlist = s['data']
      console.log(this.pleatlist)
    })

    this.http.get('https://bde6-124-13-53-82.ap.ngrok.io/blindlist').subscribe((s) => {
      this.blindlist = s['data']
      console.log(this.blindlist)
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
    this.http.post('https://bde6-124-13-53-82.ap.ngrok.io/getorderlist', { sales_id: this.sales_id }).subscribe(a => {
      this.items = a['data']
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
      }
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log(data)

      // this.items.push(data)
      this.refreshList()
    
  }

  async ongoingViewDetails(x) {

    const modal = await this.modal.create({
      cssClass: 'task',
      component: TaskOngoingViewDetailsPage,
      componentProps: {
        item: x,
        sales_no: this.sales_id,
        pleatlist: this.pleatlist,
        blindlist: this.blindlist,
      }
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log(data)

    if (data != null) {
      // x = data
      this.refreshList()
    }
  }

  async quotationSingle(x) {

    const modal = await this.modal.create({
      cssClass: 'task',
      component: QuotationSinglePage,
      componentProps: {
        item: x
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
        this.http.post('https://bde6-124-13-53-82.ap.ngrok.io/deleteorder', { no: x.no }).subscribe(a => {
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

  viewQuotation() {
    let navExtra: NavigationExtras = {
      queryParams: {
        items: JSON.stringify(this.items),
        sales_no: this.sales_id,
      }
    }
    this.nav.navigateForward(['task-ongoing-view-quotation'], navExtra)
  }

  back() {
    this.nav.pop()
  }

}
