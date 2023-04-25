function PlayButton(xFunc, yFunc, w, h) {
  this.xFunc = xFunc;
  this.yFunc = yFunc;
  this.w = w;
  this.h = h;
  this.status = 'play';

  this.draw = function() {
    let x = this.xFunc();
    let y = this.yFunc();

    push();
    fill(0, 255, 0);
    rect(x, y, this.w, this.h);
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text(this.status.toUpperCase(), x + this.w / 2, y + this.h / 2);
    pop();
  };
  

  this.isMouseOver = function() {
    // Update these lines:
    let x = this.xFunc();
    let y = this.yFunc();
  
    return mouseX > x && mouseX < x + this.w && mouseY > y && mouseY < y + this.h;
  };
  

  this.onClick = function() {
    if (this.isMouseOver()) {
      if (this.status === 'play') {
        this.status = 'pause';
        sound.play();
      } else {
        this.status = 'play';
        sound.pause();
      }
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
  this.playButton = new PlayButton(() => width - 160, () => 50, 150, 50);
  this.lyricsData = [];

  this._convertToMins = function(time) {
    let timeSeconds = Math.floor(time) % 60;
    let timeMinutes = Math.floor(time / 60);
    let timeInMins = `${timeMinutes}:${timeSeconds < 10 ? '0' : ''}${timeSeconds}`;
    return timeInMins;
  };

  this.pointsAdded = 0; // Add this line in the KaraokeGame constructor

  this.calculateScore = function (userPitch, songPitch) {
    let pitchTolerance = 200; // Set the tolerance for pitch difference
    let pitchDifference = Math.abs(userPitch - songPitch); // Calculate the difference between userPitch and songPitch
    
    // Check if the pitch difference is within the tolerance
    if (pitchDifference <= pitchTolerance) {
      // Calculate a score based on the closeness of the user's pitch to the song pitch
      let scoreMultiplier = 1 - (pitchDifference / pitchTolerance);
      let scoreToAdd = Math.floor(10 * scoreMultiplier);
      this._score += scoreToAdd;
      this.pointsAdded = scoreToAdd; // Update pointsAdded with the score added
    } else {
      this.pointsAdded = 0; // No points added if the user's pitch is not within tolerance
    }
  };

  this.loadLyrics = function(lrcFile) {
    loadStrings(lrcFile, (lines) => {
      lines.forEach((line) => {
        let match = line.match(/^\[(\d{2}):(\d{2})\.(\d{2})\](.*)$/);
        if (match) {
          let minutes = parseInt(match[1]);
          let seconds = parseInt(match[2]);
          let milliseconds = parseInt(match[3]);
          let text = match[4].trim();
          let time = minutes * 60 + seconds + milliseconds / 100;
          this.lyricsData.push({ time, text });
        }
      });
    });
  };

  this.drawLyrics = function() {
    let currentTime = sound.currentTime();
    let currentLyricIndex = null;
    
    for (let i = 0; i < this.lyricsData.length; i++) {
      if (currentTime >= this.lyricsData[i].time) {
        currentLyricIndex = i;
      } else {
        break;
      }
    }
    
    if (currentLyricIndex !== null) {
      push();
      textAlign(CENTER);
      textSize(28);
      fill(255);
      text(this.lyricsData[currentLyricIndex].text, width / 2, height - 100);
      pop();
    }
  };
  

  this.drawPitchMeter = function(userPitch, targetPitch) {
    let barX = 100;
    let barY = 300;
    let barWidth = 50;
    let barHeight = 500;
    let maxPitchDifference = 600;
  
    // Calculate the height of the colored portion based on the difference between userPitch and targetPitch
    let pitchDifference = Math.abs(userPitch - targetPitch);
    let filledHeight = map(pitchDifference, 0, maxPitchDifference, barHeight, 0);
  
    // Calculate the color based on the pitch difference
    let colorValue = map(pitchDifference, 0, maxPitchDifference, 0, 255);
    let gaugeColor = color(255 - colorValue, colorValue, 0);
  
    // Draw the background bar
    push();
    noFill();
    stroke(255, 255, 255, 50);
    strokeWeight(2);
    rect(barX, barY, barWidth, barHeight);
    pop();
  
    // Draw the colored portion of the bar indicating the difference between userPitch and targetPitch
    push();
    noStroke();
    fill(gaugeColor);
    rect(barX, barY + (barHeight - filledHeight), barWidth, filledHeight);
    pop();
  };

  this.loadLyrics('assets/bakamitailyrics.lrc');

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

    //This code shows the points added on the screen
    push();
      fill("white");
      textSize(24);
      textAlign(LEFT);
      text(`POINTS ADDED: ${this.pointsAdded}`, 80, 250);
    pop();

    let songPitch = getSongPitchAt(sound.currentTime()) || 0;
    let userPitch = this._userPitch || 0;
    this.drawPitchMeter(userPitch, songPitch);

    this.drawLyrics();
    this.playButton.draw();
    this.update();
  };

  //this code makes the play button clickable
  this.handleMouseClick = function() {
    this.playButton.onClick();
  };

  this.initPitchDetection = async function() {
    await getAudioContext().suspend(); // So this suspends the audio context before we start setting up the mic input
    this.mic = new p5.AudioIn(); // The code here creates a new p5.AudioIn object to get the mic input
    this.mic.start(() => { // Now we're starting the microphone input
      console.log("Microphone input started.");
      const audioContext = getAudioContext(); // The code gets the audio context from p5.js
  
      // The following code initializes the ml5 pitch detection model with the audio context and the microphone input stream
      this.pitchDetection = ml5.pitchDetection('./model/', audioContext, this.mic.stream, () => {
        console.log("Pitch detection model loaded");
        this._pitchDetectionReady = true; // So this sets the pitch detection ready flag to true once the model is loaded
      });
    }, (error) => {
      console.error("Error starting microphone input:", error); // If there's any error while starting the mic input, it gets logged here
    });
  };   
  
  this.lastScoreUpdateTime = 0; // Add this line in the KaraokeGame constructor

  this.update = function() {
    // Checks if 1 second have passed since the last score update
    if (millis() - this.lastScoreUpdateTime >= 100) {
      // Checks if the pitch detection model is loaded and ready, and the song is playing
      if (this.pitchDetection && this._pitchDetectionReady && this.playButton.status === 'pause') {
        // Uses the in-built ml5 pitchDetection object to get the user's pitch from the microphone input
        this.pitchDetection.getPitch((err, frequency) => {
          if (err) {
            console.error("Error getting pitch:", err);
          }
          //So if a frequency is actually detected, it will update the user's pitch
          if (frequency) {
            this._userPitch = frequency;
            //Uses the getSongPitchAt function to get the song's pitch at the current time
            let songPitch = getSongPitchAt(sound.currentTime());
            // It calls the calculateScore function to calculate the score based on the user's pitch and the song's pitch
            this.calculateScore(this._userPitch, songPitch);
            console.log("Song pitch: " + songPitch);
            console.log("User Pitch: " + this._userPitch);
          } else {
            console.log("Frequency is not detected");
          }
        });
        // Update the lastScoreUpdateTime variable to the current time
        this.lastScoreUpdateTime = millis();
      } else {
        console.log("Pitch detection is not ready");
      }
    }
  };
}


function analyzeSongPitchData() {
  let duration = sound.duration(); // Get the duration of the song
  let interval = 0.1; // Analyze pitch data every 0.1 seconds

  // Function to analyze the pitch data at a given time
  let analyze = (currentTime) => {
    if (currentTime >= duration) {
      // If the currentTime exceeds the song's duration, exit the function
      return;
    }

    // Get the frequency spectrum of the song at the current time
    let spectrum = fourier.analyze();
    let maxAmplitudeIndex = -1;
    let maxAmplitude = -Infinity;

    // Find the index with the maximum amplitude in the spectrum
    for (let i = 0; i < spectrum.length; i++) {
      if (spectrum[i] > maxAmplitude) {
        maxAmplitude = spectrum[i];
        maxAmplitudeIndex = i;
      }
    }

    // Get the dominant frequency using the index with the maximum amplitude
    let dominantFrequency = fourier.getEnergy(maxAmplitudeIndex);
    let roundedTime = Math.round(currentTime * 10) / 10;

    // Save the dominant frequency and the corresponding time in the songPitchData array
    songPitchData.push({
      time: roundedTime,
      pitch: dominantFrequency,
    });

    // Schedule the next pitch analysis after the defined interval
    setTimeout(() => {
      analyze(currentTime + interval);
    }, interval * 1000);
  };

  // Start analyzing the pitch data from the beginning of the song
  analyze(0);
}

function getSongPitchAt(time) {
  let roundedTime = Math.round(time * 10) / 10;

  // Use a for loop to find the pitch at a given time in the songPitchData array
  for (let i = 0; i < songPitchData.length; i++) {
    if (songPitchData[i].time === roundedTime) {
      // If a pitch is found for the given time, return the pitch value
      console.log(`Pitch at time ${roundedTime}: ${songPitchData[i].pitch}`);
      return songPitchData[i].pitch;
    }
  }

  // If no pitch is found for the given time, return null
  console.log(`No pitch found for time ${roundedTime}`);
  return null;
}


