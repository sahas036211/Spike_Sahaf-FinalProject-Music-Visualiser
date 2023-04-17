function RhythmGameNote(gs) { // gamespace to draw in
    // list of possible colours in same order as hit zone array
    this.colours = ["#ff0000","#ffff66","#0000cc","#00cc00"];

    this.fillColour = this.colours[Math.floor(random(4))]; // random colour for now
    this.fillColourIndex = this.colours.findIndex(i => i == this.fillColour)

    // CHANGE THESE VALUES LATER WHEN MAPPING NOTES, WILL NEED CONSTRUCTOR TO TAKE
    // IN MORE PROPERTY ARGUMENTS FOR VALUES LIKE LENGTH, TIME OF APPEARANCE, COLOUR, ETC.
    this.startDepth = Math.floor(random(-200)); // random start depth for now
    this._pos = createVector(-90 + this.fillColourIndex*60, -210, this.startDepth);
    this._speed = 2;
    
    this.draw = function() {
        // draw note with given colour and position
        gs.push();
        gs.fill(this.fillColour);
        // note moves forward at set distance per frame
        this._pos.add(0,0,this._speed); 
        gs.translate(this._pos);
        gs.box(50, 25, 25);
        gs.pop();
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
        // checks distance between note and hit zone and determines points
        // to be awarded
        let distance = p5.Vector.dist(this._pos, hitZone);
        console.log(distance);
        if (distance < 100) { // CHANGE THIS VALUE LATER TO MAKE GAME MORE CHALLENGING
            return true;
        }
        return false;
    }
}