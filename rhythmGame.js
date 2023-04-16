function RhythmGame() {
    this._score = 0;
    this._combo = 0;
    this._songName = "BAKAMITAI";
    this.gs = createGraphics(700,700,WEBGL); // gs stands for "game space"
    this.notes = []; // Array that will contain all notes on the song "map"

    this._convertToMins = function(time) {
        // Get the seconds component of the time
        let timeSeconds = Math.floor(time) % 60;
        // Get the minutes component of the time
        let timeMinutes = Math.floor(time / 60);
        // Format the time correctly
        let timeInMins = `${timeMinutes}:${timeSeconds}`;
        if (timeSeconds == 0) {
            // append extra zero to end if seconds count is 0
            timeInMins = timeInMins + "0";
        }
        return timeInMins;
    }
    
    this.draw = function() {
        push();
        // draw song info
        fill("white");
        textSize(36);
        textAlign(LEFT);
        text(`CURRENT SONG: ${this._songName}`, 80, 100);
        text(`SCORE: ${this._score}`, 80, 200);
        text(`COMBO: ${this._combo}x`, 80, 300);
        text('PRESS P TO PAUSE', width-440, 100);

        // Draw current song time & length of song in minutes and seconds
        let songCurrentTime = this._convertToMins(sound.currentTime());
        let songDuration = this._convertToMins(sound.duration());
        text(`${songCurrentTime} / ${songDuration}`, width-360, 200);
        pop();
    }

    this.drawGame = function() {
        // draw 3d graphics for game
        this.gs.background(100);

        // set camera to look down at notes from above for more 3d appearance
        this.gs.camera(0, -400, (height/2) / tan(PI/6), 0,0,0,0,1,0);
        
        // test note (remove later)
        this.gs.push();
        this.gs.translate(-90, -200, -100+frameCount);
        this.gs.fill("red");
        this.gs.box(50, 25, 25);
        this.gs.pop();
        this.gs.push();
        //

        // note hit zones
        this.gs.fill("red");
        this.gs.translate(-90,-183, 650);
        this.gs.box(50,25,25); // leftmost

        this.gs.fill("yellow");
        this.gs.translate(60,0,0);
        this.gs.box(50,25,25); // second leftmost

        this.gs.fill("blue");
        this.gs.translate(60,0,0);
        this.gs.box(50,25,25); // second rightmost

        this.gs.fill("green");
        this.gs.translate(60,0,0);
        this.gs.box(50,25,25); // rightmost

        this.gs.pop();
        image(this.gs, (width/2)-350, (height/2)-240);
    }

    this.createNote = function() {
        //TO DO: make function to create notes to push to notes array
    }

    this.drawNotes = function() {
        //TO DO: make function to draw notes in notes array at specified times during the song
    }

    //TO DO: create keypress function and logic for scoring system based on how well positioned note is over hit zone when key is pressed
}