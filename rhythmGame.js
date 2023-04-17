function RhythmGame() {
    this._score = 0; // Initialise score and combo to zero
    this._combo = 0;
    this._songName = "BAKAMITAI"; // Song to be implemented
    this.gs = createGraphics(700,700,WEBGL); // gs stands for "game space"
    this.notes = []; // Array that will contain all notes on the song "map"
    this.playing = false; // Initialise playstate to false
    this.songCurrentTime = "0:00"; // Initialise song time to 0

    // 3d object vectors
    this.redHitZone = createVector(-90,-195,645);
    this.yellowHitZone = createVector(-30,-195,645);
    this.blueHitZone = createVector(30,-195,645);
    this.greenHitZone = createVector(90,-195,645);
    this.highway = createVector(-93, -190, 650);
    // array containing all 4 hit zones
    this.hitZones = [this.redHitZone, this.yellowHitZone,
                     this.blueHitZone, this.greenHitZone]

    // key press checks
    this._redPressed = false;
    this._yellowPressed = false;
    this._bluePressed = false;
    this._greenPressed = false;

    // push new notes to notes array
    for (i = 0; i < 4; i++) {
        this.notes.push(new RhythmGameNote(this.gs));
    }

    /**
     * Converts a given number in seconds to minute:seconds format
     * 
     * @param {Float} time // time to be converted
     * @returns {String} // time converted to string in minute:seconds format
     */
    this._convertToMins = function(time) {
        // Get the seconds component of the time
        let timeSeconds = Math.floor(time) % 60;
        // Get the minutes component of the time
        let timeMinutes = Math.floor(time / 60);
        // Format the time correctly
        let timeInMins = `${timeMinutes}:${timeSeconds}`;
        if (timeSeconds == 0) {
            // append extra zero to end if seconds count is 0 for formatting
            timeInMins = timeInMins + "0";
        } else if (timeSeconds < 10) {
            // insert zero before seconds count if below 10 for formatting
            timeInMins = `${timeMinutes}:0${timeSeconds}`;
        }
        return timeInMins;
    }

    // get song duration in minutes:seconds format
    this.songDuration = this._convertToMins(sound.duration());
    
    this.draw = function() {
        push();
        // Draw stats and info for current song
        fill("white");
        textSize(36);
        textAlign(LEFT);
        text(`CURRENT SONG: ${this._songName}`, 80, 100);
        text(`SCORE: ${this._score}`, 80, 200);
        text(`COMBO: ${this._combo}x`, 80, 300);

        // if song is playing display "pause", if paused display "play"
        if (this.playing) {
            text('PRESS P TO PAUSE', width-440, 100);
        } else {
            text('PRESS P TO PLAY', width-440, 100);
        }
        
        // Draw current song time & length of song in minutes:seconds format
        if (this.playing) {
            this.songCurrentTime = this._convertToMins(sound.currentTime());
        }
        text(`${this.songCurrentTime} / ${this.songDuration}`, width-360, 200);
        pop();
    }

    this.drawGame = function() {
        // draw 3d graphics for game
        this.gs.background(0);
        this.gs.smooth(); // applies anti-aliasing to edges of geometry

        // set camera to look down at notes from above for more 3d appearance
        this.gs.camera(0, -400, (height/2) / tan(PI/6), 0,0,0,0,1,0);
        
        for (i = 0; i < this.notes.length; i++) {
            this.notes[i].draw();
        }

        // messing around with pan of song (remove later)
        // let panValue;
        // let count = frameCount % 600;
        // if (count <= 300) {
        //     panValue = 1;
        // } else {
        //     panValue = -1;
        // }
        // sound.pan(panValue);

        // note highway
        this.gs.push();
        this.gs.fill(100);
        this.gs.translate(this.highway);
        this.gs.box(62,10,2000);
        for (i = 0; i < 3; i++) {
            this.gs.translate(62,0,0);
            this.gs.box(62,10,2000);
        }
        this.gs.pop();

        // note hit zones
        this.gs.push(); // draw red hit zone
        if (this._redPressed) {
            this.gs.fill("#800000"); // darker colour when pressed
            this.gs.translate(this.redHitZone);
        } else {
            this.gs.fill("#ff0000"); // lighter colour when released
            // button moves up when released
            this.gs.translate(this.redHitZone.x, this.redHitZone.y-1, this.redHitZone.z);
        }
        this.gs.box(50,1,25);
        this.gs.pop();

        this.gs.push(); // draw yellow hit zone
        if (this._yellowPressed) {
            this.gs.fill("#b3b300"); // darker colour when pressed
            this.gs.translate(this.yellowHitZone);
        } else {
            this.gs.fill("#ffff66"); // lighter colour when released
            // button moves up when released
            this.gs.translate(this.yellowHitZone.x, this.yellowHitZone.y-1, this.yellowHitZone.z);
        }
        this.gs.box(50,1,25);
        this.gs.pop();

        this.gs.push(); // draw blue hit zone
        if (this._bluePressed) { 
            this.gs.fill("#000066"); // darker colour when pressed
            this.gs.translate(this.blueHitZone);
        } else {
            this.gs.fill("#0000cc"); // lighter colour when released
            // button moves up when released
            this.gs.translate(this.blueHitZone.x, this.blueHitZone.y-1, this.blueHitZone.z);
        }
        this.gs.box(50,1,25);
        this.gs.pop();

        this.gs.push(); // draw green hit zone
        if (this._greenPressed) {
            this.gs.fill("#006600"); // darker colour when pressed
            this.gs.translate(this.greenHitZone);
        } else {
            this.gs.fill("#00cc00"); // lighter colour when released
            // button moves up when released
            this.gs.translate(this.greenHitZone.x, this.greenHitZone.y-1, this.greenHitZone.z);
        }
        this.gs.box(50,1,25);
        this.gs.pop();
        // display 3d graphics rendered off-screen as an image in the centre
        image(this.gs, (width/2)-350, (height/2)-240);
    }

    this.keyPressed = function(key) {
        if (key == "A" || key == "a") {
            // sets red hitzone to pressed and checks for note collision
            this._redPressed = true;
            this.noteHitCheck(this.hitZones[0]);
        } else if (key == "S" || key == "s") {
            // sets yellow hitzone to pressed and checks for note collision
            this._yellowPressed = true;
            this.noteHitCheck(this.hitZones[1]);
        } else if (key == "K" || key == "k") {
            // sets blue hitzone to pressed and checks for note collision
            this._bluePressed = true;
            this.noteHitCheck(this.hitZones[2]);
        } else if (key == "L" || key == "l") {
            // sets green hitzone to pressed and checks for note collision
            this._greenPressed = true;
            this.noteHitCheck(this.hitZones[3]);
        } else if (key == "P" || key == "p") {
            // pauses music
            if (sound.isPlaying()) {
                // saves time of the song when paused as time to be displayed
                this.songCurrentTime = this._convertToMins(sound.currentTime());
    			sound.pause();
  			} else {
            // plays music from where it was paused
    			sound.loop();
  			}
            // switches playstate from true to false and vice versa
            this.playing = !this.playing
        }
    }

    this.keyReleased = function(key) {
        if (key == "A" || key == "a") {
            // sets red hitzone to pressed
            this._redPressed = false;
        } else if (key == "S" || key == "s") {
            // sets yellow hitzone to pressed
            this._yellowPressed = false;
        } else if (key == "K" || key == "k") {
            // sets blue hitzone to pressed
            this._bluePressed = false;
        } else if (key == "L" || key == "l") {
            // sets green hitzone to pressed
            this._greenPressed = false;
        } 
    }

    // TO DO: CHANGE THIS SO THAT ONCE NOTE HAS BEEN HIT IT IS REMOVED FROM ARRAY
    // AND ADJUST SCORE SO CLOSER NOTE IS TO HIT ZONE THE HIGHER IT IS, PLUS
    // IMPLEMENT COMBO MULTIPLIER MECHANIC
    this.noteHitCheck = function(assignedHitZone) {
        // get index of hit zone to be checked
        hitZoneIndex = this.hitZones.findIndex(i => i == assignedHitZone);
        for (i = 0; i < this.notes.length; i++) { // iterate through all notes
            // checks hit zone index is the same as note colour index
            if (hitZoneIndex == this.notes[i].fillColourIndex) {
                // check collision between note and hitzone
                if (this.notes[i].hitCheck(assignedHitZone)) {
                    this._score += 100; // add score when note is hit
                }
            }
        } 
    }

    //TO DO: MAKE PAUSE BUTTON FUNCTIONAL, BEGIN MAPPING NOTES
    // CURRENTLY, NOTES CONTINUE TO MOVE REGARDLESS OF "PAUSE STATE"
}