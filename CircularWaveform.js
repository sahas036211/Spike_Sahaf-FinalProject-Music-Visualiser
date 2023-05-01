function CircularWaveform() {
    this.name = "CIRCULAR WAVEFORM";

    this.draw = function () {
        push();
        var waveform = fourier.waveform();
        var numPoints = waveform.length;

        var centerX = width / 2;
        var centerY = height / 2;
        var radius = min(width, height) / 3;

        noFill();
        strokeWeight(2);
        stroke(255);
        beginShape();

        for (var i = 0; i < numPoints; i++) {
            var angle = map(i, 0, numPoints, 0, TWO_PI);
            var waveValue = map(waveform[i], -1, 1, -radius, radius);
            var x = centerX + (radius + waveValue) * cos(angle);
            var y = centerY + (radius + waveValue) * sin(angle);

            vertex(x, y);
        }
        endShape(CLOSE);
        pop();
    };
}
