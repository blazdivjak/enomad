var canvas;
var words = [];
var maxfreq = 0;
var lastWordUpdate;
var url = window.location.href.replace('#','') + 'api/v1/words/?ordering=-updated_at';
var img;
var lastPoint;
var showPoint = false;
var fullscreenOn = false; 
var canvasLoc;
var sizeCoeffX = 1;
var sizeCoeffY = 1;

// velikosti pisave
var MAX_FONT_SIZE = 32;
var MIN_FONT_SIZE = 16;

class Word {
	constructor(text, freq, point, updated, id) {
		this.text = text;
		this.freq = freq;
		this.point = point;
		this.updated = updated;
		this.x = 600;
		this.y = random(400);
		this.new = 60; // nova beseda ima dodatno animacijo
		this.speed = random(1);
		this.id = id;
	}
}

function setup() {
  if ($('#visual').length > 0) {
    canvas = createCanvas(600, 400);
    canvas.style("padding:0;margin:auto;display:block;");
    canvas.parent('visual');
    loadJSON(url, gotInitialWords);
    frameRate(30);
    smooth();
  } else {
  	noLoop();
  	return;
  }
  // povecava ob dvokliku miske
  $("#defaultCanvas0").dblclick(function() {
  	if (fullscreenOn) {
  		restoreLocation(canvasLoc);
  		resizeCanvas(600, 400);
  		// reenable scrolling
  		$('html, body').css({
		    'overflow': 'auto',
		    'height': 'auto'
		});
		sizeCoeffX = 1; // nazaj nastavimo razmerja velikosti
		sizeCoeffY = 1;
		

  	} 
  	else {
  		canvasLoc = saveLocation($("#defaultCanvas0"));
  		$("#defaultCanvas0").css({top: 0, left: 0, position:'absolute'});
  		$("#defaultCanvas0").css( "zIndex", 100);
  		var wid = document.body.parentNode.clientWidth;
  		var hei = window.innerHeight;
  		resizeCanvas(wid, hei);
  		// disable scrolling
  		$('html, body').css({
		    'overflow': 'hidden',
		    'height': '100%'
		});
		sizeCoeffX = wid/600;
		sizeCoeffY = hei/400;  		
  	}  
    fullscreenOn = !fullscreenOn;
  });
}

function draw() {
  if ($('#visual').length == 0) return;
  background(20);
  strokeWeight(0);
  textFont("Helvetica");
 
  for (var i = 0; i < words.length; i++) {
  	var word = words[i];
  	var size = map(word.freq, 1, maxfreq, MIN_FONT_SIZE, MAX_FONT_SIZE) * sizeCoeffY;
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
  	if (word.y - size < 0) {
  		word.y += size;
  	}
  	text(word.text, word.x * sizeCoeffX, word.y * sizeCoeffY);
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
	if (lastWordUpdate != null)
	if (newWord.updated.getTime() != lastWordUpdate.getTime()) {
		// prisla je nova beseda
		// prikazi informacije o novi besedi
		var urlPoint = window.location.href.replace('#','') + 'api/v1/points/' + newWord.point;
		loadJSON(urlPoint, getPointInfo);
		// ce je beseda ze noter, jo le posodobimo
		var is_already = false;
		for (var i = 0; i < words.length; i++) {
			var w = words[i];
			if (w.id === newWord.id) {
				is_already = true;
				w.freq = newWord.freq;
				w.updated = newWord.updated;
				w.x = 600;
				w.y = random(400);
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
	var currY = 400 - 300;
	fill(0);
	rect((currX-20) * sizeCoeffX, (400 - 300) * sizeCoeffY, (200+10) * sizeCoeffX, 300 * sizeCoeffY);
	textSize(16 * sizeCoeffY);
	currY += 20;
	fill(255);
	text(point.poet, currX * sizeCoeffX, currY * sizeCoeffY);
	currY += 18;
	image(img, currX * sizeCoeffX, currY * sizeCoeffY, img.width*0.75 * sizeCoeffX, img.height*0.75 * sizeCoeffY);
	currY += img.height*0.9;
	text(point.address, currX * sizeCoeffX, currY * sizeCoeffY);
	stroke(60);
	strokeWeight(1);
	line((currX-2)*sizeCoeffX, (currY + 5)*sizeCoeffY, (currX-10+200)*sizeCoeffX, (currY+2)*sizeCoeffY);
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
	    return parseFloat(b.freq) - parseFloat(a.freq);
	});
	fill(255); // pisava
	var NUMBER_OF_MAX_FREQ = 3;
	for (var i = 0; i < NUMBER_OF_MAX_FREQ; i++) {
		var size = map(pointWords[i].freq, 1, maxfreq, MIN_FONT_SIZE, MAX_FONT_SIZE) * sizeCoeffY;
		currY += size/sizeCoeffY + 2;
		textSize(size);
		text(pointWords[i].text + " x" + pointWords[i].freq, currX * sizeCoeffX, currY * sizeCoeffY);
		
	}
	// tekst za e-knjižni nomad
	push();
	textSize(18* sizeCoeffY);
	fill(color('#65D3F7'));
	translate(currX * sizeCoeffX, 400 * sizeCoeffY);
	rotate(-PI/2.0);
	text("E-knjižni nomad", 30 * sizeCoeffX, -4 * sizeCoeffY);
	stroke(60);
	strokeWeight(1);
	line(0, -2 * sizeCoeffX, 300 * sizeCoeffY, -2 * sizeCoeffX);
	pop();
}

// v fullscreen nacinu prilagodi sirino in visino ekranu
function windowResized() {
	if (fullscreenOn) {
	  var wid = document.body.parentNode.clientWidth;
	  var hei = windowHeight;
	  sizeCoeffX = wid/600;
	  sizeCoeffY = hei/400;
	  resizeCanvas(wid, hei);
	}
}


// POVECAVA OB MIROVANJU MISKE

var timeout = null;

$(document).on('mousemove', function() {
    clearTimeout(timeout);
    if (fullscreenOn) {
  		restoreLocation(canvasLoc);
  		resizeCanvas(600, 400);
  		// reenable scrolling
  		$('html, body').css({
		    'overflow': 'auto',
		    'height': 'auto'
		});
		sizeCoeffX = 1; // nazaj nastavimo razmerja velikosti
		sizeCoeffY = 1;
		fullscreenOn = !fullscreenOn;
	} 

    timeout = setTimeout(function() {
    	// povecaj + preveri, ce je slucajno ze
        
	  	if (!fullscreenOn) {
	  		canvasLoc = saveLocation($("#defaultCanvas0"));
	  		$("#defaultCanvas0").css({top: 0, left: 0, position:'absolute'});
	  		$("#defaultCanvas0").css( "zIndex", 100);
	  		var wid = document.body.parentNode.clientWidth;
	  		var hei = window.innerHeight;
	  		resizeCanvas(wid, hei);
	  		// disable scrolling
	  		$('html, body').css({
			    'overflow': 'hidden',
			    'height': '100%'
			});
			sizeCoeffX = wid/600;
			sizeCoeffY = hei/400;  
			fullscreenOn = !fullscreenOn;		
	  	}  
	    
    }, 5000);
});

function saveLocation(element) {
    var loc = {};

    var item = $(element).prev();
    loc.element = element;
    
    loc.parent = $(element).parent()[0];

    return(loc);
}
function restoreLocation(loc) {
	$("#defaultCanvas0").css({position:'relative'});
    if (loc.parent) {
        $(loc.parent).prepend(loc.element);
    } else {
        $(loc.prev).after(loc.element);
    }
}