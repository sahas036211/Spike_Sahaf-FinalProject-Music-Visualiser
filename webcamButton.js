function WebcamButton() {
    this.x = 100;
    this.y = 20;
    this.width = 40; // Increased width
    this.height = 40; // Increased height
    this.enabled = false;

    this.draw = function () {
        // Draw the square around the bold letter W
        if (this.enabled) {
            fill(255, 0, 0); // Red color for enabled state
        } else {
            fill(255); // White color for disabled state
        }
        rect(this.x, this.y, this.width, this.height);

        // Draw the bold letter W inside the square
        textSize(38); // Increased text size
        textAlign(CENTER, CENTER);
        if (this.enabled) {
            fill(255); // White color for enabled state
        } else {
            fill(0); // Black color for disabled state
        }
        textStyle(BOLD);
        text("W", this.x + this.width / 2, this.y + this.height / 2);
    };

    this.hitCheck = function () {
        if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
            this.enabled = !this.enabled; // Toggle the state
            visScreen.controls.enableWebcam(); // Enable/disable the webcam
            return true;
        }
        return false;
    };
}
