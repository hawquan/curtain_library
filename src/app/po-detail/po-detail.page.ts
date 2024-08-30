import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { SafariViewController } from '@awesome-cordova-plugins/safari-view-controller/ngx';
import { ActionSheetController, AlertController, ModalController, NavController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { PoDetailUpdatePage } from '../po-detail-update/po-detail-update.page';

@Component({
  selector: 'app-po-detail',
  templateUrl: './po-detail.page.html',
  styleUrls: ['./po-detail.page.scss'],
})
export class PoDetailPage implements OnInit {
  constructor(
    private nav: NavController,
    private actroute: ActivatedRoute,
    public modal: ModalController,
    private http: HttpClient,
    private actionSheetController: ActionSheetController,
    private safariViewController: SafariViewController,
    private alertController: AlertController
  ) { }

  poData
  groupedCurtainItems = [] as any
  groupedLiningItems = [] as any
  groupedSheerItems = [] as any
  groupedBlind = [] as any
  groupedMechanismItems = [] as any

  sales_id

  loading = false
  show1 = null

  statusList = [] as any

  ngOnInit() {

    this.actroute.queryParams.subscribe(a => {

      this.sales_id = a['sales_id']
      console.log(this.sales_id);

      this.http.get('https://curtain.vsnap.my/getallpurchasestatus').subscribe(s => {
        this.statusList = s['data']
        console.log(this.statusList);
      })

      this.http.post('https://curtain.vsnap.my/getpurchase', { sales_id: this.sales_id }).subscribe(s => {
        this.poData = s['data'][0]

        this.groupedCurtainItems = this.poData.po_curtain
        this.groupedLiningItems = this.poData.po_lining
        this.groupedSheerItems = this.poData.po_sheer
        this.groupedBlind = this.poData.po_blind
        this.groupedMechanismItems = this.poData.po_mechanism

        this.loading = true
        console.log(this.poData);

      })

    })


  }

  refresh() {
    this.http.post('https://curtain.vsnap.my/getpurchase', { sales_id: this.sales_id }).subscribe(s => {
      this.poData = s['data'][0]

      this.groupedCurtainItems = this.poData.po_curtain
      this.groupedLiningItems = this.poData.po_lining
      this.groupedSheerItems = this.poData.po_sheer
      this.groupedBlind = this.poData.po_blind
      this.groupedMechanismItems = this.poData.po_mechanism

      this.loading = true
      console.log(this.poData);

    })
  }

  async updateOrder(x, y) {

    const modal = await this.modal.create({
      cssClass: 'task',
      component: PoDetailUpdatePage,
      componentProps: {
        fabric: x,
        target: y,
        sales_id: this.sales_id,
      }
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    // x = data
      this.refresh()

  }

  back() {
    this.nav.pop()
  }

}
