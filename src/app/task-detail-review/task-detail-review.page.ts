import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertController, ModalController, NavController, NavParams } from '@ionic/angular';
import Swal from 'sweetalert2';
import { SelectorPage } from '../selector/selector.page';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

@Component({
  selector: 'app-task-detail-review',
  templateUrl: './task-detail-review.page.html',
  styleUrls: ['./task-detail-review.page.scss'],
})
export class TaskDetailReviewPage implements OnInit {

  constructor(
    private nav: NavController,
    private actroute: ActivatedRoute,
    private model: ModalController, private modalcontroller: ModalController,
    private navparam: NavParams,
    private http: HttpClient,
    private alertController: AlertController,
    private camera: Camera,
  ) { }

  item = [] as any
  info = []
  sales_no = 0
  position = ""

  pleatlist = []
  blindlist = []
  tracklist = []
  fabriclist = []
  misclist = []
  bracketlist = []
  hooklist = []
  hooklistadjust = []
  beltlist = []
  otherslist = []
  pieceslist = []
  fabricCurtain = []
  fabricSheer = []
  fabricLining = []

  BlindsChoice = ''

  PlainWall = false
  FabricWall = false
  NonWovenWall = false
  PatternWall = false
  VinylWall = false
  WallpaperChoice = ''

  price: any = 0
  hookview = true
  show = false
  showCurtain = false
  showSheer = false
  curtainswitch = 'Expand'
  xcurtainswitch = 'Collapse'
  sheerswitch = 'Expand'
  xsheerswitch = 'Collapse'
  fabricType = ''

  checker = [] as any

  ngOnInit() {
    this.item = this.navparam.get('item')
    this.position = this.navparam.get('position')
    this.tracklist = this.navparam.get('tracklist')

    console.log(this.item, this.position);

    this.price = this.item.price
    this.pleatSelection()

    this.http.get('https://curtain.vsnap.my/miscList').subscribe((s) => {
      this.misclist = s['data']
      // console.log(this.misclist)

      for (let i = 0; i < this.misclist.length; i++) {

        if (this.misclist[i]['type'] == "Bracket") {
          this.bracketlist.push(this.misclist[i])
        } else if (this.misclist[i]['type'] == "Hook") {
          this.hooklist.push(this.misclist[i])
          if (this.misclist[i].name != 'Adjust') {
            this.hooklistadjust.push(this.misclist[i])
          }
        } else if (this.misclist[i]['type'] == "Belt") {
          this.beltlist.push(this.misclist[i])
        } else if (this.misclist[i]['type'] == "Others") {
          this.otherslist.push(this.misclist[i])
        } else if (this.misclist[i]['type'] == "Pieces") {
          this.pieceslist.push(this.misclist[i])
        }
      }

      this.checkFabric()
      // console.log(this.bracketlist, this.hooklist, this.beltlist, this.otherslist);

    })
  }

  addCustom() {
    this.bracketlist.push('Custom')
    this.hooklist.push('Custom')
    this.beltlist.push('Custom')
  }

  selectChanged(selectedColor, x) {
    if (selectedColor === 'Custom') {
      this.inputCustom(x)
    } else {
      eval(x = selectedColor)
    };
  };

  async inputCustom(x) {
    const inputAlert = await this.alertController.create({
      header: 'Enter your custom item:',
      inputs: [{ name: 'item', type: 'text', placeholder: 'type in' }],
      buttons: [{ text: 'Cancel' }, {
        text: 'Ok', handler: (data) => {

          console.log(data)

          if (data['item'] == null) {

            Swal.fire({
              title: 'Oops',
              text: 'Input cannot be empty!',
              icon: 'error',
              heightAuto: false,
              timer: 5000,
            });

          } else {
            let buttoners = {
              Cancel: { name: 'Cancel', value: 'Cancel' },
              Confirm: { name: 'Confirm', value: 'Confirm' }
            }

            eval(x = data['item'])
          }

        }
      }]
    });

    await inputAlert.present();

  };

