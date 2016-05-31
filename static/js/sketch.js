var canvas;
var words = [];
var previousWords = [];
var allWords = [];
var hiddenWords = [];
var maxfreq = 0;
var lastWordUpdate;
var url = window.location.href.replace('#','') + 'api/v1/words/?ordering=-updated_at';
var img;
var lastPoint;
var showPoint = false;
var showPointCount = 30 * 10; //10s
var fullscreenOn = false; 
var canvasLoc;
var sizeCoeffX = 1;
var sizeCoeffY = 1;
var toDelete;
var toSpawn;
var boxAlpha = 0;

var mode = "normal";
var fadeInNewWord = false;
var fadeOutInfo = false;

// velikosti pisave
var MAX_FONT_SIZE = 32;
var MIN_FONT_SIZE = 16;

// maksimalno število besed na ekranu naenkrat
var MAX_WORDS = 5;

// koliko sekund je odprto okno z opisom tocke
var SECONDS_POINT_OPEN = 10;


Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

class Word {
	constructor(text, freq, point, updated, id) {
		this.text = text;
		this.freq = freq;
		this.point = point;
		this.updated = updated;
		this.x = 600;
		this.y = random(400);
		this.alpha = 255; // nova beseda ima dodatno animacijo
		this.speed = random(1) + 0.01;
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
  if (showPointCount <= 0) showPoint = false;
  if ($('#visual').length == 0) return;
  background(20);
  strokeWeight(0);
  textFont("Helvetica");

  if (mode === "normal") {
      var wordOut = -1;
	  for (var i = 0; i < words.length; i++) {
	  	// ce imamo prikazane informacije o tocki, ustrezno filtriraj besede
	  	var word = words[i];
	  	var size = map(word.freq, 1, maxfreq, MIN_FONT_SIZE, MAX_FONT_SIZE) * sizeCoeffY;
	  	var fillC = map(word.freq, 1, maxfreq, 150, 255);
	  	textSize(size);
	  	fill(fillC, 255);
	  	if (word.y - size < 0) {
	  		word.y += (size - word.y) + 1;
	  	}
	  	text(word.text, word.x * sizeCoeffX, word.y * sizeCoeffY);
	  	word.x -= word.speed;
	  	// ko gre ena beseda izven ekrana, spawnamo naključno drugo iz seznama, ki je ni na ekranu ter preklopimo na fadein nanjo
	  	if ((word.x + textWidth(word.text)) < 0) {
	  		wordOut = i;
	  	}

	  }
	  if (wordOut >= 0) {
	  	hiddenWords = allWords.diff(words);
	  	if (hiddenWords.length == 0) hiddenWords.push(words[wordOut]);
	    words.splice(wordOut, 1);
        toSpawn = hiddenWords[Math.floor(Math.random() * hiddenWords.length)];
		toSpawn.x = 600 - 15;
		toSpawn.y = random(400);
		toSpawn.alpha = 0; // nova beseda ima dodatno animacijo
        toSpawn.speed = random(1) + 0.01;
        words.unshift(toSpawn);
        fadeInNewWord = false;
        mode = "fadeIn";
	  }
	  else {
		  // preveri za novo besedo
		  loadJSON(url, checkForNewWords);
	  }
	  if (showPoint && (showPointCount > 0)) {
	  	showPointInfo(lastPoint);
	  }
   }
   else if (mode === "fadeOut") {
   	var deleteWord = false;
   	var deleteIndex = -1;
   	for (var i = 0; i < words.length; i++) {
   		// ce imamo prikazane informacije o tocki, ustrezno filtriraj besede
   		if (words[i].id == toSpawn.id) continue;
	  	var word = words[i];
	  	var size = map(word.freq, 1, maxfreq, MIN_FONT_SIZE, MAX_FONT_SIZE) * sizeCoeffY;
	  	var fillC = map(word.freq, 1, maxfreq, 150, 255);
	  	textSize(size);
	  	fill(fillC, 255);
	  	if (word.y - size < 0) {
	  		word.y += (size - word.y) + 1;
	  	}
	  	if (toDelete.id == words[i].id) {
	  		words[i].alpha -= 5;
	  		if (words[i].alpha <= 0) {
	  			deleteWord = true;
	  			deleteIndex = i;
	  			fill(0);
	  		} else {
	  			fill(fillC, words[i].alpha);
	  		}
	  	}
	  	text(word.text, word.x * sizeCoeffX, word.y * sizeCoeffY);
	  	word.x -= word.speed;
	}
	if (deleteWord) {
		words.splice(deleteIndex, 1); //odstrani besedo iz trenutnega seznama
		mode = "fadeIn";
		fadeInNewWord = true;
	}
	if (showPoint && (showPointCount > 0)) {
	  	showPointInfo(lastPoint);
	}
   }
   else if (mode === "fadeIn") {
   	 // nova beseda -> fadeIn-aj še prikaz
   	 // stara beseda, ki se na novo prikaze zato, ker je ena pobegnila iz ekrana -> brez fadeInanja prikaza
   	  var finished = false;
   	  for (var i = 0; i < words.length; i++) {
   	  	// ce imamo prikazane informacije o tocki, ustrezno filtriraj besede
	  	var word = words[i];
	  	var size = map(word.freq, 1, maxfreq, MIN_FONT_SIZE, MAX_FONT_SIZE) * sizeCoeffY;
	  	var fillC = map(word.freq, 1, maxfreq, 150, 255);
	  	textSize(size);
	  	
	  	if (word.y - size < 0) {
	  		word.y += (size - word.y) + 1;
	  	}
	  	if (toSpawn.id == words[i].id) {
	  		words[i].alpha += 5;
	  		if (words[i].alpha >= 255) {
	  			words[i].alpha = 255;
	  			finished = true;
	  		}
	  		fill(fillC, words[i].alpha);
	  	}
	  	else {
	  		fill(fillC, 255);
	  	}
	  	text(word.text, word.x * sizeCoeffX, word.y * sizeCoeffY);
	  	word.x -= word.speed;  	
	  }
	  if (showPoint && (showPointCount > 0)) {
	  	showPointInfo(lastPoint);
	  }
	  if(finished) mode = "normal";
   }
}   

function gotInitialWords(wordsJSON) {
  // shrani besede v tabelo
  for (var i = 0; i < wordsJSON.length; i++) {
  	var w = wordsJSON[i];
  	var word = new Word(w.word, Number(w.frequency), Number(w.point), new Date(w.updated_at), Number(w.id));
  	// TODO: check for y prekrivanje in ustrezno popravi stvari
  	words.push(word);
  	allWords.push(word);
  }

  for (var i = 0; i < words.length; i++) {
  	if (words[i].freq > maxfreq) {
  		maxfreq = words[i].freq;
  	}
  }
  lastWordUpdate = words[0].updated;

  // preverimo, ali je besed prevec za istocasni prikaz in jih v tem primeru nakljucno pomecemo ven
  while (words.length > MAX_WORDS) {
  	var toRemove = Math.floor(Math.random() * words.length);
  	if (toRemove == 0) continue;
  	words.splice(toRemove, 1);
  }

}

function checkForNewWords(wordsJSON) {
	var nw = wordsJSON[0];
	var newWord = new Word(nw.word, Number(nw.frequency), Number(nw.point), new Date(nw.updated_at), Number(nw.id));
	newWord.alpha = 0;
	if (lastWordUpdate != null)
	if (newWord.updated.getTime() != lastWordUpdate.getTime()) {
		// prisla je nova beseda

		//posodobi najprej seznam vseh besed
		allWords = [];
		for (var i = 0; i < wordsJSON.length; i++) {
		  	var w = wordsJSON[i];
		  	var word = new Word(w.word, Number(w.frequency), Number(w.point), new Date(w.updated_at), Number(w.id));
		  	allWords.push(word);
		}

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
				w.x = 600 - 15;
				w.y = random(400);
				w.alpha = 0; // nova beseda ima dodatno animacijo
				w.speed = random(1) + 0.01;
				toSpawn = newWord;
				mode = "fadeIn"
				break;
			}
		}
		if (newWord.freq > maxfreq) maxfreq = newWord.freq;
		if (!is_already) {
			words.unshift(newWord);
			toSpawn = newWord;
			//TODO: tu odstrani obstoječo, če je dosežena omejitev prikazanih in dodaj eno izmed tistih, ki niso (izračunaj razliko množic)
			if (words.length > MAX_WORDS) {
				toDelete = words[words.length - 1]; //odstrani najstarejso
				fadeInNewWord = true;
				mode = "fadeOut";
			} else {
				mode = "fadeIn"
				fadeInNewWord = true;
			}
		}
		lastWordUpdate = newWord.updated;	
	}

}

