function VisualisationScreen() {
    this.controls = new VisControls();

    this.vis = new Visualisations();
    this.vis.add(new Spectrum());
	this.vis.add(new WavePattern());
	this.vis.add(new Needles());
    this.vis.add(new HorizontalBars());
    this.vis.add(new CircularWaveform());

    this.draw = function() {
        this.vis.selectedVisual.draw();
        this.controls.draw();

        // start next song in playlist once current song reaches end
        if (convertToMins(currentSong.sound.currentTime()) ==
            convertToMins(currentSong.sound.duration())) {
            // checks to make sure song is not meant to be looped instead
            if (!visScreen.controls.loopButton.loopEnabled) {
                // pauses current song before changing songs
                visScreen.controls.playbackButton.setPlaying(false);
                if (currentSong != songs[songs.length-1]) {
                    // get index of current song
                    let index = songs.indexOf(currentSong);
                    // change current song to next song in songs array
                    currentSong = songs[index + 1];
                } else { // if on last song, set song to 0 for cycle effect
                    currentSong = songs[0];
                }
                // apply tempo status of previous song to new song
                currentSong.sound.rate(visScreen.controls.tempoButton.currentSpeed);
                // set the song to start playing
                visScreen.controls.playbackButton.setPlaying(true);
            }
        }
    }
}