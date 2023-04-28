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

let songs = [{fileName: 'bakamitai', ext: 'flac', freq1: 200,
 			  freq2: 4000, bpm: 74, threshold: 0.5},
			  
			 {fileName: 'demiurge', ext: 'mp3', freq1: 20, 
			  freq2: 20000, bpm: 84, threshold: 0.1}];

let currentSong = songs[0];

function preload() {
	sound = loadSound(`assets/${currentSong.fileName}.${currentSong.ext}`);
	rhythmGhostSound = loadSound(`assets/${currentSong.fileName}.${currentSong.ext}`);
}


function setup() {
	createCanvas(1920, 920); // Lock canvas size
	background(0);
	frameRate(60); // Set framerate to constant 60 fps for consistency

	// Instantiate the fft object without setting any input initially
	fourier = new p5.FFT();
  
	// Instantiate home screen object
	home = new HomeScreen();

	// Instantiate settings screen object
	settings = new SettingsScreen();
  
	// Instantiate controls object for visualisations
	controls = new ControlsAndInput();
  
	// Create a new visualisation container and add visualisations
	vis = new Visualisations();
	vis.add(new Spectrum());
	vis.add(new WavePattern());
	vis.add(new Needles());
}
  
function draw() {
	settings.volumeSlider.hide();
	if (controls.webcam) {
        image(controls.webcam, 0, 0, width, height);
    } else {
        background(0);
    }
	// draw depending on which screen has been selected from menu
  	if (home.selected === "") {
		// draw home screen
		home.draw();
  	} else if (home.selected === home.options[0]) {
    	// draw the rhythm game
    	rhythm.draw();
  	}  else if (home.selected === home.options[1]) {
    	//draw the karaoke game
    	karaoke.draw();
  	} else if (home.selected === home.options[2]) {
    	// draw visualisers
    	vis.selectedVisual.draw();
    	controls.draw();
  	} else if (home.selected === home.options[3]) {
		// draw options and settings menu
		settings.draw();
        settings.volumeSlider.show();
    }    
}

function mouseMoved() {
	if (home) { // checks home != null to prevent errors while loading setup
		if (home.selected === "") {
			home.mouseMoved();
		} else if (home.selected === home.options[3]) {
			settings.mouseMoved();
		}
	}
}

function mouseClicked() {
	if (home) { // checks home != null to prevent errors while loading setup
		if (home.selected === "") {
			home.mousePressed();
			// Check if menu item has been selected after mouse press
			if (home.selected === home.options[0]) {
				// Create new rhythm game object if rhythm game selected
				rhythm = new RhythmGame();
			} else if (home.selected === home.options[1]) {
				// Create new karaoke game object if karaoke game selected
				karaoke = new KaraokeGame();
			}
		} else if (home.selected === home.options[0]) {
			rhythm.mousePressed();
		} else if (home.selected == home.options[1]) {
			karaoke.mousePressed();
		} else if (home.selected === home.options[2]) {
			controls.mousePressed();
		} else if (home.selected === home.options[3]) {
			settings.mousePressed();
		}
	}
}

function keyPressed() {
	if (home) { // checks home != null to prevent errors while loading setup
		if (home.selected === "") {
			home.keyPressed(keyCode);
			// Check if menu item has been selected after key press
			if (home.selected === home.options[0]) {
				// Create new rhythm game object if rhythm game selected
				rhythm = new RhythmGame();
			} else if (home.selected === home.options[1]) {
				// Create new karaoke game object if karaoke game selected
				karaoke = new KaraokeGame();
			}
		} else if (home.selected === home.options[0]) {
			rhythm.keyPressed(key);
		} else if (home.selected === home.options[1]) {
			karaoke.keyPressed(key);
		} else if (home.selected === home.options[2]) {
			controls.keyPressed(keyCode);
		} else if (home.selected === home.options[3]) {
			settings.keyPressed(key);
		}
	}
}

function keyReleased() {
	if (home) { // checks home != null to prevent errors while loading setup
		if (home.selected == home.options[0]) {
			rhythm.keyReleased(key);
		}
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
