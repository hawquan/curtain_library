import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { TaskCreatorPage } from '../task-creator/task-creator.page';
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
  ) { }

  info = []
  img = []
  task = []
  items = [] as any

  ngOnInit() {

    this.actroute.queryParams.subscribe(a => {
      this.info = JSON.parse(a["info"])
      this.img = this.info['img']
    })
    console.log(this.info, this.img);

  }
  Header = []
  HeaderChoice = ''
  HeaderSingle = false
  HeaderRipple = false
  HeaderDouble = false
  HeaderFrench = false
  HeaderEyelet = false

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

  typeChanged() {
    this.HeaderSingle = false
    this.HeaderRipple = false
    this.HeaderDouble = false
    this.HeaderFrench = false
    this.HeaderEyelet = false
    this.HeaderChoice = ''

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

  HeaderSelection(x) {
    this.HeaderSingle = false
    this.HeaderRipple = false
    this.HeaderDouble = false
    this.HeaderFrench = false
    this.HeaderEyelet = false

    if (x == 'Single Pleat') {
      this.HeaderSingle = true
      this.HeaderChoice = 'Single Pleat'
    } else if (x == 'Ripple Fold') {
      this.HeaderRipple = true
      this.HeaderChoice = 'Ripple Fold'
    } else if (x == 'Double Pleat') {
      this.HeaderDouble = true
      this.HeaderChoice = 'Double Pleat'
    } else if (x == 'French Pleat') {
      this.HeaderFrench = true
      this.HeaderChoice = 'French Pleat'
    } else if (x == 'Eyelet') {
      this.HeaderEyelet = true
      this.HeaderChoice = 'Eyelet'
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
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log(data)

    if (data != null) {
      this.items.push(data)
    }
  }

  async editTask(x) {
    const modal = await this.modal.create({
      cssClass: 'task',
      component: TaskEditorPage,
      componentProps: {
        item: x
      }
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log(data)

    if (data != null) {
      // this.items.push(data)
    }
  }

  back() {
    this.nav.pop()
  }

}
