function KaraokeGame() {
    this._score = 0;
    this._songName = currentSong.songName;
    this.pitchDetect = null;
    this._pitchDetectionReady = false;
    this._userPitch = null;
    this.songPitchData = [];
    this.songPitchHistory = [];
    this.userPitchHistory = [];
    this.playing = false; // Initialise playstate to false
    this.gameStarted = false; // Initialise gameStarted to false
    this.gameOver = false; // Initialise gameOver to false
    this.unpauseCountdown = -1; // Initialise unpause countdown to -1
    this.songCurrentTime = "0:00"; // Initialise song time to 0
    this.useCameraBackground = false; // Initialise useCameraBackground to false
    this.video = null; // Initialise video to null
    this.showVisuals = true; // Initialise showVisuals to true
    this.analyzeSongPitchDataCalled = false //
    this.updateRate = 5; // The update rate (every N frames)
    this.maxDataPoints = 200; // Number of data points stored in the arrays
    this.updateCounter = 0; // Counter used to track frame updates
    this.pitchDetectionThrottle = 500; // Throttle pitch detection calls to every 500 ms
    this.lastPitchDetectionTime = 0; // Initialize the last pitch detection time


    // set gif overlay effects to paused at start
    glitter.pause();
    hearts.pause();
    butterflies.pause();

    /**
     * Converts a given number in seconds to minute:seconds format.
     * 
     * @param {Number} time number of seconds to be converted
     * @returns {String} time converted to string in minute:seconds format
     */
    this._convertToMins = function(time) {
        // Get the seconds component of the time
        let timeSeconds = Math.floor(time) % 60;
        // Get the minutes component of the time
        let timeMinutes = Math.floor(time / 60);
        // Format the time correctly
        // Insert zero before seconds count if less than 10 for formatting
        let timeInMins = `${timeMinutes}:${timeSeconds < 10 ? '0' : ''}${timeSeconds}`;
        return timeInMins;
    };

    // get song duration in minutes:seconds format
    this.songDuration = this._convertToMins(currentSong.sound.duration());

    this.initPitchDetection = async function() {
        await getAudioContext().suspend(); // So this suspends the audio context before we start setting up the mic input
        this.mic = new p5.AudioIn(); // The code here creates a new p5.AudioIn object to get the mic input
        this.mic.start(() => { // Now we're starting the microphone input
            console.log("Microphone input started.");
            const audioContext = getAudioContext(); // The code gets the audio context from p5.js
        
            // The following code initializes the ml5 pitch detection model with the audio context and the microphone input stream
            this.pitchDetection = ml5.pitchDetection('./model/', audioContext, this.mic.stream, () => {
                this._pitchDetectionReady = true; // So this sets the pitch detection ready flag to true once the model is loaded
            });
        }, (error) => {
            console.error("Error starting microphone input:", error); // If there's any error while starting the mic input, it gets logged here
        });
    };   
    
    this.pointsAdded = 0; // The number of points added to the score in the last frame

    this.calculateScore = function (userPitch, songPitch) {
        let pitchTolerance = 300; // Set the tolerance for pitch difference
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

    this.getSongPitchAt = function(time) {
        let closestTimeIndex = -1;
        let minTimeDifference = Infinity;
  
        // Iterate through the songPitchData array to find the closest time
        for (let i = 0; i < this.songPitchData.length; i++) {
            let timeDifference = Math.abs(time - this.songPitchData[i].time);
            if (timeDifference < minTimeDifference) {
                minTimeDifference = timeDifference;
                closestTimeIndex = i;
            }
        }
  
        // If there's no data available, return -1
        if (closestTimeIndex === -1) {
            return -1;
        }
  
        // Return the pitch at the closest time
        return this.songPitchData[closestTimeIndex].pitch;
    }

    this.initWebcam = function () {
        this.video = createCapture(VIDEO); // Create a video capture element
        this.video.size(width, height); // Set the video size to match the canvas size
        this.video.hide(); // Hide the default video element
    };

    this.initWebcam(); // This calls the initWebcam function to initialise the webcam


    this.drawPitchWaveform = function() {
        let waveformHeight = 200; // Adjust the height of the waveform as desired
        let waveformY = height - waveformHeight - 50; // Position the waveform above the lyrics display
    
        push();
            noFill();
            strokeWeight(2);
        
            // Draw the song's pitch waveform
            stroke(255, 0, 0);
            beginShape();
            for (let i = 1; i < this.songPitchHistory.length; i++) {
                let x = map(i, 0, this.songPitchHistory.length, 0, width);
                let y = map(this.songPitchHistory[i], 0, 2000, waveformY + waveformHeight, waveformY);
                vertex(x, y);
            }
            endShape();
        
            // Draw the user's pitch waveform
            stroke(0, 255, 0);
            beginShape();
            for (let i = 1; i < this.userPitchHistory.length; i++) {
                let x = map(i, 0, this.userPitchHistory.length, 0, width);
                let y = map(this.userPitchHistory[i], 0, 2000, waveformY + waveformHeight, waveformY);
                vertex(x, y);
            }
            endShape();
    
        pop();
    };
    
  

    this.drawLyrics = function() {
        let currentTime = currentSong.sound.currentTime();
        let currentLyricIndex = null;
        
        for (let i = 0; i < currentSong.lyricsData.length; i++) {
            if (currentTime >= currentSong.lyricsData[i].time) {
                currentLyricIndex = i;
            } else {
                break;
            }
        }
        
        if (currentLyricIndex !== null) {
            push();
            textAlign(CENTER);
            textSize(70);
            fill(255);
            stroke(0);
            strokeWeight(3);
            text(currentSong.lyricsData[currentLyricIndex].text, width / 2, height - 200);
            if (currentLyricIndex != currentSong.lyricsData.length-1) {
                fill(140);
                textSize(55);
                text(currentSong.lyricsData[currentLyricIndex+1].text, width/2, height - 100);
            }
            pop();
        }
    };
  

    this.drawDualPitchBars = function(userPitch, songPitch) {
        // Constants for bar dimensions and maximum pitch
        const barWidth = 50;
        const barHeight = 300;
        const maxPitch = 1000;
    
        // X-coordinates for user and song pitch bars
        const userBarX = 50;
        const songBarX = 150;
    
        // Calculate the filled heights of the user and song pitch bars, ensuring they are within the range of 0 to barHeight
        const userFilledHeight = Math.min(barHeight, Math.max(0, (userPitch / maxPitch) * barHeight));
        const songFilledHeight = Math.min(barHeight, Math.max(0, (songPitch / maxPitch) * barHeight));
    
        push();
            noStroke();
        
            // Draw the user pitch bar based on the user's pitch value
            fill(0, 255, 0, 150);
            rect(userBarX, height - userFilledHeight - 200, barWidth, userFilledHeight);
        
            // Draw the song pitch bar based on the song's pitch value
            fill(255, 0, 0, 150);
            rect(songBarX, height - songFilledHeight - 200, barWidth, songFilledHeight);
        pop();
    };    

    this._drawPauseMenu = function() {
        push();
        fill(0,0,0,128);
        rect(0,0,width,height);
        textAlign(CENTER);
        fill(255);
        stroke(0);
        strokeWeight(4);
        textSize(100);
        // checks if there is an unpause countdown currently in effect
        if (this.unpauseCountdown != -1) {
            if (this.unpauseCountdown > 0) {
                  // show countdown timer in centre of the screen
                  let countdownDisplay = Math.ceil(this.unpauseCountdown / 60);
                  text(countdownDisplay, width/2, height/2);
                  this.unpauseCountdown -= 1;
            } else { // when unpause countdown hits 0, unpause the game
                  currentSong.sound.play(); // plays hearable music
                  if (!this.gameStarted) {
                      // set song playhead to 0 to ensure it always
                      // starts from the beginning
                      currentSong.sound.jump();
                      setTimeout(function(){ Object.assign(currentSong.sound, {_playing: true}); }, 100);
                  }
                  // play overlay effect gifs
                  glitter.play();
                  hearts.play();
                  butterflies.play();
                  // sets playing condition to true
                  this.playing = true;
                  this.unpauseCountdown = -1;
                  if (!this.gameStarted) {
                    // set game started to true if this is the first unpause
                    this.gameStarted = true;
                  }
            }
        } else { // if no countdown, show pause screen
            textSize(48);
            if (mouseY > 270 && mouseY < 390) { // check mouse pos
                textStyle(BOLD); // menu option bold when hovered over
            }
            if (this.gameStarted) { // if game started show resume option
                text('RESUME', width/2, 350);
                getAudioContext().resume();
            } else { // if game not started show start option
                text('START', width/2, 350);
                getAudioContext().resume();
            }
            textStyle(NORMAL);
            if (mouseY > 470 && mouseY < 590) { // check mouse pos
                textStyle(BOLD); // menu option bold when hovered over
            }
            text('BACK TO MENU', width/2, 550);
        }
        pop();
    }

    this.draw = function() {  

        // If useCameraBackground is true, draw the webcam feed as the background
        if (this.useCameraBackground && this.video) {
            image(this.video, 0, 0, width, height);
        } else {
            background(0);
        }

        // draw glitter and hearts overlay gifs
        image(glitter, 0, 0, width/2, height);
        image(glitter, width/2, 0, width/2, height);
        image(hearts, 0, 0, width, height);
        image(butterflies, 0, 0, width, height);

        push();
        // Draw stats and info for current song
        fill(255);
        textSize(32);
        textAlign(LEFT);
        text('SONG', 140, 148);
        text('SCORE', 120, 247);
        text('POINTS +', 90, 347);

        textSize(60);
        text(this._songName, 250, 150);
        text(nfc(this._score), 250, 250);
        text(this.pointsAdded, 250, 350)
        textAlign(CENTER);

        // Draw current song time & length of song in minutes:seconds format
        if (this.playing) {
            this.songCurrentTime = this._convertToMins(currentSong.sound.currentTime());
            this.update();
            this.drawLyrics();
        }
        text(`${this.songCurrentTime} / ${this.songDuration}`, width - 340, 250);

        // if song is playing display "pause", if paused display "play"
        textSize(48);
        if (this.playing) {
            text('PRESS P TO PAUSE', width-340, 150);
        } else {
            text('PRESS P TO PLAY', width-340, 150);
        }
        pop();
        
        let songPitch = this.getSongPitchAt(currentSong.sound.currentTime()) || 0;
        let userPitch = this._userPitch || 0;


        
        if (this.showVisuals) {
             this.drawDualPitchBars(userPitch, songPitch);
            this.drawPitchWaveform();
        }

        if (!this.playing) {
            this._drawPauseMenu();
        }
        
    };

    this.analyzeSongPitchData = function () {
        // Check if the function has already been executed
        if (this.analyzeSongPitchDataCalled) {
          return; // Exit the function if it has been executed before
        }
      
        // Set the flag to indicate the function has been executed
        this.analyzeSongPitchDataCalled = true;
      
        let duration = currentSong.sound.duration(); // Get the duration of the song
        let interval = 0.5; // Analyze pitch data every 5 miliseconds
      
        fourier.setInput(currentSong.sound); // Set the sound as the input for the FFT
      
        // Function to analyze the pitch data at a given time
        let analyze = (currentTime) => {
          if (currentTime >= duration) {
            // If the currentTime exceeds the song's duration, exit the function
            return;
          }
      
          if (currentSong.sound.isPlaying()) {
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
            let sampleRate = currentSong.sound.sampleRate(); // Get the sample rate from the sound
            let fftSize = fourier.bins * 2; // Calculate the FFT size (twice the number of bins)
            let dominantFrequency = maxAmplitudeIndex * sampleRate / (2 * fftSize); // Calculate the frequency using the formula
      
            let roundedTime = Math.round(currentTime * 10) / 10;
      
            // Save the dominant frequency and the corresponding time in the songPitchData array
            this.songPitchData.push({
              time: roundedTime,
              pitch: dominantFrequency,
            });
          }
      
          // Schedule the next pitch analysis after the defined interval
          setTimeout(() => {
            analyze(currentTime + interval);
          }, interval * 1000);
        };
      
        // Start analyzing the pitch data from the beginning of the song
        analyze(0);
      };
      
    this.lastScoreUpdateTime = 0; // Add this line in the KaraokeGame constructor

    this.update = function() {
        // Checks if 1 second have passed since the last score update
        if (millis() - this.lastScoreUpdateTime >= 1000) {
            // Checks if the pitch detection model is loaded and ready, and the song is playing
            if (this.pitchDetection && this._pitchDetectionReady && this.playing) {
                // Throttle pitch detection calls
                if (millis() - this.lastPitchDetectionTime >= this.pitchDetectionThrottle) {
                    // Update the last pitch detection time
                    this.lastPitchDetectionTime = millis();
                    
                    // Uses the in-built ml5 pitchDetection object to get the user's pitch from the microphone input
                    this.pitchDetection.getPitch((err, frequency) => {
                        if (err) {
                            console.error("Error getting pitch:", err);
                        }
                        // So if a frequency is actually detected, it will update the user's pitch
                        if (frequency) {
                            this._userPitch = frequency;
                            // Uses the getSongPitchAt function to get the song's pitch at the current time
                            let songPitch = this.getSongPitchAt(currentSong.sound.currentTime());
                            // It calls the calculateScore function to calculate the score based on the user's pitch and the song's pitch
                            this.calculateScore(this._userPitch, songPitch);
                            console.log("Song pitch: " + songPitch);
                            console.log("User Pitch: " + this._userPitch);
                        } else {
                            console.log("Frequency is not detected");
                        }
                    });
                }
            } else {
                console.log("Pitch detection is not ready");
            }
    
            // Update the lastScoreUpdateTime variable to the current time
            this.lastScoreUpdateTime = millis();
        }
    
        if (this.playing) {
            let songPitch = this.getSongPitchAt(currentSong.sound.currentTime());
            let userPitch = this._userPitch;
    
            this.songPitchHistory.push(songPitch || 0);
            this.userPitchHistory.push(userPitch || 0);
        }
    }
    

    //
    // ------------ INPUT HANDLER FUNCTIONS ------------
    //

    this.keyPressed = function() {
        if (this.playing) {
            if (key == "P" || key == "p") {
                // saves time of the song when paused as time to be displayed
                this.songCurrentTime = this._convertToMins(currentSong.sound.currentTime());
                // pauses music
                currentSong.sound.pause();
                // pauses gif overlay effects
                glitter.pause();
                hearts.pause();
                butterflies.pause();
                this.playing = false; // sets playstate to false
            }
        } else {
            if ((key == "P" || key == "p") && this.unpauseCountdown == -1) {
                this.unpauseCountdown = 180; // set unpause countdown to 3 secs
            }
        }
        if (key == "C" || key == "c") {
            // Toggle the useCameraBackground boolean when the "C" key is pressed
            this.useCameraBackground = !this.useCameraBackground;
        }
        // Toggle the showVisuals property when the "H" key is pressed
        if (key == "H" || key == "h") {
            this.showVisuals = !this.showVisuals;
        }

    }

    this.mousePressed = function() {
        if (!this.playing && this.unpauseCountdown == -1) {
            if (!this.gameOver) {
                if (mouseY > 270 && mouseY < 390) {
                    this.unpauseCountdown = 180; // set unpause countdown to 3 secs
                } else if (mouseY > 470 && mouseY < 590) {
                    home.selected = ""; // sends you back to the home screen
                }
            } else {
                // TO DO: GAME OVER SCREEN "BACK TO MENU" BUTTON
            }
        }
    }
}