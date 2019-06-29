
var nb_iter_max = 0;
var flag_posterize = false;
var level_posterized = 4;
var canvas;

var asset = {name: "ninja", path:"images/ninja2.jpg"};

function posterize(ctx, w, h, levels) {
  var imageRef = ctx.getImageData( 0, 0, w, h );
  var numLevels = parseInt(levels,10)||1;
  var data = imageRef.data;

  numLevels = Math.max(2,Math.min(256,numLevels));

  var numAreas = 256 / numLevels;
  var numValues = 255 / (numLevels-1);

  var w4 = w*4;
  var y = h;
  do {
    let offsetY = (y-1)*w4;
    let x = w;
    do {
      let offset = offsetY + (x-1)*4;

      let r = numValues * ((data[offset] / numAreas)>>0);
      let g = numValues * ((data[offset+1] / numAreas)>>0);
      let b = numValues * ((data[offset+2] / numAreas)>>0);

      if (r > 255) r = 255;
      if (g > 255) g = 255;
      if (b > 255) b = 255;

      data[offset] = r;
      data[offset+1] = g;
      data[offset+2] = b;

    } while (--x);
  } while (--y);

  ctx.putImageData( imageRef, 0, 0 );
}


function clearImageData(data) {
    for ( var i = 0, l = data.length; i < l; i += 4 ) {
        data[ i ] = 0;
        data[ i + 1 ] = 0;
        data[ i + 2 ] = 0;
        data[ i + 3 ] = 255;
    }
}

function loadImage (asset) {
  return new Promise((resolve) => {
    canvas.classList.add('animated', 'fadeOut')
    let img = new Image();
    img.setAttribute('data-name', asset.name);
    img.crossOrigin = "Anonymous";
    img.onload = () => resolve(img);
    img.src = asset.path;
  })
}

function transform(ctx, w, h) {
  var imageRef, imgdata, imgwidth;

  var setPixel = function(x, y, color) {
    if (color == undefined) {
      color = { r: 0, g:0, b:0, a:255};
    }
    let i = ( x + y * imgwidth ) * 4;
    imgdata[ i ] = color.r;
    imgdata[ i + 1 ] = color.g;
    imgdata[ i + 2 ] = color.b;
    imgdata[ i + 3 ] = color.a;
  };

  var getPixel = function(x, y) {
    let i = ( x + y * imgwidth ) * 4;
    return {r: imgdata[i], g: imgdata[i+1], b: imgdata[i+2], a: imgdata[i+3]};
  }

  /*
    Prendre une image de X sur Y pixels et recomposer ses pixels pairs et impairs
    en 4 photos de 160 sur 100 pixels selont la répartition suivante :

              Pairs ! Pairs
    ----------------------------------
       Pairs  !  1  !  2  ! Impairs
    ----------!-----!-----!-----------
       Pairs  !  3  !  4  ! Impairs
    ----------------------------------
            Impairs ! Impairs

    L’écran graphique est décomposé en 4 zones de taille égale composées comme suit :
    La zone 1 est composée des pixels horizontaux et verticaux de numéro pair
    (0, 2, 4, etc...). La zone 2 est composée des pixels horizontaux pairs et
    verticaux impairs. Pour la zone 3 la répartition est inverse de la zone 2.
    Enfin, la zone 4 est composée des pixels horizontaux et verticaux impairs.

    En relançant la décomposition plusieurs fois de suite sur la même image on
    obtient des effets amusants. A vous d’essayer.
   */

   for (let iter=0, imax=nb_iter_max; iter<imax; iter++) {
     imageRef = ctx.getImageData( 0, 0, w, h );
     imgdata = imageRef.data;
     imgwidth = imageRef.width;

     let pixelmap = [];

      for (let x = 0; x < w; x++) {
         pixelmap[x] = [];
         for (let y = 0; y < h; y++) {
           pixelmap[x][y] = getPixel(x, y);
         }
       }

      clearImageData(imgdata);

      let mid_w = w / 2;
      let mid_h = h / 2;

      let new_x1 = 0;
      let new_x2 = mid_w;
      let new_x3 = 0;
      let new_x4 = mid_w;

      for (let x = 0; x < w; x += 2) {
        let new_y1 = 0;
        let new_y2 = 0;
        let new_y3 = mid_h;
        let new_y4 = mid_h;
        for (let y = 0; y < h; y += 2) {
           setPixel(new_x1, new_y1, pixelmap[x][y]);
           setPixel(new_x2, new_y2, pixelmap[x+1][y]);
           setPixel(new_x3, new_y3, pixelmap[x][y+1]);
           setPixel(new_x4, new_y4, pixelmap[x+1][y+1]);
           new_y1++;
           new_y2++;
           new_y3++;
           new_y4++;
        }
        new_x1++;
        new_x2++;
        new_x3++;
        new_x4++;
      }
      ctx.putImageData( imageRef, 0, 0 );
  }
}

