function VisualisationScreen() {
    this.menuDisplayed = false;

    this.controls = new VisControls();

    //array to store visualisations
	this.visuals = [];

    this.visuals.push(new Spectrum());
	this.visuals.push(new WavePattern());
	this.visuals.push(new Needles());
    this.visuals.push(new HorizontalBars());
    this.visuals.push(new CircularWaveform());
    this.visuals.push(new SpinningCube());

	this.selectedVisual = this.visuals[0];

    this.startedSongs = [];
    for (var i = 0; i < songs.length; i++) {
        this.startedSongs.push({songStarted: false, savedTime: 0});
    }

    //draw out menu items for each visualisation
	this.drawMenu = function() {
		fill("white");
		textSize(34);
		text("PRESS SPACE TO HIDE", 300, 220);

		//loop through the visualisations and draw out the name
		for (var i = 0; i < this.visuals.length; i++) {
			textAlign(RIGHT);
			text(`${i+1}`, 160, 300 + (i * 50));
			textAlign(LEFT);
			text(`${this.visuals[i].name}`, 220, 300 + (i * 50)); 
		}
	};

    this.draw = function() {
        // draw currently selected visualisation
        this.selectedVisual.draw();

        // get index of current song
        let index = songs.indexOf(currentSong);

        // start tracking time of current song if has started
        if (currentSong.sound.currentTime() !== 0) {
            this.startedSongs[index].savedTime = currentSong.sound.currentTime();
        }

        push();
        fill("white");
		stroke("black");
		textAlign(CENTER);
        textSize(34);
        text('SONG', width-300, 275);
        textSize(56);
        text(currentSong.songName, width-300, 350);

        textSize(34);
		text('PRESS P TO RETURN \nTO MAIN MENU', width-300, 100);

		// check if menu should be displayed before drawing it
		if (this.menuDisplayed) {
			textSize(40);
			rectMode(CENTER);
			rect(300, 105, 450, 80, 90);
			fill("black");
			text("VISUALISATIONS", 300, 120);
			strokeWeight(2);
			this.drawMenu(); // draw list of menu items
		} else { // draw if menu shouldn't be displayed
			text("PRESS SPACE \nFOR VISUALISATIONS", 300, 100);
		}
		pop();
		noStroke();

        // draw visualisation controls and buttons
        this.controls.draw();

        // set song started state to true if playing and current time > 0
        if (this.controls.playbackButton.getPlaying() &&
            this.startedSongs[index].savedTime != 0) {
            this.startedSongs[index].songStarted = true;
        }

        // start next song in playlist once current song reaches end
        if (this.startedSongs[index].savedTime != 0 &&
            !currentSong.sound.isPaused() && // conditions to check that
            !currentSong.sound.isPlaying() && // the song has ended
            !this.controls.progressBar.isJumping) {
            this.startedSongs[index].songStarted = false;
            // checks song is not meant to be looped instead
            if (!this.controls.loopButton.getLoop()) {
                if (currentSong != songs[songs.length-1]) {
                    // change current song to next song in songs array
                    currentSong = songs[index + 1];
                } else { // if on last song, set song to 0 for cycle effect
                    currentSong = songs[0];
                }
                // apply tempo status of previous song to new song
                currentSong.sound.rate(this.controls.tempoButton.getSpeed());
                // set the song to start playing
                this.controls.playbackButton.setPlaying(true);
            }
        }
    };

    // ------------ INPUT HANDLER FUNCTIONS ------------

    //responds to keyboard presses
	//@param keycode the ascii code of the keypressed
	this.keyPressed = function(keycode) {
		if (keycode == 32) { // spacebar
			this.menuDisplayed = !this.menuDisplayed;
		}

		if (keycode > 48 && keycode < 58) { // numbers 0-9
			var visNumber = keycode - 49;
            // change visual to corresponding number
			this.selectedVisual = this.visuals[visNumber];
		}

		if (keycode == 80) { // P
            // pause playback of song
			this.controls.playbackButton.setPlaying(false);
			home.selected = ""; // sends you back to the home screen
		}
	};
}