// MicController constructor
function MicController() {
    this.mic = new p5.AudioIn();
    this.micEnabled = false;
  
    this.enableMic = function() {
      this.micEnabled = !this.micEnabled;
      if (this.micEnabled) {
        this.mic.start();
        fourier.setInput(this.mic);
        if (sound.isPlaying()) {
          sound.pause();
          controls.playbackButton.setPlaying(false);
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
    this.width = 20;
    this.height = 20;
    this.enabled = false;
  
    this.draw = function() {
    if (this.enabled) {
        fill(255, 0, 0); // Red color for enabled state
    } else {
       fill(255); // White color for disabled state
    }
    rect(this.x, this.y, this.width, this.height);
    //add text to tell it's the mic button
    fill(255);
    textSize(20);
    text("Enable Microphone Input", this.x + this.width + 5, this.y + this.height);
    };
  
    this.hitCheck = function() {
      if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
        this.enabled = !this.enabled;
        controls.micController.enableMic();
        return true;
      }
      return false;
    };
  }

  function initMic() {
    controls.micButton.enabled = true;
    controls.micController.enableMic();
  }


  