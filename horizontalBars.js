function HorizontalBars() {
    this.name = "HORIZONTAL BARS";

    this.draw = function () {
        push();
        var frequencyData = fourier.analyze();
        noStroke();

        var numBars = frequencyData.length / 8;
        var barWidth = (width / numBars) * 0.8; // Used to control the bar width
        var barSpacing = (width / numBars) * 0.2; // Used to control the spacing between each bar

        for (var i = 0; i < numBars; i++) {
            var x = i * (barWidth + barSpacing); // Adjust the x position of each bar considering the spacing
            var index = Math.floor(i * 8);
            var h = map(frequencyData[index], 0, 255, 0, height);

            var r = map(frequencyData[index], 0, 255, 0, 127);
            var g = 0;
            var b = map(frequencyData[index], 0, 255, 255, 127);
            fill(r, g, b);
            rect(x, height - h, barWidth, h);
        }

        pop();
    };
}
