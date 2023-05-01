function TempoButton() {
    this.width = 30;
    this.height = 30;
    this.x = (width / 2) + 150; // Positioned to the right of the PlaybackButton
    this.y = height - 160;

    this.speeds = [0.25, 0.5, 1, 1.5, 2];
    this.currentSpeed = this.speeds[2];

    this.image = tempoButtonImg;
    this.image.resize(this.width, this.height);
    
    this.draw = function () {
        push();
        image(this.image, this.x, this.y);
        fill("white");
        textSize(24);
        textAlign(LEFT);
        text(`${this.currentSpeed}x`, this.x + 45, this.y + 23);
        pop();
    };
  
    this.hitCheck = function () {
        if (mouseX > this.x
            && mouseX < this.x + this.width
            && mouseY > this.y
            && mouseY < this.y + this.height) {
            if (this.currentSpeed == this.speeds[this.speeds.length-1]) {
                this.currentSpeed = this.speeds[0];
            } else {
                let index = this.speeds.indexOf(this.currentSpeed);
                this.currentSpeed = this.speeds[index+1];
            }
            currentSong.sound.rate(this.currentSpeed);
            return true;
        }
            return false;
    };
}
  