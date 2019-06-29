{
  "use strict";

  var posX = 0;
  var posY = 10;
  var posZ = 10;

  var asset = {name: "ninja", path:"images/ninja2_grey_head.jpg"};
  var camera = document.querySelector('#cameraWrapper');

   function loadImage (asset) {
     return new Promise((resolve) => {
       let img = new Image();
       img.setAttribute('data-name', asset.name);
       img.crossOrigin = "Anonymous";
       img.onload = () => resolve(img);
       img.src = asset.path;
     })
   }
function init() {
   loadImage(asset).then(image => {
       var w = image.width;
       var h = image.height;

       var canvas = document.createElement('canvas');
       var ctx = canvas.getContext("2d");
       ctx.imageSmoothingEnabled = true;
       canvas.width = w;
       canvas.height = h;

       ctx.drawImage(image, 0, 0, w, h);

       var sceneEl = document.querySelector('a-scene');
       if (sceneEl) {
         genGraph(sceneEl, ctx, w, h);
       } else {
         console.log('scene not found');
       }
   })
}
   function genGraph(sceneEl, ctx, w, h) {

     var getPixel = function(x, y) {
       let i = ( x + y * imgwidth ) * 4;
       return {r: imgdata[i], g: imgdata[i+1], b: imgdata[i+2], a: imgdata[i+3]};
     };

     var setPixel = function(x, y, color) {
       if (color == undefined) {
         color = { r: 0, g:0, b:0, a:255};
       }

       var tmp_col = "rgb("+color.r+","+color.g+","+color.b+")";

       var col = w3color(tmp_col, false);
       col.desaturate(.5);

       var hauteur = .01+color.b/250;

       var cyl = document.createElement('a-cylinder');
       cyl.setAttribute('material', {color: col.toHexString()});
       cyl.setAttribute('position', {x: .1+x/10-6, y: hauteur/2, z:.1+y/10-6});
       cyl.setAttribute('height', hauteur);
       cyl.setAttribute('radius', ".1");
       cyl.setAttribute('rotation', {x: 0, y: 180, z:0});
       sceneEl.appendChild(cyl);
     };


     var imageRef = ctx.getImageData( 0, 0, w, h );
     var imgdata = imageRef.data;
     var imgwidth = imageRef.width;

     let pixelmap = [];

      for (let x = 0; x < w; x++) {
         pixelmap[x] = [];
         for (let y = 0; y < h; y++) {
           pixelmap[x][y] = getPixel(x, y);
         }
       }
       //console.log(pixelmap);
       for (let x = 0; x < w; x += 2) {
         for (let y = 0; y < h; y += 2) {
             setPixel(x, y, pixelmap[x][y]);
         }
       }

    }


  function keyPressed (e) {
      e.preventDefault();
      console.log(e.keyCode);

      // Documentation about keyboard events :
      //    https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
      const DOWN_ARROW = 40;
      const LEFT_ARROW = 37;
      const RIGHT_ARROW = 39;
      const UP_ARROW = 38;
      const BACKSPACE = 8;
      const ESCAPE = 27;
      const KEY_X = 88;

      switch (e.keyCode) {
        case KEY_X:{
            var link = document.getElementById('page4');
            if (link) {
              link.click();
            } else {
              console.log('link to page4 not found');
            }
            break;
        }
        case ESCAPE:{
            camera.setAttribute('position', {x:posX, y:posY, z:posZ});
            camera.setAttribute('rotation', {x:0, y:45, z:0});
            break;
        }
        case LEFT_ARROW:{
            let pos = camera.getAttribute('position');
            pos.y += .1;
            camera.setAttribute('position', pos);
            break;
        }
        case RIGHT_ARROW:{
          let pos = camera.getAttribute('position');
          pos.y += -.1;
          camera.setAttribute('position', pos);
            break;
        }
        case UP_ARROW:{
          let pos = camera.getAttribute('position');
          pos.z += -.1;
          camera.setAttribute('position', pos);
            break;
        }
        case DOWN_ARROW:{
          let pos = camera.getAttribute('position');
          pos.z += .1;
          camera.setAttribute('position', pos);
            break;
        }
      }
    }

  function keyReleased (e) {
      e.preventDefault();
      // TODO : find something to implement here ;)
  }

  document.addEventListener('keydown', keyPressed, false);
  document.addEventListener('keyup', keyReleased, false);

  document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");
    init();
  }, false);
}
