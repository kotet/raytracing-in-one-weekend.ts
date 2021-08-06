/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.css":
/*!***********************!*\
  !*** ./src/index.css ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const hittable_list_1 = __webpack_require__(/*! ./hittable_list */ "./src/hittable_list.ts");
__webpack_require__(/*! ./index.css */ "./src/index.css");
const render_1 = __webpack_require__(/*! ./render */ "./src/render.ts");
const sphere_1 = __webpack_require__(/*! ./sphere */ "./src/sphere.ts");
const vec3_1 = __webpack_require__(/*! ./vec3 */ "./src/vec3.ts");
let canvas;
let world;
let renderer;
(() => {
    window.addEventListener('load', () => {
        const body = document.body;
        canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        body.appendChild(canvas);
        const nav = document.createElement('nav');
        const textarea = document.createElement('textarea');
        nav.appendChild(textarea);
        body.appendChild(nav);
        world = new hittable_list_1.HittableList();
        world.push(new sphere_1.Sphere(new vec3_1.Vec3(0, 0, -1), 0.5));
        world.push(new sphere_1.Sphere(new vec3_1.Vec3(0, -100.5, -1), 100));
        renderer = render_1.render(canvas, world);
        window.addEventListener('resize', onResize);
        renderingLoop();
    });
})();
function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    renderer = render_1.render(canvas, world);
}
function renderingLoop() {
    if (renderer.next().done) {
        renderer = render_1.render(canvas, world);
    }
    requestAnimationFrame(renderingLoop);
}


/***/ }),

/***/ "./src/camera.ts":
/*!***********************!*\
  !*** ./src/camera.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Camera = void 0;
const ray_1 = __webpack_require__(/*! ./ray */ "./src/ray.ts");
const vec3_1 = __webpack_require__(/*! ./vec3 */ "./src/vec3.ts");
class Camera {
    constructor(aspectRatio) {
        const viewportHeight = 2.0;
        const viewportWidth = aspectRatio * viewportHeight;
        const focalLength = 1;
        this.origin = new vec3_1.Vec3(0, 0, 0);
        this.horizontal = new vec3_1.Vec3(viewportWidth, 0, 0);
        this.vertical = new vec3_1.Vec3(0, viewportHeight, 0);
        this.lowerLeftCorner =
            this.origin.clone()
                .sub(this.horizontal.clone().mul(0.5))
                .sub(this.vertical.clone().mul(0.5))
                .sub(new vec3_1.Vec3(0, 0, focalLength));
    }
    getRay(u, v) {
        return new ray_1.Ray(this.origin, this.lowerLeftCorner.clone()
            .add(this.horizontal.clone().mul(u))
            .add(this.vertical.clone().mul(v))
            .sub(this.origin));
    }
}
exports.Camera = Camera;


/***/ }),

/***/ "./src/hittable.ts":
/*!*************************!*\
  !*** ./src/hittable.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.faceNormal = void 0;
function faceNormal(r, outwardNormal) {
    const frontFace = r.direction().dot(outwardNormal) < 0;
    return { face: frontFace, normal: frontFace ? outwardNormal : outwardNormal.clone().neg() };
}
exports.faceNormal = faceNormal;


/***/ }),

/***/ "./src/hittable_list.ts":
/*!******************************!*\
  !*** ./src/hittable_list.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HittableList = void 0;
class HittableList {
    constructor() {
        this.objects = [];
    }
    push(object) {
        this.objects.push(object);
    }
    hit(r, tMin, tMax) {
        let closestSoFar = tMax;
        let rec = null;
        for (const object of this.objects) {
            const tempRec = object.hit(r, tMin, closestSoFar);
            if (tempRec !== null) {
                closestSoFar = tempRec.t;
                rec = tempRec;
            }
        }
        return rec;
    }
}
exports.HittableList = HittableList;


/***/ }),

