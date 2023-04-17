//global for the controls and input 
var controls = null;
//store visualisations in a container
var vis = null;
//variable for the p5 sound object
var sound = null;
//variable for p5 fast fourier transform
var fourier;

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
		// draw the selected visualisation
		vis.selectedVisual.draw();
		// draw the controls on top.
		controls.draw();
	}

	if (home.selected == home.options[0]) {
		// draw the rhythm game
		rhythm.draw();
		rhythm.drawGame();
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
		controls.mousePressed();
	}
}

function keyPressed() {
	if (home.selected == "") {
		home.keyPressed(keyCode);
	}
	
	if (home.selected == home.options[0]) {
		rhythm.keyPressed(key);
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