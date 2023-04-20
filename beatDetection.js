function BeatDetection(bps) {
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

    this.peakDetect = new p5.PeakDetect(140,3500,0.5);

    this.initialised = false;

    // amount of time in seconds between each "beat"
    this.bps = bps; 
    // when song is started for the first time, jump one bar forward
    // so notes can spawn a bar before beat is heard 
    this.playGhostSong = function() {
        rhythmGhostSound.play();
        if (!this.initialised) {
            // start the song one bar (4 beats) ahead if played for the first time
            rhythmGhostSound.jump(this.bps*4);
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