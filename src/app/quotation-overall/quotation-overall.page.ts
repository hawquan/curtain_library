import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-quotation-overall',
  templateUrl: './quotation-overall.page.html',
  styleUrls: ['./quotation-overall.page.scss'],
})
export class QuotationOverallPage implements OnInit {

  constructor(
    private actroute: ActivatedRoute,
    private nav : NavController,
  ) { }

  item = []

  ngOnInit() {

    this.actroute.queryParams.subscribe(a => {
      this.item = JSON.parse(a["items"])
      console.log(this.item);
    })
  }

  back(){
    this.nav.pop()
  }

}
