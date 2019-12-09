(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.EventBus = factory());
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var classCallCheck = _classCallCheck;

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var createClass = _createClass;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var defineProperty = _defineProperty;

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  var arrayWithHoles = _arrayWithHoles;

  function _iterableToArrayLimit(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }

    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  var iterableToArrayLimit = _iterableToArrayLimit;

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var nonIterableRest = _nonIterableRest;

  function _slicedToArray(arr, i) {
    return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || nonIterableRest();
  }

  var slicedToArray = _slicedToArray;

  var isArray = function isArray(some) {
    return Object.prototype.toString.call(some) == '[object Array]';
  };

  var isString = function isString(some) {
    return Object.prototype.toString.call(some) == '[object String]';
  };

  function parseEvent(event) {
    event = event.split('.');
    return {
      name: event[0],
      namespaceList: event.slice(1).sort()
    };
  }

  function getNamespaceMatcher(namespaceList) {
    return new RegExp("(^|\\.)" + namespaceList.join("\\.(?:.*\\.|)") + "(\\.|$)");
  }

  function normalizeEvents(events) {
    if (!isArray(events)) {
      events = [isString(isString) ? events : String(events)];
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = events.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _step$value = slicedToArray(_step.value, 2),
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
      classCallCheck(this, EventBus);

      defineProperty(this, "entries", new Map());
    }

    createClass(EventBus, [{
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
        if (!events) return;
        events = normalizeEvents(events);
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = events[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var event = _step2.value;

            if (event.name) {
              var entry = findEntryOrCreate(this.entries, event.name);
              entry.addCallback(event.namespaceList, callback, once);
            }
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
        }

        if (!events) {
          return this.entries.clear();
        }

        events = normalizeEvents(events);
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = events[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var event = _step3.value;

            if (event.name) {
              var entry = findEntry(this.entries, event.name);

              if (entry) {
                entry.removeCallback(event.namespaceList, callback);
              }
            } else if (event.namespaceList) {
              var _iteratorNormalCompletion4 = true;
              var _didIteratorError4 = false;
              var _iteratorError4 = undefined;

              try {
                for (var _iterator4 = this.entries[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                  var _step4$value = slicedToArray(_step4.value, 2),
                      _entry = _step4$value[1];

                  _entry.removeCallback(event.namespaceList, callback);
                }
              } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
                    _iterator4["return"]();
                  }
                } finally {
                  if (_didIteratorError4) {
                    throw _iteratorError4;
                  }
                }
              }
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
        if (!event) return;
        event = parseEvent(event);
        if (!event.name) return;
        var entry = findEntry(this.entries, event.name);

        if (entry) {
          for (var _len = arguments.length, data = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            data[_key - 1] = arguments[_key];
          }

          entry.fire.apply(entry, [event.namespaceList].concat(data));
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
      classCallCheck(this, EventEntry);

      defineProperty(this, "_listeners", void 0);

      defineProperty(this, "_name", void 0);

      this._name = name;
    }

    createClass(EventEntry, [{
      key: "addCallback",
      value: function addCallback(namespaceList, callback) {
        var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        // use `unshift` instead of `push`
        // so that callbacks can be fired in the reverse order
        // `once-only` callback can be easily removed by `splice`
        this.listeners.unshift(new EventListener(callback, namespaceList.join('.'), once));
      }
    }, {
      key: "removeCallback",
      value: function removeCallback(namespaceList, callback) {
        var matcher = namespaceList.length && getNamespaceMatcher(namespaceList);

        for (var i = this.listeners.length - 1; i >= 0; i--) {
          if (!matcher || matcher.test(this.listeners[i].namespaces)) {
            if (!callback || this.listeners[i].callback === callback) {
              this.listeners.splice(i, 1);
            }
          }
        }
      }
    }, {
      key: "fire",
      value: function fire(namespaceList) {
        var matcher = namespaceList.length && getNamespaceMatcher(namespaceList);

        for (var _len2 = arguments.length, data = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          data[_key2 - 1] = arguments[_key2];
        }

        for (var i = this.listeners.length - 1; i >= 0; i--) {
          if (!matcher || matcher.test(this.listeners[i].namespaces)) {
            var _this$listeners$i;

            (_this$listeners$i = this.listeners[i]).callback.apply(_this$listeners$i, data);

            if (this.listeners[i].once) {
              this.listeners.splice(i, 1);
            }
          }
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
      classCallCheck(this, EventListener);

      defineProperty(this, "_callback", void 0);

      defineProperty(this, "_once", void 0);

      defineProperty(this, "_namespaces", void 0);

      this._callback = _callback;
      this._once = _once;
      this._namespaces = _namespaces;
    }

    createClass(EventListener, [{
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

  return EventBus;

})));
