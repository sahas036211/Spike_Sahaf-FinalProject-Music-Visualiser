function SpeedUpButton() {
    this.width = 30;
    this.height = 30;
    this.x = (width / 2) + 40; // Positioned to the right of the PlaybackButton
    this.y = height - 160;
  
    this.draw = function () {
      // Draw a plus sign (+) inside a circle
      ellipse(this.x + this.width / 2, this.y + this.height / 2, this.width, this.height);
      line(this.x + this.width / 2, this.y + 10, this.x + this.width / 2, this.y + 20);
      line(this.x + 10, this.y + this.height / 2, this.x + 20, this.y + this.height / 2);
    };
  
    this.hitCheck = function () {
      const distance = dist(mouseX, mouseY, this.x + this.width / 2, this.y + this.height / 2);
      if (distance < this.width / 2) {
        const newSpeed = currentSong.sound.rate() * 2;
        currentSong.sound.rate(newSpeed);
        return true;
      }
      return false;
    };
  }
  