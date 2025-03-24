import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
// import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActionSheetController, NavController, Platform } from '@ionic/angular';

// import { VideoPlayer } from '@awesome-cordova-plugins/video-player/ngx';
import { ActivatedRoute } from '@angular/router';

import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';

import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';

import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { Plugins } from '@capacitor/core';

import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

@Component({
  selector: 'app-task-check-in',
  templateUrl: './task-check-in.page.html',
  styleUrls: ['./task-check-in.page.scss'],
})
export class TaskCheckInPage implements OnInit {

  constructor(
    private http: HttpClient,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private nav: NavController,
    private locationAccuracy: LocationAccuracy,
    private platform: Platform,
    private diagnostic: Diagnostic,
    private cdr: ChangeDetectorRef,
    private camera: Camera,
    private actroute: ActivatedRoute,

  ) { }

  //Location
  open
  location = {} as any
  address = {} as any
  addressstring
  timerInterval: any;

  //Images
  photo = [] as any
  imageurl = ['https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg'] as any

  sales_id
  role
  checklist = {} as any
  checktype = 'in'
  checklog = [] as any

  ngOnInit() {

    this.actroute.queryParams.subscribe(a => {
      this.sales_id = JSON.parse(a["id"])
      this.role = a['role']
      console.log(this.sales_id);

      this.http.post('https://curtain.vsnap.my/getlatestcheckin', { sales_id: this.sales_id }).subscribe(a => {

        this.checklist = a['data']
        console.log(this.checklist);

        if (this.checklist) {
          if (this.checklist.check_type == 'in') {
            this.checktype = 'out'
          }
        }

      })

      this.http.post('https://curtain.vsnap.my/getallcheckin', { sales_id: this.sales_id }).subscribe(a => {

        this.checklog = a['data']
        console.log(this.checklog);

      })

    })



    this.requestLocationPermission();
    this.gpsstatuschecker();
    this.platformType();
    this.getaddress();
  }

