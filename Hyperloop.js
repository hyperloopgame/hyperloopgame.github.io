/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/main/Hyperloop.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/engine/Game.js":
/*!****************************!*\
  !*** ./lib/engine/Game.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const Assets_1 = __webpack_require__(/*! ./assets/Assets */ "./lib/engine/assets/Assets.js");
const math_1 = __webpack_require__(/*! ./util/math */ "./lib/engine/util/math.js");
const ControllerManager_1 = __webpack_require__(/*! ./input/ControllerManager */ "./lib/engine/input/ControllerManager.js");
const graphics_1 = __webpack_require__(/*! ./util/graphics */ "./lib/engine/util/graphics.js");
const GamepadInput_1 = __webpack_require__(/*! ./input/GamepadInput */ "./lib/engine/input/GamepadInput.js");
const Keyboard_1 = __webpack_require__(/*! ./input/Keyboard */ "./lib/engine/input/Keyboard.js");
const Scenes_1 = __webpack_require__(/*! ./scene/Scenes */ "./lib/engine/scene/Scenes.js");
const constants_1 = __webpack_require__(/*! ../main/constants */ "./lib/main/constants.js");
/**
 * Max time delta (in s). If game freezes for a few seconds for whatever reason, we don't want
 * updates to jump too much.
 */
const MAX_DT = 0.1;
class Game {
    constructor(width = constants_1.GAME_WIDTH, height = constants_1.GAME_HEIGHT) {
        this.width = width;
        this.height = height;
        this.controllerManager = ControllerManager_1.ControllerManager.getInstance();
        this.keyboard = new Keyboard_1.Keyboard();
        this.gamepad = new GamepadInput_1.GamepadInput();
        this.scenes = new Scenes_1.Scenes(this);
        this.assets = new Assets_1.Assets();
        this.backgroundColor = "black";
        this.gameLoopCallback = this.gameLoop.bind(this);
        this.gameLoopId = null;
        this.lastUpdateTime = performance.now();
        this.currentTime = 0;
        const canvas = this.canvas = graphics_1.createCanvas(width, height);
        // Desynchronized sounds like a good idea but unfortunately it prevents pixelated graphics
        // on some systems (Chrome+Windows+NVidia for example which forces bilinear filtering). So
        // it is deactivated here.
        this.ctx = graphics_1.getRenderingContext(canvas, "2d", { alpha: false, desynchronized: false });
        const style = canvas.style;
        style.position = "absolute";
        style.margin = "auto";
        style.left = style.top = style.right = style.bottom = "0";
        style.imageRendering = "pixelated";
        style.imageRendering = "crisp-edges";
        document.body.appendChild(this.canvas);
        this.updateCanvasSize();
        window.addEventListener("resize", () => this.updateCanvasSize());
        // Use Alt+Enter to toggle fullscreen mode.
        window.addEventListener("keydown", (event) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (event.altKey && event.key === "Enter") {
                const lockingEnabled = "keyboard" in navigator && "lock" in navigator.keyboard && typeof navigator.keyboard.lock === "function";
                // If the browser is in full screen mode AND fullscreen has been triggered by our own keyboard shortcut...
                if (window.matchMedia("(display-mode: fullscreen)").matches && document.fullscreenElement != null) {
                    if (lockingEnabled) {
                        navigator.keyboard.unlock();
                    }
                    yield document.exitFullscreen();
                }
                else {
                    if (lockingEnabled) {
                        yield navigator.keyboard.lock(["Escape"]);
                    }
                    yield document.body.requestFullscreen();
                }
            }
        }));
    }
    get input() {
        return this.controllerManager;
    }
    updateCanvasSize() {
        const { width, height } = this;
        const scale = Math.max(1, Math.floor(Math.min(window.innerWidth / width, window.innerHeight / height)));
        const style = this.canvas.style;
        style.width = width * scale + "px";
        style.height = height * scale + "px";
    }
    gameLoop() {
        const currentUpdateTime = performance.now();
        const dt = math_1.clamp((currentUpdateTime - this.lastUpdateTime) / 1000, 0, MAX_DT);
        this.currentTime = currentUpdateTime / 1000;
        // TODO if we are fancy, we may differentiate between elapsed system time and actual game time (e.g. to allow
        // pausing the game and stuff, or slow-mo effects)
        this.update(dt, this.currentTime);
        this.lastUpdateTime = currentUpdateTime;
        const { ctx, width, height } = this;
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, width, height);
        this.draw(ctx, width, height);
        ctx.restore();
        this.nextFrame();
    }
    nextFrame() {
        this.gameLoopId = requestAnimationFrame(this.gameLoopCallback);
    }
    update(dt, time) {
        this.gamepad.update();
        this.scenes.update(dt, time);
    }
    draw(ctx, width, height) {
        this.scenes.draw(ctx, width, height);
    }
    start() {
        if (this.gameLoopId == null) {
            this.lastUpdateTime = performance.now();
            this.nextFrame();
        }
    }
    stop() {
        if (this.gameLoopId != null) {
            cancelAnimationFrame(this.gameLoopId);
            this.gameLoopId = null;
        }
    }
    getTime() {
        return this.currentTime;
    }
}
exports.Game = Game;


/***/ }),

/***/ "./lib/engine/assets/Aseprite.js":
/*!***************************************!*\
  !*** ./lib/engine/assets/Aseprite.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Aseprite = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const Rect_1 = __webpack_require__(/*! ../geom/Rect */ "./lib/engine/geom/Rect.js");
const graphics_1 = __webpack_require__(/*! ../util/graphics */ "./lib/engine/util/graphics.js");
const time_1 = __webpack_require__(/*! ../util/time */ "./lib/engine/util/time.js");
/**
 * Sprite implementation which uses the Aseprite JSON format. Use the static asynchronous [[load]] method to load the
 * sprite and then use [[draw]] or [[drawTag]] to draw the sprite animation.
 */
class Aseprite {
    constructor(json, image) {
        var _a;
        this.json = json;
        this.image = image;
        this.frameTags = {};
        this.frameTagDurations = {};
        this.fallbackTag = "idle";
        this.direction = "forward";
        this.frames = Object.values(json.frames);
        this.frameSourceBounds = this.frames.map(frame => new Rect_1.Rect(frame.spriteSourceSize.x, frame.spriteSourceSize.y, frame.spriteSourceSize.w, frame.spriteSourceSize.h));
        this.duration = this.frames.reduce((duration, frame) => duration + frame.duration, 0);
        for (const frameTag of (_a = json.meta.frameTags) !== null && _a !== void 0 ? _a : []) {
            let duration = 0;
            for (let i = frameTag.from; i <= frameTag.to; i++) {
                duration += this.frames[i].duration;
            }
            this.frameTags[frameTag.name] = frameTag;
            this.frameTagDurations[frameTag.name] = duration;
        }
    }
    /**
     * Loads the sprite from the given source.
     *
     * @param source - The URL pointing to the JSON file of the sprite.
     * @return The loaded sprite.
     */
    static load(source) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const json = yield (yield fetch(source)).json();
            const baseURL = new URL(source, location.href);
            const image = yield graphics_1.loadImage(new URL(json.meta.image, baseURL));
            return new Aseprite(json, image);
        });
    }
    /**
     * Returns the sprite width in pixels.
     *
     * @return The sprite width in pixels.
     */
    get width() {
        return this.frames[0].sourceSize.w;
    }
    /**
     * Returns the sprite height in pixels.
     *
     * @return The sprite height in pixels.
     */
    get height() {
        return this.frames[0].sourceSize.h;
    }
    setDirection(direction) {
        this.direction = direction;
    }
    calculateFrameIndex(time = time_1.now(), duration = this.duration, from = 0, to = this.frames.length - 1, direction = this.direction) {
        let delta = direction === "reverse" ? -1 : 1;
        if (direction === "pingpong") {
            duration = duration * 2 - this.frames[from].duration - this.frames[to].duration;
        }
        let frameTime = time % duration;
        let frameIndex = direction === "reverse" ? to : from;
        while (((delta > 0 && frameIndex < to)
            || (delta < 0 && frameIndex > from)) && frameTime >= this.frames[frameIndex].duration) {
            frameTime -= this.frames[frameIndex].duration;
            frameIndex += delta;
            if (frameIndex === to) {
                delta = -delta;
            }
        }
        return frameIndex;
    }
    /**
     * Returns the frame index to be drawn at the given time.
     *
     * @param time - Optional time index of the animation. Current system time is used if not specified.
     * @return The frame index to draw.
     */
    getFrameIndex(time = time_1.now()) {
        return this.calculateFrameIndex(time);
    }
    /**
     * Draws a single sprite animation frame.
     *
     * @param ctx   - The canvas context to draw to.
     * @param index - The frame index to draw.
     * @param x     - The X position in pixels to draw to the sprite at.
     * @param y     - The Y position in pixels to draw to the sprite at.
     */
    drawFrame(ctx, index, x, y) {
        const frame = this.frames[index];
        if (frame == null) {
            throw new Error("Frame index not found: " + index);
        }
        ctx.drawImage(this.image, frame.frame.x, frame.frame.y, frame.frame.w, frame.frame.h, Math.round(x) + frame.spriteSourceSize.x, Math.round(y) + frame.spriteSourceSize.y, frame.spriteSourceSize.w, frame.spriteSourceSize.h);
    }
    /**
     * Returns the frame index of a tagged sprite animation at the given time.
     *
     * @param tag  - The animation tag to draw.
     * @param time - Optional time index of the animation. Current system time is used if not specified.
     * @return The frame index to draw.
     */
    getTaggedFrameIndex(tag, time = time_1.now()) {
        const frameTag = this.frameTags[tag] || this.frameTags[this.fallbackTag];
        if (frameTag == null) {
            throw new Error(`Frame tag not found and fallback is not available as well. Tag: '${tag}' | FallbackTag: '${this.fallbackTag}'`);
        }
        return this.calculateFrameIndex(time, this.frameTagDurations[tag], frameTag.from, frameTag.to, frameTag.direction);
    }
    /**
     * Return the full animation duration for a specific animation tag.
     *
     * @param tag - The animation tag to get the duration from.
     * @return The animation duration.
     */
    getAnimationDurationByTag(tag) {
        const duration = this.frameTagDurations[tag] || this.frameTagDurations[this.fallbackTag];
        if (duration == null) {
            throw new Error(`Frame tag not found and fallback is not available as well. Tag: '${tag}' | FallbackTag: '${this.fallbackTag}'`);
        }
        return duration;
    }
    /**
     * Checks if sprite has the given tag.
     *
     * @param tag - The tag to look for.
     * @return True if sprite has the given tag, false if not.
     */
    hasTag(tag) {
        return tag in this.frameTags;
    }
    /**
     * Draws a tagged sprite animation.
     *
     * @param ctx  - The canvas context to draw to.
     * @param tag  - The animation tag to draw.
     * @param x    - The X position in pixels to draw to the sprite at.
     * @param y    - The Y position in pixels to draw to the sprite at.
     * @param time - Optional time index of the animation. Current system time is used if not specified.
     */
    drawTag(ctx, tag, x, y, time = time_1.now()) {
        this.drawFrame(ctx, this.getTaggedFrameIndex(tag, time), x, y);
    }
    /**
     * Returns the source bounds of the tagged sprite animation at the given time index.
     *
     * @param time - Optional time index of the animation. Current system time is used if not specified.
     * @return The source bounds of the frame played at the given time.
     */
    getTaggedSourceBounds(tag, time = time_1.now()) {
        const frameIndex = this.getTaggedFrameIndex(tag, time);
        return this.frameSourceBounds[frameIndex];
    }
    /**
     * Draws the untagged sprite animation (Simply all defined frames).
     *
     * @param ctx  - The canvas context to draw to.
     * @param x    - The X position in pixels to draw to the sprite at.
     * @param y    - The Y position in pixels to draw to the sprite at.
     * @param time - Optional time index of the animation. Current system time is used if not specified.
     */
    draw(ctx, x, y, time = time_1.now()) {
        const frameIndex = this.calculateFrameIndex(time);
        this.drawFrame(ctx, frameIndex, x, y);
    }
    /**
     * Returns the source bounds of the untagged sprite animation (All defined frames) at the given time index.
     *
     * @param time - Optional time index of the animation. Current system time is used if not specified.
     * @return The source bounds of the frame played at the given time.
     */
    getSourceBounds(time = time_1.now()) {
        const frameIndex = this.calculateFrameIndex(time);
        return this.frameSourceBounds[frameIndex];
    }
    /**
     * Returns the layer with the given name.
     *
     * @param name - The layer name.
     * @return The found layer. Null if none.
     */
    getLayer(name) {
        var _a, _b;
        return (_b = (_a = this.json.meta.layers) === null || _a === void 0 ? void 0 : _a.find(layer => layer.name === name)) !== null && _b !== void 0 ? _b : null;
    }
}
exports.Aseprite = Aseprite;


/***/ }),

/***/ "./lib/engine/assets/Assets.js":
/*!*************************************!*\
  !*** ./lib/engine/assets/Assets.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Assets = exports.asset = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const Aseprite_1 = __webpack_require__(/*! ./Aseprite */ "./lib/engine/assets/Aseprite.js");
const BitmapFont_1 = __webpack_require__(/*! ./BitmapFont */ "./lib/engine/assets/BitmapFont.js");
const graphics_1 = __webpack_require__(/*! ../util/graphics */ "./lib/engine/util/graphics.js");
const Sound_1 = __webpack_require__(/*! ./Sound */ "./lib/engine/assets/Sound.js");
const TiledMap_1 = __webpack_require__(/*! ../tiled/TiledMap */ "./lib/engine/tiled/TiledMap.js");
const assets = new Map();
class AssetRequest {
    constructor(target, propertyKey, src, options) {
        this.target = target;
        this.propertyKey = propertyKey;
        this.src = src;
        this.options = options;
    }
    resolve(asset) {
        this.target[this.propertyKey] = this.options.map ? this.options.map(asset) : asset;
    }
}
const assetRequests = [];
function asset(src, options = {}) {
    return (target, propertyKey) => {
        assetRequests.push(new AssetRequest(target, propertyKey, src, options));
    };
}
exports.asset = asset;
class Assets {
    loadAsset(src) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let asset = assets.get(src);
            if (asset == null) {
                if (src.endsWith(".aseprite.json")) {
                    asset = yield Aseprite_1.Aseprite.load("assets/" + src);
                }
                else if (src.endsWith(".tiledmap.json")) {
                    asset = yield TiledMap_1.TiledMap.load("assets/" + src);
                }
                else if (src.endsWith(".font.json")) {
                    asset = yield BitmapFont_1.BitmapFont.load("assets/" + src);
                }
                else if (src.endsWith(".png")) {
                    asset = yield graphics_1.loadImage(src);
                }
                else if (src.endsWith(".mp3")) {
                    asset = yield Sound_1.Sound.load("assets/" + src);
                }
                else if (src.endsWith(".ogg")) {
                    asset = yield Sound_1.Sound.load("assets/" + src);
                }
                else if (src === "appinfo.json") {
                    asset = (yield (yield fetch("appinfo.json")).json());
                }
                else {
                    throw new Error("Unknown asset format: " + src);
                }
                assets.set(src, asset);
            }
            return asset;
        });
    }
    load(onProgress) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const total = assetRequests.length;
            let loaded = 0;
            if (onProgress) {
                onProgress(total, loaded);
            }
            let request;
            while ((request = assetRequests.pop()) != null) {
                if (typeof request.src === "string") {
                    request.resolve(yield this.loadAsset(request.src));
                }
                else {
                    request.resolve(yield Promise.all(request.src.map(src => this.loadAsset(src))));
                }
                loaded++;
                if (onProgress) {
                    onProgress(total, loaded);
                }
            }
        });
    }
}
exports.Assets = Assets;


/***/ }),

/***/ "./lib/engine/assets/BitmapFont.js":
/*!*****************************************!*\
  !*** ./lib/engine/assets/BitmapFont.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.BitmapFont = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const graphics_js_1 = __webpack_require__(/*! ../util/graphics.js */ "./lib/engine/util/graphics.js");
const CHAR_SPACING = 1;
class BitmapFont {
    constructor(sourceImage, colors, charMap, charHeight, charWidths, compactablePrecursors, charMargin = 1) {
        this.sourceImage = sourceImage;
        this.canvas = document.createElement("canvas");
        this.charMap = charMap;
        this.charHeight = charHeight;
        this.colorMap = this.prepareColors(colors);
        this.charWidths = charWidths;
        this.compactablePrecursors = compactablePrecursors;
        this.charStartPoints = [];
        this.charCount = charMap.length;
        this.charReverseMap = {};
        for (let i = 0; i < this.charCount; i++) {
            this.charStartPoints[i] = (i === 0) ? 0 : this.charStartPoints[i - 1] + this.charWidths[i - 1] + charMargin;
            const char = this.charMap[i];
            this.charReverseMap[char] = i;
        }
    }
    /**
     * Loads the sprite from the given source.
     *
     * @param source - The URL pointing to the JSON file of the sprite.
     * @return The loaded sprite.
     */
    static load(source) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const json = yield (yield fetch(source)).json();
            const baseURL = new URL(source, location.href);
            const image = yield graphics_js_1.loadImage(new URL(json.image, baseURL));
            const characters = json.characterMapping.map(charDef => charDef.char).join("");
            const widths = json.characterMapping.map(charDef => charDef.width);
            const compactablePrecursors = json.characterMapping.map(charDef => charDef.compactablePrecursors || []);
            return new BitmapFont(image, json.colors, characters, json.characterHeight, widths, compactablePrecursors, json.margin);
        });
    }
    prepareColors(colorMap) {
        const result = {};
        const colors = Object.keys(colorMap);
        const count = colors.length;
        const w = this.canvas.width = this.sourceImage.width;
        const h = this.charHeight;
        this.canvas.height = h * count;
        const ctx = this.canvas.getContext("2d");
        // Fill with font
        for (let i = 0; i < count; i++) {
            result[colors[i]] = i;
            ctx.drawImage(this.sourceImage, 0, h * i);
        }
        // Colorize
        ctx.globalCompositeOperation = "source-in";
        for (let i = 0; i < count; i++) {
            ctx.fillStyle = colorMap[colors[i]];
            ctx.save();
            ctx.beginPath();
            ctx.rect(0, h * i, w, h);
            ctx.clip();
            ctx.fillRect(0, 0, w, h * count);
            ctx.restore();
        }
        ctx.globalCompositeOperation = "source-over";
        return result;
    }
    getCharIndex(char) {
        let charIndex = this.charReverseMap[char];
        if (charIndex == null) {
            // To signalize missing char, use last char, which is a not-def glyph
            charIndex = this.charCount - 1;
        }
        return charIndex;
    }
    drawCharacter(ctx, char, color) {
        const colorIndex = this.colorMap[color];
        const charIndex = (typeof char === "number") ? char : this.getCharIndex(char);
        const charX = this.charStartPoints[charIndex], charY = colorIndex * this.charHeight;
        ctx.drawImage(this.canvas, charX, charY, this.charWidths[charIndex], this.charHeight, 0, 0, this.charWidths[charIndex], this.charHeight);
    }
    drawText(ctx, text, x, y, color, align = 0, alpha = 1) {
        ctx.save();
        ctx.translate(x, y);
        // Ugly hack to correct text position to exact pixel boundary because Chrome renders broken character images
        // when exactly between two pixels (Firefox doesn't have this problem).
        if (ctx.getTransform) {
            const transform = ctx.getTransform();
            ctx.translate(Math.round(transform.e) - transform.e, Math.round(transform.f) - transform.f);
        }
        text = "" + text;
        ctx.globalAlpha *= alpha;
        const { width } = this.measureText(text);
        ctx.translate(-align * width, 0);
        let precursorChar = null;
        for (const currentChar of text) {
            const index = this.getCharIndex(currentChar);
            const spaceReduction = precursorChar && this.compactablePrecursors[index].includes(precursorChar) ? 1 : 0;
            ctx.translate(-spaceReduction, 0);
            this.drawCharacter(ctx, index, color);
            ctx.translate(this.charWidths[index] + CHAR_SPACING, 0);
            precursorChar = currentChar;
        }
        ctx.restore();
    }
    measureText(text) {
        let width = 0;
        let precursorChar = null;
        for (const currentChar of text) {
            const index = this.getCharIndex(currentChar);
            const spaceReduction = precursorChar && this.compactablePrecursors[index].includes(precursorChar) ? 1 : 0;
            width += this.charWidths[index] - spaceReduction + CHAR_SPACING;
            precursorChar = currentChar;
        }
        if (text.length > 0) {
            width -= CHAR_SPACING;
        }
        return { width, height: this.charHeight };
    }
    drawTextWithOutline(ctx, text, xPos, yPos, textColor, outlineColor, align = 0) {
        for (let yOffset = yPos - 1; yOffset <= yPos + 1; yOffset++) {
            for (let xOffset = xPos - 1; xOffset <= xPos + 1; xOffset++) {
                if (xOffset !== xPos || yOffset !== yPos) {
                    this.drawText(ctx, text, xOffset, yOffset, outlineColor, align);
                }
            }
        }
        this.drawText(ctx, text, xPos, yPos, textColor, align);
    }
}
exports.BitmapFont = BitmapFont;


/***/ }),

/***/ "./lib/engine/assets/Sound.js":
/*!************************************!*\
  !*** ./lib/engine/assets/Sound.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sound = exports.getGlobalGainNode = exports.getAudioContext = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const math_1 = __webpack_require__(/*! ../util/math */ "./lib/engine/util/math.js");
const ControllerManager_1 = __webpack_require__(/*! ../input/ControllerManager */ "./lib/engine/input/ControllerManager.js");
// Get cross-browser AudioContext (Safari still uses webkitAudioContext…)
const AudioContext = (_a = window.AudioContext) !== null && _a !== void 0 ? _a : window.webkitAudioContext;
let audioContext = null;
let globalGainNode = null;
function getAudioContext() {
    const controllerManager = ControllerManager_1.ControllerManager.getInstance();
    if (audioContext == null) {
        audioContext = new AudioContext();
        // When audio context is suspended then try to wake it up on next key or pointer press
        if (audioContext.state === "suspended") {
            const resume = () => {
                audioContext === null || audioContext === void 0 ? void 0 : audioContext.resume();
            };
            controllerManager.onButtonDown.connect(resume);
            document.addEventListener("pointerdown", resume);
            audioContext.addEventListener("statechange", () => {
                if ((audioContext === null || audioContext === void 0 ? void 0 : audioContext.state) === "running") {
                    controllerManager.onButtonDown.disconnect(resume);
                    document.removeEventListener("pointerdown", resume);
                }
            });
        }
    }
    return audioContext;
}
exports.getAudioContext = getAudioContext;
function getGlobalGainNode() {
    if (globalGainNode == null) {
        const audioContext = getAudioContext();
        globalGainNode = audioContext.createGain();
        globalGainNode.connect(audioContext.destination);
    }
    return globalGainNode;
}
exports.getGlobalGainNode = getGlobalGainNode;
class Sound {
    constructor(buffer) {
        this.buffer = buffer;
        this.source = null;
        this.loop = false;
        this.gainNode = getAudioContext().createGain();
        this.gainNode.connect(getGlobalGainNode());
    }
    static load(url) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const arrayBuffer = yield (yield fetch(url)).arrayBuffer();
            return new Promise((resolve, reject) => {
                getAudioContext().decodeAudioData(arrayBuffer, buffer => resolve(new Sound(buffer)), error => reject(error));
            });
        });
    }
    isPlaying() {
        return this.source != null;
    }
    play(fadeIn = 0, delay = 0, duration) {
        if (!this.isPlaying()) {
            const source = getAudioContext().createBufferSource();
            source.buffer = this.buffer;
            source.loop = this.loop;
            source.connect(this.gainNode);
            source.addEventListener("ended", () => {
                if (this.source === source) {
                    this.source = null;
                }
            });
            this.source = source;
            if (fadeIn > 0) {
                this.gainNode.gain.setValueAtTime(0, this.source.context.currentTime);
                this.gainNode.gain.linearRampToValueAtTime(1, this.source.context.currentTime + fadeIn);
            }
            source.start(this.source.context.currentTime, delay, duration);
        }
    }
    stop(fadeOut = 0) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.source) {
                if (fadeOut > 0) {
                    const stopTime = this.source.context.currentTime + fadeOut;
                    this.gainNode.gain.linearRampToValueAtTime(0, stopTime);
                    this.source.stop(stopTime);
                }
                else {
                    try {
                        this.source.stop();
                    }
                    catch (e) {
                        // Ignored. Happens on Safari sometimes. Can't stop a sound which may not be really playing?
                    }
                }
                this.source = null;
            }
        });
    }
    setLoop(loop) {
        this.loop = loop;
        if (this.source) {
            this.source.loop = loop;
        }
    }
    setVolume(volume) {
        const gain = this.gainNode.gain;
        gain.value = math_1.clamp(volume, gain.minValue, gain.maxValue);
    }
    getVolume() {
        return this.gainNode.gain.value;
    }
}
exports.Sound = Sound;


/***/ }),

/***/ "./lib/engine/color/Color.js":
/*!***********************************!*\
  !*** ./lib/engine/color/Color.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Color = void 0;
const colors_1 = __webpack_require__(/*! ./colors */ "./lib/engine/color/colors.js");
const RGBAColor_1 = __webpack_require__(/*! ./RGBAColor */ "./lib/engine/color/RGBAColor.js");
const RGBColor_1 = __webpack_require__(/*! ./RGBColor */ "./lib/engine/color/RGBColor.js");
var Color;
(function (Color) {
    /**
     * Converts the given string into a color object. The string can be a named color or a color defined in HTML or
     * CSS format.
     *
     * @param s - The color string to parse.
     * @return The parsed color.
     */
    function fromString(s) {
        const color = colors_1.namedColors[s.trim().toLowerCase()];
        if (color != null) {
            return color;
        }
        for (const implementation of [RGBColor_1.RGBColor, RGBAColor_1.RGBAColor]) {
            try {
                return implementation.fromString(s);
            }
            catch (e) {
                // Incompatible implementation, continue searching
            }
        }
        throw new Error("Unknown color format: " + s);
    }
    Color.fromString = fromString;
    /**
     * Deserializes the given serialized color. This simply does the same same as [[fromString]].
     *
     * @param The serialized color.
     * @return The deserialized color.
     */
    function fromJSON(json) {
        return Color.fromString(json);
    }
    Color.fromJSON = fromJSON;
})(Color = exports.Color || (exports.Color = {}));


/***/ }),

/***/ "./lib/engine/color/RGBAColor.js":
/*!***************************************!*\
  !*** ./lib/engine/color/RGBAColor.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.RGBAColor = void 0;
const env_1 = __webpack_require__(/*! ../util/env */ "./lib/engine/util/env.js");
const math_1 = __webpack_require__(/*! ../util/math */ "./lib/engine/util/math.js");
const string_1 = __webpack_require__(/*! ../util/string */ "./lib/engine/util/string.js");
const RGBColor_1 = __webpack_require__(/*! ./RGBColor */ "./lib/engine/color/RGBColor.js");
/** Regular expression to parse RGBA color in HTML format. */
const RGBAColorHTMLRegExp = /^\s*#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})\s*$/i;
/** Regular expression to parse RGBA color in CSS format. */
const RGBAColorCSSRegExp = /^\s*rgba\s*\(\s*([+-]?\d*(?:\.\d+)?(?:e[+-]?\d+)?%?)\s*[\s,]\s*([+-]?\d*(?:\.\d+)?(?:e[+-]?\d+)?%?)\s*[\s,]\s*([+-]?\d*(?:\.\d+)?(?:e[+-]?\d+)?%?)\s*[\s,]\s*([+-]?\d*(?:\.\d+)?(?:e[+-]?\d+)?)\s*\)\s*$/i;
/**
 * Immutable color with red, green, blue and alpha component.
 */
class RGBAColor {
    /**
     * Creates a new RGBA color with the given color components. Values are clamped into the valid range of 0.0 to 1.0.
     *
     * @param red   - The red color component (0.0 - 1.0).
     * @param green - The green color component (0.0 - 1.0).
     * @param blue  - The blue color component (0.0 - 1.0).
     * @param alpha - Optional alpha component (0.0 - 1.0). Defaults to 1.
     */
    constructor(red, green, blue, alpha = 1) {
        this.red = math_1.clamp(red, 0, 1);
        this.green = math_1.clamp(green, 0, 1);
        this.blue = math_1.clamp(blue, 0, 1);
        this.alpha = math_1.clamp(alpha, 0, 1);
    }
    /**
     * Deserializes the given serialized RGBA color. This simply does the same same as [[fromString]].
     *
     * @param The serialized RGBA color.
     * @return The deserialized RGBA color.
     */
    static fromJSON(json) {
        return this.fromString(json);
    }
    /**
     * Parses the given string into an RGBA color object. The string can be defined in HTML or CSS format.
     *
     * @param string - The RGBA color string to parse.
     * @return The parsed RGBA color.
     */
    static fromString(s) {
        let match = RGBAColorCSSRegExp.exec(s);
        if (match != null) {
            return new RGBAColor(parseFloat(match[1]) / (match[1].endsWith("%") ? 100 : 255), parseFloat(match[2]) / (match[2].endsWith("%") ? 100 : 255), parseFloat(match[3]) / (match[3].endsWith("%") ? 100 : 255), parseFloat(match[4]));
        }
        match = RGBAColorHTMLRegExp.exec(s);
        if (match != null) {
            return new RGBAColor(parseInt(match[2], 16) / 255, parseInt(match[3], 16) / 255, parseInt(match[4], 16) / 255, parseInt(match[1], 16) / 255);
        }
        throw new Error("Invalid RGBA color format: " + s);
    }
    /** @inheritDoc */
    toJSON() {
        return this.toCSS();
    }
    /** @inheritDoc */
    toString() {
        return this.toCSS();
    }
    /**
     * Returns the color as a CSS string.
     *
     * @param maximumFractionDigits - Optional maximum number of fraction digits of values in output.
     * @return The color as a CSS string.
     */
    toCSS(maximumFractionDigits = 5) {
        const red = string_1.formatNumber(this.red * 100, { maximumFractionDigits });
        const green = string_1.formatNumber(this.green * 100, { maximumFractionDigits });
        const blue = string_1.formatNumber(this.blue * 100, { maximumFractionDigits });
        const alpha = string_1.formatNumber(this.alpha, { maximumFractionDigits });
        return `rgba(${red}%,${green}%,${blue}%,${alpha})`;
    }
    /** @inheritDoc */
    toRGB() {
        return new RGBColor_1.RGBColor(this.red, this.green, this.blue);
    }
    /** @inheritDoc */
    toRGBA() {
        return this;
    }
    /**
     * Creates color from given 32 bit integer.
     *
     * @param value        - The 32 bit integer to read the color from.
     * @param littleEndian - True for little endian byte order. False for big-endian. Default is platform-specific to
     *                       be compatible with UInt32Array behavior.
     * @return The created color.
     */
    static fromUint32(value, littleEndian = env_1.isLittleEndian()) {
        if (littleEndian) {
            return new RGBAColor((value & 255) / 255, ((value >> 8) & 255) / 255, ((value >> 16) & 255) / 255, ((value >> 24) & 255) / 255);
        }
        else {
            return new RGBAColor(((value >> 24) & 255) / 255, ((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255);
        }
    }
    /**
     * Converts the color into a 32 bit integer.
     *
     * @param littleEndian - True for little endian byte order. False for big-endian. Default is platform-specific to
     *                       be compatible with UInt32Array behavior.
     * @return The color as 32 bit integer.
     */
    toUint32(littleEndian = env_1.isLittleEndian()) {
        if (littleEndian) {
            return ((this.red * 255) | ((this.green * 255) << 8) | ((this.blue * 255) << 16)
                | ((this.alpha * 255) << 24)) >>> 0;
        }
        else {
            return ((this.alpha * 255) | ((this.blue * 255) << 8) | ((this.green * 255) << 16)
                | ((this.red * 255) << 24)) >>> 0;
        }
    }
    /**
     * Creates color from given 8 bit color components array.
     *
     * @param data   - The color components in RGB order.
     * @param offset - Optional offset within the data array to start reading the components from. Defaults to 0.
     * @return The created color.
     */
    static fromUint8(data, offset = 0) {
        return new RGBAColor(data[offset] / 255, data[offset + 1] / 255, data[offset + 2] / 255, data[offset + 3] / 255);
    }
    /**
     * Writes the color into the given color component array starting at the given offset.
     *
     * @param data  - The array to write the color components to. If not specified then a new UInt8Array with four
     *                components is created.
     * @param offset - The offset to start writing the color components to.
     * @return The data array.
     */
    toUint8(data = new Uint8Array(4), offset = 0) {
        data[offset] = this.red * 255 | 0;
        data[offset + 1] = this.green * 255 | 0;
        data[offset + 2] = this.blue * 255 | 0;
        data[offset + 3] = this.alpha * 255 | 0;
        return data;
    }
    /**
     * Returns the red component of the color.
     *
     * @return The red component (0.0 - 1.0).
     */
    getRed() {
        return this.red;
    }
    /**
     * Returns the green component of the color.
     *
     * @return The green component (0.0 - 1.0).
     */
    getGreen() {
        return this.green;
    }
    /**
     * Returns the blue component of the color.
     *
     * @return The blue component (0.0 - 1.0).
     */
    getBlue() {
        return this.blue;
    }
    /**
     * Returns the alpha component of the color.
     *
     * @return The alpha component (0.0 - 1.0).
     */
    getAlpha() {
        return this.alpha;
    }
    /** @inheritDoc */
    darken(factor) {
        return new RGBAColor(this.red * (1 - factor), this.green * (1 - factor), this.blue * (1 - factor), this.alpha);
    }
}
exports.RGBAColor = RGBAColor;


/***/ }),

/***/ "./lib/engine/color/RGBColor.js":
/*!**************************************!*\
  !*** ./lib/engine/color/RGBColor.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.RGBColor = void 0;
const env_1 = __webpack_require__(/*! ../util/env */ "./lib/engine/util/env.js");
const math_1 = __webpack_require__(/*! ../util/math */ "./lib/engine/util/math.js");
const string_1 = __webpack_require__(/*! ../util/string */ "./lib/engine/util/string.js");
const RGBAColor_1 = __webpack_require__(/*! ./RGBAColor */ "./lib/engine/color/RGBAColor.js");
/** Regular expression to parse RGB color in HTML format. */
const RGBColorHTMLRegExp = /^\s*#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})\s*$/i;
/** Regular expression to parse RGB color in CSS format. */
const RGBColorCSSRegExp = /^\s*rgb\s*\(\s*([+-]?\d*(?:\.\d+)?(?:e[+-]?\d+)?%?)\s*[\s,]\s*([+-]?\d*(?:\.\d+)?(?:e[+-]?\d+)?%?)\s*[\s,]\s*([+-]?\d*(?:\.\d+)?(?:e[+-]?\d+)?%?)\s*\)\s*$/i;
/**
 * Immutable color with red, green and blue component.
 */
class RGBColor {
    /**
     * Creates a new RGB color with the given color components. Values are clamped into the valid range of 0.0 to 1.0.
     *
     * @param red   - The red color component (0.0 - 1.0).
     * @param green - The green color component (0.0 - 1.0).
     * @param blue  - The blue color component (0.0 - 1.0).
     */
    constructor(red, green, blue) {
        this.red = math_1.clamp(red, 0, 1);
        this.green = math_1.clamp(green, 0, 1);
        this.blue = math_1.clamp(blue, 0, 1);
    }
    /**
     * Deserializes the given serialized RGB color. This simply does the same same as [[fromString]].
     *
     * @param The serialized RGB color.
     * @return The deserialized RGB color.
     */
    static fromJSON(json) {
        return this.fromString(json);
    }
    /**
     * Parses the given string into an RGB color object. The string can be defined in HTML or CSS format.
     *
     * @param string - The RGB color string to parse.
     * @return The parsed RGB color.
     */
    static fromString(s) {
        let match = RGBColorCSSRegExp.exec(s);
        if (match != null) {
            return new RGBColor(parseFloat(match[1]) / (match[1].endsWith("%") ? 100 : 255), parseFloat(match[2]) / (match[2].endsWith("%") ? 100 : 255), parseFloat(match[3]) / (match[3].endsWith("%") ? 100 : 255));
        }
        match = RGBColorHTMLRegExp.exec(s);
        if (match != null) {
            return new RGBColor(parseInt(match[1], 16) / 255, parseInt(match[2], 16) / 255, parseInt(match[3], 16) / 255);
        }
        throw new Error("Invalid RGB color format: " + s);
    }
    /** @inheritDoc */
    toJSON() {
        return this.toCSS();
    }
    /** @inheritDoc */
    toString() {
        return this.toCSS();
    }
    /**
     * Returns the color as an HTML string.
     *
     * @return The color as an HTML string.
     */
    toHTML() {
        return `#${string_1.toHex(this.red * 255, 2)}${string_1.toHex(this.green * 255, 2)}${string_1.toHex(this.blue * 255, 2)}`;
    }
    /**
     * Returns the color as a CSS string.
     *
     * @param maximumFractionDigits - Optional maximum number of fraction digits of percentage values in output.
     * @return The color as a CSS string.
     */
    toCSS(maximumFractionDigits = 3) {
        const red = string_1.formatNumber(this.red * 100, { maximumFractionDigits });
        const green = string_1.formatNumber(this.green * 100, { maximumFractionDigits });
        const blue = string_1.formatNumber(this.blue * 100, { maximumFractionDigits });
        return `rgb(${red}%,${green}%,${blue}%)`;
    }
    /** @inheritDoc */
    toRGB() {
        return this;
    }
    /** @inheritDoc */
    toRGBA() {
        return new RGBAColor_1.RGBAColor(this.red, this.green, this.blue, 1.0);
    }
    /**
     * Creates color from given 32 bit integer.
     *
     * @param value        - The 32 bit integer to read the color from.
     * @param littleEndian - True for little endian byte order. False for big-endian. Default is platform-specific to
     *                       be compatible with UInt32Array behavior.
     * @return The created color.
     */
    static fromUint32(value, littleEndian = env_1.isLittleEndian()) {
        if (littleEndian) {
            return new RGBColor((value & 255) / 255, ((value >> 8) & 255) / 255, ((value >> 16) & 255) / 255);
        }
        else {
            return new RGBColor(((value >> 24) & 255) / 255, ((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255);
        }
    }
    /**
     * Converts the color into a 32 bit integer.
     *
     * @param littleEndian - True for little endian byte order. False for big-endian. Default is platform-specific to
     *                       be compatible with UInt32Array behavior.
     * @return The color as 32 bit integer.
     */
    toUint32(littleEndian = env_1.isLittleEndian()) {
        if (littleEndian) {
            return ((this.red * 255) | ((this.green * 255) << 8) | ((this.blue * 255) << 16) | (255 << 24)) >>> 0;
        }
        else {
            return (255 | ((this.blue * 255) << 8) | ((this.green * 255) << 16) | ((this.red * 255) << 24)) >>> 0;
        }
    }
    /**
     * Creates color from given 8 bit color components array.
     *
     * @param data   - The color components in RGB order.
     * @param offset - Optional offset within the data array to start reading the components from. Defaults to 0.
     * @return The created color.
     */
    static fromUint8(data, offset = 0) {
        return new RGBColor(data[offset] / 255, data[offset + 1] / 255, data[offset + 2] / 255);
    }
    /**
     * Writes the color into the given color component array starting at the given offset.
     *
     * @param data  - The array to write the color components to. If not specified then a new UInt8Array with three
     *                components is created.
     * @param offset - The offset to start writing the color components to.
     * @return The data array.
     */
    toUint8(data = new Uint8Array(3), offset = 0) {
        data[offset] = this.red * 255 | 0;
        data[offset + 1] = this.green * 255 | 0;
        data[offset + 2] = this.blue * 255 | 0;
        return data;
    }
    /**
     * Returns the red component of the color.
     *
     * @return The red component (0.0 - 1.0).
     */
    getRed() {
        return this.red;
    }
    /**
     * Returns the green component of the color.
     *
     * @return The green component (0.0 - 1.0).
     */
    getGreen() {
        return this.green;
    }
    /**
     * Returns the blue component of the color.
     *
     * @return The blue component (0.0 - 1.0).
     */
    getBlue() {
        return this.blue;
    }
    /** @inheritDoc */
    darken(factor) {
        return new RGBColor(this.red * (1 - factor), this.green * (1 - factor), this.blue * (1 - factor));
    }
}
exports.RGBColor = RGBColor;


/***/ }),

/***/ "./lib/engine/color/colors.js":
/*!************************************!*\
  !*** ./lib/engine/color/colors.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.namedColors = void 0;
const RGBColor_1 = __webpack_require__(/*! ./RGBColor */ "./lib/engine/color/RGBColor.js");
/**
 * Map with named colors.
 */
exports.namedColors = {
    "aliceblue": RGBColor_1.RGBColor.fromUint32(0xfffff8f0, true),
    "antiquewhite": RGBColor_1.RGBColor.fromUint32(0xffd7ebfa, true),
    "aqua": RGBColor_1.RGBColor.fromUint32(0xffffff00, true),
    "aquamarine": RGBColor_1.RGBColor.fromUint32(0xffd4ff7f, true),
    "azure": RGBColor_1.RGBColor.fromUint32(0xfffffff0, true),
    "beige": RGBColor_1.RGBColor.fromUint32(0xffdcf5f5, true),
    "bisque": RGBColor_1.RGBColor.fromUint32(0xffc4e4ff, true),
    "black": RGBColor_1.RGBColor.fromUint32(0xff000000, true),
    "blanchedalmond": RGBColor_1.RGBColor.fromUint32(0xffcdebff, true),
    "blue": RGBColor_1.RGBColor.fromUint32(0xffff0000, true),
    "blueviolet": RGBColor_1.RGBColor.fromUint32(0xffe22b8a, true),
    "brown": RGBColor_1.RGBColor.fromUint32(0xff2a2aa5, true),
    "burlywood": RGBColor_1.RGBColor.fromUint32(0xff87b8de, true),
    "cadetblue": RGBColor_1.RGBColor.fromUint32(0xffa09e5f, true),
    "chartreuse": RGBColor_1.RGBColor.fromUint32(0xff00ff7f, true),
    "chocolate": RGBColor_1.RGBColor.fromUint32(0xff1e69d2, true),
    "coral": RGBColor_1.RGBColor.fromUint32(0xff507fff, true),
    "cornflowerblue": RGBColor_1.RGBColor.fromUint32(0xffed9564, true),
    "cornsilk": RGBColor_1.RGBColor.fromUint32(0xffdcf8ff, true),
    "crimson": RGBColor_1.RGBColor.fromUint32(0xff3c14dc, true),
    "cyan": RGBColor_1.RGBColor.fromUint32(0xffffff00, true),
    "darkblue": RGBColor_1.RGBColor.fromUint32(0xff8b0000, true),
    "darkcyan": RGBColor_1.RGBColor.fromUint32(0xff8b8b00, true),
    "darkgoldenrod": RGBColor_1.RGBColor.fromUint32(0xff0b86b8, true),
    "darkgray": RGBColor_1.RGBColor.fromUint32(0xffa9a9a9, true),
    "darkgreen": RGBColor_1.RGBColor.fromUint32(0xff006400, true),
    "darkgrey": RGBColor_1.RGBColor.fromUint32(0xffa9a9a9, true),
    "darkkhaki": RGBColor_1.RGBColor.fromUint32(0xff6bb7bd, true),
    "darkmagenta": RGBColor_1.RGBColor.fromUint32(0xff8b008b, true),
    "darkolivegreen": RGBColor_1.RGBColor.fromUint32(0xff2f6b55, true),
    "darkorange": RGBColor_1.RGBColor.fromUint32(0xff008cff, true),
    "darkorchid": RGBColor_1.RGBColor.fromUint32(0xffcc3299, true),
    "darkred": RGBColor_1.RGBColor.fromUint32(0xff00008b, true),
    "darksalmon": RGBColor_1.RGBColor.fromUint32(0xff7a96e9, true),
    "darkseagreen": RGBColor_1.RGBColor.fromUint32(0xff8fbc8f, true),
    "darkslateblue": RGBColor_1.RGBColor.fromUint32(0xff8b3d48, true),
    "darkslategray": RGBColor_1.RGBColor.fromUint32(0xff4f4f2f, true),
    "darkslategrey": RGBColor_1.RGBColor.fromUint32(0xff4f4f2f, true),
    "darkturquoise": RGBColor_1.RGBColor.fromUint32(0xffd1ce00, true),
    "darkviolet": RGBColor_1.RGBColor.fromUint32(0xffd30094, true),
    "deeppink": RGBColor_1.RGBColor.fromUint32(0xff9314ff, true),
    "deepskyblue": RGBColor_1.RGBColor.fromUint32(0xffffbf00, true),
    "dimgray": RGBColor_1.RGBColor.fromUint32(0xff696969, true),
    "dimgrey": RGBColor_1.RGBColor.fromUint32(0xff696969, true),
    "dodgerblue": RGBColor_1.RGBColor.fromUint32(0xffff901e, true),
    "firebrick": RGBColor_1.RGBColor.fromUint32(0xff2222b2, true),
    "floralwhite": RGBColor_1.RGBColor.fromUint32(0xfff0faff, true),
    "forestgreen": RGBColor_1.RGBColor.fromUint32(0xff228b22, true),
    "fuchsia": RGBColor_1.RGBColor.fromUint32(0xffff00ff, true),
    "gainsboro": RGBColor_1.RGBColor.fromUint32(0xffdcdcdc, true),
    "ghostwhite": RGBColor_1.RGBColor.fromUint32(0xfffff8f8, true),
    "gold": RGBColor_1.RGBColor.fromUint32(0xff00d7ff, true),
    "goldenrod": RGBColor_1.RGBColor.fromUint32(0xff20a5da, true),
    "gray": RGBColor_1.RGBColor.fromUint32(0xff808080, true),
    "green": RGBColor_1.RGBColor.fromUint32(0xff008000, true),
    "greenyellow": RGBColor_1.RGBColor.fromUint32(0xff2fffad, true),
    "grey": RGBColor_1.RGBColor.fromUint32(0xff808080, true),
    "honeydew": RGBColor_1.RGBColor.fromUint32(0xfff0fff0, true),
    "hotpink": RGBColor_1.RGBColor.fromUint32(0xffb469ff, true),
    "indianred": RGBColor_1.RGBColor.fromUint32(0xff5c5ccd, true),
    "indigo": RGBColor_1.RGBColor.fromUint32(0xff82004b, true),
    "ivory": RGBColor_1.RGBColor.fromUint32(0xfff0ffff, true),
    "khaki": RGBColor_1.RGBColor.fromUint32(0xff8ce6f0, true),
    "lavender": RGBColor_1.RGBColor.fromUint32(0xfffae6e6, true),
    "lavenderblush": RGBColor_1.RGBColor.fromUint32(0xfff5f0ff, true),
    "lawngreen": RGBColor_1.RGBColor.fromUint32(0xff00fc7c, true),
    "lemonchiffon": RGBColor_1.RGBColor.fromUint32(0xffcdfaff, true),
    "lightblue": RGBColor_1.RGBColor.fromUint32(0xffe6d8ad, true),
    "lightcoral": RGBColor_1.RGBColor.fromUint32(0xff8080f0, true),
    "lightcyan": RGBColor_1.RGBColor.fromUint32(0xffffffe0, true),
    "lightgoldenrodyellow": RGBColor_1.RGBColor.fromUint32(0xffd2fafa, true),
    "lightgray": RGBColor_1.RGBColor.fromUint32(0xffd3d3d3, true),
    "lightgreen": RGBColor_1.RGBColor.fromUint32(0xff90ee90, true),
    "lightgrey": RGBColor_1.RGBColor.fromUint32(0xffd3d3d3, true),
    "lightpink": RGBColor_1.RGBColor.fromUint32(0xffc1b6ff, true),
    "lightsalmon": RGBColor_1.RGBColor.fromUint32(0xff7aa0ff, true),
    "lightseagreen": RGBColor_1.RGBColor.fromUint32(0xffaab220, true),
    "lightskyblue": RGBColor_1.RGBColor.fromUint32(0xffface87, true),
    "lightslategray": RGBColor_1.RGBColor.fromUint32(0xff998877, true),
    "lightslategrey": RGBColor_1.RGBColor.fromUint32(0xff998877, true),
    "lightsteelblue": RGBColor_1.RGBColor.fromUint32(0xffdec4b0, true),
    "lightyellow": RGBColor_1.RGBColor.fromUint32(0xffe0ffff, true),
    "lime": RGBColor_1.RGBColor.fromUint32(0xff00ff00, true),
    "limegreen": RGBColor_1.RGBColor.fromUint32(0xff32cd32, true),
    "linen": RGBColor_1.RGBColor.fromUint32(0xffe6f0fa, true),
    "magenta": RGBColor_1.RGBColor.fromUint32(0xffff00ff, true),
    "maroon": RGBColor_1.RGBColor.fromUint32(0xff000080, true),
    "mediumaquamarine": RGBColor_1.RGBColor.fromUint32(0xffaacd66, true),
    "mediumblue": RGBColor_1.RGBColor.fromUint32(0xffcd0000, true),
    "mediumorchid": RGBColor_1.RGBColor.fromUint32(0xffd355ba, true),
    "mediumpurple": RGBColor_1.RGBColor.fromUint32(0xffdb7093, true),
    "mediumseagreen": RGBColor_1.RGBColor.fromUint32(0xff71b33c, true),
    "mediumslateblue": RGBColor_1.RGBColor.fromUint32(0xffee687b, true),
    "mediumspringgreen": RGBColor_1.RGBColor.fromUint32(0xff9afa00, true),
    "mediumturquoise": RGBColor_1.RGBColor.fromUint32(0xffccd148, true),
    "mediumvioletred": RGBColor_1.RGBColor.fromUint32(0xff8515c7, true),
    "midnightblue": RGBColor_1.RGBColor.fromUint32(0xff701919, true),
    "mintcream": RGBColor_1.RGBColor.fromUint32(0xfffafff5, true),
    "mistyrose": RGBColor_1.RGBColor.fromUint32(0xffe1e4ff, true),
    "moccasin": RGBColor_1.RGBColor.fromUint32(0xffb5e4ff, true),
    "navajowhite": RGBColor_1.RGBColor.fromUint32(0xffaddeff, true),
    "navy": RGBColor_1.RGBColor.fromUint32(0xff800000, true),
    "oldlace": RGBColor_1.RGBColor.fromUint32(0xffe6f5fd, true),
    "olive": RGBColor_1.RGBColor.fromUint32(0xff008080, true),
    "olivedrab": RGBColor_1.RGBColor.fromUint32(0xff238e6b, true),
    "orange": RGBColor_1.RGBColor.fromUint32(0xff00a5ff, true),
    "orangered": RGBColor_1.RGBColor.fromUint32(0xff0045ff, true),
    "orchid": RGBColor_1.RGBColor.fromUint32(0xffd670da, true),
    "palegoldenrod": RGBColor_1.RGBColor.fromUint32(0xffaae8ee, true),
    "palegreen": RGBColor_1.RGBColor.fromUint32(0xff98fb98, true),
    "paleturquoise": RGBColor_1.RGBColor.fromUint32(0xffeeeeaf, true),
    "palevioletred": RGBColor_1.RGBColor.fromUint32(0xff9370db, true),
    "papayawhip": RGBColor_1.RGBColor.fromUint32(0xffd5efff, true),
    "peachpuff": RGBColor_1.RGBColor.fromUint32(0xffb9daff, true),
    "peru": RGBColor_1.RGBColor.fromUint32(0xff3f85cd, true),
    "pink": RGBColor_1.RGBColor.fromUint32(0xffcbc0ff, true),
    "plum": RGBColor_1.RGBColor.fromUint32(0xffdda0dd, true),
    "powderblue": RGBColor_1.RGBColor.fromUint32(0xffe6e0b0, true),
    "purple": RGBColor_1.RGBColor.fromUint32(0xff800080, true),
    "red": RGBColor_1.RGBColor.fromUint32(0xff0000ff, true),
    "rosybrown": RGBColor_1.RGBColor.fromUint32(0xff8f8fbc, true),
    "royalblue": RGBColor_1.RGBColor.fromUint32(0xffe16941, true),
    "saddlebrown": RGBColor_1.RGBColor.fromUint32(0xff13458b, true),
    "salmon": RGBColor_1.RGBColor.fromUint32(0xff7280fa, true),
    "sandybrown": RGBColor_1.RGBColor.fromUint32(0xff60a4f4, true),
    "seagreen": RGBColor_1.RGBColor.fromUint32(0xff578b2e, true),
    "seashell": RGBColor_1.RGBColor.fromUint32(0xffeef5ff, true),
    "sienna": RGBColor_1.RGBColor.fromUint32(0xff2d52a0, true),
    "silver": RGBColor_1.RGBColor.fromUint32(0xffc0c0c0, true),
    "skyblue": RGBColor_1.RGBColor.fromUint32(0xffebce87, true),
    "slateblue": RGBColor_1.RGBColor.fromUint32(0xffcd5a6a, true),
    "slategray": RGBColor_1.RGBColor.fromUint32(0xff908070, true),
    "slategrey": RGBColor_1.RGBColor.fromUint32(0xff908070, true),
    "snow": RGBColor_1.RGBColor.fromUint32(0xfffafaff, true),
    "springgreen": RGBColor_1.RGBColor.fromUint32(0xff7fff00, true),
    "steelblue": RGBColor_1.RGBColor.fromUint32(0xffb48246, true),
    "tan": RGBColor_1.RGBColor.fromUint32(0xff8cb4d2, true),
    "teal": RGBColor_1.RGBColor.fromUint32(0xff808000, true),
    "thistle": RGBColor_1.RGBColor.fromUint32(0xffd8bfd8, true),
    "tomato": RGBColor_1.RGBColor.fromUint32(0xff4763ff, true),
    "turquoise": RGBColor_1.RGBColor.fromUint32(0xffd0e040, true),
    "violet": RGBColor_1.RGBColor.fromUint32(0xffee82ee, true),
    "wheat": RGBColor_1.RGBColor.fromUint32(0xffb3def5, true),
    "white": RGBColor_1.RGBColor.fromUint32(0xffffffff, true),
    "whitesmoke": RGBColor_1.RGBColor.fromUint32(0xfff5f5f5, true),
    "yellow": RGBColor_1.RGBColor.fromUint32(0xff00ffff, true),
    "yellowgreen": RGBColor_1.RGBColor.fromUint32(0xff32cd9a, true)
};


/***/ }),

/***/ "./lib/engine/geom/Direction.js":
/*!**************************************!*\
  !*** ./lib/engine/geom/Direction.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Direction = void 0;
var Direction;
(function (Direction) {
    Direction[Direction["CENTER"] = 0] = "CENTER";
    Direction[Direction["LEFT"] = 1] = "LEFT";
    Direction[Direction["RIGHT"] = 2] = "RIGHT";
    Direction[Direction["TOP"] = 4] = "TOP";
    Direction[Direction["BOTTOM"] = 8] = "BOTTOM";
    Direction[Direction["TOP_LEFT"] = 5] = "TOP_LEFT";
    Direction[Direction["BOTTOM_LEFT"] = 9] = "BOTTOM_LEFT";
    Direction[Direction["TOP_RIGHT"] = 6] = "TOP_RIGHT";
    Direction[Direction["BOTTOM_RIGHT"] = 10] = "BOTTOM_RIGHT";
})(Direction = exports.Direction || (exports.Direction = {}));
(function (Direction) {
    function isLeft(direction) {
        return (direction & Direction.LEFT) !== 0;
    }
    Direction.isLeft = isLeft;
    function isRight(direction) {
        return (direction & Direction.RIGHT) !== 0;
    }
    Direction.isRight = isRight;
    function isTop(direction) {
        return (direction & Direction.TOP) !== 0;
    }
    Direction.isTop = isTop;
    function isBottom(direction) {
        return (direction & Direction.BOTTOM) !== 0;
    }
    Direction.isBottom = isBottom;
    function isHorizontal(direction) {
        return isLeft(direction) || isRight(direction);
    }
    Direction.isHorizontal = isHorizontal;
    function isVertical(direction) {
        return isLeft(direction) || isRight(direction);
    }
    Direction.isVertical = isVertical;
    function isEdge(direction) {
        return direction === Direction.LEFT
            || direction === Direction.RIGHT
            || direction === Direction.TOP
            || direction === Direction.BOTTOM;
    }
    Direction.isEdge = isEdge;
    function isCorner(direction) {
        return direction === Direction.TOP_LEFT
            || direction === Direction.TOP_RIGHT
            || direction === Direction.BOTTOM_LEFT
            || direction === Direction.BOTTOM_RIGHT;
    }
    Direction.isCorner = isCorner;
    function getX(direction) {
        return isLeft(direction) ? -1 : isRight(direction) ? 1 : 0;
    }
    Direction.getX = getX;
    function getY(direction) {
        return isTop(direction) ? -1 : isBottom(direction) ? 1 : 0;
    }
    Direction.getY = getY;
})(Direction = exports.Direction || (exports.Direction = {}));


/***/ }),

/***/ "./lib/engine/geom/Rect.js":
/*!*********************************!*\
  !*** ./lib/engine/geom/Rect.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Rect = void 0;
class Rect {
    constructor(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
    getLeft() {
        return this.left;
    }
    getTop() {
        return this.top;
    }
    getWidth() {
        return this.width;
    }
    getHeight() {
        return this.height;
    }
    getRight() {
        return this.width + this.left;
    }
    getBottom() {
        return this.height + this.top;
    }
    getCenterX() {
        return this.left + this.width / 2;
    }
    getCenterY() {
        return this.top + this.height / 2;
    }
}
exports.Rect = Rect;


/***/ }),

/***/ "./lib/engine/graphics/AffineTransform.js":
/*!************************************************!*\
  !*** ./lib/engine/graphics/AffineTransform.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.AffineTransform = void 0;
/**
 * Affine transformation matrix. It behaves like a 3x3 matrix where the third row is always assumed to be 0 0 1.
 * This matrix is useful for 2D transformations and is compatible to the transformations done in a Canvas for example.
 */
class AffineTransform {
    constructor(m11 = 1, m12 = 0, m21 = 0, m22 = 1, dx = 0, dy = 0) {
        this.m11 = m11;
        this.m12 = m12;
        this.m21 = m21;
        this.m22 = m22;
        this.dx = dx;
        this.dy = dy;
    }
    /**
     * Creates a new affine transformation from the given DOM matrix object.
     *
     * @aram domMatrix - The DOM matrix object. Must be a 2D matrix.
     * @return The created affine transformation.
     */
    static fromDOMMatrix(domMatrix) {
        if (!domMatrix.is2D) {
            throw new Error("Can only create Matrix3 from 2D DOMMatrix");
        }
        return new AffineTransform(domMatrix.a, domMatrix.b, domMatrix.c, domMatrix.d, domMatrix.e, domMatrix.f);
    }
    /** @inheritDoc */
    clone() {
        return new AffineTransform(this.m11, this.m12, this.m21, this.m22, this.dx, this.dy);
    }
    /** @inheritDoc */
    toDOMMatrix() {
        return new DOMMatrix([this.m11, this.m12, this.m21, this.m22, this.dx, this.dy]);
    }
    /** @inheritDoc */
    toString() {
        return `[ ${this.m11}, ${this.m12}, ${this.m21}, ${this.m22}, ${this.dx}, ${this.dy} ]`;
    }
    /**
     * Sets the matrix component values.
     *
     * @param m11 - The horizontal scaling. A value of 1 results in no scaling.
     * @param m12 - The vertical skewing.
     * @param m21 - The horizontal skewing.
     * @param m22 - The vertical scaling. A value of 1 results in no scaling.
     * @param dx  - The horizontal translation (moving).
     * @param dy  - The vertical translation (moving).
     */
    setComponents(m11, m12, m21, m22, dx, dy) {
        this.m11 = m11;
        this.m12 = m12;
        this.m21 = m21;
        this.m22 = m22;
        this.dx = dx;
        this.dy = dy;
        return this;
    }
    /**
     * Sets the matrix component values from another matrix.
     *
     * @param matrix - The matrix to copy the component values from.
     */
    setMatrix(matrix) {
        this.m11 = matrix.m11;
        this.m12 = matrix.m12;
        this.m21 = matrix.m21;
        this.m22 = matrix.m22;
        this.dx = matrix.dx;
        this.dy = matrix.dy;
        return this;
    }
    /** @inheritDoc */
    isIdentity() {
        return this.m11 === 1
            && this.m12 === 0
            && this.m21 === 0
            && this.m22 === 1
            && this.dx === 0
            && this.dy === 0;
    }
    /**
     * Resets this matrix to identity.
     */
    reset() {
        this.m11 = 1;
        this.m12 = 0;
        this.m21 = 0;
        this.m22 = 1;
        this.dx = 0;
        this.dy = 0;
        return this;
    }
    /**
     * Multiplies this matrix with the specified matrix (`this = this * other`).
     *
     * @param other - The other matrix to multiply this one with.
     */
    mul(other) {
        const a11 = this.m11, a12 = this.m12;
        const a21 = this.m21, a22 = this.m22;
        const a31 = this.dx, a32 = this.dy;
        const b11 = other.m11, b12 = other.m12;
        const b21 = other.m21, b22 = other.m22;
        const b31 = other.dx, b32 = other.dy;
        this.m11 = a11 * b11 + a21 * b12;
        this.m12 = a12 * b11 + a22 * b12;
        this.m21 = a11 * b21 + a21 * b22;
        this.m22 = a12 * b21 + a22 * b22;
        this.dx = a11 * b31 + a21 * b32 + a31;
        this.dy = a12 * b31 + a22 * b32 + a32;
        return this;
    }
    /**
     * Divides this matrix by the specified matrix (`this = this / other` which is the same as
     * `this = this * inverse(other)`).
     *
     * @param other - The other matrix to divide this one by.
     */
    div(other) {
        // a = this, b = other
        const a11 = this.m11, a12 = this.m12;
        const a21 = this.m21, a22 = this.m22;
        const a31 = this.dx, a32 = this.dy;
        const b11 = other.m11, b12 = other.m12;
        const b21 = other.m21, b22 = other.m22;
        const b31 = other.dx, b32 = other.dy;
        // d = determinant(b)
        const d = b11 * b22 - b21 * b12;
        // c = invert(b)
        const c11 = b22 / d;
        const c12 = -b12 / d;
        const c21 = -b21 / d;
        const c22 = b11 / d;
        const c31 = (b21 * b32 - b31 * b22) / d;
        const c32 = (b31 * b12 - b11 * b32) / d;
        // this = this * c
        this.m11 = a11 * c11 + a21 * c12;
        this.m12 = a12 * c11 + a22 * c12;
        this.m21 = a11 * c21 + a21 * c22;
        this.m22 = a12 * c21 + a22 * c22;
        this.dx = a11 * c31 + a21 * c32 + a31;
        this.dy = a12 * c31 + a22 * c32 + a32;
        return this;
    }
    /** @inheritDoc */
    getDeterminant() {
        return this.m11 * this.m22 - this.m21 * this.m12;
    }
    /**
     * Inverts this matrix.
     */
    invert() {
        const m11 = this.m11, m12 = this.m12;
        const m21 = this.m21, m22 = this.m22;
        const m31 = this.dx, m32 = this.dy;
        const d = m11 * m22 - m21 * m12;
        this.m11 = m22 / d;
        this.m12 = -m12 / d;
        this.m21 = -m21 / d;
        this.m22 = m11 / d;
        this.dx = (m21 * m32 - m31 * m22) / d;
        this.dy = (m31 * m12 - m11 * m32) / d;
        return this;
    }
    /**
     * Translates this matrix by the specified values.
     *
     * @param dx - The X translation.
     * @param dy - The Y translation.
     */
    translate(dx, dy) {
        this.dx += dx * this.m11 + dy * this.m21;
        this.dy += dx * this.m12 + dy * this.m22;
        return this;
    }
    /**
     * Translates this matrix by the specified X delta.
     *
     * @param d - The X translation delta.
     */
    translateX(d) {
        this.dx += d * this.m11;
        this.dy += d * this.m12;
        return this;
    }
    /** @inheritDoc */
    getTranslationX() {
        return this.dx;
    }
    /**
     * Translates this matrix by the specified Y delta.
     *
     * @param d - The Y translation delta.
     */
    translateY(d) {
        this.dx += d * this.m21;
        this.dy += d * this.m22;
        return this;
    }
    /** @inheritDoc */
    getTranslationY() {
        return this.dy;
    }
    /**
     * Sets matrix to a translation matrix.
     *
     * @param dx - The X translation.
     * @param dy - The Y translation.
     */
    setTranslation(dx, dy) {
        this.m11 = 1;
        this.m12 = 0;
        this.m21 = 0;
        this.m22 = 1;
        this.dx = dx;
        this.dy = dy;
        return this;
    }
    /**
     * Creates matrix initialized to a translation matrix.
     *
     * @param dx - The X translation.
     * @param dy - The Y translation.
     */
    static createTranslation(dx, dy) {
        return new AffineTransform().setTranslation(dx, dy);
    }
    /**
     * Scales this matrix by the specified factor.
     *
     * @param sx - The X scale factor.
     * @param sy - The Y scale factor. Defaults to X scale factor.
     */
    scale(sx, sy = sx) {
        this.m11 *= sx;
        this.m12 *= sx;
        this.m21 *= sy;
        this.m22 *= sy;
        return this;
    }
    /**
     * Sets matrix to a scale matrix.
     *
     * @param sx - The X scale factor.
     * @param sy - The Y scale factor. Defaults to X scale factor.
     */
    setScale(sx, sy = sx) {
        this.m11 = sx;
        this.m12 = 0;
        this.m21 = 0;
        this.m22 = sy;
        this.dx = 0;
        this.dy = 0;
        return this;
    }
    /**
     * Scales this matrix by the specified factor along the X axis.
     *
     * @param s - The scale factor.
     */
    scaleX(s) {
        this.m11 *= s;
        this.m12 *= s;
        return this;
    }
    /** @inheritDoc */
    getScaleX() {
        return Math.hypot(this.m11, this.m21);
    }
    /**
     * Scales this matrix by the specified factor along the Y axis.
     *
     * @param s - The scale factor.
     */
    scaleY(s) {
        this.m21 *= s;
        this.m22 *= s;
        return this;
    }
    /** @inheritDoc */
    getScaleY() {
        return Math.hypot(this.m12, this.m22);
    }
    /**
     * Creates matrix initialized to a scale matrix.
     *
     * @param sx - The X scale factor.
     * @param sy - The Y scale factor. Defaults to X scale factor.
     */
    static createScale(sx, sy) {
        return new AffineTransform().setScale(sx, sy);
    }
    /**
     * Rotates this matrix by the given angle.
     *
     * @param angle - The rotation angle in RAD.
     */
    rotate(angle) {
        const m11 = this.m11, m12 = this.m12;
        const m21 = this.m21, m22 = this.m22;
        const s = Math.sin(angle), c = Math.cos(angle);
        this.m11 = c * m11 + s * m21;
        this.m12 = c * m12 + s * m22;
        this.m21 = c * m21 - s * m11;
        this.m22 = c * m22 - s * m12;
        return this;
    }
    /** @inheritDoc */
    getRotation() {
        const m11 = this.m11, m12 = this.m12;
        const m21 = this.m21, m22 = this.m22;
        if (m11 !== 0 || m21 !== 0) {
            const acos = Math.acos(m11 / Math.hypot(m11, m21));
            return m21 > 0 ? -acos : acos;
        }
        else if (m12 !== 0 || m22 !== 0) {
            const acos = Math.acos(m12 / Math.hypot(m12, m22));
            return Math.PI / 2 + (m22 > 0 ? -acos : acos);
        }
        else {
            return 0;
        }
    }
    /**
     * Sets matrix to a rotation matrix.
     *
     * @param angle - The rotation angle in RAD.
     */
    setRotation(angle) {
        const s = Math.sin(angle), c = Math.cos(angle);
        this.m11 = c;
        this.m12 = s;
        this.m21 = -s;
        this.m22 = c;
        this.dx = 0;
        this.dy = 0;
        return this;
    }
    /**
     * Create new matrix initialized to a rotation matrix.
     *
     * @param angle - The rotation angle in RAD.
     */
    static createRotation(angle) {
        return new AffineTransform().setRotation(angle);
    }
    /** @inheritDoc */
    transformCanvas(ctx) {
        ctx.transform(this.m11, this.m12, this.m21, this.m22, this.dx, this.dy);
        return this;
    }
    /** @inheritDoc */
    setCanvasTransform(ctx) {
        ctx.setTransform(this.m11, this.m12, this.m21, this.m22, this.dx, this.dy);
        return this;
    }
}
exports.AffineTransform = AffineTransform;


/***/ }),

/***/ "./lib/engine/graphics/Bounds2.js":
/*!****************************************!*\
  !*** ./lib/engine/graphics/Bounds2.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Bounds2 = void 0;
const Rect_1 = __webpack_require__(/*! ../geom/Rect */ "./lib/engine/geom/Rect.js");
class Bounds2 {
    constructor() {
        this.minX = Infinity;
        this.maxX = -Infinity;
        this.minY = Infinity;
        this.maxY = -Infinity;
    }
    get centerX() {
        return this.minX + this.width / 2;
    }
    get centerY() {
        return this.minY + this.height / 2;
    }
    get width() {
        return this.maxX - this.minX;
    }
    get height() {
        return this.maxY - this.minY;
    }
    reset() {
        this.minX = this.minY = Infinity;
        this.maxX = this.maxY = -Infinity;
        return this;
    }
    isEmpty() {
        return this.minX > this.maxX || this.minY > this.maxY;
    }
    addVertex(vertex) {
        this.minX = Math.min(this.minX, vertex.x);
        this.maxX = Math.max(this.maxX, vertex.x);
        this.minY = Math.min(this.minY, vertex.y);
        this.maxY = Math.max(this.maxY, vertex.y);
        return this;
    }
    addLine(line) {
        return this.addVertex(line.start).addVertex(line.end);
    }
    addPolygon(polygon) {
        for (const vertex of polygon.vertices) {
            this.addVertex(vertex);
        }
        return this;
    }
    toRect() {
        return new Rect_1.Rect(this.minX, this.minY, this.maxX - this.minX, this.maxY - this.minY);
    }
    /**
     * Checks if this bounding box collides with the given one.
     *
     * @param other - The other bounding box to check collision with.
     * @return True if bounding boxes collide, false if not.
     */
    collidesWith(other) {
        return this.minY <= other.maxY && this.maxY >= other.minY && this.minX <= other.maxX && this.maxX >= other.minX;
    }
    /**
     * Checks if this bounding box contains the given point.
     *
     * @param x - The X coordinate in scene coordinate system.
     * @param y - The Y coordinate in scene coordinate system.
     * @return True if bounding box contains the point, false if not.
     */
    containsPoint(x, y) {
        return this.minY <= y && this.maxY >= y && this.minX <= y && this.maxX >= y;
    }
    /**
     * Draws the bounds to the given 2D canvas rendering context. This only applies the closed geometry, you have to
     * fill/stroke/clip it yourself.
     *
     * @param ctx - The 2D canvas rendering context to render to.
     */
    draw(ctx) {
        if (!this.isEmpty()) {
            ctx.rect(this.minX, this.minY, this.maxX - this.minX, this.maxY - this.minY);
        }
        return this;
    }
}
exports.Bounds2 = Bounds2;


/***/ }),

/***/ "./lib/engine/graphics/Line2.js":
/*!**************************************!*\
  !*** ./lib/engine/graphics/Line2.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Line2 = void 0;
const Vector2_1 = __webpack_require__(/*! ./Vector2 */ "./lib/engine/graphics/Vector2.js");
/**
 * A line connecting two vertices.
 */
class Line2 {
    /**
     * Creates a new line from vertex a to vertex b.
     *
     * @param start - The start of the line.
     * @param end   - The end of the line.
     */
    constructor(start, end) {
        this.start = start;
        this.end = end;
        this.normal = null;
        this.center = null;
    }
    /**
     * Returns the normal of the line. For a line in a clock-wise polygon this normal points to the outside of the
     * polygon.
     *
     * @return The line normal. Normalized to a unit vector.
     */
    getNormal() {
        var _a;
        return ((_a = this.normal) !== null && _a !== void 0 ? _a : (this.normal = new Vector2_1.Vector2())).setComponents(this.end.y - this.start.y, this.start.x - this.end.x).normalize();
    }
    /**
     * Returns the center of the line.
     *
     * @return The center of the line.
     */
    getCenter() {
        var _a;
        return ((_a = this.center) !== null && _a !== void 0 ? _a : (this.center = new Vector2_1.Vector2())).setComponents((this.start.x + this.end.x) / 2, (this.start.y + this.end.y) / 2);
    }
    /**
     * Draws the line to the given 2D canvas rendering context. This only applies the line geometry,
     * you have to stroke it yourself.
     *
     * @param ctx - The canvas rendering context.
     */
    draw(ctx) {
        const { start: a, end: b } = this;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        return this;
    }
    /**
     * Draws the line normal to the given 2D canvas rendering context. This only applies the line geometry,
     * you have to stroke it yourself.
     *
     * @param ctx - The canvas rendering context.
     * @param len - Optional custom normal line length.
     */
    drawNormal(ctx, len = 25) {
        const normal = this.getNormal();
        const center = this.getCenter();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(center.x + normal.x * len, center.y + normal.y * len);
        return this;
    }
}
exports.Line2 = Line2;


/***/ }),

/***/ "./lib/engine/graphics/Polygon2.js":
/*!*****************************************!*\
  !*** ./lib/engine/graphics/Polygon2.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Polygon2 = void 0;
const Line2_1 = __webpack_require__(/*! ./Line2 */ "./lib/engine/graphics/Line2.js");
const Vector2_1 = __webpack_require__(/*! ./Vector2 */ "./lib/engine/graphics/Vector2.js");
const Bounds2_1 = __webpack_require__(/*! ./Bounds2 */ "./lib/engine/graphics/Bounds2.js");
/**
 * A polygon with any number of vertices.
 */
class Polygon2 {
    /**
     * Creates a polygon with the given initial vertices.
     *
     * @param vertices - The polygon vertices.
     */
    constructor(...vertices) {
        var _a;
        this.edges = [];
        this.normals = [];
        this.bounds = new Bounds2_1.Bounds2();
        this.vertices = vertices;
        for (let i = 0, max = vertices.length; i < max; ++i) {
            this.edges.push(new Line2_1.Line2(vertices[i], (_a = vertices[i + 1]) !== null && _a !== void 0 ? _a : vertices[0]));
        }
    }
    /**
     * Checks if polygon has at least one vertex.
     *
     * @return True if polygon has at least on vertex, false if not.
     */
    hasVertices() {
        return this.vertices.length > 0;
    }
    /**
     * Adds the given vertex at the given index. Polygon edges are automatically corrected.
     *
     * @param vertex - The vertex to add.
     * @param index  - Optional insertion index. If not specified then vertex is added at the end of the polygon.
     */
    addVertex(vertex, index = this.vertices.length) {
        const edge = new Line2_1.Line2(vertex, vertex);
        this.vertices.splice(index, 0, vertex);
        const previousEdge = this.edges[index - 1];
        this.edges.splice(index, 0, edge);
        if (previousEdge != null) {
            edge.end = previousEdge.end;
            previousEdge.end = vertex;
        }
        else {
            edge.end = this.vertices[0];
        }
        this.bounds.reset();
        return this;
    }
    /**
     * Adds the four corner vertices (Starting with top-left corner and then moving clockwise) of the given rectangle.
     *
     * @param rect - The rectangle to add.
     */
    addRect(rect) {
        this.addVertex(new Vector2_1.Vector2(rect.getLeft(), rect.getTop()));
        this.addVertex(new Vector2_1.Vector2(rect.getRight(), rect.getTop()));
        this.addVertex(new Vector2_1.Vector2(rect.getRight(), rect.getBottom()));
        this.addVertex(new Vector2_1.Vector2(rect.getLeft(), rect.getBottom()));
        return this;
    }
    /**
     * Removes the vertex at the given index. Polygon edges are automatically corrected.
     *
     * @param index - The index of the vertex to remove.
     */
    removeVertex(index) {
        var _a, _b;
        const edges = this.edges;
        const edge = edges[index];
        if (edge != null) {
            const previousEdge = (_a = edges[index - 1]) !== null && _a !== void 0 ? _a : edges[edges.length - 1];
            const nextEdge = (_b = edges[index + 1]) !== null && _b !== void 0 ? _b : edges[0];
            if (previousEdge !== edge && nextEdge !== edge) {
                nextEdge.start = edge.end;
                previousEdge.end = edge.end;
            }
            this.vertices.splice(index, 1);
            this.edges.splice(index, 1);
            this.bounds.reset();
        }
        return this;
    }
    /**
     * Removes all vertices from the polygon.
     */
    clear() {
        if (this.hasVertices()) {
            this.vertices.length = 0;
            this.edges.length = 0;
            this.normals.length = 0;
            this.bounds.reset();
        }
        return this;
    }
    /**
     * Returns the vertex normal for the vertex with the given index.
     *
     * @param index - The vertex index.
     * @return The vertex normal.
     */
    getVertexNormal(index) {
        var _a, _b, _c;
        const normal = (_b = (_a = this.normals[index]) === null || _a === void 0 ? void 0 : _a.reset()) !== null && _b !== void 0 ? _b : (this.normals[index] = new Vector2_1.Vector2());
        const edges = this.edges;
        const edge = edges[index];
        if (edge != null) {
            normal.add(edge.getNormal());
            const previousEdge = (_c = edges[index - 1]) !== null && _c !== void 0 ? _c : edges[edges.length - 1];
            if (previousEdge != null) {
                normal.add(previousEdge.getNormal());
            }
        }
        return normal.normalize();
    }
    /**
     * Draws the polygon to the given 2D canvas rendering context. This only applies the closed geometry, you have to
     * fill/stroke/clip it yourself.
     *
     * @param ctx - The 2D canvas rendering context to render to.
     */
    draw(ctx) {
        const vertices = this.vertices;
        if (vertices.length > 0) {
            const first = vertices[0];
            ctx.moveTo(first.x, first.y);
            for (let i = 1, max = vertices.length; i < max; ++i) {
                const next = vertices[i];
                ctx.lineTo(next.x, next.y);
            }
        }
        ctx.closePath();
        return this;
    }
    /**
     * Draws the polygon edge normals to the given 2D canvas rendering context. This only applies the line geometries,
     * you have to stroke it yourself.
     *
     * @param ctx - The canvas rendering context.
     * @param len - Optional custom normal line length.
     */
    drawNormals(ctx, len) {
        for (const edge of this.edges) {
            edge.drawNormal(ctx, len);
        }
        return this;
    }
    /**
     * Draws the vertex normals to the given 2D canvas rendering context. This only applies the line geometries,
     * you have to stroke it yourself.
     *
     * @param ctx - The canvas rendering context.
     * @param len - Optional custom normal line length.
     */
    drawVertexNormals(ctx, len = 25) {
        this.vertices.forEach((vertex, index) => {
            ctx.moveTo(vertex.x, vertex.y);
            const normal = this.getVertexNormal(index);
            ctx.lineTo(vertex.x + normal.x * len, vertex.y + normal.y * len);
        });
        return this;
    }
    /**
     * Transforms this polygon with the given transformation matrix.
     *
     * @param m - The transformation to apply.
     */
    transform(m) {
        for (const vertex of this.vertices) {
            vertex.mul(m);
        }
        this.bounds.reset();
        return this;
    }
    /**
     * Returns the bounds of the polygon. Bounds are cached and automatically invalidated when polygon is changed
     * or transformed.
     *
     * @return The polygon bounds.
     */
    getBounds() {
        if (this.bounds.isEmpty()) {
            this.bounds.addPolygon(this);
        }
        return this.bounds;
    }
    /**
     * Checks if this polygon collides with the given one.
     *
     * @param other - The other polygon to check collision with.
     * @return True if polygons collide, false if not.
     */
    collidesWith(other) {
        // TODO Only bounding box collision is checked for now. Need real polygon check performed when bounding box
        // collides
        return this.getBounds().collidesWith(other.getBounds());
    }
    /**
     * Checks if this polygon contains the given point.
     *
     * @param x - The X coordinate in scene coordinate system.
     * @param y - The Y coordinate in scene coordinate system.
     * @return True if polygon contains the point, false if not.
     */
    containsPoint(x, y) {
        // TODO Only bounding box collision is checked for now. Need real polygon check performed when bounding box
        // collides
        return this.getBounds().containsPoint(x, y);
    }
}
exports.Polygon2 = Polygon2;


/***/ }),

/***/ "./lib/engine/graphics/Size2.js":
/*!**************************************!*\
  !*** ./lib/engine/graphics/Size2.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Size2 = void 0;
/**
 * Mutable 2D size.
 */
class Size2 {
    constructor(width = 0, height = 0) {
        this.width = width;
        this.height = height;
    }
    /** @inheritDoc */
    toString() {
        return `${this.width}x${this.height}`;
    }
    /**
     * Sets the size dimensions.
     *
     * @param width  - The width to set.
     * @param height - The height to set.
     */
    setDimensions(width, height) {
        this.width = width;
        this.height = height;
        return this;
    }
    /**
     * Sets the size dimensions by copying them from the given size.
     *
     * @param size - The size to copy the dimensions from.
     */
    setSize(size) {
        this.width = size.width;
        this.height = size.height;
        return this;
    }
    /** @inheritDoc */
    isEmpty() {
        return this.width === 0 || this.height === 0;
    }
    /** @inheritDoc */
    clone() {
        return new Size2(this.width, this.height);
    }
    /** @inheritDoc */
    getArea() {
        return this.width * this.height;
    }
    /** @inheritDoc */
    getAspectRatio() {
        return this.width / this.height;
    }
}
exports.Size2 = Size2;


/***/ }),

/***/ "./lib/engine/graphics/Vector2.js":
/*!****************************************!*\
  !*** ./lib/engine/graphics/Vector2.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector2 = void 0;
/**
 * Vector with two floating point components.
 */
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    /** @inheritDoc */
    toString() {
        return `[ ${this.x}, ${this.y} ]`;
    }
    /**
     * Sets the vector component values.
     *
     * @param x - The X component value to set.
     * @param y - The Y component value to set.
     */
    setComponents(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    /**
     * Sets the vector component values by copying them from the given vector.
     *
     * @param vector - The vector to copy the X and Y component values from.
     */
    setVector(vector) {
        this.x = vector.x;
        this.y = vector.y;
        return this;
    }
    /** @inheritDoc */
    clone() {
        return new Vector2(this.x, this.y);
    }
    /** @inheritDoc */
    getSquareLength() {
        return Math.pow(this.x, 2) + Math.pow(this.y, 2);
    }
    /** @inheritDoc */
    getLength() {
        return Math.sqrt(this.getSquareLength());
    }
    /** @inheritDoc */
    getSquareDistance(v) {
        return Math.pow((this.x - v.x), 2) + Math.pow((this.y - v.y), 2);
    }
    /** @inheritDoc */
    getDistance(v) {
        return Math.sqrt(this.getSquareDistance(v));
    }
    /** @inheritDoc */
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    /**
     * Negates this vector.
     */
    negate() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }
    /**
     * Resets all components of this vector to 0.
     */
    reset() {
        this.x = this.y = 0;
        return this;
    }
    /**
     * Translates the vector by the given deltas.
     *
     * @param x - The x delta.
     * @param y - The y delta.
     */
    translate(x, y) {
        this.x += x;
        this.y += y;
        return this;
    }
    /**
     * Scales the vector by the given factors.
     *
     * @param sx - The x factor.
     * @param sy - The y factor.
     */
    scale(sx, sy = sx) {
        this.x *= sx;
        this.y *= sy;
        return this;
    }
    /**
     * Adds the given vector to this vector.
     *
     * @param summand - The vector to add.
     */
    add(summand) {
        this.x += summand.x;
        this.y += summand.y;
        return this;
    }
    /**
     * Subtracts the given vector from this vector.
     *
     * @param subtrahend - The vector to subtract from this vector.
     */
    sub(subtrahend) {
        this.x -= subtrahend.x;
        this.y -= subtrahend.y;
        return this;
    }
    /**
     * Multiplies this vector with the specified matrix (In GLSL: `this = matrix * this`).
     *
     * @param matrix - The matrix to multiply this vector with.
     */
    mul(arg) {
        const x = this.x;
        const y = this.y;
        this.x = x * arg.m11 + y * arg.m21 + arg.dx;
        this.y = x * arg.m12 + y * arg.m22 + arg.dy;
        return this;
    }
    /**
     * Multiplies this vector with the inverse of the specified matrix (In GLSL: `this = matrix / this`).
     *
     * @param matrix - The matrix to divide this vector by.
     */
    div(arg) {
        const b11 = arg.m11, b12 = arg.m12;
        const b21 = arg.m21, b22 = arg.m22;
        const x = this.x;
        const y = this.y;
        const d = b11 * b22 - b12 * b21;
        const c11 = b22 / d;
        const c12 = -b12 / d;
        const c21 = -b21 / d;
        const c22 = b11 / d;
        const b31 = arg.dx, b32 = arg.dy;
        this.x = x * c11 + y * c21 + (b21 * b32 - b31 * b22) / d;
        this.y = x * c12 + y * c22 + (b31 * b12 - b11 * b32) / d;
        return this;
    }
    /**
     * Normalizes this vector to a length of 1.
     */
    normalize() {
        const len = this.getLength();
        this.x /= len;
        this.y /= len;
        return this;
    }
    /**
     * Returns the shortest angle (positive or negative between -PI and PI) between this vector and the given one.
     *
     * @param vector - The other vector. Angle to origin (0, 0) is returned if no other vector specified.
     * @return The angle between the vectors. Measured in radians.
     */
    getAngle(vector) {
        let angle = Math.atan2(this.x, this.y);
        if (vector) {
            angle -= Math.atan2(vector.x, vector.y);
        }
        return angle;
    }
}
exports.Vector2 = Vector2;


/***/ }),

/***/ "./lib/engine/input/ControllerEvent.js":
/*!*********************************************!*\
  !*** ./lib/engine/input/ControllerEvent.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GamepadControllerEvent = exports.ControllerEvent = void 0;
const ControllerFamily_1 = __webpack_require__(/*! ./ControllerFamily */ "./lib/engine/input/ControllerFamily.js");
const ControllerIntent_1 = __webpack_require__(/*! ./ControllerIntent */ "./lib/engine/input/ControllerIntent.js");
const controllerFamilySymbol = Symbol("controllerFamily");
const intentsSymbol = Symbol("intent");
const eventTypeSymbol = Symbol("eventType");
const repeatSymbol = Symbol("repeat");
class ControllerEvent extends Object {
    constructor(controllerFamily, eventType, intents, repeat = false) {
        super();
        this[controllerFamilySymbol] = controllerFamily;
        this[intentsSymbol] = intents.reduce((prev, curr) => prev | curr);
        this[eventTypeSymbol] = eventType;
        this[repeatSymbol] = repeat;
    }
    get controllerFamily() {
        return this[controllerFamilySymbol];
    }
    get eventType() {
        return this[eventTypeSymbol];
    }
    get intents() {
        return this[intentsSymbol];
    }
    get repeat() {
        return this[repeatSymbol];
    }
    get isMenuLeft() {
        return (this[intentsSymbol] & ControllerIntent_1.ControllerIntent.MENU_LEFT) === ControllerIntent_1.ControllerIntent.MENU_LEFT;
    }
    get isMenuRight() {
        return (this[intentsSymbol] & ControllerIntent_1.ControllerIntent.MENU_RIGHT) === ControllerIntent_1.ControllerIntent.MENU_RIGHT;
    }
    get isMenuUp() {
        return (this[intentsSymbol] & ControllerIntent_1.ControllerIntent.MENU_UP) === ControllerIntent_1.ControllerIntent.MENU_UP;
    }
    get isMenuDown() {
        return (this[intentsSymbol] & ControllerIntent_1.ControllerIntent.MENU_DOWN) === ControllerIntent_1.ControllerIntent.MENU_DOWN;
    }
    get isPlayerMoveLeft() {
        return (this[intentsSymbol] & ControllerIntent_1.ControllerIntent.PLAYER_MOVE_LEFT) === ControllerIntent_1.ControllerIntent.PLAYER_MOVE_LEFT;
    }
    get isPlayerMoveRight() {
        return (this[intentsSymbol] & ControllerIntent_1.ControllerIntent.PLAYER_MOVE_RIGHT) === ControllerIntent_1.ControllerIntent.PLAYER_MOVE_RIGHT;
    }
    get isPlayerJump() {
        return (this[intentsSymbol] & ControllerIntent_1.ControllerIntent.PLAYER_JUMP) === ControllerIntent_1.ControllerIntent.PLAYER_JUMP;
    }
    get isPlayerDrop() {
        return (this[intentsSymbol] & ControllerIntent_1.ControllerIntent.PLAYER_DROP) === ControllerIntent_1.ControllerIntent.PLAYER_DROP;
    }
    get isPlayerEnterDoor() {
        return (this[intentsSymbol] & ControllerIntent_1.ControllerIntent.PLAYER_ENTER_DOOR) === ControllerIntent_1.ControllerIntent.PLAYER_ENTER_DOOR;
    }
    get isPlayerInteract() {
        return (this[intentsSymbol] & ControllerIntent_1.ControllerIntent.PLAYER_INTERACT) === ControllerIntent_1.ControllerIntent.PLAYER_INTERACT;
    }
    get isPlayerAction() {
        return (this[intentsSymbol] & ControllerIntent_1.ControllerIntent.PLAYER_ACTION) === ControllerIntent_1.ControllerIntent.PLAYER_ACTION;
    }
    get isPlayerRun() {
        return (this[intentsSymbol] & ControllerIntent_1.ControllerIntent.PLAYER_RUN) === ControllerIntent_1.ControllerIntent.PLAYER_RUN;
    }
    get isPlayerReload() {
        return (this[intentsSymbol] & ControllerIntent_1.ControllerIntent.PLAYER_RELOAD) === ControllerIntent_1.ControllerIntent.PLAYER_RELOAD;
    }
    get isPlayerDance1() {
        return (this[intentsSymbol] & ControllerIntent_1.ControllerIntent.PLAYER_DANCE_1) === ControllerIntent_1.ControllerIntent.PLAYER_DANCE_1;
    }
    get isPlayerDance2() {
        return (this[intentsSymbol] & ControllerIntent_1.ControllerIntent.PLAYER_DANCE_2) === ControllerIntent_1.ControllerIntent.PLAYER_DANCE_2;
    }
    get isPause() {
        return (this[intentsSymbol] & ControllerIntent_1.ControllerIntent.PAUSE) === ControllerIntent_1.ControllerIntent.PAUSE;
    }
    get isConfirm() {
        return (this[intentsSymbol] & ControllerIntent_1.ControllerIntent.CONFIRM) === ControllerIntent_1.ControllerIntent.CONFIRM;
    }
    get isAbort() {
        return (this[intentsSymbol] & ControllerIntent_1.ControllerIntent.ABORT) === ControllerIntent_1.ControllerIntent.ABORT;
    }
}
exports.ControllerEvent = ControllerEvent;
const gamepadModelSymbol = Symbol("gamepadModel");
class GamepadControllerEvent extends ControllerEvent {
    constructor(gamepadModel, eventType, intents, repeat = false) {
        super(ControllerFamily_1.ControllerFamily.GAMEPAD, eventType, intents, repeat);
        this[gamepadModelSymbol] = gamepadModel;
    }
    get gamepadModel() {
        return this[gamepadModelSymbol];
    }
}
exports.GamepadControllerEvent = GamepadControllerEvent;


/***/ }),

/***/ "./lib/engine/input/ControllerEventType.js":
/*!*************************************************!*\
  !*** ./lib/engine/input/ControllerEventType.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerEventType = void 0;
var ControllerEventType;
(function (ControllerEventType) {
    ControllerEventType["UP"] = "up";
    ControllerEventType["DOWN"] = "down";
    ControllerEventType["PRESS"] = "press";
})(ControllerEventType = exports.ControllerEventType || (exports.ControllerEventType = {}));


/***/ }),

/***/ "./lib/engine/input/ControllerFamily.js":
/*!**********************************************!*\
  !*** ./lib/engine/input/ControllerFamily.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerAnimationTags = exports.ControllerSpriteMap = exports.ControllerFamily = void 0;
/**
 * This enumeration is used to classify the various known input methods.
 */
var ControllerFamily;
(function (ControllerFamily) {
    ControllerFamily["KEYBOARD"] = "keyboard";
    ControllerFamily["GAMEPAD"] = "gamepad";
})(ControllerFamily = exports.ControllerFamily || (exports.ControllerFamily = {}));
/**
 * This enum consists of all supported button aseprite sheets
 */
var ControllerSpriteMap;
(function (ControllerSpriteMap) {
    ControllerSpriteMap["KEYBOARD"] = "keyboard";
    ControllerSpriteMap["XBOX"] = "xbox";
    ControllerSpriteMap["PLAYSTATION"] = "playstation";
})(ControllerSpriteMap = exports.ControllerSpriteMap || (exports.ControllerSpriteMap = {}));
/**
 * This enum consists of all available animation tags supported by the button aseprite sheets
 */
var ControllerAnimationTags;
(function (ControllerAnimationTags) {
    ControllerAnimationTags["CONFIRM"] = "confirm";
    ControllerAnimationTags["JUMP"] = "jump";
    ControllerAnimationTags["ACTION"] = "action";
    ControllerAnimationTags["INTERACT"] = "interact";
    ControllerAnimationTags["OPEN_DOOR"] = "up";
    ControllerAnimationTags["BACK"] = "back";
})(ControllerAnimationTags = exports.ControllerAnimationTags || (exports.ControllerAnimationTags = {}));


/***/ }),

/***/ "./lib/engine/input/ControllerIntent.js":
/*!**********************************************!*\
  !*** ./lib/engine/input/ControllerIntent.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerIntent = void 0;
/**
 * Enumeration of the different intents that may be emitted by a single button,
 * whereas a button might either be a physical key on a keyboard, a mapped axis
 * on a gamepad or a touch screen event.
 *
 * Right now, these events are stored in a bit mask to be extra efficient, …
 * …maybe that's not really necessary and should be changed to improve
 * readability at some point…
 */
var ControllerIntent;
(function (ControllerIntent) {
    /** Used for unknown / unmapped buttons. */
    ControllerIntent[ControllerIntent["NONE"] = 0] = "NONE";
    /** Player movement: left */
    ControllerIntent[ControllerIntent["PLAYER_MOVE_LEFT"] = 1] = "PLAYER_MOVE_LEFT";
    /** Player movement: right */
    ControllerIntent[ControllerIntent["PLAYER_MOVE_RIGHT"] = 2] = "PLAYER_MOVE_RIGHT";
    /** Player movement: jump */
    ControllerIntent[ControllerIntent["PLAYER_JUMP"] = 4] = "PLAYER_JUMP";
    /** Player movement: DROP (or: duck/crouch) */
    ControllerIntent[ControllerIntent["PLAYER_DROP"] = 8] = "PLAYER_DROP";
    /** Talk to NPCs, read signs etc */
    ControllerIntent[ControllerIntent["PLAYER_INTERACT"] = 16] = "PLAYER_INTERACT";
    /** Action, throw stuff */
    ControllerIntent[ControllerIntent["PLAYER_ACTION"] = 32] = "PLAYER_ACTION";
    /** Dance move no. 1 */
    ControllerIntent[ControllerIntent["PLAYER_DANCE_1"] = 64] = "PLAYER_DANCE_1";
    /** Dance move no. 2 */
    ControllerIntent[ControllerIntent["PLAYER_DANCE_2"] = 128] = "PLAYER_DANCE_2";
    // Menu navigation
    ControllerIntent[ControllerIntent["MENU_LEFT"] = 256] = "MENU_LEFT";
    ControllerIntent[ControllerIntent["MENU_RIGHT"] = 512] = "MENU_RIGHT";
    ControllerIntent[ControllerIntent["MENU_UP"] = 1024] = "MENU_UP";
    ControllerIntent[ControllerIntent["MENU_DOWN"] = 2048] = "MENU_DOWN";
    /** The key usually known as "enter" or something alike. */
    ControllerIntent[ControllerIntent["CONFIRM"] = 4096] = "CONFIRM";
    /** Go through doors */
    ControllerIntent[ControllerIntent["PLAYER_ENTER_DOOR"] = 8192] = "PLAYER_ENTER_DOOR";
    /** Pause/unpause. */
    ControllerIntent[ControllerIntent["PAUSE"] = 16384] = "PAUSE";
    /** Back / abort / get-me-the-hell-out-of-here. */
    ControllerIntent[ControllerIntent["ABORT"] = 32768] = "ABORT";
    /** Run modifier */
    ControllerIntent[ControllerIntent["PLAYER_RUN"] = 65536] = "PLAYER_RUN";
    /** Reload modifier */
    ControllerIntent[ControllerIntent["PLAYER_RELOAD"] = 131072] = "PLAYER_RELOAD";
    ControllerIntent[ControllerIntent["UNUSED_2"] = 262144] = "UNUSED_2";
    ControllerIntent[ControllerIntent["UNUSED_3"] = 524288] = "UNUSED_3";
})(ControllerIntent = exports.ControllerIntent || (exports.ControllerIntent = {}));


/***/ }),

/***/ "./lib/engine/input/ControllerManager.js":
/*!***********************************************!*\
  !*** ./lib/engine/input/ControllerManager.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerManager = void 0;
const ControllerFamily_1 = __webpack_require__(/*! ./ControllerFamily */ "./lib/engine/input/ControllerFamily.js");
const GamepadStyle_1 = __webpack_require__(/*! ./GamepadStyle */ "./lib/engine/input/GamepadStyle.js");
const Signal_1 = __webpack_require__(/*! ../util/Signal */ "./lib/engine/util/Signal.js");
/** Symbol to identify the current/active controller family. */
const currentControllerFamilySymbol = Symbol("currentControllerFamily");
/** Symbol to identify the currently active intents. */
const currentActiveIntentsSymbol = Symbol("currentActiveIntentsSymbol");
class ControllerManager {
    constructor(initialControllerFamily = ControllerFamily_1.ControllerFamily.KEYBOARD) {
        this.onButtonDown = new Signal_1.Signal();
        this.onButtonUp = new Signal_1.Signal();
        this.onButtonPress = new Signal_1.Signal();
        this.onControllerFamilyChange = new Signal_1.Signal();
        this.selectedGamepadStyle = GamepadStyle_1.GamepadStyle.XBOX;
        this.currentControllerFamily = initialControllerFamily;
        this.onButtonDown.connect(e => {
            if (this.currentControllerFamily !== e.controllerFamily) {
                this.currentControllerFamily = e.controllerFamily;
            }
            this[currentActiveIntentsSymbol] |= e.intents;
        });
        this.onButtonUp.connect(e => {
            this[currentActiveIntentsSymbol] &= ~e.intents;
        });
    }
    static getInstance() {
        return ControllerManager.INSTANCE;
    }
    get currentActiveIntents() {
        return this[currentActiveIntentsSymbol];
    }
    set currentControllerFamily(controllerFamily) {
        if (controllerFamily !== this[currentControllerFamilySymbol]) {
            this[currentControllerFamilySymbol] = controllerFamily;
            this.onControllerFamilyChange.emit(controllerFamily);
        }
    }
    /**
     * Returns the current (a.k.a. most recently used!) controller family.
     * Can be used to determine which tooltips (gamepad buttons or keyboard indicators) to show.
     */
    get currentControllerFamily() {
        return this[currentControllerFamilySymbol];
    }
    toggleSelectedGamepadStyle() {
        this.selectedGamepadStyle = this.selectedGamepadStyle === GamepadStyle_1.GamepadStyle.XBOX ? GamepadStyle_1.GamepadStyle.PLAYSTATION : GamepadStyle_1.GamepadStyle.XBOX;
    }
    get controllerSprite() {
        if (this.currentControllerFamily === ControllerFamily_1.ControllerFamily.GAMEPAD) {
            switch (ControllerManager.getInstance().selectedGamepadStyle) {
                case GamepadStyle_1.GamepadStyle.PLAYSTATION:
                    return ControllerFamily_1.ControllerSpriteMap.PLAYSTATION;
                case GamepadStyle_1.GamepadStyle.XBOX:
                    return ControllerFamily_1.ControllerSpriteMap.XBOX;
            }
        }
        // Fallback to Keyboard
        return ControllerFamily_1.ControllerSpriteMap.KEYBOARD;
    }
}
exports.ControllerManager = ControllerManager;
ControllerManager.INSTANCE = new ControllerManager();


/***/ }),

/***/ "./lib/engine/input/GamepadInput.js":
/*!******************************************!*\
  !*** ./lib/engine/input/GamepadInput.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GamepadInput = void 0;
const ControllerManager_1 = __webpack_require__(/*! ./ControllerManager */ "./lib/engine/input/ControllerManager.js");
const ControllerIntent_1 = __webpack_require__(/*! ./ControllerIntent */ "./lib/engine/input/ControllerIntent.js");
const ControllerEventType_1 = __webpack_require__(/*! ./ControllerEventType */ "./lib/engine/input/ControllerEventType.js");
const ControllerEvent_1 = __webpack_require__(/*! ./ControllerEvent */ "./lib/engine/input/ControllerEvent.js");
const GamepadModel_1 = __webpack_require__(/*! ./GamepadModel */ "./lib/engine/input/GamepadModel.js");
/**
 * Game Pad Buttons
 */
var GamePadButtonId;
(function (GamePadButtonId) {
    /** Button A / Cross*/
    GamePadButtonId[GamePadButtonId["BUTTON_1"] = 0] = "BUTTON_1";
    /** Button B / Circle*/
    GamePadButtonId[GamePadButtonId["BUTTON_2"] = 1] = "BUTTON_2";
    /** Button X / Square*/
    GamePadButtonId[GamePadButtonId["BUTTON_3"] = 2] = "BUTTON_3";
    /** Button Y / Triangle */
    GamePadButtonId[GamePadButtonId["BUTTON_4"] = 3] = "BUTTON_4";
    GamePadButtonId[GamePadButtonId["SHOULDER_TOP_LEFT"] = 4] = "SHOULDER_TOP_LEFT";
    GamePadButtonId[GamePadButtonId["SHOULDER_TOP_RIGHT"] = 5] = "SHOULDER_TOP_RIGHT";
    GamePadButtonId[GamePadButtonId["SHOULDER_BOTTOM_LEFT"] = 6] = "SHOULDER_BOTTOM_LEFT";
    GamePadButtonId[GamePadButtonId["SHOULDER_BOTTOM_RIGHT"] = 7] = "SHOULDER_BOTTOM_RIGHT";
    GamePadButtonId[GamePadButtonId["SELECT"] = 8] = "SELECT";
    GamePadButtonId[GamePadButtonId["START"] = 9] = "START";
    GamePadButtonId[GamePadButtonId["STICK_BUTTON_LEFT"] = 10] = "STICK_BUTTON_LEFT";
    GamePadButtonId[GamePadButtonId["STICK_BUTTON_RIGHT"] = 11] = "STICK_BUTTON_RIGHT";
    GamePadButtonId[GamePadButtonId["D_PAD_UP"] = 12] = "D_PAD_UP";
    GamePadButtonId[GamePadButtonId["D_PAD_DOWN"] = 13] = "D_PAD_DOWN";
    GamePadButtonId[GamePadButtonId["D_PAD_LEFT"] = 14] = "D_PAD_LEFT";
    GamePadButtonId[GamePadButtonId["D_PAD_RIGHT"] = 15] = "D_PAD_RIGHT";
    GamePadButtonId[GamePadButtonId["VENDOR"] = 16] = "VENDOR";
})(GamePadButtonId || (GamePadButtonId = {}));
var StickAxisId;
(function (StickAxisId) {
    /** Left stick X axis */
    StickAxisId[StickAxisId["LEFT_LEFT_RIGHT"] = 0] = "LEFT_LEFT_RIGHT";
    /** Left stick Y axis */
    StickAxisId[StickAxisId["LEFT_UP_DOWN"] = 1] = "LEFT_UP_DOWN";
    /** Right stick X axis */
    StickAxisId[StickAxisId["RIGHT_LEFT_RIGHT"] = 2] = "RIGHT_LEFT_RIGHT";
    /** Right stick Y axis */
    StickAxisId[StickAxisId["RIGHT_UP_DOWN"] = 3] = "RIGHT_UP_DOWN";
})(StickAxisId || (StickAxisId = {}));
const axisMapping = new Map();
axisMapping.set(StickAxisId.LEFT_LEFT_RIGHT, { button1: GamePadButtonId.D_PAD_LEFT, button2: GamePadButtonId.D_PAD_RIGHT });
axisMapping.set(StickAxisId.LEFT_UP_DOWN, { button1: GamePadButtonId.D_PAD_UP, button2: GamePadButtonId.D_PAD_DOWN });
const intentMappings = new Map();
intentMappings.set(GamePadButtonId.D_PAD_UP, [ControllerIntent_1.ControllerIntent.PLAYER_ENTER_DOOR, ControllerIntent_1.ControllerIntent.MENU_UP]);
intentMappings.set(GamePadButtonId.D_PAD_DOWN, [ControllerIntent_1.ControllerIntent.PLAYER_DROP, ControllerIntent_1.ControllerIntent.MENU_DOWN]);
intentMappings.set(GamePadButtonId.D_PAD_LEFT, [ControllerIntent_1.ControllerIntent.PLAYER_MOVE_LEFT, ControllerIntent_1.ControllerIntent.MENU_LEFT]);
intentMappings.set(GamePadButtonId.D_PAD_RIGHT, [ControllerIntent_1.ControllerIntent.PLAYER_MOVE_RIGHT, ControllerIntent_1.ControllerIntent.MENU_RIGHT]);
intentMappings.set(GamePadButtonId.BUTTON_1, [ControllerIntent_1.ControllerIntent.PLAYER_JUMP, ControllerIntent_1.ControllerIntent.CONFIRM]);
intentMappings.set(GamePadButtonId.BUTTON_2, [ControllerIntent_1.ControllerIntent.ABORT]);
intentMappings.set(GamePadButtonId.BUTTON_3, [ControllerIntent_1.ControllerIntent.PLAYER_RELOAD]);
intentMappings.set(GamePadButtonId.BUTTON_4, [ControllerIntent_1.ControllerIntent.PLAYER_INTERACT]);
intentMappings.set(GamePadButtonId.SHOULDER_TOP_LEFT, [ControllerIntent_1.ControllerIntent.PLAYER_DANCE_1, ControllerIntent_1.ControllerIntent.PLAYER_ACTION]);
intentMappings.set(GamePadButtonId.SHOULDER_TOP_RIGHT, [ControllerIntent_1.ControllerIntent.PLAYER_DANCE_2, ControllerIntent_1.ControllerIntent.PLAYER_ACTION]);
intentMappings.set(GamePadButtonId.START, [ControllerIntent_1.ControllerIntent.PAUSE]);
class GamepadButtonWrapper {
    constructor(index, wrapped, gamepad) {
        this.index = index;
        this.pressed = wrapped.pressed;
        this.gamepad = gamepad;
    }
    setPressed(pressed) {
        const controllerManager = ControllerManager_1.ControllerManager.getInstance();
        const oldPressed = this.pressed;
        this.pressed = pressed;
        if (oldPressed !== pressed) {
            if (pressed) {
                controllerManager.onButtonDown.emit(new ControllerEvent_1.GamepadControllerEvent(this.gamepad.gamepadModel, ControllerEventType_1.ControllerEventType.DOWN, intentMappings.get(this.index) || [ControllerIntent_1.ControllerIntent.NONE]));
            }
            else {
                controllerManager.onButtonUp.emit(new ControllerEvent_1.GamepadControllerEvent(this.gamepad.gamepadModel, ControllerEventType_1.ControllerEventType.UP, intentMappings.get(this.index) || [ControllerIntent_1.ControllerIntent.NONE]));
            }
        }
    }
}
class GamepadAxisWrapper {
    constructor(index, gamepad) {
        /**
         * Threshold to use to emulate virtual buttons.
         * Values between 0.1 (slight touches of the axis trigger button presses)
         * 0.9 (much force needed) can be used here.
         *
         * Avoid using 0.0 and 1.0 as they cannot be reached on some gamepads or
         * might lead to button flibber flubber...
         */
        this.threshold = 0.5;
        this.value = 0.0;
        this.index = index;
        this.gamepad = gamepad;
    }
    setValue(newValue) {
        var _a, _b, _c, _d;
        const controllerManager = ControllerManager_1.ControllerManager.getInstance();
        const oldValue = this.value;
        this.value = newValue;
        let emulatedButtonId = undefined;
        if (oldValue <= -this.threshold && newValue > -this.threshold) {
            // Virtual button 1 released
            emulatedButtonId = (_a = axisMapping.get(this.index)) === null || _a === void 0 ? void 0 : _a.button1;
            if (emulatedButtonId != null) {
                controllerManager.onButtonUp.emit(new ControllerEvent_1.GamepadControllerEvent(this.gamepad.gamepadModel, ControllerEventType_1.ControllerEventType.UP, intentMappings.get(emulatedButtonId) || [ControllerIntent_1.ControllerIntent.NONE]));
            }
        }
        else if (oldValue > -this.threshold && newValue <= -this.threshold) {
            // Virtual button 1 pressed
            emulatedButtonId = (_b = axisMapping.get(this.index)) === null || _b === void 0 ? void 0 : _b.button1;
            if (emulatedButtonId != null) {
                controllerManager.onButtonDown.emit(new ControllerEvent_1.GamepadControllerEvent(this.gamepad.gamepadModel, ControllerEventType_1.ControllerEventType.DOWN, intentMappings.get(emulatedButtonId) || [ControllerIntent_1.ControllerIntent.NONE]));
            }
        }
        if (oldValue > this.threshold && newValue <= this.threshold) {
            // Virtual button 2 released
            emulatedButtonId = (_c = axisMapping.get(this.index)) === null || _c === void 0 ? void 0 : _c.button2;
            if (emulatedButtonId != null) {
                controllerManager.onButtonUp.emit(new ControllerEvent_1.GamepadControllerEvent(this.gamepad.gamepadModel, ControllerEventType_1.ControllerEventType.UP, intentMappings.get(emulatedButtonId) || [ControllerIntent_1.ControllerIntent.NONE]));
            }
        }
        else if (oldValue < this.threshold && newValue >= this.threshold) {
            // Virtual button 2 pressed
            emulatedButtonId = (_d = axisMapping.get(this.index)) === null || _d === void 0 ? void 0 : _d.button2;
            if (emulatedButtonId != null) {
                controllerManager.onButtonDown.emit(new ControllerEvent_1.GamepadControllerEvent(this.gamepad.gamepadModel, ControllerEventType_1.ControllerEventType.DOWN, intentMappings.get(emulatedButtonId) || [ControllerIntent_1.ControllerIntent.NONE]));
            }
        }
    }
}
/**
 * Some obscure magic to make sure that gamepad buttons and axes are mapped onto unified controller
 * events.
 */
class GamepadWrapper {
    constructor(gamepad) {
        this.index = gamepad.index;
        this.id = gamepad.id;
        this.gamepadModel = GamepadModel_1.GamepadModel.fromString(this.id);
        this.buttons = new Array(gamepad.buttons.length);
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i] = new GamepadButtonWrapper(i, gamepad.buttons[i], this);
        }
        this.axes = new Array(gamepad.axes.length);
        for (let i = 0; i < this.axes.length; i++) {
            this.axes[i] = new GamepadAxisWrapper(i, this);
        }
    }
    update() {
        const gamepad = navigator.getGamepads()[this.index];
        if (gamepad != null) {
            this.buttons.forEach(button => button.setPressed(gamepad.buttons[button.index].pressed));
            this.axes.forEach(axis => axis.setValue(gamepad.axes[axis.index]));
        }
    }
    toString() {
        return `Gamepad (index: ${this.index}, id: ${this.id})`;
    }
}
class GamepadInput {
    constructor() {
        this.gamepads = new Map();
        window.addEventListener("gamepadconnected", (e) => {
            console.debug("Gamepad connected: ", e);
            const gamepad = e.gamepad;
            if (gamepad != null) {
                this.gamepads.set(gamepad.id, new GamepadWrapper(gamepad));
            }
        });
        window.addEventListener("gamepaddisconnected", (e) => {
            console.debug("Gamepad disconnected: ", e);
            const gamepad = e.gamepad;
            if (gamepad != null) {
                this.gamepads.delete(gamepad.id);
            }
        });
    }
    update() {
        this.gamepads.forEach(gamepad => gamepad.update());
    }
}
exports.GamepadInput = GamepadInput;


/***/ }),

/***/ "./lib/engine/input/GamepadModel.js":
/*!******************************************!*\
  !*** ./lib/engine/input/GamepadModel.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// See https://gamepad-tester.com/controllers for a list of some possible controller IDs.
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_GAMEPAD_MODEL = exports.GamepadModel = void 0;
const GamepadStyle_1 = __webpack_require__(/*! ./GamepadStyle */ "./lib/engine/input/GamepadStyle.js");
const typemap = new Map();
/* spell-checker: disable */
typemap.set(/^.*?[Xx][Ii][Nn][Pp][Uu][Tt].*$/, GamepadStyle_1.GamepadStyle.XBOX);
// Vendor ID of Microsoft Corp.
typemap.set(/^.*045e.*$/, GamepadStyle_1.GamepadStyle.XBOX);
typemap.set(/^.*?[Ss]tadia\ [Cc]ontroller.*$/, GamepadStyle_1.GamepadStyle.STADIA);
// Anything with playstation in its name
typemap.set(/^.*?[Pp][Ll][Aa][Yy][Ss][Tt][Aa][Ii][Oo][Nn].*$/, GamepadStyle_1.GamepadStyle.XBOX);
// Vendor ID of Sony Inc.
typemap.set(/^.*054c.*$/, GamepadStyle_1.GamepadStyle.PLAYSTATION);
/**
 * Regular expression to extract vendor and product identifier.
 */
const productAndVendorMatcher = /^.*?[Vv]endor:?\s*(?<vendorId>.{4}).*?[Pp]roduct:?\s*(?<productId>.{4}).*?$/;
/* spell-checker: enable */
class GamepadModel {
    constructor(style, vendorId, productId) {
        this.style = style;
    }
    /**
     * Parses a gamepad identifier string and returns an object that encapsulates
     * @param str
     *   Gamepad identifier string as reported by the Gamepad API.
     */
    static fromString(str) {
        var _a, _b;
        for (const [key, value] of typemap) {
            if (key.exec(str)) {
                const productAndVendorMatch = productAndVendorMatcher.exec(str);
                let vendorId;
                let productId;
                if (productAndVendorMatch !== null) {
                    vendorId = (_a = productAndVendorMatch.groups) === null || _a === void 0 ? void 0 : _a.vendorId;
                    productId = (_b = productAndVendorMatch.groups) === null || _b === void 0 ? void 0 : _b.productId;
                }
                return new GamepadModel(value, parseInt(vendorId || "-1", 16), parseInt(productId || "-1"));
            }
        }
        // Nothing matches? Well,... that's bad luck...
        return exports.DEFAULT_GAMEPAD_MODEL;
    }
}
exports.GamepadModel = GamepadModel;
exports.DEFAULT_GAMEPAD_MODEL = new GamepadModel(GamepadStyle_1.GamepadStyle.UNKNOWN);


/***/ }),

/***/ "./lib/engine/input/GamepadStyle.js":
/*!******************************************!*\
  !*** ./lib/engine/input/GamepadStyle.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GamepadStyle = void 0;
/**
 * Enumeration of the different gamepad styles.
 *
 * Mainly used to adjust button mappings to offer the best possible *expected* gaming
 * experience and to make sure that graphics are displayed in-game that match the
 * controller being used.
 */
var GamepadStyle;
(function (GamepadStyle) {
    /** Default gamepad type if nothing else matches. */
    GamepadStyle["UNKNOWN"] = "unknown";
    GamepadStyle["XBOX"] = "xbox";
    GamepadStyle["PLAYSTATION"] = "playstation";
    GamepadStyle["STADIA"] = "stadia";
})(GamepadStyle = exports.GamepadStyle || (exports.GamepadStyle = {}));


/***/ }),

/***/ "./lib/engine/input/Keyboard.js":
/*!**************************************!*\
  !*** ./lib/engine/input/Keyboard.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Keyboard = void 0;
const ControllerEvent_1 = __webpack_require__(/*! ./ControllerEvent */ "./lib/engine/input/ControllerEvent.js");
const ControllerEventType_1 = __webpack_require__(/*! ./ControllerEventType */ "./lib/engine/input/ControllerEventType.js");
const ControllerFamily_1 = __webpack_require__(/*! ./ControllerFamily */ "./lib/engine/input/ControllerFamily.js");
const ControllerIntent_1 = __webpack_require__(/*! ./ControllerIntent */ "./lib/engine/input/ControllerIntent.js");
const ControllerManager_1 = __webpack_require__(/*! ./ControllerManager */ "./lib/engine/input/ControllerManager.js");
const Signal_1 = __webpack_require__(/*! ../util/Signal */ "./lib/engine/util/Signal.js");
const preventDefaultKeyCodes = [
    "ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft", "Space"
];
const keyToIntentMappings = new Map();
keyToIntentMappings.set("Space", [ControllerIntent_1.ControllerIntent.PLAYER_JUMP]);
keyToIntentMappings.set("KeyW", [ControllerIntent_1.ControllerIntent.PLAYER_ENTER_DOOR, ControllerIntent_1.ControllerIntent.MENU_UP]);
keyToIntentMappings.set("KeyA", [ControllerIntent_1.ControllerIntent.PLAYER_MOVE_LEFT, ControllerIntent_1.ControllerIntent.MENU_LEFT]);
keyToIntentMappings.set("KeyS", [ControllerIntent_1.ControllerIntent.PLAYER_DROP, ControllerIntent_1.ControllerIntent.MENU_DOWN]);
keyToIntentMappings.set("KeyD", [ControllerIntent_1.ControllerIntent.PLAYER_MOVE_RIGHT, ControllerIntent_1.ControllerIntent.MENU_RIGHT]);
keyToIntentMappings.set("ArrowUp", [ControllerIntent_1.ControllerIntent.PLAYER_ENTER_DOOR, ControllerIntent_1.ControllerIntent.MENU_UP]);
keyToIntentMappings.set("ArrowDown", [ControllerIntent_1.ControllerIntent.PLAYER_DROP, ControllerIntent_1.ControllerIntent.MENU_DOWN]);
keyToIntentMappings.set("ArrowLeft", [ControllerIntent_1.ControllerIntent.PLAYER_MOVE_LEFT, ControllerIntent_1.ControllerIntent.MENU_LEFT]);
keyToIntentMappings.set("ArrowRight", [ControllerIntent_1.ControllerIntent.PLAYER_MOVE_RIGHT, ControllerIntent_1.ControllerIntent.MENU_RIGHT]);
keyToIntentMappings.set("Enter", [ControllerIntent_1.ControllerIntent.PLAYER_INTERACT, ControllerIntent_1.ControllerIntent.CONFIRM]);
keyToIntentMappings.set("NumpadEnter", [ControllerIntent_1.ControllerIntent.PLAYER_INTERACT, ControllerIntent_1.ControllerIntent.CONFIRM]);
keyToIntentMappings.set("Escape", [ControllerIntent_1.ControllerIntent.ABORT, ControllerIntent_1.ControllerIntent.PAUSE]);
keyToIntentMappings.set("ShiftLeft", [ControllerIntent_1.ControllerIntent.PLAYER_RUN]);
keyToIntentMappings.set("ShiftRight", [ControllerIntent_1.ControllerIntent.PLAYER_RUN]);
keyToIntentMappings.set("KeyE", [ControllerIntent_1.ControllerIntent.PLAYER_INTERACT, ControllerIntent_1.ControllerIntent.CONFIRM]);
keyToIntentMappings.set("KeyF", [ControllerIntent_1.ControllerIntent.PLAYER_ACTION]);
keyToIntentMappings.set("KeyR", [ControllerIntent_1.ControllerIntent.PLAYER_RELOAD]);
keyToIntentMappings.set("Digit1", [ControllerIntent_1.ControllerIntent.PLAYER_DANCE_1]);
keyToIntentMappings.set("Digit2", [ControllerIntent_1.ControllerIntent.PLAYER_DANCE_2]);
keyToIntentMappings.set("Numpad1", [ControllerIntent_1.ControllerIntent.PLAYER_DANCE_1]);
keyToIntentMappings.set("Numpad2", [ControllerIntent_1.ControllerIntent.PLAYER_DANCE_2]);
class Keyboard {
    constructor() {
        this.onKeyDown = new Signal_1.Signal();
        this.onKeyUp = new Signal_1.Signal();
        this.onKeyPress = new Signal_1.Signal();
        this.pressed = new Set();
        this.controllerManager = ControllerManager_1.ControllerManager.getInstance();
        document.addEventListener("keypress", event => this.handleKeyPress(event));
        document.addEventListener("keydown", event => this.handleKeyDown(event));
        document.addEventListener("keyup", event => this.handleKeyUp(event));
    }
    handleKeyPress(event) {
        this.onKeyPress.emit(event);
        // Quick workaround to make sure, that modifier keys never trigger a game-related
        // controller event. Especially necessary to make other non-game related actions
        // possible. (Shift is used as a modifier key to enable running and is therefore
        // excluded from the list below)
        if (event.altKey || event.ctrlKey || event.metaKey) {
            return;
        }
        this.controllerManager.onButtonPress.emit(new ControllerEvent_1.ControllerEvent(ControllerFamily_1.ControllerFamily.KEYBOARD, ControllerEventType_1.ControllerEventType.PRESS, keyToIntentMappings.get(event.code) || [ControllerIntent_1.ControllerIntent.NONE], event.repeat));
    }
    handleKeyDown(event) {
        if (preventDefaultKeyCodes.includes(event.code)) {
            event.preventDefault();
        }
        if (!event.repeat) {
            this.pressed.add(event.key);
        }
        this.onKeyDown.emit(event);
        if (event.altKey || event.ctrlKey || event.metaKey) {
            return;
        }
        this.controllerManager.onButtonDown.emit(new ControllerEvent_1.ControllerEvent(ControllerFamily_1.ControllerFamily.KEYBOARD, ControllerEventType_1.ControllerEventType.DOWN, keyToIntentMappings.get(event.code) || [ControllerIntent_1.ControllerIntent.NONE], event.repeat));
    }
    handleKeyUp(event) {
        if (!event.repeat) {
            this.pressed.delete(event.key);
        }
        this.onKeyUp.emit(event);
        if (event.altKey || event.ctrlKey || event.metaKey) {
            return;
        }
        this.controllerManager.onButtonUp.emit(new ControllerEvent_1.ControllerEvent(ControllerFamily_1.ControllerFamily.KEYBOARD, ControllerEventType_1.ControllerEventType.UP, keyToIntentMappings.get(event.code) || [ControllerIntent_1.ControllerIntent.NONE], event.repeat));
    }
    isPressed(key) {
        return this.pressed.has(key);
    }
}
exports.Keyboard = Keyboard;


/***/ }),

/***/ "./lib/engine/scene/AsepriteNode.js":
/*!******************************************!*\
  !*** ./lib/engine/scene/AsepriteNode.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.AsepriteNode = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const SceneNode_1 = __webpack_require__(/*! ./SceneNode */ "./lib/engine/scene/SceneNode.js");
/**
 * Scene node for displaying an [[Aseprite]].
 *
 * @param T - Optional owner game class.
 */
class AsepriteNode extends SceneNode_1.SceneNode {
    /**
     * Creates a new scene node displaying the given Aseprite.
     */
    constructor(_a) {
        var _b, _c;
        var { aseprite, sourceBounds } = _a, args = tslib_1.__rest(_a, ["aseprite", "sourceBounds"]);
        super(Object.assign(Object.assign({}, args), { width: aseprite.width, height: aseprite.height }));
        /** Counter how often a tag was played. */
        this.timesTagPlayed = 0;
        /** The current time index of the animation. */
        this.time = 0;
        this.tagPlayTime = 0;
        this.tagStartTime = 0;
        this.aseprite = aseprite;
        this.tag = (_b = args.tag) !== null && _b !== void 0 ? _b : null;
        this.mirrorX = (_c = args.mirrorX) !== null && _c !== void 0 ? _c : false;
        this.sourceBounds = sourceBounds !== null && sourceBounds !== void 0 ? sourceBounds : null;
    }
    /** @inheritDoc */
    updateBoundsPolygon(bounds) {
        if (this.sourceBounds != null) {
            bounds.addRect(this.sourceBounds);
        }
        else {
            if (this.aseprite.hasTag("bounds")) {
                bounds.addRect(this.aseprite.getTaggedSourceBounds("bounds", 0));
            }
            else if (this.tag != null) {
                bounds.addRect(this.aseprite.getTaggedSourceBounds(this.tag, this.time * 1000));
            }
            else {
                bounds.addRect(this.aseprite.getSourceBounds(this.time * 1000));
            }
        }
    }
    /**
     * Returns the displayed Aseprite.
     *
     * @return The displayed Aseprite.
     */
    getAseprite() {
        return this.aseprite;
    }
    /**
     * Sets the Aseprite.
     *
     * @param aseprite - The Aseprite to draw.
     */
    setAseprite(aseprite) {
        if (aseprite !== this.aseprite) {
            this.aseprite = aseprite;
            this.resizeTo(aseprite.width, aseprite.height);
            this.invalidate(SceneNode_1.SceneNodeAspect.RENDERING);
        }
        return this;
    }
    /**
     * Returns the current animation tag. Null if whole animation is displayed.
     *
     * @return The current animation tag or null for whole animation.
     */
    getTag() {
        return this.tag;
    }
    /**
     * Sets the animation tag. Null to display whole animation.
     *
     * @param tag - The animation tag to set. Null to unset.
     */
    setTag(tag) {
        if (tag !== this.tag) {
            this.tag = tag;
            this.invalidate(SceneNode_1.SceneNodeAspect.RENDERING);
            if (this.tag) {
                this.timesTagPlayed = 0;
                this.tagPlayTime = this.aseprite.getAnimationDurationByTag(this.tag);
                this.tagStartTime = 0;
                this.time = 0;
            }
        }
        return this;
    }
    getTimesPlayed(tag) {
        if (tag != null && tag === this.tag) {
            return this.timesTagPlayed;
        }
        return 0;
    }
    setMirrorX(mirrorX) {
        if (mirrorX !== this.mirrorX) {
            this.mirrorX = mirrorX;
            this.invalidate(SceneNode_1.SceneNodeAspect.RENDERING);
        }
        return this;
    }
    isMirrorX() {
        return this.mirrorX;
    }
    /** @inheritDoc */
    update(dt, time) {
        this.time += dt;
    }
    /** @inheritDoc */
    draw(ctx) {
        ctx.save();
        if (this.mirrorX) {
            ctx.translate(this.aseprite.width, 0);
            ctx.scale(-1, 1);
        }
        if (this.tag != null) {
            if (this.tagPlayTime > 0) {
                // Calculate the times the tag was played since tagStartTime.
                this.timesTagPlayed = Math.floor((50 + (this.time - this.tagStartTime) * 1000) / this.tagPlayTime);
            }
            this.aseprite.drawTag(ctx, this.tag, 0, 0, this.time * 1000);
        }
        else {
            this.aseprite.draw(ctx, 0, 0, this.time * 1000);
        }
        ctx.restore();
    }
}
exports.AsepriteNode = AsepriteNode;


/***/ }),

/***/ "./lib/engine/scene/Camera.js":
/*!************************************!*\
  !*** ./lib/engine/scene/Camera.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const AffineTransform_1 = __webpack_require__(/*! ../graphics/AffineTransform */ "./lib/engine/graphics/AffineTransform.js");
const SceneNode_1 = __webpack_require__(/*! ./SceneNode */ "./lib/engine/scene/SceneNode.js");
const easings_1 = __webpack_require__(/*! ../util/easings */ "./lib/engine/util/easings.js");
const Animator_1 = __webpack_require__(/*! ./animations/Animator */ "./lib/engine/scene/animations/Animator.js");
const CinematicBars_1 = __webpack_require__(/*! ./camera/CinematicBars */ "./lib/engine/scene/camera/CinematicBars.js");
const FadeToBlack_1 = __webpack_require__(/*! ./camera/FadeToBlack */ "./lib/engine/scene/camera/FadeToBlack.js");
const math_1 = __webpack_require__(/*! ../util/math */ "./lib/engine/util/math.js");
/**
 * Helper function to get the actual position of a camera target which can be of various types.
 *
 * @param target - The camera target.
 * @return The camera target position.
 */
function getCameraTargetPosition(target) {
    if (target instanceof Function) {
        return getCameraTargetPosition(target());
    }
    else if (target instanceof SceneNode_1.SceneNode) {
        return target.getCameraTarget();
    }
    else {
        return target;
    }
}
/**
 * Base camera implementation.
 */
class Camera {
    /**
     * Creates a new standard camera for the given game. The camera position is initialized to look at the center
     * of the game screen.
     */
    constructor(scene) {
        /** The current horizontal focus point of the camera within the scene. */
        this.x = 0;
        /** The current vertical focus point of the camera within the scene. */
        this.y = 0;
        /** The current camera scale. */
        this.zoom = 1;
        /** The current camera rotation in anti-clockwise RAD. */
        this.rotation = 0;
        /**
         * The camera target to follow (if any). When set then the camera automatically follows this given target. When null
         * then camera position is not adjusted automatically.
         */
        this.follow = null;
        /** Custom camera transformation added on top of the camera position (x and y coordinates). */
        this.transformation = new AffineTransform_1.AffineTransform();
        /**
         * The scene transformation of the camera. This combines the camera position (x and y) and its custom
         * [[transformation]].
         */
        this.sceneTransformation = new AffineTransform_1.AffineTransform();
        /** Flag which indicates if [[sceneTransformation]] is valid or must be recalculated on next access. */
        this.sceneTransformationValid = false;
        /** Array with currently active animations. Animations are automatically removed from the array when finished. */
        this.animations = [];
        /** Control the cinematic bars of the camera. */
        this.cinematicBars = new CinematicBars_1.CinematicBars();
        /** Controls the fading to black. */
        this.fadeToBlack = new FadeToBlack_1.FadeToBlack();
        /** The currently playing focus animation. Null if none. */
        this.focusAnimation = null;
        /**
         * The current camera limits. Null if no limits. When set then the followed target position is corrected so
         * visible rectangle of camera is within these limits.
         */
        this.limits = null;
        this.game = scene.game;
        this.x = this.game.width / 2;
        this.y = this.game.height / 2;
    }
    /**
     * Returns the width of the visible camera area.
     *
     * @return The camera width.
     */
    getWidth() {
        return this.game.width / this.zoom;
    }
    /**
     * Returns the height of the visible camera area.
     *
     * @return The camera height.
     */
    getHeight() {
        return this.game.height / this.zoom;
    }
    /**
     * Returns the current horizontal focus point of the camera.
     *
     * @return The camera X position.
     */
    getX() {
        return this.x;
    }
    /**
     * Sets the horizontal focus point of the camera.
     *
     * @param x - The camera X position to set.
     */
    setX(x) {
        if (x !== this.x) {
            this.x = x;
            this.invalidateSceneTransformation();
            this.invalidate();
        }
        return this;
    }
    /**
     * Returns the current vertical focus point of the camera.
     *
     * @return The camera Y position.
     */
    getY() {
        return this.y;
    }
    /**
     * Sets the horizontal focus point of the camera.
     *
     * @param x - The camera Y position to set.
     */
    setY(y) {
        if (y !== this.y) {
            this.y = y;
            this.invalidateSceneTransformation();
            this.invalidate();
        }
        return this;
    }
    /**
     * Moves the camera focus point to the given coordinates.
     *
     * @param x - The camera X position to set.
     * @param y - The camera Y position to set.
     */
    moveTo(x, y) {
        if (x !== this.x || y !== this.y) {
            this.x = x;
            this.y = y;
            this.invalidateSceneTransformation();
            this.invalidate();
        }
        return this;
    }
    /**
     * Moves the camera focus point by the given delta.
     *
     * @param x - The horizontal delta.
     * @param y - The vertical delta.
     */
    moveBy(x, y) {
        if (x !== 0 || y !== 0) {
            this.x += x;
            this.y += y;
            this.invalidateSceneTransformation();
            this.invalidate();
        }
        return this;
    }
    /**
     * Returns the left edge of the visible camera area.
     *
     * @return The left camera edge.
     */
    getLeft() {
        return this.x - this.getWidth() / 2;
    }
    /**
     * Returns the right edge of the visible camera area.
     *
     * @return The right camera edge.
     */
    getRight() {
        return this.x + this.getWidth() / 2;
    }
    /**
     * Returns the top edge of the visible camera area.
     *
     * @return The top camera edge.
     */
    getTop() {
        return this.y - this.getHeight() / 2;
    }
    /**
     * Returns the bottom edge of the visible camera area.
     *
     * @return The bottom camera edge.
     */
    getBottom() {
        return this.y + this.getHeight() / 2;
    }
    /**
     * Sets the camera zoom.
     *
     * @param zoom - The camera zoom to set.
     */
    setZoom(zoom) {
        if (zoom !== this.zoom) {
            this.zoom = zoom;
            this.invalidateSceneTransformation();
            this.invalidate();
        }
        return this;
    }
    /**
     * Returns the current camera zoom.
     *
     * @return The current camera zoom.
     */
    getZoom() {
        return this.zoom;
    }
    /**
     * Sets the camera rotation.
     *
     * @param scale - The camera rotation to set.
     */
    setRotation(rotation) {
        if (rotation !== this.rotation) {
            this.rotation = rotation;
            this.invalidateSceneTransformation();
            this.invalidate();
        }
        return this;
    }
    /**
     * Returns the camera rotation.
     *
     * @return The current camera rotation.
     */
    getRotation() {
        return this.rotation;
    }
    /**
     * Called when camera is changed and a redraw of the scene is needed.
     */
    invalidate() {
        // TODO Nothing to do here yet. Maybe inform the scene that it needs to redraw the canvas later.
    }
    /**
     * Called when position or transformation of the camera has changed and scene transformation must be
     * recalculated.
     */
    invalidateSceneTransformation() {
        this.sceneTransformationValid = false;
    }
    /**
     * Transforms the camera with the given transformer. Scene and scene transformation is invalidated after
     * calling the transformer.
     *
     * @param transformer - The transformer function used to modify the transformation matrix.
     */
    transform(transformer) {
        transformer(this.transformation);
        this.invalidateSceneTransformation();
        this.invalidate();
        return this;
    }
    /**
     * Returns the custom transformation of the camera which can be manipulated by the [[transform]] method. This
     * transformation is applied on of the camera position which is controlled by the X/Y coordinates. So you
     * can fancy rotations and scaling with it for example.
     *
     * @return The custom node transformation.
     */
    getTransformation() {
        return this.transformation;
    }
    /**
     * Returns the scene transformation which is the screen centering, the custom camera transformation and the
     * camera position combined into one transformation matrix. The scene transformation is cached and automatically
     * invalidated when camera position or transformation is changed.
     *
     * @return The scene transformation.
     */
    getSceneTransformation() {
        if (!this.sceneTransformationValid) {
            this.sceneTransformation.reset()
                .translate(this.game.width / 2, this.game.height / 2)
                .mul(this.transformation)
                .scale(this.zoom)
                .rotate(this.rotation)
                .translate(-this.x, -this.y);
            this.sceneTransformationValid = true;
        }
        return this.sceneTransformation;
    }
    /**
     * Adds a new animation to the scene.
     *
     * @param animation - The animation to add.
     */
    addAnimation(animation) {
        this.animations.push(animation);
        return this;
    }
    /**
     * Runs the given animation and returns when animation is finished/canceled. Promise value is true if animation was
     * finished and false if it was canceled.
     *
     * @param animation - The animation to add.
     * @return True if animation was finished, false if it was canceled.
     */
    runAnimation(animation) {
        this.addAnimation(animation);
        return animation.getPromise();
    }
    /**
     * Finishes all currently running animations.
     */
    finishAnimations() {
        for (const animation of this.animations) {
            animation.finish();
        }
        return this;
    }
    /**
     * Updates the animations and removes finished animations.
     */
    updateAnimations(dt) {
        const animations = this.animations;
        let numAnimations = animations.length;
        let i = 0;
        while (i < numAnimations) {
            if (animations[i].update(this, dt)) {
                animations.splice(i, 1);
                numAnimations--;
            }
            else {
                i++;
            }
        }
    }
    /**
     * Checks if camera has running animations.
     *
     * @return True if camera has running animations, false if not.
     */
    hasAnimations() {
        return this.animations.length > 0;
    }
    /**
     * Stops following the currently followed target and focuses the given target. When no animation duration is given
     * then this happens instantly. Otherwise the camera smoothly transitions over to the target. When the follow flag
     * is set then the target is followed after focusing it.
     *
     * It is allowed to change the focus while the animation is still running. The previous animation is then canceled
     * and the new animation transitions from the current position over to the target.
     *
     * @param target - The target scene node to focus.
     * @param args   - Optional focus arguments.
     * @return True when focus was successfully set, false when the transition to the target was canceled by another
     *         focus call.
     */
    focus(target, args = {}) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // Cancel already running focus animation
            this.cancelFocus();
            // Unfollow currently followed target
            this.follow = null;
            const oldX = this.x;
            const oldY = this.y;
            const oldScale = this.zoom;
            const newScale = (_a = args.scale) !== null && _a !== void 0 ? _a : oldScale;
            const oldRotation = this.rotation;
            const newRotation = (_b = args.rotation) !== null && _b !== void 0 ? _b : oldRotation;
            const deltaScale = newScale - oldScale;
            const deltaRotation = newRotation - oldRotation;
            this.focusAnimation = new Animator_1.Animator((camera, value) => {
                const position = getCameraTargetPosition(target);
                const newX = position.x;
                const newY = position.y;
                const deltaX = newX - oldX;
                const deltaY = newY - oldY;
                if (deltaX !== 0) {
                    camera.x = oldX + deltaX * value;
                }
                if (deltaY !== 0) {
                    camera.y = oldY + deltaY * value;
                }
                if (deltaRotation !== 0) {
                    camera.rotation = oldRotation + deltaRotation * value;
                }
                if (deltaScale !== 0) {
                    camera.zoom = oldScale + deltaScale * value;
                }
                this.invalidate();
                this.invalidateSceneTransformation();
            }, Object.assign({ easing: easings_1.easeInOutQuad }, args));
            const finished = yield this.runAnimation(this.focusAnimation);
            if (finished) {
                this.focusAnimation = null;
                if (args.follow === true) {
                    this.follow = target;
                }
                return true;
            }
            else {
                return false;
            }
        });
    }
    /**
     * Returns true if camera is currently in a focus animation.
     *
     * @return True if focusing, false if not.
     */
    isFocusing() {
        return this.focusAnimation != null;
    }
    /**
     * Cancels a currently running focus animation.
     */
    cancelFocus() {
        if (this.focusAnimation != null) {
            this.focusAnimation.cancel();
            this.focusAnimation = null;
        }
        return this;
    }
    /**
     * Sets the target to follow. Null to stop following the current target.
     *
     * @param target - The target to follow or null to unset.
     */
    setFollow(target) {
        if (target !== this.follow) {
            this.cancelFocus();
            this.follow = target;
            this.invalidate();
        }
        return this;
    }
    /**
     * Returns the target which the camera follows. Null if none.
     *
     * @return The camera target to follow. Null if none.
     */
    getFollow() {
        return this.follow;
    }
    isPointVisible(x, y, radius = 0) {
        return (x >= this.getLeft() - radius
            && y >= this.getTop() - radius
            && x <= this.getRight() + radius
            && y <= this.getBottom() + radius);
    }
    /**
     * Sets the camera bounds limits. This applies when following a target (not when focusing). The camera position
     * is limited so the camera bounds are inside the limits.
     *
     * @param limits - The limits to set. Null to unset.
     */
    setLimits(limits) {
        this.limits = limits;
        return this;
    }
    /**
     * Returns the current camera bounds limits.
     *
     * @return The current camera bounds limits.
     */
    getLimits() {
        return this.limits;
    }
    limitX(x) {
        if (this.limits) {
            return math_1.clamp(x, this.limits.getLeft() + this.getWidth() / 2, this.limits.getRight() - this.getWidth() / 2);
        }
        else {
            return x;
        }
    }
    limitY(y) {
        if (this.limits) {
            return math_1.clamp(y, this.limits.getTop() + this.getHeight() / 2, this.limits.getBottom() - this.getHeight() / 2);
        }
        else {
            return y;
        }
    }
    /**
     * Updates the camera. Must be called every time the scene is updated.
     *
     * @param dt - The time delta since last update.
     */
    update(dt) {
        this.updateAnimations(dt);
        if (this.follow) {
            const position = getCameraTargetPosition(this.follow);
            this.moveTo(this.limitX(position.x), this.limitY(position.y));
        }
        this.cinematicBars.update(dt);
        this.fadeToBlack.update(dt);
    }
    /**
     * Draws this camera. The method can return a boolean which indicates if the scene is not finished yet and must be
     * drawn continuously (for animations for example). The method can also return an optional function which is called
     * after the child nodes are drawn so this can be used for post-drawing operations. This post-draw function then
     * can again return an optional boolean which indicates that scene must be continuously draw itself.
     *
     * @param ctx    - The rendering context.
     * @param width  - The scene width.
     * @param height - The scene height.
     * @return Optional boolean to indicate if scene must be redrawn continuously (Defaults to false) or a post-draw
     *         function which is called after drawing the child nodes and which again can return a flag indicating
     *         continuos redraw.
     */
    draw(ctx, width, height) {
        ctx.save();
        this.getSceneTransformation().transformCanvas(ctx);
        return () => {
            ctx.restore();
            let result = this.cinematicBars.draw(ctx, width, height);
            result = this.fadeToBlack.draw(ctx, width, height) || result;
            return result;
        };
    }
}
exports.Camera = Camera;


/***/ }),

/***/ "./lib/engine/scene/FpsCounterNode.js":
/*!********************************************!*\
  !*** ./lib/engine/scene/FpsCounterNode.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.FpsCounterNode = void 0;
const TextNode_1 = __webpack_require__(/*! ./TextNode */ "./lib/engine/scene/TextNode.js");
class FpsCounterNode extends TextNode_1.TextNode {
    constructor() {
        super(...arguments);
        this.frameCounter = 0;
        this.lastUpdate = 0;
    }
    update(dt, time) {
        super.update(dt, time);
        if (this.lastUpdate + 1 < time) {
            this.setText(`${this.frameCounter} FPS`);
            this.lastUpdate = time;
            this.frameCounter = 0;
        }
        this.frameCounter++;
    }
}
exports.FpsCounterNode = FpsCounterNode;


/***/ }),

/***/ "./lib/engine/scene/ImageNode.js":
/*!***************************************!*\
  !*** ./lib/engine/scene/ImageNode.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageNode = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const SceneNode_1 = __webpack_require__(/*! ./SceneNode */ "./lib/engine/scene/SceneNode.js");
/**
 * Scene node for displaying an HTMLImageElement.
 *
 * @param T - Optional owner game class.
 */
class ImageNode extends SceneNode_1.SceneNode {
    /**
     * Creates a new scene node displaying the given image.
     */
    constructor(_a) {
        var { image } = _a, args = tslib_1.__rest(_a, ["image"]);
        super(Object.assign({ width: image.width, height: image.height }, args));
        this.image = image;
    }
    /**
     * Returns the displayed image.
     *
     * @return The displayed image.
     */
    getImage() {
        return this.image;
    }
    /** @inheritDoc */
    draw(ctx) {
        ctx.drawImage(this.image, 0, 0);
    }
}
exports.ImageNode = ImageNode;


/***/ }),

/***/ "./lib/engine/scene/ProgressBarNode.js":
/*!*********************************************!*\
  !*** ./lib/engine/scene/ProgressBarNode.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressBarNode = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const SceneNode_1 = __webpack_require__(/*! ./SceneNode */ "./lib/engine/scene/SceneNode.js");
const math_1 = __webpack_require__(/*! ../util/math */ "./lib/engine/util/math.js");
const DEFAULT_BACKGROUND_STYLE = "#111";
const DEFAULT_BORDER_STYLE = "#222";
const DEFAULT_PROGRESS_STYLE = "#888";
const DEFAULT_WIDTH = 200;
const DEFAULT_HEIGHT = 8;
/**
 * Scene node for displaying a progress bar.
 *
 * @param T - Optional owner game class.
 */
class ProgressBarNode extends SceneNode_1.SceneNode {
    /**
     * Creates a new scene node displaying the given image.
     */
    constructor(_a = {}) {
        var { backgroundStyle = DEFAULT_BACKGROUND_STYLE, borderStyle = DEFAULT_BORDER_STYLE, progressStyle = DEFAULT_PROGRESS_STYLE } = _a, args = tslib_1.__rest(_a, ["backgroundStyle", "borderStyle", "progressStyle"]);
        super(Object.assign({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT }, args));
        this.progress = 0;
        this.backgroundStyle = backgroundStyle;
        this.borderStyle = borderStyle;
        this.progressStyle = progressStyle;
    }
    setProgress(progress) {
        progress = math_1.clamp(progress, 0, 1);
        if (progress !== this.progress) {
            this.progress = progress;
            this.invalidate(SceneNode_1.SceneNodeAspect.RENDERING);
        }
        return this;
    }
    getProgress() {
        return this.progress;
    }
    /** @inheritDoc */
    draw(ctx) {
        ctx.save();
        const width = this.getWidth();
        const height = this.getHeight();
        // Draw background
        ctx.fillStyle = this.backgroundStyle;
        ctx.fillRect(0, 0, width, height);
        // Draw progress bar
        ctx.fillStyle = this.progressStyle;
        ctx.fillRect(0, 0, width * this.progress, height);
        // Draw border
        ctx.save();
        ctx.strokeStyle = this.borderStyle;
        ctx.lineWidth = 2;
        ctx.rect(0, 0, width, height);
        ctx.clip();
        ctx.stroke();
        ctx.restore();
        ctx.restore();
    }
}
exports.ProgressBarNode = ProgressBarNode;


/***/ }),

/***/ "./lib/engine/scene/RootNode.js":
/*!**************************************!*\
  !*** ./lib/engine/scene/RootNode.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.RootNode = void 0;
const SceneNode_1 = __webpack_require__(/*! ./SceneNode */ "./lib/engine/scene/SceneNode.js");
const Direction_1 = __webpack_require__(/*! ../geom/Direction */ "./lib/engine/geom/Direction.js");
/**
 * The root node of a scene.
 *
 * @param T - Optional owner game class.
 */
class RootNode extends SceneNode_1.SceneNode {
    /**
     * Creates a new root scene node for the given scene. Functions for updating and drawing the root node (and its
     * child nodes) is exposed to the scene through the second parameter. Only the scene can use these exposed
     * functions, no one else can by accident.
     *
     * @param scene - The scene this root node is meant for.
     * @param expose - Callback for exposing the update/draw methods of the root node to the scene so the scene can
     *                 call it without making the methods public.
     */
    constructor(scene, expose) {
        super({ anchor: Direction_1.Direction.TOP_LEFT, childAnchor: Direction_1.Direction.TOP_LEFT });
        this.setScene(scene);
        expose(this.updateAll.bind(this), this.drawAllWithBounds.bind(this));
    }
    /**
     * Draws this node and its child nodes recursively and then renders the node bounds when enabled.
     *
     * @param ctx    - The rendering context.
     * @param width  - The scene width.
     * @param height - The scene height.
     * @return Hints which suggests further actions after drawing.
     */
    drawAllWithBounds(ctx, layer, width, height) {
        const flags = this.drawAll(ctx, layer, width, height);
        if ((flags & SceneNode_1.PostDrawHints.DRAW_BOUNDS) !== 0) {
            this.drawBounds(ctx);
        }
        return flags;
    }
}
exports.RootNode = RootNode;


/***/ }),

/***/ "./lib/engine/scene/Scene.js":
/*!***********************************!*\
  !*** ./lib/engine/scene/Scene.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Scene = void 0;
const ControllerManager_1 = __webpack_require__(/*! ../input/ControllerManager */ "./lib/engine/input/ControllerManager.js");
const RootNode_1 = __webpack_require__(/*! ./RootNode */ "./lib/engine/scene/RootNode.js");
const Camera_1 = __webpack_require__(/*! ./Camera */ "./lib/engine/scene/Camera.js");
const graphics_1 = __webpack_require__(/*! ../util/graphics */ "./lib/engine/util/graphics.js");
const Signal_1 = __webpack_require__(/*! ../util/Signal */ "./lib/engine/util/Signal.js");
const ScenePointerMoveEvent_1 = __webpack_require__(/*! ./events/ScenePointerMoveEvent */ "./lib/engine/scene/events/ScenePointerMoveEvent.js");
const ScenePointerDownEvent_1 = __webpack_require__(/*! ./events/ScenePointerDownEvent */ "./lib/engine/scene/events/ScenePointerDownEvent.js");
/**
 * Abstract base class of a scene.
 *
 * @param T - The game type.
 * @param A - Optional scene argument type. A value of this type must be specified when setting or pushing a scene.
 *            Defaults to no argument (void type)
 */
class Scene {
    constructor(game) {
        this.game = game;
        this.zIndex = 0;
        this.currentTransition = null;
        this.inTransition = null;
        this.outTransition = null;
        this.usedLayers = 0;
        this.hiddenLayers = 0;
        this.lightLayers = 0;
        this.hudLayers = 0;
        this.backgroundStyle = null;
        this.onPointerMove = new Signal_1.Signal(this.initPointerMove.bind(this));
        this.onPointerDown = new Signal_1.Signal(this.initPointerDown.bind(this));
        this.rootNode = new RootNode_1.RootNode(this, (update, draw) => {
            this.updateRootNode = update;
            this.drawRootNode = draw;
        });
        this.rootNode.resizeTo(this.game.width, this.game.height);
        this.camera = new Camera_1.Camera(this);
    }
    get keyboard() {
        return this.game.keyboard;
    }
    get input() {
        return ControllerManager_1.ControllerManager.getInstance();
    }
    get scenes() {
        return this.game.scenes;
    }
    /**
     * Shows the given layer when it was previously hidden.
     *
     * @param layer - The layer to show (0-31).
     */
    showLayer(layer) {
        this.hiddenLayers &= ~(1 << layer);
        return this;
    }
    /**
     * Hides the given layer when it was previously shown.
     *
     * @param layer - The layer to hide (0-31).
     */
    hideLayer(layer) {
        this.hiddenLayers |= 1 << layer;
        return this;
    }
    /**
     * Toggles the visibility of the given layer.
     *
     * @param layer   - The layer to toggle.
     * @param visible - Forced visibility state.
     */
    toggleLayer(layer, visible) {
        if (visible !== null && visible !== void 0 ? visible : !this.isLayerShown(layer)) {
            this.showLayer(layer);
        }
        else {
            this.hideLayer(layer);
        }
        return this;
    }
    /**
     * Checks if given layer is hidden.
     *
     * @param layer - The layer to check (0-31).
     * @return True if layer is hidden, false if not.
     */
    isLayerHidden(layer) {
        return (this.hiddenLayers & (1 << layer)) !== 0;
    }
    /**
     * Checks if given layer is shown.
     *
     * @param layer - The layer to check (0-31).
     * @return True if layer is shown, false if not.
     */
    isLayerShown(layer) {
        return (this.hiddenLayers & (1 << layer)) === 0;
    }
    /**
     * Sets the layers which are handled as lighting layers. The nodes rendered in this layer are multiplied with the
     * layers beneath them to achieve dynamic illumination.
     *
     * @param lightLayers - The light layers to set.
     */
    setLightLayers(lightLayers) {
        this.lightLayers = lightLayers.reduce((layers, layer) => layers | (1 << layer), 0);
        return this;
    }
    /**
     * Returns the layers which are handled as lighting layers.
     *
     * @return The light layers.
     */
    getLightLayers() {
        const lightLayers = [];
        for (let layer = 0; layer < 32; ++layer) {
            if ((this.lightLayers & (1 << layer)) !== 0) {
                lightLayers.push(layer);
            }
        }
        return lightLayers;
    }
    /**
     * Sets the layers which are not transformed by the camera. These layers can be used to display fixed information
     * on the screen which is independent from the current camera settings.
     *
     * @param hudLayers - The hud layers to set.
     */
    setHudLayers(hudLayers) {
        this.hudLayers = hudLayers.reduce((layers, layer) => layers | (1 << layer), 0);
        return this;
    }
    /**
     * Returns the HUD layers which are not transformed by the camera.
     *
     * @return The hud layers.
     */
    getHudLayers() {
        const hudLayers = [];
        for (let layer = 0; layer < 32; ++layer) {
            if ((this.hudLayers & (1 << layer)) !== 0) {
                hudLayers.push(layer);
            }
        }
        return hudLayers;
    }
    /**
     * Returns the scene node with the given id.
     *
     * @param id - The ID to look for.
     * @return The matching scene node or null if none.
     */
    getNodeById(id) {
        return this.rootNode.getDescendantById(id);
    }
    /**
     * Returns the background style of this scene. This style is used to fill the background of the scene when set.
     *
     * @return The scene background style.
     */
    getBackgroundStyle() {
        return this.backgroundStyle;
    }
    /**
     * Sets the background style of this scene. This style is used to fill the background of the scene when set.
     *
     * @param backgroundStyle - The background style to set.
     */
    setBackgroundStyle(backgroundStyle) {
        this.backgroundStyle = backgroundStyle;
        return this;
    }
    initPointerMove(signal) {
        const listener = (event) => {
            signal.emit(new ScenePointerMoveEvent_1.ScenePointerMoveEvent(this, event));
        };
        this.game.canvas.addEventListener("pointermove", listener);
        return () => {
            this.game.canvas.removeEventListener("pointermove", listener);
        };
    }
    initPointerDown(signal) {
        const listener = (event) => {
            signal.emit(new ScenePointerDownEvent_1.ScenePointerDownEvent(this, event));
        };
        this.game.canvas.addEventListener("pointerdown", listener);
        return () => {
            this.game.canvas.removeEventListener("pointerdown", listener);
        };
    }
    /**
     * Checks if this scene is active.
     *
     * @return True if scene is active, false it not.
     */
    isActive() {
        return this.scenes.activeScene === this;
    }
    /**
     * Called when the scene is pushed onto the stack and before any transitions.
     *
     * @param args - The scene arguments (if any).
     */
    setup(args) { }
    /**
     * Called when the scene becomes the top scene on the stack and after the on-stage transition is complete.
     */
    activate() { }
    /**
     * Called when the scene is no longer the top scene on the stack and before the off-stage transition begins.
     */
    deactivate() { }
    /**
     * Called when the scene is popped from the scene stack, after any transitions are complete.
     */
    cleanup() { }
    /**
     * Updates the scene. Scenes can overwrite this method to do its own drawing but when you are going to use the
     * scene graph then make sure to call the super method in your overwritten method or the scene graph will not be
     * updated.
     */
    update(dt, time) {
        this.usedLayers = this.updateRootNode(dt, time);
        this.camera.update(dt);
    }
    /**
     * Draws the scene. Scenes can overwrite this method to do its own drawing but when you are going to use the
     * scene graph then make sure to call the super method in your overwritten method or the scene graph will not be
     * rendered.
     *
     * @param ctx    - The rendering context.
     * @param width  - The scene width.
     * @param height - The scene height.
     */
    draw(ctx, width, height) {
        if (this.backgroundStyle != null) {
            ctx.save();
            ctx.fillStyle = this.backgroundStyle;
            ctx.fillRect(0, 0, width, height);
            ctx.restore();
        }
        ctx.save();
        const reverseCameraTransformation = this.camera.getSceneTransformation().clone().invert();
        const postDraw = this.camera.draw(ctx, width, height);
        let layer = 1;
        let usedLayers = this.usedLayers & ~this.hiddenLayers;
        let debugLight = true;
        while (usedLayers !== 0) {
            if ((usedLayers & 1) === 1) {
                const light = (this.lightLayers & layer) !== 0;
                const hud = (this.hudLayers & layer) !== 0;
                if (light) {
                    ctx.save();
                    const canvas = graphics_1.createCanvas(width, height);
                    const tmpCtx = graphics_1.getRenderingContext(canvas, "2d");
                    tmpCtx.fillStyle = "#000";
                    tmpCtx.fillRect(0, 0, width * 200, height * 200);
                    this.camera.getSceneTransformation().setCanvasTransform(tmpCtx);
                    tmpCtx.globalCompositeOperation = "screen";
                    this.drawRootNode(tmpCtx, layer, width, height);
                    if (!debugLight) {
                        ctx.globalCompositeOperation = "multiply";
                    }
                    reverseCameraTransformation.transformCanvas(ctx);
                    ctx.drawImage(canvas, 0, 0);
                    ctx.restore();
                }
                else {
                    if (hud) {
                        ctx.save();
                        reverseCameraTransformation.transformCanvas(ctx);
                    }
                    this.drawRootNode(ctx, layer, width, height);
                    debugLight = false;
                    if (hud) {
                        ctx.restore();
                    }
                }
            }
            usedLayers >>>= 1;
            layer <<= 1;
        }
        if (postDraw != null) {
            if (postDraw === true) {
                // TODO
            }
            else if (postDraw !== false) {
                postDraw();
            }
        }
        ctx.restore();
    }
}
exports.Scene = Scene;


/***/ }),

/***/ "./lib/engine/scene/SceneNode.js":
/*!***************************************!*\
  !*** ./lib/engine/scene/SceneNode.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SceneNode = exports.SceneNodeAspect = exports.PostDrawHints = void 0;
const Direction_1 = __webpack_require__(/*! ../geom/Direction */ "./lib/engine/geom/Direction.js");
const AffineTransform_1 = __webpack_require__(/*! ../graphics/AffineTransform */ "./lib/engine/graphics/AffineTransform.js");
const Polygon2_1 = __webpack_require__(/*! ../graphics/Polygon2 */ "./lib/engine/graphics/Polygon2.js");
const Vector2_1 = __webpack_require__(/*! ../graphics/Vector2 */ "./lib/engine/graphics/Vector2.js");
const Size2_1 = __webpack_require__(/*! ../graphics/Size2 */ "./lib/engine/graphics/Size2.js");
/**
 * Hints which are returned to the scene after drawing the scene graph. These hints can suggest further actions after
 * drawing like requesting continuous drawing because of running animations.
 */
var PostDrawHints;
(function (PostDrawHints) {
    /** As long as this hint is present the scene must be continuously redrawn to keep animations running. */
    PostDrawHints[PostDrawHints["CONTINUE_DRAWING"] = 1] = "CONTINUE_DRAWING";
    /**
     * When this flag is set then at least one node has the showBounds flag set to true. The root node already
     * handles this flag by drawing the bounds when this hint is present.
     */
    PostDrawHints[PostDrawHints["DRAW_BOUNDS"] = 2] = "DRAW_BOUNDS";
})(PostDrawHints = exports.PostDrawHints || (exports.PostDrawHints = {}));
/**
 * The various aspects of a scene node which can be invalidated to force a re-rendering or recalculation of
 * positions, relayouting and so on.
 */
var SceneNodeAspect;
(function (SceneNodeAspect) {
    /** Node must be re-rendered. */
    SceneNodeAspect[SceneNodeAspect["RENDERING"] = 1] = "RENDERING";
    /** Scene transformation must be recalculated. */
    SceneNodeAspect[SceneNodeAspect["SCENE_TRANSFORMATION"] = 2] = "SCENE_TRANSFORMATION";
    /** Scene position must be recalculated. */
    SceneNodeAspect[SceneNodeAspect["SCENE_POSITION"] = 4] = "SCENE_POSITION";
    /** The bounds (in local coordinate system) polygon must be recalculated. */
    SceneNodeAspect[SceneNodeAspect["BOUNDS"] = 8] = "BOUNDS";
    /** The scene bounds (in scene coordinate system) polygon must be recalculated. */
    SceneNodeAspect[SceneNodeAspect["SCENE_BOUNDS"] = 16] = "SCENE_BOUNDS";
    /** Camera target position must be recalculated. */
    SceneNodeAspect[SceneNodeAspect["CAMERA_TARGET"] = 32] = "CAMERA_TARGET";
})(SceneNodeAspect = exports.SceneNodeAspect || (exports.SceneNodeAspect = {}));
/**
 * Base scene node. Is used as base class for more specialized scene nodes but can also be used standalone as parent
 * node for other nodes (similar to a DIV element in HTML for example).
 */
class SceneNode {
    /**
     * Creates a new scene node with the given initial settings.
     */
    constructor({ id = null, x = 0, y = 0, width = 0, height = 0, anchor = Direction_1.Direction.CENTER, childAnchor = Direction_1.Direction.CENTER, opacity = 1, showBounds = false, layer = null, hidden = false, collisionMask = 0, cameraTargetOffset } = {}) {
        /** The parent node. Null if none. */
        this.parent = null;
        /** The next sibling node. Null if none. */
        this.nextSibling = null;
        /** The previous sibling node. Null if none. */
        this.previousSibling = null;
        /** The first child node. Null if none. */
        this.firstChild = null;
        /** The last child node. Null if none. */
        this.lastChild = null;
        /** The scene this node is connected to. Null if none. */
        this.scene = null;
        /** The node position relative to the parent node. */
        this.position = new Vector2_1.Vector2();
        /** The size of the scene node. */
        this.size = new Size2_1.Size2();
        /** The node position within the scene. */
        this.scenePosition = new Vector2_1.Vector2();
        /** The position the camera focuses when following this node. */
        this.cameraTarget = new Vector2_1.Vector2();
        /**
         * The camera target offset. When the camera follows this node then it focuses the scene position plus this offset.
         */
        this.cameraTargetOffset = new Vector2_1.Vector2();
        /**
         * The bounds polygon in local coordinate system. This is updated on demand and automatically invalidated when
         * node size changes. Node has to call [[invalidate]] with BOUNDS argument manually when something else influences
         * the bounds.
         */
        this.boundsPolygon = new Polygon2_1.Polygon2();
        /**
         * The bounds polygon in scene coordinates. This is updated on demand and automatically invalidated when node
         * size or scene transformation changes. Node has to call [[invalidate]] with the BOUNDS argument manually when
         * something else influences the bounds.
         */
        this.sceneBoundsPolygon = new Polygon2_1.Polygon2();
        /**
         * The transformation matrix of this node. This transformation is applied to the node before moving the node to
         * its position (X/Y coordinates). So in simple cases this transformation is not needed at all and its up to you
         * if you want to use the coordinates and/or the transformation matrix.
         */
        this.transformation = new AffineTransform_1.AffineTransform();
        /**
         * The transformation matrix combining the nodes transformation with all the parent transformations. This is
         * calculated on-the-fly when a scene node is updated.
         */
        this.sceneTransformation = new AffineTransform_1.AffineTransform();
        /** Array with currently active animations. Animations are automatically removed from the array when finished.*/
        this.animations = [];
        /**
         * The aspects of the scene node (like rendering, scene transformation, ...) which are currently valid.
         * Used to automatically update the corresponding state of the scene node on the fly.
         */
        this.valid = 0;
        /**
         * Collision mask. Only objects with the same bits set can collide with each other.
         * Defaults to 0 (No collision detection)
         */
        this.collisionMask = 0;
        /** List of nodes this node is currently colliding with. */
        this.collidingWith = [];
        this.id = id;
        this.position.setComponents(x, y);
        this.size.setDimensions(width, height);
        this.opacity = opacity;
        this.anchor = anchor;
        this.childAnchor = childAnchor;
        this.showBounds = showBounds;
        this.layer = layer == null ? null : (1 << layer);
        this.hidden = hidden;
        this.collisionMask = collisionMask;
        if (cameraTargetOffset != null) {
            this.cameraTargetOffset.setVector(cameraTargetOffset);
        }
    }
    /**
     * Returns the node ID.
     *
     * @return The ID of the node or null if none.
     */
    getId() {
        return this.id;
    }
    /**
     * Sets (or removes) the node ID.
     *
     * @param id - The id to set or null to unset.
     */
    setId(id) {
        this.id = id;
        return this;
    }
    /**
     * Returns the X position of the node relative to the parent node.
     *
     * @return The X position.
     */
    getX() {
        return this.position.x;
    }
    get x() {
        return this.position.x;
    }
    set x(x) {
        this.setX(x);
    }
    /**
     * Sets the horizontal position relative to the parent node.
     *
     * @param x - The horizontal position to set.
     */
    setX(x) {
        if (x !== this.position.x) {
            this.position.x = x;
            this.invalidate(SceneNodeAspect.SCENE_POSITION);
        }
        return this;
    }
    /**
     * Returns the Y position of the node relative the parent node.
     *
     * @return The Y position.
     */
    getY() {
        return this.position.y;
    }
    get y() {
        return this.position.y;
    }
    set y(y) {
        this.setY(y);
    }
    /**
     * Sets the vertical position relative to the parent node.
     *
     * @param y - The vertical position to set.
     */
    setY(y) {
        if (y !== this.position.y) {
            this.position.y = y;
            this.invalidate(SceneNodeAspect.SCENE_POSITION);
        }
        return this;
    }
    /**
     * Returns the node position relative to its parent.
     *
     * @return The node position relative to its parent.
     */
    getPosition() {
        return this.position;
    }
    /**
     * Returns the node position in the scene.
     *
     * @return The node position in the scene.
     */
    getScenePosition() {
        if ((this.valid & SceneNodeAspect.SCENE_POSITION) === 0) {
            this.scenePosition.setComponents(this.x, this.y);
            if (this.parent != null) {
                this.scenePosition.mul(this.parent.getSceneTransformation());
                this.scenePosition.translate((Direction_1.Direction.getX(this.parent.childAnchor) + 1) / 2 * this.parent.width, (Direction_1.Direction.getY(this.parent.childAnchor) + 1) / 2 * this.parent.height);
            }
            this.valid |= SceneNodeAspect.SCENE_POSITION;
        }
        return this.scenePosition;
    }
    /**
     * Returns the camera target point. This is the same as the scene position but uses the camera anchor instead of
     * the normal node anchor.
     *
     * @return The camera target position.
     */
    getCameraTarget() {
        if ((this.valid & SceneNodeAspect.CAMERA_TARGET) === 0) {
            this.cameraTarget.setVector(this.getScenePosition()).add(this.cameraTargetOffset);
            this.valid |= SceneNodeAspect.CAMERA_TARGET;
        }
        return this.cameraTarget;
    }
    /**
     * Invalidates the given scene node aspect. Depending on the aspect other aspects of this node, its parent node
     * or its child nodes are also invalidated.
     *
     * @param aspect - The aspect to invalidate. Actually it's a bitmap so multiple aspects can be specified by
     *                 ORing them. Defaults to RENDERING as this is the most invalidated aspect of a scene node.
     */
    invalidate(aspect = SceneNodeAspect.RENDERING) {
        let childAspects = 0;
        // When bounds are invalidated then scene bounds and rendering and scene positions of children must also be
        // invalidated
        if ((aspect & SceneNodeAspect.BOUNDS) !== 0) {
            aspect |= SceneNodeAspect.SCENE_BOUNDS;
            aspect |= SceneNodeAspect.RENDERING;
            childAspects |= SceneNodeAspect.SCENE_POSITION;
        }
        // When scene position is invalidated then scene transformation must also be invalidated
        if ((aspect & SceneNodeAspect.SCENE_POSITION) !== 0) {
            aspect |= SceneNodeAspect.SCENE_TRANSFORMATION;
            aspect |= SceneNodeAspect.CAMERA_TARGET;
        }
        // When scene transformation is invalidated then scene bounds and rendering and scene positions of children
        // must also be invalidated.
        if ((aspect & SceneNodeAspect.SCENE_TRANSFORMATION) !== 0) {
            aspect |= SceneNodeAspect.SCENE_BOUNDS;
            aspect |= SceneNodeAspect.RENDERING;
            childAspects |= SceneNodeAspect.SCENE_POSITION;
        }
        if ((aspect & this.valid) !== 0) {
            this.valid &= ~aspect;
            // Invalidate corresponding child aspects if needed
            if (childAspects !== 0) {
                this.forEachChild(child => child.invalidate(childAspects));
            }
        }
        return this;
    }
    /**
     * Checks if given aspect of the scene node is valid. This method is most likely only needed in unit tests.
     * The application usually does not need to care about invalidation because the various aspects are automatically
     * validated again on-demand.
     *
     * @param aspect - The aspect to check. Actually it's a bitmap so multiple aspects can be specified by ORing them.
     * @return True if aspect is valid (Or all specified aspects are valid), false if not.
     */
    isValid(aspect) {
        return (this.valid & aspect) === aspect;
    }
    /**
     * Moves the node by the given deltas.
     *
     * @param x - The horizontal delta to move the node by.
     * @param y - The vertical delta to move the node by.
     */
    moveBy(x, y) {
        if (x !== 0 || y !== 0) {
            this.position.x += x;
            this.position.y += y;
            this.invalidate(SceneNodeAspect.SCENE_POSITION);
        }
        return this;
    }
    /**
     * Moves the node to the given position relative to its parent node.
     *
     * @param x - The horizontal position to move to.
     * @param y - The vertical position to move to.
     */
    moveTo(x, y) {
        if (x !== this.position.x || y !== this.position.y) {
            this.position.x = x;
            this.position.y = y;
            this.invalidate(SceneNodeAspect.SCENE_POSITION);
        }
        return this;
    }
    /**
     * Returns the width of the node.
     *
     * @return The node width.
     */
    getWidth() {
        return this.size.width;
    }
    get width() {
        return this.size.width;
    }
    set width(width) {
        this.setHeight(width);
    }
    /**
     * Sets the width of the node.
     *
     * @param width - The width to set.
     */
    setWidth(width) {
        if (width !== this.size.width) {
            this.size.width = width;
            this.invalidate(SceneNodeAspect.BOUNDS);
        }
        return this;
    }
    /**
     * Returns the height of the node.
     *
     * @return The node width.
     */
    getHeight() {
        return this.size.height;
    }
    get height() {
        return this.size.height;
    }
    set height(height) {
        this.setHeight(height);
    }
    /**
     * Sets the height of the node.
     *
     * @param height - The height to set.
     */
    setHeight(height) {
        if (height !== this.size.height) {
            this.size.height = height;
            this.invalidate(SceneNodeAspect.BOUNDS);
        }
        return this;
    }
    /**
     * Get the left edge of the scene node.
     *
     * @return The left edge of the scene node.
     */
    getLeft() {
        if (Direction_1.Direction.isLeft(this.anchor)) {
            return this.position.x;
        }
        else if (Direction_1.Direction.isRight(this.anchor)) {
            return this.position.x - this.size.width;
        }
        else {
            return this.position.x - this.size.width / 2;
        }
    }
    /**
     * Get the left edge of the scene node.
     *
     * @return The left edge of the scene node.
     */
    getRight() {
        if (Direction_1.Direction.isRight(this.anchor)) {
            return this.position.x;
        }
        else if (Direction_1.Direction.isLeft(this.anchor)) {
            return this.position.x + this.size.width;
        }
        else {
            return this.position.x + this.size.width / 2;
        }
    }
    /**
     * Get the top edge of the scene node.
     *
     * @return The top edge of the scene node.
     */
    getTop() {
        if (Direction_1.Direction.isTop(this.anchor)) {
            return this.position.y;
        }
        else if (Direction_1.Direction.isBottom(this.anchor)) {
            return this.position.y - this.size.height;
        }
        else {
            return this.position.y - this.size.height / 2;
        }
    }
    /**
     * Get the bottom edge of the scene node.
     *
     * @return The bottom edge of the scene node.
     */
    getBottom() {
        if (Direction_1.Direction.isBottom(this.anchor)) {
            return this.position.y;
        }
        else if (Direction_1.Direction.isTop(this.anchor)) {
            return this.position.y + this.size.height;
        }
        else {
            return this.position.y + this.size.height / 2;
        }
    }
    /**
     * Resizes the node to the given width and height.
     *
     * @param width  - The width to set.
     * @param height - The height to set.
     */
    resizeTo(width, height) {
        const size = this.size;
        if (width !== size.width || height !== size.height) {
            size.width = width;
            size.height = height;
            this.invalidate(SceneNodeAspect.BOUNDS);
        }
        return this;
    }
    /**
     * Returns the current opacity of the node.
     *
     * @return The opacity. 0.0 means fully transparent, 1.0 means fully opaque.
     */
    getOpacity() {
        return this.opacity;
    }
    /**
     * Sets the nodes opacity.
     *
     * @pram opacity - The opacity to set. 0.0 means fully transparent, 1.0 means fully opaque. Can be larger than 1.0
     *                 to compensate transparency of its parent.
     */
    setOpacity(opacity) {
        opacity = Math.max(0, opacity);
        if (opacity !== this.opacity) {
            this.opacity = opacity;
            this.invalidate();
        }
        return this;
    }
    /**
     * Returns the effective node opacity which is the nodes opacity multiplied by the parents effective opacity.
     *
     * @return The effective node opacity clamped to valid range of 0.0 to 1.0.
     */
    getEffectiveOpacity() {
        var _a, _b;
        if (this.opacity === Infinity) {
            return 1;
        }
        return Math.max(0, Math.min(1, ((_b = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.getEffectiveOpacity()) !== null && _b !== void 0 ? _b : 1) * this.opacity));
    }
    /**
     * Shows or hides this node.
     *
     * @param hidden - True to hide the node, false to show it.
     */
    setHidden(hidden) {
        if (hidden !== this.hidden) {
            this.hidden = hidden;
            this.invalidate();
        }
        return this;
    }
    /**
     * Shows or hides this node.
     *
     * @param visible - True to show the node, false to hide it.
     */
    setVisible(visible) {
        return this.setHidden(!visible);
    }
    /**
     * Checks if node is hidden.
     *
     * @return True if node is hidden, false if not.
     */
    isHidden() {
        return this.hidden;
    }
    /**
     * Checks if node is visible.
     *
     * @return True if node is visible, false if not.
     */
    isVisible() {
        return !this.hidden;
    }
    /**
     * Hides this node.
     */
    hide() {
        return this.setHidden(true);
    }
    /**
     * Show this node.
     */
    show() {
        return this.setHidden(false);
    }
    /**
     * Returns the node anchor which defines the meaning of the X/Y coordinates of the node. CENTER means the X/Y
     * coordinates define the center of the node. TOP_LEFT means the X/Y coordinates define the upper left corner of
     * the node.
     *
     * @return The node anchor.
     */
    getAnchor() {
        return this.anchor;
    }
    /**
     * Sets the node anchor which defines the meaning of the X/Y coordinates of the node. CENTER means the X/Y
     * coordinates define the center of the node. TOP_LEFT means the X/Y coordinates define the upper left corner of
     * the node.
     *
     * @param anchor - The node anchor to set.
     */
    setAnchor(anchor) {
        if (anchor !== this.anchor) {
            this.anchor = anchor;
            this.invalidate(SceneNodeAspect.SCENE_TRANSFORMATION);
        }
        return this;
    }
    /**
     * Returns the child anchor which defines the origin of the local coordinate system to which the coordinates of
     * child nodes are relative to.
     *
     * @return The child anchor.
     */
    getChildAnchor() {
        return this.childAnchor;
    }
    /**
     * Sets the child anchor which defines the origin of the local coordinate system to which the coordinates of
     * child nodes are relative to.
     *
     * @param childAnchor - The child anchor to set.
     */
    setChildAnchor(childAnchor) {
        if (childAnchor !== this.childAnchor) {
            this.childAnchor = childAnchor;
            this.forEachChild(child => child.invalidate(SceneNodeAspect.SCENE_POSITION));
        }
        return this;
    }
    /**
     * Returns the custom transformation of this node which can be manipulated by the [[transform]] method. This
     * transformation is applied to the node before it is rendered at its intended position. Transformation and
     * node position can complement each other or you can only use one of them, that's up to you.
     *
     * @return The custom node transformation.
     */
    getTransformation() {
        return this.transformation;
    }
    /**
     * Returns the scene transformation of this node. This is cached and automatically recalculated when
     * local transformation of this node or one of its parents is changed.
     *
     * @return The scene transformation.
     */
    getSceneTransformation() {
        if ((this.valid & SceneNodeAspect.SCENE_TRANSFORMATION) === 0) {
            const parent = this.parent;
            if (parent != null) {
                this.sceneTransformation.setMatrix(parent.getSceneTransformation());
                this.sceneTransformation.translate((Direction_1.Direction.getX(parent.childAnchor) + 1) / 2 * parent.size.width, (Direction_1.Direction.getY(parent.childAnchor) + 1) / 2 * parent.size.height);
            }
            else {
                this.sceneTransformation.reset();
            }
            this.sceneTransformation.translate(this.position.x, this.position.y);
            this.sceneTransformation.mul(this.transformation);
            this.sceneTransformation.translate(-(Direction_1.Direction.getX(this.anchor) + 1) / 2 * this.size.width, -(Direction_1.Direction.getY(this.anchor) + 1) / 2 * this.size.height);
            this.valid |= SceneNodeAspect.SCENE_TRANSFORMATION;
        }
        return this.sceneTransformation;
    }
    /**
     * Modifies the custom transformation matrix of this node. Calls the given transformer function which can then
     * modify the given transformation matrix. After this the node is invalidated to recalculate bounds and redraw it.
     *
     * @param transformer - Function to call with transformation matrix as argument.
     */
    transform(transformer) {
        transformer(this.transformation);
        return this.invalidate(SceneNodeAspect.SCENE_TRANSFORMATION);
    }
    /**
     * Returns the scene the node is currently attached to. Null if none.
     *
     * @return The current scene or null if none.
     */
    getScene() {
        return this.scene;
    }
    /**
     * Returns the game.
     *
     * @return The game.
     */
    getGame() {
        if (this.scene == null) {
            throw new Error("Node is not in a scene and therefor can't access the game");
        }
        return this.scene.game;
    }
    /**
     * Sets the scene this node and all its children belongs to. This is called internally when a node is added to
     * the scene.
     *
     * @param scene - The scene the node belongs to from now on. null to unset the current scene.
     */
    setScene(scene) {
        if (scene !== this.scene) {
            if (this.scene) {
                this.deactivate();
            }
            this.scene = scene;
            if (scene) {
                this.activate();
            }
            this.forEachChild(node => node.setScene(scene));
        }
    }
    /**
     * Checks if scene node is present in a scene.
     *
     * @return True if in scene, false if not.
     */
    isInScene() {
        return this.scene != null;
    }
    /**
     * Called when node is added to scene. Can be overwritten to connect event handlers for example.
     */
    activate() { }
    /**
     * Called when node is removed from scene. Can be overwritten to disconnect event handlers for example.
     */
    deactivate() { }
    /**
     * Returns the parent node of this node or null if node is not attached to a parent or is the root node.
     *
     * @return The parent node or null if unattached or root element.
     */
    getParent() {
        return this.parent;
    }
    /**
     * Returns the next node at the same level.
     *
     * @return The next sibling or null if none.
     */
    getNextSibling() {
        return this.nextSibling;
    }
    /**
     * Returns the previous node at the same level.
     *
     * @return The previous sibling or null if none.
     */
    getPreviousSibling() {
        return this.previousSibling;
    }
    /**
     * Returns the first child node.
     *
     * @return The first child node or null if none.
     */
    getFirstChild() {
        return this.firstChild;
    }
    /**
     * Returns the last child node.
     *
     * @return The last child node or null if none.
     */
    getLastChild() {
        return this.lastChild;
    }
    /**
     * Checks if this node has child nodes.
     *
     * @return True if it child nodes are present, false if not.
     */
    hasChildNodes() {
        return this.firstChild != null;
    }
    /**
     * Appends the given child node so it becomes the last child of this node.
     *
     * @param node - The child node to append.
     */
    appendChild(node) {
        if (node === this) {
            throw new Error("Node can not be appended to itself");
        }
        // Remove from old parent if there is one
        const oldParent = node.parent;
        if (oldParent) {
            oldParent.removeChild(node);
        }
        // Append the child
        node.previousSibling = this.lastChild;
        const oldLastChild = this.lastChild;
        if (oldLastChild) {
            oldLastChild.nextSibling = node;
        }
        this.lastChild = node;
        if (!this.firstChild) {
            this.firstChild = node;
        }
        node.parent = this;
        node.setScene(this.scene);
        node.invalidate(SceneNodeAspect.SCENE_POSITION);
        return this;
    }
    /**
     * Prepends the given child node so it becomes the first child of this node.
     *
     * @param node - The child node to prepend.
     */
    prependChild(node) {
        if (this.firstChild != null) {
            return this.insertChildBefore(node, this.firstChild);
        }
        else {
            return this.appendChild(node);
        }
    }
    /**
     * Removes the given child node
     *
     * @param child - The child node to remove.
     */
    removeChild(node) {
        if (node.parent !== this) {
            throw new Error("Node must be a child node");
        }
        // Remove node from linked list
        const next = node.nextSibling;
        const prev = node.previousSibling;
        if (next) {
            next.previousSibling = prev;
        }
        if (prev) {
            prev.nextSibling = next;
        }
        // Correct first/last reference
        if (node === this.firstChild) {
            this.firstChild = next;
        }
        if (node === this.lastChild) {
            this.lastChild = prev;
        }
        // Remove all references from node
        node.parent = null;
        node.nextSibling = null;
        node.previousSibling = null;
        node.setScene(null);
        node.invalidate(SceneNodeAspect.SCENE_POSITION);
        return this;
    }
    /**
     * Removes this node from the scene. The node is then a detached node ready to be added to the scene (or some
     * other scene) again.
     */
    remove() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
        return this;
    }
    /**
     * Removes all child nodes.
     */
    clear() {
        while (this.lastChild) {
            this.removeChild(this.lastChild);
        }
        return this;
    }
    /**
     * Inserts the given child node before the specified reference child node.
     *
     * @param newNode - The child node to insert.
     * @param refNode - The reference node. The child node is inserted before this one.
     */
    insertChildBefore(newNode, refNode) {
        if (newNode === refNode) {
            // Nothing to do when inserting before itself
            return this;
        }
        if (newNode === this) {
            throw new Error("Node can not be inserted into itself");
        }
        if (refNode.parent !== this) {
            throw new Error("Reference node must be a child node");
        }
        // Remove from old parent if there is one
        const oldParent = newNode.parent;
        if (oldParent != null) {
            oldParent.removeChild(newNode);
        }
        // Insert the node
        const oldPrevious = refNode.previousSibling;
        if (oldPrevious == null) {
            this.firstChild = newNode;
        }
        else {
            oldPrevious.nextSibling = newNode;
        }
        refNode.previousSibling = newNode;
        newNode.previousSibling = oldPrevious;
        newNode.nextSibling = refNode;
        newNode.parent = this;
        newNode.setScene(this.scene);
        newNode.invalidate(SceneNodeAspect.SCENE_POSITION);
        return this;
    }
    /**
     * Inserts this node before the given reference node.
     *
     * @param refNode - The reference node. The node is inserted before this one.
     */
    insertBefore(refNode) {
        const parent = refNode.parent;
        if (parent == null) {
            throw new Error("Reference node has no parent");
        }
        parent.insertChildBefore(this, refNode);
        return this;
    }
    /**
     * Inserts the given child node after the specified reference child node.
     *
     * @param newNode - The child node to insert.
     * @param refNode - The reference node. The child node is inserted after this one.
     */
    insertChildAfter(newNode, refNode) {
        if (newNode === refNode) {
            // Nothing to do when inserting after itself
            return this;
        }
        if (newNode === this) {
            throw new Error("Node can not be inserted into itself");
        }
        if (refNode.parent !== this) {
            throw new Error("Reference node must be a child node");
        }
        const nextRefSibling = refNode.nextSibling;
        if (nextRefSibling != null) {
            return this.insertChildBefore(newNode, nextRefSibling);
        }
        else {
            return this.appendChild(newNode);
        }
    }
    /**
     * Inserts this node before the given reference node.
     *
     * @param refNode - The reference node. The node is inserted after this one.
     */
    insertAfter(refNode) {
        const parent = refNode.parent;
        if (parent == null) {
            throw new Error("Reference node has no parent");
        }
        parent.insertChildAfter(this, refNode);
        return this;
    }
    /**
     * Replaces the given child node with a new node.
     *
     * @param oldNode - The old child node to replace.
     * @param newNode - The new node to replace the old one with.
     */
    replaceChild(oldNode, newNode) {
        if (newNode === this) {
            throw new Error("New node must not be the parent node");
        }
        if (oldNode.parent !== this) {
            throw new Error("Old node must be a child node");
        }
        // If new node is the same as the old node then do nothing
        if (newNode === oldNode) {
            return this;
        }
        const next = oldNode.nextSibling;
        this.removeChild(oldNode);
        if (next) {
            this.insertChildBefore(newNode, next);
        }
        else {
            this.appendChild(newNode);
        }
        return this;
    }
    /**
     * Replace this node with the given one.
     *
     * @param node - The node to replace this one with.
     */
    replaceWith(node) {
        if (this.parent) {
            this.parent.replaceChild(this, node);
        }
        return this;
    }
    /**
     * Appends this node to the given parent node.
     *
     * @param node - The parent node to append this node to.
     */
    appendTo(node) {
        node.appendChild(this);
        return this;
    }
    /**
     * Prepends this node to the given parent node.
     *
     * @param node - The parent node to prepend this node to.
     */
    prependTo(node) {
        node.prependChild(this);
        return this;
    }
    /**
     * Iterates over all child nodes and calls the given callback with the currently iterated node as parameter.
     *
     * @param callback - The callback to call for each child node.
     * @param thisArg  - Optional value to use as `this` when executing `callback`.
     */
    forEachChild(callback, thisArg = this) {
        let index = 0;
        let node = this.firstChild;
        while (node) {
            const next = node.nextSibling;
            callback.call(thisArg, node, index++);
            node = next;
        }
        return this;
    }
    /**
     * Returns an iterator over all child nodes of this node.
     *
     * @return The child iterator.
     */
    *children() {
        let node = this.firstChild;
        while (node) {
            const next = node.nextSibling;
            yield node;
            node = next;
        }
    }
    /**
     * Iterates over all descendant nodes and calls the given callback with the currently iterated node as parameter.
     *
     * @param callback - The callback to call for each descendant node.
     * @param thisArg  - Optional value to use as `this` when executing `callback`.
     */
    forEachDescendant(callback, thisArg = this) {
        var _a;
        let node = this.firstChild;
        while (node != null && node !== this) {
            let next = node.firstChild;
            if (next == null) {
                next = node.nextSibling;
            }
            if (next == null) {
                let parent = node.parent;
                if (parent === this) {
                    parent = null;
                }
                while (parent != null && parent.nextSibling == null) {
                    parent = parent.parent;
                }
                next = (_a = parent === null || parent === void 0 ? void 0 : parent.nextSibling) !== null && _a !== void 0 ? _a : null;
            }
            callback.call(thisArg, node);
            node = next;
        }
        return this;
    }
    /**
     * Returns an iterator over all child nodes of this node.
     *
     * @return The child iterator.
     */
    *descendants() {
        var _a;
        let node = this.firstChild;
        while (node != null && node !== this) {
            let next = node.firstChild;
            if (next == null) {
                next = node.nextSibling;
            }
            if (next == null) {
                let parent = node.parent;
                if (parent === this) {
                    parent = null;
                }
                while (parent != null && parent.nextSibling == null) {
                    parent = parent.parent;
                }
                next = (_a = parent === null || parent === void 0 ? void 0 : parent.nextSibling) !== null && _a !== void 0 ? _a : null;
            }
            yield (node);
            node = next;
        }
    }
    /**
     * Returns the first child node for which the given callback returns true.
     *
     * @param callback - The callback which checks if the iterated node is the one to look for.
     * @return The found matching child node or null if none.
     */
    findChild(callback, thisArg = this) {
        let index = 0;
        let node = this.firstChild;
        while (node) {
            const next = node.nextSibling;
            if (callback.call(thisArg, node, index++)) {
                return node;
            }
            node = next;
        }
        return null;
    }
    /**
     * Returns the first descendant node for which the given callback returns true.
     *
     * @param callback - The callback which checks if the iterated node is the one to look for.
     * @return The found matching descendant node or null if none.
     */
    findDescendant(callback, thisArg = this) {
        var _a;
        let node = this.firstChild;
        while (node != null && node !== this) {
            let next = node.firstChild;
            if (next == null) {
                next = node.nextSibling;
            }
            if (next == null) {
                let parent = node.parent;
                if (parent === this) {
                    parent = null;
                }
                while (parent != null && parent.nextSibling == null) {
                    parent = parent.parent;
                }
                next = (_a = parent === null || parent === void 0 ? void 0 : parent.nextSibling) !== null && _a !== void 0 ? _a : null;
            }
            if (callback.call(thisArg, node)) {
                return node;
            }
            node = next;
        }
        return null;
    }
    /**
     * Tests whether at least one child node passes the test implemented by the provided function.
     *
     * @param callback - The callback to call for each child node returning a boolean.
     * @param thisArg  - Optional value to use as `this` when executing `callback`.
     * @return True if at least one child node returned true in the given callback, false if none did.
     */
    someChildren(callback, thisArg = this) {
        let index = 0;
        let node = this.firstChild;
        while (node) {
            const next = node.nextSibling;
            if (callback.call(thisArg, node, index++)) {
                return true;
            }
            node = next;
        }
        return false;
    }
    /**
     * Returns a new array with all child nodes.
     *
     * @return All child nodes.
     */
    getChildren() {
        const children = [];
        let node = this.firstChild;
        while (node) {
            children.push(node);
            node = node.nextSibling;
        }
        return children;
    }
    /**
     * Returns the descendant node with the given id.
     *
     * @param id - The ID to look for.
     * @return The matching descendant node or null if none.
     */
    getDescendantById(id) {
        return this.findDescendant(node => node.getId() === id);
    }
    /**
     * Returns the descendant node with the given type.
     *
     * @param type - The type to look for.
     * @return The matching descendants. May be empty if none found.
     */
    getDescendantsByType(type) {
        var _a;
        const descendants = [];
        let node = this.firstChild;
        while (node != null && node !== this) {
            let next = node.firstChild;
            if (next == null) {
                next = node.nextSibling;
            }
            if (next == null) {
                let parent = node.parent;
                if (parent === this) {
                    parent = null;
                }
                while (parent != null && parent.nextSibling == null) {
                    parent = parent.parent;
                }
                next = (_a = parent === null || parent === void 0 ? void 0 : parent.nextSibling) !== null && _a !== void 0 ? _a : null;
            }
            if (node instanceof type) {
                descendants.push(node);
            }
            node = next;
        }
        return descendants;
    }
    /**
     * Updates the bounds polygon of the node. The default implementation simply sets a bounding box. Specialized nodes
     * can overwrite this method to define a more specific polygon.
     *
     * @param bounds - The empty bounds polygon to be filled with points by this method.
     */
    updateBoundsPolygon(bounds) {
        bounds.addVertex(new Vector2_1.Vector2(0, 0));
        bounds.addVertex(new Vector2_1.Vector2(this.size.width, 0));
        bounds.addVertex(new Vector2_1.Vector2(this.size.width, this.size.height));
        bounds.addVertex(new Vector2_1.Vector2(0, this.size.height));
    }
    /**
     * Returns the bounds polygon of the node.
     *
     * @return The bounds polygon.
     */
    getBoundsPolygon() {
        if ((this.valid & SceneNodeAspect.BOUNDS) === 0) {
            this.boundsPolygon.clear();
            this.updateBoundsPolygon(this.boundsPolygon);
            this.valid |= SceneNodeAspect.BOUNDS;
        }
        return this.boundsPolygon;
    }
    /**
     * Returns the node bounds within local coordinate system.
     *
     * @return The bounds of this node.
     */
    getBounds() {
        return this.getBoundsPolygon().getBounds();
    }
    /**
     * Returns the scene bounds polygon of the node.
     *
     * @return The scene bounds polygon.
     */
    getSceneBoundsPolygon() {
        if ((this.valid & SceneNodeAspect.SCENE_BOUNDS) === 0) {
            const boundsPolygon = this.getBoundsPolygon();
            this.sceneBoundsPolygon.clear();
            for (const vertex of boundsPolygon.vertices) {
                this.sceneBoundsPolygon.addVertex(vertex.clone());
            }
            this.sceneBoundsPolygon.transform(this.getSceneTransformation());
            this.valid |= SceneNodeAspect.SCENE_BOUNDS;
        }
        return this.sceneBoundsPolygon;
    }
    /**
     * Returns the node bounds within scene coordinate system.
     *
     * @return The scene bounds.
     */
    getSceneBounds() {
        return this.getSceneBoundsPolygon().getBounds();
    }
    /**
     * Adds a new animation to the scene.
     *
     * @param animation - The animation to add.
     */
    addAnimation(animation) {
        this.animations.push(animation);
        return this;
    }
    /**
     * Finishes all currently running animations. This calls all animator functions with their last animation index
     * (1.0) and then removes the animations.
     */
    finishAnimations() {
        for (const animation of this.animations) {
            animation.finish();
        }
        return this.forEachChild(child => child.finishAnimations());
    }
    /**
     * Checks if node has running animations.
     *
     * @return True if node has animations, false if not.
     */
    hasAnimations() {
        return this.animations.length > 0 || this.someChildren(child => child.hasAnimations());
    }
    /**
     * Enables or disables showing node bounds. This may be useful for debugging.
     *
     * @param showBounds - True to enable showing node bounds, false to disable it.
     */
    setShowBounds(showBounds) {
        if (showBounds !== this.showBounds) {
            this.showBounds = showBounds;
        }
        return this;
    }
    /**
     * Returns true if node bounds are currently shown for debugging purposes.
     *
     * @return True if node bounds are shown, false if not.
     */
    isShowBounds() {
        return this.showBounds;
    }
    /**
     * Returns the layer of this node.
     *
     * @return The node's layer (0-31). Null if inherited from parent.
     */
    getLayer() {
        return this.layer == null ? null : Math.log2(this.layer);
    }
    /**
     * Sets the layer this node should appear on.
     *
     * @param layer - The layer to set (0-31).
     */
    setLayer(layer) {
        if (layer != null && (layer < 0 || layer > 31)) {
            throw new Error(`Valid layer range is 0-31 but was ${layer}`);
        }
        layer = layer == null ? null : (1 << layer);
        if (layer !== this.layer) {
            this.layer = layer;
        }
        return this;
    }
    /**
     * Returns the effective layer of this node.
     *
     * @return The effective layer.
     */
    getEffectiveLayer() {
        if (this.layer == null) {
            if (this.parent == null) {
                return 1;
            }
            else {
                return this.parent.getEffectiveLayer();
            }
        }
        else {
            return this.layer;
        }
    }
    /**
     * Checks if this node collides with the given node.
     *
     * @param node - The other node to check collision with.
     * @return True if nodes collide, false if not.
     */
    collidesWithNode(node) {
        return this.getSceneBoundsPolygon().collidesWith(node.getSceneBoundsPolygon());
    }
    /**
     * Checks if given point is contained by this node.
     *
     * @param x - The X coordinate in scene coordinate system.
     * @param y - The Y coordinate in scene coordinate system.
     * @return True if point is contained by the node, false if not.
     */
    containsPoint(x, y) {
        return this.getSceneBoundsPolygon().containsPoint(x, y);
    }
    /**
     * Updates the animations and removes finished animations.
     */
    updateAnimations(dt) {
        const animations = this.animations;
        let numAnimations = animations.length;
        let i = 0;
        while (i < numAnimations) {
            if (animations[i].update(this, dt)) {
                animations.splice(i, 1);
                numAnimations--;
            }
            else {
                i++;
            }
        }
    }
    /**
     * Updates this node and its child nodes recursively.
     *
     * @param dt - The time in seconds since the last update.
     * @return Bit mask with used layers.
     */
    updateAll(dt, time) {
        // Update this node and run animations
        const postUpdate = this.update(dt, time);
        this.updateAnimations(dt);
        // Update child nodes
        const layers = this.updateChildren(dt, time) | this.getEffectiveLayer();
        // When update method returned a post-update function then call it now
        if (postUpdate != null) {
            postUpdate();
        }
        return layers;
    }
    /**
     * Updates the child nodes of this node recursively.
     *
     * @param dt - The time in seconds since the last update.
     * @return Bit mask with used layers.
     */
    updateChildren(dt, time) {
        let layers = 0;
        this.forEachChild(child => {
            layers |= child.updateAll(dt, time);
        });
        return layers;
    }
    /**
     * Updates this node. This is done before updating the child nodes of this node. The method can return an optional
     * function which is called after the child nodes are updated so this can be used for post-updating operations.
     *
     * @param dt - The time in seconds since the last update.
     * @return Optional post-update function which is called after updating the child nodes.
     */
    update(dt, time) { }
    /**
     * Recursively draws the bounds for this node and alls its child nodes as long as the [[showBounds]] for the node
     * is set to true.
     *
     * @param ctx - The rendering context.
     */
    drawBounds(ctx) {
        if (this.showBounds) {
            const lineDashOffset = Math.round(Date.now() / 100) % 8;
            // Draw bounds polygon
            const boundsPolygon = this.getSceneBoundsPolygon();
            ctx.save();
            ctx.beginPath();
            boundsPolygon.draw(ctx);
            ctx.clip();
            ctx.save();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "red";
            ctx.setLineDash([2, 6]);
            ctx.lineDashOffset = lineDashOffset;
            ctx.stroke();
            ctx.strokeStyle = "white";
            ctx.lineDashOffset = lineDashOffset + 2;
            ctx.stroke();
            ctx.restore();
            ctx.restore();
            // Draw bounds rectangle
            const bounds = this.getSceneBounds();
            ctx.save();
            ctx.beginPath();
            bounds.draw(ctx);
            ctx.clip();
            ctx.save();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "blue";
            ctx.setLineDash([2, 6]);
            ctx.lineDashOffset = lineDashOffset + 4;
            ctx.stroke();
            ctx.strokeStyle = "white";
            ctx.lineDashOffset = lineDashOffset + 6;
            ctx.stroke();
            ctx.restore();
            ctx.restore();
        }
        return this.forEachChild(child => child.drawBounds(ctx));
    }
    /**
     * Draws this scene node and its child nodes recursively
     *
     * @param ctx    - The rendering context.
     * @param layer  - The layer to render. Nodes which doesn't belong to this layer are not drawn.
     * @param width  - The scene width.
     * @param height - The scene height.
     * @return Hints which suggests further actions after drawing.
     */
    drawAll(ctx, layer, width, height) {
        if (this.hidden) {
            this.valid |= SceneNodeAspect.RENDERING;
            return 0;
        }
        ctx.save();
        ctx.globalAlpha *= this.getEffectiveOpacity();
        ctx.translate(this.position.x, this.position.y);
        this.transformation.transformCanvas(ctx);
        ctx.translate(-(Direction_1.Direction.getX(this.anchor) + 1) / 2 * this.size.width, -(Direction_1.Direction.getY(this.anchor) + 1) / 2 * this.size.height);
        // Ugly hack to correct node positions to exact pixel boundaries because Chrome renders broken character images
        // when exactly between two pixels (Firefox doesn't have this problem).
        if (ctx.getTransform) {
            const transform = ctx.getTransform();
            ctx.translate(Math.round(transform.e) - transform.e, Math.round(transform.f) - transform.f);
        }
        const postDraw = layer === this.getEffectiveLayer() ? this.draw(ctx, width, height) : null;
        ctx.save();
        ctx.translate((Direction_1.Direction.getX(this.childAnchor) + 1) / 2 * this.size.width, (Direction_1.Direction.getY(this.childAnchor) + 1) / 2 * this.size.height);
        let flags = this.drawChildren(ctx, layer, width, height);
        ctx.restore();
        if (postDraw != null) {
            if (postDraw === true) {
                flags |= PostDrawHints.CONTINUE_DRAWING;
            }
            else if (postDraw !== false) {
                postDraw();
            }
        }
        ctx.restore();
        const hints = this.showBounds ? flags | PostDrawHints.DRAW_BOUNDS | PostDrawHints.CONTINUE_DRAWING : flags;
        this.valid |= SceneNodeAspect.RENDERING;
        return hints;
    }
    /**
     * Draws all child nodes of this scene node recursively.
     *
     * @param ctx    - The rendering context.
     * @param layer  - The layer to render. Nodes which doesn't belong to this layer are not drawn.
     * @param width  - The scene width.
     * @param height - The scene height.
     * @return Hints which suggests further actions after drawing.
     */
    drawChildren(ctx, layer, width, height) {
        let flags = 0;
        this.forEachChild(child => {
            flags |= child.drawAll(ctx, layer, width, height);
        });
        return flags;
    }
    /**
     * Draws this node. This is done before drawing the child nodes of this node. The method can return a boolean
     * which indicates if the scene is not finished yet and must be drawn continuously (for animations for example).
     * The method can also return an optional function which is called after the child nodes are drawn so this can be
     * used for post-drawing operations. This post-draw function then can again return an optional boolean which
     * indicates that scene must be continuously draw itself.
     *
     * @param ctx    - The rendering context.
     * @param width  - The scene width.
     * @param height - The scene height.
     * @return Optional boolean to indicate if scene must be redrawn continuously (Defaults to false) or a post-draw
     *         function which is called after drawing the child nodes and which again can return a flag indicating
     *         continuos redraw.
     */
    draw(ctx, width, height) { }
}
exports.SceneNode = SceneNode;


/***/ }),

/***/ "./lib/engine/scene/Scenes.js":
/*!************************************!*\
  !*** ./lib/engine/scene/Scenes.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Scenes = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
class Scenes {
    constructor(game) {
        this.game = game;
        this.activeScene = null;
        this.sceneCache = new WeakMap();
        this.scenes = [];
        this.sortedScenes = [];
    }
    createScene(sceneClass) {
        let scene = this.sceneCache.get(sceneClass);
        if (scene == null) {
            scene = new sceneClass(this.game);
            this.sceneCache.set(sceneClass, scene);
        }
        return scene;
    }
    pushScene(sceneClass, args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.activeScene != null) {
                yield this.activeScene.deactivate();
            }
            const scene = this.createScene(sceneClass);
            yield scene.setup(args);
            this.scenes.push(scene);
            this.updateSortedScenes();
            if (scene.inTransition != null) {
                scene.currentTransition = scene.inTransition;
                yield scene.currentTransition.start("in");
                scene.currentTransition = null;
            }
            this.activeScene = scene;
            yield scene.activate();
        });
    }
    getPreviousScene() {
        var _a;
        return (_a = this.scenes[this.scenes.length - 2]) !== null && _a !== void 0 ? _a : null;
    }
    getScene(type) {
        var _a;
        return ((_a = this.scenes.find(scene => scene instanceof type)) !== null && _a !== void 0 ? _a : null);
    }
    popScene({ noTransition = false } = {}) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const activeScene = this.activeScene;
            if (activeScene != null) {
                yield activeScene.deactivate();
                if (!noTransition && activeScene.outTransition != null) {
                    activeScene.currentTransition = activeScene.outTransition;
                    yield activeScene.currentTransition.start("out");
                    activeScene.currentTransition = null;
                }
                this.scenes.pop();
                this.updateSortedScenes();
                yield activeScene.cleanup();
                this.activeScene = (_a = this.scenes[this.scenes.length - 1]) !== null && _a !== void 0 ? _a : null;
                if (this.activeScene != null) {
                    yield this.activeScene.activate();
                }
            }
            return activeScene;
        });
    }
    setScene(newSceneClass, args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const currentScene = this.activeScene;
            if (currentScene == null) {
                return this.pushScene(newSceneClass, args);
            }
            yield currentScene.deactivate();
            let outTransitionPromise = null;
            if (currentScene.outTransition) {
                currentScene.currentTransition = currentScene.outTransition;
                outTransitionPromise = currentScene.currentTransition.start("out");
            }
            const currentSceneIndex = this.scenes.length - 1;
            const newScene = this.createScene(newSceneClass);
            yield newScene.setup(args);
            this.scenes.push(newScene);
            this.updateSortedScenes();
            if (newScene.inTransition != null) {
                newScene.currentTransition = newScene.inTransition;
                yield newScene.currentTransition.start("in");
                newScene.currentTransition = null;
            }
            yield newScene.activate();
            this.activeScene = newScene;
            if (outTransitionPromise != null) {
                yield outTransitionPromise;
                currentScene.currentTransition = null;
            }
            this.scenes.splice(currentSceneIndex, 1);
            this.updateSortedScenes();
            currentScene.cleanup();
        });
    }
    updateSortedScenes() {
        this.sortedScenes = this.scenes.slice().sort((a, b) => {
            if (a.zIndex === b.zIndex) {
                return this.scenes.indexOf(a) - this.scenes.indexOf(b);
            }
            else {
                return a.zIndex - b.zIndex;
            }
        });
    }
    update(dt, time) {
        this.sortedScenes.forEach(scene => {
            var _a;
            (_a = scene.currentTransition) === null || _a === void 0 ? void 0 : _a.update(dt);
            scene.update(dt, time);
        });
    }
    draw(ctx, width, height) {
        this.sortedScenes.forEach(scene => {
            ctx.save();
            if (scene.currentTransition != null) {
                scene.currentTransition.draw(ctx, () => scene.draw(ctx, width, height), width, height);
            }
            else {
                scene.draw(ctx, width, height);
            }
            ctx.restore();
        });
    }
}
exports.Scenes = Scenes;


/***/ }),

/***/ "./lib/engine/scene/SoundNode.js":
/*!***************************************!*\
  !*** ./lib/engine/scene/SoundNode.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SoundNode = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const Vector2_1 = __webpack_require__(/*! ../graphics/Vector2 */ "./lib/engine/graphics/Vector2.js");
const SceneNode_1 = __webpack_require__(/*! ./SceneNode */ "./lib/engine/scene/SceneNode.js");
/**
 * Scene node for playing an ambient sound depending on the distance to the screen center.
 *
 * @param T - Optional owner game class.
 */
class SoundNode extends SceneNode_1.SceneNode {
    /**
     * Creates a new scene node displaying the given Aseprite.
     */
    constructor(_a) {
        var { sound, range, intensity = 1.0 } = _a, args = tslib_1.__rest(_a, ["sound", "range", "intensity"]);
        super(Object.assign({}, args));
        this.sound = sound;
        this.range = range;
        this.intensity = intensity;
    }
    /**
     * Returns the played sound.
     *
     * @return The played sound.
     */
    getSound() {
        return this.sound;
    }
    /**
     * Sets the sound.
     *
     * @param aseprite - The Aseprite to draw.
     */
    setSound(sound) {
        if (sound !== this.sound) {
            this.sound = sound;
            this.invalidate(SceneNode_1.SceneNodeAspect.RENDERING);
        }
        return this;
    }
    /**
     * Returns the sound range.
     *
     * @return The sound range.
     */
    getRange() {
        return this.range;
    }
    /**
     * Sets the sound range.
     *
     * @param range - The sound range to set.
     */
    setRange(range) {
        if (range !== this.range) {
            this.range = range;
            this.invalidate(SceneNode_1.SceneNodeAspect.RENDERING);
        }
        return this;
    }
    /**
     * Returns the sound intensity (0.0 - 1.0).
     *
     * @return The sound intensity (0.0 - 1.0).
     */
    getIntensity() {
        return this.intensity;
    }
    /**
     * Sets the sound range.
     *
     * @param intensity - The sound range to set.
     */
    setIntensity(intensity) {
        if (intensity !== this.intensity) {
            this.intensity = intensity;
            this.invalidate(SceneNode_1.SceneNodeAspect.RENDERING);
        }
        return this;
    }
    /** @inheritDoc */
    update(dt, time) {
        super.update(dt, time);
        let distance = 0;
        const scene = this.getScene();
        if (scene) {
            distance = this.getScenePosition().getDistance(new Vector2_1.Vector2(scene.camera.getX(), scene.camera.getY()));
        }
        const volume = Math.max(0, this.range - distance) / this.range * this.intensity;
        if (volume > 0) {
            this.sound.setVolume(volume);
            if (!this.sound.isPlaying()) {
                this.sound.play();
            }
        }
        else {
            this.sound.stop();
        }
    }
}
exports.SoundNode = SoundNode;


/***/ }),

/***/ "./lib/engine/scene/TextNode.js":
/*!**************************************!*\
  !*** ./lib/engine/scene/TextNode.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TextNode = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const SceneNode_1 = __webpack_require__(/*! ./SceneNode */ "./lib/engine/scene/SceneNode.js");
/**
 * Scene node for displaying a text with an optional icon left to it.
 *
 * @param T - Optional owner game class.
 */
class TextNode extends SceneNode_1.SceneNode {
    /**
     * Creates a new scene node displaying the given image.
     */
    constructor(_a) {
        var { font, text = "", color = "white", outlineColor = null } = _a, args = tslib_1.__rest(_a, ["font", "text", "color", "outlineColor"]);
        super(args);
        this.font = font;
        this.text = text;
        this.color = color;
        this.outlineColor = outlineColor;
        this.updateSize();
    }
    /**
     * Returns the displayed text.
     *
     * @return The displayed text.
     */
    getText() {
        return this.text;
    }
    /**
     * Sets the displayed text.
     *
     * @param text - The text to set.
     */
    setText(text) {
        if (text !== this.text) {
            this.text = text;
            this.updateSize();
            this.invalidate();
        }
        return this;
    }
    /**
     * Returns the bitmap font used to draw the text.
     *
     * @return The used bitmap font.
     */
    getFont() {
        return this.font;
    }
    /**
     * Sets the bitmap font used to draw the text.
     *
     * @param font - The bitmap font to use.
     */
    setFont(font) {
        if (font !== this.font) {
            this.font = font;
            this.updateSize();
            this.invalidate();
        }
        return this;
    }
    /**
     * Returns the text color.
     *
     * @return The text color.
     */
    getColor() {
        return this.color;
    }
    /**
     * Sets the text color.
     *
     * @param color - The text color to set.
     */
    setColor(color) {
        if (color !== this.color) {
            this.color = color;
            this.invalidate();
        }
        return this;
    }
    /**
     * Returns the text outline color. Null if none.
     *
     * @return The text outline color. Null if none.
     */
    getOutlineColor() {
        return this.outlineColor;
    }
    /**
     * Sets the text outline color.
     *
     * @param outlineColor - The text outline color to set.
     */
    setOutlineColor(outlineColor) {
        if (outlineColor !== this.outlineColor) {
            this.outlineColor = outlineColor;
            this.invalidate();
        }
        return this;
    }
    /**
     * Updates the node size according to the text measurements.
     */
    updateSize() {
        const size = this.font.measureText(this.text);
        this.resizeTo(size.width, size.height);
    }
    /** @inheritDoc */
    draw(ctx) {
        if (this.outlineColor != null) {
            this.font.drawTextWithOutline(ctx, this.text, 0, 0, this.color, this.outlineColor);
        }
        else {
            this.font.drawText(ctx, this.text, 0, 0, this.color);
        }
    }
}
exports.TextNode = TextNode;


/***/ }),

/***/ "./lib/engine/scene/TiledMapLayerNode.js":
/*!***********************************************!*\
  !*** ./lib/engine/scene/TiledMapLayerNode.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TiledMapLayerNode = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const Direction_1 = __webpack_require__(/*! ../geom/Direction */ "./lib/engine/geom/Direction.js");
const TiledTileLayer_1 = __webpack_require__(/*! ../tiled/TiledTileLayer */ "./lib/engine/tiled/TiledTileLayer.js");
const graphics_1 = __webpack_require__(/*! ../util/graphics */ "./lib/engine/util/graphics.js");
const SceneNode_1 = __webpack_require__(/*! ./SceneNode */ "./lib/engine/scene/SceneNode.js");
class TiledMapLayerNode extends SceneNode_1.SceneNode {
    /**
     * Creates a new scene node displaying the given Tiled Map.
     */
    constructor(_a) {
        var { map, name } = _a, args = tslib_1.__rest(_a, ["map", "name"]);
        super(Object.assign({ width: map.getWidth() * map.getTileWidth(), height: map.getHeight() * map.getTileHeight(), anchor: Direction_1.Direction.TOP_LEFT }, args));
        this.renderedMap = null;
        this.map = map;
        this.name = name;
    }
    getRenderedMap() {
        if (this.renderedMap == null) {
            const canvas = graphics_1.createCanvas(this.map.getWidth() * this.map.getTileWidth(), this.map.getHeight() * this.map.getTileHeight());
            const ctx = graphics_1.getRenderingContext(canvas, "2d");
            const layer = this.map.getLayer(this.name, TiledTileLayer_1.TiledTileLayer);
            const tileset = this.map.getTilesets()[0];
            const tilesetImage = tileset.getImage();
            if (tilesetImage === null) {
                return null;
            }
            const data = layer.getData();
            const height = layer.getHeight();
            const width = layer.getWidth();
            for (let y = layer.getY(); y < height; ++y) {
                for (let x = layer.getX(); x < width; ++x) {
                    const tile = data[y * width + x];
                    const tileId = (tile & 0x1FFFFFFF) - tileset.getFirstGID();
                    if (tileId < 0) {
                        continue;
                    }
                    const flippedHorizontally = (tile & 0x80000000);
                    const flippedVertically = (tile & 0x40000000);
                    const flippedDiagonally = (tile & 0x20000000);
                    const tileY = Math.floor(tileId / tileset.getColumns());
                    const tileX = tileId % tileset.getColumns();
                    ctx.save();
                    ctx.translate(x * tileset.getTileWidth(), y * tileset.getTileHeight());
                    if (flippedHorizontally || flippedDiagonally) {
                        ctx.translate(tileset.getTileWidth(), 0);
                        ctx.scale(-1, 1);
                        // offsetX = tileset.getTileWidth();
                    }
                    if (flippedVertically || flippedDiagonally) {
                        ctx.translate(0, tileset.getTileHeight());
                        ctx.scale(1, -1);
                    }
                    ctx.drawImage(tilesetImage, tileX * tileset.getTileWidth(), tileY * tileset.getTileHeight(), tileset.getTileWidth(), tileset.getTileHeight(), 0, 0, tileset.getTileWidth(), tileset.getTileHeight());
                    ctx.restore();
                }
            }
            this.renderedMap = canvas;
        }
        return this.renderedMap;
    }
    draw(ctx) {
        const renderedMap = this.getRenderedMap();
        if (renderedMap != null) {
            ctx.drawImage(renderedMap, 0, 0);
        }
    }
}
exports.TiledMapLayerNode = TiledMapLayerNode;


/***/ }),

/***/ "./lib/engine/scene/TiledMapNode.js":
/*!******************************************!*\
  !*** ./lib/engine/scene/TiledMapNode.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TiledMapNode = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const Direction_1 = __webpack_require__(/*! ../geom/Direction */ "./lib/engine/geom/Direction.js");
const TiledObjectGroupLayer_1 = __webpack_require__(/*! ../tiled/TiledObjectGroupLayer */ "./lib/engine/tiled/TiledObjectGroupLayer.js");
const TiledTileLayer_1 = __webpack_require__(/*! ../tiled/TiledTileLayer */ "./lib/engine/tiled/TiledTileLayer.js");
const math_1 = __webpack_require__(/*! ../util/math */ "./lib/engine/util/math.js");
const SceneNode_1 = __webpack_require__(/*! ./SceneNode */ "./lib/engine/scene/SceneNode.js");
const TiledMapLayerNode_1 = __webpack_require__(/*! ./TiledMapLayerNode */ "./lib/engine/scene/TiledMapLayerNode.js");
class TiledMapNode extends SceneNode_1.SceneNode {
    /**
     * Creates a new scene node displaying the given Tiled Map.
     */
    constructor(_a) {
        var _b, _c, _d;
        var { map, objects } = _a, args = tslib_1.__rest(_a, ["map", "objects"]);
        super(Object.assign({ width: map.getWidth() * map.getTileWidth(), height: map.getHeight() * map.getTileHeight(), anchor: Direction_1.Direction.TOP_LEFT, childAnchor: Direction_1.Direction.TOP_LEFT }, args));
        for (const tiledLayer of map.getLayers()) {
            const layer = (_b = tiledLayer.getOptionalProperty("layer", "int")) === null || _b === void 0 ? void 0 : _b.getValue();
            if (tiledLayer instanceof TiledTileLayer_1.TiledTileLayer) {
                this.appendChild(new TiledMapLayerNode_1.TiledMapLayerNode({ map, layer, name: tiledLayer.getName() }));
            }
            else if (tiledLayer instanceof TiledObjectGroupLayer_1.TiledObjectGroupLayer) {
                for (const object of tiledLayer.getObjects()) {
                    const constructor = (_c = (objects != null ? objects[object.getType()] : null)) !== null && _c !== void 0 ? _c : SceneNode_1.SceneNode;
                    const args = {
                        id: object.getName(),
                        x: object.getX(),
                        y: object.getY(),
                        showBounds: (_d = object.getOptionalProperty("showBounds", "bool")) === null || _d === void 0 ? void 0 : _d.getValue(),
                        layer,
                        tiledObject: object
                    };
                    const width = object.getWidth();
                    const height = object.getHeight();
                    if (width > 0 && height > 0) {
                        args.width = width;
                        args.height = height;
                        args.anchor = Direction_1.Direction.TOP_LEFT;
                    }
                    const node = new constructor(args);
                    node.transform(m => m.rotate(math_1.radians(object.getRotation())));
                    this.appendChild(node);
                }
            }
            else if (tiledLayer instanceof Object) {
                console.log("Unknown layer", tiledLayer.constructor.name);
            }
        }
    }
}
exports.TiledMapNode = TiledMapNode;


/***/ }),

/***/ "./lib/engine/scene/animations/Animator.js":
/*!*************************************************!*\
  !*** ./lib/engine/scene/animations/Animator.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Animator = void 0;
const easings_1 = __webpack_require__(/*! ../../util/easings */ "./lib/engine/util/easings.js");
/**
 * Animation implementation which calls an animator function with a time index from 0.0 to 1.0 (Which can be
 * interpolated with an easing function) to perform the actual animation. It is guaranteed that the animator function
 * is called with value 1.0 when animation is finished.
 */
class Animator {
    /**
     * Creates an animation based on the given animator function. Some aspects of the animation can be configured with
     * named options as second argument.
     *
     * @param animator - The animator function which performs the actual animation.
     */
    constructor(animator, { delay = 0, duration = 1, easing = easings_1.linear } = {}) {
        /** Time elapsed so far within the animation (including delay). */
        this.elapsed = 0;
        /** Resolve function to call for resolving the animation promise. */
        this.resolvePromise = null;
        /** Set to true when animation has been canceled. */
        this.canceled = false;
        this.promise = new Promise(resolve => {
            this.resolvePromise = resolve;
        });
        this.animator = animator;
        this.delay = delay;
        this.duration = duration;
        this.easing = easing;
        this.lifetime = delay + duration;
    }
    /** @inheritDoc */
    update(target, dt) {
        if (!this.canceled) {
            this.elapsed += dt;
            if (this.elapsed < this.lifetime) {
                if (this.elapsed > this.delay) {
                    const timeIndex = ((this.elapsed - this.delay) / this.duration) % 1;
                    this.animator(target, this.easing(timeIndex), this.elapsed);
                }
                return false;
            }
            else {
                if (this.resolvePromise != null) {
                    this.animator(target, 1, this.lifetime);
                    this.resolvePromise(true);
                    this.resolvePromise = null;
                }
                return true;
            }
        }
        else {
            if (this.resolvePromise != null) {
                this.resolvePromise(false);
                this.resolvePromise = null;
            }
            return true;
        }
    }
    /** @inheritDoc */
    finish() {
        this.elapsed = this.lifetime;
    }
    /** @inheritDoc */
    cancel() {
        this.canceled = true;
    }
    /** @inheritDoc */
    getPromise() {
        return this.promise;
    }
    /** @inheritDoc */
    isFinished() {
        return this.elapsed >= this.lifetime;
    }
    /** @inheritDoc */
    isCanceled() {
        return this.canceled;
    }
    /** @inheritDoc */
    isRunning() {
        return this.elapsed < this.lifetime && !this.canceled;
    }
}
exports.Animator = Animator;


/***/ }),

/***/ "./lib/engine/scene/camera/CinematicBars.js":
/*!**************************************************!*\
  !*** ./lib/engine/scene/camera/CinematicBars.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CinematicBars = void 0;
class CinematicBars {
    constructor() {
        this.time = 0;
        this.source = 0;
        this.target = 0;
        this.current = 0;
        this.duration = 0.5;
    }
    move(target = 0.1, duration = this.duration) {
        this.time = 0;
        this.source = this.current;
        this.target = target;
        this.duration = duration;
        return this;
    }
    show({ target, duration } = {}) {
        return this.move(target, duration);
    }
    hide({ duration } = {}) {
        return this.move(0, duration);
    }
    set(target) {
        this.current = this.source = this.target = target;
        return this;
    }
    update(dt) {
        if (this.current !== this.target) {
            const delta = (this.target - this.source) * this.time / this.duration;
            if (this.target >= this.source) {
                this.current = Math.min(this.target, this.source + delta);
            }
            else {
                this.current = Math.max(this.target, this.source + delta);
            }
            this.time += dt;
        }
    }
    draw(ctx, width, height) {
        if (this.current > 0) {
            ctx.save();
            ctx.fillStyle = "black";
            const bar = this.current * height;
            ctx.fillRect(0, 0, width, bar);
            ctx.fillRect(0, height - bar, width, bar);
            ctx.restore();
            return true;
        }
        return false;
    }
}
exports.CinematicBars = CinematicBars;


/***/ }),

/***/ "./lib/engine/scene/camera/FadeToBlack.js":
/*!************************************************!*\
  !*** ./lib/engine/scene/camera/FadeToBlack.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.FadeToBlack = void 0;
class FadeToBlack {
    constructor() {
        this.color = "black";
        this.time = 0;
        this.source = 0;
        this.target = 0;
        this.current = 0;
        this.duration = 0.5;
        this.promise = null;
        this.promiseResolve = null;
    }
    move(target, duration) {
        if (this.promise == null) {
            this.promise = new Promise(resolve => {
                this.promiseResolve = resolve;
            });
        }
        this.time = 0;
        this.source = this.current;
        this.target = target;
        this.duration = duration;
        return this.promise;
    }
    fadeOut({ duration = 0.8, color = "black" } = {}) {
        this.color = color;
        return this.move(1, duration);
    }
    fadeIn({ duration = 0.8 } = {}) {
        return this.move(0, duration);
    }
    set(current, color = "black") {
        this.color = color;
        this.source = this.target = this.current = current;
        return this;
    }
    update(dt) {
        if (this.current !== this.target) {
            const delta = (this.target - this.source) * this.time / this.duration;
            if (this.target > this.source) {
                this.current = Math.min(this.target, this.source + delta);
            }
            else {
                this.current = Math.max(this.target, this.source + delta);
            }
            this.time += dt;
        }
        else if (this.promiseResolve != null) {
            this.promise = null;
            this.promiseResolve();
            this.promiseResolve = null;
        }
    }
    draw(ctx, width, height) {
        if (this.current > 0) {
            ctx.save();
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.current;
            ctx.fillRect(0, 0, width, height);
            ctx.restore();
        }
        return this.current !== this.target;
    }
}
exports.FadeToBlack = FadeToBlack;


/***/ }),

/***/ "./lib/engine/scene/events/ScenePointerDownEvent.js":
/*!**********************************************************!*\
  !*** ./lib/engine/scene/events/ScenePointerDownEvent.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ScenePointerDownEvent = void 0;
const Signal_1 = __webpack_require__(/*! ../../util/Signal */ "./lib/engine/util/Signal.js");
const ScenePointerEvent_1 = __webpack_require__(/*! ./ScenePointerEvent */ "./lib/engine/scene/events/ScenePointerEvent.js");
const ScenePointerMoveEvent_1 = __webpack_require__(/*! ./ScenePointerMoveEvent */ "./lib/engine/scene/events/ScenePointerMoveEvent.js");
class ScenePointerDownEvent extends ScenePointerEvent_1.ScenePointerEvent {
    constructor() {
        super(...arguments);
        this.onPointerMove = new Signal_1.Signal(this.initPointerMove.bind(this));
        this.onPointerEnd = new Signal_1.Signal(this.initPointerEnd.bind(this));
    }
    initPointerMove(signal) {
        const listener = (event) => {
            signal.emit(new ScenePointerMoveEvent_1.ScenePointerMoveEvent(this.scene, event));
        };
        const canvas = this.scene.game.canvas;
        const cleanup = () => {
            canvas.removeEventListener("pointermove", listener);
            this.onPointerEnd.disconnect(cleanup);
        };
        canvas.addEventListener("pointermove", listener);
        return cleanup;
    }
    initPointerEnd(signal) {
        const listener = (event) => {
            signal.emit(new ScenePointerMoveEvent_1.ScenePointerMoveEvent(this.scene, event));
            cleanup();
        };
        const cleanup = () => {
            canvas.removeEventListener("pointercancel", listener);
            canvas.removeEventListener("pointerup", listener);
            this.onPointerMove.clear();
            this.onPointerEnd.clear();
        };
        const canvas = this.scene.game.canvas;
        canvas.addEventListener("pointerup", listener);
        canvas.addEventListener("pointercancel", listener);
        return cleanup;
    }
}
exports.ScenePointerDownEvent = ScenePointerDownEvent;


/***/ }),

/***/ "./lib/engine/scene/events/ScenePointerEvent.js":
/*!******************************************************!*\
  !*** ./lib/engine/scene/events/ScenePointerEvent.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ScenePointerEvent = void 0;
const Vector2_1 = __webpack_require__(/*! ../../graphics/Vector2 */ "./lib/engine/graphics/Vector2.js");
class ScenePointerEvent {
    constructor(scene, event) {
        this.scene = scene;
        this.event = event;
        const canvas = scene.game.canvas;
        const scaleX = canvas.width / canvas.offsetWidth;
        const scaleY = canvas.height / canvas.offsetHeight;
        const cameraTransformation = scene.camera.getSceneTransformation();
        this.position = new Vector2_1.Vector2(event.offsetX, event.offsetY).scale(scaleX, scaleY).div(cameraTransformation);
    }
    getX() {
        return this.position.x;
    }
    getY() {
        return this.position.y;
    }
    getPosition() {
        return this.position;
    }
}
exports.ScenePointerEvent = ScenePointerEvent;


/***/ }),

/***/ "./lib/engine/scene/events/ScenePointerMoveEvent.js":
/*!**********************************************************!*\
  !*** ./lib/engine/scene/events/ScenePointerMoveEvent.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ScenePointerMoveEvent = void 0;
const ScenePointerEvent_1 = __webpack_require__(/*! ./ScenePointerEvent */ "./lib/engine/scene/events/ScenePointerEvent.js");
class ScenePointerMoveEvent extends ScenePointerEvent_1.ScenePointerEvent {
}
exports.ScenePointerMoveEvent = ScenePointerMoveEvent;


/***/ }),

/***/ "./lib/engine/tiled/AbstractTiledLayer.js":
/*!************************************************!*\
  !*** ./lib/engine/tiled/AbstractTiledLayer.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractTiledLayer = void 0;
const TiledProperties_1 = __webpack_require__(/*! ./TiledProperties */ "./lib/engine/tiled/TiledProperties.js");
class AbstractTiledLayer extends TiledProperties_1.TiledProperties {
    constructor(json, baseURL) {
        super(json, baseURL);
        this.json = json;
        this.baseURL = baseURL;
    }
    toJSON() {
        return this.json;
    }
    getType() {
        return this.json.type;
    }
    getId() {
        return this.json.id;
    }
    getName() {
        return this.json.name;
    }
    getOffsetX() {
        return this.json.offsetx;
    }
    getOffsetY() {
        return this.json.offsety;
    }
    getOpacity() {
        return this.json.opacity;
    }
    isVisible() {
        return this.json.visible;
    }
    getX() {
        return this.json.x;
    }
    getY() {
        return this.json.y;
    }
    getWidth() {
        return this.json.width;
    }
    getHeight() {
        return this.json.height;
    }
}
exports.AbstractTiledLayer = AbstractTiledLayer;


/***/ }),

/***/ "./lib/engine/tiled/TiledChunk.js":
/*!****************************************!*\
  !*** ./lib/engine/tiled/TiledChunk.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TiledChunk = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const base64_js_1 = tslib_1.__importDefault(__webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js"));
const pako_1 = tslib_1.__importDefault(__webpack_require__(/*! pako */ "./node_modules/pako/index.js"));
class TiledChunk {
    constructor(json, compression) {
        this.json = json;
        this.compression = compression;
        this.decoded = null;
    }
    static fromJSON(json, compression) {
        return new TiledChunk(json, compression);
    }
    toJSON() {
        return this.json;
    }
    getData() {
        if (this.decoded == null) {
            const json = this.json;
            let decoded;
            if (typeof json.data === "string") {
                const compressed = base64_js_1.default.toByteArray(json.data);
                let uncompressed;
                switch (this.compression) {
                    case "":
                        // Data is not compressed
                        uncompressed = compressed;
                        break;
                    case "gzip":
                        uncompressed = pako_1.default.ungzip(compressed);
                        break;
                    case "zlib":
                        uncompressed = pako_1.default.inflate(compressed);
                        break;
                    default:
                        // zstd is not supported because there is only a very large emscripten port available for
                        // JavaScript. Stick to gzip or zlib for now.
                        throw new Error("Unknown layer compression: " + this.compression);
                }
                decoded = new Uint32Array(uncompressed.buffer);
            }
            else {
                decoded = new Uint32Array(json.data);
            }
            this.decoded = decoded;
        }
        return this.decoded;
    }
    getWidth() {
        return this.json.width;
    }
    getHeight() {
        return this.json.height;
    }
    getX() {
        return this.json.x;
    }
    getY() {
        return this.json.y;
    }
}
exports.TiledChunk = TiledChunk;


/***/ }),

/***/ "./lib/engine/tiled/TiledGroupLayer.js":
/*!*********************************************!*\
  !*** ./lib/engine/tiled/TiledGroupLayer.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TiledGroupLayer = exports.isTiledGroupLayerJSON = void 0;
const AbstractTiledLayer_1 = __webpack_require__(/*! ./AbstractTiledLayer */ "./lib/engine/tiled/AbstractTiledLayer.js");
function isTiledGroupLayerJSON(json) {
    return json.type === "group";
}
exports.isTiledGroupLayerJSON = isTiledGroupLayerJSON;
class TiledGroupLayer extends AbstractTiledLayer_1.AbstractTiledLayer {
    static fromJSON(json, baseURL) {
        return new TiledGroupLayer(json, baseURL);
    }
}
exports.TiledGroupLayer = TiledGroupLayer;


/***/ }),

/***/ "./lib/engine/tiled/TiledImageLayer.js":
/*!*********************************************!*\
  !*** ./lib/engine/tiled/TiledImageLayer.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TiledImageLayer = exports.isTiledImageLayerJSON = void 0;
const AbstractTiledLayer_1 = __webpack_require__(/*! ./AbstractTiledLayer */ "./lib/engine/tiled/AbstractTiledLayer.js");
function isTiledImageLayerJSON(json) {
    return json.type === "imagelayer";
}
exports.isTiledImageLayerJSON = isTiledImageLayerJSON;
class TiledImageLayer extends AbstractTiledLayer_1.AbstractTiledLayer {
    static fromJSON(json, baseURL) {
        return new TiledImageLayer(json, baseURL);
    }
}
exports.TiledImageLayer = TiledImageLayer;


/***/ }),

/***/ "./lib/engine/tiled/TiledLayer.js":
/*!****************************************!*\
  !*** ./lib/engine/tiled/TiledLayer.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TiledLayer = void 0;
const TiledGroupLayer_1 = __webpack_require__(/*! ./TiledGroupLayer */ "./lib/engine/tiled/TiledGroupLayer.js");
const TiledImageLayer_1 = __webpack_require__(/*! ./TiledImageLayer */ "./lib/engine/tiled/TiledImageLayer.js");
const TiledObject_1 = __webpack_require__(/*! ./TiledObject */ "./lib/engine/tiled/TiledObject.js");
const TiledObjectGroupLayer_1 = __webpack_require__(/*! ./TiledObjectGroupLayer */ "./lib/engine/tiled/TiledObjectGroupLayer.js");
const TiledTileLayer_1 = __webpack_require__(/*! ./TiledTileLayer */ "./lib/engine/tiled/TiledTileLayer.js");
var TiledLayer;
(function (TiledLayer) {
    function fromJSON(json, baseURL) {
        if (TiledImageLayer_1.isTiledImageLayerJSON(json)) {
            return TiledImageLayer_1.TiledImageLayer.fromJSON(json, baseURL);
        }
        else if (TiledTileLayer_1.isTiledTileLayerJSON(json)) {
            return TiledTileLayer_1.TiledTileLayer.fromJSON(json, baseURL);
        }
        else if (TiledObject_1.isTiledObjectGroupLayerJSON(json)) {
            return TiledObjectGroupLayer_1.TiledObjectGroupLayer.fromJSON(json, baseURL);
        }
        else if (TiledGroupLayer_1.isTiledGroupLayerJSON(json)) {
            return TiledGroupLayer_1.TiledGroupLayer.fromJSON(json, baseURL);
        }
        else {
            throw new Error("Unknown tiled layer type: " + json.type);
        }
    }
    TiledLayer.fromJSON = fromJSON;
})(TiledLayer = exports.TiledLayer || (exports.TiledLayer = {}));


/***/ }),

/***/ "./lib/engine/tiled/TiledMap.js":
/*!**************************************!*\
  !*** ./lib/engine/tiled/TiledMap.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TiledMap = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const Color_1 = __webpack_require__(/*! ../color/Color */ "./lib/engine/color/Color.js");
const cache_1 = __webpack_require__(/*! ../util/cache */ "./lib/engine/util/cache.js");
const TiledLayer_1 = __webpack_require__(/*! ./TiledLayer */ "./lib/engine/tiled/TiledLayer.js");
const TiledProperties_1 = __webpack_require__(/*! ./TiledProperties */ "./lib/engine/tiled/TiledProperties.js");
const TiledTileset_1 = __webpack_require__(/*! ./TiledTileset */ "./lib/engine/tiled/TiledTileset.js");
class TiledMap extends TiledProperties_1.TiledProperties {
    static fromJSON(json, baseURL) {
        return new TiledMap(json, baseURL);
    }
    /**
     * Loads the tiled map from the given source.
     *
     * @param source - The URL pointing to the JSON file of the tiled map.
     * @return The loaded tiled map.
     */
    static load(source) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const json = yield (yield fetch(source)).json();
            const baseURL = new URL(source, location.href);
            return TiledMap.fromJSON(json, baseURL);
        });
    }
    /**
     * Returns the optional background color.
     *
     * @return The optional background color.
     */
    getBackgroundColor() {
        return this.json.backgroundcolor != null ? Color_1.Color.fromJSON(this.json.backgroundcolor).toRGBA() : null;
    }
    /**
     * Returns the number of tile columns.
     *
     * @return The number of tile columns.
     */
    getWidth() {
        return this.json.width;
    }
    /**
     * Returns the number of tile rows.
     *
     * @return The number of tile rows.
     */
    getHeight() {
        return this.json.height;
    }
    /**
     * Returns the length of the side of a hex in pixels.
     *
     * @return The length of the side of a hex in pixels. Null if not a hexagonal map.
     */
    getHexSideLength() {
        var _a;
        return (_a = this.json.hexsidelength) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Checks whether the map has infinite dimensions.
     *
     * @return True when infinite dimensions, false if not.
     */
    isInfinite() {
        return this.json.infinite;
    }
    /**
     * Returns the map orientation.
     *
     * @return The map orientation.
     */
    getOrientation() {
        return this.json.orientation;
    }
    /**
     * Returns the render order.
     *
     * @return The render order.
     */
    getRenderOrder() {
        return this.json.renderorder;
    }
    /**
     * Returns the stagger axis (x or y).
     *
     * @return The stagger axis. Null if map is not staggered and not hexagonal.
     */
    getStaggerAxis() {
        var _a;
        return (_a = this.json.staggeraxis) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Returns the stagger index (odd or even).
     *
     * @return The stagger index. Null if map is not staggered and not hexagonal.
     */
    getStaggerIndex() {
        var _a;
        return (_a = this.json.staggerindex) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Returns the Tiled version used to save the file.
     *
     * @return The Tiled version used to save the file.
     */
    getTiledVersion() {
        return this.json.tiledversion;
    }
    /**
     * Returns the map grid width.
     *
     * @return The map grid width.
     */
    getTileWidth() {
        return this.json.tilewidth;
    }
    /**
     * Returns the map grid height.
     *
     * @return The map grid height.
     */
    getTileHeight() {
        return this.json.tileheight;
    }
    /**
     * Returns the tilesets.
     *
     * @return The tilesets.
     */
    getTilesets() {
        return this.json.tilesets.map(json => TiledTileset_1.TiledTileset.fromJSON(json, this.baseURL));
    }
    getLayers() {
        return this.json.layers.map(json => TiledLayer_1.TiledLayer.fromJSON(json, this.baseURL));
    }
    getLayersByType(type) {
        return this.getLayers().filter((layer) => layer instanceof type);
    }
    /**
     * Returns the map property with the given name.
     *
     * @param name - The name of the property to return.
     * @param type - The expected property type. An exception is thrown when actual type doesn't match the expected one.
     * @return The map property or null if not found.
     */
    getLayer(name, type) {
        const layer = this.getLayers().find(layer => layer.getName() === name);
        if (layer == null) {
            throw new Error(`No map layer with name '${name}' found`);
        }
        if (type != null && !(layer instanceof type)) {
            throw new Error(`Expected layer with name '${name}' to be of type '${type.name}' but is '${layer.constructor.name}'`);
        }
        return layer;
    }
}
tslib_1.__decorate([
    cache_1.cacheResult,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Object)
], TiledMap.prototype, "getBackgroundColor", null);
tslib_1.__decorate([
    cache_1.cacheResult,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Array)
], TiledMap.prototype, "getTilesets", null);
tslib_1.__decorate([
    cache_1.cacheResult,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Array)
], TiledMap.prototype, "getLayers", null);
exports.TiledMap = TiledMap;


/***/ }),

/***/ "./lib/engine/tiled/TiledObject.js":
/*!*****************************************!*\
  !*** ./lib/engine/tiled/TiledObject.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TiledObject = exports.isTiledObjectGroupLayerJSON = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const Polygon2_1 = __webpack_require__(/*! ../graphics/Polygon2 */ "./lib/engine/graphics/Polygon2.js");
const Vector2_1 = __webpack_require__(/*! ../graphics/Vector2 */ "./lib/engine/graphics/Vector2.js");
const cache_1 = __webpack_require__(/*! ../util/cache */ "./lib/engine/util/cache.js");
const TiledProperties_1 = __webpack_require__(/*! ./TiledProperties */ "./lib/engine/tiled/TiledProperties.js");
function isTiledObjectGroupLayerJSON(json) {
    return json.type === "objectgroup";
}
exports.isTiledObjectGroupLayerJSON = isTiledObjectGroupLayerJSON;
class TiledObject extends TiledProperties_1.TiledProperties {
    toJSON() {
        return this.json;
    }
    static fromJSON(json, baseURL) {
        return new TiledObject(json, baseURL);
    }
    getPolygon() {
        if (this.json.polygon == null) {
            return null;
        }
        const polygon = new Polygon2_1.Polygon2();
        for (const point of this.json.polygon) {
            polygon.addVertex(new Vector2_1.Vector2(point.x, point.y));
        }
        return polygon;
    }
    isEllipse() {
        return this.json.ellipse === true;
    }
    getId() {
        return this.json.id;
    }
    getName() {
        return this.json.name;
    }
    getType() {
        return this.json.type;
    }
    getHeight() {
        return this.json.height;
    }
    getWidth() {
        return this.json.width;
    }
    isVisible() {
        return this.json.visible;
    }
    getX() {
        return this.json.x;
    }
    getY() {
        return this.json.y;
    }
    getRotation() {
        return this.json.rotation;
    }
}
tslib_1.__decorate([
    cache_1.cacheResult,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Object)
], TiledObject.prototype, "getPolygon", null);
exports.TiledObject = TiledObject;


/***/ }),

/***/ "./lib/engine/tiled/TiledObjectGroupLayer.js":
/*!***************************************************!*\
  !*** ./lib/engine/tiled/TiledObjectGroupLayer.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TiledObjectGroupLayer = exports.isTiledObjectGroupLayerJSON = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const cache_1 = __webpack_require__(/*! ../util/cache */ "./lib/engine/util/cache.js");
const AbstractTiledLayer_1 = __webpack_require__(/*! ./AbstractTiledLayer */ "./lib/engine/tiled/AbstractTiledLayer.js");
const TiledObject_1 = __webpack_require__(/*! ./TiledObject */ "./lib/engine/tiled/TiledObject.js");
function isTiledObjectGroupLayerJSON(json) {
    return json.type === "objectgroup";
}
exports.isTiledObjectGroupLayerJSON = isTiledObjectGroupLayerJSON;
class TiledObjectGroupLayer extends AbstractTiledLayer_1.AbstractTiledLayer {
    static fromJSON(json, baseURL) {
        return new TiledObjectGroupLayer(json, baseURL);
    }
    getDrawOrder() {
        return this.json.draworder;
    }
    getObjects() {
        return this.json.objects.map(json => TiledObject_1.TiledObject.fromJSON(json, this.baseURL));
    }
}
tslib_1.__decorate([
    cache_1.cacheResult,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Array)
], TiledObjectGroupLayer.prototype, "getObjects", null);
exports.TiledObjectGroupLayer = TiledObjectGroupLayer;


/***/ }),

/***/ "./lib/engine/tiled/TiledProperties.js":
/*!*********************************************!*\
  !*** ./lib/engine/tiled/TiledProperties.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TiledProperties = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const cache_1 = __webpack_require__(/*! ../util/cache */ "./lib/engine/util/cache.js");
const TiledProperty_1 = __webpack_require__(/*! ./TiledProperty */ "./lib/engine/tiled/TiledProperty.js");
class TiledProperties {
    constructor(json, baseURL) {
        this.json = json;
        this.baseURL = baseURL;
    }
    toJSON() {
        return this.json;
    }
    /**
     * Returns the layer properties.
     *
     * @return The layer properties.
     */
    getProperties() {
        return this.json.properties != null ? this.json.properties.map(json => TiledProperty_1.TiledProperty.fromJSON(json)) : [];
    }
    /**
     * Returns the map property with the given name.
     *
     * @param name - The name of the property to return.
     * @param type - The expected property type. An exception is thrown when actual type doesn't match the expected one.
     * @return The map property or null if not found.
     */
    getProperty(name, type) {
        const property = this.getOptionalProperty(name, type);
        if (property == null) {
            throw new Error(`No map property with name '${name}' found`);
        }
        return property;
    }
    /**
     * Returns the map property with the given name.
     *
     * @param name - The name of the property to return.
     * @param type - The expected property type. An exception is thrown when actual type doesn't match the expected one.
     * @return The map property or null if not found.
     */
    getOptionalProperty(name, type) {
        const property = this.getProperties().find(property => property.getName() === name);
        if (property == null) {
            return null;
        }
        if (type != null && property.getType() !== type) {
            throw new Error(`Expected property with name '${name}' to be of type '${type}' but is '${property.getType()}'`);
        }
        return property;
    }
    /**
     * Checks if map contains a property with the given name.
     *
     * @param name - The name of the property to look for.
     * @return True if property exists, false if not.
     */
    hasProperty(name) {
        return this.getProperties().findIndex(property => property.getName() === name) >= 0;
    }
}
tslib_1.__decorate([
    cache_1.cacheResult,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Array)
], TiledProperties.prototype, "getProperties", null);
exports.TiledProperties = TiledProperties;


/***/ }),

/***/ "./lib/engine/tiled/TiledProperty.js":
/*!*******************************************!*\
  !*** ./lib/engine/tiled/TiledProperty.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TiledProperty = void 0;
const Color_1 = __webpack_require__(/*! ../color/Color */ "./lib/engine/color/Color.js");
class TiledProperty {
    constructor(json) {
        this.json = json;
    }
    static fromJSON(json) {
        return new TiledProperty(json);
    }
    toJSON() {
        return this.json;
    }
    getName() {
        return this.json.name;
    }
    getValue() {
        return (this.json.type === "color" ? Color_1.Color.fromJSON(this.json.value) : this.json.value);
    }
    getType() {
        var _a;
        return (_a = this.json.type) !== null && _a !== void 0 ? _a : "string";
    }
    isInt() {
        return this.getType() === "int";
    }
    isFloat() {
        return this.getType() === "float";
    }
    isBoolean() {
        return this.getType() === "bool";
    }
    iString() {
        return this.getType() === "string";
    }
    isColor() {
        return this.getType() === "color";
    }
    isFile() {
        return this.getType() === "file";
    }
}
exports.TiledProperty = TiledProperty;


/***/ }),

/***/ "./lib/engine/tiled/TiledTileLayer.js":
/*!********************************************!*\
  !*** ./lib/engine/tiled/TiledTileLayer.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TiledTileLayer = exports.isTiledTileLayerJSON = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const base64_js_1 = tslib_1.__importDefault(__webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js"));
const pako_1 = tslib_1.__importDefault(__webpack_require__(/*! pako */ "./node_modules/pako/index.js"));
const AbstractTiledLayer_1 = __webpack_require__(/*! ./AbstractTiledLayer */ "./lib/engine/tiled/AbstractTiledLayer.js");
const TiledChunk_1 = __webpack_require__(/*! ./TiledChunk */ "./lib/engine/tiled/TiledChunk.js");
const cache_1 = __webpack_require__(/*! ../util/cache */ "./lib/engine/util/cache.js");
function isTiledTileLayerJSON(json) {
    return json.type === "tilelayer";
}
exports.isTiledTileLayerJSON = isTiledTileLayerJSON;
class TiledTileLayer extends AbstractTiledLayer_1.AbstractTiledLayer {
    static fromJSON(json, baseURL) {
        return new TiledTileLayer(json, baseURL);
    }
    getData() {
        const json = this.json;
        let decoded;
        if (typeof json.data === "string") {
            const compressed = base64_js_1.default.toByteArray(json.data);
            let uncompressed;
            switch (json.compression) {
                case "":
                    // Data is not compressed
                    uncompressed = compressed;
                    break;
                case "gzip":
                    uncompressed = pako_1.default.ungzip(compressed);
                    break;
                case "zlib":
                    uncompressed = pako_1.default.inflate(compressed);
                    break;
                default:
                    // zstd is not supported because there is only a very large emscripten port available for
                    // JavaScript. Stick to gzip or zlib for now.
                    throw new Error("Unknown layer compression: " + json.compression);
            }
            decoded = new Uint32Array(uncompressed.buffer);
        }
        else {
            decoded = new Uint32Array(json.data);
        }
        return decoded;
    }
    getChunks() {
        var _a, _b;
        return (_b = (_a = this.json.chunks) === null || _a === void 0 ? void 0 : _a.map(json => TiledChunk_1.TiledChunk.fromJSON(json, this.getCompression()))) !== null && _b !== void 0 ? _b : null;
    }
    getCompression() {
        var _a;
        return (_a = this.json.compression) !== null && _a !== void 0 ? _a : null;
    }
    getStartX() {
        var _a;
        return (_a = this.json.startx) !== null && _a !== void 0 ? _a : null;
    }
    getStartY() {
        var _a;
        return (_a = this.json.starty) !== null && _a !== void 0 ? _a : null;
    }
}
tslib_1.__decorate([
    cache_1.cacheResult,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Uint32Array)
], TiledTileLayer.prototype, "getData", null);
tslib_1.__decorate([
    cache_1.cacheResult,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Object)
], TiledTileLayer.prototype, "getChunks", null);
exports.TiledTileLayer = TiledTileLayer;


/***/ }),

/***/ "./lib/engine/tiled/TiledTileset.js":
/*!******************************************!*\
  !*** ./lib/engine/tiled/TiledTileset.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TiledTileset = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const Color_1 = __webpack_require__(/*! ../color/Color */ "./lib/engine/color/Color.js");
const RGBColor_1 = __webpack_require__(/*! ../color/RGBColor */ "./lib/engine/color/RGBColor.js");
const cache_1 = __webpack_require__(/*! ../util/cache */ "./lib/engine/util/cache.js");
const graphics_1 = __webpack_require__(/*! ../util/graphics */ "./lib/engine/util/graphics.js");
class TiledTileset {
    constructor(json, baseURL) {
        this.json = json;
        this.baseURL = baseURL;
        this.image = null;
    }
    static fromJSON(json, baseURL) {
        return new TiledTileset(json, baseURL);
    }
    toJSON() {
        return this.json;
    }
    /**
     * Returns the optional background color.
     *
     * @return The optional background color.
     */
    getBackgroundColor() {
        return this.json.backgroundcolor != null ? Color_1.Color.fromJSON(this.json.backgroundcolor).toRGBA() : null;
    }
    getColumns() {
        return this.json.columns;
    }
    getFirstGID() {
        return this.json.firstgid;
    }
    loadImage() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.image = yield graphics_1.loadImage(new URL(this.json.image, this.baseURL));
            return this.image;
        });
    }
    getImage() {
        if (this.image === null) {
            this.loadImage();
        }
        return this.image;
    }
    getImageURL() {
        return this.json.image;
    }
    getImageWidth() {
        return this.json.imagewidth;
    }
    getImageHeight() {
        return this.json.imageheight;
    }
    getMargin() {
        return this.json.margin;
    }
    getSource() {
        var _a;
        return (_a = this.json.source) !== null && _a !== void 0 ? _a : null;
    }
    getSpacing() {
        return this.json.spacing;
    }
    getTileCount() {
        return this.json.tilecount;
    }
    getTiledVersion() {
        return this.json.tiledversion;
    }
    getTileWidth() {
        return this.json.tilewidth;
    }
    getTileHeight() {
        return this.json.tileheight;
    }
    /**
     * Returns the optional transparency color.
     *
     * @return The optional transparency color.
     */
    getTransparencyColor() {
        return this.json.transparentcolor != null ? RGBColor_1.RGBColor.fromJSON(this.json.transparentcolor) : null;
    }
    getVersion() {
        return this.json.version;
    }
}
tslib_1.__decorate([
    cache_1.cacheResult,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Object)
], TiledTileset.prototype, "getBackgroundColor", null);
tslib_1.__decorate([
    cache_1.cacheResult,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TiledTileset.prototype, "loadImage", null);
tslib_1.__decorate([
    cache_1.cacheResult,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Object)
], TiledTileset.prototype, "getTransparencyColor", null);
exports.TiledTileset = TiledTileset;


/***/ }),

/***/ "./lib/engine/util/Signal.js":
/*!***********************************!*\
  !*** ./lib/engine/util/Signal.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Signal = void 0;
/**
 * Internally used container for a slot (A callback function with a calling context).
 */
class Slot {
    constructor(callback, context) {
        this.callback = callback;
        this.context = context;
    }
    call(value) {
        this.callback.call(this.context, value);
    }
}
/**
 * Light-weight and very fast signal/slot based event system. Just create a signal instance, connect slots
 * (event listeners) to it and then let the signal emit values which are then send to all connected slots.
 * Slots can be methods and it's easy to disconnect them again using the disconnect() method or calling the function
 * returned by connect().
 */
class Signal {
    /**
     * Creates a new signal with the given optional initialization function.
     *
     * @param onInit - Optional initialization function which is called when the first slot is connected to the signal.
     *                 This function can return an optional deinitialization function which is called after the last
     *                 slot has been disconnected.
     */
    constructor(onInit) {
        this.slots = [];
        this.onDone = null;
        this.onInit = onInit !== null && onInit !== void 0 ? onInit : null;
    }
    /**
     * Connects a slot to this signal.
     *
     * @param callback - The slot callback function to call when signal emits a value.
     * @param context  - Optional context to call the slot callback function on. This is useful for connecting methods.
     * @return A function which can be called to disconnect the slot from the signal again.
     */
    connect(callback, context) {
        if (this.onInit != null && this.slots.length === 0) {
            this.onDone = this.onInit(this) || null;
        }
        this.slots.push(new Slot(callback, context));
        return () => this.disconnect(callback, context);
    }
    /**
     * Disconnects a slot from this signal.
     *
     * @param callback - The slot callback function to disconnect from the signal.
     * @param context  - Optional context. Needed to disconnect methods.
     */
    disconnect(callback, context) {
        const index = this.slots.findIndex(slot => slot.callback === callback && slot.context === context);
        if (index >= 0) {
            this.slots.splice(index, 1);
        }
        if (this.onDone != null && this.slots.length === 0) {
            this.onDone(this);
            this.onDone = null;
        }
    }
    /**
     * Disconnects all slots from this signal.
     */
    clear() {
        if (this.slots.length > 0) {
            this.slots.length = 0;
            if (this.onDone != null) {
                this.onDone(this);
                this.onDone = null;
            }
        }
    }
    /**
     * Emits the given value to all connected slots.
     *
     * @param value - The value to emit.
     */
    emit(value) {
        this.slots.forEach(slot => slot.call(value));
    }
    /**
     * Returns a new signal which only emits the values matching the giving predicate.
     *
     * @parm predicate - The function which decides if the value is emitted or not.
     * @return The new signal.
     */
    filter(predicate) {
        return new Signal(signal => this.connect(value => {
            if (predicate(value)) {
                signal.emit(value);
            }
        }));
    }
    /**
     * Returns a new signal which maps all emitted values to something else.
     *
     * @param mapper - The function which maps the original value to something new.
     * @return The new signal.
     */
    map(mapper) {
        return new Signal(signal => this.connect(value => {
            return signal.emit(mapper(value));
        }));
    }
}
exports.Signal = Signal;


/***/ }),

/***/ "./lib/engine/util/cache.js":
/*!**********************************!*\
  !*** ./lib/engine/util/cache.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheResult = void 0;
/**
 * Decorator for caching method results. The method is only called on cache miss and then the returned result
 * is cached. Subsequent calls then return the cached result immediately without executing the method until the
 * cache is reset with `delete obj.method`.
 */
function cacheResult(target, propertyKey, descriptor) {
    const origMethod = target[propertyKey];
    descriptor.value = function () {
        const origValue = origMethod.call(this);
        Object.defineProperty(this, propertyKey, {
            configurable: true,
            value: () => origValue
        });
        return origValue;
    };
}
exports.cacheResult = cacheResult;


/***/ }),

/***/ "./lib/engine/util/easings.js":
/*!************************************!*\
  !*** ./lib/engine/util/easings.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.easeInOutBounce = exports.easeInBounce = exports.easeOutBounce = exports.easeInOutElastic = exports.easeOutElastic = exports.easeInElastic = exports.easeInOutBack = exports.easeOutBack = exports.easeInBack = exports.easeInOutCirc = exports.easeOutCirc = exports.easeInCirc = exports.easeInOutExpo = exports.easeOutExpo = exports.easeInExpo = exports.easeInOutQuint = exports.easeOutQuint = exports.easeInQuint = exports.easeInOutQuart = exports.easeOutQuart = exports.easeInQuart = exports.easeInOutCubic = exports.easeOutCubic = exports.easeInCubic = exports.easeInOutQuad = exports.easeOutQuad = exports.easeInQuad = exports.easeInOutSine = exports.easeOutSine = exports.easeInSine = exports.linear = void 0;
const { PI, cos, sin } = Math;
function linear(t) {
    return t;
}
exports.linear = linear;
function easeInSine(t) {
    return 1 - cos(t * PI / 2);
}
exports.easeInSine = easeInSine;
function easeOutSine(t) {
    return sin(t * PI / 2);
}
exports.easeOutSine = easeOutSine;
function easeInOutSine(t) {
    return 0.5 - cos(PI * t) / 2;
}
exports.easeInOutSine = easeInOutSine;
function easeInQuad(t) {
    return t * t;
}
exports.easeInQuad = easeInQuad;
function easeOutQuad(t) {
    return t * (2 - t);
}
exports.easeOutQuad = easeOutQuad;
function easeInOutQuad(t) {
    if (t < 0.5) {
        return 2 * t * t;
    }
    else {
        return 4 * t - 2 * t * t - 1;
    }
}
exports.easeInOutQuad = easeInOutQuad;
function easeInCubic(t) {
    return Math.pow(t, 3);
}
exports.easeInCubic = easeInCubic;
function easeOutCubic(t) {
    return Math.pow(t, 3) + 3 * (t - t * t);
}
exports.easeOutCubic = easeOutCubic;
function easeInOutCubic(t) {
    if (t < 0.5) {
        return 4 * Math.pow(t, 3);
    }
    else {
        return 4 * Math.pow(t, 3) + 12 * (t - t * t) - 3;
    }
}
exports.easeInOutCubic = easeInOutCubic;
function easeInQuart(t) {
    return Math.pow(t, 4);
}
exports.easeInQuart = easeInQuart;
function easeOutQuart(t) {
    return 1 - Math.pow((t - 1), 4);
}
exports.easeOutQuart = easeOutQuart;
function easeInOutQuart(t) {
    if (t < 0.5) {
        return 8 * Math.pow(t, 4);
    }
    else {
        return 1 - 8 * Math.pow((t - 1), 4);
    }
}
exports.easeInOutQuart = easeInOutQuart;
function easeInQuint(t) {
    return Math.pow(t, 5);
}
exports.easeInQuint = easeInQuint;
function easeOutQuint(t) {
    return 1 + Math.pow((t - 1), 5);
}
exports.easeOutQuint = easeOutQuint;
function easeInOutQuint(t) {
    if (t < 0.5) {
        return 16 * Math.pow(t, 5);
    }
    else {
        return 1 + 16 * Math.pow((t - 1), 5);
    }
}
exports.easeInOutQuint = easeInOutQuint;
function easeInExpo(t) {
    if (t <= 0) {
        return 0;
    }
    return Math.pow(2, (10 * (t - 1)));
}
exports.easeInExpo = easeInExpo;
function easeOutExpo(t) {
    if (t >= 1) {
        return 1;
    }
    return 1 - 1 / Math.pow(1024, t);
}
exports.easeOutExpo = easeOutExpo;
function easeInOutExpo(t) {
    if (t <= 0) {
        return 0;
    }
    if (t >= 1) {
        return 1;
    }
    if (t < 0.5) {
        return Math.pow(1048576, t) / 2048;
    }
    else {
        return 1 - 512 / Math.pow(1048576, t);
    }
}
exports.easeInOutExpo = easeInOutExpo;
function easeInCirc(t) {
    return 1 - Math.pow((1 - t * t), 0.5);
}
exports.easeInCirc = easeInCirc;
function easeOutCirc(t) {
    return Math.pow((2 * t - t * t), 0.5);
}
exports.easeOutCirc = easeOutCirc;
function easeInOutCirc(t) {
    if (t < 0.5) {
        return 0.5 - Math.pow((0.25 - t * t), 0.5);
    }
    else {
        return (Math.pow((4 * t * (2 - t) - 3), 0.5) + 1) / 2;
    }
}
exports.easeInOutCirc = easeInOutCirc;
function easeInBack(t) {
    return 2.70158 * Math.pow(t, 3) - 1.70158 * t * t;
}
exports.easeInBack = easeInBack;
function easeOutBack(t) {
    return 2.70158 * Math.pow(t, 3) - 6.40316 * t * t + 4.70158 * t;
}
exports.easeOutBack = easeOutBack;
function easeInOutBack(t) {
    if (t < 0.5) {
        return 14.379638 * Math.pow(t, 3) - 5.189819 * t * t;
    }
    else {
        return 14.379638 * Math.pow(t, 3) - 37.949095 * t * t + 32.759276 * t - 8.189819;
    }
}
exports.easeInOutBack = easeInOutBack;
function easeInElastic(t) {
    if (t <= 0) {
        return 0;
    }
    if (t >= 1) {
        return 1;
    }
    return Math.pow(1024, (t - 1)) * -sin(PI * (20 * t / 3 - 43 / 6));
}
exports.easeInElastic = easeInElastic;
function easeOutElastic(t) {
    if (t <= 0) {
        return 0;
    }
    if (t >= 1) {
        return 1;
    }
    return sin(PI * (20 * t / 3 - 0.5)) / (Math.pow(1024, t)) + 1;
}
exports.easeOutElastic = easeOutElastic;
function easeInOutElastic(t) {
    if (t <= 0) {
        return 0;
    }
    if (t >= 1) {
        return 1;
    }
    if (t < 0.5) {
        return Math.pow(1048576, t) / -2048 * sin(PI * (80 * t / 9 - 89 / 18));
    }
    else {
        return 512 / Math.pow(1048576, t) * sin(PI * (80 * t / 9 - 89 / 18)) + 1;
    }
}
exports.easeInOutElastic = easeInOutElastic;
function easeOutBounce(t) {
    if (t < 4 / 11) {
        return 121 * t * t / 16;
    }
    else if (t < 8 / 11) {
        return 121 * t * t / 16 - 33 * t / 4 + 3;
    }
    else if (t < 10 / 11) {
        return 121 * t * t / 16 - 99 * t / 8 + 6;
    }
    else {
        return 121 * t * t / 16 - 231 * t / 16 + 63 / 8;
    }
}
exports.easeOutBounce = easeOutBounce;
function easeInBounce(t) {
    return 1 - easeOutBounce(1 - t);
}
exports.easeInBounce = easeInBounce;
function easeInOutBounce(t) {
    if (t < 0.5) {
        return easeInBounce(t * 2) / 2;
    }
    else {
        return easeOutBounce(t * 2 - 1) / 2 + 0.5;
    }
}
exports.easeInOutBounce = easeInOutBounce;


/***/ }),

/***/ "./lib/engine/util/env.js":
/*!********************************!*\
  !*** ./lib/engine/util/env.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isDev = exports.isElectron = exports.isLittleEndian = void 0;
/** Cached result of [[isLittleEndian]] function */
let littleEndian = null;
/**
 * Checks if runtime is little endian.
 *
 * @return True if little endian, false if not.
 */
function isLittleEndian() {
    return littleEndian !== null && littleEndian !== void 0 ? littleEndian : (littleEndian = new Uint16Array(new Uint8Array([0x12, 0x34]).buffer)[0] === 0x3412);
}
exports.isLittleEndian = isLittleEndian;
function isElectron() {
    return !!navigator.userAgent.match(/\belectron\b/i);
}
exports.isElectron = isElectron;
/**
 * Figures out if development mode is enabled or not.
 */
function isDev() {
    // Legacy behavior.
    if (window.location.port === "8000") {
        return true;
    }
    if (!!window.location.search) {
        return !!window.location.search.substr(1).split("&").find(key => {
            if (key.toLowerCase().startsWith("dev")) {
                return key.length === 3 || key.endsWith("=true");
            }
            return false;
        });
    }
    return false;
}
exports.isDev = isDev;


/***/ }),

/***/ "./lib/engine/util/graphics.js":
/*!*************************************!*\
  !*** ./lib/engine/util/graphics.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageData = exports.createContext2D = exports.getRenderingContext = exports.createCanvas = exports.loadImage = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
function loadImage(source) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const img = new Image();
        return new Promise((resolve, reject) => {
            img.onload = () => {
                resolve(img);
            };
            img.onerror = () => {
                reject(new Error(`Unable to load image '${source}'`));
            };
            img.src = source instanceof URL ? source.href : `assets/${source}`;
        });
    });
}
exports.loadImage = loadImage;
function createCanvas(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
}
exports.createCanvas = createCanvas;
function getRenderingContext(canvas, contextId, options) {
    const ctx = canvas.getContext(contextId, options);
    if (ctx == null) {
        throw new Error(`Canvas doesn't support context with id '${contextId}'`);
    }
    return ctx;
}
exports.getRenderingContext = getRenderingContext;
function createContext2D(width, height) {
    return getRenderingContext(createCanvas(width, height), "2d");
}
exports.createContext2D = createContext2D;
function getImageData(image) {
    const ctx = createContext2D(image.width, image.height);
    ctx.drawImage(image, 0, 0, image.width, image.height);
    return ctx.getImageData(0, 0, image.width, image.height);
}
exports.getImageData = getImageData;


/***/ }),

/***/ "./lib/engine/util/math.js":
/*!*********************************!*\
  !*** ./lib/engine/util/math.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeDegrees = exports.normalizeRadians = exports.degrees = exports.radians = exports.orientPow = exports.clamp = void 0;
function clamp(v, min, max) {
    return v < min ? min : v > max ? max : v;
}
exports.clamp = clamp;
function orientPow(v, exp) {
    if (v < 0) {
        return -(Math.pow((-v), exp));
    }
    else {
        return Math.pow(v, exp);
    }
}
exports.orientPow = orientPow;
/** Factor to convert radians to degrees. */
const RAD_TO_DEG = 180 / Math.PI;
/**
 * Converts degrees to radians.
 *
 * @param degrees - The value in degrees to convert to radians.
 * @return The given value converted to radians.
 */
function radians(degrees) {
    return degrees / RAD_TO_DEG;
}
exports.radians = radians;
/**
 * Converts radians to degrees.
 *
 * @param radians - The value in radians to convert to degrees.
 * @return The given value converted to degrees.
 */
function degrees(radians) {
    return radians * RAD_TO_DEG;
}
exports.degrees = degrees;
/**
 * Normalizes an angle in radians so it is between 0 (inclusive) and 2*PI (exclusive).
 *
 * @param degrees - The angle to normalize.
 * @return The normalized angle.
 */
function normalizeRadians(angle) {
    const pi2 = Math.PI * 2;
    return ((angle % pi2) + pi2) % pi2;
}
exports.normalizeRadians = normalizeRadians;
/**
 * Normalizes an angle in degrees so it is between 0 (inclusive) and 360 (exclusive).
 *
 * @param degrees - The angle to normalize.
 * @return The normalized angle.
 */
function normalizeDegrees(degrees) {
    return ((degrees % 360) + 360) % 360;
}
exports.normalizeDegrees = normalizeDegrees;


/***/ }),

/***/ "./lib/engine/util/random.js":
/*!***********************************!*\
  !*** ./lib/engine/util/random.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.timedRnd = exports.rndItem = exports.rndInt = exports.rnd = void 0;
function rnd(minOrMax = 1, max) {
    if (max != null) {
        return minOrMax + Math.random() * (max - minOrMax);
    }
    else {
        return Math.random() * minOrMax;
    }
}
exports.rnd = rnd;
function rndInt(minOrMax, max) {
    if (max != null) {
        return Math.floor(minOrMax + Math.random() * (max - minOrMax));
    }
    else {
        return Math.floor(Math.random() * minOrMax);
    }
}
exports.rndInt = rndInt;
function rndItem(array) {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}
exports.rndItem = rndItem;
function timedRnd(dt, averageDelay) {
    let count = 0;
    let chance = dt - Math.random() * averageDelay;
    while (chance > 0) {
        count++;
        chance -= Math.random() * averageDelay;
    }
    return count;
}
exports.timedRnd = timedRnd;


/***/ }),

/***/ "./lib/engine/util/string.js":
/*!***********************************!*\
  !*** ./lib/engine/util/string.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.toHex = exports.formatNumber = void 0;
/**
 * Formats a number to a string. The returned string is never in scientific notation so the string may get
 * pretty long. NaN und infinite numbers are rejected because they can't be represented as a numerical string.
 *
 * @param value   - The numeric value to convert.
 * @param options - Optional number format options. Defaults to english fullwide locale, not using number grouping
 *                  and using 6 maximum fraction digits.
 * @return The numerical string.
 */
function formatNumber(value, options) {
    var _a;
    if (isNaN(value)) {
        throw new Error("Unable to convert NaN to string");
    }
    if (!isFinite(value)) {
        throw new Error("Unable convert infinite value to string");
    }
    return value.toLocaleString((_a = options === null || options === void 0 ? void 0 : options.locales) !== null && _a !== void 0 ? _a : ["fullwide", "en"], Object.assign({ useGrouping: false, maximumFractionDigits: 6 }, options));
}
exports.formatNumber = formatNumber;
/**
 * Converts the given value into a hex string.
 *
 * @param value  - The decimal value to convert.
 * @param length - The minimum length of the created hex string. Missing digits are filled with 0.
 * @return The hex string.
 */
function toHex(value, length = 0) {
    const hex = (value >>> 0).toString(16);
    return "0".repeat(Math.max(0, length - hex.length)) + hex;
}
exports.toHex = toHex;


/***/ }),

/***/ "./lib/engine/util/time.js":
/*!*********************************!*\
  !*** ./lib/engine/util/time.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.now = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const timeDelta = Date.now() - performance.now();
function now() {
    return performance.now() + timeDelta;
}
exports.now = now;
function sleep(ms = 0) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve) => {
            setTimeout(() => resolve(), ms);
        });
    });
}
exports.sleep = sleep;


/***/ }),

/***/ "./lib/main/Dialog.js":
/*!****************************!*\
  !*** ./lib/main/Dialog.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogLine = exports.Dialog = void 0;
class Dialog {
    constructor(lines) {
        this.lines = lines.map(DialogLine.fromString);
    }
}
exports.Dialog = Dialog;
class DialogLine {
    constructor(charNum, line) {
        this.charNum = charNum;
        this.line = line;
    }
    static fromString(s) {
        const charNum = +s[0] - 1;
        const line = s.substr(1).trim();
        return new DialogLine(charNum, line);
    }
}
exports.DialogLine = DialogLine;


/***/ }),

/***/ "./lib/main/DoorHandler.js":
/*!*********************************!*\
  !*** ./lib/main/DoorHandler.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DoorHandler = void 0;
class DoorHandler {
    constructor() {
        this.lastUsage = 0;
        // Delay between two door activations, in seconds
        this.usageDelay = 4;
    }
    transportToDoor(player, door, currentTime) {
        if (this.isReady(currentTime)) {
            this.lastUsage = currentTime;
            this.performTeleportation(player, door);
            return true;
        }
        return false;
    }
    performTeleportation(player, door) {
        // TODO fade out/in music as well
        // Fade out
        const scene = player.getScene();
        const camera = scene === null || scene === void 0 ? void 0 : scene.camera;
        camera === null || camera === void 0 ? void 0 : camera.fadeToBlack.fadeOut({ duration: 0.8 }).then(() => {
            // Teleport
            player.setX(door.getX());
            player.setY(door.getY());
        });
        // Fade in
        setTimeout(() => {
            camera === null || camera === void 0 ? void 0 : camera.fadeToBlack.fadeIn({ duration: 0.8 });
        }, 1200);
    }
    isReady(currentTime) {
        return currentTime - this.lastUsage > this.usageDelay;
    }
    static getInstance() {
        return DoorHandler.theInstance;
    }
}
exports.DoorHandler = DoorHandler;
DoorHandler.theInstance = new DoorHandler();


/***/ }),

/***/ "./lib/main/Hyperloop.js":
/*!*******************************!*\
  !*** ./lib/main/Hyperloop.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Hyperloop = exports.GameStage = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const RGBColor_1 = __webpack_require__(/*! ../engine/color/RGBColor */ "./lib/engine/color/RGBColor.js");
const Game_1 = __webpack_require__(/*! ../engine/Game */ "./lib/engine/Game.js");
const random_1 = __webpack_require__(/*! ../engine/util/random */ "./lib/engine/util/random.js");
const Dialog_1 = __webpack_require__(/*! ./Dialog */ "./lib/main/Dialog.js");
const CollisionNode_1 = __webpack_require__(/*! ./nodes/CollisionNode */ "./lib/main/nodes/CollisionNode.js");
const LightNode_1 = __webpack_require__(/*! ./nodes/LightNode */ "./lib/main/nodes/LightNode.js");
const NpcNode_1 = __webpack_require__(/*! ./nodes/NpcNode */ "./lib/main/nodes/NpcNode.js");
const PlayerNode_1 = __webpack_require__(/*! ./nodes/PlayerNode */ "./lib/main/nodes/PlayerNode.js");
const TrainNode_1 = __webpack_require__(/*! ./nodes/TrainNode */ "./lib/main/nodes/TrainNode.js");
const GameScene_1 = __webpack_require__(/*! ./scenes/GameScene */ "./lib/main/scenes/GameScene.js");
const LoadingScene_1 = __webpack_require__(/*! ./scenes/LoadingScene */ "./lib/main/scenes/LoadingScene.js");
var GameStage;
(function (GameStage) {
    GameStage[GameStage["NONE"] = 0] = "NONE";
    GameStage[GameStage["INTRO"] = 1] = "INTRO";
    GameStage[GameStage["DRIVE"] = 2] = "DRIVE";
    GameStage[GameStage["BRAKE"] = 3] = "BRAKE";
    GameStage[GameStage["DIALOG"] = 4] = "DIALOG";
    GameStage[GameStage["STUCK"] = 5] = "STUCK";
})(GameStage = exports.GameStage || (exports.GameStage = {}));
class Hyperloop extends Game_1.Game {
    constructor() {
        super();
        this.stageStartTime = 0;
        this.stageTime = 0;
        this.trainSpeed = 1000; // px per second
        this.totalBrakeTime = 0; // calculated later; seconds train requires to brake down to standstill
        this.playerTeleportLeft = 1100; // leftest point in tunnel where player is teleported
        this.playerTeleportRight = 2970; // rightest point in tunnel where player is teleported
        this.teleportStep = 108; // distance between two tunnel lights
        this.teleportMyTrainYDistance = 50; // only teleport when player is on roughly same height as train, not in rest of level
        this.npcs = [];
        // Game progress
        this.charactersAvailable = 4;
        this.gameStage = GameStage.NONE;
        this.keyTaken = false; // key taken from corpse
        this.fuseboxOn = false;
        // Dialog
        this.dialogKeyPressed = false;
        this.currentDialogLine = 0;
        this.currentDialog = null;
        // TODO get from JSON instead
        this.dialogs = [
            new Dialog_1.Dialog(["3 What a nice day!",
                "1 Oh is it?",
            ]),
            new Dialog_1.Dialog([
                "1 What was that?",
                "2 Was that a power failure?",
            ])
        ];
    }
    // Called by GameScene
    setupScene() {
        this.getFader().fadeOut({ duration: 0.001 });
        this.spawnNPCs();
        this.setStage(GameStage.INTRO);
    }
    update(dt, time) {
        this.stageTime = time - this.stageStartTime;
        switch (this.gameStage) {
            case GameStage.INTRO:
                this.updateIntro();
                break;
            case GameStage.DRIVE:
                this.updateDrive();
                break;
            case GameStage.BRAKE:
                this.updateBrake(dt);
                break;
            case GameStage.DIALOG:
                this.updateConversation();
                break;
            case GameStage.STUCK:
                this.updateStuck();
                break;
        }
        if (this.currentDialog) {
            this.updateDialog();
        }
        super.update(dt, time);
    }
    setStage(stage) {
        if (stage !== this.gameStage) {
            this.gameStage = stage;
            this.stageStartTime = this.getTime();
            switch (this.gameStage) {
                case GameStage.INTRO:
                    this.initIntro();
                    break;
                case GameStage.DRIVE:
                    this.initDrive();
                    break;
                case GameStage.BRAKE:
                    break;
                case GameStage.DIALOG:
                    this.initConversation();
                    break;
                case GameStage.STUCK:
                    this.initStuck();
                    break;
            }
        }
    }
    spawnNPCs() {
        const train = this.getTrain();
        const chars = [new NpcNode_1.NpcNode(false), new NpcNode_1.NpcNode(true), new NpcNode_1.NpcNode(true), new NpcNode_1.NpcNode(true), new NpcNode_1.NpcNode(false)];
        const positions = [-80, -40, 24, 60, 132];
        for (let i = 0; i < chars.length; i++) {
            chars[i].moveTo(positions[i], -20).appendTo(train);
        }
        this.npcs = chars;
    }
    turnOffAllLights() {
        const lights = this.getAllLights();
        for (const light of lights) {
            light.setColor(new RGBColor_1.RGBColor(0, 0, 0));
        }
        const ambients = this.getAmbientLights();
        for (const ambient of ambients) {
            ambient.setColor(new RGBColor_1.RGBColor(0.01, 0.01, 0.01));
        }
    }
    updateDialog() {
        var _a;
        // Any key to proceed with next line
        const pressed = (_a = this.input.currentActiveIntents) !== null && _a !== void 0 ? _a : 0;
        const prevPressed = this.dialogKeyPressed;
        this.dialogKeyPressed = pressed !== 0;
        if (pressed && !prevPressed) {
            this.nextDialogLine();
        }
    }
    nextDialogLine() {
        // Shut up all characters
        this.npcs.forEach(npc => npc.say());
        this.currentDialogLine++;
        if (this.currentDialog && this.currentDialogLine >= this.currentDialog.lines.length) {
            this.currentDialog = null;
            this.currentDialogLine = 0;
        }
        else if (this.currentDialog) {
            // Show line
            const line = this.currentDialog.lines[this.currentDialogLine];
            const char = this.npcs[line.charNum];
            char.say(line.line, Infinity);
        }
    }
    startDialog(num) {
        this.currentDialog = this.dialogs[num];
        this.currentDialogLine = -1;
        this.nextDialogLine();
    }
    updateIntro() {
        // TODO have proper intro with text and/or sound to explain situation to player
        // Proceed to next stage
        if (this.stageTime > 1) {
            // Fade in
            this.getFader().fadeIn({ duration: 1 });
            this.setStage(GameStage.DRIVE);
            return;
        }
    }
    updateDrive() {
        if (!this.currentDialog) {
            this.setStage(GameStage.BRAKE);
            // Compute total break time so that train ends up in desired position
            const train = this.getTrain();
            const targetX = 1800;
            const distance = targetX - train.getScenePosition().x;
            this.totalBrakeTime = distance / (this.trainSpeed / 2);
            return;
        }
        // Driving illusion
        const train = this.getTrain();
        const offsetX = this.getTime() * this.trainSpeed;
        train.setX(450 + (offsetX % 324)); // 108px between two tunnel lights
        this.applyCamShake(1);
    }
    updateBrake(dt) {
        const progress = this.stageTime / this.totalBrakeTime;
        if (progress >= 1.1) {
            this.setStage(GameStage.DIALOG);
        }
        else if (progress < 1) {
            const speed = this.trainSpeed * (1 - progress);
            const train = this.getTrain();
            train.setX(train.getX() + speed * dt);
            const shakeIntensity = 1 - progress + Math.sin(Math.PI * progress) * 2;
            this.applyCamShake(shakeIntensity);
        }
    }
    updateConversation() {
        if (!this.currentDialog) {
            this.setStage(GameStage.STUCK);
        }
        // TODO braking sequence with extreme cam shake
    }
    updateStuck() {
        // This is the main game, with gameplay and stuff
        // Ensure player doesn't reach end of tunnel
        const player = this.getPlayer();
        const pos = player.getScenePosition();
        if (Math.abs(pos.y - this.getTrain().getScenePosition().y) < this.teleportMyTrainYDistance) {
            let move = 0;
            if (pos.x < this.playerTeleportLeft) {
                move = this.teleportStep;
            }
            else if (pos.x > this.playerTeleportRight) {
                move = -this.teleportStep;
            }
            if (move !== 0) {
                player.setX(player.getX() + move);
            }
        }
    }
    initIntro() {
        // Place player into train initially
        const player = this.getPlayer();
        const train = this.getTrain();
        player.moveTo(25, 50).appendTo(train);
        // Make him stuck
        const col = new CollisionNode_1.CollisionNode({ width: 400, height: 20 });
        col.moveTo(-20, -20).appendTo(train);
    }
    initDrive() {
        this.startDialog(0);
    }
    initConversation() {
        this.startDialog(1);
    }
    initStuck() {
        // Place player into world
        const player = this.getPlayer();
        const train = this.getTrain();
        const pos = player.getScenePosition();
        player.remove().moveTo(pos.x, pos.y).appendTo(train.getParent());
        train.hideInner();
    }
    spawnNewPlayer() {
        if (this.charactersAvailable > 0) {
            this.charactersAvailable--;
            // TODO get proper spawn position
            const oldPlayer = this.getPlayer();
            const spawnPoint = this.getTrain().getScenePosition();
            const pl = new PlayerNode_1.PlayerNode();
            pl.moveTo(spawnPoint.x, spawnPoint.y - 10);
            this.getCamera().setFollow(pl);
            const root = this.getGameScene().rootNode;
            root.appendChild(pl);
            oldPlayer.remove();
            // TODO leave remains of old player
        }
        else {
            // Game Over or sequence of new train replacing old one
        }
    }
    getPlayer() {
        return this.getGameScene().rootNode.getDescendantsByType(PlayerNode_1.PlayerNode)[0];
    }
    getTrain() {
        return this.getGameScene().rootNode.getDescendantsByType(TrainNode_1.TrainNode)[0];
    }
    getGameScene() {
        const scene = this.scenes.getScene(GameScene_1.GameScene);
        if (!scene) {
            throw new Error("GameScene not available");
        }
        return scene;
    }
    getFader() {
        return this.getCamera().fadeToBlack;
    }
    getCamera() {
        return this.getGameScene().camera;
    }
    applyCamShake(force = 1) {
        const angle = random_1.rnd(Math.PI * 2);
        const distance = Math.pow(random_1.rnd(force), 3);
        const dx = distance * Math.sin(angle), dy = distance * Math.cos(angle);
        this.getCamera().transform(m => m.setTranslation(dx, dy));
    }
    getAmbientLights(lights = this.getAllLights()) {
        return lights.filter(light => { var _a; return (_a = light.getId()) === null || _a === void 0 ? void 0 : _a.includes("ambient"); });
    }
    getAllLights() {
        return this.getGameScene().rootNode.getDescendantsByType(LightNode_1.LightNode);
    }
}
exports.Hyperloop = Hyperloop;
(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const game = new Hyperloop();
    yield game.scenes.setScene(LoadingScene_1.LoadingScene);
    window.game = game;
    game.start();
}))();


/***/ }),

/***/ "./lib/main/constants.js":
/*!*******************************!*\
  !*** ./lib/main/constants.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Layer = exports.GRAVITY = exports.STANDARD_FONT = exports.GAME_HEIGHT = exports.GAME_WIDTH = void 0;
/** Width of the game in pixels. */
exports.GAME_WIDTH = 384;
/** Height of the game in pixels. */
exports.GAME_HEIGHT = 216;
/** Fonts */
exports.STANDARD_FONT = "fonts/pixcelsior.font.json";
/** Gravity in m/s² */
exports.GRAVITY = 35;
/** Layers */
var Layer;
(function (Layer) {
    Layer[Layer["BACKGROUND"] = 0] = "BACKGROUND";
    Layer[Layer["DEFAULT"] = 1] = "DEFAULT";
    Layer[Layer["FOREGROUND"] = 2] = "FOREGROUND";
    Layer[Layer["LIGHT"] = 3] = "LIGHT";
    Layer[Layer["OVERLAY"] = 4] = "OVERLAY";
    Layer[Layer["DIALOG"] = 5] = "DIALOG";
    Layer[Layer["HUD"] = 6] = "HUD";
})(Layer = exports.Layer || (exports.Layer = {}));


/***/ }),

/***/ "./lib/main/nodes/CameraLimitNode.js":
/*!*******************************************!*\
  !*** ./lib/main/nodes/CameraLimitNode.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraLimitNode = void 0;
const Rect_1 = __webpack_require__(/*! ../../engine/geom/Rect */ "./lib/engine/geom/Rect.js");
const SceneNode_1 = __webpack_require__(/*! ../../engine/scene/SceneNode */ "./lib/engine/scene/SceneNode.js");
class CameraLimitNode extends SceneNode_1.SceneNode {
    update() {
        const scene = this.getScene();
        if (scene != null) {
            const player = scene.getNodeById("Player");
            if (player != null && player === scene.camera.getFollow()) {
                if (this.collidesWithNode(player)) {
                    scene.camera.setLimits(new Rect_1.Rect(this.x, this.y, this.width, this.height));
                }
            }
        }
    }
}
exports.CameraLimitNode = CameraLimitNode;


/***/ }),

/***/ "./lib/main/nodes/CharacterNode.js":
/*!*****************************************!*\
  !*** ./lib/main/nodes/CharacterNode.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterNode = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const Assets_1 = __webpack_require__(/*! ../../engine/assets/Assets */ "./lib/engine/assets/Assets.js");
const Sound_1 = __webpack_require__(/*! ../../engine/assets/Sound */ "./lib/engine/assets/Sound.js");
const Line2_1 = __webpack_require__(/*! ../../engine/graphics/Line2 */ "./lib/engine/graphics/Line2.js");
const Vector2_1 = __webpack_require__(/*! ../../engine/graphics/Vector2 */ "./lib/engine/graphics/Vector2.js");
const AsepriteNode_1 = __webpack_require__(/*! ../../engine/scene/AsepriteNode */ "./lib/engine/scene/AsepriteNode.js");
const cache_1 = __webpack_require__(/*! ../../engine/util/cache */ "./lib/engine/util/cache.js");
const math_1 = __webpack_require__(/*! ../../engine/util/math */ "./lib/engine/util/math.js");
const random_1 = __webpack_require__(/*! ../../engine/util/random */ "./lib/engine/util/random.js");
const CollisionNode_1 = __webpack_require__(/*! ./CollisionNode */ "./lib/main/nodes/CollisionNode.js");
const MarkNode_1 = __webpack_require__(/*! ./MarkNode */ "./lib/main/nodes/MarkNode.js");
const ParticleNode_1 = __webpack_require__(/*! ./ParticleNode */ "./lib/main/nodes/ParticleNode.js");
// TODO define in some constants file
const GRAVITY = 800;
const PROJECTILE_STEP_SIZE = 2;
class CharacterNode extends AsepriteNode_1.AsepriteNode {
    constructor(args) {
        super(args);
        this.preventNewTag = false;
        this.gameTime = 0;
        // Dynamic player state
        this.updateTime = 0;
        this.direction = 0;
        this.isOnGround = true;
        this.isJumping = false;
        this.isFalling = true;
        this.hitpoints = 100;
        this.removeOnDie = true;
        this.debug = false;
        this.canInteractWith = null;
        this.battlemode = false;
        this.battlemodeTimeout = 2000;
        this.battlemodeTimeoutTimerId = null;
        this.bulletStartPoint = null;
        this.bulletEndPoint = null;
        this.storedCollisionCoordinate = new Vector2_1.Vector2(0, 0);
        // Talking/Thinking
        this.speakSince = 0;
        this.speakUntil = 0;
        this.speakLine = "";
        this.particleOffset = new Vector2_1.Vector2(0, 0);
        this.particleAngle = 0;
        this.velocity = new Vector2_1.Vector2(0, 0);
        // this.setShowBounds(true);
        this.bloodEmitter = new ParticleNode_1.ParticleNode({
            offset: () => this.particleOffset,
            velocity: () => {
                const speed = random_1.rnd(20, 50);
                const angle = this.particleAngle + random_1.rnd(-1, 1) * random_1.rnd(0, Math.PI / 2) * Math.pow(random_1.rnd(0, 1), 2);
                return {
                    x: speed * Math.cos(angle),
                    y: speed * Math.sin(angle)
                };
            },
            color: () => `rgb(${random_1.rnd(100, 240)}, ${random_1.rnd(0, 30)}, 0)`,
            size: random_1.rnd(1, 3),
            gravity: { x: 0, y: -100 },
            lifetime: () => random_1.rnd(0.5, 1),
            alphaCurve: ParticleNode_1.valueCurves.trapeze(0.05, 0.2)
        }).appendTo(this);
        this.sparkEmitter = new ParticleNode_1.ParticleNode({
            offset: () => this.particleOffset,
            velocity: () => {
                const speed = random_1.rnd(40, 80);
                const angle = this.particleAngle + Math.PI + random_1.rnd(-1, 1) * random_1.rnd(0, Math.PI / 2) * Math.pow(random_1.rnd(0, 1), 2);
                return {
                    x: speed * Math.cos(angle),
                    y: speed * Math.sin(angle)
                };
            },
            color: () => {
                const g = random_1.rnd(130, 255), r = g + random_1.rnd(random_1.rnd(255 - g)), b = random_1.rnd(g);
                return `rgb(${r}, ${g}, ${b})`;
            },
            size: random_1.rnd(0.7, 1.8),
            gravity: { x: 0, y: -100 },
            lifetime: () => random_1.rnd(0.5, 0.9),
            alphaCurve: ParticleNode_1.valueCurves.trapeze(0.05, 0.2)
        }).appendTo(this);
    }
    update(dt, time) {
        super.update(dt, time);
        this.gameTime = time;
        this.updateTime = time;
        this.preventNewTag = this.getTag() === "die" && this.getTimesPlayed("die") === 0
            || this.getTag() === "hurt" && this.getTimesPlayed("hurt") === 0
            || this.getTag() === "attack" && this.getTimesPlayed("attack") === 0;
        // Death animation
        if (!this.isAlive()) {
            this.setTag("die");
            if (this.getTimesPlayed("die") > 0 && this.removeOnDie) {
                this.remove();
            }
            return;
        }
        // Acceleration
        let vx = 0;
        const tractionFactor = this.isOnGround ? 1 : 0.4;
        if (this.direction !== 0) {
            // Accelerate
            this.setTag("walk");
            vx = math_1.clamp(this.velocity.x + this.direction * tractionFactor * this.getAcceleration() * dt, -this.getSpeed(), this.getSpeed());
        }
        else {
            // Brake down
            this.setTag("idle");
            if (this.velocity.x > 0) {
                vx = math_1.clamp(this.velocity.x - tractionFactor * this.getDeceleration() * dt, 0, Infinity);
            }
            else {
                vx = math_1.clamp(this.velocity.x + tractionFactor * this.getDeceleration() * dt, -Infinity, 0);
            }
        }
        // Gravity
        const vy = this.velocity.y + GRAVITY * dt;
        this.velocity = new Vector2_1.Vector2(vx, vy);
        // Movement
        this.isOnGround = false;
        const x = this.getX(), y = this.getY();
        if (this.velocity.x !== 0 || this.velocity.y !== 0) {
            let newX = x + this.velocity.x * dt, newY = y + this.velocity.y * dt;
            // X collision
            if (this.getPlayerCollisionAt(newX, y)) {
                newX = x;
                this.velocity = new Vector2_1.Vector2(0, this.velocity.y);
            }
            // Y collision
            if (this.getPlayerCollisionAt(newX, newY)) {
                this.isOnGround = (this.velocity.y > 0);
                if (this.isOnGround) {
                    this.isJumping = false;
                    this.isFalling = false;
                }
                else if (!this.isJumping) {
                    this.isFalling = true;
                }
                newY = y;
                this.velocity = new Vector2_1.Vector2(this.velocity.x, 0);
            }
            // Apply
            if (newX !== x || newY !== y) {
                this.setX(newX);
                this.setY(newY);
            }
        }
        if (this.isJumping) {
            this.setTag("jump");
        }
        if (this.isFalling) {
            this.setTag("fall");
        }
        // Talking/Thinking
        if (this.speakLine && time > this.speakUntil) {
            this.speakLine = "";
            this.speakUntil = 0;
            this.speakSince = 0;
        }
    }
    setDirection(direction = 0) {
        this.direction = direction;
        if (this.direction !== 0) {
            this.setMirrorX(this.direction < 0);
        }
    }
    jump(factor = 1) {
        if (this.isOnGround && this.isAlive()) {
            this.velocity = new Vector2_1.Vector2(this.velocity.x, -this.getJumpPower() * factor);
            this.isJumping = true;
        }
    }
    shoot(angle, power, origin = new Vector2_1.Vector2(this.getScenePosition().x, this.getScenePosition().y - this.getHeight() * .5)) {
        var _a;
        this.startBattlemode();
        CharacterNode.shootSound.stop();
        CharacterNode.shootSound.play();
        const diffX = Math.cos(angle) * this.getShootingRange();
        const diffY = Math.sin(angle) * this.getShootingRange();
        const isColliding = this.getLineCollision(origin.x, origin.y, diffX, diffY, PROJECTILE_STEP_SIZE);
        if (isColliding) {
            const coord = this.storedCollisionCoordinate;
            const markNode = new MarkNode_1.MarkNode({ x: coord.x, y: coord.y });
            (_a = this.getParent()) === null || _a === void 0 ? void 0 : _a.appendChild(markNode);
            if (isColliding instanceof CharacterNode) {
                const bounds = isColliding.getSceneBounds();
                const headshot = (coord.y < bounds.minY + 0.25 * (bounds.height));
                const damage = headshot ? (2.4 * power) : power;
                isColliding.hurt(damage, this.getScenePosition());
                // Blood particles at hurt character
                isColliding.emitBlood(coord.x, coord.y, angle, headshot ? 30 : 10);
            }
            else {
                this.emitSparks(coord.x, coord.y, angle);
            }
        }
    }
    emitBlood(x, y, angle, count = 1) {
        const pos = this.getScenePosition();
        this.particleOffset = new Vector2_1.Vector2(x - pos.x, y - pos.y + 20);
        this.particleAngle = -angle;
        this.bloodEmitter.emit(count);
    }
    emitSparks(x, y, angle) {
        const pos = this.getScenePosition();
        this.particleOffset = new Vector2_1.Vector2(x - pos.x, y - pos.y + 20);
        this.particleAngle = -angle;
        this.sparkEmitter.emit(random_1.rnd(4, 10));
    }
    getLineCollision(x1, y1, dx, dy, stepSize = 5) {
        let isColliding = null;
        const nextCheckPoint = new Vector2_1.Vector2(x1, y1);
        const length = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.ceil(length / stepSize);
        const stepX = dx / steps, stepY = dy / steps;
        const enemies = this.getPersonalEnemies();
        const colliders = this.getColliders();
        for (let i = 0; i <= steps; i++) {
            isColliding = this.getPointCollision(nextCheckPoint.x, nextCheckPoint.y, enemies, colliders);
            nextCheckPoint.add({ x: stepX, y: stepY });
            if (this.debug) {
                this.bulletStartPoint = this.bulletStartPoint.add({ x: stepX, y: stepY });
                this.bulletEndPoint = this.bulletEndPoint.add({ x: stepX, y: stepY });
            }
            if (isColliding) {
                this.storedCollisionCoordinate = nextCheckPoint;
                return isColliding;
            }
        }
        return null;
    }
    draw(context) {
        super.draw(context);
        if (this.debug) {
            this.drawShootingLine(context);
        }
        // TODO put this into proper text node
        if (this.speakLine) {
            const progress = (this.gameTime - this.speakSince);
            const line = this.speakLine.substr(0, Math.ceil(28 * progress));
            context.save();
            context.fillStyle = "white";
            context.textAlign = "center";
            context.fillText(line, 0, -15);
            context.restore();
        }
    }
    drawShootingLine(context) {
        // Draw shot line
        if (this.bulletStartPoint && this.bulletEndPoint) {
            context.save();
            const line = new Line2_1.Line2(this.bulletStartPoint, this.bulletEndPoint);
            context.save();
            context.beginPath();
            line.draw(context);
            context.strokeStyle = "#ffffff";
            context.stroke();
            context.closePath();
            context.restore();
            context.restore();
        }
    }
    /**
     * Deal damage to the character.
     *
     * @param damage - Damage dealt, number > 0
     * @return True if hurt character dies, false otherwise.
     */
    hurt(damage, origin) {
        if (!this.isAlive()) {
            return false;
        }
        // TODO reduce hit points or kill or something
        // Pushback
        const direction = origin.x > this.getX() ? -1 : 1;
        const pushForce = damage * 5;
        this.velocity = new Vector2_1.Vector2(pushForce * direction, this.velocity.y - pushForce * 0.1);
        // Damage
        this.hitpoints -= damage;
        if (this.hitpoints <= 0) {
            this.die();
            return true;
        }
        else {
            this.setTag("hurt");
            this.startBattlemode();
        }
        return false;
    }
    say(line = "", duration = 0) {
        this.speakSince = this.gameTime;
        this.speakUntil = this.gameTime + duration;
        this.speakLine = line;
    }
    setTag(tag) {
        var _a, _b;
        if (!this.preventNewTag) {
            super.setTag(tag);
            (_a = this.playerLeg) === null || _a === void 0 ? void 0 : _a.setTag(tag);
            (_b = this.playerArm) === null || _b === void 0 ? void 0 : _b.setTag(tag);
        }
        return this;
    }
    die() {
        this.endBattlemode();
        this.setTag("die");
        this.hitpoints = 0;
    }
    isAlive() {
        return this.hitpoints > 0;
    }
    isInBattlemode() {
        return this.battlemode;
    }
    startBattlemode() {
        this.battlemode = true;
        // refresh timer
        this.clearBattlemodeTimer();
        this.battlemodeTimeoutTimerId = setTimeout(() => {
            this.endBattlemode();
        }, this.battlemodeTimeout);
    }
    endBattlemode() {
        if (!this.battlemode) {
            return;
        }
        this.clearBattlemodeTimer();
        this.battlemode = false;
    }
    clearBattlemodeTimer() {
        if (this.battlemodeTimeoutTimerId) {
            clearInterval(this.battlemodeTimeoutTimerId);
            this.battlemodeTimeoutTimerId = null;
        }
    }
    getPlayerCollisionAt(x = this.getX(), y = this.getY()) {
        // Level collision
        const colliders = this.getColliders();
        const bounds = this.getSceneBounds();
        const w = bounds.width, h = bounds.height;
        const px = bounds.minX + x - this.getX(), py = bounds.minY + y - this.getY();
        return colliders.some(c => c.collidesWithRectangle(px, py, w, h));
    }
    getPointCollision(x, y, enemies = this.getPersonalEnemies(), colliders = this.getColliders()) {
        // Enemies
        for (const c of enemies) {
            if (c.containsPoint(x, y)) {
                return c;
            }
        }
        // Level
        for (const c of colliders) {
            if (c.containsPoint(x, y)) {
                return c;
            }
        }
        return null;
    }
    getColliders() {
        var _a, _b;
        const colliders = (_b = (_a = this.getScene()) === null || _a === void 0 ? void 0 : _a.rootNode.getDescendantsByType(CollisionNode_1.CollisionNode)) !== null && _b !== void 0 ? _b : [];
        return colliders;
    }
    getClosestPersonalEnemy() {
        const enemies = this.getPersonalEnemies();
        const selfPos = this.getScenePosition();
        let bestDis = Infinity, closest = null;
        for (const e of enemies) {
            const dis2 = e.getScenePosition().getSquareDistance(selfPos);
            if (dis2 < bestDis) {
                bestDis = dis2;
                closest = e;
            }
        }
        return closest;
    }
    getHeadPosition() {
        const p = this.getScenePosition();
        const h = this.height;
        return new Vector2_1.Vector2(p.x, p.y - h * 0.8);
    }
    containsPoint(x, y) {
        const { minX, minY, maxX, maxY } = this.getSceneBounds();
        return x >= minX && x <= maxX && y >= minY && y <= maxY;
    }
    registerInteractiveNode(node) {
        this.canInteractWith = node;
    }
    unregisterInteractiveNode(node) {
        if (this.canInteractWith === node) {
            this.canInteractWith = null;
        }
    }
    getNodeToInteractWith() {
        return this.canInteractWith;
    }
}
tslib_1.__decorate([
    cache_1.cacheResult,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Array)
], CharacterNode.prototype, "getColliders", null);
tslib_1.__decorate([
    Assets_1.asset("sounds/fx/gunshot.ogg"),
    tslib_1.__metadata("design:type", Sound_1.Sound)
], CharacterNode, "shootSound", void 0);
exports.CharacterNode = CharacterNode;


/***/ }),

/***/ "./lib/main/nodes/CollisionNode.js":
/*!*****************************************!*\
  !*** ./lib/main/nodes/CollisionNode.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CollisionNode = void 0;
const Direction_1 = __webpack_require__(/*! ../../engine/geom/Direction */ "./lib/engine/geom/Direction.js");
const Bounds2_1 = __webpack_require__(/*! ../../engine/graphics/Bounds2 */ "./lib/engine/graphics/Bounds2.js");
const SceneNode_1 = __webpack_require__(/*! ../../engine/scene/SceneNode */ "./lib/engine/scene/SceneNode.js");
class CollisionNode extends SceneNode_1.SceneNode {
    constructor(args) {
        super(Object.assign({ anchor: Direction_1.Direction.TOP_LEFT }, args));
        this.store = "";
        // this.setShowBounds(true);
    }
    collidesWithRectangle(x1, y1 = 0, w = 0, h = 0) {
        const bounds = this.getBounds();
        const minX = bounds.minX + this.getX(), minY = bounds.minY + this.getY(), maxX = bounds.maxX + this.getX(), maxY = bounds.maxY + this.getY();
        if (x1 instanceof Bounds2_1.Bounds2) {
            y1 = x1.minY;
            w = x1.width;
            h = x1.height;
            x1 = x1.minX;
        }
        return minX <= x1 + w && maxX >= x1 && minY <= y1 + h && maxY >= y1;
    }
    containsPoint(x, y) {
        const bounds = this.getBounds();
        const minX = bounds.minX + this.getX(), minY = bounds.minY + this.getY(), maxX = bounds.maxX + this.getX(), maxY = bounds.maxY + this.getY();
        return x >= minX && x <= maxX && y >= minY && y <= maxY;
    }
}
exports.CollisionNode = CollisionNode;


/***/ }),

/***/ "./lib/main/nodes/CorpseNode.js":
/*!**************************************!*\
  !*** ./lib/main/nodes/CorpseNode.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CorpseNode = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const Aseprite_1 = __webpack_require__(/*! ../../engine/assets/Aseprite */ "./lib/engine/assets/Aseprite.js");
const Direction_1 = __webpack_require__(/*! ../../engine/geom/Direction */ "./lib/engine/geom/Direction.js");
const InteractiveNode_1 = __webpack_require__(/*! ./InteractiveNode */ "./lib/main/nodes/InteractiveNode.js");
const Assets_1 = __webpack_require__(/*! ../../engine/assets/Assets */ "./lib/engine/assets/Assets.js");
class CorpseNode extends InteractiveNode_1.InteractiveNode {
    constructor(args) {
        super(Object.assign({ aseprite: CorpseNode.sprite, anchor: Direction_1.Direction.BOTTOM, tag: "off" }, args), "PRESS E TO SEARCH CORPSE");
        this.keyTaken = false;
    }
    interact() {
        if (this.canInteract()) {
            // TODO play some neat key take sound
            this.keyTaken = true;
            this.getGame().keyTaken = true;
            console.log("Key taken");
            setTimeout(() => {
                this.getGame().turnOffAllLights();
            }, 2000);
        }
    }
    canInteract() {
        return !this.keyTaken;
    }
}
tslib_1.__decorate([
    Assets_1.asset("sprites/corpse.aseprite.json"),
    tslib_1.__metadata("design:type", Aseprite_1.Aseprite)
], CorpseNode, "sprite", void 0);
exports.CorpseNode = CorpseNode;


/***/ }),

/***/ "./lib/main/nodes/DoorNode.js":
/*!************************************!*\
  !*** ./lib/main/nodes/DoorNode.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DoorNode = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const Aseprite_1 = __webpack_require__(/*! ../../engine/assets/Aseprite */ "./lib/engine/assets/Aseprite.js");
const DoorHandler_1 = __webpack_require__(/*! ../DoorHandler */ "./lib/main/DoorHandler.js");
const InteractiveNode_1 = __webpack_require__(/*! ./InteractiveNode */ "./lib/main/nodes/InteractiveNode.js");
const Sound_1 = __webpack_require__(/*! ../../engine/assets/Sound */ "./lib/engine/assets/Sound.js");
const Assets_1 = __webpack_require__(/*! ../../engine/assets/Assets */ "./lib/engine/assets/Assets.js");
class DoorNode extends InteractiveNode_1.InteractiveNode {
    constructor(args) {
        var _a, _b, _c, _d, _e;
        super(Object.assign({ aseprite: DoorNode.sprite }, args), "PRESS E TO ENTER");
        this.isLocked = false;
        this.gameTime = 0;
        this.targetId = "";
        this.name = "";
        this.targetId = (_c = (_b = (_a = args === null || args === void 0 ? void 0 : args.tiledObject) === null || _a === void 0 ? void 0 : _a.getOptionalProperty("target", "string")) === null || _b === void 0 ? void 0 : _b.getValue()) !== null && _c !== void 0 ? _c : "";
        this.name = (_e = (_d = args === null || args === void 0 ? void 0 : args.tiledObject) === null || _d === void 0 ? void 0 : _d.getName()) !== null && _e !== void 0 ? _e : "";
        this.hideSprite = true;
    }
    interact() {
        if (this.canInteract()) {
            const player = this.getPlayer();
            if (player) {
                const target = this.getTargetNode();
                if (target) {
                    DoorHandler_1.DoorHandler.getInstance().transportToDoor(player, target, this.gameTime);
                    DoorNode.doorSound.stop();
                    DoorNode.doorSound.play();
                }
            }
        }
    }
    update(dt, time) {
        super.update(dt, time);
        this.gameTime = time;
    }
    canInteract() {
        return DoorHandler_1.DoorHandler.getInstance().isReady(this.gameTime) && !this.isLocked;
    }
    setLocked(locked) {
        this.isLocked = locked;
        return this;
    }
    getLocked() {
        return this.isLocked;
    }
    getTargetNode() {
        var _a, _b;
        const target = (_b = (_a = this.getScene()) === null || _a === void 0 ? void 0 : _a.rootNode.getDescendantsByType(DoorNode).filter(door => door.name === this.targetId)[0]) !== null && _b !== void 0 ? _b : null;
        return target;
    }
}
tslib_1.__decorate([
    Assets_1.asset("sounds/fx/metalDoor.mp3"),
    tslib_1.__metadata("design:type", Sound_1.Sound)
], DoorNode, "doorSound", void 0);
tslib_1.__decorate([
    Assets_1.asset("sprites/rat.aseprite.json"),
    tslib_1.__metadata("design:type", Aseprite_1.Aseprite)
], DoorNode, "sprite", void 0);
exports.DoorNode = DoorNode;


/***/ }),

/***/ "./lib/main/nodes/EnemyNode.js":
/*!*************************************!*\
  !*** ./lib/main/nodes/EnemyNode.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.EnemyNode = exports.AiState = void 0;
const Vector2_1 = __webpack_require__(/*! ../../engine/graphics/Vector2 */ "./lib/engine/graphics/Vector2.js");
const random_1 = __webpack_require__(/*! ../../engine/util/random */ "./lib/engine/util/random.js");
const time_1 = __webpack_require__(/*! ../../engine/util/time */ "./lib/engine/util/time.js");
const CharacterNode_1 = __webpack_require__(/*! ./CharacterNode */ "./lib/main/nodes/CharacterNode.js");
const PlayerNode_1 = __webpack_require__(/*! ./PlayerNode */ "./lib/main/nodes/PlayerNode.js");
var AiState;
(function (AiState) {
    AiState[AiState["BORED"] = 0] = "BORED";
    AiState[AiState["FOLLOW"] = 1] = "FOLLOW";
    AiState[AiState["ATTACK"] = 2] = "ATTACK";
    AiState[AiState["ALERT"] = 3] = "ALERT";
    AiState[AiState["MOVE_AROUND"] = 4] = "MOVE_AROUND";
})(AiState = exports.AiState || (exports.AiState = {}));
class EnemyNode extends CharacterNode_1.CharacterNode {
    constructor() {
        super(...arguments);
        // Character settings
        this.shootingRange = 150;
        this.speed = 100;
        this.acceleration = 600;
        this.deceleration = 900;
        this.jumpPower = 380;
        /** How far enemy can see player while idling */
        this.squaredViewDistance = Math.pow(120, 2);
        /** How far enemy can hear player while idling */
        this.squaredHearDistance = Math.pow(200, 2);
        /** If a shot was fired within the hearDuration from now, the enemy shall start chasing */
        this.hearDuration = 500;
        /** How far enemy can see player while chasing him */
        this.squaredAlertViewDistance = Math.pow(160, 2);
        /** Distance to target position where enemy stops moving further */
        this.squaredPositionThreshold = Math.pow(20, 2);
        /** Distance to player required for a successful melee attack */
        this.squaredAttackDistance = Math.pow(20, 2);
        /** ms it takes for enemy to attack player */
        this.attackDelay = 0.3;
        this.alertedBy = "VIEW";
        this.timeOfAlert = 0;
        this.stopFollowBySoundDelay = 2000;
        this.state = AiState.BORED;
        this.lastStateChange = 0;
        // look direction change delays in seconds
        this.LOW_ALERT_CHANGE_DELAY = 3;
        this.HIGH_ALERT_CHANGE_DELAY = 0.5;
        this.lastLookDirectionChange = 0;
        this.minAlertDuration = 10;
        this.squaredMoveAroundDistance = Math.pow(10, 2);
        /**
         * set to false, if after chase an enemy should transfer to ALERT,
         * set to true - for MOVE_AROUND
         */
        this.moveAroundAfterChase = false;
        this.moveAroundAnchor = new Vector2_1.Vector2(0, 0);
        this.stopAndWaitTs = 0;
        this.stopAndWaitDelaySec = 2;
        this.moveTs = 0;
        this.moveDelaySec = 0.2;
    }
    getShootingRange() {
        return this.shootingRange;
    }
    getSpeed() {
        return this.speed;
    }
    getAcceleration() {
        return this.acceleration;
    }
    getDeceleration() {
        return this.deceleration;
    }
    getJumpPower() {
        return this.jumpPower;
    }
    update(dt, time) {
        super.update(dt, time);
        this.updateAi(dt, time);
    }
    // default ai implementation
    updateAi(dt, time) {
        if (!this.isAlive()) {
            this.setDirection(0);
            return;
        }
        // AI
        switch (this.state) {
            case AiState.BORED:
            case AiState.ALERT:
                this.updateSearch(time);
                break;
            case AiState.FOLLOW:
                this.updateFollow(time);
                break;
            case AiState.ATTACK:
                this.updateAttack(time);
                break;
            case AiState.MOVE_AROUND:
                this.updateMoveAround(time);
                break;
        }
        // Move to target
        if (this.getPosition().getSquareDistance(this.targetPosition) > this.squaredPositionThreshold) {
            if (this.getX() > this.targetPosition.x) {
                this.setDirection(-1);
            }
            else {
                this.setDirection(1);
            }
        }
        else {
            this.setDirection(0);
        }
    }
    getPlayer() {
        var _a;
        const player = (_a = this.getScene()) === null || _a === void 0 ? void 0 : _a.rootNode.getDescendantsByType(PlayerNode_1.PlayerNode)[0];
        return (player === null || player === void 0 ? void 0 : player.isAlive()) ? player : undefined;
    }
    scream() {
        // implementation is in the monster nodes
    }
    updateSearch(time) {
        // Check distance to player
        const player = this.getPlayer();
        if (player) {
            if (this.canSeeOrHearPlayer(player)) {
                // Player spotted!
                this.setState(AiState.FOLLOW);
                this.targetPosition = player.getPosition();
                this.scream();
                return;
            }
        }
        if (this.state === AiState.ALERT || this.state === AiState.BORED) {
            // randomly change looking direction
            const lookDirectionChangeDelay = this.state === AiState.ALERT ? this.HIGH_ALERT_CHANGE_DELAY : this.LOW_ALERT_CHANGE_DELAY;
            const chance = this.state === AiState.ALERT ? 20 : 5;
            if (random_1.rnd(1, 100) < chance && this.lastLookDirectionChange + lookDirectionChangeDelay < time) {
                this.setMirrorX(!this.isMirrorX());
                this.lastLookDirectionChange = time;
            }
        }
        // check if it is time to be bored or alerted
        if (this.state !== AiState.BORED
            && random_1.rnd(1, 100) < 5 && this.lastStateChange + this.minAlertDuration < time) {
            // first transfer to alert and from alert to bored state
            const newState = this.state === AiState.ALERT ? AiState.BORED : AiState.ALERT;
            this.setState(newState);
            this.setDirection(0);
        }
    }
    updateFollow(time) {
        const player = this.getPlayer();
        // Update target position if seeing player
        if (player) {
            // Update target if in sight
            const squaredDistance = player.getPosition().getSquareDistance(this.getPosition());
            if ((this.alertedBy === "SOUND" && time_1.now() - this.timeOfAlert < this.stopFollowBySoundDelay)
                || squaredDistance < this.squaredAlertViewDistance) {
                // Player spotted!
                this.setState(AiState.FOLLOW);
                this.targetPosition = player.getPosition();
                // Hurt player
                if (squaredDistance < this.squaredAttackDistance) {
                    this.tryToAttack();
                }
            }
            else {
                // Player too far away
                if (this.moveAroundAfterChase) {
                    // move around a bit before transferring to ALERT
                    this.setState(AiState.MOVE_AROUND);
                    //this.setDirection(this.direction * -1);
                    this.moveAroundAnchor.setVector(this.targetPosition);
                }
                else {
                    // stay ALERT, and look around actively
                    this.setState(AiState.ALERT);
                    this.setDirection(0);
                }
            }
        }
    }
    updateAttack(time) {
        if (time > this.lastStateChange + this.attackDelay) {
            // Hurt player
            const player = this.getPlayer();
            const playerDied = player === null || player === void 0 ? void 0 : player.hurt(0, this.getScenePosition());
            this.scream();
            if (playerDied) {
                this.setState(AiState.BORED);
                this.setDirection(0);
                return;
            }
            // Return to follow state
            this.setState(AiState.FOLLOW);
        }
    }
    setState(state, time = this.updateTime) {
        if (this.state !== state) {
            this.state = state;
            this.lastStateChange = time;
        }
        if (this.getTag() === "hurt" || this.getTag() === "die") {
            return;
        }
        switch (state) {
            case AiState.ALERT:
            case AiState.BORED:
                this.setTag("idle");
                break;
            case AiState.ATTACK:
                this.setTag("attack");
                break;
            case AiState.FOLLOW:
            case AiState.MOVE_AROUND:
                this.setTag("walk");
                break;
        }
    }
    tryToAttack() {
        this.setState(AiState.ATTACK);
        return true;
    }
    hurt(damage, origin) {
        if (!super.hurt(damage, origin)) {
            this.setTag("hurt");
            const pl = this.getPlayer();
            if (pl) {
                this.targetPosition = pl.getScenePosition();
                this.setState(AiState.FOLLOW);
            }
            return false;
        }
        this.setTag("die");
        return true;
    }
    updateMoveAround(time) {
        if (this.getPosition().getSquareDistance(this.moveAroundAnchor) > this.squaredMoveAroundDistance) {
            if (this.stopAndWaitTs === 0) {
                if (this.moveTs + this.moveDelaySec < time) {
                    this.setDirection(0);
                    this.stopAndWaitTs = time;
                }
            }
            else if (this.stopAndWaitTs + this.stopAndWaitDelaySec < time) {
                if (this.getX() > this.moveAroundAnchor.x) {
                    this.setDirection(-1);
                }
                else {
                    this.setDirection(1);
                }
                this.stopAndWaitTs = 0;
                this.moveTs = time;
            }
        }
        this.updateSearch(time);
    }
    getPersonalEnemies() {
        var _a, _b;
        const enemies = (_b = (_a = this.getScene()) === null || _a === void 0 ? void 0 : _a.rootNode.getDescendantsByType(PlayerNode_1.PlayerNode)) !== null && _b !== void 0 ? _b : [];
        return enemies;
    }
    isLookingInPlayerDirection(player = this.getPlayer()) {
        return player != null && ((this.getX() > player.getPosition().x) === this.isMirrorX());
    }
    canSeeOrHearPlayer(player = this.getPlayer()) {
        if (!player) {
            return false;
        }
        const squaredDistance = player.getPosition().getSquareDistance(this.getPosition());
        const origin = this.getHeadPosition(), target = player.getHeadPosition();
        const couldHearPlayer = (time_1.now() - player.getLastShotTime()) < this.hearDuration && squaredDistance < this.squaredHearDistance;
        const couldViewPlayer = this.isLookingInPlayerDirection(player) && squaredDistance < this.squaredViewDistance;
        const isColliding = this.getLineCollision(origin.x, origin.y, target.x - origin.x, target.y - origin.y) === player;
        if (isColliding) {
            this.alertedBy = couldHearPlayer ? "SOUND" : "VIEW";
            this.timeOfAlert = time_1.now();
        }
        return (couldViewPlayer || couldHearPlayer) && isColliding;
    }
}
exports.EnemyNode = EnemyNode;


/***/ }),

/***/ "./lib/main/nodes/FuseboxNode.js":
/*!***************************************!*\
  !*** ./lib/main/nodes/FuseboxNode.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.FuseboxNode = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const Aseprite_1 = __webpack_require__(/*! ../../engine/assets/Aseprite */ "./lib/engine/assets/Aseprite.js");
const Direction_1 = __webpack_require__(/*! ../../engine/geom/Direction */ "./lib/engine/geom/Direction.js");
const InteractiveNode_1 = __webpack_require__(/*! ./InteractiveNode */ "./lib/main/nodes/InteractiveNode.js");
const Sound_1 = __webpack_require__(/*! ../../engine/assets/Sound */ "./lib/engine/assets/Sound.js");
const Assets_1 = __webpack_require__(/*! ../../engine/assets/Assets */ "./lib/engine/assets/Assets.js");
class FuseboxNode extends InteractiveNode_1.InteractiveNode {
    constructor(args) {
        super(Object.assign({ aseprite: FuseboxNode.sprite, anchor: Direction_1.Direction.BOTTOM, tag: "closed" }, args), "PRESS E TO USE KEY");
        this.isOpen = false;
        this.isOn = false;
    }
    interact() {
        if (this.canInteract()) {
            if (!this.isOpen) {
                this.isOpen = true;
                this.setTag("open-off");
                this.caption = "PRESS E TO TURN ON";
                FuseboxNode.doorSound.play();
            }
            else {
                this.isOn = true;
                this.setTag("open-on");
                this.getGame().fuseboxOn = true;
                FuseboxNode.doorSound.stop();
                FuseboxNode.leverSound.play();
            }
        }
    }
    canInteract() {
        return this.isOpen && !this.isOn || !this.isOpen && this.getGame().keyTaken;
    }
}
tslib_1.__decorate([
    Assets_1.asset("sprites/fuse.aseprite.json"),
    tslib_1.__metadata("design:type", Aseprite_1.Aseprite)
], FuseboxNode, "sprite", void 0);
tslib_1.__decorate([
    Assets_1.asset("sounds/fx/electricLever.ogg"),
    tslib_1.__metadata("design:type", Sound_1.Sound)
], FuseboxNode, "leverSound", void 0);
tslib_1.__decorate([
    Assets_1.asset("sounds/fx/metalDoorOpen.ogg"),
    tslib_1.__metadata("design:type", Sound_1.Sound)
], FuseboxNode, "doorSound", void 0);
exports.FuseboxNode = FuseboxNode;


/***/ }),

/***/ "./lib/main/nodes/InteractiveNode.js":
/*!*******************************************!*\
  !*** ./lib/main/nodes/InteractiveNode.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractiveNode = void 0;
const AsepriteNode_1 = __webpack_require__(/*! ../../engine/scene/AsepriteNode */ "./lib/engine/scene/AsepriteNode.js");
const math_1 = __webpack_require__(/*! ../../engine/util/math */ "./lib/engine/util/math.js");
const PlayerNode_1 = __webpack_require__(/*! ./PlayerNode */ "./lib/main/nodes/PlayerNode.js");
class InteractiveNode extends AsepriteNode_1.AsepriteNode {
    constructor(args, caption = "") {
        super(args);
        this.target = null;
        this.captionOpacity = 0;
        this.hideSprite = false;
        this.caption = caption;
    }
    getRange() {
        return 50;
    }
    update(dt, time) {
        let target = null;
        if (this.canInteract()) {
            const player = this.getPlayer();
            if (player) {
                const dis = player.getScenePosition().getSquareDistance(this.getScenePosition());
                if (dis < Math.pow(this.getRange(), 2)) {
                    target = player;
                }
            }
        }
        this.setTarget(target);
        if (this.target) {
            this.captionOpacity = math_1.clamp(this.captionOpacity + dt * 2, 0, 1);
        }
        else {
            this.captionOpacity = math_1.clamp(this.captionOpacity - dt * 2, 0, 1);
        }
    }
    canInteract() {
        return true;
    }
    setTarget(target) {
        if (target !== this.target) {
            if (this.target) {
                this.target.unregisterInteractiveNode(this);
            }
            this.target = target;
            if (this.target) {
                this.target.registerInteractiveNode(this);
            }
        }
    }
    getTarget() {
        return this.target;
    }
    getPlayer() {
        var _a;
        return (_a = this.getScene()) === null || _a === void 0 ? void 0 : _a.rootNode.getDescendantsByType(PlayerNode_1.PlayerNode)[0];
    }
    draw(context) {
        if (!this.hideSprite) {
            super.draw(context);
        }
        // Draw Caption
        if (this.caption !== "" && this.captionOpacity > 0) {
            context.save();
            context.font = "8px Arial";
            context.textAlign = "center";
            context.fillStyle = "black";
            context.strokeStyle = "white";
            context.globalAlpha *= this.captionOpacity;
            const offY = -12;
            context.strokeText(this.caption, 0, offY);
            context.fillText(this.caption, 0, offY);
            context.restore();
        }
    }
}
exports.InteractiveNode = InteractiveNode;


/***/ }),

/***/ "./lib/main/nodes/LightNode.js":
/*!*************************************!*\
  !*** ./lib/main/nodes/LightNode.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.LightNode = exports.intensifyColor = void 0;
const RGBColor_1 = __webpack_require__(/*! ../../engine/color/RGBColor */ "./lib/engine/color/RGBColor.js");
const Direction_1 = __webpack_require__(/*! ../../engine/geom/Direction */ "./lib/engine/geom/Direction.js");
const Vector2_1 = __webpack_require__(/*! ../../engine/graphics/Vector2 */ "./lib/engine/graphics/Vector2.js");
const SceneNode_1 = __webpack_require__(/*! ../../engine/scene/SceneNode */ "./lib/engine/scene/SceneNode.js");
const graphics_1 = __webpack_require__(/*! ../../engine/util/graphics */ "./lib/engine/util/graphics.js");
const math_1 = __webpack_require__(/*! ../../engine/util/math */ "./lib/engine/util/math.js");
function intensifyColor(color, f) {
    let r = f * color.getRed(), g = f * color.getGreen(), b = f * color.getBlue();
    if (r > 1) {
        g += (r - 1) / 2;
        b += (r - 1) / 2;
        r = 1;
    }
    if (g > 1) {
        r += (g - 1) / 2;
        b += (b - 1) / 2;
        g = 1;
    }
    if (b > 1) {
        r += (b - 1) / 2;
        g += (b - 1) / 2;
        b = 1;
    }
    return new RGBColor_1.RGBColor(r, g, b);
}
exports.intensifyColor = intensifyColor;
class LightNode extends SceneNode_1.SceneNode {
    constructor(args) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        super(Object.assign({ anchor: Direction_1.Direction.TOP_LEFT }, args));
        this.gradient = null;
        this.color = (_c = (_b = (_a = args === null || args === void 0 ? void 0 : args.tiledObject) === null || _a === void 0 ? void 0 : _a.getOptionalProperty("color", "color")) === null || _b === void 0 ? void 0 : _b.getValue()) !== null && _c !== void 0 ? _c : new RGBColor_1.RGBColor(1, 1, 1);
        this.polygon = (_e = (_d = args === null || args === void 0 ? void 0 : args.tiledObject) === null || _d === void 0 ? void 0 : _d.getPolygon()) !== null && _e !== void 0 ? _e : null;
        this.intensity = (_h = (_g = (_f = args === null || args === void 0 ? void 0 : args.tiledObject) === null || _f === void 0 ? void 0 : _f.getOptionalProperty("intensity", "int")) === null || _g === void 0 ? void 0 : _g.getValue()) !== null && _h !== void 0 ? _h : 100;
        this.spin = (_l = (_k = (_j = args === null || args === void 0 ? void 0 : args.tiledObject) === null || _j === void 0 ? void 0 : _j.getOptionalProperty("spin", "float")) === null || _k === void 0 ? void 0 : _k.getValue()) !== null && _l !== void 0 ? _l : 0;
        this.updateGradient();
    }
    updateGradient() {
        var _a, _b;
        if (this.polygon === null && this.width !== 0 && this.height !== 0) {
            this.gradient = null;
        }
        else {
            const colors = [];
            const color = this.color.toRGB();
            const steps = 16;
            const overshoot = 0.5;
            for (let step = 0; step < steps; step++) {
                const p = (1 + overshoot) * Math.pow((1 - step / steps), 8);
                const col = intensifyColor(color, p);
                colors.push(col);
            }
            colors.push(new RGBColor_1.RGBColor(0, 0, 0));
            const canvas = graphics_1.createCanvas(8, 8);
            const ctx = graphics_1.getRenderingContext(canvas, "2d");
            const origin = (_b = (_a = this.polygon) === null || _a === void 0 ? void 0 : _a.vertices[0]) !== null && _b !== void 0 ? _b : new Vector2_1.Vector2(0, 0);
            const intensity = this.polygon == null ? this.intensity / 2 : this.intensity;
            this.gradient = ctx.createRadialGradient(origin.x, origin.y, 0, origin.x, origin.y, intensity);
            for (let i = 0, count = colors.length - 1; i <= count; i++) {
                this.gradient.addColorStop(i / count, colors[i].toString());
            }
        }
    }
    setColor(color) {
        if (this.color !== color) {
            this.color = color;
            this.updateGradient();
            this.invalidate(SceneNode_1.SceneNodeAspect.RENDERING);
        }
        return this;
    }
    updateBoundsPolygon(bounds) {
        if (this.polygon != null) {
            for (const vertex of this.polygon.vertices) {
                bounds.addVertex(vertex);
            }
        }
        else {
            super.updateBoundsPolygon(bounds);
        }
    }
    update(dt) {
        if (this.spin !== 0) {
            this.transform(m => {
                var _a;
                const v = (_a = this.polygon) === null || _a === void 0 ? void 0 : _a.vertices[0];
                if (v) {
                    m.translate(v.x, v.y);
                }
                m.rotate(math_1.radians(this.spin) * dt);
                if (v) {
                    m.translate(-v.x, -v.y);
                }
            });
        }
    }
    draw(ctx) {
        var _a;
        ctx.save();
        ctx.beginPath();
        const intensity = this.intensity;
        const width = this.getWidth();
        const height = this.getHeight();
        ctx.fillStyle = (_a = this.gradient) !== null && _a !== void 0 ? _a : this.color.toString();
        if (this.polygon != null) {
            this.polygon.draw(ctx);
        }
        else if (width === 0 && height === 0) {
            const halfIntensity = intensity / 2;
            ctx.ellipse(0, 0, halfIntensity, halfIntensity, 0, 0, Math.PI * 2, true);
        }
        else {
            ctx.rect(0, 0, width, height);
        }
        ctx.fill();
        ctx.restore();
    }
}
exports.LightNode = LightNode;


/***/ }),

/***/ "./lib/main/nodes/MarkNode.js":
/*!************************************!*\
  !*** ./lib/main/nodes/MarkNode.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkNode = void 0;
const SceneNode_1 = __webpack_require__(/*! ../../engine/scene/SceneNode */ "./lib/engine/scene/SceneNode.js");
const constants_1 = __webpack_require__(/*! ../constants */ "./lib/main/constants.js");
class MarkNode extends SceneNode_1.SceneNode {
    constructor(args) {
        super(Object.assign({ width: 1, height: 1, layer: constants_1.Layer.OVERLAY }, args));
        this.startTime = 0;
        this.killTime = 0;
    }
    update(dt, time) {
        if (this.startTime === 0) {
            this.startTime = time;
            this.killTime = this.startTime + 5;
        }
        else if (time > this.killTime) {
            super.remove();
        }
    }
    draw(context) {
        context.strokeStyle = "green";
        context.beginPath();
        context.moveTo(0, 3);
        context.arc(0, 0, 3, 0, 6.28);
        context.closePath();
        context.stroke();
    }
}
exports.MarkNode = MarkNode;


/***/ }),

/***/ "./lib/main/nodes/MonsterNode.js":
/*!***************************************!*\
  !*** ./lib/main/nodes/MonsterNode.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.MonsterNode = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const EnemyNode_1 = __webpack_require__(/*! ./EnemyNode */ "./lib/main/nodes/EnemyNode.js");
const Aseprite_1 = __webpack_require__(/*! ../../engine/assets/Aseprite */ "./lib/engine/assets/Aseprite.js");
const Direction_1 = __webpack_require__(/*! ../../engine/geom/Direction */ "./lib/engine/geom/Direction.js");
const Sound_1 = __webpack_require__(/*! ../../engine/assets/Sound */ "./lib/engine/assets/Sound.js");
const Assets_1 = __webpack_require__(/*! ../../engine/assets/Assets */ "./lib/engine/assets/Assets.js");
const random_1 = __webpack_require__(/*! ../../engine/util/random */ "./lib/engine/util/random.js");
const Rect_1 = __webpack_require__(/*! ../../engine/geom/Rect */ "./lib/engine/geom/Rect.js");
class MonsterNode extends EnemyNode_1.EnemyNode {
    constructor(args) {
        super(Object.assign({ aseprite: MonsterNode.sprite, anchor: Direction_1.Direction.BOTTOM, tag: "idle", sourceBounds: new Rect_1.Rect(8, 6, 16, 34) }, args));
        this.targetPosition = this.getPosition();
        this.moveAroundAfterChase = true;
        this.hitpoints = random_1.rnd(65, 120) + random_1.rnd(random_1.rnd(100));
    }
    hurt(damage, origin) {
        MonsterNode.monsterSoundDamage.play();
        return super.hurt(damage, origin);
    }
    staySilent() {
        if (this.isScreaming()) {
            MonsterNode.monsterSoundAttack.stop();
        }
    }
    isScreaming() {
        return MonsterNode.monsterSoundAttack.isPlaying();
    }
    scream() {
        if (!this.isScreaming()) {
            this.staySilent();
            MonsterNode.monsterSoundAttack.play();
        }
    }
}
tslib_1.__decorate([
    Assets_1.asset("sprites/monster.aseprite.json"),
    tslib_1.__metadata("design:type", Aseprite_1.Aseprite)
], MonsterNode, "sprite", void 0);
tslib_1.__decorate([
    Assets_1.asset("sounds/fx/zombieScream.mp3"),
    tslib_1.__metadata("design:type", Sound_1.Sound)
], MonsterNode, "monsterSoundAttack", void 0);
tslib_1.__decorate([
    Assets_1.asset("sounds/fx/drip.mp3"),
    tslib_1.__metadata("design:type", Sound_1.Sound)
], MonsterNode, "monsterSoundDamage", void 0);
exports.MonsterNode = MonsterNode;


/***/ }),

/***/ "./lib/main/nodes/MuzzleFlashNode.js":
/*!*******************************************!*\
  !*** ./lib/main/nodes/MuzzleFlashNode.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.MuzzleFlashNode = void 0;
const RGBColor_1 = __webpack_require__(/*! ../../engine/color/RGBColor */ "./lib/engine/color/RGBColor.js");
const Direction_1 = __webpack_require__(/*! ../../engine/geom/Direction */ "./lib/engine/geom/Direction.js");
const Vector2_1 = __webpack_require__(/*! ../../engine/graphics/Vector2 */ "./lib/engine/graphics/Vector2.js");
const SceneNode_1 = __webpack_require__(/*! ../../engine/scene/SceneNode */ "./lib/engine/scene/SceneNode.js");
const graphics_1 = __webpack_require__(/*! ../../engine/util/graphics */ "./lib/engine/util/graphics.js");
const time_1 = __webpack_require__(/*! ../../engine/util/time */ "./lib/engine/util/time.js");
const LightNode_1 = __webpack_require__(/*! ./LightNode */ "./lib/main/nodes/LightNode.js");
class MuzzleFlashNode extends SceneNode_1.SceneNode {
    constructor(duration, args) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        super(Object.assign({ anchor: Direction_1.Direction.TOP_LEFT, showBounds: true }, args));
        this.duration = duration;
        this.gradient = null;
        this.fireTimeStamp = null;
        this.color = (_c = (_b = (_a = args === null || args === void 0 ? void 0 : args.tiledObject) === null || _a === void 0 ? void 0 : _a.getOptionalProperty("color", "color")) === null || _b === void 0 ? void 0 : _b.getValue()) !== null && _c !== void 0 ? _c : new RGBColor_1.RGBColor(1, 0.6, 0.6);
        this.polygon = (_e = (_d = args === null || args === void 0 ? void 0 : args.tiledObject) === null || _d === void 0 ? void 0 : _d.getPolygon()) !== null && _e !== void 0 ? _e : null;
        this.intensity = (_h = (_g = (_f = args === null || args === void 0 ? void 0 : args.tiledObject) === null || _f === void 0 ? void 0 : _f.getOptionalProperty("intensity", "int")) === null || _g === void 0 ? void 0 : _g.getValue()) !== null && _h !== void 0 ? _h : 100;
        this.manipulatedIntensity = this.intensity;
        this.updateGradient();
    }
    updateGradient() {
        var _a, _b;
        if (this.polygon === null && this.width !== 0 && this.height !== 0) {
            this.gradient = null;
        }
        else {
            const colors = [];
            const color = this.color.toRGB();
            const steps = 16;
            const overshoot = 0.5;
            for (let step = 0; step < steps; step++) {
                const p = (1 + overshoot) * Math.pow((1 - step / steps), 8);
                const col = LightNode_1.intensifyColor(color, p);
                colors.push(col);
            }
            colors.push(new RGBColor_1.RGBColor(0, 0, 0));
            const canvas = graphics_1.createCanvas(8, 8);
            const ctx = graphics_1.getRenderingContext(canvas, "2d");
            const origin = (_b = (_a = this.polygon) === null || _a === void 0 ? void 0 : _a.vertices[0]) !== null && _b !== void 0 ? _b : new Vector2_1.Vector2(0, 0);
            const intensity = this.polygon == null ? this.manipulatedIntensity / 2 : this.manipulatedIntensity;
            this.gradient = ctx.createRadialGradient(origin.x, origin.y, 0, origin.x, origin.y, intensity);
            for (let i = 0, count = colors.length - 1; i <= count; i++) {
                this.gradient.addColorStop(i / count, colors[i].toString());
            }
        }
    }
    setColor(color) {
        if (this.color !== color) {
            this.color = color;
            this.updateGradient();
            this.invalidate(SceneNode_1.SceneNodeAspect.RENDERING);
        }
        return this;
    }
    updateBoundsPolygon(bounds) {
        if (this.polygon != null) {
            for (const vertex of this.polygon.vertices) {
                bounds.addVertex(vertex);
            }
        }
        else {
            super.updateBoundsPolygon(bounds);
        }
    }
    update(dt) {
        if (this.fireTimeStamp) {
            const fireProgress = (time_1.now() - this.fireTimeStamp) / (this.duration * 1000);
            if (fireProgress > 0.9) {
                this.fireTimeStamp = null;
                return;
            }
            this.manipulatedIntensity = this.intensity * (1 - fireProgress);
            this.updateGradient();
        }
    }
    fire() {
        this.fireTimeStamp = time_1.now();
    }
    draw(ctx) {
        var _a;
        if (this.fireTimeStamp) {
            ctx.save();
            ctx.beginPath();
            const intensity = this.manipulatedIntensity;
            const width = this.getWidth();
            const height = this.getHeight();
            ctx.fillStyle = (_a = this.gradient) !== null && _a !== void 0 ? _a : this.color.toString();
            if (this.polygon != null) {
                this.polygon.draw(ctx);
            }
            else if (width === 0 && height === 0) {
                const halfIntensity = intensity / 2;
                ctx.ellipse(0, 0, halfIntensity, halfIntensity, 0, 0, Math.PI * 2, true);
            }
            else {
                ctx.rect(0, 0, width, height);
            }
            ctx.fill();
            ctx.restore();
        }
    }
}
exports.MuzzleFlashNode = MuzzleFlashNode;


/***/ }),

/***/ "./lib/main/nodes/NpcNode.js":
/*!***********************************!*\
  !*** ./lib/main/nodes/NpcNode.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.NpcNode = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const Aseprite_1 = __webpack_require__(/*! ../../engine/assets/Aseprite */ "./lib/engine/assets/Aseprite.js");
const CharacterNode_1 = __webpack_require__(/*! ./CharacterNode */ "./lib/main/nodes/CharacterNode.js");
const Direction_1 = __webpack_require__(/*! ../../engine/geom/Direction */ "./lib/engine/geom/Direction.js");
const Assets_1 = __webpack_require__(/*! ../../engine/assets/Assets */ "./lib/engine/assets/Assets.js");
const Rect_1 = __webpack_require__(/*! ../../engine/geom/Rect */ "./lib/engine/geom/Rect.js");
class NpcNode extends CharacterNode_1.CharacterNode {
    constructor(female, args) {
        super(Object.assign({ aseprite: female ? NpcNode.femaleSprite : NpcNode.maleSprite, anchor: Direction_1.Direction.BOTTOM, childAnchor: Direction_1.Direction.CENTER, tag: "idle", id: "player", sourceBounds: new Rect_1.Rect(6, 6, 8, 26) }, args));
        // Character settings
        this.acceleration = 600;
        this.deceleration = 800;
        this.jumpPower = 295;
    }
    getShootingRange() {
        return 1;
    }
    getSpeed() {
        return 1;
    }
    getAcceleration() {
        return this.acceleration;
    }
    getDeceleration() {
        return this.deceleration;
    }
    getJumpPower() {
        return this.jumpPower;
    }
    update(dt, time) {
        super.update(dt, time);
    }
    die() {
        super.die();
    }
    getPersonalEnemies() {
        return [];
    }
}
tslib_1.__decorate([
    Assets_1.asset("sprites/male.aseprite.json"),
    tslib_1.__metadata("design:type", Aseprite_1.Aseprite)
], NpcNode, "maleSprite", void 0);
tslib_1.__decorate([
    Assets_1.asset("sprites/female.aseprite.json"),
    tslib_1.__metadata("design:type", Aseprite_1.Aseprite)
], NpcNode, "femaleSprite", void 0);
exports.NpcNode = NpcNode;


/***/ }),

/***/ "./lib/main/nodes/ParticleNode.js":
/*!****************************************!*\
  !*** ./lib/main/nodes/ParticleNode.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.valueCurves = exports.ValueCurve = exports.Particle = exports.ParticleNode = void 0;
const SceneNode_1 = __webpack_require__(/*! ../../engine/scene/SceneNode */ "./lib/engine/scene/SceneNode.js");
const constants_1 = __webpack_require__(/*! ../constants */ "./lib/main/constants.js");
class ParticleNode extends SceneNode_1.SceneNode {
    constructor(args) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        super(args);
        this.particles = [];
        this.offsetGenerator = toGenerator((_a = args.offset) !== null && _a !== void 0 ? _a : ({ x: 0, y: 0 }));
        this.velocityGenerator = toGenerator((_b = args.velocity) !== null && _b !== void 0 ? _b : ({ x: 0, y: 0 }));
        this.colorGenerator = toGenerator((_c = args.color) !== null && _c !== void 0 ? _c : "white");
        this.alphaGenerator = toGenerator((_d = args.alpha) !== null && _d !== void 0 ? _d : 1);
        this.sizeGenerator = toGenerator((_e = args.size) !== null && _e !== void 0 ? _e : 4);
        this.gravityGenerator = toGenerator((_f = args.gravity) !== null && _f !== void 0 ? _f : { x: 0, y: constants_1.GRAVITY });
        this.lifetimeGenerator = toGenerator((_g = args.lifetime) !== null && _g !== void 0 ? _g : 5);
        this.angleGenerator = toGenerator((_h = args.angle) !== null && _h !== void 0 ? _h : 0);
        this.angleSpeedGenerator = toGenerator((_j = args.angleSpeed) !== null && _j !== void 0 ? _j : 0);
        this.gravity = this.gravityGenerator();
        this.breakFactor = args.breakFactor || 1;
        this.blendMode = args.blendMode || "source-over";
        this.alphaCurve = args.alphaCurve || exports.valueCurves.constant;
        this.sizeCurve = args.sizeCurve || exports.valueCurves.constant;
        this.zIndex = args.zIndex !== undefined ? args.zIndex : 0;
        this.updateMethod = args.update;
        function toGenerator(obj) {
            if (obj instanceof Function) {
                return obj;
            }
            else {
                return () => obj;
            }
        }
    }
    clearParticles() {
        this.particles = [];
    }
    emit(count = 1) {
        for (let i = 0; i < count; i++) {
            this.emitSingle();
        }
    }
    emitSingle() {
        const v = this.velocityGenerator();
        const off = this.offsetGenerator();
        const pos = this.getScenePosition();
        const particle = new Particle(this, pos.x + off.x, pos.y + off.y, v.x, v.y, this.angleGenerator(), this.angleSpeedGenerator(), this.colorGenerator(), this.sizeGenerator(), this.lifetimeGenerator(), this.alphaGenerator());
        this.particles.push(particle);
        return particle;
    }
    update(dt) {
        this.gravity = this.gravityGenerator();
        for (let i = this.particles.length - 1; i >= 0; i--) {
            if (this.particles[i].update(dt)) {
                this.particles.splice(i, 1);
            }
        }
        if (this.updateMethod) {
            for (const p of this.particles) {
                this.updateMethod(p);
            }
        }
    }
    draw(ctx) {
        ctx.save();
        ctx.globalCompositeOperation = this.blendMode;
        const pos = this.getScenePosition();
        ctx.translate(-pos.x, -pos.y);
        this.particles.forEach(p => p.draw(ctx));
        ctx.restore();
    }
}
exports.ParticleNode = ParticleNode;
class Particle {
    constructor(emitter, x, y, vx = 0, vy = 0, angle = 0, angleSpeed = 0, imageOrColor = "white", size = 4, lifetime = 1, alpha = 1) {
        this.emitter = emitter;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.angle = angle;
        this.angleSpeed = angleSpeed;
        this.imageOrColor = imageOrColor;
        this.size = size;
        this.lifetime = lifetime;
        this.alpha = alpha;
        this.progress = 0;
        this.halfSize = this.size / 2;
        this.originalLifetime = this.lifetime;
        this.progress = 0;
    }
    update(dt) {
        // Life
        this.lifetime -= dt;
        if (this.lifetime <= 0) {
            // Tell parent that it may eliminate this particle
            return true;
        }
        else {
            this.progress = 1 - (this.lifetime / this.originalLifetime);
        }
        // Gravity
        this.vx += this.emitter.gravity.x * dt;
        this.vy += this.emitter.gravity.y * dt;
        if (this.emitter.breakFactor !== 1) {
            const factor = Math.pow(this.emitter.breakFactor, dt);
            this.vx *= factor;
            this.vy *= factor;
        }
        // Movement
        this.x += this.vx * dt;
        this.y -= this.vy * dt;
        this.angle += this.angleSpeed * dt;
        return false;
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha * this.emitter.alphaCurve.get(this.progress);
        ctx.translate(this.x, this.y);
        if (this.angle) {
            ctx.rotate(this.angle);
        }
        if (this.imageOrColor instanceof Object) {
            // Image
            const img = this.imageOrColor;
            const w = (img.naturalWidth || img.width), h = (img.naturalHeight || img.height);
            const sz = Math.max(w, h);
            ctx.drawImage(img, -this.halfSize, -this.halfSize, this.size * w / sz, this.size * h / sz);
        }
        else {
            // Color
            ctx.fillStyle = this.imageOrColor;
            ctx.fillRect(-this.halfSize, -this.halfSize, this.size, this.size);
        }
        ctx.restore();
    }
}
exports.Particle = Particle;
class ValueCurve {
    constructor(func, steps = 1023) {
        this.func = func;
        this.steps = steps;
        this.mapping = [];
        for (let i = 0; i <= steps; i++) {
            this.mapping[i] = func(i / steps);
        }
    }
    get(p) {
        const i = Math.round(p * this.steps);
        return this.mapping[i < 0 ? 0 : i > this.steps ? this.steps : i];
    }
    getExact(p) {
        return this.func(p);
    }
    invert() {
        return new ValueCurve((p) => this.getExact(1 - p), this.steps);
    }
    append(otherCurve, relativeLength = 1) {
        const total = 1 + relativeLength;
        const mid = (total - relativeLength) / total;
        return new ValueCurve((p) => p < mid ? this.getExact(p / mid) :
            otherCurve.getExact((p - mid) / relativeLength), Math.max(this.steps, otherCurve.steps));
    }
}
exports.ValueCurve = ValueCurve;
function trapezeFunction(v, v1 = v) {
    return (p) => p < v ? p / v : p > 1 - v1 ? (1 - p) / v1 : 1;
}
exports.valueCurves = {
    constant: new ValueCurve((p) => 1, 1),
    linear: new ValueCurve((p) => p),
    trapeze: (v = 0.1, v1 = v) => new ValueCurve(trapezeFunction(v, v1)),
    cos: (v = 0.1, v1 = v) => // smooth 0 to 1 to 0
     new ValueCurve((p) => 0.5 - 0.5 * Math.cos(Math.PI * trapezeFunction(v, v1)(p))),
    cubic: new ValueCurve((p) => 3 * p * p - 2 * p * p * p) // smooth 0 to 1
};


/***/ }),

/***/ "./lib/main/nodes/PlayerNode.js":
/*!**************************************!*\
  !*** ./lib/main/nodes/PlayerNode.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerNode = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const Aseprite_1 = __webpack_require__(/*! ../../engine/assets/Aseprite */ "./lib/engine/assets/Aseprite.js");
const CharacterNode_1 = __webpack_require__(/*! ./CharacterNode */ "./lib/main/nodes/CharacterNode.js");
const ControllerIntent_1 = __webpack_require__(/*! ../../engine/input/ControllerIntent */ "./lib/engine/input/ControllerIntent.js");
const Direction_1 = __webpack_require__(/*! ../../engine/geom/Direction */ "./lib/engine/geom/Direction.js");
const FlashlightNode_1 = __webpack_require__(/*! ./player/FlashlightNode */ "./lib/main/nodes/player/FlashlightNode.js");
const GameScene_1 = __webpack_require__(/*! ../scenes/GameScene */ "./lib/main/scenes/GameScene.js");
const MonsterNode_1 = __webpack_require__(/*! ./MonsterNode */ "./lib/main/nodes/MonsterNode.js");
const PlayerArmNode_1 = __webpack_require__(/*! ./player/PlayerArmNode */ "./lib/main/nodes/player/PlayerArmNode.js");
const PlayerLegsNode_1 = __webpack_require__(/*! ./player/PlayerLegsNode */ "./lib/main/nodes/player/PlayerLegsNode.js");
const RatNode_1 = __webpack_require__(/*! ./RatNode */ "./lib/main/nodes/RatNode.js");
const Sound_1 = __webpack_require__(/*! ../../engine/assets/Sound */ "./lib/engine/assets/Sound.js");
const Vector2_1 = __webpack_require__(/*! ../../engine/graphics/Vector2 */ "./lib/engine/graphics/Vector2.js");
const Assets_1 = __webpack_require__(/*! ../../engine/assets/Assets */ "./lib/engine/assets/Assets.js");
const AmmoCounterNode_1 = __webpack_require__(/*! ./player/AmmoCounterNode */ "./lib/main/nodes/player/AmmoCounterNode.js");
const BitmapFont_1 = __webpack_require__(/*! ../../engine/assets/BitmapFont */ "./lib/engine/assets/BitmapFont.js");
const constants_1 = __webpack_require__(/*! ../constants */ "./lib/main/constants.js");
const env_1 = __webpack_require__(/*! ../../engine/util/env */ "./lib/engine/util/env.js");
const time_1 = __webpack_require__(/*! ../../engine/util/time */ "./lib/engine/util/time.js");
const ParticleNode_1 = __webpack_require__(/*! ./ParticleNode */ "./lib/main/nodes/ParticleNode.js");
const random_1 = __webpack_require__(/*! ../../engine/util/random */ "./lib/engine/util/random.js");
const Rect_1 = __webpack_require__(/*! ../../engine/geom/Rect */ "./lib/engine/geom/Rect.js");
const MuzzleFlashNode_1 = __webpack_require__(/*! ./MuzzleFlashNode */ "./lib/main/nodes/MuzzleFlashNode.js");
const AmbientPlayerNode_1 = __webpack_require__(/*! ./player/AmbientPlayerNode */ "./lib/main/nodes/player/AmbientPlayerNode.js");
const TrainNode_1 = __webpack_require__(/*! ./TrainNode */ "./lib/main/nodes/TrainNode.js");
const groundColors = [
    "#806057",
    "#504336",
    "#3C8376",
    "#908784"
];
class PlayerNode extends CharacterNode_1.CharacterNode {
    constructor(args) {
        var _a, _b, _c;
        super(Object.assign({ aseprite: PlayerNode.sprite, anchor: Direction_1.Direction.BOTTOM, childAnchor: Direction_1.Direction.CENTER, tag: "idle", id: "player", sourceBounds: new Rect_1.Rect(6, 6, 8, 26), cameraTargetOffset: new Vector2_1.Vector2(0, -26) }, args));
        /** The aimingAngle in radians */
        this.aimingAngle = Math.PI / 2;
        this.isReloading = false;
        this.reloadStart = null;
        this.lastShotTime = 0;
        this.shotRecoil = 0.2;
        this.ammo = 12;
        this.nextShot = 0;
        this.previouslyPressed = 0;
        // Character settings
        this.shootingRange = 250;
        this.speed = 60;
        this.acceleration = 600;
        this.deceleration = 800;
        this.jumpPower = 295;
        this.shotDelay = 0.2;
        this.magazineSize = 12;
        this.reloadDelay = 2200;
        this.leftMouseDown = false;
        this.removeOnDie = false;
        this.playerArm = new PlayerArmNode_1.PlayerArmNode();
        this.playerLeg = new PlayerLegsNode_1.PlayerLegsNode();
        this.flashLight = new FlashlightNode_1.FlashlightNode();
        this.muzzleFlash = new MuzzleFlashNode_1.MuzzleFlashNode(this.shotRecoil, { y: -3 });
        this.ammoCounter = new AmmoCounterNode_1.AmmoCounterNode({
            font: PlayerNode.font,
            anchor: Direction_1.Direction.TOP_RIGHT,
            layer: constants_1.Layer.HUD
        });
        this.appendChild(this.playerLeg);
        this.appendChild(this.playerArm);
        const ambientPlayerLight = new AmbientPlayerNode_1.AmbientPlayerNode();
        (_a = this.playerLeg) === null || _a === void 0 ? void 0 : _a.appendChild(ambientPlayerLight);
        (_b = this.playerArm) === null || _b === void 0 ? void 0 : _b.appendChild(this.flashLight);
        (_c = this.flashLight) === null || _c === void 0 ? void 0 : _c.appendChild(this.muzzleFlash);
        this.setupMouseKeyHandlers();
        window["player"] = this;
        this.dustParticles = new ParticleNode_1.ParticleNode({
            y: this.getHeight() / 2,
            velocity: () => ({ x: random_1.rnd(-1, 1) * 26, y: random_1.rnd(0.7, 1) * 45 }),
            color: () => random_1.rndItem(groundColors),
            size: random_1.rnd(1, 2),
            gravity: { x: 0, y: -100 },
            lifetime: () => random_1.rnd(0.5, 0.8),
            alphaCurve: ParticleNode_1.valueCurves.trapeze(0.05, 0.2)
        }).appendTo(this);
    }
    get aimingAngleNonNegative() {
        return -this.aimingAngle + Math.PI / 2;
    }
    getShootingRange() {
        return this.shootingRange;
    }
    getSpeed() {
        var _a;
        // TODO remove before publishing
        return this.speed * (((_a = this.getScene()) === null || _a === void 0 ? void 0 : _a.keyboard.isPressed("Shift")) ? 4 : 1);
    }
    getAcceleration() {
        return this.acceleration;
    }
    getDeceleration() {
        return this.deceleration;
    }
    getJumpPower() {
        return this.jumpPower;
    }
    getAmmo() {
        return this.ammo;
    }
    getMagazineSize() {
        return this.magazineSize;
    }
    getLastShotTime() {
        return this.lastShotTime;
    }
    update(dt, time) {
        super.update(dt, time);
        if (!this.ammoCounter.isInScene() && env_1.isDev()) {
            const rootNode = this.getGame().getGameScene().rootNode;
            this.ammoCounter.setX(rootNode.getWidth() - 10);
            this.ammoCounter.setY(10);
            rootNode.appendChild(this.ammoCounter);
        }
        if (!this.isAlive()) {
            this.setDirection(0);
            return;
        }
        if (this.getParent() instanceof TrainNode_1.TrainNode) {
            this.setOpacity(0);
            return;
        }
        this.setOpacity(1);
        // Controls
        const input = this.getScene().game.input;
        // Move left/right
        const direction = (input.currentActiveIntents & ControllerIntent_1.ControllerIntent.PLAYER_MOVE_RIGHT ? 1 : 0)
            - (input.currentActiveIntents & ControllerIntent_1.ControllerIntent.PLAYER_MOVE_LEFT ? 1 : 0);
        this.setDirection(direction);
        // Jump
        if (this.isOnGround && this.canInteract(ControllerIntent_1.ControllerIntent.PLAYER_JUMP)) {
            this.jump();
        }
        if (this.getTag() === "walk") {
            PlayerNode.footsteps.setLoop(true);
            PlayerNode.footsteps.play(0.5);
        }
        else {
            PlayerNode.footsteps.stop(0.3);
        }
        // Reload
        if (this.canInteract(ControllerIntent_1.ControllerIntent.PLAYER_RELOAD)) {
            this.reload();
        }
        // Shoot
        if (this.canInteract(ControllerIntent_1.ControllerIntent.PLAYER_ACTION) || this.leftMouseDown) {
            this.leftMouseDown = false;
            if (time >= this.nextShot && !this.isReloading) {
                this.shoot();
                this.nextShot = time + this.shotDelay;
            }
        }
        // Interact
        if (this.canInteract(ControllerIntent_1.ControllerIntent.PLAYER_INTERACT)) {
            const node = this.getNodeToInteractWith();
            if (node) {
                node.interact();
            }
        }
        // Battlemode
        if (this.battlemode) {
            this.getScene().game.canvas.style.cursor = "none";
        }
        this.syncArmAndLeg();
        // Spawn random dust particles while walking
        if (this.isVisible()) {
            if (this.getTag() === "walk") {
                if (random_1.timedRnd(dt, 0.2)) {
                    this.dustParticles.emit(1);
                }
            }
        }
        this.updatePreviouslyPressed();
    }
    updatePreviouslyPressed() {
        const input = this.getGame().input;
        this.previouslyPressed = input.currentActiveIntents;
    }
    /**
     * Checks if the given intent is the same as the last intent to prevent auto-key-handling on button being hold.
     */
    canInteract(intent) {
        const input = this.getGame().input;
        return (this.previouslyPressed & intent) === 0 && (input.currentActiveIntents & intent) !== 0;
    }
    shoot() {
        if (this.ammo === 0) {
            PlayerNode.dryFireSound.stop();
            PlayerNode.dryFireSound.play();
        }
        else if (this.ammo > 0 && !this.isReloading) {
            this.lastShotTime = time_1.now();
            this.ammo--;
            this.muzzleFlash.fire();
            super.shoot(this.aimingAngleNonNegative, 35, this.flashLight.getScenePosition());
        }
    }
    reload() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.isReloading || this.ammo === this.magazineSize) {
                return;
            }
            this.isReloading = true;
            PlayerNode.reloadSound.setLoop(true);
            PlayerNode.reloadSound.play();
            yield time_1.sleep(this.reloadDelay);
            this.ammo = this.magazineSize;
            PlayerNode.reloadSound.stop();
            this.isReloading = false;
        });
    }
    syncArmAndLeg() {
        var _a, _b;
        (_a = this.playerArm) === null || _a === void 0 ? void 0 : _a.transform(c => {
            var _a;
            if (this.isReloading) {
                const angleAimRight = 0.15 + Math.PI / 2;
                const angleAimLeft = -0.15 + Math.PI / 2;
                if (!this.reloadStart) {
                    this.reloadStart = time_1.now();
                }
                const reloadProgress = (time_1.now() - this.reloadStart) / this.reloadDelay;
                let factor = Math.pow(Math.sin(Math.PI * reloadProgress), 0.4);
                factor = 0.5 - 0.5 * Math.cos(Math.PI * factor);
                if (this.aimingAngle < 0) {
                    const aimingDiff = this.aimingAngleNonNegative - angleAimRight;
                    c.setRotation(this.aimingAngleNonNegative - aimingDiff * factor);
                }
                else {
                    const aimingDiff = this.aimingAngleNonNegative - angleAimLeft;
                    c.setRotation(this.aimingAngleNonNegative - aimingDiff * factor);
                }
            }
            else if (time_1.now() - this.lastShotTime < this.shotDelay * 1000) {
                const shotProgress = (time_1.now() - this.lastShotTime) / (this.shotDelay * 1000);
                if (this.aimingAngle < 0) {
                    c.setRotation(this.aimingAngleNonNegative + this.shotRecoil * Math.sin(Math.PI * shotProgress));
                }
                else {
                    c.setRotation(this.aimingAngleNonNegative - this.shotRecoil * Math.sin(Math.PI * shotProgress));
                }
            }
            else {
                this.reloadStart = null;
                c.setRotation(this.aimingAngleNonNegative);
            }
            // Mirror arm vertically
            if (this.aimingAngle < 0) {
                c.scaleY(-1);
            }
            else {
                c.scaleY(1);
            }
            // look in aiming direction
            this.setMirrorX(this.aimingAngle < 0);
            const backwards = this.direction === 1 && this.aimingAngle < 0 || this.direction === -1 && this.aimingAngle >= 0;
            (_a = this.playerLeg) === null || _a === void 0 ? void 0 : _a.getAseprite().setDirection(backwards ? "reverse" : "forward");
            // Transform flashlight to match scaling and rotation of the arm.
            this.flashLight.transform(f => {
                if (this.isMirrorX()) {
                    this.flashLight.setY(-3);
                    f.setRotation(Math.PI);
                }
                else {
                    this.flashLight.setY(5);
                    f.setRotation(0);
                }
            });
        });
        if (this.isJumping) {
            this.setTag("jump");
        }
        else if (this.isFalling) {
            this.setTag("fall");
        }
        else if (this.direction !== 0) {
            this.setTag("walk");
        }
        else {
            this.setTag("idle");
        }
        (_b = this.playerLeg) === null || _b === void 0 ? void 0 : _b.setMirrorX(this.direction === 0 ? this.isMirrorX() : (this.direction === -1));
    }
    die() {
        var _a;
        super.die();
        PlayerNode.dieScream.stop();
        PlayerNode.dieScream.play();
        // Slow fade out, then play as different character
        const camera = (_a = this.getGame().scenes.getScene(GameScene_1.GameScene)) === null || _a === void 0 ? void 0 : _a.camera;
        if (camera) {
            const fader = camera.fadeToBlack;
            fader.fadeOut({ duration: 6 });
            camera.focus(this, {
                duration: 6,
                scale: 4,
                rotation: Math.PI * 2
            }).then(() => {
                // Reset camera
                camera.setZoom(1);
                camera.setRotation(0);
                fader.fadeIn({ duration: 3 });
                // TODO Leave corpse in place
                // TODO Jump to dialog sequence in train
                this.getGame().spawnNewPlayer();
            });
        }
    }
    getPersonalEnemies() {
        var _a, _b, _c, _d;
        const monsters = (_b = (_a = this.getScene()) === null || _a === void 0 ? void 0 : _a.rootNode.getDescendantsByType(MonsterNode_1.MonsterNode)) !== null && _b !== void 0 ? _b : [];
        const rats = (_d = (_c = this.getScene()) === null || _c === void 0 ? void 0 : _c.rootNode.getDescendantsByType(RatNode_1.RatNode)) !== null && _d !== void 0 ? _d : [];
        const enemies = [...monsters, ...rats];
        return enemies.filter(e => e.isAlive());
    }
    setDebug(debug) {
        this.debug = debug;
    }
    handlePointerMove(event) {
        this.aimingAngle = new Vector2_1.Vector2(event.getX(), event.getY())
            .sub(this.playerArm ? this.playerArm.getScenePosition() : this.getScenePosition())
            .getAngle();
    }
    activate() {
        var _a;
        (_a = this.getScene()) === null || _a === void 0 ? void 0 : _a.onPointerMove.connect(this.handlePointerMove, this);
    }
    deactivate() {
        var _a;
        (_a = this.getScene()) === null || _a === void 0 ? void 0 : _a.onPointerMove.disconnect(this.handlePointerMove, this);
    }
    endBattlemode() {
        super.endBattlemode();
        this.getGame().canvas.style.cursor = "crosshair";
    }
    setupMouseKeyHandlers() {
        window.addEventListener("mousedown", event => {
            if (event.button === 0) {
                this.leftMouseDown = true;
            }
        });
        window.addEventListener("mouseup", event => {
            if (event.button === 0) {
                this.leftMouseDown = false;
            }
        });
    }
}
tslib_1.__decorate([
    Assets_1.asset(constants_1.STANDARD_FONT),
    tslib_1.__metadata("design:type", BitmapFont_1.BitmapFont)
], PlayerNode, "font", void 0);
tslib_1.__decorate([
    Assets_1.asset("sounds/fx/wilhelmScream.mp3"),
    tslib_1.__metadata("design:type", Sound_1.Sound)
], PlayerNode, "dieScream", void 0);
tslib_1.__decorate([
    Assets_1.asset("sounds/fx/footsteps.ogg"),
    tslib_1.__metadata("design:type", Sound_1.Sound)
], PlayerNode, "footsteps", void 0);
tslib_1.__decorate([
    Assets_1.asset("sounds/fx/dryfire.ogg"),
    tslib_1.__metadata("design:type", Sound_1.Sound)
], PlayerNode, "dryFireSound", void 0);
tslib_1.__decorate([
    Assets_1.asset("sounds/fx/reload.ogg"),
    tslib_1.__metadata("design:type", Sound_1.Sound)
], PlayerNode, "reloadSound", void 0);
tslib_1.__decorate([
    Assets_1.asset("sprites/spacesuitbody.aseprite.json"),
    tslib_1.__metadata("design:type", Aseprite_1.Aseprite)
], PlayerNode, "sprite", void 0);
exports.PlayerNode = PlayerNode;


/***/ }),

/***/ "./lib/main/nodes/RatNode.js":
/*!***********************************!*\
  !*** ./lib/main/nodes/RatNode.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.RatNode = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const EnemyNode_1 = __webpack_require__(/*! ./EnemyNode */ "./lib/main/nodes/EnemyNode.js");
const Aseprite_1 = __webpack_require__(/*! ../../engine/assets/Aseprite */ "./lib/engine/assets/Aseprite.js");
const Direction_1 = __webpack_require__(/*! ../../engine/geom/Direction */ "./lib/engine/geom/Direction.js");
const Sound_1 = __webpack_require__(/*! ../../engine/assets/Sound */ "./lib/engine/assets/Sound.js");
const Assets_1 = __webpack_require__(/*! ../../engine/assets/Assets */ "./lib/engine/assets/Assets.js");
const Rect_1 = __webpack_require__(/*! ../../engine/geom/Rect */ "./lib/engine/geom/Rect.js");
const random_1 = __webpack_require__(/*! ../../engine/util/random */ "./lib/engine/util/random.js");
class RatNode extends EnemyNode_1.EnemyNode {
    constructor(args) {
        super(Object.assign({ aseprite: RatNode.sprite, anchor: Direction_1.Direction.BOTTOM, tag: "idle", sourceBounds: new Rect_1.Rect(3, 6, 8, 4) }, args));
        /** minimum distance between enemy and player to stop escaping */
        this.squaredSafetyDistance = Math.pow(100, 2);
        this.moveTimeMin = 0.3;
        this.moveTimeMax = 1;
        this.waitTimeMin = 2;
        this.waitTimeMax = 5;
        this.moveDelay = random_1.rnd(this.moveTimeMin, this.moveTimeMax);
        this.waitTime = random_1.rnd(this.waitTimeMin, this.waitTimeMax);
        this.escapeDistanceMin = 150;
        this.escapeDistanceMax = 250;
        this.escapeDistanceSquared = Math.pow(random_1.rnd(this.escapeDistanceMin, this.escapeDistanceMax), 2);
        this.updateMoveAroundAnchor();
        this.setState(EnemyNode_1.AiState.MOVE_AROUND);
        this.targetPosition = this.getPosition();
        this.hitpoints = 1;
    }
    updateMoveAroundAnchor(position = this.getPosition()) {
        this.moveAroundAnchor.setVector(position);
    }
    updateAi(dt, time) {
        if (!this.isAlive()) {
            this.setDirection(0);
            this.stopSounds();
            return;
        }
        // AI
        switch (this.state) {
            case EnemyNode_1.AiState.ALERT:
                this.updateAlert(time);
                break;
            case EnemyNode_1.AiState.MOVE_AROUND:
                this.updateMoveAround(time);
                break;
        }
    }
    updateMoveAround(time) {
        if (this.stopAndWaitTs === 0) {
            if (this.moveTs + this.moveDelay < time) {
                this.setDirection(0);
                this.stopAndWaitTs = time;
                this.waitTime = random_1.rnd(this.waitTimeMin, this.waitTimeMax);
            }
        }
        else if (this.stopAndWaitTs + this.waitTime < time) {
            this.setDirection(this.getX() >= this.moveAroundAnchor.x ? -1 : 1);
            this.stopAndWaitTs = 0;
            this.moveTs = time;
            this.moveDelay = random_1.rnd(this.moveTimeMin, this.moveTimeMax);
        }
        if (this.getDistanceToPlayerSquared() < this.squaredSafetyDistance) {
            this.escapeDistanceSquared = Math.pow(random_1.rnd(this.escapeDistanceMin, this.escapeDistanceMax), 2);
            this.setState(EnemyNode_1.AiState.ALERT);
            this.stopSounds();
            RatNode.ratSoundAttack.play();
        }
    }
    updateAlert(time) {
        const player = this.getPlayer();
        if (player && this.getDistanceToPlayerSquared() < this.squaredSafetyDistance + this.escapeDistanceSquared) {
            this.setDirection(this.getX() < player.getX() ? -1 : 1);
        }
        else {
            this.updateMoveAroundAnchor();
            this.setState(EnemyNode_1.AiState.MOVE_AROUND);
        }
    }
    getDistanceToPlayerSquared() {
        const player = this.getPlayer();
        if (!player) {
            return Infinity;
        }
        return player.getPosition().getSquareDistance(this.getPosition());
    }
    stopSounds() {
        if (this.isSoundPlaying()) {
            RatNode.ratSoundAttack.stop();
            RatNode.ratSoundFollow.stop();
        }
    }
    isSoundPlaying() {
        return RatNode.ratSoundAttack.isPlaying() || RatNode.ratSoundFollow.isPlaying();
    }
}
tslib_1.__decorate([
    Assets_1.asset("sprites/mouse.aseprite.json"),
    tslib_1.__metadata("design:type", Aseprite_1.Aseprite)
], RatNode, "sprite", void 0);
tslib_1.__decorate([
    Assets_1.asset("sounds/fx/ratSqueak.mp3"),
    tslib_1.__metadata("design:type", Sound_1.Sound)
], RatNode, "ratSoundAttack", void 0);
tslib_1.__decorate([
    Assets_1.asset("sounds/fx/ratSqueak2.mp3"),
    tslib_1.__metadata("design:type", Sound_1.Sound)
], RatNode, "ratSoundFollow", void 0);
exports.RatNode = RatNode;


/***/ }),

/***/ "./lib/main/nodes/SwitchNode.js":
/*!**************************************!*\
  !*** ./lib/main/nodes/SwitchNode.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchNode = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const Aseprite_1 = __webpack_require__(/*! ../../engine/assets/Aseprite */ "./lib/engine/assets/Aseprite.js");
const Direction_1 = __webpack_require__(/*! ../../engine/geom/Direction */ "./lib/engine/geom/Direction.js");
const InteractiveNode_1 = __webpack_require__(/*! ./InteractiveNode */ "./lib/main/nodes/InteractiveNode.js");
const Sound_1 = __webpack_require__(/*! ../../engine/assets/Sound */ "./lib/engine/assets/Sound.js");
const Assets_1 = __webpack_require__(/*! ../../engine/assets/Assets */ "./lib/engine/assets/Assets.js");
class SwitchNode extends InteractiveNode_1.InteractiveNode {
    constructor(_a) {
        var { onlyOnce = false, onUpdate } = _a, args = tslib_1.__rest(_a, ["onlyOnce", "onUpdate"]);
        super(Object.assign({ aseprite: SwitchNode.sprite, anchor: Direction_1.Direction.CENTER, tag: "off" }, args), "Press E to press switch");
        this.turnedOn = false;
        this.stateChanges = 0;
        this.onlyOnce = onlyOnce;
        this.onUpdate = onUpdate;
    }
    interact() {
        if (this.canInteract()) {
            SwitchNode.clickSound.stop();
            SwitchNode.clickSound.play();
            this.turnedOn = !this.turnedOn;
            this.setTag(this.turnedOn ? "on" : "off");
            if (this.onUpdate != null) {
                this.onUpdate(this.turnedOn);
            }
            this.stateChanges++;
        }
    }
    canInteract() {
        return this.stateChanges === 0 || !this.onlyOnce;
    }
    getTurnedOn() {
        return this.turnedOn;
    }
}
tslib_1.__decorate([
    Assets_1.asset("sprites/wallLever.aseprite.json"),
    tslib_1.__metadata("design:type", Aseprite_1.Aseprite)
], SwitchNode, "sprite", void 0);
tslib_1.__decorate([
    Assets_1.asset("sounds/fx/heavyLightSwitch.ogg"),
    tslib_1.__metadata("design:type", Sound_1.Sound)
], SwitchNode, "clickSound", void 0);
exports.SwitchNode = SwitchNode;


/***/ }),

/***/ "./lib/main/nodes/TiledSoundNode.js":
/*!******************************************!*\
  !*** ./lib/main/nodes/TiledSoundNode.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TiledSoundNode = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const Assets_1 = __webpack_require__(/*! ../../engine/assets/Assets */ "./lib/engine/assets/Assets.js");
const SoundNode_1 = __webpack_require__(/*! ../../engine/scene/SoundNode */ "./lib/engine/scene/SoundNode.js");
const soundAssets = [
    "sounds/loops/loop_breathing.mp3",
    "sounds/loops/loop_electronicmotor.mp3",
    "sounds/loops/loop_elektrostatic.mp3",
    "sounds/loops/loop_fan.mp3",
    "sounds/loops/loop_flamethrower.mp3",
    "sounds/loops/loop_flies.mp3",
    "sounds/loops/loop_gas.mp3",
    "sounds/loops/loop_halogen.mp3",
    "sounds/loops/loop_occupied.mp3",
    "sounds/loops/loop_staticRadioSound.mp3"
];
const soundMapping = {
    "breathing": 0,
    "electronicmotor": 1,
    "elektrostatic": 2,
    "fan": 3,
    "flamethrower": 4,
    "flies": 5,
    "gas": 6,
    "halogen": 7,
    "occupied": 8,
    "staticRadioSound": 9,
};
function getAssetIndexForName(name) {
    var _a;
    return (_a = soundMapping[name]) !== null && _a !== void 0 ? _a : -1;
}
class TiledSoundNode extends SoundNode_1.SoundNode {
    constructor(args) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const range = (_c = (_b = (_a = args === null || args === void 0 ? void 0 : args.tiledObject) === null || _a === void 0 ? void 0 : _a.getOptionalProperty("range", "int")) === null || _b === void 0 ? void 0 : _b.getValue()) !== null && _c !== void 0 ? _c : 10;
        const intensity = (_f = (_e = (_d = args === null || args === void 0 ? void 0 : args.tiledObject) === null || _d === void 0 ? void 0 : _d.getOptionalProperty("intensity", "int")) === null || _e === void 0 ? void 0 : _e.getValue()) !== null && _f !== void 0 ? _f : 1.0;
        const soundName = (_j = (_h = (_g = args === null || args === void 0 ? void 0 : args.tiledObject) === null || _g === void 0 ? void 0 : _g.getOptionalProperty("sound", "string")) === null || _h === void 0 ? void 0 : _h.getValue()) !== null && _j !== void 0 ? _j : "";
        const soundAssetIndex = getAssetIndexForName(soundName);
        let sound;
        if (soundAssetIndex !== -1) {
            sound = TiledSoundNode.sounds[soundAssetIndex];
        }
        else {
            throw new Error(`Sound '${soundName}' could not be loaded`);
        }
        super(Object.assign(Object.assign({}, args), { range, intensity, sound }));
    }
}
tslib_1.__decorate([
    Assets_1.asset(soundAssets),
    tslib_1.__metadata("design:type", Array)
], TiledSoundNode, "sounds", void 0);
exports.TiledSoundNode = TiledSoundNode;


/***/ }),

/***/ "./lib/main/nodes/TrainNode.js":
/*!*************************************!*\
  !*** ./lib/main/nodes/TrainNode.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainNode = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const Aseprite_1 = __webpack_require__(/*! ../../engine/assets/Aseprite */ "./lib/engine/assets/Aseprite.js");
const Assets_1 = __webpack_require__(/*! ../../engine/assets/Assets */ "./lib/engine/assets/Assets.js");
const RGBColor_1 = __webpack_require__(/*! ../../engine/color/RGBColor */ "./lib/engine/color/RGBColor.js");
const Direction_1 = __webpack_require__(/*! ../../engine/geom/Direction */ "./lib/engine/geom/Direction.js");
const AsepriteNode_1 = __webpack_require__(/*! ../../engine/scene/AsepriteNode */ "./lib/engine/scene/AsepriteNode.js");
const math_1 = __webpack_require__(/*! ../../engine/util/math */ "./lib/engine/util/math.js");
const constants_1 = __webpack_require__(/*! ../constants */ "./lib/main/constants.js");
const LightNode_1 = __webpack_require__(/*! ./LightNode */ "./lib/main/nodes/LightNode.js");
class TrainNode extends AsepriteNode_1.AsepriteNode {
    constructor(args) {
        super(Object.assign(Object.assign({ aseprite: TrainNode.sprite, anchor: Direction_1.Direction.BOTTOM }, args), { layer: constants_1.Layer.BACKGROUND }));
        this.opacitySpeed = 1;
        this.visibility = 1;
        this.targetOpacity = 0;
        this.interiorLight = new LightNode_1.LightNode({
            x: -200,
            y: -30,
            width: 390,
            height: 80,
            layer: constants_1.Layer.LIGHT
        });
        this.interiorLight.setColor(new RGBColor_1.RGBColor(255, 255, 255));
        this.interiorLight.appendTo(this);
        this.foreground = new AsepriteNode_1.AsepriteNode({
            aseprite: TrainNode.foregroundSprite,
            anchor: Direction_1.Direction.CENTER,
            layer: constants_1.Layer.DEFAULT
        });
        this.appendChild(this.foreground);
        this.foreground.setOpacity(Infinity);
        window.train = this;
    }
    update(dt, time) {
        if (this.visibility !== this.targetOpacity) {
            const direction = this.targetOpacity > this.visibility ? 1 : -1;
            this.visibility = math_1.clamp(this.visibility + dt * this.opacitySpeed * direction, 0, 1);
            this.foreground.setOpacity(this.visibility);
            this.interiorLight.setOpacity(1 - this.visibility);
        }
    }
    showInner() {
        this.targetOpacity = 0;
    }
    hideInner() {
        this.targetOpacity = 1;
    }
}
tslib_1.__decorate([
    Assets_1.asset("sprites/hyperloopInt.aseprite.json"),
    tslib_1.__metadata("design:type", Aseprite_1.Aseprite)
], TrainNode, "sprite", void 0);
tslib_1.__decorate([
    Assets_1.asset("sprites/hyperloopExt.aseprite.json"),
    tslib_1.__metadata("design:type", Aseprite_1.Aseprite)
], TrainNode, "foregroundSprite", void 0);
exports.TrainNode = TrainNode;


/***/ }),

/***/ "./lib/main/nodes/player/AmbientPlayerNode.js":
/*!****************************************************!*\
  !*** ./lib/main/nodes/player/AmbientPlayerNode.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.AmbientPlayerNode = void 0;
const RGBColor_1 = __webpack_require__(/*! ../../../engine/color/RGBColor */ "./lib/engine/color/RGBColor.js");
const Direction_1 = __webpack_require__(/*! ../../../engine/geom/Direction */ "./lib/engine/geom/Direction.js");
const Vector2_1 = __webpack_require__(/*! ../../../engine/graphics/Vector2 */ "./lib/engine/graphics/Vector2.js");
const SceneNode_1 = __webpack_require__(/*! ../../../engine/scene/SceneNode */ "./lib/engine/scene/SceneNode.js");
const graphics_1 = __webpack_require__(/*! ../../../engine/util/graphics */ "./lib/engine/util/graphics.js");
const constants_1 = __webpack_require__(/*! ../../constants */ "./lib/main/constants.js");
const LightNode_1 = __webpack_require__(/*! ../LightNode */ "./lib/main/nodes/LightNode.js");
class AmbientPlayerNode extends SceneNode_1.SceneNode {
    constructor(args) {
        var _a, _b, _c, _d, _e, _f;
        super(Object.assign({ anchor: Direction_1.Direction.CENTER, id: "flashlight", layer: constants_1.Layer.LIGHT }, args));
        this.gradient = null;
        this.color = (_c = (_b = (_a = args === null || args === void 0 ? void 0 : args.tiledObject) === null || _a === void 0 ? void 0 : _a.getOptionalProperty("color", "color")) === null || _b === void 0 ? void 0 : _b.getValue()) !== null && _c !== void 0 ? _c : new RGBColor_1.RGBColor(0.2, 0.3, 0.2);
        this.intensity = (_f = (_e = (_d = args === null || args === void 0 ? void 0 : args.tiledObject) === null || _d === void 0 ? void 0 : _d.getOptionalProperty("intensity", "int")) === null || _e === void 0 ? void 0 : _e.getValue()) !== null && _f !== void 0 ? _f : 250;
        this.updateGradient();
    }
    updateGradient() {
        const colors = [];
        const color = this.color.toRGB();
        const steps = 16;
        const overshoot = 0.5;
        for (let step = 0; step < steps; step++) {
            const p = (1 + overshoot) * Math.pow((1 - step / steps), 8);
            const col = LightNode_1.intensifyColor(color, p);
            colors.push(col);
        }
        colors.push(new RGBColor_1.RGBColor(0, 0, 0));
        const canvas = graphics_1.createCanvas(8, 8);
        const ctx = graphics_1.getRenderingContext(canvas, "2d");
        const origin = new Vector2_1.Vector2(0, 0);
        const intensity = this.intensity;
        this.gradient = ctx.createRadialGradient(origin.x, origin.y, 0, origin.x, origin.y, intensity);
        for (let i = 0, count = colors.length - 1; i <= count; i++) {
            this.gradient.addColorStop(i / count, colors[i].toString());
        }
    }
    setColor(color) {
        if (this.color !== color) {
            this.color = color;
            this.updateGradient();
            this.invalidate(SceneNode_1.SceneNodeAspect.RENDERING);
        }
        return this;
    }
    draw(ctx) {
        var _a;
        ctx.save();
        ctx.beginPath();
        const intensity = this.intensity;
        ctx.fillStyle = (_a = this.gradient) !== null && _a !== void 0 ? _a : this.color.toString();
        const halfIntensity = intensity / 2;
        ctx.ellipse(0, 0, halfIntensity, halfIntensity, 0, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.restore();
    }
}
exports.AmbientPlayerNode = AmbientPlayerNode;


/***/ }),

/***/ "./lib/main/nodes/player/AmmoCounterNode.js":
/*!**************************************************!*\
  !*** ./lib/main/nodes/player/AmmoCounterNode.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.AmmoCounterNode = void 0;
const TextNode_1 = __webpack_require__(/*! ../../../engine/scene/TextNode */ "./lib/engine/scene/TextNode.js");
class AmmoCounterNode extends TextNode_1.TextNode {
    update(dt, time) {
        super.update(dt, time);
        this.setText(`${this.getGame().getPlayer().getAmmo()} | ${this.getGame().getPlayer().getMagazineSize()}`);
    }
}
exports.AmmoCounterNode = AmmoCounterNode;


/***/ }),

/***/ "./lib/main/nodes/player/FlashlightNode.js":
/*!*************************************************!*\
  !*** ./lib/main/nodes/player/FlashlightNode.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashlightNode = void 0;
const Direction_1 = __webpack_require__(/*! ../../../engine/geom/Direction */ "./lib/engine/geom/Direction.js");
const SceneNode_1 = __webpack_require__(/*! ../../../engine/scene/SceneNode */ "./lib/engine/scene/SceneNode.js");
const constants_1 = __webpack_require__(/*! ../../constants */ "./lib/main/constants.js");
const PlayerNode_1 = __webpack_require__(/*! ../PlayerNode */ "./lib/main/nodes/PlayerNode.js");
class FlashlightNode extends SceneNode_1.SceneNode {
    constructor(randomRotate, args) {
        super(Object.assign({ anchor: Direction_1.Direction.CENTER, id: "flashlight", layer: constants_1.Layer.LIGHT }, args));
        this.randomRotate = randomRotate;
    }
    draw(context) {
        context.save();
        const player = this.getPlayer();
        if (player && player.isMirrorX()) {
            context.scale(-1, 1);
        }
        if (this.randomRotate) {
            const t = Date.now() * 0.002;
            const randomAngle = Math.PI * 0.04 * (Math.sin(t * 0.5) + 0.5 * Math.sin(t * 0.84) + 0.3 * Math.sin(t * 0.941));
            context.rotate(randomAngle);
        }
        context.drawImage(FlashlightNode.image, 0, -54);
        context.restore();
    }
    static generateImage(width, height) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const ymid = height / 2;
        for (let y = 0; y < height; y++) {
            const dy = Math.abs(y - ymid);
            for (let x = 0; x < width; x++) {
                const fx = x / width;
                const p = 4 * (x + width * y);
                const span = ymid * fx;
                let c = 0;
                if (dy < span) {
                    const lightY = Math.pow((0.5 - 0.5 * Math.cos(Math.PI * (1 - dy / span))), 0.5);
                    const lightX = (fx < 0.25 ? 0.5 - 0.5 * Math.cos(Math.PI * fx / 0.25) : Math.pow(((1 - fx) / 0.75), 0.7));
                    c = 255 * lightX * lightY;
                }
                data[p] = data[p + 1] = data[p + 2] = c;
                data[p + 3] = 255;
            }
        }
        ctx.putImageData(imageData, 0, 0);
        const img = new Image();
        img.src = canvas.toDataURL();
        return img;
    }
    getPlayer() {
        let node = this.getParent();
        while (node && !(node instanceof PlayerNode_1.PlayerNode)) {
            node = node.getParent();
        }
        return node !== null && node !== void 0 ? node : null;
    }
}
exports.FlashlightNode = FlashlightNode;
FlashlightNode.image = FlashlightNode.generateImage(200, 100);


/***/ }),

/***/ "./lib/main/nodes/player/PlayerArmNode.js":
/*!************************************************!*\
  !*** ./lib/main/nodes/player/PlayerArmNode.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerArmNode = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const Aseprite_1 = __webpack_require__(/*! ../../../engine/assets/Aseprite */ "./lib/engine/assets/Aseprite.js");
const Assets_1 = __webpack_require__(/*! ../../../engine/assets/Assets */ "./lib/engine/assets/Assets.js");
const Direction_1 = __webpack_require__(/*! ../../../engine/geom/Direction */ "./lib/engine/geom/Direction.js");
const Rect_1 = __webpack_require__(/*! ../../../engine/geom/Rect */ "./lib/engine/geom/Rect.js");
const AsepriteNode_1 = __webpack_require__(/*! ../../../engine/scene/AsepriteNode */ "./lib/engine/scene/AsepriteNode.js");
class PlayerArmNode extends AsepriteNode_1.AsepriteNode {
    // public flashlight: FlashlightNode;
    constructor(args) {
        super(Object.assign({ aseprite: PlayerArmNode.sprite, anchor: Direction_1.Direction.LEFT, childAnchor: Direction_1.Direction.TOP_RIGHT, tag: "idle", id: "playerarm", y: -2, sourceBounds: new Rect_1.Rect(0, 5, 12, 3) }, args));
    }
}
tslib_1.__decorate([
    Assets_1.asset("sprites/spacesuitarm.aseprite.json"),
    tslib_1.__metadata("design:type", Aseprite_1.Aseprite)
], PlayerArmNode, "sprite", void 0);
exports.PlayerArmNode = PlayerArmNode;


/***/ }),

/***/ "./lib/main/nodes/player/PlayerLegsNode.js":
/*!*************************************************!*\
  !*** ./lib/main/nodes/player/PlayerLegsNode.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerLegsNode = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const Aseprite_1 = __webpack_require__(/*! ../../../engine/assets/Aseprite */ "./lib/engine/assets/Aseprite.js");
const Assets_1 = __webpack_require__(/*! ../../../engine/assets/Assets */ "./lib/engine/assets/Assets.js");
const Direction_1 = __webpack_require__(/*! ../../../engine/geom/Direction */ "./lib/engine/geom/Direction.js");
const Rect_1 = __webpack_require__(/*! ../../../engine/geom/Rect */ "./lib/engine/geom/Rect.js");
const AsepriteNode_1 = __webpack_require__(/*! ../../../engine/scene/AsepriteNode */ "./lib/engine/scene/AsepriteNode.js");
class PlayerLegsNode extends AsepriteNode_1.AsepriteNode {
    constructor(args) {
        super(Object.assign({ aseprite: PlayerLegsNode.sprite, anchor: Direction_1.Direction.CENTER, tag: "idle", id: "playerlegs", sourceBounds: new Rect_1.Rect(10, 0, 0, 0) }, args));
    }
}
tslib_1.__decorate([
    Assets_1.asset("sprites/spacesuitlegs.aseprite.json"),
    tslib_1.__metadata("design:type", Aseprite_1.Aseprite)
], PlayerLegsNode, "sprite", void 0);
exports.PlayerLegsNode = PlayerLegsNode;


/***/ }),

/***/ "./lib/main/scenes/GameScene.js":
/*!**************************************!*\
  !*** ./lib/main/scenes/GameScene.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GameScene = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const Scene_1 = __webpack_require__(/*! ../../engine/scene/Scene */ "./lib/engine/scene/Scene.js");
const PlayerNode_1 = __webpack_require__(/*! ../nodes/PlayerNode */ "./lib/main/nodes/PlayerNode.js");
const Assets_1 = __webpack_require__(/*! ../../engine/assets/Assets */ "./lib/engine/assets/Assets.js");
const TiledMap_1 = __webpack_require__(/*! ../../engine/tiled/TiledMap */ "./lib/engine/tiled/TiledMap.js");
const TiledMapNode_1 = __webpack_require__(/*! ../../engine/scene/TiledMapNode */ "./lib/engine/scene/TiledMapNode.js");
const CollisionNode_1 = __webpack_require__(/*! ../nodes/CollisionNode */ "./lib/main/nodes/CollisionNode.js");
const TrainNode_1 = __webpack_require__(/*! ../nodes/TrainNode */ "./lib/main/nodes/TrainNode.js");
const LightNode_1 = __webpack_require__(/*! ../nodes/LightNode */ "./lib/main/nodes/LightNode.js");
const SwitchNode_1 = __webpack_require__(/*! ../nodes/SwitchNode */ "./lib/main/nodes/SwitchNode.js");
const constants_1 = __webpack_require__(/*! ../constants */ "./lib/main/constants.js");
const CameraLimitNode_1 = __webpack_require__(/*! ../nodes/CameraLimitNode */ "./lib/main/nodes/CameraLimitNode.js");
const DoorNode_1 = __webpack_require__(/*! ../nodes/DoorNode */ "./lib/main/nodes/DoorNode.js");
const env_1 = __webpack_require__(/*! ../../engine/util/env */ "./lib/engine/util/env.js");
const BitmapFont_1 = __webpack_require__(/*! ../../engine/assets/BitmapFont */ "./lib/engine/assets/BitmapFont.js");
const FpsCounterNode_1 = __webpack_require__(/*! ../../engine/scene/FpsCounterNode */ "./lib/engine/scene/FpsCounterNode.js");
const Direction_1 = __webpack_require__(/*! ../../engine/geom/Direction */ "./lib/engine/geom/Direction.js");
const MonsterNode_1 = __webpack_require__(/*! ../nodes/MonsterNode */ "./lib/main/nodes/MonsterNode.js");
const RatNode_1 = __webpack_require__(/*! ../nodes/RatNode */ "./lib/main/nodes/RatNode.js");
const CorpseNode_1 = __webpack_require__(/*! ../nodes/CorpseNode */ "./lib/main/nodes/CorpseNode.js");
const FuseboxNode_1 = __webpack_require__(/*! ../nodes/FuseboxNode */ "./lib/main/nodes/FuseboxNode.js");
const SoundNode_1 = __webpack_require__(/*! ../../engine/scene/SoundNode */ "./lib/engine/scene/SoundNode.js");
const Sound_1 = __webpack_require__(/*! ../../engine/assets/Sound */ "./lib/engine/assets/Sound.js");
const TiledSoundNode_1 = __webpack_require__(/*! ../nodes/TiledSoundNode */ "./lib/main/nodes/TiledSoundNode.js");
class GameScene extends Scene_1.Scene {
    constructor() {
        super(...arguments);
        this.debugMode = false;
        this.mapNode = new TiledMapNode_1.TiledMapNode({ map: GameScene.map, objects: {
                "collision": CollisionNode_1.CollisionNode,
                "player": PlayerNode_1.PlayerNode,
                "enemy": MonsterNode_1.MonsterNode,
                "rat": RatNode_1.RatNode,
                "train": TrainNode_1.TrainNode,
                "light": LightNode_1.LightNode,
                "cameraLimit": CameraLimitNode_1.CameraLimitNode,
                "door": DoorNode_1.DoorNode,
                "corpse": CorpseNode_1.CorpseNode,
                "powerswitch": SwitchNode_1.SwitchNode,
                "fusebox": FuseboxNode_1.FuseboxNode,
                "sound": TiledSoundNode_1.TiledSoundNode
            } });
    }
    setup() {
        this.mapNode.moveTo(0, 0).appendTo(this.rootNode).transform(m => m.scale(1));
        const player = this.mapNode.getDescendantById("Player");
        this.camera.setFollow(player);
        this.setLightLayers([constants_1.Layer.LIGHT]);
        this.setHudLayers([constants_1.Layer.HUD]);
        // const door = new DoorNode();
        // door.moveTo(1040, 380).setLocked(true).appendTo(this.mapNode);
        // new SwitchNode({ onlyOnce: false, onUpdate: (state) => door.setLocked(!state) }).moveTo(1130, 380).appendTo(this.mapNode);
        // new SwitchNode({ onlyOnce: true }).moveTo(250, 380).appendTo(this.mapNode);
        // Test enemies
        new MonsterNode_1.MonsterNode().moveTo(2400, 360).appendTo(this.mapNode);
        new MonsterNode_1.MonsterNode().moveTo(2500, 360).appendTo(this.mapNode);
        new MonsterNode_1.MonsterNode().moveTo(2800, 360).appendTo(this.mapNode);
        new SoundNode_1.SoundNode({ sound: GameScene.ambientFanSound, range: 300, intensity: 0.2 }).moveTo(2430, 355).appendTo(this.mapNode);
        if (env_1.isDev()) {
            this.rootNode.appendChild(new FpsCounterNode_1.FpsCounterNode({
                font: GameScene.font,
                anchor: Direction_1.Direction.TOP_LEFT,
                x: 10,
                y: 10,
                layer: constants_1.Layer.HUD
            }));
        }
        setTimeout(() => {
            this.game.setupScene();
        });
    }
    cleanup() {
        this.rootNode.clear();
    }
    activate() {
        if (env_1.isDev()) {
            this.game.keyboard.onKeyDown.connect(this.handleKeyDown, this);
            this.game.keyboard.onKeyUp.connect(this.handleKeyUp, this);
        }
    }
    deactivate() {
        if (env_1.isDev()) {
            this.game.keyboard.onKeyDown.disconnect(this.handleKeyDown, this);
            this.game.keyboard.onKeyUp.disconnect(this.handleKeyUp, this);
        }
    }
    handleKeyDown(event) {
        if (event.key === "Tab") {
            if (!event.repeat) {
                this.enterDebugMode();
            }
            event.preventDefault();
            event.stopPropagation();
        }
    }
    handleKeyUp(event) {
        if (event.key === "Tab") {
            if (!event.repeat) {
                this.leaveDebugMode();
            }
            event.preventDefault();
            event.stopPropagation();
        }
    }
    enterDebugMode() {
        if (!this.debugMode) {
            this.debugMode = true;
            const bounds = this.mapNode.getSceneBounds();
            const scale = Math.min(constants_1.GAME_WIDTH / bounds.width, constants_1.GAME_HEIGHT / bounds.height);
            this.camera.setFollow(null).setLimits(this.mapNode.getBounds().toRect()).moveTo(bounds.centerX, bounds.centerY).setZoom(scale);
            this.onPointerDown.connect(this.handleTeleportClick, this);
        }
    }
    leaveDebugMode() {
        if (this.debugMode) {
            const player = this.mapNode.getDescendantById("Player");
            if (player != null) {
                this.camera.setFollow(player).setZoom(1);
            }
            this.onPointerDown.disconnect(this.handleTeleportClick, this);
            this.debugMode = false;
        }
    }
    handleTeleportClick(event) {
        const player = this.mapNode.getDescendantById("Player");
        if (player != null) {
            player.moveTo(event.getX(), event.getY());
        }
    }
}
tslib_1.__decorate([
    Assets_1.asset(constants_1.STANDARD_FONT),
    tslib_1.__metadata("design:type", BitmapFont_1.BitmapFont)
], GameScene, "font", void 0);
tslib_1.__decorate([
    Assets_1.asset("map/hyperloopMap.tiledmap.json"),
    tslib_1.__metadata("design:type", TiledMap_1.TiledMap)
], GameScene, "map", void 0);
tslib_1.__decorate([
    Assets_1.asset("sounds/loops/loop_fan.mp3"),
    tslib_1.__metadata("design:type", Sound_1.Sound)
], GameScene, "ambientFanSound", void 0);
exports.GameScene = GameScene;


/***/ }),

/***/ "./lib/main/scenes/LoadingScene.js":
/*!*****************************************!*\
  !*** ./lib/main/scenes/LoadingScene.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingScene = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const Scene_1 = __webpack_require__(/*! ../../engine/scene/Scene */ "./lib/engine/scene/Scene.js");
const ProgressBarNode_1 = __webpack_require__(/*! ../../engine/scene/ProgressBarNode */ "./lib/engine/scene/ProgressBarNode.js");
const TitleScene_1 = __webpack_require__(/*! ./TitleScene */ "./lib/main/scenes/TitleScene.js");
class LoadingScene extends Scene_1.Scene {
    setup() {
        this.progressBar = new ProgressBarNode_1.ProgressBarNode({
            x: this.game.width >> 1,
            y: this.game.height >> 1
        }).appendTo(this.rootNode);
    }
    cleanup() {
        this.rootNode.clear();
    }
    activate() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.game.assets.load(this.updateProgress.bind(this));
            this.game.scenes.setScene(TitleScene_1.TitleScene);
        });
    }
    updateProgress(total, loaded) {
        if (loaded < total) {
            this.progressBar.setProgress(loaded / total);
        }
        else {
            this.progressBar.remove();
        }
    }
}
exports.LoadingScene = LoadingScene;


/***/ }),

/***/ "./lib/main/scenes/TitleScene.js":
/*!***************************************!*\
  !*** ./lib/main/scenes/TitleScene.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TitleScene = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.js");
const Scene_1 = __webpack_require__(/*! ../../engine/scene/Scene */ "./lib/engine/scene/Scene.js");
const constants_1 = __webpack_require__(/*! ../constants */ "./lib/main/constants.js");
const TextNode_1 = __webpack_require__(/*! ../../engine/scene/TextNode */ "./lib/engine/scene/TextNode.js");
const BitmapFont_1 = __webpack_require__(/*! ../../engine/assets/BitmapFont */ "./lib/engine/assets/BitmapFont.js");
const Assets_1 = __webpack_require__(/*! ../../engine/assets/Assets */ "./lib/engine/assets/Assets.js");
const Direction_1 = __webpack_require__(/*! ../../engine/geom/Direction */ "./lib/engine/geom/Direction.js");
const ImageNode_1 = __webpack_require__(/*! ../../engine/scene/ImageNode */ "./lib/engine/scene/ImageNode.js");
const GameScene_1 = __webpack_require__(/*! ./GameScene */ "./lib/main/scenes/GameScene.js");
const Sound_1 = __webpack_require__(/*! ../../engine/assets/Sound */ "./lib/engine/assets/Sound.js");
const ControllerIntent_1 = __webpack_require__(/*! ../../engine/input/ControllerIntent */ "./lib/engine/input/ControllerIntent.js");
class TitleScene extends Scene_1.Scene {
    constructor() {
        super(...arguments);
        this.imageNode = new ImageNode_1.ImageNode({ image: TitleScene.titleImage, anchor: Direction_1.Direction.TOP_LEFT });
        this.textNode = new TextNode_1.TextNode({ font: TitleScene.font, anchor: Direction_1.Direction.BOTTOM });
    }
    setup() {
        this.imageNode.appendTo(this.rootNode);
        this.textNode
            .setText("PRESS ENTER TO START")
            .moveTo(constants_1.GAME_WIDTH / 2, constants_1.GAME_HEIGHT - 64)
            .appendTo(this.rootNode);
        TitleScene.bgm.setLoop(true);
        TitleScene.bgm.play();
    }
    cleanup() {
        this.rootNode.clear();
    }
    startGame() {
        this.game.scenes.setScene(GameScene_1.GameScene);
    }
    update(dt, time) {
        super.update(dt, time);
        const input = this.game.input;
        if (input.currentActiveIntents & ControllerIntent_1.ControllerIntent.CONFIRM) {
            this.startGame();
        }
    }
}
tslib_1.__decorate([
    Assets_1.asset(constants_1.STANDARD_FONT),
    tslib_1.__metadata("design:type", BitmapFont_1.BitmapFont)
], TitleScene, "font", void 0);
tslib_1.__decorate([
    Assets_1.asset("images/title-image.png"),
    tslib_1.__metadata("design:type", HTMLImageElement)
], TitleScene, "titleImage", void 0);
tslib_1.__decorate([
    Assets_1.asset("music/01-riding-the-hyperloop.ogg"),
    tslib_1.__metadata("design:type", Sound_1.Sound)
], TitleScene, "bgm", void 0);
exports.TitleScene = TitleScene;


/***/ }),

/***/ "./node_modules/base64-js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ "./node_modules/pako/index.js":
/*!************************************!*\
  !*** ./node_modules/pako/index.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Top level file is just a mixin of submodules & constants


var assign    = __webpack_require__(/*! ./lib/utils/common */ "./node_modules/pako/lib/utils/common.js").assign;

var deflate   = __webpack_require__(/*! ./lib/deflate */ "./node_modules/pako/lib/deflate.js");
var inflate   = __webpack_require__(/*! ./lib/inflate */ "./node_modules/pako/lib/inflate.js");
var constants = __webpack_require__(/*! ./lib/zlib/constants */ "./node_modules/pako/lib/zlib/constants.js");

var pako = {};

assign(pako, deflate, inflate, constants);

module.exports = pako;


/***/ }),

/***/ "./node_modules/pako/lib/deflate.js":
/*!******************************************!*\
  !*** ./node_modules/pako/lib/deflate.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



var zlib_deflate = __webpack_require__(/*! ./zlib/deflate */ "./node_modules/pako/lib/zlib/deflate.js");
var utils        = __webpack_require__(/*! ./utils/common */ "./node_modules/pako/lib/utils/common.js");
var strings      = __webpack_require__(/*! ./utils/strings */ "./node_modules/pako/lib/utils/strings.js");
var msg          = __webpack_require__(/*! ./zlib/messages */ "./node_modules/pako/lib/zlib/messages.js");
var ZStream      = __webpack_require__(/*! ./zlib/zstream */ "./node_modules/pako/lib/zlib/zstream.js");

var toString = Object.prototype.toString;

/* Public constants ==========================================================*/
/* ===========================================================================*/

var Z_NO_FLUSH      = 0;
var Z_FINISH        = 4;

var Z_OK            = 0;
var Z_STREAM_END    = 1;
var Z_SYNC_FLUSH    = 2;

var Z_DEFAULT_COMPRESSION = -1;

var Z_DEFAULT_STRATEGY    = 0;

var Z_DEFLATED  = 8;

/* ===========================================================================*/


/**
 * class Deflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[deflate]],
 * [[deflateRaw]] and [[gzip]].
 **/

/* internal
 * Deflate.chunks -> Array
 *
 * Chunks of output data, if [[Deflate#onData]] not overridden.
 **/

/**
 * Deflate.result -> Uint8Array|Array
 *
 * Compressed result, generated by default [[Deflate#onData]]
 * and [[Deflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Deflate#push]] with `Z_FINISH` / `true` param)  or if you
 * push a chunk with explicit flush (call [[Deflate#push]] with
 * `Z_SYNC_FLUSH` param).
 **/

/**
 * Deflate.err -> Number
 *
 * Error code after deflate finished. 0 (Z_OK) on success.
 * You will not need it in real life, because deflate errors
 * are possible only on wrong options or bad `onData` / `onEnd`
 * custom handlers.
 **/

/**
 * Deflate.msg -> String
 *
 * Error message, if [[Deflate.err]] != 0
 **/


/**
 * new Deflate(options)
 * - options (Object): zlib deflate options.
 *
 * Creates new deflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `level`
 * - `windowBits`
 * - `memLevel`
 * - `strategy`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw deflate
 * - `gzip` (Boolean) - create gzip wrapper
 * - `to` (String) - if equal to 'string', then result will be "binary string"
 *    (each char code [0..255])
 * - `header` (Object) - custom header for gzip
 *   - `text` (Boolean) - true if compressed data believed to be text
 *   - `time` (Number) - modification time, unix timestamp
 *   - `os` (Number) - operation system code
 *   - `extra` (Array) - array of bytes with extra data (max 65536)
 *   - `name` (String) - file name (binary string)
 *   - `comment` (String) - comment (binary string)
 *   - `hcrc` (Boolean) - true if header crc should be added
 *
 * ##### Example:
 *
 * ```javascript
 * var pako = require('pako')
 *   , chunk1 = Uint8Array([1,2,3,4,5,6,7,8,9])
 *   , chunk2 = Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * var deflate = new pako.Deflate({ level: 3});
 *
 * deflate.push(chunk1, false);
 * deflate.push(chunk2, true);  // true -> last chunk
 *
 * if (deflate.err) { throw new Error(deflate.err); }
 *
 * console.log(deflate.result);
 * ```
 **/
function Deflate(options) {
  if (!(this instanceof Deflate)) return new Deflate(options);

  this.options = utils.assign({
    level: Z_DEFAULT_COMPRESSION,
    method: Z_DEFLATED,
    chunkSize: 16384,
    windowBits: 15,
    memLevel: 8,
    strategy: Z_DEFAULT_STRATEGY,
    to: ''
  }, options || {});

  var opt = this.options;

  if (opt.raw && (opt.windowBits > 0)) {
    opt.windowBits = -opt.windowBits;
  }

  else if (opt.gzip && (opt.windowBits > 0) && (opt.windowBits < 16)) {
    opt.windowBits += 16;
  }

  this.err    = 0;      // error code, if happens (0 = Z_OK)
  this.msg    = '';     // error message
  this.ended  = false;  // used to avoid multiple onEnd() calls
  this.chunks = [];     // chunks of compressed data

  this.strm = new ZStream();
  this.strm.avail_out = 0;

  var status = zlib_deflate.deflateInit2(
    this.strm,
    opt.level,
    opt.method,
    opt.windowBits,
    opt.memLevel,
    opt.strategy
  );

  if (status !== Z_OK) {
    throw new Error(msg[status]);
  }

  if (opt.header) {
    zlib_deflate.deflateSetHeader(this.strm, opt.header);
  }

  if (opt.dictionary) {
    var dict;
    // Convert data if needed
    if (typeof opt.dictionary === 'string') {
      // If we need to compress text, change encoding to utf8.
      dict = strings.string2buf(opt.dictionary);
    } else if (toString.call(opt.dictionary) === '[object ArrayBuffer]') {
      dict = new Uint8Array(opt.dictionary);
    } else {
      dict = opt.dictionary;
    }

    status = zlib_deflate.deflateSetDictionary(this.strm, dict);

    if (status !== Z_OK) {
      throw new Error(msg[status]);
    }

    this._dict_set = true;
  }
}

/**
 * Deflate#push(data[, mode]) -> Boolean
 * - data (Uint8Array|Array|ArrayBuffer|String): input data. Strings will be
 *   converted to utf8 byte sequence.
 * - mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
 *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.
 *
 * Sends input data to deflate pipe, generating [[Deflate#onData]] calls with
 * new compressed chunks. Returns `true` on success. The last data block must have
 * mode Z_FINISH (or `true`). That will flush internal pending buffers and call
 * [[Deflate#onEnd]]. For interim explicit flushes (without ending the stream) you
 * can use mode Z_SYNC_FLUSH, keeping the compression context.
 *
 * On fail call [[Deflate#onEnd]] with error code and return false.
 *
 * We strongly recommend to use `Uint8Array` on input for best speed (output
 * array format is detected automatically). Also, don't skip last param and always
 * use the same type in your code (boolean or number). That will improve JS speed.
 *
 * For regular `Array`-s make sure all elements are [0..255].
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/
Deflate.prototype.push = function (data, mode) {
  var strm = this.strm;
  var chunkSize = this.options.chunkSize;
  var status, _mode;

  if (this.ended) { return false; }

  _mode = (mode === ~~mode) ? mode : ((mode === true) ? Z_FINISH : Z_NO_FLUSH);

  // Convert data if needed
  if (typeof data === 'string') {
    // If we need to compress text, change encoding to utf8.
    strm.input = strings.string2buf(data);
  } else if (toString.call(data) === '[object ArrayBuffer]') {
    strm.input = new Uint8Array(data);
  } else {
    strm.input = data;
  }

  strm.next_in = 0;
  strm.avail_in = strm.input.length;

  do {
    if (strm.avail_out === 0) {
      strm.output = new utils.Buf8(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }
    status = zlib_deflate.deflate(strm, _mode);    /* no bad return value */

    if (status !== Z_STREAM_END && status !== Z_OK) {
      this.onEnd(status);
      this.ended = true;
      return false;
    }
    if (strm.avail_out === 0 || (strm.avail_in === 0 && (_mode === Z_FINISH || _mode === Z_SYNC_FLUSH))) {
      if (this.options.to === 'string') {
        this.onData(strings.buf2binstring(utils.shrinkBuf(strm.output, strm.next_out)));
      } else {
        this.onData(utils.shrinkBuf(strm.output, strm.next_out));
      }
    }
  } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== Z_STREAM_END);

  // Finalize on the last chunk.
  if (_mode === Z_FINISH) {
    status = zlib_deflate.deflateEnd(this.strm);
    this.onEnd(status);
    this.ended = true;
    return status === Z_OK;
  }

  // callback interim results if Z_SYNC_FLUSH.
  if (_mode === Z_SYNC_FLUSH) {
    this.onEnd(Z_OK);
    strm.avail_out = 0;
    return true;
  }

  return true;
};


/**
 * Deflate#onData(chunk) -> Void
 * - chunk (Uint8Array|Array|String): output data. Type of array depends
 *   on js engine support. When string output requested, each chunk
 *   will be string.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/
Deflate.prototype.onData = function (chunk) {
  this.chunks.push(chunk);
};


/**
 * Deflate#onEnd(status) -> Void
 * - status (Number): deflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called once after you tell deflate that the input stream is
 * complete (Z_FINISH) or should be flushed (Z_SYNC_FLUSH)
 * or if an error happened. By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/
Deflate.prototype.onEnd = function (status) {
  // On success - join
  if (status === Z_OK) {
    if (this.options.to === 'string') {
      this.result = this.chunks.join('');
    } else {
      this.result = utils.flattenChunks(this.chunks);
    }
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};


/**
 * deflate(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * Compress `data` with deflate algorithm and `options`.
 *
 * Supported options are:
 *
 * - level
 * - windowBits
 * - memLevel
 * - strategy
 * - dictionary
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Sugar (options):
 *
 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
 *   negative windowBits implicitly.
 * - `to` (String) - if equal to 'string', then result will be "binary string"
 *    (each char code [0..255])
 *
 * ##### Example:
 *
 * ```javascript
 * var pako = require('pako')
 *   , data = Uint8Array([1,2,3,4,5,6,7,8,9]);
 *
 * console.log(pako.deflate(data));
 * ```
 **/
function deflate(input, options) {
  var deflator = new Deflate(options);

  deflator.push(input, true);

  // That will never happens, if you don't cheat with options :)
  if (deflator.err) { throw deflator.msg || msg[deflator.err]; }

  return deflator.result;
}


/**
 * deflateRaw(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * The same as [[deflate]], but creates raw data, without wrapper
 * (header and adler32 crc).
 **/
function deflateRaw(input, options) {
  options = options || {};
  options.raw = true;
  return deflate(input, options);
}


/**
 * gzip(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * The same as [[deflate]], but create gzip wrapper instead of
 * deflate one.
 **/
function gzip(input, options) {
  options = options || {};
  options.gzip = true;
  return deflate(input, options);
}


exports.Deflate = Deflate;
exports.deflate = deflate;
exports.deflateRaw = deflateRaw;
exports.gzip = gzip;


/***/ }),

/***/ "./node_modules/pako/lib/inflate.js":
/*!******************************************!*\
  !*** ./node_modules/pako/lib/inflate.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



var zlib_inflate = __webpack_require__(/*! ./zlib/inflate */ "./node_modules/pako/lib/zlib/inflate.js");
var utils        = __webpack_require__(/*! ./utils/common */ "./node_modules/pako/lib/utils/common.js");
var strings      = __webpack_require__(/*! ./utils/strings */ "./node_modules/pako/lib/utils/strings.js");
var c            = __webpack_require__(/*! ./zlib/constants */ "./node_modules/pako/lib/zlib/constants.js");
var msg          = __webpack_require__(/*! ./zlib/messages */ "./node_modules/pako/lib/zlib/messages.js");
var ZStream      = __webpack_require__(/*! ./zlib/zstream */ "./node_modules/pako/lib/zlib/zstream.js");
var GZheader     = __webpack_require__(/*! ./zlib/gzheader */ "./node_modules/pako/lib/zlib/gzheader.js");

var toString = Object.prototype.toString;

/**
 * class Inflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[inflate]]
 * and [[inflateRaw]].
 **/

/* internal
 * inflate.chunks -> Array
 *
 * Chunks of output data, if [[Inflate#onData]] not overridden.
 **/

/**
 * Inflate.result -> Uint8Array|Array|String
 *
 * Uncompressed result, generated by default [[Inflate#onData]]
 * and [[Inflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Inflate#push]] with `Z_FINISH` / `true` param) or if you
 * push a chunk with explicit flush (call [[Inflate#push]] with
 * `Z_SYNC_FLUSH` param).
 **/

/**
 * Inflate.err -> Number
 *
 * Error code after inflate finished. 0 (Z_OK) on success.
 * Should be checked if broken data possible.
 **/

/**
 * Inflate.msg -> String
 *
 * Error message, if [[Inflate.err]] != 0
 **/


/**
 * new Inflate(options)
 * - options (Object): zlib inflate options.
 *
 * Creates new inflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `windowBits`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw inflate
 * - `to` (String) - if equal to 'string', then result will be converted
 *   from utf8 to utf16 (javascript) string. When string output requested,
 *   chunk length can differ from `chunkSize`, depending on content.
 *
 * By default, when no options set, autodetect deflate/gzip data format via
 * wrapper header.
 *
 * ##### Example:
 *
 * ```javascript
 * var pako = require('pako')
 *   , chunk1 = Uint8Array([1,2,3,4,5,6,7,8,9])
 *   , chunk2 = Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * var inflate = new pako.Inflate({ level: 3});
 *
 * inflate.push(chunk1, false);
 * inflate.push(chunk2, true);  // true -> last chunk
 *
 * if (inflate.err) { throw new Error(inflate.err); }
 *
 * console.log(inflate.result);
 * ```
 **/
function Inflate(options) {
  if (!(this instanceof Inflate)) return new Inflate(options);

  this.options = utils.assign({
    chunkSize: 16384,
    windowBits: 0,
    to: ''
  }, options || {});

  var opt = this.options;

  // Force window size for `raw` data, if not set directly,
  // because we have no header for autodetect.
  if (opt.raw && (opt.windowBits >= 0) && (opt.windowBits < 16)) {
    opt.windowBits = -opt.windowBits;
    if (opt.windowBits === 0) { opt.windowBits = -15; }
  }

  // If `windowBits` not defined (and mode not raw) - set autodetect flag for gzip/deflate
  if ((opt.windowBits >= 0) && (opt.windowBits < 16) &&
      !(options && options.windowBits)) {
    opt.windowBits += 32;
  }

  // Gzip header has no info about windows size, we can do autodetect only
  // for deflate. So, if window size not set, force it to max when gzip possible
  if ((opt.windowBits > 15) && (opt.windowBits < 48)) {
    // bit 3 (16) -> gzipped data
    // bit 4 (32) -> autodetect gzip/deflate
    if ((opt.windowBits & 15) === 0) {
      opt.windowBits |= 15;
    }
  }

  this.err    = 0;      // error code, if happens (0 = Z_OK)
  this.msg    = '';     // error message
  this.ended  = false;  // used to avoid multiple onEnd() calls
  this.chunks = [];     // chunks of compressed data

  this.strm   = new ZStream();
  this.strm.avail_out = 0;

  var status  = zlib_inflate.inflateInit2(
    this.strm,
    opt.windowBits
  );

  if (status !== c.Z_OK) {
    throw new Error(msg[status]);
  }

  this.header = new GZheader();

  zlib_inflate.inflateGetHeader(this.strm, this.header);

  // Setup dictionary
  if (opt.dictionary) {
    // Convert data if needed
    if (typeof opt.dictionary === 'string') {
      opt.dictionary = strings.string2buf(opt.dictionary);
    } else if (toString.call(opt.dictionary) === '[object ArrayBuffer]') {
      opt.dictionary = new Uint8Array(opt.dictionary);
    }
    if (opt.raw) { //In raw mode we need to set the dictionary early
      status = zlib_inflate.inflateSetDictionary(this.strm, opt.dictionary);
      if (status !== c.Z_OK) {
        throw new Error(msg[status]);
      }
    }
  }
}

/**
 * Inflate#push(data[, mode]) -> Boolean
 * - data (Uint8Array|Array|ArrayBuffer|String): input data
 * - mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
 *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.
 *
 * Sends input data to inflate pipe, generating [[Inflate#onData]] calls with
 * new output chunks. Returns `true` on success. The last data block must have
 * mode Z_FINISH (or `true`). That will flush internal pending buffers and call
 * [[Inflate#onEnd]]. For interim explicit flushes (without ending the stream) you
 * can use mode Z_SYNC_FLUSH, keeping the decompression context.
 *
 * On fail call [[Inflate#onEnd]] with error code and return false.
 *
 * We strongly recommend to use `Uint8Array` on input for best speed (output
 * format is detected automatically). Also, don't skip last param and always
 * use the same type in your code (boolean or number). That will improve JS speed.
 *
 * For regular `Array`-s make sure all elements are [0..255].
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/
Inflate.prototype.push = function (data, mode) {
  var strm = this.strm;
  var chunkSize = this.options.chunkSize;
  var dictionary = this.options.dictionary;
  var status, _mode;
  var next_out_utf8, tail, utf8str;

  // Flag to properly process Z_BUF_ERROR on testing inflate call
  // when we check that all output data was flushed.
  var allowBufError = false;

  if (this.ended) { return false; }
  _mode = (mode === ~~mode) ? mode : ((mode === true) ? c.Z_FINISH : c.Z_NO_FLUSH);

  // Convert data if needed
  if (typeof data === 'string') {
    // Only binary strings can be decompressed on practice
    strm.input = strings.binstring2buf(data);
  } else if (toString.call(data) === '[object ArrayBuffer]') {
    strm.input = new Uint8Array(data);
  } else {
    strm.input = data;
  }

  strm.next_in = 0;
  strm.avail_in = strm.input.length;

  do {
    if (strm.avail_out === 0) {
      strm.output = new utils.Buf8(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }

    status = zlib_inflate.inflate(strm, c.Z_NO_FLUSH);    /* no bad return value */

    if (status === c.Z_NEED_DICT && dictionary) {
      status = zlib_inflate.inflateSetDictionary(this.strm, dictionary);
    }

    if (status === c.Z_BUF_ERROR && allowBufError === true) {
      status = c.Z_OK;
      allowBufError = false;
    }

    if (status !== c.Z_STREAM_END && status !== c.Z_OK) {
      this.onEnd(status);
      this.ended = true;
      return false;
    }

    if (strm.next_out) {
      if (strm.avail_out === 0 || status === c.Z_STREAM_END || (strm.avail_in === 0 && (_mode === c.Z_FINISH || _mode === c.Z_SYNC_FLUSH))) {

        if (this.options.to === 'string') {

          next_out_utf8 = strings.utf8border(strm.output, strm.next_out);

          tail = strm.next_out - next_out_utf8;
          utf8str = strings.buf2string(strm.output, next_out_utf8);

          // move tail
          strm.next_out = tail;
          strm.avail_out = chunkSize - tail;
          if (tail) { utils.arraySet(strm.output, strm.output, next_out_utf8, tail, 0); }

          this.onData(utf8str);

        } else {
          this.onData(utils.shrinkBuf(strm.output, strm.next_out));
        }
      }
    }

    // When no more input data, we should check that internal inflate buffers
    // are flushed. The only way to do it when avail_out = 0 - run one more
    // inflate pass. But if output data not exists, inflate return Z_BUF_ERROR.
    // Here we set flag to process this error properly.
    //
    // NOTE. Deflate does not return error in this case and does not needs such
    // logic.
    if (strm.avail_in === 0 && strm.avail_out === 0) {
      allowBufError = true;
    }

  } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== c.Z_STREAM_END);

  if (status === c.Z_STREAM_END) {
    _mode = c.Z_FINISH;
  }

  // Finalize on the last chunk.
  if (_mode === c.Z_FINISH) {
    status = zlib_inflate.inflateEnd(this.strm);
    this.onEnd(status);
    this.ended = true;
    return status === c.Z_OK;
  }

  // callback interim results if Z_SYNC_FLUSH.
  if (_mode === c.Z_SYNC_FLUSH) {
    this.onEnd(c.Z_OK);
    strm.avail_out = 0;
    return true;
  }

  return true;
};


/**
 * Inflate#onData(chunk) -> Void
 * - chunk (Uint8Array|Array|String): output data. Type of array depends
 *   on js engine support. When string output requested, each chunk
 *   will be string.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/
Inflate.prototype.onData = function (chunk) {
  this.chunks.push(chunk);
};


/**
 * Inflate#onEnd(status) -> Void
 * - status (Number): inflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called either after you tell inflate that the input stream is
 * complete (Z_FINISH) or should be flushed (Z_SYNC_FLUSH)
 * or if an error happened. By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/
Inflate.prototype.onEnd = function (status) {
  // On success - join
  if (status === c.Z_OK) {
    if (this.options.to === 'string') {
      // Glue & convert here, until we teach pako to send
      // utf8 aligned strings to onData
      this.result = this.chunks.join('');
    } else {
      this.result = utils.flattenChunks(this.chunks);
    }
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};


/**
 * inflate(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * Decompress `data` with inflate/ungzip and `options`. Autodetect
 * format via wrapper header by default. That's why we don't provide
 * separate `ungzip` method.
 *
 * Supported options are:
 *
 * - windowBits
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information.
 *
 * Sugar (options):
 *
 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
 *   negative windowBits implicitly.
 * - `to` (String) - if equal to 'string', then result will be converted
 *   from utf8 to utf16 (javascript) string. When string output requested,
 *   chunk length can differ from `chunkSize`, depending on content.
 *
 *
 * ##### Example:
 *
 * ```javascript
 * var pako = require('pako')
 *   , input = pako.deflate([1,2,3,4,5,6,7,8,9])
 *   , output;
 *
 * try {
 *   output = pako.inflate(input);
 * } catch (err)
 *   console.log(err);
 * }
 * ```
 **/
function inflate(input, options) {
  var inflator = new Inflate(options);

  inflator.push(input, true);

  // That will never happens, if you don't cheat with options :)
  if (inflator.err) { throw inflator.msg || msg[inflator.err]; }

  return inflator.result;
}


/**
 * inflateRaw(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * The same as [[inflate]], but creates raw data, without wrapper
 * (header and adler32 crc).
 **/
function inflateRaw(input, options) {
  options = options || {};
  options.raw = true;
  return inflate(input, options);
}


/**
 * ungzip(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * Just shortcut to [[inflate]], because it autodetects format
 * by header.content. Done for convenience.
 **/


exports.Inflate = Inflate;
exports.inflate = inflate;
exports.inflateRaw = inflateRaw;
exports.ungzip  = inflate;


/***/ }),

/***/ "./node_modules/pako/lib/utils/common.js":
/*!***********************************************!*\
  !*** ./node_modules/pako/lib/utils/common.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



var TYPED_OK =  (typeof Uint8Array !== 'undefined') &&
                (typeof Uint16Array !== 'undefined') &&
                (typeof Int32Array !== 'undefined');

function _has(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

exports.assign = function (obj /*from1, from2, from3, ...*/) {
  var sources = Array.prototype.slice.call(arguments, 1);
  while (sources.length) {
    var source = sources.shift();
    if (!source) { continue; }

    if (typeof source !== 'object') {
      throw new TypeError(source + 'must be non-object');
    }

    for (var p in source) {
      if (_has(source, p)) {
        obj[p] = source[p];
      }
    }
  }

  return obj;
};


// reduce buffer size, avoiding mem copy
exports.shrinkBuf = function (buf, size) {
  if (buf.length === size) { return buf; }
  if (buf.subarray) { return buf.subarray(0, size); }
  buf.length = size;
  return buf;
};


var fnTyped = {
  arraySet: function (dest, src, src_offs, len, dest_offs) {
    if (src.subarray && dest.subarray) {
      dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
      return;
    }
    // Fallback to ordinary array
    for (var i = 0; i < len; i++) {
      dest[dest_offs + i] = src[src_offs + i];
    }
  },
  // Join array of chunks to single array.
  flattenChunks: function (chunks) {
    var i, l, len, pos, chunk, result;

    // calculate data length
    len = 0;
    for (i = 0, l = chunks.length; i < l; i++) {
      len += chunks[i].length;
    }

    // join chunks
    result = new Uint8Array(len);
    pos = 0;
    for (i = 0, l = chunks.length; i < l; i++) {
      chunk = chunks[i];
      result.set(chunk, pos);
      pos += chunk.length;
    }

    return result;
  }
};

var fnUntyped = {
  arraySet: function (dest, src, src_offs, len, dest_offs) {
    for (var i = 0; i < len; i++) {
      dest[dest_offs + i] = src[src_offs + i];
    }
  },
  // Join array of chunks to single array.
  flattenChunks: function (chunks) {
    return [].concat.apply([], chunks);
  }
};


// Enable/Disable typed arrays use, for testing
//
exports.setTyped = function (on) {
  if (on) {
    exports.Buf8  = Uint8Array;
    exports.Buf16 = Uint16Array;
    exports.Buf32 = Int32Array;
    exports.assign(exports, fnTyped);
  } else {
    exports.Buf8  = Array;
    exports.Buf16 = Array;
    exports.Buf32 = Array;
    exports.assign(exports, fnUntyped);
  }
};

exports.setTyped(TYPED_OK);


/***/ }),

/***/ "./node_modules/pako/lib/utils/strings.js":
/*!************************************************!*\
  !*** ./node_modules/pako/lib/utils/strings.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// String encode/decode helpers



var utils = __webpack_require__(/*! ./common */ "./node_modules/pako/lib/utils/common.js");


// Quick check if we can use fast array to bin string conversion
//
// - apply(Array) can fail on Android 2.2
// - apply(Uint8Array) can fail on iOS 5.1 Safari
//
var STR_APPLY_OK = true;
var STR_APPLY_UIA_OK = true;

try { String.fromCharCode.apply(null, [ 0 ]); } catch (__) { STR_APPLY_OK = false; }
try { String.fromCharCode.apply(null, new Uint8Array(1)); } catch (__) { STR_APPLY_UIA_OK = false; }


// Table with utf8 lengths (calculated by first byte of sequence)
// Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
// because max possible codepoint is 0x10ffff
var _utf8len = new utils.Buf8(256);
for (var q = 0; q < 256; q++) {
  _utf8len[q] = (q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1);
}
_utf8len[254] = _utf8len[254] = 1; // Invalid sequence start


// convert string to array (typed, when possible)
exports.string2buf = function (str) {
  var buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;

  // count binary size
  for (m_pos = 0; m_pos < str_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 0xfc00) === 0xdc00) {
        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
        m_pos++;
      }
    }
    buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
  }

  // allocate buffer
  buf = new utils.Buf8(buf_len);

  // convert
  for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 0xfc00) === 0xdc00) {
        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
        m_pos++;
      }
    }
    if (c < 0x80) {
      /* one byte */
      buf[i++] = c;
    } else if (c < 0x800) {
      /* two bytes */
      buf[i++] = 0xC0 | (c >>> 6);
      buf[i++] = 0x80 | (c & 0x3f);
    } else if (c < 0x10000) {
      /* three bytes */
      buf[i++] = 0xE0 | (c >>> 12);
      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
      buf[i++] = 0x80 | (c & 0x3f);
    } else {
      /* four bytes */
      buf[i++] = 0xf0 | (c >>> 18);
      buf[i++] = 0x80 | (c >>> 12 & 0x3f);
      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
      buf[i++] = 0x80 | (c & 0x3f);
    }
  }

  return buf;
};

// Helper (used in 2 places)
function buf2binstring(buf, len) {
  // On Chrome, the arguments in a function call that are allowed is `65534`.
  // If the length of the buffer is smaller than that, we can use this optimization,
  // otherwise we will take a slower path.
  if (len < 65534) {
    if ((buf.subarray && STR_APPLY_UIA_OK) || (!buf.subarray && STR_APPLY_OK)) {
      return String.fromCharCode.apply(null, utils.shrinkBuf(buf, len));
    }
  }

  var result = '';
  for (var i = 0; i < len; i++) {
    result += String.fromCharCode(buf[i]);
  }
  return result;
}


// Convert byte array to binary string
exports.buf2binstring = function (buf) {
  return buf2binstring(buf, buf.length);
};


// Convert binary string (typed, when possible)
exports.binstring2buf = function (str) {
  var buf = new utils.Buf8(str.length);
  for (var i = 0, len = buf.length; i < len; i++) {
    buf[i] = str.charCodeAt(i);
  }
  return buf;
};


// convert array to string
exports.buf2string = function (buf, max) {
  var i, out, c, c_len;
  var len = max || buf.length;

  // Reserve max possible length (2 words per char)
  // NB: by unknown reasons, Array is significantly faster for
  //     String.fromCharCode.apply than Uint16Array.
  var utf16buf = new Array(len * 2);

  for (out = 0, i = 0; i < len;) {
    c = buf[i++];
    // quick process ascii
    if (c < 0x80) { utf16buf[out++] = c; continue; }

    c_len = _utf8len[c];
    // skip 5 & 6 byte codes
    if (c_len > 4) { utf16buf[out++] = 0xfffd; i += c_len - 1; continue; }

    // apply mask on first byte
    c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
    // join the rest
    while (c_len > 1 && i < len) {
      c = (c << 6) | (buf[i++] & 0x3f);
      c_len--;
    }

    // terminated by end of string?
    if (c_len > 1) { utf16buf[out++] = 0xfffd; continue; }

    if (c < 0x10000) {
      utf16buf[out++] = c;
    } else {
      c -= 0x10000;
      utf16buf[out++] = 0xd800 | ((c >> 10) & 0x3ff);
      utf16buf[out++] = 0xdc00 | (c & 0x3ff);
    }
  }

  return buf2binstring(utf16buf, out);
};


// Calculate max possible position in utf8 buffer,
// that will not break sequence. If that's not possible
// - (very small limits) return max size as is.
//
// buf[] - utf8 bytes array
// max   - length limit (mandatory);
exports.utf8border = function (buf, max) {
  var pos;

  max = max || buf.length;
  if (max > buf.length) { max = buf.length; }

  // go back from last position, until start of sequence found
  pos = max - 1;
  while (pos >= 0 && (buf[pos] & 0xC0) === 0x80) { pos--; }

  // Very small and broken sequence,
  // return max, because we should return something anyway.
  if (pos < 0) { return max; }

  // If we came to start of buffer - that means buffer is too small,
  // return max too.
  if (pos === 0) { return max; }

  return (pos + _utf8len[buf[pos]] > max) ? pos : max;
};


/***/ }),

/***/ "./node_modules/pako/lib/zlib/adler32.js":
/*!***********************************************!*\
  !*** ./node_modules/pako/lib/zlib/adler32.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Note: adler32 takes 12% for level 0 and 2% for level 6.
// It isn't worth it to make additional optimizations as in original.
// Small size is preferable.

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

function adler32(adler, buf, len, pos) {
  var s1 = (adler & 0xffff) |0,
      s2 = ((adler >>> 16) & 0xffff) |0,
      n = 0;

  while (len !== 0) {
    // Set limit ~ twice less than 5552, to keep
    // s2 in 31-bits, because we force signed ints.
    // in other case %= will fail.
    n = len > 2000 ? 2000 : len;
    len -= n;

    do {
      s1 = (s1 + buf[pos++]) |0;
      s2 = (s2 + s1) |0;
    } while (--n);

    s1 %= 65521;
    s2 %= 65521;
  }

  return (s1 | (s2 << 16)) |0;
}


module.exports = adler32;


/***/ }),

/***/ "./node_modules/pako/lib/zlib/constants.js":
/*!*************************************************!*\
  !*** ./node_modules/pako/lib/zlib/constants.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

module.exports = {

  /* Allowed flush values; see deflate() and inflate() below for details */
  Z_NO_FLUSH:         0,
  Z_PARTIAL_FLUSH:    1,
  Z_SYNC_FLUSH:       2,
  Z_FULL_FLUSH:       3,
  Z_FINISH:           4,
  Z_BLOCK:            5,
  Z_TREES:            6,

  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
  Z_OK:               0,
  Z_STREAM_END:       1,
  Z_NEED_DICT:        2,
  Z_ERRNO:           -1,
  Z_STREAM_ERROR:    -2,
  Z_DATA_ERROR:      -3,
  //Z_MEM_ERROR:     -4,
  Z_BUF_ERROR:       -5,
  //Z_VERSION_ERROR: -6,

  /* compression levels */
  Z_NO_COMPRESSION:         0,
  Z_BEST_SPEED:             1,
  Z_BEST_COMPRESSION:       9,
  Z_DEFAULT_COMPRESSION:   -1,


  Z_FILTERED:               1,
  Z_HUFFMAN_ONLY:           2,
  Z_RLE:                    3,
  Z_FIXED:                  4,
  Z_DEFAULT_STRATEGY:       0,

  /* Possible values of the data_type field (though see inflate()) */
  Z_BINARY:                 0,
  Z_TEXT:                   1,
  //Z_ASCII:                1, // = Z_TEXT (deprecated)
  Z_UNKNOWN:                2,

  /* The deflate compression method */
  Z_DEFLATED:               8
  //Z_NULL:                 null // Use -1 or null inline, depending on var type
};


/***/ }),

/***/ "./node_modules/pako/lib/zlib/crc32.js":
/*!*********************************************!*\
  !*** ./node_modules/pako/lib/zlib/crc32.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Note: we can't get significant speed boost here.
// So write code to minimize size - no pregenerated tables
// and array tools dependencies.

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

// Use ordinary array, since untyped makes no boost here
function makeTable() {
  var c, table = [];

  for (var n = 0; n < 256; n++) {
    c = n;
    for (var k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[n] = c;
  }

  return table;
}

// Create table on load. Just 255 signed longs. Not a problem.
var crcTable = makeTable();


function crc32(crc, buf, len, pos) {
  var t = crcTable,
      end = pos + len;

  crc ^= -1;

  for (var i = pos; i < end; i++) {
    crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
  }

  return (crc ^ (-1)); // >>> 0;
}


module.exports = crc32;


/***/ }),

/***/ "./node_modules/pako/lib/zlib/deflate.js":
/*!***********************************************!*\
  !*** ./node_modules/pako/lib/zlib/deflate.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

var utils   = __webpack_require__(/*! ../utils/common */ "./node_modules/pako/lib/utils/common.js");
var trees   = __webpack_require__(/*! ./trees */ "./node_modules/pako/lib/zlib/trees.js");
var adler32 = __webpack_require__(/*! ./adler32 */ "./node_modules/pako/lib/zlib/adler32.js");
var crc32   = __webpack_require__(/*! ./crc32 */ "./node_modules/pako/lib/zlib/crc32.js");
var msg     = __webpack_require__(/*! ./messages */ "./node_modules/pako/lib/zlib/messages.js");

/* Public constants ==========================================================*/
/* ===========================================================================*/


/* Allowed flush values; see deflate() and inflate() below for details */
var Z_NO_FLUSH      = 0;
var Z_PARTIAL_FLUSH = 1;
//var Z_SYNC_FLUSH    = 2;
var Z_FULL_FLUSH    = 3;
var Z_FINISH        = 4;
var Z_BLOCK         = 5;
//var Z_TREES         = 6;


/* Return codes for the compression/decompression functions. Negative values
 * are errors, positive values are used for special but normal events.
 */
var Z_OK            = 0;
var Z_STREAM_END    = 1;
//var Z_NEED_DICT     = 2;
//var Z_ERRNO         = -1;
var Z_STREAM_ERROR  = -2;
var Z_DATA_ERROR    = -3;
//var Z_MEM_ERROR     = -4;
var Z_BUF_ERROR     = -5;
//var Z_VERSION_ERROR = -6;


/* compression levels */
//var Z_NO_COMPRESSION      = 0;
//var Z_BEST_SPEED          = 1;
//var Z_BEST_COMPRESSION    = 9;
var Z_DEFAULT_COMPRESSION = -1;


var Z_FILTERED            = 1;
var Z_HUFFMAN_ONLY        = 2;
var Z_RLE                 = 3;
var Z_FIXED               = 4;
var Z_DEFAULT_STRATEGY    = 0;

/* Possible values of the data_type field (though see inflate()) */
//var Z_BINARY              = 0;
//var Z_TEXT                = 1;
//var Z_ASCII               = 1; // = Z_TEXT
var Z_UNKNOWN             = 2;


/* The deflate compression method */
var Z_DEFLATED  = 8;

/*============================================================================*/


var MAX_MEM_LEVEL = 9;
/* Maximum value for memLevel in deflateInit2 */
var MAX_WBITS = 15;
/* 32K LZ77 window */
var DEF_MEM_LEVEL = 8;


var LENGTH_CODES  = 29;
/* number of length codes, not counting the special END_BLOCK code */
var LITERALS      = 256;
/* number of literal bytes 0..255 */
var L_CODES       = LITERALS + 1 + LENGTH_CODES;
/* number of Literal or Length codes, including the END_BLOCK code */
var D_CODES       = 30;
/* number of distance codes */
var BL_CODES      = 19;
/* number of codes used to transfer the bit lengths */
var HEAP_SIZE     = 2 * L_CODES + 1;
/* maximum heap size */
var MAX_BITS  = 15;
/* All codes must not exceed MAX_BITS bits */

var MIN_MATCH = 3;
var MAX_MATCH = 258;
var MIN_LOOKAHEAD = (MAX_MATCH + MIN_MATCH + 1);

var PRESET_DICT = 0x20;

var INIT_STATE = 42;
var EXTRA_STATE = 69;
var NAME_STATE = 73;
var COMMENT_STATE = 91;
var HCRC_STATE = 103;
var BUSY_STATE = 113;
var FINISH_STATE = 666;

var BS_NEED_MORE      = 1; /* block not completed, need more input or more output */
var BS_BLOCK_DONE     = 2; /* block flush performed */
var BS_FINISH_STARTED = 3; /* finish started, need only more output at next deflate */
var BS_FINISH_DONE    = 4; /* finish done, accept no more input or output */

var OS_CODE = 0x03; // Unix :) . Don't detect, use this default.

function err(strm, errorCode) {
  strm.msg = msg[errorCode];
  return errorCode;
}

function rank(f) {
  return ((f) << 1) - ((f) > 4 ? 9 : 0);
}

function zero(buf) { var len = buf.length; while (--len >= 0) { buf[len] = 0; } }


/* =========================================================================
 * Flush as much pending output as possible. All deflate() output goes
 * through this function so some applications may wish to modify it
 * to avoid allocating a large strm->output buffer and copying into it.
 * (See also read_buf()).
 */
function flush_pending(strm) {
  var s = strm.state;

  //_tr_flush_bits(s);
  var len = s.pending;
  if (len > strm.avail_out) {
    len = strm.avail_out;
  }
  if (len === 0) { return; }

  utils.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
  strm.next_out += len;
  s.pending_out += len;
  strm.total_out += len;
  strm.avail_out -= len;
  s.pending -= len;
  if (s.pending === 0) {
    s.pending_out = 0;
  }
}


function flush_block_only(s, last) {
  trees._tr_flush_block(s, (s.block_start >= 0 ? s.block_start : -1), s.strstart - s.block_start, last);
  s.block_start = s.strstart;
  flush_pending(s.strm);
}


function put_byte(s, b) {
  s.pending_buf[s.pending++] = b;
}


/* =========================================================================
 * Put a short in the pending buffer. The 16-bit value is put in MSB order.
 * IN assertion: the stream state is correct and there is enough room in
 * pending_buf.
 */
function putShortMSB(s, b) {
//  put_byte(s, (Byte)(b >> 8));
//  put_byte(s, (Byte)(b & 0xff));
  s.pending_buf[s.pending++] = (b >>> 8) & 0xff;
  s.pending_buf[s.pending++] = b & 0xff;
}


/* ===========================================================================
 * Read a new buffer from the current input stream, update the adler32
 * and total number of bytes read.  All deflate() input goes through
 * this function so some applications may wish to modify it to avoid
 * allocating a large strm->input buffer and copying from it.
 * (See also flush_pending()).
 */
function read_buf(strm, buf, start, size) {
  var len = strm.avail_in;

  if (len > size) { len = size; }
  if (len === 0) { return 0; }

  strm.avail_in -= len;

  // zmemcpy(buf, strm->next_in, len);
  utils.arraySet(buf, strm.input, strm.next_in, len, start);
  if (strm.state.wrap === 1) {
    strm.adler = adler32(strm.adler, buf, len, start);
  }

  else if (strm.state.wrap === 2) {
    strm.adler = crc32(strm.adler, buf, len, start);
  }

  strm.next_in += len;
  strm.total_in += len;

  return len;
}


/* ===========================================================================
 * Set match_start to the longest match starting at the given string and
 * return its length. Matches shorter or equal to prev_length are discarded,
 * in which case the result is equal to prev_length and match_start is
 * garbage.
 * IN assertions: cur_match is the head of the hash chain for the current
 *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
 * OUT assertion: the match length is not greater than s->lookahead.
 */
function longest_match(s, cur_match) {
  var chain_length = s.max_chain_length;      /* max hash chain length */
  var scan = s.strstart; /* current string */
  var match;                       /* matched string */
  var len;                           /* length of current match */
  var best_len = s.prev_length;              /* best match length so far */
  var nice_match = s.nice_match;             /* stop if match long enough */
  var limit = (s.strstart > (s.w_size - MIN_LOOKAHEAD)) ?
      s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0/*NIL*/;

  var _win = s.window; // shortcut

  var wmask = s.w_mask;
  var prev  = s.prev;

  /* Stop when cur_match becomes <= limit. To simplify the code,
   * we prevent matches with the string of window index 0.
   */

  var strend = s.strstart + MAX_MATCH;
  var scan_end1  = _win[scan + best_len - 1];
  var scan_end   = _win[scan + best_len];

  /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
   * It is easy to get rid of this optimization if necessary.
   */
  // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");

  /* Do not waste too much time if we already have a good match: */
  if (s.prev_length >= s.good_match) {
    chain_length >>= 2;
  }
  /* Do not look for matches beyond the end of the input. This is necessary
   * to make deflate deterministic.
   */
  if (nice_match > s.lookahead) { nice_match = s.lookahead; }

  // Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");

  do {
    // Assert(cur_match < s->strstart, "no future");
    match = cur_match;

    /* Skip to next match if the match length cannot increase
     * or if the match length is less than 2.  Note that the checks below
     * for insufficient lookahead only occur occasionally for performance
     * reasons.  Therefore uninitialized memory will be accessed, and
     * conditional jumps will be made that depend on those values.
     * However the length of the match is limited to the lookahead, so
     * the output of deflate is not affected by the uninitialized values.
     */

    if (_win[match + best_len]     !== scan_end  ||
        _win[match + best_len - 1] !== scan_end1 ||
        _win[match]                !== _win[scan] ||
        _win[++match]              !== _win[scan + 1]) {
      continue;
    }

    /* The check at best_len-1 can be removed because it will be made
     * again later. (This heuristic is not always a win.)
     * It is not necessary to compare scan[2] and match[2] since they
     * are always equal when the other bytes match, given that
     * the hash keys are equal and that HASH_BITS >= 8.
     */
    scan += 2;
    match++;
    // Assert(*scan == *match, "match[2]?");

    /* We check for insufficient lookahead only every 8th comparison;
     * the 256th check will be made at strstart+258.
     */
    do {
      /*jshint noempty:false*/
    } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             scan < strend);

    // Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");

    len = MAX_MATCH - (strend - scan);
    scan = strend - MAX_MATCH;

    if (len > best_len) {
      s.match_start = cur_match;
      best_len = len;
      if (len >= nice_match) {
        break;
      }
      scan_end1  = _win[scan + best_len - 1];
      scan_end   = _win[scan + best_len];
    }
  } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);

  if (best_len <= s.lookahead) {
    return best_len;
  }
  return s.lookahead;
}


/* ===========================================================================
 * Fill the window when the lookahead becomes insufficient.
 * Updates strstart and lookahead.
 *
 * IN assertion: lookahead < MIN_LOOKAHEAD
 * OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
 *    At least one byte has been read, or avail_in == 0; reads are
 *    performed for at least two bytes (required for the zip translate_eol
 *    option -- not supported here).
 */
function fill_window(s) {
  var _w_size = s.w_size;
  var p, n, m, more, str;

  //Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");

  do {
    more = s.window_size - s.lookahead - s.strstart;

    // JS ints have 32 bit, block below not needed
    /* Deal with !@#$% 64K limit: */
    //if (sizeof(int) <= 2) {
    //    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {
    //        more = wsize;
    //
    //  } else if (more == (unsigned)(-1)) {
    //        /* Very unlikely, but possible on 16 bit machine if
    //         * strstart == 0 && lookahead == 1 (input done a byte at time)
    //         */
    //        more--;
    //    }
    //}


    /* If the window is almost full and there is insufficient lookahead,
     * move the upper half to the lower one to make room in the upper half.
     */
    if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {

      utils.arraySet(s.window, s.window, _w_size, _w_size, 0);
      s.match_start -= _w_size;
      s.strstart -= _w_size;
      /* we now have strstart >= MAX_DIST */
      s.block_start -= _w_size;

      /* Slide the hash table (could be avoided with 32 bit values
       at the expense of memory usage). We slide even when level == 0
       to keep the hash table consistent if we switch back to level > 0
       later. (Using level 0 permanently is not an optimal usage of
       zlib, so we don't care about this pathological case.)
       */

      n = s.hash_size;
      p = n;
      do {
        m = s.head[--p];
        s.head[p] = (m >= _w_size ? m - _w_size : 0);
      } while (--n);

      n = _w_size;
      p = n;
      do {
        m = s.prev[--p];
        s.prev[p] = (m >= _w_size ? m - _w_size : 0);
        /* If n is not on any hash chain, prev[n] is garbage but
         * its value will never be used.
         */
      } while (--n);

      more += _w_size;
    }
    if (s.strm.avail_in === 0) {
      break;
    }

    /* If there was no sliding:
     *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
     *    more == window_size - lookahead - strstart
     * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
     * => more >= window_size - 2*WSIZE + 2
     * In the BIG_MEM or MMAP case (not yet supported),
     *   window_size == input_size + MIN_LOOKAHEAD  &&
     *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
     * Otherwise, window_size == 2*WSIZE so more >= 2.
     * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
     */
    //Assert(more >= 2, "more < 2");
    n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
    s.lookahead += n;

    /* Initialize the hash value now that we have some input: */
    if (s.lookahead + s.insert >= MIN_MATCH) {
      str = s.strstart - s.insert;
      s.ins_h = s.window[str];

      /* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + 1]) & s.hash_mask;
//#if MIN_MATCH != 3
//        Call update_hash() MIN_MATCH-3 more times
//#endif
      while (s.insert) {
        /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
        s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;

        s.prev[str & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = str;
        str++;
        s.insert--;
        if (s.lookahead + s.insert < MIN_MATCH) {
          break;
        }
      }
    }
    /* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,
     * but this is not important since only literal bytes will be emitted.
     */

  } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);

  /* If the WIN_INIT bytes after the end of the current data have never been
   * written, then zero those bytes in order to avoid memory check reports of
   * the use of uninitialized (or uninitialised as Julian writes) bytes by
   * the longest match routines.  Update the high water mark for the next
   * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
   * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
   */
//  if (s.high_water < s.window_size) {
//    var curr = s.strstart + s.lookahead;
//    var init = 0;
//
//    if (s.high_water < curr) {
//      /* Previous high water mark below current data -- zero WIN_INIT
//       * bytes or up to end of window, whichever is less.
//       */
//      init = s.window_size - curr;
//      if (init > WIN_INIT)
//        init = WIN_INIT;
//      zmemzero(s->window + curr, (unsigned)init);
//      s->high_water = curr + init;
//    }
//    else if (s->high_water < (ulg)curr + WIN_INIT) {
//      /* High water mark at or above current data, but below current data
//       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
//       * to end of window, whichever is less.
//       */
//      init = (ulg)curr + WIN_INIT - s->high_water;
//      if (init > s->window_size - s->high_water)
//        init = s->window_size - s->high_water;
//      zmemzero(s->window + s->high_water, (unsigned)init);
//      s->high_water += init;
//    }
//  }
//
//  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
//    "not enough room for search");
}

/* ===========================================================================
 * Copy without compression as much as possible from the input stream, return
 * the current block state.
 * This function does not insert new strings in the dictionary since
 * uncompressible data is probably not useful. This function is used
 * only for the level=0 compression option.
 * NOTE: this function should be optimized to avoid extra copying from
 * window to pending_buf.
 */
function deflate_stored(s, flush) {
  /* Stored blocks are limited to 0xffff bytes, pending_buf is limited
   * to pending_buf_size, and each stored block has a 5 byte header:
   */
  var max_block_size = 0xffff;

  if (max_block_size > s.pending_buf_size - 5) {
    max_block_size = s.pending_buf_size - 5;
  }

  /* Copy as much as possible from input to output: */
  for (;;) {
    /* Fill the window as much as possible: */
    if (s.lookahead <= 1) {

      //Assert(s->strstart < s->w_size+MAX_DIST(s) ||
      //  s->block_start >= (long)s->w_size, "slide too late");
//      if (!(s.strstart < s.w_size + (s.w_size - MIN_LOOKAHEAD) ||
//        s.block_start >= s.w_size)) {
//        throw  new Error("slide too late");
//      }

      fill_window(s);
      if (s.lookahead === 0 && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }

      if (s.lookahead === 0) {
        break;
      }
      /* flush the current block */
    }
    //Assert(s->block_start >= 0L, "block gone");
//    if (s.block_start < 0) throw new Error("block gone");

    s.strstart += s.lookahead;
    s.lookahead = 0;

    /* Emit a stored block if pending_buf will be full: */
    var max_start = s.block_start + max_block_size;

    if (s.strstart === 0 || s.strstart >= max_start) {
      /* strstart == 0 is possible when wraparound on 16-bit machine */
      s.lookahead = s.strstart - max_start;
      s.strstart = max_start;
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/


    }
    /* Flush if we may have to slide, otherwise block_start may become
     * negative and the data will be gone:
     */
    if (s.strstart - s.block_start >= (s.w_size - MIN_LOOKAHEAD)) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }

  s.insert = 0;

  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }

  if (s.strstart > s.block_start) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }

  return BS_NEED_MORE;
}

/* ===========================================================================
 * Compress as much as possible from the input stream, return the current
 * block state.
 * This function does not perform lazy evaluation of matches and inserts
 * new strings in the dictionary only for unmatched strings or for short
 * matches. It is used only for the fast compression options.
 */
function deflate_fast(s, flush) {
  var hash_head;        /* head of the hash chain */
  var bflush;           /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) {
        break; /* flush the current block */
      }
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0/*NIL*/;
    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }

    /* Find the longest match, discarding those <= prev_length.
     * At this point we have always match_length < MIN_MATCH
     */
    if (hash_head !== 0/*NIL*/ && ((s.strstart - hash_head) <= (s.w_size - MIN_LOOKAHEAD))) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */
    }
    if (s.match_length >= MIN_MATCH) {
      // check_match(s, s.strstart, s.match_start, s.match_length); // for debug only

      /*** _tr_tally_dist(s, s.strstart - s.match_start,
                     s.match_length - MIN_MATCH, bflush); ***/
      bflush = trees._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;

      /* Insert new strings in the hash table only if the match length
       * is not too large. This saves time but degrades compression.
       */
      if (s.match_length <= s.max_lazy_match/*max_insert_length*/ && s.lookahead >= MIN_MATCH) {
        s.match_length--; /* string at strstart already in table */
        do {
          s.strstart++;
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
          /* strstart never exceeds WSIZE-MAX_MATCH, so there are
           * always MIN_MATCH bytes ahead.
           */
        } while (--s.match_length !== 0);
        s.strstart++;
      } else
      {
        s.strstart += s.match_length;
        s.match_length = 0;
        s.ins_h = s.window[s.strstart];
        /* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */
        s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + 1]) & s.hash_mask;

//#if MIN_MATCH != 3
//                Call UPDATE_HASH() MIN_MATCH-3 more times
//#endif
        /* If lookahead < MIN_MATCH, ins_h is garbage, but it does not
         * matter since it will be recomputed at next deflate call.
         */
      }
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s.window[s.strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = trees._tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = ((s.strstart < (MIN_MATCH - 1)) ? s.strstart : MIN_MATCH - 1);
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
}

/* ===========================================================================
 * Same as above, but achieves better compression. We use a lazy
 * evaluation for matches: a match is finally adopted only if there is
 * no better match at the next window position.
 */
function deflate_slow(s, flush) {
  var hash_head;          /* head of hash chain */
  var bflush;              /* set if current block must be flushed */

  var max_insert;

  /* Process the input block. */
  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) { break; } /* flush the current block */
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0/*NIL*/;
    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }

    /* Find the longest match, discarding those <= prev_length.
     */
    s.prev_length = s.match_length;
    s.prev_match = s.match_start;
    s.match_length = MIN_MATCH - 1;

    if (hash_head !== 0/*NIL*/ && s.prev_length < s.max_lazy_match &&
        s.strstart - hash_head <= (s.w_size - MIN_LOOKAHEAD)/*MAX_DIST(s)*/) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */

      if (s.match_length <= 5 &&
         (s.strategy === Z_FILTERED || (s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096/*TOO_FAR*/))) {

        /* If prev_match is also MIN_MATCH, match_start is garbage
         * but we will ignore the current match anyway.
         */
        s.match_length = MIN_MATCH - 1;
      }
    }
    /* If there was a match at the previous step and the current
     * match is not better, output the previous match:
     */
    if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
      max_insert = s.strstart + s.lookahead - MIN_MATCH;
      /* Do not insert strings in hash table beyond this. */

      //check_match(s, s.strstart-1, s.prev_match, s.prev_length);

      /***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
                     s.prev_length - MIN_MATCH, bflush);***/
      bflush = trees._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
      /* Insert in hash table all strings up to the end of the match.
       * strstart-1 and strstart are already inserted. If there is not
       * enough lookahead, the last two strings are not inserted in
       * the hash table.
       */
      s.lookahead -= s.prev_length - 1;
      s.prev_length -= 2;
      do {
        if (++s.strstart <= max_insert) {
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
        }
      } while (--s.prev_length !== 0);
      s.match_available = 0;
      s.match_length = MIN_MATCH - 1;
      s.strstart++;

      if (bflush) {
        /*** FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
        /***/
      }

    } else if (s.match_available) {
      /* If there was no match at the previous position, output a
       * single literal. If there was a match but the current match
       * is longer, truncate the previous match to a single literal.
       */
      //Tracevv((stderr,"%c", s->window[s->strstart-1]));
      /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
      bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);

      if (bflush) {
        /*** FLUSH_BLOCK_ONLY(s, 0) ***/
        flush_block_only(s, false);
        /***/
      }
      s.strstart++;
      s.lookahead--;
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    } else {
      /* There is no previous match to compare with, wait for
       * the next step to decide.
       */
      s.match_available = 1;
      s.strstart++;
      s.lookahead--;
    }
  }
  //Assert (flush != Z_NO_FLUSH, "no flush?");
  if (s.match_available) {
    //Tracevv((stderr,"%c", s->window[s->strstart-1]));
    /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
    bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);

    s.match_available = 0;
  }
  s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }

  return BS_BLOCK_DONE;
}


/* ===========================================================================
 * For Z_RLE, simply look for runs of bytes, generate matches only of distance
 * one.  Do not maintain a hash table.  (It will be regenerated if this run of
 * deflate switches away from Z_RLE.)
 */
function deflate_rle(s, flush) {
  var bflush;            /* set if current block must be flushed */
  var prev;              /* byte at distance one to match */
  var scan, strend;      /* scan goes up to strend for length of run */

  var _win = s.window;

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the longest run, plus one for the unrolled loop.
     */
    if (s.lookahead <= MAX_MATCH) {
      fill_window(s);
      if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) { break; } /* flush the current block */
    }

    /* See how many times the previous byte repeats */
    s.match_length = 0;
    if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
      scan = s.strstart - 1;
      prev = _win[scan];
      if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
        strend = s.strstart + MAX_MATCH;
        do {
          /*jshint noempty:false*/
        } while (prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 scan < strend);
        s.match_length = MAX_MATCH - (strend - scan);
        if (s.match_length > s.lookahead) {
          s.match_length = s.lookahead;
        }
      }
      //Assert(scan <= s->window+(uInt)(s->window_size-1), "wild scan");
    }

    /* Emit match if have run of MIN_MATCH or longer, else emit literal */
    if (s.match_length >= MIN_MATCH) {
      //check_match(s, s.strstart, s.strstart - 1, s.match_length);

      /*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
      bflush = trees._tr_tally(s, 1, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;
      s.strstart += s.match_length;
      s.match_length = 0;
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s->window[s->strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = trees._tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
}

/* ===========================================================================
 * For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
 * (It will be regenerated if this run of deflate switches away from Huffman.)
 */
function deflate_huff(s, flush) {
  var bflush;             /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we have a literal to write. */
    if (s.lookahead === 0) {
      fill_window(s);
      if (s.lookahead === 0) {
        if (flush === Z_NO_FLUSH) {
          return BS_NEED_MORE;
        }
        break;      /* flush the current block */
      }
    }

    /* Output a literal byte */
    s.match_length = 0;
    //Tracevv((stderr,"%c", s->window[s->strstart]));
    /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
    bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
    s.lookahead--;
    s.strstart++;
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
}

/* Values for max_lazy_match, good_match and max_chain_length, depending on
 * the desired pack level (0..9). The values given below have been tuned to
 * exclude worst case performance for pathological files. Better values may be
 * found for specific files.
 */
function Config(good_length, max_lazy, nice_length, max_chain, func) {
  this.good_length = good_length;
  this.max_lazy = max_lazy;
  this.nice_length = nice_length;
  this.max_chain = max_chain;
  this.func = func;
}

var configuration_table;

configuration_table = [
  /*      good lazy nice chain */
  new Config(0, 0, 0, 0, deflate_stored),          /* 0 store only */
  new Config(4, 4, 8, 4, deflate_fast),            /* 1 max speed, no lazy matches */
  new Config(4, 5, 16, 8, deflate_fast),           /* 2 */
  new Config(4, 6, 32, 32, deflate_fast),          /* 3 */

  new Config(4, 4, 16, 16, deflate_slow),          /* 4 lazy matches */
  new Config(8, 16, 32, 32, deflate_slow),         /* 5 */
  new Config(8, 16, 128, 128, deflate_slow),       /* 6 */
  new Config(8, 32, 128, 256, deflate_slow),       /* 7 */
  new Config(32, 128, 258, 1024, deflate_slow),    /* 8 */
  new Config(32, 258, 258, 4096, deflate_slow)     /* 9 max compression */
];


/* ===========================================================================
 * Initialize the "longest match" routines for a new zlib stream
 */
function lm_init(s) {
  s.window_size = 2 * s.w_size;

  /*** CLEAR_HASH(s); ***/
  zero(s.head); // Fill with NIL (= 0);

  /* Set the default configuration parameters:
   */
  s.max_lazy_match = configuration_table[s.level].max_lazy;
  s.good_match = configuration_table[s.level].good_length;
  s.nice_match = configuration_table[s.level].nice_length;
  s.max_chain_length = configuration_table[s.level].max_chain;

  s.strstart = 0;
  s.block_start = 0;
  s.lookahead = 0;
  s.insert = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  s.ins_h = 0;
}


function DeflateState() {
  this.strm = null;            /* pointer back to this zlib stream */
  this.status = 0;            /* as the name implies */
  this.pending_buf = null;      /* output still pending */
  this.pending_buf_size = 0;  /* size of pending_buf */
  this.pending_out = 0;       /* next pending byte to output to the stream */
  this.pending = 0;           /* nb of bytes in the pending buffer */
  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
  this.gzhead = null;         /* gzip header information to write */
  this.gzindex = 0;           /* where in extra, name, or comment */
  this.method = Z_DEFLATED; /* can only be DEFLATED */
  this.last_flush = -1;   /* value of flush param for previous deflate call */

  this.w_size = 0;  /* LZ77 window size (32K by default) */
  this.w_bits = 0;  /* log2(w_size)  (8..16) */
  this.w_mask = 0;  /* w_size - 1 */

  this.window = null;
  /* Sliding window. Input bytes are read into the second half of the window,
   * and move to the first half later to keep a dictionary of at least wSize
   * bytes. With this organization, matches are limited to a distance of
   * wSize-MAX_MATCH bytes, but this ensures that IO is always
   * performed with a length multiple of the block size.
   */

  this.window_size = 0;
  /* Actual size of window: 2*wSize, except when the user input buffer
   * is directly used as sliding window.
   */

  this.prev = null;
  /* Link to older string with same hash index. To limit the size of this
   * array to 64K, this link is maintained only for the last 32K strings.
   * An index in this array is thus a window index modulo 32K.
   */

  this.head = null;   /* Heads of the hash chains or NIL. */

  this.ins_h = 0;       /* hash index of string to be inserted */
  this.hash_size = 0;   /* number of elements in hash table */
  this.hash_bits = 0;   /* log2(hash_size) */
  this.hash_mask = 0;   /* hash_size-1 */

  this.hash_shift = 0;
  /* Number of bits by which ins_h must be shifted at each input
   * step. It must be such that after MIN_MATCH steps, the oldest
   * byte no longer takes part in the hash key, that is:
   *   hash_shift * MIN_MATCH >= hash_bits
   */

  this.block_start = 0;
  /* Window position at the beginning of the current output block. Gets
   * negative when the window is moved backwards.
   */

  this.match_length = 0;      /* length of best match */
  this.prev_match = 0;        /* previous match */
  this.match_available = 0;   /* set if previous match exists */
  this.strstart = 0;          /* start of string to insert */
  this.match_start = 0;       /* start of matching string */
  this.lookahead = 0;         /* number of valid bytes ahead in window */

  this.prev_length = 0;
  /* Length of the best match at previous step. Matches not greater than this
   * are discarded. This is used in the lazy match evaluation.
   */

  this.max_chain_length = 0;
  /* To speed up deflation, hash chains are never searched beyond this
   * length.  A higher limit improves compression ratio but degrades the
   * speed.
   */

  this.max_lazy_match = 0;
  /* Attempt to find a better match only when the current match is strictly
   * smaller than this value. This mechanism is used only for compression
   * levels >= 4.
   */
  // That's alias to max_lazy_match, don't use directly
  //this.max_insert_length = 0;
  /* Insert new strings in the hash table only if the match length is not
   * greater than this length. This saves time but degrades compression.
   * max_insert_length is used only for compression levels <= 3.
   */

  this.level = 0;     /* compression level (1..9) */
  this.strategy = 0;  /* favor or force Huffman coding*/

  this.good_match = 0;
  /* Use a faster search when the previous match is longer than this */

  this.nice_match = 0; /* Stop searching when current match exceeds this */

              /* used by trees.c: */

  /* Didn't use ct_data typedef below to suppress compiler warning */

  // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
  // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
  // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */

  // Use flat array of DOUBLE size, with interleaved fata,
  // because JS does not support effective
  this.dyn_ltree  = new utils.Buf16(HEAP_SIZE * 2);
  this.dyn_dtree  = new utils.Buf16((2 * D_CODES + 1) * 2);
  this.bl_tree    = new utils.Buf16((2 * BL_CODES + 1) * 2);
  zero(this.dyn_ltree);
  zero(this.dyn_dtree);
  zero(this.bl_tree);

  this.l_desc   = null;         /* desc. for literal tree */
  this.d_desc   = null;         /* desc. for distance tree */
  this.bl_desc  = null;         /* desc. for bit length tree */

  //ush bl_count[MAX_BITS+1];
  this.bl_count = new utils.Buf16(MAX_BITS + 1);
  /* number of codes at each bit length for an optimal tree */

  //int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
  this.heap = new utils.Buf16(2 * L_CODES + 1);  /* heap used to build the Huffman trees */
  zero(this.heap);

  this.heap_len = 0;               /* number of elements in the heap */
  this.heap_max = 0;               /* element of largest frequency */
  /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
   * The same heap array is used to build all trees.
   */

  this.depth = new utils.Buf16(2 * L_CODES + 1); //uch depth[2*L_CODES+1];
  zero(this.depth);
  /* Depth of each subtree used as tie breaker for trees of equal frequency
   */

  this.l_buf = 0;          /* buffer index for literals or lengths */

  this.lit_bufsize = 0;
  /* Size of match buffer for literals/lengths.  There are 4 reasons for
   * limiting lit_bufsize to 64K:
   *   - frequencies can be kept in 16 bit counters
   *   - if compression is not successful for the first block, all input
   *     data is still in the window so we can still emit a stored block even
   *     when input comes from standard input.  (This can also be done for
   *     all blocks if lit_bufsize is not greater than 32K.)
   *   - if compression is not successful for a file smaller than 64K, we can
   *     even emit a stored file instead of a stored block (saving 5 bytes).
   *     This is applicable only for zip (not gzip or zlib).
   *   - creating new Huffman trees less frequently may not provide fast
   *     adaptation to changes in the input data statistics. (Take for
   *     example a binary file with poorly compressible code followed by
   *     a highly compressible string table.) Smaller buffer sizes give
   *     fast adaptation but have of course the overhead of transmitting
   *     trees more frequently.
   *   - I can't count above 4
   */

  this.last_lit = 0;      /* running index in l_buf */

  this.d_buf = 0;
  /* Buffer index for distances. To simplify the code, d_buf and l_buf have
   * the same number of elements. To use different lengths, an extra flag
   * array would be necessary.
   */

  this.opt_len = 0;       /* bit length of current block with optimal trees */
  this.static_len = 0;    /* bit length of current block with static trees */
  this.matches = 0;       /* number of string matches in current block */
  this.insert = 0;        /* bytes at end of window left to insert */


  this.bi_buf = 0;
  /* Output buffer. bits are inserted starting at the bottom (least
   * significant bits).
   */
  this.bi_valid = 0;
  /* Number of valid bits in bi_buf.  All bits above the last valid bit
   * are always zero.
   */

  // Used for window memory init. We safely ignore it for JS. That makes
  // sense only for pointers and memory check tools.
  //this.high_water = 0;
  /* High water mark offset in window for initialized bytes -- bytes above
   * this are set to zero in order to avoid memory check warnings when
   * longest match routines access bytes past the input.  This is then
   * updated to the new high water mark.
   */
}


function deflateResetKeep(strm) {
  var s;

  if (!strm || !strm.state) {
    return err(strm, Z_STREAM_ERROR);
  }

  strm.total_in = strm.total_out = 0;
  strm.data_type = Z_UNKNOWN;

  s = strm.state;
  s.pending = 0;
  s.pending_out = 0;

  if (s.wrap < 0) {
    s.wrap = -s.wrap;
    /* was made negative by deflate(..., Z_FINISH); */
  }
  s.status = (s.wrap ? INIT_STATE : BUSY_STATE);
  strm.adler = (s.wrap === 2) ?
    0  // crc32(0, Z_NULL, 0)
  :
    1; // adler32(0, Z_NULL, 0)
  s.last_flush = Z_NO_FLUSH;
  trees._tr_init(s);
  return Z_OK;
}


function deflateReset(strm) {
  var ret = deflateResetKeep(strm);
  if (ret === Z_OK) {
    lm_init(strm.state);
  }
  return ret;
}


function deflateSetHeader(strm, head) {
  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  if (strm.state.wrap !== 2) { return Z_STREAM_ERROR; }
  strm.state.gzhead = head;
  return Z_OK;
}


function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
  if (!strm) { // === Z_NULL
    return Z_STREAM_ERROR;
  }
  var wrap = 1;

  if (level === Z_DEFAULT_COMPRESSION) {
    level = 6;
  }

  if (windowBits < 0) { /* suppress zlib wrapper */
    wrap = 0;
    windowBits = -windowBits;
  }

  else if (windowBits > 15) {
    wrap = 2;           /* write gzip wrapper instead */
    windowBits -= 16;
  }


  if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED ||
    windowBits < 8 || windowBits > 15 || level < 0 || level > 9 ||
    strategy < 0 || strategy > Z_FIXED) {
    return err(strm, Z_STREAM_ERROR);
  }


  if (windowBits === 8) {
    windowBits = 9;
  }
  /* until 256-byte window bug fixed */

  var s = new DeflateState();

  strm.state = s;
  s.strm = strm;

  s.wrap = wrap;
  s.gzhead = null;
  s.w_bits = windowBits;
  s.w_size = 1 << s.w_bits;
  s.w_mask = s.w_size - 1;

  s.hash_bits = memLevel + 7;
  s.hash_size = 1 << s.hash_bits;
  s.hash_mask = s.hash_size - 1;
  s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);

  s.window = new utils.Buf8(s.w_size * 2);
  s.head = new utils.Buf16(s.hash_size);
  s.prev = new utils.Buf16(s.w_size);

  // Don't need mem init magic for JS.
  //s.high_water = 0;  /* nothing written to s->window yet */

  s.lit_bufsize = 1 << (memLevel + 6); /* 16K elements by default */

  s.pending_buf_size = s.lit_bufsize * 4;

  //overlay = (ushf *) ZALLOC(strm, s->lit_bufsize, sizeof(ush)+2);
  //s->pending_buf = (uchf *) overlay;
  s.pending_buf = new utils.Buf8(s.pending_buf_size);

  // It is offset from `s.pending_buf` (size is `s.lit_bufsize * 2`)
  //s->d_buf = overlay + s->lit_bufsize/sizeof(ush);
  s.d_buf = 1 * s.lit_bufsize;

  //s->l_buf = s->pending_buf + (1+sizeof(ush))*s->lit_bufsize;
  s.l_buf = (1 + 2) * s.lit_bufsize;

  s.level = level;
  s.strategy = strategy;
  s.method = method;

  return deflateReset(strm);
}

function deflateInit(strm, level) {
  return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
}


function deflate(strm, flush) {
  var old_flush, s;
  var beg, val; // for gzip header write only

  if (!strm || !strm.state ||
    flush > Z_BLOCK || flush < 0) {
    return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
  }

  s = strm.state;

  if (!strm.output ||
      (!strm.input && strm.avail_in !== 0) ||
      (s.status === FINISH_STATE && flush !== Z_FINISH)) {
    return err(strm, (strm.avail_out === 0) ? Z_BUF_ERROR : Z_STREAM_ERROR);
  }

  s.strm = strm; /* just in case */
  old_flush = s.last_flush;
  s.last_flush = flush;

  /* Write the header */
  if (s.status === INIT_STATE) {

    if (s.wrap === 2) { // GZIP header
      strm.adler = 0;  //crc32(0L, Z_NULL, 0);
      put_byte(s, 31);
      put_byte(s, 139);
      put_byte(s, 8);
      if (!s.gzhead) { // s->gzhead == Z_NULL
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, s.level === 9 ? 2 :
                    (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                     4 : 0));
        put_byte(s, OS_CODE);
        s.status = BUSY_STATE;
      }
      else {
        put_byte(s, (s.gzhead.text ? 1 : 0) +
                    (s.gzhead.hcrc ? 2 : 0) +
                    (!s.gzhead.extra ? 0 : 4) +
                    (!s.gzhead.name ? 0 : 8) +
                    (!s.gzhead.comment ? 0 : 16)
        );
        put_byte(s, s.gzhead.time & 0xff);
        put_byte(s, (s.gzhead.time >> 8) & 0xff);
        put_byte(s, (s.gzhead.time >> 16) & 0xff);
        put_byte(s, (s.gzhead.time >> 24) & 0xff);
        put_byte(s, s.level === 9 ? 2 :
                    (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                     4 : 0));
        put_byte(s, s.gzhead.os & 0xff);
        if (s.gzhead.extra && s.gzhead.extra.length) {
          put_byte(s, s.gzhead.extra.length & 0xff);
          put_byte(s, (s.gzhead.extra.length >> 8) & 0xff);
        }
        if (s.gzhead.hcrc) {
          strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0);
        }
        s.gzindex = 0;
        s.status = EXTRA_STATE;
      }
    }
    else // DEFLATE header
    {
      var header = (Z_DEFLATED + ((s.w_bits - 8) << 4)) << 8;
      var level_flags = -1;

      if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
        level_flags = 0;
      } else if (s.level < 6) {
        level_flags = 1;
      } else if (s.level === 6) {
        level_flags = 2;
      } else {
        level_flags = 3;
      }
      header |= (level_flags << 6);
      if (s.strstart !== 0) { header |= PRESET_DICT; }
      header += 31 - (header % 31);

      s.status = BUSY_STATE;
      putShortMSB(s, header);

      /* Save the adler32 of the preset dictionary: */
      if (s.strstart !== 0) {
        putShortMSB(s, strm.adler >>> 16);
        putShortMSB(s, strm.adler & 0xffff);
      }
      strm.adler = 1; // adler32(0L, Z_NULL, 0);
    }
  }

//#ifdef GZIP
  if (s.status === EXTRA_STATE) {
    if (s.gzhead.extra/* != Z_NULL*/) {
      beg = s.pending;  /* start of bytes to update crc */

      while (s.gzindex < (s.gzhead.extra.length & 0xffff)) {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          flush_pending(strm);
          beg = s.pending;
          if (s.pending === s.pending_buf_size) {
            break;
          }
        }
        put_byte(s, s.gzhead.extra[s.gzindex] & 0xff);
        s.gzindex++;
      }
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      if (s.gzindex === s.gzhead.extra.length) {
        s.gzindex = 0;
        s.status = NAME_STATE;
      }
    }
    else {
      s.status = NAME_STATE;
    }
  }
  if (s.status === NAME_STATE) {
    if (s.gzhead.name/* != Z_NULL*/) {
      beg = s.pending;  /* start of bytes to update crc */
      //int val;

      do {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          flush_pending(strm);
          beg = s.pending;
          if (s.pending === s.pending_buf_size) {
            val = 1;
            break;
          }
        }
        // JS specific: little magic to add zero terminator to end of string
        if (s.gzindex < s.gzhead.name.length) {
          val = s.gzhead.name.charCodeAt(s.gzindex++) & 0xff;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);

      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      if (val === 0) {
        s.gzindex = 0;
        s.status = COMMENT_STATE;
      }
    }
    else {
      s.status = COMMENT_STATE;
    }
  }
  if (s.status === COMMENT_STATE) {
    if (s.gzhead.comment/* != Z_NULL*/) {
      beg = s.pending;  /* start of bytes to update crc */
      //int val;

      do {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          flush_pending(strm);
          beg = s.pending;
          if (s.pending === s.pending_buf_size) {
            val = 1;
            break;
          }
        }
        // JS specific: little magic to add zero terminator to end of string
        if (s.gzindex < s.gzhead.comment.length) {
          val = s.gzhead.comment.charCodeAt(s.gzindex++) & 0xff;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);

      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      if (val === 0) {
        s.status = HCRC_STATE;
      }
    }
    else {
      s.status = HCRC_STATE;
    }
  }
  if (s.status === HCRC_STATE) {
    if (s.gzhead.hcrc) {
      if (s.pending + 2 > s.pending_buf_size) {
        flush_pending(strm);
      }
      if (s.pending + 2 <= s.pending_buf_size) {
        put_byte(s, strm.adler & 0xff);
        put_byte(s, (strm.adler >> 8) & 0xff);
        strm.adler = 0; //crc32(0L, Z_NULL, 0);
        s.status = BUSY_STATE;
      }
    }
    else {
      s.status = BUSY_STATE;
    }
  }
//#endif

  /* Flush as much pending output as possible */
  if (s.pending !== 0) {
    flush_pending(strm);
    if (strm.avail_out === 0) {
      /* Since avail_out is 0, deflate will be called again with
       * more output space, but possibly with both pending and
       * avail_in equal to zero. There won't be anything to do,
       * but this is not an error situation so make sure we
       * return OK instead of BUF_ERROR at next call of deflate:
       */
      s.last_flush = -1;
      return Z_OK;
    }

    /* Make sure there is something to do and avoid duplicate consecutive
     * flushes. For repeated and useless calls with Z_FINISH, we keep
     * returning Z_STREAM_END instead of Z_BUF_ERROR.
     */
  } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) &&
    flush !== Z_FINISH) {
    return err(strm, Z_BUF_ERROR);
  }

  /* User must not provide more input after the first FINISH: */
  if (s.status === FINISH_STATE && strm.avail_in !== 0) {
    return err(strm, Z_BUF_ERROR);
  }

  /* Start a new block or continue the current one.
   */
  if (strm.avail_in !== 0 || s.lookahead !== 0 ||
    (flush !== Z_NO_FLUSH && s.status !== FINISH_STATE)) {
    var bstate = (s.strategy === Z_HUFFMAN_ONLY) ? deflate_huff(s, flush) :
      (s.strategy === Z_RLE ? deflate_rle(s, flush) :
        configuration_table[s.level].func(s, flush));

    if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
      s.status = FINISH_STATE;
    }
    if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
      if (strm.avail_out === 0) {
        s.last_flush = -1;
        /* avoid BUF_ERROR next call, see above */
      }
      return Z_OK;
      /* If flush != Z_NO_FLUSH && avail_out == 0, the next call
       * of deflate should use the same flush parameter to make sure
       * that the flush is complete. So we don't have to output an
       * empty block here, this will be done at next call. This also
       * ensures that for a very small output buffer, we emit at most
       * one empty block.
       */
    }
    if (bstate === BS_BLOCK_DONE) {
      if (flush === Z_PARTIAL_FLUSH) {
        trees._tr_align(s);
      }
      else if (flush !== Z_BLOCK) { /* FULL_FLUSH or SYNC_FLUSH */

        trees._tr_stored_block(s, 0, 0, false);
        /* For a full flush, this empty block will be recognized
         * as a special marker by inflate_sync().
         */
        if (flush === Z_FULL_FLUSH) {
          /*** CLEAR_HASH(s); ***/             /* forget history */
          zero(s.head); // Fill with NIL (= 0);

          if (s.lookahead === 0) {
            s.strstart = 0;
            s.block_start = 0;
            s.insert = 0;
          }
        }
      }
      flush_pending(strm);
      if (strm.avail_out === 0) {
        s.last_flush = -1; /* avoid BUF_ERROR at next call, see above */
        return Z_OK;
      }
    }
  }
  //Assert(strm->avail_out > 0, "bug2");
  //if (strm.avail_out <= 0) { throw new Error("bug2");}

  if (flush !== Z_FINISH) { return Z_OK; }
  if (s.wrap <= 0) { return Z_STREAM_END; }

  /* Write the trailer */
  if (s.wrap === 2) {
    put_byte(s, strm.adler & 0xff);
    put_byte(s, (strm.adler >> 8) & 0xff);
    put_byte(s, (strm.adler >> 16) & 0xff);
    put_byte(s, (strm.adler >> 24) & 0xff);
    put_byte(s, strm.total_in & 0xff);
    put_byte(s, (strm.total_in >> 8) & 0xff);
    put_byte(s, (strm.total_in >> 16) & 0xff);
    put_byte(s, (strm.total_in >> 24) & 0xff);
  }
  else
  {
    putShortMSB(s, strm.adler >>> 16);
    putShortMSB(s, strm.adler & 0xffff);
  }

  flush_pending(strm);
  /* If avail_out is zero, the application will call deflate again
   * to flush the rest.
   */
  if (s.wrap > 0) { s.wrap = -s.wrap; }
  /* write the trailer only once! */
  return s.pending !== 0 ? Z_OK : Z_STREAM_END;
}

function deflateEnd(strm) {
  var status;

  if (!strm/*== Z_NULL*/ || !strm.state/*== Z_NULL*/) {
    return Z_STREAM_ERROR;
  }

  status = strm.state.status;
  if (status !== INIT_STATE &&
    status !== EXTRA_STATE &&
    status !== NAME_STATE &&
    status !== COMMENT_STATE &&
    status !== HCRC_STATE &&
    status !== BUSY_STATE &&
    status !== FINISH_STATE
  ) {
    return err(strm, Z_STREAM_ERROR);
  }

  strm.state = null;

  return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
}


/* =========================================================================
 * Initializes the compression dictionary from the given byte
 * sequence without producing any compressed output.
 */
function deflateSetDictionary(strm, dictionary) {
  var dictLength = dictionary.length;

  var s;
  var str, n;
  var wrap;
  var avail;
  var next;
  var input;
  var tmpDict;

  if (!strm/*== Z_NULL*/ || !strm.state/*== Z_NULL*/) {
    return Z_STREAM_ERROR;
  }

  s = strm.state;
  wrap = s.wrap;

  if (wrap === 2 || (wrap === 1 && s.status !== INIT_STATE) || s.lookahead) {
    return Z_STREAM_ERROR;
  }

  /* when using zlib wrappers, compute Adler-32 for provided dictionary */
  if (wrap === 1) {
    /* adler32(strm->adler, dictionary, dictLength); */
    strm.adler = adler32(strm.adler, dictionary, dictLength, 0);
  }

  s.wrap = 0;   /* avoid computing Adler-32 in read_buf */

  /* if dictionary would fill window, just replace the history */
  if (dictLength >= s.w_size) {
    if (wrap === 0) {            /* already empty otherwise */
      /*** CLEAR_HASH(s); ***/
      zero(s.head); // Fill with NIL (= 0);
      s.strstart = 0;
      s.block_start = 0;
      s.insert = 0;
    }
    /* use the tail */
    // dictionary = dictionary.slice(dictLength - s.w_size);
    tmpDict = new utils.Buf8(s.w_size);
    utils.arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0);
    dictionary = tmpDict;
    dictLength = s.w_size;
  }
  /* insert dictionary into window and hash */
  avail = strm.avail_in;
  next = strm.next_in;
  input = strm.input;
  strm.avail_in = dictLength;
  strm.next_in = 0;
  strm.input = dictionary;
  fill_window(s);
  while (s.lookahead >= MIN_MATCH) {
    str = s.strstart;
    n = s.lookahead - (MIN_MATCH - 1);
    do {
      /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;

      s.prev[str & s.w_mask] = s.head[s.ins_h];

      s.head[s.ins_h] = str;
      str++;
    } while (--n);
    s.strstart = str;
    s.lookahead = MIN_MATCH - 1;
    fill_window(s);
  }
  s.strstart += s.lookahead;
  s.block_start = s.strstart;
  s.insert = s.lookahead;
  s.lookahead = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  strm.next_in = next;
  strm.input = input;
  strm.avail_in = avail;
  s.wrap = wrap;
  return Z_OK;
}


exports.deflateInit = deflateInit;
exports.deflateInit2 = deflateInit2;
exports.deflateReset = deflateReset;
exports.deflateResetKeep = deflateResetKeep;
exports.deflateSetHeader = deflateSetHeader;
exports.deflate = deflate;
exports.deflateEnd = deflateEnd;
exports.deflateSetDictionary = deflateSetDictionary;
exports.deflateInfo = 'pako deflate (from Nodeca project)';

/* Not implemented
exports.deflateBound = deflateBound;
exports.deflateCopy = deflateCopy;
exports.deflateParams = deflateParams;
exports.deflatePending = deflatePending;
exports.deflatePrime = deflatePrime;
exports.deflateTune = deflateTune;
*/


/***/ }),

/***/ "./node_modules/pako/lib/zlib/gzheader.js":
/*!************************************************!*\
  !*** ./node_modules/pako/lib/zlib/gzheader.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

function GZheader() {
  /* true if compressed data believed to be text */
  this.text       = 0;
  /* modification time */
  this.time       = 0;
  /* extra flags (not used when writing a gzip file) */
  this.xflags     = 0;
  /* operating system */
  this.os         = 0;
  /* pointer to extra field or Z_NULL if none */
  this.extra      = null;
  /* extra field length (valid if extra != Z_NULL) */
  this.extra_len  = 0; // Actually, we don't need it in JS,
                       // but leave for few code modifications

  //
  // Setup limits is not necessary because in js we should not preallocate memory
  // for inflate use constant limit in 65536 bytes
  //

  /* space at extra (only when reading header) */
  // this.extra_max  = 0;
  /* pointer to zero-terminated file name or Z_NULL */
  this.name       = '';
  /* space at name (only when reading header) */
  // this.name_max   = 0;
  /* pointer to zero-terminated comment or Z_NULL */
  this.comment    = '';
  /* space at comment (only when reading header) */
  // this.comm_max   = 0;
  /* true if there was or will be a header crc */
  this.hcrc       = 0;
  /* true when done reading gzip header (not used when writing a gzip file) */
  this.done       = false;
}

module.exports = GZheader;


/***/ }),

/***/ "./node_modules/pako/lib/zlib/inffast.js":
/*!***********************************************!*\
  !*** ./node_modules/pako/lib/zlib/inffast.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

// See state defs from inflate.js
var BAD = 30;       /* got a data error -- remain here until reset */
var TYPE = 12;      /* i: waiting for type bits, including last-flag bit */

/*
   Decode literal, length, and distance codes and write out the resulting
   literal and match bytes until either not enough input or output is
   available, an end-of-block is encountered, or a data error is encountered.
   When large enough input and output buffers are supplied to inflate(), for
   example, a 16K input buffer and a 64K output buffer, more than 95% of the
   inflate execution time is spent in this routine.

   Entry assumptions:

        state.mode === LEN
        strm.avail_in >= 6
        strm.avail_out >= 258
        start >= strm.avail_out
        state.bits < 8

   On return, state.mode is one of:

        LEN -- ran out of enough output space or enough available input
        TYPE -- reached end of block code, inflate() to interpret next block
        BAD -- error in block data

   Notes:

    - The maximum input bits used by a length/distance pair is 15 bits for the
      length code, 5 bits for the length extra, 15 bits for the distance code,
      and 13 bits for the distance extra.  This totals 48 bits, or six bytes.
      Therefore if strm.avail_in >= 6, then there is enough input to avoid
      checking for available input while decoding.

    - The maximum bytes that a single length/distance pair can output is 258
      bytes, which is the maximum length that can be coded.  inflate_fast()
      requires strm.avail_out >= 258 for each loop to avoid checking for
      output space.
 */
module.exports = function inflate_fast(strm, start) {
  var state;
  var _in;                    /* local strm.input */
  var last;                   /* have enough input while in < last */
  var _out;                   /* local strm.output */
  var beg;                    /* inflate()'s initial strm.output */
  var end;                    /* while out < end, enough space available */
//#ifdef INFLATE_STRICT
  var dmax;                   /* maximum distance from zlib header */
//#endif
  var wsize;                  /* window size or zero if not using window */
  var whave;                  /* valid bytes in the window */
  var wnext;                  /* window write index */
  // Use `s_window` instead `window`, avoid conflict with instrumentation tools
  var s_window;               /* allocated sliding window, if wsize != 0 */
  var hold;                   /* local strm.hold */
  var bits;                   /* local strm.bits */
  var lcode;                  /* local strm.lencode */
  var dcode;                  /* local strm.distcode */
  var lmask;                  /* mask for first level of length codes */
  var dmask;                  /* mask for first level of distance codes */
  var here;                   /* retrieved table entry */
  var op;                     /* code bits, operation, extra bits, or */
                              /*  window position, window bytes to copy */
  var len;                    /* match length, unused bytes */
  var dist;                   /* match distance */
  var from;                   /* where to copy match from */
  var from_source;


  var input, output; // JS specific, because we have no pointers

  /* copy state to local variables */
  state = strm.state;
  //here = state.here;
  _in = strm.next_in;
  input = strm.input;
  last = _in + (strm.avail_in - 5);
  _out = strm.next_out;
  output = strm.output;
  beg = _out - (start - strm.avail_out);
  end = _out + (strm.avail_out - 257);
//#ifdef INFLATE_STRICT
  dmax = state.dmax;
//#endif
  wsize = state.wsize;
  whave = state.whave;
  wnext = state.wnext;
  s_window = state.window;
  hold = state.hold;
  bits = state.bits;
  lcode = state.lencode;
  dcode = state.distcode;
  lmask = (1 << state.lenbits) - 1;
  dmask = (1 << state.distbits) - 1;


  /* decode literals and length/distances until end-of-block or not enough
     input data or output space */

  top:
  do {
    if (bits < 15) {
      hold += input[_in++] << bits;
      bits += 8;
      hold += input[_in++] << bits;
      bits += 8;
    }

    here = lcode[hold & lmask];

    dolen:
    for (;;) { // Goto emulation
      op = here >>> 24/*here.bits*/;
      hold >>>= op;
      bits -= op;
      op = (here >>> 16) & 0xff/*here.op*/;
      if (op === 0) {                          /* literal */
        //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
        //        "inflate:         literal '%c'\n" :
        //        "inflate:         literal 0x%02x\n", here.val));
        output[_out++] = here & 0xffff/*here.val*/;
      }
      else if (op & 16) {                     /* length base */
        len = here & 0xffff/*here.val*/;
        op &= 15;                           /* number of extra bits */
        if (op) {
          if (bits < op) {
            hold += input[_in++] << bits;
            bits += 8;
          }
          len += hold & ((1 << op) - 1);
          hold >>>= op;
          bits -= op;
        }
        //Tracevv((stderr, "inflate:         length %u\n", len));
        if (bits < 15) {
          hold += input[_in++] << bits;
          bits += 8;
          hold += input[_in++] << bits;
          bits += 8;
        }
        here = dcode[hold & dmask];

        dodist:
        for (;;) { // goto emulation
          op = here >>> 24/*here.bits*/;
          hold >>>= op;
          bits -= op;
          op = (here >>> 16) & 0xff/*here.op*/;

          if (op & 16) {                      /* distance base */
            dist = here & 0xffff/*here.val*/;
            op &= 15;                       /* number of extra bits */
            if (bits < op) {
              hold += input[_in++] << bits;
              bits += 8;
              if (bits < op) {
                hold += input[_in++] << bits;
                bits += 8;
              }
            }
            dist += hold & ((1 << op) - 1);
//#ifdef INFLATE_STRICT
            if (dist > dmax) {
              strm.msg = 'invalid distance too far back';
              state.mode = BAD;
              break top;
            }
//#endif
            hold >>>= op;
            bits -= op;
            //Tracevv((stderr, "inflate:         distance %u\n", dist));
            op = _out - beg;                /* max distance in output */
            if (dist > op) {                /* see if copy from window */
              op = dist - op;               /* distance back in window */
              if (op > whave) {
                if (state.sane) {
                  strm.msg = 'invalid distance too far back';
                  state.mode = BAD;
                  break top;
                }

// (!) This block is disabled in zlib defaults,
// don't enable it for binary compatibility
//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
//                if (len <= op - whave) {
//                  do {
//                    output[_out++] = 0;
//                  } while (--len);
//                  continue top;
//                }
//                len -= op - whave;
//                do {
//                  output[_out++] = 0;
//                } while (--op > whave);
//                if (op === 0) {
//                  from = _out - dist;
//                  do {
//                    output[_out++] = output[from++];
//                  } while (--len);
//                  continue top;
//                }
//#endif
              }
              from = 0; // window index
              from_source = s_window;
              if (wnext === 0) {           /* very common case */
                from += wsize - op;
                if (op < len) {         /* some from window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = _out - dist;  /* rest from output */
                  from_source = output;
                }
              }
              else if (wnext < op) {      /* wrap around window */
                from += wsize + wnext - op;
                op -= wnext;
                if (op < len) {         /* some from end of window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = 0;
                  if (wnext < len) {  /* some from start of window */
                    op = wnext;
                    len -= op;
                    do {
                      output[_out++] = s_window[from++];
                    } while (--op);
                    from = _out - dist;      /* rest from output */
                    from_source = output;
                  }
                }
              }
              else {                      /* contiguous in window */
                from += wnext - op;
                if (op < len) {         /* some from window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = _out - dist;  /* rest from output */
                  from_source = output;
                }
              }
              while (len > 2) {
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                len -= 3;
              }
              if (len) {
                output[_out++] = from_source[from++];
                if (len > 1) {
                  output[_out++] = from_source[from++];
                }
              }
            }
            else {
              from = _out - dist;          /* copy direct from output */
              do {                        /* minimum length is three */
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                len -= 3;
              } while (len > 2);
              if (len) {
                output[_out++] = output[from++];
                if (len > 1) {
                  output[_out++] = output[from++];
                }
              }
            }
          }
          else if ((op & 64) === 0) {          /* 2nd level distance code */
            here = dcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
            continue dodist;
          }
          else {
            strm.msg = 'invalid distance code';
            state.mode = BAD;
            break top;
          }

          break; // need to emulate goto via "continue"
        }
      }
      else if ((op & 64) === 0) {              /* 2nd level length code */
        here = lcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
        continue dolen;
      }
      else if (op & 32) {                     /* end-of-block */
        //Tracevv((stderr, "inflate:         end of block\n"));
        state.mode = TYPE;
        break top;
      }
      else {
        strm.msg = 'invalid literal/length code';
        state.mode = BAD;
        break top;
      }

      break; // need to emulate goto via "continue"
    }
  } while (_in < last && _out < end);

  /* return unused bytes (on entry, bits < 8, so in won't go too far back) */
  len = bits >> 3;
  _in -= len;
  bits -= len << 3;
  hold &= (1 << bits) - 1;

  /* update state and return */
  strm.next_in = _in;
  strm.next_out = _out;
  strm.avail_in = (_in < last ? 5 + (last - _in) : 5 - (_in - last));
  strm.avail_out = (_out < end ? 257 + (end - _out) : 257 - (_out - end));
  state.hold = hold;
  state.bits = bits;
  return;
};


/***/ }),

/***/ "./node_modules/pako/lib/zlib/inflate.js":
/*!***********************************************!*\
  !*** ./node_modules/pako/lib/zlib/inflate.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

var utils         = __webpack_require__(/*! ../utils/common */ "./node_modules/pako/lib/utils/common.js");
var adler32       = __webpack_require__(/*! ./adler32 */ "./node_modules/pako/lib/zlib/adler32.js");
var crc32         = __webpack_require__(/*! ./crc32 */ "./node_modules/pako/lib/zlib/crc32.js");
var inflate_fast  = __webpack_require__(/*! ./inffast */ "./node_modules/pako/lib/zlib/inffast.js");
var inflate_table = __webpack_require__(/*! ./inftrees */ "./node_modules/pako/lib/zlib/inftrees.js");

var CODES = 0;
var LENS = 1;
var DISTS = 2;

/* Public constants ==========================================================*/
/* ===========================================================================*/


/* Allowed flush values; see deflate() and inflate() below for details */
//var Z_NO_FLUSH      = 0;
//var Z_PARTIAL_FLUSH = 1;
//var Z_SYNC_FLUSH    = 2;
//var Z_FULL_FLUSH    = 3;
var Z_FINISH        = 4;
var Z_BLOCK         = 5;
var Z_TREES         = 6;


/* Return codes for the compression/decompression functions. Negative values
 * are errors, positive values are used for special but normal events.
 */
var Z_OK            = 0;
var Z_STREAM_END    = 1;
var Z_NEED_DICT     = 2;
//var Z_ERRNO         = -1;
var Z_STREAM_ERROR  = -2;
var Z_DATA_ERROR    = -3;
var Z_MEM_ERROR     = -4;
var Z_BUF_ERROR     = -5;
//var Z_VERSION_ERROR = -6;

/* The deflate compression method */
var Z_DEFLATED  = 8;


/* STATES ====================================================================*/
/* ===========================================================================*/


var    HEAD = 1;       /* i: waiting for magic header */
var    FLAGS = 2;      /* i: waiting for method and flags (gzip) */
var    TIME = 3;       /* i: waiting for modification time (gzip) */
var    OS = 4;         /* i: waiting for extra flags and operating system (gzip) */
var    EXLEN = 5;      /* i: waiting for extra length (gzip) */
var    EXTRA = 6;      /* i: waiting for extra bytes (gzip) */
var    NAME = 7;       /* i: waiting for end of file name (gzip) */
var    COMMENT = 8;    /* i: waiting for end of comment (gzip) */
var    HCRC = 9;       /* i: waiting for header crc (gzip) */
var    DICTID = 10;    /* i: waiting for dictionary check value */
var    DICT = 11;      /* waiting for inflateSetDictionary() call */
var        TYPE = 12;      /* i: waiting for type bits, including last-flag bit */
var        TYPEDO = 13;    /* i: same, but skip check to exit inflate on new block */
var        STORED = 14;    /* i: waiting for stored size (length and complement) */
var        COPY_ = 15;     /* i/o: same as COPY below, but only first time in */
var        COPY = 16;      /* i/o: waiting for input or output to copy stored block */
var        TABLE = 17;     /* i: waiting for dynamic block table lengths */
var        LENLENS = 18;   /* i: waiting for code length code lengths */
var        CODELENS = 19;  /* i: waiting for length/lit and distance code lengths */
var            LEN_ = 20;      /* i: same as LEN below, but only first time in */
var            LEN = 21;       /* i: waiting for length/lit/eob code */
var            LENEXT = 22;    /* i: waiting for length extra bits */
var            DIST = 23;      /* i: waiting for distance code */
var            DISTEXT = 24;   /* i: waiting for distance extra bits */
var            MATCH = 25;     /* o: waiting for output space to copy string */
var            LIT = 26;       /* o: waiting for output space to write literal */
var    CHECK = 27;     /* i: waiting for 32-bit check value */
var    LENGTH = 28;    /* i: waiting for 32-bit length (gzip) */
var    DONE = 29;      /* finished check, done -- remain here until reset */
var    BAD = 30;       /* got a data error -- remain here until reset */
var    MEM = 31;       /* got an inflate() memory error -- remain here until reset */
var    SYNC = 32;      /* looking for synchronization bytes to restart inflate() */

/* ===========================================================================*/



var ENOUGH_LENS = 852;
var ENOUGH_DISTS = 592;
//var ENOUGH =  (ENOUGH_LENS+ENOUGH_DISTS);

var MAX_WBITS = 15;
/* 32K LZ77 window */
var DEF_WBITS = MAX_WBITS;


function zswap32(q) {
  return  (((q >>> 24) & 0xff) +
          ((q >>> 8) & 0xff00) +
          ((q & 0xff00) << 8) +
          ((q & 0xff) << 24));
}


function InflateState() {
  this.mode = 0;             /* current inflate mode */
  this.last = false;          /* true if processing last block */
  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
  this.havedict = false;      /* true if dictionary provided */
  this.flags = 0;             /* gzip header method and flags (0 if zlib) */
  this.dmax = 0;              /* zlib header max distance (INFLATE_STRICT) */
  this.check = 0;             /* protected copy of check value */
  this.total = 0;             /* protected copy of output count */
  // TODO: may be {}
  this.head = null;           /* where to save gzip header information */

  /* sliding window */
  this.wbits = 0;             /* log base 2 of requested window size */
  this.wsize = 0;             /* window size or zero if not using window */
  this.whave = 0;             /* valid bytes in the window */
  this.wnext = 0;             /* window write index */
  this.window = null;         /* allocated sliding window, if needed */

  /* bit accumulator */
  this.hold = 0;              /* input bit accumulator */
  this.bits = 0;              /* number of bits in "in" */

  /* for string and stored block copying */
  this.length = 0;            /* literal or length of data to copy */
  this.offset = 0;            /* distance back to copy string from */

  /* for table and code decoding */
  this.extra = 0;             /* extra bits needed */

  /* fixed and dynamic code tables */
  this.lencode = null;          /* starting table for length/literal codes */
  this.distcode = null;         /* starting table for distance codes */
  this.lenbits = 0;           /* index bits for lencode */
  this.distbits = 0;          /* index bits for distcode */

  /* dynamic table building */
  this.ncode = 0;             /* number of code length code lengths */
  this.nlen = 0;              /* number of length code lengths */
  this.ndist = 0;             /* number of distance code lengths */
  this.have = 0;              /* number of code lengths in lens[] */
  this.next = null;              /* next available space in codes[] */

  this.lens = new utils.Buf16(320); /* temporary storage for code lengths */
  this.work = new utils.Buf16(288); /* work area for code table building */

  /*
   because we don't have pointers in js, we use lencode and distcode directly
   as buffers so we don't need codes
  */
  //this.codes = new utils.Buf32(ENOUGH);       /* space for code tables */
  this.lendyn = null;              /* dynamic table for length/literal codes (JS specific) */
  this.distdyn = null;             /* dynamic table for distance codes (JS specific) */
  this.sane = 0;                   /* if false, allow invalid distance too far */
  this.back = 0;                   /* bits back of last unprocessed length/lit */
  this.was = 0;                    /* initial length of match */
}

function inflateResetKeep(strm) {
  var state;

  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  state = strm.state;
  strm.total_in = strm.total_out = state.total = 0;
  strm.msg = ''; /*Z_NULL*/
  if (state.wrap) {       /* to support ill-conceived Java test suite */
    strm.adler = state.wrap & 1;
  }
  state.mode = HEAD;
  state.last = 0;
  state.havedict = 0;
  state.dmax = 32768;
  state.head = null/*Z_NULL*/;
  state.hold = 0;
  state.bits = 0;
  //state.lencode = state.distcode = state.next = state.codes;
  state.lencode = state.lendyn = new utils.Buf32(ENOUGH_LENS);
  state.distcode = state.distdyn = new utils.Buf32(ENOUGH_DISTS);

  state.sane = 1;
  state.back = -1;
  //Tracev((stderr, "inflate: reset\n"));
  return Z_OK;
}

function inflateReset(strm) {
  var state;

  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  state = strm.state;
  state.wsize = 0;
  state.whave = 0;
  state.wnext = 0;
  return inflateResetKeep(strm);

}

function inflateReset2(strm, windowBits) {
  var wrap;
  var state;

  /* get the state */
  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  state = strm.state;

  /* extract wrap request from windowBits parameter */
  if (windowBits < 0) {
    wrap = 0;
    windowBits = -windowBits;
  }
  else {
    wrap = (windowBits >> 4) + 1;
    if (windowBits < 48) {
      windowBits &= 15;
    }
  }

  /* set number of window bits, free window if different */
  if (windowBits && (windowBits < 8 || windowBits > 15)) {
    return Z_STREAM_ERROR;
  }
  if (state.window !== null && state.wbits !== windowBits) {
    state.window = null;
  }

  /* update state and reset the rest of it */
  state.wrap = wrap;
  state.wbits = windowBits;
  return inflateReset(strm);
}

function inflateInit2(strm, windowBits) {
  var ret;
  var state;

  if (!strm) { return Z_STREAM_ERROR; }
  //strm.msg = Z_NULL;                 /* in case we return an error */

  state = new InflateState();

  //if (state === Z_NULL) return Z_MEM_ERROR;
  //Tracev((stderr, "inflate: allocated\n"));
  strm.state = state;
  state.window = null/*Z_NULL*/;
  ret = inflateReset2(strm, windowBits);
  if (ret !== Z_OK) {
    strm.state = null/*Z_NULL*/;
  }
  return ret;
}

function inflateInit(strm) {
  return inflateInit2(strm, DEF_WBITS);
}


/*
 Return state with length and distance decoding tables and index sizes set to
 fixed code decoding.  Normally this returns fixed tables from inffixed.h.
 If BUILDFIXED is defined, then instead this routine builds the tables the
 first time it's called, and returns those tables the first time and
 thereafter.  This reduces the size of the code by about 2K bytes, in
 exchange for a little execution time.  However, BUILDFIXED should not be
 used for threaded applications, since the rewriting of the tables and virgin
 may not be thread-safe.
 */
var virgin = true;

var lenfix, distfix; // We have no pointers in JS, so keep tables separate

function fixedtables(state) {
  /* build fixed huffman tables if first call (may not be thread safe) */
  if (virgin) {
    var sym;

    lenfix = new utils.Buf32(512);
    distfix = new utils.Buf32(32);

    /* literal/length table */
    sym = 0;
    while (sym < 144) { state.lens[sym++] = 8; }
    while (sym < 256) { state.lens[sym++] = 9; }
    while (sym < 280) { state.lens[sym++] = 7; }
    while (sym < 288) { state.lens[sym++] = 8; }

    inflate_table(LENS,  state.lens, 0, 288, lenfix,   0, state.work, { bits: 9 });

    /* distance table */
    sym = 0;
    while (sym < 32) { state.lens[sym++] = 5; }

    inflate_table(DISTS, state.lens, 0, 32,   distfix, 0, state.work, { bits: 5 });

    /* do this just once */
    virgin = false;
  }

  state.lencode = lenfix;
  state.lenbits = 9;
  state.distcode = distfix;
  state.distbits = 5;
}


/*
 Update the window with the last wsize (normally 32K) bytes written before
 returning.  If window does not exist yet, create it.  This is only called
 when a window is already in use, or when output has been written during this
 inflate call, but the end of the deflate stream has not been reached yet.
 It is also called to create a window for dictionary data when a dictionary
 is loaded.

 Providing output buffers larger than 32K to inflate() should provide a speed
 advantage, since only the last 32K of output is copied to the sliding window
 upon return from inflate(), and since all distances after the first 32K of
 output will fall in the output data, making match copies simpler and faster.
 The advantage may be dependent on the size of the processor's data caches.
 */
function updatewindow(strm, src, end, copy) {
  var dist;
  var state = strm.state;

  /* if it hasn't been done already, allocate space for the window */
  if (state.window === null) {
    state.wsize = 1 << state.wbits;
    state.wnext = 0;
    state.whave = 0;

    state.window = new utils.Buf8(state.wsize);
  }

  /* copy state->wsize or less output bytes into the circular window */
  if (copy >= state.wsize) {
    utils.arraySet(state.window, src, end - state.wsize, state.wsize, 0);
    state.wnext = 0;
    state.whave = state.wsize;
  }
  else {
    dist = state.wsize - state.wnext;
    if (dist > copy) {
      dist = copy;
    }
    //zmemcpy(state->window + state->wnext, end - copy, dist);
    utils.arraySet(state.window, src, end - copy, dist, state.wnext);
    copy -= dist;
    if (copy) {
      //zmemcpy(state->window, end - copy, copy);
      utils.arraySet(state.window, src, end - copy, copy, 0);
      state.wnext = copy;
      state.whave = state.wsize;
    }
    else {
      state.wnext += dist;
      if (state.wnext === state.wsize) { state.wnext = 0; }
      if (state.whave < state.wsize) { state.whave += dist; }
    }
  }
  return 0;
}

function inflate(strm, flush) {
  var state;
  var input, output;          // input/output buffers
  var next;                   /* next input INDEX */
  var put;                    /* next output INDEX */
  var have, left;             /* available input and output */
  var hold;                   /* bit buffer */
  var bits;                   /* bits in bit buffer */
  var _in, _out;              /* save starting available input and output */
  var copy;                   /* number of stored or match bytes to copy */
  var from;                   /* where to copy match bytes from */
  var from_source;
  var here = 0;               /* current decoding table entry */
  var here_bits, here_op, here_val; // paked "here" denormalized (JS specific)
  //var last;                   /* parent table entry */
  var last_bits, last_op, last_val; // paked "last" denormalized (JS specific)
  var len;                    /* length to copy for repeats, bits to drop */
  var ret;                    /* return code */
  var hbuf = new utils.Buf8(4);    /* buffer for gzip header crc calculation */
  var opts;

  var n; // temporary var for NEED_BITS

  var order = /* permutation of code lengths */
    [ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ];


  if (!strm || !strm.state || !strm.output ||
      (!strm.input && strm.avail_in !== 0)) {
    return Z_STREAM_ERROR;
  }

  state = strm.state;
  if (state.mode === TYPE) { state.mode = TYPEDO; }    /* skip check */


  //--- LOAD() ---
  put = strm.next_out;
  output = strm.output;
  left = strm.avail_out;
  next = strm.next_in;
  input = strm.input;
  have = strm.avail_in;
  hold = state.hold;
  bits = state.bits;
  //---

  _in = have;
  _out = left;
  ret = Z_OK;

  inf_leave: // goto emulation
  for (;;) {
    switch (state.mode) {
      case HEAD:
        if (state.wrap === 0) {
          state.mode = TYPEDO;
          break;
        }
        //=== NEEDBITS(16);
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if ((state.wrap & 2) && hold === 0x8b1f) {  /* gzip header */
          state.check = 0/*crc32(0L, Z_NULL, 0)*/;
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32(state.check, hbuf, 2, 0);
          //===//

          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = FLAGS;
          break;
        }
        state.flags = 0;           /* expect zlib header */
        if (state.head) {
          state.head.done = false;
        }
        if (!(state.wrap & 1) ||   /* check if zlib header allowed */
          (((hold & 0xff)/*BITS(8)*/ << 8) + (hold >> 8)) % 31) {
          strm.msg = 'incorrect header check';
          state.mode = BAD;
          break;
        }
        if ((hold & 0x0f)/*BITS(4)*/ !== Z_DEFLATED) {
          strm.msg = 'unknown compression method';
          state.mode = BAD;
          break;
        }
        //--- DROPBITS(4) ---//
        hold >>>= 4;
        bits -= 4;
        //---//
        len = (hold & 0x0f)/*BITS(4)*/ + 8;
        if (state.wbits === 0) {
          state.wbits = len;
        }
        else if (len > state.wbits) {
          strm.msg = 'invalid window size';
          state.mode = BAD;
          break;
        }
        state.dmax = 1 << len;
        //Tracev((stderr, "inflate:   zlib header ok\n"));
        strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
        state.mode = hold & 0x200 ? DICTID : TYPE;
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        break;
      case FLAGS:
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.flags = hold;
        if ((state.flags & 0xff) !== Z_DEFLATED) {
          strm.msg = 'unknown compression method';
          state.mode = BAD;
          break;
        }
        if (state.flags & 0xe000) {
          strm.msg = 'unknown header flags set';
          state.mode = BAD;
          break;
        }
        if (state.head) {
          state.head.text = ((hold >> 8) & 1);
        }
        if (state.flags & 0x0200) {
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32(state.check, hbuf, 2, 0);
          //===//
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = TIME;
        /* falls through */
      case TIME:
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (state.head) {
          state.head.time = hold;
        }
        if (state.flags & 0x0200) {
          //=== CRC4(state.check, hold)
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          hbuf[2] = (hold >>> 16) & 0xff;
          hbuf[3] = (hold >>> 24) & 0xff;
          state.check = crc32(state.check, hbuf, 4, 0);
          //===
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = OS;
        /* falls through */
      case OS:
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (state.head) {
          state.head.xflags = (hold & 0xff);
          state.head.os = (hold >> 8);
        }
        if (state.flags & 0x0200) {
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32(state.check, hbuf, 2, 0);
          //===//
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = EXLEN;
        /* falls through */
      case EXLEN:
        if (state.flags & 0x0400) {
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.length = hold;
          if (state.head) {
            state.head.extra_len = hold;
          }
          if (state.flags & 0x0200) {
            //=== CRC2(state.check, hold);
            hbuf[0] = hold & 0xff;
            hbuf[1] = (hold >>> 8) & 0xff;
            state.check = crc32(state.check, hbuf, 2, 0);
            //===//
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
        }
        else if (state.head) {
          state.head.extra = null/*Z_NULL*/;
        }
        state.mode = EXTRA;
        /* falls through */
      case EXTRA:
        if (state.flags & 0x0400) {
          copy = state.length;
          if (copy > have) { copy = have; }
          if (copy) {
            if (state.head) {
              len = state.head.extra_len - state.length;
              if (!state.head.extra) {
                // Use untyped array for more convenient processing later
                state.head.extra = new Array(state.head.extra_len);
              }
              utils.arraySet(
                state.head.extra,
                input,
                next,
                // extra field is limited to 65536 bytes
                // - no need for additional size check
                copy,
                /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                len
              );
              //zmemcpy(state.head.extra + len, next,
              //        len + copy > state.head.extra_max ?
              //        state.head.extra_max - len : copy);
            }
            if (state.flags & 0x0200) {
              state.check = crc32(state.check, input, copy, next);
            }
            have -= copy;
            next += copy;
            state.length -= copy;
          }
          if (state.length) { break inf_leave; }
        }
        state.length = 0;
        state.mode = NAME;
        /* falls through */
      case NAME:
        if (state.flags & 0x0800) {
          if (have === 0) { break inf_leave; }
          copy = 0;
          do {
            // TODO: 2 or 1 bytes?
            len = input[next + copy++];
            /* use constant limit because in js we should not preallocate memory */
            if (state.head && len &&
                (state.length < 65536 /*state.head.name_max*/)) {
              state.head.name += String.fromCharCode(len);
            }
          } while (len && copy < have);

          if (state.flags & 0x0200) {
            state.check = crc32(state.check, input, copy, next);
          }
          have -= copy;
          next += copy;
          if (len) { break inf_leave; }
        }
        else if (state.head) {
          state.head.name = null;
        }
        state.length = 0;
        state.mode = COMMENT;
        /* falls through */
      case COMMENT:
        if (state.flags & 0x1000) {
          if (have === 0) { break inf_leave; }
          copy = 0;
          do {
            len = input[next + copy++];
            /* use constant limit because in js we should not preallocate memory */
            if (state.head && len &&
                (state.length < 65536 /*state.head.comm_max*/)) {
              state.head.comment += String.fromCharCode(len);
            }
          } while (len && copy < have);
          if (state.flags & 0x0200) {
            state.check = crc32(state.check, input, copy, next);
          }
          have -= copy;
          next += copy;
          if (len) { break inf_leave; }
        }
        else if (state.head) {
          state.head.comment = null;
        }
        state.mode = HCRC;
        /* falls through */
      case HCRC:
        if (state.flags & 0x0200) {
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if (hold !== (state.check & 0xffff)) {
            strm.msg = 'header crc mismatch';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
        }
        if (state.head) {
          state.head.hcrc = ((state.flags >> 9) & 1);
          state.head.done = true;
        }
        strm.adler = state.check = 0;
        state.mode = TYPE;
        break;
      case DICTID:
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        strm.adler = state.check = zswap32(hold);
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = DICT;
        /* falls through */
      case DICT:
        if (state.havedict === 0) {
          //--- RESTORE() ---
          strm.next_out = put;
          strm.avail_out = left;
          strm.next_in = next;
          strm.avail_in = have;
          state.hold = hold;
          state.bits = bits;
          //---
          return Z_NEED_DICT;
        }
        strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
        state.mode = TYPE;
        /* falls through */
      case TYPE:
        if (flush === Z_BLOCK || flush === Z_TREES) { break inf_leave; }
        /* falls through */
      case TYPEDO:
        if (state.last) {
          //--- BYTEBITS() ---//
          hold >>>= bits & 7;
          bits -= bits & 7;
          //---//
          state.mode = CHECK;
          break;
        }
        //=== NEEDBITS(3); */
        while (bits < 3) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.last = (hold & 0x01)/*BITS(1)*/;
        //--- DROPBITS(1) ---//
        hold >>>= 1;
        bits -= 1;
        //---//

        switch ((hold & 0x03)/*BITS(2)*/) {
          case 0:                             /* stored block */
            //Tracev((stderr, "inflate:     stored block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = STORED;
            break;
          case 1:                             /* fixed block */
            fixedtables(state);
            //Tracev((stderr, "inflate:     fixed codes block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = LEN_;             /* decode codes */
            if (flush === Z_TREES) {
              //--- DROPBITS(2) ---//
              hold >>>= 2;
              bits -= 2;
              //---//
              break inf_leave;
            }
            break;
          case 2:                             /* dynamic block */
            //Tracev((stderr, "inflate:     dynamic codes block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = TABLE;
            break;
          case 3:
            strm.msg = 'invalid block type';
            state.mode = BAD;
        }
        //--- DROPBITS(2) ---//
        hold >>>= 2;
        bits -= 2;
        //---//
        break;
      case STORED:
        //--- BYTEBITS() ---// /* go to byte boundary */
        hold >>>= bits & 7;
        bits -= bits & 7;
        //---//
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if ((hold & 0xffff) !== ((hold >>> 16) ^ 0xffff)) {
          strm.msg = 'invalid stored block lengths';
          state.mode = BAD;
          break;
        }
        state.length = hold & 0xffff;
        //Tracev((stderr, "inflate:       stored length %u\n",
        //        state.length));
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = COPY_;
        if (flush === Z_TREES) { break inf_leave; }
        /* falls through */
      case COPY_:
        state.mode = COPY;
        /* falls through */
      case COPY:
        copy = state.length;
        if (copy) {
          if (copy > have) { copy = have; }
          if (copy > left) { copy = left; }
          if (copy === 0) { break inf_leave; }
          //--- zmemcpy(put, next, copy); ---
          utils.arraySet(output, input, next, copy, put);
          //---//
          have -= copy;
          next += copy;
          left -= copy;
          put += copy;
          state.length -= copy;
          break;
        }
        //Tracev((stderr, "inflate:       stored end\n"));
        state.mode = TYPE;
        break;
      case TABLE:
        //=== NEEDBITS(14); */
        while (bits < 14) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.nlen = (hold & 0x1f)/*BITS(5)*/ + 257;
        //--- DROPBITS(5) ---//
        hold >>>= 5;
        bits -= 5;
        //---//
        state.ndist = (hold & 0x1f)/*BITS(5)*/ + 1;
        //--- DROPBITS(5) ---//
        hold >>>= 5;
        bits -= 5;
        //---//
        state.ncode = (hold & 0x0f)/*BITS(4)*/ + 4;
        //--- DROPBITS(4) ---//
        hold >>>= 4;
        bits -= 4;
        //---//
//#ifndef PKZIP_BUG_WORKAROUND
        if (state.nlen > 286 || state.ndist > 30) {
          strm.msg = 'too many length or distance symbols';
          state.mode = BAD;
          break;
        }
//#endif
        //Tracev((stderr, "inflate:       table sizes ok\n"));
        state.have = 0;
        state.mode = LENLENS;
        /* falls through */
      case LENLENS:
        while (state.have < state.ncode) {
          //=== NEEDBITS(3);
          while (bits < 3) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.lens[order[state.have++]] = (hold & 0x07);//BITS(3);
          //--- DROPBITS(3) ---//
          hold >>>= 3;
          bits -= 3;
          //---//
        }
        while (state.have < 19) {
          state.lens[order[state.have++]] = 0;
        }
        // We have separate tables & no pointers. 2 commented lines below not needed.
        //state.next = state.codes;
        //state.lencode = state.next;
        // Switch to use dynamic table
        state.lencode = state.lendyn;
        state.lenbits = 7;

        opts = { bits: state.lenbits };
        ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
        state.lenbits = opts.bits;

        if (ret) {
          strm.msg = 'invalid code lengths set';
          state.mode = BAD;
          break;
        }
        //Tracev((stderr, "inflate:       code lengths ok\n"));
        state.have = 0;
        state.mode = CODELENS;
        /* falls through */
      case CODELENS:
        while (state.have < state.nlen + state.ndist) {
          for (;;) {
            here = state.lencode[hold & ((1 << state.lenbits) - 1)];/*BITS(state.lenbits)*/
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          if (here_val < 16) {
            //--- DROPBITS(here.bits) ---//
            hold >>>= here_bits;
            bits -= here_bits;
            //---//
            state.lens[state.have++] = here_val;
          }
          else {
            if (here_val === 16) {
              //=== NEEDBITS(here.bits + 2);
              n = here_bits + 2;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              if (state.have === 0) {
                strm.msg = 'invalid bit length repeat';
                state.mode = BAD;
                break;
              }
              len = state.lens[state.have - 1];
              copy = 3 + (hold & 0x03);//BITS(2);
              //--- DROPBITS(2) ---//
              hold >>>= 2;
              bits -= 2;
              //---//
            }
            else if (here_val === 17) {
              //=== NEEDBITS(here.bits + 3);
              n = here_bits + 3;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              len = 0;
              copy = 3 + (hold & 0x07);//BITS(3);
              //--- DROPBITS(3) ---//
              hold >>>= 3;
              bits -= 3;
              //---//
            }
            else {
              //=== NEEDBITS(here.bits + 7);
              n = here_bits + 7;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              len = 0;
              copy = 11 + (hold & 0x7f);//BITS(7);
              //--- DROPBITS(7) ---//
              hold >>>= 7;
              bits -= 7;
              //---//
            }
            if (state.have + copy > state.nlen + state.ndist) {
              strm.msg = 'invalid bit length repeat';
              state.mode = BAD;
              break;
            }
            while (copy--) {
              state.lens[state.have++] = len;
            }
          }
        }

        /* handle error breaks in while */
        if (state.mode === BAD) { break; }

        /* check for end-of-block code (better have one) */
        if (state.lens[256] === 0) {
          strm.msg = 'invalid code -- missing end-of-block';
          state.mode = BAD;
          break;
        }

        /* build code tables -- note: do not change the lenbits or distbits
           values here (9 and 6) without reading the comments in inftrees.h
           concerning the ENOUGH constants, which depend on those values */
        state.lenbits = 9;

        opts = { bits: state.lenbits };
        ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
        // We have separate tables & no pointers. 2 commented lines below not needed.
        // state.next_index = opts.table_index;
        state.lenbits = opts.bits;
        // state.lencode = state.next;

        if (ret) {
          strm.msg = 'invalid literal/lengths set';
          state.mode = BAD;
          break;
        }

        state.distbits = 6;
        //state.distcode.copy(state.codes);
        // Switch to use dynamic table
        state.distcode = state.distdyn;
        opts = { bits: state.distbits };
        ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
        // We have separate tables & no pointers. 2 commented lines below not needed.
        // state.next_index = opts.table_index;
        state.distbits = opts.bits;
        // state.distcode = state.next;

        if (ret) {
          strm.msg = 'invalid distances set';
          state.mode = BAD;
          break;
        }
        //Tracev((stderr, 'inflate:       codes ok\n'));
        state.mode = LEN_;
        if (flush === Z_TREES) { break inf_leave; }
        /* falls through */
      case LEN_:
        state.mode = LEN;
        /* falls through */
      case LEN:
        if (have >= 6 && left >= 258) {
          //--- RESTORE() ---
          strm.next_out = put;
          strm.avail_out = left;
          strm.next_in = next;
          strm.avail_in = have;
          state.hold = hold;
          state.bits = bits;
          //---
          inflate_fast(strm, _out);
          //--- LOAD() ---
          put = strm.next_out;
          output = strm.output;
          left = strm.avail_out;
          next = strm.next_in;
          input = strm.input;
          have = strm.avail_in;
          hold = state.hold;
          bits = state.bits;
          //---

          if (state.mode === TYPE) {
            state.back = -1;
          }
          break;
        }
        state.back = 0;
        for (;;) {
          here = state.lencode[hold & ((1 << state.lenbits) - 1)];  /*BITS(state.lenbits)*/
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if (here_bits <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        if (here_op && (here_op & 0xf0) === 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;
          for (;;) {
            here = state.lencode[last_val +
                    ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((last_bits + here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          //--- DROPBITS(last.bits) ---//
          hold >>>= last_bits;
          bits -= last_bits;
          //---//
          state.back += last_bits;
        }
        //--- DROPBITS(here.bits) ---//
        hold >>>= here_bits;
        bits -= here_bits;
        //---//
        state.back += here_bits;
        state.length = here_val;
        if (here_op === 0) {
          //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
          //        "inflate:         literal '%c'\n" :
          //        "inflate:         literal 0x%02x\n", here.val));
          state.mode = LIT;
          break;
        }
        if (here_op & 32) {
          //Tracevv((stderr, "inflate:         end of block\n"));
          state.back = -1;
          state.mode = TYPE;
          break;
        }
        if (here_op & 64) {
          strm.msg = 'invalid literal/length code';
          state.mode = BAD;
          break;
        }
        state.extra = here_op & 15;
        state.mode = LENEXT;
        /* falls through */
      case LENEXT:
        if (state.extra) {
          //=== NEEDBITS(state.extra);
          n = state.extra;
          while (bits < n) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.length += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
          //--- DROPBITS(state.extra) ---//
          hold >>>= state.extra;
          bits -= state.extra;
          //---//
          state.back += state.extra;
        }
        //Tracevv((stderr, "inflate:         length %u\n", state.length));
        state.was = state.length;
        state.mode = DIST;
        /* falls through */
      case DIST:
        for (;;) {
          here = state.distcode[hold & ((1 << state.distbits) - 1)];/*BITS(state.distbits)*/
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if ((here_bits) <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        if ((here_op & 0xf0) === 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;
          for (;;) {
            here = state.distcode[last_val +
                    ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((last_bits + here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          //--- DROPBITS(last.bits) ---//
          hold >>>= last_bits;
          bits -= last_bits;
          //---//
          state.back += last_bits;
        }
        //--- DROPBITS(here.bits) ---//
        hold >>>= here_bits;
        bits -= here_bits;
        //---//
        state.back += here_bits;
        if (here_op & 64) {
          strm.msg = 'invalid distance code';
          state.mode = BAD;
          break;
        }
        state.offset = here_val;
        state.extra = (here_op) & 15;
        state.mode = DISTEXT;
        /* falls through */
      case DISTEXT:
        if (state.extra) {
          //=== NEEDBITS(state.extra);
          n = state.extra;
          while (bits < n) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.offset += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
          //--- DROPBITS(state.extra) ---//
          hold >>>= state.extra;
          bits -= state.extra;
          //---//
          state.back += state.extra;
        }
//#ifdef INFLATE_STRICT
        if (state.offset > state.dmax) {
          strm.msg = 'invalid distance too far back';
          state.mode = BAD;
          break;
        }
//#endif
        //Tracevv((stderr, "inflate:         distance %u\n", state.offset));
        state.mode = MATCH;
        /* falls through */
      case MATCH:
        if (left === 0) { break inf_leave; }
        copy = _out - left;
        if (state.offset > copy) {         /* copy from window */
          copy = state.offset - copy;
          if (copy > state.whave) {
            if (state.sane) {
              strm.msg = 'invalid distance too far back';
              state.mode = BAD;
              break;
            }
// (!) This block is disabled in zlib defaults,
// don't enable it for binary compatibility
//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
//          Trace((stderr, "inflate.c too far\n"));
//          copy -= state.whave;
//          if (copy > state.length) { copy = state.length; }
//          if (copy > left) { copy = left; }
//          left -= copy;
//          state.length -= copy;
//          do {
//            output[put++] = 0;
//          } while (--copy);
//          if (state.length === 0) { state.mode = LEN; }
//          break;
//#endif
          }
          if (copy > state.wnext) {
            copy -= state.wnext;
            from = state.wsize - copy;
          }
          else {
            from = state.wnext - copy;
          }
          if (copy > state.length) { copy = state.length; }
          from_source = state.window;
        }
        else {                              /* copy from output */
          from_source = output;
          from = put - state.offset;
          copy = state.length;
        }
        if (copy > left) { copy = left; }
        left -= copy;
        state.length -= copy;
        do {
          output[put++] = from_source[from++];
        } while (--copy);
        if (state.length === 0) { state.mode = LEN; }
        break;
      case LIT:
        if (left === 0) { break inf_leave; }
        output[put++] = state.length;
        left--;
        state.mode = LEN;
        break;
      case CHECK:
        if (state.wrap) {
          //=== NEEDBITS(32);
          while (bits < 32) {
            if (have === 0) { break inf_leave; }
            have--;
            // Use '|' instead of '+' to make sure that result is signed
            hold |= input[next++] << bits;
            bits += 8;
          }
          //===//
          _out -= left;
          strm.total_out += _out;
          state.total += _out;
          if (_out) {
            strm.adler = state.check =
                /*UPDATE(state.check, put - _out, _out);*/
                (state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out));

          }
          _out = left;
          // NB: crc32 stored as signed 32-bit int, zswap32 returns signed too
          if ((state.flags ? hold : zswap32(hold)) !== state.check) {
            strm.msg = 'incorrect data check';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          //Tracev((stderr, "inflate:   check matches trailer\n"));
        }
        state.mode = LENGTH;
        /* falls through */
      case LENGTH:
        if (state.wrap && state.flags) {
          //=== NEEDBITS(32);
          while (bits < 32) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if (hold !== (state.total & 0xffffffff)) {
            strm.msg = 'incorrect length check';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          //Tracev((stderr, "inflate:   length matches trailer\n"));
        }
        state.mode = DONE;
        /* falls through */
      case DONE:
        ret = Z_STREAM_END;
        break inf_leave;
      case BAD:
        ret = Z_DATA_ERROR;
        break inf_leave;
      case MEM:
        return Z_MEM_ERROR;
      case SYNC:
        /* falls through */
      default:
        return Z_STREAM_ERROR;
    }
  }

  // inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"

  /*
     Return from inflate(), updating the total counts and the check value.
     If there was no progress during the inflate() call, return a buffer
     error.  Call updatewindow() to create and/or update the window state.
     Note: a memory error from inflate() is non-recoverable.
   */

  //--- RESTORE() ---
  strm.next_out = put;
  strm.avail_out = left;
  strm.next_in = next;
  strm.avail_in = have;
  state.hold = hold;
  state.bits = bits;
  //---

  if (state.wsize || (_out !== strm.avail_out && state.mode < BAD &&
                      (state.mode < CHECK || flush !== Z_FINISH))) {
    if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
      state.mode = MEM;
      return Z_MEM_ERROR;
    }
  }
  _in -= strm.avail_in;
  _out -= strm.avail_out;
  strm.total_in += _in;
  strm.total_out += _out;
  state.total += _out;
  if (state.wrap && _out) {
    strm.adler = state.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
      (state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out));
  }
  strm.data_type = state.bits + (state.last ? 64 : 0) +
                    (state.mode === TYPE ? 128 : 0) +
                    (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
  if (((_in === 0 && _out === 0) || flush === Z_FINISH) && ret === Z_OK) {
    ret = Z_BUF_ERROR;
  }
  return ret;
}

function inflateEnd(strm) {

  if (!strm || !strm.state /*|| strm->zfree == (free_func)0*/) {
    return Z_STREAM_ERROR;
  }

  var state = strm.state;
  if (state.window) {
    state.window = null;
  }
  strm.state = null;
  return Z_OK;
}

function inflateGetHeader(strm, head) {
  var state;

  /* check state */
  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  state = strm.state;
  if ((state.wrap & 2) === 0) { return Z_STREAM_ERROR; }

  /* save header structure */
  state.head = head;
  head.done = false;
  return Z_OK;
}

function inflateSetDictionary(strm, dictionary) {
  var dictLength = dictionary.length;

  var state;
  var dictid;
  var ret;

  /* check state */
  if (!strm /* == Z_NULL */ || !strm.state /* == Z_NULL */) { return Z_STREAM_ERROR; }
  state = strm.state;

  if (state.wrap !== 0 && state.mode !== DICT) {
    return Z_STREAM_ERROR;
  }

  /* check for correct dictionary identifier */
  if (state.mode === DICT) {
    dictid = 1; /* adler32(0, null, 0)*/
    /* dictid = adler32(dictid, dictionary, dictLength); */
    dictid = adler32(dictid, dictionary, dictLength, 0);
    if (dictid !== state.check) {
      return Z_DATA_ERROR;
    }
  }
  /* copy dictionary to window using updatewindow(), which will amend the
   existing dictionary if appropriate */
  ret = updatewindow(strm, dictionary, dictLength, dictLength);
  if (ret) {
    state.mode = MEM;
    return Z_MEM_ERROR;
  }
  state.havedict = 1;
  // Tracev((stderr, "inflate:   dictionary set\n"));
  return Z_OK;
}

exports.inflateReset = inflateReset;
exports.inflateReset2 = inflateReset2;
exports.inflateResetKeep = inflateResetKeep;
exports.inflateInit = inflateInit;
exports.inflateInit2 = inflateInit2;
exports.inflate = inflate;
exports.inflateEnd = inflateEnd;
exports.inflateGetHeader = inflateGetHeader;
exports.inflateSetDictionary = inflateSetDictionary;
exports.inflateInfo = 'pako inflate (from Nodeca project)';

/* Not implemented
exports.inflateCopy = inflateCopy;
exports.inflateGetDictionary = inflateGetDictionary;
exports.inflateMark = inflateMark;
exports.inflatePrime = inflatePrime;
exports.inflateSync = inflateSync;
exports.inflateSyncPoint = inflateSyncPoint;
exports.inflateUndermine = inflateUndermine;
*/


/***/ }),

/***/ "./node_modules/pako/lib/zlib/inftrees.js":
/*!************************************************!*\
  !*** ./node_modules/pako/lib/zlib/inftrees.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

var utils = __webpack_require__(/*! ../utils/common */ "./node_modules/pako/lib/utils/common.js");

var MAXBITS = 15;
var ENOUGH_LENS = 852;
var ENOUGH_DISTS = 592;
//var ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);

var CODES = 0;
var LENS = 1;
var DISTS = 2;

var lbase = [ /* Length codes 257..285 base */
  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
  35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0
];

var lext = [ /* Length codes 257..285 extra */
  16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
  19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78
];

var dbase = [ /* Distance codes 0..29 base */
  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
  257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
  8193, 12289, 16385, 24577, 0, 0
];

var dext = [ /* Distance codes 0..29 extra */
  16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
  23, 23, 24, 24, 25, 25, 26, 26, 27, 27,
  28, 28, 29, 29, 64, 64
];

module.exports = function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts)
{
  var bits = opts.bits;
      //here = opts.here; /* table entry for duplication */

  var len = 0;               /* a code's length in bits */
  var sym = 0;               /* index of code symbols */
  var min = 0, max = 0;          /* minimum and maximum code lengths */
  var root = 0;              /* number of index bits for root table */
  var curr = 0;              /* number of index bits for current table */
  var drop = 0;              /* code bits to drop for sub-table */
  var left = 0;                   /* number of prefix codes available */
  var used = 0;              /* code entries in table used */
  var huff = 0;              /* Huffman code */
  var incr;              /* for incrementing code, index */
  var fill;              /* index for replicating entries */
  var low;               /* low bits for current root entry */
  var mask;              /* mask for low root bits */
  var next;             /* next available space in table */
  var base = null;     /* base value table to use */
  var base_index = 0;
//  var shoextra;    /* extra bits table to use */
  var end;                    /* use base and extra for symbol > end */
  var count = new utils.Buf16(MAXBITS + 1); //[MAXBITS+1];    /* number of codes of each length */
  var offs = new utils.Buf16(MAXBITS + 1); //[MAXBITS+1];     /* offsets in table for each length */
  var extra = null;
  var extra_index = 0;

  var here_bits, here_op, here_val;

  /*
   Process a set of code lengths to create a canonical Huffman code.  The
   code lengths are lens[0..codes-1].  Each length corresponds to the
   symbols 0..codes-1.  The Huffman code is generated by first sorting the
   symbols by length from short to long, and retaining the symbol order
   for codes with equal lengths.  Then the code starts with all zero bits
   for the first code of the shortest length, and the codes are integer
   increments for the same length, and zeros are appended as the length
   increases.  For the deflate format, these bits are stored backwards
   from their more natural integer increment ordering, and so when the
   decoding tables are built in the large loop below, the integer codes
   are incremented backwards.

   This routine assumes, but does not check, that all of the entries in
   lens[] are in the range 0..MAXBITS.  The caller must assure this.
   1..MAXBITS is interpreted as that code length.  zero means that that
   symbol does not occur in this code.

   The codes are sorted by computing a count of codes for each length,
   creating from that a table of starting indices for each length in the
   sorted table, and then entering the symbols in order in the sorted
   table.  The sorted table is work[], with that space being provided by
   the caller.

   The length counts are used for other purposes as well, i.e. finding
   the minimum and maximum length codes, determining if there are any
   codes at all, checking for a valid set of lengths, and looking ahead
   at length counts to determine sub-table sizes when building the
   decoding tables.
   */

  /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */
  for (len = 0; len <= MAXBITS; len++) {
    count[len] = 0;
  }
  for (sym = 0; sym < codes; sym++) {
    count[lens[lens_index + sym]]++;
  }

  /* bound code lengths, force root to be within code lengths */
  root = bits;
  for (max = MAXBITS; max >= 1; max--) {
    if (count[max] !== 0) { break; }
  }
  if (root > max) {
    root = max;
  }
  if (max === 0) {                     /* no symbols to code at all */
    //table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
    //table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
    //table.val[opts.table_index++] = 0;   //here.val = (var short)0;
    table[table_index++] = (1 << 24) | (64 << 16) | 0;


    //table.op[opts.table_index] = 64;
    //table.bits[opts.table_index] = 1;
    //table.val[opts.table_index++] = 0;
    table[table_index++] = (1 << 24) | (64 << 16) | 0;

    opts.bits = 1;
    return 0;     /* no symbols, but wait for decoding to report error */
  }
  for (min = 1; min < max; min++) {
    if (count[min] !== 0) { break; }
  }
  if (root < min) {
    root = min;
  }

  /* check for an over-subscribed or incomplete set of lengths */
  left = 1;
  for (len = 1; len <= MAXBITS; len++) {
    left <<= 1;
    left -= count[len];
    if (left < 0) {
      return -1;
    }        /* over-subscribed */
  }
  if (left > 0 && (type === CODES || max !== 1)) {
    return -1;                      /* incomplete set */
  }

  /* generate offsets into symbol table for each length for sorting */
  offs[1] = 0;
  for (len = 1; len < MAXBITS; len++) {
    offs[len + 1] = offs[len] + count[len];
  }

  /* sort symbols by length, by symbol order within each length */
  for (sym = 0; sym < codes; sym++) {
    if (lens[lens_index + sym] !== 0) {
      work[offs[lens[lens_index + sym]]++] = sym;
    }
  }

  /*
   Create and fill in decoding tables.  In this loop, the table being
   filled is at next and has curr index bits.  The code being used is huff
   with length len.  That code is converted to an index by dropping drop
   bits off of the bottom.  For codes where len is less than drop + curr,
   those top drop + curr - len bits are incremented through all values to
   fill the table with replicated entries.

   root is the number of index bits for the root table.  When len exceeds
   root, sub-tables are created pointed to by the root entry with an index
   of the low root bits of huff.  This is saved in low to check for when a
   new sub-table should be started.  drop is zero when the root table is
   being filled, and drop is root when sub-tables are being filled.

   When a new sub-table is needed, it is necessary to look ahead in the
   code lengths to determine what size sub-table is needed.  The length
   counts are used for this, and so count[] is decremented as codes are
   entered in the tables.

   used keeps track of how many table entries have been allocated from the
   provided *table space.  It is checked for LENS and DIST tables against
   the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
   the initial root table size constants.  See the comments in inftrees.h
   for more information.

   sym increments through all symbols, and the loop terminates when
   all codes of length max, i.e. all codes, have been processed.  This
   routine permits incomplete codes, so another loop after this one fills
   in the rest of the decoding tables with invalid code markers.
   */

  /* set up for code type */
  // poor man optimization - use if-else instead of switch,
  // to avoid deopts in old v8
  if (type === CODES) {
    base = extra = work;    /* dummy value--not used */
    end = 19;

  } else if (type === LENS) {
    base = lbase;
    base_index -= 257;
    extra = lext;
    extra_index -= 257;
    end = 256;

  } else {                    /* DISTS */
    base = dbase;
    extra = dext;
    end = -1;
  }

  /* initialize opts for loop */
  huff = 0;                   /* starting code */
  sym = 0;                    /* starting code symbol */
  len = min;                  /* starting code length */
  next = table_index;              /* current table to fill in */
  curr = root;                /* current table index bits */
  drop = 0;                   /* current bits to drop from code for index */
  low = -1;                   /* trigger new sub-table when len > root */
  used = 1 << root;          /* use root table entries */
  mask = used - 1;            /* mask for comparing low */

  /* check available table space */
  if ((type === LENS && used > ENOUGH_LENS) ||
    (type === DISTS && used > ENOUGH_DISTS)) {
    return 1;
  }

  /* process all codes and make table entries */
  for (;;) {
    /* create table entry */
    here_bits = len - drop;
    if (work[sym] < end) {
      here_op = 0;
      here_val = work[sym];
    }
    else if (work[sym] > end) {
      here_op = extra[extra_index + work[sym]];
      here_val = base[base_index + work[sym]];
    }
    else {
      here_op = 32 + 64;         /* end of block */
      here_val = 0;
    }

    /* replicate for those indices with low len bits equal to huff */
    incr = 1 << (len - drop);
    fill = 1 << curr;
    min = fill;                 /* save offset to next table */
    do {
      fill -= incr;
      table[next + (huff >> drop) + fill] = (here_bits << 24) | (here_op << 16) | here_val |0;
    } while (fill !== 0);

    /* backwards increment the len-bit code huff */
    incr = 1 << (len - 1);
    while (huff & incr) {
      incr >>= 1;
    }
    if (incr !== 0) {
      huff &= incr - 1;
      huff += incr;
    } else {
      huff = 0;
    }

    /* go to next symbol, update count, len */
    sym++;
    if (--count[len] === 0) {
      if (len === max) { break; }
      len = lens[lens_index + work[sym]];
    }

    /* create new sub-table if needed */
    if (len > root && (huff & mask) !== low) {
      /* if first time, transition to sub-tables */
      if (drop === 0) {
        drop = root;
      }

      /* increment past last table */
      next += min;            /* here min is 1 << curr */

      /* determine length of next table */
      curr = len - drop;
      left = 1 << curr;
      while (curr + drop < max) {
        left -= count[curr + drop];
        if (left <= 0) { break; }
        curr++;
        left <<= 1;
      }

      /* check for enough space */
      used += 1 << curr;
      if ((type === LENS && used > ENOUGH_LENS) ||
        (type === DISTS && used > ENOUGH_DISTS)) {
        return 1;
      }

      /* point entry in root table to sub-table */
      low = huff & mask;
      /*table.op[low] = curr;
      table.bits[low] = root;
      table.val[low] = next - opts.table_index;*/
      table[low] = (root << 24) | (curr << 16) | (next - table_index) |0;
    }
  }

  /* fill in remaining table entry if code is incomplete (guaranteed to have
   at most one remaining entry, since if the code is incomplete, the
   maximum code length that was allowed to get this far is one bit) */
  if (huff !== 0) {
    //table.op[next + huff] = 64;            /* invalid code marker */
    //table.bits[next + huff] = len - drop;
    //table.val[next + huff] = 0;
    table[next + huff] = ((len - drop) << 24) | (64 << 16) |0;
  }

  /* set return parameters */
  //opts.table_index += used;
  opts.bits = root;
  return 0;
};


/***/ }),

/***/ "./node_modules/pako/lib/zlib/messages.js":
/*!************************************************!*\
  !*** ./node_modules/pako/lib/zlib/messages.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

module.exports = {
  2:      'need dictionary',     /* Z_NEED_DICT       2  */
  1:      'stream end',          /* Z_STREAM_END      1  */
  0:      '',                    /* Z_OK              0  */
  '-1':   'file error',          /* Z_ERRNO         (-1) */
  '-2':   'stream error',        /* Z_STREAM_ERROR  (-2) */
  '-3':   'data error',          /* Z_DATA_ERROR    (-3) */
  '-4':   'insufficient memory', /* Z_MEM_ERROR     (-4) */
  '-5':   'buffer error',        /* Z_BUF_ERROR     (-5) */
  '-6':   'incompatible version' /* Z_VERSION_ERROR (-6) */
};


/***/ }),

/***/ "./node_modules/pako/lib/zlib/trees.js":
/*!*********************************************!*\
  !*** ./node_modules/pako/lib/zlib/trees.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

/* eslint-disable space-unary-ops */

var utils = __webpack_require__(/*! ../utils/common */ "./node_modules/pako/lib/utils/common.js");

/* Public constants ==========================================================*/
/* ===========================================================================*/


//var Z_FILTERED          = 1;
//var Z_HUFFMAN_ONLY      = 2;
//var Z_RLE               = 3;
var Z_FIXED               = 4;
//var Z_DEFAULT_STRATEGY  = 0;

/* Possible values of the data_type field (though see inflate()) */
var Z_BINARY              = 0;
var Z_TEXT                = 1;
//var Z_ASCII             = 1; // = Z_TEXT
var Z_UNKNOWN             = 2;

/*============================================================================*/


function zero(buf) { var len = buf.length; while (--len >= 0) { buf[len] = 0; } }

// From zutil.h

var STORED_BLOCK = 0;
var STATIC_TREES = 1;
var DYN_TREES    = 2;
/* The three kinds of block type */

var MIN_MATCH    = 3;
var MAX_MATCH    = 258;
/* The minimum and maximum match lengths */

// From deflate.h
/* ===========================================================================
 * Internal compression state.
 */

var LENGTH_CODES  = 29;
/* number of length codes, not counting the special END_BLOCK code */

var LITERALS      = 256;
/* number of literal bytes 0..255 */

var L_CODES       = LITERALS + 1 + LENGTH_CODES;
/* number of Literal or Length codes, including the END_BLOCK code */

var D_CODES       = 30;
/* number of distance codes */

var BL_CODES      = 19;
/* number of codes used to transfer the bit lengths */

var HEAP_SIZE     = 2 * L_CODES + 1;
/* maximum heap size */

var MAX_BITS      = 15;
/* All codes must not exceed MAX_BITS bits */

var Buf_size      = 16;
/* size of bit buffer in bi_buf */


/* ===========================================================================
 * Constants
 */

var MAX_BL_BITS = 7;
/* Bit length codes must not exceed MAX_BL_BITS bits */

var END_BLOCK   = 256;
/* end of block literal code */

var REP_3_6     = 16;
/* repeat previous bit length 3-6 times (2 bits of repeat count) */

var REPZ_3_10   = 17;
/* repeat a zero length 3-10 times  (3 bits of repeat count) */

var REPZ_11_138 = 18;
/* repeat a zero length 11-138 times  (7 bits of repeat count) */

/* eslint-disable comma-spacing,array-bracket-spacing */
var extra_lbits =   /* extra bits for each length code */
  [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];

var extra_dbits =   /* extra bits for each distance code */
  [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];

var extra_blbits =  /* extra bits for each bit length code */
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7];

var bl_order =
  [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];
/* eslint-enable comma-spacing,array-bracket-spacing */

/* The lengths of the bit length codes are sent in order of decreasing
 * probability, to avoid transmitting the lengths for unused bit length codes.
 */

/* ===========================================================================
 * Local data. These are initialized only once.
 */

// We pre-fill arrays with 0 to avoid uninitialized gaps

var DIST_CODE_LEN = 512; /* see definition of array dist_code below */

// !!!! Use flat array instead of structure, Freq = i*2, Len = i*2+1
var static_ltree  = new Array((L_CODES + 2) * 2);
zero(static_ltree);
/* The static literal tree. Since the bit lengths are imposed, there is no
 * need for the L_CODES extra codes used during heap construction. However
 * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
 * below).
 */

var static_dtree  = new Array(D_CODES * 2);
zero(static_dtree);
/* The static distance tree. (Actually a trivial tree since all codes use
 * 5 bits.)
 */

var _dist_code    = new Array(DIST_CODE_LEN);
zero(_dist_code);
/* Distance codes. The first 256 values correspond to the distances
 * 3 .. 258, the last 256 values correspond to the top 8 bits of
 * the 15 bit distances.
 */

var _length_code  = new Array(MAX_MATCH - MIN_MATCH + 1);
zero(_length_code);
/* length code for each normalized match length (0 == MIN_MATCH) */

var base_length   = new Array(LENGTH_CODES);
zero(base_length);
/* First normalized length for each code (0 = MIN_MATCH) */

var base_dist     = new Array(D_CODES);
zero(base_dist);
/* First normalized distance for each code (0 = distance of 1) */


function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {

  this.static_tree  = static_tree;  /* static tree or NULL */
  this.extra_bits   = extra_bits;   /* extra bits for each code or NULL */
  this.extra_base   = extra_base;   /* base index for extra_bits */
  this.elems        = elems;        /* max number of elements in the tree */
  this.max_length   = max_length;   /* max bit length for the codes */

  // show if `static_tree` has data or dummy - needed for monomorphic objects
  this.has_stree    = static_tree && static_tree.length;
}


var static_l_desc;
var static_d_desc;
var static_bl_desc;


function TreeDesc(dyn_tree, stat_desc) {
  this.dyn_tree = dyn_tree;     /* the dynamic tree */
  this.max_code = 0;            /* largest code with non zero frequency */
  this.stat_desc = stat_desc;   /* the corresponding static tree */
}



function d_code(dist) {
  return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
}


/* ===========================================================================
 * Output a short LSB first on the stream.
 * IN assertion: there is enough room in pendingBuf.
 */
function put_short(s, w) {
//    put_byte(s, (uch)((w) & 0xff));
//    put_byte(s, (uch)((ush)(w) >> 8));
  s.pending_buf[s.pending++] = (w) & 0xff;
  s.pending_buf[s.pending++] = (w >>> 8) & 0xff;
}


/* ===========================================================================
 * Send a value on a given number of bits.
 * IN assertion: length <= 16 and value fits in length bits.
 */
function send_bits(s, value, length) {
  if (s.bi_valid > (Buf_size - length)) {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    put_short(s, s.bi_buf);
    s.bi_buf = value >> (Buf_size - s.bi_valid);
    s.bi_valid += length - Buf_size;
  } else {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    s.bi_valid += length;
  }
}


function send_code(s, c, tree) {
  send_bits(s, tree[c * 2]/*.Code*/, tree[c * 2 + 1]/*.Len*/);
}


/* ===========================================================================
 * Reverse the first len bits of a code, using straightforward code (a faster
 * method would use a table)
 * IN assertion: 1 <= len <= 15
 */
function bi_reverse(code, len) {
  var res = 0;
  do {
    res |= code & 1;
    code >>>= 1;
    res <<= 1;
  } while (--len > 0);
  return res >>> 1;
}


/* ===========================================================================
 * Flush the bit buffer, keeping at most 7 bits in it.
 */
function bi_flush(s) {
  if (s.bi_valid === 16) {
    put_short(s, s.bi_buf);
    s.bi_buf = 0;
    s.bi_valid = 0;

  } else if (s.bi_valid >= 8) {
    s.pending_buf[s.pending++] = s.bi_buf & 0xff;
    s.bi_buf >>= 8;
    s.bi_valid -= 8;
  }
}


/* ===========================================================================
 * Compute the optimal bit lengths for a tree and update the total bit length
 * for the current block.
 * IN assertion: the fields freq and dad are set, heap[heap_max] and
 *    above are the tree nodes sorted by increasing frequency.
 * OUT assertions: the field len is set to the optimal bit length, the
 *     array bl_count contains the frequencies for each bit length.
 *     The length opt_len is updated; static_len is also updated if stree is
 *     not null.
 */
function gen_bitlen(s, desc)
//    deflate_state *s;
//    tree_desc *desc;    /* the tree descriptor */
{
  var tree            = desc.dyn_tree;
  var max_code        = desc.max_code;
  var stree           = desc.stat_desc.static_tree;
  var has_stree       = desc.stat_desc.has_stree;
  var extra           = desc.stat_desc.extra_bits;
  var base            = desc.stat_desc.extra_base;
  var max_length      = desc.stat_desc.max_length;
  var h;              /* heap index */
  var n, m;           /* iterate over the tree elements */
  var bits;           /* bit length */
  var xbits;          /* extra bits */
  var f;              /* frequency */
  var overflow = 0;   /* number of elements with bit length too large */

  for (bits = 0; bits <= MAX_BITS; bits++) {
    s.bl_count[bits] = 0;
  }

  /* In a first pass, compute the optimal bit lengths (which may
   * overflow in the case of the bit length tree).
   */
  tree[s.heap[s.heap_max] * 2 + 1]/*.Len*/ = 0; /* root of the heap */

  for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
    n = s.heap[h];
    bits = tree[tree[n * 2 + 1]/*.Dad*/ * 2 + 1]/*.Len*/ + 1;
    if (bits > max_length) {
      bits = max_length;
      overflow++;
    }
    tree[n * 2 + 1]/*.Len*/ = bits;
    /* We overwrite tree[n].Dad which is no longer needed */

    if (n > max_code) { continue; } /* not a leaf node */

    s.bl_count[bits]++;
    xbits = 0;
    if (n >= base) {
      xbits = extra[n - base];
    }
    f = tree[n * 2]/*.Freq*/;
    s.opt_len += f * (bits + xbits);
    if (has_stree) {
      s.static_len += f * (stree[n * 2 + 1]/*.Len*/ + xbits);
    }
  }
  if (overflow === 0) { return; }

  // Trace((stderr,"\nbit length overflow\n"));
  /* This happens for example on obj2 and pic of the Calgary corpus */

  /* Find the first bit length which could increase: */
  do {
    bits = max_length - 1;
    while (s.bl_count[bits] === 0) { bits--; }
    s.bl_count[bits]--;      /* move one leaf down the tree */
    s.bl_count[bits + 1] += 2; /* move one overflow item as its brother */
    s.bl_count[max_length]--;
    /* The brother of the overflow item also moves one step up,
     * but this does not affect bl_count[max_length]
     */
    overflow -= 2;
  } while (overflow > 0);

  /* Now recompute all bit lengths, scanning in increasing frequency.
   * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
   * lengths instead of fixing only the wrong ones. This idea is taken
   * from 'ar' written by Haruhiko Okumura.)
   */
  for (bits = max_length; bits !== 0; bits--) {
    n = s.bl_count[bits];
    while (n !== 0) {
      m = s.heap[--h];
      if (m > max_code) { continue; }
      if (tree[m * 2 + 1]/*.Len*/ !== bits) {
        // Trace((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
        s.opt_len += (bits - tree[m * 2 + 1]/*.Len*/) * tree[m * 2]/*.Freq*/;
        tree[m * 2 + 1]/*.Len*/ = bits;
      }
      n--;
    }
  }
}


/* ===========================================================================
 * Generate the codes for a given tree and bit counts (which need not be
 * optimal).
 * IN assertion: the array bl_count contains the bit length statistics for
 * the given tree and the field len is set for all tree elements.
 * OUT assertion: the field code is set for all tree elements of non
 *     zero code length.
 */
function gen_codes(tree, max_code, bl_count)
//    ct_data *tree;             /* the tree to decorate */
//    int max_code;              /* largest code with non zero frequency */
//    ushf *bl_count;            /* number of codes at each bit length */
{
  var next_code = new Array(MAX_BITS + 1); /* next code value for each bit length */
  var code = 0;              /* running code value */
  var bits;                  /* bit index */
  var n;                     /* code index */

  /* The distribution counts are first used to generate the code values
   * without bit reversal.
   */
  for (bits = 1; bits <= MAX_BITS; bits++) {
    next_code[bits] = code = (code + bl_count[bits - 1]) << 1;
  }
  /* Check that the bit counts in bl_count are consistent. The last code
   * must be all ones.
   */
  //Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
  //        "inconsistent bit counts");
  //Tracev((stderr,"\ngen_codes: max_code %d ", max_code));

  for (n = 0;  n <= max_code; n++) {
    var len = tree[n * 2 + 1]/*.Len*/;
    if (len === 0) { continue; }
    /* Now reverse the bits */
    tree[n * 2]/*.Code*/ = bi_reverse(next_code[len]++, len);

    //Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
    //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
  }
}


/* ===========================================================================
 * Initialize the various 'constant' tables.
 */
function tr_static_init() {
  var n;        /* iterates over tree elements */
  var bits;     /* bit counter */
  var length;   /* length value */
  var code;     /* code value */
  var dist;     /* distance index */
  var bl_count = new Array(MAX_BITS + 1);
  /* number of codes at each bit length for an optimal tree */

  // do check in _tr_init()
  //if (static_init_done) return;

  /* For some embedded targets, global variables are not initialized: */
/*#ifdef NO_INIT_GLOBAL_POINTERS
  static_l_desc.static_tree = static_ltree;
  static_l_desc.extra_bits = extra_lbits;
  static_d_desc.static_tree = static_dtree;
  static_d_desc.extra_bits = extra_dbits;
  static_bl_desc.extra_bits = extra_blbits;
#endif*/

  /* Initialize the mapping length (0..255) -> length code (0..28) */
  length = 0;
  for (code = 0; code < LENGTH_CODES - 1; code++) {
    base_length[code] = length;
    for (n = 0; n < (1 << extra_lbits[code]); n++) {
      _length_code[length++] = code;
    }
  }
  //Assert (length == 256, "tr_static_init: length != 256");
  /* Note that the length 255 (match length 258) can be represented
   * in two different ways: code 284 + 5 bits or code 285, so we
   * overwrite length_code[255] to use the best encoding:
   */
  _length_code[length - 1] = code;

  /* Initialize the mapping dist (0..32K) -> dist code (0..29) */
  dist = 0;
  for (code = 0; code < 16; code++) {
    base_dist[code] = dist;
    for (n = 0; n < (1 << extra_dbits[code]); n++) {
      _dist_code[dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: dist != 256");
  dist >>= 7; /* from now on, all distances are divided by 128 */
  for (; code < D_CODES; code++) {
    base_dist[code] = dist << 7;
    for (n = 0; n < (1 << (extra_dbits[code] - 7)); n++) {
      _dist_code[256 + dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: 256+dist != 512");

  /* Construct the codes of the static literal tree */
  for (bits = 0; bits <= MAX_BITS; bits++) {
    bl_count[bits] = 0;
  }

  n = 0;
  while (n <= 143) {
    static_ltree[n * 2 + 1]/*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  while (n <= 255) {
    static_ltree[n * 2 + 1]/*.Len*/ = 9;
    n++;
    bl_count[9]++;
  }
  while (n <= 279) {
    static_ltree[n * 2 + 1]/*.Len*/ = 7;
    n++;
    bl_count[7]++;
  }
  while (n <= 287) {
    static_ltree[n * 2 + 1]/*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  /* Codes 286 and 287 do not exist, but we must include them in the
   * tree construction to get a canonical Huffman tree (longest code
   * all ones)
   */
  gen_codes(static_ltree, L_CODES + 1, bl_count);

  /* The static distance tree is trivial: */
  for (n = 0; n < D_CODES; n++) {
    static_dtree[n * 2 + 1]/*.Len*/ = 5;
    static_dtree[n * 2]/*.Code*/ = bi_reverse(n, 5);
  }

  // Now data ready and we can init static trees
  static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
  static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0,          D_CODES, MAX_BITS);
  static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0,         BL_CODES, MAX_BL_BITS);

  //static_init_done = true;
}


/* ===========================================================================
 * Initialize a new block.
 */
function init_block(s) {
  var n; /* iterates over tree elements */

  /* Initialize the trees. */
  for (n = 0; n < L_CODES;  n++) { s.dyn_ltree[n * 2]/*.Freq*/ = 0; }
  for (n = 0; n < D_CODES;  n++) { s.dyn_dtree[n * 2]/*.Freq*/ = 0; }
  for (n = 0; n < BL_CODES; n++) { s.bl_tree[n * 2]/*.Freq*/ = 0; }

  s.dyn_ltree[END_BLOCK * 2]/*.Freq*/ = 1;
  s.opt_len = s.static_len = 0;
  s.last_lit = s.matches = 0;
}


/* ===========================================================================
 * Flush the bit buffer and align the output on a byte boundary
 */
function bi_windup(s)
{
  if (s.bi_valid > 8) {
    put_short(s, s.bi_buf);
  } else if (s.bi_valid > 0) {
    //put_byte(s, (Byte)s->bi_buf);
    s.pending_buf[s.pending++] = s.bi_buf;
  }
  s.bi_buf = 0;
  s.bi_valid = 0;
}

/* ===========================================================================
 * Copy a stored block, storing first the length and its
 * one's complement if requested.
 */
function copy_block(s, buf, len, header)
//DeflateState *s;
//charf    *buf;    /* the input data */
//unsigned len;     /* its length */
//int      header;  /* true if block header must be written */
{
  bi_windup(s);        /* align on byte boundary */

  if (header) {
    put_short(s, len);
    put_short(s, ~len);
  }
//  while (len--) {
//    put_byte(s, *buf++);
//  }
  utils.arraySet(s.pending_buf, s.window, buf, len, s.pending);
  s.pending += len;
}

/* ===========================================================================
 * Compares to subtrees, using the tree depth as tie breaker when
 * the subtrees have equal frequency. This minimizes the worst case length.
 */
function smaller(tree, n, m, depth) {
  var _n2 = n * 2;
  var _m2 = m * 2;
  return (tree[_n2]/*.Freq*/ < tree[_m2]/*.Freq*/ ||
         (tree[_n2]/*.Freq*/ === tree[_m2]/*.Freq*/ && depth[n] <= depth[m]));
}

/* ===========================================================================
 * Restore the heap property by moving down the tree starting at node k,
 * exchanging a node with the smallest of its two sons if necessary, stopping
 * when the heap property is re-established (each father smaller than its
 * two sons).
 */
function pqdownheap(s, tree, k)
//    deflate_state *s;
//    ct_data *tree;  /* the tree to restore */
//    int k;               /* node to move down */
{
  var v = s.heap[k];
  var j = k << 1;  /* left son of k */
  while (j <= s.heap_len) {
    /* Set j to the smallest of the two sons: */
    if (j < s.heap_len &&
      smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
      j++;
    }
    /* Exit if v is smaller than both sons */
    if (smaller(tree, v, s.heap[j], s.depth)) { break; }

    /* Exchange v with the smallest son */
    s.heap[k] = s.heap[j];
    k = j;

    /* And continue down the tree, setting j to the left son of k */
    j <<= 1;
  }
  s.heap[k] = v;
}


// inlined manually
// var SMALLEST = 1;

/* ===========================================================================
 * Send the block data compressed using the given Huffman trees
 */
function compress_block(s, ltree, dtree)
//    deflate_state *s;
//    const ct_data *ltree; /* literal tree */
//    const ct_data *dtree; /* distance tree */
{
  var dist;           /* distance of matched string */
  var lc;             /* match length or unmatched char (if dist == 0) */
  var lx = 0;         /* running index in l_buf */
  var code;           /* the code to send */
  var extra;          /* number of extra bits to send */

  if (s.last_lit !== 0) {
    do {
      dist = (s.pending_buf[s.d_buf + lx * 2] << 8) | (s.pending_buf[s.d_buf + lx * 2 + 1]);
      lc = s.pending_buf[s.l_buf + lx];
      lx++;

      if (dist === 0) {
        send_code(s, lc, ltree); /* send a literal byte */
        //Tracecv(isgraph(lc), (stderr," '%c' ", lc));
      } else {
        /* Here, lc is the match length - MIN_MATCH */
        code = _length_code[lc];
        send_code(s, code + LITERALS + 1, ltree); /* send the length code */
        extra = extra_lbits[code];
        if (extra !== 0) {
          lc -= base_length[code];
          send_bits(s, lc, extra);       /* send the extra length bits */
        }
        dist--; /* dist is now the match distance - 1 */
        code = d_code(dist);
        //Assert (code < D_CODES, "bad d_code");

        send_code(s, code, dtree);       /* send the distance code */
        extra = extra_dbits[code];
        if (extra !== 0) {
          dist -= base_dist[code];
          send_bits(s, dist, extra);   /* send the extra distance bits */
        }
      } /* literal or match pair ? */

      /* Check that the overlay between pending_buf and d_buf+l_buf is ok: */
      //Assert((uInt)(s->pending) < s->lit_bufsize + 2*lx,
      //       "pendingBuf overflow");

    } while (lx < s.last_lit);
  }

  send_code(s, END_BLOCK, ltree);
}


/* ===========================================================================
 * Construct one Huffman tree and assigns the code bit strings and lengths.
 * Update the total bit length for the current block.
 * IN assertion: the field freq is set for all tree elements.
 * OUT assertions: the fields len and code are set to the optimal bit length
 *     and corresponding code. The length opt_len is updated; static_len is
 *     also updated if stree is not null. The field max_code is set.
 */
function build_tree(s, desc)
//    deflate_state *s;
//    tree_desc *desc; /* the tree descriptor */
{
  var tree     = desc.dyn_tree;
  var stree    = desc.stat_desc.static_tree;
  var has_stree = desc.stat_desc.has_stree;
  var elems    = desc.stat_desc.elems;
  var n, m;          /* iterate over heap elements */
  var max_code = -1; /* largest code with non zero frequency */
  var node;          /* new node being created */

  /* Construct the initial heap, with least frequent element in
   * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
   * heap[0] is not used.
   */
  s.heap_len = 0;
  s.heap_max = HEAP_SIZE;

  for (n = 0; n < elems; n++) {
    if (tree[n * 2]/*.Freq*/ !== 0) {
      s.heap[++s.heap_len] = max_code = n;
      s.depth[n] = 0;

    } else {
      tree[n * 2 + 1]/*.Len*/ = 0;
    }
  }

  /* The pkzip format requires that at least one distance code exists,
   * and that at least one bit should be sent even if there is only one
   * possible code. So to avoid special checks later on we force at least
   * two codes of non zero frequency.
   */
  while (s.heap_len < 2) {
    node = s.heap[++s.heap_len] = (max_code < 2 ? ++max_code : 0);
    tree[node * 2]/*.Freq*/ = 1;
    s.depth[node] = 0;
    s.opt_len--;

    if (has_stree) {
      s.static_len -= stree[node * 2 + 1]/*.Len*/;
    }
    /* node is 0 or 1 so it does not have extra bits */
  }
  desc.max_code = max_code;

  /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
   * establish sub-heaps of increasing lengths:
   */
  for (n = (s.heap_len >> 1/*int /2*/); n >= 1; n--) { pqdownheap(s, tree, n); }

  /* Construct the Huffman tree by repeatedly combining the least two
   * frequent nodes.
   */
  node = elems;              /* next internal node of the tree */
  do {
    //pqremove(s, tree, n);  /* n = node of least frequency */
    /*** pqremove ***/
    n = s.heap[1/*SMALLEST*/];
    s.heap[1/*SMALLEST*/] = s.heap[s.heap_len--];
    pqdownheap(s, tree, 1/*SMALLEST*/);
    /***/

    m = s.heap[1/*SMALLEST*/]; /* m = node of next least frequency */

    s.heap[--s.heap_max] = n; /* keep the nodes sorted by frequency */
    s.heap[--s.heap_max] = m;

    /* Create a new node father of n and m */
    tree[node * 2]/*.Freq*/ = tree[n * 2]/*.Freq*/ + tree[m * 2]/*.Freq*/;
    s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
    tree[n * 2 + 1]/*.Dad*/ = tree[m * 2 + 1]/*.Dad*/ = node;

    /* and insert the new node in the heap */
    s.heap[1/*SMALLEST*/] = node++;
    pqdownheap(s, tree, 1/*SMALLEST*/);

  } while (s.heap_len >= 2);

  s.heap[--s.heap_max] = s.heap[1/*SMALLEST*/];

  /* At this point, the fields freq and dad are set. We can now
   * generate the bit lengths.
   */
  gen_bitlen(s, desc);

  /* The field len is now set, we can generate the bit codes */
  gen_codes(tree, max_code, s.bl_count);
}


/* ===========================================================================
 * Scan a literal or distance tree to determine the frequencies of the codes
 * in the bit length tree.
 */
function scan_tree(s, tree, max_code)
//    deflate_state *s;
//    ct_data *tree;   /* the tree to be scanned */
//    int max_code;    /* and its largest code of non zero frequency */
{
  var n;                     /* iterates over all tree elements */
  var prevlen = -1;          /* last emitted length */
  var curlen;                /* length of current code */

  var nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

  var count = 0;             /* repeat count of the current code */
  var max_count = 7;         /* max repeat count */
  var min_count = 4;         /* min repeat count */

  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }
  tree[(max_code + 1) * 2 + 1]/*.Len*/ = 0xffff; /* guard */

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

    if (++count < max_count && curlen === nextlen) {
      continue;

    } else if (count < min_count) {
      s.bl_tree[curlen * 2]/*.Freq*/ += count;

    } else if (curlen !== 0) {

      if (curlen !== prevlen) { s.bl_tree[curlen * 2]/*.Freq*/++; }
      s.bl_tree[REP_3_6 * 2]/*.Freq*/++;

    } else if (count <= 10) {
      s.bl_tree[REPZ_3_10 * 2]/*.Freq*/++;

    } else {
      s.bl_tree[REPZ_11_138 * 2]/*.Freq*/++;
    }

    count = 0;
    prevlen = curlen;

    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;

    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;

    } else {
      max_count = 7;
      min_count = 4;
    }
  }
}


/* ===========================================================================
 * Send a literal or distance tree in compressed form, using the codes in
 * bl_tree.
 */
function send_tree(s, tree, max_code)
//    deflate_state *s;
//    ct_data *tree; /* the tree to be scanned */
//    int max_code;       /* and its largest code of non zero frequency */
{
  var n;                     /* iterates over all tree elements */
  var prevlen = -1;          /* last emitted length */
  var curlen;                /* length of current code */

  var nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

  var count = 0;             /* repeat count of the current code */
  var max_count = 7;         /* max repeat count */
  var min_count = 4;         /* min repeat count */

  /* tree[max_code+1].Len = -1; */  /* guard already set */
  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

    if (++count < max_count && curlen === nextlen) {
      continue;

    } else if (count < min_count) {
      do { send_code(s, curlen, s.bl_tree); } while (--count !== 0);

    } else if (curlen !== 0) {
      if (curlen !== prevlen) {
        send_code(s, curlen, s.bl_tree);
        count--;
      }
      //Assert(count >= 3 && count <= 6, " 3_6?");
      send_code(s, REP_3_6, s.bl_tree);
      send_bits(s, count - 3, 2);

    } else if (count <= 10) {
      send_code(s, REPZ_3_10, s.bl_tree);
      send_bits(s, count - 3, 3);

    } else {
      send_code(s, REPZ_11_138, s.bl_tree);
      send_bits(s, count - 11, 7);
    }

    count = 0;
    prevlen = curlen;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;

    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;

    } else {
      max_count = 7;
      min_count = 4;
    }
  }
}


/* ===========================================================================
 * Construct the Huffman tree for the bit lengths and return the index in
 * bl_order of the last bit length code to send.
 */
function build_bl_tree(s) {
  var max_blindex;  /* index of last bit length code of non zero freq */

  /* Determine the bit length frequencies for literal and distance trees */
  scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
  scan_tree(s, s.dyn_dtree, s.d_desc.max_code);

  /* Build the bit length tree: */
  build_tree(s, s.bl_desc);
  /* opt_len now includes the length of the tree representations, except
   * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
   */

  /* Determine the number of bit length codes to send. The pkzip format
   * requires that at least 4 bit length codes be sent. (appnote.txt says
   * 3 but the actual value used is 4.)
   */
  for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
    if (s.bl_tree[bl_order[max_blindex] * 2 + 1]/*.Len*/ !== 0) {
      break;
    }
  }
  /* Update opt_len to include the bit length tree and counts */
  s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
  //Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
  //        s->opt_len, s->static_len));

  return max_blindex;
}


/* ===========================================================================
 * Send the header for a block using dynamic Huffman trees: the counts, the
 * lengths of the bit length codes, the literal tree and the distance tree.
 * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
 */
function send_all_trees(s, lcodes, dcodes, blcodes)
//    deflate_state *s;
//    int lcodes, dcodes, blcodes; /* number of codes for each tree */
{
  var rank;                    /* index in bl_order */

  //Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
  //Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
  //        "too many codes");
  //Tracev((stderr, "\nbl counts: "));
  send_bits(s, lcodes - 257, 5); /* not +255 as stated in appnote.txt */
  send_bits(s, dcodes - 1,   5);
  send_bits(s, blcodes - 4,  4); /* not -3 as stated in appnote.txt */
  for (rank = 0; rank < blcodes; rank++) {
    //Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
    send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1]/*.Len*/, 3);
  }
  //Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_ltree, lcodes - 1); /* literal tree */
  //Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_dtree, dcodes - 1); /* distance tree */
  //Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
}


/* ===========================================================================
 * Check if the data type is TEXT or BINARY, using the following algorithm:
 * - TEXT if the two conditions below are satisfied:
 *    a) There are no non-portable control characters belonging to the
 *       "black list" (0..6, 14..25, 28..31).
 *    b) There is at least one printable character belonging to the
 *       "white list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
 * - BINARY otherwise.
 * - The following partially-portable control characters form a
 *   "gray list" that is ignored in this detection algorithm:
 *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
 * IN assertion: the fields Freq of dyn_ltree are set.
 */
function detect_data_type(s) {
  /* black_mask is the bit mask of black-listed bytes
   * set bits 0..6, 14..25, and 28..31
   * 0xf3ffc07f = binary 11110011111111111100000001111111
   */
  var black_mask = 0xf3ffc07f;
  var n;

  /* Check for non-textual ("black-listed") bytes. */
  for (n = 0; n <= 31; n++, black_mask >>>= 1) {
    if ((black_mask & 1) && (s.dyn_ltree[n * 2]/*.Freq*/ !== 0)) {
      return Z_BINARY;
    }
  }

  /* Check for textual ("white-listed") bytes. */
  if (s.dyn_ltree[9 * 2]/*.Freq*/ !== 0 || s.dyn_ltree[10 * 2]/*.Freq*/ !== 0 ||
      s.dyn_ltree[13 * 2]/*.Freq*/ !== 0) {
    return Z_TEXT;
  }
  for (n = 32; n < LITERALS; n++) {
    if (s.dyn_ltree[n * 2]/*.Freq*/ !== 0) {
      return Z_TEXT;
    }
  }

  /* There are no "black-listed" or "white-listed" bytes:
   * this stream either is empty or has tolerated ("gray-listed") bytes only.
   */
  return Z_BINARY;
}


var static_init_done = false;

/* ===========================================================================
 * Initialize the tree data structures for a new zlib stream.
 */
function _tr_init(s)
{

  if (!static_init_done) {
    tr_static_init();
    static_init_done = true;
  }

  s.l_desc  = new TreeDesc(s.dyn_ltree, static_l_desc);
  s.d_desc  = new TreeDesc(s.dyn_dtree, static_d_desc);
  s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);

  s.bi_buf = 0;
  s.bi_valid = 0;

  /* Initialize the first block of the first file: */
  init_block(s);
}


/* ===========================================================================
 * Send a stored block
 */
function _tr_stored_block(s, buf, stored_len, last)
//DeflateState *s;
//charf *buf;       /* input block */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */
{
  send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);    /* send block type */
  copy_block(s, buf, stored_len, true); /* with header */
}


/* ===========================================================================
 * Send one empty static block to give enough lookahead for inflate.
 * This takes 10 bits, of which 7 may remain in the bit buffer.
 */
function _tr_align(s) {
  send_bits(s, STATIC_TREES << 1, 3);
  send_code(s, END_BLOCK, static_ltree);
  bi_flush(s);
}


/* ===========================================================================
 * Determine the best encoding for the current block: dynamic trees, static
 * trees or store, and output the encoded block to the zip file.
 */
function _tr_flush_block(s, buf, stored_len, last)
//DeflateState *s;
//charf *buf;       /* input block, or NULL if too old */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */
{
  var opt_lenb, static_lenb;  /* opt_len and static_len in bytes */
  var max_blindex = 0;        /* index of last bit length code of non zero freq */

  /* Build the Huffman trees unless a stored block is forced */
  if (s.level > 0) {

    /* Check if the file is binary or text */
    if (s.strm.data_type === Z_UNKNOWN) {
      s.strm.data_type = detect_data_type(s);
    }

    /* Construct the literal and distance trees */
    build_tree(s, s.l_desc);
    // Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));

    build_tree(s, s.d_desc);
    // Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));
    /* At this point, opt_len and static_len are the total bit lengths of
     * the compressed block data, excluding the tree representations.
     */

    /* Build the bit length tree for the above two trees, and get the index
     * in bl_order of the last bit length code to send.
     */
    max_blindex = build_bl_tree(s);

    /* Determine the best encoding. Compute the block lengths in bytes. */
    opt_lenb = (s.opt_len + 3 + 7) >>> 3;
    static_lenb = (s.static_len + 3 + 7) >>> 3;

    // Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
    //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
    //        s->last_lit));

    if (static_lenb <= opt_lenb) { opt_lenb = static_lenb; }

  } else {
    // Assert(buf != (char*)0, "lost buf");
    opt_lenb = static_lenb = stored_len + 5; /* force a stored block */
  }

  if ((stored_len + 4 <= opt_lenb) && (buf !== -1)) {
    /* 4: two words for the lengths */

    /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
     * Otherwise we can't have processed more than WSIZE input bytes since
     * the last block flush, because compression would have been
     * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
     * transform a block into a stored block.
     */
    _tr_stored_block(s, buf, stored_len, last);

  } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {

    send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
    compress_block(s, static_ltree, static_dtree);

  } else {
    send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
    send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
    compress_block(s, s.dyn_ltree, s.dyn_dtree);
  }
  // Assert (s->compressed_len == s->bits_sent, "bad compressed size");
  /* The above check is made mod 2^32, for files larger than 512 MB
   * and uLong implemented on 32 bits.
   */
  init_block(s);

  if (last) {
    bi_windup(s);
  }
  // Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
  //       s->compressed_len-7*last));
}

/* ===========================================================================
 * Save the match info and tally the frequency counts. Return true if
 * the current block must be flushed.
 */
function _tr_tally(s, dist, lc)
//    deflate_state *s;
//    unsigned dist;  /* distance of matched string */
//    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */
{
  //var out_length, in_length, dcode;

  s.pending_buf[s.d_buf + s.last_lit * 2]     = (dist >>> 8) & 0xff;
  s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 0xff;

  s.pending_buf[s.l_buf + s.last_lit] = lc & 0xff;
  s.last_lit++;

  if (dist === 0) {
    /* lc is the unmatched char */
    s.dyn_ltree[lc * 2]/*.Freq*/++;
  } else {
    s.matches++;
    /* Here, lc is the match length - MIN_MATCH */
    dist--;             /* dist = match distance - 1 */
    //Assert((ush)dist < (ush)MAX_DIST(s) &&
    //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
    //       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");

    s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]/*.Freq*/++;
    s.dyn_dtree[d_code(dist) * 2]/*.Freq*/++;
  }

// (!) This block is disabled in zlib defaults,
// don't enable it for binary compatibility

//#ifdef TRUNCATE_BLOCK
//  /* Try to guess if it is profitable to stop the current block here */
//  if ((s.last_lit & 0x1fff) === 0 && s.level > 2) {
//    /* Compute an upper bound for the compressed length */
//    out_length = s.last_lit*8;
//    in_length = s.strstart - s.block_start;
//
//    for (dcode = 0; dcode < D_CODES; dcode++) {
//      out_length += s.dyn_dtree[dcode*2]/*.Freq*/ * (5 + extra_dbits[dcode]);
//    }
//    out_length >>>= 3;
//    //Tracev((stderr,"\nlast_lit %u, in %ld, out ~%ld(%ld%%) ",
//    //       s->last_lit, in_length, out_length,
//    //       100L - out_length*100L/in_length));
//    if (s.matches < (s.last_lit>>1)/*int /2*/ && out_length < (in_length>>1)/*int /2*/) {
//      return true;
//    }
//  }
//#endif

  return (s.last_lit === s.lit_bufsize - 1);
  /* We avoid equality with lit_bufsize because of wraparound at 64K
   * on 16 bit machines and because stored blocks are restricted to
   * 64K-1 bytes.
   */
}

exports._tr_init  = _tr_init;
exports._tr_stored_block = _tr_stored_block;
exports._tr_flush_block  = _tr_flush_block;
exports._tr_tally = _tr_tally;
exports._tr_align = _tr_align;


/***/ }),

/***/ "./node_modules/pako/lib/zlib/zstream.js":
/*!***********************************************!*\
  !*** ./node_modules/pako/lib/zlib/zstream.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

function ZStream() {
  /* next input byte */
  this.input = null; // JS specific, because we have no pointers
  this.next_in = 0;
  /* number of bytes available at input */
  this.avail_in = 0;
  /* total number of input bytes read so far */
  this.total_in = 0;
  /* next output byte should be put there */
  this.output = null; // JS specific, because we have no pointers
  this.next_out = 0;
  /* remaining free space at output */
  this.avail_out = 0;
  /* total number of bytes output so far */
  this.total_out = 0;
  /* last error message, NULL if no error */
  this.msg = ''/*Z_NULL*/;
  /* not visible by applications */
  this.state = null;
  /* best guess about the data type: binary or text */
  this.data_type = 2/*Z_UNKNOWN*/;
  /* adler32 value of the uncompressed data */
  this.adler = 0;
}

module.exports = ZStream;


/***/ }),

/***/ "./node_modules/tslib/tslib.js":
/*!*************************************!*\
  !*** ./node_modules/tslib/tslib.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __spreadArrays;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
var __classPrivateFieldGet;
var __classPrivateFieldSet;
var __createBinding;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (exports) { factory(createExporter(root, createExporter(exports))); }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
    else {}
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };

    __extends = function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };

    __exportStar = function(m, o) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
    };

    __createBinding = Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    });

    __values = function (o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    __spreadArrays = function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };

    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    };

    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    var __setModuleDefault = Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    };

    __importStar = function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };

    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    __classPrivateFieldGet = function (receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    };

    __classPrivateFieldSet = function (receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__createBinding", __createBinding);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__spreadArrays", __spreadArrays);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
    exporter("__classPrivateFieldGet", __classPrivateFieldGet);
    exporter("__classPrivateFieldSet", __classPrivateFieldSet);
});

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })

/******/ });
//# sourceMappingURL=Hyperloop.js.map