/***/ "./src/ray.ts":
/*!********************!*\
  !*** ./src/ray.ts ***!
  \********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Ray = void 0;
class Ray {
    constructor(origin, direction) {
        this.orig = origin;
        this.dir = direction;
    }
    direction() { return this.dir; }
    origin() { return this.orig; }
    at(t) {
        return this.orig.clone().add(this.dir.clone().mul(t));
    }
}
exports.Ray = Ray;


/***/ }),

/***/ "./src/render.ts":
/*!***********************!*\
  !*** ./src/render.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.render = void 0;
const camera_1 = __webpack_require__(/*! ./camera */ "./src/camera.ts");
const util_1 = __webpack_require__(/*! ./util */ "./src/util.ts");
const vec3_1 = __webpack_require__(/*! ./vec3 */ "./src/vec3.ts");
function* render(canvas, world) {
    let prevTime = performance.now();
    const width = canvas.width;
    const height = canvas.height;
    const samplePerPixel = 50;
    const aspectRatio = width / height;
    const ctx = canvas.getContext('2d');
    if (ctx === null) {
        console.error('failed to get context');
        return;
    }
    const cam = new camera_1.Camera(aspectRatio);
    const data = ctx.getImageData(0, 0, width, height);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const colorAcc = new vec3_1.Vec3(0, 0, 0);
            for (let i = 0; i < samplePerPixel; i++) {
                const u = (x + Math.random()) / width;
                const v = 1 - (y + Math.random()) / height;
                const ray = cam.getRay(u, v);
                const color = ray_color(ray, world);
                colorAcc.add(color);
            }
            const pixelColor = colorAcc.mul(1 / samplePerPixel);
            const r = util_1.clamp(pixelColor.e[0], 0, 1);
            const g = util_1.clamp(pixelColor.e[1], 0, 1);
            const b = util_1.clamp(pixelColor.e[2], 0, 1);
            data.data[(y * width + x) * 4 + 0] = 255 * r;
            data.data[(y * width + x) * 4 + 1] = 255 * g;
            data.data[(y * width + x) * 4 + 2] = 255 * b;
            data.data[(y * width + x) * 4 + 3] = 255;
        }
        const nowTime = performance.now();
        if (15 < nowTime - prevTime) {
            prevTime = nowTime;
            ctx.putImageData(data, 0, 0);
            yield;
        }
    }
}
exports.render = render;
function ray_color(r, world) {
    const rec = world.hit(r, 0, 100);
    if (rec !== null) {
        const N = rec.normal;
        return new vec3_1.Vec3(N.x() + 1, N.y() + 1, N.z() + 1).mul(0.5);
    }
    const unitDirection = r.direction().clone().normalize();
    const t = 0.5 * (unitDirection.y() + 1.0);
    return new vec3_1.Vec3(1, 1, 1).mul(1 - t).add(new vec3_1.Vec3(0.5, 0.7, 1.0).mul(t));
}


/***/ }),

/***/ "./src/sphere.ts":
/*!***********************!*\
  !*** ./src/sphere.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Sphere = void 0;
const hittable_1 = __webpack_require__(/*! ./hittable */ "./src/hittable.ts");
class Sphere {
    constructor(cen, r) {
        this.center = cen;
        this.radius = r;
    }
    hit(r, tMin, tMax) {
        const oc = r.origin().clone().sub(this.center);
        const a = r.direction().length_squared();
        const halfB = oc.dot(r.direction());
        const c = oc.length_squared() - this.radius * this.radius;
        const discriminant = halfB * halfB - a * c;
        if (discriminant < 0) {
            return null;
        }
        const sqrtD = Math.sqrt(discriminant);
        let root = (-halfB - sqrtD) / a;
        if (root < tMin || tMax < root) {
            root = (-halfB + sqrtD) / a;
            if (root < tMin || tMax < root) {
                return null;
            }
        }
        const pos = r.at(root);
        const front = hittable_1.faceNormal(r, pos.clone().sub(this.center).div(this.radius));
        return {
            t: root,
            p: pos,
            normal: front.normal,
            frontFace: front.face
        };
    }
}
exports.Sphere = Sphere;