  typeChanged() {
    this.item.pleat = ''

    this.PlainWall = false
    this.FabricWall = false
    this.NonWovenWall = false
    this.PatternWall = false
    this.VinylWall = false
    this.WallpaperChoice = ''
  }

  pleatSelection() {

    if (this.item.pleat == 'Eyelet Design' || this.item.pleat == 'Ripplefold') {
      this.hookview = false
      this.item.hook = ''
    } else {
      this.hookview = true
    }

    if (this.item.pleat == 'French Pleat') {
      if (this.item.hook == 'Adjust') {
        this.item.hook = ''
      }
    }
  }

  clearTrack(x) {
    if (x == 'curtain') {
      this.item.track = null
    } else if (x == 'sheer') {
      this.item.track_sheer = null
    }
  }

  checkFabric() {

    if (this.item.fabric_type == 'C') {
      this.fabricType = 'Curtain'
      this.showCurtain = true
    } else if (this.item.fabric_type == 'S') {
      this.fabricType = 'Sheer'
      this.showSheer = true
    } else if (this.item.fabric_type == 'CS') {
      this.fabricType = 'Curtain + Sheer'
      this.showCurtain = true
      this.showSheer = true
    }

  }

  blindsSelection(x) {
    this.BlindsChoice = x.pleat
  }

