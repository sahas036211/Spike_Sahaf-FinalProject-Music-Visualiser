function VisualisationScreen() {
    this.controls = new VisControls();

    this.vis = new Visualisations();
    this.vis.add(new Spectrum());
	this.vis.add(new WavePattern());
	this.vis.add(new Needles());
    
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
        text(this._convertToMins(currentSong.sound.currentTime()), 
            (width/4)-40, height-80)
        textAlign(LEFT);
        text(this._convertToMins(currentSong.sound.duration()), 
            (width*0.75)+40, height-80)
        pop();

        this.controls.draw();
    }
}