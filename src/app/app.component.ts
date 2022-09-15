import { Component } from '@angular/core';
import firebase from 'firebase';
import { firebaseConfig } from './app.firebase.config';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { Market } from '@ionic-native/market/ngx';
import { Platform } from '@ionic/angular';
// import { version } from 'process';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  constructor(
    private screenOrientation: ScreenOrientation,
    private market: Market,
    private platform: Platform,
    private fcm: FCM,
  ) {

    let version = '000001'

    firebase.initializeApp(firebaseConfig)
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    if (this.platform.is('ios') && this.lengthof(this.fcm) > 0) {
      this.fcm.requestPushPermission({
        ios9Support: {
          timeout: 10,  // How long it will wait for a decision from the user before returning `false`
          interval: 1, // How long between each permission verification
        }
      }).then(a => { console.log(a) }).catch(e => {
        console.log(e)
      })
    }

    // firebase.database().ref('/version/' + version).on('value', data => {
    //   if (data.val() == true) {

    //   } else {
    //     if (platform.is('ios')) {
    //       // this.market.open('com.curtain_library.user');
    //     } else {
    //       this.market.open('com.curtain_library.user');
    //     }
    //   }
    // })
  }

  lengthof(x) {
    return x ? Object.keys(x).length : 0
  }
  

}
