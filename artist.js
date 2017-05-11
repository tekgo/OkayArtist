/*
Licensing

The contents of this repository are made available to you under the following license.

Copyright (C) 2013 by Andi McClure and Michael Brough
Copyright (C) 2016 by Patrick Winchell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*
	TODO:
	-	Import initial setup.
	-	Improved message text.
	?	Better keyboard.
	?	Image import.
	?	Sound.
	?	Endianess.
*/

// An emotion is a object that sets how the auto-artist state
// will change when using an action. Actions without emotions will
// not be used, actions with all-zero emotions will be randomized.
function Emotion(keycode, joy, fear, disgust, anger, sadness) {
	this.keycode = keycode;
	if ((joy == 0) && (fear == 0) && (disgust == 0) && (anger == 0) && (sadness == 0)) {
		var max = 51;
		var half = 25;
		joy = Math.floor(Math.random() * max) - half;
		fear = Math.floor(Math.random() * max) - half;
		disgust = Math.floor(Math.random() * max) - half;
		anger = Math.floor(Math.random() * max) - half;
		sadness = Math.floor(Math.random() * max) - half;
	}
	this.state = new Array(joy,fear,disgust,anger,sadness);
	
	// How weighted an emotion is how much it gets some of the state towards zero,
	// disregarding parts of the state that move away from zero.
	this.compare = function(otherEmotion) {
		var weight = 0;
		for (var i = 0; i < this.state.length; ++i) {
			var x = this.state[i] + otherEmotion.state[i];
			var diff = Math.abs(this.state[i]) - Math.abs(x);
			if (diff > 0) {
				weight += diff;
			}
		}
		return weight;
	}
	
	this.add = function(otherEmotion) {
		for (var i = 0; i < this.state.length; ++i) {
			this.state[i] += otherEmotion.state[i];
		}
	}

	this.addm = function(otherEmotion, mul) {
		for (var i = 0; i < this.state.length; ++i) {
			this.state[i] += otherEmotion.state[i] * mul;
		}
	}
}


// A touch key is a region of a touch surface that when touched simulates a keypress.
function TouchKey(keyCode, x, y, w, h) {
	this.keyCode = keyCode;
	this.origin = {x: x, y: y};
	this.size = {width: w, height: h};
	this.state = false;

	this.touch = function() {
		if (this.state == true) {
			return;
		}
		this.state = true;
		Input.keyDownHandler({keyCode : this.keyCode, which : this.keyCode});
	}

	this.unTouch = function() {
		if (this.state == false) {
			return;
		}
		this.state = false;
		Input.keyUpHandler({keyCode : this.keyCode, which : this.keyCode});
	}
}

var touchKeys = [
	new TouchKey(187, 0 / 8, 0 / 8, 1 / 8, 1 / 8), // Save / Equals
	new TouchKey(46, 1 / 8, 0 / 8, 1 / 8, 1 / 8), // Undo / Delete
	new TouchKey(13, 2 / 8, 0 / 8, 3 / 8, 1 / 8), // Enter
	new TouchKey(220, 5 / 8, 0 / 8, 2 / 8, 1 / 8), // Gallery '\'
	new TouchKey(192, 7 / 8, 0 / 8, 1 / 8, 1 / 8), // Auto / Tilde
	new TouchKey(112, 0 / 12, 1 / 8, 1 / 12, 1 / 8), // F1
	new TouchKey(113, 1 / 12, 1 / 8, 1 / 12, 1 / 8), // F2
	new TouchKey(114, 2 / 12, 1 / 8, 1 / 12, 1 / 8), // F3
	new TouchKey(115, 3 / 12, 1 / 8, 1 / 12, 1 / 8), // F4
	new TouchKey(116, 4 / 12, 1 / 8, 1 / 12, 1 / 8), // F5
	new TouchKey(117, 5 / 12, 1 / 8, 1 / 12, 1 / 8), // F6
	new TouchKey(118, 6 / 12, 1 / 8, 1 / 12, 1 / 8), // F7
	new TouchKey(119, 7 / 12, 1 / 8, 1 / 12, 1 / 8), // F8
	new TouchKey(120, 8 / 12, 1 / 8, 1 / 12, 1 / 8), // F9
	new TouchKey(121, 9 / 12, 1 / 8, 1 / 12, 1 / 8), // F10
	new TouchKey(122, 10 / 12, 1 / 8, 1 / 12, 1 / 8), // F11
	new TouchKey(123, 11 / 12, 1 / 8, 1 / 12, 1 / 8), // F12
	new TouchKey(48, 0 / 10, 2 / 8, 1 / 10, 1 / 8), // 0
	new TouchKey(49, 1 / 10, 2 / 8, 1 / 10, 1 / 8), // 1
	new TouchKey(50, 2 / 10, 2 / 8, 1 / 10, 1 / 8), // 2
	new TouchKey(51, 3 / 10, 2 / 8, 1 / 10, 1 / 8), // 3
	new TouchKey(52, 4 / 10, 2 / 8, 1 / 10, 1 / 8), // 4
	new TouchKey(53, 5 / 10, 2 / 8, 1 / 10, 1 / 8), // 5
	new TouchKey(54, 6 / 10, 2 / 8, 1 / 10, 1 / 8), // 6
	new TouchKey(55, 7 / 10, 2 / 8, 1 / 10, 1 / 8), // 7
	new TouchKey(56, 8 / 10, 2 / 8, 1 / 10, 1 / 8), // 8
	new TouchKey(57, 9 / 10, 2 / 8, 1 / 10, 1 / 8), // 9
	new TouchKey(81, 0 / 8, 3 / 8, 1 / 8, 1 / 8), // Q
	new TouchKey(87, 1 / 8, 3 / 8, 1 / 8, 1 / 8), // W
	new TouchKey(69, 2 / 8, 3 / 8, 1 / 8, 1 / 8), // E
	new TouchKey(82, 3 / 8, 3 / 8, 1 / 8, 1 / 8), // R
	new TouchKey(84, 4 / 8, 3 / 8, 1 / 8, 1 / 8), // T
	new TouchKey(89, 5 / 8, 3 / 8, 1 / 8, 1 / 8), // Y
	new TouchKey(85, 6 / 8, 3 / 8, 1 / 8, 1 / 8), // U
	new TouchKey(73, 7 / 8, 3 / 8, 1 / 8, 1 / 8), // I
	new TouchKey(65, 0 / 8, 4 / 8, 1 / 8, 1 / 8), // A
	new TouchKey(83, 1 / 8, 4 / 8, 1 / 8, 1 / 8), // S
	new TouchKey(68, 2 / 8, 4 / 8, 1 / 8, 1 / 8), // D
	new TouchKey(70, 3 / 8, 4 / 8, 1 / 8, 1 / 8), // F
	new TouchKey(71, 4 / 8, 4 / 8, 1 / 8, 1 / 8), // G
	new TouchKey(72, 5 / 8, 4 / 8, 1 / 8, 1 / 8), // H
	new TouchKey(74, 6 / 8, 4 / 8, 1 / 8, 1 / 8), // J
	new TouchKey(75, 7 / 8, 4 / 8, 1 / 8, 1 / 8), // K
	new TouchKey(90, 0 / 8, 5 / 8, 1 / 8, 1 / 8), // Z
	// new TouchKey(88, 1 / 8, 5 / 8, 1 / 8, 1 / 8), // X
	new TouchKey(67, 1 / 8, 5 / 8, 1 / 8, 1 / 8), // C
	new TouchKey(86, 2 / 8, 5 / 8, 1 / 8, 1 / 8), // V
	new TouchKey(66, 3 / 8, 5 / 8, 1 / 8, 1 / 8), // B
	new TouchKey(78, 4 / 8, 5 / 8, 1 / 8, 1 / 8), // N
	new TouchKey(77, 5 / 8, 5 / 8, 1 / 8, 1 / 8), // M
	new TouchKey(76, 6 / 8, 5 / 8, 1 / 8, 1 / 8), // L
	new TouchKey(79, 7 / 8, 5 / 8, 1 / 8, 1 / 8), // O
	new TouchKey(80, 0 / 8, 6 / 8, 1 / 8, 1 / 8), // P
	new TouchKey(189, 1 / 8, 6 / 8, 1 / 8, 1 / 8), // Minus
	new TouchKey(38, 6 / 8, 6 / 8, 1 / 8, 1 / 8), // Up
	new TouchKey(32, 0 / 8, 7 / 8, 5 / 8, 1 / 8), // Space
	new TouchKey(37, 5 / 8, 7 / 8, 1 / 8, 1 / 8), // Left
	new TouchKey(40, 6 / 8, 7 / 8, 1 / 8, 1 / 8), // Down
	new TouchKey(39, 7 / 8, 7 / 8, 1 / 8, 1 / 8), // Right
];

var Artsy = {};

/* Constants */

Artsy.constants = {
	defaultSize: 128
}

/* Properties */

Artsy.canvas = null;
Artsy.keyboard = null;

Artsy.state = {
	canvasNeedsUpdate: true,
	imageData: new ImageData(Artsy.constants.defaultSize, Artsy.constants.defaultSize),
	brushType: 0,
	brushSize: 1,
	brushPoint: {
		x: 50,
		y: 50
	},
	haskeyed: false,
	keyStates: {},
	pressStates: {},
	lockedRegions: new Array(),
	newLockedRegions: new Array(),
	ticks: 0,
	blip: true,
	saveState: null,
	touches: new Array(),
	mouseDown: false,
	mousePoint: {x: 0, y: 0},
	similar: null,
	similarImg: null,
}

/* Lifecycle functions */

// Setup.
Artsy.start = function() {
	Artsy.canvas = Artsy.createCanvas(Artsy.constants.defaultSize, Artsy.constants.defaultSize);
	var main = document.createElement("div");
	document.body.appendChild(main);
	main.id = "main"

	var holder = document.createElement("div");
	main.appendChild(holder);
	holder.id = "holder"
	holder.appendChild(Artsy.canvas);

	var keyboard = document.createElement("canvas");
	keyboard.id = "keyboard";
	keyboard.width = 128;
	keyboard.height = 128;
	holder.appendChild(keyboard);
	Artsy.keyboard = keyboard;

	Artsy.state = Artsy.actions.greyFill.action(Artsy.state)

	document.addEventListener("keydown", Input.keyDownHandler, false);
	document.addEventListener("keyup", Input.keyUpHandler, false);
	main.addEventListener("touchstart", Input.touchMoveHandler, false);
	main.addEventListener("touchend", Input.touchMoveHandler, false);
	main.addEventListener("touchmove", Input.touchMoveHandler, false);
	main.addEventListener("mousedown", Input.mouseDownHandler, false);
	main.addEventListener("mouseup", Input.mouseUpHandler, false);
	main.addEventListener("mousemove", Input.mouseMoveHandler, false);

	Artsy.allActions = Artsy.findAllActions();
	Artsy.update();

	Artsy.canvas.ondragover = function () { this.className = 'hover'; return false; };
	Artsy.canvas.ondragend = function () { this.className = ''; return false; };
	Artsy.canvas.ondrop = function (e) {
		this.className = '';
		e.preventDefault();
		Artsy.readfiles(e.dataTransfer.files, false);
	}

	Artsy.keyboard.ondragover = function () { this.className = 'hover'; return false; };
	Artsy.keyboard.ondragend = function () { this.className = ''; return false; };
	Artsy.keyboard.ondrop = function (e) {
		this.className = '';
		e.preventDefault();
		Artsy.readfiles(e.dataTransfer.files, true);
	}

};

