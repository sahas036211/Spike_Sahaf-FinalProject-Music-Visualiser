function SettingsScreen() {
    this.options = ["VOLUME",
                    "SONG SELECT"];

    this.volumeSlider = createSlider(0,100,100);
    this.volumeSlider.position((width/2)+25, 325);
    
    // sets default starting option to rhythm game
    this.currentOption = this.options[0];

    this.draw = function() {
        
        // draw title at top of screen
        fill("white");
        push();
        rect(width/2 - 275, 100, 550, 120);
        fill("black");
        textSize(48);
        textAlign(CENTER);
        text("OPTIONS & SETTINGS", width/2, 180);
        pop();
        
        textSize(32);
        push()
        textAlign(RIGHT);
        // loop through all options and draw them to the screen
		for (var i = 0; i < this.options.length; i++) {
            // draw highlighted option differently
            if (this.options[i] == this.currentOption) {
                textStyle(BOLD); // draw text as bold
                // draw grey rectangle behind text
                fill("#333333"); 
                rect(0, 283 + (i * 120), width, 110);
            } else textStyle(NORMAL);
            // draw options with 120 pixels of space from each other
            fill("white");
            text(this.options[i], (width/2)-25, 350 + (i * 120)); 
        }
        pop();

        textAlign(LEFT);
        text(currentSong.songName.toUpperCase(), (width/2)+25, 470);

        // draw back button at bottom of screen
        push();
        fill(255);
        rectMode(CENTER);
        rect(width/2, 775, 500, 100);
        fill(0);
        textAlign(CENTER);
        textSize(48);
        if (mouseY > 725 && mouseY < 825 &&
            mouseX < (width/2)+250 && mouseX > (width/2)-250) { // check mouse pos
            textStyle(BOLD); // menu option bold when hovered over
        }
        text('BACK TO MENU', width/2, 795);
        pop();
	};

    this.mouseMoved = function() {
        // loop through all options and check if mouse is within their boxes
        for (var i = 0; i < this.options.length; i++) {
            if (mouseY > 283 + (i * 120) && mouseY < 393 + (i * 120)) {
                // sets hovered over option to current option
                this.currentOption = this.options[i];
                return true;
            }
        } return false;
    }

    this.keyPressed = function() {
        switch (keyCode) {
            case UP_ARROW: // if up arrow is pressed
                if (this.currentOption != this.options[0]) {
                    // get index of current option
                    let index = this.options.indexOf(this.currentOption);
                    // change current option to previous option in array
                    this.currentOption = this.options[index - 1];
                } else { // if on option 0, set option to last for cycle effect
                    this.currentOption = this.options[this.options.length - 1];
                } break;

            case DOWN_ARROW: // if down arrow is pressed
                if (this.currentOption != this.options[this.options.length-1]) {
                    // get index of current option
                    let index = this.options.indexOf(this.currentOption);
                    // change current option to next option in array
                    this.currentOption = this.options[index + 1];
                } else { // if on last option, set option to 0 for cycle effect
                    this.currentOption = this.options[0];
                } break;
        }
    }

    this.mousePressed = function() {
        if (mouseY > 403 && mouseY < 513) {
            if (currentSong != songs[songs.length-1]) {
                // get index of current song
                let index = songs.indexOf(currentSong);
                // change current song to next song in songs array
                currentSong = songs[index + 1];
            } else { // if on last song, set song to 0 for cycle effect
                currentSong = songs[0];
            }
            // load new song to play
            sound = loadSound(`assets/${currentSong.fileName}.${currentSong.ext}`);
	        rhythmGhostSound = loadSound(`assets/${currentSong.fileName}.${currentSong.ext}`);
        }
        if (mouseY > 715 && mouseY < 835 &&
            mouseX < (width/2)+250 && mouseX > (width/2)-250) { // check mouse pos
            home.selected = ""; // sends you back to the home screen
        }
    }
}