var imageHeight = document.querySelector('.carousel-wrapper img').height;
var imageWidth = document.querySelector('.carousel-wrapper img').width;
var noOfImages = document.querySelector('.carousel-wrapper').children.length;
var carouselWrapperWidth = noOfImages * imageWidth;
var carousel = document.getElementsByClassName('.carousel-container');
document.querySelector('.carousel-container').style.height = imageHeight + 'px';
document.querySelector('.carousel-container').style.width = imageWidth + 'px';
var carouselWrapper = document.querySelector('.carousel-wrapper');
carouselWrapper.style.width = carouselWrapperWidth + 'px';

var counter = 0;
var x = 0;
var clicked = false;





  document.querySelector('.next').onclick = function () {
    if(!clicked) {
      clicked = true;
      counter++;
      var slide = setInterval(function () {
        x -= 10;
        document.querySelector('.carousel-wrapper').style.left = x + 'px';
        if (x % (counter * imageWidth) === 0) {
          clearInterval(slide);
          clicked = false;
        }

        if ((carouselWrapperWidth) === (counter * imageWidth)) {
          var slideReset = setInterval(function () {
            x += 25;
            if (x > 0) {
              x = 0;
              counter = 0;
              clearInterval(slideReset);
              clicked = false;
            }
            document.querySelector('.carousel-wrapper').style.left = x + 'px';
          }, 1);

          clearInterval(slide);
        }
      }, 1);
    }
  };

document.querySelector('.previous').onclick = function () {
  if(!clicked) {
    clicked = true;
    counter--;
    var slide = setInterval(function () {
      x += 10;
      document.querySelector('.carousel-wrapper').style.left = x + 'px';
      if (x % (counter * imageWidth) === 0) {
        clearInterval(slide);
        clicked = false;
      }

      if (0 > (counter * imageWidth)) {
        var slideReset = setInterval(function () {
          x -= 25;
          if (x < carouselWrapperWidth) {
            x = carouselWrapperWidth;
            counter = noOfImages;
            clearInterval(slideReset);
            clicked = false;
          }
          document.querySelector('.carousel-wrapper').style.left = x + 'px';
        }, 1);

        clearInterval(slide);
      }
    }, 1);
  }
};
