function SpinningCube() {
    //vis name
    this.name = "SPINNING CUBE";

    this.graphic = createGraphics(width,height,WEBGL); // 3d graphics
    this.radius = 0;
    // set rotation speed of cube relative to song BPM
    this.spinSpeed = map(currentSong.bpm, 68, 151, PI, PI*2)/300;

    this.draw = function() {
        this.graphic.background(0);
        this.graphic.smooth(); // applies anti-aliasing to edges of geometry
        // rotate the cube if song is playing
        if (currentSong.sound.isPlaying()) {
            this.graphic.rotateX(this.spinSpeed);
            this.graphic.rotateY(this.spinSpeed);
        }
        // set the cube texture to the webcam video feed
        this.webcam = visScreen.controls.webcamButton.getWebcam();
        if (this.webcam) {
            this.graphic.texture(this.webcam);
        }

        // map energy of song to size of the box
        fourier.analyze();
        let energy = fourier.getEnergy(20,20000);
        this.radius = map(energy, 0, 128, 100, 400);
        this.graphic.box(this.radius);

        // display 3d graphics on the screen
        image(this.graphic, 0, 0);
    }
}