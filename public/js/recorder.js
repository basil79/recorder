/*!
 * video-camera-screen-recorder v1.0.0 development
 * Updated : 2022-06-12
 */
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
var adserve;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/browser.js":
/*!************************!*\
  !*** ./src/browser.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"IS_ANDROID\": () => (/* binding */ IS_ANDROID),\n/* harmony export */   \"IS_CHROME\": () => (/* binding */ IS_CHROME),\n/* harmony export */   \"IS_EDGE\": () => (/* binding */ IS_EDGE),\n/* harmony export */   \"IS_SAFARI\": () => (/* binding */ IS_SAFARI)\n/* harmony export */ });\nconst USER_AGENT = window.navigator && window.navigator.userAgent || '';\n\nconst IS_ANDROID = (/Android/i).test(USER_AGENT);\n\nconst IS_EDGE = (/Edg/i).test(USER_AGENT);\n\nconst IS_CHROME = !IS_EDGE && ((/Chrome/i).test(USER_AGENT) || (/CriOS/i).test(USER_AGENT));\n\nconst IS_SAFARI = (/Safari/i).test(USER_AGENT) && !IS_CHROME && !IS_ANDROID && !IS_EDGE;\n\n\n//# sourceURL=webpack://adserve/./src/browser.js?");

/***/ }),

/***/ "./src/camera.js":
/*!***********************!*\
  !*** ./src/camera.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./browser */ \"./src/browser.js\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ \"./src/utils.js\");\n\n\n\nconst Camera = function(el, options) {\n\n  if(!(el instanceof Element || el instanceof HTMLDocument)) {\n    throw new Error('screen video slot is not defined');\n  }\n\n  if(navigator.mediaDevices === undefined) {\n    throw new Error('this browser doesn\\'t support navigator.mediaDevices');\n  }\n\n  this._videoSlot = el;\n\n  this._stream = null;\n  this._mediaRecorder = null;\n  this._recordedChunks = [];\n\n  // Events\n  this.EVENTS = {\n    DataAvailable: 'DataAvailable'\n  }\n  this._eventCallbacks = {};\n\n  // Attributes\n  this._attributes = {\n    isStarted: false,\n    mimeType: _browser__WEBPACK_IMPORTED_MODULE_0__.IS_SAFARI ? 'video/mp4' : 'video/webm',\n    version: '1.0.0'\n  }\n  // Options\n  this._options = Object.assign({\n    segmentSize: 5000, // ms\n    media: {\n      video: true,\n      audio: false\n    }\n  }, options);\n}\nCamera.prototype.start = function() {\n  console.log('start camera');\n  navigator.mediaDevices.getUserMedia(this._options.media)\n    .then(stream => {\n      // use the stream\n      this._videoSlot.srcObject = stream;\n      this.dump();\n\n      this._mediaRecorder = new MediaRecorder(stream);\n      this._recordedChunks = [];\n\n      this._mediaRecorder.addEventListener('dataavailable', (event) => {\n        // Blob\n        const recorderBlob = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.arrayBufferToBlob)(event.data, this._attributes.mimeType);\n        console.log('camera successfully recorded', recorderBlob.size, 'bytes of', recorderBlob.type, recorderBlob);\n        // TODO:\n        this._recordedChunks.push(recorderBlob);\n        this.onDataAvailable(recorderBlob);\n      });\n      this._mediaRecorder.addEventListener('stop', () => {\n        // recording stopped & all blobs sent\n        // TODO:\n        console.log(this._recordedChunks);\n      });\n\n      this._mediaRecorder.start(this._options.segmentSize); // 5000\n      console.log(this._mediaRecorder.state);\n\n      this._attributes.isStarted = true;\n    })\n    .catch(error => {\n      console.log(error);\n      this._attributes.isStarted = false;\n    });\n}\nCamera.prototype.stop = function() {\n  console.log('stop camera');\n  if(this._mediaRecorder && this._mediaRecorder.state !== 'inactive') {\n    this._mediaRecorder.stop();\n    console.log(this._mediaRecorder.state);\n  }\n  try {\n    const tracks = this._videoSlot.srcObject.getTracks();\n    console.log(tracks);\n    tracks.forEach(track => track.stop());\n    this._videoSlot.srcObject = null;\n  } catch (e) {}\n  this._attributes.isStarted = false;\n}\nCamera.prototype.dump = function() {\n  const videoTrack = this._videoSlot.srcObject.getVideoTracks()[0];\n  console.log(JSON.stringify(videoTrack.getSettings(), null, 2));\n  console.log(JSON.stringify(videoTrack.getConstraints(), null, 2));\n}\nCamera.prototype.onDataAvailable = function(blob) {\n  if(this.EVENTS.DataAvailable in this._eventCallbacks) {\n    if(typeof this._eventCallbacks[this.EVENTS.DataAvailable] === 'function') {\n      this._eventCallbacks[this.EVENTS.DataAvailable](blob);\n    }\n  }\n}\nCamera.prototype.addEventListener = function(eventName, callback, context) {\n  const giveCallback = callback.bind(context);\n  this._eventCallbacks[eventName] = giveCallback;\n}\nCamera.prototype.removeEventListener = function(eventName) {\n  if(eventName in this._eventCallbacks) {\n    this._eventCallbacks[eventName] = null;\n  }\n}\nCamera.prototype.getVersion = function() {\n  return this._attributes.version;\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Camera);\n\n\n//# sourceURL=webpack://adserve/./src/camera.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"tv\": () => (/* binding */ tv)\n/* harmony export */ });\n/* harmony import */ var _microphone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./microphone */ \"./src/microphone.js\");\n/* harmony import */ var _camera__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./camera */ \"./src/camera.js\");\n/* harmony import */ var _screen_capture__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./screen-capture */ \"./src/screen-capture.js\");\n\n\n\n\nconst tv = {\n  Microphone: _microphone__WEBPACK_IMPORTED_MODULE_0__[\"default\"],\n  Camera: _camera__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  ScreenCapture: _screen_capture__WEBPACK_IMPORTED_MODULE_2__[\"default\"]\n}\n\n\n\n\n//# sourceURL=webpack://adserve/./src/index.js?");