  blindChoice() {
    return this.BlindsChoice
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

  selectCustom(x) {
    if (x == 'bracket') {
      this.item.bracket = null
    } else if (x == 'hook') {
      this.item.hook = null
    } else if (x == 'belt') {
      this.item.belt = null
    } else if (x == 'sheer_bracket') {
      this.item.sheer_bracket = null
    } else if (x == 'sheer_hook') {
      this.item.sheer_hook = null
    } else if (x == 'sheer_belt') {
      this.item.sheer_belt = null
    }

  }

  async selector(x) {
    const modal = await this.modalcontroller.create({
      component: SelectorPage,
      componentProps: { array: [{ name: "ok1", id: "a001" }, { name: "ok2", id: "a002" }, { name: "ok3", id: "a003" }, { name: "ok4", id: "a004" },] }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      eval(x + '="' + data.value.id + '"')
    }
  }

  updateTech() {
    if (this.item['type'] == 'Tailor-Made Curtains' || this.item['type'] == 'Motorised Curtains') {

      if (this.hookview) {
        // if (this.item.fabric_lining != null) {
        if (this.item.fabric_type == 'C') {
          if (['area', 'area_ref', 'tech_width', 'tech_height', 'product', 'pieces_curtain', 'bracket',
            'hook', 'belt', 'touchfloor', 'sidehook'].every(a => this.checker[a])) {

            this.pass()

          } else {
            this.emptychecker()
          }
        } else if (this.item.fabric_type == 'S') {
          if (['area', 'area_ref', 'tech_width', 'tech_height', 'product', 'pieces_sheer', 'sheer_bracket',
            'sheer_hook', 'sheer_belt', 'sheer_touchfloor', 'sheer_sidehook',].every(a => this.checker[a])) {

            this.pass()

          } else {
            this.emptychecker()
          }
        } else if (this.item.fabric_type == 'CS') {
          this.item.custom_sheer_bracket = this.item.custom_bracket
          this.item.sheer_bracket = this.item.bracket
          this.item.custom_sheer_belt = true
          this.item.sheer_belt = 'X'
          if (['area', 'area_ref', 'tech_width', 'tech_height', 'product', 'pieces_curtain', 'pieces_sheer', 'bracket',
            'hook', 'belt', 'touchfloor', 'sidehook', 'sheer_hook', 'sheer_sidehook',].every(a => this.checker[a])) {
            // 'sheer_touchfloor',
            this.pass()

          } else {
            this.emptychecker()
          }
        }
        // } 
        // else {
        //   if (this.item.fabric_type == 'C') {
        //     if (['area', 'area_ref', 'tech_width', 'tech_height', 'product', 'track', 'pieces_curtain', 'bracket',
        //       'hook', 'belt', 'touchfloor', 'sidehook'].every(a => this.checker[a])) {

        //       this.pass()

        //     } else {
        //       this.emptychecker()
        //     }
        //   } else if (this.item.fabric_type == 'S') {
        //     if (['area', 'area_ref', 'tech_width', 'tech_height', 'product', 'track', 'pieces_sheer', 'sheer_bracket',
        //       'sheer_hook', 'sheer_belt', 'sheer_touchfloor', 'sheer_sidehook',].every(a => this.checker[a])) {

        //       this.pass()

        //     } else {
        //       this.emptychecker()
        //     }
        //   } else if (this.item.fabric_type == 'CS') {
        //     if (['area', 'area_ref', 'tech_width', 'tech_height', 'product', 'track', 'pieces_curtain', 'pieces_sheer', 'bracket',
        //       'hook', 'belt', 'touchfloor', 'sidehook', 'sheer_bracket', 'sheer_hook', 'sheer_belt', 'sheer_touchfloor', 'sheer_sidehook',].every(a => this.checker[a])) {

        //       this.pass()

        //     } else {
        //       this.emptychecker()
        //     }
        //   }
        // }

      } else {
        // if (this.item.fabric_lining != null) {
        if (this.item.fabric_type == 'C') {
          if (['area', 'area_ref', 'tech_width', 'tech_height', 'product', 'pieces_curtain', 'bracket',
            'belt', 'touchfloor', 'sidehook'].every(a => this.checker[a])) {

            this.pass()

          } else {
            this.emptychecker()
          }
        } else if (this.item.fabric_type == 'S') {
          if (['area', 'area_ref', 'tech_width', 'tech_height', 'product', 'pieces_sheer',
            'sheer_bracket', 'sheer_belt', 'sheer_touchfloor', 'sheer_sidehook',].every(a => this.checker[a])) {

            this.pass()

          } else {
            this.emptychecker()
          }
        } else if (this.item.fabric_type == 'CS') {
          this.item.custom_sheer_bracket = this.item.custom_bracket
          this.item.sheer_bracket = this.item.bracket
          this.item.custom_sheer_belt = true
          this.item.sheer_belt = 'X'

          if (['area', 'area_ref', 'tech_width', 'tech_height', 'product', 'pieces_curtain', 'pieces_sheer', 'bracket',
            'belt', 'touchfloor', 'sidehook', 'sheer_sidehook',].every(a => this.checker[a])) {
            // 'sheer_touchfloor',
            this.pass()

          } else {
            this.emptychecker()
          }
        }
        // } 
        // else {
        //   if (this.item.fabric_type == 'C') {
        //     if (['area', 'area_ref', 'tech_width', 'tech_height', 'product', 'track', 'pieces_curtain', 'bracket',
        //       'belt', 'touchfloor', 'sidehook'].every(a => this.checker[a])) {

        //       this.pass()

        //     } else {
        //       this.emptychecker()
        //     }
        //   } else if (this.item.fabric_type == 'S') {
        //     if (['area', 'area_ref', 'tech_width', 'tech_height', 'product', 'track', 'pieces_sheer', 'sheer_bracket',
        //       'sheer_belt', 'sheer_touchfloor', 'sheer_sidehook',].every(a => this.checker[a])) {

        //       this.pass()

        //     } else {
        //       this.emptychecker()
        //     }
        //   } else if (this.item.fabric_type == 'CS') {
        //     if (['area', 'area_ref', 'tech_width', 'tech_height', 'product', 'track', 'pieces_curtain', 'pieces_sheer', 'bracket',
        //       'belt', 'touchfloor', 'sidehook', 'sheer_bracket', 'sheer_belt', 'sheer_touchfloor', 'sheer_sidehook',].every(a => this.checker[a])) {

        //       this.pass()

        //     } else {
        //       this.emptychecker()
        //     }
        //   }
        // }
      }

    } else if (this.item['type'] == 'Blinds') {
      if (this.item.pleat == 'Roman Blind') {
        if (['area', 'area_ref', 'tech_width', 'tech_height', 'rope_chain', 'pleat', 'product', 'pieces_blind', 'bracket'].every(a => this.checker[a])) {

          this.pass()

        } else {
          this.emptychecker()
        }
      } else if (this.item.pleat == 'Zebra Blind' || this.item.pleat == 'Roller Blind' || this.item.pleat == 'Wooden Blind') {
        if (['area', 'area_ref', 'tech_width', 'tech_height', 'rope_chain', 'pleat', 'product', 'pieces_blind', 'bracket', 'decoration'].every(a => this.checker[a])) {

          this.pass()

        } else {
          this.emptychecker()
        }
      } else {
        if (['area', 'area_ref', 'tech_width', 'tech_height', 'pleat', 'rope_chain', 'product', 'pieces_blind', 'fabric', 'bracket'].every(a => this.checker[a])) {

          this.pass()

        } else {
          this.emptychecker()
        }
      }


    } else {
      if (['area', 'area_ref', 'tech_width', 'tech_height', 'product', 'bracket',
        'belt', 'hook'].every(a => this.checker[a])) {

        this.pass()

      } else {
        this.emptychecker()
      }
    }
  }

  emptychecker() {
    console.log('Error Empty')
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    })

    Toast.fire({
      icon: 'error',
      title: 'All checker must be checked before completion.'
    })
  }

