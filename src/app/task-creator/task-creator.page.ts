import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-creator',
  templateUrl: './task-creator.page.html',
  styleUrls: ['./task-creator.page.scss'],
})
export class TaskCreatorPage implements OnInit {

  constructor(
    private nav: NavController,
    private actroute: ActivatedRoute,
    private model: ModalController,
  ) { }

  item = [] as any
  info = []
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
      this.info = JSON.parse(a["info"])
      this.Header = this.info['img']
    })
    console.log(this.info, this.Header);
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

  addItem() {
    this.item.header = this.HeaderChoice
    if (this.item['type'] == 'Tailor-Made Curtains' || this.item['type'] == 'Motorised Curtains') {
      console.log('in 1st');
      console.log(this.item);

      if (['width', 'height', 'type', 'header', 'fabric'].every(a => this.item[a])) {

        console.log('pass1');

        this.model.dismiss(this.item)

      } else {
        console.log('error empty')
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

    } else if(this.item['type'] == 'Blinds') {
    this.item.header = this.blindsChoice
    
      console.log(this.item);

      if (['width', 'height', 'type', 'header', 'styles', 'patterns', 'textures'].every(a => this.item[a])) {
        console.log('pass2');
        this.model.dismiss(this.item)

      } else {
        console.log('error empty')
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
    } else{
      this.item.header = this.WallpaperChoice

      console.log(this.item);

      if (['width', 'height', 'type', 'header', 'colours', 'prints', 'textures'].every(a => this.item[a])) {
        console.log('pass2');
        this.model.dismiss(this.item)

      } else {
        console.log('error empty')
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
    }

  }

  back() {
    this.model.dismiss()
  }

}
