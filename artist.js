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
*/

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

	this.brushType = Math.floor(1 + Math.random() * 8) % 9;
	this.brushSize = Math.floor(16 + Math.random() * 56);
	if (this.brushType == 7) {
		this.brushSize = Math.ceil(this.brushSize / 2);
	}

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
	new TouchKey(27, 0 / 8, 0 / 8, 1 / 8, 1 / 8), // Reset / ESC
	new TouchKey(46, 1 / 8, 0 / 8, 1 / 8, 1 / 8), // Undo / Delete
	new TouchKey(13, 3 / 8, 0 / 8, 1 / 8, 1 / 8), // Enter
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

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

Artsy.constants = {
	defaultSize: (getUrlParameter("defaultSize") || 128),
	useCanvasPoints: (getUrlParameter("multitouch") || 1),
	canPlayContinuous: (getUrlParameter("continuous") || 1),
	midi: (getUrlParameter("midi") || 0),
	gamepad: (getUrlParameter("gamepad") || 0),
}

/* Properties */

Artsy.canvas = null;
Artsy.keyboard = null;

Artsy.createState = function(options = {}) {
	const defaultOptions = {
		size: Artsy.constants.defaultSize,
		brushSizeMultiplier: 1,
	}

	const theOptions = Object.assign(defaultOptions, options);
	const size = theOptions.size || Artsy.constants.defaultSize;

	let state = {
		canvasNeedsUpdate: true,
		width: size,
		height: size,
		imageData: new ImageData(size, size),
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
		similarImg: null,
		lastSaveTick: 0,
		eternal: false,
		autoArtistActivationTick: 0
	};

	state.fran = false;
	state.franMoves = new Array();
	state.franEmotion = new Emotion(0, 0, 0, 0, 0, 0);

	state.brushSizeMultiplier  = theOptions.brushSizeMultiplier || 1;

	return state;
} 

Artsy.state = Artsy.createState({});

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

	Artsy.state = Artsy.actions.greyFill.action(Artsy.state);
	Artsy.state = LevelFuncs.generateLevel(Artsy.state);

	document.addEventListener("keydown", Input.keyDownHandler, false);
	document.addEventListener("keyup", Input.keyUpHandler, false);
	main.addEventListener("touchstart", Input.touchMoveHandler, false);
	main.addEventListener("touchstart", Sounder.enableSounds, false);
	main.addEventListener("touchend", Input.touchMoveHandler, false);
	main.addEventListener("touchend", Sounder.enableSounds, false);
	main.addEventListener("touchmove", Input.touchMoveHandler, false);
	main.addEventListener("mousedown", Input.mouseDownHandler, false);
	main.addEventListener("mousedown", Sounder.enableSounds, false);
	main.addEventListener("mouseup", Input.mouseUpHandler, false);
	main.addEventListener("mousemove", Input.mouseMoveHandler, false);
	if (Artsy.constants.gamepad) {
		window.addEventListener("gamepadconnected", Input.gamepadConnected, false);
		window.addEventListener("gamepaddisconnected", Input.gamepadDisconnected, false);
	}

	Artsy.allActions = Artsy.findAllActions();
	Artsy.update();

	Artsy.canvas.ondragover = function() { this.className = 'hover'; return false; };
	Artsy.canvas.ondragend = function() { this.className = ''; return false; };
	Artsy.canvas.ondrop = function(e) {
		this.className = '';
		e.preventDefault();
		Artsy.readfiles(e.dataTransfer.files, false, Artsy.state);
	}

	Artsy.keyboard.ondragover = function() { this.className = 'hover'; return false; };
	Artsy.keyboard.ondragend = function() { this.className = ''; return false; };
	Artsy.keyboard.ondrop = function(e) {
		this.className = '';
		e.preventDefault();
		Artsy.readfiles(e.dataTransfer.files, true, Artsy.state);
	}

	Input.requestMIDIAccess();

};

