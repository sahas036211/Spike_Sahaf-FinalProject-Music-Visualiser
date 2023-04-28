function WebcamButton() {
    this.x = 400;
    this.y = 20;
    this.width = 20;
    this.height = 20;
    this.enabled = false;

    this.draw = function () {
        if (this.enabled) {
            fill(255, 0, 0); // Red color for enabled state
        } else {
            fill(255); // White color for disabled state
        }
        rect(this.x, this.y, this.width, this.height);
        // Add text to indicate it's the webcam button
        fill(255);
        textSize(20);
        text("Enable Webcam Input", this.x + this.width + 5, this.y + this.height);
    };

    this.hitCheck = function () {
        if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
            this.enabled = !this.enabled; // Toggle the state
            controls.enableWebcam(); // Enable/disable the webcam
            return true;
        }
        return false;
    };
}
