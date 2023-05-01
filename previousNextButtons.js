function PreviousNextButtons() {
    this.width = 20;
	this.height = 20;
    this.y = height - 155;
	this.prevX = (width/2) - 90;
    this.nextX = (width/2) + 60;

	this.draw = function() {
		push();
		fill("white");
        // next song button
		triangle(this.nextX, this.y,
                 this.nextX + this.width, this.y + this.height/2,
                 this.nextX, this.y + this.height);
        triangle(this.nextX + this.width, this.y,
                 this.nextX + this.width*2, this.y + this.height/2,
                 this.nextX + this.width, this.y + this.height)
        // previous song button
        triangle(this.prevX, this.y,
                 this.prevX - this.width, this.y + this.height/2,
                 this.prevX, this.y + this.height);
        triangle(this.prevX - this.width, this.y,
                 this.prevX - this.width*2, this.y + this.height/2,
                 this.prevX - this.width, this.y + this.height);
		pop();
	};

    this.hitCheck = function() {
        if (mouseX > this.nextX // checks if next button is pressed
            && mouseX < this.nextX + this.width*2
            && mouseY > this.y
            && mouseY < this.y + this.height) {
            // pauses current song before changing songs
            visScreen.controls.playbackButton.setPlaying(false);
            if (currentSong != songs[songs.length-1]) {
                // get index of current song
                let index = songs.indexOf(currentSong);
                // change current song to next song in songs array
                currentSong = songs[index + 1];
            } else { // if on last song, set song to 0 for cycle effect
                currentSong = songs[0];
            }
            // apply loop and tempo status of previous song to new song
            currentSong.sound.rate(visScreen.controls.tempoButton.currentSpeed);
            currentSong.sound.setLoop(visScreen.controls.loopButton.loopEnabled);
            // set the song to start playing
            visScreen.controls.playbackButton.setPlaying(true);
        } else if (mouseX > this.prevX - this.width*2 // check if previous button is pressed
                   && mouseX < this.prevX
                   && mouseY > this.y
                   && mouseY < this.y + this.height) {
            // pauses current song before changing songs
            visScreen.controls.playbackButton.setPlaying(false);
            if (currentSong != songs[0]) {
                // get index of current song
                let index = songs.indexOf(currentSong);
                // change current song to previous song in songs array
                currentSong = songs[index - 1];
            } else { // if on first song, set song to last for cycle effect
                currentSong = songs[songs.length-1];
            }
            // apply loop and tempo status of previous song to new song
            currentSong.sound.rate(visScreen.controls.tempoButton.currentSpeed);
            currentSong.sound.setLoop(visScreen.controls.loopButton.loopEnabled);
            // set the song to start playing
            visScreen.controls.playbackButton.setPlaying(true);
        }
    };
}