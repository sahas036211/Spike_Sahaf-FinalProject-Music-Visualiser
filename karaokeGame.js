function PlayButton(xFunc, yFunc, w, h) {
  this.xFunc = xFunc;
  this.yFunc = yFunc;
  this.w = w;
  this.h = h;
  this.active = true;

  this.draw = function() {
    if (this.active) {
      // Update these lines:
      let x = this.xFunc();
      let y = this.yFunc();
  
      push();
      fill(0, 255, 0);
      rect(x, y, this.w, this.h);
      fill(255);
      textSize(24);
      textAlign(CENTER, CENTER);
      text('PLAY', x + this.w / 2, y + this.h / 2);
      pop();
    }
  };
  

  this.isMouseOver = function() {
    // Update these lines:
    let x = this.xFunc();
    let y = this.yFunc();
  
    return mouseX > x && mouseX < x + this.w && mouseY > y && mouseY < y + this.h;
  };
  

  this.onClick = function() {
    if (this.active && this.isMouseOver()) {
      this.active = false;
      sound.play();
    }
  };
}

var songPitchData = [];

function KaraokeGame() {
  this._score = 0;
  this._songName = "BAKAMITAI";
  this._songDuration = 0;
  this.pitchDetect = null;
  this._pitchDetectionReady = false;
  this._userPitch = null;
  this.playButton = new PlayButton(() => width / 2 - 75, () => height / 2 - 25, 150, 50);

  // ... the rest of the KaraokeGame function ...

  this._convertToMins = function(time) {
    let timeSeconds = Math.floor(time) % 60;
    let timeMinutes = Math.floor(time / 60);
    let timeInMins = `${timeMinutes}:${timeSeconds < 10 ? '0' : ''}${timeSeconds}`;
    return timeInMins;
  };

  this.calculateScore = function (userPitch, songPitch) {
    let pitchTolerance = 100;
    let pitchDifference = Math.abs(userPitch - songPitch);
  
    if (pitchDifference <= pitchTolerance) {
      this._score += 10;
    }
  };
  

  this.draw = function() {
    console.log("Drawing karaoke game");
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

    this.playButton.draw();
    this.update();
  };

  this.handleMouseClick = function() {
    this.playButton.onClick();
  };

  this.initPitchDetection = async function() {
    await getAudioContext().suspend();
    this.mic = new p5.AudioIn();
    this.mic.start(() => {
      console.log("Microphone input started.");
      const audioContext = getAudioContext();
  
      this.pitchDetection = ml5.pitchDetection('./model/', audioContext, this.mic.stream, () => {
        console.log("Pitch detection model loaded");
        this._pitchDetectionReady = true;
      });
    }, (error) => {
      console.error("Error starting microphone input:", error);
    });
  };  
  
  this.lastScoreUpdateTime = 0; // Add this line in the KaraokeGame constructor

  this.update = function() {
    console.log("Updating karaoke game");
  
    // Check if 10 seconds have passed since the last score update
    if (millis() - this.lastScoreUpdateTime >= 1000) {
      if (this.pitchDetection && this._pitchDetectionReady) {
        console.log("Pitch detection is ready");
        this.pitchDetection.getPitch((err, frequency) => {
          if (err) {
            console.error("Error getting pitch:", err);
          }
          if (frequency) {
            this._userPitch = frequency;
            let songPitch = getSongPitchAt(sound.currentTime());
            this.calculateScore(this._userPitch, songPitch);
          } else {
            console.log("Frequency is not detected");
          }
        });
        this.lastScoreUpdateTime = millis(); // Update the lastScoreUpdateTime
      } else {
        console.log("Pitch detection is not ready");
      }
    }
  };
  
  

  if (this.mic) {
    let micLevel = this.mic.getLevel();
    console.log("Microphone input level:", micLevel);
  }
}


function analyzeSongPitchData() {
  let duration = sound.duration();
  let interval = 0.1; // Analyze pitch data every 0.1 seconds

  let analyze = (currentTime) => {
    if (currentTime >= duration) {
      return;
    }

    let spectrum = fourier.analyze();
    let maxAmplitudeIndex = -1;
    let maxAmplitude = -Infinity;

    for (let i = 0; i < spectrum.length; i++) {
      if (spectrum[i] > maxAmplitude) {
        maxAmplitude = spectrum[i];
        maxAmplitudeIndex = i;
      }
    }

    let dominantFrequency = fourier.getEnergy(maxAmplitudeIndex);
    let roundedTime = Math.round(currentTime * 10) / 10;

    songPitchData.push({
      time: roundedTime,
      pitch: dominantFrequency,
    });

    setTimeout(() => {
      analyze(currentTime + interval);
    }, interval * 1000);
  };

  analyze(0);
}

function getSongPitchAt(time) {
  let roundedTime = Math.round(time * 10) / 10;

  // Use a for loop to find the pitch at a given time
  for (let i = 0; i < songPitchData.length; i++) {
    if (songPitchData[i].time === roundedTime) {
      console.log(`Pitch at time ${roundedTime}: ${songPitchData[i].pitch}`); // Add this line
      return songPitchData[i].pitch;
    }
  }

  console.log(`No pitch found for time ${roundedTime}`); // Add this line
  return null;
}

