import { Component } from '@angular/core';
import firebase from 'firebase';
import { firebaseConfig } from './app.firebase.config';
// import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { Market } from '@ionic-native/market/ngx';
import { Platform } from '@ionic/angular';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import Swal from 'sweetalert2';
import { SafariViewController } from '@awesome-cordova-plugins/safari-view-controller/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {

  bundle = {}
  currentPlatform = ''

  constructor(
    // private screenOrientation: ScreenOrientation,
    private market: Market,
    private platform: Platform,
    private fcm: FCM,
    private safariViewController: SafariViewController,
    private inAppBrowser: InAppBrowser
  ) {

    let version = '000035'
    // ionic cordova build android --release -- -- --packageType=bundle
    // jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore curtain.jks app-release.aab curtain
    // curtain12345
    // D:\Sdk\build-tools\32.0.0\zipalign -v 4 app-release.aab curtain0.0.28.aab
    firebase.initializeApp(firebaseConfig)
    this.platform.ready().then(() => {
      // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

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
            if (this.currentPlatform == 'android') {

              Swal.fire({
                icon: 'warning',
                title: 'New Version Available',
                text: 'Please update your app in your Application Store',
                heightAuto: false,
                showConfirmButton: true,
                showCancelButton: false,
                confirmButtonText: 'To Update',
                allowOutsideClick: false,
                allowEscapeKey: false,
              }).then((a) => {
                if (a.isConfirmed) {
                  window.open("https://play.google.com/store/apps/details?id=com.curtainlibrary.user", "_system");
                }
              })
            } else if (this.currentPlatform == 'ios') {
              // Swal.fire({
              //   icon: 'warning',
              //   title: 'New Version Available',
              //   text: 'Please Check TestFlight or Contact Management for latest version',
              //   heightAuto: false,
              //   showConfirmButton: true,
              //   showCancelButton: false,
              //   allowOutsideClick: false,
              //   allowEscapeKey: false,
              // })
              Swal.fire({
                icon: 'warning',
                title: 'New Version Available',
                text: 'Please update your app with the link provided by Dev or Click the Update button.',
                heightAuto: false,
                showConfirmButton: true,
                showCancelButton: false,
                confirmButtonText: 'To Update',
                allowOutsideClick: false,
                allowEscapeKey: false,
              }).then((a) => {
                // if (a.isConfirmed) {
                //   window.open("https://apps.apple.com/us/app/curtain-library/id1645866855", "_system");
                // }

                // this.safariViewController.isAvailable()
                //   .then(async (available: boolean) => {
                //     if (available) {

                //       this.safariViewController.show({
                //         url: "https://apps.apple.com/us/app/curtain-library/id1645866855",
                //       })
                //         .subscribe((result: any) => {
                //           if (result.event === 'opened') console.log('Opened');
                //           else if (result.event === 'loaded') console.log('Loaded');
                //           else if (result.event === 'closed') console.log('Closed');
                //         },
                //           (error: any) => console.error(error)
                //         );

                //     } else {
                //       window.open("https://apps.apple.com/us/app/curtain-library/id1645866855", '_system');
                //       // use fallback browser, example InAppBrowser
                //     }
                //   }).catch(async (error) => {
                //     window.open("https://apps.apple.com/us/app/curtain-library/id1645866855", '_system');
                //   })
                this.openURL()
              })
            }

          }
          //  else {
          //   Swal.fire({
          //     icon: 'success',
          //     title: 'Version Match',
          //     text: 'Continue',
          //     heightAuto: false,
          //   })

          // }

        })
      })
    })

  }

  async openURL() {
    try {
      const url = 'https://apps.apple.com/us/app/curtain-library/id1645866855';
      const target = '_system';
      const options: string = 'location=yes,toolbar=yes,closebuttoncaption=Close';

      const browser = this.inAppBrowser.create(url, target, options);

      browser.on('loadstart').subscribe((event) => {
        // Do something when the URL starts loading.
      });

      browser.on('loadstop').subscribe((event) => {
        // Do something when the URL has finished loading.
      });

      browser.on('loaderror').subscribe((event) => {
        // Handle any error that occurs while loading the URL.
        console.error(event);
      });

      browser.on('exit').subscribe(() => {
        // Handle when the InAppBrowser is closed.
      });
    } catch (error) {
      // Handle any other errors that may occur.
      console.error(error);
    }
  }

  goMarket() {
    this.market.open(this.bundle[this.currentPlatform])
  }

  lengthof(x) {
    return x ? Object.keys(x).length : 0
  }


}
