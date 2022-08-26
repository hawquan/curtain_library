import { Component } from '@angular/core';
import firebase from 'firebase';
import { firebaseConfig } from './app.firebase.config';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private screenOrientation: ScreenOrientation
  ) {
    firebase.initializeApp(firebaseConfig)
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }
}
