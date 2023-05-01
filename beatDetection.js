function BeatDetection(beatInterval, difficultyValue) {
    // Some code taken and changed from source:
    // https://stackoverflow.com/questions/68401251/analyzing-songfile-using-fft-when-i-set-the-song-volume-to-0-in-p5-js

    currentSong.ghostSound.disconnect();
    this.fft = new p5.FFT();
    this.fft.setInput(currentSong.ghostSound);

    // mutes song for the listener but still allows FFT analysis
    mute = new p5.EQ();
    mute.amp(0);
    currentSong.ghostSound.connect(mute);
    mute.connect();

    this.beatInterval = beatInterval;  // amount of time in seconds between each pulse "beat"

    // determines how many frames before a peak can be detected.
    // lower value means more notes will spawn due to more peaks.
    this.difficulty = difficultyValue;

    // p5 function to check for peaks in a frequency spectrum
    this.peakDetect = new p5.PeakDetect(currentSong.freq1,
                                        currentSong.freq2,
                                        currentSong.threshold,
                                        this.difficulty);

    this.initialised = false; // check to see if song has performed "jump"

    // when song is started for the first time, jump one bar forward
    // so notes can spawn a bar before beat is heard 
    this.playGhostSong = function() {
        currentSong.ghostSound.play();
        if (!this.initialised) {
            // start the song one bar (4 pulses) ahead if played for the first time
            currentSong.ghostSound.jump(this.beatInterval*4);
            // p5 sound jump method was buggy and not giving expected results.
            // code line below is a workaround found online from source:
            // https://github.com/processing/p5.js-sound/issues/372#issuecomment-560027420
            setTimeout(() => { Object.assign(currentSong.ghostSound, {_playing: true}); }, 100);
            this.initialised = true;
        }
    }

    // analyse FFT and update peak detection
    this.detectBeat = function() {
        this.fft.analyze();
        this.peakDetect.update(this.fft);
        // return true if peak or "beat" is detected
        if (this.peakDetect.isDetected) {
            return true;
        }
        return false;
    }
}