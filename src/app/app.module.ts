import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// Import
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Market } from '@ionic-native/market/ngx';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';

import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { SafariViewController } from '@awesome-cordova-plugins/safari-view-controller/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [DatePipe ,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, File, FileOpener,Market,Camera,FCM,SafariViewController],
  bootstrap: [AppComponent],
})
export class AppModule {}
