function RhythmGameNote(gs, startDepth) { // gamespace to draw in
    colorMode(HSB); // set colour mode to HSB

    // list of possible colours in same order as hit zone array
    this.colours = [color(0,100,100), // red
                    color(60,60,100), // yellow
                    color(240,100,80), // blue
                    color(120,100,80)]; // green

    // random colour for every new note
    this.fillColourIndex = Math.floor(random(4));
    this.fillColour = this.colours[this.fillColourIndex]; 

    // property for when note is hit
    this.isHit = false;

    // CHANGE THESE VALUES LATER WHEN MAPPING NOTES, WILL NEED CONSTRUCTOR TO TAKE
    // IN MORE PROPERTY ARGUMENTS FOR VALUES LIKE LENGTH, TIME OF APPEARANCE, COLOUR, ETC.
    this.startDepth = startDepth;
    this._pos = createVector(-90 + this.fillColourIndex*60, -212, this.startDepth);
    this._speed = 4.5;
    
    this.draw = function() {
        // draw note with given colour and position
        gs.push();
        gs.fill(this.fillColour);
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

    this.move = function(dist=this._speed) {
        // note moves forward at set distance per frame
        this._pos.add(0,0,dist); 
    }

    // ------------ SETTER AND GETTER FUNCTIONS ------------

    // POSITION

    this.setPos = function(pos) {
        this._pos = pos;
    }

    this.getPos = function() {
        return this._pos;
    }

    // SPEED
    
    this.setSpeed = function(speed) {
        this._speed = speed;
    }

    this.getSpeed = function() {
        return this._speed;
    }
    
    // ------------ DISTANCE DETECTION ------------

    this.distCheck = function(hitZone) {
        // checks distance between a note and a given hit zone
        let distance = p5.Vector.dist(this._pos, hitZone);
        return distance;
    }
}