// MicButton constructor
function MicButton() {
    this.x = (width/2) - 280;
    this.y = height - 160;
    this.width = 30;
    this.height = 30;

    this.image = micButtonImg;
    this.image.resize(this.width, this.height); // scale image to correct size
    pixelDensity(1);
    this.image.loadPixels(); // load pixels of image to edit

    this.mic = new p5.AudioIn();

    // flag to determine whether mic is enabled or not
    this._micEnabled = false;

    this.draw = function() {
        push();
        image(this.image, this.x, this.y);
        
        // button is white if enabled, grey if disabled
        let fillColour;
        if (!this._micEnabled) {
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

    this.setMic = function(enable) { 
        if (enable) {
            this.mic.start();
            fourier.setInput(this.mic);
            if (visScreen.controls.playbackButton.getPlaying()) {
                visScreen.controls.playbackButton.setPlaying(false);
            }
            this._micEnabled = true;
        } else {
            this.mic.stop();
            fourier.setInput(null);
            this._micEnabled = false;
        }
    };

    // ------------ INPUT HANDLER FUNCTIONS ------------

    this.hitCheck = function() {
        if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
          this.setMic(!this._micEnabled); // toggle the microphone
          return true;
        }
        return false;
    };
}