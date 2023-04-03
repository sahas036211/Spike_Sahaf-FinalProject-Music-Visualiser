function ControlsAndInput() {
	this.menuDisplayed = false;
  
	// Playback button displayed in the top left of the screen
	this.playbackButton = new PlaybackButton();
  
	// Mic button displayed in the top left of the screen
	this.micButton = new MicButton();
  
	// Mic controller to handle the mic input
	this.micController = new MicController();
  
	// Make the window fullscreen or revert to windowed
	this.mousePressed = function() {
	  // Check if the playback button has been clicked
	  if (!this.playbackButton.hitCheck()) {
		// Check if the mic button has been clicked
		if (!this.micButton.hitCheck()) {
		  if (fullscreen()) {
			fullscreen(false);
		  } else {
			fullscreen(true);
		  }
		}
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
			vis.selectVisual(vis.visuals[visNumber].name);
		}
	};

	//draws the playback button and potentially the menu
	this.draw = function() {
		push();
		fill("white");
		stroke("black");
		strokeWeight(2);
		textSize(34);

		//playback button
		this.playbackButton.draw();
		//only draw the menu if menu displayed is set to true.
		if (this.menuDisplayed) {
			text("Select a visualisation:", 100, 30);
			this.menu();
		}
		pop();

		//mic button
		this.micButton.draw();

	};

	this.menu = function() {
		//draw out menu items for each visualisation
		//???
		//loop through the visualisations and draw out the name
		for (var i = 0; i < vis.visuals.length; i++) {
			text(i+1 + " - " + vis.visuals[i].name, 100, 60 + (i * 30)); 
		}
	};
}