  async gpsstatuschecker() {
    try {
      await this.geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 5000 });
      this.open = 0; // GPS is enabled
    } catch (error) {
      this.open = 1; // GPS might be off
      Swal.fire({
        text: 'Please switch on GPS',
        heightAuto: false,
      });
      setTimeout(() => this.gpsstatuschecker(), 5000); // Retry after a few seconds
    }
  }
  async requestLocationPermission() {
    await this.platform.ready();
    if (this.platform.is('android')) {
      try {
        await this.geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 5000 });
      } catch (error) {
        console.error("Error requesting location permission:", error);
        if (error.code === error.PERMISSION_DENIED) {
          Swal.fire({
            icon: "warning",
            title: "Permission Needed",
            text: "Please enable location access in settings.",
            heightAuto: false,
          });
        }
      }
    }
  }

  async getlocation(): Promise<void> {
    await this.platform.ready();

    Swal.fire({
      icon: 'info',
      title: 'Getting Location...',
      text: 'Please wait while we fetch your location.',
      heightAuto: false,
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const resp = await this.geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 });

      this.location.latitude = resp.coords.latitude;
      this.location.longitude = resp.coords.longitude;
      console.log("Location retrieved:", this.location);

      this.cdr.detectChanges(); // Force UI update
      Swal.close();
    } catch (error) {
      console.error("Error getting location:", error);
      let errorMsg = "Unknown error occurred.";
      if (error.code !== undefined) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "Location permission denied. Please allow access in settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMsg = "Location request timed out.";
            break;
        }
      } else {
        errorMsg = error.message;
      }
      Swal.fire({
        icon: "error",
        title: "Geolocation Error",
        text: errorMsg,
        heightAuto: false,
      });
    }
  }

  async convertlocation() {
    if (!this.location.latitude || !this.location.longitude) {
      console.error('Latitude or Longitude is missing.');
      return;
    }

    let geocoder = new google.maps.Geocoder();
    let latlng = { lat: this.location.latitude, lng: this.location.longitude };

    try {
      const results: google.maps.GeocoderResult[] = await new Promise((resolve, reject) => {
        geocoder.geocode({ location: latlng }, (results, status) => {
          if (status === 'OK') {
            resolve(results);
          } else {
            reject(status);
          }
        });
      });

      this.addressstring = results.length > 0 ? results[0].formatted_address : 'Undefined Address';
      this.cdr.detectChanges(); // Update UI
      Swal.close();
    } catch (error) {
      console.error('Geocoding error:', error);
      this.addressstring = 'Geocoding failed';
      Swal.close();
    }
  }

  async getaddress() {
    Swal.fire({
      icon: 'info',
      title: 'Getting location...',
      heightAuto: false,
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      // Step 1: Get Latitude & Longitude
      const resp = await this.geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 });
      this.location = {
        latitude: resp.coords.latitude,
        longitude: resp.coords.longitude
      };
      console.log("Location retrieved:", this.location);

      // Step 2: Convert Latitude & Longitude to Address
      let geocoder = new google.maps.Geocoder;
      let latlng = { lat: this.location.latitude, lng: this.location.longitude };

      const results: google.maps.GeocoderResult[] = await new Promise((resolve, reject) => {
        geocoder.geocode({ 'location': latlng }, (results, status) => {
          if (status === 'OK') {
            resolve(results);
          } else {
            reject(status);
          }
        });
      });

      // Step 3: Update Address in UI
      this.addressstring = results.length > 0 ? results[0].formatted_address : 'Undefined Address';
      console.log("Address retrieved:", this.addressstring);
    } catch (error) {
      console.error("Error getting location or address:", error);
      Swal.fire({
        icon: "error",
        title: "Geolocation Error",
        text: error.message || "Unknown error occurred.",
        heightAuto: false,
      });
    } finally {
      Swal.close();
    }
  }

  platformType() {
    return this.platform.platforms()
  }


  pic = ""

  openPic(x) {
    this.pic = x
  }

  closePic(x) {
    this.pic = ''
  }

  deletePic(x) {
    this.imageurl.splice(x, 1)
    console.log(this.imageurl);

  }

  opencamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true, // Auto-fix orientation (if supported)
      cameraDirection: this.camera.Direction.BACK // Open back camera by default
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.imageurl.push('https://i.pinimg.com/originals/a2/dc/96/a2dc9668f2cf170fe3efeb263128b0e7.gif');

      let base64Image = 'data:image/jpeg;base64,' + imageData;

      this.http.post('https://forcar.vsnap.my/upload', { image: base64Image, folder: 'goalgame', userid: Date.now() }).subscribe((link) => {
        console.log(link['imageURL']);
        this.imageurl[this.lengthof(this.imageurl) - 1] = link['imageURL']
        console.log(this.imageurl);

      });
    }, (err) => {
      // Handle error
    });
  }

  imagectype;
  imagec;
  base64img;

  fileChange(event, name, maxsize) {
    if (event.target.files && event.target.files[0] && event.target.files[0].size < (10485768)) {
      // this.imagectype = event.target.files[0].type;
      // EXIF.getData(event.target.files[0], () => {
      // console.log(event.target.files[0]);
      //  console.log(event.target.files[0].exifdata.Orientation);
      //  const orientation = EXIF.getTag(this, 'Orientation');
      const can = document.createElement('canvas');
      const ctx = can.getContext('2d');
      const thisImage = new Image;

      const maxW = maxsize;
      const maxH = maxsize;
      thisImage.onload = (a) => {
        // console.log(a);
        const iw = thisImage.width;
        const ih = thisImage.height;
        const scale = Math.min((maxW / iw), (maxH / ih));
        const iwScaled = iw * scale;
        const ihScaled = ih * scale;
        can.width = iwScaled;
        can.height = ihScaled;
        ctx.save();
        // const width = can.width; const styleWidth = can.style.width;
        // const height = can.height; const styleHeight = can.style.height;
        // console.log(event.target.files[0]);
        ctx.drawImage(thisImage, 0, 0, iwScaled, ihScaled);
        ctx.restore();
        this.imagec = can.toDataURL();
        // const imgggg = this.imagec.replace(';base64,', 'thisisathingtoreplace;');
        // const imgarr = imgggg.split('thisisathingtoreplace;');
        // this.base64img = imgarr[1];
        // event.target.value = '';
        this.imageurl.push('https://i.pinimg.com/originals/a2/dc/96/a2dc9668f2cf170fe3efeb263128b0e7.gif');

        this.http.post('https://forcar.vsnap.my/upload', { image: this.imagec, folder: 'goalgame', userid: Date.now() }).subscribe((link) => {
          console.log(link['imageURL']);
          this.imageurl[this.lengthof(this.imageurl) - 1] = link['imageURL']
          console.log(this.imageurl);

        });
      };
      thisImage.src = URL.createObjectURL(event.target.files[0]);

    } else {
      // S.close();
      alert('Your Current Image Too Large, ' + event.target.files[0].size / (10241024) + 'MB! (Please choose file lesser than 8MB)');
    }
  }

  submit() {
    let temp = {
      sales_id: this.sales_id,
      role_type: this.role,
      check_time: new Date().getTime(),
      check_type: this.checktype,
      check_address: this.addressstring,
      check_lat: this.location.latitude,
      check_long: this.location.longitude,
      check_image: JSON.stringify(this.imageurl),
    }

    console.log(temp);

    if (this.imageurl.length <= 0) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      })

      Toast.fire({
        icon: 'error',
        title: 'At least ONE(1) image is needed.'
      })
    } else {

      Swal.fire({
        title: 'Check ' + this.checktype,
        text: 'Are you sure to check-' + this.checktype + ' with these info?',
        heightAuto: false,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Check ' + this.checktype,
        reverseButtons: true,
      }).then((y) => {
        if (y.isConfirmed) {
          this.http.post('https://curtain.vsnap.my/insertcheckin', temp).subscribe(a => {

            Swal.fire({
              icon: 'success',
              title: 'Status',
              text: 'Checked ' + this.checktype + ' Successfully',
              timer: 2000,
              heightAuto: false

            })

            this.nav.pop()

          })
        }
      })

    }

  }

  back() {
    this.nav.pop()
  }

  lengthof(x) {
    return x ? x.length : 0
  }

}
