function VisualisationScreen() {
    this.menuDisplayed = false;

    this.controls = new VisControls();

    this.vis = new Visualisations();
    this.vis.add(new Spectrum());
	this.vis.add(new WavePattern());
	this.vis.add(new Needles());
    this.vis.add(new HorizontalBars());
    this.vis.add(new CircularWaveform());

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
		for (var i = 0; i < visScreen.vis.visuals.length; i++) {
			textAlign(RIGHT);
			text(`${i+1}`, 160, 300 + (i * 50));
			textAlign(LEFT);
			text(`${visScreen.vis.visuals[i].name}`, 220, 300 + (i * 50)); 
		}
	};

    this.draw = function() {
        this.vis.selectedVisual.draw();

        // get index of current song
        let index = songs.indexOf(currentSong);

        if (currentSong.sound.currentTime() !== 0) {
            this.startedSongs[index].savedTime = currentSong.sound.currentTime();
        }

        push();
        fill("white");
		stroke("black");
		textAlign(CENTER);
		textSize(34);

		text('PRESS P TO RETURN \nTO MAIN MENU', width-300, 100);

		//only draw the menu if menu displayed is set to true.
		if (this.menuDisplayed) {
			textSize(40);
			rectMode(CENTER);
			rect(300, 105, 450, 80, 90);
			fill("black");
			text("VISUALISATIONS", 300, 120);
			strokeWeight(2);
			this.drawMenu();
		} else {
			text("PRESS SPACE \nFOR VISUALISATIONS", 300, 100);
		}
		pop();
		noStroke();

        this.controls.draw();

        // set song started state to true if playing and current time > 0
        if (visScreen.controls.playbackButton.getPlaying() &&
            this.startedSongs[index].savedTime != 0) {
            this.startedSongs[index].songStarted = true;
        }

        // start next song in playlist once current song reaches end
        if (this.startedSongs[index].savedTime != 0 &&
            !currentSong.sound.isPaused() &&
            !currentSong.sound.isPlaying() &&
            !visScreen.controls.progressBar.isJumping) {
            this.startedSongs[index].songStarted = false;
            // checks to make sure song is not meant to be looped instead
            if (!visScreen.controls.loopButton.getLoop()) {
                if (currentSong != songs[songs.length-1]) {
                    // change current song to next song in songs array
                    currentSong = songs[index + 1];
                } else { // if on last song, set song to 0 for cycle effect
                    currentSong = songs[0];
                }
                // apply tempo status of previous song to new song
                currentSong.sound.rate(visScreen.controls.tempoButton.getSpeed());
                // set the song to start playing
                visScreen.controls.playbackButton.setPlaying(true);
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
			visScreen.vis.selectVisual(visScreen.vis.visuals[visNumber].name);
		}

		if (keycode == 80) { // P
			visScreen.controls.playbackButton.setPlaying(false);
			home.selected = ""; // sends you back to the home screen
		}
	};
}