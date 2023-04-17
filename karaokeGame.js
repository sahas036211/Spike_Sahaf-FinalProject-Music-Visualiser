function KaraokeGame() {
    this._score = 0;
    this._songName = "BAKAMITAI";
    this._songDuration = 0;
    this.pitchDetect = null;
  
    this._convertToMins = function(time) {
      let timeSeconds = Math.floor(time) % 60;
      let timeMinutes = Math.floor(time / 60);
      let timeInMins = `${timeMinutes}:${timeSeconds}`;
      if (timeSeconds == 0) {
        timeInMins = timeInMins + "0";
      }
      return timeInMins;
    };
  
    this.calculateScore = function(userPitch, songPitch) {
      let pitchDifference = Math.abs(userPitch - songPitch);
      let scoreIncrement = Math.max(0, 100 - pitchDifference);
      this._score += scoreIncrement;
    };
  
    this.draw = function() {
      push();
      fill("white");
      textSize(36);
      textAlign(LEFT);
      text(`CURRENT SONG: ${this._songName}`, 80, 100);
      text(`SCORE: ${this._score}`, 80, 200);
  
      let songCurrentTime = this._convertToMins(sound.currentTime());
      let songDuration = this._convertToMins(this._songDuration);
      text(`${songCurrentTime} / ${songDuration}`, width - 360, 200);
      pop();
    };
  
    this.initPitchDetection = async function() {
        await getAudioContext().suspend();
        // Get the user's microphone input
        this.mic = new p5.AudioIn();
        this.mic.start(() => {
          console.log("Microphone input started.");
          // Create a media stream source from the microphone input
          let audioContext = getAudioContext();
          let micStream = this.mic.stream;
          this.audioStream = audioContext.createMediaStreamSource(micStream);
      
          // Initialize the pitch detection model
          this.pitchDetection = ml5.pitchDetection('./model/', audioContext, this.audioStream, modelLoaded);
      
          function modelLoaded() {
            console.log("Pitch detection model loaded");
          }
        }, (error) => {
          console.error("Error starting microphone input:", error);
        });
      };
      
  
    this.update = function() {
      if (this.pitchDetect) {
        this.pitchDetect.getPitch((err, frequency) => {
          if (frequency && !isNaN(frequency)) {
            let userPitch = frequency;
            let songPitch = getSongPitchAt(sound.currentTime());
            this.calculateScore(userPitch, songPitch);
          }
        });
      }
    };
  }
  
  function getSongPitchAt(time) {
    // This function should return the pitch of the song at the given time
    // Implementation depends on how you store and access the song's pitch data
  }
  