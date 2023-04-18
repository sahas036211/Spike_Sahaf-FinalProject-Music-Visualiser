function RhythmGameNote(gs, startDepth) { // gamespace to draw in
    // list of possible colours in same order as hit zone array
    this.colours = ["#ff0000","#ffff66","#0000cc","#00cc00"];

    this.fillColourIndex = Math.floor(random(4));
    this.fillColour = this.colours[this.fillColourIndex]; // random colour for now

    // property for when note is hit
    this.isHit = false;

    // CHANGE THESE VALUES LATER WHEN MAPPING NOTES, WILL NEED CONSTRUCTOR TO TAKE
    // IN MORE PROPERTY ARGUMENTS FOR VALUES LIKE LENGTH, TIME OF APPEARANCE, COLOUR, ETC.
    this.startDepth = startDepth;
    this._pos = createVector(-90 + this.fillColourIndex*60, -210, this.startDepth);
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

    this.move = function() {
        // note moves forward at set distance per frame
        this._pos.add(0,0,this._speed); 
    }

    // GETTERS AND SETTERS

    this.getPos = function() {
        return this._pos;
    }

    this.setPos = function(pos) {
        this._pos = pos;
    }

    // DISTANCE FROM HIT ZONE DETECTION

    this.distCheck = function(hitZone) {
        // checks distance between a note and a given hit zone
        let distance = p5.Vector.dist(this._pos, hitZone);
        return distance;
    }
}