Artsy.readfiles = function(files, similar) {
	// Only care about the first file.
	var file = files[0];
	if (file != undefined) {
	    var reader = new FileReader();
	    reader.onload = function (event) {
		var image = new Image();
		image.src = event.target.result;
		image.onload = function() {
			var canvas = document.createElement('canvas');
			var context = canvas.getContext('2d');
			// Draw it onto a 128 x 128 canvas.
			canvas.width = Artsy.constants.defaultSize;
			canvas.height = Artsy.constants.defaultSize;
			context.drawImage(image, 0,0, Artsy.constants.defaultSize, Artsy.constants.defaultSize);
			var imgDat = context.getImageData(0, 0, Artsy.constants.defaultSize, Artsy.constants.defaultSize);
			ImgFuncs.addBufferToImageData(imgDat);
			if (similar == true) {
				Artsy.state.similar = imgDat;
				var newImage = new Image();
				newImage.src = canvas.toDataURL();
				Artsy.state.similarImg = newImage;
				Artsy.state.fran = true;
			}
			else {
				Artsy.state.imageData = imgDat;
			}
		}
    };
	    reader.readAsDataURL(file);
	}
}

// Per frame update.
Artsy.update = function() {
	++Artsy.state.ticks;
	var copy = ImgFuncs.copyData(Artsy.state.imageData);

	Artsy.state = Artsy.franIt(Artsy.state);
	ImgFuncs.addBufferToImageData(Artsy.state.imageData);

	var actions = Artsy.allActions;
	for (var i = 0; i < actions.length; ++i) {
		var action = actions[i];
		var keyCode = action["keycode"];
		if (keyCode > 0) {
			if (Artsy.state.keyStates[keyCode] == true) {
				Artsy.state = action.action(Artsy.state);
				Artsy.state.canvasNeedsUpdate = true;
			}
		}
		var keyCode = action["pressCode"];
		if (keyCode > 0) {
			if (Artsy.state.pressStates[keyCode] == true) {
				Artsy.state = action.action(Artsy.state);
				Artsy.state.canvasNeedsUpdate = true;
			}
		}
	}

	Artsy.state.pressStates = {};

	if (Artsy.state.canvasNeedsUpdate == true) {

		// For each locked region reset the region to it's state before the update.
		Artsy.state.lockedRegions = Artsy.state.newLockedRegions.concat(Artsy.state.lockedRegions);
		for (var i = 0; i < Artsy.state.lockedRegions.length; ++i) {
			var region = Artsy.state.lockedRegions[i];
			if(region.lifetime<=0) {
				break;
			}
			region.lifetime -= 1/60;
			var size = region.size;
			var sx = region.x * size;
			var sy = region.y * size;
			for (var x = 0; x < size; ++x) {
				for (var y = 0; y < size; ++y) {
					// This is slow, make a thing for it.
					ImgFuncs.setColor32(Artsy.state.imageData,x + sx, y + sy,ImgFuncs.getColor32(copy,x + sx, y + sy));
				}
			}

		}

		var ctx = Artsy.canvas.getContext('2d');
		ctx.putImageData(Artsy.state.imageData, 0, 0);

		// Draw the brush point.
		if (Artsy.state.blip == true) {
			ctx.beginPath();
			ctx.arc(Artsy.state.brushPoint.x, Artsy.state.brushPoint.y, 2, 0, 2 * Math.PI, false);
			ctx.fillStyle = "rgba(255,255,0,0.5)";
			ctx.fill();
		}

		Artsy.canvasNeedsUpdate = false;

		// Color new locked regions yellow.
		for (var i = 0; i < Artsy.state.newLockedRegions.length; ++i) {
			var region = Artsy.state.newLockedRegions[i];
			var size = region.size;
			var x = region.x * size;
			var y = region.y * size;
			ctx.fillStyle = "rgba(255,255,127,1)";
			ctx.fillRect(x,y,size,size);

			Artsy.canvasNeedsUpdate = true;
		}

		var message = [];
		if(Artsy.state.haskeyed == false) {
			message.push("Press key to art");
		}
		if(Artsy.state.fran == true) {
			message.push("Auto artist on");
		}
		if(message.length > 0 && Artsy.state.similar == null) {
			var size = 15;
			var offset = (message.length - 1) * size / 2;
			var maxWidth = 0
			ctx.fillStyle = "rgba(0,0,0,0.75)";
			for (var i = 0; i < message.length; ++i) {
				maxWidth = Math.max(message[i].length, maxWidth);
			}
			maxWidth *= size * 0.5;
			ctx.fillRect(Artsy.state.imageData.width/2 - maxWidth / 2 , Artsy.state.imageData.height/2 - offset - size ,maxWidth,size * message.length + size * 0.5);
			ctx.font = "12px monospace";
			ctx.baseline = "middle";
			ctx.textAlign = "center";
			ctx.fillStyle = "white";
			for (var i = 0; i < message.length; ++i) {
				ctx.fillText(message[i], Artsy.state.imageData.width/2, Artsy.state.imageData.height/2 - offset + (i * size));
			}
		}

		Artsy.state.newLockedRegions = [];
	}

	// Color the keys yellow if a key is being pressed.
	if (ImgFuncs.boardData && Artsy.keyboard) {
		var btx = Artsy.keyboard.getContext('2d');
		if (Artsy.state.similarImg != null) {
			btx.drawImage(Artsy.state.similarImg, 0, 0);
		}
		else {
			btx.drawImage(ImgFuncs.board, 0, 0);
		}
		btx.fillStyle = "rgba(255,255,127,0.5)";

		for (var i = 0; i < touchKeys.length; ++i) {
			var touchKey = touchKeys[i]
			if (Artsy.state.keyStates[touchKey.keyCode] || Artsy.state.pressStates[touchKey.keyCode]) {
				btx.fillRect(Artsy.keyboard.width * touchKey.origin.x , Artsy.keyboard.height * touchKey.origin.y , Artsy.keyboard.width * touchKey.size.width, Artsy.keyboard.height * touchKey.size.height);
			}

		}
	}

	window.requestAnimationFrame(Artsy.update);
};

/* Canvas functions */

Artsy.createCanvas = function(w, h) {
	var canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	return canvas;
}

/* Effect handling */

Artsy.findAllActions = function() {
	var actions = new Array()
	var keys = Object.keys(Artsy.actions)
	for (i = 0; i < keys.length; ++i) {
		var key = keys[i]
		if (typeof key !== 'undefined' && typeof Artsy.actions[key] !== 'undefined' && Artsy.actions[key] != null) {
			var action = Artsy.actions[key];
			if (action["action"] != null) {
				actions.push(action);
			}
		}
	}
	return actions;
}

Artsy.findAllBrushes = function() {
	var brushes = new Array()
	var keys = Object.keys(Artsy.brushes)
	for (i = 0; i < keys.length; ++i) {
		var key = keys[i]
		if (typeof key !== 'undefined' && typeof Artsy.brushes[key] !== 'undefined' && Artsy.brushes[key] != null) {
			var brush = Artsy.brushes[key];
			if (brush["action"] != null) {
				brushes.push(brush);
			}
		}
	}
	return brushes;
}

/* Event Handlers */

var Input = {};

Input.keyDownHandler = function(e) {
	var keyCode = e.keyCode;

	if (keyCode == 192) { // Tilde
		Artsy.state.pressStates = {};
		Artsy.state.keyStates = {};
		Artsy.state.fran = !Artsy.state.fran;
		Artsy.state.mouseDown = false
		Artsy.state.touches = [];
	}
	else {
		if (Artsy.state.fran) {
		Artsy.state.fran = false;
		Artsy.state.pressStates = {};
		Artsy.state.keyStates = {};
		}
		if (!Artsy.state.keyStates[keyCode]) {
			Artsy.state.pressStates[keyCode] = true;
		}
		Artsy.state.keyStates[keyCode] = true;
		Artsy.state.haskeyed = true;
	}
}

Input.keyUpHandler = function(e) {
	var keyCode = e.keyCode || e.which;
	Artsy.state.keyStates[keyCode] = false;

	// iPad bluetooth keyboards emit only keyCode 0 for keyup.
	if (keyCode == 0) {
		Artsy.state.keyStates = {};
		Artsy.state.pressStates = {};
	}
}

Input.mouseDownHandler = function(e) {
	Artsy.state.mouseDown = true;
	Artsy.state.mousePoint = {x: e.clientX, y: e.clientY};
	Input.mouseHandler();
}

Input.mouseUpHandler = function(e) {
	Artsy.state.mouseDown = false;
	Artsy.state.mousePoint = {x: e.clientX, y: e.clientY};
	Input.mouseHandler();
}

Input.mouseMoveHandler = function(e) {
	Artsy.state.mousePoint = {x: e.clientX, y: e.clientY};
	Input.mouseHandler();
}

Input.mouseHandler = function() {
	if (Artsy.state.mouseDown == true) {
		Input.pointHandler([Artsy.state.mousePoint]);
	}
	else {
		Input.pointHandler([]);
	}
}

Input.touchMoveHandler = function(e) {
	e.preventDefault();
	Artsy.state.touches = e.touches;
	var keyboard = Artsy.keyboard;
	var allPoints = [];
	for (var i = 0; i < Artsy.state.touches.length; ++i) {
		var x = Artsy.state.touches[i].clientX;
		var y = Artsy.state.touches[i].clientY;
		allPoints.push({x: x, y: y});
	}
	Input.pointHandler(allPoints);
}

// Handles all touches or mouse moves.
Input.pointHandler = function(allPoints) {
	var keyboard = Artsy.keyboard;
	if(keyboard) {
		function calcOffset(obj) {
			if (obj.offsetParent) {
				var parentOffset = calcOffset(obj.offsetParent);
				return {x: parentOffset.x + obj.offsetLeft, y: parentOffset.y + obj.offsetTop};
			}
			return {x: 0, y: 0};
		}

		var offset = calcOffset(keyboard);
		var width = keyboard.offsetWidth;
		var height = keyboard.offsetHeight;

		var points = [];
		for (var i = 0; i < allPoints.length; ++i) {
			var x = (allPoints[i].x - offset.x) / width;
			var y = (allPoints[i].y - offset.y) / height;
			points.push({x: x, y: y});
		}

		for (var i = 0; i < touchKeys.length; ++i) {
			var touchKey = touchKeys[i]
			var wasTouched = false;
			for (var k = 0; k < points.length; ++k) {
				if((touchKey.origin.x <= points[k].x) && (touchKey.origin.y <= points[k].y) && (touchKey.origin.x + touchKey.size.width >= points[k].x) && (touchKey.origin.y + touchKey.size.height >= points[k].y)) {
					wasTouched = true;
					break
				}
			}
			if (wasTouched) {
				touchKey.touch()
			}
			else {
				touchKey.unTouch()
			}
		}
	}
}

/* Save/load images */

var Gallery = {
	images: null
};

// Stores images as data urls
Gallery.saveImageData = function(imageData) {
	var images = Gallery.getSavedImages();
	var url = ImgFuncs.toDataURL(imageData);
	for (var i = 0; i <images.length; ++i) {
		if (images[i] == url) {
			return;
		}
	}
	images.splice(0,0,url);
	var string = JSON.stringify(images);
	// Limit to 4 MB, don't use MiB just in case.
	// Remove oldest images.
	while(string.length > 1000 * 1000 * 4) {
		images.pop(); // Remove oldest images.
		string = JSON.stringify(images);
	}

	// Local storage may fail if the user has private browsing on.
	try {
	   window.localStorage.setItem("imageArray", JSON.stringify(images));
	}
	catch (e) {
	   console.log(e);
	}
	Gallery.images = images;
}

Gallery.getSavedImages = function() {
	if (Gallery.images) {
		return Gallery.images;
	}
	var storedValues = localStorage.getItem("imageArray")
	if(storedValues) {
		var images = JSON.parse(storedValues);
		if(images) {
			Gallery.images = images;
			return images;
		}
	}
	return [];
}

