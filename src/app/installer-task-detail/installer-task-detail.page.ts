import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-installer-task-detail',
  templateUrl: './installer-task-detail.page.html',
  styleUrls: ['./installer-task-detail.page.scss'],
})
export class InstallerTaskDetailPage implements OnInit {

  constructor(
    private nav: NavController,
    private actroute: ActivatedRoute,
    public modal: ModalController,
  ) { }

  info = []
  img = []
  task = []

  item = [] as any
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

  ngOnInit() {

    this.actroute.queryParams.subscribe(a => {
      this.info = JSON.parse(a['info'])
      this.item = JSON.parse(a['item'])

      this.img = this.info['img']

      if (this.item.type == 'Tailor-Made Curtains' || this.item.type == 'Motorised Curtains') {
        this.HeaderSelection(this.item.header)
        console.log('header');
      }
      else if (this.item.type == 'Blinds') {
        this.blindsSelection(this.item.header)
        console.log('blinds');
      }
      else {
        this.wallpaperSelection(this.item.header)
        console.log('wallpaper');
      }
    })
    console.log(this.info, this.img);
    console.log(this.item);
  }

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
    } else if (x == 'Fake Double Pleat') {
      this.HeaderDouble = true
      this.HeaderChoice = 'Fake Double Pleat'
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

  approve(){

  }

  reject(){
    
  }

  back() {
    this.nav.pop()
  }
}

