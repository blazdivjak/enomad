var canvas;
var words = [];
var maxfreq = 0;
var lastWordUpdate;
var url = 'http://127.0.0.1:8000/api/v1/words/?ordering=-updated_at';
var img;
var lastPoint;
var showPoint = false;

// velikosti pisave
var MAX_FONT_SIZE = 32;
var MIN_FONT_SIZE = 16;

class Word {
	constructor(text, freq, point, updated, id) {
		this.text = text;
		this.freq = freq;
		this.point = point;
		this.updated = updated;
		this.x = width;
		this.y = random(height);
		this.new = 60; // nova beseda ima dodatno animacijo
		this.speed = random(1);
		this.id = id;
	}
}

function setup() {
  canvas = createCanvas(600, 400);
  canvas.style("padding:0;margin:auto;display:block");
  loadJSON(url, gotInitialWords);
  frameRate(30);
  smooth();

}

function draw() {
  background(20);
  strokeWeight(0);
  textFont("Helvetica");
 
  for (var i = 0; i < words.length; i++) {
  	var word = words[i];
  	var size = map(word.freq, 1, maxfreq, MIN_FONT_SIZE, MAX_FONT_SIZE);
  	var alpha = map(word.freq, 1, maxfreq, 100, 255);
  	textSize(size);
  	var fillC = 255;
  	if (word.new > 0) {
  		// TODO: dodatna animacija
  		word.new--;
  		if ((word.new % 30) == 0) {
  			fillC = (fillC + 20) % 256;
  		}
  		
  	} else {
  		fillC = 255;
  	}
  	fill(fillC, alpha);
  	text(word.text, word.x, word.y);
  	word.x -= word.speed;
  	// TODO: kaj narediti, ko pridejo besede izven ekrana

  }

  // preveri za novo besedo
  loadJSON(url, checkForNewWords);
  if (showPoint) {
  	showPointInfo(lastPoint);
  }
}

function gotInitialWords(wordsJSON) {
  // shrani besede v tabelo
  for (var i = 0; i < wordsJSON.length; i++) {
  	var w = wordsJSON[i];
  	var word = new Word(w.word, Number(w.frequency), Number(w.point), new Date(w.updated_at), Number(w.id));
  	words.push(word);
  }

  for (var i = 0; i < words.length; i++) {
  	if (words[i].freq > maxfreq) {
  		maxfreq = words[i].freq;
  	}
  }
  lastWordUpdate = words[0].updated;

}

function checkForNewWords(wordsJSON) {
	//print(wordsJSON);
	var nw = wordsJSON[0];
	var newWord = new Word(nw.word, Number(nw.frequency), Number(nw.point), new Date(nw.updated_at), Number(nw.id));
	if (newWord.updated.getTime() != lastWordUpdate.getTime()) {
		// prisla je nova beseda
		// prikazi informacije o novi besedi
		var urlPoint = 'http://127.0.0.1:8000/api/v1/points/' + newWord.point;
		loadJSON(urlPoint, getPointInfo);
		// ce je beseda ze noter, jo le posodobimo
		var is_already = false;
		for (var i = 0; i < words.length; i++) {
			var w = words[i];
			if (w.id === newWord.id) {
				is_already = true;
				w.freq = newWord.freq;
				w.updated = newWord.updated;
				w.x = width;
				w.y = random(height);
				w.new = true; // nova beseda ima dodatno animacijo
				w.speed = random(1);
				break;
			}
		}
		if (newWord.freq > maxfreq) maxfreq = newWord.freq;
		if (!is_already) words.push(newWord);
		lastWordUpdate = newWord.updated;	
	}

}

function getPointInfo(point) {
	showPoint = true;
	lastPoint = point;
	var im = point.image;
  	img = loadImage(im);
	
}

function showPointInfo(point) {
	var currX = 40;
	var currY = height - 300;
	fill(0);
	rect(currX-20, height - 300, 200+10, 300);
	textSize(16);
	currY += 20;
	fill(255);
	text(point.poet, currX, currY);
	currY += 18;
	image(img, currX, currY, img.width*0.75, img.height*0.75);
	currY += img.height*0.9;
	text(point.address, currX, currY);
	stroke(60);
	strokeWeight(1);
	line(currX-10, currY + 5, currX-20+200, currY+2);
	currY += 5;
	// izpis 3 najpogostejsih besed
	var pointWords = [];
	for (var i = 0; i < words.length; i++) {
		if (words[i].point == point.id) {
			pointWords.push(words[i]);
		}
	}
	// sortiraj po pogostosti od manj do najvec
	pointWords.sort(function(a, b) {
	    return parseFloat(a.freq) - parseFloat(b.freq);
	});
	fill(255); // pisava
	for (var i = 0; i < pointWords.length; i++) {
		var size = map(pointWords[i].freq, 1, maxfreq, MIN_FONT_SIZE, MAX_FONT_SIZE);
		currY += size + 2;
		textSize(size);
		text(pointWords[i].text + " x" + pointWords[i].freq, currX, currY);
		
	}
	// tekst za e-knjižni nomad
	push();
	textSize(18);
	fill(color('#65D3F7'));
	translate(currX, height);
	rotate(-PI/2.0);
	text("E-knjižni nomad", 30, -4);
	stroke(60);
	strokeWeight(1);
	line(0, -2, 300, -2);
	pop();
}