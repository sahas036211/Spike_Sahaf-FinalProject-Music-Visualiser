function TempoButton() {
    this.width = 30;
    this.height = 30;
    this.x = (width / 2) + 150; // Positioned to the right of the PlaybackButton
    this.y = height - 160;

    this._speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    this._currentSpeed = this._speeds[3]; // default speed of 1x

    this.image = tempoButtonImg;
    this.image.resize(this.width, this.height); // scale image to correct size
    
    this.draw = function () {
        push();
        image(this.image, this.x, this.y);
        fill("white");
        textSize(24);
        textAlign(LEFT);
        text(`${this._currentSpeed}x`, this.x + 45, this.y + 25);
        pop();
    };

    // ------------ GETTER & SETTER FUNCTIONS ------------

    this.getSpeed = function() {
        return this._currentSpeed;
    }
  
    // ------------ INPUT HANDLER FUNCTIONS ------------

    this.hitCheck = function () {
        if (mouseX > this.x
            && mouseX < this.x + this.width
            && mouseY > this.y
            && mouseY < this.y + this.height) {
            
            if (this._currentSpeed == this._speeds[this._speeds.length-1]) {
                // set speed index to 0 if on last index for cycle functionality
                this._currentSpeed = this._speeds[0];
            } else {
                // set speed to next in array if not at the last index
                let index = this._speeds.indexOf(this._currentSpeed);
                this._currentSpeed = this._speeds[index+1];
            }
            // set song speed to changed rate
            currentSong.sound.rate(this._currentSpeed);
            return true;
        }
            return false;
    };
}
  