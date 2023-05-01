//store visualisations in a container
var visScreen = null;
//global for home screen
var home = null;
//global for rhythm game
var rhythm = null;
//global for karaoke game
var karaoke = null;
//variables for p5 sound objects
var bakamitai = null;
var demiurge = null;
var chestnuts = null;
var newtank = null;
var peptobismol = null;
var ballin = null;
//variables for the p5 sound objects to be analysed in rhythm game
var bakamitaiGS = null;
var demiurgeGS = null;
var chestnutsGS = null;
var newtankGS = null;
var peptobismolGS = null;
var ballinGS = null;
//variables for lyric files of songs
var bakamitaiLyrics = null;
var demiurgeLyrics = null;
var chestnutsLyrics = null;
var newtankLyrics = null;
var peptobismolLyrics = null;
var ballinLyrics = null;
//variable for array that will contain song information
var songs = [];
//variable for currently selected sound object to be played
var currentSong = null;
//variables for image overlay effects
var glitter = null;
var hearts = null;
var butterflies = null;
//variable for images for visualisation buttons
var loopButtonImg = null;
var tempoButtonImg = null;
//variable for p5 fast fourier transform
var fourier;

//karaoke variables
var fft;
var songPitchData = {};
var preloadedPitchDetectionModel;

// preload the songs and images to be used
function preload() {
	// gif overlay images
	glitter = loadImage('assets/glitter.gif');
	hearts = loadImage('assets/hearts.gif');
	butterflies = loadImage('assets/butterflies.gif');

	// visualisation button images
	loopButtonImg = loadImage('assets/loopbutton.png');
	tempoButtonImg = loadImage('assets/tempobutton.png');

	// baka mitai
	bakamitai = loadSound('assets/bakamitai.flac');
	bakamitaiGS = loadSound('assets/bakamitai.flac'); // ghost song
	bakamitaiLyrics = loadStrings('assets/bakamitailyrics.lrc'); // lyrics

	// demiurge
	demiurge = loadSound('assets/demiurge.mp3');
	demiurgeGS = loadSound('assets/demiurge.mp3'); // ghost song
	demiurgeLyrics = loadStrings('assets/demiurgelyrics.lrc'); // lyrics

	// chestnuts
	chestnuts = loadSound('assets/chestnuts.mp3');
	chestnutsGS = loadSound('assets/chestnuts.mp3'); // ghost song
	chestnutsLyrics = loadStrings('assets/chestnutslyrics.lrc'); // lyrics

	// new tank
	newtank = loadSound('assets/newtank.mp3');
	newtankGS = loadSound('assets/newtank.mp3'); // ghost song
	newtankLyrics = loadStrings('assets/newtanklyrics.lrc'); // lyrics
	
	// pepto bismol
	peptobismol = loadSound('assets/peptobismol.mp3');
	peptobismolGS = loadSound('assets/peptobismol.mp3'); // ghost song
	peptobismolLyrics = loadStrings('assets/peptobismollyrics.lrc'); // lyrics

	// ballin
	ballin = loadSound('assets/ballin.mp3');
	ballinGS = loadSound('assets/ballin.mp3'); // ghost song
	ballinLyrics = loadStrings('assets/ballinlyrics.lrc'); // lyrics

	sayitaintso = loadSound('assets/sayitaintso.mp3');
	sayitaintsoGS = loadSound('assets/sayitaintso.mp3'); // ghost song
	sayitaintsoLyrics = loadStrings('assets/sayitaintsolyrics.lrc'); // lyrics
	
}

function setup() {
	songs = [
		{
		 songName: 'BAKA MITAI', sound: bakamitai, ghostSound: bakamitaiGS,
		 freq1: 200, freq2: 4000, bpm: 74, threshold: 0.5,
		 lyrics: bakamitaiLyrics, lyricsData: []
		},
		 
		{
		 songName: 'DEMIURGE', sound: demiurge, ghostSound: demiurgeGS,
		 freq1: 20, freq2: 20000, bpm: 84, threshold: 0.1,
		 lyrics: demiurgeLyrics, lyricsData: []
		},
 
		{
		 songName: 'CHESTNUTS', sound: chestnuts, ghostSound: chestnutsGS,
		 freq1: 200, freq2: 4000, bpm: 68, threshold: 0.5,
		 lyrics: chestnutsLyrics, lyricsData: []
		},
 
		{
		 songName: 'NEW TANK', sound: newtank, ghostSound: newtankGS,
		 freq1: 20, freq2: 20000, bpm: 151, threshold: 0.1,
		 lyrics: newtankLyrics, lyricsData: []
		},
 
		{
		 songName: 'PEPTO BISMOL', sound: peptobismol, ghostSound: peptobismolGS,
		 freq1: 20, freq2: 20000, bpm: 140, threshold: 0.1,
		 lyrics: peptobismolLyrics, lyricsData: []
		}
	];
 
	for (var i = 0; i < songs.length; i++) {
		// default all songs to half volume
		songs[i].sound.setVolume(0.5);
 
		// code based on source: https://dev.to/mcanam/javascript-lyric-synchronizer-4i15
		lines = songs[i].lyrics;
		lines.forEach(line => {
			let match = line.match(/^\[(\d{2}):(\d{2})\.(\d{2})\](.*)$/);
			if (match) {
				let minutes = parseInt(match[1]);
				let seconds = parseInt(match[2]);
				let milliseconds = parseInt(match[3]);
				let text = match[4].trim();
				let time = minutes * 60 + seconds + milliseconds / 100;
				songs[i].lyricsData.push({ time, text });
			}
		})
	}
 
	// default song set to baka mitai
	currentSong = songs[0];

	createCanvas(1920, 920); // Lock canvas size
	background(0);
	frameRate(60); // Set framerate to constant 60 fps for consistency

	// Instantiate the fft object without setting any input initially
	fourier = new p5.FFT();
  
	// Instantiate home screen object
	home = new HomeScreen();

	// Instantiate settings screen object
	settings = new SettingsScreen();
  
	// Instantiate visualisations screen object
	visScreen = new VisualisationScreen();
}
  
