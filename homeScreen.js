function HomeScreen() {
    this.selected = "";

    this.options = ["RHYTHM GAME",
                    "KARAOKE GAME", 
                    "GALLERY & MUSIC", 
                    "OPTIONS & CONTROLS"];

    // sets default starting option to rhythm game
    this.currentOption = this.options[0]; 

    this.draw = function() {
        push();
        // draw title at top of screen
        fill("white");
        rect(width/2 - 275, 100, 550, 120);
        fill("black");
        textSize(48);
        textAlign(CENTER);
        text("MUSIC VISUALISER", width/2, 180);
		
        // loop through all options and draw them to the screen
        textSize(32);
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
            text(this.options[i], width/2, 350 + (i * 120)); 
        }

        // draw credits at bottom of screen
        textSize(20);
        textStyle(NORMAL);
        text("BY SPIKE ELLIOT & SYED SAHAF", width/2, 890);
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

    this.mousePressed = function() {
        // checks if mouse is currently hovering over an option
        if (this.mouseMoved()) {
            // selects option when mouse is pressed
            this.selected = this.currentOption;
        }
    }

    this.keyPressed = function(keyCode) {
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

            case 32: // if spacebar is pressed
                // select currently highlighted option
                this.selected = this.currentOption;
                break;
        }
    }
}