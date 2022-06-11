/*!
 * video-camera-screen-recorder v1.0.0 development
 * Updated : 2022-06-11
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

/***/ "./src/camera.js":
/*!***********************!*\
  !*** ./src/camera.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst Camera = function(el, options) {\n\n  if(!(el instanceof Element || el instanceof HTMLDocument)) {\n    throw new Error('screen video slot is not defined');\n  }\n\n  this._videoSlot = el;\n  this._mediaRecorder = null;\n  // Attributes\n  this._attribute = {\n    segmentSize: 5000, // ms\n    version: '1.0.0'\n  }\n  // Options\n  this._options = Object.assign({\n    video: true,\n    audio: true\n  }, options);\n}\nCamera.prototype.start = async function() {\n  console.log('start camera');\n  try {\n    this._videoSlot.srcObject = await navigator.mediaDevices.getUserMedia(this._options);\n    this.dump();\n  } catch (e) {\n    console.log(e);\n  }\n}\nCamera.prototype.stop = function() {\n  console.log('stop camera');\n  const tracks = this._videoSlot.srcObject.getTracks();\n  console.log(tracks);\n  tracks.forEach(track => track.stop());\n  this._videoSlot.srcObject = null;\n}\nCamera.prototype.dump = function() {\n  const videoTrack = this._videoSlot.srcObject.getVideoTracks()[0];\n  console.log(JSON.stringify(videoTrack.getSettings(), null, 2));\n  console.log(JSON.stringify(videoTrack.getConstraints(), null, 2));\n}\nCamera.prototype.startRecording = function() {\n  console.log('start camera recording');\n}\nCamera.prototype.stopRecording = function() {\n  console.log('stop camera recording');\n}\nCamera.prototype.getVersion = function() {\n  return this._attribute.version;\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Camera);\n\n\n//# sourceURL=webpack://adserve/./src/camera.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"tv\": () => (/* binding */ tv)\n/* harmony export */ });\n/* harmony import */ var _camera__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./camera */ \"./src/camera.js\");\n/* harmony import */ var _screen_capture__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./screen-capture */ \"./src/screen-capture.js\");\n\n\n\nconst tv = {\n  Camera: _camera__WEBPACK_IMPORTED_MODULE_0__[\"default\"],\n  ScreenCapture: _screen_capture__WEBPACK_IMPORTED_MODULE_1__[\"default\"]\n}\n\n\n\n\n//# sourceURL=webpack://adserve/./src/index.js?");

/***/ }),

/***/ "./src/screen-capture.js":
/*!*******************************!*\
  !*** ./src/screen-capture.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst ScreenCapture = function(el, options) {\n\n  if(!(el instanceof Element || el instanceof HTMLDocument)) {\n    throw new Error('screen video slot is not defined');\n  }\n\n  this._videoSlot = el;\n  this._mediaRecorder = null;\n  // Attributes\n  this._attribute = {\n    segmentSize: 5000, // ms\n    version: '1.0.0'\n  }\n  // Options\n  this._options = Object.assign({\n    video: {\n      cursor: 'always'\n    },\n    audio: false\n  }, options)\n}\nScreenCapture.prototype.start = async function() {\n  console.log('start capture');\n  try {\n    this._videoSlot.srcObject = await navigator.mediaDevices.getDisplayMedia(this._options);\n    this.dump();\n  } catch (e) {\n    console.log(e);\n  }\n}\nScreenCapture.prototype.stop = function() {\n  console.log('stop capture');\n  const tracks = this._videoSlot.srcObject.getTracks();\n  console.log(tracks);\n  tracks.forEach(track => track.stop());\n  this._videoSlot.srcObject = null;\n}\nScreenCapture.prototype.dump = function() {\n  const videoTrack = this._videoSlot.srcObject.getVideoTracks()[0];\n  console.log(JSON.stringify(videoTrack.getSettings(), null, 2));\n  console.log(JSON.stringify(videoTrack.getConstraints(), null, 2));\n}\nScreenCapture.prototype.startRecording = function() {\n  console.log('start screen recording');\n}\nScreenCapture.prototype.stopRecording = function() {\n  console.log('stop screen recording');\n}\nScreenCapture.prototype.getVersion = function() {\n  return this._attribute.version;\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ScreenCapture);\n\n\n//# sourceURL=webpack://adserve/./src/screen-capture.js?");

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