// Displays all saved images. Does not display if there are no saved images.
Gallery.displayGallery = function() {
	var currentGallery = document.getElementById("gallery")
	if (currentGallery) {
		currentGallery.remove();
		return;
	}
	var images = Gallery.getSavedImages();
	if(images.length <= 0) {
		return;
	}

	var newGallery = document.createElement("div");
	newGallery.id = "gallery";
	var close = document.createElement("div");
	close.innerHTML = "X";
	close.onclick = function() { Gallery.displayGallery() };
	newGallery.appendChild(close);

	var native = false;
	if (("standalone" in window.navigator) && window.navigator.standalone ){
		native = true;
	}
	var imgTags = new Array();
	for (var i = 0; i < images.length; ++i) {
		var j = i;
		ImgFuncs.loadImage(images[i], function(img) {
			var data = ImgFuncs.fromImage(img);
			var url = ImgFuncs.toDataURL(ImgFuncs.scaleImageData(data, 4));
			var imgTag = document.createElement("img")
			imgTag.src = url;
			imgTag.setAttribute("download","img.png");
			if(native) {
				// On native iOS the img callout doesn't work, so link to the image elsewhere.
				var linkTag = document.createElement("a");
				linkTag.setAttribute("href","http://superpartyawesome.com/things/imageDisplay/#"+url);
				linkTag.appendChild(imgTag);
				linkTag.setAttribute("target","_blank");
				linkTag.setAttribute("rel","external");
				linkTag.setAttribute("download","img.png");
				newGallery.appendChild(linkTag);
			}
			else {
				newGallery.appendChild(imgTag);
			}
			imgTags.push(imgTag);
			if(imgTags.length == images.length) {
				while (newGallery.firstChild) {
				    newGallery.removeChild(newGallery.firstChild);
				}
				newGallery.appendChild(close);
				for (var i = 0; i < imgTags.length; i++) {
					newGallery.appendChild(imgTags[i]);
				}
			}

		});
	}
	document.body.appendChild(newGallery);

}

/* Actions */

Artsy.actions = {}

/* Effects */

// Draws solid horizontal lines.
Artsy.actions.greyFill = {
	name: "Random greyscale fill",
	affectsCanvas: true,
	action: function(state) {
		var output = new ImageData(state.imageData.width, state.imageData.height);
		ImgFuncs.addBufferToImageData(output);
		var r = Math.floor(32 * Math.random()) * 8;
		var g = Math.floor(32 * Math.random()) * 8;
		var b = Math.floor(32 * Math.random()) * 8;
		for (var i = 0; i < output.width * output.height; ++i) {
			if (i % Math.floor(output.width * 8.0 * Math.random()) == 0) {
				r = Math.floor(32 * Math.random()) * 8;
				g = Math.floor(32 * Math.random()) * 8;
				b = Math.floor(32 * Math.random()) * 8;
			}
			output.data[i * 4] = r;
			output.data[i * 4 + 1] = g;
			output.data[i * 4 + 2] = b;
			output.data[i * 4 + 3] = 255;
		}
		state.imageData = output;
		return state;
	}
}

Artsy.actions.also_do_something_neat_idk = {
	name: "also_do_something_neat_idk",
	affectsCanvas: true,
	keycode: 77, // M
	emotion: new Emotion(77,1,2,3,0,0),
	action: function(state) {
		var output = state.imageData
		for (var x = 0; x < output.width; ++x) {
			for (var y = 0; y < output.height; ++y) {

				for (var i = 0; i < 3; ++i) {
					var e = uint32(0);
					var d = uint32(0);

					if (x > 0) {
						d = uint32(ImgFuncs.getColor32(output, x - 1, y)>>(i*8)) & 0xff;
						e = uint32(e | d);
					}
					if (y > 0) {
						d = uint32(ImgFuncs.getColor32(output, x, y - 1)>>(i*8)) & 0xff;
						e = uint32(e | d);
					}
					if (x < output.width - 1) {
						d = uint32(ImgFuncs.getColor32(output, x + 1, y)>>(i*8)) & 0xff;
						e = uint32(e | d);
					}
					if (y < output.height - 1) {
						d = uint32(ImgFuncs.getColor32(output, x, y + 1)>>(i*8)) & 0xff;
						e = uint32(e | d);
					}

					var c1 = uint32(ImgFuncs.getColor32(state.imageData, x, y));
					var c2 = c1 | (uint32(e) << uint32(i * 8))
					if (c2 > c1) {
						++c1;
					} else if (c2 < c1) {
						--c1;
					}
					ImgFuncs.setColor32(state.imageData, x, y, c1);
				}
			}
		}

		state.imageData = output;
		return state;
	}
}

Artsy.actions.do_a_thing = {
	name: "do_a_thing",
	affectsCanvas: true,
	keycode: 89, // Y
	emotion: new Emotion(89,-1,-2,-3,0,0),
	action: function(state) {
		var oxbox = [0xffffff00, 0xffff00ff, 0xff00ffff];
		var output = state.imageData
		for (var x = 0; x < output.width; ++x) {
			for (var y = 0; y < output.height; ++y) {
				for (var i = 0; i < 3; ++i) {
				var e = uint32(0);
				var d = 0;
				var n = 0;
				if (x > 0) {
					d = uint32(ImgFuncs.getColor32(output, x - 1, y)>>(i*8)) & 0xff;
					e = uint32(e | d);
					if (d>0x7f) ++n;
				}
				if (y > 0) {
					d = uint32(ImgFuncs.getColor32(output, x, y - 1)>>(i*8)) & 0xff;
					e = uint32(e | d);
					if (d>0x7f) ++n;
				}
				if (x < output.width - 1) {
					d = uint32(ImgFuncs.getColor32(output, x + 1, y)>>(i*8)) & 0xff;
					e = uint32(e | d);
					if (d>0x7f) ++n;
				}
				if (y < output.height - 1) {
					d = uint32(ImgFuncs.getColor32(output, x, y + 1)>>(i*8)) & 0xff;
					e = uint32(e | d);
					if (d>0x7f) ++n;
				}

					var c1 = uint32(ImgFuncs.getColor32(state.imageData, x, y));
					var c2 = uint32((c1>>uint32(i*8))) & 0xff
					if (n>2 && c2<0xff) {
						++c2;
					}
					else if (c2>0) {
						--c2;
					}
					c1 = uint32(uint32(c1 & uint32(oxbox[i])) | uint32(c2 << (i*8)));
					ImgFuncs.setColor32(state.imageData, x, y, c1);
				}
			}
		}

		state.imageData = output;
		return state;
	}
}

Artsy.actions.do_another_thing = {
	name: "do_another_thing",
	affectsCanvas: true,
	keycode: 84, // T
	emotion: new Emotion(84,0,0,0,0,0),
	action: function(state) {
		var output = state.imageData
		for (var x = 0; x < output.width; ++x) {
			for (var y = 0; y < output.height; ++y) {
				var nx = x-1;
				var ny = y;
				if (nx<0)
				{
					nx += output.width;
					++ny;
					if (ny>=output.height)
						ny = 0;
				}

				var c1 = ImgFuncs.getColorArr(output, x, y);
				var c2 = ImgFuncs.getColorArr(output, nx, ny);
				for (i=0; i<3; ++i)
				{
					c1[i] = ((c1[i]%64) + (61*Math.floor(c1[i]/64)) + (2*Math.floor(c2[i]/64)) + Math.floor(c2[(i+1)%3]/64)) % 256;
				}

				var rgb1 = ImgFuncs.arrTo32(c1)

				ImgFuncs.setColor32(output, x, y, rgb1);
			}
		}

		state.imageData = output;
		return state;
	}
}

Artsy.actions.do_a_weird_thing = {
	name: "do_a_weird_thing",
	affectsCanvas: true,
	keycode: 73, // I
	emotion: new Emotion(73,-5,-5,5,5,5),
	action: function(state) {
		var output = state.imageData
		for (var x = 0; x < output.width; ++x) {
			for (var y = 0; y < output.height; ++y) {
				var c1 = ImgFuncs.getColorArr(output, x, y);
				var hsv = ImgFuncs.RGBToHSV(c1);
				hsv[0] += 1 / 360;
				c1 = ImgFuncs.HSVToRGB(hsv);
				ImgFuncs.setColorArr(output, x, y, c1);
			}
		}
		state.imageData = output;
		return state;
	}
}

Artsy.actions.do_a_locational_thing = {
	name: "do_a_locational_thing",
	affectsCanvas: true,
	keycode: 71, // G
	emotion: new Emotion(71,0,0,0,0,0),
	action: function(state) {
		var output = state.imageData;
		var x = state.brushPoint.x;
		var total = new Array(0,0,0)

		for (var y = 0; y < output.height; ++y) {
			var c1 = ImgFuncs.getColorArr(output, x, y);
			total[0] += ~~(c1[0]/output.width);
			total[1] += ~~(c1[1]/output.width);
			total[2] += ~~(c1[2]/output.width);
		}

		for (var y = 0; y < output.height; ++y) {
			c2 = ImgFuncs.getColorArr(output, x, y);

			if(c2[0] > total[0]) --c2[0];
			if(c2[0] < total[0]) ++c2[0];
			if(c2[1] > total[1]) --c2[1];
			if(c2[1] < total[1]) ++c2[1];
			if(c2[2] > total[2]) --c2[2];
			if(c2[2] < total[2]) ++c2[2];


			ImgFuncs.setColorArr(output, x, y, c2);
		}
		return state;
	}
}

Artsy.actions.down_thing = {
	name: "down_thing",
	affectsCanvas: true,
	keycode: 70, // F
	emotion: new Emotion(70,0,0,0,0,0),
	action: function(state) {
		var output = state.imageData
		for (var x = 0; x < output.width; ++x) {
			for (var y = output.height - 1; y > 0; y--) {
				var rgb1 = ImgFuncs.getColorArr(output, x, y);
				var rgb2 = ImgFuncs.getColorArr(output, x, y - 1);
				if (rgb2[0]>rgb1[0])
				{
					var tmp = rgb1[0];
					rgb1[0] = rgb2[0];
					rgb2[0] = tmp;
				}
				if (rgb2[1]>rgb1[1])
				{
					var tmp = rgb1[1];
					rgb1[1] = rgb2[1];
					rgb2[1] = tmp;
				}
				if (rgb2[2]>rgb1[2])
				{
					var tmp = rgb1[2];
					rgb1[2] = rgb2[2];
					rgb2[2] = tmp;
				}
				ImgFuncs.setColorArr(output, x, y, rgb1);
				ImgFuncs.setColorArr(output, x, y - 1, rgb2);
			}
		}
		state.imageData = output;
		return state;
	}
}

Artsy.actions.bandit = {
	name: "bandit",
	affectsCanvas: true,
	keycode: 87, // W
	emotion: new Emotion(87,0,0,0,0,0),
	action: function(state) {
		var output = state.imageData
		for (var x = 0; x < output.width; ++x) {
			for (var y = 0; y < output.height; ++y) {
				var rgb = ImgFuncs.getColorArr(output, x, y);
				for (n=0; n<3; ++n)
				{
					if (Math.floor(Math.floor((rgb[n])/64)*64+16)<rgb[n]) {
						--rgb[n];
					}
					else {
						++rgb[n];
					}
				}
				ImgFuncs.setColorArr(output, x, y, rgb);
			}
		}
		state.imageData = output;
		return state;
	}
}

Artsy.actions.magic = {
	name: "magic",
	affectsCanvas: true,
	keycode: 76, // L
	emotion: new Emotion(76,0,0,0,0,0),
	action: function(state) {
		var output = state.imageData
		for (var x = 0; x < output.width; ++x) {
			for (var y = 0; y < output.height; ++y) {
				var r1 = ImgFuncs.getColorC(output, x, y, 0);
				if(r1 > 32) {
					var r2 = ImgFuncs.getColorC(output, underflowMod(x-1,output.width), y,0);
					r2 = Math.floor((r1 + r2) / 2);
					ImgFuncs.setColorC(output, underflowMod(x-1,output.width), y, 0, r2);

					var r3 = ImgFuncs.getColorC(output, underflowMod(x+1,output.width), underflowMod(y+1,output.height), 0);
					++r3;
					ImgFuncs.setColorC(output, underflowMod(x+1,output.width), underflowMod(y+1,output.height), 0, r3);

					var r4 = ImgFuncs.getColorC(output, underflowMod(x+1,output.width), underflowMod(y-1,output.height), 0);
					++r4;
					ImgFuncs.setColorC(output, underflowMod(x+1,output.width), underflowMod(y-1,output.height), 0, r4);
				}
			}
		}
		state.imageData = output;
		return state;
	}
}

