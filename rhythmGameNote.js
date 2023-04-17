function RhythmGameNote(gs) { // gamespace to draw in
    // list of possible colours in same order as hit zone array
    this.colours = ["#ff0000","#ffff66","#0000cc","#00cc00"];

    this.fillColourIndex = Math.floor(random(4));
    this.fillColour = this.colours[this.fillColourIndex]; // random colour for now

    // property for when note is hit
    this.isHit = false;

    // CHANGE THESE VALUES LATER WHEN MAPPING NOTES, WILL NEED CONSTRUCTOR TO TAKE
    // IN MORE PROPERTY ARGUMENTS FOR VALUES LIKE LENGTH, TIME OF APPEARANCE, COLOUR, ETC.
    this.startDepth = Math.floor(random(-200)); // random start depth for now
    this._pos = createVector(-90 + this.fillColourIndex*60, -210, this.startDepth);
    this._speed = 2;
    
    this.draw = function() {
        // draw note with given colour and position
        gs.push();
        gs.fill(this.fillColour);
        gs.translate(this._pos);
        gs.box(50, 25, 25);
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

    // COLLISION DETECTION

    this.hitCheck = function(hitZone) {
        // checks distance between a note and a given hit zone
        let distance = p5.Vector.dist(this._pos, hitZone);
        console.log(distance);
        if (distance < 27) { // any distance greater than this will be a miss
            console.log(distance);
            return distance;
        }
        return false;
    }
}