  pass() {
    if (['width_tech', 'height_tech'].every(a => this.item[a])) {

      if (this.item['type'] == 'Tailor-Made Curtains' || this.item['type'] == 'Motorised Curtains') {

        this.item.price = this.price

        for (let i = 0; i < this.instPhoto.photos.length; i++) {
          this.item.photos.push(this.instPhoto.photos[i])
        }

        let temp = {
          no: this.item.no,
          height_tech: this.item.height_tech,
          width_tech: this.item.width_tech,
          bracket: this.item.bracket,
          belt: this.item.belt,
          hook: this.item.hook,
          track: this.item.track,
          track_sheer: this.item.track_sheer,
          sidehook: this.item.sidehook,
          touchfloor: this.item.touchfloor,
          sheer_bracket: this.item.sheer_bracket,
          sheer_belt: this.item.sheer_belt,
          sheer_hook: this.item.sheer_hook,
          sheer_sidehook: this.item.sheer_sidehook,
          sheer_touchfloor: this.item.sheer_touchfloor,
          custom_belt: this.item.custom_belt,
          custom_bracket: this.item.custom_bracket,
          custom_hook: this.item.custom_hook,
          custom_sheer_belt: this.item.custom_sheer_belt,
          custom_sheer_bracket: this.item.custom_sheer_bracket,
          custom_sheer_hook: this.item.custom_sheer_hook,
          price: this.item.price,
          photos: JSON.stringify(this.item.photos),
          status_tech: 'Approved',
          step: 3,
          remark_tech: this.item.remark_tech,
          remark_curtain: this.item.remark_curtain,
          remark_sheer: this.item.remark_sheer,
        }

        console.log(temp);

        Swal.fire({
          title: 'Complete Task',
          text: 'Complete task of "' + this.item.location + '". Are you sure?',
          icon: 'question',
          heightAuto: false,
          showConfirmButton: true,
          showCancelButton: true,
          reverseButtons: true,
          confirmButtonText: 'Yes, Complete',
          cancelButtonText: 'Cancel',
          cancelButtonColor: '#d33',
        }).then((y) => {
          if (y.isConfirmed) {
            let calcWidthUp = Math.round((this.item.width + (this.item.width * 10 / 100)) * 100) / 100
            let calcHeightUp = Math.round((this.item.height + (this.item.height * 10 / 100)) * 100) / 100
            let calcWidthDown = Math.round((this.item.width - (this.item.width * 10 / 100)) * 100) / 100
            let calcHeightDown = Math.round((this.item.height - (this.item.height * 10 / 100)) * 100) / 100

            console.log(calcWidthUp, calcHeightUp, calcWidthDown, calcHeightDown);

            if (this.item.width_tech != null || this.item.height_tech != null) {
              if (this.item.width_tech == null) {
                const Toast = Swal.mixin({
                  toast: true,
                  position: 'top',
                  showConfirmButton: false,
                  timer: 1500,
                  timerProgressBar: true,
                })

                Toast.fire({
                  icon: 'error',
                  title: 'Tech Width is empty.'
                })

              } else if (this.item.height_tech == null) {
                const Toast = Swal.mixin({
                  toast: true,
                  position: 'top',
                  showConfirmButton: false,
                  timer: 1500,
                  timerProgressBar: true,
                })

                Toast.fire({
                  icon: 'error',
                  title: 'Tech Height is empty.'
                })

              } else {

                if (this.item.width_tech > calcWidthUp || this.item.width_tech < calcWidthDown || this.item.height_tech > calcHeightUp || this.item.height_tech < calcHeightDown) {
                  this.rejectItem()
                } else {
                  this.http.post('https://curtain.vsnap.my/updateorders', temp).subscribe(a => {
                    this.model.dismiss(1)
                  })
                }
              }

            } else {
              this.http.post('https://curtain.vsnap.my/updateorders', temp).subscribe(a => {
                this.model.dismiss(1)
              })
            }
          }
        })

      } else if (this.item['type'] == 'Blinds') {
        this.item.pleat = this.BlindsChoice

        this.item.price = this.price

        for (let i = 0; i < this.instPhoto.photos.length; i++) {
          this.item.photos.push(this.instPhoto.photos[i])
        }

        let temp = {
          no: this.item.no,
          height_tech: this.item.height_tech,
          width_tech: this.item.width_tech,
          bracket: this.item.bracket,
          rope_chain: this.item.rope_chain,
          // belt: this.item.belt,
          // hook: this.item.hook,
          // sidehook: this.item.sidehook,
          custom_bracket: this.item.custom_bracket,
          // custom_belt: this.item.custom_belt,
          // custom_hook: this.item.custom_hook,
          // touchfloor: this.item.touchfloor,
          price: this.item.price,
          photos: JSON.stringify(this.item.photos),
          status_tech: 'Approved',
          step: 3,
          remark_tech: this.item.remark_tech
        }

        Swal.fire({
          title: 'Complete Task',
          text: 'Complete task of "' + this.item.location + '". Are you sure?',
          icon: 'success',
          heightAuto: false,
          showConfirmButton: true,
          showCancelButton: true,
          reverseButtons: true,
          confirmButtonText: 'Yes, Complete',
          cancelButtonText: 'Cancel',
          cancelButtonColor: '#d33',
        }).then((y) => {
          if (y.isConfirmed) {
            let calcWidthUp = Math.round((this.item.width + (this.item.width * 10 / 100)) * 100) / 100
            let calcHeightUp = Math.round((this.item.height + (this.item.height * 10 / 100)) * 100) / 100
            let calcWidthDown = Math.round((this.item.width - (this.item.width * 10 / 100)) * 100) / 100
            let calcHeightDown = Math.round((this.item.height - (this.item.height * 10 / 100)) * 100) / 100

            console.log(calcWidthUp, calcHeightUp, calcWidthDown, calcHeightDown);

            if (this.item.width_tech != null || this.item.height_tech != null) {
              if (this.item.width_tech == null) {
                const Toast = Swal.mixin({
                  toast: true,
                  position: 'top',
                  showConfirmButton: false,
                  timer: 1500,
                  timerProgressBar: true,
                })

                Toast.fire({
                  icon: 'error',
                  title: 'Tech Width is empty.'
                })

              } else if (this.item.height_tech == null) {
                const Toast = Swal.mixin({
                  toast: true,
                  position: 'top',
                  showConfirmButton: false,
                  timer: 1500,
                  timerProgressBar: true,
                })

                Toast.fire({
                  icon: 'error',
                  title: 'Tech Height is empty.'
                })

              } else {

                if (this.item.width_tech > calcWidthUp || this.item.width_tech < calcWidthDown || this.item.height_tech > calcHeightUp || this.item.height_tech < calcHeightDown) {
                  this.rejectItem()
                } else {
                  this.http.post('https://curtain.vsnap.my/updateorders', temp).subscribe(a => {
                    this.model.dismiss(1)
                  })
                }
              }

            } else {
              this.http.post('https://curtain.vsnap.my/updateorders', temp).subscribe(a => {
                this.model.dismiss(1)
              })
            }
          }
        })
      } else {
        this.item.pleat = this.WallpaperChoice

        console.log(this.item);

        if (['location', 'width', 'height', 'track', 'type', 'pleat', 'pieces', 'bracket', 'hook', 'sidehook', 'belt', 'others', 'touchfloor'].every(a => this.item[a])) {

          console.log('pass2');
          this.item.price = this.price
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

    } else {
      console.log('Error Empty')
      const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      })

      Toast.fire({
        icon: 'error',
        title: 'Tech Width/Height is required.'
      })
    }
  }

