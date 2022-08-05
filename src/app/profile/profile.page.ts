import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as EXIF from 'exif-js';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import firebase from 'firebase';

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

  imgurheaders = new HttpHeaders({
    'Authorization': 'Client-ID 2dc0beb00bb3279'
    // f425e102d31b175576a219bc7d3ba8ad82d85364
    // CHANGE TO YOUR OWN ID
  });

  imgur(event, maxsize) {

    return new Promise((resolve, reject) => {
      if (event.target.files && event.target.files[0] && event.target.files[0].size < (10485768)) {
        let imagectype = event.target.files[0].type;
        EXIF.getData(event.target.files[0], () => {
          console.log(event.target.files[0])
          console.log(event.target.files[0].exifdata.Orientation);
          var orientation = EXIF.getTag(this, "Orientation");
          var can = document.createElement('canvas');
          var ctx = can.getContext('2d');
          var thisImage = new Image;

          var maxW = maxsize;
          var maxH = maxsize;
          thisImage.onload = (a) => {

            console.log(a)
            var iw = thisImage.width;
            var ih = thisImage.height;
            var scale = Math.min((maxW / iw), (maxH / ih));
            var iwScaled = iw * scale;
            var ihScaled = ih * scale;
            can.width = iwScaled;
            can.height = ihScaled;
            ctx.save();
            var width = can.width; var styleWidth = can.style.width;
            var height = can.height; var styleHeight = can.style.height;
            console.log(event.target.files[0])
            if (event.target.files[0] && event.target.files[0].exifdata.Orientation) {
              console.log(event.target.files[0].exifdata.Orientation)
              if (event.target.files[0].exifdata.Orientation > 4) {
                can.width = height; can.style.width = styleHeight;
                can.height = width; can.style.height = styleWidth;
              }
              switch (event.target.files[0].exifdata.Orientation) {
                case 2: ctx.translate(width, 0); ctx.scale(-1, 1); break;
                case 3: ctx.translate(width, height); ctx.rotate(Math.PI); break;
                case 4: ctx.translate(0, height); ctx.scale(1, -1); break;
                case 5: ctx.rotate(0.5 * Math.PI); ctx.scale(1, -1); break;
                case 6: ctx.rotate(0.5 * Math.PI); ctx.translate(0, -height); break;
                case 7: ctx.rotate(0.5 * Math.PI); ctx.translate(width, -height); ctx.scale(-1, 1); break;
                case 8: ctx.rotate(-0.5 * Math.PI); ctx.translate(-width, 0); break;
              }
            }

            ctx.drawImage(thisImage, 0, 0, iwScaled, ihScaled);
            ctx.restore();

            let imagec = can.toDataURL();
            this.user['photo'] = imagec;
            let imgggg = imagec.replace(';base64,', "thisisathingtoreplace;")
            let imgarr = imgggg.split("thisisathingtoreplace;")
            let base64img = imgarr[1]
            event.target.value = ''

            let body = {
              image: base64img // this is the base64img from upper part
            }
            // this.http.post('https://dpitbsic67.execute-api.ap-southeast-1.amazonaws.com/dev/upload', { image: imagec, folder: 'surefeet', userid: 'surefeet' }).subscribe((link) => {
            //   // eval(name + '="' + link['imageURL'] + '"');

            //   console.log(link['imageURL'])
            //   this.user.image = link['imageURL']

            // }, awe => {
            //   console.log(awe)
            //   reject(awe)
            // })

          }
          thisImage.src = URL.createObjectURL(event.target.files[0]);
          // eval('this.'+el+'.nativeElement.value = null;')
        });
      } else {
        reject("Your Current Image Too Large, " + event.target.files[0].size / (10241024) + "MB! (Please choose file lesser than 8MB)")
      }
    })

  }

  fileChange(x, y, z) {
    this.imgur(x, y).then(a => {
      eval(z + "=a")
    })
  }

  back() {
    this.nav.pop()
  }

}