/***/ }),

/***/ "./src/microphone.js":
/*!***************************!*\
  !*** ./src/microphone.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ \"./src/utils.js\");\n/* harmony import */ var _browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./browser */ \"./src/browser.js\");\n\n\n\nconst Microphone = function(el, options) {\n\n  if(!(el instanceof Element || el instanceof HTMLDocument)) {\n    throw new Error('microphone audio slot is not defined');\n  }\n\n  if(navigator.mediaDevices === undefined) {\n    throw new Error('this browser doesn\\'t support navigator.mediaDevices');\n  }\n\n  this._audioSlot = el;\n\n  this._stream = null;\n  this._mediaRecorder = null;\n  this._recordedChunks = [];\n\n  // Events\n  this.EVENTS = {\n    DataAvailable: 'DataAvailable'\n  }\n  this._eventCallbacks = {};\n\n  // Attributes\n  this._attributes = {\n    isStarted: false,\n    mimeType: _browser__WEBPACK_IMPORTED_MODULE_1__.IS_SAFARI ? 'audio/mp4' : 'audio/webm',\n    version: '1.0.0'\n  }\n  // Options\n  this._options = Object.assign({\n    segmentSize: 5000, // ms\n    media: {\n      audio: true\n    }\n  }, options);\n}\nMicrophone.prototype.start = function() {\n  console.log('start microphone');\n  navigator.mediaDevices.getUserMedia(this._options.media)\n    .then(stream => {\n\n      // use the stream\n      this._audioSlot.srcObject = stream;\n      this.dump();\n\n      this._mediaRecorder = new MediaRecorder(stream);\n      this._recordedChunks = [];\n\n      this._mediaRecorder.addEventListener('dataavailable', (event) => {\n        //console.log(event.data);\n        // Blob\n        const recorderBlob = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.arrayBufferToBlob)(event.data, this._attributes.mimeType);\n        console.log('microphone successfully recorded', recorderBlob.size, 'bytes of', recorderBlob.type, recorderBlob);\n\n        this._recordedChunks.push(recorderBlob); // TODO: remove\n        this.onDataAvailable(recorderBlob);\n      });\n      this._mediaRecorder.addEventListener('stop', () => {\n        // recording stopped & all blobs sent\n        // TODO:\n        console.log(this._recordedChunks);\n      });\n\n      this._mediaRecorder.start(this._options.segmentSize); // 5000\n      console.log(this._mediaRecorder.state);\n      this._attributes.isStarted = true;\n    })\n    .catch(error => {\n      console.log(error);\n      this._attributes.isStarted = false;\n    });\n}\nMicrophone.prototype.stop = function() {\n  console.log('stop microphone');\n  if(this._mediaRecorder && this._mediaRecorder.state !== 'inactive') {\n    this._mediaRecorder.stop();\n    console.log(this._mediaRecorder.state);\n  }\n  try {\n    const tracks = this._audioSlot.srcObject.getTracks();\n    console.log(tracks);\n    tracks.forEach(track => track.stop());\n    this._audioSlot.srcObject = null;\n  } catch (e) {}\n  this._attributes.isStarted = false;\n}\nMicrophone.prototype.dump = function() {\n  const audioTrack = this._audioSlot.srcObject.getAudioTracks()[0];\n  console.log(JSON.stringify(audioTrack.getSettings(), null, 2));\n  console.log(JSON.stringify(audioTrack.getConstraints(), null, 2));\n}\nMicrophone.prototype.onDataAvailable = function(chunk) {\n  if(this.EVENTS.DataAvailable in this._eventCallbacks) {\n    if(typeof this._eventCallbacks[this.EVENTS.DataAvailable] === 'function') {\n      this._eventCallbacks[this.EVENTS.DataAvailable](chunk);\n    }\n  }\n}\nMicrophone.prototype.addEventListener = function(eventName, callback, context) {\n  const giveCallback = callback.bind(context);\n  this._eventCallbacks[eventName] = giveCallback;\n}\nMicrophone.prototype.removeEventListener = function(eventName) {\n  if(eventName in this._eventCallbacks) {\n    this._eventCallbacks[eventName] = null;\n  }\n}\nMicrophone.prototype.getVersion = function() {\n  return this._attributes.version;\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Microphone);\n\n\n//# sourceURL=webpack://adserve/./src/microphone.js?");

