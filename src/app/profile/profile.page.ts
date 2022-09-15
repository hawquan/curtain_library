import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as EXIF from 'exif-js';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import firebase from 'firebase';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    private nav: NavController,
    private actRoute: ActivatedRoute,
    private http: HttpClient,
  ) { }

  user = [] as any

  ngOnInit() {

    this.actRoute.queryParams.subscribe(a => {
      this.http.post('https://curtain.vsnap.my/onestaff', { id: a.id }).subscribe((s) => {
        this.user = s['data'][0]
        console.log(this.user);
      })
    })

  }

  update() {
    if (this.user['name'] == null || this.user['name'] == '') {

      const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      })

      Toast.fire({
        icon: 'error',
        title: 'Name Cannot be Empty.'
      })

    } else if (this.user['phone'] == null || this.user['phone'] == '') {

      const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      })

      Toast.fire({
        icon: 'error',
        title: 'Phone Cannot be Empty.'
      })

    } else {

      let temp = {
        id: this.user.id,
        name: this.user['name'] || '',
        phone: this.user['phone'] || 0,
        photo: this.user['photo'],
      }

      console.log(temp);
      Swal.fire({
        title: 'Update Profile',
        text: "Old data will be replaced, are you sure?",
        icon: 'question',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm',
        reverseButtons: true,
        heightAuto: false,
      }).then((result) => {

        if (result.isConfirmed) {

          this.http.post('https://curtain.vsnap.my/updatestaffs', temp).subscribe(a => {
            console.log(a);

            if (a['message']) {

              Swal.fire({
                icon: 'success',
                title: 'Update Successfully',
                text: 'New data has been updated',
                timer: 3000,
                heightAuto: false

              })

            }
          }, e => {

            Swal.fire({
              icon: 'error',
              title: 'Update Fail',
              text: 'Please try again later',
              timer: 3000,
              heightAuto: false

            })
          })
        }
      })
    }

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
        this.user['photo'] = 'https://i.pinimg.com/originals/a2/dc/96/a2dc9668f2cf170fe3efeb263128b0e7.gif';

        this.http.post('https://forcar.vsnap.my/upload', { image: this.imagec, folder: 'goalgame', userid: Date.now() }).subscribe((link) => {
          console.log(link['imageURL']);
          this.user['photo'] = link['imageURL']
          console.log(this.user['photo']);

        });
      };
      thisImage.src = URL.createObjectURL(event.target.files[0]);

    } else {
      // S.close();
      alert('Your Current Image Too Large, ' + event.target.files[0].size / (10241024) + 'MB! (Please choose file lesser than 8MB)');
    }
  }

  lengthof(x) {
    return x ? x.length : 0
  }


  back() {
    this.nav.pop()
  }

}
