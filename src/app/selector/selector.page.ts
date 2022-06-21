import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.page.html',
  styleUrls: ['./selector.page.scss'],
})
export class SelectorPage implements OnInit {

  constructor(private modalController: ModalController, private navparam: NavParams) { }
  array = [] as any;
  keyword = ''

  ngOnInit() {
    this.array = this.navparam.get('array')
    // console.log(this.navparam.get('array'));

  }

  filter(x) {
    return x.filter(a => ((a['name'] || '').toLowerCase()).includes(this.keyword.toLowerCase()))
  }

  done(x) {
    this.modalController.dismiss({
      value: x
    });
  }


  back() {
    this.modalController.dismiss();
  }
}