function action(asset) {

  canvas = document.getElementById("myCanvas");
  if (!canvas) {
    console.error("canvas not found");
    return;
  }
  var ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;

  loadImage(asset).then(image => {
      var w = image.width;
      var h = image.height;

      canvas.width = w;
      canvas.height = h;

      ctx.drawImage(image, 0, 0, w, h);

      if (flag_posterize) {
        posterize(ctx, w, h, level_posterized);
      }
      if (nb_iter_max > 0) {
        transform(ctx, w, h);
      }
      canvas.classList.remove('animated', 'fadeOut')
      canvas.classList.add('animated', 'fadeIn')
  })
}

function keyPressed (e) {
    e.preventDefault();
  //  console.log(e.keyCode);

    // Documentation about keyboard events :
    //    https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
    const KEY_ZERO = 48;
    const KEY_ONE = 49;
    const KEY_TWO = 50;
    const KEY_THREE = 51;
    const KEY_FOUR = 52;
    const KEY_FIVE = 53;
    const KEY_SIX = 54;
    const KEY_SEVEN = 55;
    const KEY_EIGHT = 56;
    const KEY_NINE = 57;
    const SPACE_BAR = 32;
    const KEY_X = 88;
    const KEY_P = 80;

    switch (e.keyCode) {
      case KEY_P:{
          flag_posterize = !flag_posterize;
          action(asset);
          break;
      }
      case KEY_X:{
          var link = document.getElementById('page2');
          if (link) {
            link.click();
          } else {
            console.log('link to page2 not found');
          }
          break;
      }
      case SPACE_BAR:{
          nb_iter_max += 1;
          if (nb_iter_max > 9) {
            nb_iter_max = 9;
          } else {
            action(asset);
          }
          break;
      }
      case KEY_ZERO:{
          nb_iter_max = 0;
          action(asset);
          break;
      }
      case KEY_ONE:{
          nb_iter_max = 1;
          action(asset);
          break;
      }
      case KEY_TWO:{
          nb_iter_max = 2;
          action(asset);
          break;
      }
      case KEY_THREE:{
          nb_iter_max = 3;
          action(asset);
          break;
      }
      case KEY_FOUR:{
          nb_iter_max = 4;
          action(asset);
          break;
      }
      case KEY_FIVE:{
          nb_iter_max = 5;
          action(asset);
          break;
      }
      case KEY_SIX:{
          nb_iter_max = 6;
          action(asset);
          break;
      }
      case KEY_SEVEN:{
          nb_iter_max = 7;
          action(asset);
          break;
      }
      case KEY_EIGHT:{
          nb_iter_max = 8;
          action(asset);
          break;
      }
      case KEY_NINE:{
          nb_iter_max = 9;
          action(asset);
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
    console.log("Press P for posterize effect");
    console.log("Press X for page2");
    action(asset);
});