function draw() {
	settings.volumeSlider.hide();
	if (visScreen.controls.webcam) {
        image(visScreen.controls.webcam, 0, 0, width, height);
    } else {
        background(0);
    }
	// draw depending on which screen has been selected from menu
  	if (home.selected === "") {
		// draw home screen
		home.draw();
  	} else if (home.selected === home.options[0]) {
    	// draw the rhythm game
    	rhythm.draw();
  	}  else if (home.selected === home.options[1]) {
    	//draw the karaoke game
    	karaoke.draw();
		getAudioContext().resume();
  	} else if (home.selected === home.options[2]) {
    	// draw visualisers
    	visScreen.draw();
  	} else if (home.selected === home.options[3]) {
		// draw options and settings menu
		settings.draw();
        settings.volumeSlider.show();
    }    
}

function mouseMoved() {
	if (home) { // checks home != null to prevent errors while loading setup
		if (home.selected === "") {
			home.mouseMoved();
		} else if (home.selected === home.options[3]) {
			settings.mouseMoved();
		}
	}
}

function mouseClicked() {
	if (home) { // checks home != null to prevent errors while loading setup
		if (home.selected === "") {
			home.mousePressed();
			// Check if menu item has been selected after mouse press
			if (home.selected === home.options[0]) {
				// Create new rhythm game object if rhythm game selected
				karaoke = null;
				rhythm = new RhythmGame();
			} else if (home.selected === home.options[1]) {
				// Create new karaoke game object if karaoke game selected
				rhythm = null;
				karaoke = new KaraokeGame();
				karaoke.initPitchDetection();
				karaoke.analyzeSongPitchData();
			}
		} else if (home.selected === home.options[0]) {
			rhythm.mousePressed();
		} else if (home.selected == home.options[1]) {
			karaoke.mousePressed();
		} else if (home.selected === home.options[2]) {
			visScreen.controls.mousePressed();
		} else if (home.selected === home.options[3]) {
			settings.mousePressed();
		}
	}
}

function keyPressed() {
	if (home) { // checks home != null to prevent errors while loading setup
		if (home.selected === "") {
			home.keyPressed(keyCode);
			// Check if menu item has been selected after key press
			if (home.selected === home.options[0]) {
				// Create new rhythm game object if rhythm game selected
				karaoke = null;
				rhythm = new RhythmGame();
			} else if (home.selected === home.options[1]) {
				// Create new karaoke game object if karaoke game selected
				rhythm = null;
				karaoke = new KaraokeGame();
				karaoke.initPitchDetection();
				karaoke.analyzeSongPitchData();
			}
		} else if (home.selected === home.options[0]) {
			rhythm.keyPressed(key);
		} else if (home.selected === home.options[1]) {
			karaoke.keyPressed(key);
		} else if (home.selected === home.options[2]) {
			visScreen.controls.keyPressed(keyCode);
		} else if (home.selected === home.options[3]) {
			settings.keyPressed(key);
		}
	}
}

function keyReleased() {
	if (home) { // checks home != null to prevent errors while loading setup
		if (home.selected == home.options[0]) {
			rhythm.keyReleased(key);
		}
	}
}

/**
     * Converts a given number in seconds to minute:seconds format.
     * 
     * @param {Number} time number of seconds to be converted
     * @returns {String} time converted to string in minute:seconds format
     */
function convertToMins(time) {
	// Get the seconds component of the time
	let timeSeconds = Math.floor(time) % 60;
	// Get the minutes component of the time
	let timeMinutes = Math.floor(time / 60);
	// Format the time correctly
	// Insert zero before seconds count if less than 10 for formatting
	let timeInMins = `${timeMinutes}:${timeSeconds < 10 ? '0' : ''}${timeSeconds}`;
	return timeInMins;
};
