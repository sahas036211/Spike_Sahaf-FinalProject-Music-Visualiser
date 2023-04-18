function RhythmGame() {
    this._score = 0; // Initialise score and combo to zero
    this._combo = 0;
    this._songName = "BAKAMITAI"; // Song to be implemented
    this.gs = createGraphics(700,700,WEBGL); // gs stands for "game space"
    this.notes = []; // Array that will contain all notes on the song "map"
    this.playing = false; // Initialise playstate to false
    this.songCurrentTime = "0:00"; // Initialise song time to 0
    this.unpauseCountdown = -1; // Initialise unpause countdown to -1
    this.gameFrameCount = 0;

    // 3d object vectors
    this.redHitZone = createVector(-90,-195,640);
    this.yellowHitZone = createVector(-30,-195,640);
    this.blueHitZone = createVector(30,-195,640);
    this.greenHitZone = createVector(90,-195,640);
    this.highway = createVector(-93, -190, 0);
    // array containing all 4 hit zones
    this.hitZones = [this.redHitZone, this.yellowHitZone,
                     this.blueHitZone, this.greenHitZone]

    // key press checks
    this._redPressed = false;
    this._yellowPressed = false;
    this._bluePressed = false;
    this._greenPressed = false;
    console.log(sound.duration());

    // push new notes to notes array

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
        let timeInMins = `${timeMinutes}:${timeSeconds}`;
        if (timeSeconds < 10) {
            // insert zero before seconds count if below 10 for formatting
            timeInMins = `${timeMinutes}:0${timeSeconds}`;
        }
        return timeInMins;
    }

    // get song duration in minutes:seconds format
    this.songDuration = this._convertToMins(sound.duration());

    this._drawGame = function() {
        // draw 3d graphics for game
        this.gs.background(0);
        this.gs.smooth(); // applies anti-aliasing to edges of geometry

        // set camera to look down at notes from above for more 3d appearance
        this.gs.camera(0, -400, (height/2) / tan(PI/6), 0,0,0,0,1,0);

        // convert deltaTime ms to secs
        const dt = deltaTime * 0.001
        let ratio = dt / (1/60);
        
        for (i = 0; i < this.notes.length; i++) {
            // draw notes to screen
            this.notes[i].draw();
            if (this.playing) {
                // notes move at constant speed regardless of time between frames
                let adjustedSpeed = this.notes[i].getSpeed() * ratio;
                this.notes[i].move(adjustedSpeed);
            }
            // checks if note is offscreen, changes isHit property to true
            this.noteOffScreenCheck(this.notes[i]);
        }
        // removes any note that has gone off screen
        this.notes = this.notes.filter(n => !n.isHit);

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

    this.draw = function() {
        // TO DO: improve this so note spawn timing is time-based not frame-based
        let bps = 60/74;
        let beat = sound.currentTime() % (60/74);
        if ((beat < bps*0.006 || beat > bps*0.994) && this.playing) {
            this.notes.push(new RhythmGameNote(this.gs, -400));
        } 
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

        this._drawGame(); // draw 3d graphics

        // PAUSE MENU
        if (!this.playing) {
            push();
            fill(0,0,0,128);
            rect(0,0,width,height);
            textAlign(CENTER);
            fill("white");
            stroke(0);
            strokeWeight(4);
            textSize(100);
            // checks if there is an unpause countdown currently in effect
            if (this.unpauseCountdown != -1) {
                if (this.unpauseCountdown != 0) {
                    // show countdown in centre of screen
                    let countdownDisplay = Math.ceil(this.unpauseCountdown / 60);
                    text(countdownDisplay, width/2, height/2);
                    this.unpauseCountdown -= 1;
                } else { // when unpause countdown hits 0, unpause the game
                    sound.loop(); // plays music from where it was paused
                    this.playing = true;
                    this.unpauseCountdown = -1;
                }
            } else { // if there is no countdown, display pause menu
                textSize(48);
                if (mouseY > 270 && mouseY < 390) { // check mouse pos
                    textStyle(BOLD); // menu option bold when hovered over
                }
                text("RESUME", width/2, 350);
                textStyle(NORMAL);
                if (mouseY > 470 && mouseY < 590) { // check mouse pos
                    textStyle(BOLD); // menu option bold when hovered over
                }
                text("BACK TO MENU", width/2, 550);
            }
            pop();
        }
        if (this.playing) {
            this.gameFrameCount++;
        }
    }

    this.keyPressed = function(key) {
        if (this.playing) {
            if (key == "A" || key == "a") {
                // sets red hitzone to pressed
                this._redPressed = true;
                // perform note hit logic and remove any hit notes in this lane
                this.notes = this.noteHitCheck(this.hitZones[0]);
            } else if (key == "S" || key == "s") {
                // sets yellow hitzone to pressed
                this._yellowPressed = true;
                // perform note hit logic and remove any hit notes in this lane
                this.notes = this.noteHitCheck(this.hitZones[1]);
            } else if (key == "K" || key == "k") {
                // sets blue hitzone to pressed
                this._bluePressed = true;
                // perform note hit logic and remove any hit notes in this lane
                this.notes = this.noteHitCheck(this.hitZones[2]);
            } else if (key == "L" || key == "l") {
                // sets green hitzone to pressed
                this._greenPressed = true;
                // perform note hit logic and remove any hit notes in this lane
                this.notes = this.noteHitCheck(this.hitZones[3]);
            } else if (key == "P" || key == "p") {
                // pauses music
                // saves time of the song when paused as time to be displayed
                this.songCurrentTime = this._convertToMins(sound.currentTime());
    			sound.pause();
                this.playing = false; // sets playstate to false
            }
        } else {
            if ((key == "P" || key == "p") && this.unpauseCountdown == -1) {
                this.unpauseCountdown = 180; // set unpause countdown to 3 secs
            }
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

    this.noteHitCheck = function(assignedHitZone) {
        // get index of hit zone to be checked
        hitZoneIndex = this.hitZones.findIndex(i => i == assignedHitZone);
        for (i = 0; i < this.notes.length; i++) { // iterate through all notes
            // checks hit zone index is the same as note colour index
            if (hitZoneIndex == this.notes[i].fillColourIndex) {
                // condition for if note is hit
                let distance = this.notes[i].distCheck(assignedHitZone);
                if (distance <= 27) {
                    // set value of note score by how close it was to hit zone
                    // note is considered a hit if between 27 and 15 distance
                    let noteScore = map(distance, 27, 15, 10, 100);
                    // multiply note score by combo multiplier and add to total
                    this._score += round(noteScore * min(this._combo + 1, 16));
                    this._combo += 1; // increase combo
                    // marks the note so it can be removed from the array
                    this.notes[i].isHit = true;
                } else if (distance < 54) {
                    this._combo = 0; // note in lane was missed, reset combo
                    this.notes[i].isHit = true;
                }
                break; // only one note can be hit per key press
            }
        } 
        // removes any note that has been hit
        return this.notes.filter(n => !n.isHit);
    }

    this.noteOffScreenCheck = function(note) {
        if (note.getPos().z > 700) { // checks if note depth pos is off screen
            note.isHit = true; // sets note to "hit" to remove it from array
            this._combo = 0; // resets combo as note was missed
        }
    }

    this.mousePressed = function() {
        if (!this.playing && this.unpauseCountdown == -1) {
            if (mouseY > 270 && mouseY < 390) {
                this.unpauseCountdown = 180; // set unpause countdown to 3 secs
            } else if (mouseY > 470 && mouseY < 590) {
                home.selected = ""; // sends you back to the home screen
            }
        }
    }

    //TO DO: BEGIN MAPPING NOTES
}