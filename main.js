function createOnceLog() {
  var counter = 0;
  return function() {
    var args = arguments;
    if (counter > 0) { return; }
    console.log.apply(console, args);
    return counter ++;
  }
}

var slices = [];
var logger = createOnceLog();
var logger2 = createOnceLog();


var SLICE_COUNT = 40;
var CONTAINER_WIDTH = 1280;
var SLICE_WIDTH = CONTAINER_WIDTH / SLICE_COUNT;
var THRESHOLD = 100;
var containerEl = document.querySelector('.flip-container');

function createSlices() {
  for (let i = 0; i < SLICE_COUNT; i ++) {
    let flipper = document.createElement('div');
    let front = document.createElement('div');
    let back = document.createElement('div');
    front.classList.add('front');
    back.classList.add('back');
    front.style.backgroundPositionX = `-${SLICE_WIDTH * i}px`;
    back.style.backgroundPositionX = `-${SLICE_WIDTH * i}px`;
    flipper.classList.add('flipper');
    flipper.appendChild(front);
    flipper.appendChild(back);
    containerEl.appendChild(flipper);
    let slice = new Slice(flipper);
    slices.push(slice);
  }
}

function loop() {
  // foo();
  window.requestAnimationFrame(loop);
}

function init() {
  //loop();
  createSlices();
}

function Slice(el) {
  this.timer = null;
  this.active = false;
  this.el = el
}

Slice.prototype.setActive = function(isActive) {
  this.active = isActive;
  if (isActive) {
    this.el.classList.add('active');
  } else {
    this.el.classList.remove('active');
  }
  return this;
}


Slice.prototype.react = function() {
  // console.debug('_react_');
  var reset = function() {
    // console.warn('_reset_');
    this.setActive(false);
    window.clearTimeout(this.timer);
    this.timer = null;
  }.bind(this);
  this.timer = window.setTimeout(reset, 3000);
  this.setActive(true);
  return this;
};

var diffy = Diffy.create({
  resolution: { x: SLICE_COUNT, y: 1 },
  sensitivity: .4,
  threshold: 7,
  debug: true,
  containerClassName: 'my-diffy-container',
  sourceDimensions: { w: 130, h: 100 },
  onFrame: function (matrix) {
    for (let i = 0; i < slices.length; i ++) {
      if(matrix[i][0] < 230) {
        let slice = slices[i];
        slice.react();
      }
    }
  }
});

window.addEventListener('load', init);


