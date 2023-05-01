function VolumeBar(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.mouseHeld = false;

    this.draw = function() {
        push();
        for (var i = 0; i < 6; i++) {
            if (i/6 >= soundVolume) {
                fill(128);
            } else {
                fill(255);
            }
            rect(this.x + this.width*(i/6),
                 this.y - this.height*(i/6),
                 this.width/12,
                 this.height*(1/6) + this.height*(i/6));
        }
        pop();

        if (this.mouseHeld) {
            let mX = constrain(mouseX, this.x, this.x + this.width);
            soundVolume = map(mX, 
                this.x, this.x + this.width,
                0, 1);
            for (var i = 0; i < songs.length; i++) {
                // set volume of all songs relative to slider value
                songs[i].sound.setVolume(soundVolume);
            }
        }
    }

    // ------------ INPUT HANDLER FUNCTIONS ------------

    this.mousePressed = function() {
        if (mouseX > this.x
            && mouseX < this.x + this.width
            && mouseY > this.y - this.height
            && mouseY < this.y) {
        this.mouseHeld = true;
        }
    };

    this.mouseReleased = function() {
        this.mouseHeld = false;
    }
}