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
	home = new HomeScreen();
	
	controls = new ControlsAndInput();

  
	// Instantiate the fft object without setting any input initially
	fourier = new p5.FFT();

	// Create a new visualization container and add visualizations
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
	
	if (home.selected == home.options[1]) {
		controls.keyPressed(keyCode);
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