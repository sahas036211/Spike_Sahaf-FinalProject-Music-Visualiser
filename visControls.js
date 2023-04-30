function VisControls() {
	this.menuDisplayed = false;
  
	// Playback button displayed in the top left of the screen
	this.playbackButton = new PlaybackButton();
  
	// Mic button displayed in the top left of the screen
	this.micButton = new MicButton();
  
	// Mic controller to handle the mic input
	this.micController = new MicController();

	// Web cam button to be displayed
	this.webcamButton = new WebcamButton();

	// Speed up button to be displayed
	this.speedupButton = new SpeedUpButton();
  
	// Make the window fullscreen or revert to windowed
	this.mousePressed = function() {
	  	// Check if buttons have been clicked
	  	this.playbackButton.hitCheck();
	  	this.micButton.hitCheck();
	  	this.webcamButton.hitCheck();
		this.speedupButton.hitCheck();
	};

	

    // Webcam input
    this.webcam = null;

    // Enable or disable webcam input
    this.enableWebcam = function () {
        if (this.webcam) {
            this.webcam.remove();
            this.webcam = null;
        } else {
            this.webcam = createCapture(VIDEO);
            this.webcam.hide();
        }
    };
  

	//responds to keyboard presses
	//@param keycode the ascii code of the keypressed
	this.keyPressed = function(keycode) {
		console.log(keycode);
		if (keycode == 32) {
			this.menuDisplayed = !this.menuDisplayed;
		}

		if (keycode > 48 && keycode < 58) {
			var visNumber = keycode - 49;
			visScreen.vis.selectVisual(visScreen.vis.visuals[visNumber].name);
		}
	};

	//draws the playback button and potentially the menu
	this.draw = function() {
		push();
		fill("white");
		stroke("black");
		strokeWeight(2);
		textAlign(CENTER);
		textSize(34);

		text('PRESS P TO RETURN \nTO MAIN MENU', width-340, 100);
		//playback button
		this.playbackButton.draw();
		this.speedupButton.draw();
		//only draw the menu if menu displayed is set to true.
		if (this.menuDisplayed) {
			textSize(40);
			rectMode(CENTER);
			rect(300, 105, 450, 80, 90);
			fill("black");
			text("VISUALISATIONS", 300, 120);
			this.menu();
		} else {
			text("PRESS SPACE \nFOR VISUALISATIONS", 300, 100);
		}
		pop();

		//mic button
		this.micButton.draw();
		this.webcamButton.draw();

	};

	//draw out menu items for each visualisation
	this.menu = function() {
		fill("white");
		textSize(34);

		text("PRESS SPACE TO HIDE", 300, 220);

		//loop through the visualisations and draw out the name
		for (var i = 0; i < visScreen.vis.visuals.length; i++) {
			textAlign(RIGHT);
			text(`${i+1}`, 160, 300 + (i * 50));
			textAlign(LEFT);
			text(`${visScreen.vis.visuals[i].name}`, 220, 300 + (i * 50)); 
		}
	};
}
