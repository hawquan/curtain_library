import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
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

  tracklist = []
  pleatlist = []
  blindlist = []

  ngOnInit() {

    this.actroute.queryParams.subscribe(a => {
      console.log(a);

      this.info = JSON.parse(a["info"])
      this.sales_id = this.info['no']
      this.user = JSON.parse(a["user"])
    })
    console.log(this.info, this.sales_id, this.user);
    this.refreshList()

    this.http.get('https://bde6-124-13-53-82.ap.ngrok.io/tracklist').subscribe((s) => {
      this.tracklist = s['data']
      console.log(this.tracklist)
    })

    this.http.get('https://bde6-124-13-53-82.ap.ngrok.io/pleatlist').subscribe((s) => {
      this.pleatlist = s['data']
      console.log(this.pleatlist)
    })

    this.http.get('https://bde6-124-13-53-82.ap.ngrok.io/blindlist').subscribe((s) => {
      this.blindlist = s['data']
      console.log(this.blindlist)
    })
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
        items: JSON.stringify(this.items),
        info: JSON.stringify(this.info),
      }
    }
    this.nav.navigateForward(['quotation-overall'], navExtra)
  }

  back() {
    this.nav.pop()
  }

}