  updateTailor() {
    console.log(this.item);

    this.item.price = this.price

    Swal.fire({
      title: 'Update Task',
      text: 'Mark this task as Completed?',
      icon: 'question',
      heightAuto: false,
      showConfirmButton: true,
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: 'Completed',
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#d33',
    }).then((y) => {
      if (y.isConfirmed) {

        for (let i = 0; i < this.instPhoto.photos.length; i++) {
          this.item.photos.push(this.instPhoto.photos[i])
        }

        let temp = {
          no: this.item.no,
          photos: JSON.stringify(this.item.photos),
          status_tail: 'Completed',
          step: 4,
          remark_tail: this.item.remark_tail
        }

        console.log(temp);

        this.http.post('https://curtain.vsnap.my/updateorders', temp).subscribe(a => {
          this.model.dismiss(1)
        })
      }
    })

  }

  updateInstaller() {
    if (this.item['type'] == 'Tailor-Made Curtains' || this.item['type'] == 'Motorised Curtains') {
      console.log(this.item);

      this.item.price = this.price

      Swal.fire({
        title: 'Update Task',
        text: 'Mark this task as Completed?',
        icon: 'question',
        heightAuto: false,
        showConfirmButton: true,
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: 'Completed',
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#d33',
      }).then((y) => {
        if (y.isConfirmed) {

          for (let i = 0; i < this.instPhoto.photos.length; i++) {
            this.item.photos.push(this.instPhoto.photos[i])
          }

          let temp = {
            no: this.item.no,
            photos: JSON.stringify(this.item.photos),
            status_inst: 'Completed',
            step: 5,
            remark_inst: this.item.remark_inst
          }

          console.log(temp);

          this.http.post('https://curtain.vsnap.my/updateorders', temp).subscribe(a => {
            this.model.dismiss(1)
          })
        }
      })

    } else if (this.item['type'] == 'Blinds') {
      this.item.pleat = this.BlindsChoice

      console.log(this.item);

      console.log('pass2');
      this.item.price = this.price

      Swal.fire({
        title: 'Update Task',
        text: 'Mark this task as Completed?',
        icon: 'success',
        heightAuto: false,
        showConfirmButton: true,
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: 'Completed',
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#d33',
      }).then((y) => {
        if (y.isConfirmed) {

          for (let i = 0; i < this.instPhoto.photos.length; i++) {
            this.item.photos.push(this.instPhoto.photos[i])
          }

          let temp = {
            no: this.item.no,
            photos: JSON.stringify(this.item.photos),
            status_inst: 'Completed',
            step: 5,
            remark_inst: this.item.remark_inst
          }

          console.log(temp);
          this.http.post('https://curtain.vsnap.my/updateorders', temp).subscribe(a => {
            this.model.dismiss(1)
          })
        }
      })

    } else {
      this.item.pleat = this.WallpaperChoice

      console.log(this.item);

      console.log('pass2');
      this.item.price = this.price
      this.model.dismiss(this.item)

    }

  }