Artsy.readfiles = function(files, similar, state) {
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
				let cnvWidth = state.width;
				let cnvHeight = state.height;
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
					state.similar = imgDat;
					var newImage = new Image();
					newImage.src = canvas.toDataURL();
					state.similarImg = newImage;
					state.fran = true;
					autoArtistActivationTick = state.ticks;
				} else {
					state.imageData = imgDat;
				}
				state.canvasNeedsUpdate = true;
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
	var copy = Artsy.state.prevCopy
	if (!copy) {
		copy = ImgFuncs.copyData(Artsy.state.imageData);
		Artsy.state.prevCopy = copy;
	}

	if (Artsy.constants.useCanvasPoints) {
		let canvasPoints = Input.allCanvasPoints();
		if (canvasPoints && canvasPoints.length > 0) {
			if (Artsy.constants.useCanvasPoints == "1") {
				for (let i = 0; i < canvasPoints.length; i++) {
					Artsy.state.brushPoint = canvasPoints[i];
					Players.keyboard.brushPoint = canvasPoints[i];
					Artsy.state = Artsy.actions.circle_thing.action(Artsy.state);
				}
			} else {
				Players.keyboard.brushPoint = canvasPoints[0];
			}
			Artsy.state.haskeyed = true;
			Artsy.state.fran = false;
			Players.autoArtist.isActive = Artsy.state.fran;
			Artsy.state.canvasNeedsUpdate = true;
		}
	} 

	// Update non-keyboard/touch inputs.
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

	if (!Artsy.state.paused) {
		Artsy.state.lockedRegions = Artsy.state.newLockedRegions.concat(Artsy.state.lockedRegions);
		for (let i = 0; i < Artsy.state.lockedRegions.length; ++i) {
			var region = Artsy.state.lockedRegions[i];
			if (region.lifetime <= 0) {
				break;
			}
			region.lifetime -= 1 / 60;
		}
		Artsy.state.lockedRegions = Artsy.state.lockedRegions.filter(region => region.lifetime > 0);
	}

	if (!Artsy.state.paused && Artsy.state.canvasNeedsUpdate == true) {

		Artsy.state.prevCopy = null;

		// For each locked region reset the region to it's state before the update.
		for (let i = 0; i < Artsy.state.lockedRegions.length; ++i) {
			var region = Artsy.state.lockedRegions[i];
			if (region.lifetime <= 0) {
				break;
			}
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

		Artsy.canvas.width = Artsy.state.width;
		Artsy.canvas.height = Artsy.state.height;
		var ctx = Artsy.canvas.getContext('2d');
		// ctx.drawImage(Artsy.state.imageData, 0, 0);
		ImgFuncs.putImageData(ctx, Artsy.state.imageData);

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

		Artsy.state.canvasNeedsUpdate = false;

		// Color new locked regions yellow.
		for (let i = 0; i < Artsy.state.newLockedRegions.length; ++i) {
			var region = Artsy.state.newLockedRegions[i];
			var size = region.size;
			var x = region.x * size;
			var y = region.y * size;
			ctx.fillStyle = "rgba(255,255,127,1)";
			ctx.fillRect(x, y, size, size);

			Artsy.state.canvasNeedsUpdate = true;
		}

		var message = [];
		if (Artsy.state.haskeyed == false) {
			message.push("BECOME A");
			message.push("GREAT ARTIST IN");
			message.push("JUST 10 SECONDS");
			message.push("Press key to art");
		}
		// Display auto artist message for about 3 seconds.
		if (Artsy.state.fran == true && Math.abs(Artsy.state.ticks - Artsy.state.autoArtistActivationTick) < 180) {
			message.push("Auto artist on");
		}
		if (message.length > 0 && Artsy.state.similar == null) {
			var size = 8;
			var offset = (message.length - 1) * (1 + size / 2);
			var maxWidth = 0
			ctx.fillStyle = "rgba(0,0,0,1.0)";
			for (let i = 0; i < message.length; ++i) {
				maxWidth = Math.max(message[i].length, maxWidth);
			}
			maxWidth *= size;
			ctx.fillRect(Artsy.state.imageData.width / 2 - maxWidth / 2, Artsy.state.imageData.height / 2 - size - offset, maxWidth, (size + 2) * message.length + size);
			if (ImgFuncs.fontData) {
				for (let i = 0; i < message.length; ++i) {
					let line = message[i];
					let y = Artsy.state.imageData.height / 2 + (i * size) - size + size / 2 - offset + i * 2;
					for (let j = 0; j < line.length; j++) {
						let x = Artsy.state.imageData.width / 2 - (line.length * size) / 2 + (j * size)
						let char = line.charCodeAt(j);
						let inx = char % 16;
						let iny = Math.floor(char / 16);
						// This is weird, you gotta offset the data from where it is in the source data...
						ctx.putImageData(ImgFuncs.fontData, x - inx * 8, y - iny * 8, inx * 8, iny * 8, 8, 8);
					}
				}
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

	// Set the snapshot state approximately every 10 seconds.
	if (!Artsy.state.eternal && Artsy.state.ticks - Artsy.state.lastSaveTick > 600) {
		Artsy.state = Artsy.actions.SDL_SCANCODE_EQUALS.action(Artsy.state);
	}

	Sounder.resetContinuous();
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
	for (let i = 0; i < keys.length; ++i) {
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
	for (let i = 0; i < keys.length; ++i) {
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
	Sounder.enableSounds();
	var keyCode = e.keyCode;

	if (keyCode == 192) { // Tilde
		Input.mouseCancel();
		Players.keyboard.pressStates = {};
		Players.keyboard.keyStates = {};
		Artsy.state.fran = !Artsy.state.fran;
		Artsy.state.autoArtistActivationTick = Artsy.state.ticks;
		Artsy.state.mouseDown = false
		Artsy.state.touches = [];
		Artsy.state.canvasNeedsUpdate = true;
	} else {
		if (Artsy.state.fran) {
			Artsy.state.fran = false;
			Players.autoArtist.pressStates = {};
			Players.autoArtist.keyStates = {};
			Artsy.state.canvasNeedsUpdate = true;
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

Input.mouseCancel = function() {
	Input.mouseDown = false;
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
	var allPoints = [];
	for (let i = 0; i < Input.touches.length; ++i) {
		var x = Input.touches[i].clientX;
		var y = Input.touches[i].clientY;
		allPoints.push({ x: x, y: y });
	}
	Input.pointHandler(allPoints);
}

Input.calcOffset = function(obj) {
	if (obj.offsetParent) {
		var parentOffset = Input.calcOffset(obj.offsetParent);
		return { x: parentOffset.x + obj.offsetLeft, y: parentOffset.y + obj.offsetTop };
	}
	return { x: 0, y: 0 };
}

// Handles all touches or mouse moves.
Input.pointHandler = function(allPoints) {

	var keyboard = Artsy.keyboard;
	if (keyboard) {
		var offset = Input.calcOffset(keyboard);
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

Input.allCanvasPoints = function() {
	var allPoints = [];
	for (let i = 0; i < Input.touches.length; ++i) {
		var x = Input.touches[i].clientX;
		var y = Input.touches[i].clientY;
		allPoints.push({ x: x, y: y });
	}
	if (Input.mouseDown == true) {
		allPoints.push(Input.mousePoint);
	}

	if (allPoints.length <= 0) {
		return [];
	}

	let canvas = Artsy.canvas;
	if (canvas) {
		var imgSize = Artsy.state.width;
		var offset = Input.calcOffset(canvas);
		var widthM = Artsy.state.width / canvas.offsetWidth;
		var heightM = Artsy.state.height / canvas.offsetHeight;

		var points = [];
		for (let i = 0; i < allPoints.length; ++i) {
			var x = Math.floor((allPoints[i].x - offset.x) * widthM);
			var y = Math.floor((allPoints[i].y - offset.y) * heightM);
			if (x >= 0 && x < Artsy.state.width && y >= 0 && y < Artsy.state.height) {
				points.push({ x: x, y: y });
			}
		}
		return points;
	}

	return [];
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
		if (gamepad.buttons) {
			if (gamepad.buttons[0] && gamepad.buttons[0].pressed) {
				this.aButton = true;
			}
			if (gamepad.buttons[1] &&gamepad.buttons[1].pressed) {
				this.bButton = true;
			}
			if (gamepad.buttons[2] &&gamepad.buttons[2].pressed) {
				this.cButton = true;
			}
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
	if (!Artsy.constants.gamepad) {
		return;
	}
	let gamepad = event.gamepad;
	if (gamepad.mapping !== "standard") {
		return;
	}
	
	console.log(gamepad);
	Input.gamepads.push(gamepad);

	var gamepadPlayer = new Player();
	gamepadPlayer.gamepad = gamepad;
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
	if (!Artsy.constants.midi) {
		return;
	}

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
	if (!Artsy.constants.gamepad) {
		return;
	}

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

Input.genericMidiDict = {
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

Input.updateMIDI = function() {

	var genericDict = Input.genericMidiDict;

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

	var newGallery = document.createElement("div");
	newGallery.id = "gallery";
	var close = document.createElement("div");
	close.className = "option";
	close.innerHTML = "X";
	close.onclick = function() { Gallery.displayGallery() };
	newGallery.appendChild(close);

	var native = false;
	if (("standalone" in window.navigator) && window.navigator.standalone) {
		native = true;
	}
	var imgTags = new Array(images.length).fill(0);
	for (let i = 0; i < images.length; ++i) {
		let j = i;
		ImgFuncs.loadImage(images[i], function(img) {
			var url = img.src;
			let extension = ".gif"
			if (img.src.indexOf("image/gif") == -1) {
				var data = ImgFuncs.fromImage(img);
				extension = ".png"
				url = ImgFuncs.toDataURL(ImgFuncs.addTransparentPixel(ImgFuncs.scaleImageData(data, 4)));
			}
			var imgTag = document.createElement("img")
			imgTag.src = url;
			imgTag.setAttribute("download", "img" + extension);
			imgTag.className = "art";
			let tag = imgTag;
			if (native) {
				// On native iOS the img callout doesn't work so make it a link
				var linkTag = document.createElement("a");
				linkTag.setAttribute("href", url);
				linkTag.appendChild(imgTag);
				linkTag.setAttribute("download", "img" + extension);
				tag = linkTag;
			}

			let divTag = document.createElement("div");
			divTag.className = "item";
			divTag.appendChild(tag);

			// We don't support cloning gifs
			if (img.src.indexOf("image/gif") == -1) {
				let cloneTag = document.createElement("a");
				cloneTag.innerHTML = "<img src=\"clone.png\">"
				cloneTag.className = "cloneButton";
				cloneTag.onclick = function() {
					Gallery.displayGallery();
					let data = ImgFuncs.fromImage(img);
					ImgFuncs.addBufferToImageData(data);
					Artsy.state.imageData = data;
					Artsy.state.canvasNeedsUpdate = true;
				};
				divTag.appendChild(cloneTag);
			}


			imgTags[j] = divTag;
			newGallery.appendChild(divTag);

			if (newGallery.childElementCount == images.length + 1) {
				while (newGallery.firstChild) {
					newGallery.removeChild(newGallery.firstChild);
				}
				newGallery.appendChild(close);
				for (let i = 0; i < imgTags.length; i++) {
					if (imgTags[i] != 0) {
						newGallery.appendChild(imgTags[i]);
					}
				}
			}
		});
	}
	document.body.appendChild(newGallery);

}

/* menu */

Menu = {};

Menu.display = function() {
	var currentMenu = document.getElementById("menu")
	if (currentMenu) {
		currentMenu.remove();
		return;
	}
	var newMenu = document.createElement("div");
	newMenu.id = "menu";
	var close = document.createElement("div");
	close.innerHTML = "X";
	close.onclick = function() { Menu.display() };
	newMenu.appendChild(close);

	var menuContents = document.createElement("div");
	menuContents.innerHTML = ``;
	newMenu.appendChild(menuContents);

	document.body.appendChild(newMenu);
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
		let width = output.width;
		let height = output.height;
		let scratch = new Uint32Array(9);
		for (let x = 0; x < width; ++x) {
			for (let y = 0; y < height; ++y) {

				scratch[0] = ImgFuncs_getColor32(output, x - 1, y);
				scratch[1] = ImgFuncs_getColor32(output, x + 1, y);
				scratch[2] = ImgFuncs_getColor32(output, x, y - 1);
				scratch[3] = ImgFuncs_getColor32(output, x, y + 1);
				scratch[7] = ImgFuncs_getColor32(state.imageData, x, y);

				for (let i = 1; i < 4; ++i) {
					scratch[4] = 0;
					scratch[6] = i * 8;

					if (x > 0) {
						scratch[4] |= (scratch[0] >> (scratch[6])) & 0xff;
					}
					if (y > 0) {
						scratch[4] |= (scratch[2] >> (scratch[6])) & 0xff;
					}
					if (x < width - 1) {
						scratch[4] |= (scratch[1] >> (scratch[6])) & 0xff;
					}
					if (y < height - 1) {
						scratch[4] |= (scratch[3] >> (scratch[6])) & 0xff;
					}

					scratch[8]= (scratch[7] | (scratch[4] << scratch[6]));
					if (scratch[8] > scratch[7]) {
						++scratch[7];
					} else if (scratch[8] < scratch[7]) {
						--scratch[7];
					}
					scratch[7] |= 0xff
				}
				ImgFuncs_setColor32(state.imageData, x, y, scratch[7]);
			}
		}

		state.imageData = output;
		Sounder.playContinuousMap(this.keycode)
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
		Sounder.playContinuousMap(this.keycode)
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
				for (let i = 0; i < 3; ++i) {
					c1[i] = ((c1[i] % 64) + (61 * Math.floor(c1[i] / 64)) + (2 * Math.floor(c2[i] / 64)) + Math.floor(c2[(i + 1) % 3] / 64)) % 256;
				}

				var rgb1 = ImgFuncs_arrTo32(c1)

				ImgFuncs_setColor32(output, x, y, rgb1);
			}
		}

		state.imageData = output;
		Sounder.playContinuousMap(this.keycode)
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
		Sounder.playContinuousMap(this.keycode)
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
		Sounder.playContinuousMap(this.keycode)
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
		Sounder.playContinuousMap(this.keycode)
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
		Sounder.playContinuousMap(this.keycode)
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
		Sounder.playContinuousMap(this.keycode)
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
		Sounder.playContinuousMap(this.keycode)
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
		Sounder.playContinuousMap(this.keycode)
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
		Sounder.playContinuousMap(this.keycode)
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
		Sounder.playContinuousMap(this.keycode)
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
		Sounder.playContinuousMap(this.keycode)
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
		const w = state.imageData.width;
		const h = state.imageData.height;
		const max = w * h;

		function idx(_i) {
			var __i = _i - 1;
			return { x: __i % w, y: Math.floor(__i / w) };
		}

		function unidx(_i) {
			var __i = max - _i;
			return { x: __i % w, y: Math.floor(__i / w) };
		}

		function pass(idxf, swapf) {
			let pt = idxf(1);
			let x2 = pt.x;
			let y2 = pt.y;
			let c2 = ImgFuncs_getColor32(output, x2, y2);
			let x1 = x2;
			let y1 = y2;
			let pt2 = pt;
			let c1 = c2;
			for (let i = 1; i < max - 1; ++i) {
				x1 = x2;
				y1 = y2;
				pt2 = idxf(i + 1)
				x2 = pt2.x;
				y2 = pt2.y;
				c1 = c2;
				c2 = ImgFuncs_getColor32(output, x2, y2);
				const colors = swapf(ImgFuncs.lesser(c1, c2), ImgFuncs.greater(c1, c2));
				ImgFuncs_setColor32(output, x1, y1, colors.a);
				ImgFuncs_setColor32(output, x2, y2, colors.b);
				c2 = colors.b;
			}
		}
		for (let im = 1; im <= 4; ++im) {
			pass(idx, ImgFuncs.swap);
			pass(unidx, ImgFuncs.unswap);
		}
		state.imageData = output;
		Sounder.playContinuousMap(this.keycode)
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
		Sounder.playContinuousMap(this.keycode)
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
		Sounder.playContinuousMap(this.keycode)
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
		Sounder.playContinuousMap(this.keycode)
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
		Sounder.playContinuousMap(this.keycode)
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

Artsy.actions.SDL_SCANCODE_SPACE = {
	name: "circle_thing",
	affectsCanvas: true,
	keycode: 32, // SPACE
	emotion: new Emotion(32, 0, 0, 0, 0, 0),
	action: function(state) {
		return Artsy.actions.circle_thing.action(state);
	}
}

Artsy.actions.circle_thing = {
	name: "circle_thing",
	affectsCanvas: true,
	action: function(state) {
		var thisState = state;
		var brushes = Artsy.findAllBrushes();

		for (let i = 0; i < brushes.length; ++i) {
			var brush = brushes[i];
			if (brush.number == state.brushType) {
				thisState = brush.action(thisState);
			}
		}
		Sounder.playContinuousMap("brush","blast-cut");
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
		Input.mouseCancel();
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
		Input.mouseCancel();
		return state;
	}
}

Artsy.actions.Reset = {
	name: "Reset",
	affectsCanvas: true,
	pressCode: 27, // 'esc'
	action: function(state) {
		state = LevelFuncs.generateLevel(state);
		// Play a random sound.
		Sounder.playSound("sfx_" + Math.floor(Math.random() * 9) % 9);
		return state;
	}
}

// Artsy.actions.Menu = {
// 	name: "Menu",
// 	affectsCanvas: false,
// 	pressCode: 27, // 'esc'
// 	action: function(state) {
// 		Menu.display()
// 		state.keyStates = {};
// 		state.pressStates = {};
// 		state.mouseDown = {};
// 		state.touches = [];
// 		Input.mouseCancel();
// 		return state;
// 	}
// }

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
		state.brushSize = 1 * state.brushSizeMultiplier;
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
		state.brushSize = 2 * state.brushSizeMultiplier;
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
		state.brushSize = 4 * state.brushSizeMultiplier;
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
		state.brushSize = 8 * state.brushSizeMultiplier;
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
		state.brushSize = 16 * state.brushSizeMultiplier;
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
		state.brushSize = 24 * state.brushSizeMultiplier;
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
		state.brushSize = 32 * state.brushSizeMultiplier;
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
		state.brushSize = 56 * state.brushSizeMultiplier;
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
		state.brushSize = 64 * state.brushSizeMultiplier;
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
		state.brushSize = 96 * state.brushSizeMultiplier;
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
		state.brushSize = 128 * state.brushSizeMultiplier;
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
		state.lastSaveTick = state.ticks;
		Sounder.playSound("sfx_6")
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
		state.lastSaveTick = state.ticks;
		state.saveState = { imageData: ImgFuncs.copyData(state.imageData) }
		Sounder.playSound("sfx_7")
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
		var s = 1 + state.brushSize / 2;
		for (let j = x - 3; j <= x + 3; ++j) {
			var c0 = ImgFuncs_getColor32(state.imageData, j, y - s);
			for (let i = y - s; i < y + s; ++i) {
				var c = ImgFuncs_getColor32(state.imageData, j, i + 1);
				ImgFuncs_setColor32(state.imageData, j, i, c);
			}
			ImgFuncs_setColor32(state.imageData, j, y + s, c0);
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
		var x = (state.brushPoint.x) + state.width;
		var y = (state.brushPoint.y) + state.height;
		var s = 1 + state.brushSize;
		var j = x;
		var k = y;
		var j_s = 1;
		var c1 = ImgFuncs_getColor32(state.imageData, j, k);
		for (let i = 0; i <= (s + 1) * (s + 1); ++i) {
			j += j_s;
			if ((j >= x + s / 2) || (j < x - s / 2)) {
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
Sounder.sounds = [];
window.AudioContext = window.AudioContext || window.webkitAudioContext;
Sounder.audioContext = new AudioContext();
Sounder.lastSound = null;
Sounder.soundsLoaded = 0;

Sounder.enableSounds = function() {
	// Load and play a blank sound to enable sound in safari
	if (Sounder.audioContext.state == "suspended") {
		Sounder.soundsLoaded = 0;
		Sounder.audioContext.resume();
	}
	if (Sounder.audioContext.state != "running") {
		Sounder.audioContext = new AudioContext();
		Sounder.soundsLoaded = 0;
	}
	if (Sounder.soundsLoaded > 10) {
		return;
	}
	Sounder.soundsLoaded += 1;
	var source = Sounder.audioContext.createBufferSource();
	source.connect(Sounder.audioContext.destination);
	source.start(0);
}

Sounder.loadSound = function(soundName, callBack) {
	if (Sounder.sounds[soundName]) {
		callBack(Sounder.sounds[soundName]);
		return;
	}
	var request = new XMLHttpRequest();
	request.open('GET', "audio\\" + soundName + ".mp3", true);
	request.responseType = 'arraybuffer';

	let onError = function(error) {
		console.log(error);
	}

	// Decode asynchronously
	request.onload = function() {
		Sounder.audioContext.decodeAudioData(request.response, function(buffer) {
			Sounder.sounds[soundName] = buffer;
			callBack(buffer);
		}, onError);
	}
	request.send();
}

Sounder.playSound = function(soundName) {
	if (Artsy.state.fran) {
		return false;
	}
	if (Sounder.lastSource) {
		try { Sounder.lastSource.stop(); } catch (e) {}
	}
	Sounder.loadSound(soundName, buffer => {
		var source = Sounder.audioContext.createBufferSource(); // creates a sound source
		source.buffer = buffer;                    // tell the source which sound to play
		source.connect(Sounder.audioContext.destination);       // connect the source to the context's destination (the speakers)
		source.start(0);
		if (Sounder.lastSource) {
			try { Sounder.lastSource.stop(); } catch (e) {}
		}
		Sounder.lastSource = source;   
	})
}

Sounder.continuousMap = {};
Sounder.continuousStates = {};
Sounder.continuousSources = {};

Sounder.playContinuousMap = function(id, directSound) {
	if(!id) {
		return;
	}
	if (directSound) {
		Sounder.continuousMap[id] = directSound;
	}
	if (!Sounder.continuousMap[id]) {
		let sounds = ["wah-cut","quiet-cut","buzzy-cut","blast-cut","wah-cut-up","quiet-cut-up","buzzy-cut-up","blast-cut-up"];
		let idx = Math.floor(Math.random() * sounds.length * sounds.length) % sounds.length;
		Sounder.continuousMap[id] = sounds[idx];
	}
	Sounder.playContinuous(id, Sounder.continuousMap[id])
}

Sounder.playContinuous = function(id, soundName) {
	if (!Artsy.constants.canPlayContinuous) {
		return;
	}
	if (!id || !soundName) {
		return;
	}
	if (Sounder.continuousStates[id]) {
		return;
	}
	Sounder.continuousStates[id] = 1;
	if (Sounder.continuousSources[id]) {
		return;
	}
	Sounder.loadSound(soundName, buffer => {
		var source = Sounder.audioContext.createBufferSource(); // creates a sound source
		source.loop = true;
		source.buffer = buffer;                    // tell the source which sound to play
		let gain = Sounder.audioContext.createGain();
		gain.gain.value = 0.75;
		source.connect(gain);  
		gain.connect(Sounder.audioContext.destination);       // connect the source to the context's destination (the speakers)
		source.start(0);
		if (Sounder.continuousSources[id]) {
			try { Sounder.continuousSources[id].stop(); } catch (e) {}
		}
		Sounder.continuousSources[id] = source;   
	})
}

Sounder.resetContinuous = function() {
	let keys = Object.keys(Sounder.continuousStates);
	keys.forEach( key => {
		if (!Sounder.continuousStates[key]) {
			Sounder.stopContinuous(key)
		} 
		Sounder.continuousStates[key] = 0;
	})
}

Sounder.stopContinuous = function(id) {
	Sounder.continuousStates[id] = 0;
	if (Sounder.continuousSources[id]) {
		try { Sounder.continuousSources[id].stop(); } catch (e) {}
	}
	Sounder.continuousSources[id] = null;
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

const ImgFuncs = {}

ImgFuncs.littleEndian = ((new Uint32Array((new Uint8Array([1, 2, 3, 4])).buffer))[0] === 0x04030201)

if (ImgFuncs.littleEndian == true) {
	ImgFuncs.fixEndian = function(number) {
		return ((number & 0xFF) << 24) // move byte 3 to byte 0
			| ((number & 0xFF00) << 8) // move byte 1 to byte 2
			| ((number >> 8) & 0xFF00) // move byte 2 to byte 1
			| ((number >> 24) & 0xFF); // byte 0 to byte 3
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
	// return imageData.dataView.getUint32(byteOffset * 4);
	return ImgFuncs_fixEndian(imageData.u32[imageData.byteOffset(x,y)]);
}

// Sets a u32 for an x,y coord.
ImgFuncs.setColor32 = function(imageData, x, y, color) {
	// imageData.dataView.setUint32(byteOffset * 4, ((color & 0xffffff00) | 0xff));
	imageData.u32[imageData.byteOffset(x,y)] = ImgFuncs_fixEndian(((color & 0xffffff00) | 0xff));
}

ImgFuncs.addBufferToImageData = function(imageData) {
	let u32 = imageData.u32;
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

	let u8 = imageData.u8;
	if (!u8) {
		u8 = new Uint8Array(imageData.data.buffer);
		imageData.u8 = u8;
	}

	function powerOfTwo(x) {
		 return (Math.log(x)/Math.log(2)) % 1 === 0;
	}

	if (!imageData.byteOffset) {
		const width = ~~imageData.width;
		const height = ~~imageData.height;
		if (imageData.width == 128 && imageData.height == 128) {
			imageData.byteOffset = function(x, y) {
				return (((~~x + 128) & 127) + (128 * ((~~y + 128) & 127)))
			}
		}
		else if (powerOfTwo(width) && powerOfTwo(height)) {
			const widthM = ~~(width - 1);
			const heightM = ~~(height - 1);
			imageData.byteOffset = function(x, y) {
				return (((~~x + width) & widthM) + (width * ((~~y + height) & heightM)))
			}
		}
		else {
			imageData.byteOffset = function(x, y) {
				let i = ((~~(x + width * width) % width) + (width * (~~(y + height * height) % height)));
				return i;
			}
		}
	}

	// if (!imageData.dataView) {
	// 	imageData.dataView = new DataView(imageData.data.buffer)
	// }
}

// Gets a 3 item array for an x,y coord.
ImgFuncs.getColorArr = function(imageData, x, y) {
	const color = ImgFuncs_getColor32(imageData, x, y);
	// return new Uint8Array([(color >> 24) & 0xff, (color >> (16)) & 0xff, (color >> (8)) & 0xff]);
	return [(color >> 24) & 0xff, (color >> 16) & 0xff, (color >> 8) & 0xff];
}

// Gets a 3 item array for an x,y coord.
ImgFuncs.setColorArr = function(imageData, x, y, color) {
	// const newColor = (((color[0] & 0xff) << 24) |
	// 	((color[1] & 0xff) << 16) |
	// 	((color[2] & 0xff) << 8) |
	// 	(0xff));
	ImgFuncs_setColor32(imageData, x, y, (((color[0] & 0xff) << 24) |
		((color[1] & 0xff) << 16) |
		((color[2] & 0xff) << 8) |
		(0xff)));
}

// Gets a channel value for an x,y coord.
ImgFuncs.getColorC = function(imageData, x, y, c) {
	const byteOffset = imageData.byteOffset(x,y) * 4;
	return imageData.u8[byteOffset + c];
}

// Sets a channel value for an x,y coord.
ImgFuncs.setColorC = function(imageData, x, y, c, color) {
	const byteOffset = imageData.byteOffset(x,y) * 4;
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
ImgFuncs.lesser = function(x, y) {
	const r = Math.min((x >> 24) & 0xff, (y >> 24) & 0xff);
	const g = Math.min((x >> 16) & 0xff, (y >> 16) & 0xff);
	const b = Math.min((x >> 8) & 0xff, (y >> 8) & 0xff);

	return (((r & 0xff) << 24) |
		((g & 0xff) << 16) |
		((b & 0xff) << 8) |
		(0xff));
}

// Returns the greater elements of each channel between two arrays.
ImgFuncs.greater = function(x, y) {
	const r = Math.max((x >> 24) & 0xff, (y >> 24) & 0xff);
	const g = Math.max((x >> 16) & 0xff, (y >> 16) & 0xff);
	const b = Math.max((x >> 8) & 0xff, (y >> 8) & 0xff);

	return (((r & 0xff) << 24) |
		((g & 0xff) << 16) |
		((b & 0xff) << 8) |
		(0xff));
}

ImgFuncs.swap = function(a, b) { return { a: a, b: b } }
ImgFuncs.unswap = function(a, b) { return { a: b, b: a } }

// Returns a dataURL for an imageData object.
ImgFuncs.toDataURL = function(imageData) {
	let canvas = document.createElement("canvas");
	canvas.width = imageData.width;
	canvas.height = imageData.height;
	let ctx = canvas.getContext('2d');
	ctx.putImageData(imageData, 0, 0);
	return canvas.toDataURL();
}

// Nearest neighbor scale for an imageData.
ImgFuncs.scaleImageData = function(imgDat1, scale) {
	let imgDat2 = new ImageData(imgDat1.width * scale, imgDat1.height * scale);
	let pix1 = new Uint32Array(imgDat1.data.buffer);
	let pix2 = new Uint32Array(imgDat2.data.buffer);
	let canvasWidth1 = imgDat1.width;
	let canvasWidth2 = imgDat2.width;
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
	let copy = new ImageData(imageData.width, imageData.height);
	copy.data.set(imageData.data);
	ImgFuncs.addBufferToImageData(copy);
	copy.data[3] = 250;
	return copy;
}


ImgFuncs.loadImage = function(url, callBack) {
	let img = new Image();
	img.onload = function() {
		callBack(img);
	}
	img.src = url;
}

ImgFuncs.fromImage = function(img) {
	let w = img.width;
	let h = img.height;
	let canvas = Artsy.createCanvas(w, h);
	let ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0);
	let data = ctx.getImageData(0, 0, w, h);
	return data;
}

ImgFuncs.fromDataURL = function(dataURL) {
	let img = new Image();
	img.src = dataURL;
	return ImgFuncs.fromImage(img);
}

ImgFuncs.flipline = function(surface, x, y) {
	const c = ImgFuncs_getColor32(surface, x, y);
	const d = Math.sqrt((x - y) * (x - y) * 2);
	let x1 = y - x;
	let y1 = x - y;
	let l = Math.sqrt(x1 * x1 + y1 * y1);
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
	const copy = new ImageData(imageData.width, imageData.height);
	copy.data.set(imageData.data);
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
	let canvas = document.createElement('canvas');
	let context = canvas.getContext('2d');
	let img = ImgFuncs.font
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
	let canvas = document.createElement('canvas');
	let context = canvas.getContext('2d');
	let img = ImgFuncs.board
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
	let total = 0;
	let u81 = imgDat1.u8;
	let u82 = imgDat2.u8;
	let length = imgDat1.width * imgDat1.height * 4;
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

ImgFuncs.putImageData = function(ctx, imageData) {
	ctx.putImageData(imageData, 0, 0);
};

const ImgFuncs_fixEndian = ImgFuncs.fixEndian;
const ImgFuncs_arrTo32 = ImgFuncs.arrTo32;
const ImgFuncs_setColorC = ImgFuncs.setColorC;
const ImgFuncs_getColorC = ImgFuncs.getColorC;
const ImgFuncs_setColorArr = ImgFuncs.setColorArr;
const ImgFuncs_getColorArr = ImgFuncs.getColorArr;
const ImgFuncs_setColor32 = ImgFuncs.setColor32;
const ImgFuncs_getColor32 = ImgFuncs.getColor32;

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

/* Auto Artist */

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

/* Level generator functions */

const LevelFuncs = {};

LevelFuncs.generateLevel = function(state) {


	let color_make = function(r,g,b) {
		return (((r & 0xff) << 24) |
		((g & 0xff) << 16) |
		((b & 0xff) << 8) |
		(0xff));
	}

	let rand = function() {
		return Math.floor(Number.MAX_SAFE_INTEGER * Math.random());
	}

	let randInt = function(start,end) {
		let len = Math.abs(end - start);
		return start + (rand() % len);
	}

	let black = color_make(0,0,0);
	let white = color_make(255,255,255);

	let trueRandom = function() { return color_make(randInt(0, 255), randInt(0, 255), randInt(0, 255)); }
	let bitRandom = function() { return Math.random()>0.5 ? black : white;  }
	let trueBitRandom = function() { return color_make(Math.random()>0.5 ? 0 : 255, Math.random()>0.5 ? 0 : 255, Math.random()>0.5 ? 0 : 255) }

	let cset = function(newboard, fx,fy, nx, ny, channel, color) {
		var dx = (fx) * 3 + (nx);
		var dy = (fy) * 3 + (ny);
		var ch = ImgFuncs_getColorArr(newboard, dx, dy)
		ch[~~channel % 3] = ~~color;
		ImgFuncs_setColorArr(newboard, dx, dy, ch);
	}

	function thresh_cset(board, fx,fy, nx, ny, channel, color) {
		color > LevelFuncs.levelState.thresh ? color = 255 : color = 0;
		cset(board,fx,fy,nx,ny,channel,color);
	}
	function thresh2_cset(board, fx,fy, nx, ny, channel, color) {
		if (color < LevelFuncs.levelState.thresh) { color = 0; }
		if (color > LevelFuncs.levelState.thresh2) { color = 255; }
		cset(board,fx,fy,nx,ny,channel,color);
	}
	function anti_cget(x, xd, y, yd, channel) {
		let nx = x;
		let ny = y
		if (xd != 0) { nx = LevelFuncs.levelState.size - (x+xd) + 1; }
		if (yd != 0) { ny = LevelFuncs.levelState.size - (y+xd) + 1; }
		nx = Math.max(Math.min(LevelFuncs.levelState.size, nx), 1);
		ny = Math.max(Math.min(LevelFuncs.levelState.size, ny), 1);
		return ImgFuncs_getColorArr(LevelFuncs.levelState.state, nx-1, ny-1)[channel];
	}

	let bw_random_override = function(x,y,c) {
		if (y != LevelFuncs.levelState.lasty) { // -- Much magic knowledge about loop here
			if (Math.random()>0.5) {
				LevelFuncs.levelState.yes = 0xFF;
				LevelFuncs.levelState.no = 0x00;
			}
			else {
				LevelFuncs.levelState.yes = 0x00;
				LevelFuncs.levelState.no = 0xFF;
			}
			LevelFuncs.levelState.lasty = y;
		}
		return LevelFuncs.levelState.yes || LevelFuncs.levelState.no;
	}

	/// STATE SETTING

	LevelFuncs.levelState = {};

	var surface = new ImageData(state.width, state.height);
	ImgFuncs.addBufferToImageData(surface);
	for (let x = 0; x<state.width; x++) {
		for (let y = 0; y<state.width; y++) {
			ImgFuncs_setColor32(surface, x, y, black);
		}
	}
	let generators = [
	(() => LevelFuncs.pyramidGenerator(surface, {})),
	(() => LevelFuncs.pyramidGenerator(surface, {random: trueRandom})),
	(() => LevelFuncs.pyramidGenerator(surface, {random: trueBitRandom})),
// 	PyramidGenerator({mutate_tab=function(self,i,tabcount) return rotate(i,math.random(0,3)*2, 2,tabcount-1) end}),
	(() => LevelFuncs.pyramidGenerator(surface, {mutate_tab: function(i, tabcount, channel) { return LevelFuncs.levelState.rotate(i, randInt(0,3) * 2, 2,tabcount-2) }})),
// 	PyramidGenerator({mutate_tab=function(self,i,tabcount,channel) return rotate(i,channel+1, 2,tabcount-1) end}),
	(() => LevelFuncs.pyramidGenerator(surface, {mutate_tab: function(i, tabcount, channel) { return LevelFuncs.levelState.rotate(i,channel+1, 2,tabcount - 2) }})),
	// PyramidGenerator({centerget=truerandom}),
	(() => LevelFuncs.pyramidGenerator(surface, {centerget: trueRandom})),
// 	PyramidGenerator({centerget=truerandom,random=truerandom}),
	(() => LevelFuncs.pyramidGenerator(surface, {centerget: trueRandom, random: trueRandom})),
// 	PyramidGenerator({centerget=bw_random_override}),
	(() => LevelFuncs.pyramidGenerator(surface, {centerget: bw_random_override})),
// 	PyramidGenerator({centerget=bw_random_override, random=truerandom}),
	(() => LevelFuncs.pyramidGenerator(surface, {centerget: bw_random_override, random: trueRandom})),
	
// 	-- STICKETS?! (24)
	// PyramidGenerator({thresh=255/2, cset=thresh_cset, random=truebitrandom}),
	(() => LevelFuncs.pyramidGenerator(surface, {thresh:255/2, cset:thresh_cset, random: trueBitRandom})),
// 	PyramidGenerator({thresh=255/2, cset=thresh_cset, random=truerandom}),
	(() => LevelFuncs.pyramidGenerator(surface, {thresh:255/2, cset:thresh_cset, random: trueRandom})),
	
// 	-- Girder city (27)
// 	PyramidGenerator({thresh=255/2, cset=thresh_cset, random=truerandom, cget=anti_cget}),
	(() => LevelFuncs.pyramidGenerator(surface, {thresh:255/2, cset:thresh_cset, random: trueRandom, cget:anti_cget})),
// --	PyramidGenerator({thresh=255/2, cset=thresh_cset, cget=anti_cget}), -- BW above
		
// 	-- Calmgirder (29)
// 	PyramidGenerator({thresh=255*1/3, thresh2=255*2/3, cset=thresh2_cset, random=truebitrandom, cget=anti_cget}),
	(() => LevelFuncs.pyramidGenerator(surface, {thresh:255/3, thresh2:255 * 2/3, cset:thresh2_cset, random: trueBitRandom, cget:anti_cget})),
	(() => LevelFuncs.pyramidGenerator(surface, {thresh:255/3, cset:thresh_cset, random: trueRandom, cget:anti_cget})),
	// PyramidGenerator({thresh=255*1/3, thresh2=255*2/3, cset=thresh2_cset, random=bitrandom, cget=anti_cget}),
	(() => LevelFuncs.pyramidGenerator(surface, {thresh:255/3, thresh2:255 * 2/3, cset:thresh2_cset, random: bitRandom, cget:anti_cget})),
	
// 	-- Purr (31)
// 	PyramidGenerator({thresh=255*2/5, thresh2=255*3/5, cset=thresh2_cset, random=bitrandom}),
	(() => LevelFuncs.pyramidGenerator(surface, {thresh:255*2/5, thresh2:255 * 3/5, cset:thresh2_cset, random: bitRandom})),
	(() => LevelFuncs.pyramidGenerator(surface, {thresh:255*2/5, thresh2:255 * 3/5, cset:thresh2_cset, random: trueBitRandom})),
// 	PyramidGenerator({thresh=255*2/5, thresh2=255*3/5, cset=thresh2_cset, random=truebitrandom}),
	(() => LevelFuncs.brogGenerator2(surface, 100, 1, 10, color_make(0xff,0x20,0x55), color_make(0xff,0x99,0x99))),
	(() => LevelFuncs.brogGenerator2(surface, 100, 3, 16, color_make(0x10,0x20,0x55), color_make(0xbb,0x88,0x00))),
	(() => LevelFuncs.brogGenerator2(surface, 4, 128, 0, color_make(0xff,0xff,0xff), color_make(0x33,0x66,0x99))),
	(() => LevelFuncs.brogGenerator2(surface, 100, 3, 8, color_make(0x33,0x99,0x99), color_make(0x00,0xff,0x00))),
	(() => LevelFuncs.brogGenerator(surface, 1, 8, 0, color_make(0x77,0x44,0x44), color_make(0xee,0xaa,0xaa), color_make(0x00,0x00,0x00))),
	(() => LevelFuncs.brogGenerator(surface, 100, 3, 8, color_make(0x22,0x99,0x77), color_make(0x66,0xcc,0x33), color_make(0xff,0x00,0x00))),
	(() => LevelFuncs.brogGenerator(surface, 8, 8, 4, color_make(0x00,0x00,0x00), color_make(0x70,0x90,0xff), color_make(0x60,0x40,0x00))),
	(() => LevelFuncs.brogGenerator(surface, 100, 4, 32, color_make(0xff,0xff,0xff), color_make(0x00,0xff,0xff), color_make(0xff,0x00,0xff))),
	(() => LevelFuncs.brogGenerator(surface, 24, 3, 16, color_make(0x00,0xAA,0x00), color_make(0x00,0x00,0x00), color_make(0x00,0xff,0x99))),
	(() => LevelFuncs.brogGenerator(surface, 4, 20, 16, color_make(0x00,0x00,0x00), color_make(0xff,0xff,0x00), color_make(0x00,0x00,0x00))),
	(() => LevelFuncs.brogGenerator(surface, 3, 6, 0, color_make(0xCC,0xAA,0xCC), color_make(0x77,0x33,0x88), color_make(0x00,0x00,0x00))),
	(() => LevelFuncs.brogGenerator(surface, 16, 1, 16, color_make(0xFF,0xFF,0xFF), color_make(0xBB,0x99,0x55), color_make(0x00,0x00,0x00))),
	(() => LevelFuncs.brogGenerator(surface, 16, 128, 0, color_make(0x00,0x00,0x00), color_make(0x50,0x50,0x75), color_make(0xe0,0xe0,0xff)))
	];
	let idx = (Math.floor(Number.MAX_SAFE_INTEGER * Math.random())) % generators.length;
	generators[idx]();
	state.imageData = surface;
	return state;
}

LevelFuncs.brogGenerator = function(surface, worms, worm_length, worm_start_dist, color1, color2, color3) {
	let rand = function() {
		return Math.floor(Number.MAX_SAFE_INTEGER * Math.random());
	}

	const dx_tab = [ +1, 0,-1, 0 ];
	const dy_tab = [  0,+1, 0,-1 ];

	const SEG_W = 16//4;
	const QUOT_W = (surface.width/SEG_W);
	const QUOT_W_MAX = (1024/SEG_W);
	const MAX_WORMS = 100;
	var i,j,k,l;
	var d;
	var what_segment_to_use = [];
	var wx = Array(worms).fill(0);
	var wy = Array(worms).fill(0);
	// var wx[MAX_WORMS], wy[MAX_WORMS];
	var n;
	var c = 0;
	var s = 0;
	var colors = [color3, color1, color2];
	var tile_file = [];
	
	for (i=0; i<16; ++i) {
		tile_file[i] = [];
		for (j=0; j<4; ++j)
		{
			tile_file[i][j] = [];
			for (k=0; k<16; ++k)
			{
				tile_file[i][j][k] = [];
				for (l=0; l<16; ++l)
				{
					c = LevelFuncs.tiles.charAt(s);
					s++;
					switch (c)
					{
					case '4':
						tile_file[i][j][k][l] = 1; break;
					case '5':
						tile_file[i][j][k][l] = 2; break;
					default:
						tile_file[i][j][k][l] = 0; break;
					}
				}
				// Newline
				s++;
			}
			// Newline
			s++;
		}
	}


	// srand(time(0));
	// memset(what_segment_to_use, 0, sizeof(int)*QUOT_W*QUOT_W);
	for (i = 0; i < QUOT_W; i++) {
		what_segment_to_use.push(new Array(QUOT_W).fill(0));
	}
	
	//just shove some stuff in randomly, later this will grow outward from a point
	
	//grow out some sections of wall
	wx[0] = QUOT_W/2;
	wy[0] = QUOT_W/2;
	for (i=1; i<worms; ++i)
	{
		wx[i] = wx[0]-worm_start_dist+rand()%(2*worm_start_dist+1);
		wy[i] = wy[0]-worm_start_dist+rand()%(2*worm_start_dist+1);
		if (wx[i]<0) wx[i] = 0;
		if (wy[i]<0) wx[i] = 0;
		if (wx[i]>=QUOT_W) wx[i] = QUOT_W-1;
		if (wy[i]>=QUOT_W) wy[i] = QUOT_W-1;
	}
	what_segment_to_use[QUOT_W/2][QUOT_W/2] = 1;
	for (j=0; j<worm_length; ++j) {
		for (i=0; i<worms; ++i)
		{
			d = rand()%4;
			wx[i] += dx_tab[d];
			wy[i] += dy_tab[d];
			if (wx[i]<0) wx[i] = 0;
			if (wy[i]<0) wy[i] = 0;
			if (wx[i]>=QUOT_W) wx[i] = QUOT_W-1;
			if (wy[i]>=QUOT_W) wy[i] = QUOT_W-1;
			what_segment_to_use[wx[i]][wy[i]] = 1;
		}
	}
	
	/******
	 
basically the idea here is that
this is something that will overwrite sections of ANDI GLITCH LEVELS with BROG TILES
currently the tiles are super simple but thats kind of cool too
	 
	 ******/
	
	//figure out which segments to use based on adjacency
	for (i=0; i<QUOT_W; ++i) {
		for (j=0; j<QUOT_W; ++j)
		{
			if (what_segment_to_use[i][j]==0) continue;
			n = 0;
			if (i>0 && what_segment_to_use[i-1][j]>0)
				n |= 8;
			if (j>0 && what_segment_to_use[i][j-1]>0)
				n |= 4;
			if (i<QUOT_W-1 && what_segment_to_use[i+1][j]>0)
				n |= 2;
			if (j<QUOT_W-1 && what_segment_to_use[i][j+1]>0)
				n |= 1;
			what_segment_to_use[i][j] = 1+n;
		}
	}
	
	//fill in the level according to the segments we've chosen
	for (i=0; i<QUOT_W; ++i) {
		for (j=0; j<QUOT_W; ++j)
		{
			if (what_segment_to_use[i][j]>0) //skip it if it's empty, don't overwrite other generation
			{
				n = rand()%4;
				for (k=0; k<SEG_W; ++k) {
					for (l=0; l<SEG_W; ++l) {
						ImgFuncs_setColor32(surface, i*SEG_W+k, j*SEG_W+l, colors[ tile_file[what_segment_to_use[i][j]-1][n][k][l] ]);
					}
				}
			}
		}
	}
}

LevelFuncs.brogGenerator2 = function(surface, worms, worm_length, worm_start_dist, color1, color2) {

	const SEG_W2 = 4;
	const QUOT_W2 = (surface.width/SEG_W2);
	const QUOT_W_MAX2 = (1024/SEG_W2);
	const MAX_WORMS = 100;

	let rand = function() {
		return Math.floor(Number.MAX_SAFE_INTEGER * Math.random());
	}

	const dx_tab = [ +1, 0,-1, 0 ];
	const dy_tab = [  0,+1, 0,-1 ];

	var i,j,k,l;
	var d;
	var what_segment_to_use = [];
	var wx = Array(worms).fill(0);
	var wy = Array(worms).fill(0);
	var n;
	var c = 0;
	var s = 0;
	var colors = [color1, color2];
	var tile_file = [];

	for (i=0; i<16; ++i) {
		tile_file[i] = [];
		for (j=0; j<1; ++j)
		{
			tile_file[i][j] = [];
			for (k=0; k<4; ++k)
			{
				tile_file[i][j][k] = [];
				for (l=0; l<4; ++l)
				{
					c = LevelFuncs.tiles2.charAt(s);
					s++;
					switch (c)
					{
					case '1':
						tile_file[i][j][k][l] = 1; break;
					default:
						tile_file[i][j][k][l] = 0; break;
					}
				}
				// Newline
				s++;
			}
			// Newline
			s++;
		}
	}

	for (i = 0; i < QUOT_W2; i++) {
		what_segment_to_use.push(new Array(QUOT_W2).fill(0));
	}
	
	// //just shove some stuff in randomly, later this will grow outward from a point

	wx[0] = QUOT_W2/2;
	wy[0] = QUOT_W2/2;
	for (i=1; i<worms; ++i)
	{
		wx[i] = wx[0]-worm_start_dist+rand()%(2*worm_start_dist+1);
		wy[i] = wy[0]-worm_start_dist+rand()%(2*worm_start_dist+1);
		if (wx[i]<0) wx[i] = 0;
		if (wy[i]<0) wx[i] = 0;
		if (wx[i]>=QUOT_W2) wx[i] = QUOT_W2-1;
		if (wy[i]>=QUOT_W2) wy[i] = QUOT_W2-1;
	}
	what_segment_to_use[QUOT_W2/2][QUOT_W2/2] = 1;
	for (j=0; j<worm_length; ++j) {
		for (i=0; i<worms; ++i)
		{
			d = rand()%4;
			wx[i] += dx_tab[d];
			wy[i] += dy_tab[d];
			if (wx[i]<0) wx[i] = 0;
			if (wy[i]<0) wy[i] = 0;
			if (wx[i]>=QUOT_W2) wx[i] = QUOT_W2-1;
			if (wy[i]>=QUOT_W2) wy[i] = QUOT_W2-1;
			what_segment_to_use[wx[i]][wy[i]] = 1;
		}
	}
	
	//figure out which segments to use based on adjacency
	for (i=0; i<QUOT_W2; ++i) {
		for (j=0; j<QUOT_W2; ++j)
		{
			if (what_segment_to_use[i][j]==0) continue;
			n = 0;
			if (i>0 && what_segment_to_use[i-1][j]>0)
				n |= 2;
			if (j>0 && what_segment_to_use[i][j-1]>0)
				n |= 1;
			if (i<QUOT_W2-1 && what_segment_to_use[i+1][j]>0)
				n |= 8;
			if (j<QUOT_W2-1 && what_segment_to_use[i][j+1]>0)
				n |= 4;
			what_segment_to_use[i][j] = 1+n;
		}
	}
	
	//fill in the level according to the segments we've chosen
	for (i=0; i<QUOT_W2; ++i) {
		for (j=0; j<QUOT_W2; ++j)
		{
			if (what_segment_to_use[i][j]>0) //skip it if it's empty, don't overwrite other generation
			{
				for (k=0; k<SEG_W2; ++k) {
					for (l=0; l<SEG_W2; ++l) {
						ImgFuncs_setColor32(surface, i*SEG_W2+k, j*SEG_W2+l, colors[ tile_file[what_segment_to_use[i][j]-1][0][k][l] ]);
					}
				}
			}
		}
	}
}

LevelFuncs.pyramidGenerator = function(surface, options) {
	let greyMake = function(v) {
		return (((v & 0xff) << 24) |
		((v & 0xff) << 16) |
		((v & 0xff) << 8) |
		(0xff));
	}

	let color_make = function(r,g,b) {
		return (((r & 0xff) << 24) |
		((g & 0xff) << 16) |
		((b & 0xff) << 8) |
		(0xff));
	}

	LevelFuncs.levelState.cget = function(x, xd, y, yd, channel) {
		let nx = x + xd
		let ny = y + yd
		nx = Math.max(Math.min(LevelFuncs.levelState.size, nx), 0);
		ny = Math.max(Math.min(LevelFuncs.levelState.size, ny), 0);
		return ImgFuncs_getColorArr(LevelFuncs.levelState.state, nx, ny)[channel];
	}

	LevelFuncs.levelState.cset = function(newboard, fx,fy, nx, ny, channel, color) {
		var dx = (fx) * 3 + (nx);
		var dy = (fy) * 3 + (ny);
		var ch = ImgFuncs_getColorArr(newboard, dx, dy)
		ch[~~channel % 3] = ~~color;
		ImgFuncs_setColorArr(newboard, dx, dy, ch);
	}

	LevelFuncs.levelState.rotate = function(n, by, base, mod) {
		if (n >= base) {
			return (n-base + by)%mod + base;
		}
		return n;
	}

	LevelFuncs.levelState.centerget = function(x,y,channel) {
		return LevelFuncs.levelState.cget(x,0,y,0,channel);
	}

	LevelFuncs.levelState.mutate_tab = function(i,tabcount) {
		return i
	}

	LevelFuncs.levelState.random = (() => greyMake(Math.floor(Number.MAX_SAFE_INTEGER * Math.random()) % 255));

	LevelFuncs.levelState.mapMake = function(w,h) {
		var map = new ImageData(w, h);
		let black = color_make(0,0,0);
		ImgFuncs.addBufferToImageData(map);
		for (let x = 0; x<w; x++) {
			for (let y = 0; y<h; y++) {
				ImgFuncs_setColor32(map, x, y, black);
			}
		}
		return map;
	}

	LevelFuncs.levelState.mapRandom = function(w,h, f) {
		var map = new ImageData(w, h);
		ImgFuncs.addBufferToImageData(map);
		for (let x = 0; x<w; x++) {
			for (let y = 0; y<h; y++) {
				ImgFuncs_setColor32(map, x, y, f());
			}
		}
		return map;
	}

	LevelFuncs.levelState.copy = function(to, from) {
		for (let x = 0; x<to.width; x++) {
			for (let y = 0; y<to.height; y++) {
				ImgFuncs_setColor32(to, x, y, ImgFuncs_getColor32(from, x, y));
			}
		}
	}

	LevelFuncs.levelState.mapCenterCrop = function(map, w, h) {
		if (map.width == w && map.height == h) {
			return map;
		}
		let result = LevelFuncs.levelState.mapMake(w , h);

		let offsetX = Math.floor((map.width - w) / 2);
		let offsetY = Math.floor((map.height - h) / 2);

		for (let x = 0; x<w; x++) {
			for (let y = 0; y<h; y++) {
				ImgFuncs_setColor32(result, x, y, ImgFuncs_getColor32(map, x + offsetX, y + offsetY));
			}
		}
		return result
	}

	LevelFuncs.levelState.initial = function() {
		LevelFuncs.levelState.size = 3;
		return LevelFuncs.levelState.mapRandom(LevelFuncs.levelState.size, LevelFuncs.levelState.size, LevelFuncs.levelState.random);
	}

	LevelFuncs.levelState.pass = function(w,h) {
		let newsize = LevelFuncs.levelState.size * 3
		let newboard = LevelFuncs.levelState.mapMake(newsize, newsize)
		
		for(let x=0; x < LevelFuncs.levelState.size; x++) {
			for(let y=0; y< LevelFuncs.levelState.size; y++)  {
				for(let c=0; c < 3; c++) { // c for channel
					let get =   LevelFuncs.levelState.cget(x, 0,  y, 0,  c);
					let left =  LevelFuncs.levelState.cget(x, -1, y, 0,  c);
					let right = LevelFuncs.levelState.cget(x, 1,  y, 0,  c);
					let up =    LevelFuncs.levelState.cget(x, 0,  y, -1, c);
					let down =  LevelFuncs.levelState.cget(x, 0,  y, 1,  c);
					
					let newup = (up + get)/2;
					let newdown = (down + get)/2;
					let newleft = (left + get)/2;
					let newright = (right + get)/2;
					
					let tab = [LevelFuncs.levelState.centerget(x,y,c), newleft, newright, newup, newdown, (newup+newleft)/2, (newdown+newleft)/2, (newup+newright)/2, (newdown+newright)/2];
					let coord = [[2,2], [1,2], [3, 2], [2, 1], [2,3], [1,1], [1,3], [3, 1], [3,3]];
					
					let tabcount = tab.length;
					for(let i=0; i < tabcount; i++) {
						let tt = ~~tab[ LevelFuncs.levelState.mutate_tab(i, tabcount, c) ];
						let tc = coord[ i ];
						LevelFuncs.levelState.cset(newboard, x, y, tc[0] - 1, tc[1] - 1, c, tt);
					}
				}
			}
		}
		
		LevelFuncs.levelState.state = newboard
		LevelFuncs.levelState.size = newsize
		
		if (LevelFuncs.levelState.size >= w && LevelFuncs.levelState.size >= h) {
			return LevelFuncs.levelState.mapCenterCrop(LevelFuncs.levelState.state, w, h);
		}
		return null;
	}

	Object.assign(LevelFuncs.levelState, options);

	let result = null
	LevelFuncs.levelState.state = LevelFuncs.levelState.initial()
	while (!result) {
		result = LevelFuncs.levelState.pass(surface.width,surface.height);
	}
	return LevelFuncs.levelState.copy(surface, result);
}

LevelFuncs.tiles = `0555555555555555
5444454445444445
5444455445444445
5444454545444445
5554444455544445
5444544444445545
5554545444454445
5444544545445445
5554545454544545
5444544445455445
5444444444444445
5555555555554445
5444444444444445
5555555555555445
5444444444444445
5555555555555555

0555555555555550
0544444444444455
5555555555544455
5444444444444455
5555555555544455
5444444444444545
5454545454545445
5545454545454445
5444444444444445
5544444444444445
0544444444444445
0544444444444445
0544444444444445
0544444444444445
0544444444444455
0555555555555500

0000000000000000
0000000000000000
0055555555555500
0055555555555500
0054444444444500
0054544555554500
0054544544454500
0054544555454500
0054544544454500
0054544555454500
0054544544454500
0054544555554500
0054444444444500
0055555555555500
0000000000000000
0000000000000000

0555555555555555
5444444444444445
5444555555555545
5445000000000545
5450000555550545
5450005444450545
5450054445450545
5450544454450545
5450544544450545
5450545444500545
5450544445000545
5450555550000545
5450000000005445
5455555555554445
5444444444444445
5555555555555550

0000000000000000
0000000000000000
0555555500555000
0544544504545555
0054554500555444
0054544500400444
0544555500004444
5444444440400455
5455555555044445
5454444444444455
5455555555444454
5455555555444455
5454444444444444
5455555555555555
5444444445000000
0555555555000000

5555555555555500
0544444444444500
0544444444444500
0544444445555555
5544444445444444
5444444555444444
5444444544444444
5454444544455554
5555444545554454
5444444545444454
5454444545444454
5555445545555554
5444445444444444
5444445555555555
5444444444444500
5555555555555500

5550555055505550
5450545054505450
5450545054545450
5450545054545555
5450545054544444
5450545054544444
5455545555544444
5444444444444444
5444444444455554
5455555555550054
5454444444450054
5455554444455554
5444444444444444
5444444444444555
5544444444444500
5555555555555500

0005000500050000
0050505050505000
0500050005000500
5555555555555550
5444444444444455
5445444544444444
5454544555554444
5455444544444444
5444444444444444
5444554444454545
5445445444454545
5454444544454545
5454444544444444
5455555555555555
5444444444444450
5555555555555550

0055555555555500
0544444444444450
5445555555555445
5454444444444545
5454555555554545
5454444444444545
5454555555554545
5454444444444545
5454555555554545
5454444444444545
5454555555554545
5454444444444545
5445454444545445
0544445445444450
0054444554444500
0005444554444500

0555555555555555
5544444444444445
5445454545454545
5440404040404045
5444444444444445
5444444444444445
5455555555555545
5454444444444545
5455555555554545
5455540404054545
5555555555454545
0004040404054545
0505555555454545
0505040404054545
0555455455554555
0005444454554500

0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0005050505050500
0000000000000000
0005555555555500
0005000000000000
0005444455505555
0055544454505445
0005444454505445
0055544455555445
0005444454445555

5500000000000000
5050000000000000
5005000000000000
5000500000000000
5550500400000000
5000504040005000
5550540404054500
5000504040454450
5500544444454450
0500544444455550
0500544454444500
0500544454444500
0550545555544500
0000544454444500
0055544454444500
0005444454444500

0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000005555
0000000005554444
0000000005054444
0000000005554444
0000055554445444
0000050054445444
0000050054445444
0000050054445444
0000055554445444
0055544445554555
0050544445054500
0055544445554500

5000000000000000
0000000000000000
0050000000000050
0005500000000555
0005000000000050
0000055000000000
0000050000000004
0000000555000044
0000000500000004
0000000505555000
0000000005000004
0000000005055504
0000000005055550
0005000000055555
0000000000005500
0055555550400500

0000000000000000
0000000000000000
0000000000000000
0000000000555555
0000000000545454
0000000000545454
0000000000545454
0000000000505050
0000000000505050
0000004000505050
0000000000505050
0000004000505050
0000000000000000
0000004055555555
0055500054444000
0054504054444500

0000000000000000
0000000000000005
0000000000000005
0000000000000055
0000000000000005
0000000000000005
0000000000000005
0000000000000005
0000000000000005
0000000000050505
0000000000000005
0000000000050505
0000000000000005
0555000055555555
0505000054444500
0005555554444500

0555500050000000
0540555555555550
0540404050404040
5540404040405040
5040405040555550
4055505555505550
4050000000005550
4050505050505550
4050000000005550
4055505555505550
4040405040555550
4040404040405040
4555000000000000
5505000000000000
0555000000000000
0000000000000000

0555555550000000
0544444445000000
0544444444500000
0544555544450000
5555544544445000
4444555544444500
4454444444444450
4555444444444445
4454444444444445
4454545444444450
4454545444444500
4454545444445000
4454545444450000
5555555444500000
5444444445000000
5555555550000000

0555000000000000
0505000000000000
0005000400000000
0055004000000000
5550040400000000
4440400000000000
4444404000000000
4444040000000000
4554550550550550
4550550550550550
4444404000000000
4545450505050000
4444040000000000
5555004000000000
0505000400000000
0555000000000000

0055555555000000
0050000005555500
5555555555000000
5050505000055500
5050505000054500
0000000000054500
4444405550055500
0000050005000000
4444450505055500
0000050005054500
4444405550055500
0000000000000000
5550550555055500
5450450545054500
5550550555055500
0000000000000000

0000000000000000
0000000000000000
0000000000005050
0000000000000000
5555555555555555
4444554445444455
4444544445444454
5554544445444454
5054544445444454
5554554445444454
4444454445444454
4445554455444554
4444444444444444
5555555555555555
0000000000000000
0000000000000000

0000000000000000
0000000000000000
5505050505050505
0000000000000000
5555555555555555
4445444445444454
4445444445444454
4545444545445454
4555444555445554
4444444444444444
4444444444444444
4455444444444444
4445444444444444
5555555555555555
0000000000000000
0000000000000000

0000000000000000
0050000000000000
0555000000000000
0050000000000000
5550000000555555
4444444445445450
0000000054454544
4444444544545000
0000005445454444
4444454454500000
0000544545444444
4445445450000000
0054454544545454
5555555005555555
0000000000505050
0000000000000000

0000000000000000
0000000000000050
5550000000000544
4445000000005444
5555500000055555
4444450000544444
4444445005555544
4444444554444544
5555555554444444
5555555005555555
4444450000544444
5555500000055555
4445000000005444
5550000000000555
0000000000000000
0000000000000000

0555555000000000
0544445000000000
0544445005555000
5444445555445000
4544444444545000
5444454444545500
4444544445454500
4444444445454500
4544444445454550
5455555554545450
4544444444545450
4544455444545455
5455544555454545
4455544555454545
5455544555454555
4455544555454500

0555000000000000
0505000000005550
0555000000005050
0050000000005550
5550000000000500
5000000000000500
5055555555555500
5054444444444500
5055555555555500
5444444444444500
5055555555555500
5444444444444500
5055555555555500
5444444444444500
0055555555555500
4444444444444500

0000000000000000
0000000000000000
0050000000000000
5505000000000000
5050000000000000
5000000000000000
5500000000000000
4500000000000000
5550000000000000
4450000000000000
5455000000000000
5445000000000000
4444550000000000
5555455550000000
4445444455000000
4445545445555500

5000000000000000
4500000000000000
4500000000000000
5455550000000000
4544450000000000
5455450000000000
4544550550000000
5454555550000000
5445444450000000
4554444550000000
5445544500000000
4554444555555000
5445544454545000
4544454454545000
5455544454545000
4544454444445555

0000000000000000
0555555555555550
0500000000000050
0505555055555050
5505445054445055
4505445054445054
4505555055555054
4500000000000054
4505555055555054
4505445054445054
4505445054445054
4505445054445054
4505555055555054
5500000000000055
0555555555555550
0054544444444500

5000000000000005
5000000000000050
5000000000000005
5000000000000050
5555555555555555
4445444444444444
4455500000400004
4450504440004004
4450504004440404
4455504000404004
4445004400044044
4445044444444444
4455544445554444
5550544445054555
0050544445554500
0050544444444500

5000000000000005
0500000000000050
5000000000000500
5000000000000500
5555555555555555
4444440440444444
4444440444444440
4444444444444450
5555555555555555
0440444444444454
4444440404444444
4445445054554444
4444444444444444
5555555555555555
0000000000000000
0055555555555500

5500000000000055
0550000000000550
0055000000005500
5555500000055000
0000550000555555
5555555005504400
4444405555044444
4444444400044444
0500044044444444
4554444444444444
4444444444444440
4044404444044444
0044400440404044
5555555555555555
0054544444444500
0055544444444500

0005444444444500
0005444444444500
0005444444444500
0005444444444500
0005455545554500
0005450545054500
0005455545554500
0005444444444500
0005455555554500
0005444444444500
0005455555554500
0005444444444500
0000544555445000
0000054444450000
0000005555500000
0000000000000000

0005444444444500
0054444444444450
0544444444454445
5444444444545445
5445444444454445
5444544444445445
5444545445445445
5444545445545445
0554455445054445
0055505450005550
0000005445000000
0000005445000000
0000005445000000
0000005455000000
0000005445000000
0000000550000000

0055500050005550
0054500545505450
0054500545505450
0054500050005450
0054500000005450
0054500555505450
0054500000005550
0054500555500000
0054500000000000
0054500555500000
0054500000004000
0054500500044000
0054500000000000
0054500000000000
0055500000000000
0000000000000000

0005444444444500
0000555454454500
0005444545454500
0000555454545450
0005444545455450
0554544554545450
0005455005455450
0554455040545450
0005504040545450
0000004040545450
0000000405450500
0000000405450500
0000000405450500
0000000405504500
0000000040004500
0000000000000000

0005444444444500
0005455555544500
0005454444444555
0005454555544545
0005454444044555
0005454555544444
0005454544444444
0005454445454544
0005454544444444
0005454454545454
0005454444444444
0005455555555554
0005444444444444
0005555555555555
0000000000000000
0000000000000000

0005444444444500
0055445544554500
0005454455445505
0005445544550000
0005454455445555
0000545544554444
0000054455445554
0000005544554445
0000000055445454
0000000000554544
0000000000005454
0000000000000544
0000000000000054
0000000000000005
0000000000000000
0000000000000000

0055504040404500
0055504040404500
0055504040404500
0055004040404500
0055440404040555
0054540404040404
0055540404040444
0055444040404444
0055444040404444
0055445050544444
0055444444444444
0055444454545454
0055555444444444
0055505555555555
0000000000005000
0000000000000000

0005444444444500
0005555555555500
0000000000000000
0005555555555500
0005444444444555
0005555555555504
0000000000000004
0000000000555504
0005550000544504
0054445000555504
0544544500000504
0545554500555504
0544544500544504
0054445000555555
0005550000000000
0000000000000000

0555555444444500
0544445555544500
0555555000544500
0000000000555500
0055500000005000
0050544044005000
0055540040005000
0005444444405000
0005454444445000
0005444555545000
0005444444555500
0005454555544500
0005444444544500
0005454555544500
0005444444444500
0005444444444500

0055544444444500
0054504504504500
0054504504504500
0054544504505550
0054544505500000
0054544505005550
0054544505000000
0055544505005550
0005044505000000
0005044505505550
0055504504504500
0054504504504500
0054540504504500
0054540504504500
0054540504504500
0054544544444500

0005444444444500
0005444444444500
0005444444444500
0005555555555500
0000550000055000
0000504444405000
0000550000055000
0005555555555500
0005444444444500
0005444444444500
0005455555554500
0005444444444500
0005455555554500
0005444444444500
0005455555554500
0005444444444500

0005444444444500
0005444444444500
0005555545555500
0000000545000000
0000000545000000
0000000545000000
0000000545000000
0000000545000000
0000000050000000
0000005555500000
0000054444450000
0000544444445000
0005445555544500
0005445000544500
0005445555544500
0005444444444500

0005555555555500
0005444444445000
0005445454545050
0005455555555555
0005445454545454
0005440404044444
0005440404044444
0005444444444444
0005400000444444
0005404444444444
0005404444444444
0005404444444444
0005404555444444
0005404505444445
0555444555444450
0005444454444500

0055540404000500
0005440404040500
0055540404040500
0005440404040500
0055540404040555
0005440404440444
0055540404440444
0005440404440404
0055540404440444
0005440404440444
0055540400444444
0005440404440444
0055540404444444
0005440404440555
0055540404440500
0005000004444500

0005444444444500
0005444444444500
0005044444444500
0000504444444450
0000050444444445
0000005044444444
0000000504444444
5050050005444544
5050555500455554
5050050005444544
0000000504444444
0000005044444444
0000050444444444
0000504444444445
0005044444444450
0005444444444500

0005444444444500
0005445554444500
0055555054444555
0555445554445005
0545444444445555
0545444554444444
0545444555554444
0555554554444444
0500054554555554
0555554544500054
0555544544555554
0054444544544444
0054444544544444
0055544544544555
0005444444555500
0055544444444500

5555544444444500
5555544444444500
5555544444444500
5555544444444500
4444444444444500
4444444444444500
4444444445444500
4444444450544500
4444444500054500
4444444450544500
4444444445444500
4444444444444500
4444444444445500
5555555555555500
0050000500005500
0000000000000000

0055444545444500
0554555555555000
0544500000000000
5445005050000000
5450000000000000
5500000000000000
4500000000000000
4500000000000000
4500000000000000
4500000000000000
4500000000000000
4500000000000000
4500000000000000
5000000000000000
0000000000000000
0000000000000000

0005444454455500
0505444555500000
0505445005555500
0505450000000000
5505450555500000
4505500500500000
4505000555500000
4550000000000000
5500000000000000
5000000000000000
5000000000000000
5000000000000000
5000000000000000
5000000000000000
0000000000000000
0000000000000000

0005444444444500
0555555544445000
0544445444450000
0544454444500000
5544544445000000
4545444450000000
4554444500000000
4544445000000000
4444450000000000
4444500000000000
4445000000000000
4450000000000000
4500000000000000
5000000000000000
0000000000000000
0000000000000000

0005444444444500
0005000000000500
0555055555555500
0000050000000000
5555550555555555
4000000000000004
4055555555555554
4054444444444444
4054000000000004
4054555555555554
4054544444444444
4054545555555554
4054545000000004
5555555555555555
0000000000000000
0000000000000000

0005444444444500
0005444444444500
0005444544444500
0005445054444500
5555450005455555
4444500054450544
4445000544455544
4450005444444444
4500054444444444
4450544445555544
4445444445050544
4444444445555544
4444444444444444
5555555555555555
0000000000000000
0000000000000000

0005444444444500
0555555555555500
0555555555555500
0000000000000000
5000055505555555
5500050505054454
4550055505054454
4055000005054555
4045500405054545
4040550004044444
4040055044444444
4040005500444444
4555000554444444
5505000055555555
0555000000000000
0000000000000000

0005444444444500
0005445555544500
0505444444444505
0005445555544500
5555444444444555
4444555444555444
4444505444505444
4444555444555444
4444444555444444
4444444505444444
4444444555444444
4444444444444444
4444444444444444
5555555555555555
0000000000000000
0000000000000000

0005444444444500
0005444444444500
0005444445554500
0005555555054500
5000000005054500
5000000005554500
5005555000004500
5005445000004500
5005445444444500
5005445000004500
5005555555555500
5000000000000000
5005555555555500
5005444444444500
0055544444444500
0005444444444500

0005554555444500
0005555555445000
0000055555000000
0055555555444000
5055544555004000
4555544555000000
4555555555005000
4555555000440000
5550555000440000
5550055500000000
5550055544555000
4555055544005000
4555555500505000
5555555544544000
0005555544544500
0055444444445500

0000444444444500
0055555555554500
5555555444444500
5555555555554500
4444444444444500
5555555555554500
4444455544444500
5555555555554500
4444444444444500
5555555555554500
5544444444444500
5555555555554500
4444444444444500
5555555555554500
0444444444444500
5555555555554500

0055544544445500
0050545554450500
0050544544504500
5500544445040500
5005444450405000
5554444504050000
4444445040500000
4444450405000000
5444504050000000
5445040500000000
5450405000000000
5504050000000000
5555500000000000
5000000000000000
0055555555555500
0054544444444500

0055544444444500
0005444444444500
0055544444444500
0004444444444450
5005444444444445
4445454444444444
4445444444445444
4445555444450544
4444444444500054
4445555444555554
4444444444444444
4445555444444444
4444444444445554
5555555444445055
0005444444445550
0005444444444500

0055545554445500
0005445054444550
0005445554455500
0005444444450000
5055544555450555
5054544505450500
5054544555450500
5054544444450500
5054545554450500
5054545054450500
5054545554450500
5054544444450500
5054544555450500
5054544505450555
0054544555450000
0054544444455500

0055504004044500
0005404005544500
0555504005054500
0505404004554500
5505404004044505
0000504004045005
4444050005050005
0000045005000005
4444440500550005
4444440450000005
0000055405000005
5044000504500005
0500050504050005
5040540404045005
0005440404044500
0005440404044500

0055544444444500
0005544455544500
0000555550544500
0000000055544550
5555555444044505
4040545000444554
4040545444044444
4040545000444444
4550545444444444
4550545000005544
4040545000000544
4040545000005544
4040544444444444
5040555555555555
0000000000000000
0005444444444500`

LevelFuncs.tiles2 = `1111
1001
1001
1111

1111
0001
0001
1111

1001
1001
1001
1111

1001
0001
0001
1111

1111
1000
1000
1111

1111
0000
0000
1111

1001
1000
1000
1111

1001
0000
0000
1111

1111
1001
1001
1001

1111
0001
0001
1001

1001
1001
1001
1001

1001
0001
0001
1001

1111
1000
1000
1001

1111
0000
0000
1001

1001
1000
1000
1001

1001
0000
0000
1001`
