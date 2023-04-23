//global for the controls and input
var controls = null;
//store visualisations in a container
var vis = null;
//variable for the p5 sound object
var sound = null;
//variable for p5 fast fourier transform
var fourier;

//global for the home screen
var home = null;

var fft;
var songPitchData = {};

console.log('ml5 version:', ml5.version);

function preload() {
  sound = loadSound('assets/bakamitai.flac');
}

function setup() {
	createCanvas(1920, 920);
	background(0);
	frameRate(60); // Set framerate to constant 60 fps for consistency

	// Instantiate the fft object without setting any input initially
	fourier = new p5.FFT();
  
	// Instantiate home screen object
	home = new HomeScreen();
  
	// Instantiate rhythm game object
	rhythm = new RhythmGame();
  
	// Instantiate controls object for visualisations
	controls = new ControlsAndInput();
  
	// Instantiate the karaoke game
	karaoke = new KaraokeGame();
	karaoke.initPitchDetection();
    
	karaoke._songDuration = sound.duration();

	analyzeSongPitchData();
  
	// Create a new visualisation container and add visualisations
	vis = new Visualisations();
	vis.add(new Spectrum());
	vis.add(new WavePattern());
	vis.add(new Needles());
  }
  
  

  function draw() {
    background(0);

    if (home.selected == "") {
        // draw home screen
        home.draw();
    }

    if (home.selected == home.options[1]) {
        //draw the karaoke game
        karaoke.draw();
        karaoke.update();
		    getAudioContext().resume();
    }

    if (home.selected == home.options[0]) {
        // draw the rhythm game
        rhythm.draw();
        rhythm.drawGame();
    }
    if (home.selected == home.options[2]) {
        // draw the visualisations
        vis.selectedVisual.draw();
        controls.draw();
    }
}



function mouseMoved() {
  if (home.selected == "") {
    home.mouseMoved();
  }
}

function mouseClicked() {
  if (home.selected == "") {
    home.mousePressed();
  }
  if (home.selected == home.options[1]) {
    karaoke.handleMouseClick();
  }
}

function keyPressed() {
	if (home.selected == "") {
		home.keyPressed(keyCode);
	}
	
	if (home.selected == home.options[1]) {
		controls.keyPressed(keyCode);
	}
  }

function keyReleased() {
	if (home.selected == home.options[0]) {
		rhythm.keyReleased(key);
	}
}

//when the window has been resized. Resize canvas to fit 
//if the visualisation needs to be resized call its onResize method
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (vis.selectedVisual.hasOwnProperty('onResize')) {
    vis.selectedVisual.onResize();
  }
}
