function WebcamButton() {
    this.x = (width/2) - 350;
    this.y = height - 160;
    this.width = 30;
    this.height = 30;
    
    this.image = camButtonImg;
    this.image.resize(this.width, this.height); // scale image to correct size
    pixelDensity(1);
    this.image.loadPixels(); // load pixels of image to edit

    // flag to determine whether cam is enabled or not
	this._enabled = false;

    // Webcam input
    this.webcam = null;

    this.draw = function() {
        push();
        image(this.image, this.x, this.y);
        
        // button is white if enabled, grey if disabled
        let fillColour;
        if (!this._enabled) {
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
    };

    // ------------ GETTER & SETTER FUNCTIONS ------------

    this.setWebcam = function(enable) {
        if (enable) {
            this.webcam = createCapture(VIDEO);
            this.webcam.hide();
            this._enabled = true;
        } else {
            this.webcam.remove();
            this._enabled = false;
        }
    };

    this.getWebcam = function() {
        return this.webcam;
    }

    this.getEnabled = function() {
        return this._enabled;
    }

    // ------------ INPUT HANDLER FUNCTIONS ------------

    this.hitCheck = function () {
        if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
            this.setWebcam(!this._enabled); // toggle the webcam
            return true;
        }
        return false;
    };
}