/***/ }),

/***/ "./src/util.ts":
/*!*********************!*\
  !*** ./src/util.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.clamp = void 0;
function clamp(x, min, max) {
    if (x < min)
        return min;
    if (max < x)
        return max;
    return x;
}
exports.clamp = clamp;


/***/ }),

/***/ "./src/vec3.ts":
/*!*********************!*\
  !*** ./src/vec3.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Vec3 = void 0;
class Vec3 {
    constructor(e0, e1, e2) {
        this.e = [e0, e1, e2];
    }
    x() { return this.e[0]; }
    y() { return this.e[1]; }
    z() { return this.e[2]; }
    neg() { return new Vec3(-this.e[0], -this.e[0], -this.e[0]); }
    add(v) {
        this.e[0] += v.e[0];
        this.e[1] += v.e[1];
        this.e[2] += v.e[2];
        return this;
    }
    sub(v) {
        this.e[0] -= v.e[0];
        this.e[1] -= v.e[1];
        this.e[2] -= v.e[2];
        return this;
    }
    mul(t) {
        this.e[0] *= t;
        this.e[1] *= t;
        this.e[2] *= t;
        return this;
    }
    div(t) {
        this.e[0] /= t;
        this.e[1] /= t;
        this.e[2] /= t;
        return this;
    }
    normalize() {
        return this.mul(1 / this.length());
    }
    dot(v) {
        return this.e[0] * v.e[0] + this.e[1] * v.e[1] + this.e[2] * v.e[2];
    }
    cross(v) {
        return new Vec3(this.e[1] * v.e[2] - this.e[2] * v.e[1], this.e[2] * v.e[0] - this.e[0] * v.e[2], this.e[0] * v.e[1] - this.e[1] * v.e[0]);
    }
    length_squared() {
        return this.e[0] * this.e[0] + this.e[1] * this.e[1] + this.e[2] * this.e[2];
    }
    length() { return Math.sqrt(this.length_squared()); }
    toString() {
        return `(${this.e[0]} ${this.e[1]} ${this.e[2]})`;
    }
    clone() {
        return new Vec3(this.e[0], this.e[1], this.e[2]);
    }
}
exports.Vec3 = Vec3;


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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const hittable_list_1 = __webpack_require__(/*! ./hittable_list */ "./src/hittable_list.ts");
__webpack_require__(/*! ./index.css */ "./src/index.css");
const render_1 = __webpack_require__(/*! ./render */ "./src/render.ts");
const sphere_1 = __webpack_require__(/*! ./sphere */ "./src/sphere.ts");
const vec3_1 = __webpack_require__(/*! ./vec3 */ "./src/vec3.ts");
let canvas;
let world;
let renderer;
(() => {
    window.addEventListener('load', () => {
        const body = document.body;
        canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        body.appendChild(canvas);
        const nav = document.createElement('nav');
        const textarea = document.createElement('textarea');
        nav.appendChild(textarea);
        body.appendChild(nav);
        world = new hittable_list_1.HittableList();
        world.push(new sphere_1.Sphere(new vec3_1.Vec3(0, 0, -1), 0.5));
        world.push(new sphere_1.Sphere(new vec3_1.Vec3(0, -100.5, -1), 100));
        renderer = render_1.render(canvas, world);
        window.addEventListener('resize', onResize);
        renderingLoop();
    });
})();
function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    renderer = render_1.render(canvas, world);
}
function renderingLoop() {
    if (renderer.next().done) {
        renderer = render_1.render(canvas, world);
    }
    requestAnimationFrame(renderingLoop);
}

})();

/******/ })()
;
//# sourceMappingURL=main.js.map