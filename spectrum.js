function Spectrum() {
	this.name = "SPECTRUM";

	this.draw = function() {
		push();
		var spectrum = fourier.analyze();
		noStroke();

		for (var i = 0; i< spectrum.length; i++){
			//var x = map(i, 0, spectrum.length, 0, width);
		    //var h = -height + map(spectrum[i], 0, 255, height, 0);
		    
			//rect(x, height, width / spectrum.length, h);

			var y = map(i, 0, spectrum.length, 0, height);
			var w = map(spectrum[i], 0, 255, 0, width);


			//he colour of each bar such that it gradually changes from green to red based on the amplitude value
			var r = map(spectrum[i], 0, 255, 0, 255); //map the amplitude value to a range between 0 and 255
			var g = map(spectrum[i], 0, 255, 255, 0); //map the amplitude value to a range between 255 and 0
			var b = 0;
			fill(r,g,b);
			rect(0, y, w, height/spectrum.length);

			

  		}
	
		pop();
	};
}
