function BeatDetection(bps, difficultyValue) {
    // Some code taken and changed from source:
    // https://stackoverflow.com/questions/68401251/analyzing-songfile-using-fft-when-i-set-the-song-volume-to-0-in-p5-js

    rhythmGhostSound.disconnect();
    this.fft = new p5.FFT();
    this.fft.setInput(rhythmGhostSound);

    // mutes song for the listener but still allows FFT analysis
    mute = new p5.EQ();
    mute.amp(0);
    rhythmGhostSound.connect(mute);
    mute.connect();

    // amount of time in seconds between each "beat"
    this.bps = bps;
    // determines how many frames before a peak can be detected.
    // lower value means more notes will spawn due to more peaks.
    this.difficulty = difficultyValue;

    this.peakDetect = new p5.PeakDetect(140,3500,0.5,this.difficulty);

    this.initialised = false; // check to see if song has performed "jump"

    // when song is started for the first time, jump one bar forward
    // so notes can spawn a bar before beat is heard 
    this.playGhostSong = function() {
        rhythmGhostSound.play();
        if (!this.initialised) {
            // start the song one bar (4 beats) ahead if played for the first time
            rhythmGhostSound.jump(this.bps*4);
            // p5 sound jump method was buggy and not giving expected results.
            // code line below is a workaround found online from source:
            // https://github.com/processing/p5.js-sound/issues/372#issuecomment-560027420
            setTimeout(function(){ Object.assign(rhythmGhostSound, {_playing: true}); }, 100);
            this.initialised = true;
        }
    }

    this.detectBeat = function() {
        this.fft.analyze();
        this.peakDetect.update(this.fft);
        if (this.peakDetect.isDetected) {
            return true;
        }
        return false;
    }
}