Artsy.actions.findEdgesRed = {
	name: "findEdgesRed",
	affectsCanvas: true,
	keycode: 69, // E
	emotion: new Emotion(69,0,0,0,0,-500),
	action: function(state) {
		var output = ImgFuncs.findEdges(state.imageData, 2, 192, new Array(255,0,0))
		state.imageData = output;
		return state;
	}
}

Artsy.actions.findEdgesWhite = {
	name: "findEdgesWhite",
	affectsCanvas: true,
	keycode: 79, // O
	emotion: new Emotion(79,0,0,0,0,-500),
	action: function(state) {
		var output = ImgFuncs.findEdges(state.imageData, 0, 128, new Array(255,255,255))
		state.imageData = output;
		return state;
	}
}

Artsy.actions.findEdgesGreen = {
	name: "findEdgesGreen",
	affectsCanvas: true,
	keycode: 65, // A
	emotion: new Emotion(65,0,0,0,0,-500),
	action: function(state) {
		var output = ImgFuncs.findEdges(state.imageData, 1, 128, new Array(0,255,0))
		state.imageData = output;
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_Q = {
	name: "SDL_SCANCODE_Q",
	affectsCanvas: true,
	keycode: 81, // Q
	emotion: new Emotion(81,0,0,0,0,0),
	action: function(state) {
		state.brushPoint.y = underflowMod(state.brushPoint.y - 1, state.imageData.height)
		return Artsy.actions.circle_thing.action(state);
	}
}

Artsy.actions.SDL_SCANCODE_R = {
	name: "SDL_SCANCODE_R",
	affectsCanvas: true,
	keycode: 82, // R
	emotion: new Emotion(82,0,0,0,0,0),
	action: function(state) {
		var output = state.imageData;
		for (var y = 1; y < output.height; ++y) {
			ImgFuncs.skewx(output, 0,y-1,output.width, 1,y);
		}

		state.imageData = output;
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_U = {
	name: "SDL_SCANCODE_U",
	affectsCanvas: true,
	keycode: 85, // U
	emotion: new Emotion(85,0,0,0,0,0),
	action: function(state) {
		var output = state.imageData;
		var w = state.imageData.width;
		var h = state.imageData.height;
		var max = w * h;
		function idx(_i) {
			var __i = _i - 1;
			return {x: __i % w, y: Math.floor(__i / w)};
		}
		function unidx(_i) {
			var __i = max - _i;
			return {x: __i % w, y: Math.floor(__i / w)};
		}
		function pass(idxf, swapf) {
			var pt = idxf(1);
			var x2 = pt.x;
			var y2 = pt.y;
			var c2 = ImgFuncs.getColorArr(output, x2, y2);
			var x1 = x2;
			var y1 = y2;
			var pt2 = idxf(i+1)
			var c1 = c2;
			for (var i = 1; i < max-1; ++i) {
				x1 = x2;
				y1 = y2;
				pt2 = idxf(i+1)
				x2 = pt2.x;
				y2 = pt2.y;
				c1 = c2;
				c2 = ImgFuncs.getColorArr(output, x2, y2);
				var colors = swapf(ImgFuncs.lesser(c1,c2), ImgFuncs.greater(c1,c2));
				var less = colors.a;
				var great = colors.b;
				ImgFuncs.setColorArr(output, x1, y1, less);
				ImgFuncs.setColorArr(output, x2, y2, great);
				c2 = great;
			}
		}
		for (var im = 1; im <= 4; ++im) {
			pass(idx, ImgFuncs.swap);
			pass(unidx, ImgFuncs.unswap);				
		}
		state.imageData = output;
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_P = {
	name: "SDL_SCANCODE_P",
	affectsCanvas: true,
	keycode: 80, // P
	emotion: new Emotion(80,0,0,0,0,0),
	action: function(state) {
		var output = state.imageData;

		var max = output.width * output.height;
		var besides = state.ticks % 2;
		function idxf(_i) {
			var i = _i-1+besides;
			return { x: underflowMod(i % output.width, output.width), y: underflowMod(Math.floor(i / output.width), output.height) }
		}

		for (var i = 0; i < max - 2; i+= 2) {
			var p1 = idxf(i);
			var p2 = idxf(i+1);
			var c1 = ImgFuncs.getColorArr(output, p1.x, p1.y);
			var c2 = ImgFuncs.getColorArr(output, p2.x, p2.y);
			ImgFuncs.setColorArr(output, p1.x, p1.y, c2);
			ImgFuncs.setColorArr(output, p2.x, p2.y, c1);
		}

		state.imageData = output;
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_D = {
	name: "SDL_SCANCODE_D",
	affectsCanvas: true,
	keycode: 68, // D
	emotion: new Emotion(68,0,0,0,0,0),
	action: function(state) {
		var output = state.imageData;
		ImgFuncs.skewx_channel(output, 0,0,output.width, output.height,1, 0)
		ImgFuncs.skewx_channel(output, 0,0,output.width, output.height,2, 1)
		ImgFuncs.skewx_channel(output, 0,0,output.width, output.height,3, 2)
		state.imageData = output;
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_K = {
	name: "SDL_SCANCODE_K",
	affectsCanvas: true,
	keycode: 75, // K
	emotion: new Emotion(75,1,1,1,1,1),
	action: function(state) {
		var output = state.imageData;
		var ticks = state.ticks;

		switch(ticks % 4) {
		    case 0:
		        ImgFuncs.skewx(output, 0,0,output.width, output.height/2,-1);
		        break;
	        case 1:
		        ImgFuncs.skewy(output, output.width/2,0,output.width/2, output.height,-1);
		        break;
		    case 2:
		        ImgFuncs.skewx(output, 0, output.height/2, output.width, output.height/2, 1);
		        break;
		    case 3:
		        ImgFuncs.skewy(output, 0,0,output.width/2, output.height, 1);
		        break;
		}

		state.imageData = output;
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_Z = {
	name: "SDL_SCANCODE_Z",
	affectsCanvas: true,
	keycode: 90, // Z
	emotion: new Emotion(90,0,0,0,0,0),
	action: function(state) {
		state.brushPoint.x = (state.brushPoint.x - 1 - 1 + state.imageData.height) % state.imageData.height + 1
		return Artsy.actions.circle_thing.action(state);
	}
}

Artsy.actions.SDL_SCANCODE_C = {
	name: "SDL_SCANCODE_C",
	affectsCanvas: true,
	keycode: 67, // C
	emotion: new Emotion(67,0,0,0,0,0),
	action: function(state) {
		state.brushPoint.x = (state.brushPoint.x + 1 - 1 + state.imageData.height) % state.imageData.height + 1
		return Artsy.actions.circle_thing.action(state);
	}
}

Artsy.actions.SDL_SCANCODE_B = {
	name: "SDL_SCANCODE_B",
	affectsCanvas: true,
	keycode: 66, // B
	emotion: new Emotion(66,0,0,0,0,0),
	action: function(state) {
		var output = state.imageData;
		var w = state.imageData.width;
		var h = state.imageData.height;
		var max = w * h;
		function idx(_i) {
			var __i = _i - 1;
			return {x: Math.floor(__i / w), y: __i % w};
		}
		function unidx(_i) {
			var __i = max - _i;
			return {x: Math.floor(__i / w), y: __i % w};
		}
		function cmp(a,b){ return a < b }
		function uncmp(a,b){ return a > b }
		function pass(idxf, cmpf) {
			var pt = idxf(1);
			var x2 = pt.x;
			var y2 = pt.y;
			var c2 = ImgFuncs.getColor32(output, x2, y2);
			var x1 = x2;
			var y1 = y2;
			var c1 = c2;
			for (var i = 1; i < max-1; ++i) {
				var pt2 = idxf(i+1)
				x1 = x2;
				y1 = y2;
				c1 = c2;
				x2 = pt2.x;
				y2 = pt2.y;
				c2 = ImgFuncs.getColor32(output, x2, y2);
				if (cmpf(c1,c2) == true) {
					ImgFuncs.setColor32(output, x1, y1, c2);
					ImgFuncs.setColor32(output, x2, y2, c1);
					c2 = c1;
				}
			}
		}
		for (var im = 1; im <= 4; ++im) {
			pass(idx, cmp);
			pass(unidx, uncmp);				
		}
		state.imageData = output;
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_N = {
	name: "SDL_SCANCODE_N",
	affectsCanvas: true,
	keycode: 78, // N
	emotion: new Emotion(78,0,0,0,0,0),
	action: function(state) {
		state.brushPoint.y = (state.brushPoint.y + 1 - 1 + state.imageData.height) % state.imageData.height + 1
		return Artsy.actions.circle_thing.action(state);
	}
}

Artsy.actions.circle_thing = {
	name: "circle_thing",
	affectsCanvas: true,
	keycode: 32, // SPACE
	emotion: new Emotion(32,0,0,0,0,0),
	action: function(state) {
		var thisState = state;
		Sounder.playSound("sfx_0");

		var brushes = Artsy.findAllBrushes();

		for (var i = 0; i < brushes.length; ++i) {
			var brush = brushes[i];
			if (brush.number == state.brushType) {
				thisState = brush.action(thisState);
			}
		}

		return thisState;
	}
}

Artsy.actions.SDL_SCANCODE_X = {
	name: "SDL_SCANCODE_X",
	affectsCanvas: false,
	pressCode: 88, // X
	// emotion: new Emotion(88,0,0,0,0,0),
	action: function(state) {
		state.blip = !state.blip
		Sounder.playSound("sfx_5");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_V = {
	name: "SDL_SCANCODE_V",
	affectsCanvas: true,
	pressCode: 86, // V
	emotion: new Emotion(86,0,0,0,0,0),
	action: function(state) {
		ImgFuncs.textify(state.imageData);
		Sounder.playSound("sfx_8");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_S = {
	name: "SDL_SCANCODE_S",
	affectsCanvas: true,
	pressCode: 83, // S
	emotion: new Emotion(83,0,0,0,0,0),
	action: function(state) {
		ImgFuncs.flipline(state.imageData, state.brushPoint.x, state.brushPoint.y)
		var temp = state.brushPoint.y
		state.brushPoint.y = state.brushPoint.x
		state.brushPoint.x = temp
		Sounder.playSound("sfx_4");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_H = {
	name: "SDL_SCANCODE_H",
	affectsCanvas: true,
	pressCode: 72, // H
	emotion: new Emotion(72,20,0,20,0,0),
	action: function(state) {
		var copy = ImgFuncs.copyData(state.imageData);
		function localFilter(size,x,y) {
			return {x: Math.max(Math.min(size+1,x*3),0), y: Math.max(Math.min(size+1,y*3),0)};
		}
		ImgFuncs.InPlacePyramid(state.imageData, copy, localFilter);
		Sounder.playSound("sfx_3");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_J = {
	name: "SDL_SCANCODE_J",
	affectsCanvas: true,
	pressCode: 74, // J
	emotion: new Emotion(74,0,0,0,0,0),
	action: function(state) {
		var assign = new Array();
		assign.push(Math.floor(Math.random() * 3));
		var color = new Array(0,0,0,255);
		var a = (assign[0] + 1) % 3;
		var b = (assign[0] + 2) % 3;
		if (Math.random() < 0.5) {
			assign.push(a);
			assign.push(b);
		}
		else {
			assign.push(b);
			assign.push(a);
		}

		for (var x = 0; x < state.imageData.width; ++x) {
			for (var y = 0; y < state.imageData.height; ++y) {
				var c1 = ImgFuncs.getColorArr(state.imageData,x,y);
				for (var c = 0; c < 3; ++c) {
					color[c] = c1[assign[c]];
				}
				ImgFuncs.setColorArr(state.imageData,x,y,color);
			}
		}

		Sounder.playSound("sfx_0_anti");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_MINUS = {
	name: "SDL_SCANCODE_MINUS",
	affectsCanvas: false,
	pressCode: 189, // MINUS
	emotion: new Emotion(189,0,0,0,0,0),
	action: function(state) {
		var subdiv = 4;
		var nx = ~~(Math.random() * subdiv);
		var ny = ~~(Math.random() * subdiv);
		var nlifetime = 2;
		var nsize = state.imageData.width / subdiv
		var region = {x : nx, y : ny, lifetime: nlifetime, size: nsize};
		state.newLockedRegions.push(region);
		Sounder.playSound("magic1");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_UP = {
	name: "SDL_SCANCODE_UP",
	affectsCanvas: true,
	pressCode: 38, // 
	emotion: new Emotion(38,20,20,0,0,0),
	action: function(state) {
		var copy = ImgFuncs.copyData(state.imageData);
		function localFilter(size,x,y) {
			return {x: Math.max(Math.min(size,size/3 + x),0), y: Math.max(Math.min(size,size/3 + y),0)};
		}
		ImgFuncs.InPlacePyramid(state.imageData, copy, localFilter);
		Sounder.playSound("sfx_2");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_DOWN = {
	name: "SDL_SCANCODE_DOWN",
	affectsCanvas: true,
	pressCode: 40, // 
	emotion: new Emotion(40,0,0,0,0,0),
	action: function(state) {
		function localFilter(i,s) {
			return ~~(i/3)+(i%3)*(~~(s/3));
		}
		var copy = ImgFuncs.copyData(state.imageData);
		for (var x = 0; x < state.imageData.width; ++x) {
			for (var y = 0; y < state.imageData.width; ++y) {
				var c = ImgFuncs.getColor32(copy, x, y);
				ImgFuncs.setColor32(state.imageData, localFilter(x,state.imageData.width),localFilter(y,state.imageData.height), c)
			}
		}
		Sounder.playSound("sfx_0");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_LEFT = {
	name: "SDL_SCANCODE_LEFT",
	affectsCanvas: true,
	pressCode: 37, // 
	emotion: new Emotion(37,0,0,0,0,0),
	action: function(state) {
		var copy = ImgFuncs.copyData(state.imageData);
		for (var x = 0; x < state.imageData.width; ++x) {
			for (var y = 0; y < state.imageData.width; ++y) {
				var c = ImgFuncs.getColor32(copy, x, y);
				ImgFuncs.setColor32(state.imageData, (x+(~~(state.imageData.width/3))-1)%state.imageData.width, y, c)
			}
		}
		Sounder.playSound("sfx_2");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_RIGHT = {
	name: "SDL_SCANCODE_RIGHT",
	affectsCanvas: true,
	pressCode: 39, // 
	emotion: new Emotion(39,0,0,0,0,0),
	action: function(state) {
		var copy = ImgFuncs.copyData(state.imageData);
		for (var x = 0; x < state.imageData.width; ++x) {
			for (var y = 0; y < state.imageData.width; ++y) {
				var c = ImgFuncs.getColor32(copy, x, y);
				ImgFuncs.setColor32(state.imageData, x, (y+(~~(state.imageData.height/3))-1)%state.imageData.height, c)
			}
		}
		Sounder.playSound("sfx_2");
		return state;
	}
}

// Function keys.

Artsy.actions.SDL_SCANCODE_RETURN = {
	name: "SDL_SCANCODE_RETURN",
	affectsCanvas: false,
	pressCode: 13, // 
	action: function(state) {
		Gallery.saveImageData(state.imageData);
		Sounder.playSound("sfx_1");
		return Artsy.actions.Gallery.action(state);
	}
}

Artsy.actions.Gallery = {
	name: "Gallery",
	affectsCanvas: false,
	pressCode: 220, // '\'
	action: function(state) {
		Gallery.displayGallery();
		state.keyStates = {};
		state.pressStates = {};
		state.mouseDown = {};
		state.touches = [];
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_1 = {
	name: "SDL_SCANCODE_1",
	affectsCanvas: false,
	pressCode: 49, // 
	emotion: new Emotion(49,0,0,0,0,0),
	action: function(state) {
		state.brushType = 1;
		Sounder.playSound("brush_1");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_2 = {
	name: "SDL_SCANCODE_2",
	affectsCanvas: false,
	pressCode: 50, // 
	emotion: new Emotion(50,0,0,0,0,0),
	action: function(state) {
		state.brushType = 2;
		Sounder.playSound("brush_2");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_3 = {
	name: "SDL_SCANCODE_3",
	affectsCanvas: false,
	pressCode: 51, // 
	emotion: new Emotion(51,0,0,0,0,0),
	action: function(state) {
		state.brushType = 3;
		Sounder.playSound("brush_3");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_4 = {
	name: "SDL_SCANCODE_4",
	affectsCanvas: false,
	pressCode: 52, // 
	emotion: new Emotion(52,0,0,0,0,0),
	action: function(state) {
		state.brushType = 4;
		Sounder.playSound("brush_4");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_5 = {
	name: "SDL_SCANCODE_5",
	affectsCanvas: false,
	pressCode: 53, // 
	emotion: new Emotion(53,0,0,0,0,0),
	action: function(state) {
		state.brushType = 5;
		Sounder.playSound("brush_5");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_6 = {
	name: "SDL_SCANCODE_6",
	affectsCanvas: false,
	pressCode: 54, // 
	emotion: new Emotion(54,0,0,0,0,0),
	action: function(state) {
		state.brushType = 6;
		Sounder.playSound("brush_6");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_7 = {
	name: "SDL_SCANCODE_7",
	affectsCanvas: false,
	pressCode: 55, // 
	emotion: new Emotion(55,0,0,0,0,0),
	action: function(state) {
		state.brushType = 7;
		Sounder.playSound("brush_7");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_8 = {
	name: "SDL_SCANCODE_8",
	affectsCanvas: false,
	pressCode: 56, // 
	emotion: new Emotion(56,0,0,0,0,0),
	action: function(state) {
		state.brushType = 8;
		Sounder.playSound("brush_8");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_9 = {
	name: "SDL_SCANCODE_9",
	affectsCanvas: false,
	pressCode: 57, // 
	emotion: new Emotion(57,0,0,0,0,0),
	action: function(state) {
		state.brushType = 9;
		Sounder.playSound("brush_9");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_0 = {
	name: "SDL_SCANCODE_0",
	affectsCanvas: false,
	pressCode: 48, // 
	emotion: new Emotion(48,0,0,0,0,0),
	action: function(state) {
		state.brushType = 0;
		Sounder.playSound("numkey_0");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_F1 = {
	name: "SDL_SCANCODE_F1",
	affectsCanvas: false,
	pressCode: 112, // 
	emotion: new Emotion(112,0,0,0,0,0),
	action: function(state) {
		state.brushSize = 1;
		Sounder.playSound("numkey_1");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_F2 = {
	name: "SDL_SCANCODE_F2",
	affectsCanvas: false,
	pressCode: 113, // 
	emotion: new Emotion(113,0,0,0,0,0),
	action: function(state) {
		state.brushSize = 2;
		Sounder.playSound("numkey_2");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_F3 = {
	name: "SDL_SCANCODE_F3",
	affectsCanvas: false,
	pressCode: 114, // 
	emotion: new Emotion(114,0,0,0,0,0),
	action: function(state) {
		state.brushSize = 4;
		Sounder.playSound("numkey_3");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_F4 = {
	name: "SDL_SCANCODE_F4",
	affectsCanvas: false,
	pressCode: 115, // 
	emotion: new Emotion(115,0,0,0,0,0),
	action: function(state) {
		state.brushSize = 8;
		Sounder.playSound("numkey_4");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_F5 = {
	name: "SDL_SCANCODE_F5",
	affectsCanvas: false,
	pressCode: 116, // 
	emotion: new Emotion(116,0,0,0,0,0),
	action: function(state) {
		state.brushSize = 16;
		Sounder.playSound("numkey_5");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_F6 = {
	name: "SDL_SCANCODE_F6",
	affectsCanvas: false,
	pressCode: 117, // 
	emotion: new Emotion(117,0,0,0,0,0),
	action: function(state) {
		state.brushSize = 24;
		Sounder.playSound("numkey_6");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_F7 = {
	name: "SDL_SCANCODE_F7",
	affectsCanvas: false,
	pressCode: 118, // 
	emotion: new Emotion(118,0,0,0,0,0),
	action: function(state) {
		state.brushSize = 32;
		Sounder.playSound("numkey_7");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_F8 = {
	name: "SDL_SCANCODE_F8",
	affectsCanvas: false,
	pressCode: 119, // 
	emotion: new Emotion(119,0,0,0,0,0),
	action: function(state) {
		state.brushSize = 48;
		Sounder.playSound("numkey_8");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_F9 = {
	name: "SDL_SCANCODE_F9",
	affectsCanvas: false,
	pressCode: 120, // 
	emotion: new Emotion(120,0,0,0,0,0),
	action: function(state) {
		state.brushSize = 56;
		Sounder.playSound("numkey_9");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_F10 = {
	name: "SDL_SCANCODE_F10",
	affectsCanvas: false,
	pressCode: 121, // 
	emotion: new Emotion(121,0,0,0,0,0),
	action: function(state) {
		state.brushSize = 64;
		Sounder.playSound("numkey_10");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_F11 = {
	name: "SDL_SCANCODE_F11",
	affectsCanvas: false,
	pressCode: 122, // 
	emotion: new Emotion(122,0,0,0,0,0),
	action: function(state) {
		state.brushSize = 96;
		Sounder.playSound("numkey_11");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_F12 = {
	name: "SDL_SCANCODE_F12",
	affectsCanvas: false,
	pressCode: 123, // 
	emotion: new Emotion(123,0,0,0,0,0),
	action: function(state) {
		state.brushSize = 128;
		Sounder.playSound("numkey_12");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_DELETE = {
	name: "SDL_SCANCODE_DELETE",
	affectsCanvas: true,
	pressCode: 8, // 
	action: function(state) {
		// Undo
		var saveState = state.saveState;
		if (saveState) {
			state.imageData = ImgFuncs.copyData(saveState.imageData);
		}
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_BACKSPACE = {
	name: "SDL_SCANCODE_BACKSPACE",
	affectsCanvas: true,
	pressCode: 46, // 
	action: function(state) {
		// Undo
		return Artsy.actions.SDL_SCANCODE_DELETE.action(state);
	}
}

Artsy.actions.SDL_SCANCODE_EQUALS = {
	name: "SDL_SCANCODE_EQUALS",
	affectsCanvas: true,
	pressCode: 187, // 
	action: function(state) {
		// Save snapshot.
		state.saveState = { imageData: ImgFuncs.copyData(state.imageData)}
		return state;
	}
}

/* Brushes */

Artsy.brushes = {}

Artsy.brushes.smoosh = {
	name: "Smoosh",
	number: 1,
	action: function(state) {
		for (var i=0; i<state.brushSize; ++i) { //which ring {
			for (var j=0; j<=i; ++j) { //within ring
				//do each of the four sides of the diamond
				var c1 = 0;
				var x = state.brushPoint.x-1-i+j;
				var y = state.brushPoint.y+j;
				// ImgFuncs.setColor32(state.imageData, x, y, c1);
				// ImgFuncs.getColor32(state.imageData, x - 1, y);
				if (j==0) {
					c1 = ImgFuncs.getColor32(state.imageData, x-1,y);
				}
				else if (j==i) {
					c1 = ImgFuncs.getColor32(state.imageData, x,y+1);
				}
				else
				{
					c1 = (ImgFuncs.getColor32(state.imageData, x-1,y) + ImgFuncs.getColor32(state.imageData, x,y+1))/2;
				}
				ImgFuncs.setColor32(state.imageData,x,y,c1);

				y = state.brushPoint.y+1+i-j;
				x = state.brushPoint.x+j;
				if (j==0) {
					c1 = ImgFuncs.getColor32(state.imageData, x+1,y);
				}
				else if (j==i) {
					c1 = ImgFuncs.getColor32(state.imageData, x,y+1);
				}
				else
				{
					c1 = (ImgFuncs.getColor32(state.imageData, x+1,y) + ImgFuncs.getColor32(state.imageData, x,y+1))/2;
				}
				ImgFuncs.setColor32(state.imageData,x,y,c1);

				x = state.brushPoint.x+1+i-j;
				y = state.brushPoint.y-j;
				if (j==0) {
					c1 = ImgFuncs.getColor32(state.imageData, x+1,y);
				}
				else if (j==i) {
					c1 = ImgFuncs.getColor32(state.imageData, x,y-1);
				}
				else
				{
					c1 = (ImgFuncs.getColor32(state.imageData, x+1,y) + ImgFuncs.getColor32(state.imageData, x,y-1))/2;
				}
				ImgFuncs.setColor32(state.imageData,x,y,c1);

				y = state.brushPoint.y-1-i+j;
				x = state.brushPoint.x-j;
				if (j==0) {
					c1 = ImgFuncs.getColor32(state.imageData, x-1,y);
				}
				else if (j==i) {
					c1 = ImgFuncs.getColor32(state.imageData, x,y-1);
				}
				else
				{
					c1 = (ImgFuncs.getColor32(state.imageData, x-1,y) + ImgFuncs.getColor32(state.imageData, x,y-1))/2;
				}
				ImgFuncs.setColor32(state.imageData,x,y,c1);
			}
		}
		return state;
	}
}

Artsy.brushes.col = {
	name: "col",
	number: 2,
	action: function(state) {
		var x = state.brushPoint.x;
		var y = state.brushPoint.y;
		for (var j=-3; j<=+3; ++j)
		{
			var s = 1+state.brushSize/2;
			var c0 = ImgFuncs.getColor32(state.imageData,x+j,y-s);
			for (var i=y-s; i<y+s; ++i)
			{
				var c = ImgFuncs.getColor32(state.imageData,x+j,i+1);
				ImgFuncs.setColor32(state.imageData,x+j,i,c);
			}
			ImgFuncs.setColor32(state.imageData,x+j,i,c0);
		}
		return state;
	}
}

Artsy.brushes.lightning = {
	name: "lightning",
	number: 3,
	action: function(state) {
		var x = state.brushPoint.x;
		var y = state.brushPoint.y;
		var rgb = ImgFuncs.getColorArr(state.imageData,x,y);
		for (var i = 0; i < 3; ++i) {
			if (rgb[i]<0x5f) {
				rgb[i] += 2;
			}
		}
		ImgFuncs.setColorArr(state.imageData,x,y,rgb);
		
		var visited = {};


		for (var i = 0; i < state.brushSize * 4; ++i) {
			x = state.brushPoint.x;
			y = state.brushPoint.y;
			for (var j = 0; j < state.brushSize * 4 + 16; ++j) {
				var nx = x;
				var ny = y;
				switch(Math.floor(Math.random() * 4) % 4)
		 		{
					case 0:	--nx; break;
					case 1: --ny; break;
					case 2: ++nx; break;
					case 3: ++ny; break;
				}

				if (visited[ny + ny * state.imageData.width]) {
					continue;
				}
				visited[nx + ny * state.imageData.width] = true;

				var rgb2 = ImgFuncs.getColorArr(state.imageData, nx, ny)
				var d = 0;
				for (var k = 0; k < 3; ++k) {
					d += Math.abs(rgb[k] - rgb2[k]);
				}
				if (d>128+rgb[0]/2+rgb[1]/2+rgb[2]/2) {
					continue;
				}
				x = nx;
				y = ny;
				for (var k = 0; k < 3; ++k) {
					rgb2[k] = Math.floor((rgb[k]+rgb2[k])/2);
				}

				visited[x + y * state.imageData.width] = true;
				ImgFuncs.setColorArr(state.imageData, x, y, rgb2);
			}

			switch(Math.floor(Math.random() * 4) % 4)
	 		{
				case 0:	--x; break;
				case 1: --y; break;
				case 2: ++x; break;
				case 3: ++y; break;
			}
			var rgb2 = ImgFuncs.getColorArr(state.imageData, x, y);
			var d = 0;
			for (var k = 0; k < 3; ++k) {
				d += Math.abs(rgb2[k] - rgb[k]);
			}
			if(d > 4) {
				ImgFuncs.setColorArr(state.imageData, x, y, new Array( Math.min(rgb2[0] + 1, 0xff),  Math.min(rgb2[1] + 1, 0xff), Math.min(rgb2[2] + 1, 0xff)))
			}
			else {
				ImgFuncs.setColorArr(state.imageData, x, y, rgb);
			}
		}
		return state;
	}
}

Artsy.brushes.square_lightning = {
	name: "square_lightning",
	number: 4,
	action: function(state) {
		var x = state.brushPoint.x;
		var y = state.brushPoint.y;
		var rgb = ImgFuncs.getColorArr(state.imageData,x,y);
		for (var i = 0; i < 3; ++i) {
			if (rgb[i]<0x5f) {
				rgb[i] += 2;
			}
		}
		ImgFuncs.setColorArr(state.imageData,x,y,rgb);
		
		var visited = {};

		for (var i = 0; i < state.brushSize; ++i) {
			x = state.brushPoint.x;
			y = state.brushPoint.y;
			for (var j = 0; j < state.brushSize * 4 + 16; ++j) {
				var nx = x;
				var ny = y;
				switch(Math.floor(Math.random() * 4) % 4)
		 		{
					case 0:	--nx; break;
					case 1: --ny; break;
					case 2: ++nx; break;
					case 3: ++ny; break;
				}

				if (visited[ny + ny * state.imageData.width]) {
					continue;
				}
				visited[nx + ny * state.imageData.width] = true;

				var rgb2 = ImgFuncs.getColorArr(state.imageData, nx, ny)
				var d = 0;
				for (var k = 0; k < 3; ++k) {
					d += Math.abs(rgb[k] - rgb2[k]);
				}
				if (d>128+rgb[0]/2+rgb[1]/2+rgb[2]/2) {
					continue;
				}
				x = nx;
				y = ny;
			}
			switch(Math.floor(Math.random() * 4) % 4)
	 		{
				case 0:	--x; break;
				case 1: --y; break;
				case 2: ++x; break;
				case 3: ++y; break;
			}
			var mi = Math.min(x, state.brushPoint.x);
			var ma = Math.max(x, state.brushPoint.x);
			var miy = Math.min(y, state.brushPoint.y);
			var may = Math.max(y, state.brushPoint.y);

		    for(var x=mi;x<ma;++x) {
		        for(var y=miy;y<may;++y) {
		        	var rgb3 = ImgFuncs.getColorArr(state.imageData, x, y);
		        	for (var k = 0; k < 3; ++k) {
						rgb3[k] = ~~((rgb[k]+rgb3[k])/2);
					}
					ImgFuncs.setColorArr(state.imageData, x, y, rgb3);
		        }
		    }

		}
		return state;
	}
}

Artsy.brushes.dichotomy = {
	name: "dichotomy",
	number: 5,
	action: function(state) {

		var x = state.brushPoint.x;
		var y = state.brushPoint.y;

		var rgb2 = new Array(255,255,255);
		var rgb3 = new Array(0,0,0);

		var s = 1+state.brushSize/2;
		for (var i=-s; i<=+s; ++i) {
			for (var j=-s; j<=+s; ++j) {
				var rgb1 = ImgFuncs.getColorArr(state.imageData,x+i,y+j);
				if (rgb1[0]+rgb1[1]+rgb1[2]<rgb2[0]+rgb2[1]+rgb2[2])
				{
					rgb2[0] = rgb1[0];
					rgb2[1] = rgb1[1];
					rgb2[2] = rgb1[2];
				}
				if (rgb1[0]+rgb1[1]+rgb1[2]>rgb3[0]+rgb3[1]+rgb3[2])
				{
					rgb3[0] = rgb1[0];
					rgb3[1] = rgb1[1];
					rgb3[2] = rgb1[2];
				}
			}
		}
		for (var i=-s; i<=+s; ++i) {
			for (var j=-s; j<=+s; ++j) {
				var rgb1 = ImgFuncs.getColorArr(state.imageData,x+i,y+j);
				for (var k=0; k<3; ++k)
				{
					if ((rgb1[0]+rgb1[1]+rgb1[2])-(rgb2[0]+rgb2[1]+rgb2[2])<(rgb3[0]+rgb3[1]+rgb3[2])-(rgb1[0]+rgb1[1]+rgb1[2]))
					{
						if (rgb1[k]>rgb2[k]) {--rgb1[k]; }
					} else {
						if (rgb1[k]<rgb3[k]) { ++rgb1[k]; }
					}
				}
				ImgFuncs.setColorArr(state.imageData,x+i,y+j,rgb1);
			}
		}
		return state;
	}
}

Artsy.brushes.weird_lightning = {
	name: "weird_lightning",
	number: 6,
	action: function(state) {
		var x = state.brushPoint.x;
		var y = state.brushPoint.y;
		var rgb = ImgFuncs.getColorArr(state.imageData,x,y);
		for (var i = 0; i < 3; ++i) {
			if (rgb[i]<0x5f) {
				rgb[i] += 2;
			}
		}
		ImgFuncs.setColorArr(state.imageData,x,y,rgb);
		
		var visited = {};

		for (var i = 0; i < state.brushSize; ++i) {
			x = state.brushPoint.x;
			y = state.brushPoint.y;
			for (var j = 0; j < state.brushSize; ++j) {
				var nx = x;
				var ny = y;
				switch(Math.floor(Math.random() * 4) % 4)
		 		{
					case 0:	--nx; break;
					case 1: --ny; break;
					case 2: ++nx; break;
					case 3: ++ny; break;
				}

				if (visited[ny + ny * state.imageData.width]) {
					continue;
				}
				visited[nx + ny * state.imageData.width] = true;

				var rgb2 = ImgFuncs.getColorArr(state.imageData, nx, ny)
				var d = 0;
				for (var k = 0; k < 3; ++k) {
					d += Math.abs(rgb2[k] - rgb[k]);
				}
				if (d<32) {
					continue;
				}
				x = nx;
				y = ny;
				for (var k = 0; k < 3; ++k) {
					rgb2[k] += ~~((rgb2[k]-rgb[k])/8)
				}

				visited[x + y * state.imageData.width] = true;
				ImgFuncs.setColorArr(state.imageData, x, y, rgb2);
			}

			switch(Math.floor(Math.random() * 4) % 4)
	 		{
				case 0:	--x; break;
				case 1: --y; break;
				case 2: ++x; break;
				case 3: ++y; break;
			}
			var rgb2 = ImgFuncs.getColorArr(state.imageData, x, y);
			for (var k = 0; k < 3; ++k) {
				rgb2[k] = rgb[k] - rgb2[k];
			}
			ImgFuncs.setColorArr(state.imageData, x, y, rgb2);
		}
		return state;
	}
}

Artsy.brushes.control = {
	name: "control",
	number: 7,
	action: function(state) {
		var x = state.brushPoint.x;
		var y = state.brushPoint.y;
		var s = 1 + state.brushSize / 2;
		for (var i = -s; i <= +s; ++i) {
			for (var j = -s; j <= +s; ++j) {
				if (!(i==s || i==-s || j==s || j==-s)) {
					continue; 
				}
				var rgb1 = ImgFuncs.getColorArr(state.imageData,x+i,y+j);
				var rgb2 = ImgFuncs.getColorArr(state.imageData,x+i+1,y+j);
				var rgb3 = ImgFuncs.getColorArr(state.imageData,x+i-1,y+j);
				var rgb4 = ImgFuncs.getColorArr(state.imageData,x+i,y+j+1);
				var rgb5 = ImgFuncs.getColorArr(state.imageData,x+i,y+j+1);
				for (var k = 0; k < 3; ++k) {
					rgb1[k] = rgb2[k] ^ rgb3[k] ^ rgb4[k] ^ rgb5[k]
				}
				ImgFuncs.setColorArr(state.imageData,x+i,y+j, rgb1);
			}
		}
		return state;
	}
}

Artsy.brushes.untitled = {
	name: "untitled",
	number: 8,
	action: function(state) {
		var x = state.brushPoint.x;
		var y = state.brushPoint.y;
		var s = 1 + state.brushSize;
		var j = x;
		var k = y;
		var j_s = 1;
		var c1 = ImgFuncs.getColor32(state.imageData,j,k);
		for (var i = 0; i <=(s+1)*(s+1); ++i) {
			j += j_s;
			if (j>=x+s/2 || j<x-s/2)
			{
				j_s*=-1;
				++k;
				if (k>=y+s/2) {
					k = y-s/2;
				}
			}
			var c2 = ImgFuncs.getColor32(state.imageData,j,k);
			ImgFuncs.setColor32(state.imageData,j,k,c1);
			c1=c2;
		}
		return state;
	}
}

Artsy.brushes.dark_lightning = {
	name: "dark_lightning",
	number: 9,
	action: function(state) {
		var x = state.brushPoint.x;
		var y = state.brushPoint.y;
		var rgb = ImgFuncs.getColorArr(state.imageData,x,y);
		for (var i = 0; i < 3; ++i) {
			if (rgb[i]>0) {
				rgb[i] --;
			}
		}
		ImgFuncs.setColorArr(state.imageData,x,y,rgb);
		
		var visited = {};

		for (var i = 0; i < state.brushSize * 2; ++i) {
			x = state.brushPoint.x;
			y = state.brushPoint.y;
			for (var j = 0; j < state.brushSize * 4 + 16; ++j) {
				var nx = x;
				var ny = y;
				switch(Math.floor(Math.random() * 4) % 4)
		 		{
					case 0:	--nx; break;
					case 1: --ny; break;
					case 2: ++nx; break;
					case 3: ++ny; break;
				}

				if (visited[ny + ny * state.imageData.width]) {
					continue;
				}
				visited[nx + ny * state.imageData.width] = true;

				var rgb2 = ImgFuncs.getColorArr(state.imageData, nx, ny)
				var d = 0;
				for (var k = 0; k < 3; ++k) {
					d += Math.abs(rgb2[k] - rgb[k]);
				}
				if (d>128+rgb[0]/2+rgb[1]/2+rgb[2]/2) {
					continue;
				}
				x = nx;
				y = ny;
			}

			switch(Math.floor(Math.random() * 4) % 4)
	 		{
				case 0:	--x; break;
				case 1: --y; break;
				case 2: ++x; break;
				case 3: ++y; break;
			}
			var rgb2 = ImgFuncs.getColorArr(state.imageData, x, y);
			var d = 0;
			for (var k = 0; k < 3; ++k) {
				d += Math.abs(rgb2[k] - rgb[k]);
			}
			if(d < 4) {
				for (var k = 0; k < 3; ++k) {
					if (rgb2[k]>0) {
						rgb2[k] --;
					}
				}
				ImgFuncs.setColorArr(state.imageData, x, y, rgb2)
			}
			else {
				var rgb3 = new Array((rgb2[0]+rgb[0])/2, (rgb2[1]+rgb[1])/2, (rgb2[2]+rgb[2])/2)
				ImgFuncs.setColorArr(state.imageData, x, y, rgb3);
			}
		}
		return state;
	}
}

var Sounder = {};

Sounder.playSound = function(soundName) {
	// Todo: add sound support.
}

/* functions */

function uint32(x) {
	return x >>> 0
}

function underflowMod(x, max) {
	return ((x % max) + max) % max
}

function getByteOffset(x,y,width,height) {
	return ((((~~x % width) + width) % width) + (width * (((~~y % height) + height) % height))) * 4;
}

/* Image functions */

var ImgFuncs = {}

ImgFuncs.littleEndian = ((new Uint32Array((new Uint8Array([1, 2, 3, 4])).buffer))[0] === 0x04030201)

if(ImgFuncs.littleEndian == true) {
	ImgFuncs.fixEndian = function(number) {
		return ((number >> 24) & 0xff) | // move byte 3 to byte 0
			((number << 8) & 0xff0000) | // move byte 1 to byte 2
			((number >> 8) & 0xff00) | // move byte 2 to byte 1
			((number << 24) & 0xff000000); // byte 0 to byte 3
	}
}
else {
	ImgFuncs.fixEndian = function(number) {
		return number;
	}
}

// Gets a u32 for an x,y coord.
ImgFuncs.getColor32 = function(imageData, x, y) {
	if (imageData.x128) {
		return ImgFuncs.fixEndian(imageData.u32[((~~(x + 128) & 127) + (128 * (~~(y + 128) & 127)))]);
	}
	var width = imageData.width;
	var height = imageData.height;
	var byteOffset = ((~~(x + width) % width) + (width * (~~(y + height) % height)));
	return ImgFuncs.fixEndian(imageData.u32[byteOffset]);
}

// Sets a u32 for an x,y coord.
ImgFuncs.setColor32 = function(imageData, x, y, color) {
	if (imageData.x128) {
		imageData.u32[((~~(x + 128) & 127) + (128 * (~~(y + 128) & 127)))] = ImgFuncs.fixEndian(((color & 0xffffff00) | 0xff));
		return
	}
	var width = imageData.width;
	var height = imageData.height;
	var byteOffset = ((~~(x + width) % width) + (width * (~~(y + height) % height)));
	imageData.u32[byteOffset] = ImgFuncs.fixEndian(((color & 0xffffff00) | 0xff));
}

ImgFuncs.addBufferToImageData = function(imageData) {
	var u32 = imageData.u32;
	if(!u32) {
		u32 = new Uint32Array(imageData.data.buffer);
		imageData.u32 = u32;
		if (imageData.width == 128 && imageData.height == 128) {
			imageData.x128 = true;
		}
	}

	var u8 = imageData.u8;
	if(!u8) {
		u8 = new Uint8ClampedArray(imageData.data.buffer);
		imageData.u8 = u8;
	}
}

// Gets a 3 item array for an x,y coord.
ImgFuncs.getColorArr = function(imageData, x, y) {
	var color = ImgFuncs.getColor32(imageData,x,y);
	return [(color >> 24) & 0xff, (color >> (16)) & 0xff, (color >> (8)) & 0xff];
}

// Gets a 3 item array for an x,y coord.
ImgFuncs.setColorArr = function(imageData, x, y, color) {
	ImgFuncs.setColor32(imageData,x,y, (((color[0] & 0xff) << 24) | 
              ((color[1] & 0xff) << 16) | 
              ((color[2] & 0xff) << 8) | 
              (0xff)))
}

// Gets a channel value for an x,y coord.
ImgFuncs.getColorC = function(imageData, x, y, c) {
	if (imageData.x128) {
		return imageData.u8[(((~~(x + 128) & 127) + (128 * (~~(y + 128) & 127))) * 4) + c];
	}
	var width = imageData.width;
	var height = imageData.height;
	var byteOffset = ((~~(x + width) % width) + (width * (~~(y + height) % height))) * 4;
	return imageData.u8[byteOffset + c];
}

// Sets a channel value for an x,y coord.
ImgFuncs.setColorC = function(imageData, x, y,c, color) {
	if (imageData.x128) {
		imageData.u8[(((~~(x + 128) & 127) + (128 * (~~(y + 128) & 127))) * 4) + c] = ((~~color % 256) + 256) % 256;
		return
	}
	var width = imageData.width;
	var height = imageData.height;
	var byteOffset = ((~~(x + width) % width) + (width * (~~(y + height) % height))) * 4;
	imageData.u8[byteOffset + c] = ((~~color % 256) + 256) % 256;
}

// Converts a 3 item array to a uint32.
ImgFuncs.arrTo32 = function(arr) {
	var arr2 = arr.slice()
	arr2.push(255)
	for (var i = 0; i < arr2.length; ++i) {
		arr2[i] = (~~arr2[i]) % 256
	}
	if (ImgFuncs.littleEndian == true) {
		return uint32((arr2[3]) | 
              (arr2[2] << 8) | 
              (arr2[1] << 16) | 
              (arr2[0] << 24))
	}
	return uint32((arr2[0]) | 
              (arr2[1] << 8) | 
              (arr2[2] << 16) | 
              (arr2[3] << 24))
}

// Converts an rgb array to hsv.
ImgFuncs.RGBToHSV = function(arr) {
    var r = arr[0]
    var g = arr[1];
    var b = arr[2];

    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return Array(h,s,v);
};

// Converts an hsv array to rgb.
ImgFuncs.HSVToRGB = function(arr) {
    var h = arr[0];
    var s = arr[1];
    var v = arr[2];
    var r, g, b, i, f, p, q, t;
    i = ~~(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return Array(r * 255,g * 255,b * 255);
};

// Finds edges in a channel and colors them.
ImgFuncs.findEdges = function(surface, channel, level, colorArr) {
	for (var x = 0; x < surface.width; ++x) {
		for (var y = 0; y < surface.height; ++y) {
			var n = 0;
			var rgb1 = ImgFuncs.getColorArr(surface, x, y);
			if (x>0)
			{
				var rgb2 = ImgFuncs.getColorArr(surface,x-1,y);
				if (rgb1[channel]>=level && rgb2[channel]<level) ++n;
			}
			if (y>0)
			{
				var rgb2 = ImgFuncs.getColorArr(surface,x,y-1);
				if (rgb1[channel]>=level && rgb2[channel]<level) ++n;
			}
			if (x<surface.width-1)
			{
				var rgb2 = ImgFuncs.getColorArr(surface,x+1,y);
				if (rgb1[channel]>=level && rgb2[channel]<level) ++n;
			}
			if (y<surface.height-1)
			{
				var rgb2 = ImgFuncs.getColorArr(surface,x,y+1);
				if (rgb1[channel]>=level && rgb2[channel]<level) ++n;
			}
			if (n>0) ImgFuncs.setColorArr(surface,x,y,colorArr);
		}
	}
	return surface
}

ImgFuncs.skewx = function(surface, fx, fy, fw, fh, by) {
	for (var y = 0; y < fh; ++y) {
		var ny = underflowMod(fy+y, surface.height);
		var line = new Array();
		for (var x = 0; x < fw; ++x) {
			line.push(ImgFuncs.getColorArr(surface, underflowMod(fx+x, surface.width), ny));
		}
		for (var x = 0; x < fw; ++x) {
			var c1 = line[x];
			var off = (x + by)%fw;
			if (off < 0) { 
				off = off + fw;
			}
			ImgFuncs.setColorArr(surface, underflowMod(off,surface.width), ny, c1);
		}
	}
}

ImgFuncs.skewy = function(surface, fx, fy, fw, fh, by) {
	for (var x = 0; x < fw; ++x) {
		var nx = underflowMod(fx+x, surface.width);
		var line = new Array();
		for (var y = 0; y < fh; ++y) {
			line.push(ImgFuncs.getColorArr(surface, nx, underflowMod(fy+y, surface.height)));
		}
		for (var y = 0; y < fh; ++y) {
			var c1 = line[y];
			var off = (y + by)%fh;
			if (off < 0) { 
				off = off + fh;
			}
			ImgFuncs.setColorArr(surface, nx, underflowMod(off,surface.height), c1);
		}
	}
}

ImgFuncs.skewx_channel = function(surface, fx, fy, fw, fh, by, channel) {
	for (var y = 0; y < fh; ++y) {
		var ny = underflowMod(fy+y, surface.height);
		var line = [];
		for (var x = 0; x < fw; ++x) {
			line.push(ImgFuncs.getColorC(surface, fx+x, ny, channel));
		}
		for (var x = 0; x < fw; ++x) {
			var channelValue = line[x];
			var off = (x + by)%fw;
			if (off < 0) { 
				off = off + fw;
			}
			ImgFuncs.setColorC(surface, off, ny, channel, channelValue);
		}
	}
}

// Returns the lesser elements of each channel between two arrays.
ImgFuncs.lesser = function(a, b) {
	return [Math.min(a[0],b[0]),  Math.min(a[1],b[1]), Math.min(a[2],b[2])];
}

// Returns the greater elements of each channel between two arrays.
ImgFuncs.greater = function(a, b) {
	return [Math.max(a[0],b[0]),  Math.max(a[1],b[1]), Math.max(a[2],b[2])];
}

ImgFuncs.swap = function(a,b){ return {a: a, b: b} }
ImgFuncs.unswap = function(a,b){ return {a: b, b: a} }

// Returns a dataURL for an imageData object.
ImgFuncs.toDataURL = function(imageData) {
	var canvas = document.createElement("canvas");
	canvas.width = imageData.width;
	canvas.height = imageData.height;
	var ctx = canvas.getContext('2d');
	ctx.putImageData(imageData, 0, 0);
	return canvas.toDataURL();
}

// Nearest neighbor scale for an imageData.
ImgFuncs.scaleImageData = function(imgDat1, scale) {
    var imgDat2 = new ImageData(imgDat1.width * scale, imgDat1.height * scale);
    var pix1= new Uint32Array( imgDat1.data.buffer );
    var pix2= new Uint32Array( imgDat2.data.buffer );
    var canvasWidth1 = imgDat1.width;
    var canvasWidth2 = imgDat2.width;
    for(var x=0;x<imgDat1.width;++x) {
        for(var y=0;y<imgDat1.height;++y) {
        	var idx = y * imgDat1.width + x;
        	for (var i = 0; i < scale; ++i) {
        		for (var j = 0; j < scale; ++j) {
	        		pix2[(((y * scale) + j) * imgDat2.width) + (x * scale) + i] = pix1[idx];
	        	}
        	}
        }
    }
    ImgFuncs.addBufferToImageData(imgDat2);
    return imgDat2
}

ImgFuncs.loadImage = function(url, callBack) {
	var img = new Image();
	img.onload = function() {
		callBack(img);
	}
	img.src = url;
}

ImgFuncs.fromImage = function(img) {
	var w = img.width;
	var h = img.height;
	var canvas = Artsy.createCanvas(w, h);
	var ctx = canvas.getContext('2d');
	ctx.drawImage(img,0,0);
	var data = ctx.getImageData(0, 0, w, h);
	return data;
}

ImgFuncs.fromDataURL = function(dataURL) {
	var img = new Image();
	img.src = dataURL;
	return ImgFuncs.fromImage(img);
}

ImgFuncs.flipline = function (surface,x,y) {
	var c = ImgFuncs.getColor32(surface,x,y);
	var d = Math.sqrt((x-y)*(x-y)*2);
	var x1 = y-x;
	var y1 = x-y;
	var l = Math.sqrt(x1*x1 + y1*y1);
	if (l<0.001) {
		l = 0.001;
	}
	x1 /= l;
	y1 /= l;
	for (var f = 0; f<d; f+=1.0, x+=x1, y+=y1)
	{
		ImgFuncs.setColor32(surface,~~(x),~~(y),c);
	}
}

// Returns a copy of an image data object.
ImgFuncs.copyData = function(imageData) {
	var dataCopy = new Uint8ClampedArray(imageData.data);
	var copy = new ImageData(imageData.width, imageData.height);
	copy.data.set(dataCopy);
	ImgFuncs.addBufferToImageData(copy);
	return copy;
}

// No fucking clue.
ImgFuncs.InPlacePyramid = function(to, from, filter) {
	var size = to.width;

	function cget(fx,fy,channel) {
		var point = filter(size,fx,fy);
		return ImgFuncs.getColorArr(from,point.x,point.y)[channel];
	}

	function cset(fx,fy,nx,ny,channel,color) {
		var dx = fx*3+nx;
		var dy = fy*3+ny;
		dx = Math.max(Math.min(size,dx),0);
		dy = Math.max(Math.min(size,dy),0);
		var ch = ImgFuncs.getColorArr(to,dx,dy)
		ch[channel] = ~~color;
		ImgFuncs.setColorArr(to,dx,dy,ch);
	}
	var count = 0;

	var coord = new Array({x:2,y:2}, {x:1,y:2}, {x:3,y: 2}, {x:2,y: 1}, {x:2,y:3}, {x:1,y:1}, {x:1,y:3}, {x:3,y: 1}, {x:3,y:3});
	var max = Math.ceil(size/3)+1;
	for(var x=0;x<max;++x) {
        for(var y=0;y<max;++y) {
        	for (var c = 0; c < 3; ++c) {
				var get = cget(x,y,c);
				var left = cget(x-1,y,c);
				var right = cget(x+1,y,c);
				var up = cget(x,y-1,c);
				var down = cget(x,y+1,c);

				var newup = (up + get)/2;
				var newdown = (down + get)/2;
				var newleft = (left + get)/2;
				var newright = (right + get)/2;

				var tab = new Array(get, newleft, newright, newup, newdown, (newup+newleft)/2, (newdown+newleft)/2, (newup+newright)/2, (newdown+newright)/2);
				for (var i = 0; i < tab.length; ++i) {
					var tc = coord[i];
					cset(x,y,tc.x,tc.y,c,tab[i]);
				}
        	}
        }
    }
}

ImgFuncs.fontData = null;
ImgFuncs.font = new Image()
ImgFuncs.font.onload = function() {
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	var img = ImgFuncs.font
	canvas.width = img.width;
	canvas.height = img.height;
	context.drawImage(img, 0, 0 );
	ImgFuncs.fontData = context.getImageData(0, 0, img.width, img.height);
	ImgFuncs.addBufferToImageData(ImgFuncs.fontData);
}
ImgFuncs.font.src = "font8x8.png";

ImgFuncs.boardData = null;
ImgFuncs.board = new Image()
ImgFuncs.board.onload = function() {
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	var img = ImgFuncs.board
	canvas.width = img.width;
	canvas.height = img.height;
	context.drawImage(img, 0, 0 );
	ImgFuncs.boardData = context.getImageData(0, 0, img.width, img.height);
}
ImgFuncs.board.src = "board.png";

ImgFuncs.textify = function(imageData) {
	var fontData = ImgFuncs.fontData;
	if(!fontData) {
		return;
	}
	var toVisit = {};

	var any = 0;
	var fontSize = 8;
    for(var x=0;x<imageData.width;++x) {
        for(var y=0;y<imageData.height;++y) {
        	var rgb = ImgFuncs.getColorArr(imageData,x,y);
        	if (rgb[0]+rgb[1]+rgb[2]>224+224+224) {
        		toVisit[x + y * imageData.width] = true;
        		ImgFuncs.setColor32(imageData,x,y,0);
        		any = 1;
        	}
        }
    }
    if(any == 0) {
    	return;
    }
    for(var x=0;x<imageData.width;++x) {
        for(var y=0;y<imageData.height;++y) {
        	if(toVisit[x + y * imageData.width]) {
        		var fx = fontSize * ~~(Math.random() * fontData.width / fontSize);
        		var fy = fontSize * ~~(Math.random() * fontData.height / fontSize);
			    for(var i=0;i<fontSize;++i) {
			        for(var j=0;j<fontSize;++j) {
			        	ImgFuncs.setColor32(imageData,x+i,y+j,ImgFuncs.getColor32(fontData,fx+i,fy+j));
			        	toVisit[(x+i) + (y+j) * imageData.width] = false;
			        }
			    }
        	}
        }
    }
}

ImgFuncs.similar = function(imgDat1, imgDat2) {
	var total = 0;
	var length = imgDat1.width * imgDat1.height;
	for (var i = 0; i < length; i++) {
		var a = imgDat1.u8[i * 4] + imgDat1.u8[i * 4 + 1] + imgDat1.u8[i * 4 + 2];
		var b = imgDat2.u8[i * 4] + imgDat2.u8[i * 4 + 1] + imgDat2.u8[i * 4 + 2];
		var weight = (a / 3) - (b / 3);
		total += weight < 0 ? -weight : weight;
	}
	return total;
}

/* Auto Artist */

Artsy.state.fran = true;
Artsy.state.franMoves = new Array();
Artsy.state.franEmotion = new Emotion(0,0,0,0,0,0);

// Run the auto-artist.
Artsy.franIt = function(state) {
	if (state.fran == false) {
		state.similar = null;
		state.similarImg = null;
		return state;
	}

	var first = false;

	if (state.franMoves.length <= 0) {
		first = true;
		var actions = Artsy.allActions.filter(function(a) { return a["emotion"] != undefined });
		var move = {};
		if (state.similar == null) {
			var emotions = new Array()
			var maxWeight = 0;
			for (var i = 0; i < actions.length; ++i) {
				var action = actions[i];
				if (action["emotion"]) {
					var emotion = action["emotion"];
					emotion.weight = state.franEmotion.compare(emotion);
					emotions.push(emotion);
				}
			}

			emotions.sort(function (a, b) {
				return b.weight - a.weight;
			});

			var max = emotions[0].weight;

			emotions = emotions.filter( function(e) { return Math.abs(e.weight - max) < 5 });

			var weights = new Array();

			for (var i = 0; i < emotions.length; i++) {
				var numa = emotions.length - i
				numa *= numa;
				for (var j = 0; j < numa; j++) {
					weights.push(i);
				}
			}

			var num = Math.floor(Math.random() * 10) + 1;
			var maxLen = 15;
			var len = Math.floor(Math.random() * maxLen) + 1;

			for (var i = 0; i < num; ++i) {
				var key = weights[Math.floor(Math.random()*weights.length)]
				var valid = emotions[key];
				if ((valid) && (!move[valid.keycode])) {
					move[valid.keycode] = true;
					state.franEmotion.addm(valid, 1 + len / maxLen);
				}
			}

			if (Object.keys(move).length > 0) {
				for (var i = 0; i < len; ++i) {
					state.franMoves.push(move);
				}
			}
		}
		else {
			var nonActions = actions.filter(function(a) { return a.affectsCanvas == false });
			var affectActions = actions.filter(function(a) { return a.affectsCanvas == true });

			var emotions = new Array()
			if (state.ticks % 8 == 0) {

				for (var i = 0; i < nonActions.length; i++) {
					emotions.push(nonActions[i]["emotion"]);
				}

				var num = Math.floor(Math.random() * 2) + 1;
					for (var i = 0; i < num; ++i) {
					var valid = emotions[Math.floor(Math.random()*emotions.length)]
					if ((valid) && (!move[valid.keycode])) {
						move[valid.keycode] = true;
					}
				}

			}
			else {
				var baseImg = ImgFuncs.copyData(state.imageData);
				var similar = ImgFuncs.copyData(state.similar);
				ImgFuncs.addBufferToImageData(baseImg);
				ImgFuncs.addBufferToImageData(similar);
				state.imageData = null;
				state.similar = null;
				var baser = JSON.stringify(state);
				
				for (var i = 0; i < affectActions.length; i++) {
					var baseState = JSON.parse(baser);
					var action = affectActions[i];
					var emotion = action["emotion"];
					baseState.imageData = ImgFuncs.copyData(baseImg);
					ImgFuncs.addBufferToImageData(baseState.imageData);
					baseState = action.action(baseState);
					emotion.weight = ImgFuncs.similar(similar, baseState.imageData);
					emotions.push(emotion);

				}

				emotions.sort(function (a, b) {
					return a.weight - b.weight;
				});

				var max = emotions[0].weight;

				emotions = emotions.filter( function(e) { return Math.abs(e.weight - max) < 256 });

				var num = Math.floor(Math.random() * 2) + 1;
					for (var i = 0; i < num; ++i) {
					var valid = emotions[Math.floor(Math.random()*emotions.length)]
					if ((valid) && (!move[valid.keycode])) {
						move[valid.keycode] = true;
					}
				}

				state.imageData = baseImg;
				state.similar = similar;

			}
			state.franMoves.push(move);
		}
	}

	var move = state.franMoves.shift();
	if (move) {
		state.keyStates = {};
		state.pressStates = {};
		state.keyStates = move;
		if(first == true) {
			state.pressStates = move;
		}

		var keys = Object.keys(move);
		var actions = Artsy.allActions;
		var hasKeys = false;
		for (var i = 0; i < actions.length; ++i) {
			if(actions[i]["keycode"] > 0 && move[actions[i]["keycode"]] == true) {
				hasKeys = true;
				break;
			}
		}
		if (hasKeys == false) {
			state.franMoves = [];
		}

	}

	return state
}
