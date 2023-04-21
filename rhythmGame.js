function RhythmGame() {
    this._score = 0; // Initialise score and combo to zero
    this._combo = 0;
    this._songName = "BAKAMITAI"; // Song to be implemented
    this.songBps = 60/74; // Bakamitai has bpm of 74
    this.gs = createGraphics(700,700,WEBGL); // gs stands for "game space"
    this.notes = []; // Array that will contain all notes on the song "map"
    this.hitCount = 0; // Initialise hit and miss counts for hitrate stat
    this.noteCount = 0;
    this.playing = false; // Initialise playstate to false
    this.gameStarted = false; // Initailise gameStarted to false
    this.gameOver = false; // Initialise gameOver to false
    this.difficultyValue = 0; // Initialise difficultyValue to 0
    this.difficultyText = "?"; // Initialise difficultyText to a question mark
    this.songCurrentTime = "0:00"; // Initialise song time to 0
    this.unpauseCountdown = -1; // Initialise unpause countdown to -1

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

    this._drawGame = function() { // draw 3d graphics for game
        this.gs.background(0);
        this.gs.smooth(); // applies anti-aliasing to edges of geometry

        // set camera to look down at notes from above for more 3d appearance
        this.gs.camera(0, -400, (height/2) / tan(PI/6), 0,0,0,0,1,0);

        // convert deltaTime from ms to secs
        const dt = deltaTime * 0.001
        let ratio = dt / (1/60);
        
        for (i = 0; i < this.notes.length; i++) {
            push();
            colorMode(HSB);
            // change saturation of note colour based on distance from hit zone
            let distance = abs(640 - this.notes[i].getPos().z);
            if (distance <= 100) {
                // get new value by mapping distance to saturation
                let newSat = map(distance, 100, 0, 100, 10);
                // change saturation value of note
                this.notes[i].fillColour = color(hue(this.notes[i].fillColour),
                                                 newSat,
                                                 brightness(this.notes[i].fillColour));
            }
            this.notes[i].draw(); // draw note to screen
            pop();
            if (this.playing) {
                // notes move at constant speed regardless of time between frames
                let calibratedSpeed = this.notes[i].getSpeed() * ratio;
                this.notes[i].move(calibratedSpeed);
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
        this.gs.box(62,10,1400);
        for (i = 0; i < 3; i++) {
            this.gs.translate(62,0,0);
            this.gs.box(62,10,1400);
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
        colorMode(RGB); // set colour mode to RGB

        if (!this.gameOver) { // check that song hasn't ended before drawing
            // run beat detection every frame and spawn notes when beat is detected
            if (this.playing) {
                if (this.beatDetect.detectBeat()) {
                    this.notes.push(new RhythmGameNote(this.gs, -560, this.songBps));
                }
            }

            this._drawGame(); // draw 3d graphics

            push();
            // Draw stats and info for current song
            fill(255);
            textSize(32);
            textAlign(LEFT);
            text('SONG', 140, 148);
            text('DIFFICULTY', 50, 247)
            text('HITRATE', 100, 347);
            text('SCORE', 120, 447);

            textSize(60);
            text(this._songName, 250, 150);
            text(this.difficultyText, 250, 250);
            let accuracy;
            if (this.hitCount == 0) {
                accuracy = '0.00';
            } else {
                // display hitrate percent to 2 decimal places
                accuracy = nfc(this.hitCount/this.noteCount * 100, 2);
            }
            text(`${accuracy}%`, 250, 350);
            text(nfc(this._score), 250, 450);

            // combo counter at top of screen
            textAlign(CENTER);
            if (this._combo != 0) {
                push();
                textSize(20);
                text('COMBO', width/2, 205);
                textSize(76);
                text(this._combo, width/2, 270);
                pop();
            }

            // Draw current song time & length of song in minutes:seconds format
            if (this.playing) {
                this.songCurrentTime = this._convertToMins(sound.currentTime());
            }
            text(`${this.songCurrentTime} / ${this.songDuration}`, width-340, 275);

            textSize(48);
            // if song is playing display "pause", if paused display "play"
            if (this.playing) {
                text('PRESS P TO PAUSE', width-340, 150);
            } else {
                text('PRESS P TO PLAY', width-340, 150);
            }
            
            // control info on right of screen
            text('CONTROLS', width-340, 400);
            rectMode(CENTER);
            stroke(255);
            strokeWeight(2);
            // red control square
            fill("#ff0000");
            rect(width-430, 458, 50, 50);
            // yellow control square
            fill("#ffff66");
            rect(width-370, 458, 50, 50);
            // blue control square
            fill("#0000cc");
            rect(width-310, 458, 50, 50);
            // green control square
            fill("#00cc00");
            rect(width-250, 458, 50, 50);
            // control keys displayed inside squares
            fill(255);
            stroke(0);
            strokeWeight(3);
            text('A', width-430, 475);
            text('S', width-370, 475);
            text('K', width-310, 475);
            text('L', width-250, 475);
            pop();

            // PAUSE MENU
            if (!this.playing) {
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
                        sound.play(); // plays hearable music
                        // plays muted music used for beat detection
                        this.beatDetect.playGhostSong();
                        // sets playing condition to true
                        this.playing = true;
                        this.unpauseCountdown = -1;
                    }
                } else if (!this.gameStarted) { // check if game started
                    // show difficulty select if game hasn't started yet
                    textSize(60);
                    text('SELECT DIFFICULTY', width/2, 250);
                    // difficulty options
                    textSize(48);
                    if (mouseY > 270 && mouseY < 390) { // check mouse pos
                        textStyle(BOLD); // menu option bold when hovered over
                    }
                    text('EASY', width/2, 350);
                    textStyle(NORMAL);

                    if (mouseY > 370 && mouseY < 490) { // check mouse pos
                        textStyle(BOLD); // menu option bold when hovered over
                    }
                    text('NORMAL', width/2, 450);
                    textStyle(NORMAL);

                    if (mouseY > 470 && mouseY < 590) { // check mouse pos
                        textStyle(BOLD); // menu option bold when hovered over
                    }
                    text('HARD', width/2, 550);
                    textStyle(NORMAL);

                    if (mouseY > 570 && mouseY < 690) { // check mouse pos
                        textStyle(BOLD); // menu option bold when hovered over
                    }
                    text('INSANE', width/2, 650);
                } else { // if no countdown and game has started, show pause screen
                    textSize(48);
                    if (mouseY > 270 && mouseY < 390) { // check mouse pos
                        textStyle(BOLD); // menu option bold when hovered over
                    }
                    text('RESUME', width/2, 350);
                    textStyle(NORMAL);
                    if (mouseY > 470 && mouseY < 590) { // check mouse pos
                        textStyle(BOLD); // menu option bold when hovered over
                    }
                    text('BACK TO MENU', width/2, 550);
                }
                pop();
            }
        } else { // draw game over screen when song ends
            push();
            fill(255);
            textAlign(LEFT);
            textSize(60);
            text('RESULT', 150, 150); 
            let accuracy = this.hitCount/this.noteCount * 100;
            let rank;
            if (accuracy < 50) {
                rank = "F";
            } else if (accuracy < 60) {
                rank = "D";
            } else if (accuracy < 70) {
                rank = "C";
            } else if (accuracy < 85) {
                rank = "B";
            } else if (accuracy < 95) {
                rank = "A";
            } else if (accuracy <= 100) {
                rank = "S";
            }
            textSize(70);
            textAlign(RIGHT);
            text('RANK', (width/2)-25, 165);
            text('SCORE', (width/2)-25, 315);
            text('HITRATE', (width/2)-25, 465);
            text('DIFFICULTY', (width/2)-25, 615);
            
            // draw back button at bottom of screen
            push();
            fill(255);
            rectMode(CENTER);
            rect(width/2, 775, 700, 120);
            fill(0);
            textAlign(CENTER);
            if (mouseY > 715 && mouseY < 835 &&
                mouseX < (width/2)+350 && mouseX > (width/2)-350) { // check mouse pos
                textStyle(BOLD); // menu option bold when hovered over
            }
            text('BACK TO MENU', width/2, 800);
            pop();

            textAlign(LEFT);
            textSize(130);
            text(rank, (width/2)+25, 165);
            text(nfc(this._score), (width/2)+25, 315);
            text(`${nfc(accuracy, 2)}%`, (width/2)+25, 465);
            text(this.difficultyText, (width/2)+25, 615);
            pop();
        }
        if (this.songCurrentTime == "4:51") { // checks if song has reached end
            this.playing = false;
            this.gameOver = true; // set game over to true when song ends
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
                rhythmGhostSound.pause();
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
        let hitZoneIndex = this.hitZones.findIndex(i => i == assignedHitZone);
        for (i = 0; i < this.notes.length; i++) { // iterate through all notes
            // checks hit zone index is the same as note colour index
            if (hitZoneIndex == this.notes[i].fillColourIndex) {
                // condition for if note is hit
                // checks difference between hitzone depth and note depth
                let distance = abs(640 - this.notes[i].getPos().z);
                if (distance <= 25) {
                    // set value of note score by how close it was to hit zone
                    // note is considered a hit if less than 25 pixels away
                    let noteScore = map(distance, 25, 0, 10, 100);
                    // multiply note score by combo multiplier and add to total
                    this._score += round(noteScore * min(this._combo + 1, 16));
                    this._combo += 1; // increase combo
                    // marks the note so it can be removed from the array
                    this.notes[i].isHit = true;
                    this.hitCount++; // increment hit count for hitrate stat
                    this.noteCount++; // increment note counter for hitrate stat
                } else if (distance <= 100) {
                    this._combo = 0; // note in lane was missed, reset combo
                    this.notes[i].isHit = true;
                    this.noteCount++; // increment note counter for hitrate stat
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
            this.noteCount++; // increments note counter for hitrate stat
            this._combo = 0; // resets combo as note was missed
        }
    }

    this.mousePressed = function() {
        if (!this.playing && this.unpauseCountdown == -1) {
            if (!this.gameStarted) {
                if (mouseY > 270 && mouseY < 390) { // easy option
                    // value of 20 (higher value, lower difficulty)
                    this.difficultyValue = 20;
                } else if (mouseY > 370 && mouseY < 490) { // normal option
                    // value of 10 (higher value, lower difficulty)
                    this.difficultyValue = 10;
                } else if (mouseY > 470 && mouseY < 590) { // hard option
                    // value of 5 (higher value, lower difficulty)
                    this.difficultyValue = 5;
                } else if (mouseY > 570 && mouseY < 690) { // insane option
                    // value of 1 (higher value, lower difficulty)
                    this.difficultyValue = 1;
                }
                if (this.difficultyValue != 0) {
                    // initialise new beat detection object with difficulty
                    this.beatDetect = new BeatDetection(this.songBps, this.difficultyValue);
                    // set game state values to true
                    this.gameStarted = true;
                    this.unpauseCountdown = 180;
                    // set difficultyText based on difficultyValue
                    switch (this.difficultyValue) {
                        case 20:
                            this.difficultyText = "EASY";
                            break;
                        case 10:
                            this.difficultyText = "NORMAL";
                            break;
                        case 5:
                            this.difficultyText = "HARD";
                            break;
                        case 1:
                            this.difficultyText = "INSANE";
                    }
                }
            } else if (!this.gameOver) {
                if (mouseY > 270 && mouseY < 390) {
                    this.unpauseCountdown = 180; // set unpause countdown to 3 secs
                } else if (mouseY > 470 && mouseY < 590) {
                    home.selected = ""; // sends you back to the home screen
                }
            } else {
                if (mouseY > 715 && mouseY < 835 &&
                    mouseX < (width/2)+350 && mouseX > (width/2)-350) { // check mouse pos
                    home.selected = ""; // sends you back to the home screen
                }
            }
        }
    }
}