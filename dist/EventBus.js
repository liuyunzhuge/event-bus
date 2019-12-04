var _Object$defineProperty = require("@babel/runtime-corejs3/core-js/object/define-property");

var _globalThis = require("@babel/runtime-corejs3/core-js/global-this");

var _sortInstanceProperty2 = require("@babel/runtime-corejs3/core-js/instance/sort");

var _sliceInstanceProperty2 = require("@babel/runtime-corejs3/core-js/instance/slice");

var _entriesInstanceProperty2 = require("@babel/runtime-corejs3/core-js/instance/entries");

var _mapInstanceProperty = require("@babel/runtime-corejs3/core-js/instance/map");

var _concatInstanceProperty2 = require("@babel/runtime-corejs3/core-js/instance/concat");

var _spliceInstanceProperty2 = require("@babel/runtime-corejs3/core-js/instance/splice");

var _forEachInstanceProperty2 = require("@babel/runtime-corejs3/core-js/instance/for-each");

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "@babel/runtime-corejs3/core-js/instance/for-each", "@babel/runtime-corejs3/core-js/instance/splice", "@babel/runtime-corejs3/core-js/instance/concat", "@babel/runtime-corejs3/core-js/map", "@babel/runtime-corejs3/core-js/instance/entries", "@babel/runtime-corejs3/core-js/get-iterator", "@babel/runtime-corejs3/core-js/instance/slice", "@babel/runtime-corejs3/core-js/instance/sort"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("@babel/runtime-corejs3/core-js/instance/for-each"), require("@babel/runtime-corejs3/core-js/instance/splice"), require("@babel/runtime-corejs3/core-js/instance/concat"), require("@babel/runtime-corejs3/core-js/map"), require("@babel/runtime-corejs3/core-js/instance/entries"), require("@babel/runtime-corejs3/core-js/get-iterator"), require("@babel/runtime-corejs3/core-js/instance/slice"), require("@babel/runtime-corejs3/core-js/instance/sort"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, _forEachInstanceProperty2(global), _spliceInstanceProperty2(global), _concatInstanceProperty2(global), _mapInstanceProperty(global), _entriesInstanceProperty2(global), global.getIterator, _sliceInstanceProperty2(global), _sortInstanceProperty2(global));
    global.EventBus = mod.exports;
  }
})(typeof _globalThis !== "undefined" ? _globalThis : typeof self !== "undefined" ? self : this, function (_exports, _forEach, _splice, _concat, _map, _entries, _getIterator2, _slice, _sort) {
  "use strict";

  _Object$defineProperty(_exports, "__esModule", {
    value: true
  });

  _exports["default"] = void 0;
  _forEach = babelHelpers.interopRequireDefault(_forEach);
  _splice = babelHelpers.interopRequireDefault(_splice);
  _concat = babelHelpers.interopRequireDefault(_concat);
  _map = babelHelpers.interopRequireDefault(_map);
  _entries = babelHelpers.interopRequireDefault(_entries);
  _getIterator2 = babelHelpers.interopRequireDefault(_getIterator2);
  _slice = babelHelpers.interopRequireDefault(_slice);
  _sort = babelHelpers.interopRequireDefault(_sort);

  var isArray = function isArray(some) {
    return Object.prototype.toString.call(some) == '[object Array]';
  };

  function parseEvent(event) {
    var _context;

    event = event.split('.');
    return {
      name: event[0],
      namespaceList: (0, _sort["default"])(_context = (0, _slice["default"])(event).call(event, 1)).call(_context)
    };
  }

  function getNamespaceMatcher(namespaceList) {
    return new RegExp("(^|\\.)" + namespaceList.join("\\.(?:.*\\.|)") + "(\\.|$)");
  }

  function normalizeEvents(events) {
    if (!isArray(events)) {
      events = [events];
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = (0, _getIterator2["default"])((0, _entries["default"])(events).call(events)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _step$value = babelHelpers.slicedToArray(_step.value, 2),
            i = _step$value[0],
            event = _step$value[1];

        events[i] = parseEvent(event);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return events;
  }

  function findEntryOrCreate(entries, name) {
    var target = null;

    if (entries.has(name)) {
      target = entries.get(name);
    } else {
      target = new EventEntry(name);
      entries.set(name, target);
    }

    return target;
  }

  function findEntry(entries, name) {
    if (entries.has(name)) {
      return entries.get(name);
    }

    return null;
  }

  var EventBus =
  /*#__PURE__*/
  function () {
    function EventBus() {
      babelHelpers.classCallCheck(this, EventBus);
      babelHelpers.defineProperty(this, "entries", new _map["default"]());
    }

    babelHelpers.createClass(EventBus, [{
      key: "on",

      /**
       * @param {String|Array} events
       * @param {Function} callback
       * @return {EventBus}
       * 
       * register events and its callbacks
       */
      value: function on(events, callback) {
        var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        events = normalizeEvents(events);
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = (0, _getIterator2["default"])(events), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var event = _step2.value;
            var entry = findEntryOrCreate((0, _entries["default"])(this), event.name);
            entry.addCallback(event.namespaceList, callback, once);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        return this;
      }
      /**
       * @param {String|Array} events
       * @param {Function} callback
       * @return {EventBus}
       * 
       * register events and its callbacks just once
       */

    }, {
      key: "once",
      value: function once(events, callback) {
        this.on(events, callback, true);
      }
      /**
       * @param {String|Array} events
       * @param {Function} callback
       * @return {EventBus}
       * 
       * remove events and its callbacks
       */

    }, {
      key: "off",
      value: function off() {
        var events, callback;

        if (arguments.length === 1) {
          events = arguments.length <= 0 ? undefined : arguments[0];
        } else if (arguments.length == 2) {
          events = arguments.length <= 0 ? undefined : arguments[0];
          callback = arguments.length <= 1 ? undefined : arguments[1];
        } else {
          return (0, _entries["default"])(this).clear();
        }

        events = normalizeEvents(events);
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = (0, _getIterator2["default"])(events), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var event = _step3.value;
            var entry = findEntry((0, _entries["default"])(this), event.name);

            if (entry) {
              entry.removeCallback(event.namespaceList, callback);
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
              _iterator3["return"]();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        return this;
      }
      /**
       * @param {String} event 
       * 
       * dispatch event
       */

    }, {
      key: "trigger",
      value: function trigger(event) {
        event = parseEvent(event);
        var entry = findEntry((0, _entries["default"])(this), event.name);

        if (entry) {
          var _context2;

          for (var _len = arguments.length, data = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            data[_key - 1] = arguments[_key];
          }

          entry.fire.apply(entry, (0, _concat["default"])(_context2 = [event.namespaceList]).call(_context2, data));
        }

        return this;
      }
    }]);
    return EventBus;
  }();

  var EventEntry =
  /*#__PURE__*/
  function () {
    function EventEntry(name) {
      babelHelpers.classCallCheck(this, EventEntry);
      babelHelpers.defineProperty(this, "_listeners", void 0);
      babelHelpers.defineProperty(this, "_name", void 0);
      this._name = name;
    }

    babelHelpers.createClass(EventEntry, [{
      key: "addCallback",
      value: function addCallback(namespaceList, callback) {
        var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        this.listeners.push(new EventListener(callback, namespaceList.join('.'), once));
      }
    }, {
      key: "removeCallback",
      value: function removeCallback(namespaceList, callback) {
        var matcher = namespaceList.length && getNamespaceMatcher(namespaceList);

        for (var i = this.listeners.length - 1; i >= 0; i--) {
          if (!matcher || matcher.test(this.listeners[i].namespaces)) {
            if (!callback || this.listeners[i].callback === callback) {
              var _context3;

              (0, _splice["default"])(_context3 = this.listeners).call(_context3, i, 1);
            }
          }
        }
      }
    }, {
      key: "fire",
      value: function fire(namespaceList) {
        var _context4;

        for (var _len2 = arguments.length, data = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          data[_key2 - 1] = arguments[_key2];
        }

        var toBeRemoved = [];
        var matcher = namespaceList.length && getNamespaceMatcher(namespaceList);
        (0, _forEach["default"])(_context4 = this.listeners).call(_context4, function (listener, index) {
          if (!matcher || matcher.test(listener.namespaces)) {
            listener.callback.apply(listener, data);

            if (listener.once) {
              toBeRemoved.push(index);
            }
          }
        });
        if (!toBeRemoved.length) return;
        var hasRemoved = 0;

        for (var _i = 0, _toBeRemoved = toBeRemoved; _i < _toBeRemoved.length; _i++) {
          var _context5;

          var index = _toBeRemoved[_i];
          (0, _splice["default"])(_context5 = this.listeners).call(_context5, index - hasRemoved, 1);
          hasRemoved += 1;
        }
      }
    }, {
      key: "listeners",
      get: function get() {
        if (this._listeners === undefined) {
          this._listeners = [];
        }

        return this._listeners;
      }
    }, {
      key: "name",
      get: function get() {
        return this._name;
      }
    }]);
    return EventEntry;
  }();

  var EventListener =
  /*#__PURE__*/
  function () {
    function EventListener(_callback, _namespaces, _once) {
      babelHelpers.classCallCheck(this, EventListener);
      babelHelpers.defineProperty(this, "_callback", void 0);
      babelHelpers.defineProperty(this, "_once", void 0);
      babelHelpers.defineProperty(this, "_namespaces", void 0);
      this._callback = _callback;
      this._once = _once;
      this._namespaces = _namespaces;
    }

    babelHelpers.createClass(EventListener, [{
      key: "callback",
      get: function get() {
        return this._callback;
      }
    }, {
      key: "once",
      get: function get() {
        return this._once;
      }
    }, {
      key: "namespaces",
      get: function get() {
        return this._namespaces;
      }
    }]);
    return EventListener;
  }();

  var _default = EventBus;
  _exports["default"] = _default;
});