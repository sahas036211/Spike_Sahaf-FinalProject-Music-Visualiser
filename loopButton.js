function LoopButton() {
    this.width = 30;
    this.height = 30;
    this.x = (width/2) - 200;
    this.y = height - 160;
    this.colour = 128;

    this.image = loopButtonImg;
    this.image.resize(this.width, this.height);
    pixelDensity(1);
    this.image.loadPixels();

    // flag to determine whether to loop the currently playing song or not
	this.loopEnabled = false;

    this.draw = function() {
        image(this.image, this.x, this.y);
        
        if (!this.loopEnabled) {
            this.colour = 128;
        } else {
            this.colour = 255;
        }

        for (let i = 0; i < this.image.pixels.length; i+=4) {
            this.image.pixels[i] = this.colour;
            this.image.pixels[i+1] = this.colour;
            this.image.pixels[i+2] = this.colour;
        }
        this.image.updatePixels();
    }

    // checks for clicks on the button, enables or disables song loop
	// returns true if clicked false otherwise.
	this.hitCheck = function() {
		if (mouseX > this.x
            && mouseX < this.x + this.width
            && mouseY > this.y
            && mouseY < this.y + this.height) {
            this.loopEnabled = !this.loopEnabled;
            currentSong.sound.setLoop(this.loopEnabled);
  			return true;
		}
        return false;
	};
}