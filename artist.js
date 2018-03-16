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
	?	Sound.
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
	this.state = new Array(joy, fear, disgust, anger, sadness);

	// How weighted an emotion is how much it gets some of the state towards zero,
	// disregarding parts of the state that move away from zero.
	this.compare = function(otherEmotion) {
		var weight = 0;
		for (let i = 0; i < this.state.length; ++i) {
			var x = this.state[i] + otherEmotion.state[i];
			var diff = Math.abs(this.state[i]) - Math.abs(x);
			if (diff > 0) {
				weight += diff;
			}
		}
		return weight;
	}

	this.add = function(otherEmotion) {
		for (let i = 0; i < this.state.length; ++i) {
			this.state[i] += otherEmotion.state[i];
		}
	}

	this.addm = function(otherEmotion, mul) {
		for (let i = 0; i < this.state.length; ++i) {
			this.state[i] += otherEmotion.state[i] * mul;
		}
	}
}

function Player(id, color) {
	this.id = id;
	this.isActive = true;
	this.keyStates = {};
	this.pressStates = {};
	this.brushPoint = {
		x: 50,
		y: 50
	};
	this.brushType = 0;
	this.brushSize = 1;
	this.color = color;

	this.writeState = function(state) {
		state.keyStates = this.keyStates;
		state.pressStates = this.pressStates;
		state.brushPoint = this.brushPoint;
		state.brushType = this.brushType;
		state.brushSize = this.brushSize;
	}

	this.readState = function(state) {
		this.keyStates = state.keyStates;
		this.pressStates = state.pressStates;
		this.brushPoint = state.brushPoint;
		this.brushType = state.brushType;
		this.brushSize = state.brushSize;
	}
}

var Players = {
	gamepads: new Array()
};

Players.keyboard = new Player("keyboard", "rgba(255,255,0,0.5)");

Players.autoArtist = new Player("autoArtist", "rgba(255,0,255,0.5)");

Players.midi = new Player("midi", "rgba(0,255,255,0.5)");
Players.midi.isActive = false;

Players.all = function() {
	var base = [Players.keyboard, Players.autoArtist, Players.midi];
	return base.concat(Players.gamepads);
};

