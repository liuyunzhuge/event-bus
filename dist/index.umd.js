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

  var isString = function isString(some) {
    return Object.prototype.toString.call(some) == '[object String]';
  };

  function parseEvent(event) {
    var events = event.split('.');
    return {
      name: event[0],
      namespaceList: events.slice(1).sort()
    };
  }

  function getNamespaceMatcher(namespaceList) {
    return new RegExp("(^|\\.)" + namespaceList.join("\\.(?:.*\\.|)") + "(\\.|$)");
  }

  function normalizeEvents(events) {
    var _events;

    var normalized = [];

    if (typeof events === 'string') {
      _events = [isString(isString) ? events : String(events)];
    } else {
      _events = events;
    }

    _events.forEach(function (event) {
      normalized.push(parseEvent(event));
    });

    return normalized;
  }

  function findEntryOrCreate(entries, name) {
    if (!(name in entries)) {
      entries[name] = new EventEntry(name);
    }

    return entries[name];
  }

  var EventBus = /*#__PURE__*/function () {
    function EventBus() {
      classCallCheck(this, EventBus);

      defineProperty(this, "entries", {});
    }

    createClass(EventBus, [{
      key: "on",
      value: function on(events, callback) {
        var _this = this;

        var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        if (!events) return null;
        var normalizedEvents = normalizeEvents(events);
        normalizedEvents.forEach(function (event) {
          if (event.name) {
            var entry = findEntryOrCreate(_this.entries, event.name);
            entry.addCallback(event.namespaceList, callback, once);
          }
        });
        return this;
      }
    }, {
      key: "once",
      value: function once(events, callback) {
        return this.on(events, callback, true);
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
      value: function off(events, callback) {
        var _this2 = this;

        if (!events) {
          this.entries = {};
          return;
        }

        var normalizedEvents = normalizeEvents(events);
        normalizedEvents.forEach(function (event) {
          if (event.name) {
            var entry = _this2.entries[event.name];

            if (entry) {
              entry.removeCallback(event.namespaceList, callback);
            }
          } else if (event.namespaceList) {
            Object.keys(_this2.entries).forEach(function (key) {
              _this2.entries[key].removeCallback(event.namespaceList, callback);
            });
          }
        });
        return this;
      }
    }, {
      key: "trigger",
      value: function trigger(event) {
        if (!event) return;
        var parsedEvent = parseEvent(event);
        if (!parsedEvent.name) return;
        var entry = this.entries[parsedEvent.name];

        if (entry) {
          for (var _len = arguments.length, data = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            data[_key - 1] = arguments[_key];
          }

          entry.fire.apply(entry, [parsedEvent.namespaceList].concat(data));
        }

        return this;
      }
    }]);

    return EventBus;
  }();

  var EventEntry = /*#__PURE__*/function () {
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

  var EventListener = /*#__PURE__*/function () {
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
