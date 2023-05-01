// MicController constructor
function MicController() {
  this.mic = new p5.AudioIn();
  this.micEnabled = false;

  this.enableMic = function() { 
    this.micEnabled = !this.micEnabled;
    if (this.micEnabled) {
      this.mic.start();
      fourier.setInput(this.mic);
      if (currentSong.sound.isPlaying()) {
        currentSong.sound.pause();
        visScreen.controls.playbackButton.setPlaying(false);
      }
    } else {
      this.mic.stop();
      fourier.setInput(null);
    }
  };
}

// MicButton constructor
function MicButton() {
  this.x = 50;
  this.y = 20;
  this.width = 40; // Increased width
  this.height = 40; // Increased height
  this.enabled = false;

  this.draw = function() {
      push();
      // Draw the square around the bold letter M
      if (this.enabled) {
          fill(255, 0, 0); // Red color for enabled state
      } else {
          fill(255); // White color for disabled state
      }
      rect(this.x, this.y, this.width, this.height);

      // Draw the bold letter M inside the square
      textSize(38); // Increased text size
      textAlign(CENTER, CENTER);
      if (this.enabled) {
          fill(255); // White color for enabled state
      } else {
          fill(0); // Black color for disabled state
      }
      textStyle(BOLD);
      text("M", this.x + this.width / 2, this.y + this.height / 2 );
      pop();
  };

  this.hitCheck = function() {
    if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
      this.enabled = !this.enabled; // Toggle the state
      visScreen.controls.micController.enableMic(); // Enable/disable the microphone
      return true;
    }
    return false;
  };
}