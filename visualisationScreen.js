function VisualisationScreen() {
    this.controls = new VisControls();

    this.vis = new Visualisations();
    this.vis.add(new Spectrum());
	this.vis.add(new WavePattern());
	this.vis.add(new Needles());

    this.draw = function() {
        this.vis.selectedVisual.draw();

        this.controls.draw();
    }
}