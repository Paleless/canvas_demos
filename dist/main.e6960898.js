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
})({"utils/game.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

//(obj, obj) 
//将fnObj的属性复制给obj
function mountProtos(fnObj, obj) {
  Object.keys(fnObj).forEach(function (key) {
    obj[key] = fnObj[key];
  });
}

var utils = {
  //角度转弧度
  deg: function deg(o) {
    return Math.PI * o / 180;
  },
  //弧度转角度
  rDeg: function rDeg(deg) {
    return deg * 180 / Math.PI;
  },
  //随机数
  random: function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  },
  //两点距离
  distance: function distance(_ref, _ref2) {
    var _ref3 = _slicedToArray(_ref, 2),
        x1 = _ref3[0],
        y1 = _ref3[1];

    var _ref4 = _slicedToArray(_ref2, 2),
        x2 = _ref4[0],
        y2 = _ref4[1];

    var disX = x1 - x2;
    var disY = y1 - y2;
    return Math.sqrt(Math.pow(disX, 2), Math.pow(disY, 2));
  }
};
/*
option:{
    canvas: this html canvas element, can be css sleector or html element
    env: width and height are required to initalize the canvas
    loop: function to loop
}
 */

var Game =
/*#__PURE__*/
function () {
  function Game(option) {
    _classCallCheck(this, Game);

    //toCheck the option params
    ["loop", "env"].forEach(function (item) {
      if (!option[item]) {
        throw Error("not hava ".concat(item));
      }
    });
    this.canvas = document.querySelector(option.canvas) || document.querySelector('canvas') || option.canvas;
    this.env = option.env;
    this.loopFn = option.loop;
    this.beforeLoop = option.beforeLoop || console.log;
    this.init();
  }

  _createClass(Game, [{
    key: "init",
    value: function init() {
      this.canvas.width = this.env.width;
      this.canvas.height = this.env.height;
      this.ctx = this.canvas.getContext('2d');
      this.loopFn = this.loopFn.bind(this);
      this.beforeLoop();
      this.loop();
    }
  }, {
    key: "loop",
    value: function loop() {
      this.loopFn();
      requestAnimationFrame(this.loop.bind(this));
    }
  }]);

  return Game;
}();

mountProtos(utils, Game);
var _default = Game;
exports.default = _default;
},{}],"demo6/main.js":[function(require,module,exports) {
"use strict";

var _game = _interopRequireDefault(require("../utils/game.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Point =
/*#__PURE__*/
function () {
  function Point(_ref) {
    var ctx = _ref.ctx,
        x = _ref.x,
        range = _ref.range;

    _classCallCheck(this, Point);

    this.ctx = ctx;
    this.x = x;
    this.y = _game.default.random(100, 200);
    this.range = range;
  }

  _createClass(Point, [{
    key: "update",
    value: function update() {
      this.y += _game.default.random(-10, 10);

      if (this.y > this.range.max) {
        this.y = this.range.max;
      } else if (this.y < this.range.min) {
        this.y = this.range.min;
      }
    }
  }]);

  return Point;
}(); // (int, int) -> [x]


function splitSpace(len, width) {
  var spacing = width / len;
  var xArray = [];

  for (var i = 0; i < len; i++) {
    xArray.push(spacing * i);
  }

  xArray.push(width);
  return xArray;
} // ([Point], ctx) -> effect!


function renderWave(points, ctx) {
  points.forEach(function (point) {
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3, 0, _game.default.deg(360));
    ctx.fill();
  });
  ctx.beginPath();
  ctx.strokeStyle = "red";
  ctx.moveTo(points[0].x, points[0].y);
  points.reduce(function (prevPoint, nextPoint) {
    var cx = (prevPoint.x + nextPoint.x) / 2;
    var cy = (prevPoint.y + nextPoint.y) / 2;
    ctx.quadraticCurveTo(cx, cy, nextPoint.x, nextPoint.y);
    return nextPoint;
  });
  ctx.stroke();
}

new _game.default({
  env: {
    width: window.innerWidth,
    height: window.innerHeight,
    pointLen: 7,
    points: [],
    range: {
      max: 200,
      min: 100
    }
  },
  beforeLoop: function beforeLoop() {
    var _this = this;

    this.env.points = splitSpace(this.env.pointLen, this.env.width).map(function (x) {
      return new Point({
        x: x,
        ctx: _this.ctx,
        range: _this.env.range
      });
    });
  },
  loop: function loop() {
    this.ctx.clearRect(0, 0, this.env.width, this.env.height); // this.env.points.forEach(point => point.update())

    renderWave(this.env.points, this.ctx);
  }
});
},{"../utils/game.js":"utils/game.js"}],"C:/Program Files/nodejs/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56877" + '/');

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
},{}]},{},["C:/Program Files/nodejs/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","demo6/main.js"], null)
//# sourceMappingURL=/main.e6960898.map