function HomeScreen() {
    this.selected = "";

    this.options = ["Rhythm Game", "Karaoke", "Visualisers"];

    this.draw = function() {
        push();
		fill("white");
		stroke("black");
		strokeWeight(2);
		textSize(34);

        // loop through all options and draw them to the screen
		for (var i = 0; i < this.options.length; i++) {
            text(i+1 + " - " + this.options[i], 100, 60 + (i * 30)); 
        }
        pop();
	};

    this.keyPressed = function(key) {
        switch (key) {
            case "1":
                this.selected = this.options[0];
                break;
            case "2":
                this.selected = this.options[1];
                break;
            case "3":
                this.selected = this.options[2];
                break;
        }
    }
}