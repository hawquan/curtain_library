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
