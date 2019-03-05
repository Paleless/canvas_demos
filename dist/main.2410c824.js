// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"demo3/main.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var env = {
  width: window.innerWidth,
  height: window.innerHeight,
  hue: 120,
  g: 1,
  f: 0.98
};
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var points = [];
var targetPoint;

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function distance(x1, y1, x2, y2) {
  var disX = x1 - x2;
  var disY = y1 - y2;
  return Math.sqrt(Math.pow(disX, 2) + Math.pow(disY, 2));
}

function deg(o) {
  return Math.PI * o / 180;
}

var Target =
/*#__PURE__*/
function () {
  function Target(_ref) {
    var x = _ref.x,
        y = _ref.y;

    _classCallCheck(this, Target);

    this.x = x;
    this.y = y;
    this.targetRadius = 1;
    this.incLock = false;
  }

  _createClass(Target, [{
    key: "update",
    value: function update() {
      if (this.targetRadius > 8) {
        this.incLock = true;
      } else if (this.targetRadius < 1) {
        this.incLock = false;
      }

      if (this.incLock) {
        this.targetRadius -= .1;
      } else {
        this.targetRadius += .1;
      }
    }
  }, {
    key: "draw",
    value: function draw() {
      ctx.strokeStyle = "hsl(".concat(env.hue, ",100%,60%)");
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.targetRadius, 0, deg(360));
      ctx.stroke();
      this.update();
    }
  }]);

  return Target;
}();

var Point =
/*#__PURE__*/
function () {
  function Point(_ref2) {
    var tx = _ref2.x,
        ty = _ref2.y;

    _classCallCheck(this, Point);

    this.sx = random(0, env.width);
    this.sy = random(0, env.height);
    this.x = this.sx;
    this.y = this.sy;
    this.tx = tx;
    this.ty = ty;
    this.angle = Math.atan2(ty - this.sy, tx - this.sx);
    this.dis = distance(this.sx, this.sy, tx, ty);
    this.disTra = 0;
    this.a = .1;
    this.v = 0;
    this.coords = new Array(2).fill([this.x, this.y]);
  }

  _createClass(Point, [{
    key: "update",
    value: function update() {
      if (this.disTra > this.dis) {
        this.v -= this.a;
      } else {
        this.v += this.a;
      }

      this.x += Math.cos(this.angle) * this.v;
      this.y += Math.sin(this.angle) * this.v;
      this.coords.pop();
      this.coords.unshift([this.x, this.y]);
      this.disTra = distance(this.sx, this.sy, this.x, this.y);
    }
  }, {
    key: "draw",
    value: function draw() {
      ctx.strokeStyle = "hsl(".concat(env.hue, ",100%,60%)");
      ctx.beginPath();
      var end = this.coords.length - 1;
      ctx.moveTo(this.coords[end][0], this.coords[end][1]);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();
      this.update();
    }
  }]);

  return Point;
}();

function draw() {
  env.hue += .5;

  if (env.hue > 360) {
    env.hue = 10;
  }

  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, env.width, env.height);
  ctx.globalCompositeOperation = "lighter";
  points.forEach(function (point) {
    point.draw();
  });
  targetPoint.draw();
  requestAnimationFrame(draw);
}

function init() {
  canvas.width = env.width;
  canvas.height = env.height;
  targetPoint = new Target({
    x: env.width / 2,
    y: env.height / 2
  });

  for (var i = 0; i < 800; i++) {
    points.push(new Point(targetPoint));
  }

  draw();
}

init();
},{}],"C:/Program Files/nodejs/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63059" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["C:/Program Files/nodejs/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","demo3/main.js"], null)
//# sourceMappingURL=/main.2410c824.map