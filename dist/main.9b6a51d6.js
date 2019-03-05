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
})({"collision/main.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var env = {
  width: window.innerWidth,
  height: window.innerHeight,
  hue: 120,
  circles: []
};

function resolveCollision(circle1, circle2) {
  function resolveV1(v1, v2, m1, m2) {
    return ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
  }

  function resolveV2(v1, v2, m1, m2) {
    return (2 * m1 * v1 + (m2 - m1) * v2) / (m1 + m2);
  }

  function fixPostion(circle1, circle2) {
    var x1 = circle1.x,
        y1 = circle1.y,
        r1 = circle1.r;
    var x2 = circle2.x,
        y2 = circle2.y,
        r2 = circle2.r;
    var disX = Math.abs(x2 - x1);
    var disY = Math.abs(y2 - y1);
    var disL = r2 + r1;
    var angle = Math.atan2(disY, disX);

    if (x1 < x2) {
      circle1.x = circle2.x - Math.cos(angle) * disL;
    } else {
      circle2.x = circle1.x - Math.cos(angle) * disL;
    }

    if (y1 < y2) {
      circle1.y = circle2.y - Math.sin(angle) * disL;
    } else {
      circle2.y = circle1.y - Math.sin(angle) * disL;
    }
  }

  var m1 = circle1.m,
      vx1 = circle1.vx,
      vy1 = circle1.vy;
  var m2 = circle2.m,
      vx2 = circle2.vx,
      vy2 = circle2.vy;
  circle1.vx = resolveV1(vx1, vx2, m1, m2);
  circle2.vx = resolveV2(vx1, vx2, m1, m2);
  circle1.vy = resolveV1(vy1, vy2, m1, m2);
  circle2.vy = resolveV2(vy1, vy2, m1, m2);
  fixPostion(circle1, circle2);
}

function predicateCollision(circle1, circle2) {
  var x1 = circle1.x,
      y1 = circle1.y,
      r1 = circle1.r;
  var x2 = circle2.x,
      y2 = circle2.y,
      r2 = circle2.r;
  var dis = distance(x1, y1, x2, y2);
  return dis <= r1 + r2;
}

function random(min, max) {
  return Math.floor((max - min) * Math.random() + min);
}

function distance(x1, y1, x2, y2) {
  var disX = x1 - x2;
  var disY = y1 - y2;
  return Math.sqrt(Math.pow(disX, 2) + Math.pow(disY, 2));
}

function deg(o) {
  return Math.PI * o / 180;
}

var Circle =
/*#__PURE__*/
function () {
  function Circle(_ref) {
    var x = _ref.x,
        y = _ref.y;

    _classCallCheck(this, Circle);

    this.x = x;
    this.y = y;
    this.vx = random(1, 5);
    this.vy = random(1, 5);
    this.r = 10;
    this.m = 1;
  }

  _createClass(Circle, [{
    key: "update",
    value: function update() {
      var _this = this;

      this.x += this.vx;
      this.y += this.vy;
      env.circles.forEach(function (circle) {
        if (_this === circle) {
          return;
        }

        if (predicateCollision(_this, circle)) {
          resolveCollision(_this, circle);
        }
      });

      if (this.x - this.r < 0 || this.x + this.r > env.width) {
        this.vx = -this.vx;

        if (this.x < this.r) {
          this.x = this.r;
        } else {
          this.x = env.width - this.r;
        }
      }

      if (this.y - this.r < 0 || this.y + this.r > env.height) {
        this.vy = -this.vy;

        if (this.y < this.r) {
          this.y = this.r;
        } else {
          this.y = env.height - this.r;
        }
      }
    }
  }, {
    key: "draw",
    value: function draw() {
      this.update();
      ctx.strokeStyle = "hsl(".concat(env.hue, ",100%, 80%)");
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, deg(360));
      ctx.stroke();
    }
  }]);

  return Circle;
}();

function init() {
  canvas.width = env.width;
  canvas.height = env.height;

  var _loop = function _loop(i) {
    var x = random(0, env.width);
    var y = random(0, env.width);
    env.circles.forEach(function (circle) {
      while (predicateCollision(circle, {
        x: x,
        y: y,
        r: 10
      }) || x < 10 || y < 10 || x + 10 > env.width || y + 10 > env.height) {
        x = random(0, env.width);
        y = random(0, env.height);
      }
    });
    env.circles.push(new Circle({
      x: x,
      y: y
    }));
  };

  for (var i = 0; i < 100; i++) {
    _loop(i);
  }

  function draw() {
    env.hue += .5;
    ctx.clearRect(0, 0, env.width, env.height);
    env.circles.forEach(function (circle) {
      return circle.draw();
    });
    requestAnimationFrame(draw);
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64390" + '/');

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
},{}]},{},["C:/Program Files/nodejs/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","collision/main.js"], null)
//# sourceMappingURL=/main.9b6a51d6.map