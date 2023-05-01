function LoopButton() {
    this.width = 30;
    this.height = 30;
    this.x = (width/2) - 210;
    this.y = height - 160;

    this.image = loopButtonImg;
    this.image.resize(this.width, this.height); // scale image to correct size
    pixelDensity(1);
    this.image.loadPixels(); // load pixels of image to edit

    // flag to determine whether to loop the currently playing song or not
	this._loopEnabled = false;

    this.draw = function() {
        push();
        image(this.image, this.x, this.y);
        
        // button is white if enabled, grey if disabled
        let fillColour;
        if (!this._loopEnabled) {
            fillColour = 128;
        } else {
            fillColour = 255;
        }

        // replace pixel colour with new fill colour
        for (let i = 0; i < this.image.pixels.length; i+=4) {
            this.image.pixels[i] = fillColour;
            this.image.pixels[i+1] = fillColour;
            this.image.pixels[i+2] = fillColour;
        }
        this.image.updatePixels();
        pop();
    }

    // ------------ GETTER & SETTER FUNCTIONS ------------

    this.getLoop = function() {
        return this._loopEnabled;
    }

    // ------------ INPUT HANDLER FUNCTIONS ------------

    // checks for clicks on the button, enables or disables song loop
	// returns true if clicked false otherwise.
	this.hitCheck = function() {
		if (mouseX > this.x
            && mouseX < this.x + this.width
            && mouseY > this.y
            && mouseY < this.y + this.height) {
            this._loopEnabled = !this._loopEnabled;
            currentSong.sound.setLoop(this._loopEnabled);
  			return true;
		}
        return false;
	};
}