function getPointInfo(point) {
	// shrani prejsnje besede v seznam
/*	previousWords = [];
	for (var i = 0; i < words.length; i++) {
		previousWords.push(words[i]);
	}
	// dodaj sedaj v seznam le tiste, ki spadajo pod tega pesnika
	words = [];
	for (var i = 0; i < allWords.length; i++) {

		words.push(allWords[i]);
	} */
	showPoint = true;
	boxAlpha = 0;
	showPointCount = 30 * SECONDS_POINT_OPEN;
	lastPoint = point;
	var im = point.image;
  	img = loadImage(im);
	
}

function showPointInfo(point) {
	if (showPoint && fadeInNewWord) {
		boxAlpha +=5;
		if (boxAlpha >= 255) boxAlpha = 255;
	} else {
		boxAlpha = 255;
	}
	// pridobi 3 najpogostejse besede
	var pointWords = [];
	for (var i = 0; i < allWords.length; i++) {
		if (allWords[i].point == point.id) {
			pointWords.push(allWords[i]);
		}
	}
	// sortiraj po pogostosti od manj do najvec
	pointWords.sort(function(a, b) {
	    return parseFloat(b.freq) - parseFloat(a.freq);
	});

	var currX = 40;
	var currY = 400 - 260;
	fill(0, boxAlpha);
	rect((currX-20) * sizeCoeffX, (400 - 260) * sizeCoeffY, (200+10) * sizeCoeffX, 300 * sizeCoeffY);
	var box_ending = (currX-20) * sizeCoeffX + (200+10) * sizeCoeffX;
	textSize(16 * sizeCoeffY);
	currY += 20;
	fill(255, boxAlpha);
	text(point.poet, currX * sizeCoeffX, currY * sizeCoeffY);
	currY += 18;
	image(img, currX * sizeCoeffX, currY * sizeCoeffY, img.width*0.75 * sizeCoeffX, img.height*0.75 * sizeCoeffY);
	currY += img.height*0.9;
	text(point.address, currX * sizeCoeffX, currY * sizeCoeffY);
	stroke(60);
	strokeWeight(1);
	var lineY = (currY + 5)*sizeCoeffY;
	line((currX-2)*sizeCoeffX, (currY + 5)*sizeCoeffY, (currX-10+200)*sizeCoeffX, (currY+5)*sizeCoeffY);
	currY += 5;
	
	fill(255, boxAlpha); // pisava
	var NUMBER_OF_MAX_FREQ = 3;
	if (pointWords.length < 3) NUMBER_OF_MAX_FREQ = pointWords.length; 
	for (var i = 0; i < NUMBER_OF_MAX_FREQ; i++) {
		var size = (32 - (i * 8)) * sizeCoeffY;
		currY += size/sizeCoeffY + 2 * sizeCoeffY;
		textSize(size);
		// preveri za overflow cez kvadrat, ce je, podaljsamo kvadrat
		if (currX * sizeCoeffX + textWidth(pointWords[i].text + " x" + pointWords[i].freq) > box_ending) {
			fill(0, boxAlpha);
			var word_ending = currX * sizeCoeffX + textWidth(pointWords[i].text + " x" + pointWords[i].freq);
			var difference = word_ending - box_ending;
			stroke(0);
			strokeWeight(0);
			rect(box_ending, (400 - 260) * sizeCoeffY, difference, 300 * sizeCoeffY);
			stroke(60);
			strokeWeight(1);
			line(box_ending, lineY, word_ending, lineY);
			box_ending += difference;
			fill(255, boxAlpha); // pisava
		}
		text(pointWords[i].text + " x" + pointWords[i].freq, currX * sizeCoeffX, currY * sizeCoeffY);

	}
	// tekst za e-knjižni nomad
	push();
	textSize(18* sizeCoeffY);
	fill(color('#65D3F7'), boxAlpha);
	translate(currX * sizeCoeffX, 400 * sizeCoeffY);
	rotate(-PI/2.0);
	text("E-knjižni nomad", 30 * sizeCoeffX, -4 * sizeCoeffY);
	stroke(60);
	strokeWeight(1);
	line(0, -2 * sizeCoeffX, 260 * sizeCoeffY, -2 * sizeCoeffX);
	pop();
	showPointCount--;
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