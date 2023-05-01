function VisControls() {
	// Playback button displayed in the top left of the screen
	this.playbackButton = new PlaybackButton();
  
	// Mic button displayed in the top left of the screen
	this.micButton = new MicButton();

	// Web cam button to be displayed
	this.webcamButton = new WebcamButton();

	// Loop song button
	this.loopButton = new LoopButton();

	// Tempo button to be displayed
	this.tempoButton = new TempoButton();

	// Progress bar
	this.progressBar = new ProgressBar();

	// Previous and Next buttons
	this.previousNextButtons = new PreviousNextButtons();

	// Volume bar
	this.volumeBar = new VolumeBar(width/2 + 270, height - 135, 80, 30);
  
	// draws the playback button and potentially the menu
	this.draw = function() {
		// playback button
		this.playbackButton.draw();

		// loop button
		this.loopButton.draw();

		// tempo button
		this.tempoButton.draw();
		
		// mic button
		this.micButton.draw();
		
		// webcam button
		this.webcamButton.draw();

		// progress bar
		this.progressBar.draw();

		// previous and next buttons
		this.previousNextButtons.draw();

		// volume bar
		this.volumeBar.draw();
	};

	// ------------ INPUT HANDLER FUNCTIONS ------------

	this.mouseClicked = function() {
		// Check if buttons have been clicked
		this.playbackButton.hitCheck();
		this.micButton.hitCheck();
		this.webcamButton.hitCheck();
	  	this.loopButton.hitCheck();
	  	this.tempoButton.hitCheck();
	  	this.progressBar.hitCheck();
	  	this.previousNextButtons.hitCheck();
  	};

	this.mousePressed = function() {
		// Check if volume button has mouse held on it
		this.volumeBar.mousePressed();
	}

	this.mouseReleased = function() {
		// Check if volume button has mouse held on it
		this.volumeBar.mouseReleased();
	}
}
