function ProgressBar() {
    this.x = width/4;
    this.y = height-100;
    this.width = width/2;
    this.height = 25;
    this.jumpTimeout = 0;
    this.isJumping = false;

    this.draw = function() {
        push();
        // song progress bar
		fill('#333333');
        rect(this.x, this.y, this.width, this.height, 90);

        // white completion bar
        let currentTime;
        if (visScreen.controls.playbackButton.getPlaying()) {
            currentTime = currentSong.sound.currentTime(); 
        } else {
            currentTime = visScreen.controls.playbackButton.getPauseTime();
        }
        let progressWidth = map(currentTime,
                            0, currentSong.sound.duration(),
                            0, width/2); 
        fill(255);
        rect(this.x, this.y, progressWidth, this.height, 90);

        textAlign(RIGHT);
        textSize(24);
        text(convertToMins(currentTime), 
             (width/4)-30, height-80)
        textAlign(LEFT);
        text(convertToMins(currentSong.sound.duration()), 
             (width*0.75)+30, height-80)
        pop();

        if (this.jumpTimeout > 0) {
            this.jumpTimeout -= deltaTime;
        } else if (this.jumpTimeout < 0) {
            this.jumpTimeout = 0;
            this.isJumping = false;
        }
    }

    // ------------ INPUT HANDLER FUNCTIONS ------------

    this.hitCheck = function() {
        if (visScreen.controls.playbackButton.getPlaying() && this.jumpTimeout == 0) {
            if (mouseX > this.x
                && mouseX < this.x + this.width
                && mouseY > this.y
                && mouseY < this.y + this.height) {
                let jumpTime = map(mouseX, 
                                   width/4, width*0.75,
                                   0, currentSong.sound.duration());
                this.isJumping = true;
                currentSong.sound.jump(jumpTime);
                this.jumpTimeout = 300;
                setTimeout(() => { Object.assign(currentSong.sound, {_playing: true}); }, 100);
                setTimeout(() => {
                                    currentSong.sound.pause();
                                    if (visScreen.controls.loopButton.getLoop()) {
                                        currentSong.sound.loop();
                                    } else {
                                        currentSong.sound.play(); 
                                    }
                                 }, 200);
            }
        }
    }
}