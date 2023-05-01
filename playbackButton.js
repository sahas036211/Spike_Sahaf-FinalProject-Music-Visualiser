function PlaybackButton() {
	this.width = 30;
	this.height = 30;
	this.x = (width/2) - this.width;
	this.y = height - 160;

	//flag to determine whether to play or pause after button click and
	//to determine which icon to draw
	this._playing = false;
	this._pauseTime = 0;

	this.draw = function() {
		push();
		fill("white");
		if (this._playing) {
			rect(this.x, this.y, this.width/2 - 2, this.height);
			rect(this.x + (this.width/2 + 3), this.y, this.width/2 - 2, this.height);
		} else {
			triangle(this.x, this.y,
                     this.x + this.width, this.y + this.height/2,
                     this.x, this.y+this.height);
		}
		pop();
	};

	// ------------ GETTER & SETTER FUNCTIONS ------------
	
	this.getPlaying = function() {
		return this._playing;
	}

	this.setPlaying = function(playing) {
		if (playing) {
			if (visScreen.controls.loopButton.loopEnabled) {
				currentSong.sound.loop();
			} else {
				currentSong.sound.play();
			}
			this._playing = true;
		} else {
			this._pauseTime = currentSong.sound.currentTime();
    		currentSong.sound.pause();
			this._playing = false;
		}
	}

	this.getPauseTime = function() {
		return this._pauseTime;
	}

    // ------------ INPUT HANDLER FUNCTIONS ------------

	this.hitCheck = function() {
		if (mouseX > this.x
            && mouseX < this.x + this.width
            && mouseY > this.y
            && mouseY < this.y + this.height) {
			if (currentSong.sound.isPlaying()) {
				this.setPlaying(false);
  			} else {
				this.setPlaying(true);
  			}
  			return true;
		}
        return false;
	};
}