// A touch key is a region of a touch surface that when touched simulates a keypress.
function TouchKey(keyCode, x, y, w, h) {
	this.keyCode = keyCode;
	this.origin = { x: x, y: y };
	this.size = { width: w, height: h };
	this.state = false;

	this.touch = function() {
		if (this.state == true) {
			return;
		}
		this.state = true;
		Input.keyDownHandler({ keyCode: this.keyCode, which: this.keyCode });
	}

	this.unTouch = function() {
		if (this.state == false) {
			return;
		}
		this.state = false;
		Input.keyUpHandler({ keyCode: this.keyCode, which: this.keyCode });
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
	width: Artsy.constants.defaultSize,
	height: Artsy.constants.defaultSize,
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
	similar: null,
	similarImg: null
}

Artsy.history = [];
Artsy.historyTicks = 0;
Artsy.tickHistory = 1;
Artsy.maxHistory = 50;
Artsy.addToHistory = function(imageData) {
	if (Artsy.history.length >= Artsy.maxHistory) {
		var newHistory = [];
		for (let i = 1; i < Artsy.history.length; i += 2) {
			newHistory.push(Artsy.history[i]);
		}
		Artsy.tickHistory *= 2;
		Artsy.history = newHistory;
	}
	if ((Artsy.historyTicks % Artsy.tickHistory) == 0) {
		Artsy.history.push(imageData);
	}
	Artsy.historyTicks++;
}

/* Lifecycle functions */

// Setup.
Artsy.start = function() {
	Artsy.canvas = Artsy.createCanvas(Artsy.state.width, Artsy.state.height);
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
	window.addEventListener("gamepadconnected", Input.gamepadConnected, false);
	window.addEventListener("gamepaddisconnected", Input.gamepadDisconnected, false);

	Artsy.allActions = Artsy.findAllActions();
	Artsy.update();

	Artsy.canvas.ondragover = function() { this.className = 'hover'; return false; };
	Artsy.canvas.ondragend = function() { this.className = ''; return false; };
	Artsy.canvas.ondrop = function(e) {
		this.className = '';
		e.preventDefault();
		Artsy.readfiles(e.dataTransfer.files, false);
	}

	Artsy.keyboard.ondragover = function() { this.className = 'hover'; return false; };
	Artsy.keyboard.ondragend = function() { this.className = ''; return false; };
	Artsy.keyboard.ondrop = function(e) {
		this.className = '';
		e.preventDefault();
		Artsy.readfiles(e.dataTransfer.files, true);
	}

	Input.requestMIDIAccess();

};

Artsy.readfiles = function(files, similar) {
	// Only care about the first file.
	var file = files[0];
	if (file != undefined) {
		var reader = new FileReader();
		reader.onload = function(event) {
			var image = new Image();
			image.src = event.target.result;
			image.onload = function() {
				var canvas = document.createElement('canvas');
				var context = canvas.getContext('2d');
				// Draw it onto a artsy size canvas
				let cnvWidth = Artsy.state.width;
				let cnvHeight = Artsy.state.height;
				canvas.width = cnvWidth;
				canvas.height = cnvHeight;
				var width = Math.min(cnvWidth, image.width);
				var height = Math.min(cnvHeight, image.height);
				context.drawImage(image, (cnvWidth - width) / 2,
					(cnvHeight - height) / 2,
					width, height);
				var imgDat = context.getImageData(0, 0, cnvWidth, cnvHeight);
				ImgFuncs.addBufferToImageData(imgDat);
				if (similar == true) {
					Artsy.state.similar = imgDat;
					var newImage = new Image();
					newImage.src = canvas.toDataURL();
					Artsy.state.similarImg = newImage;
					Artsy.state.fran = true;
				} else {
					Artsy.state.imageData = imgDat;
				}
			}
		};
		reader.readAsDataURL(file);
	}
}

Artsy.performActionsForState = function(state) {
	var actions = Artsy.allActions;
	for (let i = 0; i < actions.length; ++i) {
		var action = actions[i];
		var keyCode = action["keycode"];
		if (keyCode > 0) {
			if (state.keyStates[keyCode] == true) {
				state = action.action(state);
				state.canvasNeedsUpdate = true;
			}
		}
		var keyCode = action["pressCode"];
		if (keyCode > 0) {
			if (state.pressStates[keyCode] == true) {
				state = action.action(state);
				state.canvasNeedsUpdate = true;
			}
		}
	}

	return state;
}

// Per frame update.
Artsy.update = function() {
	++Artsy.state.ticks;

	// Dupe the imageData for locked region support.
	var copy = ImgFuncs.copyData(Artsy.state.imageData);

	// Update non-keyboard/touch inputsd.
	Input.updateInputs();

	// Run the auto-artist.
	Artsy.state = Artsy.franIt(Artsy.state);
	ImgFuncs.addBufferToImageData(Artsy.state.imageData);

	var players = Players.all()

	for (let i = 0; i < players.length; i++) {
		var player = players[i];
		if (player.isActive) {
			player.writeState(Artsy.state);
			// Perform all actions.
			Artsy.state = Artsy.performActionsForState(Artsy.state);
			Artsy.state.pressStates = {};
			player.readState(Artsy.state);
		}
	}

	if (Artsy.state.canvasNeedsUpdate == true) {

		// For each locked region reset the region to it's state before the update.
		Artsy.state.lockedRegions = Artsy.state.newLockedRegions.concat(Artsy.state.lockedRegions);
		for (let i = 0; i < Artsy.state.lockedRegions.length; ++i) {
			var region = Artsy.state.lockedRegions[i];
			if (region.lifetime <= 0) {
				break;
			}
			region.lifetime -= 1 / 60;
			var size = region.size;
			var sx = region.x * size;
			var sy = region.y * size;
			for (let x = 0; x < size; ++x) {
				for (let y = 0; y < size; ++y) {
					// This is slow, make a thing for it.
					ImgFuncs_setColor32(Artsy.state.imageData, x + sx, y + sy, ImgFuncs_getColor32(copy, x + sx, y + sy));
				}
			}

		}

		var ctx = Artsy.canvas.getContext('2d');
		ctx.putImageData(Artsy.state.imageData, 0, 0);

		// Draw the brush point.
		if (Artsy.state.blip == true) {
			for (let i = 0; i < players.length; i++) {
				var player = players[i];
				if (player.isActive) {
					ctx.beginPath();
					ctx.arc(player.brushPoint.x, player.brushPoint.y, 2, 0, 2 * Math.PI, false);
					ctx.fillStyle = player.color;
					ctx.fill();
				}
			}
		}

		Artsy.canvasNeedsUpdate = false;

		// Color new locked regions yellow.
		for (let i = 0; i < Artsy.state.newLockedRegions.length; ++i) {
			var region = Artsy.state.newLockedRegions[i];
			var size = region.size;
			var x = region.x * size;
			var y = region.y * size;
			ctx.fillStyle = "rgba(255,255,127,1)";
			ctx.fillRect(x, y, size, size);

			Artsy.canvasNeedsUpdate = true;
		}

		var message = [];
		if (Artsy.state.haskeyed == false) {
			message.push("Press key to art");
		}
		if (Artsy.state.fran == true) {
			message.push("Auto artist on");
		}
		if (message.length > 0 && Artsy.state.similar == null) {
			var size = 15;
			var offset = (message.length - 1) * size / 2;
			var maxWidth = 0
			ctx.fillStyle = "rgba(0,0,0,0.75)";
			for (let i = 0; i < message.length; ++i) {
				maxWidth = Math.max(message[i].length, maxWidth);
			}
			maxWidth *= size * 0.5;
			ctx.fillRect(Artsy.state.imageData.width / 2 - maxWidth / 2, Artsy.state.imageData.height / 2 - offset - size, maxWidth, size * message.length + size * 0.5);
			ctx.font = "12px monospace";
			ctx.baseline = "middle";
			ctx.textAlign = "center";
			ctx.fillStyle = "white";
			for (let i = 0; i < message.length; ++i) {
				ctx.fillText(message[i], Artsy.state.imageData.width / 2, Artsy.state.imageData.height / 2 - offset + (i * size));
			}
		}

		Artsy.state.newLockedRegions = [];
		Artsy.addToHistory(ImgFuncs.copyData(Artsy.state.imageData));
	}

	// Color the keys yellow if a key is being pressed.
	if (ImgFuncs.boardData && Artsy.keyboard) {
		var btx = Artsy.keyboard.getContext('2d');
		if (Artsy.state.similarImg != null) {
			btx.drawImage(Artsy.state.similarImg, 0, 0);
		} else {
			btx.drawImage(ImgFuncs.board, 0, 0);
		}
		btx.fillStyle = "rgba(255,255,127,0.5)";

		for (let i = 0; i < touchKeys.length; ++i) {
			var touchKey = touchKeys[i]
			if (Artsy.state.keyStates[touchKey.keyCode] || Artsy.state.pressStates[touchKey.keyCode]) {
				btx.fillRect(Artsy.keyboard.width * touchKey.origin.x, Artsy.keyboard.height * touchKey.origin.y, Artsy.keyboard.width * touchKey.size.width, Artsy.keyboard.height * touchKey.size.height);
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

var Input = {
	touches: new Array(),
	mouseDown: false,
	mousePoint: { x: 0, y: 0 },
	gamepads: new Array()
};

Input.keyDownHandler = function(e) {
	var keyCode = e.keyCode;

	if (keyCode == 192) { // Tilde
		Players.keyboard.pressStates = {};
		Players.keyboard.keyStates = {};
		Artsy.state.fran = !Artsy.state.fran;
		Artsy.state.mouseDown = false
		Artsy.state.touches = [];
	} else {
		if (Artsy.state.fran) {
			Artsy.state.fran = false;
			Players.autoArtist.pressStates = {};
			Players.autoArtist.keyStates = {};
		}
		if (!Players.keyboard.keyStates[keyCode]) {
			Players.keyboard.pressStates[keyCode] = true;
		}
		Players.keyboard.keyStates[keyCode] = true;
		Artsy.state.haskeyed = true;
	}

	Players.autoArtist.isActive = Artsy.state.fran;
	Players.keyboard.isActive = !Artsy.state.fran;

}

Input.keyUpHandler = function(e) {
	var keyCode = e.keyCode || e.which;
	Players.keyboard.keyStates[keyCode] = false;

	// iPad bluetooth keyboards emit only keyCode 0 for keyup.
	if (keyCode == 0) {
		Players.keyboard.keyStates = {};
		Players.keyboard.pressStates = {};
	}
}

Input.mouseDownHandler = function(e) {
	Input.mouseDown = true;
	Input.mousePoint = { x: e.clientX, y: e.clientY };
	Input.mouseHandler();
}

Input.mouseUpHandler = function(e) {
	Input.mouseDown = false;
	Input.mousePoint = { x: e.clientX, y: e.clientY };
	Input.mouseHandler();
}

Input.mouseMoveHandler = function(e) {
	Input.mousePoint = { x: e.clientX, y: e.clientY };
	Input.mouseHandler();
}

Input.mouseHandler = function() {
	if (Input.mouseDown == true) {
		Input.pointHandler([Input.mousePoint]);
	} else {
		Input.pointHandler([]);
	}
}

Input.touchMoveHandler = function(e) {
	e.preventDefault();
	Input.touches = e.touches;
	var keyboard = Artsy.keyboard;
	var allPoints = [];
	for (let i = 0; i < Input.touches.length; ++i) {
		var x = Input.touches[i].clientX;
		var y = Input.touches[i].clientY;
		allPoints.push({ x: x, y: y });
	}
	Input.pointHandler(allPoints);
}

// Handles all touches or mouse moves.
Input.pointHandler = function(allPoints) {
	var keyboard = Artsy.keyboard;
	if (keyboard) {
		function calcOffset(obj) {
			if (obj.offsetParent) {
				var parentOffset = calcOffset(obj.offsetParent);
				return { x: parentOffset.x + obj.offsetLeft, y: parentOffset.y + obj.offsetTop };
			}
			return { x: 0, y: 0 };
		}

		var offset = calcOffset(keyboard);
		var width = keyboard.offsetWidth;
		var height = keyboard.offsetHeight;

		var points = [];
		for (let i = 0; i < allPoints.length; ++i) {
			var x = (allPoints[i].x - offset.x) / width;
			var y = (allPoints[i].y - offset.y) / height;
			points.push({ x: x, y: y });
		}

		for (let i = 0; i < touchKeys.length; ++i) {
			var touchKey = touchKeys[i]
			var wasTouched = false;
			for (let k = 0; k < points.length; ++k) {
				if ((touchKey.origin.x <= points[k].x) && (touchKey.origin.y <= points[k].y) && (touchKey.origin.x + touchKey.size.width >= points[k].x) && (touchKey.origin.y + touchKey.size.height >= points[k].y)) {
					wasTouched = true;
					break
				}
			}
			if (wasTouched) {
				touchKey.touch()
			} else {
				touchKey.unTouch()
			}
		}
	}
}

/* Gamepad API */

function GamepadState(gamepad) {
	this.up = false;
	this.down = false;
	this.left = false;
	this.right = false;
	this.aButton = false;
	this.bButton = false;
	this.cButton = false;

	if (!!gamepad) {
		if (gamepad.mapping == "standard") {
			if (gamepad.buttons[12].pressed) {
				this.up = true;
			}
			if (gamepad.buttons[13].pressed) {
				this.down = true;
			}
			if (gamepad.buttons[14].pressed) {
				this.left = true;
			}
			if (gamepad.buttons[15].pressed) {
				this.right = true;
			}
		}
		if (gamepad.buttons[0].pressed) {
			this.aButton = true;
		}
		if (gamepad.buttons[1].pressed) {
			this.bButton = true;
		}
		if (gamepad.buttons[2].pressed) {
			this.cButton = true;
		}

		// Axes range from -1.0 - 1.0, keeping a 0.25-ish deadzone?
		if (gamepad.axes[0] < -0.25) {
			this.left = true
		}
		if (gamepad.axes[0] > 0.25) {
			this.right = true
		}
		if (gamepad.axes[1] < -0.25) {
			this.up = true
		}
		if (gamepad.axes[1] > 0.25) {
			this.down = true
		}
	}
}

Input.gamepadConnected = function(event) {
	console.log(event.gamepad);
	Input.gamepads.push(event.gamepad);

	var gamepadPlayer = new Player();
	gamepadPlayer.gamepad = event.gamepad;
	gamepadPlayer.gamepadState = new GamepadState();
	gamepadPlayer.currentTool = Input.randomTool;
	var newBrush = Input.randomBrush();
	gamepadPlayer.brushType = newBrush.brushType;
	gamepadPlayer.brushSize = newBrush.brushSize;
	Players.gamepads.push(gamepadPlayer);
}

Input.gamepadDisconnected = function(event) {
	console.log(event.gamepad);
	var idx = Input.gamepads.indexOf(event.gamepad);
	if (idx > -1) {
		Input.gamepads.splice(idx, 1);
	}

	for (let i = 0; i < Players.gamepads.length; i++) {
		if (Players.gamepads[i].gamepad.index == event.gamepad.index) {
			Players.gamepads[i].isActive = false;
		}
	}
}

/* MIDI Input */

Input.midiAccess = null;
Input.midiEventQueue = new Array();

Input.requestMIDIAccess = function() {

	function startListening(midiAccess) {
		/* reset midiInputs here */
		Players.midi.isActive = false;
		for (let entry of midiAccess.inputs) {
			entry[1].onmidimessage = function(e) { Input.onMIDIMessage(e) };
			Players.midi.isActive = true;
		}
	}

	function onMIDISuccess(midiAccess) {
		console.log("MIDI ready!");
		Input.midiAccess = midiAccess;
		startListening(midiAccess);
		midiAccess.onstatechange = function() { startListening(midiAccess) };
	}

	function onMIDIFailure(msg) {
		console.log("Failed to get MIDI access - " + msg);
	}

	if (!!navigator.requestMIDIAccess) {
		navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
	}
}

Input.onMIDIMessage = function(event) {
	Input.midiEventQueue.push(event);
}

Input.processMidiEvent = function(event) {

	// We currently only care about events with at least 3 data bytes.
	if (event.data.length < 3) {
		return null;
	}

	var control = event.data[0];
	var channel = control % 16;
	control = Math.floor(control / 16) - 8;

	var key = event.data[1];
	var value = event.data[2];

	if (control == 1 && value == 0) {
		control = 0;
	}

	if (control == 3) {
		return {
			type: "off",
			channel: channel,
			key: 0,
			value: 0,
			target: event.target
		};
	}

	if (control == 0 || control == 1) {

		return {
			type: "note",
			channel: channel,
			key: key,
			value: (control > 0),
			target: event.target
		};
	}

	return null;
}


/* Input loop */

Input.randomTool = function() {
	var tools = [87, 69, 82, 84, 89, 85, 73, 79, 80, 65, 68, 70, 72, 74, 75, 76, 86, 66, 77, 189, 38, 40, 37, 39, 32];

	return tools[Math.floor(Math.random() * tools.length)];
}

Input.randomBrush = function() {
	var brushType = Math.floor(Math.random() * 9);
	var brushSize = Math.floor(Math.random() * 72);
	if (brushType == 7) {
		brushSize = Math.ceil(brushSize / 2);
	}
	return { brushType: brushType, brushSize: brushSize };
}

Input.updateInputs = function() {

	var changed = false;

	changed = changed | Input.updateGamepads();

	changed = changed | Input.updateMIDI();

	if (changed == true) {
		Artsy.state.haskeyed = true;
		Artsy.state.fran = false;
		Players.autoArtist.isActive = Artsy.state.fran;
	}
}

// https://w3c.github.io/gamepad/#remapping
Input.updateGamepads = function() {

	var changed = false;

	var gamepads = new Array();
	if (!!navigator.getGamepads) {
		gamepads = navigator.getGamepads();
	}

	for (let i = 0; i < Players.gamepads.length; i++) {
		var gamepadPlayer = Players.gamepads[i];
		var oldState = gamepadPlayer.gamepadState;

		for (let j = 0; j < gamepads.length; j++) {
			if (!!gamepads[j] && gamepads[j].index == gamepadPlayer.gamepad.index) {
				gamepadPlayer.gamepad = gamepads[j];
			}
		}

		var newState = new GamepadState(gamepadPlayer.gamepad);

		// Change tool
		if (newState.bButton != oldState.bButton && !!newState.bButton) {
			var prevTool = gamepadPlayer.currentTool;
			gamepadPlayer.keyStates[prevTool] = false;
			gamepadPlayer.pressStates[prevTool] = false;
			gamepadPlayer.currentTool = Input.randomTool();
			changed = true;
		}

		// Change brush
		if (newState.cButton != oldState.cButton && !!newState.cButton) {
			var newBrush = Input.randomBrush();
			gamepadPlayer.brushType = newBrush.brushType;
			gamepadPlayer.brushSize = newBrush.brushSize;
			changed = true;
		}

		var currentTool = gamepadPlayer.currentTool;

		// Use tool
		if (newState.aButton == true && !!currentTool) {
			if (gamepadPlayer.keyStates[currentTool] == false) {
				gamepadPlayer.pressStates[currentTool] = newState.aButton;
			}
			gamepadPlayer.keyStates[currentTool] = newState.aButton;
			changed = true;
		} else {
			gamepadPlayer.pressStates[currentTool] = false;
			gamepadPlayer.keyStates[currentTool] = false;

		}

		if (newState.up != oldState.up) {
			gamepadPlayer.keyStates[81] = newState.up;
			gamepadPlayer.pressStates[81] = newState.up;
			changed = true;
		}
		if (newState.down != oldState.down) {
			gamepadPlayer.keyStates[78] = newState.down;
			gamepadPlayer.pressStates[78] = newState.down;
			changed = true;
		}
		if (newState.left != oldState.left) {
			gamepadPlayer.keyStates[90] = newState.left;
			gamepadPlayer.pressStates[90] = newState.left;
			changed = true;
		}
		if (newState.right != oldState.right) {
			gamepadPlayer.keyStates[67] = newState.right;
			gamepadPlayer.pressStates[67] = newState.right;
			changed = true;
		}

		gamepadPlayer.gamepadState = newState;
	}

	return changed;
}

var midiAction = function(type, value) {
	return { "type": type, "value": value }
}

Input.updateMIDI = function() {

	var genericDict = {
		"channel": {
			"2": {
				48: midiAction("keypress", 112), // F1
				49: midiAction("keypress", 113), // F2
				50: midiAction("keypress", 114), // F3
				51: midiAction("keypress", 115), // F4
				44: midiAction("keypress", 116), // F5
				45: midiAction("keypress", 117), // F6
				46: midiAction("keypress", 118), // F7
				47: midiAction("keypress", 119), // F8
				40: midiAction("keypress", 120), // F9
				41: midiAction("keypress", 121), // F10
				42: midiAction("keypress", 122), // F11
				43: midiAction("keypress", 123), // F12
				64: midiAction("keypress", 48), // 0
				65: midiAction("keypress", 49), // 1
				66: midiAction("keypress", 50), // 2
				67: midiAction("keypress", 51), // 3
				60: midiAction("keypress", 52), // 4
				61: midiAction("keypress", 53), // 5
				62: midiAction("keypress", 54), // 6
				63: midiAction("keypress", 55), // 7
				56: midiAction("keypress", 56), // 8
				57: midiAction("keypress", 57), // 9
				80: midiAction("keypress", 81), // Q
				81: midiAction("keypress", 87), // W
				82: midiAction("keypress", 69), // E
				83: midiAction("keypress", 82), // R
				76: midiAction("keypress", 84), // T
				77: midiAction("keypress", 89), // Y
				78: midiAction("keypress", 85), // U
				79: midiAction("keypress", 73), // I
				72: midiAction("keypress", 65), // A
				73: midiAction("keypress", 83), // S
				74: midiAction("keypress", 68), // D
				75: midiAction("keypress", 70), // F
				68: midiAction("keypress", 71), // G
				69: midiAction("keypress", 72), // H
				70: midiAction("keypress", 74), // J
				71: midiAction("keypress", 75), // K
				96: midiAction("keypress", 90), // Z
				97: midiAction("keypress", 67), // C
				98: midiAction("keypress", 86), // V
				99: midiAction("keypress", 66), // B
				92: midiAction("keypress", 78), // N
				93: midiAction("keypress", 77), // M
				94: midiAction("keypress", 76), // L
				95: midiAction("keypress", 79), // O
				88: midiAction("keypress", 80), // P
				89: midiAction("keypress", 189), // -
				90: midiAction("keypress", 38), // Up
				91: midiAction("keypress", 32), // Space
				84: midiAction("keypress", 37), // Left
				85: midiAction("keypress", 40), // Down
				86: midiAction("keypress", 39), // Right
				87: midiAction("keypress", 187), // =
				72: midiAction("keypress", 46) // Delete
			}
		}
	};

	var changed = false;

	for (let i = 0; i < Input.midiEventQueue.length; i++) {
		var event = Input.midiEventQueue[i];
		var eventObj = Input.processMidiEvent(event);
		if (eventObj.type == "off") {
			Players.midi.keyStates = {};
			Players.midi.pressStates = {};
		}
		if (eventObj.type == "note") {
			var channel = eventObj.channel;
			var channelDict = genericDict.channel[channel];
			if (!!channelDict) {
				var key = eventObj.key;
				var value = eventObj.value;
				var action = channelDict[key];
				if (!!action) {
					if (action.type == "keypress") {
						Players.midi.keyStates[key] = value;
						Players.midi.pressStates[key] = value;
						changed = true;
					}
				}
			}
		}
	}

	Input.midiEventQueue = new Array();

	return changed;
}

/* Save/load images */

var Gallery = {
	images: null,
	giffer: null
};

Gallery.saveImageGroup = function(images) {
	var gif = new GIF({
		workers: 2,
		quality: 30
	});
	Gallery.giffer = gif;

	for (let i = 0; i < images.length; i++) {
		gif.addFrame(images[i]);
	}

	gif.on('finished', function(blob) {
		Gallery.blobToDataURL(blob, function(url) {
			Gallery.saveImageURL(url);
			Gallery.displayGallery(true);
		});
	});
	gif.render();
}

Gallery.blobToDataURL = function(blob, callback) {
	var a = new FileReader();
	a.onload = function(e) { callback(e.target.result); }
	a.readAsDataURL(blob);
}

// Stores images as data urls
Gallery.saveImageData = function(imageData) {
	var url = ImgFuncs.toDataURL(imageData);
	Gallery.saveImageURL(url);
}

// Stores images as data urls
Gallery.saveImageURL = function(url) {
	var images = Gallery.getSavedImages();
	for (let i = 0; i < images.length; ++i) {
		if (images[i] == url) {
			return;
		}
	}
	images.unshift(url);

	var imagesToSave = images.slice();
	var success = false;

	while (imagesToSave.length > 0 && success == false) {
		var stringToSave = JSON.stringify(imagesToSave);
		try {
			window.localStorage.setItem("imageArray", stringToSave);
			success = true;
		} catch (e) {
			success = false;
			imagesToSave.pop();
		}
	}

	Gallery.images = images;
}

Gallery.getSavedImages = function() {
	if (Gallery.images) {
		return Gallery.images;
	}
	var storedValues = localStorage.getItem("imageArray")
	if (storedValues) {
		var images = JSON.parse(storedValues);
		if (images) {
			Gallery.images = images;
			return images;
		}
	}
	return [];
}

// Displays all saved images. Does not display if there are no saved images.
Gallery.displayGallery = function(force = false) {
	var currentGallery = document.getElementById("gallery")
	if (currentGallery) {
		currentGallery.remove();
		if (force == false) {
			return;
		}
	}
	var images = Gallery.getSavedImages();
	if (images.length <= 0) {
		return;
	}

	var newGallery = document.createElement("div");
	newGallery.id = "gallery";
	var close = document.createElement("div");
	close.innerHTML = "X";
	close.onclick = function() { Gallery.displayGallery() };
	newGallery.appendChild(close);

	var native = false;
	if (("standalone" in window.navigator) && window.navigator.standalone) {
		native = true;
	}
	var imgTags = new Array();
	for (let i = 0; i < images.length; ++i) {
		var j = i;
		ImgFuncs.loadImage(images[i], function(img) {
			var url = img.src;
			if (img.src.indexOf("image/gif") == -1) {
				var data = ImgFuncs.fromImage(img);
				url = ImgFuncs.toDataURL(ImgFuncs.addTransparentPixel(ImgFuncs.scaleImageData(data, 4)));
			}
			var imgTag = document.createElement("img")
			imgTag.src = url;
			imgTag.setAttribute("download", "img.png");
			if (native) {
				// On native iOS the img callout doesn't work, so link to the image elsewhere.
				var linkTag = document.createElement("a");
				linkTag.setAttribute("href", "http://superpartyawesome.com/things/imageDisplay/#" + url);
				linkTag.appendChild(imgTag);
				linkTag.setAttribute("target", "_blank");
				linkTag.setAttribute("rel", "external");
				linkTag.setAttribute("download", "img.png");
				newGallery.appendChild(linkTag);
				imgTags.push(linkTag);
			} else {
				newGallery.appendChild(imgTag);
				imgTags.push(imgTag);
			}

			if (imgTags.length == images.length) {
				while (newGallery.firstChild) {
					newGallery.removeChild(newGallery.firstChild);
				}
				newGallery.appendChild(close);
				for (let i = 0; i < imgTags.length; i++) {
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
		for (let i = 0; i < output.width * output.height; ++i) {
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
	emotion: new Emotion(77, 1, 2, 3, 0, 0),
	action: function(state) {
		var output = state.imageData
		for (let x = 0; x < output.width; ++x) {
			for (let y = 0; y < output.height; ++y) {

				for (let i = 0; i < 3; ++i) {
					var e = uint32(0);
					var d = uint32(0);

					if (x > 0) {
						d = uint32(ImgFuncs_getColor32(output, x - 1, y) >> (i * 8)) & 0xff;
						e = uint32(e | d);
					}
					if (y > 0) {
						d = uint32(ImgFuncs_getColor32(output, x, y - 1) >> (i * 8)) & 0xff;
						e = uint32(e | d);
					}
					if (x < output.width - 1) {
						d = uint32(ImgFuncs_getColor32(output, x + 1, y) >> (i * 8)) & 0xff;
						e = uint32(e | d);
					}
					if (y < output.height - 1) {
						d = uint32(ImgFuncs_getColor32(output, x, y + 1) >> (i * 8)) & 0xff;
						e = uint32(e | d);
					}

					var c1 = uint32(ImgFuncs_getColor32(state.imageData, x, y));
					var c2 = c1 | (uint32(e) << uint32(i * 8))
					if (c2 > c1) {
						++c1;
					} else if (c2 < c1) {
						--c1;
					}
					ImgFuncs_setColor32(state.imageData, x, y, c1);
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
	emotion: new Emotion(89, -1, -2, -3, 0, 0),
	action: function(state) {
		var oxbox = [0xffffff00, 0xffff00ff, 0xff00ffff];
		var output = state.imageData
		for (let x = 0; x < output.width; ++x) {
			for (let y = 0; y < output.height; ++y) {
				for (let i = 0; i < 3; ++i) {
					var e = uint32(0);
					var d = 0;
					var n = 0;
					if (x > 0) {
						d = uint32(ImgFuncs_getColor32(output, x - 1, y) >> (i * 8)) & 0xff;
						e = uint32(e | d);
						if (d > 0x7f) ++n;
					}
					if (y > 0) {
						d = uint32(ImgFuncs_getColor32(output, x, y - 1) >> (i * 8)) & 0xff;
						e = uint32(e | d);
						if (d > 0x7f) ++n;
					}
					if (x < output.width - 1) {
						d = uint32(ImgFuncs_getColor32(output, x + 1, y) >> (i * 8)) & 0xff;
						e = uint32(e | d);
						if (d > 0x7f) ++n;
					}
					if (y < output.height - 1) {
						d = uint32(ImgFuncs_getColor32(output, x, y + 1) >> (i * 8)) & 0xff;
						e = uint32(e | d);
						if (d > 0x7f) ++n;
					}

					var c1 = uint32(ImgFuncs_getColor32(state.imageData, x, y));
					var c2 = uint32((c1 >> uint32(i * 8))) & 0xff
					if (n > 2 && c2 < 0xff) {
						++c2;
					} else if (c2 > 0) {
						--c2;
					}
					c1 = uint32(uint32(c1 & uint32(oxbox[i])) | uint32(c2 << (i * 8)));
					ImgFuncs_setColor32(state.imageData, x, y, c1);
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
	emotion: new Emotion(84, 0, 0, 0, 0, 0),
	action: function(state) {
		var output = state.imageData
		for (let x = 0; x < output.width; ++x) {
			for (let y = 0; y < output.height; ++y) {
				var nx = x - 1;
				var ny = y;
				if (nx < 0) {
					nx += output.width;
					++ny;
					if (ny >= output.height)
						ny = 0;
				}

				var c1 = ImgFuncs_getColorArr(output, x, y);
				var c2 = ImgFuncs_getColorArr(output, nx, ny);
				for (i = 0; i < 3; ++i) {
					c1[i] = ((c1[i] % 64) + (61 * Math.floor(c1[i] / 64)) + (2 * Math.floor(c2[i] / 64)) + Math.floor(c2[(i + 1) % 3] / 64)) % 256;
				}

				var rgb1 = ImgFuncs_arrTo32(c1)

				ImgFuncs_setColor32(output, x, y, rgb1);
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
	emotion: new Emotion(73, -5, -5, 5, 5, 5),
	action: function(state) {
		var output = state.imageData
		for (let x = 0; x < output.width; ++x) {
			for (let y = 0; y < output.height; ++y) {
				var c1 = ImgFuncs_getColorArr(output, x, y);
				var hsv = ImgFuncs.RGBToHSV(c1);
				hsv[0] += 1 / 360;
				c1 = ImgFuncs.HSVToRGB(hsv);
				ImgFuncs_setColorArr(output, x, y, c1);
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
	emotion: new Emotion(71, 0, 0, 0, 0, 0),
	action: function(state) {
		var output = state.imageData;
		var x = state.brushPoint.x;
		var total = new Array(0, 0, 0)

		for (let y = 0; y < output.height; ++y) {
			var c1 = ImgFuncs_getColorArr(output, x, y);
			total[0] += ~~(c1[0] / output.width);
			total[1] += ~~(c1[1] / output.width);
			total[2] += ~~(c1[2] / output.width);
		}

		for (let y = 0; y < output.height; ++y) {
			c2 = ImgFuncs_getColorArr(output, x, y);

			if (c2[0] > total[0]) --c2[0];
			if (c2[0] < total[0]) ++c2[0];
			if (c2[1] > total[1]) --c2[1];
			if (c2[1] < total[1]) ++c2[1];
			if (c2[2] > total[2]) --c2[2];
			if (c2[2] < total[2]) ++c2[2];


			ImgFuncs_setColorArr(output, x, y, c2);
		}
		return state;
	}
}

Artsy.actions.down_thing = {
	name: "down_thing",
	affectsCanvas: true,
	keycode: 70, // F
	emotion: new Emotion(70, 0, 0, 0, 0, 0),
	action: function(state) {
		var output = state.imageData
		for (let x = 0; x < output.width; ++x) {
			for (let y = output.height - 1; y > 0; y--) {
				let rgb1 = ImgFuncs_getColorArr(output, x, y);
				let rgb2 = ImgFuncs_getColorArr(output, x, y - 1);
				if (rgb2[0] > rgb1[0]) {
					var tmp = rgb1[0];
					rgb1[0] = rgb2[0];
					rgb2[0] = tmp;
				}
				if (rgb2[1] > rgb1[1]) {
					var tmp = rgb1[1];
					rgb1[1] = rgb2[1];
					rgb2[1] = tmp;
				}
				if (rgb2[2] > rgb1[2]) {
					var tmp = rgb1[2];
					rgb1[2] = rgb2[2];
					rgb2[2] = tmp;
				}
				ImgFuncs_setColorArr(output, x, y, rgb1);
				ImgFuncs_setColorArr(output, x, y - 1, rgb2);
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
	emotion: new Emotion(87, 0, 0, 0, 0, 0),
	action: function(state) {
		var output = state.imageData
		var width = output.width;
		var height = output.height;
		for (let x = 0; x < width; ++x) {
			for (let y = 0; y < height; ++y) {
				var rgb = ImgFuncs_getColorArr(output, x, y);
				for (n = 0; n < 3; ++n) {
					if (Math.floor(Math.floor((rgb[n]) / 64) * 64 + 16) < rgb[n]) {
						--rgb[n];
					} else {
						++rgb[n];
					}
				}
				ImgFuncs_setColorArr(output, x, y, rgb);
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
	emotion: new Emotion(76, 0, 0, 0, 0, 0),
	action: function(state) {
		var output = state.imageData
		for (let x = 0; x < output.width; ++x) {
			for (let y = 0; y < output.height; ++y) {
				var r1 = ImgFuncs_getColorC(output, x, y, 0);
				if (r1 > 32) {
					var r2 = ImgFuncs_getColorC(output, x - 1, y, 0);
					r2 = Math.floor((r1 + r2) / 2);
					ImgFuncs_setColorC(output, x - 1, y, 0, r2);

					var r3 = ImgFuncs_getColorC(output, x + 1, y + 1, 0);
					++r3;
					ImgFuncs_setColorC(output, x + 1, y + 1, 0, r3);

					var r4 = ImgFuncs_getColorC(output, x + 1, y - 1, 0);
					++r4;
					ImgFuncs_setColorC(output, x + 1, y - 1, 0, r4);
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
	emotion: new Emotion(69, 0, 0, 0, 0, -500),
	action: function(state) {
		var output = ImgFuncs.findEdges(state.imageData, 2, 192, new Array(255, 0, 0))
		state.imageData = output;
		return state;
	}
}

Artsy.actions.findEdgesWhite = {
	name: "findEdgesWhite",
	affectsCanvas: true,
	keycode: 79, // O
	emotion: new Emotion(79, 0, 0, 0, 0, -500),
	action: function(state) {
		var output = ImgFuncs.findEdges(state.imageData, 0, 128, new Array(255, 255, 255))
		state.imageData = output;
		return state;
	}
}

Artsy.actions.findEdgesGreen = {
	name: "findEdgesGreen",
	affectsCanvas: true,
	keycode: 65, // A
	emotion: new Emotion(65, 0, 0, 0, 0, -500),
	action: function(state) {
		var output = ImgFuncs.findEdges(state.imageData, 1, 128, new Array(0, 255, 0))
		state.imageData = output;
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_Q = {
	name: "SDL_SCANCODE_Q",
	affectsCanvas: true,
	keycode: 81, // Q
	emotion: new Emotion(81, 0, 0, 0, 0, 0),
	action: function(state) {
		state.brushPoint.y = underflowMod(state.brushPoint.y - 1, state.imageData.height)
		return Artsy.actions.circle_thing.action(state);
	}
}

Artsy.actions.SDL_SCANCODE_R = {
	name: "SDL_SCANCODE_R",
	affectsCanvas: true,
	keycode: 82, // R
	emotion: new Emotion(82, 0, 0, 0, 0, 0),
	action: function(state) {
		var output = state.imageData;
		for (let y = 1; y < output.height; ++y) {
			ImgFuncs.skewx(output, 0, y - 1, output.width, 1, y);
		}

		state.imageData = output;
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_U = {
	name: "SDL_SCANCODE_U",
	affectsCanvas: true,
	keycode: 85, // U
	emotion: new Emotion(85, 0, 0, 0, 0, 0),
	action: function(state) {
		var output = state.imageData;
		var w = state.imageData.width;
		var h = state.imageData.height;
		var max = w * h;

		function idx(_i) {
			var __i = _i - 1;
			return { x: __i % w, y: Math.floor(__i / w) };
		}

		function unidx(_i) {
			var __i = max - _i;
			return { x: __i % w, y: Math.floor(__i / w) };
		}

		function pass(idxf, swapf) {
			var pt = idxf(1);
			var x2 = pt.x;
			var y2 = pt.y;
			var c2 = ImgFuncs_getColor32(output, x2, y2);
			var x1 = x2;
			var y1 = y2;
			var pt2 = idxf(i + 1)
			var c1 = c2;
			for (let i = 1; i < max - 1; ++i) {
				x1 = x2;
				y1 = y2;
				pt2 = idxf(i + 1)
				x2 = pt2.x;
				y2 = pt2.y;
				c1 = c2;
				c2 = ImgFuncs_getColor32(output, x2, y2);
				var colors = swapf(ImgFuncs.lesser(c1, c2), ImgFuncs.greater(c1, c2));
				var less = colors.a;
				var great = colors.b;
				ImgFuncs_setColor32(output, x1, y1, less);
				ImgFuncs_setColor32(output, x2, y2, great);
				c2 = great;
			}
		}
		for (let im = 1; im <= 4; ++im) {
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
	emotion: new Emotion(80, 0, 0, 0, 0, 0),
	action: function(state) {
		var output = state.imageData;

		var max = output.width * output.height;
		var besides = state.ticks % 2;

		function idxf(_i) {
			var i = _i - 1 + besides;
			return { x: i % output.width, y: Math.floor(i / output.width) }
		}

		for (let i = 1; i < max - 2; i += 2) {
			var p1 = idxf(i);
			var p2 = idxf(i + 1);
			var c1 = ImgFuncs_getColor32(output, p1.x, p1.y);
			var c2 = ImgFuncs_getColor32(output, p2.x, p2.y);
			ImgFuncs_setColor32(output, p1.x, p1.y, c2);
			ImgFuncs_setColor32(output, p2.x, p2.y, c1);
		}

		state.imageData = output;
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_D = {
	name: "SDL_SCANCODE_D",
	affectsCanvas: true,
	keycode: 68, // D
	emotion: new Emotion(68, 0, 0, 0, 0, 0),
	action: function(state) {
		var output = state.imageData;
		ImgFuncs.skewx_channel(output, 0, 0, output.width, output.height, 1, 0)
		ImgFuncs.skewx_channel(output, 0, 0, output.width, output.height, 2, 1)
		ImgFuncs.skewx_channel(output, 0, 0, output.width, output.height, 3, 2)
		state.imageData = output;
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_K = {
	name: "SDL_SCANCODE_K",
	affectsCanvas: true,
	keycode: 75, // K
	emotion: new Emotion(75, 1, 1, 1, 1, 1),
	action: function(state) {
		var output = state.imageData;
		var ticks = state.ticks;

		switch (ticks % 4) {
			case 0:
				ImgFuncs.skewx(output, 0, 0, output.width, output.height / 2, -1);
				break;
			case 1:
				ImgFuncs.skewy(output, output.width / 2, 0, output.width / 2, output.height, -1);
				break;
			case 2:
				ImgFuncs.skewx(output, 0, output.height / 2, output.width, output.height / 2, 1);
				break;
			case 3:
				ImgFuncs.skewy(output, 0, 0, output.width / 2, output.height, 1);
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
	emotion: new Emotion(90, 0, 0, 0, 0, 0),
	action: function(state) {
		state.brushPoint.x = (state.brushPoint.x - 1 - 1 + state.imageData.height) % state.imageData.height + 1
		return Artsy.actions.circle_thing.action(state);
	}
}

Artsy.actions.SDL_SCANCODE_C = {
	name: "SDL_SCANCODE_C",
	affectsCanvas: true,
	keycode: 67, // C
	emotion: new Emotion(67, 0, 0, 0, 0, 0),
	action: function(state) {
		state.brushPoint.x = (state.brushPoint.x + 1 - 1 + state.imageData.height) % state.imageData.height + 1
		return Artsy.actions.circle_thing.action(state);
	}
}

Artsy.actions.SDL_SCANCODE_B = {
	name: "SDL_SCANCODE_B",
	affectsCanvas: true,
	keycode: 66, // B
	emotion: new Emotion(66, 0, 0, 0, 0, 0),
	action: function(state) {
		var output = state.imageData;
		var w = state.imageData.width;
		var h = state.imageData.height;
		var max = w * h;

		function idx(_i) {
			var __i = _i - 1;
			return { x: Math.floor(__i / w), y: __i % w };
		}

		function unidx(_i) {
			var __i = max - _i;
			return { x: Math.floor(__i / w), y: __i % w };
		}

		function cmp(a, b) { return a < b }

		function uncmp(a, b) { return a > b }

		function pass(idxf, cmpf) {
			var pt = idxf(1);
			var x2 = pt.x;
			var y2 = pt.y;
			var c2 = ImgFuncs_getColor32(output, x2, y2);
			var x1 = x2;
			var y1 = y2;
			var c1 = c2;
			for (let i = 1; i < max - 1; ++i) {
				var pt2 = idxf(i + 1)
				x1 = x2;
				y1 = y2;
				c1 = c2;
				x2 = pt2.x;
				y2 = pt2.y;
				c2 = ImgFuncs_getColor32(output, x2, y2);
				if (cmpf(c1, c2) == true) {
					ImgFuncs_setColor32(output, x1, y1, c2);
					ImgFuncs_setColor32(output, x2, y2, c1);
					c2 = c1;
				}
			}
		}
		for (let im = 1; im <= 4; ++im) {
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
	emotion: new Emotion(78, 0, 0, 0, 0, 0),
	action: function(state) {
		state.brushPoint.y = (state.brushPoint.y + 1 - 1 + state.imageData.height) % state.imageData.height + 1
		return Artsy.actions.circle_thing.action(state);
	}
}

Artsy.actions.circle_thing = {
	name: "circle_thing",
	affectsCanvas: true,
	keycode: 32, // SPACE
	emotion: new Emotion(32, 0, 0, 0, 0, 0),
	action: function(state) {
		var thisState = state;
		Sounder.playSound("sfx_0");

		var brushes = Artsy.findAllBrushes();

		for (let i = 0; i < brushes.length; ++i) {
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
	emotion: new Emotion(86, 0, 0, 0, 0, 0),
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
	emotion: new Emotion(83, 0, 0, 0, 0, 0),
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
	emotion: new Emotion(72, 20, 0, 20, 0, 0),
	action: function(state) {
		var copy = ImgFuncs.copyData(state.imageData);

		function localFilter(size, x, y) {
			return { x: Math.max(Math.min(size + 1, x * 3), 0), y: Math.max(Math.min(size + 1, y * 3), 0) };
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
	emotion: new Emotion(74, 0, 0, 0, 0, 0),
	action: function(state) {
		var assign = new Array();
		assign.push(Math.floor(Math.random() * 3));
		var color = new Array(0, 0, 0, 255);
		var a = (assign[0] + 1) % 3;
		var b = (assign[0] + 2) % 3;
		if (Math.random() < 0.5) {
			assign.push(a);
			assign.push(b);
		} else {
			assign.push(b);
			assign.push(a);
		}

		for (let x = 0; x < state.imageData.width; ++x) {
			for (let y = 0; y < state.imageData.height; ++y) {
				var c1 = ImgFuncs_getColorArr(state.imageData, x, y);
				for (let c = 0; c < 3; ++c) {
					color[c] = c1[assign[c]];
				}
				ImgFuncs_setColorArr(state.imageData, x, y, color);
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
	emotion: new Emotion(189, 0, 0, 0, 0, 0),
	action: function(state) {
		var subdiv = 4;
		var nx = ~~(Math.random() * subdiv);
		var ny = ~~(Math.random() * subdiv);
		var nlifetime = 2;
		var nsize = state.imageData.width / subdiv
		var region = { x: nx, y: ny, lifetime: nlifetime, size: nsize };
		state.newLockedRegions.push(region);
		Sounder.playSound("magic1");
		return state;
	}
}

Artsy.actions.SDL_SCANCODE_UP = {
	name: "SDL_SCANCODE_UP",
	affectsCanvas: true,
	pressCode: 38, // 
	emotion: new Emotion(38, 20, 20, 0, 0, 0),
	action: function(state) {
		var copy = ImgFuncs.copyData(state.imageData);

		function localFilter(size, x, y) {
			return { x: Math.max(Math.min(size, size / 3 + x), 0), y: Math.max(Math.min(size, size / 3 + y), 0) };
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
	emotion: new Emotion(40, 0, 0, 0, 0, 0),
	action: function(state) {
		function localFilter(i, s) {
			return ~~(i / 3) + (i % 3) * (~~(s / 3));
		}
		var copy = ImgFuncs.copyData(state.imageData);
		for (let x = 0; x < state.imageData.width; ++x) {
			for (let y = 0; y < state.imageData.width; ++y) {
				var c = ImgFuncs_getColor32(copy, x, y);
				ImgFuncs_setColor32(state.imageData, localFilter(x, state.imageData.width), localFilter(y, state.imageData.height), c)
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
	emotion: new Emotion(37, 0, 0, 0, 0, 0),
	action: function(state) {
		var copy = ImgFuncs.copyData(state.imageData);
		for (let x = 0; x < state.imageData.width; ++x) {
			for (let y = 0; y < state.imageData.width; ++y) {
				var c = ImgFuncs_getColor32(copy, x, y);
				ImgFuncs_setColor32(state.imageData, (x + (~~(state.imageData.width / 3)) - 1) % state.imageData.width, y, c)
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
	emotion: new Emotion(39, 0, 0, 0, 0, 0),
	action: function(state) {
		var copy = ImgFuncs.copyData(state.imageData);
		for (let x = 0; x < state.imageData.width; ++x) {
			for (let y = 0; y < state.imageData.width; ++y) {
				var c = ImgFuncs_getColor32(copy, x, y);
				ImgFuncs_setColor32(state.imageData, x, (y + (~~(state.imageData.height / 3)) - 1) % state.imageData.height, c)
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
		var imageGroup = Artsy.history.slice();
		imageGroup.push(state.imageData);
		Gallery.saveImageGroup(imageGroup);
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
	emotion: new Emotion(49, 0, 0, 0, 0, 0),
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
	emotion: new Emotion(50, 0, 0, 0, 0, 0),
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
	emotion: new Emotion(51, 0, 0, 0, 0, 0),
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
	emotion: new Emotion(52, 0, 0, 0, 0, 0),
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
	emotion: new Emotion(53, 0, 0, 0, 0, 0),
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
	emotion: new Emotion(54, 0, 0, 0, 0, 0),
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
	emotion: new Emotion(55, 0, 0, 0, 0, 0),
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
	emotion: new Emotion(56, 0, 0, 0, 0, 0),
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
	emotion: new Emotion(57, 0, 0, 0, 0, 0),
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
	emotion: new Emotion(48, 0, 0, 0, 0, 0),
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
	emotion: new Emotion(112, 0, 0, 0, 0, 0),
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
	emotion: new Emotion(113, 0, 0, 0, 0, 0),
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
	emotion: new Emotion(114, 0, 0, 0, 0, 0),
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
	emotion: new Emotion(115, 0, 0, 0, 0, 0),
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
	emotion: new Emotion(116, 0, 0, 0, 0, 0),
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
	emotion: new Emotion(117, 0, 0, 0, 0, 0),
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
	emotion: new Emotion(118, 0, 0, 0, 0, 0),
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
	emotion: new Emotion(119, 0, 0, 0, 0, 0),
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
	emotion: new Emotion(120, 0, 0, 0, 0, 0),
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
	emotion: new Emotion(121, 0, 0, 0, 0, 0),
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
	emotion: new Emotion(122, 0, 0, 0, 0, 0),
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
	emotion: new Emotion(123, 0, 0, 0, 0, 0),
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
		state.saveState = { imageData: ImgFuncs.copyData(state.imageData) }
		return state;
	}
}

/* Brushes */

Artsy.brushes = {}

Artsy.brushes.smoosh = {
	name: "Smoosh",
	number: 1,
	action: function(state) {
		for (let i = 0; i < state.brushSize; ++i) { //which ring {
			for (let j = 0; j <= i; ++j) { //within ring
				//do each of the four sides of the diamond
				var c1 = 0;
				var x = state.brushPoint.x - 1 - i + j;
				var y = state.brushPoint.y + j;
				// ImgFuncs_setColor32(state.imageData, x, y, c1);
				// ImgFuncs_getColor32(state.imageData, x - 1, y);
				if (j == 0) {
					c1 = ImgFuncs_getColor32(state.imageData, x - 1, y);
				} else if (j == i) {
					c1 = ImgFuncs_getColor32(state.imageData, x, y + 1);
				} else {
					c1 = (ImgFuncs_getColor32(state.imageData, x - 1, y) + ImgFuncs_getColor32(state.imageData, x, y + 1)) / 2;
				}
				ImgFuncs_setColor32(state.imageData, x, y, c1);

				y = state.brushPoint.y + 1 + i - j;
				x = state.brushPoint.x + j;
				if (j == 0) {
					c1 = ImgFuncs_getColor32(state.imageData, x + 1, y);
				} else if (j == i) {
					c1 = ImgFuncs_getColor32(state.imageData, x, y + 1);
				} else {
					c1 = (ImgFuncs_getColor32(state.imageData, x + 1, y) + ImgFuncs_getColor32(state.imageData, x, y + 1)) / 2;
				}
				ImgFuncs_setColor32(state.imageData, x, y, c1);

				x = state.brushPoint.x + 1 + i - j;
				y = state.brushPoint.y - j;
				if (j == 0) {
					c1 = ImgFuncs_getColor32(state.imageData, x + 1, y);
				} else if (j == i) {
					c1 = ImgFuncs_getColor32(state.imageData, x, y - 1);
				} else {
					c1 = (ImgFuncs_getColor32(state.imageData, x + 1, y) + ImgFuncs_getColor32(state.imageData, x, y - 1)) / 2;
				}
				ImgFuncs_setColor32(state.imageData, x, y, c1);

				y = state.brushPoint.y - 1 - i + j;
				x = state.brushPoint.x - j;
				if (j == 0) {
					c1 = ImgFuncs_getColor32(state.imageData, x - 1, y);
				} else if (j == i) {
					c1 = ImgFuncs_getColor32(state.imageData, x, y - 1);
				} else {
					c1 = (ImgFuncs_getColor32(state.imageData, x - 1, y) + ImgFuncs_getColor32(state.imageData, x, y - 1)) / 2;
				}
				ImgFuncs_setColor32(state.imageData, x, y, c1);
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
		for (let j = -3; j <= +3; ++j) {
			var s = 1 + state.brushSize / 2;
			var c0 = ImgFuncs_getColor32(state.imageData, x + j, y - s);
			for (let i = y - s; i < y + s; ++i) {
				var c = ImgFuncs_getColor32(state.imageData, x + j, i + 1);
				ImgFuncs_setColor32(state.imageData, x + j, i, c);
			}
			ImgFuncs_setColor32(state.imageData, x + j, i, c0);
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
		var rgb = ImgFuncs_getColorArr(state.imageData, x, y);
		for (let i = 0; i < 3; ++i) {
			if (rgb[i] < 0x5f) {
				rgb[i] += 2;
			}
		}
		ImgFuncs_setColorArr(state.imageData, x, y, rgb);

		var visited = {};


		for (let i = 0; i < state.brushSize * 4; ++i) {
			x = state.brushPoint.x;
			y = state.brushPoint.y;
			for (let j = 0; j < state.brushSize * 4 + 16; ++j) {
				var nx = x;
				var ny = y;
				switch (Math.floor(Math.random() * 4) % 4) {
					case 0:
						--nx;
						break;
					case 1:
						--ny;
						break;
					case 2:
						++nx;
						break;
					case 3:
						++ny;
						break;
				}

				if (visited[ny + ny * state.imageData.width]) {
					continue;
				}
				visited[nx + ny * state.imageData.width] = true;

				var rgb2 = ImgFuncs_getColorArr(state.imageData, nx, ny)
				var d = 0;
				for (let k = 0; k < 3; ++k) {
					d += Math.abs(rgb[k] - rgb2[k]);
				}
				if (d > 128 + rgb[0] / 2 + rgb[1] / 2 + rgb[2] / 2) {
					continue;
				}
				x = nx;
				y = ny;
				for (let k = 0; k < 3; ++k) {
					rgb2[k] = Math.floor((rgb[k] + rgb2[k]) / 2);
				}

				visited[x + y * state.imageData.width] = true;
				ImgFuncs_setColorArr(state.imageData, x, y, rgb2);
			}

			switch (Math.floor(Math.random() * 4) % 4) {
				case 0:
					--x;
					break;
				case 1:
					--y;
					break;
				case 2:
					++x;
					break;
				case 3:
					++y;
					break;
			}
			var rgb2 = ImgFuncs_getColorArr(state.imageData, x, y);
			var d = 0;
			for (let k = 0; k < 3; ++k) {
				d += Math.abs(rgb2[k] - rgb[k]);
			}
			if (d > 4) {
				ImgFuncs_setColorArr(state.imageData, x, y, new Array(Math.min(rgb2[0] + 1, 0xff), Math.min(rgb2[1] + 1, 0xff), Math.min(rgb2[2] + 1, 0xff)))
			} else {
				ImgFuncs_setColorArr(state.imageData, x, y, rgb);
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
		var rgb = ImgFuncs_getColorArr(state.imageData, x, y);
		for (let i = 0; i < 3; ++i) {
			if (rgb[i] < 0x5f) {
				rgb[i] += 2;
			}
		}
		ImgFuncs_setColorArr(state.imageData, x, y, rgb);

		var visited = {};

		for (let i = 0; i < state.brushSize; ++i) {
			x = state.brushPoint.x;
			y = state.brushPoint.y;
			for (let j = 0; j < state.brushSize * 4 + 16; ++j) {
				var nx = x;
				var ny = y;
				switch (Math.floor(Math.random() * 4) % 4) {
					case 0:
						--nx;
						break;
					case 1:
						--ny;
						break;
					case 2:
						++nx;
						break;
					case 3:
						++ny;
						break;
				}

				if (visited[ny + ny * state.imageData.width]) {
					continue;
				}
				visited[nx + ny * state.imageData.width] = true;

				var rgb2 = ImgFuncs_getColorArr(state.imageData, nx, ny)
				var d = 0;
				for (let k = 0; k < 3; ++k) {
					d += Math.abs(rgb[k] - rgb2[k]);
				}
				if (d > 128 + rgb[0] / 2 + rgb[1] / 2 + rgb[2] / 2) {
					continue;
				}
				x = nx;
				y = ny;
			}
			switch (Math.floor(Math.random() * 4) % 4) {
				case 0:
					--x;
					break;
				case 1:
					--y;
					break;
				case 2:
					++x;
					break;
				case 3:
					++y;
					break;
			}
			var mi = Math.min(x, state.brushPoint.x);
			var ma = Math.max(x, state.brushPoint.x);
			var miy = Math.min(y, state.brushPoint.y);
			var may = Math.max(y, state.brushPoint.y);

			for (let x = mi; x < ma; ++x) {
				for (let y = miy; y < may; ++y) {
					var rgb3 = ImgFuncs_getColorArr(state.imageData, x, y);
					for (let k = 0; k < 3; ++k) {
						rgb3[k] = ~~((rgb[k] + rgb3[k]) / 2);
					}
					ImgFuncs_setColorArr(state.imageData, x, y, rgb3);
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

		var rgb2 = new Array(255, 255, 255);
		var rgb3 = new Array(0, 0, 0);

		var s = 1 + state.brushSize / 2;
		for (let i = -s; i <= +s; ++i) {
			for (let j = -s; j <= +s; ++j) {
				var rgb1 = ImgFuncs_getColorArr(state.imageData, x + i, y + j);
				if (rgb1[0] + rgb1[1] + rgb1[2] < rgb2[0] + rgb2[1] + rgb2[2]) {
					rgb2[0] = rgb1[0];
					rgb2[1] = rgb1[1];
					rgb2[2] = rgb1[2];
				}
				if (rgb1[0] + rgb1[1] + rgb1[2] > rgb3[0] + rgb3[1] + rgb3[2]) {
					rgb3[0] = rgb1[0];
					rgb3[1] = rgb1[1];
					rgb3[2] = rgb1[2];
				}
			}
		}
		for (let i = -s; i <= +s; ++i) {
			for (let j = -s; j <= +s; ++j) {
				var rgb1 = ImgFuncs_getColorArr(state.imageData, x + i, y + j);
				for (let k = 0; k < 3; ++k) {
					if ((rgb1[0] + rgb1[1] + rgb1[2]) - (rgb2[0] + rgb2[1] + rgb2[2]) < (rgb3[0] + rgb3[1] + rgb3[2]) - (rgb1[0] + rgb1[1] + rgb1[2])) {
						if (rgb1[k] > rgb2[k]) {--rgb1[k]; }
					} else {
						if (rgb1[k] < rgb3[k]) {++rgb1[k]; }
					}
				}
				ImgFuncs_setColorArr(state.imageData, x + i, y + j, rgb1);
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
		var rgb = ImgFuncs_getColorArr(state.imageData, x, y);
		for (let i = 0; i < 3; ++i) {
			if (rgb[i] < 0x5f) {
				rgb[i] += 2;
			}
		}
		ImgFuncs_setColorArr(state.imageData, x, y, rgb);

		var visited = {};

		for (let i = 0; i < state.brushSize; ++i) {
			x = state.brushPoint.x;
			y = state.brushPoint.y;
			for (let j = 0; j < state.brushSize; ++j) {
				var nx = x;
				var ny = y;
				switch (Math.floor(Math.random() * 4) % 4) {
					case 0:
						--nx;
						break;
					case 1:
						--ny;
						break;
					case 2:
						++nx;
						break;
					case 3:
						++ny;
						break;
				}

				if (visited[ny + ny * state.imageData.width]) {
					continue;
				}
				visited[nx + ny * state.imageData.width] = true;

				var rgb2 = ImgFuncs_getColorArr(state.imageData, nx, ny)
				var d = 0;
				for (let k = 0; k < 3; ++k) {
					d += Math.abs(rgb2[k] - rgb[k]);
				}
				if (d < 32) {
					continue;
				}
				x = nx;
				y = ny;
				for (let k = 0; k < 3; ++k) {
					rgb2[k] += ~~((rgb2[k] - rgb[k]) / 8)
				}

				visited[x + y * state.imageData.width] = true;
				ImgFuncs_setColorArr(state.imageData, x, y, rgb2);
			}

			switch (Math.floor(Math.random() * 4) % 4) {
				case 0:
					--x;
					break;
				case 1:
					--y;
					break;
				case 2:
					++x;
					break;
				case 3:
					++y;
					break;
			}
			var rgb2 = ImgFuncs_getColorArr(state.imageData, x, y);
			for (let k = 0; k < 3; ++k) {
				rgb2[k] = rgb[k] - rgb2[k];
			}
			ImgFuncs_setColorArr(state.imageData, x, y, rgb2);
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
		for (let i = -s; i <= +s; ++i) {
			for (let j = -s; j <= +s; ++j) {
				if (!(i == s || i == -s || j == s || j == -s)) {
					continue;
				}
				var rgb1 = ImgFuncs_getColorArr(state.imageData, x + i, y + j);
				var rgb2 = ImgFuncs_getColorArr(state.imageData, x + i + 1, y + j);
				var rgb3 = ImgFuncs_getColorArr(state.imageData, x + i - 1, y + j);
				var rgb4 = ImgFuncs_getColorArr(state.imageData, x + i, y + j + 1);
				var rgb5 = ImgFuncs_getColorArr(state.imageData, x + i, y + j + 1);
				for (let k = 0; k < 3; ++k) {
					rgb1[k] = rgb2[k] ^ rgb3[k] ^ rgb4[k] ^ rgb5[k]
				}
				ImgFuncs_setColorArr(state.imageData, x + i, y + j, rgb1);
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
		var c1 = ImgFuncs_getColor32(state.imageData, j, k);
		for (let i = 0; i <= (s + 1) * (s + 1); ++i) {
			j += j_s;
			if (j >= x + s / 2 || j < x - s / 2) {
				j_s *= -1;
				++k;
				if (k >= y + s / 2) {
					k = y - s / 2;
				}
			}
			var c2 = ImgFuncs_getColor32(state.imageData, j, k);
			ImgFuncs_setColor32(state.imageData, j, k, c1);
			c1 = c2;
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
		var rgb = ImgFuncs_getColorArr(state.imageData, x, y);
		for (let i = 0; i < 3; ++i) {
			if (rgb[i] > 0) {
				rgb[i]--;
			}
		}
		ImgFuncs_setColorArr(state.imageData, x, y, rgb);

		var visited = {};

		for (let i = 0; i < state.brushSize * 2; ++i) {
			x = state.brushPoint.x;
			y = state.brushPoint.y;
			for (let j = 0; j < state.brushSize * 4 + 16; ++j) {
				var nx = x;
				var ny = y;
				switch (Math.floor(Math.random() * 4) % 4) {
					case 0:
						--nx;
						break;
					case 1:
						--ny;
						break;
					case 2:
						++nx;
						break;
					case 3:
						++ny;
						break;
				}

				if (visited[ny + ny * state.imageData.width]) {
					continue;
				}
				visited[nx + ny * state.imageData.width] = true;

				var rgb2 = ImgFuncs_getColorArr(state.imageData, nx, ny)
				var d = 0;
				for (let k = 0; k < 3; ++k) {
					d += Math.abs(rgb2[k] - rgb[k]);
				}
				if (d > 128 + rgb[0] / 2 + rgb[1] / 2 + rgb[2] / 2) {
					continue;
				}
				x = nx;
				y = ny;
			}

			switch (Math.floor(Math.random() * 4) % 4) {
				case 0:
					--x;
					break;
				case 1:
					--y;
					break;
				case 2:
					++x;
					break;
				case 3:
					++y;
					break;
			}
			var rgb2 = ImgFuncs_getColorArr(state.imageData, x, y);
			var d = 0;
			for (let k = 0; k < 3; ++k) {
				d += Math.abs(rgb2[k] - rgb[k]);
			}
			if (d < 4) {
				for (let k = 0; k < 3; ++k) {
					if (rgb2[k] > 0) {
						rgb2[k]--;
					}
				}
				ImgFuncs_setColorArr(state.imageData, x, y, rgb2)
			} else {
				var rgb3 = new Array((rgb2[0] + rgb[0]) / 2, (rgb2[1] + rgb[1]) / 2, (rgb2[2] + rgb[2]) / 2)
				ImgFuncs_setColorArr(state.imageData, x, y, rgb3);
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
	return x >>> 0;
}

function underflowMod(x, max) {
	return ((x % max) + max) % max;
}

function getByteOffset(x, y, width, height) {
	return ((((~~x % width) + width) % width) + (width * (((~~y % height) + height) % height))) * 4;
}

/* Image functions */

var ImgFuncs = {}

ImgFuncs.littleEndian = ((new Uint32Array((new Uint8Array([1, 2, 3, 4])).buffer))[0] === 0x04030201)

if (ImgFuncs.littleEndian == true) {
	ImgFuncs.fixEndian = function(number) {
		return ((number & 0xFF) << 24) // move byte 3 to byte 0
			|
			((number & 0xFF00) << 8) // move byte 1 to byte 2
			|
			((number >> 8) & 0xFF00) // move byte 2 to byte 1
			|
			((number >> 24) & 0xFF); // byte 0 to byte 3
	}
} else {
	ImgFuncs.fixEndian = function(number) {
		return number;
	}
}

// Gets a u32 for an idx value.
ImgFuncs.getColor32Idx = function(imageData, idx) {
	return ImgFuncs_fixEndian(imageData.u32[idx])
}

// Sets a u32 for an idx value.
ImgFuncs.setColor32Idx = function(imageData, idx, color) {
	imageData.u32[idx] = ImgFuncs_fixEndian(((color & 0xffffff00) | 0xff));
}

// Gets a u32 for an x,y coord.
ImgFuncs.getColor32 = function(imageData, x, y) {
	if (imageData.x128) {
		return ImgFuncs_fixEndian(imageData.u32[((~~(x + 128) & 127) + (128 * (~~(y + 128) & 127)))]);
	}
	if (imageData.x512) {
		return ImgFuncs_fixEndian(imageData.u32[((~~(x + 512) & 511) + (512 * (~~(y + 512) & 511)))]);
	}
	const width = imageData.width;
	const height = imageData.height;
	const byteOffset = ((~~(x + width * width) % width) + (width * (~~(y + height * height) % height)));
	return ImgFuncs_fixEndian(imageData.u32[byteOffset]);
}

// Sets a u32 for an x,y coord.
ImgFuncs.setColor32 = function(imageData, x, y, color) {
	if (imageData.x128) {
		imageData.u32[((~~(x + 128) & 127) + (128 * (~~(y + 128) & 127)))] = ImgFuncs_fixEndian(((color & 0xffffff00) | 0xff));
		return
	}
	if (imageData.x512) {
		imageData.u32[((~~(x + 512) & 511) + (512 * (~~(y + 512) & 511)))] = ImgFuncs_fixEndian(((color & 0xffffff00) | 0xff));
		return
	}
	const width = imageData.width;
	const height = imageData.height;
	const byteOffset = ((~~(x + width * width) % width) + (width * (~~(y + height * height) % height)));
	imageData.u32[byteOffset] = ImgFuncs_fixEndian(((color & 0xffffff00) | 0xff));
}

ImgFuncs.addBufferToImageData = function(imageData) {
	var u32 = imageData.u32;
	if (!u32) {
		u32 = new Uint32Array(imageData.data.buffer);
		imageData.u32 = u32;
		if (imageData.width == 128 && imageData.height == 128) {
			imageData.x128 = true;
		}
		if (imageData.width == 512 && imageData.height == 512) {
			imageData.x512 = true;
		}
	}

	var u8 = imageData.u8;
	if (!u8) {
		u8 = new Uint8Array(imageData.data.buffer);
		imageData.u8 = u8;
	}
}

// Gets a 3 item array for an x,y coord.
ImgFuncs.getColorArr = function(imageData, x, y) {
	const color = ImgFuncs_getColor32(imageData, x, y);
	// return new Uint8Array([(color >> 24) & 0xff, (color >> (16)) & 0xff, (color >> (8)) & 0xff]);
	return [(color >> 24) & 0xff, (color >> 16) & 0xff, (color >> 8) & 0xff];
}

// Gets a 3 item array for an x,y coord.
ImgFuncs.setColorArr = function(imageData, x, y, color) {
	const newColor = (((color[0] & 0xff) << 24) |
		((color[1] & 0xff) << 16) |
		((color[2] & 0xff) << 8) |
		(0xff));
	ImgFuncs_setColor32(imageData, x, y, newColor);
}

// Gets a channel value for an x,y coord.
ImgFuncs.getColorC = function(imageData, x, y, c) {
	if (imageData.x128) {
		return imageData.u8[(((~~(x + 128) & 127) + (128 * (~~(y + 128) & 127))) * 4) + c];
	}
	if (imageData.x512) {
		return imageData.u8[(((~~(x + 512) & 511) + (512 * (~~(y + 512) & 511))) * 4) + c];
	}
	const width = imageData.width;
	const height = imageData.height;
	const byteOffset = ((~~(x + width) % width) + (width * (~~(y + height) % height))) * 4;
	return imageData.u8[byteOffset + c];
}

// Sets a channel value for an x,y coord.
ImgFuncs.setColorC = function(imageData, x, y, c, color) {
	if (imageData.x128) {
		imageData.u8[(((~~(x + 128) & 127) + (128 * (~~(y + 128) & 127))) * 4) + c] = ((~~color % 256) + 256) % 256;
		return
	}
	if (imageData.x512) {
		imageData.u8[(((~~(x + 512) & 511) + (512 * (~~(y + 512) & 511))) * 4) + c] = ((~~color % 256) + 256) % 256;
		return
	}
	const width = imageData.width;
	const height = imageData.height;
	const byteOffset = ((~~(x + width) % width) + (width * (~~(y + height) % height))) * 4;
	imageData.u8[byteOffset + c] = ((~~color % 256) + 256) % 256;
}

// Converts a 3 item array to a uint32.
ImgFuncs.arrTo32 = function(arr) {
	const arr2 = [(~~arr[0]) & 255, (~~arr[1]) & 255, (~~arr[2]) & 255, 255];
	// arr2.push(255)
	// arr2[0] = (~~arr2[0]) & 255;
	// arr2[1] = (~~arr2[1]) & 255;
	// arr2[2] = (~~arr2[2]) & 255;
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
	const r = arr[0]
	const g = arr[1];
	const b = arr[2];

	let max = Math.max(r, g, b),
		min = Math.min(r, g, b),
		d = max - min,
		h,
		s = (max === 0 ? 0 : d / max),
		v = max / 255;

	switch (max) {
		case min:
			h = 0;
			break;
		case r:
			h = (g - b) + d * (g < b ? 6 : 0);
			h /= 6 * d;
			break;
		case g:
			h = (b - r) + d * 2;
			h /= 6 * d;
			break;
		case b:
			h = (r - g) + d * 4;
			h /= 6 * d;
			break;
	}

	return Array(h, s, v);
};

// Converts an hsv array to rgb.
ImgFuncs.HSVToRGB = function(arr) {
	const h = arr[0];
	const s = arr[1];
	const v = arr[2];
	let r, g, b, i, f, p, q, t;
	i = ~~(h * 6);
	f = h * 6 - i;
	p = v * (1 - s);
	q = v * (1 - f * s);
	t = v * (1 - (1 - f) * s);
	switch (i % 6) {
		case 0:
			r = v, g = t, b = p;
			break;
		case 1:
			r = q, g = v, b = p;
			break;
		case 2:
			r = p, g = v, b = t;
			break;
		case 3:
			r = p, g = q, b = v;
			break;
		case 4:
			r = t, g = p, b = v;
			break;
		case 5:
			r = v, g = p, b = q;
			break;
	}
	return Array(r * 255, g * 255, b * 255);
};

// Finds edges in a channel and colors them.
ImgFuncs.findEdges = function(surface, channel, level, colorArr) {
	for (let x = 0; x < surface.width; ++x) {
		for (let y = 0; y < surface.height; ++y) {
			var n = 0;
			var rgb1 = ImgFuncs_getColorArr(surface, x, y);
			if (x > 0) {
				var rgb2 = ImgFuncs_getColorArr(surface, x - 1, y);
				if (rgb1[channel] >= level && rgb2[channel] < level) ++n;
			}
			if (y > 0) {
				var rgb2 = ImgFuncs_getColorArr(surface, x, y - 1);
				if (rgb1[channel] >= level && rgb2[channel] < level) ++n;
			}
			if (x < surface.width - 1) {
				var rgb2 = ImgFuncs_getColorArr(surface, x + 1, y);
				if (rgb1[channel] >= level && rgb2[channel] < level) ++n;
			}
			if (y < surface.height - 1) {
				var rgb2 = ImgFuncs_getColorArr(surface, x, y + 1);
				if (rgb1[channel] >= level && rgb2[channel] < level) ++n;
			}
			if (n > 0) ImgFuncs_setColorArr(surface, x, y, colorArr);
		}
	}
	return surface
}

ImgFuncs.skewx = function(surface, fx, fy, fw, fh, by) {
	const get32 = ImgFuncs.getColor32;
	const set32 = ImgFuncs.setColor32;
	const height = surface.height;
	const width = surface.width;
	for (let y = 0; y < fh; ++y) {
		let ny = underflowMod(fy + y, height);
		let line = new Array();
		for (let x = 0; x < fw; ++x) {
			line.push(get32(surface, underflowMod(fx + x, width), ny));
		}
		for (let x = 0; x < fw; ++x) {
			let c1 = line[x];
			let off = (x + by) % fw;
			if (off < 0) {
				off = off + fw;
			}
			set32(surface, underflowMod(off, width), ny, c1);
		}
	}
}

ImgFuncs.skewy = function(surface, fx, fy, fw, fh, by) {
	const get32 = ImgFuncs.getColor32;
	const set32 = ImgFuncs.setColor32;
	const height = surface.height;
	const width = surface.width;
	for (let x = 0; x < fw; ++x) {
		let nx = underflowMod(fx + x, width);
		let line = new Array();
		for (let y = 0; y < fh; ++y) {
			line.push(get32(surface, nx, underflowMod(fy + y, height)));
		}
		for (let y = 0; y < fh; ++y) {
			let c1 = line[y];
			let off = (y + by) % fh;
			if (off < 0) {
				off = off + fh;
			}
			set32(surface, nx, underflowMod(off, height), c1);
		}
	}
}

ImgFuncs.skewx_channel = function(surface, fx, fy, fw, fh, by, channel) {
	const get32c = ImgFuncs.getColorC;
	const set32c = ImgFuncs.setColorC;
	const height = surface.height;
	for (let y = 0; y < fh; ++y) {
		let ny = underflowMod(fy + y, height);
		let line = [];
		for (let x = 0; x < fw; ++x) {
			line.push(get32c(surface, fx + x, ny, channel));
		}
		for (let x = 0; x < fw; ++x) {
			let channelValue = line[x];
			let off = (x + by) % fw;
			if (off < 0) {
				off = off + fw;
			}
			set32c(surface, off, ny, channel, channelValue);
		}
	}
}

// Returns the lesser elements of each channel between two arrays.
ImgFuncs.lesser = function(a, b) {
	var r = Math.min((a >> 24) & 0xff, (b >> 24) & 0xff);
	var g = Math.min((a >> 16) & 0xff, (b >> 16) & 0xff);
	var b = Math.min((a >> 8) & 0xff, (b >> 8) & 0xff);

	return (((r & 0xff) << 24) |
		((g & 0xff) << 16) |
		((b & 0xff) << 8) |
		(0xff));
}

// Returns the greater elements of each channel between two arrays.
ImgFuncs.greater = function(a, b) {

	var r = Math.max((a >> 24) & 0xff, (b >> 24) & 0xff);
	var g = Math.max((a >> 16) & 0xff, (b >> 16) & 0xff);
	var b = Math.max((a >> 8) & 0xff, (b >> 8) & 0xff);

	return (((r & 0xff) << 24) |
		((g & 0xff) << 16) |
		((b & 0xff) << 8) |
		(0xff));
}

ImgFuncs.swap = function(a, b) { return { a: a, b: b } }
ImgFuncs.unswap = function(a, b) { return { a: b, b: a } }

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
	var pix1 = new Uint32Array(imgDat1.data.buffer);
	var pix2 = new Uint32Array(imgDat2.data.buffer);
	var canvasWidth1 = imgDat1.width;
	var canvasWidth2 = imgDat2.width;
	for (let x = 0; x < imgDat1.width; ++x) {
		for (let y = 0; y < imgDat1.height; ++y) {
			var idx = y * imgDat1.width + x;
			for (let i = 0; i < scale; ++i) {
				for (let j = 0; j < scale; ++j) {
					pix2[(((y * scale) + j) * imgDat2.width) + (x * scale) + i] = pix1[idx];
				}
			}
		}
	}
	ImgFuncs.addBufferToImageData(imgDat2);
	return imgDat2
}

ImgFuncs.addTransparentPixel = function(imageData) {
	var dataCopy = new Uint8Array(imageData.data);
	var copy = new ImageData(imageData.width, imageData.height);
	copy.data.set(dataCopy);
	ImgFuncs.addBufferToImageData(copy);
	copy.data[3] = 250;
	return copy;
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
	ctx.drawImage(img, 0, 0);
	var data = ctx.getImageData(0, 0, w, h);
	return data;
}

ImgFuncs.fromDataURL = function(dataURL) {
	var img = new Image();
	img.src = dataURL;
	return ImgFuncs.fromImage(img);
}

ImgFuncs.flipline = function(surface, x, y) {
	var c = ImgFuncs_getColor32(surface, x, y);
	var d = Math.sqrt((x - y) * (x - y) * 2);
	var x1 = y - x;
	var y1 = x - y;
	var l = Math.sqrt(x1 * x1 + y1 * y1);
	if (l < 0.001) {
		l = 0.001;
	}
	x1 /= l;
	y1 /= l;
	for (let f = 0; f < d; f += 1.0, x += x1, y += y1) {
		ImgFuncs_setColor32(surface, ~~(x), ~~(y), c);
	}
}

// Returns a copy of an image data object.
ImgFuncs.copyData = function(imageData) {
	var dataCopy = new Uint8Array(imageData.data);
	var copy = new ImageData(imageData.width, imageData.height);
	copy.data.set(dataCopy);
	ImgFuncs.addBufferToImageData(copy);
	return copy;
}

// No fucking clue.
ImgFuncs.InPlacePyramid = function(to, from, filter) {
	var size = to.width;

	function cget(fx, fy, channel) {
		var point = filter(size, fx, fy);
		return ImgFuncs_getColorArr(from, point.x, point.y)[channel];
	}

	function cset(fx, fy, nx, ny, channel, color) {
		var dx = fx * 3 + nx;
		var dy = fy * 3 + ny;
		dx = Math.max(Math.min(size, dx), 0);
		dy = Math.max(Math.min(size, dy), 0);
		var ch = ImgFuncs_getColorArr(to, dx, dy)
		ch[channel] = ~~color;
		ImgFuncs_setColorArr(to, dx, dy, ch);
	}
	var count = 0;

	var coord = new Array({ x: 2, y: 2 }, { x: 1, y: 2 }, { x: 3, y: 2 }, { x: 2, y: 1 }, { x: 2, y: 3 }, { x: 1, y: 1 }, { x: 1, y: 3 }, { x: 3, y: 1 }, { x: 3, y: 3 });
	var max = Math.ceil(size / 3) + 1;
	for (let x = 0; x < max; ++x) {
		for (let y = 0; y < max; ++y) {
			for (let c = 0; c < 3; ++c) {
				var get = cget(x, y, c);
				var left = cget(x - 1, y, c);
				var right = cget(x + 1, y, c);
				var up = cget(x, y - 1, c);
				var down = cget(x, y + 1, c);

				var newup = (up + get) / 2;
				var newdown = (down + get) / 2;
				var newleft = (left + get) / 2;
				var newright = (right + get) / 2;

				var tab = new Array(get, newleft, newright, newup, newdown, (newup + newleft) / 2, (newdown + newleft) / 2, (newup + newright) / 2, (newdown + newright) / 2);
				for (let i = 0; i < tab.length; ++i) {
					var tc = coord[i];
					cset(x, y, tc.x, tc.y, c, tab[i]);
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
	context.drawImage(img, 0, 0);
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
	context.drawImage(img, 0, 0);
	ImgFuncs.boardData = context.getImageData(0, 0, img.width, img.height);
}
ImgFuncs.board.src = "board.png";

ImgFuncs.textify = function(imageData) {
	var fontData = ImgFuncs.fontData;
	if (!fontData) {
		return;
	}
	var toVisit = {};

	var any = 0;
	var fontSize = 8;
	for (let x = 0; x < imageData.width; ++x) {
		for (let y = 0; y < imageData.height; ++y) {
			var rgb = ImgFuncs_getColorArr(imageData, x, y);
			if (rgb[0] + rgb[1] + rgb[2] > 224 + 224 + 224) {
				toVisit[x + y * imageData.width] = true;
				ImgFuncs_setColor32(imageData, x, y, 0);
				any = 1;
			}
		}
	}
	if (any == 0) {
		return;
	}
	for (let x = 0; x < imageData.width; ++x) {
		for (let y = 0; y < imageData.height; ++y) {
			if (toVisit[x + y * imageData.width]) {
				var fx = fontSize * ~~(Math.random() * fontData.width / fontSize);
				var fy = fontSize * ~~(Math.random() * fontData.height / fontSize);
				for (let i = 0; i < fontSize; ++i) {
					for (let j = 0; j < fontSize; ++j) {
						ImgFuncs_setColor32(imageData, x + i, y + j, ImgFuncs_getColor32(fontData, fx + i, fy + j));
						toVisit[(x + i) + (y + j) * imageData.width] = false;
					}
				}
			}
		}
	}
}

ImgFuncs.similar = function(imgDat1, imgDat2) {
	var total = 0;
	var u81 = imgDat1.u8;
	var u82 = imgDat2.u8;
	var length = imgDat1.width * imgDat1.height * 4;
	for (let i = 0; i < length; i += 4) {
		// var a = u81[i] + u81[i + 1] + u81[i + 2];
		// var b = u82[i] + u82[i + 1] + u82[i + 2];
		// var weight = (Math.abs(u81[i] - u82[i]) + Math.abs(u81[i + 1] - u82[i + 1]) + Math.abs(u81[i + 2] - u82[i + 2])) / 2
		// var weight = (a - b) / 3
		// total += weight < 0 ? -weight : weight;
		total += Math.abs((u81[i] - u82[i]) + (u81[i + 1] - u82[i + 1]) + (u81[i + 2] - u82[i + 2])) / 3;
	}
	return total;
}

const ImgFuncs_fixEndian = ImgFuncs.fixEndian;
const ImgFuncs_arrTo32 = ImgFuncs.arrTo32;
const ImgFuncs_setColorC = ImgFuncs.setColorC;
const ImgFuncs_getColorC = ImgFuncs.getColorC;
const ImgFuncs_setColorArr = ImgFuncs.setColorArr;
const ImgFuncs_getColorArr = ImgFuncs.getColorArr;
const ImgFuncs_setColor32 = ImgFuncs.setColor32;
const ImgFuncs_getColor32 = ImgFuncs.getColor32;

/* Auto Artist */

Artsy.state.fran = true;
Artsy.state.franMoves = new Array();
Artsy.state.franEmotion = new Emotion(0, 0, 0, 0, 0, 0);

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
			for (let i = 0; i < actions.length; ++i) {
				var action = actions[i];
				if (action["emotion"]) {
					var emotion = action["emotion"];
					emotion.weight = state.franEmotion.compare(emotion);
					emotions.push(emotion);
				}
			}

			emotions.sort(function(a, b) {
				return b.weight - a.weight;
			});

			var max = emotions[0].weight;

			emotions = emotions.filter(function(e) { return Math.abs(e.weight - max) < 5 });

			var weights = new Array();

			for (let i = 0; i < emotions.length; i++) {
				var numa = emotions.length - i
				numa *= numa;
				for (let j = 0; j < numa; j++) {
					weights.push(i);
				}
			}

			var num = Math.floor(Math.random() * 10) + 1;
			var maxLen = 15;
			var len = Math.floor(Math.random() * maxLen) + 1;

			for (let i = 0; i < num; ++i) {
				var key = weights[Math.floor(Math.random() * weights.length)]
				var valid = emotions[key];
				if ((valid) && (!move[valid.keycode])) {
					move[valid.keycode] = true;
					state.franEmotion.addm(valid, 1 + len / maxLen);
				}
			}

			if (Object.keys(move).length > 0) {
				for (let i = 0; i < len; ++i) {
					state.franMoves.push(move);
				}
			}
		} else {
			var nonActions = actions.filter(function(a) { return a.affectsCanvas == false });
			var affectActions = actions.filter(function(a) { return a.affectsCanvas == true });

			var emotions = new Array()
			if (state.ticks % 8 == 0) {

				for (let i = 0; i < nonActions.length; i++) {
					emotions.push(nonActions[i]["emotion"]);
				}

				var num = Math.floor(Math.random() * 2) + 1;
				for (let i = 0; i < num; ++i) {
					var valid = emotions[Math.floor(Math.random() * emotions.length)]
					if ((valid) && (!move[valid.keycode])) {
						move[valid.keycode] = true;
					}
				}

			} else {
				var baseImg = ImgFuncs.scaleImageData(state.imageData, 0.25);
				var similar = ImgFuncs.scaleImageData(state.similar, 0.25);
				var oimageData = state.imageData;
				var osimilar = state.similar;
				ImgFuncs.addBufferToImageData(baseImg);
				ImgFuncs.addBufferToImageData(similar);
				state.imageData = null;
				state.similar = null;
				var baser = JSON.stringify(state);

				for (let i = 0; i < affectActions.length; i++) {
					var baseState = JSON.parse(baser);
					var action = affectActions[i];
					var emotion = action["emotion"];
					baseState.imageData = ImgFuncs.copyData(baseImg);
					ImgFuncs.addBufferToImageData(baseState.imageData);
					baseState = action.action(baseState);
					emotion.weight = ImgFuncs.similar(similar, baseState.imageData);
					emotions.push(emotion);

				}

				emotions.sort(function(a, b) {
					return a.weight - b.weight;
				});

				var max = emotions[0].weight;

				emotions = emotions.filter(function(e) { return Math.abs(e.weight - max) < 64 });

				var num = Math.floor(Math.random() * 8) + 1;
				for (let i = 0; i < num; ++i) {
					var valid = emotions[Math.floor(Math.random() * emotions.length)]
					if ((valid) && (!move[valid.keycode])) {
						move[valid.keycode] = true;
					}
				}

				state.imageData = oimageData;
				state.similar = osimilar;

			}
			state.franMoves.push(move);
		}
	}

	var move = state.franMoves.shift();
	if (move) {
		Players.autoArtist.keyStates = {};
		Players.autoArtist.pressStates = {};
		Players.autoArtist.keyStates = move;
		if (first == true) {
			Players.autoArtist.pressStates = move;
		}

		var keys = Object.keys(move);
		var actions = Artsy.allActions;
		var hasKeys = false;
		for (let i = 0; i < actions.length; ++i) {
			if (actions[i]["keycode"] > 0 && move[actions[i]["keycode"]] == true) {
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