  rejectItem() {
    if (this.item['type'] == 'Tailor-Made Curtains' || this.item['type'] == 'Motorised Curtains') {

      this.item.price = this.price

      for (let i = 0; i < this.instPhoto.photos.length; i++) {
        this.item.photos.push(this.instPhoto.photos[i])
      }

      let temp = {
        no: this.item.no,
        height_tech: this.item.height_tech,
        width_tech: this.item.width_tech,
        track: this.item.track,
        track_sheer: this.item.track_sheer,
        bracket: this.item.bracket,
        belt: this.item.belt,
        hook: this.item.hook,
        sidehook: this.item.sidehook,
        touchfloor: this.item.touchfloor,
        pieces_curtain: this.item.pieces_curtain,
        pieces_sheer: this.item.pieces_sheer,
        sheer_bracket: this.item.sheer_bracket,
        sheer_belt: this.item.sheer_belt,
        sheer_hook: this.item.sheer_hook,
        sheer_sidehook: this.item.sheer_sidehook,
        sheer_touchfloor: this.item.sheer_touchfloor,
        custom_belt: this.item.custom_belt,
        custom_bracket: this.item.custom_bracket,
        custom_hook: this.item.custom_hook,
        custom_sheer_belt: this.item.custom_sheer_belt,
        custom_sheer_bracket: this.item.custom_sheer_bracket,
        custom_sheer_hook: this.item.custom_sheer_hook,
        price: this.item.price,
        photos: JSON.stringify(this.item.photos),
        status_tech: 'Rejected',
        step: 1,
        remark_tech: this.item.remark_tech
      }

      if (this.item.height_tech == null || this.item.width_tech == null) {

        const Toast = Swal.mixin({
          toast: true,
          position: 'top',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        })

        Toast.fire({
          icon: 'error',
          title: 'Tech Height & Width cannot be empty when rejecting.'
        })

      } else {

        Swal.fire({
          title: 'Width/Height Measurement Exceeded!',
          text: 'Order "' + this.item.location + '" will be mark as REJECTED. Continue?',
          icon: 'warning',
          heightAuto: false,
          showConfirmButton: true,
          showCancelButton: true,
          reverseButtons: true,
          confirmButtonText: 'Reject',
          cancelButtonText: 'Cancel',
          confirmButtonColor: '#d33',
        }).then((y) => {
          if (y.isConfirmed) {
            this.http.post('https://curtain.vsnap.my/updateorders', temp).subscribe(a => {
              this.model.dismiss(1)
            })
          }
        })
      }

    } else if (this.item['type'] == 'Blinds') {
      this.item.pleat = this.BlindsChoice

      this.item.price = this.price

      for (let i = 0; i < this.instPhoto.photos.length; i++) {
        this.item.photos.push(this.instPhoto.photos[i])
      }

      let temp = {
        no: this.item.no,
        height_tech: this.item.height_tech,
        width_tech: this.item.width_tech,
        bracket: this.item.bracket,
        rope_chain: this.item.rope_chain,
        // belt: this.item.belt,
        // hook: this.item.hook,
        // sidehook: this.item.sidehook,
        touchfloor: this.item.touchfloor,
        custom_bracket: this.item.custom_bracket,
        // custom_belt: this.item.custom_belt,
        // custom_hook: this.item.custom_hook,
        price: this.item.price,
        photos: JSON.stringify(this.item.photos),
        status_tech: 'Rejected',
        step: 1,
        remark_tech: this.item.remark_tech
      }

      console.log(temp);

      Swal.fire({
        title: 'Width/Height Measurement Exceeded!',
        text: 'Order "' + this.item.location + '" will be mark as REJECTED. Continue?',
        icon: 'error',
        heightAuto: false,
        showConfirmButton: true,
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: 'Reject',
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#d33',
      }).then((y) => {
        if (y.isConfirmed) {
          this.http.post('https://curtain.vsnap.my/updateorders', temp).subscribe(a => {
            this.model.dismiss(1)
          })
        }
      })
    } else {
      this.item.pleat = this.WallpaperChoice

      console.log(this.item);

      if (['location', 'width', 'height', 'track', 'type', 'pleat', 'pieces', 'bracket', 'hook', 'sidehook', 'belt', 'others', 'touchfloor'].every(a => this.item[a])) {

        console.log('pass2');
        this.item.price = this.price
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
    this.model.dismiss(1)
  }

  lengthof(x) {
    return x ? x.length : 0
  }

  pic = ""

  openPic(x) {
    this.pic = x
  }

  closePic(x) {
    this.pic = ''
  }

  deletePic(x) {

    // Swal.fire({
    //   title: 'Remove photo',
    //   text: 'Are your sure to remove the photo, action are irreversible?',
    //   icon: 'error',
    //   showCancelButton: true,
    //   showConfirmButton: true,
    //   reverseButtons: true,
    //   cancelButtonText: 'Cancel',
    //   confirmButtonText: 'Yes, Remove.',
    //   heightAuto: false,
    // }).then((y) => {
    // if (y.isConfirmed) {
    this.instPhoto.photos.splice(x, 1)
    console.log(this.instPhoto.photos);
    // }
    // })

  }

  opencamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.instPhoto['photos'].push('https://i.pinimg.com/originals/a2/dc/96/a2dc9668f2cf170fe3efeb263128b0e7.gif');

      let base64Image = 'data:image/jpeg;base64,' + imageData;

      this.http.post('https://forcar.vsnap.my/upload', { image: base64Image, folder: 'goalgame', userid: Date.now() }).subscribe((link) => {
        console.log(link['imageURL']);
        this.instPhoto['photos'][this.lengthof(this.instPhoto['photos']) - 1] = link['imageURL']
        console.log(this.instPhoto['photos']);

      });
    }, (err) => {
      // Handle error
    });
  }

  imagectype;
  imagec;
  base64img;
  instPhoto = { photos: [] as any } as any;

  fileChange(event, name, maxsize) {
    if (event.target.files && event.target.files[0] && event.target.files[0].size < (10485768)) {
      // this.imagectype = event.target.files[0].type;
      // EXIF.getData(event.target.files[0], () => {
      // console.log(event.target.files[0]);
      //  console.log(event.target.files[0].exifdata.Orientation);
      //  const orientation = EXIF.getTag(this, 'Orientation');
      const can = document.createElement('canvas');
      const ctx = can.getContext('2d');
      const thisImage = new Image;

      const maxW = maxsize;
      const maxH = maxsize;
      thisImage.onload = (a) => {
        // console.log(a);
        const iw = thisImage.width;
        const ih = thisImage.height;
        const scale = Math.min((maxW / iw), (maxH / ih));
        const iwScaled = iw * scale;
        const ihScaled = ih * scale;
        can.width = iwScaled;
        can.height = ihScaled;
        ctx.save();
        // const width = can.width; const styleWidth = can.style.width;
        // const height = can.height; const styleHeight = can.style.height;
        // console.log(event.target.files[0]);
        ctx.drawImage(thisImage, 0, 0, iwScaled, ihScaled);
        ctx.restore();
        this.imagec = can.toDataURL();
        // const imgggg = this.imagec.replace(';base64,', 'thisisathingtoreplace;');
        // const imgarr = imgggg.split('thisisathingtoreplace;');
        // this.base64img = imgarr[1];
        // event.target.value = '';
        this.instPhoto['photos'].push('https://i.pinimg.com/originals/a2/dc/96/a2dc9668f2cf170fe3efeb263128b0e7.gif');

        this.http.post('https://forcar.vsnap.my/upload', { image: this.imagec, folder: 'goalgame', userid: Date.now() }).subscribe((link) => {
          console.log(link['imageURL']);
          this.instPhoto['photos'][this.lengthof(this.instPhoto['photos']) - 1] = link['imageURL']
          console.log(this.instPhoto['photos']);

        });
      };
      thisImage.src = URL.createObjectURL(event.target.files[0]);

    } else {
      // S.close();
      alert('Your Current Image Too Large, ' + event.target.files[0].size / (10241024) + 'MB! (Please choose file lesser than 8MB)');
    }
  }
}



