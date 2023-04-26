//global for the controls and input 
var controls = null;
//store visualisations in a container
var vis = null;
//global for home screen
var home = null;
//global for rhythm game
var rhythm = null;
//variable for the p5 sound object
var sound = null;
//variable for the p5 sound object to be analysed in rhythm game
var rhythmGhostSound = null;
//variable for p5 fast fourier transform
var fourier;

//karaoke variables
var fft;
var songPitchData = {};

function preload() {
	sound = loadSound('assets/bakamitai.flac');
	rhythmGhostSound = loadSound('assets/bakamitai.flac');
}


function setup() {
	createCanvas(1920, 920);
	background(0);
	frameRate(60); // Set framerate to constant 60 fps for consistency

	// Instantiate the fft object without setting any input initially
	fourier = new p5.FFT();
  
	// Instantiate home screen object
	home = new HomeScreen();
  
	// Instantiate controls object for visualisations
	controls = new ControlsAndInput();
  
	// Create a new visualisation container and add visualisations
	vis = new Visualisations();
	vis.add(new Spectrum());
	vis.add(new WavePattern());
	vis.add(new Needles());
  }
  
function draw() {
  background(0);

  if (home.selected === "") {
    // draw home screen
    home.draw();
  } else if (home.selected === home.options[0]) {
    // draw the rhythm game
    rhythm.draw();
  }  else if (home.selected === home.options[1]) {
    //draw the karaoke game
    karaoke.draw();
    karaoke.update();
    getAudioContext().resume();
    analyzeSongPitchData();
  } else if (home.selected === home.options[2]) {
    // draw visualisers
    vis.selectedVisual.draw();
    controls.draw();
  }
}

function mouseMoved() {
	if (home) {
		if (home.selected === "") {
			home.mouseMoved();
		}
	}
}

function mouseClicked() {
  if (home.selected === "") {
		home.mousePressed();
    // Check if menu item has been selected after mouse clicked in home screen
		if (home.selected === home.options[0]) {
      // Create new rhythm game object if rhythm game selected
			rhythm = new RhythmGame();
		} else if (home.selected === home.options[1]) {
      // Create new karaoke game object if karaoke game selected
	    karaoke = new KaraokeGame();
	    karaoke.initPitchDetection();
	    karaoke._songDuration = sound.duration();
      fourier.setInput(sound);
    }
	} else if (home.selected === home.options[0]) {
		rhythm.mousePressed();
	} else if (home.selected == home.options[1]) {
    karaoke.handleMouseClick();
  } else if (home.selected === home.options[2]) {
		controls.mousePressed();
	}
}

function keyPressed() {
	if (home.selected === "") {
		home.keyPressed(keyCode);
    // Check if menu item has been selected after key pressed in home screen
		if (home.selected === home.options[0]) {
      // Create new rhythm game object if rhythm game selected
			rhythm = new RhythmGame();
		} else if (home.selected === home.options[1]) {
      // Create new karaoke game object if karaoke game selected
	    karaoke = new KaraokeGame();
	    karaoke.initPitchDetection();
	    karaoke._songDuration = sound.duration();
      fourier.setInput(sound);
    }
	} else if (home.selected === home.options[0]) {
		rhythm.keyPressed(key);
	} else if (home.selected === home.options[2]) {
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
