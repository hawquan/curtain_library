import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-ongoing-view-quotation',
  templateUrl: './task-ongoing-view-quotation.page.html',
  styleUrls: ['./task-ongoing-view-quotation.page.scss'],
})
export class TaskOngoingViewQuotationPage implements OnInit {

  constructor(
    private actroute: ActivatedRoute,
    private nav: NavController,
    private http: HttpClient,
  ) { }

  item = [] as any
  sales_id = 0
  info = []
  pleatlist = []
  blindlist = []
  tracklist = []
  fabriclist = []
  fabricCurtain = []
  fabricSheer = []
  fabricLining = []

  calc = [] as any
  loading = false
  count = 0

  ngOnInit() {

    this.actroute.queryParams.subscribe(a => {
      this.sales_id = a['sales_id']
      this.pleatlist = JSON.parse(a["pleatlist"])
      this.blindlist = JSON.parse(a["blindlist"])
      this.tracklist = JSON.parse(a["tracklist"])

      this.http.get('https://curtain.vsnap.my/fabricList').subscribe((s) => {
        this.fabriclist = s['data']
        this.fabricCurtain = this.fabriclist.filter(x => x.type == 'Curtain')
        this.fabricSheer = this.fabriclist.filter(x => x.type == 'Sheer')
        this.fabricLining = this.fabriclist.filter(x => x.type == 'Lining')

        this.http.post('https://curtain.vsnap.my/getorderlist', { sales_id: this.sales_id }).subscribe(a => {
          this.item = a['data'].sort((a, b) => a.no - b.no)

          console.log(this.item, this.sales_id, this.pleatlist, this.blindlist, this.tracklist, this.fabriclist);

          this.loop()

        })
      })

    })
  }

  loop() {
    console.log(this.count);
    this.calcPrice(this.count)
  }

  totalPrice() {
    let total = 0
    for (let i = 0; i < this.item.length; i++) {
      total += this.item[i].price
    }
    return total || 0
  }


  calcPrice(i) {

    let width = 0
    let height = 0
    if (this.item[i].height_tech != null || this.item[i].width_tech != null) {
      width = this.item[i].width_tech
      height = this.item[i].height_tech
    } else {
      width = this.item[i].width
      height = this.item[i].height
    }

    let curtain = false
    let curtain_id
    let lining = false
    let lining_id
    let sheer = false
    let sheer_id
    let track = false
    let track_id

    let pleat_id

    console.log(this.item[i]);


    if (this.item[i].curtain != 'Blinds') {

      if (this.item[i].fabric != null && this.item[i].fabric != 'NA') {
        curtain = true
        curtain_id = this.fabricCurtain.filter(x => x.name == this.item[i].fabric)[0]['id']
      } else {
        curtain = false
      }

      if (this.item[i].fabric_lining != null && this.item[i].fabric_lining != 'NA') {
        lining = true
        lining_id = this.fabricLining.filter(x => x.name == this.item[i].fabric_lining)[0]['id']
      } else {
        lining = false
      }

      if (this.item[i].fabric_sheer != null && this.item[i].fabric_sheer != 'NA') {
        sheer = true
        sheer_id = this.fabricSheer.filter(x => x.name == this.item[i].fabric_sheer)[0]['id']
      } else {
        sheer = false
      }

      if (this.item[i].track != null && this.item[i].track != 'NA') {
        track = true
        track_id = this.tracklist.filter(x => x.name == this.item[i].track)[0]['id']
      } else {
        track = false
      }

      if (this.item[i].pleat != null && this.item[i].pleat != '') {
        pleat_id = this.pleatlist.filter(x => x.name == this.item[i].pleat)[0]['id']
      }

    } else {
      curtain = false
      sheer = false
      track = false
      lining = false

      if (this.item[i].pleat != null && this.item[i].pleat != '') {
        pleat_id = this.pleatlist.filter(x => x.name == this.item[i].pleat)[0]['id']
      }

    }

    let temp = {
      width: width, height: height, curtain: curtain, lining: lining, lining_id: lining_id,
      curtain_id: curtain_id, sheer: sheer, sheer_id: sheer_id, track: track, track_id: track_id, pleat_id: pleat_id
    }

    console.log(temp);

    this.http.post('https://curtain.vsnap.my/calcPrice', temp).subscribe(a => {

      this.calc.push(a['data'])
      this.count++
      if (this.calc.length != this.item.length) {
        this.loop()
      }
      console.log(this.calc);

      if (this.calc.length == this.item.length) {
        console.log('finish');

        Swal.close()
        this.loading = true
      }

    })

  }

  lengthof(x) {
    return Object.keys(x || {}).length
  }
  back() {
    this.nav.pop()
  }

}