/***/ }),

/***/ "./src/screen-capture.js":
/*!*******************************!*\
  !*** ./src/screen-capture.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./browser */ \"./src/browser.js\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ \"./src/utils.js\");\n\n\n\nconst ScreenCapture = function(el, options) {\n\n  if(!(el instanceof Element || el instanceof HTMLDocument)) {\n    throw new Error('screen video slot is not defined');\n  }\n\n  if(navigator.mediaDevices === undefined) {\n    throw new Error('this browser doesn\\'t support navigator.mediaDevices');\n  }\n\n  this._videoSlot = el;\n\n  this._stream = null;\n  this._mediaRecorder = null;\n  this._recordedChunks = [];\n\n  // Events\n  this.EVENTS = {\n    DataAvailable: 'DataAvailable'\n  }\n  this._eventCallbacks = {};\n\n  // Attributes\n  this._attributes = {\n    isStarted: false,\n    mimeType: _browser__WEBPACK_IMPORTED_MODULE_0__.IS_SAFARI ? 'video/mp4' : 'video/webm',\n    version: '1.0.0'\n  }\n  // Options\n  this._options = Object.assign({\n    segmentSize: 5000, // ms\n    media: {\n      video: {\n        cursor: 'always'\n      },\n      audio: false\n    }\n  }, options)\n}\nScreenCapture.prototype.start = function() {\n  console.log('start capture');\n  navigator.mediaDevices.getDisplayMedia(this._options.media)\n    .then(stream => {\n      // use the stream\n      this._videoSlot.srcObject = stream;\n      this.dump();\n\n      this._mediaRecorder = new MediaRecorder(stream);\n      this._recordedChunks = [];\n\n      this._mediaRecorder.addEventListener('dataavailable', (event) => {\n        // Blob\n        const recorderBlob = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.arrayBufferToBlob)(event.data, this._attributes.mimeType);\n        console.log('screen successfully recorded', recorderBlob.size, 'bytes of', recorderBlob.type, recorderBlob);\n\n        this._recordedChunks.push(recorderBlob); // TODO: remove\n        this.onDataAvailable(recorderBlob);\n      });\n      this._mediaRecorder.addEventListener('stop', () => {\n        // recording stopped & all blobs sent\n        // TODO:\n        console.log(this._recordedChunks);\n      });\n\n      this._mediaRecorder.start(this._options.segmentSize); // 5000\n      console.log(this._mediaRecorder.state);\n\n      this._attributes.isStarted = true;\n    })\n    .catch(error => {\n      console.log(error);\n      this._attributes.isStarted = false;\n    });\n}\nScreenCapture.prototype.stop = function() {\n  console.log('stop capture');\n  if(this._mediaRecorder && this._mediaRecorder.state !== 'inactive') {\n    this._mediaRecorder.stop();\n    console.log(this._mediaRecorder.state);\n  }\n  try {\n    const tracks = this._videoSlot.srcObject.getTracks();\n    console.log(tracks);\n    tracks.forEach(track => track.stop());\n    this._videoSlot.srcObject = null;\n  } catch (e) {}\n  this._attributes.isStarted = false;\n}\nScreenCapture.prototype.dump = function() {\n  const videoTrack = this._videoSlot.srcObject.getVideoTracks()[0];\n  console.log(JSON.stringify(videoTrack.getSettings(), null, 2));\n  console.log(JSON.stringify(videoTrack.getConstraints(), null, 2));\n}\nScreenCapture.prototype.onDataAvailable = function(blob) {\n  if(this.EVENTS.DataAvailable in this._eventCallbacks) {\n    if(typeof this._eventCallbacks[this.EVENTS.DataAvailable] === 'function') {\n      this._eventCallbacks[this.EVENTS.DataAvailable](blob);\n    }\n  }\n}\nScreenCapture.prototype.addEventListener = function(eventName, callback, context) {\n  const giveCallback = callback.bind(context);\n  this._eventCallbacks[eventName] = giveCallback;\n}\nScreenCapture.prototype.removeEventListener = function(eventName) {\n  if(eventName in this._eventCallbacks) {\n    this._eventCallbacks[eventName] = null;\n  }\n}\nScreenCapture.prototype.getVersion = function() {\n  return this._attributes.version;\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ScreenCapture);\n\n\n//# sourceURL=webpack://adserve/./src/screen-capture.js?");

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"arrayBufferToBlob\": () => (/* binding */ arrayBufferToBlob)\n/* harmony export */ });\nfunction arrayBufferToBlob(buffer, type) {\n  return new Blob([buffer], { type: type });\n}\n\n\n\n\n//# sourceURL=webpack://adserve/./src/utils.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	adserve = __webpack_exports__;
/******/ 	
/******/ })()
;