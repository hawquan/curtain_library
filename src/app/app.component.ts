import { Component } from '@angular/core';
import firebase from 'firebase';
import { firebaseConfig } from './app.firebase.config';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { Market } from '@ionic-native/market/ngx';
import { Platform } from '@ionic/angular';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {

  bundle = {}
  currentPlatform = ''

  constructor(
    private screenOrientation: ScreenOrientation,
    private market: Market,
    private platform: Platform,
    private fcm: FCM,
  ) {

    let version = '000010'
    // ionic cordova build android --release -- -- --packageType=bundle
    // jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore curtain.jks app-release.aab curtain 
    // curtain12345
    // D:\Sdk\build-tools\32.0.0\zipalign -v 4 app-release.aab curtain0.0.7.aab 
    firebase.initializeApp(firebaseConfig)
    this.platform.ready().then(() => {
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
  
      firebase.database().ref('/bundle').once('value', bund => {
        this.bundle = bund.val()
        this.currentPlatform = this.platform.is('android') ? 'android' : 'ios'
  
        firebase.database().ref('/version/' + this.currentPlatform + '/' + version).on('value', data => {
          let canProceed = data.val()
          if (canProceed != true) {
            //show modal cant close one
  
          }
        })
      })
    })
    

  }

  goMarket() {
    this.market.open(this.bundle[this.currentPlatform])
  }

  lengthof(x) {
    return x ? Object.keys(x).length : 0
  }


}
