import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.page.html',
  styleUrls: ['./selector.page.scss'],
})
export class SelectorPage implements OnInit {

  constructor(
    private modalController: ModalController,
    private navparam: NavParams,
    private http: HttpClient,
  ) { }
  array = [] as any;
  arrayOrigin = [] as any;
  type
  keyword = ''
  loading = false

  ngOnInit() {
    if (this.navparam.get('array') == 'curtain') {
      this.http.get('https://curtain.vsnap.my/curtainfabriclist').subscribe((s) => {
        this.array = s['data']
        this.arrayOrigin = this.array
        this.loading = true
        console.log(this.array);
      })
    } else if (this.navparam.get('array') == 'sheer') {
      this.http.get('https://curtain.vsnap.my/sheerfabriclist').subscribe((s) => {
        this.array = s['data']
        this.arrayOrigin = this.array
        this.loading = true
        console.log(this.array);
      })
    } else if (this.navparam.get('array') == 'curtainsheer') {
      this.http.get('https://curtain.vsnap.my/curtainsheerfabriclist').subscribe((s) => {
        this.array = s['data']
        this.arrayOrigin = this.array
        this.loading = true
        console.log(this.array);
      })
    } else if (this.navparam.get('array') == 'blind') {
      console.log(this.navparam.get('category'));
      this.http.get('https://curtain.vsnap.my/blindfabriclist').subscribe((s) => {
        this.array = s['data'].filter(a => a.type_category == this.navparam.get('category')).sort((a, b) => (a['type_category'] > b['type_category'] ? 1 : -1) && (a['name'] > b['name'] ? 1 : -1) && (a['id'] > b['id'] ? 1 : -1))
        this.arrayOrigin = this.array
        this.loading = true
        console.log(this.array);
      })
    } else {
      this.array = this.navparam.get('array')
      this.arrayOrigin = this.array
      this.loading = true
      console.log(this.array);
    }
    this.type = this.navparam.get('type')

    console.log(this.type);


  }

  filter() {
    this.array = this.arrayOrigin.filter(a => ((a['name'] || '').toLowerCase()).includes(this.keyword.toLowerCase()))
  }

  done(x) {
    console.log(x);

    this.modalController.dismiss({
      value: x
    });
  }


  back() {
    this.modalController.dismiss();
  }
}