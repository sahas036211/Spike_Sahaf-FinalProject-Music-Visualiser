function VisualisationScreen() {
    this.controls = new VisControls();

    this.vis = new Visualisations();
    this.vis.add(new Spectrum());
	this.vis.add(new WavePattern());
	this.vis.add(new Needles());

    this.draw = function() {
        this.vis.selectedVisual.draw();

        fill('#333333');
        rectMode(LEFT);
        // progress bar
        rect(width/4, height-100, width/2, 25, 90);
        // white song progress bar
        let progressWidth = map(currentSong.sound.currentTime(),
                                0, currentSong.sound.duration(),
                                0, width/2);
        fill(255);
        rect(width/4, height-100, progressWidth, 25, 90, 0, 0, 90);

        

        push();
        textAlign(RIGHT);
        textSize(24);
        text(convertToMins(currentSong.sound.currentTime()), 
            (width/4)-40, height-86)
        textAlign(LEFT);
        text(convertToMins(currentSong.sound.duration()), 
            (width*0.75)+40, height-86)
        pop();

        this.controls.draw();
    }
}