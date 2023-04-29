function RhythmGameNote(gs, bps) {
    // takes gs (game space) and bps as parameters
    colorMode(HSB); // set colour mode to HSB

    // list of possible colours in same order as hit zone array
    this.colours = [color(0,100,100), // red
                    color(60,60,100), // yellow
                    color(240,100,80), // blue
                    color(120,100,80)]; // green

    // random colour for every new note
    this._fillColourIndex = Math.floor(random(4));
    this._fillColour = this.colours[this._fillColourIndex]; 

    // property for when note is hit
    this.isHit = false;

    // general properties
    this._startDepth = -560; // 1200 units away from centre of hit zones

    this._pos = createVector(-90 + this._fillColourIndex*60,
                             -212, 
                             this._startDepth);

    this._speed = 1200 / (60*4*bps); // speed = distance / time (in frames)
    
    this.draw = function() {
        // draw note with given colour and position
        gs.push();
        gs.fill(this._fillColour);
        gs.translate(this._pos);
        gs.beginShape();
        // FRONT FACE
        gs.vertex(-25, 13.5, 13.5);
        gs.vertex(25, 13.5, 13.5);
        gs.vertex(25, -13.5, 4.5);
        gs.vertex(-25, -13.5, 4.5);
        gs.vertex(-25, 13.5, 13.5);
        // LEFT SIDE FACE
        gs.vertex(-25, 13.5, -13.5);
        gs.vertex(-25, -13.5, -4.5);
        gs.vertex(-25, -13.5, 4.5);
        gs.vertex(-25, -13.5, -4.5);
        // BACK FACE
        gs.vertex(25, -13.5, -4.5);
        gs.vertex(25, 13.5, -13.5);
        gs.vertex(-25, 13.5, -13.5);
        gs.vertex(-25, -13.5, -4.5);
        // RIGHT SIDE FACE
        gs.vertex(25, -13.5, -4.5);
        gs.vertex(25, -13.5, 4.5);
        gs.vertex(25, 13.5, 13.5);
        gs.vertex(25, 13.5, -13.5);
        gs.vertex(25, -13.5, -4.5);
        gs.endShape();
        gs.pop();
    }

    this.move = function(speed=this._speed) {
        // note moves forward at set distance per frame
        this._pos.add(0,0,speed);
    }

    // ------------ GETTER & SETTER FUNCTIONS ------------

    // FILL COLOUR
    this.getFillColour = function() {
        return this._fillColour;
    }

    this.setFillColour = function(colour) {
        this._fillColour = colour;
    }

    // these properties are either never changed or only changed internally
    // so there is no need for setter functions.

    // FILL COLOUR INDEX
    this.getFillColourIndex = function() {
        return this._fillColourIndex;
    }

    // POSITION
    this.getPos = function() {
        return this._pos;
    }

    // SPEED
    this.getSpeed = function() {
        return this._speed; 
    }
}